import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'banned';
}

interface Post {
  id: string;
  title: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // TODO: Implement Firebase listeners for users and posts
    // This will be implemented after updating the Firebase configuration
  }, []);

  const handleUserAction = async (userId: string, action: 'ban' | 'unban' | 'delete') => {
    try {
      // TODO: Implement user management actions
      console.log(`${action} user ${userId}`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePostAction = async (postId: string, action: 'approve' | 'reject') => {
    try {
      // TODO: Implement post approval actions
      console.log(`${action} post ${postId}`);
    } catch (error) {
      console.error('Error:', error);
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
        <h1 className="text-4xl font-bold font-serif text-[var(--color-ink)] mb-8">Admin Dashboard</h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`btn-retro ${activeTab === 'users' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : ''}`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`btn-retro ${activeTab === 'posts' ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : ''}`}
          >
            Post Approval
          </button>
        </div>

        {activeTab === 'users' ? (
          <div className="vintage-paper p-6 rounded-lg shadow-[8px_8px_0_var(--color-ink)]">
            <h2 className="text-2xl font-serif font-bold mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--color-ink)]">
                    <th className="text-left p-4 font-serif">Name</th>
                    <th className="text-left p-4 font-serif">Email</th>
                    <th className="text-left p-4 font-serif">Role</th>
                    <th className="text-left p-4 font-serif">Status</th>
                    <th className="text-left p-4 font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-[var(--color-ink)]/20">
                      <td className="p-4 font-serif">{user.name}</td>
                      <td className="p-4 font-serif">{user.email}</td>
                      <td className="p-4 font-serif">{user.role}</td>
                      <td className="p-4 font-serif">{user.status}</td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => handleUserAction(user.id, user.status === 'banned' ? 'unban' : 'ban')}
                          className="btn-retro-sm"
                        >
                          {user.status === 'banned' ? 'Unban' : 'Ban'}
                        </button>
                        <button
                          onClick={() => handleUserAction(user.id, 'delete')}
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
        ) : (
          <div className="vintage-paper p-6 rounded-lg shadow-[8px_8px_0_var(--color-ink)]">
            <h2 className="text-2xl font-serif font-bold mb-4">Post Approval</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[var(--color-ink)]">
                    <th className="text-left p-4 font-serif">Title</th>
                    <th className="text-left p-4 font-serif">Author</th>
                    <th className="text-left p-4 font-serif">Status</th>
                    <th className="text-left p-4 font-serif">Date</th>
                    <th className="text-left p-4 font-serif">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-[var(--color-ink)]/20">
                      <td className="p-4 font-serif">{post.title}</td>
                      <td className="p-4 font-serif">{post.author}</td>
                      <td className="p-4 font-serif">{post.status}</td>
                      <td className="p-4 font-serif">{post.createdAt}</td>
                      <td className="p-4 space-x-2">
                        {post.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handlePostAction(post.id, 'approve')}
                              className="btn-retro-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handlePostAction(post.id, 'reject')}
                              className="btn-retro-sm bg-red-600 text-white"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}