# Week 6 — Docker Without Fear 🚶

**Phase:** Walk · **Survey gap:** Docker avg 1.5 (56% beginner/none — the LOWEST skill in the survey)
**Goal:** Run an app inside a container and understand why that's a superpower.

## TL;DR
Docker puts an app and everything it needs into a sealed **box (container)** that runs the same on any machine. "Works on my machine" stops being a problem because the box *is* the machine.

## Analogy
A container is a **meal-prep container**. Instead of shipping someone a recipe and hoping they have the right ingredients and oven, you ship the whole sealed, ready-to-heat meal. Docker ships the app *with its entire kitchen*. It runs identically on your laptop, a classmate's, or an Army server.

## Why Docker scores lowest — and why we don't skip it
It's the single weakest skill in your cohort (1.5). That's exactly why it's a full week. ChiefOS and essentially all modern deployment runs in containers. An FSR who can't run a container can't deploy the product. We take it slow and hands-on.

## The three words
- **Image** = the recipe + ingredients, frozen. A blueprint.
- **Container** = a running copy of an image. The actual meal, heated and served.
- **`docker run`** = "take this image and start a container from it."

You can start many containers from one image, like reheating many meals from one prep batch.

## The commands you'll use
| Command | Says |
|---|---|
| `docker pull <image>` | download an image |
| `docker run <image>` | start a container from an image |
| `docker ps` | list running containers |
| `docker ps -a` | list all containers, including stopped |
| `docker stop <id>` | stop a container |
| `docker images` | list images you have |
| `docker build -t <name> .` | build an image from a Dockerfile |

## The Dockerfile
A **Dockerfile** is the written recipe Docker follows to build your image. A few lines that say "start from Node, copy my files in, install, run." You'll write one this week.

## Technical definition
**Docker** is a containerization platform. An **image** is an immutable, layered filesystem + metadata; a **container** is a running, isolated process instantiated from an image, sharing the host kernel but with its own filesystem, network, and process space.

➡️ Do [`EXERCISES.md`](EXERCISES.md). Make sure Docker Desktop is running (whale icon).
