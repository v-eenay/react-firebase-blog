import { useState, useEffect, useRef } from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';
import QuillEditor from './QuillEditor';
import 'react-quill/dist/quill.snow.css';

interface PostEditorProps {
  initialContent?: string;
  initialTitle?: string;
  onSave: (post: {
    title: string;
    content: string;
    scheduledFor?: Date;
    image?: string;
  }) => void;
  onPreview: (post: {
    title: string;
    content: string;
    image?: string;
  }) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({
  initialContent = '',
  initialTitle = '',
  onSave,
  onPreview
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [scheduledFor, setScheduledFor] = useState<Date | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    },
    keyboard: {
      bindings: {
        tab: false
      }
    }
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `post-images/${filename}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const url = await getDownloadURL(storageRef);
      setImage(url);
      
      // Clear any previous errors
      setError('');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }
    setError('');
    onSave({
      title: title.trim(),
      content: content.trim(),
      scheduledFor: scheduledFor || undefined,
      image: image || null
    });
  };

  const handlePreview = () => {
    onPreview({
      title,
      content,
      image: image || undefined
    });
  };

  return (
    <div className="vintage-paper p-6 space-y-6 max-w-4xl mx-auto shadow-[8px_8px_0_var(--color-ink)] border-2 border-[var(--color-ink)]">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title..."
        className="input-retro text-2xl font-serif w-full mb-4 p-3 border-2 border-[var(--color-ink)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
      />

      {error && (
        <div className="text-red-600 font-serif mb-4 p-3 border-2 border-red-600 bg-red-50">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className={`btn-retro bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 hover:opacity-90 transition-opacity ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Featured Image'}
        </label>
        {image && (
          <div className="relative">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={image}
              alt="Preview"
              className="h-20 w-20 object-cover rounded"
            />
            <button
              onClick={() => setImage(null)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <QuillEditor
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        className="h-96 mb-24 [&_.ql-editor]:min-h-[300px] [&_.ql-toolbar]:border-2 [&_.ql-toolbar]:border-[var(--color-ink)] [&_.ql-container]:border-2 [&_.ql-container]:border-[var(--color-ink)] [&_.ql-editor]:font-serif [&_.ql-container]:mb-12"
        theme="snow"
        preserveWhitespace
      />

      <div className="flex items-center gap-4 mt-8 relative z-20 bg-[var(--color-paper)] p-4 border-t-2 border-[var(--color-ink)] sticky bottom-0">
        <DateTimePicker
          onChange={setScheduledFor}
          value={scheduledFor}
          className="input-retro z-20"
          minDate={new Date()}
          clearIcon={null}
          format="y-MM-dd h:mm a"
        />
        <button
          onClick={handlePreview}
          className="btn-retro hover:opacity-90 transition-opacity"
        >
          Preview
        </button>
        <button
          onClick={handleSave}
          className="btn-retro bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {scheduledFor ? 'Schedule Post' : 'Publish Now'}
        </button>
      </div>
    </div>
  );
};

export default PostEditor;