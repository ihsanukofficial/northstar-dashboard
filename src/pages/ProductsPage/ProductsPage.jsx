import { useMemo, useRef, useState } from 'react';

import ProductCatalog from '../../components/Products/ProductCatalog/ProductCatalog';
import ProductFilters from '../../components/Products/ProductFilters/ProductFilters';
import ProductOverview from '../../components/Products/ProductOverview/ProductOverview';
import SectionHeader from '../../components/Shared/SectionHeader/SectionHeader';
import { usePageReveal } from '../../hooks/usePageReveal';
import { selectProductsPageData } from '../../selectors/businessSelectors';

import styles from './ProductsPage.module.css';

const {
  productCategories,
  products,
  productStats,
  productStatuses,
} = selectProductsPageData();

export default function ProductsPage() {
  const pageRef = useRef(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  usePageReveal(pageRef);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery = !normalizedQuery || [product.name, product.sku, product.category]
        .some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesCategory = category === 'all' || product.category === category;
      const matchesStatus = status === 'all' || product.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, query, status]);

  const hasFilters = Boolean(query.trim()) || category !== 'all' || status !== 'all';

  const resetFilters = () => {
    setQuery('');
    setCategory('all');
    setStatus('all');
  };

  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.pageHeader} data-animate="intro">
        <SectionHeader
          eyebrow="Inventory snapshot"
          title="Catalog health"
          description="Monitor inventory health, product momentum, and category coverage from one focused workspace."
          action={(
            <span className={styles.headerMeta}>
              <i className="ri-archive-stack-line" aria-hidden="true" />
              {products.length} catalog items
            </span>
          )}
        />
      </div>

      <ProductOverview stats={productStats} />
      <ProductFilters
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        categories={productCategories}
        statuses={productStatuses}
        resultCount={filteredProducts.length}
        totalCount={products.length}
        hasFilters={hasFilters}
        onReset={resetFilters}
      />
      <ProductCatalog
        products={filteredProducts}
        totalCount={products.length}
        hasFilters={hasFilters}
        onReset={resetFilters}
      />
    </div>
  );
}
