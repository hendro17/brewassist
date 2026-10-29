import { Hono } from 'hono'
import { computeModifiers } from '../lib/modifiers.js'
import { validateRecipe } from '../lib/validator.js'

export const recipe = new Hono()
  .post('/', async (c) => {
    const body = await c.req.json()
    const mods = computeModifiers(body)
    const recipe = { mods, status: 'engine-only-no-llm-yet' }
    const check = validateRecipe(body, recipe)
    if (!check.ok) return c.json({ error: check.errors }, 422)
    return c.json({ recipe })
  })
