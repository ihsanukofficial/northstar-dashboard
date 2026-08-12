export const DATASET_AS_OF = '2026-08-12T23:59:59.999Z';
export const DEFAULT_CURRENCY = 'USD';

export const REPORTING_PERIOD = Object.freeze({
  start: '2026-08-01T00:00:00.000Z',
  end: '2026-08-13T00:00:00.000Z',
  annualRevenueGoal: 150000,
});

const firstNames = [
  'Maya', 'Noah', 'Amara', 'Luca', 'Sofia', 'Ethan', 'Priya', 'Jonas', 'Leila', 'Mateo',
  'Hana', 'Owen', 'Emma', 'Liam', 'Ava', 'Elijah', 'Mia', 'Lucas', 'Isla', 'Leo',
  'Zara', 'Theo', 'Nora', 'Adam', 'Layla', 'Samuel', 'Ivy', 'Daniel', 'Chloe', 'Oscar',
  'Fatima', 'Henry', 'Elena', 'Jack', 'Aisha', 'Finn', 'Grace', 'Rayan', 'Clara', 'David',
];

const lastNames = [
  'Chen', 'Williams', 'Okafor', 'Rossi', 'Martinez', 'Brooks', 'Shah', 'Berg', 'Haddad', 'Silva',
  'Kim', 'Wright', 'Wilson', 'Patel', 'Morgan', 'Brown', 'Laurent', 'Ito', 'Fischer', 'Khan',
];

const locations = [
  'Singapore', 'London, UK', 'Lagos, Nigeria', 'Milan, Italy', 'Madrid, Spain',
  'Toronto, Canada', 'Mumbai, India', 'Stockholm, Sweden', 'Dubai, UAE', 'Sao Paulo, Brazil',
  'Seoul, South Korea', 'Sydney, Australia', 'Austin, USA', 'Paris, France', 'Tokyo, Japan',
  'Berlin, Germany', 'Amsterdam, Netherlands', 'Dublin, Ireland', 'Cape Town, South Africa', 'Lisbon, Portugal',
];

const companies = [
  'Northstar Labs', 'Atlas Commerce', 'Meridian Works', 'Aperture Group', 'Fieldstone Co',
  'Arclight Studio', 'Summit Retail', 'Juniper Supply', 'Harbor & Co', 'Crescent Market',
];

const roles = ['Product Lead', 'Operations Manager', 'Founder', 'Finance Analyst', 'Customer Success Lead'];
const segments = ['Enterprise', 'Growth', 'Starter', 'Individual'];

export const customers = firstNames.map((firstName, index) => {
  const id = `cus-${String(index + 1).padStart(4, '0')}`;
  const name = `${firstName} ${lastNames[index % lastNames.length]}`;
  const joinedMonth = (index * 5) % 18;
  const joinedAt = index >= 38
    ? new Date(Date.UTC(2026, 7, 2 + (index - 38) * 4)).toISOString()
    : new Date(Date.UTC(2025, 1 + joinedMonth, 2 + (index % 20))).toISOString();
  const status = index >= 38 ? 'New' : index % 13 === 0 ? 'Inactive' : index % 9 === 0 ? 'New' : index % 7 === 0 ? 'VIP' : 'Active';

  return Object.freeze({
    id,
    name,
    email: `${firstName}.${lastNames[index % lastNames.length]}@example.com`.toLowerCase(),
    location: locations[index % locations.length],
    company: companies[index % companies.length],
    role: roles[index % roles.length],
    segment: segments[index % segments.length],
    status,
    presence: status === 'Inactive' ? 'offline' : index % 3 === 0 ? 'away' : 'online',
    joinedAt,
    avatar: `/users/${(index % 10) + 1}.png`,
    subscriptionPlan: index % 8 === 0 ? 'Trial' : index % 5 === 0 ? 'Enterprise' : index % 3 === 0 ? 'Premium' : index % 2 === 0 ? 'Basic' : 'Free',
  });
});

const productSeed = [
  ['AUR-LMP', 'Aurora desk lamp', 'Adaptive task lighting', 'Home & Office', 89, 'ri-lightbulb-flash-line', 'amber'],
  ['ORB-ANC', 'Orbit ANC headphones', 'Wireless studio sound', 'Audio', 249, 'ri-headphone-line', 'primary'],
  ['TID-BTL', 'Tide smart bottle', 'Hydration tracking bottle', 'Lifestyle', 64, 'ri-goblet-2-line', 'teal'],
  ['ATL-BAG', 'Atlas travel pack', 'Weatherproof 28L carry-on', 'Accessories', 139, 'ri-briefcase-4-line', 'slate'],
  ['HAL-KEY', 'Halo mechanical keyboard', 'Low-profile tactile keys', 'Computing', 179, 'ri-keyboard-box-line', 'coral'],
  ['SLT-DSK', 'Slate standing desk', 'Electric height adjustment', 'Home & Office', 599, 'ri-layout-grid-line', 'slate'],
  ['PLS-BND', 'Pulse fitness band', 'Daily health and sleep insights', 'Wearables', 129, 'ri-pulse-line', 'teal'],
  ['EMB-MUG', 'Ember ceramic mug', 'Hand-finished everyday mug', 'Lifestyle', 38, 'ri-cup-line', 'amber'],
  ['ARC-CAM', 'Arc webcam pro', '4K conferencing camera', 'Computing', 159, 'ri-webcam-line', 'primary'],
  ['DRF-SPK', 'Drift portable speaker', 'Compact outdoor audio', 'Audio', 119, 'ri-speaker-3-line', 'coral'],
  ['NVA-DCK', 'Nova charging dock', 'Three-device charging station', 'Accessories', 79, 'ri-battery-charge-line', 'primary'],
  ['LOP-RNG', 'Loop smart ring', 'Discreet wellness tracking', 'Wearables', 299, 'ri-circle-line', 'teal'],
];

