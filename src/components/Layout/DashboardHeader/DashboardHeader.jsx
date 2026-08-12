import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Avatar from '../../Shared/Avatar/Avatar';
import { PAGE_METADATA, ROUTES } from '../../../constants/routes';
import { businessData, REPORTING_PERIOD } from '../../../data/businessData';
import { currentUser } from '../../../data/currentUserData';
import { selectWorkspaceSummary } from '../../../selectors/businessSelectors';
import styles from './DashboardHeader.module.css';

const { notifications: workspaceNotifications } = selectWorkspaceSummary(
  businessData,
  REPORTING_PERIOD,
);

export default function DashboardHeader({ menuButtonRef, onOpenNavigation, isNavigationOpen }) {
  const { pathname } = useLocation();
  const [activePopover, setActivePopover] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const actionsRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const notificationPopoverRef = useRef(null);
  const profileButtonRef = useRef(null);
  const profilePopoverRef = useRef(null);
  const metadata = PAGE_METADATA[pathname] ?? {
    eyebrow: 'Northstar workspace',
    title: 'Page not found',
    description: 'The page you requested is not part of this workspace.',
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!actionsRef.current?.contains(event.target)) setActivePopover(null);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && activePopover) {
        const trigger = activePopover === 'notifications' ? notificationButtonRef.current : profileButtonRef.current;
        setActivePopover(null);
        window.requestAnimationFrame(() => trigger?.focus());
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePopover]);

  useEffect(() => {
    if (!activePopover) return;
    const popover = activePopover === 'notifications' ? notificationPopoverRef.current : profilePopoverRef.current;
    window.requestAnimationFrame(() => popover?.querySelector('button, a[href]')?.focus());
  }, [activePopover]);

  return (
    <header className={styles.header} data-shell="header">
      <div className={styles.titleRow}>
        <button
          ref={menuButtonRef}
          className={styles.menuButton}
          type="button"
          onClick={onOpenNavigation}
          aria-label="Open navigation"
          aria-expanded={isNavigationOpen}
          aria-controls="application-sidebar"
        >
          <i className="ri-menu-2-line" aria-hidden="true" />
        </button>
        <div>
          <p className={styles.eyebrow}>{metadata.eyebrow}</p>
          <h1>{metadata.title}</h1>
          <p className={styles.description}>{metadata.description}</p>
        </div>
      </div>

      <div className={styles.actions} ref={actionsRef}>
        <button
          ref={notificationButtonRef}
          className={styles.iconButton}
          type="button"
          aria-label="View notifications"
          aria-expanded={activePopover === 'notifications'}
          aria-controls="notification-popover"
          aria-haspopup="dialog"
          onClick={() => setActivePopover((current) => current === 'notifications' ? null : 'notifications')}
        >
          <i className="ri-notification-3-line" aria-hidden="true" />
          {hasUnreadNotifications ? <span className={styles.notificationDot} /> : null}
        </button>
        <button
          ref={profileButtonRef}
          className={styles.profileButton}
          type="button"
          aria-label="Open profile menu"
          aria-expanded={activePopover === 'profile'}
          aria-controls="profile-popover"
          onClick={() => setActivePopover((current) => current === 'profile' ? null : 'profile')}
        >
          <Avatar src={currentUser.avatar} name={currentUser.name} size="small" />
          <span>
            <strong>{currentUser.name}</strong>
            <small>{currentUser.role}</small>
          </span>
          <i className="ri-arrow-down-s-line" aria-hidden="true" />
        </button>

        {activePopover === 'notifications' ? (
          <div
            id="notification-popover"
            ref={notificationPopoverRef}
            className={`${styles.popover} ${styles.notifications}`}
            role="dialog"
            aria-label="Notifications"
          >
            <div className={styles.popoverHeader}>
              <div><strong>Notifications</strong><span>{workspaceNotifications.length} recent updates</span></div>
              <button type="button" disabled={!hasUnreadNotifications} onClick={() => setHasUnreadNotifications(false)}>
                {hasUnreadNotifications ? 'Dismiss indicator' : 'Indicator dismissed'}
              </button>
            </div>
            <ul>
              {workspaceNotifications.map((notification) => (
                <li key={notification.id}>
                  <span className={styles.noticeIcon}><i className={notification.icon} aria-hidden="true" /></span>
                  <div><strong>{notification.title}</strong><span>{notification.detail} · {notification.age}</span></div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {activePopover === 'profile' ? (
          <nav
            id="profile-popover"
            ref={profilePopoverRef}
            className={`${styles.popover} ${styles.profileMenu}`}
            aria-label="Profile menu"
          >
            <div className={styles.profileSummary}>
              <Avatar src={currentUser.avatar} name={currentUser.name} size="medium" />
              <div><strong>{currentUser.name}</strong><span>{currentUser.role}</span></div>
            </div>
            <Link to={ROUTES.settings} onClick={() => setActivePopover(null)}><i className="ri-user-settings-line" aria-hidden="true" /> Profile settings</Link>
            <Link to={ROUTES.settings} onClick={() => setActivePopover(null)}><i className="ri-palette-line" aria-hidden="true" /> Appearance</Link>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
