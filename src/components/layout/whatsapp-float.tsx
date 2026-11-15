"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { useSite } from "@/components/providers/site-provider";
import type { WhatsAppIntent } from "@/lib/whatsapp";

export function WhatsAppFloat({ intent = "home" }: { intent?: WhatsAppIntent }) {
  const { content, t, wa } = useSite();
  const [hint, setHint] = useState(false);
  const [notice, setNotice] = useState(false);

  if (!content.whatsapp.floatingButtonEnabled) return null;
  const href = wa(intent);

  const handleClick = (event: React.MouseEvent) => {
    if (!href) {
      event.preventDefault();
      setNotice(true);
      window.setTimeout(() => setNotice(false), 3200);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {notice ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="max-w-[16rem] rounded-xl border border-line bg-surface px-4 py-3 text-xs leading-relaxed text-muted shadow-soft"
          >
            WhatsApp number is not configured yet. Add it in <strong className="text-ink">Admin → WhatsApp &amp; Contact</strong>.
          </motion.div>
        ) : (
          <motion.span
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: hint ? 1 : 0, x: hint ? 0 : 12 }}
            exit={{ opacity: 0 }}
            onMouseEnter={() => setHint(true)}
            onMouseLeave={() => setHint(false)}
            className="pointer-events-none rounded-full border border-line bg-surface px-4 py-2 text-xs font-medium text-ink shadow-soft"
          >
            {t(content.whatsapp.floatingLabel)}
          </motion.span>
        )}
      </AnimatePresence>

      <a
        href={href ?? undefined}
        onClick={handleClick}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        aria-label={t(content.whatsapp.floatingLabel)}
        onMouseEnter={() => setHint(true)}
        onMouseLeave={() => setHint(false)}
        onFocus={() => setHint(true)}
        onBlur={() => setHint(false)}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_-16px_rgba(37,211,102,0.8)] transition-transform duration-300 hover:scale-105"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.6s]" />
        <MessageCircle className="relative h-7 w-7" />
      </a>
    </div>
  );
}
