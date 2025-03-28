import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNotifications } from '../contexts/NotificationContext';

interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  views: number;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledFor?: Date;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'posts' | 'drafts' | 'analytics'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const postsRef = collection(db, 'posts');
        // First get all posts for the user
        const q = query(postsRef, where('authorId', '==', user.uid));
        const postsSnapshot = await getDocs(q);
        
        const postsData = postsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
            scheduledFor: data.scheduledFor instanceof Timestamp ? data.scheduledFor.toDate() : undefined
          };
        });

        // Sort posts by createdAt in memory
        postsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Separate posts and drafts
        const publishedPosts = postsData.filter(post => post.status === 'published');
        const draftPosts = postsData.filter(post => post.status === 'draft');
        
        setPosts(publishedPosts);
        setDrafts(draftPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        addNotification({
          type: 'error',
          message: 'Failed to fetch posts. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, addNotification]);

  const handlePostAction = async (postId: string, action: 'edit' | 'delete' | 'publish') => {
    try {
      const postRef = doc(db, 'posts', postId);
      
      switch (action) {
        case 'edit':
          navigate(`/edit-post/${postId}`);
          break;
          
        case 'delete':
          await deleteDoc(postRef);
          setPosts(posts.filter(post => post.id !== postId));
          setDrafts(drafts.filter(draft => draft.id !== postId));
          addNotification({
            type: 'success',
            message: 'Post deleted successfully'
          });
          break;
          
        case 'publish':
          await updateDoc(postRef, {
            status: 'published',
            updatedAt: new Date()
          });
          const updatedDrafts = drafts.filter(draft => draft.id !== postId);
          setDrafts(updatedDrafts);
          // Refresh posts to include the newly published post
          const postToPublish = drafts.find(draft => draft.id === postId);
          if (postToPublish) {
            setPosts([{ ...postToPublish, status: 'published' }, ...posts]);
          }
          addNotification({
            type: 'success',
            message: 'Post published successfully'
          });
          break;
      }
    } catch (error) {
      console.error('Error:', error);
      addNotification({
        type: 'error',
        message: `Failed to ${action} post. Please try again.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-paper)] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold font-serif text-[var(--color-ink)] mb-8">My Dashboard</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`btn-retro ${activeTab === 'posts' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : ''}`}
          >
            My Posts
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`btn-retro ${activeTab === 'drafts' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : ''}`}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`btn-retro ${activeTab === 'analytics' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : ''}`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="vintage-paper p-6 rounded-lg shadow-[8px_8px_0_var(--color-ink)]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">Published Posts</h2>
              <button
                onClick={() => navigate('/create-post')}
                className="btn-retro bg-[var(--color-ink)] text-[var(--color-paper)]"
              >
                New Post
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--color-ink)]">
                    <th className="text-left p-4 font-serif">Title</th>
                    <th className="text-left p-4 font-serif">Status</th>
                    <th className="text-left p-4 font-serif">Views</th>
                    <th className="text-left p-4 font-serif">Likes</th>
                    <th className="text-left p-4 font-serif">Comments</th>
                    <th className="text-left p-4 font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-[var(--color-ink)]/20">
                      <td className="p-4 font-serif">{post.title}</td>
                      <td className="p-4 font-serif">{post.status}</td>
                      <td className="p-4 font-serif">{post.views}</td>
                      <td className="p-4 font-serif">{post.likes}</td>
                      <td className="p-4 font-serif">{post.comments}</td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => handlePostAction(post.id, 'edit')}
                          className="btn-retro-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handlePostAction(post.id, 'delete')}
                          className="btn-retro-sm bg-red-600 text-white"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="vintage-paper p-6 rounded-lg shadow-[8px_8px_0_var(--color-ink)]">
            <h2 className="text-2xl font-serif font-bold mb-6">Saved Drafts</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {drafts.map((draft) => (
                <div key={draft.id} className="border-2 border-[var(--color-ink)] p-4 rounded">
                  <h3 className="text-xl font-serif font-bold mb-2">{draft.title}</h3>
                  <p className="text-sm text-[var(--color-accent)] mb-4">
                    Last edited: {new Date(draft.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePostAction(draft.id, 'edit')}
                      className="btn-retro-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handlePostAction(draft.id, 'publish')}
                      className="btn-retro-sm bg-[var(--color-ink)] text-[var(--color-paper)]"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="vintage-paper p-6 rounded-lg shadow-[8px_8px_0_var(--color-ink)]">
            <h2 className="text-2xl font-serif font-bold mb-6">Post Analytics</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div key={post.id} className="border-2 border-[var(--color-ink)] p-4 rounded">
                  <h3 className="text-xl font-serif font-bold mb-2">{post.title}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-serif">Views</span>
                      <span className="font-bold">{post.views}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-serif">Likes</span>
                      <span className="font-bold">{post.likes}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-serif">Comments</span>
                      <span className="font-bold">{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}