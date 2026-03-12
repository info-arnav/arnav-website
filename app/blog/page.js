import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { createPageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = createPageMetadata({
  title: 'Blog',
  description:
    'Notes on product builds, implementation details, experiments, and lessons learned while shipping.',
  pathname: '/blog',
});

function buildMetaLine(post) {
  return [
    post.metadata.formattedDate,
    post.metadata.readingTime,
    ...post.metadata.tags,
  ]
    .filter(Boolean)
    .join(' / ');
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className={`${styles.page} layout-rail`}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Blog</p>
        <h1 className={styles.title}>
          Build notes, experiments, and practical lessons.
        </h1>
        <p className={styles.intro}>
          A running log of what I&apos;m shipping, what breaks, and the details
          worth keeping after the dust settles.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className={styles.postList}>
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`} className={styles.card}>
                <p className={styles.meta}>{buildMetaLine(post)}</p>
                <h2 className={styles.cardTitle}>{post.metadata.title}</h2>
                <p className={styles.cardDescription}>
                  {post.metadata.excerpt}
                </p>
                <span className={styles.cardCta}>Read post</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>Writing in public soon.</p>
          <p className={styles.emptyText}>
            New essays, build notes, and product breakdowns will show up here as
            they go live.
          </p>
        </div>
      )}
    </section>
  );
}
