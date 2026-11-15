import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { SiteProvider } from "@/components/providers/site-provider";
import { HomeHero } from "@/components/sections/home-hero";
import {
  FeaturedTrainerSection,
  FinalCtaSection,
  MembershipPreviewSection,
  PhilosophySection,
  ProgramsSection,
  SchedulePreviewSection,
  TestimonialsSection,
  TransformationPreviewSection,
  VisitSection,
  WhySection,
} from "@/components/sections/home-sections";
import { getSiteContent } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const seo = content.pages.home.seo;
  return {
    title: seo.title.en,
    description: seo.description.en,
    alternates: { canonical: seo.canonical },
    robots: seo.indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: seo.title.en,
      description: seo.description.en,
      images: [seo.image],
    },
  };
}

export default async function HomePage() {
  const content = await getSiteContent();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: content.settings.gymName.en,
    description: content.settings.description.en,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.settings.address.en,
      addressLocality: "Rangpur",
      addressCountry: "BD",
    },
    telephone: content.settings.phone,
    openingHours: content.settings.openingHours.en,
    image: content.media.heroDesktop,
    priceRange: "৳৳",
  };

  return (
    <SiteProvider content={content}>
      <SiteShell intent="home">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <HomeHero />
        <PhilosophySection />
        <ProgramsSection />
        <WhySection />
        <FeaturedTrainerSection />
        <TransformationPreviewSection />
        <MembershipPreviewSection />
        <SchedulePreviewSection />
        <TestimonialsSection />
        <VisitSection />
        <FinalCtaSection pageKey="home" />
      </SiteShell>
    </SiteProvider>
  );
}
