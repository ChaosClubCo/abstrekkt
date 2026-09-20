import { Handshake } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function DealsPage() {
  return (
    <ModuleShell
      icon={Handshake}
      title="Deals"
      description="Track deals from lead to close with full history"
      color="text-electric-400"
      bg="bg-electric-500/10"
      stats={[
        { label: "Open Deals", value: "23" },
        { label: "Pipeline Value", value: "€84,500" },
        { label: "Avg. Deal Size", value: "€3,674" },
        { label: "Avg. Close Time", value: "18 days" },
      ]}
      actions={[{ label: "Export" }, { label: "New Deal" }]}
    />
  );
}
