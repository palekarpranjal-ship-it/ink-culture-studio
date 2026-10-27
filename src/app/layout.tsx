import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/index.css";
import { Analytics } from "@/components/Analytics";
import { CookieConsent } from "@/components/CookieConsent";
import { OfflineWatcher } from "@/components/OfflineWatcher";
import { JsonLd } from "@/next/JsonLd";
import { homeJsonLd } from "@/next/route-metadata";
import { AppProviders } from "@/next/AppProviders";

const siteUrl = "https://www.streetculturetattoos.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Street Culture Tattoo & Academy | Tattoo Studio in Mumbai",
  description:
    "Street Culture is a custom tattoo & piercing studio and academy in Kandivali West, Mumbai — 4.8★ on Google. Artists Karan and Lucky specialise in colour, black & grey, fine line and realism. WhatsApp +91 98197 00071 to book.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#0d0d0d",
    "geo.region": "IN-MH",
    "geo.placename": "Kandivali West, Mumbai",
    "geo.position": "19.2046;72.8497",
    ICBM: "19.2046, 72.8497",
    author: "Street Culture Tattoo & Academy",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Fonts: bold condensed display, clean sans, marker accents, mono details */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;500;600;700;800;900&family=Caveat:wght@600;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={homeJsonLd()} />
        <Analytics />
        <CookieConsent />
        <OfflineWatcher />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
