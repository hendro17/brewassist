// BYOK LLM client — OpenAI chat-completions shape only (findings/brewlogic-09).
// No Gemini. 60s timeout. Retry 1x on 5xx. Strict JSON output.
export type LlmKey = { base_url: string; api_key: string; model: string; label?: string }

const SYSTEM = `You are a pour-over recipe engine. Use only supplied params and modifiers. Follow 6-axis rules. Change one variable per iteration. Output strict JSON. No explanation outside JSON. Numbers from rules, narrative from coffee knowledge.
Rules: acid=clarity bright pulse; sweet=round sugars low agitation; balance=middle; body=coarse big continuous; complex=split pulse; clean=gentle center minimal.
Temp caps: light 93-94, light-to-medium 92-93, medium 91-92, medium-to-dark 90-91, dark 90.
Ratio: acid 1:16, sweet 1:15, balance 1:16, body 1:14, complex 1:16, clean 1:17.
Return JSON: {volume_ml,temp_c,grind_setting,bloom_g,bloom_s,pours[{step,time,grams,method,agitation,note}],total_time,expected_cup,next_tune_hint}.`

function llmBody(key: LlmKey, userPayload: unknown): string {
  return JSON.stringify({
    model: key.model,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: JSON.stringify(userPayload) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })
}

async function postCompletions(key: LlmKey, body: string): Promise<Response> {
  return fetch(`${key.base_url}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key.api_key}` },
    body,
    signal: AbortSignal.timeout(60000),
  })
}

function isRetryable(status: number): boolean {
  return status >= 500 && status <= 599
}

async function throwForStatus(res: Response): Promise<never> {
  const err = await res.text().catch(() => '')
  throw Object.assign(new Error(`LLM ${res.status}: ${err.slice(0, 300)}`), { status: res.status })
}

async function fetchReply(key: LlmKey, body: string): Promise<{ res: Response; latency_ms: number }> {
  const started = Date.now()
  let res = await postCompletions(key, body)
  if (isRetryable(res.status)) res = await postCompletions(key, body)
  return { res, latency_ms: Date.now() - started }
}

async function extractText(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as any
  const text: string = data?.choices?.[0]?.message?.content ?? ''
  if (!text) throw new Error('LLM empty reply')
  return text
}

export async function callBrewLlm(key: LlmKey, userPayload: unknown): Promise<{ text: string; latency_ms: number }> {
  const { res, latency_ms } = await fetchReply(key, llmBody(key, userPayload))
  if (!res.ok) await throwForStatus(res)
  return { text: await extractText(res), latency_ms }
}

export function parseRecipeJson(text: string): any {
  const parsed = JSON.parse(text)
  if (typeof parsed.volume_ml !== 'number' || typeof parsed.temp_c !== 'number') {
    throw new TypeError('LLM JSON missing volume_ml/temp_c')
  }
  return parsed
}
