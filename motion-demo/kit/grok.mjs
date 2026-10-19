// Minimal client for the xAI Responses API (https://docs.x.ai): plain fetch, no dependencies.
// Needs XAI_API_KEY (create it at console.x.ai). XAI_MODEL and XAI_BASE_URL override the defaults.
export const BASE = process.env.XAI_BASE_URL ?? "https://api.x.ai/v1";
export const MODELO = process.env.XAI_MODEL ?? "grok-4.7";

export async function responder(cuerpo, { apiKey = process.env.XAI_API_KEY, fetch: f = globalThis.fetch } = {}) {
  if (!apiKey) throw new Error("Falta XAI_API_KEY. Crea una clave en console.x.ai, o usa el modo manual: node kit/radar.mjs prompt …");
  const r = await f(`${BASE}/responses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(cuerpo),
  });
  const body = await r.text();
  if (!r.ok) throw Object.assign(new Error(`xAI respondió ${r.status}: ${body.slice(0, 400)}`), { status: r.status });
  return JSON.parse(body);
}

// Text of the assistant's message items.
export const texto = (res) =>
  (res.output ?? [])
    .filter((o) => o.type === "message")
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text)
    .join("");

// Every URL the agent saw (response.citations) plus inline url_citation annotations.
export const citas = (res) => {
  const urls = new Set((res.citations ?? []).map((c) => (typeof c === "string" ? c : c?.url)).filter(Boolean));
  for (const o of res.output ?? []) for (const c of o.content ?? []) for (const a of c.annotations ?? []) if (a.url) urls.add(a.url);
  return [...urls];
};

// Cost in USD from usage.cost_in_usd_ticks (1 USD = 10^10 ticks), when the API reports it.
export const coste = (res) => (res.usage?.cost_in_usd_ticks ? res.usage.cost_in_usd_ticks / 1e10 : null);
