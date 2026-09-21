import { GraduationCap } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function LearningPage() {
  return (
    <ModuleShell
      icon={GraduationCap}
      title="Learning"
      description="Courses, modules, video content & student progress"
      color="text-purple-400"
      bg="bg-purple-500/10"
      stats={[
        { label: "Courses", value: "8" },
        { label: "Students", value: "342" },
        { label: "Completion Rate", value: "72%" },
        { label: "Total Modules", value: "47" },
      ]}
      actions={[{ label: "Manage Content" }, { label: "New Course" }]}
    />
  );
}
