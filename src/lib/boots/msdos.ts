import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'msdos',
  shell: { prompt: 'C:\\>', command: 'FINGERPRINT' },
  sections: [
    { step: 0.2, text: `Booting from Hard Disk...` },
    { step: 0.5, text: `Starting MS-DOS...` },
    {
      step: 0.3,
      wait: 0.4,
      text: `

HIMEM is testing extended memory...done.`,
    },
    {
      step: 0.08,
      wait: 0.6,
      text: `

----------------------------------------------------------------
|         E-IDE/ATAPI  CD-ROM device driver,  Ver 1.25         |
| Copyright (C) LG Electronics Inc. 1997. All rights reserved. |
----------------------------------------------------------------
Unit 0:  QEMU      QEMU DVD-ROM      Product Rev.: 2.5+
Transfer Mode      : Programmed I/O`,
    },
    {
      step: 0.25,
      wait: 0.5,
      text: `

C:\\>C:\\DOS\\SMARTDRV.EXE /X
MSCDEX Version 2.23
Copyright (C) Microsoft Corp. 1986-1993. All rights reserved.
Drive D: = Driver MSCD000 unit 0
C:\\>`,
    },
  ],
}

export default boot
