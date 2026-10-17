import { generateText, Output, type ModelMessage } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM = `You are Street Culture Tattoo Studio's senior tattoo creative director in Mumbai. You are a thoughtful bilingual consultant, not a generic chatbot. Detect the language of the user's latest message and answer in the same language: English, Hindi in Devanagari, or Hinglish in Roman script. Preserve emotional meaning and keep technical terms simple.

Before answering, silently assess the client's expressed story, emotion, symbolism, likes, dislikes, style, body flow, placement, scale, readability, ageing, contrast, session complexity, constraints, contradictions, and missing essentials. Never reveal private chain-of-thought. Preserve only what the client actually said; do not invent personal details or emotional meaning. Ask at most one or two high-value clarification questions only when they materially improve the concept, and never ask for information already supplied. When enough context exists, offer three meaningfully different directions and explain their distinction, strengths, limitations, style, placement, and why each fits. Treat “no preference” as permission to recommend a style, not as a confirmed preference. You may help compare, combine, or refine directions.

Move naturally through DISCOVER, CLARIFY, EXPLORE, REFINE, BRIEF, BOOK. If the user asks for a brief, return a polished brief with exactly these headings: CONCEPT TITLE, INTENTION & STORY, SYMBOLISM, VISUAL COMPOSITION, STYLE, PLACEMENT & SIZE, COLOUR & LINEWORK, FEASIBILITY & AGEING, ARTIST NOTES, OPEN QUESTIONS. Keep creative suggestions separate from confirmed artist recommendations. Never invent pricing, availability, approval, or technical certainty. Final feasibility, size, pricing, and healing advice must be confirmed with the studio. Keep normal replies under 350 words and artist-ready briefs under 650 words. Use concrete, client-specific language rather than generic tattoo advice. End a non-brief reply with one clear next step or question when useful.`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: Array<{ role?: string; content?: string }>;
      language?: string;
      mode?: "chat" | "brief";
      imageDataUrl?: string;
    };
    const messages = (body.messages ?? [])
      .filter((message) => message.role === "user" || message.role === "assistant")
      .map((message) => ({ role: message.role as "user" | "assistant", content: String(message.content ?? "").slice(0, 4000) }))
      .filter((message) => message.content.trim())
      .slice(-16);
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return NextResponse.json({ error: "Tell Ink Lab what you want to explore first." }, { status: 400 });
    }
    const languageInstruction = body.language && body.language !== "auto" ? `Preferred response language: ${body.language}.` : "Detect the latest user language automatically.";
    const modeInstruction = body.mode === "brief" ? "The user wants an artist-ready brief now. Synthesize the conversation into the required brief headings." : "Continue the conversation naturally.";
    const imageDataUrl = typeof body.imageDataUrl === "string" && body.imageDataUrl.startsWith("data:image/") && body.imageDataUrl.length < 6_000_000 ? body.imageDataUrl : undefined;
    const modelMessages: ModelMessage[] = imageDataUrl
      ? messages.map((message, index) => {
        if (index === messages.length - 1 && message.role === "user") {
          return { role: "user" as const, content: [{ type: "text" as const, text: message.content }, { type: "image" as const, image: imageDataUrl }] };
        }
        return message.role === "user"
          ? { role: "user" as const, content: message.content }
          : { role: "assistant" as const, content: message.content };
      })
      : messages.map((message) => message.role === "user"
        ? { role: "user" as const, content: message.content }
        : { role: "assistant" as const, content: message.content });
    const { output } = await generateText({
      model: "openai/gpt-4o-mini",
      temperature: 0.35,
      system: `${SYSTEM}\n${languageInstruction}\n${modeInstruction}${imageDataUrl ? "\nA reference image is attached to the latest client message. Analyze it only for visible design qualities; do not infer identity, health, or personal history." : ""}`,
      messages: modelMessages,
      output: Output.object({ schema: z.object({
        kind: z.enum(["question", "directions", "brief"]),
        response: z.string().min(1).max(5000),
        followUpQuestions: z.array(z.string()).max(2),
        stage: z.enum(["DISCOVER", "CLARIFY", "EXPLORE", "REFINE", "BRIEF", "BOOK"]),
      }) }),
    });
    return NextResponse.json({ text: output.response, kind: output.kind, followUpQuestions: output.followUpQuestions, stage: output.stage });
  } catch (error) {
    console.error("[v0] Ink Lab chat failed", error);
    return NextResponse.json({ error: "Ink Lab is temporarily unavailable. Please retry in a moment." }, { status: 500 });
  }
}
