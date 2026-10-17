import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      idea?: string;
      placement?: string;
      style?: string;
      hasReferenceImage?: boolean;
    };
    const idea = body.idea?.trim();
    if (!idea || idea.length < 10 || idea.length > 1200) {
      return NextResponse.json({ error: "Please describe your tattoo idea in 10–1200 characters." }, { status: 400 });
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      temperature: 0.4,
      system: `You are the Ink Lab creative brief assistant for Street Culture Tattoo Studio in Mumbai. Think like a thoughtful tattoo consultant, not a generic chatbot. Turn rough client language into a concise, artist-useful brief. Never promise medical safety or exact results. Encourage an artist consultation for anatomy, sizing, skin, placement, feasibility, and healing. Return plain text with exactly these sections: IDEA, VISUAL DIRECTION, COMPOSITION & FLOW, PLACEMENT NOTES, SESSION & PRACTICAL NOTES, ARTIST QUESTIONS. Be warm, specific, and under 500 words.`,
      prompt: `Client idea: ${idea}\nPlacement: ${body.placement?.trim() || "Not specified"}\nStyle: ${body.style || "No preference"}\nReference image supplied: ${body.hasReferenceImage ? "Yes" : "No"}`,
    });
    return NextResponse.json({ brief: text });
  } catch {
    return NextResponse.json({ error: "The Ink Lab could not draft this brief." }, { status: 500 });
  }
}
