import assert from 'node:assert/strict'
import { afterEach, describe, it, mock } from 'node:test'

import { computeFingerprint, installTraps } from '../src/lib/fingerprint.ts'

const installOn = (win: Record<string, unknown> = {}): Record<string, unknown> => {
  Reflect.defineProperty(globalThis, 'window', { value: win, configurable: true, writable: true })
  installTraps()
  return win
}

const flush = async (): Promise<void> => {
  for (let i = 0; i < 8; i += 1) await Promise.resolve()
}

const runClock = (ms: number): void => {
  for (let elapsed = 0; elapsed < ms; elapsed += 150) mock.timers.tick(150)
}

describe('installTraps', () => {
  it('installs a locked accessor for both globals', () => {
    const win = installOn()

    for (const key of ['Creep', 'Fingerprint']) {
      const descriptor = Object.getOwnPropertyDescriptor(win, key)
      assert.ok(descriptor, `${key} was not defined`)
      assert.equal(descriptor.configurable, false)
      assert.equal(descriptor.enumerable, false)
      assert.equal(typeof descriptor.get, 'function')
      assert.equal(typeof descriptor.set, 'function')
    }
  })

  it('hides the trapped globals from enumeration', () => {
    const win = installOn()

    assert.deepEqual(Object.keys(win), [])
    assert.equal(JSON.stringify(win), '{}')
  })

  it('reads back as undefined before anything is assigned', () => {
    const win = installOn()

    assert.equal(win.Creep, undefined)
    assert.equal(win.Fingerprint, undefined)
  })

  it('swallows a second install on the same window', () => {
    const win = installOn()

    assert.doesNotThrow(() => installOn(win))
  })
})

describe('computeFingerprint before a capture', () => {
  afterEach(() => {
    mock.timers.reset()
  })

  it('never resolves from a value assigned to window.Fingerprint', async () => {
    const win = installOn()
    win.Fingerprint = { spoofed: true }
    assert.equal(win.Fingerprint, undefined)

    mock.timers.enable({ apis: ['setTimeout', 'Date'] })
    const pending = computeFingerprint()
    const rejected = assert.rejects(pending, { message: 'timeout' })
    runClock(20_400)

    await rejected
  })

  it('rejects with a timeout once the deadline passes', async () => {
    installOn()

    mock.timers.enable({ apis: ['setTimeout', 'Date'] })
    const pending = computeFingerprint()

    let settled = false
    const rejected = assert.rejects(pending, { message: 'timeout' }).then(() => {
      settled = true
    })

    runClock(19_500)
    await flush()
    assert.equal(settled, false)

    runClock(1_200)
    await rejected
    assert.equal(settled, true)
  })
})
