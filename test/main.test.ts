import assert from 'node:assert/strict'
import { afterEach, before, describe, it, mock } from 'node:test'
import { fileURLToPath } from 'node:url'
import { build, type Plugin, type Rolldown } from 'vite'

type Script = { tag: string; src: string }
type Marker = { textContent: string | null; removed: number }
type Recorder = { events: string[] }

const root = fileURLToPath(new URL('..', import.meta.url))
const mainPath = fileURLToPath(new URL('../src/main.ts', import.meta.url))
const prefix = '\0main-stub:'

const stubSources: Record<string, string> = {
  vue: `export const createApp = (app) => { globalThis.__mainTest.events.push('createApp:' + app.name); return { mount: (sel) => { globalThis.__mainTest.events.push('mount:' + sel) } } }`,
  app: `export default { name: 'App' }`,
  css: `export default ''`,
  fingerprint: `export const installTraps = () => { globalThis.__mainTest.events.push('installTraps') }`,
  guard: `export const enforceDomain = async () => { globalThis.__mainTest.events.push('enforceDomain') }`,
}

const stubFor = (source: string): string | null => {
  if (source === 'vue') return 'vue'
  if (source === './App.vue') return 'app'
  if (source === '98.css' || source === './style.css') return 'css'
  if (source === './lib/fingerprint') return 'fingerprint'
  if (source === './lib/guard') return 'guard'
  return null
}

const stubs = (): Plugin => ({
  name: 'main-test-stubs',
  enforce: 'pre',
  resolveId(source, importer) {
    if (importer !== mainPath) return null
    const stub = stubFor(source)
    return stub ? prefix + stub : null
  },
  load(id) {
    return id.startsWith(prefix) ? (stubSources[id.slice(prefix.length)] ?? null) : null
  },
})

const compile = async (mode: 'development' | 'production'): Promise<string> => {
  const previous = process.env.NODE_ENV
  process.env.NODE_ENV = mode
  try {
    const result = await build({
      configFile: false,
      root,
      mode,
      logLevel: 'silent',
      plugins: [stubs()],
      build: {
        write: false,
        minify: false,
        modulePreload: false,
        rolldownOptions: {
          input: mainPath,
          output: { format: 'es' },
        },
      },
    })
    const outputs = (Array.isArray(result) ? result : [result]) as Rolldown.RolldownOutput[]
    const chunk = outputs.flatMap((o) => o.output).find((o) => o.type === 'chunk' && o.isEntry)
    assert.ok(chunk && chunk.type === 'chunk', 'no entry chunk was emitted')
    return chunk.code
  } finally {
    process.env.NODE_ENV = previous
  }
}

const define = (name: string, value: unknown): void => {
  Reflect.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}

let runs = 0

const settle = async (): Promise<void> => {
  for (let i = 0; i < 10; i += 1) await new Promise((resolve) => setImmediate(resolve))
}

type Page = { recorder: Recorder; head: Script[]; marker: Marker; blobs: Blob[]; lookups: string[] }

const boot = async (code: string, payload: string | null): Promise<Page> => {
  const recorder: Recorder = { events: [] }
  const head: Script[] = []
  const lookups: string[] = []
  const marker: Marker = { textContent: payload, removed: 0 }
  const blobs: Blob[] = []

  define('__mainTest', recorder)
  define('__w', undefined)
  define('document', {
    getElementById: (id: string) => {
      lookups.push(id)
      if (id !== 'm' || payload === null) return null
      return {
        get textContent() {
          return marker.textContent
        },
        remove: () => {
          marker.removed += 1
          recorder.events.push('remove:m')
        },
      }
    },
    createElement: (tag: string): Script => ({ tag, src: '' }),
    head: {
      append: (el: Script) => {
        recorder.events.push('append:' + el.tag)
        head.push({ ...el })
      },
    },
  })
  mock.method(URL, 'createObjectURL', (blob: Blob) => {
    blobs.push(blob)
    recorder.events.push('createObjectURL')
    return `blob:fp-web/${blobs.length}`
  })

  runs += 1
  const url =
    'data:text/javascript;base64,' + Buffer.from(`${code}\n;void ${runs}`).toString('base64')
  await import(url)
  await settle()
  return { recorder, head, marker, blobs, lookups }
}

