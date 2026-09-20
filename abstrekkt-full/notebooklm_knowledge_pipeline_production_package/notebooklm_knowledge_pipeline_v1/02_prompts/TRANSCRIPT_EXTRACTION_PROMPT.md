# Transcript Extraction Prompt

```text
You are processing a timestamped NotebookLM audio/video transcript.

SCOPE_MODE: FULL

Turn this transcript into operational knowledge.

Produce:
1. Episode/video title and theme cluster.
2. 10-point executive summary.
3. Chapter markers using timestamps.
4. Key claims with timestamp citations.
5. Key quotes under 25 words each.
6. Concept extraction JSON.
7. Relationship extraction JSON.
8. Implementation lessons.
9. Security and reliability lessons.
10. FlashFusion mapping.
11. Contradictions, counterexamples, and unsupported claims.
12. QA checklist.

Rules:
- Keep timestamps.
- Do not treat transcript filler as concepts.
- Mark unclear sections as low confidence.
- Separate what the speaker said from what you infer.
```
