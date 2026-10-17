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
      system: `You are the senior tattoo consultant for Street Culture Tattoo Studio in Mumbai. Before writing, silently reason through the client's intent, symbolism, visual hierarchy, body flow, style fit, scale, contrast, likely session complexity, and any ambiguity. Do not reveal private chain-of-thought; provide only the useful conclusions. If key information is missing, make a clearly labelled assumption and add one focused question rather than inventing details. Turn rough client language into a concise, artist-useful brief. Never promise medical safety or exact results. Encourage an artist consultation for anatomy, sizing, skin, placement, feasibility, and healing. Return plain text with exactly these sections: IDEA, VISUAL DIRECTION, COMPOSITION & FLOW, PLACEMENT NOTES, SESSION & PRACTICAL NOTES, ARTIST QUESTIONS. Be warm, specific, and under 500 words.`,
      prompt: `Client idea: ${idea}\nPlacement: ${body.placement?.trim() || "Not specified"}\nStyle: ${body.style || "No preference"}\nReference image supplied: ${body.hasReferenceImage ? "Yes" : "No"}`,
    });
    return NextResponse.json({ brief: text });
  } catch {
    return NextResponse.json({ error: "The Ink Lab could not draft this brief." }, { status: 500 });
  }
}
