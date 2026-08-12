export const initialProfile = {
  name: 'Ihsanullah Khan',
  email: 'ihsanullah@business.app',
  role: 'Workspace administrator',
  timezone: 'Asia/Karachi',
};

export const notificationOptions = [
  {
    id: 'newMessages',
    title: 'New message alerts',
    description: 'Show an in-app alert when a customer or teammate replies.',
  },
  {
    id: 'orderExceptions',
    title: 'Order exceptions',
    description: 'Flag cancelled orders and items that need manual attention.',
  },
  {
    id: 'weeklyDigest',
    title: 'Weekly performance digest',
    description: 'Prepare a concise Monday summary of sales and customer activity.',
  },
];

export const initialNotificationPreferences = {
  newMessages: true,
  orderExceptions: true,
  weeklyDigest: false,
};

export const initialDashboardPreferences = {
  dateRange: '30-days',
  landingView: 'analytics',
  showComparisons: true,
  compactTables: false,
};
