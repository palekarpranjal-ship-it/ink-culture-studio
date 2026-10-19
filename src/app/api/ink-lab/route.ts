import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      idea?: string;
      placement?: string;
      style?: string;
      language?: "English" | "हिन्दी" | "Hinglish";
      hasReferenceImage?: boolean;
    };
    const idea = body.idea?.trim();
    if (!idea || idea.length < 10 || idea.length > 1200) {
      return NextResponse.json({ error: "Please describe your tattoo idea in 10–1200 characters." }, { status: 400 });
    }

    const language = body.language || "English";
    const languageInstruction = language === "हिन्दी"
      ? "Respond entirely in natural Hindi using Devanagari script, while keeping tattoo style names and necessary artist terms in English."
      : language === "Hinglish"
        ? "Respond naturally in Hinglish: conversational Hindi written in Latin script with clear English tattoo and artist terms."
        : "Respond entirely in natural English.";
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      temperature: 0.4,
      system: `You are the Ink Lab creative brief assistant for Street Culture Tattoo Studio in Mumbai. Think like a thoughtful tattoo consultant and a small tattoo-studio AI powerhouse. First understand the client's meaning, emotions, symbols, visual references, likes, dislikes, placement, scale, style, body flow, readability, ageing, feasibility, and constraints. Do not invent personal meaning or expose chain-of-thought. Turn rough client language into a concise, specific, artist-useful brief that helps an artist design the tattoo. If important information is missing, state a practical assumption and include one focused question. Never promise medical safety or exact results. Encourage an artist consultation for anatomy, sizing, skin, placement, feasibility, and healing. Return plain text with exactly these sections: IDEA, VISUAL DIRECTION, COMPOSITION & FLOW, PLACEMENT NOTES, SESSION & PRACTICAL NOTES, ARTIST QUESTIONS. Be warm, specific, and under 500 words.\n${languageInstruction}`,
      prompt: `Client idea: ${idea}\nPlacement: ${body.placement?.trim() || "Not specified"}\nStyle: ${body.style || "No preference"}\nRequested response language: ${language}\nReference image supplied: ${body.hasReferenceImage ? "Yes" : "No"}`,
    });
    return NextResponse.json({ brief: text });
  } catch {
    return NextResponse.json({ error: "The Ink Lab could not draft this brief." }, { status: 500 });
  }
}
