"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { TrainerCard } from "@/components/cards/cards";
import { Reveal } from "@/components/common/reveal";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading, SmartImage } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";
import { FinalCtaSection } from "@/components/sections/home-sections";

export function AboutHero() {
  const { content, t } = useSite();
  const section = content.pages.about.sections.hero;
  return <PageHero section={section} image={section?.image || content.media.aboutHero} />;
}

export function OurStory() {
  const { content, t } = useSite();
  const section = content.pages.about.sections.story;
  if (!section?.enabled) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal variant="left">
          <span className="eyebrow">{t(section.eyebrow)}</span>
          <h2 className="display-lg mt-6 text-balance">{t(section.title)}</h2>
          <div className="lede mt-6 space-y-5 whitespace-pre-line">{t(section.body)}</div>
        </Reveal>
        <Reveal variant="right" delay={0.1}>
          <SmartImage src={section.image} alt={t(section.title)} className="aspect-[4/3] w-full" />
        </Reveal>
      </div>
    </section>
  );
}

export function MissionVision() {
  const { content, t } = useSite();
  const mission = content.pages.about.sections.mission;
  const vision = content.pages.about.sections.vision;

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="shell grid gap-6 md:grid-cols-2">
        {[mission, vision].map((block, index) => (
          <Reveal key={block?.key ?? index} delay={index * 0.08}>
            <div className="h-full rounded-3xl border border-line bg-card p-9">
              <span className="eyebrow">{t(block?.eyebrow)}</span>
              <h2 className="display-md mt-5 text-balance">{t(block?.title)}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">{t(block?.body)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function PhilosophyValues() {
  const { content, t } = useSite();
  const section = content.pages.about.sections.philosophy;
  if (!section?.enabled) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(section.items ?? []).map((item, index) => (
            <Reveal key={item.id} delay={index * 0.07}>
              <div className="h-full border-t border-line pt-6">
                <p className="font-display text-4xl font-semibold text-accent/40">0{index + 1}</p>
                <h3 className="mt-4 display-md">{t(item.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t(item.body)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FacilitiesGallery() {
  const { content, t } = useSite();
  const section = content.pages.about.sections.facilities;
  if (!section?.enabled) return null;

  return (
    <section id="facilities" className="bg-surface py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(section.items ?? []).map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06} className={index === 0 ? "lg:col-span-2" : ""}>
              <figure className="group relative h-full overflow-hidden rounded-2xl border border-line">
                <SmartImage
                  bare
                  src={item.image}
                  alt={t(item.title)}
                  className={`w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105 ${index === 0 ? "h-72 lg:h-full" : "h-72"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-xl font-semibold text-white">{t(item.title)}</h3>
                  <p className="mt-1 text-sm text-white/75">{t(item.body)}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CoachingTeam() {
  const { content, t } = useSite();
  const section = content.pages.about.sections.team;
  if (!section?.enabled) return null;
  const trainers = content.collections.trainers.filter((item) => item.published).sort((a, b) => a.order - b.order);

  return (
    <section id="team" className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer, index) => (
            <TrainerCard key={trainer.id} trainer={trainer} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const { content, t } = useSite();
  const section = content.pages.about.sections.why;
  if (!section?.enabled) return null;

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {(section.items ?? []).map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <div className="flex gap-5 border-b border-line pb-8">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                  <Check className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="display-md">{t(item.title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{t(item.body)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.15} className="mt-12">
          <Link href="/membership" className="btn btn-outline">
            {t(content.header.ctaLabel)}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutCta() {
  return <FinalCtaSection pageKey="about" tone="accent" />;
}
