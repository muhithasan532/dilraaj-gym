"use client";

import { Reveal } from "@/components/common/reveal";
import { SmartImage } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";
import { cn } from "@/lib/utils";
import type { SectionContent } from "@/types/content";

export function PageHero({
  section,
  image,
  align = "left",
  size = "default",
}: {
  section?: SectionContent;
  image?: string;
  align?: "left" | "center";
  size?: "default" | "compact";
  className?: string;
}) {
  const { t } = useSite();
  return (
    <section className="relative isolate overflow-hidden bg-[#0B0B0B] pb-16 pt-32 md:pb-24 md:pt-40">
      {image ? (
        <>
          <SmartImage
            bare
            priority
            src={image}
            alt={t(section?.title)}
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(11,11,11,0.96),rgba(11,11,11,0.75))]" />
        </>
      ) : null}
      <div className="pointer-events-none absolute -left-40 top-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(185,39,45,0.24),transparent_65%)] blur-2xl" />

      <div className={cn("shell relative", align === "center" && "text-center")}>
        <Reveal>
          <span className={cn("eyebrow", align === "center" && "justify-center")}>{t(section?.eyebrow)}</span>
          <h1
            className={cn(
              "mt-6 max-w-4xl font-display font-semibold uppercase leading-[1.02] tracking-[-0.02em] text-[#F6F3EF] text-balance",
              size === "compact" ? "text-[clamp(1.9rem,4vw,3.2rem)]" : "text-[clamp(2.2rem,5vw,4.2rem)]",
            )}
          >
            {t(section?.title)}
          </h1>
          {section?.body ? (
            <p className={cn("mt-6 max-w-2xl text-sm leading-relaxed text-[#AAA6A1] md:text-base", align === "center" && "mx-auto")}>
              {t(section.body)}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
