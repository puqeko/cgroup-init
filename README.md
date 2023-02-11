Build image `docker build -t pm-stable -f Dockerfile.stable .`
Start contianer `docker-compose up -d`
Conntect to container `docker exec -it nztrain-isolate-app-1 /bin/bash`

Inside docker container at /app/src `go build -o bin stdout/stdout.go`
Then `podman build -t minimal -f Dockerfile.minimal .`
Then `podman run --read-only --user podman2 --mount type=bind,readonly,src=/test/bin,dst=/bin minimal /bin/stdout 1`


You can tell systemd to use cgroupv2 via kernel cmdline parameter:
systemd.unified_cgroup_hierarchy=1

It might also be needed to explictly disable hybrid cgroupv1 support to avoid problems using: systemd.legacy_systemd_cgroup_controller=0

Or completely disable cgroupv1 in the kernel with: cgroup_no_v1=all