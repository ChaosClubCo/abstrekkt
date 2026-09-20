import { Kanban } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function PipelinePage() {
  return (
    <ModuleShell
      icon={Kanban}
      title="Pipeline"
      description="Visual deal pipeline with drag & drop stages"
      color="text-cyan-400"
      bg="bg-cyan-500/10"
      stats={[
        { label: "Active Deals", value: "23" },
        { label: "Total Value", value: "€84,500" },
        { label: "Won This Month", value: "€12,480" },
        { label: "Win Rate", value: "68%" },
      ]}
      actions={[{ label: "Configure Stages" }, { label: "New Deal" }]}
    />
  );
}
