import { useMemo, useRef, useState } from 'react';

import ConversationList from '../../components/Messages/ConversationList/ConversationList';
import MessageThread from '../../components/Messages/MessageThread/MessageThread';
import { businessData, DATASET_AS_OF } from '../../data/businessData';
import { currentUser } from '../../data/currentUserData';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { usePageReveal } from '../../hooks/usePageReveal';
import {
  createLocalMessage,
  markConversationRead,
  selectMessagesPageData,
} from '../../selectors/businessSelectors';

import styles from './MessagesPage.module.css';

const initialConversationId = businessData.conversations[0]?.id ?? null;

export default function MessagesPage() {
  const pageRef = useRef(null);
  const [messageState, setMessageState] = useState(() =>
    markConversationRead(businessData.messages, initialConversationId, DATASET_AS_OF));
  const [selectorNow, setSelectorNow] = useState(DATASET_AS_OF);
  const [selectedConversationId, setSelectedConversationId] = useState(initialConversationId);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [mobileView, setMobileView] = useState('list');
  const isMobile = useMediaQuery('(max-width: 760px)');

  usePageReveal(pageRef);

  const { messageConversations } = useMemo(
    () => selectMessagesPageData(businessData, selectorNow, messageState),
    [messageState, selectorNow],
  );

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return messageConversations;

    return messageConversations.filter(({ participant, lastMessage }) =>
      [participant.name, participant.company, participant.role, lastMessage]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [messageConversations, searchQuery]);

  const selectedConversation = messageConversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );
  const totalUnreadCount = messageConversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0,
  );

  const handleSelectConversation = (conversationId) => {
    const readAt = new Date().toISOString();
    setSelectedConversationId(conversationId);
    setMobileView('thread');
    setMessageState((currentMessages) =>
      markConversationRead(currentMessages, conversationId, readAt),
    );
  };

  const handleSendMessage = (text) => {
    if (!selectedConversation) return;

    const sentAt = new Date().toISOString();
    const newMessage = createLocalMessage({
      conversationId: selectedConversation.id,
      customerId: selectedConversation.customerId,
      text,
      sentAt,
    });

    setMessageState((currentMessages) => [...currentMessages, newMessage]);
    setSelectorNow(sentAt);
    setAnnouncement(`Message sent to ${selectedConversation.participant.name}. This reply is kept only for this demo session.`);
  };

  return (
    <section className={styles.page} ref={pageRef} aria-label="Messages inbox">
      <div className={styles.inbox} data-animate="reveal" data-mobile-view={mobileView}>
        <ConversationList
          conversations={filteredConversations}
          totalUnreadCount={totalUnreadCount}
          selectedConversationId={selectedConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectConversation={handleSelectConversation}
        />
        <MessageThread
          conversation={selectedConversation}
          currentUser={currentUser}
          focusOnOpen={isMobile && mobileView === 'thread'}
          onBack={() => setMobileView('list')}
          onSendMessage={handleSendMessage}
        />
      </div>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}
