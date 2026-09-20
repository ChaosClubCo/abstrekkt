# abstrekkt-curated-necessary — Organization Index
**Organized:** 2026-07-10 · 6-pass reorganization · **Zero deletions** — every original byte verified present after the move (hash-compared).

## Folder map

| Folder | Contents |
|---|---|
| `00_start-here\` | README_START_HERE, QUICK_START_GUIDE, DISPOSITION_MANIFEST.csv, KANBAN_BOARD |
| `01_memoir\planning\` | Braindump → outline sequence (01–07), project instructions/knowledge, arc spec, Part II chapters, scene protocols, material bank, evidence board, primary-source archive, construction draft |
| `01_memoir\characters\` | char-* profiles (diagnostic-instinct, kinsley, pre-injury-kyle) |
| `01_memoir\songs\` | All 30 ALL_CAPS lyric .txt files + song_mining_excavation_hub.html + hold-on-dad.html |
| `01_memoir\hubs-apps\` | memoir engines, hubs, explorers, title cards, sudowrite exports, genre profiles, construction-manifesto |
| `01_memoir\evidence\` | rogers-bh-clinical-timeline.md, Rosebrook_K_Eval.docx |
| `02_flashfusion\content\` | ff-* blogs/essays, MSP blog posts, content strategy, newsletter, KB-automation case study |
| `02_flashfusion\business\` | Pricing pressure test, demo-day plan, journalist targeting, pitch kanban, proposal/outreach/objection templates, LLC kit, launch readiness, 9-agent sprint plan, **ai-consultancy-pricing-strategy-report.md** (was the extensionless file `research`) |
| `03_personal-brand\blog-essays\` | kr-blog-*, lb-essay-* (load-bearing series), claude-code essays, social posts, strategic playbook, video scripts, breathe/chaos-club pieces |
| `03_personal-brand\arc-series\` | agent-series-viewer + all *-arc.jsx + next-7-arcs series |
| `04_client-projects\` | CLC, Ryan Ironhorse, Union VP, Milwaukee Rentals, Warm Prospects, LAFU custom print, Central States brief, Mark Hoppe call prep, HOVAV admin panel, room configurator |
| `05_workshop-toolkit\` | Numbered suite (00–06 jsx), facilitator/employee suites, playbooks (tech/non-tech), templates 02–04, scorecards, cert guide, platform guides, persona cards, logic-of-leverage course |
| `06_apps-dashboards\` | Standalone jsx/html tools: dispatch-v3, drive audit, lane allocator, workstream mapper, newsletter series, config explorers, connection maps, session dashboards, n8n seeder workflow, kyle-mcp zip |
| `07_reference\` | Anthropic ecosystem ref, Genkit 2026 ref, AI-sycophancy artifact, tool-archaeology FINAL |
| `murmwarevidencearchive20260708\` | **Untouched** except: flashfusion-production.env moved into its `protected\` subfolder |
| `userPreferences_kyle_v3\` | Untouched except: new `media\` subfolder now holds the wav/webm/m4a + rr-1..10 pngs |

## Quarantine folders (nothing deleted — restore with a simple move)

- `_duplicates\` — 10 byte-identical PNGs (rr-11..rr-20 duplicated rr-1..rr-10 exactly). See `DUPLICATES_LOG.md`.
- `_versions\` — 5 superseded near-duplicates with rationale in `VERSIONS_LOG.md`:
  - PLEASE_DAD_I_NEED_YOU.txt (98% identical to PLEASE_DADDY variant, which was kept)
  - tool-archaeology-apr2026-comprehensive.md (FINAL kept)
  - kr-blog-vibe-coding.html (82% identical to kr-blog-vibe-coded-response.html, which was kept)
  - SONG_HUB_SOURCE_CODE.html (78% identical to song_mining_excavation_hub.html, which was kept)
  - dispatch-v2.jsx (v3 kept)
- `_organize\` — `inventory_before.csv` / `inventory_after.csv` (full MD5 manifests, before/after)

## Duplicates intentionally left in place
- `Autonoma AI Platform.txt` (sales kit `00_sources\`) == `01-autonoma-...-source.md` (flashfusion export `architecture\`) — each copy belongs to a self-contained export kit; pulling one would break that kit's manifest.

## ⚠ SECURITY FLAG
`murmwarevidencearchive20260708\protected\flashfusion-production.env` contains **165 lines of KEY/TOKEN/SECRET/PASSWORD entries** (production credentials). It now sits in `protected\`, but it is still plaintext on disk inside a folder that gets shared/staged. Recommend: rotate anything live in it and store secrets in a manager (1Password/Doppler), keeping only a redacted template here.

## Judgment calls (reversible)
- `research` (no extension) was a pricing/business-plan strategy report → renamed `ai-consultancy-pricing-strategy-report.md` under `02_flashfusion\business\`.
- `30_second_test.docx` filed under `05_workshop-toolkit\` (assumed assessment artifact, not memoir).
- `construction-manifesto.html` + construction draft filed under memoir ("Construction, Not Recovery" is memoir material).
- `chapter11_session_handoff.html` + `breathe_landing.html` filed under personal-brand (Chaos Club Co.).
- `.gdoc` stubs in flashfusion sprint-1-deliverables are 178-byte Google Drive pointers — left as-is; the real content lives in Drive.

## Verification
- Files before: 360 · after: 362 (delta = the two quarantine logs)
- Every original MD5 hash present at identical count post-move: **PASS**
