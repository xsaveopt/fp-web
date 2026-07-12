<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { computeFingerprint } from './lib/fingerprint'
import licenseText from '../creepjs/LICENSE?raw'

type State = 'loading' | 'ready' | 'error'

const state = ref<State>('loading')
const hash = ref('')

const licenseUrl = URL.createObjectURL(new Blob([licenseText], { type: 'text/plain' }))

onMounted(async () => {
  try {
    hash.value = await computeFingerprint()
    state.value = 'ready'
  } catch {
    state.value = 'error'
  } finally {
    document.getElementById('d')?.remove()
  }
})
</script>

<template>
  <main>
    <p class="fp" :class="state">
      <template v-if="state === 'ready'">{{ hash }}</template>
      <template v-else-if="state === 'error'">unavailable</template>
      <template v-else>…</template>
    </p>
  </main>
  <footer hidden><a :href="licenseUrl">license</a></footer>
</template>
