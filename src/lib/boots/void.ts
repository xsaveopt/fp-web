import type { Boot } from './engine.ts'

const boot: Boot = {
  name: 'void',
  shell: { login: true, prompt: '[{{user}}@{{short}} ~]$ ' },
  sections: [
    {
      step: 0.08,
      text: `- runit: $Id: 25da3b86f7bed4038b8a039d2f8e8c9bbcf0822b $: booting.
- runit: enter stage: /etc/runit/1`,
    },
    {
      step: 0.09,
      wait: 0.1,
      text: `=> Welcome to Void!
=> Mounting pseudo-filesystems...
=> Loading kernel modules...
crc32c-intel.ko.zst  async_tx.ko.zst  async_xor.ko.zst  async_pq.ko.zst  async_memcpy.ko.zst  async_raid6_recov.ko.zst  md-mod.ko.zst  raid456.ko.zst  dm-raid.ko.zst
=> Starting udev and waiting for devices to settle...
=> Setting up keymap to 'us'...
=> Remounting rootfs read-only...
=> Activating software RAID arrays...
mdadm: No arrays found in config file or automatically
=> Activating btrfs devices...
Scanning for Btrfs filesystems
=> Activating LVM devices...
=> Activating encrypted devices...
=> Activating LVM devices for dm-crypt...
=> Checking filesystems:
=> Mounting rootfs read-write...
=> Mounting all non-network filesystems...
=> Initializing swap...
=> Seeding random number generator...
Saving 256 bits of creditable seed for next boot
=> Setting up loopback interface...
=> Setting up hostname to '{{host}}'...
=> Loading sysctl(8) settings...
kernel.dmesg_restrict = 1
kernel.kexec_load_disabled = 1
kernel.yama.ptrace_scope = 1
kernel.core_uses_pid = 1
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
kernel.kptr_restrict = 1
kernel.perf_event_paranoid = 2
kernel.unprivileged_bpf_disabled = 1
=> Initialization complete, running stage 2...`,
    },
    {
      step: 0.05,
      wait: 0.2,
      text: `- runit: leave stage: /etc/runit/1
- runit: enter stage: /etc/runit/2
runsvchdir: default: now current.

###############################################################################

Welcome to the Void Linux Live system. Two users are available to log in:

	- root:voidlinux
	- anon:voidlinux

The \`anon\` user additionally has \`sudo(8)\` permissions to run any command
without a password.

To start the installation please type:

    # void-installer

and follow the on-screen instructions. To install additional software make
sure to configure your network interface and then use:

	- xbps-install(1) to install/update packages
	- xbps-query(1) to query for package info

The Void Linux Handbook is also available for offline access in multiple
formats, and can be accessed with the \`void-docs(1)\` utility.

Thanks for using Void Linux.

    https://www.voidlinux.org

###############################################################################`,
    },
    { step: 0.08, wait: 0.2, text: `{{host}} login: ` },
  ],
}

export default boot
