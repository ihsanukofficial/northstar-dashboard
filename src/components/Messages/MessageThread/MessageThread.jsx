import { Fragment, useEffect, useRef } from 'react';

import Avatar from '../../Shared/Avatar/Avatar';
import StatePanel from '../../Shared/StatePanel/StatePanel';
import StatusBadge from '../../Shared/StatusBadge/StatusBadge';
import MessageComposer from '../MessageComposer/MessageComposer';

import styles from './MessageThread.module.css';

export default function MessageThread({ conversation, currentUser, focusOnOpen, onBack, onSendMessage }) {
  const messageListRef = useRef(null);
  const backButtonRef = useRef(null);

  useEffect(() => {
    const messageList = messageListRef.current;
    messageList?.scrollTo({ top: messageList.scrollHeight });
  }, [conversation?.id, conversation?.messages.length]);

  useEffect(() => {
    if (focusOnOpen) window.requestAnimationFrame(() => backButtonRef.current?.focus());
  }, [conversation?.id, focusOnOpen]);

  if (!conversation) {
    return (
      <section className={styles.emptyThread} aria-label="Message thread">
        <StatePanel
          icon="ri-chat-smile-3-line"
          title="Choose a conversation"
          description="Select a person from the inbox to read and reply to messages."
        />
      </section>
    );
  }

  const { participant, messages } = conversation;
  return (
    <section className={styles.thread} aria-labelledby="thread-title">
      <header className={styles.header}>
        <button ref={backButtonRef} className={styles.backButton} type="button" onClick={onBack} aria-label="Back to conversations">
          <i className="ri-arrow-left-line" aria-hidden="true" />
        </button>
        <Avatar
          src={participant.avatar}
          name={participant.name}
          size="medium"
          status={participant.status}
        />
        <div className={styles.identity}>
          <h2 id="thread-title">{participant.name}</h2>
          <p>{participant.role} · {participant.company}</p>
        </div>
        <StatusBadge status={participant.status} />
      </header>

      <ol
        ref={messageListRef}
        className={styles.messages}
        aria-label={`Message history with ${participant.name}`}
        aria-live="polite"
        aria-relevant="additions"
        tabIndex="0"
      >
        {messages.map((message, index) => {
          const showDay = message.day !== messages[index - 1]?.day;
          const isOwnMessage = message.senderId === currentUser.id;

          return (
            <Fragment key={message.id}>
              {showDay ? (
                <li className={styles.day} aria-label={message.day}>
                  <span>{message.day}</span>
                </li>
              ) : null}
              <li className={`${styles.message} ${isOwnMessage ? styles.own : styles.received}`}>
                <article aria-label={`${isOwnMessage ? currentUser.name : participant.name} at ${message.time}`}>
                  <p>{message.text}</p>
                  <time dateTime={message.dateTime}>{message.time}</time>
                </article>
              </li>
            </Fragment>
          );
        })}
      </ol>

      <MessageComposer
        key={conversation.id}
        recipientName={participant.name}
        onSend={onSendMessage}
      />
    </section>
  );
}
