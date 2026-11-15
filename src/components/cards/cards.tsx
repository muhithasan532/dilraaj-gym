"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Clock, Quote, Star, Target } from "lucide-react";

import { CompareSlider } from "@/components/cards/compare-slider";
import { Reveal } from "@/components/common/reveal";
import { SmartImage } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";
import { cn, formatBdt } from "@/lib/utils";
import type { MembershipPlan, Program, Testimonial, Trainer, Transformation } from "@/types/content";

export function ProgramCard({ program, index = 0 }: { program: Program; index?: number }) {
  const { t, wa, content } = useSite();
  const link = wa("program", { message: t(program.ctaMessage) || undefined, program: t(program.title) });
  const number = String(index + 1).padStart(2, "0");

  return (
    <Reveal delay={index * 0.06} className="group h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-soft">
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage
            bare
            src={program.image}
            alt={t(program.title)}
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur">
            {t(program.category)}
          </span>
          <span className="absolute bottom-3 right-4 font-display text-3xl font-semibold text-white/25 transition-colors group-hover:text-accent">
            {number}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="display-md">{t(program.title)}</h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t(program.body)}</p>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-soft transition-colors hover:text-accent"
            >
              Explore <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <Link
              href="/membership#programs"
              className="mt-5 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-accent-soft transition-colors hover:text-accent"
            >
              Explore <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <span className="sr-only">{t(content.settings.gymName)}</span>
        </div>
      </article>
    </Reveal>
  );
}

export function BenefitCard({
  title,
  body,
  icon,
  index = 0,
}: {
  title: string;
  body: string;
  icon: React.ReactNode;
  index?: number;
}) {
  return (
    <Reveal delay={index * 0.07}>
      <div className="h-full rounded-2xl border border-line bg-card p-7 transition-colors duration-500 hover:border-accent/50">
        <span className="grid h-12 w-12 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent-soft">
          {icon}
        </span>
        <h3 className="mt-6 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
      </div>
    </Reveal>
  );
}

export function TrainerCard({ trainer, index = 0 }: { trainer: Trainer; index?: number }) {
  const { t } = useSite();
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <article className="group h-full overflow-hidden rounded-2xl border border-line bg-card">
        <div className="relative aspect-[3/4] overflow-hidden">
          <SmartImage
            bare
            src={trainer.image}
            alt={t(trainer.name)}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-accent-soft">
              {t(trainer.position)}
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-white">{t(trainer.name)}</h3>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <p className="text-sm leading-relaxed text-muted">{t(trainer.bio)}</p>
          <dl className="space-y-2 text-xs">
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 uppercase tracking-[0.14em] text-muted">Focus</dt>
              <dd className="text-ink">{t(trainer.specialization)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 uppercase tracking-[0.14em] text-muted">Experience</dt>
              <dd className="text-ink">{t(trainer.experience)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 uppercase tracking-[0.14em] text-muted">Credentials</dt>
              <dd className="text-ink">{t(trainer.credentials)}</dd>
            </div>
          </dl>
        </div>
      </article>
    </Reveal>
  );
}

export function TransformationCard({
  transformation,
  index = 0,
  compact,
}: {
  transformation: Transformation;
  index?: number;
  compact?: boolean;
}) {
  const { t } = useSite();
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-card">
        <CompareSlider
          beforeSrc={transformation.beforeImage}
          afterSrc={transformation.afterImage}
          beforeLabel={t({ en: "Before", bn: "আগে" })}
          afterLabel={t({ en: "After", bn: "পরে" })}
          className={compact ? "aspect-[4/3]" : "aspect-[4/5]"}
        />
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">
              <Target className="h-3 w-3 text-accent" />
              {t(transformation.goal)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted">
              <Clock className="h-3 w-3 text-accent" />
              {t(transformation.duration)}
            </span>
          </div>
          <h3 className="mt-4 display-md">{t(transformation.storyTitle)}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-accent-soft">{t(transformation.name)}</p>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{t(transformation.body)}</p>
        </div>
      </article>
    </Reveal>
  );
}

export function PlanCard({ plan, index = 0 }: { plan: MembershipPlan; index?: number }) {
  const { t, wa } = useSite();
  const href = wa("membership", { message: t(plan.ctaMessage) || undefined, plan: t(plan.name) });

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <article
        className={cn(
          "relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-1.5",
          plan.recommended
            ? "border-accent/60 bg-gradient-to-b from-accent/12 to-card shadow-soft"
            : "border-line bg-card hover:border-accent/40",
        )}
      >
        {plan.recommended ? (
          <span className="absolute -top-3 left-8 rounded-full bg-accent px-4 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white">
            Recommended
          </span>
        ) : null}

        <h3 className="display-md">{t(plan.name)}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{t(plan.description)}</p>

        <div className="mt-6 flex items-end gap-2">
          <span className="font-display text-4xl font-semibold text-ink">{formatBdt(plan.price)}</span>
          <span className="pb-1 text-xs uppercase tracking-[0.16em] text-muted">{t(plan.period)}</span>
        </div>

        <div className="mt-5 grid gap-2 text-xs text-muted">
          <p className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-accent" /> {t(plan.duration)}
          </p>
          <p className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-accent" /> {t(plan.sessions)}
          </p>
        </div>

        <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{t(feature)}</span>
            </li>
          ))}
        </ul>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn("btn mt-8 w-full", plan.recommended ? "btn-primary" : "btn-outline")}
          >
            {t({ en: "Join This Plan", bn: "এই প্ল্যানে যোগ দিন" })}
          </a>
        ) : (
          <Link href="/faq" className="btn btn-outline mt-8 w-full">
            {t({ en: "Ask on WhatsApp", bn: "হোয়াটসঅ্যাপে জানুন" })}
          </Link>
        )}
      </article>
    </Reveal>
  );
}

export function TestimonialCard({ testimonial, index = 0 }: { testimonial: Testimonial; index?: number }) {
  const { t } = useSite();
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <figure className="flex h-full flex-col rounded-2xl border border-line bg-card p-7">
        <Quote className="h-7 w-7 text-accent/60" />
        <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-muted">“{t(testimonial.quote)}”</blockquote>
        <figcaption className="mt-6 border-t border-line pt-5">
          <p className="font-display text-base font-semibold uppercase tracking-wide">{t(testimonial.name)}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-accent-soft">{t(testimonial.role)}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function ScheduleTable({
  rows,
}: {
  rows: { id: string; day: string; time: string; session: string; trainer: string; available: boolean }[];
}) {
  const { t } = useSite();
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-surface text-[0.62rem] uppercase tracking-[0.2em] text-muted">
          <tr>
            <th className="px-6 py-4 font-semibold">{t({ en: "Day", bn: "দিন" })}</th>
            <th className="px-6 py-4 font-semibold">{t({ en: "Time", bn: "সময়" })}</th>
            <th className="px-6 py-4 font-semibold">{t({ en: "Session", bn: "সেশন" })}</th>
            <th className="px-6 py-4 font-semibold">{t({ en: "Trainer", bn: "ট্রেনার" })}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-line transition-colors hover:bg-card">
              <td className="px-6 py-4 font-medium text-ink">{row.day}</td>
              <td className="px-6 py-4 font-mono text-xs text-muted">{row.time}</td>
              <td className="px-6 py-4 text-muted">
                {row.session}
                {!row.available ? (
                  <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.14em]">
                    {t({ en: "Full", bn: "পূর্ণ" })}
                  </span>
                ) : null}
              </td>
              <td className="px-6 py-4 text-muted">{row.trainer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { SmartImage };
