import { Hono } from 'hono'

function baseUrlError(base_url: unknown): string | null {
  if (typeof base_url !== 'string' || base_url.length === 0) return 'base_url required'
  let u: URL
  try {
    u = new URL(base_url)
  } catch {
    return 'base_url not a URL'
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return 'base_url must be http(s)'
  const host = u.hostname.toLowerCase()
  if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '::1' || host.endsWith('.local') || host.endsWith('.internal')) {
    return 'base_url host blocked'
  }
  return null
}

export const keys = new Hono()
  .post('/ping', async (c) => {
    const { base_url, api_key, model } = await c.req.json()
    const bad = baseUrlError(base_url)
    if (bad) return c.json({ valid: false, error: bad }, 400)
    if (typeof api_key !== 'string' || !api_key || typeof model !== 'string' || !model) {
      return c.json({ valid: false, error: 'api_key + model required' }, 400)
    }
    let res: Response
    try {
      res = await fetch(`${base_url}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${api_key}` },
        body: JSON.stringify({ model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 10 }),
        signal: AbortSignal.timeout(30000),
      })
    } catch {
      return c.json({ valid: false, error: 'upstream unreachable' }, 502)
    }
    const data = await res.json().catch(() => ({}))
    const text: string = data?.choices?.[0]?.message?.content ?? ''
    if (res.ok && /pong/i.test(text)) return c.json({ valid: true, reply: text })
    return c.json({ valid: false, status: res.status }, 422)
  })
