import { NextResponse } from "next/server";
import DOMPurify from "isomorphic-dompurify";
import { z } from "zod";
import { googleForm } from "@/config/contact";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/**
 * Hardened form submission endpoint.
 *
 * Every enquiry (booking / careers / academy) now flows through here instead
 * of the browser posting straight to Google Forms:
 *   1. Zod validates shape and sizes
 *   2. DOMPurify strips markup from every value (XSS / injection)
 *   3. Per-IP rate limiting (default 5 requests / minute)
 *   4. Cloudflare Turnstile verification when TURNSTILE_SECRET_KEY is set
 *   5. Server-side forward to the configured Google Form endpoint
 */

export const runtime = "nodejs";

const MAX_FIELDS = 30;
const MAX_FIELD_LENGTH = 4000;

const enquirySchema = z.object({
  kind: z.enum(["booking", "career", "academy"]),
  /** Cloudflare Turnstile token (optional until TURNSTILE_* keys are set). */
  token: z.string().max(4096).optional(),
  data: z.record(z.string(), z.string().max(MAX_FIELD_LENGTH)),
});

type Kind = z.infer<typeof enquirySchema>["kind"];

function entryConfig(kind: Kind) {
  switch (kind) {
    case "booking":
      return { url: googleForm.bookingsUrl, fields: googleForm.bookingsEntryFields };
    case "career":
      return { url: googleForm.careersUrl, fields: googleForm.careersEntryFields };
    case "academy":
      return { url: googleForm.academyUrl, fields: googleForm.academyEntryFields };
  }
}

/** Strips all HTML/tags and control characters from a single value. */
function sanitizeValue(value: string): string {
  // Keep tab/newline/CR, drop every other C0 control character.
  const withoutControls = Array.from(value, (ch) => {
    const code = ch.charCodeAt(0);
    return code === 9 || code === 10 || code === 13 || code >= 32 ? ch : "";
  }).join("");
  return DOMPurify.sanitize(withoutControls, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Not configured yet: keep forms usable, rate limiting + Zod still active.
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new FormData();
    body.append("secret", secret);
    body.append("response", token);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);

  const limited = rateLimit(`enquiry:${ip}`, 5, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `Too many submissions. Try again in ${limited.retryAfterSec}s.` },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let parsed: z.infer<typeof enquirySchema>;
  try {
    parsed = enquirySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const entries = Object.entries(parsed.data);
  if (entries.length === 0 || entries.length > MAX_FIELDS) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  if (!(await verifyTurnstile(parsed.token))) {
    return NextResponse.json(
      { error: "Spam check failed. Please try again." },
      { status: 403 },
    );
  }

  const { url, fields } = entryConfig(parsed.kind);
  // NB: googleForm entries are `""` until configured — treat any non-http
  // value as "not configured" (regex avoids literal-empty narrowing).
  const configured = /^https?:\/\//.test(url);

  // Not configured: same contract the client already handles (WhatsApp fallback).
  if (!configured) {
    return NextResponse.json({ ok: false, configured: false });
  }

  const body = new URLSearchParams();
  for (const [key, value] of entries) {
    const entry = fields[key as keyof typeof fields];
    const clean = sanitizeValue(value);
    if (entry && clean) body.append(entry, clean);
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, configured: true, error: "The studio could not receive this right now." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, configured: true });
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "Network failure while sending." },
      { status: 502 },
    );
  }
}
