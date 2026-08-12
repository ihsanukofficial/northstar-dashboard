import { useState } from 'react';

import styles from './MessageComposer.module.css';

export default function MessageComposer({ recipientName, onSend }) {
  const [draft, setDraft] = useState('');
  const trimmedDraft = draft.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!trimmedDraft) return;

    onSend(trimmedDraft);
    setDraft('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.currentTarget.form.requestSubmit();
    }
  };

  return (
    <form className={styles.composer} onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor="message-composer">
        Message {recipientName}
      </label>
      <textarea
        id="message-composer"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`Write a message to ${recipientName}`}
        rows="2"
        maxLength="1000"
        aria-describedby="message-composer-hint"
      />
      <div className={styles.footer}>
        <p id="message-composer-hint">Ctrl or ⌘ + Enter to send</p>
        <button type="submit" disabled={!trimmedDraft}>
          <span>Send</span>
          <i className="ri-send-plane-2-line" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
