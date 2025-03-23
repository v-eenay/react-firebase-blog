import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  likes?: number;
  views?: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { slug } = useParams();

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);

        // Fetch posts for selected category
        const selectedCategory = categoriesData.find(c => c.slug === slug);
        if (!selectedCategory) return;

        const postsQuery = query(
          collection(db, 'posts'),
          where('categoryId', '==', selectedCategory.id),
          sortBy === 'newest' ? orderBy('createdAt', 'desc') : 
          sortBy === 'popular' ? orderBy('views', 'desc') : orderBy('createdAt', 'desc')
        );
        
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [slug, sortBy]);

  const getPostCount = (categoryId: string) => {
    return posts.filter(post => post.categoryId === categoryId).length;
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-retro"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-retro"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900"
          >
            Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-xl text-gray-500"
          >
            Explore posts by topic
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.length > 0 ? filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="article-card"
            >
              <div className="p-6">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-500 mb-4 line-clamp-3">
                  {post.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>By {post.authorName}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-indigo-600">
                    {post.views || 0} views
                  </span>
                  <Link
                    to={`/blog/${post.id}`}
                    className="btn-retro px-4 py-2"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </motion.article>
          )) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-500 text-lg">
                No posts found in this category. Try adjusting your search.
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {category.name}
              </h2>
              <p className="text-gray-500 mb-4">{category.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {getPostCount(category.id)} posts
                </span>
                <Link
                  to={`/categories/${category.slug}`}
                  className="btn-retro px-4 py-2 text-sm"
                >
                  Explore Category
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No categories found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}