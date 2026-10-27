"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { consentSubscribe, readConsent } from "@/components/CookieConsent";

/**
 * Google Analytics, loaded only after the visitor accepts cookies in the
 * consent banner. Renders nothing while consent is absent or declined.
 *
 * Consent is read through useSyncExternalStore so the banner, this component
 * and any other listener always share one source of truth (localStorage +
 * the "sc-consent-change" event).
 */

const GA_ID = "G-9CZH92BPMK";

const serverSnapshot = () => null;

export function Analytics() {
  const consent = useSyncExternalStore(consentSubscribe, readConsent, serverSnapshot);

  if (consent !== "accepted") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
