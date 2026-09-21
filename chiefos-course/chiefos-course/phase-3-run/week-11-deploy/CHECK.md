# Week 11 — Check & Submit

## Self-check
- [ ] `.env` is gitignored and NOT in my repo history.
- [ ] Secrets are in env vars, not in code or frontend.
- [ ] The app is deployed at a public URL and works from my phone.
- [ ] I know whether my data persists across a restart (and why).

## Submit
1. The **live public URL**.
2. Repo URL — instructor will verify `.env` is absent and `.env.example` is present.
3. Your smoke-test result: which features worked from your phone, and the persist-after-restart result.

## Instructor grading note
- Full: live URL works for the instructor on their own device; no secrets in the repo.
- IMMEDIATE fail + teachable moment: any real secret found committed. Walk through rotating it and gitignoring. This is the single most important security habit in the course — the standing rule is "never generate code embedding secrets in client-side code."
- Common lesson: tasks vanish on restart because storage was in-memory or in the container's ephemeral filesystem. That's a *correct thing to have discovered* — credit the diagnosis.

**FSR skill proved:** You can ship the product to a live environment for real users without leaking secrets — the literal job of deploying ChiefOS at a customer site.
