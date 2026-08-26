import { Shield } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function AdminPage() {
  return (
    <ModuleShell
      icon={Shield}
      title="Admin Panel"
      description="User management, analytics, metrics & system config"
      color="text-red-400"
      bg="bg-red-500/10"
      stats={[
        { label: "Total Users", value: "847" },
        { label: "Active Today", value: "124" },
        { label: "Error Rate", value: "0.2%" },
        { label: "Uptime", value: "99.9%" },
      ]}
      actions={[{ label: "View Logs" }, { label: "Manage Users" }]}
    />
  );
}
