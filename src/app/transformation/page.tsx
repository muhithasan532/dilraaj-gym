import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { SiteProvider } from "@/components/providers/site-provider";
import {
  BeforeAfterGallery,
  FeaturedStories,
  MemberExperiences,
  ProgressHighlights,
  TransformationCategories,
  TransformationCta,
  TransformationHero,
} from "@/components/sections/transformation-sections";
import { getSiteContent } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const seo = content.pages.transformation.seo;
  return {
    title: seo.title.en,
    description: seo.description.en,
    alternates: { canonical: seo.canonical },
    robots: seo.indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title: seo.title.en, description: seo.description.en, images: [seo.image] },
  };
}

export default async function TransformationPage() {
  const content = await getSiteContent();

  return (
    <SiteProvider content={content}>
      <SiteShell intent="transformation">
        <TransformationHero />
        <FeaturedStories />
        <BeforeAfterGallery />
        <TransformationCategories />
        <ProgressHighlights />
        <MemberExperiences />
        <TransformationCta />
      </SiteShell>
    </SiteProvider>
  );
}
