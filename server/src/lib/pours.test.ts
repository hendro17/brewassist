import { describe, it, expect } from 'vitest'
import { buildEngineRecipe } from './pours.js'

const mods = { ratio: 16, temp_c: 92, bloom_mult: 3, bloom_s: 45 }

describe('buildEngineRecipe deterministic pours', () => {
  it('15g balance 1:16 -> 240ml with timestamped pours', () => {
    const r = buildEngineRecipe({ dose_g: 15, target: 'balance' }, mods)
    expect(r.volume_ml).toBe(240)
    expect(r.bloom_g).toBe(45)
    expect(r.pours[0]).toMatchObject({ step: 0, t_ms: 0 })
    expect(r.pours).toHaveLength(4) // bloom + 3
    const times = r.pours.map((p) => p.t_ms)
    expect([...times].sort((a, b) => a - b)).toEqual(times)
  })

  it('body axis uses 2 big pours', () => {
    const r = buildEngineRecipe({ dose_g: 15, target: 'body' }, { ...mods, ratio: 14 })
    expect(r.volume_ml).toBe(210)
    expect(r.pours).toHaveLength(3) // bloom + 2
  })

  it('total_time mm:ss format', () => {
    const r = buildEngineRecipe({ dose_g: 15, target: 'clean' }, { ...mods, ratio: 17 })
    expect(r.total_time).toMatch(/^\d{2}:\d{2}$/)
  })
})
