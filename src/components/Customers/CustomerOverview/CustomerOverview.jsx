import MetricCard from '../../Shared/MetricCard/MetricCard';

import styles from './CustomerOverview.module.css';

export default function CustomerOverview({ stats }) {
  return (
    <section className={styles.section} aria-label="Customer overview" data-animate="intro">
      {stats.map((stat) => (
        <MetricCard key={stat.label} {...stat} />
      ))}
    </section>
  );
}
