<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { computeFingerprint } from './lib/fingerprint'
import licenseText from '../creepjs/LICENSE?raw'

type State = 'loading' | 'ready' | 'error'

const state = ref<State>('loading')
const hash = ref('')
const diag = ref('')

const licenseUrl = URL.createObjectURL(new Blob([licenseText], { type: 'text/plain' }))

onMounted(async () => {
  try {
    hash.value = await computeFingerprint()
    state.value = 'ready'
  } catch (e) {
    state.value = 'error'
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
  } finally {
    document.getElementById('d')?.remove()
  }
})
</script>

<template>
  <main>
    <div class="window">
      <div class="title-bar" :class="{ inactive: state !== 'ready' }">
        <div class="title-bar-text">fingerprint.exe</div>
        <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div class="window-body">
        <p class="fp" :class="state">
          <template v-if="state === 'ready'">{{ hash }}</template>
          <template v-else-if="state === 'error'"
            >unavailable<br /><small>{{ diag }}</small></template
          >
          <template v-else>computing…</template>
        </p>
      </div>
    </div>
  </main>
  <footer hidden><a :href="licenseUrl">license</a></footer>
</template>
