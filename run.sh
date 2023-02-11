#!/bin/bash
podman run --detach \
  --mount type=bind,src=/Users/puqeko/dev/nztrain-isolate/testbin,dst=/home/podman/testbin \
  --mount type=volume,src=pm-user,dst=/home/podman/.local/share/containers \
  --device=/dev/fuse \
  --security-opt label=disable \
  --security-opt unmask=ALL \
  pm-stable sleep infinity
# start systemd init system

# docker
# --security-opt seccomp=unconfined \
# --cap-add=sys_admin,mknod \
# for root containers
#   --mount type=volume,src=pm-root,dst=/var/lib/containers \

#  \
# podman run alpine echo hello