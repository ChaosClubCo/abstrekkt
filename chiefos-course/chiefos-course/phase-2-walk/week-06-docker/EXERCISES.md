# Week 6 — Exercises

Docker Desktop must be running first. Verify: `docker --version`.

## Drill 1 — Run someone else's container
```bash
docker run hello-world      # Docker downloads + runs a tiny test container
```
Read the output — it explains what just happened. You just ran software without installing it.

## Drill 2 — Run a real web server
```bash
docker run -d -p 8080:80 --name web nginx
```
- `-d` = background, `-p 8080:80` = connect your port 8080 to the container's port 80.
Open http://localhost:8080 in a browser. That's a real web server, in a box, that you didn't install.
```bash
docker ps                   # see it running
docker stop web             # stop it
docker rm web               # remove it
```

## Drill 3 — Containerize your OWN app
Make a folder `docker-app` with two files.

`app.js`:
```javascript
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("Hello from inside a container!\n");
});
server.listen(3000, () => console.log("Listening on 3000"));
```

`Dockerfile`:
```dockerfile
FROM node:20-slim
WORKDIR /app
COPY app.js .
EXPOSE 3000
CMD ["node", "app.js"]
```

Build and run:
```bash
cd docker-app
docker build -t my-app .          # build image from the Dockerfile
docker run -d -p 3000:3000 --name mine my-app
```
Open http://localhost:3000 — your own code, containerized. Then:
```bash
docker logs mine                  # see your console.log
docker stop mine && docker rm mine
```

## Drill 4 — Explain it
In `docker-notes.md`, answer: what is the difference between your **image** `my-app` and the **container** `mine`? Why could you run five containers from one image?

## Submit → [`CHECK.md`](CHECK.md)
