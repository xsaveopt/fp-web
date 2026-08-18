import { createApp } from 'vue'
import App from './App.vue'
import '98.css'
import './style.css'
import { installTraps } from './lib/fingerprint'
import { enforceDomain } from './lib/guard'

installTraps()
void enforceDomain()

const boot = async () => {
  let source: BlobPart
  if (import.meta.env.PROD) {
    const el = document.getElementById('m')
    const bin = atob((el?.textContent ?? '').trim())
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    source = bytes
    el?.remove()
  } else {
    const res = await fetch('/m.js')
    source = await res.text()
  }
  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }))
  ;(globalThis as unknown as { __w?: string }).__w = url
  const s = document.createElement('script')
  s.src = url
  document.head.append(s)
}

void boot()

createApp(App).mount('#app')
