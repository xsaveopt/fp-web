import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'plan9',
  shell: { answer: 'text', prompt: 'term% ' },
  sections: [
    {
      step: 0.15,
      text: `Booting from DVD/CD...
*e820=1 0x0000000000000000 0x000000000009fc00 2 0x000000000009fc00 0x00000000000a0000 2 0x00000000000f0000 0x0000000000100000 1 0x0000000000100000 0x000000003ffe0000 2 0x000000003ffe0000 0x0000000040000000 2 0x00000000fffc0000 0x0000000100000000 2 0x000000fd00000000 0x0000010000000000
cdboot=yes
mouseport=ask
monitor=ask
vgasize=ask
bootfile=/amd64/9pc64`,
    },
    {
      step: 0.04,
      wait: 0.6,
      text: `Plan 9
HPET: fed00000 8086a201 100 MHz
125 holes free
0x00022000 0x0009f000 512000
0x00100000 0x00110000 65536
0x0060e000 0x19cdb000 426561536
427139072 bytes free
pcirouting: PCI.0.1.3 at pin 1 link 60 irq 9 -> 10
cpu0: 999MHz AuthenticAMD AMD-K8 (AX 00060FB1 CX 80002001 DX 078BFBFD)
amlmapio: no address
amlmapio: mapping \\_SB.PCI0.S08.P40C failed
ELCR: 0C00
LAPIC: fee00000 fffffe80fee00000
cpu0: lapic clock at 999MHz
igbe: p->cls 0x0, setting to 0x10
mpintrassign: can't find bus type 12, number 0
#l0: i82543: 1000Mbps port 0xFEBC0000 irq 11 ea 525400123456
1000M memory: 413M kernel data, 587M user, 1837M swap
pc64.bootfs: Thu Jul 30 07:08:11 GMT 2026
fingerprint: 0368af54765999c0feb827d1038ac2c575379162
nusb/usbd: no hubs

/dev/sdD0: QEMU DVD-ROM
/dev/sdD0/data   9660`,
    },
    { step: 0.3, text: `bootargs is (tcp, tls, il, local!device)[local!/dev/sdD0/data] ` },
    { step: 0.9, text: `user[glenda]: ` },
    {
      step: 0.4,
      wait: 0.5,
      text: `
init: starting /bin/rc
cirno {{syslog}} starting dns resolver on /net
vgasize is (text, 640x480x8, 1024x768x16, ...) [1024x768x16] `,
    },
  ],
}

export default boot
