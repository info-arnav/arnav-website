import { siteConfig } from '../lib/profile';

export default function sitemap() {
  const routes = ['/'];
  const lastModified = new Date().toISOString();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.5,
  }));
}
