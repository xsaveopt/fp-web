import type { Frame } from 'ascii.rest'

export type Size = { cols: number; rows: number }

export type Ctx = { host: string; now: Date }

export type Section = {
  text: string
  step: number
  wait?: number
  replace?: boolean
}

export type Shell = { prompt: string; login?: boolean; command?: string; answer?: string }

export type Boot = {
  name: string
  sections: Section[]
  footer?: { at: number; text: string }
  shell?: Shell
}

type Action = { at: number; kind: 'type' | 'write' | 'newline'; text: string }

const USER = 'guest'
const TYPE = 0.07

type Line = { at: number; text: string; replace: boolean }

const HOLD = 0.7

const pad = (n: number, width = 2): string => String(n).padStart(width, '0')

const weekday = (now: Date): string => now.toLocaleDateString('en-US', { weekday: 'short' })

const month = (now: Date): string => now.toLocaleDateString('en-US', { month: 'short' })

const clock = (now: Date): string =>
  `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

const zone = (now: Date): string =>
  new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
    .formatToParts(now)
    .find((p) => p.type === 'timeZoneName')?.value ?? 'UTC'

export const unixDate = (now: Date): string =>
  `${weekday(now)} ${month(now)} ${String(now.getDate()).padStart(2)} ${clock(now)} ${zone(now)} ${now.getFullYear()}`

export const syslogStamp = (now: Date): string =>
  `${month(now)} ${String(now.getDate()).padStart(2)} ${clock(now)}`

export const fill = (text: string, ctx: Ctx): string =>
  text
    .replaceAll('{{user}}', USER)
    .replaceAll('{{short}}', ctx.host.split('.')[0] ?? ctx.host)
    .replaceAll('{{host}}', ctx.host)
    .replaceAll('{{date}}', unixDate(ctx.now))
    .replaceAll('{{syslog}}', syslogStamp(ctx.now))

const compile = (sections: Section[], ctx: Ctx): Line[] => {
  const out: Line[] = []
  let at = 0
  for (const section of sections) {
    at += section.wait ?? 0
    for (const text of section.text.split('\n')) {
      at += section.step
      out.push({ at, text: fill(text, ctx), replace: section.replace ?? false })
    }
  }
  return out
}

export const duration = (boot: Boot, ctx: Ctx): number =>
  (compile(boot.sections, ctx).at(-1)?.at ?? 0) + HOLD

const session = (boot: Boot, ctx: Ctx, result: string): Action[] => {
  const out: Action[] = []
  let at = 0
  const wait = (s: number) => {
    at += s
  }
  const type = (text: string) => {
    for (const ch of text) out.push({ at: (at += TYPE), kind: 'type', text: ch })
  }
  const write = (text: string) => out.push({ at, kind: 'write', text: fill(text, ctx) })
  const newline = () => out.push({ at, kind: 'newline', text: '' })
  const shell = boot.shell
  if (!shell) {
    wait(0.4)
    newline()
    write(result)
    return out
  }
  wait(0.5)
  if (shell.login) {
    type(USER)
    wait(0.25)
    newline()
    write('Password:')
    wait(0.9)
    newline()
    wait(0.6)
    write(shell.prompt)
    wait(0.5)
  } else if (shell.answer !== undefined) {
    type(shell.answer)
    wait(0.25)
    newline()
    wait(0.5)
    write(shell.prompt)
    wait(0.5)
  }
  type(shell.command ?? 'fingerprint')
  wait(0.25)
  newline()
  wait(0.4)
  write(result)
  newline()
  write(shell.prompt)
  return out
}

export const sessionLength = (boot: Boot, ctx: Ctx): number =>
  session(boot, ctx, '').at(-1)?.at ?? 0

const wrap = (text: string, width: number): string[] => {
  const line = text.replaceAll('\t', '        ')
  if (!line) return ['']
  const rows: string[] = []
  for (let i = 0; i < line.length; i += width) rows.push(line.slice(i, i + width))
  return rows
}

export const play = (
  boot: Boot,
  ctx: Ctx,
  size: Size,
  result: () => string | null = () => null,
): Frame => {
  const lines = compile(boot.sections, ctx)
  const end = lines.at(-1)?.at ?? 0
  const footer = boot.footer ? fill(boot.footer.text, ctx).split('\n') : []
  let start: number | null = null
  let actions: Action[] = []
  return (t) => {
    const { cols, rows } = size
    const shown: string[] = []
    for (const line of lines) {
      if (line.at > t) break
      if (line.replace && shown.length) shown[shown.length - 1] = line.text
      else shown.push(line.text)
    }
    const done = result()
    if (start === null && done !== null) {
      start = Math.max(t, end)
      actions = session(boot, ctx, done)
    }
    const typing = start !== null && t >= start
    if (typing) {
      for (const action of actions) {
        if ((start as number) + action.at > t) break
        if (action.kind === 'newline') shown.push('')
        else shown[shown.length - 1] = (shown.at(-1) ?? '') + action.text
      }
    }
    const cursor = t % 0.8 < 0.4 ? '_' : ' '
    const last = shown.length - 1
    const tail = shown[last] ?? ''
    if (typing || (last >= 0 && /[ >:]$/.test(tail))) shown[last] += cursor
    else shown.push(cursor)
    const pinned = boot.footer && t >= boot.footer.at ? footer.slice(0, rows) : []
    const room = Math.max(0, rows - pinned.length)
    const screen = room ? shown.flatMap((text) => wrap(text, cols)).slice(-room) : []
    while (screen.length < room) screen.push('')
    screen.push(...pinned)
    return screen.map((row) => row.padEnd(cols).slice(0, cols)).join('\n')
  }
}
