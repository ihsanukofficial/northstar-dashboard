import { DATASET_AS_OF, businessData } from '../data/businessData';
import { calculateOrderTotal } from './businessCalculations';

const duplicateIds = (records) => {
  const seen = new Set();
  return records.filter((record) => {
    if (seen.has(record.id)) return true;
    seen.add(record.id);
    return false;
  });
};

export const validateBusinessData = (data = businessData) => {
  const errors = [];
  const customerIds = new Set(data.customers.map((customer) => customer.id));
  const productIds = new Set(data.products.map((product) => product.id));
  const orderIds = new Set(data.orders.map((order) => order.id));
  const conversationIds = new Set(data.conversations.map((conversation) => conversation.id));
  const asOf = new Date(DATASET_AS_OF);

  [
    ['customer', data.customers],
    ['product', data.products],
    ['order', data.orders],
    ['order item', data.orderItems],
    ['conversation', data.conversations],
    ['message', data.messages],
  ].forEach(([name, records]) => {
    duplicateIds(records).forEach((record) => errors.push(`Duplicate ${name} id: ${record.id}`));
  });

  data.orders.forEach((order) => {
    const customer = data.customers.find((item) => item.id === order.customerId);
    if (!customerIds.has(order.customerId)) errors.push(`Order ${order.id} references missing customer ${order.customerId}`);
    if (customer && new Date(order.createdAt) < new Date(customer.joinedAt)) errors.push(`Order ${order.id} predates customer ${customer.id}`);
    if (new Date(order.createdAt) > asOf) errors.push(`Order ${order.id} occurs after dataset date`);
    if (order.paidAt && new Date(order.paidAt) < new Date(order.createdAt)) errors.push(`Order ${order.id} was paid before creation`);
    if (order.approvedAt && new Date(order.approvedAt) < new Date(order.createdAt)) errors.push(`Order ${order.id} was approved before creation`);
  });

  data.orderItems.forEach((item) => {
    if (!orderIds.has(item.orderId)) errors.push(`Order item ${item.id} references missing order ${item.orderId}`);
    if (!productIds.has(item.productId)) errors.push(`Order item ${item.id} references missing product ${item.productId}`);
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) errors.push(`Order item ${item.id} has invalid quantity`);
    if (!Number.isFinite(item.unitPrice) || item.unitPrice < 0) errors.push(`Order item ${item.id} has invalid unit price`);
  });

  data.orders.forEach((order) => {
    const items = data.orderItems.filter((item) => item.orderId === order.id);
    if (!items.length) errors.push(`Order ${order.id} has no items`);
    if (!Number.isFinite(calculateOrderTotal(order, items))) errors.push(`Order ${order.id} has an invalid total`);
  });

  data.conversations.forEach((conversation) => {
    if (!customerIds.has(conversation.customerId)) errors.push(`Conversation ${conversation.id} references missing customer ${conversation.customerId}`);
  });

  data.messages.forEach((message) => {
    const conversation = data.conversations.find((item) => item.id === message.conversationId);
    if (!conversationIds.has(message.conversationId)) errors.push(`Message ${message.id} references missing conversation ${message.conversationId}`);
    if (!customerIds.has(message.customerId)) errors.push(`Message ${message.id} references missing customer ${message.customerId}`);
    if (conversation && conversation.customerId !== message.customerId) errors.push(`Message ${message.id} does not match its conversation customer`);
    if (![message.customerId, 'current-user'].includes(message.senderId)) errors.push(`Message ${message.id} has an invalid sender`);
    if (![message.customerId, 'current-user'].includes(message.recipientId)) errors.push(`Message ${message.id} has an invalid recipient`);
    if (message.readAt && new Date(message.readAt) < new Date(message.sentAt)) errors.push(`Message ${message.id} was read before it was sent`);
    if (new Date(message.sentAt) > asOf) errors.push(`Message ${message.id} occurs after dataset date`);
  });

  return {
    valid: errors.length === 0,
    errors,
    counts: {
      customers: data.customers.length,
      products: data.products.length,
      orders: data.orders.length,
      orderItems: data.orderItems.length,
      conversations: data.conversations.length,
      messages: data.messages.length,
    },
  };
};
