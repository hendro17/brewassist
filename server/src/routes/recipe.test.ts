import { afterEach, describe, expect, it, vi } from 'vitest'
import { recipe } from './recipe.js'

const dayMs = 86400000
const isoDaysAgo = (days: number) => new Date(Date.now() - dayMs * days).toISOString()

function bodyBase() {
  return {
    dose_g: 15,
    target: 'balance',
    roast_level: 'medium',
    altitude_masl: 1200,
    roast_date: isoDaysAgo(14),
  }
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('recipe route', () => {
  it('returns deterministic engine recipe when llm_key is absent', async () => {
    const res = await recipe.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyBase()),
    })
    const data = (await res.json()) as any

    expect(res.status).toBe(200)
    expect(data.recipe.status).toBe('engine-only-no-llm-key')
    expect(data.rule_version).toBe('v1-phase4')
  })

  it('rejects stale beans over 60 days', async () => {
    const res = await recipe.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...bodyBase(), roast_date: isoDaysAgo(90) }),
    })
    const data = (await res.json()) as any

    expect(res.status).toBe(422)
    expect(data.error).toContain('stale >60d: reject, astringent risk')
  })

  it('returns llm status when llm output shape is valid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: '{"volume_ml":240,"temp_c":92,"pours":[{"t_ms":0},{"t_ms":30000}]}' } }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    )

    const res = await recipe.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...bodyBase(),
        llm_key: { base_url: 'https://example.test/v1', api_key: 'k', model: 'm', label: 'demo' },
      }),
    })
    const data = (await res.json()) as any

    expect(res.status).toBe(200)
    expect(data.recipe.status).toBe('llm')
    expect(data.provider_label).toBe('demo')
    expect(data.model).toBe('m')
  })

  it('falls back to engine when llm output shape is invalid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: '{"volume_ml":240,"temp_c":95,"pours":[{"t_ms":0}]}' } }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    )

    const res = await recipe.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...bodyBase(),
        llm_key: { base_url: 'https://example.test/v1', api_key: 'k', model: 'm' },
      }),
    })
    const data = (await res.json()) as any

    expect(res.status).toBe(200)
    expect(data.recipe.status).toBe('engine-fallback-llm-invalid')
    expect(Array.isArray(data.recipe.llm_error)).toBe(true)
  })

  it('returns provider status code when llm call fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('provider down', { status: 503 })))

    const res = await recipe.request('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...bodyBase(),
        llm_key: { base_url: 'https://example.test/v1', api_key: 'k', model: 'm' },
      }),
    })
    const data = (await res.json()) as any

    expect(res.status).toBe(503)
    expect(Array.isArray(data.error)).toBe(true)
    expect(data.rule_version).toBe('v1-phase4')
  })
})
