import { Target } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function GoalsPage() {
  return (
    <ModuleShell
      icon={Target}
      title="Goals"
      description="Set and track business goals and milestones"
      color="text-emerald-400"
      bg="bg-emerald-500/10"
      stats={[
        { label: "Active Goals", value: "4" },
        { label: "On Track", value: "3" },
        { label: "Completed", value: "12" },
        { label: "Avg. Progress", value: "67%" },
      ]}
      actions={[{ label: "View History" }, { label: "New Goal" }]}
    />
  );
}
