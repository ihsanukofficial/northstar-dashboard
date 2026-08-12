import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { THEME_STORAGE_KEY } from '../../../utils/theme';
import AppearanceSettings from './AppearanceSettings';

describe('AppearanceSettings', () => {
  it('applies and restores a persisted theme choice', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<AppearanceSettings />);

    const darkTheme = screen.getByRole('radio', { name: /Dark/i });
    expect(darkTheme).not.toBeChecked();

    await user.click(darkTheme);

    expect(darkTheme).toBeChecked();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(screen.getByRole('status')).toHaveTextContent('Dark theme applied and saved on this device.');

    unmount();
    render(<AppearanceSettings />);

    expect(screen.getByRole('radio', { name: /Dark/i })).toBeChecked();
  });
});
