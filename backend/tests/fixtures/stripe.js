export const stripeCheckoutCompletedEvent = {
  id: 'evt_test_checkout_completed',
  type: 'checkout.session.completed',
  data: { object: { id: 'cs_test', customer: 'cus_test' } },
};

export const stripeSubscriptionUpdatedEvent = {
  id: 'evt_test_subscription_updated',
  type: 'customer.subscription.updated',
  data: { object: { id: 'sub_test', status: 'active' } },
}; 