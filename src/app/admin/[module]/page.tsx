import { notFound } from "next/navigation";

import { ModulePanel } from "@/components/admin/module-renderer";
import { findModule } from "@/lib/admin/config";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ module: string }> };

export async function generateMetadata({ params }: Params) {
  const { module: slug } = await params;
  const module = findModule(slug);
  return { title: module ? `${module.title} · Admin` : "Admin" };
}

export default async function AdminModulePage({ params }: Params) {
  const { module: slug } = await params;
  const module = findModule(slug);
  if (!module || module.kind === "dashboard") notFound();
  return <ModulePanel slug={slug} />;
}
