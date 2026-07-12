const wipe = () => {
  document.documentElement.innerHTML = ''
}

export async function enforceDomain(): Promise<void> {
  const host = location.hostname
  if (host === 'localhost' || host === '127.0.0.1') return
  try {
    const res = await fetch('/c', { cache: 'no-store' })
    if (!res.ok) return
    const allowed = (await res.text()).trim()
    if (allowed && host !== allowed && !host.endsWith('.' + allowed)) {
      wipe()
    }
  } catch {
    return
  }
}

export function installGuard(): void {
  const probe = new Function('debugger')
  let strikes = 0
  const check = () => {
    let open = false
    if (outerWidth - innerWidth > 220 || outerHeight - innerHeight > 220) open = true
    const start = performance.now()
    probe()
    if (performance.now() - start > 200) open = true
    strikes = open ? strikes + 1 : 0
    if (strikes >= 3) wipe()
  }
  setInterval(check, 2000)
}
