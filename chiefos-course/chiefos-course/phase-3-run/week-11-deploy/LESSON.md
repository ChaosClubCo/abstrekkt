# Week 11 — Deploy It 🏃

**Phase:** Run · **Survey gap:** only 7% have ever shipped/run a real app for others
**Goal:** Put your Week 10 app somewhere a stranger can open it — safely.

## TL;DR
Deploying means moving your app from "runs on my laptop" to "runs on the internet where anyone can use it." You'll containerize it (Week 6 pays off), handle secrets correctly, deploy to a host, and smoke-test that it actually works for someone else.

## Analogy
Building the app (Week 10) was **cooking the meal**. Deploying is **opening the restaurant** — the food now has to be served to strangers, reliably, without you standing next to each plate. That means it has to run without you, survive a restart, and not leak the recipe (secrets).

## Why shipping is its own skill
7% of your cohort has ever shipped. Running code for *yourself* is easy mode — you can restart it, you know its quirks. Running it for *others* forces real questions: what's the URL, what happens when it restarts, where do passwords and API keys live, does it work on a machine that isn't yours? These are exactly the questions an FSR answers at a customer site.

## The deploy checklist
1. **Containerize** (Week 6). If it runs in a container on your machine, it runs on the host.
2. **Externalize config.** No hardcoded secrets. Use **environment variables**.
3. **Handle secrets correctly** (read the security rule below — it's non-negotiable).
4. **Pick a host.** Free tiers: Render, Railway, Fly.io, Vercel (frontend), or a container host.
5. **Deploy.** Push, connect the host to your repo, set env vars in the host's dashboard.
6. **Smoke test.** Open the public URL from your *phone* (not your laptop). Does every feature work for a fresh user? Restart the app — do tasks persist?

## SECURITY — the hard rule (memorize)
**Never put secrets in your code or your frontend.** No API keys, passwords, database URLs, or tokens committed to Git or shipped in client-side JavaScript. They belong in **environment variables**, set on the server / host dashboard, read at runtime. A secret in a public repo is a breach — bots scan GitHub for exactly this within minutes.

Practical rules:
- Add a `.gitignore` with `.env` in it BEFORE your first commit.
- Keep real secrets in a local `.env` (never committed).
- Commit a `.env.example` with dummy values so others know what's needed.
- Set the real values in your host's environment settings, not in code.

## Environment variables in one minute
An **env var** is a value your app reads from its environment instead of from its code:
```javascript
const apiKey = process.env.API_KEY;   // read from environment, not written in the file
```
Same code runs everywhere; each environment supplies its own values. Your laptop reads from
`.env`; the host reads from its dashboard settings.

## Technical definition
**Deployment** is the process of packaging and running an application in a target environment
accessible to users, with configuration and secrets supplied externally at runtime.

➡️ Do [`EXERCISES.md`](EXERCISES.md).
