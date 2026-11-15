import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminProvider } from "@/components/admin/admin-context";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminLogin } from "@/components/admin/login-form";
import { isAuthenticated } from "@/lib/auth";
import { getSiteContent } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAuthenticated();

  if (!authed) {
    return <AdminLogin />;
  }

  const content = await getSiteContent();

  return (
    <AdminProvider initialContent={content}>
      <AdminShell siteName={content.settings.gymName.en}>{children}</AdminShell>
    </AdminProvider>
  );
}
