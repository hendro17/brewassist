import { defineStore } from 'pinia'
export const useBrewStore = defineStore('brew', {
  state: () => ({ step: 1, inputs: {} as any, resume: null as any, recipe: null as any, feedback: null as any }),
  actions: {
    setInputs(v: any) { this.inputs = v; this.step = 2 },
    setRecipe(v: any) { this.recipe = v },
    setFeedback(v: any) { this.feedback = v; this.step = 3 },
  },
})
