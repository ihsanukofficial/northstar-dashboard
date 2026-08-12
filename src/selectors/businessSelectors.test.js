import { describe, expect, it } from 'vitest';

import { businessData, REPORTING_PERIOD } from '../data/businessData';
import { calculateOrderTotal } from '../utils/businessCalculations';
import { validateBusinessData } from '../utils/dataIntegrity';
import {
  isRevenueOrder,
  selectAnalyticsPageData,
  selectCustomersPageData,
  selectCustomersWithStats,
  selectMessagesPageData,
  selectMonthlyRevenue,
  selectOrderStatusBreakdown,
  selectOrdersWithDetails,
  selectProductsWithStats,
  selectProductsPageData,
  selectWorkspaceSummary,
} from './businessSelectors';

describe('relational business data', () => {
  it('is deterministic, sufficiently populated, and referentially valid', () => {
    const integrity = validateBusinessData();

    expect(integrity.errors).toEqual([]);
    expect(integrity.valid).toBe(true);
    expect(integrity.counts.customers).toBe(40);
    expect(integrity.counts.products).toBe(24);
    expect(integrity.counts.orders).toBe(180);
    expect(integrity.counts.orderItems).toBeGreaterThan(300);
    expect(integrity.counts.conversations).toBe(16);
    expect(integrity.counts.messages).toBe(32);
  });

  it('calculates each order total from its historical line items', () => {
    const detailedOrders = selectOrdersWithDetails();
    const sample = detailedOrders[17];

    expect(sample.total).toBe(calculateOrderTotal(sample, sample.items));
    expect(sample.items.every((item) => item.orderId === sample.id)).toBe(true);
  });

  it('reconciles revenue across the KPI, current monthly chart, and source orders', () => {
    const analytics = selectAnalyticsPageData();
    const sourceRevenue = selectOrdersWithDetails()
      .filter((order) => isRevenueOrder(order) && order.paidAt >= '2026-08-01T00:00:00.000Z' && order.paidAt < '2026-08-13T00:00:00.000Z')
      .reduce((total, order) => total + order.total, 0);

    expect(analytics.reconciliation.currentRevenue).toBeCloseTo(sourceRevenue, 2);
    expect(analytics.reconciliation.currentRevenue).toBe(analytics.reconciliation.currentMonthChartRevenue);
    expect(selectMonthlyRevenue()).toHaveLength(12);
  });

  it('keeps categorical totals and progress calculations mathematically connected', () => {
    const analytics = selectAnalyticsPageData();
    const statusBreakdown = selectOrderStatusBreakdown();

    analytics.audienceBreakdowns.forEach((audience) => {
      expect(audience.segments.reduce((total, segment) => total + segment.count, 0)).toBe(audience.value);
      expect(audience.segments.reduce((total, segment) => total + segment.value, 0)).toBeCloseTo(100, 5);
    });

    analytics.financialProgress.forEach((progress) => {
      expect(progress.percentage).toBeGreaterThanOrEqual(0);
      expect(progress.percentage).toBeLessThanOrEqual(100);
    });

    const expectedPeriodOrders = businessData.orders.filter((order) =>
      order.createdAt >= REPORTING_PERIOD.start && order.createdAt < REPORTING_PERIOD.end).length;
    expect(statusBreakdown.reduce((total, item) => total + item.count, 0)).toBe(expectedPeriodOrders);
    expect(selectWorkspaceSummary().workspaceProgress.percentage).toBe(
      analytics.financialProgress.find((item) => item.id === 'annual-revenue').percentage,
    );
  });

  it('derives customer spending and product sales from eligible orders only', () => {
    const revenueOrders = selectOrdersWithDetails().filter(isRevenueOrder);
    const customers = selectCustomersWithStats();
    const products = selectProductsWithStats();
    const customerSpend = customers.reduce((total, customer) => total + customer.spend, 0);
    const revenue = revenueOrders.reduce((total, order) => total + order.total, 0);

    expect(customerSpend).toBeCloseTo(revenue, 2);
    expect(products.reduce((total, product) => total + product.sales, 0)).toBe(
      revenueOrders.flatMap((order) => order.items).reduce((total, item) => total + item.quantity, 0),
    );
    expect(products.every((product) => product.stock === (
      product.startingStock + product.stockReceived - product.sales - product.damagedStock
    ))).toBe(true);
    expect(products.every((product) => product.stock >= 0)).toBe(true);
  });

  it('keeps page identities and filter options connected to canonical records', () => {
    const productPage = selectProductsPageData();
    const customerPage = selectCustomersPageData();
    const messagesPage = selectMessagesPageData();
    const customerIds = new Set(businessData.customers.map((customer) => customer.id));

    expect(new Set(productPage.products.map((product) => product.id)).size).toBe(businessData.products.length);
    expect(productPage.productCategories).toEqual(
      [...new Set(businessData.products.map((product) => product.category))].sort(),
    );
    expect(new Set(customerPage.customers.map((customer) => customer.id))).toEqual(customerIds);
    expect(messagesPage.messageConversations.every((conversation) =>
      customerIds.has(conversation.customerId))).toBe(true);
    expect(messagesPage.messageConversations.every((conversation) =>
      conversation.participant.id === conversation.customerId)).toBe(true);
  });
});
