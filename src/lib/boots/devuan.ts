import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'devuan',
  shell: { login: true, prompt: '{{user}}@{{short}}:~$ ' },
  sections: [
    {
      step: 0.003,
      text: `[    0.000000] Linux version 6.12.57+deb13-amd64 (debian-kernel@lists.debian.org) (x86_64-linux-gnu-gcc-14 (Debian 14.2.0-19) 14.2.0, GNU ld (GNU Binutils for Debian) 2.44) #1 SMP PREEMPT_DYNAMIC Debian 6.12.57-1 (2025-11-05)
[    0.000000] Command line: console=ttyS0 boot=live noautologin username=devuan
[    0.000000] BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable
[    0.000000] BIOS-e820: [mem 0x000000000009fc00-0x000000000009ffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000000f0000-0x00000000000fffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x000000003ffdffff] usable
[    0.000000] BIOS-e820: [mem 0x000000003ffe0000-0x000000003fffffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fffc0000-0x00000000ffffffff] reserved
[    0.000000] BIOS-e820: [mem 0x000000fd00000000-0x000000ffffffffff] reserved
[    0.000000] NX (Execute Disable) protection: active
[    0.000000] APIC: Static calls initialized
[    0.000000] SMBIOS 2.8 present.
[    0.000000] DMI: QEMU Standard PC (i440FX + PIIX, 1996), BIOS rel-1.17.0-0-gb52ca86e094d-prebuilt.qemu.org 04/01/2014
[    0.000000] DMI: Memory slots populated: 1/1
[    0.000000] tsc: Fast TSC calibration failed
[    0.000000] AGP: No AGP bridge found
[    0.000000] last_pfn = 0x3ffe0 max_arch_pfn = 0x400000000
[    0.000000] MTRR map: 4 entries (3 fixed + 1 variable; max 19), built from 8 variable MTRRs
[    0.000000] x86/PAT: Configuration [0-7]: WB  WC  UC- UC  WB  WP  UC- WT
[    0.000000] found SMP MP-table at [mem 0x000f54c0-0x000f54cf]
[    0.000000] RAMDISK: [mem 0x3d1bc000-0x3ffdffff]
[    0.000000] ACPI: Early table checksum verification disabled
[    0.000000] ACPI: RSDP 0x00000000000F52E0 000014 (v00 BOCHS )
[    0.000000] ACPI: RSDT 0x000000003FFE2328 000034 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: FACP 0x000000003FFE21DC 000074 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: DSDT 0x000000003FFE0040 00219C (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: FACS 0x000000003FFE0000 000040
[    0.000000] ACPI: APIC 0x000000003FFE2250 000078 (v03 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: HPET 0x000000003FFE22C8 000038 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: WAET 0x000000003FFE2300 000028 (v01 BOCHS  BXPC     00000001 BXPC 00000001)
[    0.000000] ACPI: Reserving FACP table memory at [mem 0x3ffe21dc-0x3ffe224f]
[    0.000000] ACPI: Reserving DSDT table memory at [mem 0x3ffe0040-0x3ffe21db]
[    0.000000] ACPI: Reserving FACS table memory at [mem 0x3ffe0000-0x3ffe003f]
[    0.000000] ACPI: Reserving APIC table memory at [mem 0x3ffe2250-0x3ffe22c7]
[    0.000000] ACPI: Reserving HPET table memory at [mem 0x3ffe22c8-0x3ffe22ff]
[    0.000000] ACPI: Reserving WAET table memory at [mem 0x3ffe2300-0x3ffe2327]
[    0.000000] No NUMA configuration found
[    0.000000] Faking a node at [mem 0x0000000000000000-0x000000003ffdffff]
[    0.000000] NODE_DATA(0) allocated [mem 0x3d191680-0x3d1bbfff]
[    0.000000] Zone ranges:
[    0.000000]   DMA      [mem 0x0000000000001000-0x0000000000ffffff]
[    0.000000]   DMA32    [mem 0x0000000001000000-0x000000003ffdffff]
[    0.000000]   Normal   empty
[    0.000000]   Device   empty
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x0000000000001000-0x000000000009efff]
[    0.000000]   node   0: [mem 0x0000000000100000-0x000000003ffdffff]
[    0.000000] Initmem setup node 0 [mem 0x0000000000001000-0x000000003ffdffff]
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
[    0.000000] PM: hibernation: Registered nosave memory: [mem 0x00000000-0x00000fff]
[    0.000000] PM: hibernation: Registered nosave memory: [mem 0x0009f000-0x000fffff]
[    0.000000] [mem 0x40000000-0xfffbffff] available for PCI devices
[    0.000000] Booting paravirtualized kernel on bare hardware
[    0.000000] clocksource: refined-jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 7645519600211568 ns
[    0.000000] setup_percpu: NR_CPUS:8192 nr_cpumask_bits:1 nr_cpu_ids:1 nr_node_ids:1
[    0.000000] percpu: Embedded 66 pages/cpu s233472 r8192 d28672 u2097152
[    0.000000] Kernel command line: console=ttyS0 boot=live noautologin username=devuan
[    0.000000] Unknown kernel command line parameters "noautologin boot=live username=devuan", will be passed to user space.
[    0.000000] Dentry cache hash table entries: 131072 (order: 8, 1048576 bytes, linear)
[    0.000000] Inode-cache hash table entries: 65536 (order: 7, 524288 bytes, linear)
[    0.000000] Fallback order for Node 0: 0
[    0.000000] Built 1 zonelists, mobility grouping on.  Total pages: 262014
[    0.000000] Policy zone: DMA32
[    0.000000] mem auto-init: stack:all(zero), heap alloc:on, heap free:off
[    0.000000] AGP: Checking aperture...
[    0.000000] AGP: No AGP bridge found
[    0.000000] SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=1, Nodes=1
[    0.000000] ftrace: allocating 45728 entries in 179 pages
[    0.000000] ftrace: allocated 179 pages with 5 groups
[    0.000000] Dynamic Preempt: voluntary
[    0.000000] rcu: Preemptible hierarchical RCU implementation.
[    0.000000] rcu: 	RCU restricting CPUs from NR_CPUS=8192 to nr_cpu_ids=1.
[    0.000000] 	Trampoline variant of Tasks RCU enabled.
[    0.000000] 	Rude variant of Tasks RCU enabled.
[    0.000000] 	Tracing variant of Tasks RCU enabled.
[    0.000000] rcu: RCU calculated value of scheduler-enlistment delay is 25 jiffies.
[    0.000000] rcu: Adjusting geometry for rcu_fanout_leaf=16, nr_cpu_ids=1
[    0.000000] RCU Tasks: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1 rcu_task_cpu_ids=1.
[    0.000000] RCU Tasks Rude: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1 rcu_task_cpu_ids=1.
[    0.000000] RCU Tasks Trace: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1 rcu_task_cpu_ids=1.
[    0.000000] NR_IRQS: 524544, nr_irqs: 256, preallocated irqs: 16
[    0.000000] rcu: srcu_init: Setting srcu_struct sizes based on contention.
[    0.000000] Console: colour VGA+ 80x25
[    0.000000] printk: legacy console [ttyS0] enabled
[    0.000000] ACPI: Core revision 20240827
[    0.000000] clocksource: hpet: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 19112604467 ns
[    0.004000] APIC: Switch to symmetric I/O mode setup
[    0.008000] ..TIMER: vector=0x30 apic1=0 pin1=2 apic2=-1 pin2=-1
[    0.040000] tsc: Unable to calibrate against PIT
[    0.044000] tsc: using HPET reference calibration
[    0.044000] tsc: Detected 999.426 MHz processor
[    0.001132] clocksource: tsc-early: mask: 0xffffffffffffffff max_cycles: 0x1ccff1c9c62, max_idle_ns: 881590587123 ns
[    0.007204] Calibrating delay loop (skipped), value calculated using timer frequency.. 1998.85 BogoMIPS (lpj=3997704)
[    0.019822] Last level iTLB entries: 4KB 512, 2MB 255, 4MB 127
[    0.020942] Last level dTLB entries: 4KB 512, 2MB 255, 4MB 127, 1GB 0
[    0.022921] Spectre V1 : Mitigation: usercopy/swapgs barriers and __user pointer sanitization
[    0.022921] Spectre V2 : Mitigation: Retpolines
[    0.022994] Spectre V2 : Spectre v2 / SpectreRSB: Filling RSB on context switch and VMEXIT
[    0.027815] x86/fpu: x87 FPU will use FXSAVE
[    0.439705] Freeing SMP alternatives memory: 40K
[    0.451131] pid_max: default: 32768 minimum: 301
[    0.470359] LSM: initializing lsm=lockdown,capability,landlock,yama,apparmor,tomoyo,bpf,ipe,ima,evm
[    0.480969] landlock: Up and running.
[    0.482965] Yama: disabled by default; enable with sysctl kernel.yama.*
[    0.496223] AppArmor: AppArmor initialized
[    0.497140] TOMOYO Linux initialized
[    0.507579] LSM support for eBPF active
[    0.546669] Mount-cache hash table entries: 2048 (order: 2, 16384 bytes, linear)
[    0.547196] Mountpoint-cache hash table entries: 2048 (order: 2, 16384 bytes, linear)
[    0.741285] APIC calibration not consistent with PM-Timer: 104ms instead of 100ms
[    0.742921] APIC delta adjusted to PM-Timer: 6247441 (6556817)
[    0.744154] smpboot: CPU0: AMD QEMU Virtual CPU version 2.5+ (family: 0xf, model: 0x6b, stepping: 0x1)
[    0.777406] Performance Events: PMU not available due to virtualization, using software events only.
[    0.779818] signal: max sigframe size: 1440
[    0.781674] rcu: Hierarchical SRCU implementation.
[    0.783088] rcu: 	Max phase no-delay instances is 1000.
[    0.817544] NMI watchdog: Perf NMI watchdog permanently disabled
[    0.835838] smp: Bringing up secondary CPUs ...
[    0.848615] smp: Brought up 1 node, 1 CPU
[    0.850921] smpboot: Total of 1 processors activated (1998.85 BogoMIPS)
[    0.979797] node 0 deferred pages initialised in 132ms
[    0.995130] Memory: 933124K/1048056K available (16384K kernel code, 2496K rwdata, 11800K rodata, 4152K init, 4936K bss, 111384K reserved, 0K cma-reserved)
[    1.175939] devtmpfs: initialized
[    1.193971] x86/mm: Memory block size: 128MB
[    1.275065] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 7645041785100000 ns
[    1.279814] futex hash table entries: 256 (order: 2, 16384 bytes, linear)
[    1.294270] pinctrl core: initialized pinctrl subsystem
[    1.433678] NET: Registered PF_NETLINK/PF_ROUTE protocol family
[    1.476501] DMA: preallocated 128 KiB GFP_KERNEL pool for atomic allocations
[    1.480223] DMA: preallocated 128 KiB GFP_KERNEL|GFP_DMA pool for atomic allocations
[    1.483762] DMA: preallocated 128 KiB GFP_KERNEL|GFP_DMA32 pool for atomic allocations
[    1.491402] audit: initializing netlink subsys (disabled)
[    1.502921] thermal_sys: Registered thermal governor 'fair_share'
[    1.502921] thermal_sys: Registered thermal governor 'bang_bang'
[    1.502921] thermal_sys: Registered thermal governor 'step_wise'
[    1.502921] thermal_sys: Registered thermal governor 'user_space'
[    1.502921] thermal_sys: Registered thermal governor 'power_allocator'
[    1.502921] cpuidle: using governor ladder
[    1.502921] cpuidle: using governor menu
[    1.502921] acpiphp: ACPI Hot Plug PCI Controller Driver version: 0.5
[    1.506921] PCI: Using configuration type 1 for base access
[    1.506921] audit: type=2000 audit(1791449791.548:1): state=initialized audit_enabled=0 res=1
[    1.507473] kprobes: kprobe jump-optimization is enabled. All kprobes are optimized if possible.
[    1.876021] HugeTLB: registered 2.00 MiB page size, pre-allocated 0 pages
[    1.879173] HugeTLB: 28 KiB vmemmap can be freed for a 2.00 MiB page
[    1.981654] ACPI: Added _OSI(Module Device)
[    1.987068] ACPI: Added _OSI(Processor Device)
[    1.987657] ACPI: Added _OSI(Processor Aggregator Device)
[    2.047027] ACPI: 1 ACPI AML tables successfully acquired and loaded
[    2.128133] ACPI: Interpreter enabled
[    2.133286] ACPI: PM: (supports S0 S3 S4 S5)
[    2.135133] ACPI: Using IOAPIC for interrupt routing
[    2.141912] PCI: Using host bridge windows from ACPI; if necessary, use "pci=nocrs" and report a bug
[    2.144249] PCI: Using E820 reservations for host bridge windows
[    2.159417] ACPI: Enabled 2 GPEs in block 00 to 0F
[    2.264892] ACPI: PCI Root Bridge [PCI0] (domain 0000 [bus 00-ff])
[    2.266814] acpi PNP0A03:00: _OSC: OS supports [ASPM ClockPM Segments MSI HPX-Type3]
[    2.267997] acpi PNP0A03:00: _OSC: not requesting OS control; OS requires [ExtendedConfig ASPM ClockPM MSI]
[    2.271673] acpi PNP0A03:00: fail to add MMCONFIG information, can't access extended configuration space under this bridge
[    2.299644] acpiphp: Slot [3] registered
[    2.300489] acpiphp: Slot [4] registered
[    2.301222] acpiphp: Slot [5] registered
[    2.303193] acpiphp: Slot [6] registered
[    2.303614] acpiphp: Slot [7] registered
[    2.304199] acpiphp: Slot [8] registered
[    2.307262] acpiphp: Slot [9] registered
[    2.307711] acpiphp: Slot [10] registered
[    2.308048] acpiphp: Slot [11] registered
[    2.308525] acpiphp: Slot [12] registered
[    2.309598] acpiphp: Slot [13] registered
[    2.310338] acpiphp: Slot [14] registered
[    2.311134] acpiphp: Slot [15] registered
[    2.311675] acpiphp: Slot [16] registered
[    2.313272] acpiphp: Slot [17] registered
[    2.314233] acpiphp: Slot [18] registered
[    2.315117] acpiphp: Slot [19] registered
[    2.315492] acpiphp: Slot [20] registered
[    2.315958] acpiphp: Slot [21] registered
[    2.316522] acpiphp: Slot [22] registered
[    2.316964] acpiphp: Slot [23] registered
[    2.317287] acpiphp: Slot [24] registered
[    2.317609] acpiphp: Slot [25] registered
[    2.318195] acpiphp: Slot [26] registered
[    2.318921] acpiphp: Slot [27] registered
[    2.319191] acpiphp: Slot [28] registered
[    2.319619] acpiphp: Slot [29] registered
[    2.323032] acpiphp: Slot [30] registered
[    2.323548] acpiphp: Slot [31] registered
[    2.324506] PCI host bridge to bus 0000:00
[    2.325064] pci_bus 0000:00: root bus resource [io  0x0000-0x0cf7 window]
[    2.325810] pci_bus 0000:00: root bus resource [io  0x0d00-0xffff window]
[    2.326256] pci_bus 0000:00: root bus resource [mem 0x000a0000-0x000bffff window]
[    2.326987] pci_bus 0000:00: root bus resource [mem 0x40000000-0xfebfffff window]
[    2.327539] pci_bus 0000:00: root bus resource [mem 0x100000000-0x17fffffff window]
[    2.328216] pci_bus 0000:00: root bus resource [bus 00-ff]
[    2.329841] pci 0000:00:00.0: [8086:1237] type 00 class 0x060000 conventional PCI endpoint
[    2.337445] pci 0000:00:01.0: [8086:7000] type 00 class 0x060100 conventional PCI endpoint
[    2.339254] pci 0000:00:01.1: [8086:7010] type 00 class 0x010180 conventional PCI endpoint
[    2.347321] pci 0000:00:01.1: BAR 4 [io  0xc040-0xc04f]
[    2.351040] pci 0000:00:01.1: BAR 0 [io  0x01f0-0x01f7]: legacy IDE quirk
[    2.352810] pci 0000:00:01.1: BAR 1 [io  0x03f6]: legacy IDE quirk
[    2.356127] pci 0000:00:01.1: BAR 2 [io  0x0170-0x0177]: legacy IDE quirk
[    2.356737] pci 0000:00:01.1: BAR 3 [io  0x0376]: legacy IDE quirk
[    2.364585] pci 0000:00:01.3: [8086:7113] type 00 class 0x068000 conventional PCI endpoint
[    2.366042] pci 0000:00:01.3: quirk: [io  0x0600-0x063f] claimed by PIIX4 ACPI
[    2.367078] pci 0000:00:01.3: quirk: [io  0x0700-0x070f] claimed by PIIX4 SMB
[    2.371999] pci 0000:00:02.0: [1234:1111] type 00 class 0x030000 conventional PCI endpoint
[    2.374921] pci 0000:00:02.0: BAR 0 [mem 0xfd000000-0xfdffffff pref]
[    2.380840] pci 0000:00:02.0: BAR 2 [mem 0xfebf0000-0xfebf0fff]
[    2.389743] pci 0000:00:02.0: ROM [mem 0xfebe0000-0xfebeffff pref]
[    2.398056] pci 0000:00:02.0: Video device with shadowed ROM at [mem 0x000c0000-0x000dffff]
[    2.404044] pci 0000:00:03.0: [8086:100e] type 00 class 0x020000 conventional PCI endpoint
[    2.406921] pci 0000:00:03.0: BAR 0 [mem 0xfebc0000-0xfebdffff]
[    2.406921] pci 0000:00:03.0: BAR 1 [io  0xc000-0xc03f]
[    2.406921] pci 0000:00:03.0: ROM [mem 0xfeb80000-0xfebbffff pref]
[    2.421291] ACPI: PCI: Interrupt link LNKA configured for IRQ 10
[    2.423811] ACPI: PCI: Interrupt link LNKB configured for IRQ 10
[    2.424595] ACPI: PCI: Interrupt link LNKC configured for IRQ 11
[    2.425271] ACPI: PCI: Interrupt link LNKD configured for IRQ 11
[    2.425901] ACPI: PCI: Interrupt link LNKS configured for IRQ 9
[    2.435357] iommu: Default domain type: Translated
[    2.435906] iommu: DMA domain TLB invalidation policy: lazy mode
[    2.440151] pps_core: LinuxPPS API ver. 1 registered
[    2.440748] pps_core: Software ver. 5.3.6 - Copyright 2005-2007 Rodolfo Giometti <giometti@linux.it>
[    2.441773] PTP clock support registered
[    2.442745] EDAC MC: Ver: 3.0.0
[    2.458359] NetLabel: Initializing
[    2.458756] NetLabel:  domain hash size = 128
[    2.458960] NetLabel:  protocols = UNLABELED CIPSOv4 CALIPSO
[    2.460008] NetLabel:  unlabeled traffic allowed by default
[    2.460451] PCI: Using ACPI for IRQ routing
[    2.472115] pci 0000:00:02.0: vgaarb: setting as boot VGA device
[    2.473483] pci 0000:00:02.0: vgaarb: bridge control possible
[    2.473965] pci 0000:00:02.0: vgaarb: VGA device added: decodes=io+mem,owns=io+mem,locks=none
[    2.475016] vgaarb: loaded
[    2.476972] hpet: 3 channels of 0 reserved for per-cpu timers
[    2.477677] hpet0: at MMIO 0xfed00000, IRQs 2, 8, 0
[    2.478201] hpet0: 3 comparators, 64-bit 100.000000 MHz counter
[    2.488147] clocksource: Switched to clocksource tsc-early
[    2.519573] VFS: Disk quotas dquot_6.6.0
[    2.524756] VFS: Dquot-cache hash table entries: 512 (order 0, 4096 bytes)
[    2.541099] AppArmor: AppArmor Filesystem Enabled
[    2.549015] pnp: PnP ACPI init
[    2.559237] pnp: PnP ACPI: found 6 devices
[    2.637498] clocksource: acpi_pm: mask: 0xffffff max_cycles: 0xffffff, max_idle_ns: 2085701024 ns
[    2.641297] NET: Registered PF_INET protocol family
[    2.642873] IP idents hash table entries: 16384 (order: 5, 131072 bytes, linear)
[    2.721822] tcp_listen_portaddr_hash hash table entries: 512 (order: 1, 8192 bytes, linear)
[    2.723285] Table-perturb hash table entries: 65536 (order: 6, 262144 bytes, linear)
[    2.724913] TCP established hash table entries: 8192 (order: 4, 65536 bytes, linear)
[    2.725953] TCP bind hash table entries: 8192 (order: 6, 262144 bytes, linear)
[    2.726618] TCP: Hash tables configured (established 8192 bind 8192)
[    2.732105] MPTCP token hash table entries: 1024 (order: 2, 24576 bytes, linear)
[    2.734117] UDP hash table entries: 512 (order: 2, 16384 bytes, linear)
[    2.734831] UDP-Lite hash table entries: 512 (order: 2, 16384 bytes, linear)
[    2.737762] NET: Registered PF_UNIX/PF_LOCAL protocol family
[    2.743028] NET: Registered PF_XDP protocol family
[    2.744364] pci_bus 0000:00: resource 4 [io  0x0000-0x0cf7 window]
[    2.745239] pci_bus 0000:00: resource 5 [io  0x0d00-0xffff window]
[    2.746054] pci_bus 0000:00: resource 6 [mem 0x000a0000-0x000bffff window]
[    2.746527] pci_bus 0000:00: resource 7 [mem 0x40000000-0xfebfffff window]
[    2.747407] pci_bus 0000:00: resource 8 [mem 0x100000000-0x17fffffff window]
[    2.748453] pci 0000:00:01.0: PIIX3: Enabling Passive Release
[    2.748977] pci 0000:00:00.0: Limiting direct PCI/PCI transfers
[    2.750166] PCI: CLS 0 bytes, default 64
[    2.764324] Trying to unpack rootfs image as initramfs...
[    2.767794] Initialise system trusted keyrings
[    2.769865] Key type blacklist registered
[    2.782242] workingset: timestamp_bits=36 max_order=18 bucket_order=0
[    2.783507] zbud: loaded
[    2.792040] fuse: init (API version 7.41)
[    2.804155] integrity: Platform Keyring initialized
[    2.805369] integrity: Machine keyring initialized
[    3.096164] Key type asymmetric registered
[    3.096700] Asymmetric key parser 'x509' registered
[    3.760067] tsc: Refined TSC clocksource calibration: 1000.000 MHz
[    3.761073] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x1cd42e4dffb, max_idle_ns: 881590591483 ns
[    3.763513] clocksource: Switched to clocksource tsc
[    4.833224] Freeing initrd memory: 47248K
[    5.085801] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 246)
[    5.087801] io scheduler mq-deadline registered
[    5.106197] ledtrig-cpu: registered to indicate activity on CPUs
[    5.107888] shpchp: Standard Hot Plug PCI Controller Driver version: 0.4
[    5.115859] Serial: 8250/16550 driver, 4 ports, IRQ sharing enabled
[    5.122171] 00:04: ttyS0 at I/O 0x3f8 (irq = 4, base_baud = 115200) is a 16550A
[    5.135831] Linux agpgart interface v0.103
[    5.146479] i8042: PNP: PS/2 Controller [PNP0303:KBD,PNP0f13:MOU] at 0x60,0x64 irq 1,12
[    5.151996] serio: i8042 KBD port at 0x60,0x64 irq 1
[    5.152744] serio: i8042 AUX port at 0x60,0x64 irq 12
[    5.154682] mousedev: PS/2 mouse device common for all mice
[    5.159266] input: AT Translated Set 2 keyboard as /devices/platform/i8042/serio0/input/input0
[    5.162671] rtc_cmos 00:05: RTC can wake from S4
[    5.178922] rtc_cmos 00:05: registered as rtc0
[    5.181070] rtc_cmos 00:05: setting system clock to 2025-11-14T00:00:00 UTC (1763078400)
[    5.187214] rtc_cmos 00:05: alarms up to one day, y3k, 242 bytes nvram, hpet irqs
[    5.188824] amd_pstate: the _CPC object is not present in SBIOS or ACPI disabled
[    5.195916] NET: Registered PF_INET6 protocol family
[    5.266098] Segment Routing with IPv6
[    5.267914] In-situ OAM (IOAM) with IPv6
[    5.269208] mip6: Mobile IPv6
[    5.269855] NET: Registered PF_PACKET protocol family
[    5.271391] mpls_gso: MPLS GSO support
[    5.275646] IPI shorthand broadcast: enabled
[    5.296909] sched_clock: Marking stable (5345155120, -49078331)->(14857629278, -9561552489)
[    5.302101] registered taskstats version 1
[    5.304989] Loading compiled-in X.509 certificates
[    5.420462] Loaded X.509 cert 'Build time autogenerated kernel key: 7c2b230a25e7258756ba9d8e66b30d6d89429d6d'
[    5.434684] Demotion targets for Node 0: null
[    5.436407] Key type .fscrypt registered
[    5.436791] Key type fscrypt-provisioning registered
[    5.685521] Key type encrypted registered
[    5.700004] AppArmor: AppArmor sha256 policy hashing enabled
[    5.702876] ima: No TPM chip found, activating TPM-bypass!
[    5.703961] ima: Allocated hash algorithm: sha256
[    5.707162] ima: No architecture policies found
[    5.709019] evm: Initialising EVM extended attributes:
[    5.709554] evm: security.selinux
[    5.709867] evm: security.SMACK64 (disabled)
[    5.710340] evm: security.SMACK64EXEC (disabled)
[    5.710658] evm: security.SMACK64TRANSMUTE (disabled)
[    5.711127] evm: security.SMACK64MMAP (disabled)
[    5.711509] evm: security.apparmor
[    5.711737] evm: security.ima
[    5.712119] evm: security.capability
[    5.712428] evm: HMAC attrs: 0x1
[    6.585683] RAS: Correctable Errors collector initialized.
[    6.810288] clk: Disabling unused clocks
[    6.811416] PM: genpd: Disabling unused power domains
[    6.854980] Freeing unused decrypted memory: 2028K
[    6.979944] Freeing unused kernel image (initmem) memory: 4152K
[    7.149895] Write protecting the kernel read-only data: 28672k
[    7.159529] Freeing unused kernel image (rodata/data gap) memory: 488K
[    7.320366] x86/mm: Checked W+X mappings: passed, no W+X pages found.
[    7.438816] Run /init as init process`,
    },
    {
      step: 0.035,
      wait: 0.2,
      text: `Loading, please wait...
[    8.459383] udevd[159]: starting version 3.2.14
[   10.499508] random: crng init done
[   10.556283] udevd[160]: starting eudev-3.2.14
[   11.113252] input: Power Button as /devices/LNXSYSTM:00/LNXPWRBN:00/input/input2
[   11.119991] ACPI: button: Power Button [PWRF]
[   11.588440] Floppy drive(s): fd0 is 2.88M AMI BIOS
[   12.195246] FDC 0 is a S82078B
[   12.557720] e1000: Intel(R) PRO/1000 Network Driver
[   12.559072] e1000: Copyright (c) 1999-2006 Intel Corporation.
[   12.591365] piix4_smbus 0000:00:01.3: SMBus Host Controller at 0x700, revision 0
[   12.651972] i2c i2c-0: Memory type 0x07 not supported yet, not instantiating SPD
[   12.674914] ACPI: \\_SB_.LNKC: Enabled at IRQ 11
[   13.390809] SCSI subsystem initialized
[   13.869034] input: ImExPS/2 Generic Explorer Mouse as /devices/platform/i8042/serio1/input/input3
[   13.973215] scsi host0: ata_piix
[   13.980095] e1000 0000:00:03.0 eth0: (PCI:33MHz:32-bit) 52:54:00:12:34:56
[   13.982075] e1000 0000:00:03.0 eth0: Intel(R) PRO/1000 Network Connection
[   13.991632] scsi host1: ata_piix
[   13.992911] ata1: PATA max MWDMA2 cmd 0x1f0 ctl 0x3f6 bmdma 0xc040 irq 14 lpm-pol 0
[   13.993822] ata2: PATA max MWDMA2 cmd 0x170 ctl 0x376 bmdma 0xc048 irq 15 lpm-pol 0
[   14.217690] ata2: found unknown device (class 0)
[   14.226411] ata2.00: ATAPI: QEMU DVD-ROM, 2.5+, max UDMA/100
[   14.254646] scsi 1:0:0:0: CD-ROM            QEMU     QEMU DVD-ROM     2.5+ PQ: 0 ANSI: 5
[   14.448195] sr 1:0:0:0: [sr0] scsi3-mmc drive: 4x/4x cd/rw xa/form2 tray
[   14.449559] cdrom: Uniform CD-ROM driver Revision: 3.20
Begin: Loading essential drivers ... done.
Begin: Running /scripts/init-premount ... done.
Begin: Mounting root file system ... Begin: Running /scripts/live-top ... done.
Begin: Running /scripts/live-premount ... done.
[   16.342064] loop: module loaded
[   16.488116] loop0: detected capacity change from 0 to 1637192
[   16.902186] squashfs: version 4.0 (2009/01/31) Phillip Lougher
Begin: Running /scripts/live-realpremount ... done.
Begin: Mounting "/run/live/medium/live/filesystem.squashfs" on "/run/live/rootfs/filesystem.squashfs" via "/dev/loop0" ... done.
[   17.450732] evm: overlay not supported
done.
Begin: Configuring fstab ... done.
Begin: Preconfiguring networking ... done.
Begin: Running /scripts/live-bottom ... done.
Begin: Running /scripts/init-bottom ... done.
[   20.853266] Not activating Mandatory Access Control as /sbin/tomoyo-init does not exist.`,
    },
    {
      step: 0.03,
      wait: 0.2,
      text: `INIT: version 3.14 booting
INIT: No inittab.d directory found
Using makefile-style concurrent boot in runlevel S.
live-config: debconf hostname sudo
[   50.085203] clocksource: Long readout interval, skipping watchdog check: cs_nsec: 7986168113 wd_nsec: 7986168070
 locales
haveged: haveged starting up
 tzdata
Current default time zone: 'Etc/UTC'
Local time is now:      Fri Nov 14 00:01:06 UTC 2025.
Universal Time is now:  Fri Nov 14 00:01:06 UTC 2025.

 keyboard-configuration sysv-rc util-linux loginhaveged: command socket is listening at fd 3
 openssh-server+haveged console-setup Setting up console font and keymap...done.
.
Starting hot-plug events dispatcher: udevd[   83.257966] udevd[688]: starting version 3.2.14
[   83.662914] udevd[689]: starting eudev-3.2.14
.
Synthesizing the initial hotplug events (subsystems)...done.
Synthesizing the initial hotplug events (devices)...done.
Waiting for /dev to be fully populated...[   88.309049] parport_pc 00:03: reported by Plug and Play ACPI
[   88.369974] input: PC Speaker as /devices/platform/pcspkr/input/input4
[   88.633518] sr 1:0:0:0: Attached scsi generic sg0 type 5
[   89.254785] parport0: PC-style at 0x378, irq 7 [PCSPP,TRISTATE]
[   89.853997] ACPI: bus type drm_connector registered
[   92.894495] bochs-drm 0000:00:02.0: vgaarb: deactivate vga console
[   92.976383] Console: switching to colour dummy device 80x25
[   93.130637] [drm] Found bochs VGA, ID 0xb0c5.
[   93.132833] [drm] Framebuffer size 16384 kB @ 0xfd000000, mmio @ 0xfebf0000.
[   93.377559] [drm] Found EDID data blob.
[   93.908660] [drm] Initialized bochs-drm 1.0.0 for 0000:00:02.0 on minor 0
[   94.209177] ppdev: user-space parallel port driver
[   94.271461] fbcon: bochs-drmdrmfb (fb0) is primary device
[   94.424689] Console: switching to colour frame buffer device 160x50
[   94.615903] bochs-drm 0000:00:02.0: [drm] fb0: bochs-drmdrmfb frame buffer device
[   96.131957] kvm_amd: Nested Virtualization enabled
[   96.192601] kvm_amd: Nested Paging disabled
[   96.233386] kvm_amd: PMU virtualization is disabled
[   97.567181] powernow_k8: Power state transitions not supported
done.
Starting boot logger: bootlogd
Setting up keyboard layout...done.
Activating swap...done.
Creating compatibility symlink from /etc/mtab to /proc/mounts. ... (warning).
Cleaning up temporary files...
 /tmp.
[  108.753129] device-mapper: core: CONFIG_IMA_DISABLE_HTABLE is disabled. Duplicate IMA measurements will not be recorded in the IMA log.
[  108.758562] device-mapper: uevent: version 1.0.3
[  108.766754] device-mapper: ioctl: 4.48.0-ioctl (2023-03-01) initialised: dm-devel@lists.linux.dev
Starting early crypto disks...done.
Starting remaining crypto disks...done.
Checking file systems...done.
Mounting local filesystems...done.
Activating swapfile swap, if any...done.
nohup: redirecting stderr to stdout
Cleaning up temporary files....
Starting Setting kernel variables: sysctl.
Starting Braille terminal driver: brltty.
[  123.275377] input: BRLTTY 6.7 Linux Screen Driver Keyboard as /devices/virtual/input/input5
[  125.220755] e1000: eth0 NIC Link is Up 1000 Mbps Full Duplex, Flow Control: RX
Configuring network interfaces...Internet Systems Consortium DHCP Client 4.4.3-P1
Copyright 2004-2022 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/

Listening on LPF/eth0/52:54:00:12:34:56
Sending on   LPF/eth0/52:54:00:12:34:56
Sending on   Socket/fallback
Created duid "\\000\\001\\000\\0012Z\\027\\305RT\\000\\0224V".
DHCPDISCOVER on eth0 to 255.255.255.255 port 67 interval 3
DHCPOFFER of 10.0.2.15 from 10.0.2.2
DHCPREQUEST for 10.0.2.15 on eth0 to 255.255.255.255 port 67
DHCPACK of 10.0.2.15 from 10.0.2.2
bound to 10.0.2.15 -- renewal in 32966 seconds.
done.
Cleaning up temporary files....
Setting up ALSA...done (none loaded).
Setting up X socket directories... /tmp/.X11-unix /tmp/.ICE-unix.
INIT: Entering runlevel: 2
Using makefile-style concurrent boot in runlevel 2.
Starting acpi_fakekey daemon...done.
Setting up console font and keymap...done.
Starting enhanced syslogd: rsyslogd
.
Starting ACPI services: acpid.
Starting deferred execution scheduler: atd.
Starting periodic command scheduler: cron.
Starting system message bus: dbus.
Starting session management daemon: elogind.
Not starting fetchmail daemon, disabled via /etc/default/fetchmail.
Starting mouse interface server: gpm.
Starting NTP server: ntpd2025-11-14T00:02:31 ntpd[1960]: INIT: ntpd ntpsec-1.2.3: Starting
2025-11-14T00:02:32 ntpd[1960]: INIT: Command line: /usr/sbin/ntpd -p /run/ntpd.pid -c /etc/ntpsec/ntp.conf -g -u ntpsec:ntpsec
.
Starting OpenBSD Secure Shell server: sshd.`,
    },
    {
      step: 0.08,
      wait: 0.3,
      text: `
Devuan GNU/Linux excalibur {{host}} tty1

{{host}} login: `,
    },
  ],
}

export default boot
