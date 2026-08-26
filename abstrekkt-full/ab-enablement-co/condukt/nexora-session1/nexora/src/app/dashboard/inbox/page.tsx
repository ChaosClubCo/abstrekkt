import { Bot } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function NexusAIPage() {
  return (
    <ModuleShell
      icon={Bot}
      title="Nexus AI"
      description="Your AI assistant with 85+ tools — ask anything"
      color="text-electric-400"
      bg="bg-electric-500/10"
      stats={[
        { label: "AI Credits", value: "∞" },
        { label: "Tools Available", value: "85+" },
        { label: "Chats Today", value: "7" },
        { label: "Drafts Pending", value: "3" },
      ]}
      actions={[{ label: "View Tools" }, { label: "New Chat" }]}
    />
  );
}
