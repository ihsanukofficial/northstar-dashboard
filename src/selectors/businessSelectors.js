import {
  businessData,
  DATASET_AS_OF,
  REPORTING_PERIOD,
} from '../data/businessData';
import {
  calculateGrowthRate,
  calculateOrderTotal,
  clampPercentage,
  createMonthRange,
  roundCurrency,
  safePercentage,
  toMonthKey,
} from '../utils/businessCalculations';
import {
  formatCompactNumber,
  formatCurrency,
  formatDate,
  formatMonth,
  formatNumber,
  formatPercentage,
} from '../utils/formatters';

export const ALL_FILTER = 'all';

const isWithin = (value, start, end) => {
  const time = new Date(value).getTime();
  return time >= new Date(start).getTime() && time < new Date(end).getTime();
};

const getPriorMonthPeriod = ({ start, end }) => {
  const currentStart = new Date(start);
  const currentEnd = new Date(end);
  return {
    start: new Date(Date.UTC(currentStart.getUTCFullYear(), currentStart.getUTCMonth() - 1, currentStart.getUTCDate())).toISOString(),
    end: new Date(Date.UTC(currentEnd.getUTCFullYear(), currentEnd.getUTCMonth() - 1, currentEnd.getUTCDate())).toISOString(),
  };
};

const formatPeriodRange = ({ start, end }) => {
  const startDate = new Date(start);
  const endDate = new Date(new Date(end).getTime() - 1);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(startDate);
  const startDay = String(startDate.getUTCDate()).padStart(2, '0');
  const endDay = String(endDate.getUTCDate()).padStart(2, '0');
  return `${month} ${startDay}–${endDay}`;
};

const formatTrend = (current, previous) => {
  const growth = calculateGrowthRate(current, previous);
  return {
    direction: Math.abs(growth) < 0.05 ? 'flat' : growth < 0 ? 'down' : 'up',
    value: formatPercentage(Math.abs(growth)),
  };
};

const orderItemsByOrder = (orderItems) => orderItems.reduce((groups, item) => {
  const next = groups;
  (next[item.orderId] ??= []).push(item);
  return next;
}, {});

export const selectOrderItems = (orderId, data = businessData) =>
  data.orderItems.filter((item) => item.orderId === orderId);

export const selectOrderTotal = (order, data = businessData) =>
  calculateOrderTotal(order, selectOrderItems(order.id, data));

export const selectOrdersWithDetails = (data = businessData) => {
  const customersById = Object.fromEntries(data.customers.map((customer) => [customer.id, customer]));
  const itemsByOrder = orderItemsByOrder(data.orderItems);
  return data.orders.map((order) => ({
    ...order,
    customer: customersById[order.customerId],
    items: itemsByOrder[order.id] ?? [],
    total: calculateOrderTotal(order, itemsByOrder[order.id] ?? []),
  }));
};

export const isRevenueOrder = (order) =>
  order.status === 'Delivered' && order.paymentStatus === 'Paid' && Boolean(order.paidAt);

const revenueForPeriod = (orders, period) => roundCurrency(orders
  .filter((order) => isRevenueOrder(order) && isWithin(order.paidAt, period.start, period.end))
  .reduce((total, order) => total + order.total, 0));

const ordersForPeriod = (orders, period) => orders.filter((order) =>
  isWithin(order.createdAt, period.start, period.end));

export const selectMonthlyRevenue = (data = businessData, asOf = DATASET_AS_OF) => {
  const orders = selectOrdersWithDetails(data);
  const months = createMonthRange(asOf, 12);
  return months.map((key) => ({
    key,
    label: new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(new Date(`${key}-01T00:00:00.000Z`)),
    value: roundCurrency(orders
      .filter((order) => isRevenueOrder(order) && toMonthKey(order.paidAt) === key)
      .reduce((total, order) => total + order.total, 0)),
  }));
};

