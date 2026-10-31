import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useBrewTimer } from './useBrewTimer'

// onUnmounted only works inside setup() — noop it for direct composable tests.
vi.mock('vue', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue')>()),
  onUnmounted: vi.fn(),
}))

// rAF manual: capture latest callback, run with controlled timestamps.
let rafCb: FrameRequestCallback | null = null
vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
  rafCb = cb
  return 1
})
vi.stubGlobal('cancelAnimationFrame', () => {
  rafCb = null
})
vi.stubGlobal('AudioContext', class {
  currentTime = 0
  createOscillator() {
    return { connect() {}, frequency: { value: 0 }, start() {}, stop() {} }
  }
  createGain() {
    return { connect() {}, gain: { value: 0 } }
  }
  get destination() {
    return {}
  }
})

const pours = [
  { step: 0, t_ms: 0, grams: 30, method: 'bloom center', agitation: 'swirl once' },
  { step: 1, t_ms: 30000, grams: 70, method: 'spiral slow', agitation: 'medium' },
]
const TOTAL = 75000

describe('useBrewTimer', () => {
  beforeEach(() => {
    rafCb = null
  })

  it('starts idle, ticks, reaches done', () => {
    const t = useBrewTimer(pours, TOTAL)
    expect(t.state.value).toBe('idle')
    t.start()
    rafCb?.(1000)
    rafCb?.(2000)
    expect(t.elapsed.value).toBeGreaterThan(0)
    expect(t.state.value).toBe('pouring')
    rafCb?.(2000 + TOTAL)
    expect(t.state.value).toBe('done')
  })

  it('pause freezes elapsed', () => {
    const t = useBrewTimer(pours, TOTAL)
    t.start()
    rafCb?.(1000)
    rafCb?.(3000)
    const e = t.elapsed.value
    t.pause()
    expect(t.elapsed.value).toBe(e)
  })

  it('reacts to ref recipe + beeps near pour without throw', () => {
    const rp = ref(pours)
    const rt = ref(TOTAL)
    const t = useBrewTimer(rp, rt)
    expect(t.nextPour.value?.step).toBe(1)
    t.reset()
    // 800ms pre-pour window triggers beep path (AudioContext stubbed)
    t.start()
    rafCb?.(1000)
    rafCb?.(1000 + 29300)
    expect(() => t.beep()).not.toThrow()
  })
})
