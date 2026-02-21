import { siteConfig } from '../profile';

export const websiteId = `${siteConfig.url}/#website`;
export const orgId = `${siteConfig.url}/#organization`;
export const softwareId = `${siteConfig.url}/#software`;

export const ogImage = {
  url: siteConfig.image,
  width: siteConfig.imageWidth,
  height: siteConfig.imageHeight,
  alt: siteConfig.imageAlt,
};

export const baseOpenGraph = {
  type: 'website',
  locale: siteConfig.locale,
  siteName: siteConfig.name,
  title: siteConfig.openGraph.title,
  description: siteConfig.openGraph.description,
  url: siteConfig.url,
  images: [ogImage],
};

export const baseTwitter = {
  card: 'summary_large_image',
  title: siteConfig.openGraph.title,
  description: siteConfig.twitter.description,
  images: [{ url: siteConfig.image, alt: siteConfig.imageAlt }],
};
