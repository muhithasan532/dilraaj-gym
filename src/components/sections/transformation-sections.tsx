"use client";

import { CompareSlider } from "@/components/cards/compare-slider";
import { Reveal, Stagger, StaggerItem } from "@/components/common/reveal";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/ui";
import { TestimonialCard, TransformationCard } from "@/components/cards/cards";
import { useSite } from "@/components/providers/site-provider";
import { FinalCtaSection } from "@/components/sections/home-sections";

export function TransformationHero() {
  const { content, t } = useSite();
  const section = content.pages.transformation.sections.hero;
  return <PageHero section={section} image={section?.image} />;
}

export function FeaturedStories() {
  const { content, t } = useSite();
  const section = content.pages.transformation.sections.featured;
  if (!section?.enabled) return null;
  const stories = content.collections.transformations.filter((item) => item.published).sort((a, b) => a.order - b.order);

  return (
    <section className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <TransformationCard key={story.id} transformation={story} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BeforeAfterGallery() {
  const { content, t } = useSite();
  const section = content.pages.transformation.sections.gallery;
  if (!section?.enabled) return null;
  const stories = content.collections.transformations.filter((item) => item.published).sort((a, b) => a.order - b.order);

  return (
    <section className="bg-surface py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {stories.map((story, index) => (
            <Reveal key={story.id} delay={index * 0.06}>
              <figure>
                <div className="overflow-hidden rounded-2xl border border-line">
                  <div className="relative aspect-[4/3]">
                    <CompareSlider
                      beforeSrc={story.beforeImage}
                      afterSrc={story.afterImage}
                      beforeLabel={t({ en: "Before", bn: "আগে" })}
                      afterLabel={t({ en: "After", bn: "পরে" })}
                      className="h-full w-full"
                    />
                  </div>
                </div>
                <figcaption className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{t(story.name)}</span>
                  <span className="text-muted">{t(story.duration)}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TransformationCategories() {
  const { content, t } = useSite();
  const section = content.pages.transformation.sections.categories;
  if (!section?.enabled) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="shell">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} />
        </Reveal>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(section.items ?? []).map((item) => (
            <StaggerItem key={item.id}>
              <div className="h-full rounded-2xl border border-line bg-card p-6 transition-colors hover:border-accent/50">
                <h3 className="display-md">{t(item.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{t(item.body)}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function ProgressHighlights() {
  const { content, t } = useSite();
  const section = content.pages.transformation.sections.highlights;
  if (!section?.enabled) return null;

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-28">
      <div className="accent-glow left-1/4 top-0 h-80 w-80 opacity-40" />
      <div className="shell relative">
        <Reveal>
          <SectionHeading eyebrow={t(section.eyebrow)} title={t(section.title)} subtitle={t(section.subtitle)} />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(section.items ?? []).map((item, index) => (
            <Reveal key={item.id} delay={index * 0.07}>
              <div className="border-t border-accent/50 pt-6">
                <p className="font-display text-5xl font-semibold text-ink">{item.value}</p>
                <h3 className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-accent-soft">{t(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(item.body)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MemberExperiences() {
  const { content, t } = useSite();
  const section = content.pages.transformation.sections.experiences;
  if (!section?.enabled) return null;
  const items = content.collections.testimonials.filter((item) => item.published).sort((a, b) => a.order - b.order);

  return (
    <section className="py-20 md:py-28">
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

export function TransformationCta() {
  return <FinalCtaSection pageKey="transformation" />;
}
