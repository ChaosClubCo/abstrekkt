import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { Routes } from "./pages/Routes";
import { Playground } from "./pages/Playground";
import { Analytics } from "./pages/Analytics";
import { Integrations } from "./pages/Integrations";
import { Billing } from "./pages/Billing";
import { Team } from "./pages/Team";
import { KanbanBoard } from "./pages/KanbanBoard";
import { Documentation } from "./pages/Documentation";
import { WorkflowBuilder } from "./pages/WorkflowBuilder";
import { CodeEditor } from "./pages/CodeEditor";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  {
    path: "/app",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "routes", Component: Routes },
      { path: "playground", Component: Playground },
      { path: "analytics", Component: Analytics },
      { path: "integrations", Component: Integrations },
      { path: "billing", Component: Billing },
      { path: "team", Component: Team },
      { path: "kanban", Component: KanbanBoard },
      { path: "docs", Component: Documentation },
      { path: "workflow", Component: WorkflowBuilder },
      { path: "code", Component: CodeEditor },
      { path: "settings", Component: Settings },
    ],
  },
]);
