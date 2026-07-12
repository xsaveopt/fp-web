import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { minify } from 'terser'
import JavaScriptObfuscator from 'javascript-obfuscator'

const creepSource = fileURLToPath(new URL('./creepjs/docs/creep.js', import.meta.url))
const asset = 'm.js'

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
    disableConsoleOutput: true,
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

function creepjs(): Plugin {
  return {
    name: 'creepjs',
    configureServer(server) {
      server.middlewares.use(`/${asset}`, (_req, res) => {
        res.setHeader('Content-Type', 'text/javascript')
        res.end(loadCreep())
      })
    },
    async generateBundle(_options, bundle) {
      const { code } = await minify(loadCreep(), {
        compress: { drop_console: true, drop_debugger: true, passes: 2 },
        mangle: true,
        format: { comments: false },
      })
      this.emitFile({
        type: 'asset',
        fileName: asset,
        source: await harden(code ?? loadCreep(), {
          heavy: true,
          debug: false,
          selfDefending: false,
          domainLock: [],
        }),
      })

      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'chunk') {
          chunk.code = await harden(chunk.code, {
            heavy: true,
            debug: true,
            selfDefending: true,
            domainLock: [],
          })
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [vue(), creepjs(), viteSingleFile()],
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
