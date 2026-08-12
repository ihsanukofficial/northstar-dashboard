import SearchField from '../../Shared/SearchField/SearchField';

import styles from './ProductFilters.module.css';

export default function ProductFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  categories,
  statuses,
  resultCount,
  totalCount,
  hasFilters,
  onReset,
}) {
  const resultLabel = `${resultCount} ${resultCount === 1 ? 'product' : 'products'}`;

  return (
    <section className={styles.toolbar} aria-labelledby="product-filters-title" data-animate="reveal">
      <h2 id="product-filters-title" className="visually-hidden">
        Filter products
      </h2>

      <div className={styles.controls}>
        <div className={styles.search}>
          <SearchField
            id="product-search"
            label="Search products"
            value={query}
            onChange={onQueryChange}
            placeholder="Search name, SKU, or category"
          />
        </div>

        <label className={styles.selectField} htmlFor="product-category">
          <span>Category</span>
          <select id="product-category" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.selectField} htmlFor="product-status">
          <span>Status</span>
          <select id="product-status" value={status} onChange={(event) => onStatusChange(event.target.value)}>
            <option value="all">All statuses</option>
            {statuses.map((option) => (
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
