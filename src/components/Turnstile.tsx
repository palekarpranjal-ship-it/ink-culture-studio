"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile spam check.
 *
 * Renders nothing (and verifies nothing) until NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * is configured; the API route independently skips verification until
 * TURNSTILE_SECRET_KEY is set, so forms keep working before setup and become
 * protected as soon as both keys are added.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
    __scTurnstileReady?: Promise<void>;
  }
}

export function Turnstile({
  onVerify,
}: {
  onVerify: (token: string | null) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onVerify);

  useEffect(() => {
    callbackRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    const load = () => {
      if (window.turnstile) return Promise.resolve();
      if (!window.__scTurnstileReady) {
        window.__scTurnstileReady = new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src =
            "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Turnstile"));
          document.head.appendChild(script);
        });
      }
      return window.__scTurnstileReady;
    };

    load()
      .then(() => {
        if (cancelled || !hostRef.current || !window.turnstile) return;
        window.turnstile.render(hostRef.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          size: "normal",
          callback: (token: string) => callbackRef.current(token),
          "expired-callback": () => callbackRef.current(null),
          "error-callback": () => callbackRef.current(null),
        });
      })
      .catch(() => {
        // Widget unavailable: server still enforces validation + rate limits.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!SITE_KEY) return null;

  return (
    <div className="flex justify-center py-1">
      <div ref={hostRef} />
    </div>
  );
}
