import { describe, it, expect } from 'vitest'
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
})
