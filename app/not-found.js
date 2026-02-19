import Image from 'next/image';
import styles from './error.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/assets/error.png"
          className={styles.image}
          alt="Error 404"
          width={576}
          height={334}
          priority
        />
        <h2 className={styles.title}>ERROR 404</h2>
        <p className={styles.description}>Page Not Found</p>
      </div>
    </div>
  );
}
