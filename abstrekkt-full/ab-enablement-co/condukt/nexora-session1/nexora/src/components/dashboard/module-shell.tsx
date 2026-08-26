import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ModuleShellProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bg: string;
  stats?: { label: string; value: string }[];
  actions?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export function ModuleShell({
  icon: Icon,
  title,
  description,
  color,
  bg,
  stats,
  actions,
  children,
}: ModuleShellProps) {
  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${bg}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {actions && (
          <div className="flex gap-3">
            {actions.map((action, i) => (
              <Button
                key={action.label}
                variant={i === actions.length - 1 ? "default" : "outline"}
                size="sm"
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl border border-border/30 bg-card/30">
              <div className="text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {children || (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border/40 bg-card/10">
          <div className={`p-4 rounded-2xl ${bg} mb-4`}>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title} Module
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
            This module will be fully built in an upcoming session. The navigation,
            layout, and routing are production-ready.
          </p>
          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Back to Dashboard</Button>
            </Link>
            <Button size="sm">
              Coming in Session 2+
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
