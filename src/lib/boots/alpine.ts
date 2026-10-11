import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'alpine',
  shell: { login: true, prompt: '{{short}}:~$ ' },
  sections: [
    {
      step: 0.003,
      text: `[    0.000000] Linux version 6.18.52-0-virt (buildozer@build-3-24-x86_64) (cc (Alpine 15.2.0) 15.2.0, GNU ld (GNU Binutils) 2.45.1) #1-Alpine SMP PREEMPT_DYNAMIC 2026-09-15 05:37:48
[    0.000000] Command line: console=ttyS0 modules=loop,squashfs,sd-mod,usb-storage alpine_dev=cdrom:iso9660 modloop=/boot/modloop-virt
[    0.000000] BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable
[    0.000000] BIOS-e820: [mem 0x000000000009fc00-0x000000000009ffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000000f0000-0x00000000000fffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000001ffdffff] usable
[    0.000000] BIOS-e820: [mem 0x000000001ffe0000-0x000000001fffffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fffc0000-0x00000000ffffffff] reserved
[    0.000000] BIOS-e820: [mem 0x000000fd00000000-0x000000ffffffffff] reserved
[    0.000000] NX (Execute Disable) protection: active
[    0.000000] APIC: Static calls initialized
[    0.000000] SMBIOS 2.8 present.
[    0.000000] DMI: QEMU Standard PC (i440FX + PIIX, 1996), BIOS rel-1.17.0-0-gb52ca86e094d-prebuilt.qemu.org 04/01/2014
[    0.000000] DMI: Memory slots populated: 1/1
[    0.000000] last_pfn = 0x1ffe0 max_arch_pfn = 0x400000000
[    0.000000] MTRR map: 4 entries (3 fixed + 1 variable; max 19), built from 8 variable MTRRs
[    0.000000] x86/PAT: Configuration [0-7]: WB  WC  UC- UC  WB  WP  UC- WT
[    0.000000] found SMP MP-table at [mem 0x000f54c0-0x000f54cf]
[    0.000000] RAMDISK: [mem 0x1f67d000-0x1ffdffff]
[    0.000000] ACPI: Early table checksum verification disabled
[    0.000000] ACPI: RSDP 0x00000000000F52E0 000014 (v00 BOCHS )
[    0.000000] ACPI: RSDT 0x000000001FFE2328 000034 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: FACP 0x000000001FFE21DC 000074 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: DSDT 0x000000001FFE0040 00219C (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: FACS 0x000000001FFE0000 000040
[    0.000000] ACPI: APIC 0x000000001FFE2250 000078 (v03 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: HPET 0x000000001FFE22C8 000038 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: WAET 0x000000001FFE2300 000028 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: Reserving FACP table memory at [mem 0x1ffe21dc-0x1ffe224f]
[    0.000000] ACPI: Reserving DSDT table memory at [mem 0x1ffe0040-0x1ffe21db]
[    0.000000] ACPI: Reserving FACS table memory at [mem 0x1ffe0000-0x1ffe003f]
[    0.000000] ACPI: Reserving APIC table memory at [mem 0x1ffe2250-0x1ffe22c7]
[    0.000000] ACPI: Reserving HPET table memory at [mem 0x1ffe22c8-0x1ffe22ff]
[    0.000000] ACPI: Reserving WAET table memory at [mem 0x1ffe2300-0x1ffe2327]
[    0.000000] No NUMA configuration found
[    0.000000] Faking a node at [mem 0x0000000000000000-0x000000001ffdffff]
[    0.000000] NODE_DATA(0) allocated [mem 0x1f678d40-0x1f67cfff]
[    0.000000] Zone ranges:
[    0.000000]   DMA      [mem 0x0000000000001000-0x0000000000ffffff]
[    0.000000]   DMA32    [mem 0x0000000001000000-0x000000001ffdffff]
[    0.000000]   Normal   empty
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x0000000000001000-0x000000000009efff]
[    0.000000]   node   0: [mem 0x0000000000100000-0x000000001ffdffff]
[    0.000000] Initmem setup node 0 [mem 0x0000000000001000-0x000000001ffdffff]
[    0.000000] On node 0, zone DMA: 1 pages in unavailable ranges
[    0.000000] On node 0, zone DMA: 97 pages in unavailable ranges
[    0.000000] On node 0, zone DMA32: 32 pages in unavailable ranges
[    0.000000] ACPI: PM-Timer IO Port: 0x608
[    0.000000] ACPI: LAPIC_NMI (acpi_id[0xff] dfl dfl lint[0x1])
[    0.000000] IOAPIC[0]: apic_id 0, version 32, address 0xfec00000, GSI 0-23
[    0.000000] ACPI: INT_SRC_OVR (bus 0 bus_irq 0 global_irq 2 dfl dfl)
[    0.000000] ACPI: INT_SRC_OVR (bus 0 bus_irq 5 global_irq 5 high level)
[    0.000000] ACPI: INT_SRC_OVR (bus 0 bus_irq 9 global_irq 9 high level)
[    0.000000] ACPI: INT_SRC_OVR (bus 0 bus_irq 10 global_irq 10 high level)
[    0.000000] ACPI: INT_SRC_OVR (bus 0 bus_irq 11 global_irq 11 high level)
[    0.000000] ACPI: Using ACPI (MADT) for SMP configuration information
[    0.000000] ACPI: HPET id: 0x8086a201 base: 0xfed00000
[    0.000000] CPU topo: Max. logical packages:   1
[    0.000000] CPU topo: Max. logical dies:       1
[    0.000000] CPU topo: Max. dies per package:   1
[    0.000000] CPU topo: Max. threads per core:   1
[    0.000000] CPU topo: Num. cores per package:     1
[    0.000000] CPU topo: Num. threads per package:   1
[    0.000000] CPU topo: Allowing 1 present CPUs plus 0 hotplug CPUs
[    0.000000] [mem 0x20000000-0xfffbffff] available for PCI devices
[    0.000000] Booting paravirtualized kernel on bare hardware
[    0.000000] clocksource: refined-jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 1910969940391419 ns
[    0.000000] setup_percpu: NR_CPUS:256 nr_cpumask_bits:1 nr_cpu_ids:1 nr_node_ids:1
[    0.000000] percpu: Embedded 55 pages/cpu s186200 r8192 d30888 u2097152
[    0.000000] Kernel command line: console=ttyS0 modules=loop,squashfs,sd-mod,usb-storage alpine_dev=cdrom:iso9660 modloop=/boot/modloop-virt
[    0.000000] Unknown kernel command line parameters "modules=loop,squashfs,sd-mod,usb-storage alpine_dev=cdrom:iso9660 modloop=/boot/modloop-virt", will be passed to user space.
[    0.000000] printk: log buffer data + meta data: 131072 + 458752 = 589824 bytes
[    0.000000] Dentry cache hash table entries: 65536 (order: 7, 524288 bytes, linear)
[    0.000000] Inode-cache hash table entries: 32768 (order: 6, 262144 bytes, linear)
[    0.000000] Fallback order for Node 0: 0
[    0.000000] Built 1 zonelists, mobility grouping on.  Total pages: 130942
[    0.000000] Policy zone: DMA32
[    0.000000] mem auto-init: stack:all(zero), heap alloc:on, heap free:off
[    0.000000] SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=1, Nodes=1
[    0.000000] Dynamic Preempt: none
[    0.000000] rcu: Preemptible hierarchical RCU implementation.
[    0.000000] rcu: 	RCU restricting CPUs from NR_CPUS=256 to nr_cpu_ids=1.
[    0.000000] 	Trampoline variant of Tasks RCU enabled.
[    0.000000] 	Tracing variant of Tasks RCU enabled.
[    0.000000] rcu: RCU calculated value of scheduler-enlistment delay is 100 jiffies.
[    0.000000] rcu: Adjusting geometry for rcu_fanout_leaf=16, nr_cpu_ids=1
[    0.000000] RCU Tasks: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1 rcu_task_cpu_ids=1.
[    0.000000] RCU Tasks Trace: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1 rcu_task_cpu_ids=1.
[    0.000000] NR_IRQS: 16640, nr_irqs: 256, preallocated irqs: 16
[    0.000000] rcu: srcu_init: Setting srcu_struct sizes based on contention.
[    0.000000] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 1911260446275000 ns
[    0.000000] kfence: initialized - using 2097152 bytes for 255 objects at 0x(____ptrval____)-0x(____ptrval____)
[    0.000000] Console: colour VGA+ 80x25
[    0.000000] printk: legacy console [ttyS0] enabled
[    0.000000] ACPI: Core revision 20250807
[    0.000000] clocksource: hpet: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 19112604467 ns
[    0.003000] APIC: Switch to symmetric I/O mode setup
[    0.005000] ..TIMER: vector=0x30 apic1=0 pin1=2 apic2=-1 pin2=-1
[    0.013000] tsc: Unable to calibrate against PIT
[    0.014000] tsc: using HPET reference calibration
[    0.015000] tsc: Detected 998.956 MHz processor
[    0.000988] clocksource: tsc-early: mask: 0xffffffffffffffff max_cycles: 0x1ccc79b04c0, max_idle_ns: 881590457387 ns
[    0.005988] Calibrating delay loop (skipped), value calculated using timer frequency.. 1997.91 BogoMIPS (lpj=998956)
[    0.008262] Last level iTLB entries: 4KB 512, 2MB 255, 4MB 127
[    0.008515] Last level dTLB entries: 4KB 512, 2MB 255, 4MB 127, 1GB 0
[    0.008515] mitigations: Enabled attack vectors: user_kernel, user_user, guest_host, guest_guest, SMT mitigations: auto
[    0.009031] Spectre V2 : Mitigation: Retpolines
[    0.009515] Spectre V1 : Mitigation: usercopy/swapgs barriers and __user pointer sanitization
[    0.009515] Spectre V2 : Spectre v2 / SpectreRSB: Filling RSB on context switch and VMEXIT
[    0.011515] x86/fpu: x87 FPU will use FXSAVE
[    0.170515] Freeing SMP alternatives memory: 40K
[    0.170715] pid_max: default: 32768 minimum: 301
[    0.175494] LSM: initializing lsm=lockdown,capability,landlock,yama
[    0.176726] landlock: Up and running.
[    0.177396] Yama: becoming mindful.
[    0.179515] Mount-cache hash table entries: 1024 (order: 1, 8192 bytes, linear)
[    0.179515] Mountpoint-cache hash table entries: 1024 (order: 1, 8192 bytes, linear)
[    0.230515] smpboot: CPU0: AMD QEMU Virtual CPU version 2.5+ (family: 0xf, model: 0x6b, stepping: 0x1)
[    0.235515] Performance Events: PMU not available due to virtualization, using software events only.
[    0.236515] signal: max sigframe size: 1440
[    0.237515] rcu: Hierarchical SRCU implementation.
[    0.237515] rcu: 	Max phase no-delay instances is 400.
[    0.239515] NMI watchdog: Perf NMI watchdog permanently disabled
[    0.240515] smp: Bringing up secondary CPUs ...
[    0.241052] smp: Brought up 1 node, 1 CPU
[    0.241435] smpboot: Total of 1 processors activated (1997.91 BogoMIPS)
[    0.243515] Memory: 461964K/523768K available (14690K kernel code, 2033K rwdata, 9872K rodata, 3008K init, 1148K bss, 58720K reserved, 0K cma-reserved)
[    0.246515] devtmpfs: initialized
[    0.248515] x86/mm: Memory block size: 128MB
[    0.250710] posixtimers hash table entries: 512 (order: 1, 8192 bytes, linear)
[    0.251515] futex hash table entries: 256 (16384 bytes on 1 NUMA nodes, total 16 KiB, linear).
[    0.256515] NET: Registered PF_NETLINK/PF_ROUTE protocol family
[    0.257857] audit: initializing netlink subsys (disabled)
[    0.260037] thermal_sys: Registered thermal governor 'step_wise'
[    0.260515] audit: type=2000 audit(1791449283.271:1): state=initialized audit_enabled=0 res=1
[    0.261078] cpuidle: using governor ladder
[    0.261515] cpuidle: using governor menu
[    0.261515] acpiphp: ACPI Hot Plug PCI Controller Driver version: 0.5
[    0.263256] PCI: Using configuration type 1 for base access
[    0.264157] kprobes: kprobe jump-optimization is enabled. All kprobes are optimized if possible.
[    0.268515] HugeTLB: registered 2.00 MiB page size, pre-allocated 0 pages
[    0.268515] HugeTLB: 28 KiB vmemmap can be freed for a 2.00 MiB page
[    0.275515] ACPI: Added _OSI(Module Device)
[    0.275515] ACPI: Added _OSI(Processor Device)
[    0.275515] ACPI: Added _OSI(Processor Aggregator Device)
[    0.279515] ACPI: 1 ACPI AML tables successfully acquired and loaded
[    0.290515] ACPI: Interpreter enabled
[    0.291244] ACPI: PM: (supports S0 S3 S5)
[    0.291515] ACPI: Using IOAPIC for interrupt routing
[    0.291515] PCI: Using host bridge windows from ACPI; if necessary, use "pci=nocrs" and report a bug
[    0.291515] PCI: Using E820 reservations for host bridge windows
[    0.292515] ACPI: Enabled 2 GPEs in block 00 to 0F
[    0.310515] ACPI: PCI Root Bridge [PCI0] (domain 0000 [bus 00-ff])
[    0.310515] acpi PNP0A03:00: _OSC: OS supports [ASPM ClockPM Segments MSI HPX-Type3]
[    0.310728] acpi PNP0A03:00: _OSC: not requesting OS control; OS requires [ExtendedConfig ASPM ClockPM MSI]
[    0.311515] acpi PNP0A03:00: fail to add MMCONFIG information, can't access extended configuration space under this bridge
[    0.313515] acpiphp: Slot [3] registered
[    0.313515] acpiphp: Slot [4] registered
[    0.313515] acpiphp: Slot [5] registered
[    0.313515] acpiphp: Slot [6] registered
[    0.313515] acpiphp: Slot [7] registered
[    0.313775] acpiphp: Slot [8] registered
[    0.314123] acpiphp: Slot [9] registered
[    0.314481] acpiphp: Slot [10] registered
[    0.314515] acpiphp: Slot [11] registered
[    0.314515] acpiphp: Slot [12] registered
[    0.314515] acpiphp: Slot [13] registered
[    0.314578] acpiphp: Slot [14] registered
[    0.314896] acpiphp: Slot [15] registered
[    0.315184] acpiphp: Slot [16] registered
[    0.315458] acpiphp: Slot [17] registered
[    0.315515] acpiphp: Slot [18] registered
[    0.315515] acpiphp: Slot [19] registered
[    0.315515] acpiphp: Slot [20] registered
[    0.315515] acpiphp: Slot [21] registered
[    0.315515] acpiphp: Slot [22] registered
[    0.315515] acpiphp: Slot [23] registered
[    0.315515] acpiphp: Slot [24] registered
[    0.315587] acpiphp: Slot [25] registered
[    0.315913] acpiphp: Slot [26] registered
[    0.316201] acpiphp: Slot [27] registered
[    0.316478] acpiphp: Slot [28] registered
[    0.316515] acpiphp: Slot [29] registered
[    0.316515] acpiphp: Slot [30] registered
[    0.316515] acpiphp: Slot [31] registered
[    0.316515] PCI host bridge to bus 0000:00
[    0.316515] pci_bus 0000:00: root bus resource [io  0x0000-0x0cf7 window]
[    0.316951] pci_bus 0000:00: root bus resource [io  0x0d00-0xffff window]
[    0.317448] pci_bus 0000:00: root bus resource [mem 0x000a0000-0x000bffff window]
[    0.317515] pci_bus 0000:00: root bus resource [mem 0x20000000-0xfebfffff window]
[    0.317515] pci_bus 0000:00: root bus resource [mem 0x100000000-0x17fffffff window]
[    0.317515] pci_bus 0000:00: root bus resource [bus 00-ff]
[    0.318431] pci 0000:00:00.0: [8086:1237] type 00 class 0x060000 conventional PCI endpoint
[    0.319515] pci 0000:00:01.0: [8086:7000] type 00 class 0x060100 conventional PCI endpoint
[    0.320215] pci 0000:00:01.1: [8086:7010] type 00 class 0x010180 conventional PCI endpoint
[    0.320515] pci 0000:00:01.1: BAR 4 [io  0xc040-0xc04f]
[    0.320515] pci 0000:00:01.1: BAR 0 [io  0x01f0-0x01f7]: legacy IDE quirk
[    0.320515] pci 0000:00:01.1: BAR 1 [io  0x03f6]: legacy IDE quirk
[    0.320515] pci 0000:00:01.1: BAR 2 [io  0x0170-0x0177]: legacy IDE quirk
[    0.320515] pci 0000:00:01.1: BAR 3 [io  0x0376]: legacy IDE quirk
[    0.320827] pci 0000:00:01.3: [8086:7113] type 00 class 0x068000 conventional PCI endpoint
[    0.321515] pci 0000:00:01.3: quirk: [io  0x0600-0x063f] claimed by PIIX4 ACPI
[    0.321515] pci 0000:00:01.3: quirk: [io  0x0700-0x070f] claimed by PIIX4 SMB
[    0.321958] pci 0000:00:02.0: [1234:1111] type 00 class 0x030000 conventional PCI endpoint
[    0.322515] pci 0000:00:02.0: BAR 0 [mem 0xfd000000-0xfdffffff pref]
[    0.322515] pci 0000:00:02.0: BAR 2 [mem 0xfebf0000-0xfebf0fff]
[    0.322515] pci 0000:00:02.0: ROM [mem 0xfebe0000-0xfebeffff pref]
[    0.322747] pci 0000:00:02.0: Video device with shadowed ROM at [mem 0x000c0000-0x000dffff]
[    0.323515] pci 0000:00:03.0: [8086:100e] type 00 class 0x020000 conventional PCI endpoint
[    0.323515] pci 0000:00:03.0: BAR 0 [mem 0xfebc0000-0xfebdffff]
[    0.323554] pci 0000:00:03.0: BAR 1 [io  0xc000-0xc03f]
[    0.323928] pci 0000:00:03.0: ROM [mem 0xfeb80000-0xfebbffff pref]
[    0.327028] ACPI: PCI: Interrupt link LNKA configured for IRQ 10
[    0.327515] ACPI: PCI: Interrupt link LNKB configured for IRQ 10
[    0.327515] ACPI: PCI: Interrupt link LNKC configured for IRQ 11
[    0.327515] ACPI: PCI: Interrupt link LNKD configured for IRQ 11
[    0.327721] ACPI: PCI: Interrupt link LNKS configured for IRQ 9
[    0.330515] iommu: Default domain type: Translated
[    0.330953] iommu: DMA domain TLB invalidation policy: lazy mode
[    0.331979] SCSI subsystem initialized
[    0.332515] pps_core: LinuxPPS API ver. 1 registered
[    0.332515] pps_core: Software ver. 5.3.6 - Copyright 2005-2007 Rodolfo Giometti <giometti@linux.it>
[    0.332515] PTP clock support registered
[    0.335700] PCI: Using ACPI for IRQ routing
[    0.337445] hpet: 3 channels of 0 reserved for per-cpu timers
[    0.338513] clocksource: Switched to clocksource tsc-early
[    0.343373] VFS: Disk quotas dquot_6.6.0
[    0.343518] VFS: Dquot-cache hash table entries: 512 (order 0, 4096 bytes)
[    0.351877] pnp: PnP ACPI init
[    0.355338] pnp: PnP ACPI: found 5 devices
[    0.376365] clocksource: acpi_pm: mask: 0xffffff max_cycles: 0xffffff, max_idle_ns: 2085701024 ns
[    0.380000] NET: Registered PF_INET protocol family
[    0.380000] IP idents hash table entries: 8192 (order: 4, 65536 bytes, linear)
[    0.421828] tcp_listen_portaddr_hash hash table entries: 256 (order: 0, 4096 bytes, linear)
[    0.425489] Table-perturb hash table entries: 65536 (order: 6, 262144 bytes, linear)
[    0.426298] TCP established hash table entries: 4096 (order: 3, 32768 bytes, linear)
[    0.430173] TCP bind hash table entries: 4096 (order: 5, 131072 bytes, linear)
[    0.434641] TCP: Hash tables configured (established 4096 bind 4096)
[    0.435425] MPTCP token hash table entries: 512 (order: 2, 12288 bytes, linear)
[    0.435425] UDP hash table entries: 256 (order: 2, 16384 bytes, linear)
[    0.435425] UDP-Lite hash table entries: 256 (order: 2, 16384 bytes, linear)
[    0.439767] NET: Registered PF_UNIX/PF_LOCAL protocol family
[    0.440045] NET: Registered PF_XDP protocol family
[    0.440045] pci_bus 0000:00: resource 4 [io  0x0000-0x0cf7 window]
[    0.441869] pci_bus 0000:00: resource 5 [io  0x0d00-0xffff window]
[    0.442258] pci_bus 0000:00: resource 6 [mem 0x000a0000-0x000bffff window]
[    0.442670] pci_bus 0000:00: resource 7 [mem 0x20000000-0xfebfffff window]
[    0.442846] pci_bus 0000:00: resource 8 [mem 0x100000000-0x17fffffff window]
[    0.442846] pci 0000:00:01.0: PIIX3: Enabling Passive Release
[    0.442846] pci 0000:00:00.0: Limiting direct PCI/PCI transfers
[    0.445131] PCI: CLS 0 bytes, default 64
[    0.448397] Initialise system trusted keyrings
[    0.460416] Unpacking initramfs...
[    0.496757] workingset: timestamp_bits=40 max_order=17 bucket_order=0
[    0.499587] Key type asymmetric registered
[    0.499587] Asymmetric key parser 'x509' registered
[    0.499587] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 247)
[    0.502699] io scheduler mq-deadline registered
[    0.502878] io scheduler kyber registered
[    0.502878] io scheduler bfq registered
[    0.518277] ERST DBG: ERST support is disabled.
[    0.553463] Serial: 8250/16550 driver, 4 ports, IRQ sharing enabled
[    0.558382] 00:04: ttyS0 at I/O 0x3f8 (irq = 4, base_baud = 115200) is a 16550A
[    0.569100] VMware PVSCSI driver - version 1.0.7.0-k
[    0.595899] scsi host0: ata_piix
[    0.604766] scsi host1: ata_piix
[    0.609838] ata1: PATA max MWDMA2 cmd 0x1f0 ctl 0x3f6 bmdma 0xc040 irq 14 lpm-pol 0
[    0.610485] ata2: PATA max MWDMA2 cmd 0x170 ctl 0x376 bmdma 0xc048 irq 15 lpm-pol 0
[    0.610487] hv_vmbus: registering driver hv_netvsc
[    0.613644] i8042: PNP: PS/2 Controller [PNP0303:KBD,PNP0f13:MOU] at 0x60,0x64 irq 1,12
[    0.616716] serio: i8042 KBD port at 0x60,0x64 irq 1
[    0.617056] serio: i8042 AUX port at 0x60,0x64 irq 12
[    0.617056] hv_vmbus: registering driver hyperv_keyboard
[    0.617056] rtc_cmos PNP0B00:00: RTC can wake from S4
[    0.622582] input: AT Translated Set 2 keyboard as /devices/platform/i8042/serio0/input/input0
[    0.637177] rtc_cmos PNP0B00:00: registered as rtc0
[    0.637511] rtc_cmos PNP0B00:00: setting system clock to 2025-11-14T00:00:00 UTC (1763078400)
[    0.637511] rtc_cmos PNP0B00:00: alarms up to one day, y3k, 242 bytes nvram, hpet irqs
[    0.637511] amd_pstate: the _CPC object is not present in SBIOS or ACPI disabled
[    0.643828] gre: GRE over IPv4 demultiplexer driver
[    0.643947] NET: Registered PF_INET6 protocol family
[    0.653173] Segment Routing with IPv6
[    0.688956] In-situ OAM (IOAM) with IPv6
[    0.900749] Key type dns_resolver registered
[    0.905843] IPI shorthand broadcast: enabled
[    0.917380] sched_clock: Marking stable (928864154, -12484010)->(1559013101, -642632957)
[    1.056877] registered taskstats version 1
[    1.059412] Loading compiled-in X.509 certificates
[    1.218783] ata2: found unknown device (class 0)
[    1.254342] ata2.00: ATAPI: QEMU DVD-ROM, 2.5+, max UDMA/100
[    1.269302] scsi 1:0:0:0: CD-ROM            QEMU     QEMU DVD-ROM     2.5+ PQ: 0 ANSI: 5
[    1.312894] Freeing initrd memory: 9612K
[    1.454814] Loaded X.509 cert 'alpinelinux.org: Alpine Linux kernel key: d76a695f66ad9cd28f5c22a8508f36e91f521f7a'
[    1.468242] Demotion targets for Node 0: null
[    1.469529] Key type .fscrypt registered
[    1.469810] Key type fscrypt-provisioning registered
[    1.706136] Freeing unused kernel image (initmem) memory: 3008K
[    1.707629] Write protecting the kernel read-only data: 26624k
[    1.710762] Freeing unused kernel image (text/rodata gap) memory: 1692K
[    1.715720] Freeing unused kernel image (rodata/data gap) memory: 368K
[    1.718957] rodata_test: all tests were successful
[    1.719617] Run /init as init process
[    1.846590] Alpine Init 3.14.1-r0
Alpine Init 3.14.1-r0`,
    },
    {
      step: 0.04,
      wait: 0.2,
      text: `[    1.858168] Loading boot drivers...
 * Loading boot drivers: [    1.919212] loop: module loaded
[    1.932164] squashfs: version 4.0 (2009/01/31) Phillip Lougher
[    1.980335] ACPI: bus type USB registered
[    1.981536] usbcore: registered new interface driver usbfs
[    1.982050] usbcore: registered new interface driver hub
[    1.982522] usbcore: registered new device driver usb
[    1.993640] usbcore: registered new interface driver usb-storage
[    2.000520] Loading boot drivers: ok.
ok.
[    2.110685] Mounting boot media...
 * Mounting boot media: [    2.341085] sr 1:0:0:0: [sr0] scsi3-mmc drive: 4x/4x cd/rw xa/form2 tray
[    2.364411] cdrom: Uniform CD-ROM driver Revision: 3.20
[    2.620040] clocksource: Long readout interval, skipping watchdog check: cs_nsec: 1734987115 wd_nsec: 1733174640
[    3.598059] tsc: Refined TSC clocksource calibration: 999.998 MHz
[    3.598929] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x1cd42a73115, max_idle_ns: 881590563823 ns
[    3.604631] clocksource: Switched to clocksource tsc
[    3.996257] block sr0: the capability attribute has been deprecated.
[    4.925889] Mounting boot media: ok.
ok.
[    5.389714] Installing packages to root filesystem...
 * Installing packages to root filesystem: ( 1/28) Installing alpine-baselayout-data (3.7.2-r1)
  0%                                             ( 2/28) Installing musl (1.2.6-r2)
  0%                                               1%                                               3% #                                             5% ##                                            7% ###                                         ( 3/28) Installing busybox (1.37.0-r31)
  7% ###                                           8% ###                                          10% ####                                         13% #####                                        15% ######                                       16% #######                                       Executing busybox-1.37.0-r31.post-install
 16% #######                                     ( 4/28) Installing busybox-binsh (1.37.0-r31)
 16% #######                                      17% #######                                     ( 5/28) Installing alpine-baselayout (3.7.2-r1)
 17% #######                                      18% ########                                      Executing alpine-baselayout-3.7.2-r1.pre-install
 18% ########                                     19% ########                                      Executing alpine-baselayout-3.7.2-r1.post-install
 19% ########                                    ( 6/28) Installing bridge (1.5-r5)
 19% ########                                     20% ########                                    ( 7/28) Installing ifupdown-ng (0.13.0-r0)
 20% ########                                     21% #########                                    22% #########                                   ( 8/28) Installing openrc-user (0.63.2-r0)
 22% #########                                    23% ##########                                  ( 9/28) Installing libcap2 (2.78-r0)
 23% ##########                                   24% ##########                                  (10/28) Installing openrc (0.63.2-r0)
 24% ##########                                   25% ###########                                  27% ############                                 29% ############                                  Executing openrc-0.63.2-r0.post-install
 29% ############                                (11/28) Installing alpine-conf (3.22.0-r0)
 29% ############                                 30% #############                                31% #############                               (12/28) Installing alpine-keys (2.6-r0)
 31% #############                                32% ##############                              (13/28) Installing alpine-release (3.24.2-r0)
 32% ##############                               33% ##############                              (14/28) Installing libcrypto3 (3.5.8-r0)
 33% ##############                               34% ###############                              36% ################                             38% #################                            41% ##################                           43% ##################                           45% ###################                          47% ####################                         49% #####################                        51% ######################                       53% #######################                      55% ########################                     57% #########################                    59% ##########################                   61% ###########################                  63% ############################                 66% #############################               (15/28) Installing libssl3 (3.5.8-r0)
 66% #############################                67% #############################                69% ##############################               71% ###############################              73% ################################            (16/28) Installing ssl_client (1.37.0-r31)
 73% ################################             74% ################################            (17/28) Installing zlib (1.3.2-r0)
 74% ################################             75% #################################            76% #################################           (18/28) Installing libapk (3.0.8-r0)
 76% #################################            77% ##################################           79% ##################################          (19/28) Installing ca-certificates-bundle (20260909-r0)
 79% ##################################           80% ###################################          82% ####################################        (20/28) Installing apk-tools (3.0.8-r0)
 82% ####################################         83% ####################################         84% #####################################       (21/28) Installing mdev-conf (4.10-r0)
 84% #####################################        85% #####################################       (22/28) Installing busybox-mdev-openrc (1.37.0-r31)
 85% #####################################        86% ######################################      (23/28) Installing busybox-openrc (1.37.0-r31)
 86% ######################################       87% ######################################      (24/28) Installing busybox-suid (1.37.0-r31)
 87% ######################################       88% ######################################      (25/28) Installing scanelf (1.3.9-r1)
 88% ######################################       89% #######################################      90% #######################################     (26/28) Installing musl-utils (1.2.6-r2)
 90% #######################################      91% ########################################    (27/28) Installing alpine-base (3.24.2-r0)
 91% ########################################     92% ########################################    (28/28) Installing openssl (3.5.8-r0)
 92% ########################################     93% #########################################    95% ##########################################   97% ##########################################   98% ########################################### 100% ############################################Executing busybox-1.37.0-r31.trigger
OK: 10.5 MiB in 28 packages
[    6.574261] Installing packages to root filesystem: ok.`,
    },
    {
      step: 0.06,
      wait: 0.2,
      text: `ok.


   OpenRC 0.63.2 is starting up Linux 6.18.52-0-virt (x86_64)

 * /proc is already mounted
 * Mounting /run ... [ ok ]
 * /run/openrc: creating directory
 * /run/lock: creating directory
 * /run/lock: correcting owner
 * Caching service dependencies ... [ ok ]
 * Remounting devtmpfs on /dev ... [ ok ]
 * Mounting /dev/mqueue ... [ ok ]
 * Mounting modloop /media/cdrom/boot/modloop-virt ... * Verifying modloop
 [ ok ]
 * Mounting security filesystem ... [ ok ]
 * Mounting debug filesystem ... [ ok ]
 * Mounting trace filesystem ... [ ok ]
 * Mounting persistent storage (pstore) filesystem ... [ ok ]
 * Mounting bpf filesystem ... [ ok ]
 * Starting busybox mdev ... [ ok ]
 * Scanning hardware for mdev ... [ ok ]
 * Loading hardware drivers ... [ ok ]
 * Loading modules ... [ ok ]
 * Setting system clock using the hardware clock [UTC] ... [ ok ]
 * Checking local filesystems  ... [ ok ]
 * Remounting filesystems ... [ ok ]
 * Mounting local filesystems ... [ ok ]
 * Configuring kernel parameters ... [ ok ]
 * Creating user login records ... [ ok ]
 * Cleaning /tmp directory ... [ ok ]
 * Setting hostname to {{host}} from /etc/hostname ... [ ok ]
 * Starting busybox syslog ... [ ok ]
 * Starting firstboot ... [ ok ]`,
    },
    {
      step: 0.08,
      wait: 0.2,
      text: `
Welcome to Alpine Linux 3.24
Kernel 6.18.52-0-virt on x86_64 (/dev/ttyS0)

{{host}} login: `,
    },
  ],
}

export default boot
