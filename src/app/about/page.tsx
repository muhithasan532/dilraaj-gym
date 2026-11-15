import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { SiteProvider } from "@/components/providers/site-provider";
import {
  AboutCta,
  AboutHero,
  CoachingTeam,
  FacilitiesGallery,
  MissionVision,
  OurStory,
  PhilosophyValues,
  WhyChooseUs,
} from "@/components/sections/about-sections";
import { getSiteContent } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const seo = content.pages.about.seo;
  return {
    title: seo.title.en,
    description: seo.description.en,
    alternates: { canonical: seo.canonical },
    robots: seo.indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title: seo.title.en, description: seo.description.en, images: [seo.image] },
  };
}

export default async function AboutPage() {
  const content = await getSiteContent();
  const page = content.pages.about;

  if (!page.published) {
    return (
      <SiteProvider content={content}>
        <SiteShell>
          <div className="shell py-40 text-center">
            <h1 className="display-lg">This page is currently unpublished.</h1>
          </div>
        </SiteShell>
      </SiteProvider>
    );
  }

  return (
    <SiteProvider content={content}>
      <SiteShell intent="home">
        <AboutHero />
        <OurStory />
        <MissionVision />
        <PhilosophyValues />
        <FacilitiesGallery />
        <CoachingTeam />
        <WhyChooseUs />
        <AboutCta />
      </SiteShell>
    </SiteProvider>
  );
}
