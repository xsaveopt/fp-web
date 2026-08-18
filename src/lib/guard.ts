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
