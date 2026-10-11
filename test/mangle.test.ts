import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

import config from '../vite.config.ts'

type Transform = (code: string, id: string) => string | null

const read = (path: string): string => readFileSync(fileURLToPath(path), 'utf8')

const plugin = (config.plugins ?? [])
  .flat()
  .find((p) => (p as Plugin | null)?.name === 'mangle-dom') as Plugin | undefined
assert.ok(plugin, 'mangle-dom plugin is not registered')
const transform = plugin.transform as Transform

const mangled = ['loading', 'error', 'ready', 'diag', 'fp']

const nameOf = (cls: string): string => {
  const out = transform('.' + cls + '{}', 'probe.css')
  assert.ok(out)
  return out.slice(1, -2)
}

const selectorFor = (cls: string): RegExp =>
  new RegExp('\\.' + cls.replace(/[-]/g, '\\-') + '(?![\\w-])')

const rawStyle = read(new URL('../src/style.css', import.meta.url).href)
const style = transform(rawStyle, '/src/style.css') ?? rawStyle
const rawApp = read(new URL('../src/App.vue', import.meta.url).href)
const app = transform(rawApp, '/src/App.vue') ?? rawApp

const staticClasses = (source: string): string[] =>
  [...source.matchAll(/(?<!:)class="([^"]*)"/g)].flatMap((m) => (m[1] as string).split(/\s+/))

describe('mangle plugin against style.css', () => {
  it('leaves no unmangled selector for a mangled class', () => {
    for (const cls of mangled) {
      assert.doesNotMatch(style, selectorFor(cls), `style.css still styles .${cls}`)
    }
  })

  it('keeps compound selectors intact', () => {
    for (const state of ['loading', 'ready', 'error']) {
      assert.ok(style.includes(`.${nameOf('fp')}.${nameOf(state)}`), `lost .fp.${state}`)
    }
  })

  it('leaves the rest of style.css byte for byte', () => {
    let restored = style
    for (const cls of mangled) restored = restored.replaceAll('.' + nameOf(cls), '.' + cls)
    assert.equal(restored, rawStyle)
  })
})

describe('mangle plugin keeps App.vue in step with the stylesheet', () => {
  it('renames every static class App.vue uses', () => {
    const before = staticClasses(rawApp)
    const after = staticClasses(app)
    assert.equal(after.length, before.length)
    for (const [i, cls] of before.entries()) {
      assert.equal(after[i], mangled.includes(cls) ? nameOf(cls) : cls)
    }
  })

  it('points every class App.vue renders at a rule that exists', () => {
    for (const cls of staticClasses(app)) {
      assert.ok(selectorFor(cls).test(style), `App.vue renders class ${cls} that no rule defines`)
    }
  })

  it('renames the dynamic state classes to the stylesheet names', () => {
    for (const state of ['loading', 'ready', 'error']) {
      assert.ok(app.includes(`'${nameOf(state)}'`), `App.vue lost state ${state}`)
      assert.ok(!app.includes(`'${state}'`), `App.vue still uses the literal ${state}`)
    }
  })
})
