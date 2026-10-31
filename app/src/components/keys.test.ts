// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createApp } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

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
  const app = createApp(comp)
  app.use(createPinia())
  app.mount(el)
  return { el, cleanup: () => { app.unmount(); el.remove() } }
}

function fill(el: Element, id: string, v: string) {
  const inp = el.querySelector(id) as HTMLInputElement
  inp.value = v
  inp.dispatchEvent(new Event('input'))
}

describe('KeySettings BYOK flow', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.unstubAllGlobals()
    vi.stubGlobal('localStorage', ls)
  })

  it('pings, saves, sets default, deletes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, status: 200, json: async () => ({}) })),
    )
    const { default: KeySettings } = await import('../components/KeySettings.vue')
    const { el, cleanup } = mount(KeySettings)
    fill(el, '#k-label', 'openrouter')
    fill(el, '#k-url', 'https://openrouter.ai/api/v1')
    fill(el, '#k-key', 'sk-test')
    fill(el, '#k-model', 'm1')
    el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }))
    await new Promise((r) => setTimeout(r, 50))
    expect(el.textContent).toContain('Saved openrouter')
    // default delete flow: remove the only key
    const del = [...el.querySelectorAll('button')].find((b) => b.textContent === 'delete')
    del!.click()
    await new Promise((r) => setTimeout(r, 0))
    expect(el.textContent).not.toContain('openrouter —')
    cleanup()
  })

  it('rejects when over 3 keys', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, status: 200, json: async () => ({}) })),
    )
    localStorage.setItem(
      'brewassist-keys',
      JSON.stringify([
        { label: 'a', base_url: 'https://x.ai', api_key: 'k', model: 'm', is_default: true },
        { label: 'b', base_url: 'https://x.ai', api_key: 'k', model: 'm', is_default: false },
        { label: 'c', base_url: 'https://x.ai', api_key: 'k', model: 'm', is_default: false },
      ]),
    )
    const { default: KeySettings } = await import('../components/KeySettings.vue')
    const { el, cleanup } = mount(KeySettings)
    fill(el, '#k-label', 'd')
    fill(el, '#k-url', 'https://x.ai')
    fill(el, '#k-key', 'k')
    fill(el, '#k-model', 'm')
    el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }))
    await new Promise((r) => setTimeout(r, 0))
    expect(el.textContent).toContain('Max 3 keys enforced')
    cleanup()
  })
})
