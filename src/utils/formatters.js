export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_CURRENCY = 'USD';

export const formatCurrency = (value, options = {}) =>
  new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat(DEFAULT_LOCALE, { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const formatNumber = (value) => new Intl.NumberFormat(DEFAULT_LOCALE).format(value);

export const formatPercentage = (value, options = {}) =>
  new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'percent',
    maximumFractionDigits: 1,
    ...options,
  }).format(value / 100);

export const formatDate = (value, options = {}) => new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
  ...options,
}).format(new Date(value));

export const formatMonth = (value) => new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(value));
