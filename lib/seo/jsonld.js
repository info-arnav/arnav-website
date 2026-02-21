import { siteConfig } from '../profile';
import { orgId, softwareId, websiteId } from './constants';

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
          '@id': orgId,
        },
      },
      {
        '@type': 'Organization',
        '@id': orgId,
        name: siteConfig.name,
        url: siteConfig.url,
        logo: {
          '@type': 'ImageObject',
          url: `${siteConfig.url}${siteConfig.image}`,
        },
        sameAs: [
          siteConfig.social.twitter,
          siteConfig.social.linkedin,
          siteConfig.social.github,
          siteConfig.social.instagram,
          siteConfig.social.facebook,
        ],
      },
      {
        '@type': 'SoftwareApplication',
        '@id': softwareId,
        name: siteConfig.title,
        applicationCategory: 'WebApplication',
        operatingSystem: 'Any',
        url: siteConfig.url,
        description: siteConfig.shortBio,
        creator: {
          '@id': orgId,
        },
      },
    ],
  };
}
