import styles from './page.module.css';
import Footer from './(site)/_components/footer';
import { homeMetadata } from '../lib/seo';
import Image from 'next/image';

export const metadata = homeMetadata;

export default function Home() {
  return (
    <>
      <section className={`${styles.banner} layout-rail`}>
        <div className={styles.visual}>
          <Image
            src="/assets/avatar_lid.png"
            alt="Portrait illustration of Arnav Gupta"
            width={1008}
            height={912}
            className={styles.avatar}
            sizes="(max-width: 800px) 100vw, 50vw"
            priority
          />
        </div>
        <div className={styles.copy}>
          <h1 className={styles.heading}>Hi, I&apos;m Arnav</h1>
          <h2 className={styles.subheading}>Welcome to my website</h2>
          <p className={styles.description}>
            I build practical products, run curious experiments, and share what
            I learn along the way. This site is my corner of the internet for
            projects, ideas, and useful things I&apos;m shipping.
          </p>
        </div>
      </section>

      <section className={styles.connect}>
        <p className={styles.connectText}>Want to connect?</p>
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
