let captured: unknown
let ready = false

export function installTraps(): void {
  for (const key of ['Creep', 'Fingerprint'] as const) {
    try {
      Object.defineProperty(window, key, {
        configurable: false,
        enumerable: false,
        set(value: unknown) {
          if (key === 'Creep') {
            captured = value
            ready = true
          }
        },
        get() {
          return undefined
        },
      })
    } catch {
      ready = false
    }
  }
}

const hashify = async (value: unknown): Promise<string> => {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const waitForCapture = (timeoutMs = 20_000, intervalMs = 150): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      if (ready) return resolve(captured)
      if (Date.now() - start > timeoutMs) return reject(new Error('timeout'))
      setTimeout(tick, intervalMs)
    }
    tick()
  })

export const computeFingerprint = async (): Promise<string> => {
  const data = await waitForCapture()
  const hash = await hashify(data)
  captured = null
  return hash
}
