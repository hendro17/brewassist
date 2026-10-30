import { defineStore } from 'pinia'

const LS_KEY = 'brewassist-state'

function loadLs(): { inputs: any; recipe: any; feedback: any } {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { inputs: {}, recipe: null, feedback: null }
    const p = JSON.parse(raw)
    return { inputs: p.inputs ?? {}, recipe: p.recipe ?? null, feedback: p.feedback ?? null }
  } catch {
    return { inputs: {}, recipe: null, feedback: null }
  }
}

export const useBrewStore = defineStore('brew', {
  state: () => ({ step: 1, ...loadLs() }),
  actions: {
    persist() {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ inputs: this.inputs, recipe: this.recipe, feedback: this.feedback }))
      } catch {
        // quota/private mode — session-only fallback
      }
    },
    setInputs(v: any) { this.inputs = v; this.step = 2; this.persist() },
    setRecipe(v: any) { this.recipe = v; this.persist() },
    setFeedback(v: any) { this.feedback = v; this.step = 3; this.persist() },
    loadSaved() {
      const s = loadLs()
      this.inputs = s.inputs; this.recipe = s.recipe; this.feedback = s.feedback
    },
  },
})