export const products = Array.from({ length: 24 }, (_, index) => {
  const seed = productSeed[index % productSeed.length];
  const variant = Math.floor(index / productSeed.length);
  const constrainedStartingStock = { 0: 35, 1: 20, 3: 12, 6: 39, 9: 35, 18: 41 };
  return Object.freeze({
    id: `prd-${String(index + 1).padStart(4, '0')}`,
    sku: `${seed[0]}-${String(index + 1).padStart(2, '0')}`,
    name: variant ? `${seed[1]} ${variant + 1}` : seed[1],
    description: seed[2],
    category: seed[3],
    price: seed[4] + variant * 10,
    startingStock: constrainedStartingStock[index] ?? 70 + ((index * 29) % 130),
    stockReceived: (index * 11) % 46,
    damagedStock: index % 5,
    lowStockThreshold: 18,
    updatedAt: new Date(Date.UTC(2026, 7, 12 - (index % 8), 8 + (index % 7))).toISOString(),
    icon: seed[5],
    tone: seed[6],
  });
});

const statusCycle = ['Delivered', 'Delivered', 'Delivered', 'Processed', 'Pending', 'Delivered', 'Cancelled', 'Delivered', 'Processed'];

export const orders = Array.from({ length: 180 }, (_, index) => {
  const daysBack = (index * 7 + Math.floor(index / 12)) % 350;
  const createdAt = new Date(Date.UTC(2026, 7, 12 - daysBack, 9 + (index % 8), (index * 13) % 60));
  const status = statusCycle[index % statusCycle.length];
  const isDelivered = status === 'Delivered';
  const isCancelled = status === 'Cancelled';
  const eligibleCustomers = customers.filter((customer) => new Date(customer.joinedAt) <= createdAt);
  return Object.freeze({
    id: `ord-${String(index + 1).padStart(4, '0')}`,
    customerId: eligibleCustomers[(index * 7 + 3) % eligibleCustomers.length].id,
    createdAt: createdAt.toISOString(),
    status,
    approvedAt: isCancelled ? null : new Date(createdAt.getTime() + 60 * 60 * 1000).toISOString(),
    paymentStatus: isCancelled ? 'Refunded' : isDelivered || index % 4 !== 0 ? 'Paid' : 'Pending',
    paidAt: isCancelled || (!isDelivered && index % 4 === 0) ? null : new Date(createdAt.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    discountRate: index % 11 === 0 ? 0.1 : index % 7 === 0 ? 0.05 : 0,
    taxRate: 0.08,
    shipping: index % 5 === 0 ? 0 : 12,
  });
});

export const orderItems = orders.flatMap((order, orderIndex) => {
  const itemCount = 1 + (orderIndex % 4);
  return Array.from({ length: itemCount }, (_, itemIndex) => {
    const product = products[(orderIndex * 3 + itemIndex * 7) % products.length];
    const historicalAdjustment = ((orderIndex + itemIndex) % 5) - 2;
    return Object.freeze({
      id: `itm-${String(orderIndex + 1).padStart(4, '0')}-${itemIndex + 1}`,
      orderId: order.id,
      productId: product.id,
      quantity: 1 + ((orderIndex + itemIndex) % 3),
      // Historical purchase price, intentionally separate from the current catalog price.
      unitPrice: Math.max(1, product.price + historicalAdjustment * 3),
    });
  });
});

export const conversations = customers.slice(0, 16).map((customer, index) => Object.freeze({
  id: `con-${String(index + 1).padStart(4, '0')}`,
  customerId: customer.id,
}));

const inboundCopy = [
  'Could you confirm the delivery window for our latest order?',
  'The inventory report looks good. Can we review the next shipment?',
  'Thanks for the update. The team is ready to move forward.',
  'Can you send the invoice details before our weekly review?',
];

export const messages = conversations.flatMap((conversation, conversationIndex) => {
  const customer = customers.find((item) => item.id === conversation.customerId);
  const base = Date.UTC(2026, 7, 12 - conversationIndex, 9 + conversationIndex, 10);
  return [
    Object.freeze({
      id: `msg-${String(conversationIndex + 1).padStart(4, '0')}-1`,
      conversationId: conversation.id,
      customerId: customer.id,
      senderId: customer.id,
      recipientId: 'current-user',
      text: inboundCopy[conversationIndex % inboundCopy.length],
      sentAt: new Date(base).toISOString(),
      readAt: conversationIndex < 3 ? null : new Date(base + 30 * 60 * 1000).toISOString(),
    }),
    Object.freeze({
      id: `msg-${String(conversationIndex + 1).padStart(4, '0')}-2`,
      conversationId: conversation.id,
      customerId: customer.id,
      senderId: 'current-user',
      recipientId: customer.id,
      text: 'Absolutely. I have reviewed the details and will keep you updated here.',
      sentAt: new Date(base + 18 * 60 * 1000).toISOString(),
      readAt: new Date(base + 19 * 60 * 1000).toISOString(),
    }),
  ];
});

export const businessData = Object.freeze({
  customers,
  products,
  orders,
  orderItems,
  conversations,
  messages,
});
