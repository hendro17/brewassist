import { describe, it, expect } from 'vitest'
import { computeModifiers } from './modifiers.js'

const base = {
  roast_level: 'medium', roast_date: '2026-10-01',
  altitude_masl: 1400, target: 'balance',
}

describe('computeModifiers', () => {
  it('fresh bean forces 3x/45s bloom + coarser grind', () => {
    const m = computeModifiers({ ...base, roast_date: new Date().toISOString().slice(0, 10) })
    expect(m.age_days).toBe(0)
    expect(m.bloom_mult).toBe(3)
    expect(m.bloom_s).toBe(45)
    expect(m.grind_um).toBe(700) // 700 -60(alt>1370) +60(fresh)
  })

  it('altitude >1370 raises temp and adds bloom time on peak bean', () => {
    const m = computeModifiers({ ...base, target: 'sweet' }) // 2026-10-01 = ~28d peak
    expect(m.age_days).toBeGreaterThan(7)
    expect(m.temp_c).toBe(92) // medium 91.5 + 1 SHB, clamped to cap 92
    expect(m.bloom_mult).toBe(2) // sweet axis
    expect(m.grind_um).toBe(640)
  })

  it('altitude <1000 coarsens and cools', () => {
    const m = computeModifiers({ ...base, altitude_masl: 800, roast_date: '2026-10-01' })
    expect(m.grind_um).toBe(760) // 700 +60 low alt
    expect(m.temp_c).toBe(91) // 91.5 -1 low alt, clamped up to band min 91
  })

  it('6-axis ratio map acid->16, sweet->15, body->14, clean->17', () => {
    const d = '2026-10-01'
    expect(computeModifiers({ ...base, roast_date: d, target: 'acid' }).ratio).toBe(16)
    expect(computeModifiers({ ...base, roast_date: d, target: 'sweet' }).ratio).toBe(15)
    expect(computeModifiers({ ...base, roast_date: d, target: 'body' }).ratio).toBe(14)
    expect(computeModifiers({ ...base, roast_date: d, target: 'clean' }).ratio).toBe(17)
  })

  it('dark roast caps temp at 90', () => {
    const m = computeModifiers({ ...base, roast_level: 'dark', altitude_masl: 1400, roast_date: '2026-10-01' })
    expect(m.temp_c).toBe(91) // 90 cap + 1 SHB
  })

  it('light roast clamps to 93-94 band even with altitude bonus', () => {
    const m = computeModifiers({ ...base, roast_level: 'light', altitude_masl: 1400, roast_date: '2026-10-01' })
    expect(m.temp_c).toBe(94) // 93.5 + 1 SHB clamped to cap 94
  })
})
