import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from './(site)/components/nav/index.js';
import { defaultMetadata, getJsonLdGraph } from '../lib/seo.js';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  const jsonLdGraph = getJsonLdGraph();

  return (
    <html lang="en">
      <body className={inter.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
        <Navigation />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
