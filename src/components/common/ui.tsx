"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

import { Reveal } from "@/components/common/reveal";
import { useSite } from "@/components/providers/site-provider";
import { cn } from "@/lib/utils";
import type { SectionContent } from "@/types/content";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

export function Section({
  children,
  className,
  id,
  tone = "bg",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "bg" | "surface" | "none";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 md:py-28",
        tone === "surface" && "bg-surface",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? <h2 className="display-lg max-w-3xl text-balance">{title}</h2> : null}
      {subtitle ? <p className="lede max-w-2xl">{subtitle}</p> : null}
    </div>
  );
}

export function CtaButton({
  label,
  href,
  variant = "primary",
  className,
  external,
}: {
  label: string;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
  external?: boolean;
}) {
  if (!href) return null;
  const classes = cn("btn", variant === "primary" && "btn-primary", variant === "outline" && "btn-outline", className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {label}
    </Link>
  );
}

/** Shown whenever content points at an image that is empty, deleted or missing on disk. */
export const IMAGE_FALLBACK = "/images/placeholder.svg";

/**
 * Content image with a graceful fallback.
 *
 * Every image path on this site is editable in the admin panel, so a deleted
 * upload or a path that never existed used to leave a broken-image icon in the
 * layout. Both the empty-src case and a failed request now resolve to the
 * bundled placeholder instead.
 *
 * Pass `bare` for full-bleed artwork where the surrounding layout already
 * positions the image (hero, header, thumbnails) — the wrapper `div` would
 * break those compositions.
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  priority,
  ratio,
  bare = false,
  width,
  height,
  fallbackSrc = IMAGE_FALLBACK,
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  ratio?: string;
  bare?: boolean;
  width?: number;
  height?: number;
  fallbackSrc?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const requested = typeof src === "string" ? src.trim() : "";
  const resolved = requested === "" || requested === failedSrc ? fallbackSrc : requested;

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => {
        if (requested !== "" && requested !== failedSrc) setFailedSrc(requested);
      }}
      className={cn("h-full w-full object-cover", imgClassName, bare && className)}
    />
  );

  if (bare) return image;

  return (
    <div className={cn("image-frame", className)} style={ratio ? { aspectRatio: ratio } : undefined}>
      {image}
    </div>
  );
}

export function DisabledNotice({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="rounded-full border border-line bg-surface/70 px-4 py-2 text-xs text-muted">
      {message}
    </div>
  );
}

/** Renders the editable copy of a section heading block. */
export function SectionIntro({
  section,
  align = "left",
  className,
}: {
  section?: SectionContent;
  align?: "left" | "center";
  className?: string;
}) {
  const { t } = useSite();
  return (
    <Reveal className={className}>
      <SectionHeading eyebrow={t(section?.eyebrow)} title={t(section?.title)} subtitle={t(section?.subtitle)} align={align} />
    </Reveal>
  );
}
