import alpine from './alpine.ts'
import arch from './arch.ts'
import award from './award.ts'
import devuan from './devuan.ts'
import type { Boot } from './engine.ts'
import freebsd from './freebsd.ts'
import msdos from './msdos.ts'
import netbsd from './netbsd.ts'
import omnios from './omnios.ts'
import openbsd from './openbsd.ts'
import plan9 from './plan9.ts'
import runit from './void.ts'

export const boots: Boot[] = [
  openbsd,
  freebsd,
  netbsd,
  omnios,
  arch,
  devuan,
  alpine,
  runit,
  plan9,
  msdos,
  award,
]

export const pickBoot = (random: () => number = Math.random): Boot =>
  boots[Math.floor(random() * boots.length) % boots.length] as Boot
