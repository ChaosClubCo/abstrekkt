import { useState } from 'react';

/**
 * Representation of a user's subscription. In a real system this would
 * likely include many more fields such as billing history, payment
 * method identifiers, and trial information.
 */
export interface Subscription {
  /** Plan identifier (e.g. free, pro, enterprise) */
  plan: string;
  /** Monthly price in USD */
  price: number;
  /** Next renewal date */
  renewalDate: Date;
  /** Status of the subscription (active, canceled, trial) */
  status: string;
}

/**
 * Custom hook to manage subscription and billing interactions. Contains
 * placeholder logic and logs for demonstration. In production this
 * would call a billing API such as Stripe.
 */
export function useBillingManagement() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  /**
   * Subscribe the user to a plan. Creates a new Subscription object with
   * a renewal date 30 days from now. In a real implementation, this
   * would handle payment checkout and error handling.
   * @param plan The plan name
   * @param price The monthly cost
   */
  const subscribe = (plan: string, price: number) => {
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 30);
    setSubscription({ plan, price, renewalDate: renewal, status: 'active' });
    setLogs((prev) => [
      `[${new Date().toISOString()}] Subscribed to ${plan} plan`,
      ...prev,
    ]);
  };

  /**
   * Update the payment method. In this demo it just logs a message.
   * In production you would pass a payment method nonce or token to
   * your billing provider.
   * @param paymentMethod A friendly description of the payment method
   */
  const updatePaymentMethod = (paymentMethod: string) => {
    setLogs((prev) => [
      `[${new Date().toISOString()}] Updated payment method: ${paymentMethod}`,
      ...prev,
    ]);
  };

  /**
   * Cancel the current subscription. Leaves the subscription object in
   * place but sets the status to canceled. A real implementation would
   * update billing provider state and handle proration.
   */
  const cancelSubscription = () => {
    setSubscription((prev) => (prev ? { ...prev, status: 'canceled' } : null));
    setLogs((prev) => [
      `[${new Date().toISOString()}] Canceled subscription`,
      ...prev,
    ]);
  };

  return { subscription, subscribe, updatePaymentMethod, cancelSubscription, logs };
}