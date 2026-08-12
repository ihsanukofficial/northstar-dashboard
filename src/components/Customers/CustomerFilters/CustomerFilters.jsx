import SearchField from '../../Shared/SearchField/SearchField';

import styles from './CustomerFilters.module.css';

export default function CustomerFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  segment,
  onSegmentChange,
  statuses,
  segments,
  resultCount,
  totalCount,
  hasFilters,
  onReset,
}) {
  const resultLabel = `${resultCount} ${resultCount === 1 ? 'customer' : 'customers'}`;

  return (
    <section className={styles.toolbar} aria-labelledby="customer-filters-title" data-animate="reveal">
      <h2 id="customer-filters-title" className="visually-hidden">
        Filter customers
      </h2>

      <div className={styles.controls}>
        <div className={styles.search}>
          <SearchField
            id="customer-search"
            label="Search customers"
            value={query}
            onChange={onQueryChange}
            placeholder="Search name, email, or location"
          />
        </div>

        <label className={styles.selectField} htmlFor="customer-status">
          <span>Status</span>
          <select id="customer-status" value={status} onChange={(event) => onStatusChange(event.target.value)}>
            <option value="all">All statuses</option>
            {statuses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.selectField} htmlFor="customer-segment">
          <span>Segment</span>
          <select id="customer-segment" value={segment} onChange={(event) => onSegmentChange(event.target.value)}>
            <option value="all">All segments</option>
            {segments.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.summary}>
        <p aria-live="polite">
          Showing <strong>{resultLabel}</strong> of {totalCount}
        </p>
        {hasFilters ? (
          <button className={styles.resetButton} type="button" onClick={onReset}>
            <i className="ri-refresh-line" aria-hidden="true" />
            Reset filters
          </button>
        ) : null}
      </div>
    </section>
  );
}
