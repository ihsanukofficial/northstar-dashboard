import { useMemo, useRef, useState } from 'react';

import CustomerFilters from '../../components/Customers/CustomerFilters/CustomerFilters';
import CustomerOverview from '../../components/Customers/CustomerOverview/CustomerOverview';
import CustomersTable from '../../components/Customers/CustomersTable/CustomersTable';
import SectionHeader from '../../components/Shared/SectionHeader/SectionHeader';
import { usePageReveal } from '../../hooks/usePageReveal';
import { selectCustomersPageData } from '../../selectors/businessSelectors';

import styles from './CustomersPage.module.css';

const {
  customers,
  customerSegments,
  customerStats,
  customerStatuses,
} = selectCustomersPageData();

export default function CustomersPage() {
  const pageRef = useRef(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [segment, setSegment] = useState('all');

  usePageReveal(pageRef);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesQuery = !normalizedQuery || [customer.name, customer.email, customer.location]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesStatus = status === 'all' || customer.status === status;
      const matchesSegment = segment === 'all' || customer.segment === segment;

      return matchesQuery && matchesStatus && matchesSegment;
    });
  }, [query, segment, status]);

  const hasFilters = Boolean(query.trim()) || status !== 'all' || segment !== 'all';

  const resetFilters = () => {
    setQuery('');
    setStatus('all');
    setSegment('all');
  };

  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.pageHeader} data-animate="intro">
        <SectionHeader
          eyebrow="Relationship snapshot"
          title="Customer health"
          description="Understand account health, purchase value, and engagement across every customer segment."
          action={(
            <span className={styles.headerMeta}>
              <i className="ri-contacts-book-3-line" aria-hidden="true" />
              {customers.length} featured profiles
            </span>
          )}
        />
      </div>

      <CustomerOverview stats={customerStats} />
      <CustomerFilters
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
        segment={segment}
        onSegmentChange={setSegment}
        statuses={customerStatuses}
        segments={customerSegments}
        resultCount={filteredCustomers.length}
        totalCount={customers.length}
        hasFilters={hasFilters}
        onReset={resetFilters}
      />
      <CustomersTable
        customers={filteredCustomers}
        totalCount={customers.length}
        hasFilters={hasFilters}
        onReset={resetFilters}
      />
    </div>
  );
}
