import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GamificationProfile from '../components/GamificationProfile';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes?: number;
}

export default function Profile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [stats, setStats] = useState({
    posts: 0,
    followers: 0,
    following: 0
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const profileDoc = await getDoc(doc(db, 'users', id || user?.uid || ''));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data() as UserProfile;
        setProfile(profileData);
        setEditBio(profileData.bio || '');
        setStats({
          posts: 0,
          followers: profileData.followers?.length || 0,
          following: profileData.following?.length || 0
        });
        setIsFollowing(profileData.followers?.includes(user?.uid || '') || false);
      }
    };
    fetchProfile();
  }, [id, user]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(
        collection(db, 'posts'),
        where('authorId', '==', id || user?.uid)
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(posts);
      setStats(prev => ({ ...prev, posts: posts.length }));
    };
    if (id || user?.uid) fetchPosts();
  }, [id, user]);

  const handleUpdateBio = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { bio: editBio });
    setProfile(prev => prev ? { ...prev, bio: editBio } : null);
    setIsEditing(false);
  };

  const handleFollow = async () => {
    if (!user || !profile) return;
    const userRef = doc(db, 'users', profile.uid);
    const currentUserRef = doc(db, 'users', user.uid);

    if (isFollowing) {
      await updateDoc(userRef, {
        followers: arrayRemove(user.uid)
      });
      await updateDoc(currentUserRef, {
        following: arrayRemove(profile.uid)
      });
    } else {
      await updateDoc(userRef, {
        followers: arrayUnion(user.uid)
      });
      await updateDoc(currentUserRef, {
        following: arrayUnion(profile.uid)
      });
    }
    setIsFollowing(!isFollowing);
    setStats(prev => ({
      ...prev,
      followers: isFollowing ? prev.followers - 1 : prev.followers + 1
    }));
  };

  if (!profile) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="vintage-paper p-8 rounded-lg shadow-[8px_8px_0_var(--color-ink)] mb-8"
      >
        <div className="flex items-center gap-8 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-ink)] shadow-lg">
            <img
              src={profile.photoURL || 'https://api.dicebear.com/6.x/personas/svg?seed=' + profile.displayName}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold font-serif mb-2">{profile.displayName}</h1>
            <p className="text-[var(--color-accent)] mb-4">{profile.email}</p>
            {profile.uid === user?.uid ? (
              isEditing ? (
                <div className="flex gap-2">
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="input-retro flex-1"
                    placeholder="Write something about yourself..."
                  />
                  <button onClick={handleUpdateBio} className="btn-retro px-4">
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-retro bg-[var(--color-ink)] text-[var(--color-paper)] px-4"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-retro px-4 py-2"
                >
                  Edit Bio
                </button>
              )
            ) : (
              <button
                onClick={handleFollow}
                className={`btn-retro px-6 py-2 ${isFollowing ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : ''}`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        <div className="border-t-2 border-[var(--color-ink)] pt-4">
          <p className="font-serif text-lg">{profile.bio || 'No bio yet.'}</p>
        </div>

        <div className="flex gap-8 mt-6 text-center">
          <div>
            <div className="text-2xl font-bold font-serif">{stats.posts}</div>
            <div className="text-[var(--color-accent)]">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-serif">{stats.followers}</div>
            <div className="text-[var(--color-accent)]">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-serif">{stats.following}</div>
            <div className="text-[var(--color-accent)]">Following</div>
          </div>
        </div>
      </motion.div>

      {/* Gamification Profile */}
      {profile.uid === user?.uid && <GamificationProfile />}

      <h2 className="text-2xl font-bold font-serif mb-6">Published Posts</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="vintage-paper p-6 rounded-lg shadow-[4px_4px_0_var(--color-ink)] hover:shadow-[6px_6px_0_var(--color-ink)] transition-shadow"
          >
            <h3 className="text-xl font-bold font-serif mb-2">{post.title}</h3>
            <div className="flex items-center justify-between text-sm text-[var(--color-accent)]">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>♥ {post.likes || 0}</span>
            </div>
          </Link>
        ))}
      </div>
      {posts.length === 0 && (
        <p className="text-center text-[var(--color-accent)] font-serif">
          No posts yet.
        </p>
      )}
    </div>
  );
}