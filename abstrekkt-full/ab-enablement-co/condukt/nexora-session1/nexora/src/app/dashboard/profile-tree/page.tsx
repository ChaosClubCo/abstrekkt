import { Link } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function ProfileTreePage() {
  return (
    <ModuleShell
      icon={Link}
      title="ProfileTree"
      description="Your link-in-bio page with analytics"
      color="text-violet-400"
      bg="bg-violet-500/10"
      stats={[
        { label: "Page Views", value: "1,847" },
        { label: "Click Rate", value: "34%" },
        { label: "Links", value: "8" },
        { label: "Unique Visitors", value: "642" },
      ]}
      actions={[{ label: "Preview" }, { label: "Edit Page" }]}
    />
  );
}
