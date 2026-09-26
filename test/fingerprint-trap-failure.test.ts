import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { afterEach, describe, it, mock } from 'node:test'

import { computeFingerprint, installTraps } from '../src/lib/fingerprint.ts'

const sha256Hex = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex')

const useWindow = (win: Record<string, unknown>): Record<string, unknown> => {
  Reflect.defineProperty(globalThis, 'window', { value: win, configurable: true, writable: true })
  return win
}

const locked = (key: string, value: unknown): Record<string, unknown> => {
  const win: Record<string, unknown> = {}
  Object.defineProperty(win, key, { value, configurable: false, writable: true })
  return win
}

const runClock = (ms: number): void => {
  for (let elapsed = 0; elapsed < ms; elapsed += 150) mock.timers.tick(150)
}

describe('installTraps when a global is already locked', () => {
  afterEach(() => {
    mock.timers.reset()
  })

  it('does not throw when Creep cannot be trapped', () => {
    const win = useWindow(locked('Creep', undefined))

    assert.doesNotThrow(() => installTraps())
    assert.equal(Object.getOwnPropertyDescriptor(win, 'Creep')?.get, undefined)
  })

  it('does not throw when both globals cannot be trapped', () => {
    const win = useWindow(locked('Creep', undefined))
    Object.defineProperty(win, 'Fingerprint', { value: undefined, configurable: false })

    assert.doesNotThrow(() => installTraps())
  })

  it('never resolves from a Creep global it could not trap', async () => {
    const win = useWindow(locked('Creep', { planted: true }))
    installTraps()
    win.Creep = { spoofed: true }

    mock.timers.enable({ apis: ['setTimeout', 'Date'] })
    const rejected = assert.rejects(computeFingerprint(), { message: 'timeout' })
    runClock(20_400)

    await rejected
  })

  it('still traps Creep when only Fingerprint is locked', async () => {
    const win = useWindow(locked('Fingerprint', undefined))
    installTraps()

    const descriptor = Object.getOwnPropertyDescriptor(win, 'Creep')
    assert.equal(typeof descriptor?.set, 'function')
    assert.equal(descriptor?.configurable, false)

    const value = { captured: 'after a partial install' }
    win.Creep = value
    assert.equal(win.Creep, undefined)
    assert.equal(await computeFingerprint(), sha256Hex(value))
  })
})
