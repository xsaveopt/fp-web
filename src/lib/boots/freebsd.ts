import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'freebsd',
  shell: { login: true, prompt: '{{user}}@{{short}}:~ $ ' },
  sections: [
    {
      step: 0.08,
      text: `Booting from Hard Disk...
Consoles: internal video/keyboard
BIOS drive A: is fd0
BIOS drive C: is disk0
BIOS 639kB/1047412kB available memory
Found int 13h unsafe hook at 0xf43fe (f000:e3fe)

FreeBSD/x86 bootstrap loader, Revision 3.0
Loading /boot/defaults/loader.conf
Loading /boot/defaults/loader.conf
Loading /boot/device.hints
Loading /boot/loader.conf
Loading /boot/loader.conf.local
Loading kernel...
/boot/kernel/kernel text=0x188c70 text=0xde25ec text=0x44cf2e data=0x198f60+0x8670a0 0x8+0x196938+0x8+0x1bb288`,
    },
    {
      step: 0.012,
      wait: 0.6,
      text: `---<<BOOT>>---
Copyright (c) 1992-2025 The FreeBSD Project.
Copyright (c) 1979, 1980, 1983, 1986, 1988, 1989, 1991, 1992, 1993, 1994
	The Regents of the University of California. All rights reserved.
FreeBSD is a registered trademark of The FreeBSD Foundation.
FreeBSD 15.1-RELEASE releng/15.1-n283562-96841ea08dcf GENERIC amd64
FreeBSD clang version 19.1.7 (https://github.com/llvm/llvm-project.git llvmorg-19.1.7-0-gcd708029e0b2)
VT(vga): text 80x25
CPU: QEMU Virtual CPU version 2.5+ (1000.43-MHz K8-class CPU)
  Origin="AuthenticAMD"  Id=0x60fb1  Family=0xf  Model=0x6b  Stepping=1
  Features=0x783fbfd<FPU,DE,PSE,TSC,MSR,PAE,MCE,CX8,APIC,SEP,MTRR,PGE,MCA,CMOV,PAT,PSE36,MMX,FXSR,SSE,SSE2>
  Features2=0x80002001<SSE3,CX16,HV>
  AMD Features=0x20100800<SYSCALL,NX,LM>
  AMD Features2=0x5<LAHF,SVM>
  SVM: NAsids=16
Hypervisor: Origin = "TCGTCGTCGTCG"
real memory  = 1073741824 (1024 MB)
avail memory = 1001078784 (954 MB)
Event timer "LAPIC" quality 100
ACPI APIC Table: <BOCHS  BXPC    >
arc4random: WARNING: initial seeding bypassed the cryptographic random device because it was not yet seeded and the knob 'bypass_before_seeding' was enabled.
ioapic0 <Version 2.0> irqs 0-23
random: entropy device external interface
kbd1 at kbdmux0
vtvga0: <VT VGA driver>
smbios0: <System Management BIOS> at iomem 0xf52f0-0xf530e
smbios0: Entry point: v2.1 (32-bit), Version: 2.8, BCD Revision: 2.8
aesni0: No AES or SHA support.
acpi0: <BOCHS BXPC>
acpi0: Power Button (fixed)
cpu0: <ACPI CPU> on acpi0
atrtc0: <AT realtime clock> port 0x70-0x77 irq 8 on acpi0
atrtc0: registered as a time-of-day clock, resolution 1.000000s
Event timer "RTC" frequency 32768 Hz quality 0
hpet0: <High Precision Event Timer> iomem 0xfed00000-0xfed003ff on acpi0
Timecounter "HPET" frequency 100000000 Hz quality 950
Timecounter "ACPI-fast" frequency 3579545 Hz quality 900
acpi_timer0: <24-bit timer at 3.579545MHz> port 0x608-0x60b on acpi0
pcib0: <ACPI Host-PCI bridge> port 0xcf8-0xcff on acpi0
pci0: <ACPI PCI bus> on pcib0
isab0: <PCI-ISA bridge> at device 1.0 on pci0
isa0: <ISA bus> on isab0
atapci0: <Intel PIIX3 WDMA2 controller> port 0x1f0-0x1f7,0x3f6,0x170-0x177,0x376,0xc0a0-0xc0af at device 1.1 on pci0
ata0: <ATA channel> at channel 0 on atapci0
ata1: <ATA channel> at channel 1 on atapci0
pci0: <bridge> at device 1.3 (no driver attached)
vgapci0: <VGA-compatible display> mem 0xfd000000-0xfdffffff,0xfebd0000-0xfebd0fff at device 2.0 on pci0
vgapci0: Boot video device
virtio_pci0: <VirtIO PCI (legacy) Network adapter> port 0xc080-0xc09f mem 0xfe000000-0xfe003fff irq 11 at device 3.0 on pci0
vtnet0: <VirtIO Networking Adapter> on virtio_pci0
vtnet0: Ethernet address: 52:54:00:12:34:56
vtnet0: netmap queues/slots: TX 1/256, RX 1/128
000.000075 [ 452] vtnet_netmap_attach       vtnet attached txq=1, txd=256 rxq=1, rxd=128
virtio_pci1: <VirtIO PCI (legacy) Block adapter> port 0xc000-0xc07f mem 0xfebd1000-0xfebd1fff,0xfe004000-0xfe007fff irq 11 at device 4.0 on pci0
vtblk0: <VirtIO Block Adapter> on virtio_pci1
vtblk0: 6177MB (12651776 512 byte sectors)
acpi_syscontainer0: <System Container> on acpi0
acpi_syscontainer1: <System Container> port 0xaf00-0xaf0b on acpi0
acpi_syscontainer2: <System Container> port 0xafe0-0xafe3 on acpi0
acpi_syscontainer3: <System Container> port 0xae00-0xae17 on acpi0
atkbdc0: <Keyboard controller (i8042)> port 0x60,0x64 irq 1 on acpi0
atkbd0: <AT Keyboard> irq 1 on atkbdc0
kbd0 at atkbd0
atkbd0: [GIANT-LOCKED]
psm0: <PS/2 Mouse> irq 12 on atkbdc0
psm0: [GIANT-LOCKED]
WARNING: Device "psm" is Giant locked and may be deleted before FreeBSD 16.0.
psm0: model IntelliMouse Explorer, device ID 4
fdc0: <floppy drive controller (FDE)> port 0x3f2-0x3f5,0x3f7 irq 6 drq 2 on acpi0
fdc0: does not respond
device_attach: fdc0 attach returned 6
ppc0: <Parallel port> port 0x378-0x37f irq 7 on acpi0
ppc0: Generic chipset (NIBBLE-only) in COMPATIBLE mode
ppbus0: <Parallel port bus> on ppc0
lpt0: <Printer> on ppbus0
lpt0: Interrupt-driven port
ppi0: <Parallel I/O> on ppbus0
uart0: <16550 or compatible> port 0x3f8-0x3ff irq 4 flags 0x10 on acpi0
uart0: console (115200,n,8,1)
orm0: <ISA Option ROM> at iomem 0xe8800-0xeffff pnpid ORM0000 on isa0
vga0: <Generic ISA VGA> at port 0x3c0-0x3df iomem 0xa0000-0xbffff pnpid PNP0900 on isa0
attimer0: <AT timer> at port 0x40 on isa0
Timecounter "i8254" frequency 1193182 Hz quality 0
Event timer "i8254" frequency 1193182 Hz quality 100
attimer0: non-PNP ISA device will be removed from GENERIC in FreeBSD 16.
Timecounter "TSC" frequency 1000000398 Hz quality 800
Timecounters tick every 10.000 msec
usb_needs_explore_all: no devclass
Trying to mount root from ufs:/dev/gpt/rootfs [rw,noatime]...
cd0 at ata1 bus 0 scbus1 target 0 lun 0
cd0: <QEMU QEMU DVD-ROM 2.5+> Removable CD-ROM SCSI device
cd0: Serial Number QM00003
cd0: 16.700MB/s transfers (WDMA2, ATAPI 12bytes, PIO 65534bytes)
cd0: Attempt to query device size failed: NOT READY, Medium not present
random: unblocking device.
Dual Console: Serial Primary, Video Secondary
Setting hostuuid: cabfe4a9-1e5e-4930-ad72-4fcd355aa7ec.
Setting hostid: 0x777cf18a.
Starting file system checks:
/dev/gpt/rootfs: FILE SYSTEM CLEAN; SKIPPING CHECKS
/dev/gpt/rootfs: clean, 613304 free (0 frags, 76663 blocks, 0.0% fragmentation)
/dev/gpt/efiboot0: FILESYSTEM CLEAN; SKIPPING CHECKS`,
    },
    {
      step: 0.04,
      wait: 0.3,
      text: `Mounting local filesystems:.
Autoloading module: intpm
intsmb0: <Intel PIIX4 SMBUS Interface> irq 9 at device 1.3 on pci0
intsmb0: intr IRQ 9 enabled revision 0
smbus0: <System Management Bus> on intsmb0
ELF ldconfig path: /lib /usr/lib /usr/local/lib /usr/local/lib/compat/pkg /usr/local/lib/compat/pkg
32-bit compatibility ldconfig path: /usr/lib32
Setting hostname: {{host}}.
Setting up harvesting: RANDOMDEV,[CALLOUT],[UMA],[FS_ATIME],SWI,INTERRUPT,NET_NG,[NET_ETHER],NET_TUN,MOUSE,KEYBOARD,ATTACH,CACHED
Feeding entropy: .
lo0: link state changed to UP
vtnet0: link state changed to UP
Starting dhclient.
DHCPDISCOVER on vtnet0 to 255.255.255.255 port 67 interval 8
DHCPOFFER from 10.0.2.2
DHCPREQUEST on vtnet0 to 255.255.255.255 port 67
DHCPACK from 10.0.2.2
bound to 10.0.2.15 -- renewal in 43199 seconds.
Starting Network: lo0 vtnet0.
lo0: flags=1008049<UP,LOOPBACK,RUNNING,MULTICAST,LOWER_UP> metric 0 mtu 16384
	options=680003<RXCSUM,TXCSUM,LINKSTATE,RXCSUM_IPV6,TXCSUM_IPV6>
	inet 127.0.0.1 netmask 0xff000000
	inet6 ::1 prefixlen 128
	inet6 fe80::1%lo0 prefixlen 64 scopeid 0x2
	groups: lo
	nd6 options=21<PERFORMNUD,AUTO_LINKLOCAL>
vtnet0: flags=1008843<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST,LOWER_UP> metric 0 mtu 1500
	options=880028<VLAN_MTU,JUMBO_MTU,LINKSTATE,HWSTATS>
	ether 52:54:00:12:34:56
	inet 10.0.2.15 netmask 0xffffff00 broadcast 10.0.2.255
	inet6 fe80::5054:ff:fe12:3456%vtnet0 prefixlen 64 scopeid 0x1
	inet6 fec0::5054:ff:fe12:3456 prefixlen 64 autoconf pltime 14400 vltime 86400
	media: Ethernet autoselect (10Gbase-T <full-duplex>)
	status: active
	nd6 options=23<PERFORMNUD,ACCEPT_RTADV,AUTO_LINKLOCAL>
Starting devd.
Creating and/or trimming log files.
Clearing /tmp (X related).
Updating /var/run/os-release done.
Updating motd:.
Starting syslogd.
No core dumps found.
Mounting late filesystems:.
Starting sshd.
Starting cron.
Starting background file system checks in 60 seconds.

{{date}}`,
    },
    {
      step: 0.08,
      wait: 0.2,
      text: `
FreeBSD/amd64 ({{host}}) (ttyu0)

login: `,
    },
  ],
}

export default boot
