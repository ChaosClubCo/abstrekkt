# Arc Catalog

All **74 arcs**, grouped by tier. Generated from `arcs-data.json` - the source of truth. For the system that reads them see [`ARC_SYSTEM_DOCS.md`](ARC_SYSTEM_DOCS.md); for how the catalog reached its current shape see [`CHANGELOG.md`](CHANGELOG.md).

> **v1.5 (July 2026):** `chaosclubco` retired from the live roster - a superseded-brand arc per Kyle's Jun 2026 ruling (ChaosClubCo absorbed by Abstrekkt). Preserved verbatim in `arcs-archived.json` for lineage, not deleted. Personal tier is now 4, total 74. Full detail in `CHANGELOG.md`.

**Legend** - **Full** = 12-month curriculum authored (months | weeks | gates + prose).

> **v1.4 (July 2026):** All 44 roadmap arcs promoted from stub to full 12-month curriculum (months | weeks | gates), and all 44 now carry tradeoff/claims prose. Base library snapshotted to `arcs-data.backup2.json` / `arcs-prose.backup2.json` before the write. Nothing in the roadmap tier is a stub anymore - the distinction below is now just Original vs. Personal vs. Roadmap framing, not curriculum completeness.

| Tier | Count | Curriculum | Prose |
|---|---|---|---|
| Original | 26 | Full | Yes |
| Personal | Series 9 | 4 | Full | Not yet |
| Roadmap | 44 | Full | Yes |
| Archived | 1 (`chaosclubco`) | Full | - |

> **Series & lane gotcha:** the original 26 carry their authoritative `series` (1-3) and `lane` (A/B) in each tool's SEED map, not the JSON - so they group under Series 1 if you read the JSON alone. Roadmap + personal arcs carry `series` on the record. See [`EXTENDING.md`](EXTENDING.md).

## Original arcs - 26 | full curriculum + prose

The founding library. Full 12-month / 48-week curriculum with tradeoff + claims prose. Series 1-3 in the tools.

| id | Display | Focus |
|---|---|---|
| `mastery` | Gemini | Prompt engineering as a discipline. Google AI Studio + Vertex to mastery.... |
| `claude` | Claude | The deepening play. From Architect Foundations through Agent SDK, MCP... |
| `copilot` | Copilot | The paycheck lane. From M365 fluency through Copilot Studio depth, Power... |
| `openai` | OpenAI | The lingua franca play. From Responses API and reasoning models through the... |
| `practitioner` | Practitioner | All five platforms - One year. Claude, Gemini, Copilot, OpenAI - sequenced by... |
| `aiaas` | AIaaS | The business lane. From a vague "AI consulting" offer to a defined service... |
| `mcp` | MCP Builder | From 50+ connector consumer to ecosystem contributor. Protocol foundations,... |
| `security` | Security | Three frameworks cold. Two certs in hand. A red-team report, a multi-tenant... |
| `rag` | RAG & Data | The knowledge layer underneath every agent you have ever shipped. Embeddings,... |
| `n8n` | n8n | From functional to production-grade. Error handling, AI agent loops, parallel... |
| `brand` | Brand | Content that flows from real builds, not from the desire for followers.... |
| `teaching` | Teaching | Three tier packages built and tested. CLC piloted. Feedback systems live.... |
| `gcp` | GCP | From Microsoft-heavy practitioner to Google Cloud fluent. GCP fundamentals,... |
| `fullstack` | App | The bridge from automation to product. Next.js, FastAPI or Hono, Supabase... |
| `azure` | Foundry | From Copilot Studio implementer to Microsoft AI engineer. Azure resource... |
| `eval` | Eval | Eval becomes a first-class discipline rather than a byproduct. Golden dataset... |
| `voice` | Voice | Text chat is the current paradigm. Voice is the next. The latency budget, the... |
| `strategy` | Strategy | From "I build AI systems" to "I advise on which AI systems to build."... |
| `cloudflare` | Edge | Past webhook relays into production edge AI infrastructure. Workers AI,... |
| `book` | Book | One book chosen at M1 - memoir or practitioner, never both. Spine, structure,... |
| `course` | Course | From curriculum content to a real course business - Maven cohort or... |
| `saas` | SaaS | From "I shipped an app" to "I run a SaaS business." MVP validated with design... |
| `partner` | Anchor | From Partner Network listing to Partner Network as primary revenue channel.... |
| `regulated` | Regulated | From SecAI+/CAISP-credentialed AI security practitioner to the person... |
| `evalexpert` | Safety | From AI eval practitioner to independent practitioner researcher in AI... |
| `enterprise` | Architect | From AI implementation practitioner to the architect Fortune 500 clients call... |

> `mastery` displays as **Gemini** (key unchanged - see the naming gotcha in the docs).

## Personal arcs - 4 | Series 9 | full curriculum

Ventures and voice. Full curriculum, extracted from source in v1.3; tradeoff prose not authored yet.

