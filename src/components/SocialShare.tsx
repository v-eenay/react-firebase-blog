import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

interface SocialShareProps {
  title: string;
  url: string;
}

export default function SocialShare({ title, url }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

  return (
    <div className="flex gap-4 items-center">
      <span className="text-sm text-gray-500">Share:</span>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Share on Facebook"
      >
        <FaFacebook size={20} />
      </a>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-500 hover:text-sky-700 transition-colors"
        aria-label="Share on Twitter"
      >
        <FaTwitter size={20} />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:text-blue-900 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <FaLinkedin size={20} />
      </a>
    </div>
  );
}