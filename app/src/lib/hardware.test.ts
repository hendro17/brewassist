import { describe, expect, it } from 'vitest'
import { DRIPPERS, FILTERS, GRINDERS, WATERS } from './hardware'

describe('hardware options', () => {
  it('exports expected grinder and water options', () => {
    expect(GRINDERS).toContain('1Zpresso J-Ultra')
    expect(GRINDERS).toContain('Comandante C60')
    expect(WATERS).toEqual(['Aqua', 'Le Minerale', 'Cleo', 'Amidis'])
  })

  it('exports filter and dripper options', () => {
    expect(FILTERS).toContain('Cafec T-92 Light')
    expect(FILTERS).toContain('Sibarist B3')
    expect(DRIPPERS).toContain('Hario V60')
    expect(DRIPPERS).toContain('Aeropress filter-style')
  })
})
