import { useState } from 'react';

import Avatar from '../../Shared/Avatar/Avatar';
import SectionHeader from '../../Shared/SectionHeader/SectionHeader';
import { initialProfile } from '../../../data/settingsData';

import styles from './ProfileSettings.module.css';

export default function ProfileSettings() {
  const [profile, setProfile] = useState(initialProfile);
  const [feedback, setFeedback] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
    setFeedback('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback('Profile changes saved for this demo session only.');
  };

  return (
    <section className={styles.card} aria-label="Profile settings" data-animate="reveal">
      <SectionHeader
        eyebrow="Account"
        title="Profile details"
        description="Keep the workspace identity and contact details shown to your team up to date."
      />

      <div className={styles.identity}>
        <Avatar src="/users/10.png" name={profile.name} size="large" status="online" />
        <div>
          <strong>{profile.name}</strong>
          <p>The profile image is managed by your workspace administrator.</p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
          <label>
            <span>Full name</span>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </label>
          <label>
            <span>Email address</span>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>Role</span>
            <input
              type="text"
              name="role"
              value={profile.role}
              onChange={handleChange}
              autoComplete="organization-title"
              required
            />
          </label>
          <label>
            <span>Timezone</span>
            <select name="timezone" value={profile.timezone} onChange={handleChange}>
              <option value="Asia/Karachi">Pakistan Standard Time (UTC+5)</option>
              <option value="Europe/London">London (UTC+0)</option>
              <option value="America/New_York">New York (UTC-5)</option>
              <option value="Asia/Singapore">Singapore (UTC+8)</option>
            </select>
          </label>
        </div>

        <div className={styles.actions}>
          <p role="status" aria-live="polite">
            {feedback || 'Unsaved profile changes reset when this demo is refreshed.'}
          </p>
          <button type="submit">Save profile</button>
        </div>
      </form>
    </section>
  );
}
