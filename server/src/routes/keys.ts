import { Hono } from 'hono'

export const keys = new Hono()
  .post('/ping', async (c) => {
    const { base_url, api_key, model } = await c.req.json()
    const res = await fetch(`${base_url}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${api_key}` },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 10 }),
      signal: AbortSignal.timeout(30000),
    })
    const data = await res.json().catch(() => ({}))
    const text: string = data?.choices?.[0]?.message?.content ?? ''
    if (res.ok && /pong/i.test(text)) return c.json({ valid: true, reply: text })
    return c.json({ valid: false, status: res.status, reply: text }, 422)
  })
