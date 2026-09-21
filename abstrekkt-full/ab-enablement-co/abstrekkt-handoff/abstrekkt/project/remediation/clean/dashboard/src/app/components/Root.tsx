import React, { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NavBar } from "./NavBar";
import { FeedbackModal } from "./FeedbackModal";
import { NotificationsDrawer } from "./NotificationsDrawer";
import { CommandPalette } from "./CommandPalette";
import { OnboardingOverlay } from "./OnboardingOverlay";

export function Root() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [onboarded, setOnboarded] = useState(
    () => !!localStorage.getItem("ff_onboarded")
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("ff_onboarded", "1");
    setOnboarded(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#08090e", color: "#e4e6f0" }}
      >
        <NavBar
          onFeedback={() => setFeedbackOpen(true)}
          onNotifications={() => setNotificationsOpen(true)}
          onCommandPalette={() => setCommandPaletteOpen(true)}
        />
        <main className="flex-1" style={{ paddingTop: 56 }}>
          <Outlet />
        </main>
        <FeedbackModal
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
        <NotificationsDrawer
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
        />
        <CommandPalette
          open={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
        {!onboarded && (
          <OnboardingOverlay onComplete={handleOnboardingComplete} />
        )}
      </div>
    </DndProvider>
  );
}
