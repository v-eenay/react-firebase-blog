import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function NotFound() {
  const [score, setScore] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (clicks >= 4) {
      setShowEasterEgg(true);
    }
  }, [clicks]);

  const handleClick = () => {
    setClicks(prev => prev + 1);
    if (showEasterEgg) {
      setScore(prev => prev + 10);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-paper)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 p-8 vintage-paper rounded-lg shadow-[8px_8px_0_var(--color-ink)] relative overflow-hidden text-center"
      >
        <h1 
          className="text-8xl font-bold font-serif text-[var(--color-ink)] cursor-pointer select-none" 
          onClick={handleClick}
        >
          404
        </h1>
        <h2 className="text-2xl font-serif text-[var(--color-ink)] mt-4">
          Extra! Extra! Page Not Found!
        </h2>
        <p className="text-[var(--color-accent)] font-serif mt-2">
          Stop the presses! It seems our newspaper boy delivered the wrong page.
        </p>
        
        {showEasterEgg && (
          <div className="mt-4">
            <p className="text-[var(--color-ink)] font-serif">🎮 Easter Egg Found! 🎮</p>
            <p className="text-[var(--color-accent)] font-serif">Score: {score}</p>
            <p className="text-sm text-[var(--color-ink)] font-serif mt-2">
              Keep clicking the 404 to increase your score!
            </p>
          </div>
        )}

        <div className="space-y-4 mt-8">
          <Link 
            to="/" 
            className="btn-retro block w-full py-3 text-center"
          >
            Return to Homepage
          </Link>
          <div className="flex gap-4">
            <Link 
              to="/blog" 
              className="btn-retro flex-1 py-3 text-center"
            >
              Read Blog
            </Link>
            <Link 
              to="/categories" 
              className="btn-retro flex-1 py-3 text-center"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}