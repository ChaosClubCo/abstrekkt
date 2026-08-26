import React, { useState } from "react";
import { Outlet } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NavBar } from "./NavBar";
import { FeedbackModal } from "./FeedbackModal";

export function Root() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#08090e", color: "#e4e6f0" }}
      >
        <NavBar onFeedback={() => setFeedbackOpen(true)} />
        <main className="flex-1" style={{ paddingTop: 56 }}>
          <Outlet />
        </main>
        <FeedbackModal
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
      </div>
    </DndProvider>
  );
}
