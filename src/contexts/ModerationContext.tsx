import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface ModerationContextType {
  reportContent: (contentType: 'post' | 'comment', contentId: string, reason: string) => Promise<void>;
  isContentFlagged: (contentId: string) => boolean;
  checkForSpam: (text: string) => boolean;
  flaggedContent: FlaggedContent[];
}

interface FlaggedContent {
  id: string;
  contentType: 'post' | 'comment';
  reason: string;
  reportedBy: string;
  timestamp: string;
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined);

// Simple spam detection using common spam keywords
const SPAM_KEYWORDS = [
  'buy now',
  'click here',
  'earn money',
  'free offer',
  'limited time',
  'make money',
  'order now',
  'special offer',
  'viagra',
  'xxx',
];

export function ModerationProvider({ children }: { children: ReactNode }) {
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([]);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user) return;

    // Listen for flagged content updates
    const q = query(collection(db, 'flagged_content'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const flagged = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FlaggedContent[];
      setFlaggedContent(flagged);
    });

    return () => unsubscribe();
  }, [user]);

  const reportContent = async (contentType: 'post' | 'comment', contentId: string, reason: string) => {
    if (!user) return;

    try {
      // Add to flagged content collection
      await addDoc(collection(db, 'flagged_content'), {
        contentType,
        contentId,
        reason,
        reportedBy: user.uid,
        timestamp: new Date().toISOString()
      });

      // Update the content document to mark it as flagged
      const contentRef = doc(db, contentType === 'post' ? 'posts' : 'comments', contentId);
      await updateDoc(contentRef, {
        flags: arrayUnion({
          userId: user.uid,
          reason,
          timestamp: new Date().toISOString()
        })
      });

      // Notify admins
      const adminsQuery = query(collection(db, 'users'), where('role', '==', 'admin'));
      const adminSnapshot = await getDocs(adminsQuery);
      
      adminSnapshot.forEach(async (adminDoc) => {
        await addNotification({
          type: 'flag',
          message: `Content reported: ${contentType} (ID: ${contentId}) - Reason: ${reason}`,
          targetId: contentId,
          sourceUserId: user.uid,
          recipientId: adminDoc.id
        });
      });
    } catch (error) {
      console.error('Error reporting content:', error);
    }
  };

  const isContentFlagged = (contentId: string): boolean => {
    return flaggedContent.some(item => item.contentId === contentId);
  };

  const checkForSpam = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    // Check for spam keywords
    const hasSpamKeywords = SPAM_KEYWORDS.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );

    // Check for excessive capitalization (more than 70% uppercase)
    const uppercaseRatio = text.replace(/[^A-Za-z]/g, '').split('').filter(char => 
      char === char.toUpperCase()
    ).length / text.replace(/[^A-Za-z]/g, '').length;

    // Check for repeated characters (e.g., "!!!!!!")
    const hasRepeatedChars = /([!?.]){4,}/.test(text);

    // Check for excessive URLs
    const urlCount = (text.match(/https?:\/\//g) || []).length;

    return hasSpamKeywords || 
           uppercaseRatio > 0.7 || 
           hasRepeatedChars || 
           urlCount > 3;
  };

  const value = {
    reportContent,
    isContentFlagged,
    checkForSpam,
    flaggedContent
  };

  return (
    <ModerationContext.Provider value={value}>
      {children}
    </ModerationContext.Provider>
  );
}

export function useModeration() {
  const context = useContext(ModerationContext);
  if (context === undefined) {
    throw new Error('useModeration must be used within a ModerationProvider');
  }
  return context;
}