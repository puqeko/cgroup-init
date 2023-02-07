// refer to manual setup instructions here
// https://github.com/opencontainers/runc/blob/v1.1.4/docs/cgroup-v2.md

const good = (m) => echo(chalk.green("✓ " + m))  // requirement met
const warn = (m) => echo(chalk.yellow("• " + m))  // highly recommended to avoid these
const stop = (m) => {echo(chalk.red("𐄂 " + m)); process.exit()}  // critical requirement missing

// 1. Check for support of kernal features
//
// Significant releases
// ---------------------------------------
// OS       Version       Kernel Version
// ---------------------------------------
// ubuntu   22.04 LTS     5.15 LTS
// rhel     9             5.14
// SUSE     15            5.14
// debian   11 (bullseye) 5.10 LTS (SLTS)
// ubuntu   20.04 LTS     5.4
// debian   10 (buster)   4.19 LTS
// rhel     8             4.18
// ubuntu   18.04 LTS     4.15
// ---------------------------------------
//
// Significant features
// ---------------------------------------
// Controller             Kernel Version
// ---------------------------------------
// memory.peak            5.19    (required to measure peak memory usage)
// freezer                5.2     (required for communication tasks)
// cpu                    4.15    (required to measure cpu throughput)
// (cgroup v2 stable)     4.5     https://kernelnewbies.org/Linux_4.15
// ---------------------------------------

// Check kernel version
{
  // expected format is `xx.xx.xx-otherstuff`
  let out = await $`uname --kernel-release`
  const ver = out.toString().trim().split('-')[0]  // xx.xx.xx
    .split('.').slice(0, 2).map((a) => parseInt(a)) // [major, minor]
  
  const lt = (a, b) => a[0]*1000 + a[1] < b[0]*1000 + b[1]
  const s = (a) => a.join(".")
  let n_missing = 0

  const min_peak = [5, 19]
  if (lt(ver, min_peak)) {
    warn(`Kernel versions less than ${s(min_peak)} cannot support measuring program memory
  usage. Memory limits can still be inforced.`)
    n_missing += 1
  }
  
  const min_freezer = [5, 2]
  if (lt(ver, min_freezer)) {  // TODO: unsure yet of the impacts of this
    warn(`Kernel versions less than ${s(min_freezer)} cannot support freezing groups of processes.`)
    n_missing += 1
  }

  const min_abs = [4, 15]
  if (lt(ver, min_abs))
    stop(`Kernel versions less than ${s(min_abs)} are too old to support measuring cpu throughput.`)
  
  if (n_missing > 0)
    warn(`Kernel version is ${s(ver)}. Missing ${n_missing} important feature${n_missing-1 ? 's':''}!`)
  else good(`Kernel version is ${s(ver)}.`)
}

// Check that cgroup v2 is enabled for the kernel
{
  let out = await $`grep cgroup2 /proc/filesystems`  // prints `nodev cgroup2` on success
  out = out.toString().trim().split(/\s+/).at(-1)
  if (out !== "cgroup2")
    stop(`This system does not appear to support cgroup v2, which is required. Perhaps it is
  disabled in the kernel???`)  // unlikley to happen if kernel requirements met
  good("Kernel supports required cgroup v2.")
}

// TODO: double check cgroup v2 is mounted at /sys/fs/cgroup

// 2. Check for systemd init system or not
//
// Systemd manages cgroup v2 in most distros.
// There are three modes https://systemd.io/CGROUP_DELEGATION/
// a. unified - pure cgroup v2
// b. hybrid - cgroup v2 in /unified/ subdirectory
// c. legacy - pure cgroup v1
//
// However, legacy is not supported and hybrid is not usable for managing
// resource usage since controllers cannot be attached to cgroup v2 for use
// as well as the cgroup v1 groups. Hence, systemd must be in unified mode.
//
// systemd is perfered because it is easier to track and manage system wide
// resource allocations along with any containers that run.
//
// If systemd is not supported, fall back to cgroupfs (manual cgroup management)
// In this case, it is most likley we are in a container. We will need to
// inform podman via the --cgroup-manager=cgroupfs command if so.

// Check for systemd init system
{
  // check if systemd is running as process 1
  let out = await $`ps -p 1 -o comm=`
  out = out.toString().trim()
  if (out !== "systemd")  // TODO: change to fall back to cgroupfs
    stop(`${out} init system detected. Currently, only systemd is supported as the cgroup v2 driver.`)
  good("systemd init system detected.")
}

// Check systemd version
{
  let out = await $`systemctl --version | head -1`
  const ver = parseInt(out.toString().trim().split(' ').at(1))

  // The recommended systemd version of systemd is 244 or later. Older systemd does not
  // support delegation of cpuset controller which means we can't constrain programs to
  // memory regions or specific cpus. This is not critical but may mean programs will
  // have more of an effect on each other and runtimes will be less consistant.
  const min_ver = 244
  if (ver < min_ver)
    warn(`systemd is version ${ver}. Versions less than ${min_ver} can't constrain
  processes to specific CPUs or memory nodes which could effect reproducability.`)
  good(`systemd is version ${ver}.`)
}

// Check for systemd mode, if possible.
// It also might be that we are in a container



// stop(`cgroup v2 is supported by this system but not mounted at /sys/fs/cgroup as expected. \
//           You could be using a unified heirachy where both cgroup v1 and cgroup v2 are enabled \
//           in which case please configure kernel parameters to use cgroup v2 only.`)
//     // If you do systemd --version it should show `default-hierarchy=unified`
//   }
//   good("System is using cgroup v2 at /sys/fs/cgroup")

//   let path = "/sys/fs/cgroup/cgroup.controllers"
//   if (!fs.accessSync(path, fs.constants.F_OK)) {

// Ensure systemd is in unified mode

// {
//   // Check if systemd driver is used, which is the recommended and most common setup, and
//   // configure for a rootless setup, meaning that a non privilaged user will be able to
//   // manage containers and execute processes in them and our application will not require
//   // root access

//   // Since we know we are using cgroup v2
//   let path = "/sys/fs/cgroup/user.slice"
//   if (!fs.accessSync(path, fs.constants.F_OK))
//     stop("It seems that cgroups are not being managed by the systemd init system")
  
// }

