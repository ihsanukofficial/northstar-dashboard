import StatePanel from '../../Shared/StatePanel/StatePanel';
import StatusBadge from '../../Shared/StatusBadge/StatusBadge';
import { formatCurrency, formatNumber } from '../../../utils/formatters';

import styles from './ProductCatalog.module.css';

export default function ProductCatalog({ products, totalCount, hasFilters, onReset }) {
  return (
    <section className={styles.catalog} aria-labelledby="product-catalog-title" data-animate="reveal">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Inventory</p>
          <h2 id="product-catalog-title">Product catalog</h2>
          <p>Pricing, availability, and sales momentum at a glance.</p>
        </div>
        <span className={styles.count}>{products.length} of {totalCount}</span>
      </header>

      {products.length ? (
        <div className={styles.tableRegion} role="region" aria-label="Product catalog table" tabIndex="0">
          <table className={styles.table}>
            <caption className="visually-hidden">Product catalog with pricing, inventory, sales, and status</caption>
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">SKU</th>
                <th scope="col">Category</th>
                <th scope="col" className={styles.numeric}>Price</th>
                <th scope="col" className={styles.numeric}>Stock</th>
                <th scope="col" className={styles.numeric}>Sales</th>
                <th scope="col">Status</th>
                <th scope="col">Updated</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <th scope="row">
                    <div className={styles.productIdentity}>
                      <span className={`${styles.thumbnail} ${styles[product.tone]}`} aria-hidden="true">
                        <i className={product.icon} />
                      </span>
                      <span className={styles.productCopy}>
                        <strong>{product.name}</strong>
                        <small>{product.description}</small>
                      </span>
                    </div>
                  </th>
                  <td><span className={styles.sku}>{product.sku}</span></td>
                  <td>{product.category}</td>
                  <td className={styles.numeric}>{formatCurrency(product.price)}</td>
                  <td className={styles.numeric}>
                    <strong className={product.stock === 0 ? styles.emptyStock : undefined}>{formatNumber(product.stock)}</strong>
                    <span className={styles.unit}> units</span>
                  </td>
                  <td className={styles.numeric}>{formatNumber(product.sales)}</td>
                  <td><StatusBadge status={product.status} /></td>
                  <td><span className={styles.updated}>{product.updated}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <StatePanel
          icon="ri-box-3-line"
          title="No products match these filters"
          description="Try another search term or clear the current category and status filters."
          action={hasFilters ? (
            <button className={styles.emptyAction} type="button" onClick={onReset}>Clear all filters</button>
          ) : null}
        />
      )}
    </section>
  );
}
