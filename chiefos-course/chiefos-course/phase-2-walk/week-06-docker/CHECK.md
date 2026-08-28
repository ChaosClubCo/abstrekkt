# Week 6 — Check & Submit

## Self-check
- [ ] I ran a prebuilt container (nginx) and reached it in a browser.
- [ ] I wrote a Dockerfile and built my own image.
- [ ] I ran my own containerized app and saw its logs.
- [ ] I can explain image vs container in my own words.

## Submit
1. Output of `docker images` and `docker ps -a`.
2. Your `Dockerfile`.
3. Your `docker-notes.md` (image vs container explanation).

## Instructor grading note
- Full: own image builds and runs; image-vs-container explanation is correct.
- Common snag: Docker Desktop not running, or port already in use — teach `docker ps` and changing `-p 3000:3000` to `3001:3000`.
- Redo: copied the Dockerfile but can't say what `CMD` or `EXPOSE` do — walk them through the recipe line by line.

**FSR skill proved:** You can deploy and run the product in a container on a machine you don't own — the core mechanical act of shipping ChiefOS to a site.
