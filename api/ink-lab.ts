import { generateText } from "ai";

const system = `You are the senior tattoo consultant for Street Culture Tattoo Studio in Mumbai. Before writing, silently assess intent, symbolism, visual hierarchy, body flow, style fit, scale, contrast, session complexity, and ambiguity. Do not reveal chain-of-thought; return only useful conclusions. If information is missing, state an assumption and add one focused question. Never promise medical safety or exact results. Encourage an artist consultation for anatomy, sizing, skin, placement, feasibility, and healing. Return plain text with exactly these sections: IDEA, VISUAL DIRECTION, COMPOSITION & FLOW, PLACEMENT NOTES, SESSION & PRACTICAL NOTES, ARTIST QUESTIONS. Be warm, specific, and under 500 words.`;

type Body = { idea?: string; placement?: string; style?: string; hasReferenceImage?: boolean };

export default async function handler(request: Request) {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const body = (await request.json()) as Body;
    const idea = body.idea?.trim();
    if (!idea || idea.length < 10 || idea.length > 1200) {
      return Response.json({ error: "Please describe your tattoo idea in 10–1200 characters." }, { status: 400 });
    }
    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      temperature: 0.4,
      system,
      prompt: `Client idea: ${idea}\nPlacement: ${body.placement?.trim() || "Not specified"}\nStyle: ${body.style || "No preference"}\nReference image supplied: ${body.hasReferenceImage ? "Yes" : "No"}`,
    });
    return Response.json({ brief: text });
  } catch (error) {
    console.error("[v0] Ink Lab generation failed", error);
    return Response.json({ error: "The Ink Lab could not draft this brief. Please try again." }, { status: 500 });
  }
}
