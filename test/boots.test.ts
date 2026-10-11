import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { boots, pickBoot } from '../src/lib/boots/index.ts'
import { duration, fill, play, sessionLength, unixDate } from '../src/lib/boots/engine.ts'
import type { Boot } from '../src/lib/boots/engine.ts'

const now = new Date(2025, 10, 14, 0, 0, 0)
const ctx = { host: 'fp.example.org', now }
const size = { cols: 80, rows: 25 }

const byName = (name: string): Boot => boots.find((b) => b.name === name) as Boot

const screenAt = (boot: Boot, t: number, grid = size): string => play(boot, ctx, grid)(t)

describe('boot registry', () => {
  it('has every boot under a distinct name', () => {
    const names = boots.map((b) => b.name)
    assert.equal(new Set(names).size, names.length)
    assert.deepEqual(names.toSorted(), [
      'alpine',
      'arch',
      'award',
      'devuan',
      'freebsd',
      'msdos',
      'netbsd',
      'omnios',
      'openbsd',
      'plan9',
      'void',
    ])
  })

  it('picks each boot for its slice of the random range', () => {
    for (const [i, boot] of boots.entries()) {
      assert.equal(
        pickBoot(() => (i + 0.5) / boots.length),
        boot,
      )
    }
    assert.equal(
      pickBoot(() => 0.9999999),
      boots.at(-1),
    )
  })
})

describe('every boot', () => {
  for (const boot of boots) {
    describe(boot.name, () => {
      it('runs between three and nine seconds', () => {
        const d = duration(boot, ctx)
        assert.ok(d > 3 && d < 9, `${boot.name} takes ${d}s`)
      })

      it('fills the grid at every point of the boot', () => {
        for (const grid of [size, { cols: 40, rows: 12 }, { cols: 160, rows: 50 }]) {
          for (let t = 0; t <= duration(boot, ctx) + 0.5; t += 0.1) {
            const rows = screenAt(boot, t, grid).split('\n')
            assert.equal(rows.length, grid.rows)
            for (const row of rows) assert.equal(row.length, grid.cols)
          }
        }
      })

      it('leaves no placeholder unfilled', () => {
        const end = screenAt(boot, duration(boot, ctx), { cols: 200, rows: 400 })
        assert.doesNotMatch(end, /\{\{\w+\}\}/)
      })

      it('changes the screen as it goes', () => {
        assert.notEqual(screenAt(boot, 0.5), screenAt(boot, duration(boot, ctx) - 0.5))
      })
    })
  }
})

describe('boot details', () => {
  const full = { cols: 200, rows: 600 }
  const end = (name: string): string => screenAt(byName(name), 60, full)

  it('logs in with the page host on the unix boots', () => {
    assert.match(end('openbsd'), /OpenBSD\/amd64 \(fp\.example\.org\) \(ttyC0\)/)
    assert.match(end('freebsd'), /FreeBSD\/amd64 \(fp\.example\.org\) \(ttyu0\)/)
    assert.match(end('netbsd'), /NetBSD\/amd64 \(fp\.example\.org\) \(constty\)/)
    assert.match(end('omnios'), /fp\.example\.org console login: /)
    assert.match(end('arch'), /fp\.example\.org login: /)
    assert.match(end('devuan'), /Devuan GNU\/Linux excalibur fp\.example\.org tty1/)
    assert.match(end('alpine'), /Welcome to Alpine Linux 3\.24/)
    assert.match(end('void'), /fp\.example\.org login: /)
  })

  it('prints the visit time where the system prints the date', () => {
    for (const name of ['openbsd', 'freebsd', 'netbsd']) {
      assert.ok(end(name).includes(unixDate(now)), name)
    }
    assert.match(end('plan9'), /cirno Nov 14 00:00:00 starting dns resolver/)
  })

  it('counts the award memory test up in place', () => {
    const award = byName('award')
    const mid = screenAt(award, 1, full)
    assert.equal(mid.match(/Memory Test :/g)?.length, 1)
    assert.doesNotMatch(mid, /262144K OK/)
    assert.equal(end('award').match(/Memory Test :/g)?.length, 1)
    assert.match(end('award'), /Memory Test : {3}262144K OK/)
  })

  it('pins the award setup hint to the bottom rows', () => {
    const rows = screenAt(byName('award'), 2).split('\n')
    assert.match(rows.at(-2) as string, /^Press DEL to enter SETUP/)
    assert.match(rows.at(-1) as string, /^05\/02\/2002-ALADDIN5-<<P5A>>/)
  })

  it('ends dos at the prompt with the cursor on it', () => {
    const rows = screenAt(byName('msdos'), 60.1, full).trimEnd().split('\n')
    assert.equal(rows.at(-1), 'C:\\>_')
  })
})

