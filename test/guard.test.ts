import assert from 'node:assert/strict'
import { afterEach, describe, it, mock } from 'node:test'

import { enforceDomain } from '../src/lib/guard.ts'

type Doc = { documentElement: { innerHTML: string } }

const markup = '<main>protected</main>'

const define = (name: string, value: unknown): void => {
  Reflect.defineProperty(globalThis, name, { value, configurable: true, writable: true })
}

const stubDom = (hostname: string): Doc => {
  const doc: Doc = { documentElement: { innerHTML: markup } }
  define('location', { hostname })
  define('document', doc)
  return doc
}

const stubFetch = (body: string, ok = true) =>
  mock.method(
    globalThis,
    'fetch',
    async () => ({ ok, text: async () => body }) as unknown as Response,
  )

const stubFailingFetch = (error: Error) =>
  mock.method(globalThis, 'fetch', async () => {
    throw error
  })

describe('enforceDomain', () => {
  afterEach(() => {
    mock.restoreAll()
  })

  it('skips the allowlist check on localhost', async () => {
    const doc = stubDom('localhost')
    const fetcher = stubFetch('example.com')

    await enforceDomain()

    assert.equal(fetcher.mock.callCount(), 0)
    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('skips the allowlist check on the loopback address', async () => {
    const doc = stubDom('127.0.0.1')
    const fetcher = stubFetch('example.com')

    await enforceDomain()

    assert.equal(fetcher.mock.callCount(), 0)
    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('asks for the allowlist without touching the cache', async () => {
    stubDom('example.com')
    const fetcher = stubFetch('example.com')

    await enforceDomain()

    assert.equal(fetcher.mock.callCount(), 1)
    assert.deepEqual(fetcher.mock.calls[0]?.arguments, ['/c', { cache: 'no-store' }])
  })

  it('keeps the page on an exact host match', async () => {
    const doc = stubDom('example.com')
    stubFetch('example.com')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('keeps the page on a subdomain of the allowed host', async () => {
    const doc = stubDom('app.example.com')
    stubFetch('example.com')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('keeps the page on a deep subdomain of the allowed host', async () => {
    const doc = stubDom('a.b.c.example.com')
    stubFetch('example.com')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('trims whitespace around the allowed host', async () => {
    const doc = stubDom('example.com')
    stubFetch('  example.com\n')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('wipes the page on an unrelated host', async () => {
    const doc = stubDom('evil.test')
    stubFetch('example.com')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, '')
  })

  it('wipes the page when the host only ends with the allowed name', async () => {
    const doc = stubDom('notexample.com')
    stubFetch('example.com')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, '')
  })

  it('wipes the page when the allowed name is a prefix of the host', async () => {
    const doc = stubDom('example.com.evil.test')
    stubFetch('example.com')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, '')
  })

  it('wipes the page when the allowed name is only a label inside the host', async () => {
    const doc = stubDom('evil.test.example.com.evil.test')
    stubFetch('example.com')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, '')
  })

  it('compares the host case sensitively', async () => {
    const doc = stubDom('EXAMPLE.COM')
    stubFetch('example.com')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, '')
  })

  it('keeps the page when the allowlist response is not ok', async () => {
    const doc = stubDom('evil.test')
    stubFetch('example.com', false)

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('keeps the page when the allowlist is empty', async () => {
    const doc = stubDom('evil.test')
    stubFetch('   \n')

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('keeps the page when the allowlist request fails', async () => {
    const doc = stubDom('evil.test')
    stubFailingFetch(new TypeError('network down'))

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('keeps the page when the allowlist body cannot be read', async () => {
    const doc = stubDom('evil.test')
    mock.method(
      globalThis,
      'fetch',
      async () =>
        ({
          ok: true,
          text: async () => {
            throw new Error('stream closed')
          },
        }) as unknown as Response,
    )

    await enforceDomain()

    assert.equal(doc.documentElement.innerHTML, markup)
  })

  it('resolves rather than throwing on a failed check', async () => {
    stubDom('evil.test')
    stubFailingFetch(new TypeError('network down'))

    assert.equal(await enforceDomain(), undefined)
  })
})
