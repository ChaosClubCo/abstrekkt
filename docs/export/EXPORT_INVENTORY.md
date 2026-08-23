# Abstrekkt Phase 0 Export Inventory

## Executive summary

Phase 0 is **PASS** for the accessible evidence universe at `8afac7feab6d1eb46f2e31c344b4a3f53baf6a67`. The inventory contains **31,150** stable records. No substantive content was migrated: the only proposed GitHub mutation is this five-receipt evidence set.

The target repository remains `Krosebrook/abstrekkt`. Its current tree is a mixed historical corpus, not a presumed source of truth: **23,977 blobs / 1,466,148,517 declared bytes** contain Abstrekkt, Loxihart, INT/Intinc, personal/memoir, FlashFusion-era, and unrelated material. Classification is therefore evidence- and lane-based rather than path- or recency-based.

## Inventory scope

| Source type | Records |
|---|---:|
| `access_receipt` | 4 |
| `archive_member` | 3,134 |
| `deployment_provider_evidence` | 4 |
| `file_library_file` | 3,474 |
| `generated_phase0_receipt` | 5 |
| `github_blob` | 23,977 |
| `github_branch` | 22 |
| `github_ci_evidence` | 1 |
| `github_commit` | 100 |
| `github_issue` | 1 |
| `github_pull_request` | 21 |
| `google_drive_file` | 321 |
| `google_drive_folder` | 74 |
| `project_conversation_summary` | 10 |
| `verification_receipt` | 2 |

## Dispositions

| Disposition | Count |
|---|---:|
| `EXCLUDE` | 9,475 |
| `HISTORICAL_ARCHIVE` | 21,437 |
| `IMPORT` | 9 |
| `REFERENCE_ONLY` | 229 |

Every row has exactly one allowed disposition. `IMPORT` means an inspected evidence item or generated Phase 0 receipt is eligible for a later target; it does not mean substantive content was copied in this phase. Loxihart executable internals are `REFERENCE_ONLY`; INT/Intinc and private composites are `EXCLUDE`.

## Evidence states

| Lifecycle state | Count |
|---|---:|
| `BLOCKED` | 1 |
| `DERIVED_FROM_SOURCE` | 15 |
| `EXCLUDED` | 9,475 |
| `HISTORICAL` | 21,422 |
| `PROPOSED` | 12 |
| `REFERENCE_ONLY` | 205 |
| `SOURCE_BACKED` | 11 |
| `VERIFIED` | 9 |

The remaining `BLOCKED` record is the public-domain reachability observation. It is an explicit evidence state, not a failed inventory gate: no current deployment, URL, publication, or business claim was inferred from it.

## Publication states

| Publication state | Count |
|---|---:|
| `ARCHIVED` | 715 |
| `DRAFT` | 210 |
| `UNKNOWN` | 30,225 |

No row is `PUBLISHED`. Repository presence, design polish, a content calendar, a route specification, or a provider deployment record was not accepted as publication proof.

## Byte-level archive and duplicate findings

- **33 archives / 3,408 members** were streamed without extraction; 3,134 non-directory members have source-specific inventory records and SHA-256 values.
- Archive safety checks found **0 unsafe paths, 0 links, and 0 encrypted members**.
- The archive set contains **4 exact outer-byte duplicate groups**, **4 semantic member-content groups**, **4 normalized-text groups**, and **21 revision families**.
- Twelve private-source composite archives are `EXCLUDE` as wholes. Their raw bytes are not Git targets; member metadata is retained only for provenance.
- Nine archives produced 45 secret-pattern matches. Context adjudication classified all 45 as placeholders or code references; no likely live secret was identified. This does not authorize importing otherwise private or other-lane packages.
- **45/45** same-title/same-size Google Drive candidate groups (**102 files**) were fetched and proved exact duplicates by SHA-256. Three cross-name design-token files also share SHA-256 `a2eb992db0dd623c6d653c422b6e2685f77074a46df1587eb15f23fe5a841088`.
- `/SacredJourneys/Pasted text.txt` and `/Abstrekkt/Pasted text.txt` are exact private-source duplicates at SHA-256 `f510d2dc86be954610938c3dbb958170be773767b9361b3c113c90d60af5e3e9`; both are `EXCLUDE`.

## Source findings

- GitHub main is bound to `8afac7feab6d1eb46f2e31c344b4a3f53baf6a67`; the recursive tree response was complete (`truncated=false`). Branch, pull-request, issue, commit, exact-SHA check, and workflow-definition evidence is inventoried where the native connector exposed it.
- Issue #22 is source-backed organizational-boundary evidence: Loxihart needs its own canonical product repository. Loxihart runtime, control, release, authentication, signing, and private product evidence remains `REFERENCE_ONLY` here.
- File Library enumeration covered all 18 returned pages (3,503 entries / 3,474 files). All discovered Abstrekkt-named and related unresolved private-source archives in scope were materialized for safe screening.
- Ten accessible project-context summaries are inventory metadata only. Raw conversation text was not fabricated where no enumerable export route existed.
- The accessible Netlify account returned no Abstrekkt project. The Vercel project `abstrekkt-blog` exposes a production deployment in `ERROR`, no bound Git SHA, and no evidence that it serves `abstrekkt.com`. Current public deployment remains `UNKNOWN/BLOCKED`.
- The current GitHub workflow directory contains Loxihart-oriented workflows but no identified Abstrekkt public-site workflow. Native release/deployment list routes were unavailable; absence of releases was not inferred.

## Classification method

The record ledger preserves exact source, source repository/revision where available, SHA-256 or Git blob SHA, authority domain, lifecycle and publication states, lane, one disposition, target, duplicate and revision relationships, derivation, contradiction references, secret-screen status, verification requirement, confidence, and notes. Exact identity, normalized text, archive member multisets, source metadata, and revision-family similarity were kept distinct.

## Implementation considerations

Future changes should revise records transactionally and retain previous disposition/state plus supporting evidence. Materialize archives only into isolated temporary directories with traversal, link, encryption, quota, and secret controls. Phase 1 may define authority; it must not retroactively rewrite Phase 0 provenance.

## Performance and security notes

The repository declares about 1.47 GB across 23,977 blobs. Full-history or bulk-byte work should be content-addressed and batched. No raw private source, `.env` value, credential, token, cookie, key, deployment secret, or service-account material belongs in this five-file commit.

## Claims check

This inventory verifies source observations and byte relationships. It does not verify a business claim, publication truth, production accessibility, successful deployment, design fidelity, analytics operation, accessibility conformance, or SEO completeness.

## Remaining unknowns

Current public-site authority, successful exact-SHA deployment, approved public Loxihart description, design-system precedence, Reading Room authority, and publication/claim approval remain unresolved. They are preserved in `MIGRATION_CONTRADICTIONS.md` for later phases rather than treated as Phase 0 inventory failures.
