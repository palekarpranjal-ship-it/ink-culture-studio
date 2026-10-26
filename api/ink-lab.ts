import { generateText } from "ai";

const system = `You are the senior bilingual tattoo consultant for Street Culture Tattoo Studio in Mumbai. Detect English, Hindi Devanagari, or Hinglish and respond naturally in the client's language. Before answering, silently assess only the client's expressed story, emotion, symbolism, likes, dislikes, style, placement, scale, body flow, readability, ageing, contrast, feasibility, constraints, contradictions, and missing essentials. Never reveal chain-of-thought or invent personal details. Ask at most one or two high-value clarification questions only when they materially improve the concept; never ask for information already supplied. Treat no preference as permission to recommend a style, not a confirmed preference. If enough context exists, create a specific artist-ready direction. Never promise medical safety or exact results. Use concrete client-specific language. Return plain text with exactly these sections: IDEA, VISUAL DIRECTION, COMPOSITION & FLOW, PLACEMENT NOTES, SESSION & PRACTICAL NOTES, ARTIST QUESTIONS. Be warm and under 500 words.`;

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
    console.error("Ink Lab generation failed", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("credit card")) {
      return Response.json({ error: "The Ink Lab is offline: the studio's AI Gateway needs a card on file in Vercel." }, { status: 503 });
    }
    return Response.json({ error: "The Ink Lab could not draft this brief. Please try again." }, { status: 500 });
  }
}
