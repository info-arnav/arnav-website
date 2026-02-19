import Link from 'next/link';
import styles from './nav.module.css';

const navItems = [{ href: '/', label: 'Home' }];

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <div className={styles.left}>
            <Link href="/" aria-label="Home">
              <span className={styles.logo}>
                <span className={styles.logoMiddle}>
                  <span className={styles.logoInner} />
                </span>
              </span>
            </Link>
          </div>

          <ul className={styles.linkList}>
            {navItems.map((item) => (
              <li key={item.href} className={styles.linkItem}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
