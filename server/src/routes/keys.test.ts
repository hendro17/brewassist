import { describe, it, expect, vi, beforeEach } from 'vitest'
import { keys } from './keys'

async function ping(body: unknown) {
  const res = await keys.request('/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: res.status, data: await res.json() as any }
}

describe('keys ping guard', () => {
  beforeEach(() => vi.unstubAllGlobals())
  it('rejects non-URL base_url', async () => {
    const r = await ping({ base_url: 'not-a-url', api_key: 'k', model: 'm' })
    expect(r.status).toBe(400)
    expect(r.data.valid).toBe(false)
  })

  it('blocks localhost base_url', async () => {
    const r = await ping({ base_url: 'http://localhost:11434', api_key: 'k', model: 'm' })
    expect(r.status).toBe(400)
    expect(r.data.valid).toBe(false)
  })

  it('rejects missing key/model', async () => {
    const r = await ping({ base_url: 'https://api.openai.com/v1', api_key: '', model: '' })
    expect(r.status).toBe(400)
    expect(r.data.valid).toBe(false)
  })

  it('accepts pong reply', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: 'pong!' } }] }),
      })),
    )
    const r = await ping({ base_url: 'https://api.openai.com/v1', api_key: 'k', model: 'm' })
    expect(r.status).toBe(200)
    expect(r.data.valid).toBe(true)
  })

  it('502 on unreachable upstream', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('down')
      }),
    )
    const r = await ping({ base_url: 'https://api.openai.com/v1', api_key: 'k', model: 'm' })
    expect(r.status).toBe(502)
    expect(r.data.valid).toBe(false)
  })

  it('422 on non-pong reply', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: 'hello' } }] }),
      })),
    )
    const r = await ping({ base_url: 'https://api.openai.com/v1', api_key: 'k', model: 'm' })
    expect(r.status).toBe(422)
    expect(r.data.valid).toBe(false)
  })
})
