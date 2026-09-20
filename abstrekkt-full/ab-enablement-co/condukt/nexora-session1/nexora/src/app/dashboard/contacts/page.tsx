import { Users } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function ContactsPage() {
  return (
    <ModuleShell
      icon={Users}
      title="Contacts"
      description="Manage your contacts, segments, and customer data"
      color="text-nexora-400"
      bg="bg-nexora-500/10"
      stats={[
        { label: "Total Contacts", value: "2,847" },
        { label: "New This Week", value: "34" },
        { label: "Active", value: "1,923" },
        { label: "Segments", value: "12" },
      ]}
      actions={[{ label: "Import" }, { label: "Add Contact" }]}
    />
  );
}
