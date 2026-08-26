import { Users } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function CRMPage() {
  return (
    <ModuleShell
      icon={Users}
      title="CRM Overview"
      description="Full CRM view with contacts, deals and pipeline"
      color="text-nexora-400"
      bg="bg-nexora-500/10"
      stats={[
        { label: "Contacts", value: "2,847" },
        { label: "Open Deals", value: "23" },
        { label: "Pipeline Value", value: "€84,500" },
        { label: "Win Rate", value: "68%" },
      ]}
      actions={[{ label: "Export CRM" }, { label: "Quick Add" }]}
    />
  );
}
