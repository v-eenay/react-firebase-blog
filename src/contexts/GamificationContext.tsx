import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, updateDoc, setDoc, collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

interface GamificationData {
  points: number;
  level: number;
  badges: string[];
  completedChallenges: string[];
  currentChallenges: {
    id: string;
    progress: number;
    startedAt: string;
  }[];
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'post' | 'comment' | 'like' | 'share';
  target: number;
  duration: number; // in days
  points: number;
  badge?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'posts' | 'comments' | 'likes' | 'shares' | 'points' | 'level';
    count: number;
  };
}

interface GamificationContextType {
  userGamification: GamificationData | null;
  leaderboard: { userId: string; displayName: string; points: number }[];
  availableChallenges: Challenge[];
  badges: Badge[];
  addPoints: (points: number) => Promise<void>;
  checkBadges: () => Promise<void>;
  startChallenge: (challengeId: string) => Promise<void>;
  updateChallengeProgress: (type: Challenge['type']) => Promise<void>;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const POINTS_CONFIG = {
  post: 50,
  comment: 10,
  like: 5,
  share: 15
};

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000
];

const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first-post',
    name: 'First Post',
    description: 'Published your first blog post',
    icon: '📝',
    requirement: { type: 'posts', count: 1 }
  },
  {
    id: 'popular-writer',
    name: 'Popular Writer',
    description: 'Received 1000 likes on your posts',
    icon: '⭐',
    requirement: { type: 'likes', count: 1000 }
  },
  {
    id: 'active-commenter',
    name: 'Active Commenter',
    description: 'Posted 50 comments',
    icon: '💭',
    requirement: { type: 'comments', count: 50 }
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Shared 20 posts',
    icon: '🦋',
    requirement: { type: 'shares', count: 20 }
  },
  {
    id: 'point-master',
    name: 'Point Master',
    description: 'Earned 5000 points',
    icon: '🏆',
    requirement: { type: 'points', count: 5000 }
  }
];

const AVAILABLE_CHALLENGES: Challenge[] = [
  {
    id: 'weekly-writer',
    title: 'Weekly Writer',
    description: 'Write 5 posts in 7 days',
    type: 'post',
    target: 5,
    duration: 7,
    points: 500,
    badge: 'prolific-writer'
  },
  {
    id: 'comment-champion',
    title: 'Comment Champion',
    description: 'Comment on 20 posts',
    type: 'comment',
    target: 20,
    duration: 7,
    points: 300
  },
  {
    id: 'like-enthusiast',
    title: 'Like Enthusiast',
    description: 'Like 50 posts',
    type: 'like',
    target: 50,
    duration: 7,
    points: 200
  }
];

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [userGamification, setUserGamification] = useState<GamificationData | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ userId: string; displayName: string; points: number }[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchGamificationData = async () => {
      const userRef = doc(db, 'gamification', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserGamification(docSnap.data() as GamificationData);
      } else {
        const initialData: GamificationData = {
          points: 0,
          level: 1,
          badges: [],
          completedChallenges: [],
          currentChallenges: []
        };
        await setDoc(userRef, initialData);
        setUserGamification(initialData);
      }
    };

    const fetchLeaderboard = async () => {
      const q = query(collection(db, 'gamification'), orderBy('points', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const leaderboardData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const userRef = doc(db, 'users', doc.id);
          const userData = await getDoc(userRef);
          return {
            userId: doc.id,
            displayName: userData.data()?.displayName || 'Anonymous',
            points: doc.data().points
          };
        })
      );
      setLeaderboard(leaderboardData);
    };

    fetchGamificationData();
    fetchLeaderboard();
  }, [user]);

  const calculateLevel = (points: number) => {
    return LEVEL_THRESHOLDS.findIndex((threshold, index) =>
      points >= threshold && (!LEVEL_THRESHOLDS[index + 1] || points < LEVEL_THRESHOLDS[index + 1])
    ) + 1;
  };

  const addPoints = async (points: number) => {
    if (!user || !userGamification) return;

    const newPoints = userGamification.points + points;
    const newLevel = calculateLevel(newPoints);
    const userRef = doc(db, 'gamification', user.uid);

    const updatedData = {
      points: newPoints,
      level: newLevel
    };

    await updateDoc(userRef, updatedData);
    setUserGamification({ ...userGamification, ...updatedData });

    if (newLevel > userGamification.level) {
      addNotification({
        type: 'level-up',
        message: `Congratulations! You've reached level ${newLevel}!`,
        targetId: user.uid,
        sourceUserId: user.uid
      });
    }
  };

  const checkBadges = async () => {
    if (!user || !userGamification) return;

    const userRef = doc(db, 'gamification', user.uid);
    const newBadges = [];

    for (const badge of AVAILABLE_BADGES) {
      if (!userGamification.badges.includes(badge.id)) {
        const meetsRequirement = await checkBadgeRequirement(badge);
        if (meetsRequirement) {
          newBadges.push(badge.id);
          addNotification({
            type: 'badge',
            message: `You've earned the ${badge.name} badge!`,
            targetId: user.uid,
            sourceUserId: user.uid
          });
        }
      }
    }

    if (newBadges.length > 0) {
      const updatedBadges = [...userGamification.badges, ...newBadges];
      await updateDoc(userRef, { badges: updatedBadges });
      setUserGamification({ ...userGamification, badges: updatedBadges });
    }
  };

  const checkBadgeRequirement = async (badge: Badge) => {
    if (!user) return false;

    switch (badge.requirement.type) {
      case 'points':
        return userGamification?.points >= badge.requirement.count;
      case 'level':
        return userGamification?.level >= badge.requirement.count;
      case 'posts':
        const postsQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid));
        const postsSnap = await getDocs(postsQuery);
        return postsSnap.size >= badge.requirement.count;
      default:
        return false;
    }
  };

  const startChallenge = async (challengeId: string) => {
    if (!user || !userGamification) return;

    const challenge = AVAILABLE_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return;

    const userRef = doc(db, 'gamification', user.uid);
    const newChallenge = {
      id: challengeId,
      progress: 0,
      startedAt: new Date().toISOString()
    };

    const updatedChallenges = [...userGamification.currentChallenges, newChallenge];
    await updateDoc(userRef, { currentChallenges: updatedChallenges });
    setUserGamification({ ...userGamification, currentChallenges: updatedChallenges });
  };

  const updateChallengeProgress = async (type: Challenge['type']) => {
    if (!user || !userGamification) return;

    const userRef = doc(db, 'gamification', user.uid);
    const updatedChallenges = userGamification.currentChallenges.map(challenge => {
      const challengeConfig = AVAILABLE_CHALLENGES.find(c => c.id === challenge.id);
      if (challengeConfig?.type === type) {
        const progress = challenge.progress + 1;
        if (progress >= challengeConfig.target) {
          addPoints(challengeConfig.points);
          addNotification({
            type: 'challenge-complete',
            message: `You've completed the ${challengeConfig.title} challenge!`,
            targetId: user.uid,
            sourceUserId: user.uid
          });
          return null;
        }
        return { ...challenge, progress };
      }
      return challenge;
    }).filter(Boolean) as GamificationData['currentChallenges'];

    await updateDoc(userRef, { currentChallenges: updatedChallenges });
    setUserGamification({ ...userGamification, currentChallenges: updatedChallenges });
  };

  return (
    <GamificationContext.Provider
      value={{
        userGamification,
        leaderboard,
        availableChallenges: AVAILABLE_CHALLENGES,
        badges: AVAILABLE_BADGES,
        addPoints,
        checkBadges,
        startChallenge,
        updateChallengeProgress
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};