import { type RefObject } from "react";
import {
  Bot,
  Zap,
  MessageCircle,
  Copy,
  Share2,
  Star,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Send,
  X,
} from "lucide-react";
import { agents } from "../data";
import type { ChatMessage, ScreenSize } from "../types";

const quickActions = [
  { icon: "🌐", text: "Generate Web App", gradient: "from-blue-500 to-cyan-500" },
  { icon: "📱", text: "Build Mobile App", gradient: "from-green-500 to-emerald-500" },
  { icon: "🖥️", text: "Create Desktop App", gradient: "from-purple-500 to-pink-500" },
  { icon: "⚡", text: "Deploy Edge Functions", gradient: "from-orange-500 to-red-500" },
];

interface ChatPanelProps {
  chatMessages: ChatMessage[];
  currentMessage: string;
  onCurrentMessageChange: (value: string) => void;
  onSendMessage: () => void;
  isGenerating: boolean;
  generationProgress: number;
  selectedAgent: string;
  onSelectAgent: (id: string) => void;
  scrollRef: RefObject<HTMLDivElement>;
  screenSize: ScreenSize;
  rightPanelCollapsed: boolean;
  onToggleRightPanel: () => void;
  onCloseRightPanel: () => void;
}

const HIGHLIGHT_TOKENS = ["✅", "🚀", "🛡️", "🌍", "💰"];

export function ChatPanel({
  chatMessages,
  currentMessage,
  onCurrentMessageChange,
  onSendMessage,
  isGenerating,
  generationProgress,
  selectedAgent,
  onSelectAgent,
  scrollRef,
  screenSize,
  rightPanelCollapsed,
  onToggleRightPanel,
  onCloseRightPanel,
}: ChatPanelProps) {
  return (
    <div className="flex h-full">
      {/* Agent Selection Panel */}
      {!rightPanelCollapsed && (
        <div
          className={`${
            screenSize === "mobile" ? "w-80 absolute right-0 z-40 bg-white shadow-2xl" : "w-96"
          } bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6 transition-all duration-300`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Bot className="w-6 h-6 text-purple-600" />
              AI Agent Fleet
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                All Systems Active
              </div>
              {screenSize === "mobile" && (
                <button onClick={onCloseRightPanel} className="p-1 hover:bg-gray-100 rounded text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  selectedAgent === agent.id
                    ? "border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md"
                    : "border-gray-200 hover:border-purple-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${agent.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <agent.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{agent.name}</h4>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{agent.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.capabilities.slice(0, 2).map((cap) => (
                        <span key={cap} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                          {cap}
                        </span>
                      ))}
                      {agent.capabilities.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{agent.capabilities.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              Quick Actions
            </h4>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.text}
                  className={`w-full p-3 bg-gradient-to-r ${action.gradient} hover:shadow-lg rounded-lg text-white text-sm font-medium transition-all duration-200 transform hover:scale-[1.02]`}
                >
                  <span className="mr-2">{action.icon}</span>
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">AI Command Center</h2>
                <div className="text-sm text-gray-500">
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Agents coordinating... ({Math.round(generationProgress)}%)
                    </span>
                  ) : (
                    "Ready for your next command"
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {screenSize !== "desktop" && (
                <button onClick={onToggleRightPanel} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                  <Bot className="w-5 h-5" />
                </button>
              )}

              {isGenerating && (
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm">Stop</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-4xl ${message.type === "user" ? "order-2" : "order-1"}`}>
                {message.agent && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{message.agent}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl shadow-sm ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    {message.content.split("\n").map((line, index) => {
                      if (HIGHLIGHT_TOKENS.some((token) => line.includes(token))) {
                        return (
                          <div
                            key={index}
                            className={`${index > 0 ? "mt-2" : ""} ${
                              message.type === "assistant" ? "text-gray-800" : "text-white"
                            }`}
                          >
                            {line}
                          </div>
                        );
                      }
                      return (
                        line && (
                          <p
                            key={index}
                            className={`${index > 0 ? "mt-1" : ""} ${
                              message.type === "assistant" ? "text-gray-700" : "text-white"
                            }`}
                          >
                            {line}
                          </p>
                        )
                      );
                    })}
                  </div>

                  {message.progress !== undefined && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${message.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{message.progress}%</span>
                    </div>
                  )}
                </div>

                {message.type === "assistant" && (
                  <div className="flex items-center gap-2 mt-2">
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                      <Star className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">AI agents are coordinating your request...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  value={currentMessage}
                  onChange={(e) => onCurrentMessageChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSendMessage();
                    }
                  }}
                  placeholder="Describe your app idea... (e.g., 'Create a full-stack e-commerce platform with AI recommendations')"
                  className="w-full p-4 pr-16 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none min-h-[60px] max-h-32"
                  rows={2}
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>💡 Try: "Build a social media app with AI moderation"</span>
                </div>
                <div>{currentMessage.length}/2000</div>
              </div>
            </div>
            <button
              onClick={onSendMessage}
              disabled={!currentMessage.trim() || isGenerating}
              className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
