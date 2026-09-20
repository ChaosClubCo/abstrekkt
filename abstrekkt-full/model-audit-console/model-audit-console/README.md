# model-audit-console

Runs a source file through Claude, GPT, and Gemini in parallel, each auditing
across the same six categories (security, architecture, qa, performance,
devops, accessibility), then merges the results by agreement so you can see
which findings are cross-model-confirmed vs. single-model flags.

Built because Claude self-reviewing its own output has an obvious blind
spot: a second and third model give you independent grading, not just a
second read of the same reasoning.

## Setup

```bash
npm install
cp .env.example .env
# fill in ANTHROPIC_API_KEY, OPENAI_API_KEY, GEMINI_API_KEY in .env
```

Keys are read from `process.env` server-side only. Never commit `.env`.
Never move these keys into a browser bundle if you extend this into a web
console (see "Escalation path" below) — use a server-side proxy (Cloudflare
Worker secrets, Node backend, etc.) instead.

## Usage

```bash
npm run audit -- <path-to-file>
npm run audit -- <path-to-file> --skip-claude   # only GPT + Gemini
```

Example:
```bash
npm run audit -- ../pocket-isle/src/components/IslandRenderer.tsx
```

Output is a markdown report to stdout. Redirect to a file if you want it saved:
```bash
npm run audit -- src/App.tsx > audit-report.md
```

## Smoke test

Run it against a file you already know has an issue (an exposed secret, a
missing loading state, an unhandled promise rejection) and confirm it
surfaces. If 2+ models catch it independently, it lands under "Confirmed" —
that's the signal this tool exists to produce.

## Known limitations (read before trusting this blindly)

- **Single file only.** No directory/glob support yet. To extend: loop the
  `main()` logic in `src/index.ts` over `fs.readdirSync` matches and
  concatenate reports. Trivial but not built — flagging honestly rather than
  pretending it's there.
- **Merge heuristic is crude.** `src/merge.ts` buckets findings by
  persona + first-8-normalized-words of the description. This *under-merges*
  more than it over-merges: the same real issue described in different
  wording by two models will often show up as two separate single-model
  findings instead of one confirmed finding. Treat "Confirmed" counts as a
  floor, not a ceiling — read the single-model section too.
- **No retry/backoff.** All three providers rate-limit differently. A 429
  currently just shows up as a provider error in the report, not a retry.
- **No cost ceiling.** Each run is up to 3 LLM calls on one file. Nothing
  stops you from pointing this at a huge file and burning tokens on all
  three providers. Add a size check before scripting this into CI or a
  cron job.
- **LLM output is non-deterministic.** Re-running on the same file can
  produce different findings from the same model. This is a second opinion
  tool, not a certification.

## Escalation path — web console instead of CLI

If you want a GUI instead of a terminal command: wrap this same provider
logic in a Cloudflare Worker (API keys as Worker secrets, matching your
existing stack), expose one POST endpoint `{ filename, code } -> report`,
and point a small frontend (could be a Claude-built artifact) at *your*
Worker — never at the provider APIs directly. That keeps every key
server-side. Not built here; ask if you want it scaffolded.

## Acceptance checklist for calling this "done" rather than "skeleton"

- [ ] Directory/glob support
- [ ] Retry/backoff on 429s per provider
- [ ] Cost ceiling / `--max-files` guard
- [ ] Unit tests on `merge.ts` bucketing (the fragile part)
- [ ] CI run on a known-bad fixture file to catch regressions in prompt/parsing
