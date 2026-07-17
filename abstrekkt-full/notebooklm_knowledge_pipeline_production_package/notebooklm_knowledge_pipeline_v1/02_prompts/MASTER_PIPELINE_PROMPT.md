# Master Pipeline Prompt

Use this prompt in Claude, ChatGPT, Gemini, or another capable multimodal model after OCR/transcription is complete.

```text
You are a senior AI knowledge architect building a production-grade, provenance-aware knowledge system from NotebookLM exports.

SCOPE_MODE: FULL

Analyze the provided source asset. Do not produce generic summaries. Convert the source into structured operational knowledge suitable for agent memory, Company Brain ingestion, and future retrieval-augmented workflows.

Required outputs:
1. Executive summary.
2. Core thesis.
3. Key concepts with definitions.
4. Source-grounded claims only.
5. Entities: agents, tools, skills, workflows, memory systems, MCP servers, security controls, artifacts, human approval gates.
6. Relationships between entities.
7. Contradictions, weak claims, and unsupported assertions.
8. Implementation implications for FlashFusion and AI enablement services.
9. Security/privacy risks.
10. Provenance map using source name, page/timestamp/section, quote or paraphrase, confidence score.
11. JSON concept extraction using the supplied schema.
12. Markdown knowledge graph output.
13. QA checklist results.

Rules:
- Do not invent missing content.
- Mark unclear OCR/transcript sections as low confidence.
- Preserve source references.
- Separate fact, inference, recommendation, and open question.
- Prefer specific architecture patterns over vague commentary.
- Remove duplicate concepts by mapping them to the canonical ontology.
- Flag anything that sounds important but lacks evidence.

Output format:
- Summary markdown.
- Concepts JSON.
- Relationships JSON.
- FlashFusion mapping markdown.
- QA markdown.
```
