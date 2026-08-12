import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

vi.mock('gsap', () => {
  const gsap = {
    context: vi.fn((callback) => {
      callback?.();
      return { revert: vi.fn() };
    }),
    fromTo: vi.fn(),
    matchMedia: vi.fn(() => ({
      add: vi.fn((_query, callback) => callback?.()),
      revert: vi.fn(),
    })),
    registerPlugin: vi.fn(),
    utils: {
      toArray: vi.fn(() => []),
    },
  };

  return { default: gsap };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('react-chartjs-2', async () => {
  const { createElement } = await import('react');
  const Chart = (props) => createElement('div', {
    role: 'img',
    'aria-label': props['aria-label'] ?? 'Data visualization',
  });

  return {
    Bar: Chart,
    Doughnut: Chart,
    Line: Chart,
  };
});

const createMediaQueryList = (query) => ({
  matches: query === '(prefers-reduced-motion: reduce)',
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(() => true),
});

Object.defineProperty(window, 'matchMedia', {
  configurable: true,
  writable: true,
  value: vi.fn(createMediaQueryList),
});

Object.defineProperty(window, 'scrollTo', {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(window, 'requestAnimationFrame', {
  configurable: true,
  writable: true,
  value: vi.fn((callback) => {
    callback(0);
    return 1;
  }),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

beforeEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset.theme;
});

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
  delete document.documentElement.dataset.theme;
});
