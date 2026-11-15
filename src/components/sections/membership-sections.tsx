"use client";

import Link from "next/link";
import { ArrowRight, Check, MessageCircle } from "lucide-react";

import { BenefitCard, PlanCard, ProgramCard, ScheduleTable } from "@/components/cards/cards";
import { Accordion } from "@/components/common/accordion";
import { Reveal } from "@/components/common/reveal";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading, SmartImage } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";
import { FinalCtaSection } from "@/components/sections/home-sections";
import { formatBdt } from "@/lib/utils";
import type { MembershipPlan } from "@/types/content";

export function MembershipHero() {
  const { content, t } = useSite();
  const section = content.pages.membership.sections.hero;
  return <PageHero section={section} image={section?.image} />;
}

export function MembershipPrograms() {
  const { content, t } = useSite();
  const section = content.pages.membership.sections.programs;
  if (!section?.enabled) return null;
  const programs = content.collections.programs.filter((item) => item.published).sort((a, b) => a.order - b.order);

  return (
    <section id="programs" className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, index) => (
            <ProgramCard key={program.id} program={program} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MembershipPlans() {
  const { content, t } = useSite();
  const section = content.pages.membership.sections.plans;
  if (!section?.enabled) return null;
  const plans = content.collections.plans.filter((plan) => plan.published).sort((a, b) => a.order - b.order);

  return (
    <section id="plans" className="bg-surface py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} align="center" className="items-center text-center" />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function PlanComparison() {
  const { content, t } = useSite();
  const section = content.pages.membership.sections.compare;
  if (!section?.enabled) return null;
  const plans = content.collections.plans.filter((plan) => plan.published).sort((a, b) => a.order - b.order);
  const maxFeatures = Math.max(0, ...plans.map((plan) => plan.features.length));

  return (
    <section id="compare" className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse overflow-hidden rounded-2xl border border-line text-sm">
            <thead>
              <tr className="bg-surface">
                <th className="px-6 py-5 text-left text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted">
                  {t({ en: "Benefit", bn: "সুবিধা" })}
                </th>
                {plans.map((plan) => (
                  <th key={plan.id} className="px-6 py-5 text-center">
                    <span className="block font-display text-lg font-semibold uppercase tracking-wide">{t(plan.name)}</span>
                    <span className="mt-1 block text-xs text-accent-soft">{formatBdt(plan.price)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-line">
                <td className="px-6 py-4 text-muted">{t({ en: "Membership duration", bn: "মেম্বারশিপ মেয়াদ" })}</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-center text-ink">
                    {t(plan.duration)}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-line bg-surface/40">
                <td className="px-6 py-4 text-muted">{t({ en: "Sessions", bn: "সেশন" })}</td>
                {plans.map((plan) => (
                  <td key={plan.id} className="px-6 py-4 text-center text-ink">
                    {t(plan.sessions)}
                  </td>
                ))}
              </tr>
              {Array.from({ length: maxFeatures }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-line">
                  <td className="px-6 py-4 text-muted">
                    {t(plans[0]?.features[rowIndex]) || t(plans[1]?.features[rowIndex]) || t(plans[2]?.features[rowIndex])}
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-6 py-4 text-center">
                      {plan.features[rowIndex] ? (
                        <Check className="mx-auto h-4 w-4 text-accent" />
                      ) : (
                        <span className="text-muted/40">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 overflow-x-auto">
          <p className="text-xs text-muted">
            {t({
              en: "Plan names, prices and benefits are illustrative demo data — update them in Admin → Membership.",
              bn: "প্ল্যানের নাম, মূল্য ও সুবিধা উদাহরণস্বরূপ ডেমো ডেটা — অ্যাডমিন → মেম্বারশিপ থেকে হালনাগাদ করুন।",
            })}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function PersonalTraining() {
  const { content, t, wa } = useSite();
  const section = content.pages.membership.sections.personal;
  if (!section?.enabled) return null;
  const href = wa("personalTraining");

  return (
    <section id="personal-training" className="bg-surface py-20 md:py-28">
      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal variant="left">
          <SmartImage src={section.image} alt={t(section.title)} className="aspect-[4/5] w-full" />
        </Reveal>
        <Reveal variant="right" delay={0.1}>
          <span className="eyebrow">{t(section.eyebrow)}</span>
          <h2 className="display-lg mt-6 text-balance">{t(section.title)}</h2>
          <p className="lede mt-6 whitespace-pre-line">{t(section.body)}</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {(section.items ?? []).map((item, index) => (
              <BenefitCard key={item.id} title={t(item.title)} body={t(item.body)} index={index} icon={<Check className="h-5 w-5" />} />
            ))}
          </div>

          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-10">
              <MessageCircle className="h-4 w-4" />
              {t(section.primaryCtaLabel)}
            </a>
          ) : (
            <Link href="/faq" className="btn btn-outline mt-10">
              {t(section.primaryCtaLabel)}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function WeeklyScheduleSection() {
  const { content, t } = useSite();
  const section = content.pages.membership.sections.schedule;
  if (!section?.enabled) return null;
  const rows = content.collections.schedule
    .filter((row) => row.published)
    .sort((a, b) => a.order - b.order)
    .map((row) => ({
      id: row.id,
      day: t(row.day),
      time: row.time,
      session: t(row.session),
      trainer: t(row.trainer),
      available: row.available,
    }));

  return (
    <section id="schedule" className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 hidden overflow-x-auto md:block">
          <ScheduleTable rows={rows} />
        </Reveal>

        {/* Mobile-friendly stacked schedule */}
        <div className="mt-12 space-y-4 md:hidden">
          {rows.map((row) => (
            <div key={row.id} className="rounded-2xl border border-line bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-semibold uppercase tracking-wide">{row.day}</p>
                <span className="font-mono text-xs text-accent-soft">{row.time}</span>
              </div>
              <p className="mt-3 text-sm text-ink">{row.session}</p>
              <p className="mt-1 text-xs text-muted">{row.trainer}</p>
              {!row.available ? (
                <p className="mt-3 inline-block rounded-full border border-line px-3 py-1 text-[0.58rem] uppercase tracking-[0.16em] text-muted">
                  {t({ en: "Fully booked", bn: "পূর্ণ" })}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MembershipBenefits() {
  const { content, t } = useSite();
  const section = content.pages.membership.sections.benefits;
  if (!section?.enabled) return null;

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(section.items ?? []).map((item, index) => (
            <BenefitCard
              key={item.id}
              title={t(item.title)}
              body={t(item.body)}
              index={index}
              icon={<Check className="h-5 w-5" />}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function MembershipFaq() {
  const { content, t } = useSite();
  const section = content.pages.membership.sections.faq;
  if (!section?.enabled) return null;
  const items = content.collections.faqs
    .filter((faq) => faq.published && t(faq.category) === t({ en: "Membership", bn: "মেম্বারশিপ" }))
    .sort((a, b) => a.order - b.order)
    .map((faq) => ({ id: faq.id, question: t(faq.question), answer: t(faq.answer) }));

  if (items.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
          <Link href="/faq" className="btn btn-outline mt-8">
            {t({ en: "View All FAQ", bn: "সব প্রশ্নোত্তর দেখুন" })}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}

export function MembershipCta() {
  return <FinalCtaSection pageKey="membership" />;
}

export type { MembershipPlan };
