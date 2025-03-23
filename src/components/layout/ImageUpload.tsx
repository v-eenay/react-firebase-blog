import { useState, useRef } from 'react';

interface ImageUploadProps {
  onImageUpload: (base64Image: string) => void;
  currentImage?: string;
}

export default function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-4">
      <div
        onClick={handleClick}
        className="cursor-pointer border-2 border-gray-800 border-dashed p-4 rounded-sm hover:bg-gray-50 transition-colors"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto mx-auto"
            style={{ maxHeight: '300px' }}
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-800 font-serif">Click to add an image</p>
            <p className="text-sm text-gray-600 font-serif mt-2">
              Supports JPG, PNG and GIF files
            </p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}