/**
 * UniversalAppGenerator.tsx
 *
 * Reconstructed from the source chat "Universal AI App Generator"
 * (uuid 926093e2, batch-0001). A multi-tab dashboard UI for an AI-powered,
 * multi-agent application generator.
 *
 * ⚠️  DEMO ONLY. This is a UI shell:
 *   - No model is called; chat responses are scripted (see mockResponses.ts).
 *   - No code is generated or executed. Never wire this to auto-run generated code.
 *   - All metrics (98.5% security score, $12,847 saved, 2.4M MAU, uptime,
 *     deployment URLs, "passed" checks) are FAKE demo values (see data.ts).
 *
 * The original source was a single ~3,300-line component. It has been split into
 * typed modules under src/ and src/components/ for readability and compilation.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu } from "lucide-react";
import { NavigationSidebar } from "./components/NavigationSidebar";
import { ChatPanel } from "./components/ChatPanel";
import {
  EditorPanel,
  DatabasePanel,
  SecurityPanel,
  DeployPanel,
  AnalyticsPanel,
  ComingSoonPanel,
} from "./components/TabPanels";
import { initialProjectStats, type ProjectStats } from "./data";
import { scriptedAgentResponses } from "./mockResponses";
import type { ChatMessage, ScreenSize, TabId } from "./types";

function getScreenSize(width: number): ScreenSize {
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

export default function UniversalAppGenerator() {
  const [activeTab, setActiveTab] = useState<TabId>("chat");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: "assistant",
      agent: "Master Orchestrator",
      content:
        "Welcome to the Universal AI App Generator! I can create any type of application across web, mobile, desktop, and edge platforms. What would you like to build today? (Demo: responses are scripted.)",
      timestamp: new Date().toISOString(),
      status: "delivered",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("orchestrator");
  const [generationProgress, setGenerationProgress] = useState(0);

  // Aggregate stats are MOCK; kept in state so the analytics tab could later
  // be wired to a real source without changing the component contract.
  const [projectStats] = useState<ProjectStats>(initialProjectStats);

  // Responsive layout state.
  const [screenSize, setScreenSize] = useState<ScreenSize>(() =>
    typeof window !== "undefined" ? getScreenSize(window.innerWidth) : "desktop",
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  // Track pending timers so we can clean them up on unmount.
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Detect screen size and auto-collapse panels accordingly.
  useEffect(() => {
    const handleResize = () => {
      const next = getScreenSize(window.innerWidth);
      setScreenSize(next);
      setSidebarCollapsed(next === "mobile");
      setRightPanelCollapsed(next !== "desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll chat to bottom on new messages.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Clean up any in-flight timers/intervals on unmount.
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!currentMessage.trim() || isGenerating) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      content: currentMessage,
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setCurrentMessage("");
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulated progress bar (demo only).
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
    intervalRef.current = progressInterval;

    const kickoff = setTimeout(() => {
      scriptedAgentResponses.forEach((response, index) => {
        const t = setTimeout(() => {
          const agentMessage: ChatMessage = {
            id: Date.now() + index,
            type: "assistant",
            agent: response.agent,
            content: response.content,
            timestamp: new Date().toISOString(),
            status: "delivered",
            progress: response.progress,
          };
          setChatMessages((prev) => [...prev, agentMessage]);

          if (index === scriptedAgentResponses.length - 1) {
            setIsGenerating(false);
            clearInterval(progressInterval);
            setGenerationProgress(100);
          }
        }, index * 2000);
        timersRef.current.push(t);
      });
    }, 1000);
    timersRef.current.push(kickoff);
  }, [currentMessage, isGenerating]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "chat":
        return (
          <ChatPanel
            chatMessages={chatMessages}
            currentMessage={currentMessage}
            onCurrentMessageChange={setCurrentMessage}
            onSendMessage={handleSendMessage}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            selectedAgent={selectedAgent}
            onSelectAgent={setSelectedAgent}
            scrollRef={scrollRef}
            screenSize={screenSize}
            rightPanelCollapsed={rightPanelCollapsed}
            onToggleRightPanel={() => setRightPanelCollapsed((c) => !c)}
            onCloseRightPanel={() => setRightPanelCollapsed(true)}
          />
        );
      case "editor":
        return <EditorPanel />;
      case "database":
        return <DatabasePanel />;
      case "security":
        return <SecurityPanel projectStats={projectStats} />;
      case "deploy":
        return <DeployPanel />;
      case "analytics":
        return <AnalyticsPanel projectStats={projectStats} />;
      default:
        return <ComingSoonPanel title={activeTab} />;
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Backdrop for mobile */}
      {screenSize === "mobile" && !sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarCollapsed(true)}></div>
      )}

      {/* Sidebar */}
      <div
        className={`${screenSize === "mobile" && sidebarCollapsed ? "hidden" : ""} ${
          screenSize === "mobile" ? "fixed left-0 top-0 h-full z-50" : "relative"
        }`}
      >
        <NavigationSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (screenSize === "mobile") setSidebarCollapsed(true);
          }}
          projectStats={projectStats}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Mobile header */}
        {screenSize === "mobile" && (
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <button onClick={() => setSidebarCollapsed((c) => !c)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-900">Universal AI Generator</h1>
            <div className="w-9"></div>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">{renderTabContent()}</div>
      </div>
    </div>
  );
}
