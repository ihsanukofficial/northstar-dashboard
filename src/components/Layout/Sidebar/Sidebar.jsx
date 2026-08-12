import Avatar from '../../Shared/Avatar/Avatar';
import Brand from '../Brand/Brand';
import SidebarNavigation from '../SidebarNavigation/SidebarNavigation';
import { businessData, REPORTING_PERIOD } from '../../../data/businessData';
import { currentUser } from '../../../data/currentUserData';
import { selectWorkspaceSummary } from '../../../selectors/businessSelectors';
import { formatPercentage } from '../../../utils/formatters';
import styles from './Sidebar.module.css';

const { workspaceProgress } = selectWorkspaceSummary(businessData, REPORTING_PERIOD);

export default function Sidebar({ closeButtonRef, isMobile, isOpen, onClose, onSignOut, sidebarRef }) {
  return (
    <>
      <button
        className={`${styles.backdrop} ${isOpen ? styles.visible : ''}`}
        type="button"
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close navigation"
        aria-hidden={!isOpen}
      />
      <aside
        id="application-sidebar"
        ref={sidebarRef}
        className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}
        aria-label="Application sidebar"
        aria-hidden={isMobile && !isOpen}
        aria-modal={isMobile && isOpen ? 'true' : undefined}
        inert={isMobile && !isOpen}
        role={isMobile && isOpen ? 'dialog' : undefined}
        data-shell="sidebar"
      >
        <div className={styles.header}>
          <Brand />
          <button ref={closeButtonRef} className={styles.closeButton} type="button" onClick={onClose} aria-label="Close navigation">
            <i className="ri-close-line" aria-hidden="true" />
          </button>
        </div>

        <SidebarNavigation onNavigate={onClose} />

        <div className={styles.footer}>
          <div className={styles.workspaceCard}>
            <span className={styles.workspaceIcon} aria-hidden="true"><i className="ri-sparkling-2-line" /></span>
            <div>
              <strong>Growth plan</strong>
              <span>{formatPercentage(workspaceProgress.percentage)} of annual goal</span>
            </div>
            <span
              className={styles.progress}
              role="progressbar"
              aria-label={workspaceProgress.label}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.round(workspaceProgress.percentage)}
            >
              <span style={{ width: `${workspaceProgress.percentage}%` }} />
            </span>
          </div>

          <div className={styles.account}>
            <Avatar src={currentUser.avatar} name={currentUser.name} size="small" status="online" />
            <div className={styles.accountCopy}>
              <strong>{currentUser.name}</strong>
              <span>{currentUser.role}</span>
            </div>
            <button type="button" onClick={onSignOut} aria-label="Sign out of demo">
              <i className="ri-logout-box-r-line" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
