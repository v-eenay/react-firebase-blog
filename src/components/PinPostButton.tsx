import { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { FaBookmark } from 'react-icons/fa';

interface PinPostButtonProps {
  postId: string;
  postTitle: string;
}

export default function PinPostButton({ postId, postTitle }: PinPostButtonProps) {
  const { user } = useAuth();
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (user?.pinnedPosts) {
      setIsPinned(user.pinnedPosts.includes(postId));
    }
  }, [user, postId]);

  const handlePin = async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    try {
      if (isPinned) {
        await updateDoc(userRef, {
          pinnedPosts: arrayRemove(postId)
        });
        setIsPinned(false);
      } else {
        await updateDoc(userRef, {
          pinnedPosts: arrayUnion(postId)
        });
        setIsPinned(true);
      }
    } catch (error) {
      console.error('Error updating pinned posts:', error);
    }
  };

  return (
    <button
      onClick={handlePin}
      className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
        isPinned ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-100'
      }`}
      aria-label={isPinned ? 'Unpin post' : 'Pin post'}
    >
      <FaBookmark />
      <span>{isPinned ? 'Pinned' : 'Pin'}</span>
    </button>
  );
}