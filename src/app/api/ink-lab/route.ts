import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { gateway } from "@ai-sdk/gateway";
import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "edge";

/**
 * Ink Lab — AI tattoo design & brief consultant.
 *
 * Runs a three-stage synthesis (intent decoding → composition/placement
 * intelligence → element enhancement) and returns a STRUCTURED brief the UI
 * renders as sections. If the model answers with prose instead of JSON (or
 * refuses), we degrade gracefully to the legacy plain-text `brief` field.
 */

const requestSchema = z.object({
  idea: z.string().min(10).max(1200),
  placement: z.string().max(120).optional(),
  style: z.string().max(80).optional(),
  size: z.string().max(60).optional(),
  language: z.enum(["English", "हिन्दी", "Hinglish"]).optional(),
  hasReferenceImage: z.boolean().optional(),
});

const briefSchema = z.object({
  refinedConcept: z.string().min(20).max(900),
  visualBreakdown: z.object({
    primary: z.string().min(3).max(400),
    secondary: z.string().min(3).max(400),
    background: z.string().min(3).max(400),
  }),
  placementGuidance: z.string().min(10).max(700),
  styles: z.array(z.string().min(2).max(60)).length(2),
});

export type InkLabBrief = z.infer<typeof briefSchema>;

const STYLE_CATALOG =
  "Black & Grey Realism, Colour Realism, Fine Line, Neo-Traditional, Minimalist, Script, Custom/Undecided";

function systemPrompt(language: string, languageInstruction: string) {
  return `You are the senior tattoo design consultant for Street Culture Tattoo Studio & Academy in Mumbai — the creative design consultant behind the "Ink Lab". You help clients refine rough ideas into professional tattoo briefs our artists (Karan: fine line, lettering, black & grey; Lucky: colour, realism,16+ years) can design from.

Run this exact synthesis process before writing:
1. INTENT & MEANING DECODING — find the emotional core and symbolic elements hidden in the client's text (grief, growth, faith, memory, identity…). Name it plainly.
2. COMPOSITION & PLACEMENT INTELLIGENCE — evaluate how the requested elements fit the chosen body part: muscle flow, curvature, orientation, scaling, and long-term ink aging/legibility (fine details on mobile areas like inner wrist/ribs/fingers age differently than forearms/back).
3. ELEMENT ENHANCEMENT — refine overcrowded ideas: focalize on the strongest element and frame it with supporting accents; if the idea is too sparse, suggest one tasteful addition.

Client's brief inputs: idea text, placement, style preference (${STYLE_CATALOG}), estimated size, reference image (yes/no).

Output rules:
- refinedConcept: a polished 2–3 sentence overview of the design direction (the story, focal point and mood). No headings inside it.
- visualBreakdown: THREE short entries — "primary" (the hero element), "secondary" (supporting accents/ornament), "background" (background, shading, contrast or negative-space elements). Each 1–2 sentences.
- placementGuidance: artist recommendations on sizing, orientation and how the design moves with the body. Concrete numbers where useful.
- styles: EXACTLY 2 entries — the top two matching styles from this list: ${STYLE_CATALOG}. Rank best-fit first.
- Never promise medical outcomes or exact healing results; encourage artist consultation for anatomy and skin questions.
- Warm, specific, studio voice. Under 400 words total.
${languageInstruction}
Language of ALL output: ${language}.
Respond with ONLY a minified JSON object matching this shape — no markdown, no code fences, no commentary:
{"refinedConcept":"…","visualBreakdown":{"primary":"…","secondary":"…","background":"…"},"placementGuidance":"…","styles":["…","…"]}`;
}

function languageInstructionFor(language: string) {
  if (language === "हिन्दी")
    return "Respond entirely in natural Hindi using Devanagari script, keeping tattoo style names and artist terms in English.";
  if (language === "Hinglish")
    return "Respond naturally in Hinglish: conversational Hindi in Latin script with clear English tattoo and artist terms.";
  return "Respond in natural English.";
}

function extractJson(raw: string): unknown | null {
  const unfenced = raw.replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/, "");
  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(unfenced.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  // Ink Lab calls cost model credits — cap them per IP (10/min).
  const limited = rateLimit(`ink-lab:${clientIp(request)}`, 10, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${limited.retryAfterSec}s.` },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } },
    );
  }

  let parsed: z.infer<typeof requestSchema>;
  try {
    parsed = requestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const language = parsed.language ?? "English";
  const languageInstruction = languageInstructionFor(language);

  // Two supported credentials, either one makes the Ink Lab live:
  //   OPENAI_API_KEY    → direct OpenAI call (one key, no gateway account)
  //   AI_GATEWAY_API_KEY → Vercel AI Gateway (`npx vercel@latest ai-gateway setup`)
  const openAiKey = process.env.OPENAI_API_KEY;
  const gatewayKey = process.env.AI_GATEWAY_API_KEY;

  // Explicit, diagnosable failure when this deployment has no AI key yet —
  // deliberately distinct from a model/API error so the two can't be
  // confused when reading logs or the UI.
  if (!openAiKey && !gatewayKey) {
    return NextResponse.json(
      {
        error:
          "The Ink Lab's AI key isn't configured on this deployment yet — WhatsApp us your idea and we'll refine it by hand.",
      },
      { status: 503 },
    );
  }

  try {
    const { text } = await generateText({
      // Gateway key: model string resolves through the AI Gateway. OpenAI key:
      // instantiate the OpenAI provider directly and bypass the gateway.
      model: openAiKey
        ? createOpenAI({ apiKey: openAiKey }).languageModel("gpt-4o-mini")
        : gateway("openai/gpt-4o-mini"),
      temperature: 0.5,
      system: systemPrompt(language, languageInstruction),
      prompt: `Refine this tattoo idea into a structured brief.
Idea: ${parsed.idea}
Placement: ${parsed.placement || "Not specified"}
Preferred style: ${parsed.style || "No preference"}
Size estimate: ${parsed.size || "Not specified"}
Reference image supplied: ${parsed.hasReferenceImage ? "Yes" : "No"}`,
    });

    const parsedBrief = briefSchema.safeParse(extractJson(text));
    if (parsedBrief.success) {
      return NextResponse.json({ plan: parsedBrief.data });
    }

    // Graceful degradation: model answered in prose — pass it through as the
    // legacy plain-text brief so the UI still renders something useful.
    return NextResponse.json({ brief: text.trim() });
  } catch {
    return NextResponse.json({ error: "The Ink Lab could not draft this brief." }, { status: 500 });
  }
}
