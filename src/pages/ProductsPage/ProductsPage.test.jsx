import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import ProductsPage from './ProductsPage';

describe('ProductsPage', () => {
  it('combines catalog filters, shows an empty state, and resets every control', async () => {
    const user = userEvent.setup();
    render(<ProductsPage />);

    const search = screen.getByRole('searchbox', { name: 'Search products' });
    const category = screen.getByRole('combobox', { name: 'Category' });
    const status = screen.getByRole('combobox', { name: 'Status' });

    await user.selectOptions(category, 'Wearables');
    await user.selectOptions(status, 'In stock');

    let catalog = screen.getByRole('region', { name: 'Product catalog table' });
    expect(within(catalog).getByText('Loop smart ring')).toBeVisible();
    expect(within(catalog).getByText('Loop smart ring 2')).toBeVisible();
    expect(within(catalog).queryByText('Aurora desk lamp')).not.toBeInTheDocument();

    await user.type(search, 'not-a-product');

    expect(screen.getByRole('status')).toHaveTextContent('No products match these filters');
    await user.click(screen.getByRole('button', { name: 'Clear all filters' }));

    expect(search).toHaveValue('');
    expect(category).toHaveValue('all');
    expect(status).toHaveValue('all');
    catalog = screen.getByRole('region', { name: 'Product catalog table' });
    expect(within(catalog).getByText('Aurora desk lamp')).toBeVisible();
  });
});
