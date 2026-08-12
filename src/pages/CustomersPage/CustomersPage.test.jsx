import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import CustomersPage from './CustomersPage';

describe('CustomersPage', () => {
  it('combines relationship filters, reports an empty result, and resets every control', async () => {
    const user = userEvent.setup();
    render(<CustomersPage />);

    const search = screen.getByRole('searchbox', { name: 'Search customers' });
    const status = screen.getByRole('combobox', { name: 'Status' });
    const segment = screen.getByRole('combobox', { name: 'Segment' });

    await user.selectOptions(status, 'Active');
    await user.selectOptions(segment, 'Growth');
    await user.type(search, 'Noah');

    let directory = screen.getByRole('region', { name: 'Customer directory table' });
    expect(within(directory).getByText('Noah Williams')).toBeVisible();
    expect(within(directory).queryByText('Maya Chen')).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, 'not-a-customer');

    expect(screen.getByRole('status')).toHaveTextContent('No customers match these filters');
    await user.click(screen.getByRole('button', { name: 'Clear all filters' }));

    expect(search).toHaveValue('');
    expect(status).toHaveValue('all');
    expect(segment).toHaveValue('all');
    directory = screen.getByRole('region', { name: 'Customer directory table' });
    expect(within(directory).getByText('Maya Chen')).toBeVisible();
  });
});
