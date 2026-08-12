import { Doughnut } from 'react-chartjs-2';

import { getCssToken } from '../../../utils/chartOptions';
import { formatPercentage } from '../../../utils/formatters';
import styles from './FinancialProgressCard.module.css';

const progressOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '78%',
  rotation: -90,
  circumference: 360,
  plugins: { legend: { display: false }, tooltip: { enabled: false } },
};

export default function FinancialProgressCard({ item }) {
  const percentage = Math.min(100, Math.max(0, item.percentage));
  const percentageLabel = formatPercentage(percentage);
  const progressColor = getCssToken(item.colorToken, item.color);
  const chartData = {
    labels: ['Complete', 'Remaining'],
    datasets: [{
      data: [percentage, 100 - percentage],
      backgroundColor: [progressColor, getCssToken('--color-surface-strong', '#eef2f7')],
      borderWidth: 0,
      borderRadius: 12,
    }],
  };

  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <span className={styles.icon} aria-hidden="true"><i className={item.icon} /></span>
        <p>{item.label}</p>
        <strong>{item.value}</strong>
        <span>{item.detail}</span>
      </div>
      <div className={styles.chartWrap}>
        <Doughnut data={chartData} options={progressOptions} aria-label={`${item.label}: ${percentageLabel} complete`} />
        <strong>{percentageLabel}</strong>
      </div>
    </article>
  );
}
