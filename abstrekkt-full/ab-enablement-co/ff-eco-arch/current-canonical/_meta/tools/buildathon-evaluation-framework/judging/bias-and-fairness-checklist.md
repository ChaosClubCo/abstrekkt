# Bias & Fairness Checklist

Scoring can encode bias even when the math is deterministic. Use this checklist
before, during, and after a judging round.

## Known bias risks in this rubric

- **Polish bias.** Platform Fit and "visual polish" reward slick demos. The
  source explicitly warns that a "pretty but dangerous" project can score high on
  Fit while failing Pain/Quality — the kill switches exist to counter this. Do
  not let a good-looking demo inflate other dimensions.
- **Commit bias.** The deterministic evaluator under-scores work done locally but
  not committed. Teams that push often look better than teams doing equivalent
  work offline. When judging by repo signals, account for this or ask for the
  full picture.
- **UNKNOWN-penalty bias against R&D.** Penalizing UNKNOWNs punishes legitimate
  exploration. Mitigate by labeling genuine exploration `Spike` and excluding it
  from SHIP ranking rather than tanking its score.
- **Stack-familiarity bias.** Judges may over-rate stacks they personally know
  and over-flag unfamiliar ones as "risk". Rate the *evidence of risk*, not your
  comfort level.
- **Halo / first-impression bias.** A strong README or founder reputation can
  bleed into unrelated dimensions. Score each dimension from its own evidence.
- **LLM judge bias.** An LLM scorer can be swayed by verbose or persuasive text.
  Force repo-first extraction and require artifact references per field.

## Pre-round (calibration)

- [ ] At least 2 judges independently scored a shared sample project.
- [ ] Composite spread on the sample is within ~10 points; statuses agree.
- [ ] Evidence-interpretation disagreements were reconciled and written down.
- [ ] Weights are fixed for the whole field (any reweight applies to all entries).

## Per-submission

- [ ] Every YES/MAYBE has a cited artifact (no bare assertions).
- [ ] Quality gates marked passed only when implemented AND verifiable.
- [ ] UNKNOWN penalties applied, not silently skipped.
- [ ] Composite computed by formula, not estimated.
- [ ] Kill switches applied after composite.
- [ ] Conflicts of interest checked; recusal recorded if needed.
- [ ] Score is justified in 2 lines that reference evidence, not vibes.

## Post-round (audit)

- [ ] Re-score a random 10–20% with a second judge; flag large divergences.
- [ ] Check whether any single dimension is driving all rankings (over-weighting).
- [ ] Confirm no protected-attribute proxy (team, region, seniority) correlates
      with scores beyond what evidence justifies.
- [ ] Publish the rubric + the scoring sheet so results are contestable.

## Fairness defaults

- Same evidence bar for every entry.
- Same formula and weights for every entry in a field.
- Recusal over self-scoring.
- Kill switches are not waivable for convenience; use the documented escape
  hatches (Spike label, 48h validation sprint) instead.
