import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBrewStore } from './brew'

// node env has no localStorage — stub it.
const ls = (() => {
  let s: Record<string, string> = {}
  return {
    getItem: (k: string) => s[k] ?? null,
    setItem: (k: string, v: string) => { s[k] = v },
    removeItem: (k: string) => { delete s[k] },
    clear: () => { s = {} },
  }
})()
vi.stubGlobal('localStorage', ls)

describe('brew store 3-step flow', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts at step 1', () => {
    expect(useBrewStore().step).toBe(1)
  })

  it('setInputs advances to step 2 with resume payload', () => {
    const s = useBrewStore()
    s.setInputs({ origin: 'Kerinci', target: 'complex' })
    expect(s.step).toBe(2)
    expect(s.inputs.origin).toBe('Kerinci')
  })

  it('setFeedback advances to step 3 keeping recipe', () => {
    const s = useBrewStore()
    s.setInputs({ origin: 'Kerinci' })
    s.setRecipe({ recipe: { temp_c: 92 } })
    s.setFeedback({ sweet: 80, acid: 70, body: 75 })
    expect(s.step).toBe(3)
    expect(s.recipe.recipe.temp_c).toBe(92)
    expect(s.feedback.sweet).toBe(80)
  })
})
