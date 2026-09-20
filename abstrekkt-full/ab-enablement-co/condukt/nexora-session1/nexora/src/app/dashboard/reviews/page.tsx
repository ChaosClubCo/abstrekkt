import { Star } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function ReviewsPage() {
  return (
    <ModuleShell
      icon={Star}
      title="Reviews"
      description="Collect and showcase testimonials and reviews"
      color="text-amber-400"
      bg="bg-amber-500/10"
      stats={[
        { label: "Total Reviews", value: "87" },
        { label: "Avg. Rating", value: "4.9★" },
        { label: "This Month", value: "8" },
        { label: "Published", value: "72" },
      ]}
      actions={[{ label: "Settings" }, { label: "Request Review" }]}
    />
  );
}
