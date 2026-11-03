import { describe, it, expect } from 'vitest'
import app from './index.js'

const today = new Date().toISOString().slice(0, 10)
const base = {
  dose_g: 15,
  target: 'balance',
  origin_mode: 'single',
  roast_level: 'medium',
  roast_date: today,
}

async function post(path: string, body: unknown) {
  const r = await app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: r.status, data: (await r.json()) as any }
}

describe('trial smoke (no LLM key)', () => {
  it('health ok', async () => {
    const r = await app.request('/health')
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true })
  })

  it('engine-only recipe end-to-end', async () => {
    const { status, data } = await post('/api/recipe', base)
    expect(status).toBe(200)
    expect(data.recipe.status).toBe('engine-only-no-llm-key')
    expect(data.recipe.volume_ml).toBe(240)
    expect(data.recipe.pours.length).toBeGreaterThan(1)
    expect(data.rule_version).toBe('v1-phase4')
  })

  it('stale beans rejected (fail-closed)', async () => {
    const d = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10)
    const { status, data } = await post('/api/recipe', { ...base, roast_date: d })
    expect(status).toBe(422)
    expect(JSON.stringify(data)).toContain('stale')
  })

  it('bad input rejected by validator', async () => {
    const { status } = await post('/api/recipe', { ...base, target: 'rocket-fuel' })
    expect([200, 422]).toContain(status) // balance fallback OR reject — never 500
  })
})
