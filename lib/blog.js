import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { evaluate } from '@mdx-js/mdx';
import matter from 'gray-matter';
import * as jsxRuntime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';
import { siteConfig } from './profile.js';

const defaultBlogDirectory = path.join(process.cwd(), 'content', 'blog');
const mdxExtensionPattern = /\.mdx$/;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const excerptLength = 220;
const wordsPerMinute = 220;
const siteTimezone = siteConfig.timezone ?? 'UTC';
const postDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: siteTimezone,
});
const siteDateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: siteTimezone,
});

function getBlogDirectory() {
  return path.resolve(process.env.BLOG_CONTENT_DIR ?? defaultBlogDirectory);
}

function stripMdxExtension(value = '') {
  return value.replace(mdxExtensionPattern, '');
}

function normalizeSlug(value = '') {
  return stripMdxExtension(value).trim();
}

function isSafeSlug(slug) {
  return slugPattern.test(slug);
}

function resolveSlug(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const slug = normalizeSlug(value);

  return isSafeSlug(slug) ? slug : null;
}

function isAbsoluteHttpUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function isValidImageReference(value) {
  return value.startsWith('/') || isAbsoluteHttpUrl(value);
}

function toAbsoluteUrl(value) {
  return isAbsoluteHttpUrl(value)
    ? value
    : new URL(value, siteConfig.url).toString();
}

function normalizeDateValue(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function parsePostDate(value) {
  if (!value) {
    return null;
  }

  const candidate = dateOnlyPattern.test(value)
    ? `${value}T00:00:00.000Z`
    : value;
  const parsedDate = new Date(candidate);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatPostDate(value) {
  const parsedDate = parsePostDate(value);

  return parsedDate ? postDateFormatter.format(parsedDate) : null;
}

function getCurrentSiteDateKey(now = new Date()) {
  const parts = siteDateKeyFormatter.formatToParts(now);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

function stripMarkdown(source) {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[([^\]]*)]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function createExcerpt(source, fallback) {
  const excerptSource = source.trim() || fallback.trim();

  if (excerptSource.length <= excerptLength) {
    return excerptSource;
  }

  return `${excerptSource.slice(0, excerptLength - 3).trimEnd()}...`;
}

function getWordCount(source) {
  if (!source) {
    return 0;
  }

  return source.split(/\s+/).filter(Boolean).length;
}

function getReadingTime(wordCount) {
  const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return {
    minutes,
    text: `${minutes} min read`,
  };
}

const dateFieldSchema = z
  .union([z.string().trim().min(1), z.date()])
  .transform(normalizeDateValue)
  .refine((value) => parsePostDate(value), {
    message: 'must be a valid YYYY-MM-DD or ISO 8601 date',
  });

const postFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    excerpt: z.string().trim().min(1).optional(),
    publishedAt: dateFieldSchema,
    updatedAt: dateFieldSchema.optional(),
    tags: z
      .array(z.string().trim().min(1))
      .default([])
      .transform((tags) => [...new Set(tags)]),
    image: z
      .string()
      .trim()
      .min(1)
      .refine(isValidImageReference, {
        message: 'must be an absolute http(s) URL or a root-relative path',
      })
      .optional(),
    imageAlt: z.string().trim().min(1).optional(),
    draft: z.boolean().default(false),
  })
  .strict()
  .superRefine((metadata, context) => {
    const publishedAt = parsePostDate(metadata.publishedAt);
    const updatedAt = parsePostDate(metadata.updatedAt);

    if (
      publishedAt &&
      updatedAt &&
      updatedAt.getTime() < publishedAt.getTime()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['updatedAt'],
        message: 'must be on or after publishedAt',
      });
    }
  });

function createContentError(filePath, message) {
  return new Error(
    `Invalid blog content in "${path.basename(filePath)}": ${message}`,
  );
}

function parseFrontmatter(frontmatter, filePath) {
  const result = postFrontmatterSchema.safeParse(frontmatter);

  if (result.success) {
    return result.data;
  }

  const message = result.error.issues
    .map((issue) => {
      const issuePath =
        issue.path.length > 0 ? issue.path.join('.') : 'frontmatter';

      return `${issuePath}: ${issue.message}`;
    })
    .join('; ');

  throw createContentError(filePath, message);
}

function buildPostMetadata(frontmatter, content, filePath) {
  const parsedFrontmatter = parseFrontmatter(frontmatter, filePath);
  const plainText = stripMarkdown(content);
  const wordCount = getWordCount(plainText);
  const readingTime = getReadingTime(wordCount);
  const publishedAt = parsedFrontmatter.publishedAt;
  const updatedAt = parsedFrontmatter.updatedAt ?? null;

  return {
    ...parsedFrontmatter,
    excerpt: createExcerpt(
      parsedFrontmatter.excerpt ?? plainText,
      parsedFrontmatter.description,
    ),
    publishedAt,
    updatedAt,
    formattedDate: formatPostDate(publishedAt),
    formattedUpdatedDate: formatPostDate(updatedAt),
    readingTime: readingTime.text,
    readingTimeMinutes: readingTime.minutes,
    wordCount,
    image: parsedFrontmatter.image ?? siteConfig.image,
    imageAlt: parsedFrontmatter.imageAlt ?? parsedFrontmatter.title,
  };
}