describe('fill', () => {
  it('swaps every placeholder', () => {
    assert.equal(
      fill('{{host}} {{host}} {{syslog}}', ctx),
      'fp.example.org fp.example.org Nov 14 00:00:00',
    )
  })
})

const hash = 'c0ffee'.repeat(10) + 'beef'
const tall = { cols: 120, rows: 400 }
const finished = (boot: Boot, result: string | null = hash) => play(boot, ctx, tall, () => result)
const settled = (boot: Boot) => duration(boot, ctx) + sessionLength(boot, ctx) + 1
const done = (boot: Boot): string => {
  const frame = finished(boot)
  frame(0)
  return frame(settled(boot))
    .split('\n')
    .map((row) => row.trimEnd())
    .join('\n')
}

const prompt = (name: string): string => {
  const rows = done(byName(name)).split('\n')
  return (rows.find((row) => row.endsWith('fingerprint')) as string).replace(/fingerprint$/, '')
}

describe('fingerprint session', () => {
  it('waits at the end of the log until the fingerprint is known', () => {
    for (const boot of boots) {
      const frame = finished(boot, null)
      const at = duration(boot, ctx) + 30
      assert.ok(!frame(at).includes('login: guest'), boot.name)
      assert.ok(!frame(at).includes(hash), boot.name)
    }
  })

  it('prints the hash at the end of every log', () => {
    for (const boot of boots) {
      const text = done(boot)
      assert.ok(text.includes(hash), boot.name)
    }
  })

  it('logs in as guest and runs fingerprint on the unix boots', () => {
    for (const name of [
      'openbsd',
      'freebsd',
      'netbsd',
      'omnios',
      'arch',
      'devuan',
      'alpine',
      'void',
    ]) {
      const boot = byName(name)
      const rows = done(boot).trimEnd().split('\n')
      const at = rows.findIndex((row) => row.endsWith('login: guest'))
      assert.ok(at > 0, name)
      assert.match(rows[at + 1] as string, /^Password:/, name)
      assert.match(rows[at + 2] as string, /fingerprint$/, name)
      assert.ok((rows[at + 3] as string).startsWith(hash), name)
      assert.equal(
        rows.at(-1)?.replace(/_$/, '').trimEnd(),
        (rows[at + 2] as string).replace(/fingerprint$/, '').trimEnd(),
      )
    }
  })

  it('uses each system default prompt', () => {
    assert.equal(prompt('openbsd'), 'fp$ ')
    assert.equal(prompt('freebsd'), 'guest@fp:~ $ ')
    assert.equal(prompt('netbsd'), '$ ')
    assert.equal(prompt('arch'), '[guest@fp ~]$ ')
    assert.equal(prompt('devuan'), 'guest@fp:~$ ')
    assert.equal(prompt('alpine'), 'fp:~$ ')
    assert.equal(prompt('void'), '[guest@fp ~]$ ')
    assert.equal(prompt('plan9'), 'term% ')
  })

  it('runs FINGERPRINT at the dos prompt', () => {
    const rows = done(byName('msdos')).trimEnd().split('\n')
    const at = rows.indexOf('C:\\>FINGERPRINT')
    assert.ok(at > 0)
    assert.ok((rows[at + 1] as string).startsWith(hash))
  })

  it('prints the hash under the award post screen', () => {
    const rows = done(byName('award')).split('\n')
    const at = rows.findIndex((row) => row.startsWith('Trend ChipAwayVirus'))
    assert.ok((rows[at + 1] as string).startsWith(hash))
  })

  it('types the login one key at a time', () => {
    const boot = byName('openbsd')
    const frame = finished(boot)
    const end = duration(boot, ctx) - 0.7
    frame(end)
    const partial = frame(end + 0.5 + 0.07 * 3 + 0.01)
    assert.match(partial, /login: gue[_ ]?\s*$/)
  })

  it('starts the session when a late result arrives', () => {
    const boot = byName('netbsd')
    let result: string | null = null
    const frame = play(boot, ctx, tall, () => result)
    const late = duration(boot, ctx) + 20
    frame(late)
    result = hash
    frame(late + 1)
    assert.ok(!frame(late + 1).includes(hash))
    assert.ok(frame(late + sessionLength(boot, ctx) + 2).includes(hash))
  })
})
