import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'arch',
  shell: { login: true, prompt: '[{{user}}@{{short}} ~]$ ' },
  sections: [
    {
      step: 0.003,
      text: `[    0.000000] Linux version 6.6.63 (wasmvm@wasmvm) (riscv64-linux-gnu-gcc (Debian 12.2.0-13) 12.2.0, GNU ld (GNU Binutils for Debian) 2.40) #1 SMP Thu Nov 14 2024
[    0.000000] Machine model: riscv-virtio,qemu
[    0.000000] SBI specification v2.0 detected
[    0.000000] SBI implementation ID=0x574d Version=0x100
[    0.000000] SBI TIME extension detected
[    0.000000] SBI IPI extension detected
[    0.000000] SBI RFENCE extension detected
[    0.000000] SBI SRST extension detected
[    0.000000] earlycon: sbi0 at I/O port 0x0 (options '')
[    0.000000] printk: bootconsole [sbi0] enabled
[    0.000000] efi: UEFI not found.
[    0.000000] Zone ranges:
[    0.000000]   DMA32    [mem 0x0000000080000000-0x00000000bfffffff]
[    0.000000]   Normal   empty
[    0.000000] Movable zone start for each node
[    0.000000] Early memory node ranges
[    0.000000]   node   0: [mem 0x0000000080000000-0x00000000bfffffff]
[    0.000000] Initmem setup node 0 [mem 0x0000000080000000-0x00000000bfffffff]
[    0.000000] SBI HSM extension detected
[    0.000000] Falling back to deprecated "riscv,isa"
[    0.000000] riscv: base ISA extensions acdfim
[    0.000000] riscv: ELF capabilities acdfim
[    0.000000] percpu: Embedded 18 pages/cpu s42104 r0 d31624 u73728
[    0.000000] Kernel command line: root=/dev/vda rw console=ttyS0 earlycon=sbi plymouth.enable=0
[    0.000000] Dentry cache hash table entries: 131072 (order: 8, 1048576 bytes, linear)
[    0.000000] Inode-cache hash table entries: 65536 (order: 7, 524288 bytes, linear)
[    0.000000] Built 1 zonelists, mobility grouping on.  Total pages: 258048
[    0.000000] mem auto-init: stack:all(zero), heap alloc:off, heap free:off
[    0.000000] Virtual kernel memory layout:
[    0.000000]       fixmap : 0xff1bfffffea00000 - 0xff1bffffff000000   (6144 kB)
[    0.000000]       pci io : 0xff1bffffff000000 - 0xff1c000000000000   (  16 MB)
[    0.000000]      vmemmap : 0xff1c000000000000 - 0xff20000000000000   (1024 TB)
[    0.000000]      vmalloc : 0xff20000000000000 - 0xff60000000000000   (16384 TB)
[    0.000000]      modules : 0xffffffff0179e000 - 0xffffffff80000000   (2024 MB)
[    0.000000]       lowmem : 0xff60000000000000 - 0xff60000040000000   (1024 MB)
[    0.000000]       kernel : 0xffffffff80000000 - 0xffffffffffffffff   (2047 MB)
[    0.000000] Memory: 989528K/1048576K available (10367K kernel code, 5056K rwdata, 4096K rodata, 2201K init, 539K bss, 59048K reserved, 0K cma-reserved)
[    0.000000] SLUB: HWalign=64, Order=0-3, MinObjects=0, CPUs=1, Nodes=1
[    0.000000] rcu: Hierarchical RCU implementation.
[    0.000000] rcu: 	RCU restricting CPUs from NR_CPUS=64 to nr_cpu_ids=1.
[    0.000000] rcu: 	RCU debug extended QS entry/exit.
[    0.000000] 	Tracing variant of Tasks RCU enabled.
[    0.000000] rcu: RCU calculated value of scheduler-enlistment delay is 25 jiffies.
[    0.000000] rcu: Adjusting geometry for rcu_fanout_leaf=16, nr_cpu_ids=1
[    0.000000] NR_IRQS: 64, nr_irqs: 64, preallocated irqs: 0
[    0.000000] riscv-intc: 64 local interrupts mapped
[    0.000000] plic: plic@c000000: mapped 95 interrupts with 1 handlers for 2 contexts.
[    0.000000] riscv: providing IPIs using SBI IPI extension
[    0.000000] rcu: srcu_init: Setting srcu_struct sizes based on contention.
[    0.000000] clocksource: riscv_clocksource: mask: 0xffffffffffffffff max_cycles: 0x24e6a1710, max_idle_ns: 440795202120 ns
[    0.000000] sched_clock: 64 bits at 10MHz, resolution 100ns, wraps every 4398046511100ns
[    0.000203] Console: colour dummy device 80x25
[    0.000234] Calibrating delay loop (skipped), value calculated using timer frequency.. 20.00 BogoMIPS (lpj=40000)
[    0.000259] pid_max: default: 32768 minimum: 301
[    0.000338] LSM: initializing lsm=capability,integrity
[    0.000455] Mount-cache hash table entries: 2048 (order: 2, 16384 bytes, linear)
[    0.000478] Mountpoint-cache hash table entries: 2048 (order: 2, 16384 bytes, linear)
[    0.002303] RCU Tasks Trace: Setting shift to 0 and lim to 1 rcu_task_cb_adjust=1 rcu_task_cpu_ids=1.
[    0.002413] riscv: ELF compat mode unsupported
[    0.002425] ASID allocator using 16 bits (65536 entries)
[    0.002589] rcu: Hierarchical SRCU implementation.
[    0.002601] rcu: 	Max phase no-delay instances is 1000.
[    0.002835] EFI services will not be available.
[    0.002966] smp: Bringing up secondary CPUs ...
[    0.002983] smp: Brought up 1 node, 1 CPU
[    0.003459] devtmpfs: initialized
[    0.005127] clocksource: jiffies: mask: 0xffffffff max_cycles: 0xffffffff, max_idle_ns: 7645041785100000 ns
[    0.005151] futex hash table entries: 256 (order: 2, 16384 bytes, linear)
[    0.005307] pinctrl core: initialized pinctrl subsystem
[    0.006793] NET: Registered PF_NETLINK/PF_ROUTE protocol family
[    0.007473] DMA: preallocated 128 KiB GFP_KERNEL pool for atomic allocations
[    0.007506] DMA: preallocated 128 KiB GFP_KERNEL|GFP_DMA32 pool for atomic allocations
[    0.007557] audit: initializing netlink subsys (disabled)
[    0.008102] thermal_sys: Registered thermal governor 'step_wise'
[    0.008129] audit: type=2000 audit(0.004:1): state=initialized audit_enabled=0 res=1
[    0.008171] cpuidle: using governor menu
[    0.032092] cpu0: Ratio of byte access time to unaligned word access is 8.08, unaligned accesses are fast
[    0.035478] HugeTLB: registered 2.00 MiB page size, pre-allocated 0 pages
[    0.035493] HugeTLB: 28 KiB vmemmap can be freed for a 2.00 MiB page
[    0.100171] raid6: int64x8  gen()   268 MB/s
[    0.168235] raid6: int64x4  gen()   364 MB/s
[    0.236329] raid6: int64x2  gen()   375 MB/s
[    0.304409] raid6: int64x1  gen()   332 MB/s
[    0.304422] raid6: using algorithm int64x2 gen() 375 MB/s
[    0.372503] raid6: .... xor() 204 MB/s, rmw enabled
[    0.372516] raid6: using intx1 recovery algorithm
[    0.372662] ACPI: Interpreter disabled.
[    0.372786] iommu: Default domain type: Translated
[    0.372799] iommu: DMA domain TLB invalidation policy: strict mode
[    0.373338] SCSI subsystem initialized
[    0.373862] Advanced Linux Sound Architecture Driver Initialized.
[    0.374832] clocksource: Switched to clocksource riscv_clocksource
[    0.375169] pnp: PnP ACPI: disabled
[    0.384729] NET: Registered PF_INET protocol family
[    0.384971] IP idents hash table entries: 16384 (order: 5, 131072 bytes, linear)
[    0.389381] tcp_listen_portaddr_hash hash table entries: 512 (order: 2, 16384 bytes, linear)
[    0.389428] Table-perturb hash table entries: 65536 (order: 6, 262144 bytes, linear)
[    0.389454] TCP established hash table entries: 8192 (order: 4, 65536 bytes, linear)
[    0.389622] TCP bind hash table entries: 8192 (order: 7, 524288 bytes, linear)
[    0.390306] TCP: Hash tables configured (established 8192 bind 8192)
[    0.390380] UDP hash table entries: 512 (order: 3, 49152 bytes, linear)
[    0.390461] UDP-Lite hash table entries: 512 (order: 3, 49152 bytes, linear)
[    0.390644] NET: Registered PF_UNIX/PF_LOCAL protocol family
[    0.391105] RPC: Registered named UNIX socket transport module.
[    0.391118] RPC: Registered udp transport module.
[    0.391131] RPC: Registered tcp transport module.
[    0.391143] RPC: Registered tcp-with-tls transport module.
[    0.391157] RPC: Registered tcp NFSv4.1 backchannel transport module.
[    0.391208] kvm [1]: hypervisor extension not available
[    0.392040] workingset: timestamp_bits=46 max_order=18 bucket_order=0
[    0.392567] NFS: Registering the id_resolver key type
[    0.392610] Key type id_resolver registered
[    0.392622] Key type id_legacy registered
[    0.392654] nfs4filelayout_init: NFSv4 File Layout Driver Registering...
[    0.392674] nfs4flexfilelayout_init: NFSv4 Flexfile Layout Driver Registering...
[    0.392839] 9p: Installing v9fs 9p2000 file system support
[    0.456192] jitterentropy: Initialization failed with host not compliant with requirements: 9
[    0.456209] NET: Registered PF_ALG protocol family
[    0.456225] xor: measuring software checksum speed
[    0.459152]    8regs           :  1125 MB/sec
[    0.462078]    8regs_prefetch  :  1126 MB/sec
[    0.465007]    32regs          :  1125 MB/sec
[    0.467939]    32regs_prefetch :  1124 MB/sec
[    0.467952] xor: using function: 8regs_prefetch (1126 MB/sec)
[    0.468002] Block layer SCSI generic (bsg) driver version 0.4 loaded (major 246)
[    0.468018] io scheduler mq-deadline registered
[    0.468031] io scheduler kyber registered
[    0.468055] io scheduler bfq registered
[    0.471527] input: wasm-vm virtio keyboard as /devices/platform/soc/10004000.virtio_mmio/virtio3/input/input0
[    0.471925] input: wasm-vm virtio tablet as /devices/platform/soc/10005000.virtio_mmio/virtio4/input/input1
[    0.472309] input: wasm-vm virtio mouse as /devices/platform/soc/10006000.virtio_mmio/virtio5/input/input2
[    0.532098] Serial: 8250/16550 driver, 4 ports, IRQ sharing disabled
[    0.534204] printk: console [ttyS0] disabled
[    0.534555] 10000000.serial: ttyS0 at MMIO 0x10000000 (irq = 15, base_baud = 230400) is a 16550A
[    0.534588] printk: console [ttyS0] enabled
[    0.534615] printk: bootconsole [sbi0] disabled
[    0.534588] printk: console [ttyS0] enabled
[    0.534615] printk: bootconsole [sbi0] disabled
[    0.535024] SuperH (H)SCI(F) driver initialized
[    0.537099] random: crng init done
[    0.538167] [drm] features: -virgl +edid -resource_blob -host_visible
[    0.538175] [drm] features: -context_init
[    0.538355] [drm] number of scanouts: 1
[    0.538373] [drm] number of cap sets: 0
[    0.539152] [drm] Initialized virtio_gpu 0.1.0 0 for 10008000.virtio_mmio on minor 0
[    0.565296] Console: switching to colour frame buffer device 160x50
[    0.583491] virtio-mmio 10008000.virtio_mmio: [drm] fb0: virtio_gpudrmfb frame buffer device
[    0.588934] loop: module loaded
[    0.588982] virtio_blk virtio0: 1/0/0 default/read/poll queues
[    0.589181] virtio_blk virtio0: [vda] 8388608 512-byte logical blocks (4.29 GB/4.00 GiB)
[    0.593598] mousedev: PS/2 mouse device common for all mice
[    0.594335] goldfish_rtc 101000.rtc: registered as rtc0
[    0.594364] goldfish_rtc 101000.rtc: setting system clock to 2025-11-14T00:00:00 UTC (1763078400)
[    0.594881] syscon-poweroff poweroff: pm_power_off already claimed for sbi_srst_power_off
[    0.594919] syscon-poweroff: probe of poweroff failed with error -16
[    0.595250] device-mapper: ioctl: 4.48.0-ioctl (2023-03-01) initialised: dm-devel@redhat.com
[    0.595679] sdhci: Secure Digital Host Controller Interface driver
[    0.595702] sdhci: Copyright(c) Pierre Ossman
[    0.595875] sdhci-pltfm: SDHCI platform and OF driver helper
[    0.597492] IPVS: Registered protocols (TCP, UDP)
[    0.597517] IPVS: Connection hash table configured (size=4096, memory=32Kbytes)
[    0.597682] IPVS: ipvs loaded.
[    0.597699] IPVS: [rr] scheduler registered.
[    0.597976] Initializing XFRM netlink socket
[    0.598034] NET: Registered PF_INET6 protocol family
[    0.598918] Segment Routing with IPv6
[    0.598962] In-situ OAM (IOAM) with IPv6
[    0.599104] sit: IPv6, IPv4 and MPLS over IPv4 tunneling driver
[    0.599680] NET: Registered PF_PACKET protocol family
[    0.599737] Bridge firewalling registered
[    0.599799] 8021q: 802.1Q VLAN Support v1.8
[    0.599889] 9pnet: Installing 9P2000 support
[    0.599951] Key type dns_resolver registered
[    0.635835] debug_vm_pgtable: [debug_vm_pgtable         ]: Validating architecture page table helpers
[    0.637665] Btrfs loaded, zoned=no, fsverity=no
[    0.638053] Legacy PMU implementation is available
[    0.638216] clk: Disabling unused clocks
[    0.638238] ALSA device list:
[    0.638253]   #0: VirtIO SoundCard at platform/10007000.virtio_mmio/virtio6
[    0.641577] EXT4-fs (vda): mounted filesystem d07702aa-4f31-44b2-a5b0-9dbec2511e25 r/w with ordered data mode. Quota mode: disabled.
[    0.641623] VFS: Mounted root (ext4 filesystem) on device 254:0.
[    0.641766] devtmpfs: mounted
[    0.642748] Freeing unused kernel image (initmem) memory: 2200K
[    0.642774] Run /sbin/init as init process`,
    },
    {
      step: 0.017,
      wait: 0.3,
      text: `[    1.604108] systemd[1]: systemd 261.2-1-arch running in system mode (+PAM +AUDIT -SELINUX +APPARMOR -IMA +IPE +SMACK +SECCOMP +GCRYPT +GNUTLS +OPENSSL +ACL +BLKID +CURL +ELFUTILS +FIDO2 +IDN2 +KMOD +LIBCRYPTSETUP +LIBCRYPTSETUP_PLUGINS +LIBFDISK +PCRE2 +PWQUALITY +P11KIT +QRENCODE +TPM2 +BZIP2 +LZ4 +XZ +ZLIB +ZSTD +BPF_FRAMEWORK +BTF +XKBCOMMON +UTMP +LIBARCHIVE)
[    1.604162] systemd[1]: Detected architecture riscv64.

Welcome to Arch Linux!

[    1.606545] systemd[1]: Initializing machine ID from random generator.
[    1.609824] systemd[1]: Hostname set to <{{host}}>.
[    2.132144] systemd[1]: bpf-restrict-fs: BPF LSM hook not enabled in the kernel, BPF LSM not supported.
[    3.410330] systemd[1]: Queued start job for default target Graphical Interface.
[    3.433611] systemd[1]: Created slice Slice /system/dirmngr.
[  OK  ] Created slice Slice /system/dirmngr.
[    3.436302] systemd[1]: Created slice Slice /system/gpg-agent.
[  OK  ] Created slice Slice /system/gpg-agent.
[    3.438937] systemd[1]: Created slice Slice /system/gpg-agent-browser.
[  OK  ] Created slice Slice /system/gpg-agent-browser.
[    3.441519] systemd[1]: Created slice Slice /system/gpg-agent-extra.
[  OK  ] Created slice Slice /system/gpg-agent-extra.
[    3.444152] systemd[1]: Created slice Slice /system/gpg-agent-ssh.
[  OK  ] Created slice Slice /system/gpg-agent-ssh.
[    3.446756] systemd[1]: Created slice Slice /system/keyboxd.
[  OK  ] Created slice Slice /system/keyboxd.
[    3.449434] systemd[1]: Created slice Slice /system/modprobe.
[  OK  ] Created slice Slice /system/modprobe.
[    3.452034] systemd[1]: Created slice Slice /system/serial-getty.
[  OK  ] Created slice Slice /system/serial-getty.
[    3.453580] systemd[1]: Created slice User and Session Slice.
[  OK  ] Created slice User and Session Slice.
[    3.454169] systemd[1]: Started Forward Password Requests to Wall Directory Watch.
[  OK  ] Started Forward Password Requests to Wall Directory Watch.
[    3.454636] systemd[1]: Arbitrary Executable File Formats File System Automount Point skipped, unmet condition check ConditionPathExists=/proc/sys/fs/binfmt_misc
[    3.454725] systemd[1]: Expecting device /dev/ttyS0...
         Expecting device /dev/ttyS0...
[    3.455221] systemd[1]: Reached target Image Downloads.
[  OK  ] Reached target Image Downloads.
[    3.455644] systemd[1]: Reached target Local Integrity Protected Volumes.
[  OK  ] Reached target Local Integrity Protected Volumes.
[    3.456156] systemd[1]: Reached target Slice Units.
[  OK  ] Reached target Slice Units.
[    3.456609] systemd[1]: Reached target Swaps.
[  OK  ] Reached target Swaps.
[    3.457062] systemd[1]: Reached target Local Verity Protected Volumes.
[  OK  ] Reached target Local Verity Protected Volumes.
[    3.457839] systemd[1]: Listening on Device-mapper event daemon FIFOs.
[  OK  ] Listening on Device-mapper event daemon FIFOs.
[    3.473392] systemd[1]: Listening on Query the User Interactively for a Password.
[  OK  ] Listening on Query the User Interactively for a Password.
[    3.487563] systemd[1]: Listening on Process Core Dump Socket.
[  OK  ] Listening on Process Core Dump Socket.
[    3.497318] systemd[1]: Listening on Credential Encryption/Decryption.
[  OK  ] Listening on Credential Encryption/Decryption.
[    3.513194] systemd[1]: Listening on Factory Reset Management.
[  OK  ] Listening on Factory Reset Management.
[    3.513842] systemd[1]: Listening on Hostname Service Socket.
[  OK  ] Listening on Hostname Service Socket.
[    3.514589] systemd[1]: Listening on Journal Socket (/dev/log).
[  OK  ] Listening on Journal Socket (/dev/log).
[    3.515338] systemd[1]: Listening on Journal Sockets.
[  OK  ] Listening on Journal Sockets.
[    3.531292] systemd[1]: Listening on Console Output Muting Service Socket.
[  OK  ] Listening on Console Output Muting Service Socket.
[    3.531798] systemd[1]: TPM PCR Measurements skipped, unmet condition check ConditionSecurity=measured-os
[    3.531920] systemd[1]: Make TPM PCR Policy skipped, unmet condition check ConditionSecurity=measured-uki
[    3.542000] systemd[1]: Listening on Disk Repartitioning Service Socket.
[  OK  ] Listening on Disk Repartitioning Service Socket.
[    3.558050] systemd[1]: Listening on Simple Block Device Backed Storage Provider.
[  OK  ] Listening on Simple Block Device Backed Storage Provider.
[    3.574337] systemd[1]: Listening on Simple File System Backed Storage Provider.
[  OK  ] Listening on Simple File System Backed Storage Provider.
[    3.575051] systemd[1]: Listening on udev Control Socket.
[  OK  ] Listening on udev Control Socket.
[    3.575673] systemd[1]: Listening on udev Kernel Socket.
[  OK  ] Listening on udev Kernel Socket.
[    3.576314] systemd[1]: Listening on udev Varlink Socket.
[  OK  ] Listening on udev Varlink Socket.
[    3.583013] systemd[1]: Mounting Huge Pages File System...
         Mounting Huge Pages File System...
[    3.595049] systemd[1]: Mounting POSIX Message Queue File System...
         Mounting POSIX Message Queue File System...
[    3.611227] systemd[1]: Mounting Kernel Debug File System...
         Mounting Kernel Debug File System...
[    3.612147] systemd[1]: Kernel Trace File System skipped, unmet condition check ConditionPathExists=/sys/kernel/tracing
[    3.612704] systemd[1]: tmp.mount: x-systemd.graceful-option=usrquota specified, but option is not available, suppressing.
[    3.631020] systemd[1]: Mounting Temporary Directory /tmp...
         Mounting Temporary Directory /tmp...
[    3.631669] systemd[1]: Create List of Static Device Nodes skipped, unmet condition check ConditionFileNotEmpty=/lib/modules/6.6.63/modules.devname
[    3.671212] systemd[1]: Starting Load Kernel Module configfs...
         Starting Load Kernel Module configfs...
[    3.671636] systemd[1]: Load Kernel Module drm skipped, unmet condition check ConditionKernelModuleLoaded=!drm
[    3.707293] systemd[1]: Starting Load Kernel Module fuse...
         Starting Load Kernel Module fuse...
[    3.708251] systemd[1]: File System Check on Root Device skipped, unmet condition check ConditionPathIsReadWrite=!/
[    3.708445] systemd[1]: Clear Stale Hibernate Storage Info skipped, unmet condition check ConditionPathExists=/sys/firmware/efi/efivars/HibernateLocation-8cf2644b-4b0b-428f-9387-6d876050dc67
[    3.787227] systemd[1]: Starting Journal Service...
         Starting Journal Service...
[    3.795704] systemd[1]: Load Kernel Modules skipped, no trigger condition checks were met.
[    3.795856] systemd[1]: TPM PCR Machine ID Measurement skipped, unmet condition check ConditionSecurity=measured-os
[    3.796068] systemd[1]: TPM PCR OS Separator skipped, unmet condition check ConditionSecurity=measured-os
[    3.831319] systemd[1]: Starting Remount Root and Kernel File Systems...
         Starting Remount Root and Kernel File Systems...
[    3.903210] systemd[1]: Starting Apply Kernel Variables...
         Starting Apply Kernel Variables...
[    3.955218] systemd[1]: Starting Create Static Device Nodes in /dev gracefully...
         Starting Create Static Device Nodes in /dev gracefully...
[    3.955689] systemd[1]: Early TPM SRK Setup skipped, unmet condition check ConditionSecurity=measured-os
[    3.955864] systemd[1]: TPM PCR NvPCR Initialization Separator skipped, unmet condition check ConditionPathExists=/etc/initrd-release
[    3.956047] systemd[1]: TPM NvPCR Product ID Measurement skipped, unmet condition check ConditionSecurity=measured-os
[    4.030509] systemd[1]: Starting Load udev Rules from Credentials...
         Starting Load udev Rules from Credentials...
[    4.071234] systemd[1]: Starting Coldplug All udev Devices...
         Starting Coldplug All udev Devices...
[    4.111293] systemd[1]: Starting Virtual Console Setup...
         Starting Virtual Console Setup...
[    4.234133] systemd[1]: Mounted Huge Pages File System.
[  OK  ] Mounted Huge Pages File System.
[    4.265687] systemd[1]: Mounted POSIX Message Queue File System.
[  OK  ] Mounted POSIX Message Queue File System.
[    4.287430] systemd[1]: Mounted Kernel Debug File System.
[  OK  ] Mounted Kernel Debug File System.
[    4.295430] systemd[1]: Mounted Temporary Directory /tmp.
[  OK  ] Mounted Temporary Directory /tmp.
[    4.296653] systemd[1]: modprobe@configfs.service: Deactivated successfully.
[    4.318892] systemd[1]: Finished Load Kernel Module configfs.
[  OK  ] Finished Load Kernel Module configfs.
[    4.321845] systemd[1]: modprobe@fuse.service: Deactivated successfully.
[    4.322664] systemd[1]: Finished Load Kernel Module fuse.
[  OK  ] Finished Load Kernel Module fuse.
[    4.351046] systemd[1]: Finished Apply Kernel Variables.
[  OK  ] Finished Apply Kernel Variables.
[    4.375526] systemd[1]: FUSE Control File System skipped, unmet condition check ConditionPathExists=/sys/fs/fuse/connections
[    4.376131] systemd[1]: Kernel Configuration File System skipped, unmet condition check ConditionPathExists=/sys/kernel/config
[    4.390920] EXT4-fs (vda): re-mounted d07702aa-4f31-44b2-a5b0-9dbec2511e25 r/w. Quota mode: disabled.
[    4.399003] systemd[1]: Finished Load udev Rules from Credentials.
[  OK  ] Finished Load udev Rules from Credentials.
[    4.422959] systemd[1]: Finished Remount Root and Kernel File Systems.
[  OK  ] Finished Remount Root and Kernel File Systems.
[    4.428290] systemd[1]: Rebuild Hardware Database skipped, unmet condition check ConditionNeedsUpdate=/etc
[    4.447205] systemd[1]: Starting Load/Save OS Random Seed...
         Starting Load/Save OS Random Seed...
[    4.447586] systemd[1]: TPM SRK Setup skipped, unmet condition check ConditionSecurity=measured-os
[    4.613420] systemd-journald[72]: Collecting audit messages is disabled.
[    4.634455] loadkeys[85]: memfd_create() called without MFD_EXEC or MFD_NOEXEC_SEAL set
[    4.721862] systemd[1]: Finished Load/Save OS Random Seed.
[  OK  ] Finished Load/Save OS Random Seed.
[    4.724783] systemd[1]: Finished Create Static Device Nodes in /dev gracefully.
[  OK  ] Finished Create Static Device Nodes in /dev gracefully.
[    4.739275] systemd[1]: Create System Users skipped, no trigger condition checks were met.
[    4.799022] systemd[1]: Starting Journal Log Access Socket...
         Starting Journal Log Access Socket...
[    4.823254] systemd[1]: Starting Create Static Device Nodes in /dev...
         Starting Create Static Device Nodes in /dev...
[    4.839312] systemd[1]: Finished Virtual Console Setup.
[  OK  ] Finished Virtual Console Setup.
[    4.847011] systemd[1]: Listening on Journal Log Access Socket.
[  OK  ] Listening on Journal Log Access Socket.
[    4.851287] systemd[1]: Started Journal Service.
[  OK  ] Started Journal Service.
         Starting Flush Journal to Persistent Storage...
[    5.143563] systemd-journald[72]: Received client request to flush runtime journal.
[  OK  ] Finished Create Static Device Nodes in /dev.
[  OK  ] Reached target Preparation for Local File Systems.
[  OK  ] Reached target Local File Systems.
[  OK  ] Listening on Boot Loader Control Service Socket.
[  OK  ] Listening on Disk Image Download Service Socket.
[  OK  ] Listening on System Extension Image Management.
         Starting Tell Plymouth To Write Out Runtime Data...
         Starting Rule-based Manager for Device Events and Files...
[  OK  ] Finished Flush Journal to Persistent Storage.
         Starting Create System Files and Directories...
[  OK  ] Finished Tell Plymouth To Write Out Runtime Data.
[  OK  ] Finished Create System Files and Directories.
         Starting Record System Boot/Shutdown in UTMP...
[  OK  ] Started Rule-based Manager for Device Events and Files.
[  OK  ] Finished Record System Boot/Shutdown in UTMP.
[  OK  ] Finished Coldplug All udev Devices.
[  OK  ] Started Dispatch Password Requests to Console Directory Watch.
[  OK  ] Reached target Local Encrypted Volumes.
[  OK  ] Reached target Path Units.
[  OK  ] Reached target System Initialization.
[  OK  ] Started Refresh existing PGP keys of archlinux-keyring regularly.
[  OK  ] Started Daily verification of password and group files.
[  OK  ] Started Daily Cleanup of Temporary Directories.
[  OK  ] Reached target Timer Units.
[  OK  ] Listening on D-Bus System Message Bus Socket.
[  OK  ] Listening on Authorization Manager Agent Helper.
[  OK  ] Listening on OpenSSH Server Socket…temd-ssh-generator, AF_UNIX Local).
[  OK  ] Listening on User Login Management Varlink Socket.
[  OK  ] Listening on Virtual Machine and C…tainer Registration Service Socket.
[  OK  ] Reached target Socket Units.
         Starting D-Bus System Message Bus...
[  OK  ] Started D-Bus System Message Bus.
[  OK  ] Reached target Basic System.
         Starting Network Manager...
         Starting User Login Management...
[  OK  ] Found device /dev/ttyS0.
[  OK  ] Started User Login Management.
[*     ] A start job is running for Network Manager (8s / 10min 4s)
[**    ] A start job is running for Network Manager (9s / 10min 4s)
[***   ] A start job is running for Network Manager (9s / 10min 4s)
[ ***  ] A start job is running for Network Manager (9s / 10min 4s)
[  *** ] A start job is running for Network Manager (10s / 10min 4s)
[   ***] A start job is running for Network Manager (10s / 10min 4s)
[  OK  ] Reached target Sound Card.
         Starting Hostname Service...
[  OK  ] Stopped Virtual Console Setup.
         Stopping Virtual Console Setup...
         Starting Virtual Console Setup...
[  OK  ] Finished Virtual Console Setup.
[  OK  ] Started Hostname Service.
[  OK  ] Started Network Manager.
[  OK  ] Reached target Network.
         Starting Permit User Sessions...
[  OK  ] Finished Permit User Sessions.
         Starting Hold until boot process finishes up...
         Starting Terminate Plymouth Boot Screen...
[  OK  ] Finished Hold until boot process finishes up.
[  OK  ] Started Serial Getty on ttyS0.
[  OK  ] Reached target Login Prompts.
[  OK  ] Finished Terminate Plymouth Boot Screen.
[  OK  ] Reached target Multi-User System.
[  OK  ] Started Simple Desktop Display Manager.
[  OK  ] Reached target Graphical Interface.`,
    },
    {
      step: 0.08,
      wait: 0.2,
      text: `
Arch Linux 6.6.63 (ttyS0)

{{host}} login: `,
    },
  ],
}

export default boot
