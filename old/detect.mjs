// #!/usr/bin/env zx

//RHEL has Fedora upstream, and CentOS downstream

// // does this system have cgroup v2 support?
// {
//   // look for avaliable filesystems since cgroup v2 has it's own
//   let grep_fs = (await $`grep cgroup /proc/filesystems`).toString()

//   if (!grep_fs.includes("cgroup2")) {
//     echo("OS does not support cgroup v2, which is required")
//     exit()
//   }
//   echo(chalk.green("OS supports cgroup v2"))
// }

// // confirm where cgroups are mounted
// const cgroup_root = "/sys/fs/cgroup";
// {
//   const getft = async (path) => {
//     return (await $`findmnt --target ${path} --list --noheadings --output fstype`)
//       .toString().trim()
//   }
//   let ft = await getft(cgroup_root)

//   if (ft == "cgroup2") {
//     echo(chalk.green(`Mounted at ${cgroup_root}`))
//   } else if (ft == "tmpfs") {
//     let u = await getft("/sys/fs/cgroup/unified")
//     let s = await getft("/sys/fs/cgroup/systemd")

//     if (u == "cgroup2" || s == "cgroup2") {
//       echo("It is likely your system is using cgroup v2 and v1.")
//       echo("This is not supported and may never be")
//       exit()
//     }
//     echo("It is likely your system is using legacy cgroup v1")
//     echo("despite having support for v2.")
//     echo("Please configure kernel parameters to use cgroup v2")
//     exit()
//   } else {
//     // not mounted at cgroup_root, check if mounted somewhere else
//     let pth = (await $`findmnt --list --noheadings --type cgroup2 --output target`).toString().trim()
//     if (pth != "") {
//       echo("The cgroup v2 heirachy is in a non-standard location")
//       echo("This is not supported and may never be")
//       exit()
//     }
//     // else, try to mount
//     echo("cgroup v2 not mounted, attempting mount...")
//     await $`mount -t cgroup2 none ${cgroup_root}`
//       .catch((err) => {
//         echo(`could not mount cgroup v2 at ${cgroup_root}`)
//         exit()
//       })
//   }
// }

// // attempt to read about cgroup v2
// {
//   let pth = `${cgroup_root}/cgroup.controllers`;
//   let controllers = (await fs
//       .readFile(pth)
//       .catch((err) => {
//         echo(`could not read ${pth}`)
//         echo(err)
//         exit()
//       }))
//     .trim()
//     .split(/\s+/)
  
//   const required = ["cpu", "memory"]
//   let is_missing = false;
//   for (const ctrl of required) {
//     if (!controllers.includes(ctrl)) {
//       echo(`${ctrl} not avaliable`)
//       is_missing = true;
//     }
//   }

//   if (is_missing) {
//     echo("Critical controller(s) are not avaliable on this system.")
//     echo("It could be that they are disabled via kernel parameters,")
//     echo("that a newer kernel version is required, or that we are")
//     echo("running inside a container which does not have the required")
//     echo("controllers enabled.")
//     exit()
//   } else {
//     echo(chalk.green("Has required controllers"))
//   }
// }



// // check for the existance of cgroupv2
// // mount -t cgroup2 none cgroup

// // suggest cgroup_no_v1= kernal parm so that controler avaliable for v2

// // let cgroup_support_msg = `
// // Kernal support for cgroup v2 is required (avaliable from Linux Kernel version
// //   4.5).
// // It might be that cgroup v2 is supported by your distribution but not enabled by
// //   kernal parameters.
// // Some required controllers are not avaliable until later versions (eg Linux Kernel
// //   version 4.15).
// // It may also be that both cgroup v1 and v2 are enabled, in which case if
// //   controllers are in use by v1 they will be unavaliable in v2. It is recommended
// //   to set the kernal parameter cgroup_no_v1=1 to disable cgroup v1.
// // `
// // as per https://www.kernel.org/doc/html/4.15/admin-guide/cgroup-v2.html

// // if (!fs.pathExistsSync("/sys/fs/cgroup")) {
// //   echo`/sys/fs/cgroup not found, attempting mount...`
// //   let result = await $`mount -t cgroup2 none /sys/fs/cgroup`.nothrow()
// //   // The process needs CAP_SYS_ADMIN against its user and mount namespaces.
// //   echo('test')
// //   // if (!fs.pathExistsSync("/sys/fs/cgroup")) {
// //   //   echo`Was unable to mount cgroup v2. ${cgroup_support_msg}`
// //   //   exit(0)
// //   // }
// // }

// // minimum need
// // limit total cpu throughput with
// // cpu.max  "cgroup2 doesn’t yet support control of realtime processes and the cpu controller can only be enabled when all RT processes are in the root cgroup. Be aware that system management software may already have placed RT processes into nonroot cgroups during the system boot process, and these processes may need to be moved to the root cgroup before the cpu controller can be enabled."
// // measure total cpu throughput with
// // cpu.stat
// // also check cpu enabled at cgroupv2 root from startup

// // also get cpu frequency and manage frequency limits to get better estimate

// // minimum need
// // limit max memory usage
// // memory.max
// // measure max memory used
// // memory.peak

// // cgroup2 support
// // decleared production ready 4.5 https://lwn.net/Articles/679786/

// // minimum need
// // limit total cpu throughput with
// // cpu.max  "cgroup2 doesn’t yet support control of realtime processes and the cpu controller can only be enabled when all RT processes are in the root cgroup. Be aware that system management software may already have placed RT processes into nonroot cgroups during the system boot process, and these processes may need to be moved to the root cgroup before the cpu controller can be enabled."
// // measure total cpu throughput with
// // cpu.stat
// // also check cpu enabled at cgroupv2 root from startup

// // also get cpu frequency and manage frequency limits to get better estimate

// // minimum need
// // limit max memory usage
// // memory.max
// // measure max memory used
// // memory.peak

// // also get memory throughput statistics?
// // also limit swaping, reclaiming, etc to get more stable platform?

// // "Linux 4.5 cgroups v2"
// // Linux 4.15
// // "cpu.stats for time" "cpu.max for limit"

// // check repo for versions

// // cd("/sys/fs/cgroup")

// // if (!await fs.exists("memory.peak"))
// //   echo(`memory.peak not supported
// //   Requires linux kernal version >= 5.19`)

