# Week 11 — Exercises

Deploy your Week 10 Task Tracker so anyone can open it.

## Step 0 — Secure it FIRST
```bash
cd your-app
echo ".env" > .gitignore     # ignore secrets before committing anything
```
Move any config (ports, keys) to env vars. Create:
- `.env` (real values, NOT committed)
- `.env.example` (dummy values, committed, documents what's needed)

Audit: run `git status` and confirm `.env` is NOT listed. If it is, it's not ignored — fix before pushing.

## Step 1 — Containerize (if not already)
Write/confirm a `Dockerfile`. Build and run locally:
```bash
docker build -t task-tracker .
docker run -d -p 3000:3000 --env-file .env --name tt task-tracker
```
Open http://localhost:3000. Works in a container? Good — the host will run the same box.

## Step 2 — Push clean
```bash
git add .
git status                   # CONFIRM .env is absent
git commit -m "Prepare app for deployment (containerized, secrets externalized)"
git push
```

## Step 3 — Deploy to a free host
Pick one (Render/Railway/Fly.io). Connect it to your GitHub repo. Set your env vars in the
host's dashboard (NOT in code). Deploy. Get your public URL.

## Step 4 — Smoke test like a real user
- Open the public URL **on your phone**.
- Add a task, mark done, delete — all five features.
- Restart the app from the host dashboard. Reopen. **Did your tasks persist?** (If not, your storage is ephemeral — note it; it's a real deployment lesson.)

## Step 5 — Document
Update `README.md`: the live URL, and a "Deployment notes" section covering how secrets are handled and how to run it.

## Submit → [`CHECK.md`](CHECK.md)
