import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const { login, signInWithGoogle, signInWithFacebook, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/blog');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    }
  };

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(resetEmail);
      setResetMessage('Password reset email sent! Check your inbox.');
      setTimeout(() => setShowResetModal(false), 3000);
    } catch (err: any) {
      setResetMessage(err.message || 'Failed to send reset email');
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
            Sign in to your account
          </h2>
          <p className="mt-4 text-center text-base font-serif text-[var(--color-accent)]">
            Or{' '}
            <Link to="/signup" className="font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] border-b-2 border-[var(--color-ink)]">
              create a new account
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
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="btn-retro w-full py-3"
            >
              Sign in
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

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-[var(--color-ink)] hover:text-[var(--color-accent)] text-sm font-serif"
              >
                Forgot your password?
              </button>
            </div>
          </div>
        </form>

        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="vintage-paper p-6 rounded-lg shadow-[8px_8px_0_var(--color-ink)] max-w-md w-full">
              <h3 className="text-xl font-bold font-serif mb-4">Reset Password</h3>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-serif font-medium text-[var(--color-ink)] mb-2">
                    Email address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="input-retro w-full"
                    placeholder="your@email.com"
                  />
                </div>
                {resetMessage && (
                  <div className={`p-4 font-serif ${resetMessage.includes('sent') ? 'text-green-800 bg-green-50' : 'text-red-800 bg-red-50'}`}>
                    {resetMessage}
                  </div>
                )}
                <div className="flex gap-4">
                  <button type="submit" className="btn-retro flex-1">
                    Send Reset Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetModal(false)}
                    className="btn-retro flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}