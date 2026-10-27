/**
 * Google Forms integration layer (hardened).
 *
 * Submissions POST to our own /api/enquiry endpoint, which validates with
 * Zod, sanitizes with DOMPurify, rate-limits per IP, verifies the Turnstile
 * spam token, and only then forwards to the configured Google Form
 * formResponse endpoint.
 *
 * If an endpoint is not configured, the API resolves to { ok: false,
 * configured: false } and the UI falls back to WhatsApp / mailto — the same
 * contract this module always exposed.
 */

import { contact } from "@/config/contact";

export type SubmitResult = {
  ok: boolean;
  /** false when no Google Form endpoint has been configured yet */
  configured: boolean;
  error?: string;
};

export type EnquiryKind = "booking" | "career" | "academy";

async function submitEnquiry(
  kind: EnquiryKind,
  data: Record<string, string>,
  token?: string,
): Promise<SubmitResult> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return {
      ok: false,
      configured: true,
      error: "You appear to be offline. Reconnect and try again, or use WhatsApp.",
    };
  }

  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, data, token: token || undefined }),
    });

    const json = (await res.json().catch(() => ({}))) as SubmitResult;

    if (res.status === 429) {
      return {
        ok: false,
        configured: true,
        error:
          json.error ??
          "Too many attempts — wait a minute and try again, or use WhatsApp.",
      };
    }
    if (!res.ok) {
      return {
        ok: false,
        configured: true,
        error:
          json.error ?? "We couldn't send that just now. Please try WhatsApp instead.",
      };
    }
    return { ok: json.ok === true, configured: json.configured !== false };
  } catch {
    return {
      ok: false,
      configured: true,
      error: "Network error — check your connection or use WhatsApp instead.",
    };
  }
}

export function submitBooking(
  data: Record<string, string>,
  token?: string,
): Promise<SubmitResult> {
  return submitEnquiry("booking", data, token);
}

export function submitCareersApplication(
  data: Record<string, string>,
  token?: string,
): Promise<SubmitResult> {
  return submitEnquiry("career", data, token);
}

export function submitAcademyEnquiry(
  data: Record<string, string>,
  token?: string,
): Promise<SubmitResult> {
  return submitEnquiry("academy", data, token);
}

/** Kept for UI code that checks configuration; the server now owns the URLs. */
export function isFormConfigured(url: string): boolean {
  return Boolean(url && url.startsWith("http"));
}

/** mailto fallback so every form has a working submit path pre-configuration. */
export function mailtoLink(subject: string, body: string): string {
  return `mailto:${contact.email}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
