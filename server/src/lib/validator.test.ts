import { describe, it, expect } from 'vitest'
import { validateRecipe } from './validator.js'

describe('validateRecipe KB gates', () => {
  const goodInput = {}
  const goodRecipe = { mods: { temp_c: 92, ratio: 16, bloom_mult: 3, bloom_s: 45, grind_um: 700 } }

  it('accepts in-range recipe', () => {
    const r = validateRecipe(goodInput, goodRecipe)
    expect(r.ok).toBe(true)
    expect(r.errors).toEqual([])
  })

  it('rejects temp above cap', () => {
    const r = validateRecipe({}, { mods: { ...goodRecipe.mods, temp_c: 96 } })
    expect(r.ok).toBe(false)
    expect(r.errors[0]).toContain('temp')
  })

  it('rejects ratio out of 1:14-17', () => {
    const r = validateRecipe({}, { mods: { ...goodRecipe.mods, ratio: 13 } })
    expect(r.ok).toBe(false)
    expect(r.errors[0]).toContain('ratio')
  })

  it('rejects bloom outside 2-3x', () => {
    const r = validateRecipe({}, { mods: { ...goodRecipe.mods, bloom_mult: 4 } })
    expect(r.ok).toBe(false)
    expect(r.errors[0]).toContain('bloom')
  })

  it('rejects grind outside 300-1200um', () => {
    const r = validateRecipe({}, { mods: { ...goodRecipe.mods, grind_um: 200 } })
    expect(r.ok).toBe(false)
    expect(r.errors[0]).toContain('grind')
  })
})
