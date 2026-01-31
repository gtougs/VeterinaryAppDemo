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

    // Temporary: disable file_search to avoid upstream latency/timeouts on Vercel edge
    const tools: any[] = [];

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

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000); // keep under edge timeout

    const resp = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(
        JSON.stringify({ error: text || resp.statusText, status: resp.status }),
        { status: resp.status, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const data = await resp.json();
    const output = data?.output?.[0];

    let answer = '';
    if (output?.type === 'output_text') {
      answer = output.output_text ?? output.content?.[0]?.text ?? '';
    } else if (output?.type === 'message' && output.message?.content) {
      answer = output.message.content
        .map((c: any) => c.text ?? '')
        .filter(Boolean)
        .join('\n')
        .trim();
    } else if (output?.content) {
      answer = output.content
        .map((c: any) => c.text ?? '')
        .filter(Boolean)
        .join('\n')
        .trim();
    }

    const sources =
      output?.message?.content
        ?.filter((c: any) => c.type === 'citations')
        ?.map((c: any) => c.citations) ?? [];

    return new Response(JSON.stringify({ answer: answer || 'No answer returned.', sources }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message ?? 'Unknown error' }), { status: 500 });
  }
}
