import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  MessageSquare,
  Bug,
  Lightbulb,
  ThumbsUp,
  Send,
  Star,
} from "lucide-react";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

const feedbackTypes = [
  { id: "bug", label: "Bug Report", icon: Bug, color: "#ef4444" },
  { id: "feature", label: "Feature Request", icon: Lightbulb, color: "#f59e0b" },
  { id: "general", label: "General Feedback", icon: MessageSquare, color: "#5e6ad2" },
  { id: "praise", label: "Praise", icon: ThumbsUp, color: "#22c55e" },
];

export function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [selectedType, setSelectedType] = useState("general");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (message.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setMessage("");
        setRating(0);
        setSelectedType("general");
        onClose();
      }, 2000);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        />
        <Dialog.Content
          className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl outline-none"
          style={{
            background: "#12121e",
            border: "1px solid #1f2030",
            width: 480,
            maxWidth: "calc(100vw - 32px)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #1f2030" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "#1a1b2e" }}
              >
                <MessageSquare size={14} style={{ color: "#5e6ad2" }} />
              </div>
              <Dialog.Title
                style={{ color: "#e4e6f0", fontSize: "0.95rem", fontWeight: 600 }}
              >
                Share Feedback
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                style={{ color: "#6b7094" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <X size={15} />
              </button>
            </Dialog.Close>
          </div>

          {submitted ? (
            <div className="px-6 py-12 flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.15)" }}
              >
                <ThumbsUp size={24} style={{ color: "#22c55e" }} />
              </div>
              <p style={{ color: "#e4e6f0", fontSize: "1rem", fontWeight: 600 }}>
                Thanks for your feedback!
              </p>
              <p style={{ color: "#6b7094", fontSize: "0.8rem" }}>
                We'll review it and get back to you soon.
              </p>
            </div>
          ) : (
            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Feedback Type */}
              <div>
                <p
                  className="mb-2.5"
                  style={{ color: "#8489a8", fontSize: "0.75rem", fontWeight: 500 }}
                >
                  FEEDBACK TYPE
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {feedbackTypes.map(({ id, label, icon: Icon, color }) => (
                    <button
                      key={id}
                      onClick={() => setSelectedType(id)}
                      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-150"
                      style={{
                        background:
                          selectedType === id
                            ? `rgba(${
                                id === "bug"
                                  ? "239,68,68"
                                  : id === "feature"
                                  ? "245,158,11"
                                  : id === "general"
                                  ? "94,106,210"
                                  : "34,197,94"
                              },0.12)`
                            : "#1a1b2e",
                        border: `1px solid ${
                          selectedType === id ? color + "44" : "#252540"
                        }`,
                      }}
                    >
                      <Icon
                        size={16}
                        style={{ color: selectedType === id ? color : "#6b7094" }}
                      />
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: selectedType === id ? color : "#6b7094",
                          fontWeight: selectedType === id ? 600 : 400,
                          textAlign: "center",
                          lineHeight: 1.2,
                        }}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <p
                  className="mb-2.5"
                  style={{ color: "#8489a8", fontSize: "0.75rem", fontWeight: 500 }}
                >
                  EXPERIENCE RATING
                </p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={22}
                        style={{
                          color:
                            star <= (hoverRating || rating)
                              ? "#f59e0b"
                              : "#252540",
                          fill:
                            star <= (hoverRating || rating)
                              ? "#f59e0b"
                              : "transparent",
                          transition: "all 0.1s",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <p
                  className="mb-2.5"
                  style={{ color: "#8489a8", fontSize: "0.75rem", fontWeight: 500 }}
                >
                  YOUR MESSAGE
                </p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your experience, suggestion, or issue..."
                  rows={4}
                  className="w-full rounded-xl px-3 py-2.5 resize-none outline-none transition-all"
                  style={{
                    background: "#1a1b2e",
                    border: "1px solid #252540",
                    color: "#e4e6f0",
                    fontSize: "0.85rem",
                  }}
                  onFocus={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      "#5e6ad2")
                  }
                  onBlur={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      "#252540")
                  }
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-150"
                style={{
                  background: message.trim() ? "#5e6ad2" : "#1a1b2e",
                  color: message.trim() ? "#fff" : "#4a4f70",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: message.trim() ? "pointer" : "not-allowed",
                }}
              >
                <Send size={14} />
                Send Feedback
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
