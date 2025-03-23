import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

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
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const postsSnapshot = await getDocs(postsQuery);
        const postsData = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Post[];
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Category[];
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchPosts();
    fetchCategories();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.categoryId === parseInt(selectedCategory);
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900"
          >
            Blog Posts
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-xl text-gray-500"
          >
            Explore our latest thoughts and insights
          </motion.p>
        </div>

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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-retro"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
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
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>By {post.authorName}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {categories.find(c => c.id === post.categoryId)?.name}
                    </span>
                    <Link
                      to={`/blog/${post.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No posts found. Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}