import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { minify } from 'terser'
import JavaScriptObfuscator from 'javascript-obfuscator'

const creepSource = fileURLToPath(new URL('./creepjs/docs/creep.js', import.meta.url))
const ddtSource = fileURLToPath(
  new URL('./node_modules/disable-devtool/disable-devtool.min.js', import.meta.url),
)
const asset = 'm.js'

const ddtInit =
  "(function(){var D=DisableDevtool.DetectorType;DisableDevtool({url:'about:blank',disableMenu:true,clearLog:true,detectors:[D.RegToString,D.DefineId,D.Size,D.DateToString,D.FuncToString,D.Performance,D.DebugLib]});})();"

function antidebug(): Plugin {
  return {
    name: 'antidebug',
    transformIndexHtml() {
      return [
        { tag: 'script', children: readFileSync(ddtSource, 'utf8'), injectTo: 'head' },
        { tag: 'script', children: ddtInit, injectTo: 'head' },
      ]
    },
  }
}

const loadCreep = () =>
  readFileSync(creepSource, 'utf8')
    .replace("'./creep.js'", 'globalThis.__w')
    .replaceAll('fingerprint-data', 'd')

type HardenOpts = { heavy: boolean; debug: boolean; selfDefending: boolean; domainLock: string[] }

const obfuscate = (code: string, { heavy, debug, selfDefending, domainLock }: HardenOpts) =>
  JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    stringArray: true,
    stringArrayThreshold: 1,
    stringArrayEncoding: ['base64'],
    stringArrayRotate: true,
    stringArrayShuffle: true,
    splitStrings: true,
    splitStringsChunkLength: 8,
    numbersToExpressions: true,
    simplify: true,
    transformObjectKeys: false,
    controlFlowFlattening: heavy,
    controlFlowFlatteningThreshold: heavy ? 0.75 : 0,
    deadCodeInjection: heavy,
    deadCodeInjectionThreshold: heavy ? 0.4 : 0,
    debugProtection: debug,
    debugProtectionInterval: debug ? 4000 : 0,
    selfDefending,
    domainLock,
    domainLockRedirectUrl: 'about:blank',
    disableConsoleOutput: false,
    unicodeEscapeSequence: false,
  }).getObfuscatedCode()

const harden = async (code: string, opts: HardenOpts) => {
  const obfuscated = obfuscate(code, opts)
  if (opts.selfDefending) return obfuscated
  const { code: out } = await minify(obfuscated, {
    compress: opts.debug ? false : { passes: 2 },
    mangle: true,
    format: { comments: false },
  })
  return out ?? obfuscated
}

let creepBundle: Promise<string> | null = null
const buildCreep = () => {
  if (!creepBundle) {
    creepBundle = (async () => {
      const { code } = await minify(loadCreep(), {
        compress: { drop_console: true, drop_debugger: true, passes: 2 },
        mangle: true,
        format: { comments: false },
      })
      return harden(code ?? loadCreep(), {
        heavy: true,
        debug: false,
        selfDefending: false,
        domainLock: [],
      })
    })()
  }
  return creepBundle
}

function creepjs(): Plugin {
  return {
    name: 'creepjs',
    configureServer(server) {
      server.middlewares.use(`/${asset}`, (_req, res) => {
        res.setHeader('Content-Type', 'text/javascript')
        res.end(loadCreep())
      })
    },
    transformIndexHtml: {
      order: 'post',
      async handler(html, ctx) {
        if (ctx.server) return html
        const b64 = Buffer.from(await buildCreep(), 'utf8').toString('base64')
        return html.replace('</body>', `<script type="text/plain" id="m">${b64}</script></body>`)
      },
    },
    async generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk') {
          chunk.code = await harden(chunk.code, {
            heavy: true,
            debug: false,
            selfDefending: true,
            domainLock: [],
          })
        }
      }
    },
  }
}

const MANGLE_SEED = 'fp-web'
const MANGLE_CLASSES = [
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

const mangleName = (value: string) => {
  let h = 2166136261
  for (const ch of value + MANGLE_SEED) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return '_' + (h >>> 0).toString(36)
}

const classMap = new Map(MANGLE_CLASSES.map((c) => [c, mangleName(c)]))
const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const classSelectorRe = new RegExp(
  '\\.(' + MANGLE_CLASSES.map(escapeRe).join('|') + ')(?![\\w-])',
  'g',
)

function mangle(): Plugin {
  return {
    name: 'mangle-dom',
    enforce: 'pre',
    transform(code, id) {
      if (id.endsWith('.css')) {
        return code.replace(classSelectorRe, (_m, t: string) => '.' + classMap.get(t))
      }
      if (id.endsWith('.vue')) {
        return code
          .replace(
            /(?<!:)class="([^"]*)"/g,
            (_m, value: string) =>
              'class="' +
              value
                .split(/\s+/)
                .map((t) => classMap.get(t) ?? t)
                .join(' ') +
              '"',
          )
          .replace(
            /(\{\s*)inactive(\s*:)/g,
            (_m, a: string, b: string) => a + classMap.get('inactive') + b,
          )
          .replace(
            /(['"])(loading|ready|error)\1/g,
            (_m, q: string, t: string) => q + classMap.get(t) + q,
          )
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [mangle(), vue(), creepjs(), antidebug(), viteSingleFile()],
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true, passes: 3 },
      mangle: { toplevel: true },
      format: { comments: false },
    },
  },
})
