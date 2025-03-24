import { useState, useEffect } from 'react';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { useNotifications } from '../contexts/NotificationContext';
import { FaThumbsUp, FaHeart, FaLaugh } from 'react-icons/fa';

interface ReactionButtonsProps {
  postId: string;
  authorId: string;
  postTitle: string;
  reactions?: {
    [key: string]: {
      type: 'thumbsUp' | 'heart' | 'laugh';
      userId: string;
      createdAt: string;
    };
  };
}

interface ReactionCounts {
  thumbsUp: number;
  heart: number;
  laugh: number;
}

export default function ReactionButtons({ postId, authorId, postTitle, reactions = {} }: ReactionButtonsProps) {
  const { user } = useAuth();
  const { addPoints } = useGamification();
  const { addNotification } = useNotifications();
  const [counts, setCounts] = useState<ReactionCounts>({ thumbsUp: 0, heart: 0, laugh: 0 });
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newCounts = { thumbsUp: 0, heart: 0, laugh: 0 };
    const userReacted = new Set<string>();

    Object.values(reactions).forEach((reaction) => {
      newCounts[reaction.type]++;
      if (reaction.userId === user?.uid) {
        userReacted.add(reaction.type);
      }
    });

    setCounts(newCounts);
    setUserReactions(userReacted);
  }, [reactions, user]);

  const handleReaction = async (type: 'thumbsUp' | 'heart' | 'laugh') => {
    if (!user) return;

    const reactionId = `${user.uid}_${type}`;
    const postRef = doc(db, 'posts', postId);

    try {
      await runTransaction(db, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) return;

        const currentReactions = postDoc.data().reactions || {};
        const hasReacted = reactionId in currentReactions;

        if (hasReacted) {
          const { [reactionId]: _, ...remainingReactions } = currentReactions;
          transaction.update(postRef, { reactions: remainingReactions });
          setUserReactions(prev => {
            const next = new Set(prev);
            next.delete(type);
            return next;
          });
        } else {
          const newReaction = {
            type,
            userId: user.uid,
            createdAt: new Date().toISOString()
          };
          transaction.update(postRef, {
            reactions: { ...currentReactions, [reactionId]: newReaction }
          });
          setUserReactions(prev => new Set([...prev, type]));

          // Add points for reacting
          await addPoints(5);

          // Notify post author if it's not their own post
          if (authorId !== user.uid) {
            await addNotification({
              type: 'reaction',
              message: `${user.email} reacted to your post: ${postTitle}`,
              targetId: postId,
              sourceUserId: user.uid
            });
          }
        }
      });
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };

  const getButtonClass = (type: string) => {
    const baseClass = 'flex items-center gap-1 px-3 py-1 rounded-full transition-colors';
    return userReactions.has(type)
      ? `${baseClass} bg-indigo-100 text-indigo-600`
      : `${baseClass} hover:bg-gray-100`;
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleReaction('thumbsUp')}
        className={getButtonClass('thumbsUp')}
        aria-label="Thumbs up"
      >
        <FaThumbsUp />
        <span>{counts.thumbsUp}</span>
      </button>
      <button
        onClick={() => handleReaction('heart')}
        className={getButtonClass('heart')}
        aria-label="Heart"
      >
        <FaHeart />
        <span>{counts.heart}</span>
      </button>
      <button
        onClick={() => handleReaction('laugh')}
        className={getButtonClass('laugh')}
        aria-label="Laugh"
      >
        <FaLaugh />
        <span>{counts.laugh}</span>
      </button>
    </div>
  );
}