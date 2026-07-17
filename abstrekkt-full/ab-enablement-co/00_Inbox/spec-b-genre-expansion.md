# SPEC B — GENRE EXPANSION: HIP-HOP + HOUSE (symphony-fable)
Status: READY · Executor: Sonnet-class · Est: 2–3 days · Depends: Spec A closed (don't tune on a broken device)

## 1. OUTCOME CONTRACT
Auto-detect distinguishes 6 styles (metal, salsa, groove→rename EDM, flow, +hiphop, +house)
with manual override intact. Each new style has visually distinct, genre-plausible
choreography with 3 phrase variants. Self-testable via 2 new built-in demo tracks.

## 2. DETECTION FEATURES (add to the per-frame feature block)
Current: smoothed bass/mid/high + beat rate + folded BPM. Add:
- `flatness` — spectral flatness ≈ geoMean/arithMean over bins 4–200 (log-domain geo mean
  to avoid underflow). High = noise-like (metal wall, hats); low = tonal.
- `beatVar` — coefficient of variation of last 8 beat intervals. Low (<0.06) = machine-grid
  (house/EDM); higher = human/swing.
- `bassPulse` — autocorr-lite: fraction of last 16 detected beats where bass envelope at
  beat time > 1.3× inter-beat mean. High = four-on-floor.

## 3. CLASSIFIER RULES (order matters; hysteresis stays at 90 frames)
```
flow    : energy < 0.10 || beatRate < 0.6
metal   : mid > .38 && high > .27 && energy > .40 && flatness > τf
house   : beatVar < 0.06 && bassPulse > 0.7 && bpm 118–132
hiphop  : bpm 80–106 && bass > .30 && high < .30 && beatVar > 0.06
salsa   : high > .22 && bass < .42 && beatRate ≥ 1.6
edm     : else
```
τf tuned empirically against the demo tracks (start 0.35). [GENERATED] thresholds —
expect one calibration pass; that IS the test plan (§6).

## 4. CHOREOGRAPHY PARAMS
### hiphop (research anchor: bounce + rock + isolation; groove sits BEHIND the beat)
- Base: chest bounce at beat rate with 60–90 ms lag on the phase snap (swagger = lateness):
  implement as `phaseLag = 0.12π` applied only in hiphop styleParams.
- Torso rock fwd/back (torsoPitch ±), shoulder alternation (new `shoulderRoll` param:
  rotate shL/shR y-offsets ±0.015 alternating), lean-back head (headPitch negative allowed
  — clamp floor at −0.25).
- Variants: 0 bounce+rock · 1 lean-back w/ arm cross (arms a1≈0.6/0.7 folded low) ·
  2 side-to-side slide (sway ×2.2, feet step wide).
### house (anchor: jacking torso wave + four-on-floor two-step)
- Torso wave: chest joint gets sinusoidal z at 2× beat rate offset from pelvis phase by
  ~0.3π → reads as ripple through the spine (uses existing chest joint index 2).
- Two-step feet: alternate footZ ±0.08 every beat, knees soft (bend 0.22 constant).
- Arms: low pumping elbows (a1 0.7–1.1 oscillating), hands loose.
- Variants: 0 jack+two-step · 1 arms-up hands sway (a1 2.2±0.2) · 2 half-time skank.

## 5. IMPLEMENTATION MAP (str_replace targets in current file)
1. STYLE_KEYS + styleW: add "hiphop","house"; rename "groove"→"edm" (keep alias in
   classifier for saved-state compat: accept "groove" input, emit "edm").
2. styleParams(): two new cases (+ shoulderRoll/phaseLag params → blend loop + skeleton).
3. Style row UI: 2 buttons (row already wraps <768px; verify 7 buttons still ≤2 rows).
4. TRACKS: add `hiphop` (88 BPM, halftime snare feel: kick 0/7, snare 4/12, sparse hats)
   and `house` (124 BPM, kick every beat, offbeat open hat, 8th bass) — self-test material.
5. Feature block: flatness/beatVar/bassPulse (≈25 lines).

## 6. TEST PLAN (headless, extend t_full.js)
- Play each of 4 demo tracks 20s in Auto → assert detected style matches track key
  (fifth→edm or metal acceptable? NO: assert exact; tune τ until true).
- Choreography distinctness: per style, head/hand travel signature assertions like the
  metal-variant sim (hiphop: chest z oscillation present; house: beatVar of foot steps < 0.1).
- Regression: existing 4 styles unchanged signatures ±15%.

## 7. ACCEPTANCE
All 6 auto-detections correct on their demo tracks in headless run; manual buttons work;
mobile row layout intact at 390px; zero console errors; frame-diff motion > 25k px in all styles.

## ADVERSARIAL / UNKNOWN-UNKNOWNS
- Salsa vs hiphop collision at ~95 BPM with bright percussion — beatVar is the discriminator;
  if it fails, salsa demands beatRate ≥ 1.8 (steps on 3 of 4 beats reads high).
- Flatness on lossy 96 kbps files skews high — may misread pop as metal; log flatness in
  DEBUG to make miscalls diagnosable in the field.
- 6-way heuristics will still miscall real-world edge genres; the override row is the contract.
