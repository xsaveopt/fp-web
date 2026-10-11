import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'netbsd',
  shell: { login: true, prompt: '$ ' },
  sections: [
    {
      step: 0.05,
      text: `  \\\\-__,------,___.
   \\\\        __,---\`  NetBSD/x86 BIOS Boot
    \\\\       \`---,_.  Revision 5.12 (Thu Jul 30 15:23:12 UTC 2026)
     \\\\-,_____,.---\`
      \\\\
       \\\\
        \\\\
`,
    },
    {
      step: 0.2,
      wait: 0.4,
      text: `> boot
21448592`,
    },
    {
      step: 0.015,
      wait: 0.6,
      text: `[   1.0000000] WARNING: system needs entropy for security; see entropy(7)
[   1.0000000] Copyright (c) 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003,
[   1.0000000]     2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
[   1.0000000]     2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
[   1.0000000]     2024, 2025, 2026
[   1.0000000]     The NetBSD Foundation, Inc.  All rights reserved.
[   1.0000000] Copyright (c) 1982, 1986, 1989, 1991, 1993
[   1.0000000]     The Regents of the University of California.  All rights reserved.

[   1.0000000] NetBSD 11.0 (GENERIC) #0: Thu Jul 30 15:23:12 UTC 2026
[   1.0000000] 	mkrepro@mkrepro.NetBSD.org:/usr/src/sys/arch/amd64/compile/GENERIC
[   1.0000000] total memory = 1023 MB
[   1.0000000] avail memory = 962 MB
[   1.0000040] mainbus0 (root)
[   1.0000040] ACPI: RSDP 0x00000000000F52E0 000014 (v00 BOCHS )
[   1.0000040] ACPI: RSDT 0x000000003FFE2328 000034 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[   1.0000040] ACPI: FACP 0x000000003FFE21DC 000074 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[   1.0000040] ACPI: DSDT 0x000000003FFE0040 00219C (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[   1.0000040] ACPI: FACS 0x000000003FFE0000 000040
[   1.0000040] ACPI: APIC 0x000000003FFE2250 000078 (v03 BOCHS  BXPC     00000001 BXPC 00000001)
[   1.0000040] ACPI: HPET 0x000000003FFE22C8 000038 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[   1.0000040] ACPI: WAET 0x000000003FFE2300 000028 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[   1.0000040] ACPI: 1 ACPI AML tables successfully acquired and loaded
[   1.0000040] ioapic0 at mainbus0 apid 0
[   1.0000040] cpu0 at mainbus0 apid 0
[   1.0000040] cpu0: QEMU Virtual CPU version 2.5+, id 0x60fb1
[   1.0000040] cpu0: node 0, package 0, core 0, smt 0
[   1.0000040] acpi0 at mainbus0: Intel ACPICA 20241212
[   1.0000040] acpi0: fixed power button present
[   1.0384742] hpet0 at acpi0: high precision event timer (mem 0xfed00000-0xfed00400)
[   1.0394917] qemufwcfg0 at acpi0 (FWCF, QEMU0002): io 0x510-0x51b
[   1.0394917] pckbc1 at acpi0 (KBD, PNP0303) (kbd port): io 0x60,0x64 irq 1
[   1.0394917] pckbc2 at acpi0 (MOU, PNP0F13) (aux port): irq 12
[   1.0394917] fdc0 at acpi0 (FDC0, PNP0700): io 0x3f2-0x3f5,0x3f7 irq 6 drq 2
[   1.0394917] lpt0 at acpi0 (LPT1, PNP0400-1): io 0x378-0x37f irq 7
[   1.0394917] com0 at acpi0 (COM1, PNP0501-1): io 0x3f8-0x3ff irq 4
[   1.0394917] com0: ns16550a, 16-byte FIFO
[   1.0394917] com0: console
[   1.0394917] ACPI: Enabled 2 GPEs in block 00 to 0F
[   1.0394917] pckbd0 at pckbc1 (kbd slot)
[   1.0394917] pckbc1: using irq 1 for kbd slot
[   1.0394917] wskbd0 at pckbd0 mux 1
[   1.0394917] pms0 at pckbc1 (aux slot)
[   1.0394917] pckbc1: using irq 12 for aux slot
[   1.0394917] wsmouse0 at pms0 mux 0
[   1.0394917] pci0 at mainbus0 bus 0: configuration mode 1
[   1.0394917] pchb0 at pci0 dev 0 function 0: Intel 82441FX (PMC) PCI and Memory Controller (rev. 0x02)
[   1.0394917] pcib0 at pci0 dev 1 function 0: Intel 82371SB (PIIX3) PCI-ISA Bridge (rev. 0x00)
[   1.0394917] piixide0 at pci0 dev 1 function 1: Intel 82371SB IDE Interface (PIIX3) (rev. 0x00)
[   1.0394917] piixide0: primary channel interrupting at ioapic0 pin 14
[   1.0394917] atabus0 at piixide0 channel 0
[   1.0394917] piixide0: secondary channel interrupting at ioapic0 pin 15
[   1.0394917] atabus1 at piixide0 channel 1
[   1.0394917] piixpm0 at pci0 dev 1 function 3: Intel 82371AB (PIIX4) Power Management Controller (rev. 0x03)
[   1.0394917] piixpm0: 24-bit timer
[   1.0394917] piixpm0: interrupting at ioapic0 pin 9
[   1.0394917] iic0 at piixpm0 port 0: I2C bus
[   1.0394917] vga0 at pci0 dev 2 function 0: vendor 1234 product 1111 (rev. 0x02)
[   1.0394917] wsdisplay0 at vga0 kbdmux 1
[   1.0394917] drm at vga0 not configured
[   1.0394917] wm0 at pci0 dev 3 function 0: Intel i82540EM 1000BASE-T Ethernet (rev. 0x03)
[   1.0394917] wm0: interrupting at ioapic0 pin 11
[   1.0394917] wm0: Ethernet address 52:54:00:12:34:56
[   1.0394917] makphy0 at wm0 phy 1: Marvell 88E1011 Gigabit PHY, rev. 0
[   1.0394917] makphy0: 10baseT, 10baseT-FDX, 100baseTX, 100baseTX-FDX, 1000baseT, 1000baseT-FDX, auto
[   1.0394917] isa0 at pcib0
[   1.0394917] attimer0 at isa0 port 0x40-0x43
[   1.0394917] pcppi0 at isa0 port 0x61
[   1.0394917] spkr0 at pcppi0: PC Speaker
[   1.0394917] wsbell at spkr0 not configured
[   1.0394917] midi0 at pcppi0: PC speaker
[   1.0394917] sysbeep0 at pcppi0
[   1.0394917] attimer0: attached to pcppi0
[   1.0394917] acpicpu0 at cpu0: ACPI CPU
[   1.0394917] vmt0 at cpu0
[   1.0394917] vmware: open failed, eax=0xffffffff, ecx=0x1e, edx=0x5658
[   1.0394917] vmt0: failed to open backdoor RPC channel (TCLO protocol)
[   2.0246788] fd0 at fdc0 drive 0: 1.44MB, 80 cyl, 2 head, 18 sec
[   5.1113426] wd0 at atabus0 drive 0
[   5.1230375] wd0: <QEMU HARDDISK>
[   5.1230375] wd0: 1907 MB, 3874 cyl, 16 head, 63 sec, 512 bytes/sect x 3905536 sectors
[   5.1406884] dk0 at wd0: "EFI system", 262144 blocks at 2048, type: msdos
[   5.1406884] dk1 at wd0: "NBImgRoot", 3639296 blocks at 264192, type: ffs
[   5.1406884] atapibus0 at atabus1: 2 targets
[   5.1507636] cd0 at atapibus0 drive 0: <QEMU DVD-ROM, QM00003, 2.5+> cdrom removable
[   5.1507636] swwdog0: software watchdog initialized
[   5.1607125] WARNING: 1 error while detecting hardware; check system log.
[   5.1607125] boot device: wd0
[   5.1607125] root on dk1
[   5.1706772] root file system type: ffs
[   5.1706772] kern.module.path=/stand/amd64/11.0/modules
[   5.4407118] entropy: best effort`,
    },
    {
      step: 0.06,
      wait: 0.3,
      text: `{{date}}
Starting root file system check:
/dev/rdk1: 41714 files, 809733 used, 70482 free (26 frags, 8807 blocks, 0.0% fragmentation)
/dev/rdk1: MARKING FILE SYSTEM CLEAN
Setting sysctl variables:
ddb.onpanic: 1 -> 0
Starting file system checks:
rndctl: no entropy in seed
Waiting for entropy...done
Setting tty flags.
Starting network.
Hostname: {{host}}
IPv6 mode: host
Configuring network interfaces:.
Adding interface aliases:.
Waiting for duplicate address detection to finish...
Starting dhcpcd.
Building databases: dev, utmp, utmpx.
Starting syslogd.
Mounting all file systems...
Clearing temporary files.
Updating fontconfig cache: done.
Checking quotas: done.
Starting virecover.
Starting local daemons:.
Updating motd.
Starting powerd.
Starting sshd.
Starting postfix.
postfix/postlog: starting the Postfix mail system
Starting inetd.
Starting cron.`,
    },
    {
      step: 0.08,
      wait: 0.2,
      text: `{{date}}

NetBSD/amd64 ({{host}}) (constty)

login: `,
    },
  ],
}

export default boot
