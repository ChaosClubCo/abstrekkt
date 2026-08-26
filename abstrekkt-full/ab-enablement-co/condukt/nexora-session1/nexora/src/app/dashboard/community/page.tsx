import { Globe } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function CommunityPage() {
  return (
    <ModuleShell
      icon={Globe}
      title="Community"
      description="Build and manage teams, posts, events & achievements"
      color="text-emerald-400"
      bg="bg-emerald-500/10"
      stats={[
        { label: "Teams", value: "5" },
        { label: "Members", value: "847" },
        { label: "Posts This Week", value: "23" },
        { label: "Events", value: "4" },
      ]}
      actions={[{ label: "Manage Teams" }, { label: "New Post" }]}
    />
  );
}
