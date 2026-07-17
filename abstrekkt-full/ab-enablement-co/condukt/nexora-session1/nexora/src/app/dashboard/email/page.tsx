import { Mail } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function EmailPage() {
  return (
    <ModuleShell
      icon={Mail}
      title="Email"
      description="Read, send, and manage emails with Gmail integration"
      color="text-sky-400"
      bg="bg-sky-500/10"
      stats={[
        { label: "Inbox", value: "24" },
        { label: "Sent Today", value: "8" },
        { label: "Drafts", value: "3" },
        { label: "Templates", value: "15" },
      ]}
      actions={[{ label: "Connect Gmail" }, { label: "Compose" }]}
    />
  );
}
