import { Settings } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function SettingsPage() {
  return (
    <ModuleShell
      icon={Settings}
      title="Settings"
      description="Account, integrations, notifications & preferences"
      color="text-zinc-400"
      bg="bg-zinc-500/10"
      actions={[{ label: "Save Changes" }]}
    />
  );
}
