import Footer from '../(site)/components/footer/index.js';

export default function BlogLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
