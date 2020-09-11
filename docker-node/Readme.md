## Build docker image
Before start, we build he docker image with:

$ docker build -t <your username>/node-web-app .

# test docker image

$ docker images

# Example
REPOSITORY                      TAG        ID              CREATED
node                            10         1934b0b038d1    5 days ago
<your username>/node-web-app    latest     d64d3505b0d2    1 minute ago

## Run the image
docker run -p 49160:8080 -d <your username>/node-web-app

## Print the output of your app:
# Get container ID
$ docker ps

# Print app output
$ docker logs <container id>

# Example
Running on http://localhost:8080


## If you need to go inside the container:

# Enter the container
$ docker exec -it <container id> /bin/bash