import { siteConfig } from '../profile';
import { baseOpenGraph, baseTwitter, ogImage } from './constants';

function resolveCanonical(pathname = '/') {
  return pathname === '/' ? '/' : pathname;
}

function resolveAbsoluteUrl(pathname = '/') {
  return pathname === '/' ? siteConfig.url : `${siteConfig.url}${pathname}`;
}

export function createPageMetadata({
  title,
  description = siteConfig.description,
  pathname = '/',
  alternates = {},
  openGraph = {},
  twitter = {},
  robots,
} = {}) {
  const canonical = resolveCanonical(pathname);
  const pageUrl = resolveAbsoluteUrl(pathname);

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical, ...alternates },
    openGraph: {
      ...baseOpenGraph,
      ...openGraph,
      title: openGraph.title ?? title ?? baseOpenGraph.title,
      description: openGraph.description ?? description,
      url: openGraph.url ?? pageUrl,
      images: openGraph.images ?? [ogImage],
    },
    twitter: {
      ...baseTwitter,
      ...twitter,
      title: twitter.title ?? title ?? baseTwitter.title,
      description: twitter.description ?? description,
      images: twitter.images ?? baseTwitter.images,
    },
    ...(robots ? { robots } : {}),
  };
}

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.title} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon.png', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: ['/favicon.ico'],
  },
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.authorName, url: siteConfig.url }],
  creator: siteConfig.authorName,
  publisher: siteConfig.authorName,
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...createPageMetadata(),
};

export const homeMetadata = createPageMetadata({
  pathname: '/',
});
