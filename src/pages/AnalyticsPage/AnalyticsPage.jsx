import { useRef } from 'react';

import '../../lib/chartSetup';
import AudienceBreakdownCard from '../../components/Analytics/AudienceBreakdownCard/AudienceBreakdownCard';
import CustomerOrdersTable from '../../components/Analytics/CustomerOrdersTable/CustomerOrdersTable';
import FinancialProgressCard from '../../components/Analytics/FinancialProgressCard/FinancialProgressCard';
import MonthlySalesChart from '../../components/Analytics/MonthlySalesChart/MonthlySalesChart';
import UserActivityChart from '../../components/Analytics/UserActivityChart/UserActivityChart';
import MetricCard from '../../components/Shared/MetricCard/MetricCard';
import SectionHeader from '../../components/Shared/SectionHeader/SectionHeader';
import { businessData, REPORTING_PERIOD } from '../../data/businessData';
import { usePageReveal } from '../../hooks/usePageReveal';
import { selectAnalyticsPageData } from '../../selectors/businessSelectors';
import styles from './AnalyticsPage.module.css';

const analyticsPageData = selectAnalyticsPageData(businessData, REPORTING_PERIOD);

export default function AnalyticsPage() {
  const pageRef = useRef(null);
  usePageReveal(pageRef);

  const {
    period,
    analyticsMetrics,
    audienceBreakdowns,
    monthlySales,
    userActivity,
    financialProgress,
    customerOrders,
    orderStatusOptions,
  } = analyticsPageData;

  return (
    <div className={styles.page} ref={pageRef}>
      <div data-animate="intro">
        <SectionHeader
          eyebrow={period.eyebrow}
          title="Business at a glance"
          description="A focused view of the signals shaping this month's performance."
          action={(
            <span className={styles.dateLabel}>
              <i className="ri-calendar-line" aria-hidden="true" />
              {period.rangeLabel}
            </span>
          )}
        />
      </div>

      <section className={styles.metrics} aria-label="Key performance indicators">
        {analyticsMetrics.map((metric) => (
          <div data-animate="intro" key={metric.id}><MetricCard {...metric} /></div>
        ))}
      </section>

      <section className={styles.audienceGrid} aria-label="Audience overview">
        {audienceBreakdowns.map((audience) => (
          <div data-animate="reveal" key={audience.id}><AudienceBreakdownCard audience={audience} /></div>
        ))}
      </section>

      <section className={styles.chartGrid} aria-label="Performance charts">
        <div data-animate="reveal"><MonthlySalesChart data={monthlySales} /></div>
        <div data-animate="reveal"><UserActivityChart data={userActivity} /></div>
      </section>

      <section className={styles.financialGrid} aria-label="Financial progress">
        {financialProgress.map((item) => (
          <div data-animate="reveal" key={item.id}><FinancialProgressCard item={item} /></div>
        ))}
      </section>

      <div data-animate="reveal">
        <CustomerOrdersTable orders={customerOrders} orderStatusOptions={orderStatusOptions} />
      </div>
    </div>
  );
}
