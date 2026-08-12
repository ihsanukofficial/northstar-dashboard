import { useMemo, useState } from 'react';

import Avatar from '../../Shared/Avatar/Avatar';
import SearchField from '../../Shared/SearchField/SearchField';
import StatePanel from '../../Shared/StatePanel/StatePanel';
import StatusBadge from '../../Shared/StatusBadge/StatusBadge';
import { formatCurrency } from '../../../utils/formatters';
import styles from './CustomerOrdersTable.module.css';

export default function CustomerOrdersTable({ orders, orderStatusOptions }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery = !normalizedQuery || [order.customer, order.id, order.location]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesQuery && (status === 'All' || order.status === status);
    });
  }, [orders, query, status]);

  return (
    <section className={styles.card} aria-labelledby="customer-orders-title">
      <header>
        <div>
          <p>Recent transactions</p>
          <h2 id="customer-orders-title">Customer orders</h2>
        </div>
        <div className={styles.filters}>
          <SearchField id="order-search" label="Search customer orders" value={query} onChange={setQuery} placeholder="Search orders" />
          <label className={styles.select} htmlFor="order-status">
            <span className="visually-hidden">Filter orders by status</span>
            <select id="order-status" value={status} onChange={(event) => setStatus(event.target.value)}>
              {orderStatusOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <i className="ri-arrow-down-s-line" aria-hidden="true" />
          </label>
        </div>
      </header>

      {filteredOrders.length ? (
        <div className={styles.viewport} role="region" aria-label="Customer orders table" tabIndex="0">
          <table>
            <caption className="visually-hidden">Recent customer orders with location, date, status, and amount</caption>
            <thead>
              <tr>
                <th scope="col">Customer</th>
                <th scope="col">Order</th>
                <th scope="col">Location</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className={styles.customer}>
                      <Avatar src={order.avatar} name={order.customer} size="small" />
                      <strong>{order.customer}</strong>
                    </div>
                  </td>
                  <td className={styles.orderId}>{order.id}</td>
                  <td>{order.location}</td>
                  <td><time dateTime={order.dateTime}>{order.date}</time></td>
                  <td><StatusBadge status={order.status} /></td>
                  <td className={styles.amount}>{formatCurrency(order.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <StatePanel icon="ri-search-eye-line" title="No orders found" description="Try another customer, order number, location, or status." />
      )}
    </section>
  );
}
