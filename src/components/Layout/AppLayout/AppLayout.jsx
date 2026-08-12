import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';

import DashboardHeader from '../DashboardHeader/DashboardHeader';
import Sidebar from '../Sidebar/Sidebar';
import StatePanel from '../../Shared/StatePanel/StatePanel';
import { ROUTES } from '../../../constants/routes';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const { pathname } = useLocation();
  const closeTimerRef = useRef(null);
  const previousPathRef = useRef(pathname);
  const layoutRef = useRef(null);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const sidebarRef = useRef(null);
  const wasNavigationOpenRef = useRef(false);
  const isMobile = useMediaQuery('(max-width: 900px)');
  const prefersReducedMotion = useReducedMotion();
  const isMessagesRoute = pathname === ROUTES.messages;

  const closeNavigation = useCallback(() => setIsNavigationOpen(false), []);

  useEffect(() => {
    if (previousPathRef.current !== pathname && isNavigationOpen) {
      window.requestAnimationFrame(closeNavigation);
    }
    previousPathRef.current = pathname;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [closeNavigation, isNavigationOpen, pathname]);

  useLayoutEffect(() => {
    if (!layoutRef.current || prefersReducedMotion) return undefined;

    let media;
    const context = gsap.context(() => {
      media = gsap.matchMedia();
      media.add('(min-width: 901px)', () => {
        gsap.fromTo('[data-shell="sidebar"]', { autoAlpha: 0, x: -16 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' });
      });
      gsap.fromTo('[data-shell="header"]', { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.44, delay: 0.08, ease: 'power2.out', clearProps: 'all' });
    }, layoutRef);

    return () => {
      media?.revert();
      context.revert();
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isMobile || !isNavigationOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeNavigation();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = sidebarRef.current?.querySelectorAll('a[href], button:not([disabled])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeNavigation, isMobile, isNavigationOpen]);

  useEffect(() => {
    if (!isMobile) {
      wasNavigationOpenRef.current = false;
      return;
    }

    if (isNavigationOpen) {
      wasNavigationOpenRef.current = true;
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (wasNavigationOpenRef.current) {
      wasNavigationOpenRef.current = false;
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, [isMobile, isNavigationOpen]);

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  const handleSignOut = () => {
    setNotice('This demo has no authenticated session. Sign out is ready to connect to an auth provider.');
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setNotice(''), 5200);
  };

  return (
    <div className={styles.layout} ref={layoutRef}>
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <Sidebar
        closeButtonRef={closeButtonRef}
        isMobile={isMobile}
        isOpen={isNavigationOpen}
        onClose={closeNavigation}
        onSignOut={handleSignOut}
        sidebarRef={sidebarRef}
      />
      <div className={styles.contentColumn}>
        <div className={`${styles.contentFrame} ${isMessagesRoute ? styles.messagesWorkspace : ''}`}>
          <DashboardHeader
            isNavigationOpen={isNavigationOpen}
            menuButtonRef={menuButtonRef}
            onOpenNavigation={() => setIsNavigationOpen(true)}
          />
          <main id="main-content" className={styles.main} tabIndex="-1">
            <Suspense
              fallback={(
                <div className={styles.routeLoader}>
                  <StatePanel variant="loading" title="Loading workspace" description="Preparing this view…" />
                </div>
              )}
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
      {notice ? (
        <div className={styles.toast} role="status">
          <i className="ri-information-line" aria-hidden="true" />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">
            <i className="ri-close-line" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
