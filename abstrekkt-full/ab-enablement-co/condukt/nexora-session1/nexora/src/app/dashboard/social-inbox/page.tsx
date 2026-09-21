import { MessageCircle } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function SocialInboxPage() {
  return (
    <ModuleShell
      icon={MessageCircle}
      title="Social Inbox"
      description="Instagram, Facebook & WhatsApp messages — unified"
      color="text-pink-400"
      bg="bg-pink-500/10"
      stats={[
        { label: "Unread", value: "7" },
        { label: "Channels", value: "3" },
        { label: "Conversations", value: "142" },
        { label: "Avg. Response", value: "4 min" },
      ]}
      actions={[{ label: "Connect Account" }, { label: "Inbox" }]}
    />
  );
}
