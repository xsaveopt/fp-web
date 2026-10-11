<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { computeFingerprint } from './lib/fingerprint'
import { measure, runConsole, watchSize } from './lib/art'
import type { Size } from './lib/art'
import licenseText from '../creepjs/LICENSE?raw'

type State = 'loading' | 'ready' | 'error'

const state = ref<State>('loading')
const diag = ref('')
const screen = ref<HTMLElement | null>(null)
const art = ref<HTMLElement | null>(null)
const size = reactive<Size>({ cols: 80, rows: 25 })

const licenseUrl = URL.createObjectURL(new Blob([licenseText], { type: 'text/plain' }))

onMounted(async () => {
  if (screen.value) {
    Object.assign(size, measure(screen.value))
    watchSize(screen.value, size)
  }
  const terminal = art.value ? runConsole(art.value, size) : null
  try {
    terminal?.finish(await computeFingerprint())
    state.value = 'ready'
  } catch (e) {
    terminal?.finish('unavailable')
    state.value = 'error'
    if (import.meta.env.DEV) {
      const w = window as unknown as { Creep?: unknown; __w?: string }
      let probe = 'probe:skip'
      try {
        const r = await fetch('/m.js', { cache: 'no-store' })
        const body = await r.text()
        probe = `mjs ${r.status} ${r.headers.get('content-type')} len=${body.length} html=${body.trimStart().startsWith('<')}`
      } catch (pe) {
        probe = `probe:${pe instanceof Error ? pe.message : String(pe)}`
      }
      diag.value = [
        `err: ${e instanceof Error ? e.message : String(e)}`,
        `secureContext: ${window.isSecureContext}`,
        `subtle: ${typeof crypto?.subtle}`,
        `creep: ${typeof w.Creep}`,
        `__w: ${typeof w.__w}`,
        probe,
      ].join(' | ')
    }
  } finally {
    document.getElementById('d')?.remove()
  }
})
</script>

<template>
  <main ref="screen">
    <pre ref="art" class="fp" :class="state"></pre>
    <small v-if="diag" class="diag">{{ diag }}</small>
  </main>
  <footer hidden><a :href="licenseUrl">license</a></footer>
</template>
