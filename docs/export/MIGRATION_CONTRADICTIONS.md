# Migration Contradictions

Status: **OPEN / PRESERVED**  
Inventory revision: `8afac7feab6d1eb46f2e31c344b4a3f53baf6a67`  
Generated: `2026-08-22T00:00:00-05:00`

No contradiction below was silently resolved. `RESOLVED_FOR_PHASE0` means the inventory containment or byte-identity question is settled; it does not establish Phase 1 source authority.

| ID | Contradiction | Evidence | State | Required resolution |
|---|---|---|---|---|
| C-0001 | Repository identity versus contents | The repository named Abstrekkt contains Abstrekkt, Loxihart, INT/Intinc, personal/memoir, FlashFusion-era, and unrelated application material. | OPEN | Resolve directory ownership by authority domain; repository residence is not canonicality. |
| C-0002 | Loxihart separation versus merged implementation | Issue #22 declares Loxihart a separate product repository, while main includes Loxihart implementation and release material. | SOURCE_BACKED | Keep executable internals `REFERENCE_ONLY`; verify the product-repository cutover before deletion. |
| C-0003 | Netlify configuration versus provider account | `netlify.toml` names a public-site package but says the repository is not linked; the accessible Netlify census returned no Abstrekkt project. | OPEN | Require site ID, repository SHA, deploy, environment, URL, and timestamp before a deployment claim. |
| C-0004 | Public-site expectation versus observed deployment | `abstrekkt-blog` exists in Vercel, but the accessible production deployment is in `ERROR`, lacks a Git SHA, and exposes only provider aliases; independent domain read-back was unavailable. | BLOCKED | Current public implementation and canonical host remain `UNKNOWN`. |
| C-0005 | `PROJECT_STATE.md` current label versus chronology | The file labels itself current as of June 2026; inspected main is August 2026 and the document spans personal, FlashFusion, INT, and domain state. | OPEN | Treat as historical evidence until domain authority is established. |
| C-0006 | Legacy registry scope versus present boundary | A historical registry groups memoir, press, publishing, FlashFusion delivery, and cross-lane material under Abstrekkt. | OPEN | Do not import personal sources or another lane's internals from the legacy grouping. |
| C-0007 | Potential duplicate design-token sources | Three related Drive CSS token files use different names/locations. Original bytes share SHA-256 `a2eb992db0dd623c6d653c422b6e2685f77074a46df1587eb15f23fe5a841088`. | RESOLVED_FOR_PHASE0 | Byte identity is proven; design-system authority remains C-0008. |
| C-0008 | Multiple design and architecture packages | GitHub, Library, and Drive contain multiple token, architecture, landing, and handoff packages without a source-backed precedence decision. | OPEN | Keep historical/proposed until Phase 1 defines design and implementation authority. |
| C-0009 | Publishing plans versus publication proof | Sources contain essays, calendars, article/Reading Room concepts, and site packages, but no complete URL-bound publication ledger. | OPEN | Preserve `DRAFT` or `UNKNOWN` unless a source proves `APPROVED`, `PUBLISHED`, or `ARCHIVED`. |
| C-0010 | Historical purge report versus current corpus | A prior audit documents a purge. Current unresolved archives were separately streamed and screened: 45 matches were placeholders/code references; private composites remain excluded. | RESOLVED_FOR_PHASE0 | Do not generalize archive results into full-history clearance or future import authorization. |
| C-0011 | Loxihart public relationship unresolved | Separate implementation ownership is source-backed, but the approved public portfolio description and supporting claims are not established. | OPEN | Carry only safe provenance until portfolio authority and claim evidence exist. |
| C-0012 | FlashFusion-era role unresolved | FlashFusion-era materials appear as design, delivery, historical, and project artifacts without a single current authority classification. | OPEN | Keep historical until the correct authority decides current reference, separate lane, or exclusion. |
| C-0013 | Memoir tool path versus publication ownership | Memoir source-map code lives under `project/abstrekkt`, but placement does not establish an intentional publication relationship. | OPEN | Raw/private memoir material stays excluded absent explicit publication authority and a safe derivative. |
| C-0014 | Loxihart extraction state | An extraction issue and branch exist, but target-repository hash read-back was not available in this execution. | BLOCKED | Do not mark extraction or deletion complete. |
| C-0015 | Provider naming versus organizational authority | The Vercel project sits under a FlashFusion team and is named `abstrekkt-blog`; neither label proves canonical Abstrekkt deployment. | OPEN | Bind authority to governance plus exact deployment evidence. |
| C-0016 | Private composite archives versus potentially publishable derivatives | Twelve screened archives contain private/personal source indicators, while some eventual essays may derive from them. | RESOLVED_FOR_PHASE0 | Raw packages and all members are `EXCLUDE`; only separately authorized, safely redacted derivatives may be reconsidered. |

## Decision rule

When sources disagree, retain both, cross-reference the contradiction, and defer substantive resolution to the authority domain that can decide it. A deployed page cannot decide corporate ownership; governance cannot prove deployment; a design handoff cannot prove production fidelity; a calendar cannot prove publication; and publication cannot verify each factual claim.
