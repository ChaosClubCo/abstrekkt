export interface ChatMessage {
  id: number;
  type: "user" | "assistant";
  content: string;
  agent?: string;
  timestamp: string;
  status?: "sent" | "delivered";
  /** Optional progress bar (0-100) shown on assistant messages. */
  progress?: number;
}

export type TabId =
  | "chat"
  | "editor"
  | "database"
  | "deploy"
  | "security"
  | "analytics"
  | "testing"
  | "projects"
  | "settings";

export type ScreenSize = "mobile" | "tablet" | "desktop";
