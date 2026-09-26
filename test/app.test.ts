import assert from 'node:assert/strict'
import { afterEach, before, describe, it, mock } from 'node:test'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { build, type Plugin, type Rolldown } from 'vite'
import type { Component, createRenderer as CreateRenderer, nextTick as NextTick } from 'vue'

type Node = {
  tag: string
  text: string
  props: Record<string, unknown>
  children: Node[]
  parent: Node | null
}

type Harness = {
  App: Component
  createRenderer: typeof CreateRenderer
  nextTick: typeof NextTick
}

type Pending = { resolve: (hash: string) => void; reject: (err: unknown) => void }

const appPath = fileURLToPath(new URL('../src/App.vue', import.meta.url))
const root = fileURLToPath(new URL('..', import.meta.url))
const entryId = '\0app-entry'
const fingerprintId = '\0fingerprint-stub'

let pending: Pending | null = null

const stubs = (): Plugin => ({
  name: 'app-test-stubs',
  enforce: 'pre',
  resolveId(source, importer) {
    if (source === 'app-entry') return entryId
    if (source === './lib/fingerprint' && importer?.startsWith(appPath)) return fingerprintId
    return null
  },
  load(id) {
    if (id === entryId) {
      return `export { default as App } from ${JSON.stringify(appPath)}\nexport { createRenderer, nextTick } from 'vue'`
    }
    if (id === fingerprintId) {
      return 'export const computeFingerprint = () => globalThis.__appTestFingerprint()'
    }
    return null
  },
})

const compile = async (mode: 'development' | 'production'): Promise<Harness> => {
  const previous = process.env.NODE_ENV
  process.env.NODE_ENV = mode
  try {
    const result = await build({
      configFile: false,
      root,
      mode,
      logLevel: 'silent',
      plugins: [stubs(), vue({ template: { compilerOptions: { hoistStatic: false } } })],
      build: {
        write: false,
        minify: false,
        modulePreload: false,
        rolldownOptions: {
          input: 'app-entry',
          preserveEntrySignatures: 'strict',
          output: { format: 'es' },
        },
      },
    })
    const outputs = (Array.isArray(result) ? result : [result]) as Rolldown.RolldownOutput[]
    const chunk = outputs.flatMap((o) => o.output).find((o) => o.type === 'chunk' && o.isEntry)
    assert.ok(chunk && chunk.type === 'chunk', 'no entry chunk was emitted')
    const url = 'data:text/javascript;base64,' + Buffer.from(chunk.code).toString('base64')
    return (await import(url)) as Harness
  } finally {
    process.env.NODE_ENV = previous
  }
}

const element = (tag: string): Node => ({ tag, text: '', props: {}, children: [], parent: null })

const detach = (child: Node): void => {
  const parent = child.parent
  if (!parent) return
  parent.children.splice(parent.children.indexOf(child), 1)
  child.parent = null
}

const textOf = (node: Node): string =>
  node.tag === '#text' ? node.text : node.children.map((c) => textOf(c)).join('')

const find = (node: Node, match: (n: Node) => boolean): Node | undefined => {
  if (match(node)) return node
  for (const child of node.children) {
    const hit = find(child, match)
    if (hit) return hit
  }
  return undefined
}

const classesOf = (node: Node | undefined): string[] => {
  assert.ok(node, 'element not rendered')
  return String(node.props.class ?? '')
    .split(/\s+/)
    .filter(Boolean)
}

const byClass = (tree: Node, cls: string): Node | undefined =>
  find(tree, (n) => classesOf(n).includes(cls))

const settle = async (): Promise<void> => {
  for (let i = 0; i < 10; i += 1) await new Promise((resolve) => setImmediate(resolve))
}

type Page = { tree: Node; placeholder: { removed: number } }

const mount = async (harness: Harness): Promise<Page> => {
  const placeholder = { removed: 0 }
  Reflect.defineProperty(globalThis, 'document', {
    value: {
      getElementById: (id: string) =>
        id === 'd'
          ? {
              remove: () => {
                placeholder.removed += 1
              },
            }
          : null,
    },
    configurable: true,
    writable: true,
  })
  Reflect.defineProperty(globalThis, 'window', {
    value: { isSecureContext: true },
    configurable: true,
    writable: true,
  })

  const renderer = harness.createRenderer<Node, Node>({
    createElement: (tag) => element(tag),
    createText: (text) => ({ ...element('#text'), text }),
    createComment: (text) => ({ ...element('#comment'), text }),
    setText: (node, text) => {
      node.text = text
    },
    setElementText: (node, text) => {
      for (const child of node.children.splice(0)) child.parent = null
      if (text) {
        const child = { ...element('#text'), text, parent: node }
        node.children.push(child)
      }
    },
    insert: (child, parent, anchor) => {
      detach(child)
      child.parent = parent
      const at = anchor ? parent.children.indexOf(anchor) : -1
      if (at === -1) parent.children.push(child)
      else parent.children.splice(at, 0, child)
    },
    remove: (child) => detach(child),
    parentNode: (node) => node.parent,
    nextSibling: (node) => {
      const siblings = node.parent?.children ?? []
      return siblings[siblings.indexOf(node) + 1] ?? null
    },
    patchProp: (node, key, _prev, next) => {
      if (next === null || next === undefined) delete node.props[key]
      else node.props[key] = next
    },
  })

  const tree = element('#root')
  renderer.createApp(harness.App).mount(tree)
  await harness.nextTick()
  return { tree, placeholder }
}

