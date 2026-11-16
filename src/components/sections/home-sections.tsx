"use client";

import Link from "next/link";
import { ArrowRight, Award, Check, Clock3, Compass, Dumbbell, HeartHandshake, MapPin, MessageCircle, Phone, Sparkles, Target, UserCheck } from "lucide-react";

import { BenefitCard, PlanCard, ProgramCard, ScheduleTable, TestimonialCard, TrainerCard, TransformationCard } from "@/components/cards/cards";
import { Reveal } from "@/components/common/reveal";
import { SectionHeading, SmartImage } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";
import { cn } from "@/lib/utils";
import { telLink } from "@/lib/whatsapp";

const benefitIcons = [<UserCheck key="1" className="h-5 w-5" />, <Dumbbell key="2" className="h-5 w-5" />, <Compass key="3" className="h-5 w-5" />, <HeartHandshake key="4" className="h-5 w-5" />];

export function PhilosophySection() {
  const { content, t } = useSite();
  const section = content.pages.home.sections.philosophy;
  if (!section?.enabled) return null;

  return (
    <section className="relative py-20 md:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal variant="left">
          <span className="eyebrow">{t(section.eyebrow)}</span>
          <h2 className="display-lg mt-6 max-w-xl text-balance">{t(section.title)}</h2>
          <p className="lede mt-6 whitespace-pre-line">{t(section.body)}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={section.primaryCtaHref || "/about"} className="btn btn-primary">
              {t(section.primaryCtaLabel)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            {[content.pages.about.sections.mission, content.pages.about.sections.vision].map((block) => (
              <div key={block?.key}>
                <p className="text-[0.72rem] font-semibold uppercase leading-[1.2] tracking-[0.2em] text-accent-soft">{t(block?.eyebrow)}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(block?.title)}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal variant="right" delay={0.1}>
          <SmartImage src={section.image} alt={t(section.title)} className="aspect-[4/5] w-full" priority={false} />
        </Reveal>
      </div>
    </section>
  );
}

export function ProgramsSection({ limit = 8, id }: { limit?: number; id?: string }) {
  const { content, t } = useSite();
  const section = content.pages.home.sections.programs;
  if (!section?.enabled) return null;
  const programs = content.collections.programs
    .filter((program) => program.published)
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);

  return (
    <section id={id} className="relative bg-surface py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
          </Reveal>
          {section.primaryCtaLabel ? (
            <Reveal delay={0.1}>
              <Link href={section.primaryCtaHref || "/membership#programs"} className="btn btn-outline">
                {t(section.primaryCtaLabel)}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          ) : null}
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhySection() {
  const { content, t } = useSite();
  const section = content.pages.home.sections.why;
  if (!section?.enabled) return null;

  return (
    <section className="relative py-20 md:py-28">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="space-y-6">
            <Reveal>
              <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.body)} />
            </Reveal>
            <Reveal delay={0.1}>
              <SmartImage src={section.image} alt={t(section.title)} className="aspect-[4/3] w-full" />
            </Reveal>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {(section.items ?? []).map((item, index) => (
              <BenefitCard
                key={item.id}
                title={t(item.title)}
                body={t(item.body)}
                icon={benefitIcons[index % benefitIcons.length]}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedTrainerSection() {
  const { content, t } = useSite();
  const section = content.pages.home.sections.trainer;
  if (!section?.enabled) return null;
  const trainer = content.collections.trainers.filter((item) => item.published).sort((a, b) => a.order - b.order)[0];
  if (!trainer) return null;

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-28">
      <div className="accent-glow -right-32 top-10 h-96 w-96 opacity-50" />
      <div className="shell relative grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal variant="left">
          <SmartImage src={trainer.image} alt={t(trainer.name)} className="aspect-[3/4] w-full" />
        </Reveal>

        <Reveal variant="right" delay={0.1}>
          <span className="eyebrow">{t(section.eyebrow)}</span>
          <h2 className="display-lg mt-6 text-balance">{t(section.title)}</h2>
          <p className="mt-6 font-display text-2xl font-semibold uppercase tracking-wide text-accent-soft">
            {t(trainer.name)}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">{t(trainer.position)}</p>
          <p className="lede mt-6">{t(trainer.bio)}</p>

          <dl className="mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-3">
            <div>
              <dt className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">
                <Target className="h-3.5 w-3.5 text-accent" /> Specialisation
              </dt>
              <dd className="mt-2 text-sm text-ink">{t(trainer.specialization)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">
                <Clock3 className="h-3.5 w-3.5 text-accent" /> Experience
              </dt>
              <dd className="mt-2 text-sm text-ink">{t(trainer.experience)}</dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">
                <Award className="h-3.5 w-3.5 text-accent" /> Achievements
              </dt>
              <dd className="mt-2 text-sm text-ink">{t(trainer.achievements)}</dd>
            </div>
          </dl>

          <div className="mt-10">
            <Link href={section.primaryCtaHref || "/about#team"} className="btn btn-primary">
              {t(section.primaryCtaLabel)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function TransformationPreviewSection() {
  const { content, t } = useSite();
  const section = content.pages.home.sections.transformation;
  if (!section?.enabled) return null;
  const stories = content.collections.transformations
    .filter((item) => item.published)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return (
    <section className="py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href={section.primaryCtaHref || "/transformation"} className="btn btn-outline">
              {t(section.primaryCtaLabel)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {stories.map((story, index) => (
            <TransformationCard key={story.id} transformation={story} index={index} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MembershipPreviewSection() {
  const { content, t } = useSite();
  const section = content.pages.home.sections.membership;
  if (!section?.enabled) return null;
  const plans = content.collections.plans.filter((plan) => plan.published).sort((a, b) => a.order - b.order);

  return (
    <section className="relative bg-surface py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} align="center" className="mx-auto items-center text-center" />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
        <Reveal delay={0.1} className="mt-12 text-center">
          <Link href={section.primaryCtaHref || "/membership#plans"} className="btn btn-outline">
            {t(section.primaryCtaLabel)}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function SchedulePreviewSection() {
  const { content, t } = useSite();
  const section = content.pages.home.sections.schedule;
  if (!section?.enabled) return null;
  const rows = content.collections.schedule
    .filter((row) => row.published)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6)
    .map((row) => ({
      id: row.id,
      day: t(row.day),
      time: row.time,
      session: t(row.session),
      trainer: t(row.trainer),
      available: row.available,
    }));

  return (
    <section className="py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href={section.primaryCtaHref || "/membership#schedule"} className="btn btn-outline">
              {t(section.primaryCtaLabel)}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12 overflow-x-auto">
          <ScheduleTable rows={rows} />
        </Reveal>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const { content, t } = useSite();
  const section = content.pages.home.sections.testimonials;
  if (!section?.enabled) return null;
  const items = content.collections.testimonials.filter((item) => item.published).sort((a, b) => a.order - b.order);

  return (
    <section className="relative bg-surface py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <TestimonialCard key={item.id} testimonial={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function VisitSection() {
  const { content, t } = useSite();
  const section = content.pages.home.sections.visit;
  if (!section?.enabled) return null;
  const { settings } = content;

  return (
    <section className="py-20 md:py-28">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal variant="left">
            <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.body)} />
            <ul className="mt-10 space-y-6">
              <li className="flex gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">Address</p>
                  <p className="mt-1 text-sm text-ink">{t(settings.address)}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">Phone</p>
                  <a href={telLink(settings.phone)} className="mt-1 block text-sm text-ink hover:text-accent">
                    {settings.phone}
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">WhatsApp</p>
                  <p className="mt-1 text-sm text-ink">
                    {content.whatsapp.number ? content.whatsapp.number : "Configure in Admin → WhatsApp & Contact"}
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <Clock3 className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">Opening hours</p>
                  <p className="mt-1 text-sm text-ink">{t(settings.openingHours)}</p>
                </div>
              </li>
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t(section.primaryCtaLabel) || "Get Directions"}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>

          <Reveal variant="right" delay={0.1}>
            <div className="h-full min-h-[22rem] overflow-hidden rounded-2xl border border-line">
              <iframe
                title="DilRaaj Gym & Fitness Centre location"
                src={`https://www.google.com/maps?q=${encodeURIComponent("Rangpur, Bangladesh")}&output=embed`}
                className="h-full min-h-[22rem] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function FinalCtaSection({ pageKey = "home", title, body, label, tone = "dark" }: { pageKey?: "home" | "about" | "transformation" | "membership" | "faq" | "faqIntent"; title?: string; body?: string; label?: string; tone?: "dark" | "accent" }) {
  const { content, t, wa } = useSite();
  const section = content.pages[pageKey]?.sections.cta;
  if (section && !section.enabled) return null;

  const intent = pageKey === "membership" ? "membership" : pageKey === "faq" ? "faq" : pageKey === "transformation" ? "transformation" : "home";
  const href = wa(intent);
  const heading = title ?? t(section?.title);
  const copy = body ?? t(section?.body);
  const cta = label ?? t(section?.primaryCtaLabel);

  // The accent tone paints the whole band red, so every foreground element
  // switches to white/light — a red-on-red button or grey-on-red copy would be
  // unreadable.
  const onAccent = tone === "accent";

  return (
    <section className="relative overflow-hidden">
      <div className={onAccent ? "bg-accent" : "bg-[#0B0B0B]"}>
        <div className="pointer-events-none absolute inset-0">
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl",
              onAccent
                ? "bg-[radial-gradient(circle,rgba(0,0,0,0.22),transparent_65%)]"
                : "bg-[radial-gradient(circle,rgba(212,59,63,0.35),transparent_65%)]"
            )}
          />
        </div>
        <div className="shell relative py-20 text-center md:py-28">
          <Reveal>
            <span className={cn("eyebrow justify-center", onAccent && "on-accent")}>
              <Sparkles className="h-3.5 w-3.5" />
              {t(content.settings.tagline)}
            </span>
            <h2 className="display-lg mx-auto mt-6 max-w-3xl text-balance text-[#F6F3EF]">{heading}</h2>
            <p
              className={cn(
                "mx-auto mt-5 max-w-xl text-sm leading-relaxed md:text-base",
                onAccent ? "text-white/85" : "text-[#AAA6A1]"
              )}
            >
              {copy}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("btn", onAccent ? "bg-white text-[#B9272D] hover:bg-[#F6F3EF]" : "btn-primary")}
                >
                  <MessageCircle className="h-4 w-4" />
                  {cta}
                </a>
              ) : (
                <span
                  className={cn("btn cursor-help", onAccent ? "bg-white text-[#B9272D] hover:bg-[#F6F3EF]" : "btn-primary")}
                  title="Add the WhatsApp number in Admin → WhatsApp & Contact to enable this button."
                >
                  <MessageCircle className="h-4 w-4" />
                  {cta}
                </span>
              )}
              <Link
                href="/membership"
                className={cn(
                  "btn text-[#F6F3EF]",
                  onAccent ? "border border-white/45 bg-white/10" : "border border-white/20 bg-white/5"
                )}
              >
                {t(content.header.ctaLabel)}
              </Link>
            </div>
            {!href ? (
              <p
                className={cn(
                  "mx-auto mt-5 max-w-md text-[0.7rem] leading-relaxed",
                  onAccent ? "text-white/80" : "text-[#AAA6A1]"
                )}
              >
                WhatsApp number not configured yet — add it in Admin → WhatsApp &amp; Contact and this button will open a
                chat instantly.
              </p>
            ) : null}
            <ul
              className={cn(
                "mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.68rem] uppercase tracking-[0.18em]",
                onAccent ? "text-white/80" : "text-[#AAA6A1]"
              )}
            >
              {["No pressure sales", "Free floor tour", "Coaching included"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className={cn("h-3.5 w-3.5", onAccent ? "text-white" : "text-[#D43B3F]")} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
