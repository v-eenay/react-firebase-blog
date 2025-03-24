import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDatabase, ref, onValue, set, push, serverTimestamp, off } from 'firebase/database';
import { db as firestoreDb } from '../firebase/config';
import { useAuth } from './AuthContext';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface CollaborationData {
  users: {
    [uid: string]: {
      displayName: string;
      photoURL?: string;
      lastActive: string;
      cursor?: { line: number; ch: number };
    };
  };
  content: string;
  version: number;
}

interface ChatMessage {
  id: string;
  userId: string;
  displayName: string;
  message: string;
  timestamp: string;
}

interface CollaborationContextType {
  collaborators: {
    uid: string;
    displayName: string;
    photoURL?: string;
    lastActive: string;
    cursor?: { line: number; ch: number };
  }[];
  messages: ChatMessage[];
  documentContent: string;
  isCollaborating: boolean;
  shareDocument: (postId: string, userId: string) => Promise<void>;
  unshareDocument: (postId: string, userId: string) => Promise<void>;
  updateContent: (postId: string, content: string) => Promise<void>;
  sendMessage: (postId: string, message: string) => Promise<void>;
  updateCursor: (postId: string, cursor: { line: number; ch: number }) => Promise<void>;
}

const CollaborationContext = createContext<CollaborationContextType | null>(null);

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
};

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [collaborators, setCollaborators] = useState<CollaborationContextType['collaborators']>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [documentContent, setDocumentContent] = useState('');
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  const realtimeDb = getDatabase();

  useEffect(() => {
    if (!user || !currentPostId) return;

    const collaborationRef = ref(realtimeDb, `collaborations/${currentPostId}`);
    const chatRef = ref(realtimeDb, `chats/${currentPostId}`);

    const unsubscribeCollaboration = onValue(collaborationRef, (snapshot) => {
      const data = snapshot.val() as CollaborationData;
      if (data) {
        setDocumentContent(data.content);
        setCollaborators(
          Object.entries(data.users).map(([uid, userData]) => ({
            uid,
            ...userData,
          }))
        );
        setIsCollaborating(true);
      }
    });

    const unsubscribeChat = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, msg]: [string, any]) => ({
          id,
          ...msg,
        }));
        setMessages(messageList);
      }
    });

    return () => {
      off(collaborationRef);
      off(chatRef);
      setIsCollaborating(false);
      setCurrentPostId(null);
    };
  }, [user, currentPostId, realtimeDb]);

  const shareDocument = async (postId: string, userId: string) => {
    const postRef = doc(firestoreDb, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) return;

    await updateDoc(postRef, {
      collaborators: arrayUnion(userId)
    });

    const collaborationRef = ref(realtimeDb, `collaborations/${postId}`);
    const existingData = (await get(collaborationRef)).val() as CollaborationData | null;

    if (!existingData) {
      await set(collaborationRef, {
        users: {
          [user!.uid]: {
            displayName: user!.displayName || 'Anonymous',
            photoURL: user!.photoURL,
            lastActive: serverTimestamp(),
          },
        },
        content: postDoc.data().content,
        version: 1,
      });
    }

    setCurrentPostId(postId);
  };

  const unshareDocument = async (postId: string, userId: string) => {
    const postRef = doc(firestoreDb, 'posts', postId);
    await updateDoc(postRef, {
      collaborators: arrayRemove(userId)
    });
  };

  const updateContent = async (postId: string, content: string) => {
    const collaborationRef = ref(realtimeDb, `collaborations/${postId}`);
    await set(collaborationRef, {
      content,
      version: serverTimestamp(),
    });
  };

  const sendMessage = async (postId: string, message: string) => {
    if (!user) return;

    const chatRef = ref(realtimeDb, `chats/${postId}`);
    await push(chatRef, {
      userId: user.uid,
      displayName: user.displayName || 'Anonymous',
      message,
      timestamp: serverTimestamp(),
    });
  };

  const updateCursor = async (postId: string, cursor: { line: number; ch: number }) => {
    if (!user) return;

    const userRef = ref(realtimeDb, `collaborations/${postId}/users/${user.uid}`);
    await set(userRef, {
      displayName: user.displayName || 'Anonymous',
      photoURL: user.photoURL,
      lastActive: serverTimestamp(),
      cursor,
    });
  };

  return (
    <CollaborationContext.Provider
      value={{
        collaborators,
        messages,
        documentContent,
        isCollaborating,
        shareDocument,
        unshareDocument,
        updateContent,
        sendMessage,
        updateCursor,
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
}