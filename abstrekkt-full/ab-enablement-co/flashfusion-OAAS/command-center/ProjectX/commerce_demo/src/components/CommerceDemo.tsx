import React, { useState } from 'react';
import useCommerceDemo from './useCommerceDemo';

/**
 * CommerceDemo provides a simple UI for setting up subscription plans and
 * basic marketing automations.  It uses the useCommerceDemo hook to
 * manage plans, provider selection and simulated integration with
 * payment gateways.
 */
const CommerceDemo: React.FC = () => {
  const [provider, setProvider] = useState('stripe');
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [automationWelcome, setAutomationWelcome] = useState(false);
  const [automationRenewal, setAutomationRenewal] = useState(false);

  const { plans, isInitializing, logs, addPlan, initialize } = useCommerceDemo();

  const handleAddPlan = () => {
    const name = planName.trim();
    const price = parseFloat(planPrice);
    if (!name || isNaN(price) || price <= 0) return;
    addPlan({ name, price });
    setPlanName('');
    setPlanPrice('');
  };

  const handleInitialize = () => {
    initialize(provider, plans, {
      welcome: automationWelcome,
      renewal: automationRenewal,
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h2>Creator Commerce Demo</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="provider-select" style={{ display: 'block', marginBottom: '0.5rem' }}>
          Payment provider:
        </label>
        <select
          id="provider-select"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          disabled={isInitializing}
        >
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Create a plan</h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Plan name"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            disabled={isInitializing}
          />
          <input
            type="number"
            placeholder="Price (USD)"
            value={planPrice}
            onChange={(e) => setPlanPrice(e.target.value)}
            disabled={isInitializing}
          />
          <button type="button" onClick={handleAddPlan} disabled={isInitializing}>
            Add Plan
          </button>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {plans.map(({ name, price }, idx) => (
            <li key={idx} style={{ marginBottom: '0.25rem' }}>
              {name} — ${price.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Marketing Automations</h3>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={automationWelcome}
            onChange={(e) => setAutomationWelcome(e.target.checked)}
            disabled={isInitializing}
          />{' '}
          Welcome email
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={automationRenewal}
            onChange={(e) => setAutomationRenewal(e.target.checked)}
            disabled={isInitializing}
          />{' '}
          Renewal reminder
        </label>
      </div>
      <button type="button" onClick={handleInitialize} disabled={isInitializing || plans.length === 0}>
        {isInitializing ? 'Initializing…' : 'Initialize Commerce'}
      </button>
      <div style={{ marginTop: '1rem' }}>
        <h3>Logs</h3>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '0.5rem',
            height: '200px',
            overflow: 'auto',
          }}
        >
          {logs.join('\n')}
        </pre>
      </div>
    </div>
  );
};

export default CommerceDemo;