import { useState } from 'react';
import { nanoid } from 'nanoid';

export interface AiTool {
  id: string;
  name: string;
  description: string;
  price: number; // 0 for free
  rating: number;
  installed: boolean;
}

/**
 * Hook to manage an AI tools marketplace. Provides the list of
 * available tools, allows installing a tool, and maintains a log
 * of actions. In production, this would query a backend marketplace
 * API, handle payment processing and license management.
 */
export function useAiToolsMarketplace() {
  const [tools, setTools] = useState<AiTool[]>([
    { id: nanoid(), name: 'Language Model Pro', description: 'Advanced language model for code and UI generation.', price: 49, rating: 4.8, installed: false },
    { id: nanoid(), name: 'Image Generator', description: 'Generate high‑quality images from text prompts.', price: 19, rating: 4.5, installed: false },
    { id: nanoid(), name: 'Analytics Assistant', description: 'AI assistant to analyze user behaviour and suggest improvements.', price: 0, rating: 4.2, installed: false },
  ]);
  const [logs, setLogs] = useState<string[]>([]);

  const installTool = (id: string) => {
    setTools((prev) => prev.map((t) => (t.id === id ? { ...t, installed: true } : t)));
    const tool = tools.find((t) => t.id === id);
    setLogs((prev) => [
      `[${new Date().toISOString()}] Installed tool: ${tool?.name || id}`,
      ...prev,
    ]);
  };

  return {
    tools,
    installTool,
    logs,
  };
}