import {
  FiFacebook,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
} from 'react-icons/fi';
import { siteConfig } from '../../../../lib/profile';
import styles from './footer.module.css';

const footerLinks = [
  { href: siteConfig.social.twitter, label: 'Twitter', icon: FiTwitter },
  { href: siteConfig.social.linkedin, label: 'LinkedIn', icon: FiLinkedin },
  { href: siteConfig.social.github, label: 'GitHub', icon: FiGithub },
  { href: siteConfig.social.instagram, label: 'Instagram', icon: FiInstagram },
  { href: siteConfig.social.facebook, label: 'Facebook', icon: FiFacebook },
];

export default function Footer() {
  return (
    <div className={styles.wrap}>
      <footer className={styles.footer}>
        {footerLinks.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            className={styles.link}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
          >
            <div className={styles.linkInner}>
              <Icon
                className={styles.icon}
                aria-hidden="true"
                focusable="false"
              />
              <p className={styles.label}>{label}</p>
            </div>
          </a>
        ))}
      </footer>
    </div>
  );
}
