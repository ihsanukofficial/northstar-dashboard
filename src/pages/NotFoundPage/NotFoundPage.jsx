import { useRef } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';
import { usePageReveal } from '../../hooks/usePageReveal';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const pageRef = useRef(null);
  usePageReveal(pageRef);

  return (
    <section className={styles.page} ref={pageRef} data-animate="intro">
      <div className={styles.code} aria-hidden="true">404</div>
      <span className={styles.icon}><i className="ri-compass-3-line" aria-hidden="true" /></span>
      <p className={styles.eyebrow}>Lost in the workspace?</p>
      <h2>This page is off the map.</h2>
      <p className={styles.description}>The address may have changed, or the page may never have existed.</p>
      <Link to={ROUTES.analytics}>
        <i className="ri-arrow-left-line" aria-hidden="true" />
        Back to analytics
      </Link>
    </section>
  );
}
