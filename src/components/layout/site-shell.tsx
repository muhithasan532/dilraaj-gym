"use client";

import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import type { WhatsAppIntent } from "@/lib/whatsapp";

export function SiteShell({ children, intent = "home" }: { children: ReactNode; intent?: WhatsAppIntent }) {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-screen outline-none">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppFloat intent={intent} />
    </>
  );
}
