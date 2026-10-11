import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'omnios',
  shell: { login: true, prompt: '$ ' },
  sections: [
    {
      step: 0.12,
      text: `Booting from Hard Disk...
Consoles: serial port a
BIOS drive A: is fd0
BIOS drive C: is disk0
BIOS 639kB/2096000kB available memory

illumos/x86 ZFS enabled bootstrap loader, Revision 1.1`,
    },
    {
      step: 0.08,
      wait: 0.2,
      text: `loading CORE EXT words
loading SEARCH & SEARCH-EXT words
loading Johns-Hopkins locals
loading MARKER
loading ficl O-O extensions
loading ficl utility classes
loading ficl string class
Loading /boot/defaults/loader.conf`,
    },
    {
      step: 0.3,
      wait: 0.3,
      text: `Loading /platform/i86pc/amd64/boot_archive...
Loading /platform/i86pc/amd64/boot_archive.hash...
Booting...`,
    },
    {
      step: 0.12,
      wait: 0.4,
      text: `
OmniOS r151058 Version omnios-r151058-516f7694c9 64-bit
Copyright (c) 2012-2017 OmniTI Computer Consulting, Inc.
Copyright (c) 2017-2026 OmniOS Community Edition (OmniOSce) Association.
NOTICE: MPO disabled because memory is interleaved`,
    },
    {
      step: 0.25,
      wait: 0.3,
      text: `
Loading smf(7) service descriptions: 1/1
Configuring devices.
Hostname: {{host}}
Applying initial boot settings...`,
    },
    {
      step: 0.3,
      wait: 0.5,
      text: `
{{host}} console login: `,
    },
  ],
}

export default boot
