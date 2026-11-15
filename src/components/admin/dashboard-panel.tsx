"use client";

import Link from "next/link";
import { AlertTriangle, ArrowUpRight } from "lucide-react";

import { useAdmin } from "@/components/admin/admin-context";
import { MODULES } from "@/lib/admin/config";

export function DashboardPanel() {
  const { content } = useAdmin();
  const collections = content.collections;

  const stats = [
    { label: "Public pages", value: Object.values(content.pages).filter((page) => page.published).length, hint: "Home · About · Transformation · Membership · FAQ" },
    { label: "Programs", value: collections.programs.length, hint: `${collections.programs.filter((p) => p.published).length} published` },
    { label: "Trainers", value: collections.trainers.length, hint: `${collections.trainers.filter((p) => p.published).length} published` },
    { label: "Transformations", value: collections.transformations.length, hint: `${collections.transformations.filter((p) => p.published).length} published` },
    { label: "Membership plans", value: collections.plans.length, hint: `${collections.plans.filter((p) => p.published).length} published` },
    { label: "Schedule sessions", value: collections.schedule.length, hint: `${collections.schedule.filter((p) => p.published).length} published` },
    { label: "FAQ entries", value: collections.faqs.length, hint: `${collections.faqs.filter((p) => p.published).length} published` },
    { label: "Testimonials", value: collections.testimonials.length, hint: `${collections.testimonials.filter((p) => p.published).length} published` },
  ];

  const shortcuts = [
    { slug: "settings", label: "Business details", note: "Name, address, phone, WhatsApp" },
    { slug: "homepage", label: "Homepage", note: "Hero copy, sections, images" },
    { slug: "programs", label: "Programs", note: "Cards on Home & Membership" },
    { slug: "membership", label: "Membership plans", note: "Pricing and benefits" },
    { slug: "media", label: "Media library", note: "Replace hero and section images" },
    { slug: "whatsapp", label: "WhatsApp", note: "Floating button and messages" },
  ];

  const demoFields = [
    "Phone number",
    "WhatsApp number",
    "Address",
    "Opening hours",
    "Trainer profiles",
    "Transformation stories",
    "Membership prices",
    "Testimonials",
    "Social links",
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-line bg-surface/50 p-8">
        <p className="eyebrow">Dashboard</p>
        <h1 className="display-lg mt-4">{content.settings.gymName.en}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{content.settings.description.en}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-[0.62rem] uppercase tracking-[0.16em] text-muted">
          <span className="rounded-full border border-line px-3 py-1">5 public pages</span>
          <span className="rounded-full border border-line px-3 py-1">Content updated {new Date(content.updatedAt).toLocaleString()}</span>
          <span className="rounded-full border border-line px-3 py-1">Bilingual · EN / বাংলা</span>
        </div>
      </section>

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted">Content inventory</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-line bg-card p-5">
              <p className="font-display text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-accent-soft">{stat.label}</p>
              <p className="mt-2 text-[0.68rem] text-muted">{stat.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-muted">Quick editing shortcuts</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((shortcut) => (
            <Link key={shortcut.slug} href={`/admin/${shortcut.slug}`} className="group rounded-2xl border border-line bg-card p-5 transition-colors hover:border-accent/60">
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                {shortcut.label}
                <ArrowUpRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </p>
              <p className="mt-1 text-xs text-muted">{shortcut.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-6">
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-amber-500">
          <AlertTriangle className="h-4 w-4" /> Demo content still to confirm
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The website is fully populated with illustrative demo content so it can be presented immediately. Replace the
          following with confirmed business information before going live:
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {demoFields.map((item) => (
            <li key={item} className="rounded-full border border-amber-500/40 px-3 py-1 text-[0.62rem] uppercase tracking-[0.12em] text-amber-500">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">
          All admin modules: {MODULES.length}. Fields carrying sample data are tagged with a <strong>demo content</strong> badge
          inside the editors.
        </p>
      </section>
    </div>
  );
}
