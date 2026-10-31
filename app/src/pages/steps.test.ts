// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp, h } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'

const ls = (() => {
  const s: Record<string, string> = {}
  return {
    getItem: (k: string) => s[k] ?? null,
    setItem: (k: string, v: string) => { s[k] = v },
    removeItem: (k: string) => { delete s[k] },
    clear: () => { for (const k of Object.keys(s)) delete s[k] },
  }
})()
vi.stubGlobal('localStorage', ls)

function mount(comp: any) {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { render: () => h('div') } },
      { path: '/s1', component: { render: () => h('div') } },
      { path: '/s2', component: { render: () => h('div') } },
      { path: '/s3', component: { render: () => h('div') } },
    ],
  })
  const app = createApp(comp)
  app.use(createPinia())
  app.use(router)
  app.mount(el)
  return { el, router, cleanup: () => { app.unmount(); el.remove() } }
}

describe('Step1 selects', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('renders hardware dropdowns from seed mirror', async () => {
    const { default: Step1 } = await import('../pages/Step1.vue')
    const { el, router, cleanup } = mount(Step1)
    const opts = [...el.querySelectorAll('#f-grinder option')].map((o) => (o as HTMLOptionElement).value)
    expect(opts).toContain('1Zpresso J-Ultra')
    expect(opts).toHaveLength(10)
    expect(el.querySelectorAll('#f-dripper option')).toHaveLength(8)
    expect(el.querySelectorAll('#f-filter option')).toHaveLength(9)
    expect(el.querySelectorAll('#f-water option')).toHaveLength(4)
    cleanup()
  })

  it('submits inputs and routes to /s2', async () => {
    const { default: Step1 } = await import('../pages/Step1.vue')
    const { el, router, cleanup } = mount(Step1)
    await router.push('/s1')
    el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }))
    await router.isReady()
    await new Promise((r) => setTimeout(r, 0))
    expect(router.currentRoute.value.path).toBe('/s2')
    cleanup()
  })
})

describe('Step2 gen errors', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('shows error on 422 recipe failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 422,
        json: async () => ({ error: ['stale >60d: reject'] }),
      })),
    )
    const { default: Step2 } = await import('../pages/Step2.vue')
    const { el, cleanup } = mount(Step2)
    const btns = [...el.querySelectorAll('button')]
    btns[0].click()
    await new Promise((r) => setTimeout(r, 50))
    expect(el.textContent).toContain('stale >60d: reject')
    cleanup()
  })

  it('shows error on network failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('down')
      }),
    )
    const { default: Step2 } = await import('../pages/Step2.vue')
    const { el, cleanup } = mount(Step2)
    const btns = [...el.querySelectorAll('button')]
    btns[0].click()
    await new Promise((r) => setTimeout(r, 50))
    expect(el.textContent).toContain('Network error')
    cleanup()
  })

  it('renders timer on successful recipe', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          recipe: {
            pours: [{ step: 0, t_ms: 0, grams: 30, method: 'bloom', agitation: 'swirl' }],
            total_ms: 75000,
          },
        }),
      })),
    )
    const { default: Step2 } = await import('../pages/Step2.vue')
    const { el, cleanup } = mount(Step2)
    const btns = [...el.querySelectorAll('button')]
    btns[0].click()
    await new Promise((r) => setTimeout(r, 50))
    expect(el.textContent).toContain('Brew timer')
    cleanup()
  })
})

describe('Step3 save badge', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('shows saved confirmation after save', async () => {
    const { default: Step3 } = await import('../pages/Step3.vue')
    const { el, cleanup } = mount(Step3)
    expect(el.textContent).not.toContain('Saved locally')
    el.querySelector('button')!.click()
    await new Promise((r) => setTimeout(r, 0))
    expect(el.textContent).toContain('Saved locally')
    cleanup()
  })
})
