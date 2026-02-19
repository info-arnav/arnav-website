const siteName = 'Arnav Gupta';
const baseUrl = 'https://www.arnavgupta.net';

export default function manifest() {
  return {
    name: siteName,
    short_name: 'ArnavGupta',
    description:
      "Arnav Gupta's portfolio showcasing generative AI, computer vision, and full-stack work across DigiIQ, VML, NSUT, and beyond.",
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: siteName,
        url: baseUrl,
      },
    ],
  };
}