const fp = (tree: Node): Node | undefined => byClass(tree, 'fp')

const titleBar = (tree: Node): Node | undefined => byClass(tree, 'title-bar')

const answer = (settleWith: (p: Pending) => void): void => {
  assert.ok(pending, 'computeFingerprint was not called')
  settleWith(pending)
}

const install = (): void => {
  pending = null
  Reflect.defineProperty(globalThis, '__appTestFingerprint', {
    value: () =>
      new Promise<string>((resolve, reject) => {
        pending = { resolve, reject }
      }),
    configurable: true,
    writable: true,
  })
}

afterEach(() => {
  mock.restoreAll()
  pending = null
})

describe('App in production mode', () => {
  let harness: Harness

  before(async () => {
    harness = await compile('production')
  })

  it('shows the loading state while the fingerprint is computed', async () => {
    install()
    const { tree, placeholder } = await mount(harness)

    assert.equal(textOf(fp(tree) as Node), 'computing…')
    assert.ok(classesOf(fp(tree)).includes('loading'))
    assert.ok(classesOf(titleBar(tree)).includes('inactive'))
    assert.equal(placeholder.removed, 0)
    assert.ok(pending, 'computeFingerprint was not called on mount')
  })

  it('shows the hash once the fingerprint resolves', async () => {
    install()
    const { tree, placeholder } = await mount(harness)

    answer((p) => p.resolve('a'.repeat(64)))
    await settle()

    assert.equal(textOf(fp(tree) as Node), 'a'.repeat(64))
    assert.deepEqual(classesOf(fp(tree)), ['fp', 'ready'])
    assert.ok(!classesOf(titleBar(tree)).includes('inactive'))
    assert.equal(placeholder.removed, 1)
  })

  it('shows unavailable without diagnostics when the fingerprint fails', async () => {
    install()
    const fetchMock = mock.method(globalThis, 'fetch', async () => new Response(''))
    const { tree, placeholder } = await mount(harness)

    answer((p) => p.reject(new Error('timeout')))
    await settle()

    assert.equal(textOf(fp(tree) as Node), 'unavailable')
    assert.deepEqual(classesOf(fp(tree)), ['fp', 'error'])
    assert.ok(classesOf(titleBar(tree)).includes('inactive'))
    assert.equal(fetchMock.mock.callCount(), 0)
    assert.equal(placeholder.removed, 1)
  })

  it('links the bundled license as a blob url in a hidden footer', async () => {
    install()
    const { tree } = await mount(harness)

    const footer = find(tree, (n) => n.tag === 'footer')
    assert.ok(footer)
    assert.ok('hidden' in footer.props)
    const link = find(footer, (n) => n.tag === 'a')
    assert.ok(link)
    assert.match(String(link.props.href), /^blob:/)
    assert.equal(textOf(link), 'license')
  })
})

describe('App in development mode', () => {
  let harness: Harness

  before(async () => {
    harness = await compile('development')
  })

  it('reports diagnostics with the probe result when the fingerprint fails', async () => {
    install()
    const fetchMock = mock.method(
      globalThis,
      'fetch',
      async () =>
        new Response('  <html></html>', { status: 404, headers: { 'content-type': 'text/html' } }),
    )
    const { tree, placeholder } = await mount(harness)

    answer((p) => p.reject(new Error('timeout')))
    await settle()

    const text = textOf(fp(tree) as Node)
    assert.ok(text.startsWith('unavailable'))
    assert.equal(
      text.slice('unavailable'.length),
      [
        'err: timeout',
        'secureContext: true',
        'subtle: object',
        'creep: undefined',
        '__w: undefined',
        'mjs 404 text/html len=15 html=true',
      ].join(' | '),
    )
    assert.equal(fetchMock.mock.callCount(), 1)
    assert.deepEqual(fetchMock.mock.calls[0]?.arguments, ['/m.js', { cache: 'no-store' }])
    assert.equal(placeholder.removed, 1)
  })

  it('reports a failed probe and non-error rejections', async () => {
    install()
    mock.method(globalThis, 'fetch', async () => {
      throw new Error('offline')
    })
    const { tree, placeholder } = await mount(harness)

    answer((p) => p.reject('boom'))
    await settle()

    const text = textOf(fp(tree) as Node)
    assert.match(text, /^unavailableerr: boom \| /)
    assert.match(text, / \| probe:offline$/)
    assert.equal(placeholder.removed, 1)
  })

  it('keeps the ready state free of diagnostics', async () => {
    install()
    const fetchMock = mock.method(globalThis, 'fetch', async () => new Response(''))
    const { tree } = await mount(harness)

    answer((p) => p.resolve('b'.repeat(64)))
    await settle()

    assert.equal(textOf(fp(tree) as Node), 'b'.repeat(64))
    assert.equal(fetchMock.mock.callCount(), 0)
  })
})
