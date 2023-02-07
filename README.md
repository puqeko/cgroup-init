Build image `docker build -t pm-stable -f Dockerfile.stable .`
Start contianer `docker-compose up -d`
Conntect to container `docker exec -it nztrain-isolate-app-1 /bin/bash`

Inside docker container at /app/src `go build -o bin stdout/stdout.go`
Then `podman run --mount type=bind,src=./bin,dst=/bin scratch /bin/stdout 5`