export const selectOrderStatusBreakdown = (data = businessData, period = REPORTING_PERIOD) => {
  const periodOrders = ordersForPeriod(data.orders, period);
  return ['Delivered', 'Processed', 'Pending', 'Cancelled'].map((status) => ({
    status,
    count: periodOrders.filter((order) => order.status === status).length,
  }));
};

const productSoldQuantities = (data = businessData) => {
  const revenueOrderIds = new Set(data.orders.filter(isRevenueOrder).map((order) => order.id));
  return data.orderItems.reduce((totals, item) => {
    if (revenueOrderIds.has(item.orderId)) totals[item.productId] = (totals[item.productId] ?? 0) + item.quantity;
    return totals;
  }, {});
};

const productRevenue = (data = businessData) => {
  const revenueOrderIds = new Set(data.orders.filter(isRevenueOrder).map((order) => order.id));
  return data.orderItems.reduce((totals, item) => {
    if (revenueOrderIds.has(item.orderId)) {
      totals[item.productId] = (totals[item.productId] ?? 0) + item.quantity * item.unitPrice;
    }
    return totals;
  }, {});
};

const productStatus = (stock, threshold) => {
  if (stock === 0) return 'Out of stock';
  if (stock <= threshold) return 'Low stock';
  return 'In stock';
};

export const selectProductsWithStats = (data = businessData) => {
  const soldByProduct = productSoldQuantities(data);
  const revenueByProduct = productRevenue(data);
  return data.products.map((product) => {
    const sales = soldByProduct[product.id] ?? 0;
    const stock = product.startingStock + product.stockReceived - sales - product.damagedStock;
    return {
      ...product,
      stock,
      sales,
      revenue: roundCurrency(revenueByProduct[product.id] ?? 0),
      status: productStatus(stock, product.lowStockThreshold),
      updated: formatDate(product.updatedAt),
    };
  });
};

export const selectProductStats = (data = businessData) => {
  const products = selectProductsWithStats(data);
  const healthy = products.filter((product) => product.status === 'In stock').length;
  const low = products.filter((product) => product.status === 'Low stock').length;
  const units = products.reduce((total, product) => total + product.stock, 0);
  const inventoryValue = products.reduce((total, product) => total + product.stock * product.price, 0);
  return [
    { label: 'Total products', value: formatNumber(products.length), detail: `Across ${new Set(products.map((product) => product.category)).size} categories`, icon: 'ri-box-3-line', tone: 'primary' },
    { label: 'Healthy stock', value: formatNumber(healthy), detail: 'Ready to fulfil', icon: 'ri-checkbox-circle-line', tone: 'success' },
    { label: 'Low stock', value: formatNumber(low), detail: 'Derived from live inventory', icon: 'ri-alarm-warning-line', tone: 'warning' },
    { label: 'Inventory value', value: formatCurrency(inventoryValue), detail: `${formatNumber(units)} units on hand`, icon: 'ri-funds-box-line', tone: 'info' },
  ];
};

export const selectProductsPageData = (data = businessData) => {
  const products = selectProductsWithStats(data);
  return {
    products,
    productStats: selectProductStats(data),
    productCategories: [...new Set(products.map((product) => product.category))].sort(),
    productStatuses: ['In stock', 'Low stock', 'Out of stock'],
  };
};

