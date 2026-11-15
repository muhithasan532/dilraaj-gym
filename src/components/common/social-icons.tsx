import type { SVGProps } from "react";

/** Minimal brand glyphs (lucide-react no longer ships brand icons). */

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 21v-7.2h2.5l.4-2.9h-2.9V9.1c0-.8.3-1.4 1.5-1.4h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.9h2.6V21h2.9Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.8" cy="7.2" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.2 7.6a2.5 2.5 0 0 0-1.7-1.8C17.9 5.4 12 5.4 12 5.4s-5.9 0-7.5.4A2.5 2.5 0 0 0 2.8 7.6C2.4 9.2 2.4 12 2.4 12s0 2.8.4 4.4a2.5 2.5 0 0 0 1.7 1.8c1.6.4 7.5.4 7.5.4s5.9 0 7.5-.4a2.5 2.5 0 0 0 1.7-1.8c.4-1.6.4-4.4.4-4.4s0-2.8-.4-4.4ZM10.1 15.2V8.8L15.5 12l-5.4 3.2Z" />
    </svg>
  );
}
