import { CheckSquare } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function TodosPage() {
  return (
    <ModuleShell
      icon={CheckSquare}
      title="Todos"
      description="Task management linked to contacts and deals"
      color="text-amber-400"
      bg="bg-amber-500/10"
      stats={[
        { label: "Open Tasks", value: "8" },
        { label: "Due Today", value: "3" },
        { label: "Overdue", value: "1" },
        { label: "Completed", value: "124" },
      ]}
      actions={[{ label: "Filter" }, { label: "New Task" }]}
    />
  );
}
