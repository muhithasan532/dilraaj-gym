"use client";

import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";

import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/common/social-icons";
import { SmartImage } from "@/components/common/ui";
import { useSite } from "@/components/providers/site-provider";

export function SiteFooter() {
  const { content, t } = useSite();
  const { settings, footer, header } = content;
  const nav = (header.nav ?? []).filter((item) => item.enabled).sort((a, b) => a.order - b.order);

  const socials = [
    { href: settings.social.facebook, icon: FacebookIcon, label: "Facebook" },
    { href: settings.social.instagram, icon: InstagramIcon, label: "Instagram" },
    { href: settings.social.youtube, icon: YoutubeIcon, label: "YouTube" },
  ].filter((item) => item.href && item.href.length > 0);

  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <div className="accent-glow -left-40 top-0 h-96 w-96 opacity-40" />
      <div className="shell relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              <SmartImage
                bare
                src={footer.showSocial && settings.logoImage ? settings.logoImage : header.logoImage}
                alt={t(settings.gymName)}
                width={44}
                height={44}
                fallbackSrc="/images/brand/logo.svg"
                className="h-11 w-11 text-ink"
              />
              <div>
                <p className="font-display text-xl font-semibold uppercase tracking-[0.28em]">
                  {header.wordmark}
                </p>
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-accent-soft">{t(footer.tagline)}</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{t(footer.description)}</p>

            {footer.showSocial && socials.length > 0 ? (
              <div className="mt-6 flex items-center gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-ink">Navigation</h3>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="link-underline text-sm text-muted transition-colors hover:text-ink">
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-ink">{t(footer.infoHeading)}</h3>
            <ul className="mt-5 space-y-3">
              {footer.infoItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href || "#"}
                    className="link-underline text-sm text-muted transition-colors hover:text-ink"
                  >
                    {t(item.title)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin" className="link-underline text-sm text-muted transition-colors hover:text-ink">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-ink">Visit</h3>
            <ul className="mt-5 space-y-4 text-sm text-muted">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{t(settings.address)}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-ink">
                  {settings.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{content.whatsapp.number ? `WhatsApp ${content.whatsapp.number}` : "WhatsApp — configure in Admin"}</span>
              </li>
              <li className="pt-1 text-xs leading-relaxed">{t(settings.openingHours)}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>{t(footer.copyright)}</p>
          <p className="max-w-xl leading-relaxed">{t(settings.demoNotice)}</p>
        </div>
      </div>
    </footer>
  );
}
