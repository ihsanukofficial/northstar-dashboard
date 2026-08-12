export const roundCurrency = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export const safePercentage = (part, total) => {
  if (!total) return part ? 100 : 0;
  return (part / total) * 100;
};

export const clampPercentage = (part, total) => Math.min(100, Math.max(0, safePercentage(part, total)));

export const calculateGrowthRate = (currentValue, previousValue) => {
  if (!previousValue) return currentValue ? 100 : 0;
  return ((currentValue - previousValue) / previousValue) * 100;
};

export const calculateOrderSubtotal = (items) => roundCurrency(
  items.reduce((total, item) => total + item.quantity * item.unitPrice, 0),
);

export const calculateOrderTotal = (order, items) => {
  const subtotal = calculateOrderSubtotal(items);
  const discount = subtotal * (order.discountRate ?? 0);
  const tax = (subtotal - discount) * (order.taxRate ?? 0);
  return roundCurrency(subtotal - discount + tax + (order.shipping ?? 0));
};

export const toMonthKey = (value) => new Date(value).toISOString().slice(0, 7);

export const createMonthRange = (endDate, count = 12) => {
  const end = new Date(endDate);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - count + index + 1, 1));
    return date.toISOString().slice(0, 7);
  });
};