export const selectCustomersWithStats = (data = businessData) => {
  const orders = selectOrdersWithDetails(data);
  return data.customers.map((customer) => {
    const customerOrders = orders.filter((order) => order.customerId === customer.id);
    const revenueOrders = customerOrders.filter(isRevenueOrder);
    const latestOrder = [...customerOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const spend = roundCurrency(revenueOrders.reduce((total, order) => total + order.total, 0));
    return {
      ...customer,
      orders: customerOrders.length,
      completedOrders: revenueOrders.length,
      cancelledOrders: customerOrders.filter((order) => order.status === 'Cancelled').length,
      spend,
      averageOrderValue: revenueOrders.length ? roundCurrency(spend / revenueOrders.length) : 0,
      lastOrder: latestOrder ? formatDate(latestOrder.createdAt) : 'No orders yet',
      lastOrderAt: latestOrder?.createdAt ?? null,
      joined: formatMonth(customer.joinedAt),
    };
  });
};

export const selectCustomerStats = (data = businessData) => {
  const customers = selectCustomersWithStats(data);
  const orders = selectOrdersWithDetails(data).filter(isRevenueOrder);
  const revenue = orders.reduce((total, order) => total + order.total, 0);
  const active = customers.filter((customer) => customer.status !== 'Inactive').length;
  const repeat = customers.filter((customer) => customer.completedOrders > 1).length;
  return [
    { label: 'Total customers', value: formatNumber(customers.length), detail: `Across ${new Set(customers.map((customer) => customer.location)).size} markets`, icon: 'ri-group-line', tone: 'primary' },
    { label: 'Active accounts', value: formatNumber(active), detail: `${formatPercentage(safePercentage(active, customers.length))} of customers`, icon: 'ri-user-follow-line', tone: 'success' },
    { label: 'Average order', value: formatCurrency(orders.length ? revenue / orders.length : 0), detail: 'Completed paid orders', icon: 'ri-shopping-basket-2-line', tone: 'info' },
    { label: 'Repeat customers', value: formatPercentage(safePercentage(repeat, customers.length)), detail: 'More than one completed order', icon: 'ri-loop-right-line', tone: 'warning' },
  ];
};

export const selectCustomersPageData = (data = businessData) => {
  const customers = selectCustomersWithStats(data);
  return {
    customers,
    customerStats: selectCustomerStats(data),
    customerSegments: [...new Set(customers.map((customer) => customer.segment))].sort(),
    customerStatuses: ['Active', 'VIP', 'New', 'Inactive'],
  };
};

const buildAudience = (data, period) => {
  const end = new Date(period.end);
  const inactiveCutoff = new Date(end);
  inactiveCutoff.setUTCDate(inactiveCutoff.getUTCDate() - 90);
  const allOrders = data.orders.filter((order) => order.status !== 'Cancelled');
  const newestOrderByCustomer = new Map();
  allOrders.forEach((order) => {
    if (!newestOrderByCustomer.has(order.customerId) || new Date(order.createdAt) > new Date(newestOrderByCustomer.get(order.customerId))) {
      newestOrderByCustomer.set(order.customerId, order.createdAt);
    }
  });
  const counts = { New: 0, Returning: 0, Inactive: 0 };
  data.customers.forEach((customer) => {
    if (isWithin(customer.joinedAt, period.start, period.end)) counts.New += 1;
    else if (customer.status === 'Inactive' || !newestOrderByCustomer.get(customer.id) || new Date(newestOrderByCustomer.get(customer.id)) < inactiveCutoff) counts.Inactive += 1;
    else counts.Returning += 1;
  });
  const colors = { New: '--chart-primary', Returning: '--chart-teal', Inactive: '--chart-slate' };
  const customerSegments = Object.entries(counts).map(([label, count]) => ({ label, count, value: safePercentage(count, data.customers.length), colorToken: colors[label] }));
  const planCounts = data.customers.reduce((totals, customer) => {
    totals[customer.subscriptionPlan] = (totals[customer.subscriptionPlan] ?? 0) + 1;
    return totals;
  }, {});
  const subscriptionSegments = Object.entries(planCounts).map(([label, count], index) => ({
    label,
    count,
    value: safePercentage(count, data.customers.length),
    colorToken: ['--chart-primary', '--chart-teal', '--chart-amber', '--chart-coral', '--chart-slate'][index],
  }));
  const paidSubscribers = (planCounts.Basic ?? 0) + (planCounts.Premium ?? 0) + (planCounts.Enterprise ?? 0);
  return [
    { id: 'customers', title: 'Customers', description: 'Account activity', value: data.customers.length, growth: `${counts.New} new`, segments: customerSegments },
    { id: 'subscriptions', title: 'Subscriptions', description: 'Plan distribution', value: data.customers.length, growth: `${paidSubscribers} paid`, segments: subscriptionSegments },
  ];
};

const monthlyActiveCustomers = (data, asOf) => createMonthRange(asOf, 12).map((key) => {
  const activeIds = new Set();
  data.orders.filter((order) => order.status !== 'Cancelled' && toMonthKey(order.createdAt) === key)
    .forEach((order) => activeIds.add(order.customerId));
  data.messages.filter((message) => toMonthKey(message.sentAt) === key)
    .forEach((message) => activeIds.add(message.customerId));
  return {
    key,
    label: new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(new Date(`${key}-01T00:00:00.000Z`)),
    value: activeIds.size,
  };
});

const seriesSummary = (points, noun) => {
  const nonEmpty = points.filter((point) => point.value > 0);
  if (!nonEmpty.length) return `No ${noun} were recorded in this reporting range.`;
  const highest = [...nonEmpty].sort((a, b) => b.value - a.value)[0];
  const latest = points.at(-1);
  return `${noun} peaked in ${highest.label} at ${formatCompactNumber(highest.value)}; ${latest.label} currently records ${formatCompactNumber(latest.value)}.`;
};

export const selectAnalyticsPageData = (data = businessData, period = REPORTING_PERIOD) => {
  const detailedOrders = selectOrdersWithDetails(data);
  const priorPeriod = getPriorMonthPeriod(period);
  const periodRangeLabel = formatPeriodRange(period);
  const priorRangeLabel = formatPeriodRange(priorPeriod);
  const currentOrders = ordersForPeriod(detailedOrders, period);
  const priorOrders = ordersForPeriod(detailedOrders, priorPeriod);
  const currentApproved = currentOrders.filter((order) => order.approvedAt).length;
  const priorApproved = priorOrders.filter((order) => order.approvedAt).length;
  const currentRevenue = revenueForPeriod(detailedOrders, period);
  const priorRevenue = revenueForPeriod(detailedOrders, priorPeriod);
  const currentRevenueOrders = detailedOrders.filter((order) =>
    isRevenueOrder(order) && isWithin(order.paidAt, period.start, period.end));
  const priorRevenueOrders = detailedOrders.filter((order) =>
    isRevenueOrder(order) && isWithin(order.paidAt, priorPeriod.start, priorPeriod.end));
  const approvalRate = safePercentage(currentApproved, currentOrders.length);
  const priorApprovalRate = safePercentage(priorApproved, priorOrders.length);
  const averageOrder = currentRevenueOrders.length ? currentRevenue / currentRevenueOrders.length : 0;
  const priorAverageOrder = priorRevenueOrders.length ? priorRevenue / priorRevenueOrders.length : 0;
  const chartAsOf = new Date(new Date(period.end).getTime() - 1).toISOString();
  const monthlySales = selectMonthlyRevenue(data, chartAsOf);
  const salesTrend = formatTrend(currentRevenue, priorRevenue);
  const userActivity = monthlyActiveCustomers(data, chartAsOf);
  const currentActiveCustomers = userActivity.at(-1)?.value ?? 0;
  const priorWindowActiveCustomers = new Set([
    ...data.orders
      .filter((order) => order.status !== 'Cancelled' && isWithin(order.createdAt, priorPeriod.start, priorPeriod.end))
      .map((order) => order.customerId),
    ...data.messages
      .filter((message) => isWithin(message.sentAt, priorPeriod.start, priorPeriod.end))
      .map((message) => message.customerId),
  ]).size;
  const ytdStart = `${new Date(period.start).getUTCFullYear()}-01-01T00:00:00.000Z`;
  const ytdOrders = detailedOrders.filter((order) => isWithin(order.createdAt, ytdStart, period.end) && order.status !== 'Cancelled');
  const paidInvoices = ytdOrders.filter((order) =>
    order.paymentStatus === 'Paid' && order.paidAt && isWithin(order.paidAt, ytdStart, period.end));
  const paidAmount = roundCurrency(paidInvoices.reduce((total, order) => total + order.total, 0));
  const invoiceAmount = roundCurrency(ytdOrders.reduce((total, order) => total + order.total, 0));
  const awaitingAmount = roundCurrency(invoiceAmount - paidAmount);
  const ytdRevenue = revenueForPeriod(detailedOrders, { start: ytdStart, end: period.end });

  const metrics = [
    { id: 'monthly-orders', label: 'Monthly orders', value: formatNumber(currentOrders.length), detail: `${periodRangeLabel} vs ${priorRangeLabel}`, icon: 'ri-stack-line', tone: 'primary', trend: formatTrend(currentOrders.length, priorOrders.length) },
    { id: 'approval-rate', label: 'Approval rate', value: formatPercentage(approvalRate), detail: `${currentApproved} of ${currentOrders.length} submitted orders`, icon: 'ri-checkbox-circle-line', tone: 'success', trend: formatTrend(approvalRate, priorApprovalRate) },
    { id: 'monthly-revenue', label: 'Monthly revenue', value: formatCurrency(currentRevenue), detail: `Completed and paid, ${periodRangeLabel}`, icon: 'ri-money-dollar-circle-line', tone: 'warning', trend: formatTrend(currentRevenue, priorRevenue) },
    { id: 'average-order', label: 'Average order', value: formatCurrency(averageOrder), detail: 'Completed paid orders this month', icon: 'ri-bank-card-line', tone: 'info', trend: formatTrend(averageOrder, priorAverageOrder) },
  ];

  const recentOrders = [...detailedOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
    .map((order) => ({
      id: order.id.toUpperCase(),
      customerId: order.customerId,
      customer: order.customer.name,
      avatar: order.customer.avatar,
      location: order.customer.location,
      date: formatDate(order.createdAt),
      dateTime: order.createdAt,
      status: order.status,
      amount: order.total,
    }));

  return {
    period: { eyebrow: formatMonth(period.start), rangeLabel: periodRangeLabel },
    analyticsMetrics: metrics,
    audienceBreakdowns: buildAudience(data, period),
    monthlySales: {
      title: 'Monthly revenue',
      description: `Trailing 12 months · trend compares ${periodRangeLabel} with ${priorRangeLabel}`,
      points: monthlySales,
      trend: salesTrend,
      summary: seriesSummary(monthlySales, 'Revenue'),
    },
    userActivity: {
      title: 'Active customers',
      description: `Unique customers · trend compares ${periodRangeLabel} with ${priorRangeLabel}`,
      points: userActivity,
      trend: formatTrend(currentActiveCustomers, priorWindowActiveCustomers),
      summary: seriesSummary(userActivity, 'Active customers'),
    },
    financialProgress: [
      { id: 'paid-invoices', label: 'Paid invoices', value: formatCurrency(paidAmount), percentage: clampPercentage(paidAmount, invoiceAmount), detail: `${formatCurrency(awaitingAmount)} awaiting payment`, icon: 'ri-secure-payment-line', colorToken: '--chart-primary' },
      { id: 'annual-revenue', label: 'Annual revenue target', value: formatCurrency(ytdRevenue), percentage: clampPercentage(ytdRevenue, period.annualRevenueGoal), detail: `${formatCurrency(Math.max(0, period.annualRevenueGoal - ytdRevenue))} remaining to goal`, icon: 'ri-wallet-3-line', colorToken: '--chart-teal' },
    ],
    customerOrders: recentOrders,
    orderStatusOptions: ['All', ...selectOrderStatusBreakdown(data, period).map((item) => item.status)],
    reconciliation: { currentRevenue, currentMonthChartRevenue: monthlySales.at(-1)?.value ?? 0 },
  };
};

export const selectWorkspaceSummary = (data = businessData, period = REPORTING_PERIOD) => {
  const analytics = selectAnalyticsPageData(data, period);
  const latestOrder = [...selectOrdersWithDetails(data)]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const activeCustomers = data.customers.filter((customer) => customer.status !== 'Inactive').length;
  const revenueMetric = analytics.analyticsMetrics.find((metric) => metric.id === 'monthly-revenue');
  const annualProgress = analytics.financialProgress.find((item) => item.id === 'annual-revenue');
  const ageHours = Math.max(
    0,
    Math.floor((new Date(DATASET_AS_OF) - new Date(latestOrder.createdAt)) / 3600000),
  );

  return {
    workspaceProgress: {
      label: annualProgress.label,
      percentage: annualProgress.percentage,
    },
    notifications: [
      {
        id: 'latest-order',
        icon: 'ri-shopping-bag-3-line',
        title: 'Latest order received',
        detail: `${latestOrder.id.toUpperCase()} from ${latestOrder.customer.name} totals ${formatCurrency(latestOrder.total)}`,
        age: `${ageHours}h`,
      },
      {
        id: 'customer-network',
        icon: 'ri-user-add-line',
        title: 'Customer network',
        detail: `${activeCustomers} of ${data.customers.length} customer accounts are active`,
        age: formatDate(DATASET_AS_OF),
      },
      {
        id: 'monthly-revenue',
        icon: 'ri-line-chart-line',
        title: 'Revenue report is current',
        detail: `${revenueMetric.value} recognized from completed, paid orders`,
        age: analytics.period.rangeLabel,
      },
    ],
  };
};

const relativeMessageTime = (value, now) => {
  const timestamp = new Date(value);
  const today = new Date(now);
  const dayDifference = Math.floor((Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) - Date.UTC(timestamp.getUTCFullYear(), timestamp.getUTCMonth(), timestamp.getUTCDate())) / 86400000);
  if (dayDifference === 0) return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(timestamp);
  if (dayDifference === 1) return 'Yesterday';
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(timestamp);
};

const messageDay = (value, now) => {
  const timestamp = new Date(value);
  const today = new Date(now);
  const dayDifference = Math.floor((Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) - Date.UTC(timestamp.getUTCFullYear(), timestamp.getUTCMonth(), timestamp.getUTCDate())) / 86400000);
  if (dayDifference === 0) return 'Today';
  if (dayDifference === 1) return 'Yesterday';
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(timestamp);
};

