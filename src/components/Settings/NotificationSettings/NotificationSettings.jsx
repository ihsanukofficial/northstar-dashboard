import { useState } from 'react';

import SectionHeader from '../../Shared/SectionHeader/SectionHeader';
import { initialNotificationPreferences, notificationOptions } from '../../../data/settingsData';

import styles from './NotificationSettings.module.css';

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState(initialNotificationPreferences);
  const [feedback, setFeedback] = useState('');

  const handleToggle = (preferenceId) => {
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [preferenceId]: !currentPreferences[preferenceId],
    }));
    setFeedback('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback('Notification choices saved for this demo session only.');
  };

  return (
    <section className={styles.card} aria-label="Notification settings" data-animate="reveal">
      <SectionHeader
        eyebrow="Attention"
        title="Notifications"
        description="Choose which events should interrupt your workflow."
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.options}>
          {notificationOptions.map((option) => (
            <label className={styles.option} key={option.id} htmlFor={`notification-${option.id}`}>
              <span>
                <strong>{option.title}</strong>
                <small id={`notification-${option.id}-description`}>{option.description}</small>
              </span>
              <input
                id={`notification-${option.id}`}
                type="checkbox"
                role="switch"
                checked={preferences[option.id]}
                onChange={() => handleToggle(option.id)}
                aria-describedby={`notification-${option.id}-description`}
              />
            </label>
          ))}
        </div>

        <div className={styles.actions}>
          <p role="status" aria-live="polite">
            {feedback || 'These demo choices reset when the page is refreshed.'}
          </p>
          <button type="submit">Save notifications</button>
        </div>
      </form>
    </section>
  );
}
