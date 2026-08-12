import Avatar from '../../Shared/Avatar/Avatar';
import StatePanel from '../../Shared/StatePanel/StatePanel';
import StatusBadge from '../../Shared/StatusBadge/StatusBadge';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

import styles from './CustomersTable.module.css';

export default function CustomersTable({ customers, totalCount, hasFilters, onReset }) {
  return (
    <section className={styles.directory} aria-labelledby="customer-directory-title" data-animate="reveal">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Relationships</p>
          <h2 id="customer-directory-title">Customer directory</h2>
          <p>Account health, order history, and customer value in one view.</p>
        </div>
        <span className={styles.count}>{customers.length} of {totalCount}</span>
      </header>

      {customers.length ? (
        <div className={styles.tableRegion} role="region" aria-label="Customer directory table" tabIndex="0">
          <table className={styles.table}>
            <caption className="visually-hidden">Customer directory with segment, location, orders, lifetime value, and status</caption>
            <thead>
              <tr>
                <th scope="col">Customer</th>
                <th scope="col">Segment</th>
                <th scope="col">Location</th>
                <th scope="col" className={styles.numeric}>Orders</th>
                <th scope="col" className={styles.numeric}>Lifetime value</th>
                <th scope="col">Last order</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <th scope="row">
                    <div className={styles.customerIdentity}>
                      <Avatar name={customer.name} size="medium" status={customer.presence} />
                      <span className={styles.customerCopy}>
                        <strong>{customer.name}</strong>
                        <small>{customer.email}</small>
                        <small>Joined {customer.joined}</small>
                      </span>
                    </div>
                  </th>
                  <td><span className={styles.segment}>{customer.segment}</span></td>
                  <td>{customer.location}</td>
                  <td className={styles.numeric}>{formatNumber(customer.orders)}</td>
                  <td className={styles.numeric}><strong>{formatCurrency(customer.spend)}</strong></td>
                  <td><span className={styles.date}>{customer.lastOrder}</span></td>
                  <td><StatusBadge status={customer.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <StatePanel
          icon="ri-user-search-line"
          title="No customers match these filters"
          description="Try a broader search or clear the selected status and segment."
          action={hasFilters ? (
            <button className={styles.emptyAction} type="button" onClick={onReset}>Clear all filters</button>
          ) : null}
        />
      )}
    </section>
  );
}
