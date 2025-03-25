import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { generateMetaTags, generatePostUrl, extractPostIdFromUrl } from '../utils/seo';
import { doc, getDoc, collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCollaboration } from '../contexts/CollaborationContext';
import CollaborationSidebar from '../components/CollaborationSidebar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../components/LanguageSwitcher';

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
  reactions?: {
    [key: string]: {
      type: 'thumbsUp' | 'heart' | 'laugh';
      userId: string;
      createdAt: string;
    };
  };
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
  const navigate = useNavigate();
  const postId = extractPostIdFromUrl(id || '');
  const { user } = useAuth();
  const { isCollaborating, documentContent, updateContent } = useCollaboration();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [translatedTitle, setTranslatedTitle] = useState<string>('');
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const { isTranslating } = useLanguage();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      const postDoc = await getDoc(doc(db, 'posts', postId));
      if (postDoc.exists()) {
        const postData = { id: postDoc.id, ...postDoc.data() } as Post;
        setPost(postData);
        
        // Redirect to SEO-friendly URL if needed
        const seoUrl = generatePostUrl(postData);
        const currentPath = window.location.pathname;
        if (!currentPath.includes(seoUrl.split('/').pop() || '')) {
          navigate(seoUrl);
        }
      }
    };
    fetchPost();
  }, [postId, navigate]);

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as Comment));
    });
    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (isCollaborating && documentContent && postId) {
      updateContent(postId, documentContent);
    }
  }, [isCollaborating, documentContent, postId, updateContent]);

  if (!post) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const seoTags = generateMetaTags(post);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !postId) return;
    setNewComment('');
  };

  return (
    <div className="py-12 relative">
      <Helmet>
        <title>{seoTags.title}</title>
        {seoTags.meta.map((tag, index) => (
          <meta key={index} {...tag} />
        ))}
      </Helmet>

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

        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>
        <motion.article
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="prose lg:prose-xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold font-serif mb-6">{translatedTitle || post.title}</h1>
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 rounded-full">
              {post.authorName}
            </div>
            <span className="text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <div className="flex items-center gap-4">
              <span>♥ {post.likes || 0}</span>
              {post.authorId === user?.uid && (
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                    placeholder="Collaborator's email"
                    className="input-retro text-sm"
                  />
                </div>
              )}
              {post.collaborators?.includes(user?.uid || '') && (
                <button
                  onClick={() => setShowCollaboration(!showCollaboration)}
                  className="btn-retro px-4 py-2 text-sm"
                >
                  {showCollaboration ? 'Hide Chat' : 'Show Chat'}
                </button>
              )}
            </div>
          </div>
          {isTranslating ? (
            <div className="flex items-center justify-center py-4">
              <span className="text-[var(--color-accent)]">Translating...</span>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: translatedContent || post.content }} />
          )}
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
              <div key={comment.id} className="border-2 border-[var(--color-ink)] p-4 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{comment.userEmail}</span>
                  <span className="text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-800">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showCollaboration && postId && (
        <CollaborationSidebar
          postId={postId}
          isOpen={showCollaboration}
          onClose={() => setShowCollaboration(false)}
        />
      )}
    </div>
  );
}