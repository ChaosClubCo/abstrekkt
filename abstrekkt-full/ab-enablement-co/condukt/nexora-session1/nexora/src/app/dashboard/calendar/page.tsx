import { Calendar } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function CalendarPage() {
  return (
    <ModuleShell
      icon={Calendar}
      title="Calendar & Booking"
      description="Appointments, booking pages, and calendar sync"
      color="text-amber-400"
      bg="bg-amber-500/10"
      stats={[
        { label: "This Week", value: "12" },
        { label: "Upcoming", value: "28" },
        { label: "Booking Pages", value: "3" },
        { label: "No-Show Rate", value: "4%" },
      ]}
      actions={[{ label: "Booking Pages" }, { label: "New Appointment" }]}
    />
  );
}
