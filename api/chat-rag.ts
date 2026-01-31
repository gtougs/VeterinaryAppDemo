export const config = { runtime: 'edge' };

const OPENAI_API_URL = 'https://api.openai.com/v1/responses';

const SYSTEM_PROMPT = `
You are the VetCare owner-facing assistant. Guardrails:
- Never change dosing; direct owner to clinic for dose changes.
- Always list 2–3 red-flag symptoms to escalate.
- Keep replies concise and in plain language.
- If uncertain, say so and point to contacting the clinic.
Return short bullets and cite the source titles if available.
`;

export default async function handler(req: Request) {
  try {
    const { message, caseId, species } = await req.json();
    if (!message) {
      return new Response(JSON.stringify({ error: 'Missing message' }), { status: 400 });
    }

    const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
    const tools = vectorStoreId
      ? [
          {
            type: 'file_search' as const,
            vector_store_ids: [vectorStoreId],
          },
        ]
      : [];

    const body = {
      model: 'gpt-4o-mini',
      stream: false,
      metadata: { ui: 'owner', caseId, species },
      input: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      tools,
      // tighten retrieval if we have metadata
      ...(tools.length
        ? {
            tool_choice: 'auto',
            parallel_tool_calls: true,
            temperature: 0.2,
          }
        : {}),
    };

    const resp = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ error: text || resp.statusText }), { status: resp.status });
    }

    const data = await resp.json();
    // Responses API returns output array; grab first output_text chunk
    const output = data?.output?.[0];
    const textChunk = output?.content?.find((c: any) => c.type === 'output_text');
    const answer = textChunk?.text ?? output?.content?.[0]?.text ?? 'No answer returned.';

    const sources = data?.output?.flatMap((o: any) =>
      o.content?.filter((c: any) => c.type === 'citations') ?? [],
    );

    return new Response(JSON.stringify({ answer, sources }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Unknown error' }), { status: 500 });
  }
}
