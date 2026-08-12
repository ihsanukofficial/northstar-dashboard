import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import StatePanel from './StatePanel';

describe('StatePanel', () => {
  it('announces errors assertively and exposes the recovery action', () => {
    render(
      <StatePanel
        variant="error"
        title="Orders could not load"
        description="Check the connection and try again."
        action={<button type="button">Retry orders</button>}
      />,
    );

    const alert = screen.getByRole('alert');
    expect(within(alert).getByRole('heading', { name: 'Orders could not load' })).toBeVisible();
    expect(within(alert).getByText('Check the connection and try again.')).toBeVisible();
    expect(within(alert).getByRole('button', { name: 'Retry orders' })).toBeEnabled();
  });

  it('uses a polite status region for non-error states', () => {
    render(
      <StatePanel
        variant="loading"
        title="Loading customers"
        description="Preparing the customer view."
      />,
    );

    const status = screen.getByRole('status');
    expect(within(status).getByRole('heading', { name: 'Loading customers' })).toBeVisible();
  });
});
