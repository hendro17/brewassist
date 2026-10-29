<template>
  <section class="border p-3 mt-4">
    <h2 class="font-bold">BYOK key — OpenAI compatible</h2>
    <p class="text-sm text-gray-600">Max 3 keys. Default brews. Ping validates before save.</p>
    <form @submit.prevent="add">
      <label for="k-label" class="mt-2 block">Label</label>
      <input id="k-label" v-model="f.label" class="border p-2 w-full" placeholder="e.g. openrouter" />
      <label for="k-url" class="mt-2 block">Base URL</label>
      <input id="k-url" v-model="f.base_url" class="border p-2 w-full" placeholder="https://openrouter.ai/api/v1" />
      <label for="k-key" class="mt-2 block">API key</label>
      <input id="k-key" v-model="f.api_key" type="password" class="border p-2 w-full" autocomplete="off" />
      <label for="k-model" class="mt-2 block">Model</label>
      <input id="k-model" v-model="f.model" class="border p-2 w-full" placeholder="e.g. anthropic/claude-3.5" />
      <div class="flex gap-2 mt-3">
        <button class="bg-black text-white px-4 py-2">Ping + save</button>
        <button type="button" @click="test" class="px-4 py-2 border">Test default</button>
      </div>
    </form>
    <p v-if="msg" class="text-sm mt-2">{{ msg }}</p>
    <ul class="text-sm mt-2">
      <li v-for="k in keys" :key="k.label">
        {{ k.label }} — {{ k.model }} {{ k.is_default ? '(default)' : '' }}
        <button @click="setDefault(k.label)" class="underline ml-2">default</button>
        <button @click="remove(k.label)" class="underline ml-2">delete</button>
      </li>
    </ul>
  </section>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'

type Key = { label: string; base_url: string; api_key: string; model: string; is_default: boolean }
const keys = ref<Key[]>(JSON.parse(localStorage.getItem('brewassist-keys') ?? '[]'))
const f = reactive({ label: '', base_url: '', api_key: '', model: '' })
const msg = ref('')

function persist() {
  localStorage.setItem('brewassist-keys', JSON.stringify(keys.value))
}

async function ping(k: Key): Promise<boolean> {
  const r = await fetch('/api/keys/ping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_url: k.base_url, api_key: k.api_key, model: k.model }),
  })
  return r.ok
}

async function add() {
  if (keys.value.length >= 3) {
    msg.value = 'Max 3 keys enforced'
    return
  }
  const k: Key = { ...f, is_default: keys.value.length === 0 }
  msg.value = 'Pinging…'
  if (!(await ping(k))) {
    msg.value = 'Invalid: ping failed, not saved'
    return
  }
  keys.value.push(k)
  persist()
  msg.value = `Saved ${k.label}`
}

async function test() {
  const d = keys.value.find((k) => k.is_default)
  if (!d) {
    msg.value = 'No default key'
    return
  }
  msg.value = (await ping(d)) ? 'Default OK' : 'Default ping failed'
}

function setDefault(label: string) {
  keys.value.forEach((k) => (k.is_default = k.label === label))
  persist()
}

function remove(label: string) {
  const k = keys.value.find((x) => x.label === label)
  if (k?.is_default && keys.value.length > 1) {
    msg.value = 'Set new default first'
    return
  }
  keys.value = keys.value.filter((x) => x.label !== label)
  persist()
}

function getDefaultKey(): Key | null {
  return keys.value.find((k) => k.is_default) ?? null
}
</script>
