import { afterEach, describe, expect, it, vi } from 'vitest'
import { callBrewLlm, parseRecipeJson, type LlmKey } from './llm.js'

const key: LlmKey = {
  base_url: 'https://example.test/v1',
  api_key: 'test-key',
  model: 'test-model',
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('callBrewLlm', () => {
  it('returns text on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: '{"volume_ml":240,"temp_c":92,"pours":[{"t_ms":0}]}' } }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    )

    const out = await callBrewLlm(key, { dose_g: 15 })
    expect(out.text).toContain('"volume_ml":240')
    expect(out.latency_ms).toBeGreaterThanOrEqual(0)
  })

  it('retries once for 5xx responses', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response('upstream down', { status: 503 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: '{"volume_ml":225,"temp_c":91,"pours":[{"t_ms":0}]}' } }],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    await callBrewLlm(key, { dose_g: 15 })
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('throws with status details for non-ok responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('bad request', { status: 400 })))

    await expect(callBrewLlm(key, { dose_g: 15 })).rejects.toMatchObject({
      status: 400,
      message: expect.stringContaining('LLM 400'),
    })
  })
})

describe('parseRecipeJson', () => {
  it('throws type error when required numeric fields are missing', () => {
    expect(() => parseRecipeJson('{"volume_ml":"240","temp_c":92}')).toThrow('LLM JSON missing volume_ml/temp_c')
  })
})
