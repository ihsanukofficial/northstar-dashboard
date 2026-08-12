export const THEME_STORAGE_KEY = 'business-dashboard-theme';
export const SUPPORTED_THEMES = ['light', 'dark'];

export function getStoredTheme() {
  if (typeof document === 'undefined') return 'light';

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (SUPPORTED_THEMES.includes(storedTheme)) return storedTheme;
  } catch {
    // Device storage can be disabled without preventing theme selection.
  }

  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme, { persist = false } = {}) {
  const safeTheme = SUPPORTED_THEMES.includes(theme) ? theme : 'light';
  document.documentElement.dataset.theme = safeTheme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    safeTheme === 'dark' ? '#0d1320' : '#f4f6fa',
  );

  if (!persist) return true;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, safeTheme);
    return true;
  } catch {
    return false;
  }
}

export function initializeTheme() {
  if (typeof document !== 'undefined') applyTheme(getStoredTheme());
}
