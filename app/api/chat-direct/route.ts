import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const incoming: { role: 'system' | 'user' | 'assistant'; content: string }[] =
      Array.isArray((body as any)?.messages) ? (body as any).messages : [];

    const systemMessage = {
      role: 'system' as const,
      content: `You are JPChat, an assistant specialized in movies, TV shows, and cinema history. 
        You can discuss plots, actors, directors, genres, trivia, recommendations, 
        and behind-the-scenes facts. You cannot answer other general questions if asked, only things about movies,
        if the question is not related to it, please respond with "Sorry, I can't answer about a topic not related to movies.".`,
    };

    const hasSystem = incoming.find((m) => m.role === 'system');
    const baseMessages = hasSystem ? incoming : [systemMessage, ...incoming];

    const messages =
      baseMessages.length > 0
        ? baseMessages
        : [systemMessage, { role: 'user' as const, content: 'Say hi in one short sentence.' }];

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const text = completion.choices?.[0]?.message?.content ?? '';
    return Response.json({ reply: text, usage: completion.usage });
  } catch (err: any) {
    console.error('chat-direct error:', err?.status, err?.message);
    if (err?.response) {
      console.error('chat-direct response body:', await err.response.text());
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  return new Response('Method Not Allowed', { status: 405 });
}