afterEach(() => {
  mock.restoreAll()
})

const creepSource = 'window.Creep = { ok: "ünïcødé ✓" }'

describe('main in production mode', () => {
  let code: string

  before(async () => {
    code = await compile('production')
  })

  it('installs the traps before the domain check and mounts the app on #app', async () => {
    const { recorder } = await boot(code, Buffer.from(creepSource).toString('base64'))

    assert.deepEqual(recorder.events.slice(0, 2), ['installTraps', 'enforceDomain'])
    assert.ok(recorder.events.includes('createApp:App'))
    assert.ok(recorder.events.includes('mount:#app'))
    assert.ok(recorder.events.indexOf('createApp:App') < recorder.events.indexOf('mount:#app'))
  })

  it('decodes the embedded payload into the exact script bytes', async () => {
    const fetcher = mock.method(globalThis, 'fetch', async () => new Response(''))
    const { blobs, lookups } = await boot(code, Buffer.from(creepSource).toString('base64'))

    assert.equal(fetcher.mock.callCount(), 0)
    assert.ok(lookups.includes('m'))
    assert.equal(blobs.length, 1)
    const blob = blobs[0] as Blob
    assert.equal(blob.type, 'text/javascript')
    assert.deepEqual(Buffer.from(await blob.arrayBuffer()), Buffer.from(creepSource))
  })

  it('ignores whitespace around the embedded payload', async () => {
    const { blobs } = await boot(code, `\n  ${Buffer.from(creepSource).toString('base64')}\n`)

    assert.equal(blobs.length, 1)
    assert.equal(await (blobs[0] as Blob).text(), creepSource)
  })

  it('removes the payload element once it is decoded', async () => {
    const { marker, recorder } = await boot(code, Buffer.from(creepSource).toString('base64'))

    assert.equal(marker.removed, 1)
    assert.ok(recorder.events.indexOf('remove:m') < recorder.events.indexOf('append:script'))
  })

  it('publishes the blob url on __w before appending the script that uses it', async () => {
    const { head, recorder } = await boot(code, Buffer.from(creepSource).toString('base64'))

    assert.equal((globalThis as { __w?: unknown }).__w, 'blob:fp-web/1')
    assert.deepEqual(head, [{ tag: 'script', src: 'blob:fp-web/1' }])
    assert.ok(recorder.events.indexOf('createObjectURL') < recorder.events.indexOf('append:script'))
  })
})

describe('main in development mode', () => {
  let code: string

  before(async () => {
    code = await compile('development')
  })

  it('fetches the creep source from the dev server instead of the embedded payload', async () => {
    const fetcher = mock.method(globalThis, 'fetch', async () => new Response(creepSource))
    const { blobs, head, lookups, marker } = await boot(code, 'bm90IHVzZWQ=')

    assert.equal(fetcher.mock.callCount(), 1)
    assert.deepEqual(fetcher.mock.calls[0]?.arguments, ['/m.js'])
    assert.ok(!lookups.includes('m'))
    assert.equal(marker.removed, 0)
    assert.equal(blobs.length, 1)
    assert.equal((blobs[0] as Blob).type, 'text/javascript')
    assert.equal(await (blobs[0] as Blob).text(), creepSource)
    assert.equal((globalThis as { __w?: unknown }).__w, 'blob:fp-web/1')
    assert.deepEqual(head, [{ tag: 'script', src: 'blob:fp-web/1' }])
  })

  it('still installs the traps and mounts the app', async () => {
    mock.method(globalThis, 'fetch', async () => new Response(creepSource))
    const { recorder } = await boot(code, null)

    assert.deepEqual(recorder.events.slice(0, 2), ['installTraps', 'enforceDomain'])
    assert.ok(recorder.events.includes('mount:#app'))
  })
})
