import styles from './page.module.css';
import Footer from './(site)/_components/footer';
import { homeMetadata } from '../lib/seo';
import Image from 'next/image';

export const metadata = homeMetadata;

export default function Home() {
  return (
    <>
      <section className={styles.banner}>
        <div className={styles.visual}>
          <Image
            src="/assets/avatar_lid.png"
            alt="Avatar"
            width={1008}
            height={912}
            className={styles.avatar}
            sizes="(max-width: 800px) 100vw, 50vw"
            unoptimized
            priority
          />
        </div>
        <div className={styles.copy}>
          <h1 className={styles.heading}>Hi! I am Arnav</h1>
          <h2 className={styles.subheading}>Welcome to my website</h2>
          <p className={styles.description}>
            So, I&apos;m a tech junkie caught in the awkward dance of
            not-quite-a-teen, not-quite-an-adult. Life&apos;s a puzzle, and
            I&apos;m the guy trying to assemble it with mismatched pieces.
            Buckle up, &apos;cause this rollercoaster ain&apos;t got no chill!
          </p>
        </div>
      </section>

      <section className={styles.connect}>
        <p className={styles.connectText}>Wanna Connect ?</p>
        <svg
          className={styles.arrows}
          viewBox="0 0 15.87 30"
          aria-hidden="true"
        >
          <path className={styles.a1} d="M0 0 L7.935 7.935 L15.87 0" />
          <path className={styles.a2} d="M0 10 L7.935 17.935 L15.87 10" />
          <path className={styles.a3} d="M0 20 L7.935 27.935 L15.87 20" />
        </svg>
      </section>

      <Footer />
    </>
  );
}
