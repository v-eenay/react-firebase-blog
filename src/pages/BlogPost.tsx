import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, addDoc, runTransaction, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useGamification } from '../contexts/GamificationContext';
import { useCollaboration } from '../contexts/CollaborationContext';
import CollaborationSidebar from '../components/CollaborationSidebar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
  likes?: number;
  collaborators?: string[];
}

interface Comment {
  id: string;
  text: string;
  userId: string;
  userEmail: string;
  createdAt: string;
}

export default function BlogPost() {
  const { id } = useParams();
  const { user } = useAuth();
  const { shareDocument, unshareDocument, isCollaborating, documentContent, updateContent } = useCollaboration();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const postDoc = await getDoc(doc(db, 'posts', id!));
      if (postDoc.exists()) {
        setPost({ id: postDoc.id, ...postDoc.data() } as Post);
      }
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const q = query(
      collection(db, 'posts', id, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Comment));
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!post?.categoryId) return;
      const q = query(
        collection(db, 'posts'),
        where('categoryId', '==', post.categoryId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs
        .filter(doc => doc.id !== id)
        .slice(0, 3)
        .map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setRelatedPosts(posts);
    };
    fetchRelatedPosts();
  }, [post?.categoryId, id]);

  const { addNotification } = useNotifications();
  const { addPoints, updateChallengeProgress } = useGamification();

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !id) return;

    const commentRef = await addDoc(collection(db, 'posts', id, 'comments'), {
      text: newComment,
      userId: user.uid,
      userEmail: user.email,
      createdAt: new Date().toISOString()
    });

    // Notify the post author about the new comment
    if (post?.authorId !== user.uid) {
      await addNotification({
        type: 'comment',
        message: `${user.email} commented on your post: ${post.title}`,
        targetId: id,
        sourceUserId: user.uid
      });
    }

    setNewComment('');
    
    // Add points and update challenges for commenting
    await addPoints(POINTS_CONFIG.comment);
    await updateChallengeProgress('comment');
  };

  const handleLike = async () => {
    if (!id || !post || !user) return;
    const postRef = doc(db, 'posts', id);
    const likeRef = doc(db, 'posts', id, 'likes', user.uid);

    await runTransaction(db, async (transaction) => {
      const likeDoc = await transaction.get(likeRef);

      if (!likeDoc.exists()) {
        transaction.set(likeRef, { 
          userId: user.uid,
          createdAt: new Date().toISOString()
        });
        transaction.update(postRef, { likes: increment(1) });
        
        // Add points and update challenges for liking
        await addPoints(POINTS_CONFIG.like);
        await updateChallengeProgress('like');

        // Notify the post author about the new like
        if (post.authorId !== user.uid) {
          await addNotification({
            type: 'like',
            message: `${user.email} liked your post: ${post.title}`,
            targetId: id,
            sourceUserId: user.uid
          });
        }
      } else {
        transaction.delete(likeRef);
        transaction.update(postRef, { likes: increment(-1) });
      }
    });
  };

  if (!post) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const handleShare = async () => {
    if (!id || !collaboratorEmail.trim()) return;
    
    // Get user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', collaboratorEmail.trim()));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const collaboratorId = querySnapshot.docs[0].id;
      await shareDocument(id, collaboratorId);
      setCollaboratorEmail('');
      addNotification({
        type: 'share',
        message: `${user?.email} shared a post with you: ${post?.title}`,
        targetId: id,
        sourceUserId: user?.uid
      });
    }
  };

  useEffect(() => {
    if (isCollaborating && documentContent && id) {
      updateContent(id, documentContent);
    }
  }, [isCollaborating, documentContent, id]);

  return (
    <div className="py-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {post.image && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={post.image}
            alt={post.title}
            className="w-full h-96 object-cover mb-8 rounded-lg shadow-xl"
          />
        )}

        <motion.article
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="prose lg:prose-xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold font-serif mb-6">{post.title}</h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 rounded-full">
              {post.authorName}
            </div>
            <span className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-ink)]"
              >
                ♥ {post.likes || 0}
              </button>
              {post.authorId === user?.uid && (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                    placeholder="Collaborator's email"
                    className="input-retro text-sm"
                  />
                  <button
                    onClick={handleShare}
                    disabled={!collaboratorEmail.trim()}
                    className="btn-retro px-4 py-2 text-sm"
                  >
                    Share
                  </button>
                </div>
              )}
              {post.collaborators?.includes(user?.uid) && (
                <button
                  onClick={() => setShowCollaboration(!showCollaboration)}
                  className="btn-retro px-4 py-2 text-sm"
                >
                  {showCollaboration ? 'Hide Chat' : 'Show Chat'}
                </button>
              )}
            </div>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </motion.article>

        <div className="flex gap-4 mb-12 justify-center">
          {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
            <button
              key={platform}
              className="btn-retro px-6 py-3"
              onClick={() => window.open(
                `https://${platform.toLowerCase()}.com/share?url=${encodeURIComponent(window.location.href)}`,
                '_blank'
              )}
            >
              Share on {platform}
            </button>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold font-serif mb-6">Comments ({comments.length})</h2>
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="input-retro w-full h-32 mb-4"
                placeholder="Write a comment..."
              />
              <button type="submit" className="btn-retro px-6 py-2">
                Post Comment
              </button>
            </form>
          ) : (
            <div className="mb-8 text-center">
              <Link to="/login" className="btn-retro px-6 py-2">
                Log in to comment
              </Link>
            </div>
          )}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-2 border-[var(--color-ink)] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold">{comment.userEmail}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-800">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold font-serif mb-8">Related Posts</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="article-card block transform transition hover:scale-105"
              >
                <div className="p-6">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover mb-4 rounded-lg"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-500 line-clamp-3">{post.content}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {showCollaboration && id && (
        <CollaborationSidebar
          postId={id}
          isOpen={showCollaboration}
          onClose={() => setShowCollaboration(false)}
        />
      )}
    </div>
  );
}