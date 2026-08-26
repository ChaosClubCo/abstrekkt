import { BarChart3 } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function ReportsPage() {
  return (
    <ModuleShell
      icon={BarChart3}
      title="Reports"
      description="Analytics on contacts, deals, revenue & performance"
      color="text-teal-400"
      bg="bg-teal-500/10"
      stats={[
        { label: "Revenue (MTD)", value: "€12,480" },
        { label: "Contacts Added", value: "34" },
        { label: "Deals Won", value: "7" },
        { label: "Conversion", value: "68%" },
      ]}
      actions={[{ label: "Export" }, { label: "Custom Report" }]}
    />
  );
}
