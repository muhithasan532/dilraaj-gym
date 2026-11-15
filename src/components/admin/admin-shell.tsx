"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import * as Icons from "lucide-react";
import { Globe, LayoutDashboard, LogOut, Menu, Save, X } from "lucide-react";

import { useAdmin } from "@/components/admin/admin-context";
import { SmartImage } from "@/components/common/ui";
import { MODULES } from "@/lib/admin/config";
import { cn } from "@/lib/utils";

const GROUP_ORDER = ["Overview", "Content", "Collections", "Global", "System"] as const;

function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? LayoutDashboard;
  return <Icon className={className} />;
}

export function AdminShell({ children, siteName }: { children: React.ReactNode; siteName: string }) {
  const { content, dirty, saving, save, message } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  };

  const current = MODULES.find((module) => pathname === `/admin/${module.slug}`);

  return (
    <div className="min-h-screen bg-bg lg:flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 shrink-0 overflow-y-auto border-r border-line bg-surface px-5 py-6 transition-transform lg:static lg:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <SmartImage bare src={content.settings.logoImage} alt="" fallbackSrc="/images/brand/logo.svg" className="h-9 w-9 text-ink" />
            <span>
              <span className="block font-display text-sm font-semibold uppercase tracking-[0.24em]">DilRaaj</span>
              <span className="block text-[0.55rem] uppercase tracking-[0.2em] text-muted">Admin CMS</span>
            </span>
          </Link>
          <button type="button" onClick={() => setNavOpen(false)} className="grid h-9 w-9 place-items-center rounded-full border border-line lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 space-y-6" aria-label="Admin modules">
          {GROUP_ORDER.map((group) => (
            <div key={group}>
              <p className="px-3 text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-muted/70">{group}</p>
              <ul className="mt-2 space-y-1">
                {MODULES.filter((module) => module.group === group).map((module) => {
                  const active = pathname === `/admin/${module.slug}`;
                  return (
                    <li key={module.slug}>
                      <Link
                        href={`/admin/${module.slug}`}
                        onClick={() => setNavOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          active ? "bg-accent text-white" : "text-muted hover:bg-card hover:text-ink",
                        )}
                      >
                        <ModuleIcon name={module.icon} className="h-4 w-4" />
                        {module.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-10 space-y-3 border-t border-line pt-6">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted hover:text-ink">
            <Globe className="h-4 w-4" /> View public website
          </Link>
          <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted hover:text-accent">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {navOpen ? <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setNavOpen(false)} /> : null}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setNavOpen(true)} className="grid h-9 w-9 place-items-center rounded-full border border-line lg:hidden">
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <p className="font-display text-sm font-semibold uppercase tracking-[0.18em]">{current?.title ?? "Dashboard"}</p>
                <p className="text-[0.68rem] text-muted">{siteName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {message ? <span className="hidden max-w-xs truncate text-xs text-muted md:block">{message}</span> : null}
              <span className={cn("hidden rounded-full border px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] sm:block", dirty ? "border-amber-500/40 text-amber-500" : "border-emerald-500/40 text-emerald-500")}>
                {dirty ? "Unsaved" : "Saved"}
              </span>
              <button type="button" onClick={() => void save()} disabled={saving} className="btn btn-primary px-5 py-2.5 text-[0.66rem] disabled:opacity-60">
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">{children}</main>

        <footer className="border-t border-line px-5 py-6 text-xs text-muted lg:px-10">
          <p>
            Demo CMS · password gate is for presentation only — production deployments must use real authentication
            (Supabase Auth) and database authorisation policies.
          </p>
        </footer>
      </div>
    </div>
  );
}
