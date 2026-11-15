import { ModulePanel } from "@/components/admin/module-renderer";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return <ModulePanel slug="dashboard" />;
}
