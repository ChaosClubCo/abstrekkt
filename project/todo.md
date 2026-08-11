# Abstrekkt — Todo

> Working backlog. Update as sprints close. See CANON.md for canonical-file rules.

### Sprint — Aug 11, 2026: abstrekkt.com domain-gate diagnosis + deploy package
Diagnosed why abstrekkt.com and /playbook were returning a "Continue with ChatGPT" sign-in
wall instead of any Abstrekkt content: Kyle's Dispatch tool has the bare apex bound at the
DNS/platform level, not this project's own code. Full finding + exact DNS/dashboard steps in
`canon-sync-ops.md` §6 (decision D11, OPEN). Built the buildable half — same shape as the
Jul 12 kyle.abstrekkt.com sprint: package generated, Kyle's remaining steps are two systems
this project can't reach (the ChatGPT-Apps domain binding, and Cloudflare DNS writes).

- [x] `deploy/abstrekkt-com/` — production copies of the four studio canonicals: `index.html`,
      `founder/index.html` (v1, matches live nav), `pillars/index.html`, `contact/index.html`,
      `404.html`. `image-slot` → static "PHOTO ON REQUEST" frames; cross-page links among the
      four rebased root-relative; links to not-yet-live sibling properties (Corridor,
      Load-Bearing, Journal) left as-is — known 404s until those lanes ship. GENERATED — never
      edit; regenerate from root canonicals after any edit.
- [x] "Root routing" (line below) resolved: root = studio, per the Jul 12 recommendation
      Kyle never explicitly confirmed but which `domain-map.html` already documented as the
      plan — the "properties" footer/nav block gate is now built (links kyle.abstrekkt.com),
      so nothing else blocks root = studio going live once the domain is freed.
- [x] CANON.md + `domain-map.html` updated to point at the package and record the domain-gate
      finding.
- [ ] **Kyle only — two systems this project has no access to:** (1) move Dispatch's custom
      domain off the bare apex to `dispatch.abstrekkt.com` in the ChatGPT-Apps dashboard,
      (2) point the freed apex at a Cloudflare Pages deploy of `deploy/abstrekkt-com/` per the
      DNS records in `canon-sync-ops.md` §6. Unblocks root = studio going live.

### Sprint — Jul 12, 2026 (pm): kyle.abstrekkt.com deploy package
Every other open item is gated on a Kyle decision or input; the buildable half of Deploy
step 1 was the only implementable work. Production package generated — Kyle's remaining
steps are upload + DNS + mailbox only (see `deploy/README.md`).

- [x] `deploy/kyle-abstrekkt-com/` — production copies of the three canonicals:
      `index.html` (Tweaks panel + React/Babel stripped, chosen defaults baked),
      `playbook/index.html` (masthead/footer links → root-relative), `press/index.html`
      (image-slot → static "photo on request" frame, dev script dropped), `404.html`.
      GENERATED — never edit; regenerate from root canonicals after any edit.
- [x] `deploy/README.md` — upload/DNS/mailbox/verify steps + regeneration rules.
- [x] CANON.md + `domain-map.html` updated to point at the package.

### Sprint — Jul 12, 2026: domain architecture + press kit (from Kyle interview)
Kyle's answers captured: abstrekkt.com = umbrella (root stays studio), kyle. = press landing,
blog. = existing KR site, memoir./music./hovav. = walled lanes, flashfusion.co = company.
Walls stay up ("all present, clearly separated"). Journalists are audience #1.

- [x] `press-kit.html` built (kyle.abstrekkt.com/press) — 3 walled story lanes, sourced fact
      sheet, arc, headshot slot, ground rules. Registered in CANON.
- [x] `domain-map.html` built — property→files→gate map, press routing, launch order.
- [x] All 39 pitch signatures → kyle.abstrekkt.com (was bare abstrekkt.com).
- [x] Index card: /press link added + Tweaks (hero voice ×3, depth, ember intensity).

#### Needs Kyle — flagged, not resolved
- [ ] **"11 attempts at associates"** — Kyle is pulling his transcript. When it arrives: add
      entry to the-evidence-board.md, then it's usable in press kit + memoir pitches.
- [ ] **Homelessness dates** — resolved in substance: homeless during use years, now back
      with parents (both true, sequential). Press kit updated to say exactly that. Still
      need the rough date range for the evidence board before a pitch leads with it.
