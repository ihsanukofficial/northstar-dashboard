import styles from './StatusBadge.module.css';

const toneByStatus = {
  active: 'success',
  delivered: 'success',
  'in stock': 'success',
  paid: 'success',
  online: 'success',
  processed: 'warning',
  pending: 'warning',
  'low stock': 'warning',
  away: 'warning',
  cancelled: 'danger',
  inactive: 'danger',
  'out of stock': 'danger',
  vip: 'info',
  new: 'info',
  unread: 'info',
};

export default function StatusBadge({ status }) {
  const normalizedStatus = status.toLowerCase();
  const tone = toneByStatus[normalizedStatus] ?? (normalizedStatus.includes('unread') ? 'info' : 'neutral');
  return <span className={`${styles.badge} ${styles[tone]}`}>{status}</span>;
}