| id | Display | Focus |
|---|---|---|
| `flashfusion` | FlashFusion | Champion model: train the domain expert, exit the dependency. Live pipeline... |
| `abstrekkt` | Abstrekkt Products | The software portfolio under the parent: claude-code-plugins-plus (244... absorbed the retired ChaosClubCo lane, see below. |
| `memoir` | Memoir | Twelve months to a submittable manuscript. Excavation completion -> first... |
| `readingroom` | Reading Room | Twelve months of editorial work. Load-Bearing newsletter as the spine; essay... |

**Archived:** `chaosclubco` (ChaosClubCo) - retired brand, superseded by `abstrekkt`. Full content preserved in `arcs-archived.json`, not in the live rail/pickers. See `CHANGELOG.md` v1.5.

## Roadmap arcs - 44 | full curriculum + prose (v1.4)

The long roadmap. As of v1.4 every arc carries full 12-month/48-week curriculum (months, weeks, gates) plus tradeoff/claims prose - promoted from one-line stubs. They appear in every surface (rail, pickers, dependency pills) and collect in Portfolio's **Series Four+** section.

### Series 1 - Foundation | 8

| id | Display | Focus |
|---|---|---|
| `prompt` | Prompt | Systematic prompting | few-shot | chain-of-thought | evals |
| `foundations` | Foundations | LLM mechanics | tokens | context windows | model selection |
| `python` | Python | Scripting | data structures | APIs | first automation |
| `cloud` | Cloud | AZ-900 | compute | storage | networking | IAM basics |
| `knowledge` | Knowledge | Notion | PKM fundamentals | capture system | retrieval habits |
| `devtools` | Developer | Git | GitHub | VS Code | environment setup | dev hygiene |
| `langchain` | Framework | LangChain | LlamaIndex | tool calling | first agent |
| `bizformation` | Formation | LLC | EIN | business banking | contracts | basic accounting |

### Series 3 - Output & Production | 6

| id | Display | Focus |
|---|---|---|
| `multimodal` | Multimodal | Vision | document AI | image understanding | OCR pipelines |
| `finetune` | Fine-Tuning | LoRA | QLoRA | OpenAI fine-tuning | Hugging Face |
| `aisec` | Red-Teaming | OWASP LLM Top 10 | prompt injection | adversarial eval |
| `dataeng` | Data | dbt | Airflow | feature stores | ETL for AI |
| `mlops` | Observability | LangSmith | cost monitoring | drift detection | prod ops |
| `consulting` | Infrastructure | SOW templates | pricing models | legal | CRM |

### Series 4 - Principal Layer | 5

| id | Display | Focus |
|---|---|---|
| `enterprise-sales` | Sales | Discovery | RFP | procurement cycles | $50K+ deals |
| `governance` | Governance | EU AI Act | model cards | bias testing | compliance docs |
| `memory` | Memory | Long-term memory | episodic state | MemGPT | persistent agents |
| `local-ai` | Private | Ollama | llama.cpp | Apple Silicon | on-prem inference |
| `devex` | MCP | Claude Code | MCP servers | DX design | tooling telemetry |

### Series 5 - Depth Layer | 7

| id | Display | Focus |
|---|---|---|
| `vertical` | Vertical | Healthcare | legal | finance | regulated-industry depth |
| `infra` | Infrastructure | vLLM | TensorRT | Kubernetes | GPU inference optimization |
| `synthetic` | Synthetic | Data generation | privacy-preserving | eval dataset design |
| `genmedia` | Media | Sora | Runway | ElevenLabs | image-to-video pipelines |
| `agenthiring` | Agent | Multi-agent systems | orchestration | role specialization | HITL |
| `community` | Community | Discord | cohort learning | peer network | recurring revenue |
| `aidev` | Development | Copilot Enterprise | automated review | test generation | devex metrics |

### Series 6 - Leverage & Assets | 4

| id | Display | Focus |
|---|---|---|
| `research` | Research | Benchmarks | published methodology | practitioner papers | citations |
| `firm` | Firm | Subcontracting | hiring | SOPs | team delivery | margin architecture |
| `angel` | Syndicate | Angel investing | AngelList | technical due diligence | deal flow |
| `ip` | Portfolio | Frameworks | trademarks | licensing | acqui-hire positioning |

### Series 7 - Influence Layer | 7

| id | Display | Focus |
|---|---|---|
| `personalos` | Personal | PKM maturity | second brain | AI memory infrastructure | teachable system |
| `oss` | Source | Core contributor | LangChain/LlamaIndex | OSS tooling | GitHub authority |
| `speaking` | Keynote | Conference circuit | paid keynotes | speaker fees | thought leadership |
| `education` | Education | K-12 AI | higher ed | curriculum design | institutional clients |
| `policy` | Policy | NIST AI RMF | IEEE | regulatory comments | standards authorship |
| `ma` | Advisory | Technical due diligence | AI company valuation | PE/VC advisory | deal fees |
| `impact` | Impact | Nonprofit AI | mission-driven | Chaos Club as case study | pro bono program |

### Series 8 - Meta Layer | 7

| id | Display | Focus |
|---|---|---|
| `succession` | Succession | Delegation architecture | operator handoff | the bus-factor problem |
| `cofounder` | Founder | Partnership architecture | equity | the offer worth taking |
| `capital` | Capital | Personal holding co | acquisitions | portfolio thinking | Abstrekkt as engine |
| `board` | Board | Board seats | advisory roles | governance from the inside | institutional... |
| `institute` | Institute | Training org | cohort engine | the school that outlasts you | institutional... |
| `sabbatical` | Reinvention | Sabbatical | the deliberate stop | the next thing | permission to leave |
| `legacy` | Legacy | What outlasts you | the letter finished | what it was all for |

---
*Generated July 16, 2026 | suite v1.5 | regenerate from `arcs-data.json` after any base-library change.*