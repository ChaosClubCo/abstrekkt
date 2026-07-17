import React, { useState } from 'react';
import { useBillingManagement } from '../hooks/useBillingManagement';

/**
 * Demo component illustrating how to interact with the billing
 * management hook. Users can subscribe to different plans, update
 * payment information, and cancel their subscription. A log of
 * actions is displayed for clarity.
 */
export const BillingManagement: React.FC = () => {
  const {
    subscription,
    subscribe,
    updatePaymentMethod,
    cancelSubscription,
    logs,
  } = useBillingManagement();
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [paymentMethod, setPaymentMethod] = useState('');

  /** Determine the monthly price based on the selected plan */
  const getPrice = (plan: string): number => {
    if (plan === 'pro') return 49;
    if (plan === 'enterprise') return 99;
    return 0;
  };

  /** Subscribe the user to the selected plan */
  const handleSubscribe = () => {
    const price = getPrice(selectedPlan);
    subscribe(selectedPlan, price);
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md">
      <h2 className="text-lg font-semibold mb-2">Billing Management Demo</h2>
      <div className="mb-4">
        <h3 className="font-medium mb-1">Current Subscription</h3>
        {!subscription && (
          <p className="text-sm text-gray-500">No subscription selected.</p>
        )}
        {subscription && (
          <div className="text-sm">
            <p>Plan: {subscription.plan}</p>
            <p>Status: {subscription.status}</p>
            <p>
              Price: ${subscription.price}
              /month
            </p>
            <p>Renews: {subscription.renewalDate.toLocaleDateString()}</p>
          </div>
        )}
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-1">Subscribe / Change Plan</h3>
        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="w-full border rounded p-1 mb-2"
        >
          <option value="free">Free ($0)</option>
          <option value="pro">Pro ($49)</option>
          <option value="enterprise">Enterprise ($99)</option>
        </select>
        <button
          onClick={handleSubscribe}
          className="px-4 py-1 bg-blue-500 text-white rounded w-full"
        >
          Subscribe
        </button>
      </div>
      <div className="mb-4">
        <h3 className="font-medium mb-1">Payment Method</h3>
        <input
          type="text"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          placeholder="Enter card last 4 digits"
          className="w-full border rounded p-1 mb-2"
        />
        <button
          onClick={() => updatePaymentMethod(paymentMethod)}
          className="px-4 py-1 bg-green-500 text-white rounded w-full"
        >
          Update Payment
        </button>
      </div>
      {subscription && subscription.status === 'active' && (
        <button
          onClick={() => cancelSubscription()}
          className="px-4 py-1 bg-red-500 text-white rounded w-full mb-4"
        >
          Cancel Subscription
        </button>
      )}
      <div>
        <h3 className="font-medium mb-1">Logs</h3>
        {logs.length === 0 && (
          <p className="text-sm text-gray-500">No logs.</p>
        )}
        <ul className="text-xs max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
          {logs.map((log, idx) => (
            <li key={idx}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};