import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaFacebook, FaTwitter, FaLinkedin, FaSearch } from 'react-icons/fa';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  likes?: number;
  views?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!db) {
          console.error('Firebase db is not initialized');
          throw new Error('Firebase is not initialized. Please check your configuration.');
        }

        console.log('Fetching data from Firebase...');

        // Fetch featured posts (newest posts)
        const postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const postsSnapshot = await getDocs(postsQuery);
        console.log('Posts fetched:', postsSnapshot.size);
        
        const postsData = postsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
          };
        }) as Post[];
        setFeaturedPosts(postsData);
        setFilteredPosts(postsData);

        // Fetch popular posts (most viewed/liked)
        const popularQuery = query(
          collection(db, 'posts'),
          orderBy('views', 'desc'),
          limit(4)
        );
        const popularSnapshot = await getDocs(popularQuery);
        console.log('Popular posts fetched:', popularSnapshot.size);
        
        const popularData = popularSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()
          };
        }) as Post[];
        setPopularPosts(popularData);

        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        console.log('Categories fetched:', categoriesSnapshot.size);
        
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Auto-advance carousel
    const interval = setInterval(() => {
      setCurrentSlide(current =>
        current === featuredPosts.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: 'Share Your Story',
      description: 'Create and publish your blog posts with our easy-to-use editor.'
    },
    {
      title: 'Connect with Readers',
      description: 'Build your audience and engage with readers from around the world.'
    },
    {
      title: 'Organize Content',
      description: 'Categorize your posts and make them easily discoverable.'
    }
  ];

  // Filter posts based on search query and selected category
  useEffect(() => {
    const filterPosts = () => {
      let filtered = [...featuredPosts];
      
      if (searchQuery) {
        filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (selectedCategory !== 'all') {
        filtered = filtered.filter(post => String(post.categoryId) === selectedCategory);
      }

      setFilteredPosts(filtered);
    };

    filterPosts();
  }, [searchQuery, selectedCategory, featuredPosts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <p className="mt-2 text-sm text-red-600">
                Please check your Firebase configuration and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[600px] bg-gray-900 text-white"
      >
        <div className="absolute inset-0 overflow-hidden">
          {featuredPosts.map((post, index) => (
            <div
              key={post.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-40"
                />
              )}
            </div>
          ))}
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 font-serif">
              The Digital Chronicle
            </h1>
            <p className="text-2xl mb-4 font-serif italic">
              "Where Words Come Alive"
            </p>
            <p className="text-xl mb-8 font-serif">
              Step into a world of captivating stories, fresh perspectives, and timeless wisdom.
            </p>
            <Link
              to="/blog"
              className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Reading
            </Link>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featuredPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </motion.section>

      {/* Categories Section */}
      {/* Search Section */}
      <section className="py-12 bg-paper border-y-2 border-ink">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-retro w-full py-3 pl-12 pr-4 rounded-none"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <div className="mt-4 flex gap-4 justify-center">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-retro px-4 py-2 rounded-none"
              aria-label="Select category"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-8 bg-paper border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 flex justify-center space-x-8">
          <a href="#" className="text-ink hover:text-accent transition-colors">
            <FaFacebook size={24} />
          </a>
          <a href="#" className="text-ink hover:text-accent transition-colors">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="text-ink hover:text-accent transition-colors">
            <FaLinkedin size={24} />
          </a>
        </div>
      </section>

      <section className="py-16 bg-paper border-y-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="article-card hover:scale-105 transition-transform"
              >
                <h3 className="text-xl font-serif font-semibold mb-2">{category.name}</h3>
                <p className="article-meta mb-4">{category.description}</p>
                <Link
                  to={`/categories/${category.slug}`}
                  className="btn-retro inline-block"
                >
                  Explore Category →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Posts Section */}
      {/* Filtered Posts Section */}
      {filteredPosts.length > 0 && searchQuery && (
        <section className="py-12 bg-paper border-y-2 border-ink">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-center mb-8">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="article-card hover:scale-105 transition-transform"
                >
                  <h3 className="text-xl font-serif font-bold mb-2">{post.title}</h3>
                  <p className="article-meta">{new Date(post.createdAt).toLocaleDateString()}</p>
                  <p className="mb-4">{post.content.substring(0, 150)}...</p>
                  <Link to={`/blog/${post.id}`} className="btn-retro inline-block">Read More</Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-paper border-y-2 border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Popular Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="article-card hover:scale-105 transition-transform"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{post.authorName}</span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}