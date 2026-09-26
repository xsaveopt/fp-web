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

const mangled = [
  'title-bar-controls',
  'title-bar-text',
  'title-bar',
  'window-body',
  'window',
  'inactive',
  'loading',
  'error',
  'ready',
  'fp',
]

const nameOf = (cls: string): string => {
  const out = transform('.' + cls + '{}', 'probe.css')
  assert.ok(out)
  return out.slice(1, -2)
}

const selectorFor = (cls: string): RegExp =>
  new RegExp('\\.' + cls.replace(/[-]/g, '\\-') + '(?![\\w-])')

const cssPath = fileURLToPath(import.meta.resolve('98.css'))
const rawCss = readFileSync(cssPath, 'utf8')
const css98 = transform(rawCss, cssPath) ?? rawCss
const rawStyle = read(new URL('../src/style.css', import.meta.url).href)
const style = transform(rawStyle, '/src/style.css') ?? rawStyle
const rawApp = read(new URL('../src/App.vue', import.meta.url).href)
const app = transform(rawApp, '/src/App.vue') ?? rawApp

const staticClasses = (source: string): string[] =>
  [...source.matchAll(/(?<!:)class="([^"]*)"/g)].flatMap((m) => (m[1] as string).split(/\s+/))

describe('mangle plugin against the shipped 98.css', () => {
  it('resolves the 98.css import to a file the css branch picks up', () => {
    assert.ok(cssPath.endsWith('.css'), `98.css resolves to ${cssPath}`)
    assert.notEqual(css98, rawCss)
  })

  it('leaves no unmangled selector for a mangled class', () => {
    for (const cls of mangled) {
      assert.doesNotMatch(css98, selectorFor(cls), `98.css still styles .${cls}`)
      assert.doesNotMatch(style, selectorFor(cls), `style.css still styles .${cls}`)
    }
  })

  it('styles every window chrome class under its mangled name', () => {
    for (const cls of [
      'window',
      'title-bar',
      'title-bar-text',
      'title-bar-controls',
      'window-body',
    ]) {
      assert.match(css98, selectorFor(nameOf(cls)), `98.css lost the rule for .${cls}`)
    }
  })

  it('keeps compound selectors intact', () => {
    assert.ok(css98.includes(`.${nameOf('title-bar')}.${nameOf('inactive')}`))
    assert.ok(css98.includes(`.${nameOf('title-bar-controls')} button`))
    assert.ok(style.includes(`.${nameOf('fp')}.${nameOf('loading')}`))
    assert.ok(style.includes(`.${nameOf('fp')}.${nameOf('error')}`))
  })

  it('leaves the rest of 98.css byte for byte', () => {
    let restored = css98
    for (const cls of mangled) restored = restored.replaceAll('.' + nameOf(cls), '.' + cls)
    assert.equal(restored, rawCss)
  })
})

describe('mangle plugin keeps App.vue in step with the stylesheets', () => {
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
      const styled = selectorFor(cls).test(css98) || selectorFor(cls).test(style)
      assert.ok(styled, `App.vue renders class ${cls} that no stylesheet defines`)
    }
  })

  it('leaves no class App.vue renders that a stylesheet styles under its original name', () => {
    for (const cls of staticClasses(rawApp)) {
      if (mangled.includes(cls)) continue
      assert.doesNotMatch(rawCss, selectorFor(cls))
      assert.doesNotMatch(rawStyle, selectorFor(cls))
    }
  })

  it('renames the dynamic state and inactive classes to the stylesheet names', () => {
    assert.ok(app.includes(`{ ${nameOf('inactive')}: state !== '${nameOf('ready')}' }`))
    for (const state of ['loading', 'ready', 'error']) {
      assert.ok(app.includes(`'${nameOf(state)}'`), `App.vue lost state ${state}`)
      assert.ok(!app.includes(`'${state}'`), `App.vue still uses the literal ${state}`)
    }
  })
})
