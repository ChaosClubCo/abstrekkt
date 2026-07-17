import { FileText } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function ProposalsPage() {
  return (
    <ModuleShell
      icon={FileText}
      title="Proposals"
      description="Create, send, and track professional proposals"
      color="text-indigo-400"
      bg="bg-indigo-500/10"
      stats={[
        { label: "Active", value: "5" },
        { label: "Accepted", value: "18" },
        { label: "Pending", value: "3" },
        { label: "Total Value", value: "€42,800" },
      ]}
      actions={[{ label: "Templates" }, { label: "New Proposal" }]}
    />
  );
}