function parsePostSource(source, filePath) {
  const { content, data } = matter(source, {
    engines: {
      yaml: (frontmatter) => parseYaml(frontmatter) ?? {},
    },
  });

  return {
    content,
    metadata: buildPostMetadata(data, content, filePath),
  };
}

function isVisiblePost(metadata) {
  if (metadata.draft === true || !metadata.publishedAt) {
    return false;
  }

  if (dateOnlyPattern.test(metadata.publishedAt)) {
    return metadata.publishedAt <= getCurrentSiteDateKey();
  }

  const publishedAt = parsePostDate(metadata.publishedAt);

  return Boolean(publishedAt && publishedAt.getTime() <= Date.now());
}

function sortPosts(posts) {
  return [...posts].sort((leftPost, rightPost) => {
    const leftDate = parsePostDate(leftPost.metadata.publishedAt);
    const rightDate = parsePostDate(rightPost.metadata.publishedAt);

    if (!leftDate && !rightDate) {
      return leftPost.metadata.title.localeCompare(rightPost.metadata.title);
    }

    if (!leftDate) {
      return 1;
    }

    if (!rightDate) {
      return -1;
    }

    return rightDate.getTime() - leftDate.getTime();
  });
}

async function getPostFiles(blogDirectory) {
  try {
    const entries = await fs.readdir(blogDirectory, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && mdxExtensionPattern.test(entry.name))
      .map((entry) => {
        const slug = normalizeSlug(entry.name);

        if (!isSafeSlug(slug)) {
          throw createContentError(
            path.join(blogDirectory, entry.name),
            'file names must use lowercase letters, numbers, and dashes only',
          );
        }

        return {
          slug,
          filePath: path.join(blogDirectory, entry.name),
        };
      });

    const duplicateSlugs = files
      .map((file) => file.slug)
      .filter((slug, index, values) => values.indexOf(slug) !== index);

    if (duplicateSlugs.length > 0) {
      throw new Error(
        `Duplicate blog slugs found: ${[...new Set(duplicateSlugs)].join(', ')}`,
      );
    }

    return files.sort((leftFile, rightFile) =>
      leftFile.slug.localeCompare(rightFile.slug),
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

async function readPostFile(blogDirectory, slug) {
  const normalizedSlug = resolveSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  const filePath = path.join(blogDirectory, `${normalizedSlug}.mdx`);

  try {
    const source = await fs.readFile(filePath, 'utf8');

    return {
      filePath,
      source,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }

    throw error;
  }
}

async function compilePostContent(source, filePath) {
  try {
    const evaluated = await evaluate(source, {
      ...jsxRuntime,
      baseUrl: pathToFileURL(filePath),
      remarkPlugins: [remarkGfm],
    });

    return evaluated.default;
  } catch (error) {
    throw createContentError(filePath, error.message);
  }
}

async function getPostRecord(blogDirectory, slug) {
  const postFile = await readPostFile(blogDirectory, slug);

  if (!postFile) {
    return null;
  }

  const normalizedSlug = resolveSlug(slug);
  const parsedPost = parsePostSource(postFile.source, postFile.filePath);

  return {
    slug: normalizedSlug,
    filePath: postFile.filePath,
    content: parsedPost.content,
    metadata: parsedPost.metadata,
  };
}

async function getPostSummary(blogDirectory, slug) {
  const postRecord = await getPostRecord(blogDirectory, slug);

  if (!postRecord || !isVisiblePost(postRecord.metadata)) {
    return null;
  }

  return {
    slug: postRecord.slug,
    metadata: postRecord.metadata,
  };
}

async function getCompiledPost(blogDirectory, slug) {
  const postRecord = await getPostRecord(blogDirectory, slug);

  if (!postRecord || !isVisiblePost(postRecord.metadata)) {
    return null;
  }

  const Content = await compilePostContent(
    postRecord.content,
    postRecord.filePath,
  );

  return {
    slug: postRecord.slug,
    metadata: postRecord.metadata,
    Content,
  };
}

async function getAllPostSummaries(blogDirectory) {
  const files = await getPostFiles(blogDirectory);
  const posts = await Promise.all(
    files.map((file) => getPostSummary(blogDirectory, file.slug)),
  );

  return sortPosts(posts.filter(Boolean));
}

export async function getAllPostSlugs() {
  const posts = await getAllPostSummaries(getBlogDirectory());

  return posts.map((post) => post.slug);
}

export async function getAllPosts() {
  return getAllPostSummaries(getBlogDirectory());
}

export async function getPostSummaryBySlug(slug) {
  return getPostSummary(getBlogDirectory(), slug);
}

export async function getPostBySlug(slug) {
  return getCompiledPost(getBlogDirectory(), slug);
}

export function createBlogPostJsonLd(post) {
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    description: post.metadata.description,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.updatedAt ?? post.metadata.publishedAt,
    url: postUrl,
    mainEntityOfPage: postUrl,
    image: [toAbsoluteUrl(post.metadata.image)],
    author: {
      '@type': 'Person',
      name: siteConfig.authorName,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.image}`,
      },
    },
    keywords:
      post.metadata.tags.length > 0 ? post.metadata.tags.join(', ') : undefined,
  };
}
