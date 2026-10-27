"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";

/**
 * Cookie consent banner. No analytics or non-essential cookies are set
 * before the visitor explicitly accepts (see Analytics.tsx).
 */

const CONSENT_KEY = "sc_cookie_consent";

export type ConsentValue = "accepted" | "declined";

export function readConsent(): ConsentValue | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage blocked — treat as declined next visit */
  }
  window.dispatchEvent(new Event("sc-consent-change"));
}

/** Shared subscription so every consent listener stays in sync. */
export function consentSubscribe(onChange: () => void): () => void {
  window.addEventListener("sc-consent-change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("sc-consent-change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

const serverSnapshot = () => null;

export function CookieConsent() {
  const consent = useSyncExternalStore(consentSubscribe, readConsent, serverSnapshot);

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-20 z-50 max-w-md border-2 border-bone/25 bg-ink/97 p-4 backdrop-blur-md sm:inset-x-auto sm:bottom-6 sm:right-6 sm:p-5"
    >
      <p className="font-display text-sm uppercase tracking-wider text-bone">
        Cookies, briefly
      </p>
      <p className="mt-2 font-body text-xs leading-relaxed text-bone/65">
        We use Google Analytics to understand which pages help visitors find their
        tattoo. No ad tracking. See our{" "}
        <Link href="/privacy" className="underline transition-colors hover:text-blood">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => writeConsent("accepted")}
          className="flex-1 border-2 border-bone bg-bone px-4 py-2 font-display text-[11px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-transparent hover:text-bone"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => writeConsent("declined")}
          className="flex-1 border-2 border-bone/30 px-4 py-2 font-display text-[11px] uppercase tracking-[0.18em] text-bone/70 transition-colors hover:border-bone"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
