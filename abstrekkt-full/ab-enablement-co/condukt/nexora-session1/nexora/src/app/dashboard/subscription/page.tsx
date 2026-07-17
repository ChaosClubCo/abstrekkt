import { CreditCard } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function SubscriptionPage() {
  return (
    <ModuleShell
      icon={CreditCard}
      title="Subscription"
      description="Manage your plan, billing, and invoices"
      color="text-nexora-400"
      bg="bg-nexora-500/10"
      stats={[
        { label: "Current Plan", value: "Pro" },
        { label: "Monthly Cost", value: "€44" },
        { label: "Next Billing", value: "Mar 1" },
        { label: "Status", value: "Active" },
      ]}
      actions={[{ label: "View Invoices" }, { label: "Upgrade Plan" }]}
    />
  );
}
