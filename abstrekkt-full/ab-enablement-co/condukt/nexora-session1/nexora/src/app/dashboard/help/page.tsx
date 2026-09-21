import { HelpCircle } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function HelpPage() {
  return (
    <ModuleShell
      icon={HelpCircle}
      title="Help Center"
      description="Documentation, tutorials, and support"
      color="text-blue-400"
      bg="bg-blue-500/10"
      actions={[{ label: "Contact Support" }]}
    />
  );
}
