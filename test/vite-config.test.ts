import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

import config from '../vite.config.ts'

type Hook<F> = F | { handler: F } | undefined
type Transform = (code: string, id: string) => string | null
type IndexHtml = (html: string, ctx: { server?: unknown }) => unknown
type Chunk = { type: 'chunk'; code: string }
type Asset = { type: 'asset'; source: string }
type GenerateBundle = (options: unknown, bundle: Record<string, Chunk | Asset>) => Promise<void>
type Middleware = (req: unknown, res: { setHeader: Setter; end: (body: string) => void }) => void
type Setter = (name: string, value: string) => void
type ConfigureServer = (server: {
  middlewares: { use: (path: string, fn: Middleware) => void }
}) => void
type Tag = { tag: string; children: string; injectTo: string }

const creepPath = fileURLToPath(new URL('../creepjs/docs/creep.js', import.meta.url))
const ddtPath = fileURLToPath(
  new URL('../node_modules/disable-devtool/disable-devtool.min.js', import.meta.url),
)

const plugin = (name: string): Plugin => {
  const found = (config.plugins ?? []).flat().find((p) => (p as Plugin | null)?.name === name)
  assert.ok(found, `plugin ${name} is not registered`)
  return found as Plugin
}

const unwrap = <F>(hook: Hook<F>): F => {
  assert.ok(hook)
  return typeof hook === 'object' && 'handler' in hook ? hook.handler : hook
}

const transform = unwrap(plugin('mangle-dom').transform as Hook<Transform>)

