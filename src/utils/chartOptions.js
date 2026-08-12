import { formatCompactNumber, formatCurrency } from './formatters';

export function getCssToken(name, fallback) {
  if (typeof document === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export const baseTooltip = {
  backgroundColor: '#172033',
  titleColor: '#ffffff',
  bodyColor: '#ffffff',
  padding: 12,
  cornerRadius: 10,
  displayColors: false,
};

export function createCartesianOptions({ currency = false, fill = false } = {}) {
  const axisColor = getCssToken('--color-text-muted', '#7d889a');
  const gridColor = getCssToken('--color-border', '#e3e8ef');
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...baseTooltip,
        callbacks: {
          label: (context) => currency ? formatCurrency(context.raw) : formatCompactNumber(context.raw),
        },
      },
      filler: { propagate: fill },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: { color: axisColor, font: { size: 11 }, maxRotation: 0, autoSkipPadding: 8 },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: gridColor, drawTicks: false },
        ticks: {
          color: axisColor,
          padding: 10,
          font: { size: 11 },
          callback: (value) => currency ? `$${formatCompactNumber(value)}` : formatCompactNumber(value),
        },
      },
    },
  };
}

export function createDoughnutOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: { legend: { display: false }, tooltip: baseTooltip },
  };
}
