"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

import { SmartImage } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";

/**
 * Home hero.
 *
 * Desktop: the full desktop artwork is kept intact (object-contain, anchored
 * right) and the site copy sits in the artwork's left negative space.
 * Mobile: copy first, then the complete mobile artwork below (object-contain,
 * natural aspect ratio) so nothing — head, fists, trophy or medal — is cropped.
 */
export function HomeHero() {
  const { content, t, wa } = useSite();
  const section = content.pages.home.sections.hero;
  const reduce = useReducedMotion();
  const whatsappHref = wa("home");

  // The hero artwork is editable in two places: "Homepage Editor → hero → Section
  // image" and "Key Image Paths". Either one wins over the bundled fallback.
  const desktopArt = section?.image || content.media.heroDesktop || "/images/dilraaj-hero-desktop.webp.jpg";
  const mobileArt = section?.imageMobile || content.media.heroMobile || desktopArt;

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="relative isolate overflow-hidden bg-[#0B0B0B] pt-28 md:pt-32">
      {/* Ambient brand lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(185,39,45,0.28),transparent_65%)] blur-2xl" />
        <div className="absolute right-1/4 top-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,59,63,0.16),transparent_70%)] blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 to-transparent" />
      </div>

      {/* ---------- Desktop / tablet composition ---------- */}
      <div className="relative hidden md:block">
        <div className="relative mx-auto flex min-h-[82vh] max-w-[1600px] items-center px-10 pb-16 pt-10 xl:px-16">
          <div className="pointer-events-none absolute inset-y-0 right-0 left-0">
            <SmartImage
              bare
              priority
              src={desktopArt}
              alt={t(content.settings.gymName)}
              className="h-full w-full object-contain object-[right_center]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B0B0B_0%,rgba(11,11,11,0.92)_26%,rgba(11,11,11,0.35)_46%,transparent_60%)]" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
          </div>

          <motion.div {...fade(0.05)} className="relative z-10 max-w-2xl py-16 lg:max-w-[46rem]">
            <motion.span
              {...fade(0.1)}
              className="inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-[#D43B3F]"
            >
              <span className="h-px w-10 bg-[#D43B3F]/70" />
              {t(section?.eyebrow)}
            </motion.span>

            <motion.h1
              {...fade(0.2)}
              className="mt-7 font-display text-[clamp(2.6rem,5.6vw,5.2rem)] font-semibold uppercase leading-[0.94] tracking-[-0.02em] text-[#F6F3EF]"
            >
              {t(section?.title)
                .split("\n")
                .map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
            </motion.h1>

            <motion.p {...fade(0.32)} className="mt-7 max-w-xl text-base leading-relaxed text-[#AAA6A1]">
              {t(section?.body)}
            </motion.p>

            <motion.div {...fade(0.42)} className="mt-10 flex flex-wrap items-center gap-4">
              <a href={whatsappHref ?? "/membership"} target={whatsappHref ? "_blank" : undefined} rel="noopener noreferrer" className="btn btn-primary">
                {t(section?.primaryCtaLabel)}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href={section?.secondaryCtaHref || "/membership"} className="btn border border-white/20 bg-white/5 text-[#F6F3EF] hover:border-[#D43B3F]/70">
                {t(section?.secondaryCtaLabel)}
              </a>
            </motion.div>

            <motion.div {...fade(0.55)} className="mt-14 flex items-center gap-8 border-t border-white/10 pt-8">
              {[
                { value: "6", label: { en: "Days a week", bn: "দিন সপ্তাহে" } },
                { value: "3", label: { en: "Membership plans", bn: "মেম্বারশিপ প্ল্যান" } },
                { value: "1:1", label: { en: "Coaching available", bn: "কোচিং সুবিধা" } },
              ].map((item) => (
                <div key={item.value}>
                  <p className="font-display text-2xl font-semibold text-[#F6F3EF]">{item.value}</p>
                  <p className="mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-[#AAA6A1]">{t(item.label)}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ---------- Mobile: copy first, complete artwork below ---------- */}
      <div className="relative md:hidden">
        <div className="px-5 pt-4">
          <motion.span
            {...fade(0.05)}
            className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#D43B3F]"
          >
            <span className="h-px w-7 bg-[#D43B3F]/70" />
            {t(section?.eyebrow)}
          </motion.span>

          <motion.h1
            {...fade(0.15)}
            className="mt-5 font-display text-[clamp(2.1rem,10vw,3rem)] font-semibold uppercase leading-[1] tracking-[-0.01em] text-[#F6F3EF]"
          >
            {t(section?.title)}
          </motion.h1>

          <motion.p {...fade(0.25)} className="mt-5 text-[0.95rem] leading-relaxed text-[#AAA6A1]">
            {t(section?.body)}
          </motion.p>

          <motion.div {...fade(0.35)} className="mt-7 flex flex-col gap-3">
            <a href={whatsappHref ?? "/membership"} target={whatsappHref ? "_blank" : undefined} rel="noopener noreferrer" className="btn btn-primary w-full">
              {t(section?.primaryCtaLabel)}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href={section?.secondaryCtaHref || "/membership"} className="btn w-full border border-white/20 bg-white/5 text-[#F6F3EF]">
              {t(section?.secondaryCtaLabel)}
            </a>
            <a
              href={whatsappHref ?? undefined}
              target={whatsappHref ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#AAA6A1]"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              {t(content.whatsapp.floatingLabel)}
            </a>
          </motion.div>
        </div>

        <motion.div {...fade(0.45)} className="relative mt-8">
          <SmartImage
            bare
            priority
            src={mobileArt}
            alt={t(content.settings.gymName)}
            width={1280}
            height={1920}
            className="block h-auto w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