export const selectMessagesPageData = (data = businessData, now = DATASET_AS_OF, sourceMessages = data.messages) => {
  const customersById = Object.fromEntries(data.customers.map((customer) => [customer.id, customer]));
  const messageConversations = data.conversations.map((conversation) => {
    const participant = customersById[conversation.customerId];
    const threadMessages = sourceMessages
      .filter((message) => message.conversationId === conversation.id)
      .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
    const latest = threadMessages.at(-1);
    return {
      id: conversation.id,
      customerId: conversation.customerId,
      participant: {
        id: participant.id,
        name: participant.name,
        role: participant.role,
        company: participant.company,
        avatar: participant.avatar,
        status: participant.presence,
      },
      updatedAt: latest ? relativeMessageTime(latest.sentAt, now) : '',
      updatedAtDateTime: latest?.sentAt,
      lastMessage: latest?.text ?? '',
      unreadCount: threadMessages.filter((message) => message.recipientId === 'current-user' && !message.readAt).length,
      messages: threadMessages.map((message) => ({
        id: message.id,
        senderId: message.senderId,
        text: message.text,
        time: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(message.sentAt)),
        dateTime: message.sentAt,
        day: messageDay(message.sentAt, now),
      })),
    };
  }).sort((a, b) => new Date(b.updatedAtDateTime) - new Date(a.updatedAtDateTime));
  return { messageConversations };
};

export const markConversationRead = (messages, conversationId, readAt = DATASET_AS_OF) => messages.map((message) =>
  message.conversationId === conversationId && message.recipientId === 'current-user' && !message.readAt
    ? { ...message, readAt }
    : message);

export const createLocalMessage = ({ conversationId, customerId, text, sentAt }) => ({
  id: `local-message-${new Date(sentAt).getTime()}`,
  conversationId,
  customerId,
  senderId: 'current-user',
  recipientId: customerId,
  text,
  sentAt,
  readAt: sentAt,
});
