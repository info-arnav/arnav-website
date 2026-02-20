import { siteConfig } from './profile';

const personId = `${siteConfig.url}/#person`;
const websiteId = `${siteConfig.url}/#website`;

export const defaultMetadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
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
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.authorName, url: siteConfig.url }],
  creator: siteConfig.authorName,
  publisher: siteConfig.authorName,
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.openGraph.title,
    description: siteConfig.openGraph.description,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.image,
        width: siteConfig.imageWidth,
        height: siteConfig.imageHeight,
        alt: siteConfig.imageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.openGraph.title,
    description: siteConfig.twitter.description,
    images: [
      {
        url: siteConfig.image,
        alt: siteConfig.imageAlt,
      },
    ],
  },
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
};

export const homeMetadata = {
  title: 'Home',
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: siteConfig.openGraph.title,
    description: siteConfig.openGraph.description,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.image,
        width: siteConfig.imageWidth,
        height: siteConfig.imageHeight,
        alt: siteConfig.imageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.openGraph.title,
    description: siteConfig.twitter.description,
    images: [
      {
        url: siteConfig.image,
        alt: siteConfig.imageAlt,
      },
    ],
  },
};

export function getJsonLdGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: 'en',
        publisher: {
          '@id': personId,
        },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: siteConfig.person.name,
        url: siteConfig.url,
        image: `${siteConfig.url}${siteConfig.image}`,
        jobTitle: siteConfig.person.jobTitle,
        description: siteConfig.shortBio,
        sameAs: [
          siteConfig.social.twitter,
          siteConfig.social.linkedin,
          siteConfig.social.github,
          siteConfig.social.instagram,
          siteConfig.social.facebook,
        ],
      },
    ],
  };
}
