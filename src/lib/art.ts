import { mount } from 'ascii.rest'
import { pickBoot } from './boots/index.ts'
import { play, sessionLength } from './boots/engine.ts'
import type { Size } from './boots/engine.ts'

export type { Size }

export type Console = { finish: (text: string) => void }

export const measure = (el: HTMLElement): Size => {
  const probe = document.createElement('span')
  probe.textContent = 'M'.repeat(100)
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  el.append(probe)
  const { width, height } = probe.getBoundingClientRect()
  probe.remove()
  return {
    cols: Math.max(2, Math.floor(el.clientWidth / (width / 100))),
    rows: Math.max(2, Math.floor(el.clientHeight / height)),
  }
}

export const watchSize = (el: HTMLElement, size: Size): void => {
  new ResizeObserver(() => Object.assign(size, measure(el))).observe(el)
}

export const runConsole = (el: HTMLElement, size: Size): Console => {
  const boot = pickBoot()
  const ctx = { host: (location.hostname || 'localhost').slice(0, 24), now: new Date() }
  let result: string | null = null
  const frame = play(boot, ctx, size, () => result)
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const still = 1e6
    const draw = () => {
      frame(still)
      el.textContent = frame(result === null ? still : still + sessionLength(boot, ctx) + 1)
    }
    draw()
    new ResizeObserver(draw).observe(el)
    return {
      finish: (text) => {
        result = text
        draw()
      },
    }
  }
  mount(el, {
    meta: {
      name: boot.name,
      category: 'ui',
      note: 'a machine boots and prints the visitor fingerprint',
      cols: size.cols,
      rows: size.rows,
      fps: 30,
    },
    default: () => frame,
  })
  return {
    finish: (text) => {
      result = text
    },
  }
}
