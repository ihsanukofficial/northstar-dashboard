import { useEffect, useState } from 'react';

import SectionHeader from '../../Shared/SectionHeader/SectionHeader';
import StatusBadge from '../../Shared/StatusBadge/StatusBadge';
import { applyTheme, getStoredTheme } from '../../../utils/theme';

import styles from './AppearanceSettings.module.css';

export default function AppearanceSettings() {
  const [theme, setTheme] = useState(getStoredTheme);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme);
    const persisted = applyTheme(nextTheme, { persist: true });
    if (persisted) {
      setFeedback(`${nextTheme === 'dark' ? 'Dark' : 'Light'} theme applied and saved on this device.`);
    } else {
      setFeedback(`${nextTheme === 'dark' ? 'Dark' : 'Light'} theme applied for this visit; browser storage is unavailable.`);
    }
  };

  return (
    <section className={styles.card} aria-label="Appearance settings" data-animate="reveal">
      <SectionHeader
        eyebrow="Display"
        title="Appearance"
        description="Choose the interface contrast that feels most comfortable."
        action={<StatusBadge status="Active" />}
      />

      <fieldset className={styles.themeChoices}>
        <legend className="visually-hidden">Color theme</legend>
        <label className={theme === 'light' ? styles.selected : ''}>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={() => handleThemeChange('light')}
          />
          <span className={`${styles.preview} ${styles.lightPreview}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className={styles.choiceText}>
            <strong>Light</strong>
            <small>Bright, crisp surfaces</small>
          </span>
          <i className="ri-check-line" aria-hidden="true" />
        </label>

        <label className={theme === 'dark' ? styles.selected : ''}>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={() => handleThemeChange('dark')}
          />
          <span className={`${styles.preview} ${styles.darkPreview}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className={styles.choiceText}>
            <strong>Dark</strong>
            <small>Low-glare workspace</small>
          </span>
          <i className="ri-check-line" aria-hidden="true" />
        </label>
      </fieldset>

      <p className={styles.storageNote}>
        <i className="ri-device-line" aria-hidden="true" />
        Theme is the only setting on this page stored in this browser.
      </p>
      <p className={styles.feedback} role="status" aria-live="polite">{feedback}</p>
    </section>
  );
}
