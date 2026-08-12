import styles from './MetricCard.module.css';

export default function MetricCard({ label, value, detail, icon, tone = 'primary', trend }) {
  const trendClass = trend?.direction === 'down'
    ? styles.negative
    : trend?.direction === 'flat'
      ? styles.neutral
      : styles.positive;
  const trendIcon = trend?.direction === 'down'
    ? 'ri-arrow-down-line'
    : trend?.direction === 'flat'
      ? 'ri-subtract-line'
      : 'ri-arrow-up-line';

  return (
    <article className={styles.card}>
      <div className={`${styles.icon} ${styles[tone]}`} aria-hidden="true">
        <i className={icon} />
      </div>
      <div className={styles.copy}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
      </div>
      <div className={styles.footer}>
        {trend ? (
          <span className={trendClass}>
            <i className={trendIcon} aria-hidden="true" />
            {trend.value}
          </span>
        ) : null}
        <span>{detail}</span>
      </div>
    </article>
  );
}
