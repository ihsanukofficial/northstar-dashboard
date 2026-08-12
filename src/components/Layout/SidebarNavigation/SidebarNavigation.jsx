import { NavLink } from 'react-router-dom';

import { navigationGroups } from '../../../data/navigationData';
import styles from './SidebarNavigation.module.css';

export default function SidebarNavigation({ onNavigate }) {
  return (
    <nav className={styles.navigation} aria-label="Primary navigation">
      {navigationGroups.map((group) => (
        <div className={styles.group} key={group.label}>
          <p className={styles.label}>{group.label}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                >
                  <i className={item.icon} aria-hidden="true" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
