import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Dashboard } from "./pages/Dashboard";
import { KanbanBoard } from "./pages/KanbanBoard";
import { Documentation } from "./pages/Documentation";
import { WorkflowBuilder } from "./pages/WorkflowBuilder";
import { CodeEditor } from "./pages/CodeEditor";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "kanban", Component: KanbanBoard },
      { path: "docs", Component: Documentation },
      { path: "workflow", Component: WorkflowBuilder },
      { path: "code", Component: CodeEditor },
    ],
  },
]);
