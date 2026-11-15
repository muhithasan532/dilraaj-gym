import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hind_Siliguri, Inter, Oswald, DM_Serif_Display } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const serifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-serif-display",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DilRaaj Gym & Fitness Centre | Strength Training in Rangpur",
    template: "%s | DilRaaj Gym & Fitness Centre",
  },
  description:
    "DilRaaj Gym & Fitness Centre — a premium strength and fitness training space in Rangpur, Bangladesh offering professional coaching, modern equipment and personalised guidance.",
  keywords: [
    "DilRaaj Gym",
    "DilRaaj Gym & Fitness Centre",
    "gym in Rangpur",
    "fitness centre Rangpur",
    "strength training Bangladesh",
    "personal trainer Rangpur",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "DilRaaj Gym & Fitness Centre",
    title: "DilRaaj Gym & Fitness Centre | Rangpur",
    description:
      "Strength, discipline and transformation — professional coaching in Rangpur, Bangladesh.",
    images: ["/images/hero/dilraaj-hero-desktop.webp"],
  },
  twitter: { card: "summary_large_image" },
};

/**
 * Runs before first paint so the saved theme is applied without a flash.
 * Light is the default until the visitor explicitly picks dark.
 */
const themeScript = `
(function(){
  try {
    var stored = localStorage.getItem('dilraaj-theme');
    var theme = (stored === 'dark' || stored === 'light') ? stored : 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    var lang = localStorage.getItem('dilraaj-locale');
    if (lang === 'bn' || lang === 'en') { document.documentElement.lang = lang; }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${serifDisplay.variable} ${hindSiliguri.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
