"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface AccordionEntry {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export function Accordion({ items, defaultOpen }: { items: AccordionEntry[]; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? items[0]?.id ?? null);

  return (
    <div className="divide-y divide-[color:var(--border)] overflow-hidden rounded-2xl border border-line bg-card">
      {items.map((item) => {
        const expanded = open === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : item.id)}
                aria-expanded={expanded}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-surface/60 md:px-8"
              >
                <span className="flex items-center gap-4">
                  {item.category ? (
                    <span className="hidden shrink-0 rounded-full border border-line px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted sm:inline">
                      {item.category}
                    </span>
                  ) : null}
                  <span className={cn("text-base font-medium md:text-lg", expanded ? "text-accent" : "text-ink")}>
                    {item.question}
                  </span>
                </span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted">
                  {expanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="whitespace-pre-line px-6 pb-6 text-sm leading-relaxed text-muted md:px-8 md:pr-24">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
