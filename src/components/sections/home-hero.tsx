"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { SmartImage } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";

/**
 * Home hero.
 *
 * One photo for both views: the same desktop artwork is a full-bleed
 * `object-fit: cover` background at every width (no letterboxing), with the hero
 * copy sitting on top of it. Overlays stay light — just enough gradient for
 * readable text, no heavy black or red wash over the photo.
 */
export function HomeHero() {
  const { content, t, wa } = useSite();
  const section = content.pages.home.sections.hero;
  const reduce = useReducedMotion();
  const whatsappHref = wa("home");

  // The hero artwork is editable in two places: "Homepage Editor → hero → Section
  // image" and "Key Image Paths". Either one wins over the bundled fallback.
  const heroArt = section?.image || content.media.heroDesktop || "/images/dilraaj-hero-desktop.webp.jpg";

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="relative isolate overflow-hidden bg-[#0B0B0B]">
      {/* ---------- Desktop: artwork fills the entire section ---------- */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        <SmartImage
          bare
          priority
          src={heroArt}
          alt={t(content.settings.gymName)}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Light readability gradient behind the copy. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(11,11,11,0.76)_0%,rgba(11,11,11,0.58)_30%,rgba(11,11,11,0.28)_58%,rgba(11,11,11,0.06)_82%,transparent_100%)]" />
        {/* Barely-there top scrim for the floating header. */}
        <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.16)_55%,transparent_100%)]" />
        {/* Soft blend into the section below. */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B0B0B]/60 via-[#0B0B0B]/25 to-transparent" />
      </div>

      {/* Ambient brand lighting, above the artwork and below the copy. */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className="absolute -left-40 top-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(185,39,45,0.12),transparent_65%)] blur-2xl" />
        <div className="absolute right-1/4 top-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,59,63,0.07),transparent_70%)] blur-3xl" />
      </div>

      {/* ---------- Desktop composition ---------- */}
      <div className="relative hidden lg:block">
        <div className="mx-auto flex min-h-[86vh] max-w-[1600px] items-center px-10 pb-20 pt-36 xl:px-16">
          <motion.div {...fade(0.05)} className="relative z-10 max-w-lg py-16 xl:max-w-[46rem]">
            <motion.h1
              {...fade(0.1)}
              className="text-balance font-display text-[clamp(2.6rem,5.6vw,5.2rem)] font-semibold uppercase leading-[0.94] tracking-[-0.02em] text-[#F6F3EF]"
            >
              {t(section?.title)
                .split("\n")
                .map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
            </motion.h1>

            {t(section?.body) ? (
              <motion.p {...fade(0.32)} className="mt-7 max-w-md text-base leading-relaxed text-[#FDFBF8] [text-shadow:0_1px_3px_rgba(0,0,0,0.65),0_0_22px_rgba(0,0,0,0.45)] xl:max-w-xl">
                {t(section?.body)}
              </motion.p>
            ) : null}

            <motion.div {...fade(0.42)} className="mt-10 flex flex-wrap items-center gap-4">
              <a href={whatsappHref ?? "/membership"} target={whatsappHref ? "_blank" : undefined} rel="noopener noreferrer" className="btn btn-primary">
                {t(section?.primaryCtaLabel)}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href={section?.secondaryCtaHref || "/membership"} className="btn border border-white/20 bg-white/5 text-[#F6F3EF] hover:border-[#D43B3F]/70">
                {t(section?.secondaryCtaLabel)}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ---------- Mobile / tablet: same photo as a background, copy on top ---------- */}
      <div className="relative flex min-h-[100svh] flex-col justify-center lg:hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <SmartImage
            bare
            priority
            src={heroArt}
            alt={t(content.settings.gymName)}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,11,0.82)_0%,rgba(11,11,11,0.7)_40%,rgba(11,11,11,0.5)_70%,rgba(11,11,11,0.85)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0B0B0B] to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-2xl -translate-y-24 px-5 pb-16 pt-28 md:pt-32">
          <motion.h1
            {...fade(0.05)}
            className="text-balance font-display text-[clamp(2.1rem,10vw,3rem)] font-semibold uppercase leading-[1] tracking-[-0.01em] text-[#F6F3EF]"
          >
            {t(section?.title)}
          </motion.h1>

          {t(section?.body) ? (
            <motion.p {...fade(0.25)} className="mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed text-[#D9D4CE]">
              {t(section?.body)}
            </motion.p>
          ) : null}

          <motion.div {...fade(0.35)} className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a href={whatsappHref ?? "/membership"} target={whatsappHref ? "_blank" : undefined} rel="noopener noreferrer" className="btn btn-primary w-1/2 max-w-[50%] whitespace-nowrap px-2 text-[0.66rem] tracking-[0.08em] sm:w-auto sm:max-w-none sm:px-[1.7rem] sm:text-[0.78rem] sm:tracking-[0.16em]">
              {t(section?.primaryCtaLabel)}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href={section?.secondaryCtaHref || "/membership"} className="btn w-1/2 max-w-[50%] border border-white/25 bg-black/30 px-2 whitespace-nowrap text-[0.66rem] tracking-[0.08em] text-[#F6F3EF] backdrop-blur-sm sm:w-auto sm:max-w-none sm:px-[1.7rem] sm:text-[0.78rem] sm:tracking-[0.16em]">
              {t(section?.secondaryCtaLabel)}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
