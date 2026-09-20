import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { describe, it } from 'node:test'

import { computeFingerprint, installTraps } from '../src/lib/fingerprint.ts'

const sha256Hex = (value: unknown): string =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex')

const win: Record<string, unknown> = {}
Reflect.defineProperty(globalThis, 'window', { value: win, configurable: true, writable: true })
installTraps()

describe('computeFingerprint after a capture', () => {
  it('hashes the value assigned to window.Creep', async () => {
    const value = { fingerprint: 'abc', lies: 0, nested: [1, 2, 3] }
    win.Creep = value

    assert.equal(await computeFingerprint(), sha256Hex(value))
  })

  it('hides the captured value behind the getter', async () => {
    win.Creep = { secret: 'do not expose' }

    assert.equal(win.Creep, undefined)
    assert.match(await computeFingerprint(), /^[0-9a-f]{64}$/)
  })

  it('pads every digest byte to two hex characters', async () => {
    for (const value of [0, '', null, { a: 1 }, [1, 2], 'padding probe']) {
      win.Creep = value
      const hash = await computeFingerprint()

      assert.equal(hash.length, 64)
      assert.equal(hash, sha256Hex(value))
    }
  })

  it('hashes a later capture of the same shape to the same digest', async () => {
    win.Creep = { stable: true }
    const first = await computeFingerprint()
    win.Creep = { stable: true }

    assert.equal(await computeFingerprint(), first)
  })

  it('hashes null when called again without a fresh capture', async () => {
    win.Creep = { once: true }
    await computeFingerprint()

    assert.equal(await computeFingerprint(), sha256Hex(null))
  })
})
