const baseUrl = 'https://www.arnavgupta.net';

export default function sitemap() {
  const routes = ['/'];
  const lastModified = new Date().toISOString();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.5,
  }));
}
