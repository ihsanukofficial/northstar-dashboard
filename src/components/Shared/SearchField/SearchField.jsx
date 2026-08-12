import styles from './SearchField.module.css';

export default function SearchField({ id, label = 'Search', value, onChange, placeholder = 'Search' }) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className="visually-hidden">{label}</span>
      <i className="ri-search-line" aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {value ? (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search">
          <i className="ri-close-line" aria-hidden="true" />
        </button>
      ) : null}
    </label>
  );
}
