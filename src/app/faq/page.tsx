import type { Metadata } from "next";

import { SiteShell } from "@/components/layout/site-shell";
import { SiteProvider } from "@/components/providers/site-provider";
import { FaqCta, FaqHero, FaqList } from "@/components/sections/faq-sections";
import { getSiteContent } from "@/lib/content/repository";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const seo = content.pages.faq.seo;
  return {
    title: seo.title.en,
    description: seo.description.en,
    alternates: { canonical: seo.canonical },
    robots: seo.indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: { title: seo.title.en, description: seo.description.en, images: [seo.image] },
  };
}

export default async function FaqPage() {
  const content = await getSiteContent();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.collections.faqs
      .filter((faq) => faq.published)
      .map((faq) => ({
        "@type": "Question",
        name: faq.question.en,
        acceptedAnswer: { "@type": "Answer", text: faq.answer.en },
      })),
  };

  return (
    <SiteProvider content={content}>
      <SiteShell intent="faq">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <FaqHero />
        <FaqList />
        <FaqCta />
      </SiteShell>
    </SiteProvider>
  );
}
