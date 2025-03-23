import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const { signup, signInWithGoogle, signInWithFacebook } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/blog');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      navigate('/blog');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Facebook');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/blog');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-paper)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 p-8 vintage-paper rounded-lg shadow-[8px_8px_0_var(--color-ink)] relative overflow-hidden"
      >
        <div>
          <h2 className="mt-6 text-center text-4xl font-bold font-serif tracking-tight text-[var(--color-ink)]">
            Create your account
          </h2>
          <p className="mt-4 text-center text-base font-serif text-[var(--color-accent)]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] border-b-2 border-[var(--color-ink)]">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-8 px-4 py-6" onSubmit={handleSubmit}>
          {error && (
            <div className="border-2 border-red-800 bg-red-50 p-4 font-serif">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          <div className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-serif font-medium text-[var(--color-ink)] mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-retro w-full"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-serif font-medium text-[var(--color-ink)] mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-retro w-full"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-serif font-medium text-[var(--color-ink)] mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-retro w-full"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-serif font-medium text-[var(--color-ink)] mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-retro w-full"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="btn-retro w-full py-3"
            >
              Create Account
            </button>

            <div className="flex items-center justify-center">
              <span className="px-2 text-[var(--color-accent)]">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn-retro flex items-center justify-center gap-2"
              >
                <FaGoogle /> Google
              </button>
              <button
                type="button"
                onClick={handleFacebookSignIn}
                className="btn-retro flex items-center justify-center gap-2"
              >
                <FaFacebook /> Facebook
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}