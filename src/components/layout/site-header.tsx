"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import { SmartImage } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";
import { LOCALES } from "@/lib/config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { content, locale, setLocale, theme, toggleTheme, t } = useSite();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const nav = (content.header.nav ?? []).filter((item) => item.enabled).sort((a, b) => a.order - b.order);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-line bg-bg/85 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70"
            : "border-b border-transparent py-5 md:py-7",
        )}
        style={
          /* Every page hero is a dark cinematic block, so the floating header
             always renders in its dark palette until it gains a solid background. */
          !scrolled && !open
            ? ({
                "--text": "#F6F3EF",
                "--muted": "#E4DFD9",
                "--border": "rgba(246,243,239,0.16)",
                "--card": "#202020",
                "--surface": "#171717",
                "--bg": "#0B0B0B",
              } as React.CSSProperties)
            : undefined
        }
      >
        <div className="shell flex items-center justify-between gap-6">
          {/* Wordmark */}
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label={t(content.settings.gymName)}>
            <span className="text-ink">
              <SmartImage
                bare
                priority
                src={content.header.logoImage}
                alt={t(content.settings.gymName)}
                width={44}
                height={44}
                fallbackSrc="/images/brand/logo.svg"
                className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[8deg] md:h-10 md:w-10"
              />
            </span>
            {content.header.showWordmark ? (
              <span className="flex flex-col leading-none">
                <span className="font-display text-lg font-semibold uppercase tracking-[0.32em] text-ink md:text-xl">
                  {content.header.wordmark}
                </span>
                <span className="mt-1 text-[0.55rem] font-medium uppercase tracking-[0.34em] text-muted md:text-[0.6rem]">
                  Gym &amp; Fitness Centre
                </span>
              </span>
            ) : null}
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-9 xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                data-active={isActive(item.href)}
                className="nav-link"
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden items-center rounded-full border border-line p-0.5 md:flex">
              {LOCALES.map((option) => (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => setLocale(option.code)}
                  aria-pressed={locale === option.code}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.12em] transition-colors",
                    locale === option.code ? "bg-accent text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {option.code === "bn" ? "বাংলা" : "EN"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-ink"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link href={content.header.ctaHref || "/membership"} className="btn btn-primary hidden md:inline-flex">
              {t(content.header.ctaLabel)}
            </Link>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent xl:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[60] xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.aside
              className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto border-l border-line bg-surface px-6 py-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-semibold uppercase tracking-[0.3em]">
                  {content.header.wordmark}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-10 flex flex-col" aria-label="Mobile primary">
                {nav.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between border-b border-line py-4 font-display text-2xl font-medium uppercase tracking-wide",
                        isActive(item.href) ? "text-accent" : "text-ink",
                      )}
                    >
                      {t(item.label)}
                      <span className="text-xs tracking-[0.2em] text-muted">0{index + 1}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between rounded-full border border-line p-1">
                  {LOCALES.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => setLocale(option.code)}
                      className={cn(
                        "flex-1 rounded-full px-3 py-2 text-xs font-semibold tracking-[0.12em] transition-colors",
                        locale === option.code ? "bg-accent text-white" : "text-muted",
                      )}
                    >
                      {option.code === "bn" ? "বাংলা" : "English"}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-between rounded-full border border-line px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em]"
                >
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <Link href={content.header.ctaHref || "/membership"} className="btn btn-primary w-full">
                  {t(content.header.ctaLabel)}
                </Link>
              </div>

              <div className="mt-auto pt-10 text-xs leading-relaxed text-muted">
                <p>{t(content.settings.address)}</p>
                <p className="mt-1">{content.settings.phone}</p>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
