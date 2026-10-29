<template>
  <section>
    <h1>Step 2 — Resume + Recipe + Brew Assist</h1>
    <pre class="text-xs bg-gray-100 p-2">{{ s.inputs }}</pre>
    <div class="flex gap-2 mt-2">
      <button @click="gen" class="bg-black text-white px-4 py-2">Generate recipe</button>
      <RouterLink to="/s3" class="px-4 py-2 border">→ Feedback</RouterLink>
    </div>
    <pre v-if="s.recipe" class="text-xs bg-green-50 p-2 mt-2">{{ s.recipe }}</pre>
    <KeySettings />
    <div v-if="pours.length" class="mt-4 border p-3">
      <h2 class="font-bold">Brew timer — {{ state }} {{ fmt(elapsed) }} / {{ fmt(total) }}</h2>
      <ol class="text-sm mt-2 space-y-1">
        <li v-for="p in pours" :key="p.step" :class="{ 'font-bold': next?.step === p.step }">
          {{ fmt(p.t_ms) }} — step {{ p.step }}: {{ p.grams }}g {{ p.method }}
        </li>
      </ol>
      <div class="flex gap-2 mt-3">
        <button @click="start" class="bg-black text-white px-4 py-2">Start</button>
        <button @click="pause" class="px-4 py-2 border">Pause</button>
        <button @click="reset" class="px-4 py-2 border">Reset</button>
        <button @click="beep" class="px-4 py-2 border" aria-label="Test beep">🔔</button>
      </div>
      <p v-if="next" class="text-sm mt-2">Next: step {{ next.step }} at {{ fmt(next.t_ms) }}</p>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useBrewStore } from '../stores/brew'
import { useBrewTimer } from '../composables/useBrewTimer'
import KeySettings from '../components/KeySettings.vue'
const s = useBrewStore()
async function gen() {
  const keys = JSON.parse(localStorage.getItem('brewassist-keys') ?? '[]')
  const d = keys.find((k: any) => k.is_default)
  const r = await fetch('/api/recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...s.inputs, llm_key: d ? { ...d } : undefined }),
  })
  s.setRecipe(await r.json())
}
const pours = computed(() => s.recipe?.recipe?.pours ?? [])
const total = computed(() => s.recipe?.recipe?.total_ms ?? 0)
const { elapsed, state, nextPour: next, start, pause, reset, beep } = useBrewTimer(pours.value as any, total.value)
function fmt(ms: number) {
  const m = String(Math.floor(ms / 60000)).padStart(2, '0')
  const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')
  return `${m}:${sec}`
}
</script>
