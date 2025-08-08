import OpenAI from "openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const incoming: {
      role: "system" | "user" | "assistant";
      content: string;
    }[] = Array.isArray((body as any)?.messages) ? (body as any).messages : [];

    const systemMessage = {
      role: "system" as const,
      content: `You are JPChat, an assistant that only responds to questions or conversations related to movies, TV shows, cinema history, actors, directors, genres, trivia, recommendations, and behind-the-scenes facts. 
                If the user asks about something unrelated to these topics, you must find a creative and entertaining way to relate it to a movie, TV show, or cinematic moment, so that the conversation always stays connected to film and television. 
                You can respond in any language based on the user's input language.
                `,
    };

    const hasSystem = incoming.find((m) => m.role === "system");
    const baseMessages = hasSystem ? incoming : [systemMessage, ...incoming];

    const messages =
      baseMessages.length > 0
        ? baseMessages
        : [
            systemMessage,
            { role: "user" as const, content: "Say hi in one short sentence." },
          ];

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return Response.json({ reply: text, usage: completion.usage });
  } catch (err: any) {
    console.error("chat-direct error:", err?.status, err?.message);
    if (err?.response) {
      console.error("chat-direct response body:", await err.response.text());
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
