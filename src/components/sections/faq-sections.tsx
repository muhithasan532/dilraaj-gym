"use client";

import { useMemo, useState } from "react";

import { Accordion, type AccordionEntry } from "@/components/common/accordion";
import { Reveal } from "@/components/common/reveal";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";
import { FinalCtaSection } from "@/components/sections/home-sections";
import { cn } from "@/lib/utils";

export function FaqHero() {
  const { content, t } = useSite();
  const section = content.pages.faq.sections.hero;
  return <PageHero section={section} size="compact" />;
}

export function FaqList() {
  const { content, t } = useSite();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const faqs = content.collections.faqs.filter((faq) => faq.published).sort((a, b) => a.order - b.order);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    faqs.forEach((faq) => {
      const label = t(faq.category);
      if (label && !seen.has(label)) seen.set(label, label);
    });
    return Array.from(seen.values());
  }, [faqs, t]);

  const filtered = activeCategory === "all" ? faqs : faqs.filter((faq) => t(faq.category) === activeCategory);
  const items: AccordionEntry[] = filtered.map((faq) => ({
    id: faq.id,
    question: t(faq.question),
    answer: t(faq.answer),
    category: t(faq.category),
  }));

  return (
    <section className="py-16 md:py-24">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-full border px-5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                activeCategory === "all" ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink",
              )}
            >
              {t({ en: "All questions", bn: "সব প্রশ্ন" })}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "rounded-full border px-5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors",
                  activeCategory === category ? "border-accent bg-accent text-white" : "border-line text-muted hover:text-ink",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Accordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}

export function FaqCta() {
  const { content, t } = useSite();
  const section = content.pages.faq.sections.cta;
  return (
    <>
      {section?.enabled ? (
        <section className="bg-surface py-20 md:py-24">
          <div className="shell">
            <Reveal>
              <SectionHeading title={t(section.title)} subtitle={t(section.body)} align="center" className="items-center text-center" />
            </Reveal>
          </div>
        </section>
      ) : null}
      <FinalCtaSection pageKey="faq" />
    </>
  );
}
