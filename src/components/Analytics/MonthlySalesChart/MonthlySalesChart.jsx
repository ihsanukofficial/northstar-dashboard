import { Bar } from 'react-chartjs-2';

import { createCartesianOptions, getCssToken } from '../../../utils/chartOptions';
import styles from './MonthlySalesChart.module.css';

export default function MonthlySalesChart({ data }) {
  const { description, points, summary, title, trend } = data;
  const values = points.map((item) => item.value);
  const rawMax = Math.max(...values, 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawMax));
  const trackCeiling = Math.ceil(rawMax / (magnitude / 2)) * (magnitude / 2);

  const chartData = {
    labels: points.map((item) => item.label),
    datasets: [
      {
        data: values,
        backgroundColor: getCssToken('--chart-primary', '#5b5ce2'),
        borderRadius: 7,
        borderSkipped: false,
        barPercentage: 0.48,
        categoryPercentage: 0.72,
        order: 1,
      },
      {
        data: points.map(() => trackCeiling),
        backgroundColor: getCssToken('--chart-primary-soft', '#d9dcff'),
        borderRadius: 7,
        borderSkipped: false,
        barPercentage: 0.48,
        categoryPercentage: 0.72,
        grouped: false,
        order: 2,
      },
    ],
  };

  const options = createCartesianOptions({ currency: true });
  options.plugins.tooltip.filter = (item) => item.datasetIndex === 0;

  return (
    <article className={styles.card}>
      <header>
        <div>
          <p>{description}</p>
          <h2>{title}</h2>
        </div>
        <span data-direction={trend.direction}>
          <i className={trend.direction === 'down' ? 'ri-arrow-down-line' : trend.direction === 'flat' ? 'ri-subtract-line' : 'ri-arrow-up-line'} aria-hidden="true" />
          {trend.value}
        </span>
      </header>
      <div className={styles.chart}>
        <Bar data={chartData} options={options} aria-label="Monthly sales bar chart" />
      </div>
      <p className="visually-hidden">{summary}</p>
    </article>
  );
}
