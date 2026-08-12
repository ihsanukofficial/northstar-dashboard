export const ROUTES = Object.freeze({
  home: '/',
  analytics: '/analytics',
  products: '/products',
  messages: '/messages',
  customers: '/customers',
  settings: '/settings',
});

export const PAGE_METADATA = Object.freeze({
  [ROUTES.analytics]: {
    eyebrow: 'Workspace overview',
    title: 'Analytics',
    description: 'Track performance, customer activity, and business momentum.',
  },
  [ROUTES.products]: {
    eyebrow: 'Catalog operations',
    title: 'Products',
    description: 'Manage inventory, pricing, and product availability.',
  },
  [ROUTES.messages]: {
    eyebrow: 'Team inbox',
    title: 'Messages',
    description: 'Stay close to customers and keep conversations moving.',
  },
  [ROUTES.customers]: {
    eyebrow: 'Customer intelligence',
    title: 'Customers',
    description: 'Understand your audience and strengthen key relationships.',
  },
  [ROUTES.settings]: {
    eyebrow: 'Workspace controls',
    title: 'Settings',
    description: 'Tune your account, notifications, and dashboard preferences.',
  },
});
