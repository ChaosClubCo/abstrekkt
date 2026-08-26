import { useCallback, useState } from 'react';

/**
 * A subscription plan definition used in the commerce demo. Each plan
 * contains a human‑readable name and a price in USD. Additional fields
 * such as trial period or recurring interval could be introduced in a
 * future version once real billing APIs are integrated.
 */
export interface SubscriptionPlan {
  name: string;
  price: number;
}

/**
 * Marketing automations that can be toggled on or off when initializing
 * the commerce engine. In the future this type can be extended with
 * additional automations (e.g. abandoned cart reminders, upsell prompts).
 */
export interface Automations {
  welcome: boolean;
  renewal: boolean;
}

/**
 * Hook return type exposing the API surface used by the CommerceDemo
 * component. Consumers can add plans, inspect the current list of plans,
 * view initialization logs and trigger the initialization process.
 */
export interface UseCommerceDemoResult {
  plans: SubscriptionPlan[];
  logs: string[];
  isInitializing: boolean;
  addPlan: (plan: SubscriptionPlan) => void;
  initialize: (provider: string, plans: SubscriptionPlan[], automations: Automations) => void;
}

/**
 * useCommerceDemo encapsulates the state and behaviours required to
 * simulate a commerce setup workflow. This includes managing a list of
 * subscription plans, handling asynchronous initialization with a
 * selected payment provider and producing log messages. All network
 * interactions are mocked using timers to allow this hook to run
 * client‑side without a backend. Replace the timeouts and log
 * generation with real API calls when connecting to payment gateways
 * such as Stripe or PayPal.
 */
const useCommerceDemo = (): UseCommerceDemoResult => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);

  /**
   * Appends a new plan to the current list and records a log entry. Plan
   * names are assumed to be unique within this demo; duplicate names will
   * still be added but may confuse users. Consider enforcing uniqueness
   * in future iterations.
   */
  const addPlan = useCallback((plan: SubscriptionPlan) => {
    setPlans((prev) => [...prev, plan]);
    setLogs((prev) => [
      ...prev,
      `Added plan "${plan.name}" with price $${plan.price.toFixed(2)}`,
    ]);
  }, []);

  /**
   * Simulate initialization of the commerce system. The process logs
   * progress updates and resolves after a few seconds. When replacing
   * this with a real integration, consider catching and logging
   * exceptions so that errors are surfaced to users rather than swallowed.
   */
  const initialize = useCallback(
    async (
      provider: string,
      currentPlans: SubscriptionPlan[],
      automations: Automations,
    ) => {
      if (isInitializing) return;
      setIsInitializing(true);
      setLogs([]);
      setLogs((prev) => [...prev, `Starting commerce setup with provider ${provider}...`]);
      // Simulate network latency for provider connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLogs((prev) => [
        ...prev,
        `Connected to ${provider}. Creating ${currentPlans.length} plans...`,
      ]);
      // Simulate plan creation
      for (const plan of currentPlans) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setLogs((prev) => [...prev, `Created plan: ${plan.name} ($${plan.price.toFixed(2)})`]);
      }
      // Simulate configuring automations
      await new Promise((resolve) => setTimeout(resolve, 500));
      const enabledAutomations: string[] = [];
      if (automations.welcome) enabledAutomations.push('welcome emails');
      if (automations.renewal) enabledAutomations.push('renewal reminders');
      if (enabledAutomations.length) {
        setLogs((prev) => [
          ...prev,
          `Enabled automations: ${enabledAutomations.join(', ')}`,
        ]);
      } else {
        setLogs((prev) => [...prev, 'No marketing automations selected']);
      }
      // Finalize
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLogs((prev) => [...prev, 'Commerce setup complete!']);
      setIsInitializing(false);
    },
    [isInitializing],
  );

  return { plans, logs, isInitializing, addPlan, initialize };
};

export default useCommerceDemo;