const referenceName = (value: string): string => {
  let h = 2166136261
  for (const ch of value + 'fp-web') {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return '_' + (h >>> 0).toString(36)
}

const mangled = (cls: string): string => {
  const out = transform('.' + cls + '{}', 'a.css')
  assert.ok(out)
  const match = /^\.(_[0-9a-z]+)\{\}$/.exec(out)
  assert.ok(match, `unexpected output ${out}`)
  return match[1] as string
}

const classes = [
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

describe('plugin order', () => {
  it('runs mangle first and the singlefile inliner after the custom plugins', () => {
    const names = (config.plugins ?? []).flat().map((p) => (p as Plugin).name)
    assert.equal(names[0], 'mangle-dom')
    assert.ok(names.indexOf('creepjs') < names.indexOf('vite:singlefile'))
    assert.ok(names.includes('antidebug'))
  })

  it('enforces the mangle plugin as pre', () => {
    assert.equal(plugin('mangle-dom').enforce, 'pre')
  })
})

describe('mangleName', () => {
  it('maps each class to the seeded FNV-1a base36 name', () => {
    for (const cls of classes) assert.equal(mangled(cls), referenceName(cls))
  })

  it('gives every class a distinct name', () => {
    assert.equal(new Set(classes.map(mangled)).size, classes.length)
  })

  it('is stable across calls', () => {
    assert.equal(mangled('window'), mangled('window'))
  })
})

describe('mangle transform on css', () => {
  it('renames whole class selectors only', () => {
    const out = transform(
      '.window .title-bar-text,.title-bar{} .windows{} .window-body{} .fp:hover{} .error-x{}',
      '/src/style.css',
    )
    assert.equal(
      out,
      `.${referenceName('window')} .${referenceName('title-bar-text')},.${referenceName('title-bar')}{} .windows{} .${referenceName('window-body')}{} .${referenceName('fp')}:hover{} .error-x{}`,
    )
  })

  it('leaves unknown classes and non-selector text alone', () => {
    const css = '.other{color:red} #window{} window{}'
    assert.equal(transform(css, '/src/x.css'), css)
  })
})

describe('mangle transform on vue', () => {
  it('rewrites static class attributes token by token', () => {
    const out = transform('<div class="title-bar  custom fp"></div>', '/src/App.vue')
    assert.equal(
      out,
      `<div class="${referenceName('title-bar')} custom ${referenceName('fp')}"></div>`,
    )
  })

  it('skips bound class attributes', () => {
    const src = '<p :class="fp"></p>'
    assert.equal(transform(src, '/src/App.vue'), src)
  })

  it('rewrites the inactive object key', () => {
    const out = transform(':class="{ inactive: state }"', '/src/App.vue')
    assert.equal(out, `:class="{ ${referenceName('inactive')}: state }"`)
  })

  it('rewrites quoted state literals with either quote style', () => {
    const out = transform(
      `const a = 'loading'; const b = "ready"; const c = 'error'; const d = 'loading"`,
      '/src/App.vue',
    )
    assert.equal(
      out,
      `const a = '${referenceName('loading')}'; const b = "${referenceName('ready')}"; const c = '${referenceName('error')}'; const d = 'loading"`,
    )
  })
})

describe('mangle transform on other files', () => {
  it('returns null for ts and html', () => {
    assert.equal(transform('.window', '/src/main.ts'), null)
    assert.equal(transform('<div class="window"></div>', '/index.html'), null)
  })
})

describe('creepjs plugin', () => {
  const creep = plugin('creepjs')

  it('serves the patched creep source from the dev middleware', () => {
    let path = ''
    let handler: Middleware | undefined
    unwrap(creep.configureServer as Hook<ConfigureServer>)({
      middlewares: {
        use: (p, fn) => {
          path = p
          handler = fn
        },
      },
    })
    assert.equal(path, '/m.js')
    assert.ok(handler)

    const headers: Record<string, string> = {}
    let body = ''
    handler(
      {},
      {
        setHeader: (name, value) => {
          headers[name] = value
        },
        end: (b) => {
          body = b
        },
      },
    )
    assert.equal(headers['Content-Type'], 'text/javascript')
    const raw = readFileSync(creepPath, 'utf8')
    assert.ok(raw.includes("'./creep.js'"))
    assert.equal(
      body,
      raw.replace("'./creep.js'", 'globalThis.__w').replaceAll('fingerprint-data', 'd'),
    )
    assert.ok(!body.includes('fingerprint-data'))
  })

  it('runs its index html hook after other transforms', () => {
    const hook = creep.transformIndexHtml as { order?: string }
    assert.equal(hook.order, 'post')
  })

  it('leaves the html untouched in dev', async () => {
    const html = '<html><body></body></html>'
    const out = await unwrap(creep.transformIndexHtml as Hook<IndexHtml>)(html, { server: {} })
    assert.equal(out, html)
  })

  it('hardens chunks and leaves assets alone', async () => {
    const source = 'export const answer = "plain-marker-value"; console.log(answer)'
    const bundle: Record<string, Chunk | Asset> = {
      'index.js': { type: 'chunk', code: source },
      'style.css': { type: 'asset', source: '.a{}' },
    }
    await unwrap(creep.generateBundle as Hook<GenerateBundle>)({}, bundle)
    const chunk = bundle['index.js'] as Chunk
    assert.notEqual(chunk.code, source)
    assert.ok(!chunk.code.includes('plain-marker-value'))
    assert.deepEqual(bundle['style.css'], { type: 'asset', source: '.a{}' })
  })

  it(
    'embeds the hardened creep bundle as base64 before the closing body tag',
    { timeout: 600_000 },
    async () => {
      const hook = unwrap(creep.transformIndexHtml as Hook<IndexHtml>)
      const out = (await hook('<html><body><p>x</p></body></html>', {})) as string
      const match =
        /^<html><body><p>x<\/p><script type="text\/plain" id="m">([A-Za-z0-9+/=]+)<\/script><\/body><\/html>$/.exec(
          out,
        )
      assert.ok(match, 'embed script missing')
      const decoded = Buffer.from(match[1] as string, 'base64').toString('utf8')
      assert.ok(decoded.length > 0)
      assert.ok(!decoded.includes('fingerprint-data'))
      assert.ok(!decoded.includes("'./creep.js'"))
      const again = (await hook('<body></body>', {})) as string
      assert.ok(again.includes(match[1] as string))
    },
  )
})

describe('antidebug plugin', () => {
  it('injects the disable-devtool library and an obfuscated init into head', async () => {
    const tags = (await unwrap(plugin('antidebug').transformIndexHtml as Hook<IndexHtml>)(
      '',
      {},
    )) as Tag[]
    assert.equal(tags.length, 2)
    const [lib, init] = tags as [Tag, Tag]
    assert.equal(lib.tag, 'script')
    assert.equal(lib.injectTo, 'head')
    assert.equal(lib.children, readFileSync(ddtPath, 'utf8'))
    assert.equal(init.tag, 'script')
    assert.equal(init.injectTo, 'head')
    assert.ok(init.children.length > 0)
    assert.ok(!init.children.includes('about:blank'))
    assert.ok(!init.children.includes('DetectorType'))
  })
})

describe('build options', () => {
  it('strips sourcemaps, console, debugger and comments', () => {
    const build = config.build ?? {}
    assert.equal(build.sourcemap, false)
    assert.equal(build.minify, 'terser')
    const terser = build.terserOptions as {
      compress: { drop_console: boolean; drop_debugger: boolean }
      mangle: { toplevel: boolean }
      format: { comments: boolean }
    }
    assert.equal(terser.compress.drop_console, true)
    assert.equal(terser.compress.drop_debugger, true)
    assert.equal(terser.mangle.toplevel, true)
    assert.equal(terser.format.comments, false)
  })
})
