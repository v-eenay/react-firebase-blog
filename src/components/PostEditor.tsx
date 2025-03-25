import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';

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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const file = e.target.files[0];
    setUploading(true);

    try {
      const storageRef = ref(storage, `post-images/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setImage(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave({
      title,
      content,
      scheduledFor: scheduledFor || undefined,
      image: image || undefined
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
    <div className="vintage-paper p-6 space-y-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title..."
        className="input-retro text-2xl font-serif w-full mb-4"
      />

      <div className="flex items-center gap-4 mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className={`btn-retro ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? 'Uploading...' : 'Upload Featured Image'}
        </label>
        {image && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={image}
            alt="Preview"
            className="h-20 w-20 object-cover rounded"
          />
        )}
      </div>

      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        className="h-96 mb-12"
        theme="snow"
      />

      <div className="flex items-center gap-4 mt-8">
        <DateTimePicker
          onChange={setScheduledFor}
          value={scheduledFor}
          className="input-retro"
          minDate={new Date()}
          clearIcon={null}
          format="y-MM-dd h:mm a"
        />
        <button
          onClick={handlePreview}
          className="btn-retro"
        >
          Preview
        </button>
        <button
          onClick={handleSave}
          className="btn-retro bg-success text-paper"
        >
          {scheduledFor ? 'Schedule Post' : 'Publish Now'}
        </button>
      </div>
    </div>
  );
};

export default PostEditor;