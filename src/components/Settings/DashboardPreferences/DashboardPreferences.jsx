import { useState } from 'react';

import SectionHeader from '../../Shared/SectionHeader/SectionHeader';
import { initialDashboardPreferences } from '../../../data/settingsData';

import styles from './DashboardPreferences.module.css';

export default function DashboardPreferences() {
  const [preferences, setPreferences] = useState(initialDashboardPreferences);
  const [feedback, setFeedback] = useState('');

  const handleFieldChange = (event) => {
    const { name, type, checked, value } = event.target;
    setPreferences((currentPreferences) => ({
      ...currentPreferences,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setFeedback('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback('Dashboard preferences saved for this demo session only.');
  };

  return (
    <section className={styles.card} aria-label="Dashboard preferences" data-animate="reveal">
      <SectionHeader
        eyebrow="Workspace"
        title="Dashboard preferences"
        description="Set the default context and information density for your workspace."
      />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.selectFields}>
          <label>
            <span>Default reporting range</span>
            <select name="dateRange" value={preferences.dateRange} onChange={handleFieldChange}>
              <option value="7-days">Last 7 days</option>
              <option value="30-days">Last 30 days</option>
              <option value="90-days">Last 90 days</option>
              <option value="year">Current year</option>
            </select>
          </label>
          <label>
            <span>Landing view</span>
            <select name="landingView" value={preferences.landingView} onChange={handleFieldChange}>
              <option value="analytics">Analytics overview</option>
              <option value="products">Product catalog</option>
              <option value="customers">Customer directory</option>
            </select>
          </label>
        </div>

        <div className={styles.options}>
          <label htmlFor="show-comparisons">
            <span>
              <strong>Show period comparisons</strong>
              <small>Include previous-period trends beside key metrics.</small>
            </span>
            <input
              id="show-comparisons"
              type="checkbox"
              name="showComparisons"
              checked={preferences.showComparisons}
              onChange={handleFieldChange}
            />
          </label>
          <label htmlFor="compact-tables">
            <span>
              <strong>Compact table rows</strong>
              <small>Fit more records on screen while keeping controls accessible.</small>
            </span>
            <input
              id="compact-tables"
              type="checkbox"
              name="compactTables"
              checked={preferences.compactTables}
              onChange={handleFieldChange}
            />
          </label>
        </div>

        <div className={styles.actions}>
          <p role="status" aria-live="polite">
            {feedback || 'These demo choices reset when the page is refreshed.'}
          </p>
          <button type="submit">Save dashboard</button>
        </div>
      </form>
    </section>
  );
}
