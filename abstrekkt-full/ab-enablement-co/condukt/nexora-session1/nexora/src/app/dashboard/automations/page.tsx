import { Zap } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function AutomationsPage() {
  return (
    <ModuleShell
      icon={Zap}
      title="Automations"
      description="Visual workflow builder — trigger actions on events"
      color="text-orange-400"
      bg="bg-orange-500/10"
      stats={[
        { label: "Active Flows", value: "6" },
        { label: "Triggered Today", value: "42" },
        { label: "Actions Run", value: "1,284" },
        { label: "Success Rate", value: "99.2%" },
      ]}
      actions={[{ label: "Templates" }, { label: "New Automation" }]}
    />
  );
}
