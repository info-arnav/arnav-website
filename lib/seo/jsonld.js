import { siteConfig } from '../profile.js';
import { orgId, personId, websiteId } from './constants.js';

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
        '@type': 'Person',
        '@id': personId,
        name: siteConfig.person.name,
        jobTitle: siteConfig.person.jobTitle,
        url: siteConfig.url,
        description: siteConfig.description,
        image: `${siteConfig.url}${siteConfig.image}`,
        sameAs: [
          siteConfig.social.linkedin,
          siteConfig.social.github,
          siteConfig.social.twitter,
          siteConfig.social.instagram,
          siteConfig.social.facebook,
        ],
      },
    ],
  };
}
