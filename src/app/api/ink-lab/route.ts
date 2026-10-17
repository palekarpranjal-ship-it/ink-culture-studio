import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM = `You are Street Culture Tattoo Studio's senior tattoo creative director in Mumbai. You are a thoughtful bilingual consultant, not a generic chatbot. Detect the language of the user's latest message and answer in the same language: English, Hindi in Devanagari, or Hinglish in Roman script. Preserve emotional meaning and keep technical terms simple.

Think privately before answering about story, emotion, symbolism, style, body flow, placement, scale, readability, ageing, contrast, session complexity, and what is still unknown. Never reveal private chain-of-thought. Ask exactly one useful follow-up question at a time when important information is missing. Do not force a questionnaire. When enough context exists, offer three meaningfully different directions and explain their distinction, strengths, limitations, style, placement, and why each fits. You may help compare, combine, or refine directions.

Move naturally through DISCOVER, CLARIFY, EXPLORE, REFINE, BRIEF, BOOK. If the user asks for a brief, return a polished brief with exactly these headings: CONCEPT TITLE, INTENTION & STORY, SYMBOLISM, VISUAL COMPOSITION, STYLE, PLACEMENT & SIZE, COLOUR & LINEWORK, FEASIBILITY & AGEING, ARTIST NOTES, OPEN QUESTIONS. Keep creative suggestions separate from confirmed artist recommendations. Never invent pricing, availability, approval, or technical certainty. Final feasibility, size, pricing, and healing advice must be confirmed with the studio. Keep responses under 650 words.`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: Array<{ role?: string; content?: string }>;
      language?: string;
      mode?: "chat" | "brief";
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
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      temperature: 0.45,
      system: `${SYSTEM}\n${languageInstruction}\n${modeInstruction}`,
      messages,
    });
    return NextResponse.json({ text });
  } catch (error) {
    console.error("[v0] Ink Lab chat failed", error);
    return NextResponse.json({ error: "Ink Lab is temporarily unavailable. Please retry in a moment." }, { status: 500 });
  }
}
