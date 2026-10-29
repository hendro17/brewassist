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
    const llm = parseRecipeJson(text)
    return c.json({
      recipe: { ...engine, ...llm, mods, status: 'llm' },
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
