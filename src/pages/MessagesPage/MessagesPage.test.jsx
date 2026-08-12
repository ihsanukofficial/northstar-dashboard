import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import MessagesPage from './MessagesPage';

describe('MessagesPage', () => {
  it('selects a conversation and sends a session-only reply from the composer', async () => {
    const user = userEvent.setup();
    render(<MessagesPage />);

    expect(screen.getByRole('heading', { level: 2, name: 'Maya Chen' })).toBeVisible();

    const noahConversation = screen.getByRole('button', {
      name: /Conversation with Noah Williams/i,
    });
    await user.click(noahConversation);

    expect(noahConversation).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('heading', { level: 2, name: 'Noah Williams' })).toBeVisible();

    const composer = screen.getByRole('textbox', { name: 'Message Noah Williams' });
    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton).toBeDisabled();

    await user.type(composer, 'Inventory review is complete.');
    await user.click(sendButton);

    const history = screen.getByRole('list', { name: 'Message history with Noah Williams' });
    expect(within(history).getByText('Inventory review is complete.')).toBeVisible();
    expect(composer).toHaveValue('');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Message sent to Noah Williams. This reply is kept only for this demo session.',
    );
  });

  it('switches between the conversation list and thread on mobile', async () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(max-width: 760px)' || query === '(prefers-reduced-motion: reduce)',
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
      const { container } = render(<MessagesPage />);
      const inbox = container.querySelector('[data-mobile-view]');
      expect(inbox).toHaveAttribute('data-mobile-view', 'list');

      await user.click(screen.getByRole('button', { name: /Conversation with Noah Williams/i }));
      expect(inbox).toHaveAttribute('data-mobile-view', 'thread');
      expect(screen.getByRole('button', { name: 'Back to conversations' })).toHaveFocus();

      await user.click(screen.getByRole('button', { name: 'Back to conversations' }));
      expect(inbox).toHaveAttribute('data-mobile-view', 'list');
    } finally {
      matchMediaSpy.mockRestore();
    }
  });
});
