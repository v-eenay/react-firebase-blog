import { Post } from '../types/post';

export const generateMetaTags = (post: Post) => {
  const title = post.title;
  const description = post.content.substring(0, 160);
  const image = post.image || '/default-og-image.jpg';
  const url = generatePostUrl(post);

  return {
    title,
    meta: [
      {
        name: 'description',
        content: description,
      },
      {
        property: 'og:title',
        content: title,
      },
      {
        property: 'og:description',
        content: description,
      },
      {
        property: 'og:image',
        content: image,
      },
      {
        property: 'og:url',
        content: url,
      },
      {
        property: 'og:type',
        content: 'article',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: title,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: image,
      },
    ],
  };
};

export const generatePostUrl = (post: Post): string => {
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  return `${window.location.origin}/blog/${slug}-${post.id}`;
};

export const extractPostIdFromUrl = (url: string): string => {
  const matches = url.match(/-([a-zA-Z0-9]+)$/);
  return matches ? matches[1] : url;
};