# Creator Commerce Demo Skeleton

This folder contains a skeleton for a **creator commerce** workflow.  It demonstrates how a user might connect to a payment provider, define subscription plans and automate basic marketing actions.  The implementation uses React and TypeScript for the front‑end and simulates integration with Stripe/PayPal.

## Structure

```
commerce_demo/
├─ README.md            # This file
├─ CommerceDemo.tsx      # React component implementing the commerce UI
└─ useCommerceDemo.ts    # Custom hook managing state and actions
```

## How It Works

1. **Select Payment Provider** – The user chooses a provider (Stripe or PayPal) from a drop‑down menu.
2. **Create Plans** – The user can define subscription or one‑time plans with a name and price.  Plans are stored locally until the demo is submitted.
3. **Set Up Automation** – The user selects simple marketing automations (welcome email, renewal reminder) to enable after purchase.
4. **Initialize Commerce** – Clicking “Initialize Commerce” triggers a simulated integration using the `useCommerceDemo` hook.  In a real implementation, the hook would call the selected provider’s API to create products and subscriptions.

## Usage

1. Copy `CommerceDemo.tsx` and `useCommerceDemo.ts` into your project (`src/components` and `src/hooks` respectively).
2. Import and render the `CommerceDemo` component:

   ```tsx
   import CommerceDemo from './components/CommerceDemo';
   
   export default function CommercePage() {
     return <CommerceDemo />;
   }
   ```

3. Configure your environment variables for payment provider API keys (e.g., `VITE_STRIPE_SECRET_KEY`, `VITE_PAYPAL_CLIENT_ID`) in a `.env` file.  Access them in your hook using `import.meta.env` or `process.env`.
4. Replace the simulated integration in `useCommerceDemo` with calls to Stripe or PayPal APIs.  Handle authentication, error cases and idempotency.

## Security & Quality Considerations

* **Data Sanitization** – Validate plan names and prices; ensure prices are numeric and positive.
* **Secret Handling** – Never expose API keys in client‑side code.  Use environment variables and secure backend functions.
* **Error Handling** – Provide clear messages if the API returns errors (e.g., invalid credentials, duplicate plans).  Offer a way to retry.
* **Modularization** – Keep business logic (API calls) separate from UI.  Create a service layer if needed.

## Next Steps

* Integrate with Stripe/PayPal SDKs to create products and subscriptions.
* Add support for one‑time purchases, coupons and discounts.
* Enable webhook handling (server side) to react to events such as payment success or subscription cancellations.
* Build a revenue dashboard that aggregates sales and subscriber metrics.