import { ROUTES } from '../constants/routes';

export const navigationGroups = [
  {
    label: 'Workspace',
    items: [
      { label: 'Analytics', icon: 'ri-pie-chart-2-line', to: ROUTES.analytics },
      { label: 'Products', icon: 'ri-shopping-bag-3-line', to: ROUTES.products },
      { label: 'Messages', icon: 'ri-chat-3-line', to: ROUTES.messages },
      { label: 'Customers', icon: 'ri-group-line', to: ROUTES.customers },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { label: 'Settings', icon: 'ri-settings-4-line', to: ROUTES.settings },
    ],
  },
];
