import { Layout } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function PageTreePage() {
  return (
    <ModuleShell
      icon={Layout}
      title="PageTree"
      description="Build landing pages with drag & drop"
      color="text-teal-400"
      bg="bg-teal-500/10"
      stats={[
        { label: "Pages", value: "4" },
        { label: "Published", value: "3" },
        { label: "Total Views", value: "5,280" },
        { label: "Conversion Rate", value: "12.4%" },
      ]}
      actions={[{ label: "Templates" }, { label: "New Page" }]}
    />
  );
}
