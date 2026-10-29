import { ref, computed, onUnmounted } from 'vue'

// Native Audio timer (findings C6b SSOT). Web Audio oscillator beep, no file download.
// States: idle, pouring, done. Pause keeps offset.
export type PourStep = { step: number; t_ms: number; grams: number; method: string; note?: string }

export function useBrewTimer(pours: PourStep[], total_ms: number) {
  const elapsed = ref(0)
  const running = ref(false)
  const state = computed(() => {
    if (elapsed.value <= 0) return 'idle'
    if (elapsed.value >= total_ms) return 'done'
    return 'pouring'
  })
  const nextPour = computed(() => pours.find((p) => p.t_ms > elapsed.value) ?? null)
  let raf = 0
  let last = 0
  let ctx: AudioContext | null = null
  const ticked = new Set<number>()

  function beep() {
    try {
      ctx ??= new AudioContext()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g)
      g.connect(ctx.destination)
      o.frequency.value = 880
      g.gain.value = 0.15
      o.start()
      o.stop(ctx.currentTime + 0.25)
    } catch {
      // audio blocked — visual fallback only
    }
  }

  function isDue(p: PourStep): boolean {
    const remain = p.t_ms - elapsed.value
    return remain <= 800 && remain > 0
  }

  function maybeBeep() {
    const n = nextPour.value
    if (!n || !isDue(n) || ticked.has(n.step)) return
    ticked.add(n.step)
    beep()
  }

  function tick(ts: number) {
    if (!running.value) return
    if (!last) last = ts
    elapsed.value += ts - last
    last = ts
    maybeBeep()
    if (elapsed.value >= total_ms) {
      running.value = false
      beep()
      return
    }
    raf = requestAnimationFrame(tick)
  }

  function start() {
    if (running.value) return
    running.value = true
    last = 0
    raf = requestAnimationFrame(tick)
  }
  function pause() {
    running.value = false
    last = 0
    cancelAnimationFrame(raf)
  }
  function reset() {
    pause()
    elapsed.value = 0
    ticked.clear()
  }

  onUnmounted(() => cancelAnimationFrame(raf))
  return { elapsed, running, state, nextPour, start, pause, reset, beep }
}
