import { Package } from "lucide-react";
import { ModuleShell } from "@/components/dashboard/module-shell";

export default function ProductsPage() {
  return (
    <ModuleShell
      icon={Package}
      title="Products"
      description="Product catalog, pricing, and follow-ups"
      color="text-rose-400"
      bg="bg-rose-500/10"
      stats={[
        { label: "Products", value: "24" },
        { label: "Active", value: "18" },
        { label: "Revenue (MTD)", value: "€8,240" },
        { label: "Consultations", value: "12" },
      ]}
      actions={[{ label: "Import" }, { label: "New Product" }]}
    />
  );
}