- [x] **Chaos Club status** — resolved: archived (Kyle confirmed). Taylor Six pitch
      rewritten to built-then-archived framing ("why volunteer-built versions are hard to
      keep standing" is now part of the angle); press-kit fact sheet row added.
- [ ] **Memoir excerpt selection** — gates memoir.abstrekkt.com public face.
- [ ] **HOVAV scope** — corridor-walk of existing 111 scenes vs. bigger game.
- [x] **Root routing** — root = studio, properties block built (Aug 11, see sprint above).
- [ ] **Deploy step 1** — kyle.abstrekkt.com. Build half done Jul 12 pm: production
      package at `deploy/kyle-abstrekkt-com/`. Remaining is Kyle-only: pick host, upload
      folder, CNAME `kyle` → host, `kyle@abstrekkt.com` mailbox — steps in
      `deploy/README.md`. Unblocks Chong Ming + all signatures.

## Lane: Abstrekkt Studio Marketing

**Jul 13, 2026 — full-corpus audit pass (design/UX/code), begun:** design-system conflict flagged Jul 11 resolved as a **hybrid** (see CANON.md): existing Brutalist Archive corpus stays untouched; the bound `_ds/` Reading Room bundle is reserved for net-new Studio-lane builds only — never mixed in one file. Real bug found and fixed: the daughter's name ("Kinsley") was live on three public pages — `Abstrekkt Pillars.html` (Tenet VIII), `Abstrekkt Founder.html`, `Abstrekkt Founder v2.html` (bento quote card + memoir meta + parallel-constructions line) — directly violating the project's own "daughter stays unnamed" rule that press-kit.html and the evidence board already enforce. Replaced with "my daughter" in all four spots, preserving the sentence. Spot-checked `Abstrekkt Home.html`, `Abstrekkt Pillars.html`, `abstrekkt/nav-toggle.js`, `Kyle Rosebrook Home.html` + `kr/kr.js`, `Abstrekkt Contact.html`, `FlashFusion Services.html` — nav/mobile-disclosure/form/link wiring all sound, no dead `kylerosebrook.com`/`href="#"`/broken-mailto instances outside intentionally-historical audit pages and `uploads/` raw source (already ruled out of scope). Continuing lane-by-lane; see `Audit - Full Corpus, Jul 13.html` for the live findings log.

## Lane: Press & Pitch

### Sprint — Jul 12, 2026: closed the verify→file gap
Found that last sprint's "verified" entries (Jared, Sullivan, Keating, Taylor, Pearce,
Fortune) were logged here as done but never actually written into `pitch_console.html` —
the research happened, the practices/contact fields didn't change. Per CANON.md's Butler
rule, didn't trust the log: re-verified each claim first-hand (re-fetched the Fortune
article and diygenius.com live rather than citing the earlier note) and wrote confirmed
facts into the file this pass.

- [x] **Shaifali** (Arc Talent Blog, pitch `shaifali`) — identified: **Shaifali Agrawal**,
      PR Content Manager at Arc (brand/audience growth) — writes Arc's own sponsored data
      stories, not an outside reporter; formerly freelanced for the Guardian/Al
      Jazeera/Telegraph. Confirmed the referenced piece: "Coding Bootcamp Grads Earn More
      Than College Grads" at arc.dev/talent-blog/developer-starting-salaries/. Flagged in
      practices that this reads as content/PR outreach, not a press pitch, since she's
      in-house. Written into file — closed out.
- [x] **Fortune** (pitch `fortune`) — byline reconfirmed directly against the live article:
      Nick Lichtenberg, Business Editor. Contact field updated from generic desk to his
      name; author page + LinkedIn added to practices. No public email — send-blocker
      stands.
- [x] **Taylor Six** (pitch `taylor`) — she/her and the JRN founding-piece URL
      (pressclubinstitute.org, Feb 26 2025) actually written into the file this time. No
      email found on Muck Rack either — practices now say to route through the
      Herald-Leader newsroom generally; no personal address exists to cite.
- [x] **Peter Keating** (pitch `keating`) — confirmed still an active freelancer (GQ, Nat
      Geo, Politico, Bond Buyer, ex-ESPN). Found a candidate email via his public Muck Rack
      profile (`pkeating.nj@verizon.net`) — personal, not a masthead address; flagged to
      verify before send. Confirmed piece URL/date (Inc, Apr 17 2023).
- [x] **Jared Lindzon** (pitch `jared`) — confirmed still freelancing for both Fast Company
      and Globe & Mail, co-author of *Do More in Four* (HBR Press, Jan 2026). No email
      anywhere — jaredlindzon.com has no address, contact form only.
- [x] **Kyle Pearce / DIY Genius** (pitch `pearce`) — the pivot risk was real, checked
      directly against the live homepage: diygenius.com now positions itself entirely as
      "AI Search Visibility For Health Experts," an AI-first business accelerator for
      health brands. The ADHD/neurodiversity content this pitch leans on is archived blog
      history, not current positioning — he's still posting (through Jul 2026) but not on
      this beat. Practices now carry this as a prominent risk flag, not a footnote.

### Still open — not a research task
- [ ] **Lee Chong Ming** (Business Insider Singapore, pitch `chongming`) — hard-gated:
      blocked on kyle.flashfusion.co going live with a published playbook URL. Cannot
      unblock from here.
- [ ] **Decide platform for Sifted/ADDitude sends** — both marked `ready`, no blockers
      left. Kyle's call (which service/account to actually send from), not something to
      research — asked this session.

### Backlog (not scheduled)
- [ ] `dispatch.jsx` — fix nothing outstanding; canonical and current.
- [ ] Re-run CANON.md §3 disposal pass next time new stale duplicates appear (checked this
      sprint: root-level canonical files still clean, no new `_v2`/`_bak` siblings.
      `uploads/` is raw source material, not the canonical registry — out of scope for
      this pass).

## Other lanes (not touched this sprint)
Memoir, Content & Publishing, FlashFusion Delivery — see CANON.md for canonical files.
No backlog captured yet; ask before scoping a sprint there.
