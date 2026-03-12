import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mdxComponents } from '../components/mdx/components.js';
import {
  createBlogPostJsonLd,
  getAllPostSlugs,
  getPostBySlug,
  getPostSummaryBySlug,
} from '@/lib/blog';
import { siteConfig } from '@/lib/profile';
import { createPageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostSummaryBySlug(slug);

  if (!post) {
    return createPageMetadata({
      title: 'Blog',
      pathname: '/blog',
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  return createPageMetadata({
    title: post.metadata.title,
    description: post.metadata.description,
    pathname: `/blog/${post.slug}`,
    openGraph: {
      type: 'article',
      publishedTime: post.metadata.publishedAt ?? undefined,
      modifiedTime:
        post.metadata.updatedAt ?? post.metadata.publishedAt ?? undefined,
      authors: [siteConfig.authorName],
      tags: post.metadata.tags,
      images: [
        {
          url: post.metadata.image,
          alt: post.metadata.title,
        },
      ],
    },
    twitter: {
      title: post.metadata.title,
      description: post.metadata.description,
      images: [{ url: post.metadata.image, alt: post.metadata.title }],
    },
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = createBlogPostJsonLd(post);

  return (
    <article className={`${styles.page} layout-rail`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Link href="/blog" className={styles.backLink}>
        Back to blog
      </Link>

      <header className={styles.header}>
        {[post.metadata.formattedDate, post.metadata.readingTime]
          .filter(Boolean)
          .join(' / ') ? (
          <p className={styles.date}>
            {[post.metadata.formattedDate, post.metadata.readingTime]
              .filter(Boolean)
              .join(' / ')}
          </p>
        ) : null}
        <h1 className={styles.title}>{post.metadata.title}</h1>
        {post.metadata.description ? (
          <p className={styles.description}>{post.metadata.description}</p>
        ) : null}
        {post.metadata.tags.length > 0 ? (
          <ul className={styles.tagList} aria-label="Post tags">
            {post.metadata.tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <div className={styles.content}>
        <post.Content components={mdxComponents} />
      </div>
    </article>
  );
}
