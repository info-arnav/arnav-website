import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from './(site)/_components/nav';
import { defaultMetadata, getJsonLdGraph } from '../lib/seo';

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
        <main style={{ paddingTop: '62px' }}>{children}</main>
      </body>
    </html>
  );
}
