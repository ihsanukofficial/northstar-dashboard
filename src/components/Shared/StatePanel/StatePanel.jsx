import styles from './StatePanel.module.css';

export default function StatePanel({
  variant = 'empty',
  icon = 'ri-inbox-2-line',
  title,
  description,
  action,
}) {
  return (
    <div className={`${styles.panel} ${styles[variant]}`} role={variant === 'error' ? 'alert' : 'status'}>
      {variant === 'loading' ? <span className={styles.spinner} aria-hidden="true" /> : <i className={icon} aria-hidden="true" />}
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
