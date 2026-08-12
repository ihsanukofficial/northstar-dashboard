import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import App from '../App';

function LocationProbe() {
  const { pathname } = useLocation();
  return <output data-testid="current-path">{pathname}</output>;
}

function renderRoute(initialEntry) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  );
}

describe('application routes', () => {
  it('redirects the root route to analytics and marks its navigation link active', async () => {
    renderRoute('/');

    await waitFor(
      () => expect(screen.getByTestId('current-path')).toHaveTextContent('/analytics'),
      { timeout: 10000 },
    );
    expect(await screen.findByRole('heading', { level: 1, name: 'Analytics' }, { timeout: 10000 })).toBeVisible();
    expect(await screen.findByRole('heading', { level: 2, name: 'Business at a glance' })).toBeVisible();
    expect(screen.getByText('Monthly orders')).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: 'Customer orders' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Analytics' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Products' })).not.toHaveAttribute('aria-current');
  });

  it('renders the 404 view and lets the user return to analytics', async () => {
    const user = userEvent.setup();
    renderRoute('/missing-workspace-view');

    expect(await screen.findByRole(
      'heading',
      { level: 2, name: 'This page is off the map.' },
      { timeout: 10000 },
    )).toBeVisible();
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();

    await user.click(screen.getByRole('link', { name: 'Back to analytics' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Analytics' }, { timeout: 10000 })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Analytics' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens, contains focus within, and closes the mobile navigation with Escape', async () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(max-width: 900px)' || query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    }));
    const user = userEvent.setup();

    try {
      renderRoute('/products');
      await screen.findByRole('heading', { level: 1, name: 'Products' }, { timeout: 10000 });

      const menuButton = screen.getByRole('button', { name: 'Open navigation' });
      const sidebar = screen.getByLabelText('Application sidebar', { selector: 'aside' });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(sidebar).toHaveAttribute('aria-hidden', 'true');

      await user.click(menuButton);

      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      expect(sidebar).toHaveAttribute('aria-hidden', 'false');
      expect(within(sidebar).getByRole('button', { name: 'Close navigation' })).toHaveFocus();
      expect(document.body.style.overflow).toBe('hidden');

      await user.keyboard('{Escape}');

      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      expect(sidebar).toHaveAttribute('aria-hidden', 'true');
      expect(menuButton).toHaveFocus();
    } finally {
      matchMediaSpy.mockRestore();
    }
  });

  it('explains that sign out is a frontend demonstration', async () => {
    const user = userEvent.setup();
    renderRoute('/analytics');
    await screen.findByRole('heading', { level: 1, name: 'Analytics' }, { timeout: 10000 });

    await user.click(screen.getByRole('button', { name: 'Sign out of demo' }));

    expect(screen.getByText(/This demo has no authenticated session/)).toBeVisible();
  });

  it('manages focus when a header popover opens and closes', async () => {
    const user = userEvent.setup();
    renderRoute('/analytics');
    await screen.findByRole('heading', { level: 1, name: 'Analytics' }, { timeout: 10000 });

    const notificationButton = screen.getByRole('button', { name: 'View notifications' });
    await user.click(notificationButton);

    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Dismiss indicator' })).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Notifications' })).not.toBeInTheDocument();
    expect(notificationButton).toHaveFocus();
  });
});
