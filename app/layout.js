import './globals.css';
import Navigation from './(site)/_components/nav';
import { defaultMetadata, getJsonLdGraph } from '../lib/seo';

export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  const jsonLdGraph = getJsonLdGraph();

  return (
    <html lang="en">
      <body>
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
