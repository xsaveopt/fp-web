import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { installTraps } from './lib/fingerprint'
import { installGuard, enforceDomain } from './lib/guard'

installTraps()
installGuard()
void enforceDomain()

const boot = async () => {
  const res = await fetch('/m.js')
  const url = URL.createObjectURL(new Blob([await res.text()], { type: 'text/javascript' }))
  ;(globalThis as unknown as { __w?: string }).__w = url
  const s = document.createElement('script')
  s.src = url
  document.head.append(s)
}

void boot()

createApp(App).mount('#app')
