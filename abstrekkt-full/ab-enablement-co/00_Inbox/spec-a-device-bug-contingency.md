# SPEC A — DEVICE BUG CONTINGENCY (symphony-fable v6)
Status: BLOCKED on phone DEBUG log · Executor: Sonnet-class · Est: 0.5–1 day once unblocked

## 1. OUTCOME CONTRACT
The visualizer runs correctly on Kyle's physical phone (Chrome/Android assumed, unverified).
"Correctly" = DEBUG log shows `playing → LIVE` AND figure motion is visually obvious within 5s.
Non-goal: supporting every browser. Target = Kyle's device + latest Chrome/Safari.

## 2. PRE-STEP S1.0 (do before reading the log — 20 min)
Add two boot diagnostics to dbg() so branch selection is unambiguous:
- `canvas: {W}×{H} @ DPR {dpr}` — catches zero-size canvas / DPR bugs
- rAF fps meter: log `fps: {n}` once at t+3s — catches throttled/killed render loop
str_replace into the capability probe block. Ship as v6.1 before asking for the log again.

## 3. BRANCH TREE (keyed to what the DEBUG log shows)

### B1 — Page loads but NO DEBUG button visible
Meaning: script crashed during initial execution (before wiring).
Prime suspect [GENERATED]: optional chaining in the capability probe
(`prototype?.decodeAudioData`) — ES2020; old Android WebView chokes.
Fix: remove all `?.` / `??` from the file (grep audit), replace with guards.
Verify: button appears; boot lines render.
Effort: 1 hr.

### B2 — Log shows `AudioContext: NO`
Meaning: browser blocks Web Audio entirely.
Fix: none in code. Ship guidance: banner already fires. Add explicit copy:
"Open in Chrome or Safari — this browser blocks audio."
Verify: banner text on that device. Effort: 15 min.

### B3 — Log shows `decode failed (try 3/3)`
Meaning: codec unsupported by decodeAudioData on that device (M4A/FLAC common culprits).
Fix (fallback chain, in order):
  1. If file is not MP3/WAV → surface "convert to MP3" recovery (already partial).
  2. Reintroduce `<audio>`+MediaElementSource as a LAST-RESORT path only when
     decodeAudioData fails — inverse of v4's architecture. Comment the tradeoff:
     buffer path = compatibility default; element path = codec breadth fallback.
Verify: same file that failed now plays via fallback; log shows `fallback: element source`.
Effort: half day.

### B4 — Log shows `playing → LIVE` but screen static/blank
Meaning: render problem, not audio.
Checks in order: canvas W×H from S1.0 (zero = CSS/layout bug), fps line
(0–5 fps = GPU/compositing; battery-saver throttling), DPR > 2 clamp.
Fixes: (a) if H=0 → explicit `height:100dvh` fallback for mobile URL-bar viewport;
(b) if fps<15 → auto-degrade: skip ghost/chromatic passes, halve aura particles
(add `perfMode` that engages when measured fps < 20 for 2s).
Verify: fps line ≥ 30 post-fix on device. Effort: half day.

### B5 — Everything logs clean but motion "feels minimal"
Meaning: tuning, not defect. hype/perf floors (0.32 / 0.5) too low for taste.
Fix: raise floors (0.45 / 0.65) OR add an "Intensity" slider (CFG-driven, 0.5–1.5×
multiplier on choreography amplitudes). Slider preferred — kills the argument permanently.
Effort: 1–2 hr.

## 4. FAILURE TAXONOMY
- Misdiagnosis risk: B4 masquerades as B5. Discriminator = fps line. Do S1.0 first.
- Fallback loop risk (B3): element-source path must never run when buffer path succeeded
  — gate on a single `decodeFailedFinal` flag, never retry-toggle.

## 5. ADVERSARIAL QUESTIONS
- Is the phone opening v6 at all, or a cached older file? Force check: version label reads v3.0
  in v5/v6 — bump CONFIG.version per ship so the label is the file-identity check.
- Is Data Saver / Battery Saver on? Both throttle rAF. Ask before coding B4.

## 6. ACCEPTANCE
Phone shows: DEBUG log with `AudioContext ready`, `decoded ok`, `playing → LIVE`,
`first beat detected`, fps ≥ 30, and visible full-body choreography. Screenshot as proof.

## UNKNOWN-UNKNOWNS
Device model/browser/version — all unverified. Every estimate above is provisional until the log exists.
