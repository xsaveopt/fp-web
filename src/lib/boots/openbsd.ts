import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'openbsd',
  shell: { login: true, prompt: '{{short}}$ ' },
  sections: [
    { step: 0, text: `probing: pc0 com0 com1 mem[638K 1918M a20=on]` },
    { step: 0.1, text: `disk: hd0+` },
    { step: 0.1, text: `>> OpenBSD/amd64 BOOT 3.68` },
    { step: 0.05, text: `boot> ` },
    {
      step: 0.6,
      text: `booting hd0a:/bsd: 22960053+4797456+459968+0+1396736 [2087768+128+1550424+1245797]=0x20e8a98`,
    },
    { step: 0.35, text: `entry point at 0xffffffff81001000` },
    {
      step: 0.015,
      wait: 0.2,
      text: `[ using 4885144 bytes of bsd ELF symbol table ]
Copyright (c) 1982, 1986, 1989, 1991, 1993
	The Regents of the University of California.  All rights reserved.
Copyright (c) 1995-2026 OpenBSD. All rights reserved.  https://www.OpenBSD.org
OpenBSD 7.9 (GENERIC.MP) #449: Wed May  6 13:17:25 MDT 2026
    deraadt@amd64.openbsd.org:/usr/src/sys/arch/amd64/compile/GENERIC.MP
real mem = 2130640896 (2031MB)
avail mem = 2039496704 (1945MB)
random: good seed from bootblocks
mpath0 at root
scsibus0 at mpath0: 256 targets
mainbus0 at root
bios0 at mainbus0: SMBIOS rev. 2.5 @ 0xe1000 (10 entries)
bios0: vendor innotek GmbH version "VirtualBox" date 12/01/2006
bios0: innotek GmbH VirtualBox
acpi0 at bios0: ACPI 4.0
acpi0: sleep states S0 S5
acpi0: tables DSDT FACP APIC SSDT
acpi0: wakeup devices
acpitimer0 at acpi0: 3579545 Hz, 32 bits
acpimadt0 at acpi0 addr 0xfee00000: PC-AT compat
cpu0 at mainbus0: apid 0 (boot processor)
cpu0: AMD Ryzen 3 1200 Quad-Core Processor, 3176.87 MHz, 17-01-01, patch 08001129
cpu0: cpuid 1 edx=178bfbff<FPU,VME,DE,PSE,TSC,MSR,PAE,MCE,CX8,APIC,SEP,MTRR,PGE,MCA,CMOV,PAT,PSE36,CFLUSH,MMX,FXSR,SSE,SSE2,HTT> ecx=76d83203<SSE3,PCLMUL,SSSE3,FMA3,CX16,SSE4.1,SSE4.2,MOVBE,POPCNT,AES,XSAVE,AVX,F16C,RDRAND>
cpu0: cpuid 6 eax=4<ARAT>
cpu0: cpuid 7.0 ebx=208c0129<FSGSBASE,BMI1,AVX2,BMI2,RDSEED,ADX,CLFLUSHOPT,SHA>
cpu0: cpuid 80000001 edx=2bd3fb7f<NXE,MMXX,FFXSR,RDTSCP,LONG> ecx=1f3<LAHF,CMPLEG,AMCR8,ABM,SSE4A,MASSE,3DNOWP>
cpu0: cpuid 80000007 edx=100<ITSC>
cpu0: cpuid 80000008 ebx=4000000<SSBDNR>
cpu0: 32KB 64b/line 8-way D-cache, 64KB 64b/line 4-way I-cache
cpu0: 512KB 64b/line 8-way L2 cache
cpu0: smt 0, core 0, package 0
mtrr: Pentium Pro MTRR support, 16 var ranges, 88 fixed ranges
cpu0: apic clock running at 1000MHz
cpu1 at mainbus0: apid 1 (application processor)
cpu1: AMD Ryzen 3 1200 Quad-Core Processor, 3176.98 MHz, 17-01-01, patch 08001129
cpu1: smt 0, core 0, package 1
ioapic0 at mainbus0: apid 2 pa 0xfec00000, version 20, 24 pins, remapped
acpiprt0 at acpi0: bus 0 (PCI0)
acpipci0 at acpi0 PCI0: 0x00000000 0x00000011 0x00000001
"PNP0303" at acpi0 not configured
"PNP0F03" at acpi0 not configured
acpiac0 at acpi0: AC unit online
acpicpu0 at acpi0: C1(@1 halt!)
acpicpu1 at acpi0: C1(@1 halt!)
acpivideo0 at acpi0: GFX0
pci0 at mainbus0 bus 0
pchb0 at pci0 dev 0 function 0 "Intel 82441FX" rev 0x02
pcib0 at pci0 dev 1 function 0 "Intel 82371SB ISA" rev 0x00
pciide0 at pci0 dev 1 function 1 "Intel 82371AB IDE" rev 0x01: DMA, channel 0 configured to compatibility, channel 1 configured to compatibility
wd0 at pciide0 channel 0 drive 0: <VBOX HARDDISK>
wd0: 128-sector PIO, LBA, 28296MB, 57951808 sectors
wd0(pciide0:0:0): using PIO mode 4, Ultra-DMA mode 2
atapiscsi0 at pciide0 channel 1 drive 0
scsibus1 at atapiscsi0: 2 targets
cd0 at scsibus1 targ 0 lun 0: <VBOX, CD-ROM, 1.0> removable
cd0(pciide0:1:0): using PIO mode 4, Ultra-DMA mode 2
vga1 at pci0 dev 2 function 0 "VMware SVGA II" rev 0x00
wsdisplay0 at vga1 mux 1: console (80x25, vt100 emulation)
wsdisplay0: screen 1-5 added (80x25, vt100 emulation)
em0 at pci0 dev 3 function 0 "Intel 82540EM" rev 0x02: apic 2 int 19, address 08:00:27:4a:9c:02
"InnoTek Guest Service" rev 0x00 at pci0 dev 4 function 0 not configured
auich0 at pci0 dev 5 function 0 "Intel 82801AA AC97" rev 0x01: apic 2 int 21, ICH
ac97: codec id 0x83847600 (SigmaTel STAC9700)
audio0 at auich0
ohci0 at pci0 dev 6 function 0 "Apple Intrepid USB" rev 0x00: apic 2 int 22, version 1.0
piixpm0 at pci0 dev 7 function 0 "Intel 82371AB Power" rev 0x08: apic 2 int 23
iic0 at piixpm0
ehci0 at pci0 dev 11 function 0 "Intel 82801FB USB" rev 0x00: apic 2 int 19
usb0 at ehci0: USB revision 2.0
uhub0 at usb0 configuration 1 interface 0 "Intel EHCI root hub" rev 2.00/1.00 addr 1
isa0 at pcib0
isadma0 at isa0
pckbc0 at isa0 port 0x60/5 irq 1 irq 12
pckbd0 at pckbc0 (kbd slot)
wskbd0 at pckbd0: console keyboard, using wsdisplay0
pms0 at pckbc0 (aux slot)
wsmouse0 at pms0 mux 0
pcppi0 at isa0 port 0x61
spkr0 at pcppi0
usb1 at ohci0: USB revision 1.0
uhub1 at usb1 configuration 1 interface 0 "Apple OHCI root hub" rev 1.00/1.00 addr 1
vscsi0 at root
scsibus2 at vscsi0: 256 targets
softraid0 at root
scsibus3 at softraid0: 256 targets
root on wd0a (5c1f0b3e9a7d2468.a) swap on wd0b dump on wd0b`,
    },
    {
      step: 0.06,
      wait: 0.3,
      text: `Automatic boot in progress: starting file system checks.
/dev/wd0a (5c1f0b3e9a7d2468.a): file system is clean; not checking
/dev/wd0k (5c1f0b3e9a7d2468.k): file system is clean; not checking
/dev/wd0d (5c1f0b3e9a7d2468.d): file system is clean; not checking
/dev/wd0f (5c1f0b3e9a7d2468.f): file system is clean; not checking
/dev/wd0g (5c1f0b3e9a7d2468.g): file system is clean; not checking
/dev/wd0h (5c1f0b3e9a7d2468.h): file system is clean; not checking
/dev/wd0j (5c1f0b3e9a7d2468.j): file system is clean; not checking
/dev/wd0i (5c1f0b3e9a7d2468.i): file system is clean; not checking
/dev/wd0e (5c1f0b3e9a7d2468.e): file system is clean; not checking
pf enabled
clearing /tmp
starting network
reordering: ld.so libc libcrypto ssh-agent smtpd-ca smtpd-control smtpd-dispatcher smtpd-lka smtpd-queue smtpd-scheduler sshd-auth sshd-session httpd smtpd sshd.
starting early daemons: syslogd pflogd ntpd.
starting RPC daemons:.
savecore: no core dump
checking quotas: done.
kern.securelevel: 0 -> 1
creating runtime link editor directory cache.
preserving editor files.
starting network daemons: sshd smtpd sndiod.
starting local daemons: cron.`,
    },
    {
      step: 0.06,
      text: `{{date}}

OpenBSD/amd64 ({{host}}) (ttyC0)

login: `,
    },
  ],
}

export default boot
