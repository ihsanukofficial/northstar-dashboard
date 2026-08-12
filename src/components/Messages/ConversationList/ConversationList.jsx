import Avatar from '../../Shared/Avatar/Avatar';
import SearchField from '../../Shared/SearchField/SearchField';
import StatePanel from '../../Shared/StatePanel/StatePanel';

import styles from './ConversationList.module.css';

export default function ConversationList({
  conversations,
  totalUnreadCount,
  selectedConversationId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
}) {
  return (
    <aside className={styles.panel} aria-label="Conversations">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Team inbox</p>
          <h2>Conversations</h2>
        </div>
        {totalUnreadCount > 0 ? (
          <span className={styles.unreadTotal} aria-label={`${totalUnreadCount} unread messages`}>
            {totalUnreadCount}
          </span>
        ) : null}
      </div>

      <div className={styles.search}>
        <SearchField
          id="conversation-search"
          label="Search conversations"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search people or companies"
        />
      </div>

      {conversations.length ? (
        <ul className={styles.list} aria-label="Conversation results">
          {conversations.map((conversation) => {
            const { participant } = conversation;
            const isSelected = selectedConversationId === conversation.id;
            const unreadLabel = conversation.unreadCount
              ? `, ${conversation.unreadCount} unread ${conversation.unreadCount === 1 ? 'message' : 'messages'}`
              : '';

            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  className={`${styles.conversation} ${isSelected ? styles.selected : ''}`}
                  aria-pressed={isSelected}
                  aria-label={`Conversation with ${participant.name}${unreadLabel}`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <Avatar
                    src={participant.avatar}
                    name={participant.name}
                    size="medium"
                    status={participant.status}
                  />
                  <span className={styles.content}>
                    <span className={styles.topline}>
                      <strong>{participant.name}</strong>
                      <time dateTime={conversation.updatedAtDateTime}>{conversation.updatedAt}</time>
                    </span>
                    <span className={styles.company}>{participant.company}</span>
                    <span className={styles.previewRow}>
                      <span className={styles.preview}>{conversation.lastMessage}</span>
                      {conversation.unreadCount ? (
                        <span className={styles.unreadCount} aria-hidden="true">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.empty}>
          <StatePanel
            icon="ri-search-eye-line"
            title="No conversations found"
            description="Try a name, company, or a different search term."
          />
        </div>
      )}
    </aside>
  );
}
