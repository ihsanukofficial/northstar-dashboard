import { Line } from 'react-chartjs-2';

import { createCartesianOptions, getCssToken } from '../../../utils/chartOptions';
import styles from './UserActivityChart.module.css';

export default function UserActivityChart({ data }) {
  const { description, points, summary, title, trend } = data;
  const lineColor = getCssToken('--chart-teal', '#15a69a');
  const fillColor = getCssToken('--chart-teal-soft', '#c9efeb');
  const chartData = {
    labels: points.map((item) => item.label),
    datasets: [{
      label: 'Active customers',
      data: points.map((item) => item.value),
      borderColor: lineColor,
      backgroundColor: fillColor,
      fill: true,
      tension: 0.42,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: lineColor,
      pointHoverBorderColor: getCssToken('--color-surface', '#ffffff'),
      pointHoverBorderWidth: 3,
      borderWidth: 3,
    }],
  };

  return (
    <article className={styles.card}>
      <header>
        <div>
          <p>{description}</p>
          <h2>{title}</h2>
        </div>
        {trend ? (
          <div className={styles.trend} data-direction={trend.direction}>
            <i className={trend.direction === 'down' ? 'ri-arrow-down-line' : trend.direction === 'flat' ? 'ri-subtract-line' : 'ri-arrow-up-line'} aria-hidden="true" />
            {trend.value}
          </div>
        ) : (
          <div className={styles.legend}><span /> Active customers</div>
        )}
      </header>
      <div className={styles.chart}>
        <Line data={chartData} options={createCartesianOptions({ fill: true })} aria-label="Overall user activity line chart" />
      </div>
      <p className="visually-hidden">{summary}</p>
    </article>
  );
}
