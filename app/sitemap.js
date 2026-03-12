import { getAllPosts } from '../lib/blog.js';
import { siteConfig } from '../lib/profile.js';

function resolveLastModified(value, fallback) {
  if (!value) {
    return fallback;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00.000Z`;
  }

  return value;
}

export default async function sitemap() {
  const generatedAt = new Date().toISOString();
  const posts = await getAllPosts();

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: generatedAt,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: generatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: resolveLastModified(
        post.metadata.updatedAt ?? post.metadata.publishedAt,
        generatedAt,
      ),
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
  ];
}
