import styles from './Avatar.module.css';

export default function Avatar({ src, name, size = 'medium', status }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <span
      className={`${styles.avatar} ${styles[size]}`}
      aria-hidden={status ? undefined : 'true'}
      aria-label={status ? `${name} is ${status}` : undefined}
      role={status ? 'img' : undefined}
    >
      {src ? <img src={src} alt="" /> : <span>{initials}</span>}
      {status ? <span className={`${styles.status} ${styles[status]}`} /> : null}
    </span>
  );
}
