import { useRef } from 'react';

import AppearanceSettings from '../../components/Settings/AppearanceSettings/AppearanceSettings';
import DashboardPreferences from '../../components/Settings/DashboardPreferences/DashboardPreferences';
import NotificationSettings from '../../components/Settings/NotificationSettings/NotificationSettings';
import ProfileSettings from '../../components/Settings/ProfileSettings/ProfileSettings';
import { usePageReveal } from '../../hooks/usePageReveal';

import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  const pageRef = useRef(null);
  usePageReveal(pageRef);

  return (
    <section className={styles.page} ref={pageRef} aria-labelledby="settings-page-title">
      <header className={styles.pageHeader} data-animate="intro">
        <p className={styles.eyebrow}>Workspace controls</p>
        <h2 id="settings-page-title">Make the workspace yours</h2>
        <p className={styles.description}>
          Personalize your workspace while keeping every demo-only choice transparent.
        </p>
      </header>

      <div className={styles.settingsGrid}>
        <ProfileSettings />
        <AppearanceSettings />
        <NotificationSettings />
        <DashboardPreferences />
      </div>
    </section>
  );
}
