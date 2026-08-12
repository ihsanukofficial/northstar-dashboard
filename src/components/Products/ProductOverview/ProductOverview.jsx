import MetricCard from '../../Shared/MetricCard/MetricCard';

import styles from './ProductOverview.module.css';

export default function ProductOverview({ stats }) {
  return (
    <section className={styles.section} aria-label="Product overview" data-animate="intro">
      {stats.map((stat) => (
        <MetricCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
