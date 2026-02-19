'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import styles from './error.module.css';

export default function Error({ error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <h2 className={styles.title}>ERROR XXX</h2>
        <p className={styles.description}>Some Error Occured</p>
      </div>
    </div>
  );
}
