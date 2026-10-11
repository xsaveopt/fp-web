import type { Boot } from './engine.ts'

const TOTAL = 262144
const count = Array.from(
  { length: TOTAL / 4096 },
  (_, i) => `Memory Test :   ${String((i + 1) * 4096).padStart(6)}K`,
)

const boot: Boot = {
  name: 'award',
  sections: [
    {
      step: 0.05,
      text: `Award Modular BIOS v4.51PG, An Energy Star Ally
Copyright (C) 1984-98, Award Software, Inc.

ASUS P5A ACPI BIOS Revision 1011 Beta 005

AMD-K6(tm)-III/450 Processor`,
    },
    { step: 0.15, text: count[0] as string },
    { step: 0.02, replace: true, text: count.slice(1).join('\n') },
    { step: 0.3, replace: true, text: `Memory Test :   ${TOTAL}K OK` },
    {
      step: 0.4,
      wait: 0.3,
      text: `
Award Plug and Play BIOS Extension v1.0A
Initialize Plug and Play Cards...
PNP Init Completed`,
    },
    {
      step: 0.4,
      wait: 0.2,
      text: `
Trend ChipAwayVirus(R) On Guard `,
    },
  ],
  footer: {
    at: 0.2,
    text: `Press DEL to enter SETUP
05/02/2002-ALADDIN5-<<P5A>>`,
  },
}

export default boot
