import { Hono } from 'hono'
import { computeModifiers } from '../lib/modifiers.js'
import { buildEngineRecipe } from '../lib/pours.js'
import { validateRecipe } from '../lib/validator.js'
import { callBrewLlm, parseRecipeJson } from '../lib/llm.js'

const RULE_VERSION = 'v1-phase4'

const LLM_KEY_FIELDS = ['base_url', 'api_key', 'model'] as const

function hasLlmKey(body: any): boolean {
  return LLM_KEY_FIELDS.every((f) => Boolean(body?.llm_key?.[f]))
}

function staleError(mods: any): string[] | null {
  if (mods.age_days > 60) return ['stale >60d: reject, astringent risk']
  return null
}

function pourTimeMs(p: any): number {
  if (typeof p.t_ms === 'number') return p.t_ms
  if (typeof p.time === 'number') return p.time < 1000 ? p.time * 1000 : p.time
  return Number.NaN
}

function normalizePours(pours: any[]): any[] {
  return pours.map((p) => {
    const { time, ...rest } = p
    return { ...rest, t_ms: pourTimeMs(p) }
  })
}

function fmtTotal(ms: number): string {
  const mm = String(Math.floor(ms / 60000)).padStart(2, '0')
  const ss = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')
  return `${mm}:${ss}`
}

function llmShapeErrors(llm: any): string[] {
  const errs: string[] = []
  if (typeof llm.volume_ml !== 'number' || !Number.isFinite(llm.volume_ml)) errs.push('llm volume_ml invalid')
  if (typeof llm.temp_c !== 'number' || llm.temp_c < 88 || llm.temp_c > 94) errs.push('llm temp_c out of 88-94')
  if (!Array.isArray(llm.pours) || llm.pours.length === 0) errs.push('llm pours empty')
  else {
    let prev = -1
    for (const p of llm.pours) {
      // Accept t_ms (engine shape) or time (prompt shape, seconds or ms).
      const t = pourTimeMs(p)
      if (!Number.isFinite(t) || t < 0 || t <= prev) { errs.push('llm pours time not ascending'); break }
      prev = t
    }
  }
  return errs
}

async function handleLlm(c: any, body: any, mods: any, engine: any) {
  const key = body.llm_key
  const started = Date.now()
  try {
    const { text, latency_ms } = await callBrewLlm(key, {
      ...body,
      age_days: mods.age_days,
      modifiers_applied: mods,
      engine_baseline: engine,
    })
    let llm: any
    try {
      llm = parseRecipeJson(text)
    } catch (e: any) {
      return c.json({
        recipe: { ...engine, mods, status: 'engine-fallback-llm-invalid', llm_error: [String(e?.message ?? e)] },
        provider_label: key.label ?? null,
        model: key.model,
        latency_ms: Date.now() - started,
        rule_version: RULE_VERSION,
      })
    }
    const shapeErrs = llmShapeErrors(llm)
    if (shapeErrs.length > 0) {
      return c.json({
        recipe: { ...engine, mods, status: 'engine-fallback-llm-invalid', llm_error: shapeErrs },
        provider_label: key.label ?? null,
        model: key.model,
        latency_ms: Date.now() - started || latency_ms,
        rule_version: RULE_VERSION,
      })
    }
    // Normalize to engine shape before merge: single t_ms field, totals derived from last pour.
    const llmPours = normalizePours(llm.pours)
    const total_ms = (llmPours.at(-1)?.t_ms ?? 0) + 45000 // same drawdown as engine
    return c.json({
      recipe: { ...engine, ...llm, pours: llmPours, total_ms, total_time: fmtTotal(total_ms), mods, status: 'llm' },
      provider_label: key.label ?? null,
      model: key.model,
      latency_ms: Date.now() - started || latency_ms,
      rule_version: RULE_VERSION,
    })
  } catch (e: any) {
    const status = e?.status ?? 500
    const code = status >= 400 && status < 600 ? status : 502
    return c.json(
      { error: [String(e?.message ?? e)], engine_baseline: { ...engine, mods }, rule_version: RULE_VERSION },
      code,
    )
  }
}

// POST /api/recipe
// body: brew inputs + optional { llm_key: { base_url, api_key, model, label } }
// Without llm_key -> deterministic engine recipe only. With key -> LLM JSON, validator-gated.
export const recipe = new Hono().post('/', async (c) => {
  const body = await c.req.json()
  const mods = computeModifiers(body)
  const engine = buildEngineRecipe(body, mods)
  const check = validateRecipe(body, { mods })
  if (!check.ok) return c.json({ error: check.errors }, 422)
  const stale = staleError(mods)
  if (stale) return c.json({ error: stale }, 422)
  if (!hasLlmKey(body)) {
    return c.json({ recipe: { ...engine, mods, status: 'engine-only-no-llm-key' }, rule_version: RULE_VERSION })
  }
  return handleLlm(c, body, mods, engine)
})
