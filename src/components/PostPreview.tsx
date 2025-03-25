import React from 'react';
import { motion } from 'framer-motion';

interface PostPreviewProps {
  title: string;
  content: string;
  image?: string;
  onClose: () => void;
}

const PostPreview: React.FC<PostPreviewProps> = ({
  title,
  content,
  image,
  onClose
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-ink bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="vintage-paper max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif">Preview</h2>
          <button
            onClick={onClose}
            className="btn-retro"
          >
            Close
          </button>
        </div>

        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-64 object-cover mb-6 rounded"
          />
        )}

        <h1 className="text-4xl font-serif mb-6">{title}</h1>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </motion.div>
    </motion.div>
  );
};

export default PostPreview;