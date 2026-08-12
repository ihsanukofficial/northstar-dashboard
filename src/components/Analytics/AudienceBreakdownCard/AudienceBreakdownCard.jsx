import { Doughnut } from 'react-chartjs-2';

import { createDoughnutOptions, getCssToken } from '../../../utils/chartOptions';
import { formatNumber, formatPercentage } from '../../../utils/formatters';
import styles from './AudienceBreakdownCard.module.css';

export default function AudienceBreakdownCard({ audience }) {
  const segmentColors = audience.segments.map((segment) => getCssToken(segment.colorToken, segment.color));
  const chartData = {
    labels: audience.segments.map((segment) => segment.label),
    datasets: [{
      data: audience.segments.map((segment) => segment.value),
      backgroundColor: segmentColors,
      borderWidth: 0,
      hoverOffset: 3,
    }],
  };

  return (
    <article className={styles.card}>
      <header>
        <div>
          <p>{audience.description}</p>
          <h2>{audience.title}</h2>
        </div>
        <span className={styles.growth}>{audience.growth}</span>
      </header>
      <div className={styles.body}>
        <div className={styles.chartWrap}>
          <Doughnut data={chartData} options={createDoughnutOptions()} aria-label={`${audience.title} breakdown chart`} />
          <div className={styles.chartValue} aria-hidden="true">
            <strong>{formatNumber(audience.value)}</strong>
            <span>Total</span>
          </div>
        </div>
        <ul className={styles.legend} aria-label={`${audience.title} chart legend`}>
          {audience.segments.map((segment, index) => (
            <li key={segment.label}>
              <span className={styles.swatch} style={{ backgroundColor: segmentColors[index] }} />
              <span>{segment.label}</span>
              <strong>{formatPercentage(segment.value)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
