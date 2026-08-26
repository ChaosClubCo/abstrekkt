import { Wrench } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function ToolboxPage() {
  return (
    <ModuleShell
      icon={Wrench}
      title="Toolbox"
      description="Utilities, data tools, and admin functions"
      color="text-violet-400"
      bg="bg-violet-500/10"
      actions={[{ label: "Manage Tools" }]}
    />
  );
}
