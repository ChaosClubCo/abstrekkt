import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  Plus,
  Filter,
  Search,
  ChevronDown,
  Circle,
  AlertCircle,
  ArrowUp,
  Minus,
  ArrowDown,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  Flag,
  Clock,
} from "lucide-react";

type Priority = "urgent" | "high" | "medium" | "low";
type Status = "backlog" | "todo" | "in-progress" | "in-review" | "done";

interface KanbanTask {
  id: string;
  title: string;
  desc?: string;
  priority: Priority;
  assignee: string;
  avatarColor: string;
  initials: string;
  labels: string[];
  comments: number;
  attachments: number;
  dueDate?: string;
  estimate?: string;
}

interface Column {
  id: Status;
  title: string;
  color: string;
  dotColor: string;
  tasks: KanbanTask[];
}

const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    color: "#6b7094",
    dotColor: "#3a3c5a",
    tasks: [
      {
        id: "t1",
        title: "Implement dark mode toggle",
        desc: "Add persistent dark/light theme support",
        priority: "medium",
        assignee: "Alex Chen",
        avatarColor: "#5e6ad2",
        initials: "AC",
        labels: ["UI", "Feature"],
        comments: 4,
        attachments: 1,
        estimate: "3d",
      },
      {
        id: "t2",
        title: "Optimize database queries",
        desc: "Reduce N+1 queries in user endpoints",
        priority: "high",
        assignee: "Sam Rivera",
        avatarColor: "#22c55e",
        initials: "SR",
        labels: ["Backend", "Performance"],
        comments: 2,
        attachments: 0,
        estimate: "5d",
        dueDate: "May 20",
      },
      {
        id: "t3",
        title: "Write integration tests",
        priority: "low",
        assignee: "Jordan Lee",
        avatarColor: "#f59e0b",
        initials: "JL",
        labels: ["Testing"],
        comments: 0,
        attachments: 0,
        estimate: "2d",
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    color: "#94a3b8",
    dotColor: "#475569",
    tasks: [
      {
        id: "t4",
        title: "Design new onboarding flow",
        desc: "Redesign the 3-step user onboarding experience",
        priority: "high",
        assignee: "Morgan Kim",
        avatarColor: "#a78bfa",
        initials: "MK",
        labels: ["Design", "UX"],
        comments: 7,
        attachments: 3,
        estimate: "4d",
        dueDate: "May 15",
      },
      {
        id: "t5",
        title: "Fix auth token expiry bug",
        priority: "urgent",
        assignee: "Alex Chen",
        avatarColor: "#5e6ad2",
        initials: "AC",
        labels: ["Bug", "Auth"],
        comments: 5,
        attachments: 1,
        estimate: "1d",
        dueDate: "May 12",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#fb923c",
    dotColor: "#f97316",
    tasks: [
      {
        id: "t6",
        title: "Build analytics dashboard",
        desc: "Charts and metrics for the admin panel",
        priority: "high",
        assignee: "Sam Rivera",
        avatarColor: "#22c55e",
        initials: "SR",
        labels: ["Feature", "Analytics"],
        comments: 12,
        attachments: 4,
        estimate: "8d",
        dueDate: "May 18",
      },
      {
        id: "t7",
        title: "API rate limiting middleware",
        priority: "medium",
        assignee: "Jordan Lee",
        avatarColor: "#f59e0b",
        initials: "JL",
        labels: ["Backend", "Security"],
        comments: 3,
        attachments: 0,
        estimate: "3d",
      },
      {
        id: "t8",
        title: "Migrate to GraphQL subscriptions",
        priority: "medium",
        assignee: "Morgan Kim",
        avatarColor: "#a78bfa",
        initials: "MK",
        labels: ["GraphQL", "Backend"],
        comments: 6,
        attachments: 2,
        estimate: "6d",
      },
    ],
  },
  {
    id: "in-review",
    title: "In Review",
    color: "#a78bfa",
    dotColor: "#7c3aed",
    tasks: [
      {
        id: "t9",
        title: "Notification system refactor",
        desc: "Move to event-driven architecture",
        priority: "medium",
        assignee: "Alex Chen",
        avatarColor: "#5e6ad2",
        initials: "AC",
        labels: ["Refactor", "Backend"],
        comments: 9,
        attachments: 1,
        estimate: "5d",
      },
      {
        id: "t10",
        title: "Keyboard shortcuts",
        priority: "low",
        assignee: "Sam Rivera",
        avatarColor: "#22c55e",
        initials: "SR",
        labels: ["UX", "Accessibility"],
        comments: 2,
        attachments: 0,
        estimate: "2d",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#22c55e",
    dotColor: "#16a34a",
    tasks: [
      {
        id: "t11",
        title: "User profile settings page",
        priority: "medium",
        assignee: "Jordan Lee",
        avatarColor: "#f59e0b",
        initials: "JL",
        labels: ["Feature", "UI"],
        comments: 4,
        attachments: 0,
        estimate: "3d",
      },
      {
        id: "t12",
        title: "CI/CD pipeline setup",
        priority: "high",
        assignee: "Morgan Kim",
        avatarColor: "#a78bfa",
        initials: "MK",
        labels: ["DevOps"],
        comments: 3,
        attachments: 2,
        estimate: "2d",
      },
    ],
  },
];

const priorityConfig: Record<
  Priority,
  {
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    color: string;
    label: string;
  }
> = {
  urgent: { icon: AlertCircle, color: "#ef4444", label: "Urgent" },
  high: { icon: ArrowUp, color: "#f97316", label: "High" },
  medium: { icon: Minus, color: "#eab308", label: "Medium" },
  low: { icon: ArrowDown, color: "#6b7094", label: "Low" },
};

const labelColors: Record<string, string> = {
  UI: "#5e6ad2",
  Feature: "#22c55e",
  Backend: "#fb923c",
  Performance: "#f59e0b",
  Testing: "#a78bfa",
  Design: "#ec4899",
  UX: "#06b6d4",
  Bug: "#ef4444",
  Auth: "#ef4444",
  Analytics: "#5e6ad2",
  Security: "#ef4444",
  GraphQL: "#e10098",
  Refactor: "#8b5cf6",
  Accessibility: "#06b6d4",
  DevOps: "#fb923c",
  "Pull Request": "#22c55e",
};

const ITEM_TYPE = "KANBAN_CARD";

function DraggableCard({
  task,
  columnId,
  onMoveCard,
}: {
  task: KanbanTask;
  columnId: Status;
  onMoveCard: (taskId: string, fromCol: Status, toCol: Status) => void;
}) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ITEM_TYPE,
    item: { taskId: task.id, fromCol: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const PriorityIcon = priorityConfig[task.priority].icon;

  return (
    <div
      ref={dragRef as any}
      className="rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all duration-150"
      style={{
        background: "#12121e",
        border: `1px solid ${isDragging ? "#5e6ad2" : "#1c1d2e"}`,
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? "0 0 0 2px rgba(94,106,210,0.3)" : "none",
        transform: isDragging ? "rotate(2deg)" : "none",
      }}
    >
      {/* Top row: priority + menu */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <PriorityIcon
            size={12}
            style={{ color: priorityConfig[task.priority].color }}
          />
          <span
            style={{
              color: priorityConfig[task.priority].color,
              fontSize: "0.65rem",
              fontWeight: 500,
            }}
          >
            {priorityConfig[task.priority].label}
          </span>
        </div>
        <button style={{ color: "#3a3c5a" }}>
          <MoreHorizontal size={13} />
        </button>
      </div>

      {/* Title */}
      <p
        style={{
          color: "#d4d8f0",
          fontSize: "0.8rem",
          fontWeight: 500,
          lineHeight: 1.4,
          marginBottom: 4,
        }}
      >
        {task.title}
      </p>
      {task.desc && (
        <p
          className="line-clamp-1"
          style={{
            color: "#4a4f70",
            fontSize: "0.7rem",
            marginBottom: 8,
            lineHeight: 1.3,
          }}
        >
          {task.desc}
        </p>
      )}

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.labels.map((label) => (
            <span
              key={label}
              className="px-1.5 py-0.5 rounded"
              style={{
                background: `${labelColors[label] || "#5e6ad2"}18`,
                color: labelColors[label] || "#5e6ad2",
                fontSize: "0.62rem",
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Flag size={10} style={{ color: "#ef4444" }} />
              <span style={{ color: "#ef4444", fontSize: "0.65rem" }}>
                {task.dueDate}
              </span>
            </div>
          )}
          {task.estimate && (
            <div className="flex items-center gap-1">
              <Clock size={10} style={{ color: "#4a4f70" }} />
              <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>
                {task.estimate}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {task.comments > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare size={10} style={{ color: "#4a4f70" }} />
              <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>
                {task.comments}
              </span>
            </div>
          )}
          {task.attachments > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip size={10} style={{ color: "#4a4f70" }} />
              <span style={{ color: "#4a4f70", fontSize: "0.65rem" }}>
                {task.attachments}
              </span>
            </div>
          )}
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
            style={{ background: task.avatarColor, fontSize: "0.5rem", color: "#fff", fontWeight: 700 }}
            title={task.assignee}
          >
            {task.initials}
          </div>
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({
  column,
  onMoveCard,
}: {
  column: Column;
  onMoveCard: (taskId: string, fromCol: Status, toCol: Status) => void;
}) {
  const [{ isOver }, dropRef] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { taskId: string; fromCol: Status }) => {
      if (item.fromCol !== column.id) {
        onMoveCard(item.taskId, item.fromCol, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={dropRef as any}
      className="flex flex-col min-w-0"
      style={{ flex: "0 0 220px" }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: column.dotColor }}
          />
          <span
            style={{
              color: "#b0b4d4",
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.01em",
            }}
          >
            {column.title}
          </span>
          <span
            className="px-1.5 py-0.5 rounded"
            style={{
              background: "#1a1b2e",
              color: "#4a4f70",
              fontSize: "0.65rem",
            }}
          >
            {column.tasks.length}
          </span>
        </div>
        <button
          className="w-5 h-5 rounded flex items-center justify-center transition-all"
          style={{ color: "#3a3c5a" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#1a1b2e")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "transparent")
          }
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Drop area */}
      <div
        className="flex-1 flex flex-col gap-2 p-2 rounded-xl min-h-48 transition-all duration-150"
        style={{
          background: isOver ? "rgba(94,106,210,0.05)" : "#0c0d14",
          border: `1px solid ${isOver ? "#5e6ad2" : "#14152a"}`,
          minHeight: 200,
        }}
      >
        {column.tasks.map((task) => (
          <DraggableCard
            key={task.id}
            task={task}
            columnId={column.id}
            onMoveCard={onMoveCard}
          />
        ))}
        {column.tasks.length === 0 && (
          <div
            className="flex-1 flex items-center justify-center rounded-lg"
            style={{
              border: "1px dashed #1c1d2e",
              minHeight: 80,
              margin: 4,
            }}
          >
            <p style={{ color: "#2a2c44", fontSize: "0.72rem" }}>
              Drop cards here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMoveCard = (
    taskId: string,
    fromColId: Status,
    toColId: Status
  ) => {
    setColumns((prev) => {
      const newCols = prev.map((col) => ({ ...col, tasks: [...col.tasks] }));
      const fromCol = newCols.find((c) => c.id === fromColId);
      const toCol = newCols.find((c) => c.id === toColId);
      if (!fromCol || !toCol) return prev;

      const taskIdx = fromCol.tasks.findIndex((t) => t.id === taskId);
      if (taskIdx === -1) return prev;

      const [task] = fromCol.tasks.splice(taskIdx, 1);
      toCol.tasks.push(task);
      return newCols;
    });
  };

  const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0);

  return (
    <div className="flex flex-col h-full" style={{ minHeight: "calc(100vh - 56px)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #1c1d2e" }}
      >
        <div>
          <h1
            style={{
              color: "#e4e6f0",
              fontSize: "1.1rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Sprint Board
          </h1>
          <p style={{ color: "#4a4f70", fontSize: "0.75rem" }}>
            {totalTasks} tasks · Sprint 24 · May 5 – May 18
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: "#1a1b2e", border: "1px solid #252540" }}
          >
            <Search size={13} style={{ color: "#4a4f70" }} />
            <input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none"
              style={{ color: "#e4e6f0", fontSize: "0.8rem", width: 140 }}
            />
          </div>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: "#1a1b2e",
              border: "1px solid #252540",
              color: "#6b7094",
              fontSize: "0.78rem",
            }}
          >
            <Filter size={13} />
            Filter
            <ChevronDown size={11} />
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: "#5e6ad2",
              color: "#fff",
              fontSize: "0.78rem",
            }}
          >
            <Plus size={13} />
            New Task
          </button>
        </div>
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-4 px-6 py-2.5"
        style={{ borderBottom: "1px solid #1c1d2e", background: "#0a0b11" }}
      >
        {[
          { label: "Urgent", color: "#ef4444" },
          { label: "High", color: "#f97316" },
          { label: "Medium", color: "#eab308" },
          { label: "Low", color: "#6b7094" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: color }}
            />
            <span style={{ color: "#4a4f70", fontSize: "0.7rem" }}>
              {label}
            </span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-1" style={{ fontSize: "0.7rem", color: "#4a4f70" }}>
          <Circle size={10} style={{ color: "#5e6ad2" }} />
          Drag cards between columns
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto px-6 py-5">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {columns.map((col) => (
            <DroppableColumn
              key={col.id}
              column={col}
              onMoveCard={handleMoveCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
