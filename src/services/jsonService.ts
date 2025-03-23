import users from '../data/users.json';
import posts from '../data/posts.json';
import categories from '../data/categories.json';

interface JsonUser {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
  avatar: string;
  bio: string;
  createdAt: string;
}

interface JsonPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  tags: string[];
}

interface JsonCategory {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export const jsonService = {
  authenticateUser: (email: string, password: string): JsonUser | null => {
    // For demonstration purposes, we're not checking passwords in the JSON data
    // In a real application, you would never store passwords in plain text
    const user = users.users.find(u => u.email === email);
    return user || null;
  },

  getUserById: (id: number): JsonUser | null => {
    const user = users.users.find(u => u.id === id);
    return user || null;
  },

  getAllPosts: (): JsonPost[] => {
    return posts.posts;
  },

  getPostById: (id: number): JsonPost | null => {
    const post = posts.posts.find(p => p.id === id);
    return post || null;
  },

  getPostsByAuthor: (authorId: number): JsonPost[] => {
    return posts.posts.filter(p => p.authorId === authorId);
  },

  getAllCategories: (): JsonCategory[] => {
    return categories.categories;
  },

  getCategoryById: (id: number): JsonCategory | null => {
    const category = categories.categories.find(c => c.id === id);
    return category || null;
  },

  getPostsByCategory: (categoryId: number): JsonPost[] => {
    return posts.posts.filter(p => p.categoryId === categoryId);
  }
};