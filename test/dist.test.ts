import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { Script } from 'node:vm'

const distPath = fileURLToPath(new URL('../dist/index.html', import.meta.url))
const creepPath = fileURLToPath(new URL('../creepjs/docs/creep.js', import.meta.url))
const built = existsSync(distPath)

const mangleName = (value: string): string => {
  let h = 2166136261
  for (const ch of value + 'fp-web') {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return '_' + (h >>> 0).toString(36)
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

const html = built ? readFileSync(distPath, 'utf8') : ''
const payloadRe = /<script type="text\/plain" id="m">([A-Za-z0-9+/=]+)<\/script>\s*<\/body>/

describe('built dist/index.html', { skip: built ? false : 'run pnpm build first' }, () => {
  it('is a single self contained file', () => {
    assert.doesNotMatch(html, /<script[^>]*\ssrc=/)
    assert.doesNotMatch(html, /<link[^>]*rel="?(stylesheet|modulepreload)/)
    assert.doesNotMatch(html, /sourceMappingURL/)
  })

  it('keeps the mount point and the creep data element', () => {
    assert.match(html, /<div id="app"><\/div>/)
    assert.match(html, /<div id="d" hidden><\/div>/)
  })

  it('embeds the creep payload as the last element of the body', () => {
    assert.match(html, payloadRe)
    assert.equal(html.match(/id="m"/g)?.length, 1)
  })

  it('embeds a payload that compiles as a classic script', () => {
    const b64 = payloadRe.exec(html)?.[1] as string
    const code = Buffer.from(b64, 'base64').toString('utf8')
    assert.ok(code.length > 10_000)
    assert.doesNotThrow(() => new Script(code, { filename: 'm.js' }))
  })

  it('carries the loadCreep rewrite into the payload', () => {
    const b64 = payloadRe.exec(html)?.[1] as string
    const code = Buffer.from(b64, 'base64').toString('utf8')
    assert.ok(!code.includes('fingerprint-data'))
    assert.ok(!code.includes('./creep.js'))
  })

  it('ships the page script as an inline module', () => {
    const modules = html.match(/<script type="module"[^>]*>/g) ?? []
    assert.equal(modules.length, 1)
    assert.ok(!html.includes('/src/main.ts'))
  })

  it('injects the antidebug scripts into the head', () => {
    const head = html.slice(0, html.indexOf('</head>'))
    assert.ok(head.includes('DisableDevtool'))
    assert.ok(!head.includes('about:blank'))
  })

  it('inlines the stylesheet with mangled class names only', () => {
    const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('')
    assert.ok(styles.length > 0, 'no inline stylesheet')
    for (const cls of classes) {
      const original = new RegExp('\\.' + cls.replace(/-/g, '\\-') + '(?![\\w-])')
      assert.doesNotMatch(styles, original, `.${cls} survived the build`)
    }
    for (const cls of [
      'window',
      'title-bar',
      'title-bar-text',
      'title-bar-controls',
      'window-body',
      'inactive',
      'fp',
      'loading',
      'error',
    ]) {
      assert.ok(styles.includes('.' + mangleName(cls)), `.${cls} has no mangled rule`)
    }
  })
})

describe(
  'creep source the build rewrites',
  { skip: existsSync(creepPath) ? false : 'creepjs is not built' },
  () => {
    const raw = existsSync(creepPath) ? readFileSync(creepPath, 'utf8') : ''

    it('references its own script path exactly once so a single replace covers it', () => {
      assert.equal(raw.split("'./creep.js'").length - 1, 1)
      assert.equal(raw.split('"./creep.js"').length - 1, 0)
      assert.equal(raw.split('`./creep.js`').length - 1, 0)
    })

    it('still reads the fingerprint-data element the rewrite renames to #d', () => {
      assert.ok(raw.includes('fingerprint-data'))
    })
  },
)
