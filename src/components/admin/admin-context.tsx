"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { clone } from "@/lib/admin/path";
import { createDefaultContent } from "@/lib/content/defaults";
import type { SiteContent } from "@/types/content";

interface AdminContextValue {
  content: SiteContent;
  dirty: boolean;
  saving: boolean;
  message: string | null;
  update: (mutator: (draft: SiteContent) => void) => void;
  replace: (next: SiteContent) => void;
  save: () => Promise<boolean>;
  resetToDefaults: () => void;
  notify: (message: string) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ initialContent, children }: { initialContent: SiteContent; children: ReactNode }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 3600);
    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const update = useCallback((mutator: (draft: SiteContent) => void) => {
    setContent((previous) => {
      const draft = clone(previous);
      mutator(draft);
      return draft;
    });
    setDirty(true);
  }, []);

  const replace = useCallback((next: SiteContent) => {
    setContent(next);
    setDirty(true);
  }, []);

  const notify = useCallback((value: string) => setMessage(value), []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Save failed");
      const data = (await response.json()) as { content: SiteContent };
      setContent(data.content);
      setDirty(false);
      setMessage("Saved. The public website now shows these changes.");
      router.refresh();
      return true;
    } catch (error) {
      setMessage((error as Error).message || "Could not save changes.");
      return false;
    } finally {
      setSaving(false);
    }
  }, [content, router]);

  const resetToDefaults = useCallback(() => {
    const defaults = createDefaultContent();
    setContent(defaults);
    setDirty(true);
    setMessage("Demo content restored in this browser. Press Save to persist it.");
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({ content, dirty, saving, message, update, replace, save, resetToDefaults, notify }),
    [content, dirty, saving, message, update, replace, save, resetToDefaults, notify],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside <AdminProvider>");
  return context;
}
