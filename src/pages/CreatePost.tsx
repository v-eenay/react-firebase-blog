import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import PostEditor from '../components/PostEditor';
import PostPreview from '../components/PostPreview';
import { motion } from 'framer-motion';

interface Post {
  title: string;
  content: string;
  image?: string;
  scheduledFor?: Date;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<Post | null>(null);

  const handleSave = async (post: Post) => {
    if (!user) {
      addNotification({
        type: 'error',
        message: 'You must be logged in to create a post'
      });
      navigate('/login');
      return;
    }

    try {
      const postData = {
        ...post,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        scheduledFor: post.scheduledFor ? Timestamp.fromDate(post.scheduledFor) : null,
        status: post.scheduledFor ? 'scheduled' : 'published',
        likes: 0,
        views: 0
      };

      const docRef = await addDoc(collection(db, 'posts'), postData);

      addNotification({
        type: 'success',
        message: post.scheduledFor
          ? 'Post scheduled successfully'
          : 'Post published successfully'
      });

      navigate(`/blog/${docRef.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      addNotification({
        type: 'error',
        message: 'Failed to create post. Please try again.'
      });
    }
  };

  const handlePreview = (post: Post) => {
    setPreviewData(post);
    setShowPreview(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-serif mb-8 text-center">Create New Post</h1>
      
      <PostEditor
        onSave={handleSave}
        onPreview={handlePreview}
      />

      {showPreview && previewData && (
        <PostPreview
          title={previewData.title}
          content={previewData.content}
          image={previewData.image}
          onClose={() => setShowPreview(false)}
        />
      )}
    </motion.div>
  );
};

export default CreatePost;