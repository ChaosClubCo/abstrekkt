# Asset Manifest

## Deck lane — OCR required

| Priority | File | Status | Required output |
|---:|---|---|---|
| 1 | The_AI_Operating_System.pdf | OCR required | OCR PDF, TXT, summary, concepts JSON, graph, FlashFusion map |
| 2 | The_Agentic_Stack.pdf | OCR required | OCR PDF, TXT, summary, concepts JSON, graph, FlashFusion map |
| 3 | The_Agentic_Blueprint.pdf | OCR required | OCR PDF, TXT, summary, concepts JSON, graph, FlashFusion map |
| 4 | Agentic_OS_Architecture.pdf | OCR required | OCR PDF, TXT, summary, concepts JSON, graph, FlashFusion map |
| 5 | Architecting_Agentic_Systems.pdf | OCR required | OCR PDF, TXT, summary, concepts JSON, graph, FlashFusion map |
| 6 | Agentic_Architecture.pdf | OCR required | OCR PDF, TXT, summary, concepts JSON, graph, FlashFusion map |
| 7 | Architecting_Agentic_AI.pdf | OCR required | OCR PDF, TXT, summary, concepts JSON, graph, FlashFusion map |
| 8 | Architecting_Secure_Autonomy.pdf | OCR required | OCR PDF, TXT, summary, concepts JSON, graph, FlashFusion map |
| 9 | The_Autonomous_AI_Blueprint.pdf | OCR required | OCR PDF, TXT, summary, concepts JSON, graph, FlashFusion map |

Duplicate to skip: `The_Agentic_Blueprint (1).pdf` unless SHA-256 hash differs from base file.

## Visual lane — processable now

`unnamed.png` through `unnamed (11).png` should be renamed after inspection using this pattern:

```text
visual_001_<short-topic>.png
visual_002_<short-topic>.png
```

Required outputs per visual:

- visual summary markdown
- extracted text if present
- entity list
- relationship list
- graph candidates
- confidence notes

## Audio lane — transcript required

Fifteen M4A files require transcripts. Keep TXT, SRT, and JSON transcript formats where possible. Skip duplicate `(1)` files unless hash differs.

## Video lane — transcript required

Ten MP4 files require transcripts. Whisper can extract audio automatically. Keep timestamped transcripts because they enable source citations like `The_Claude_Code_Ecosystem.mp4 @ 00:12:43`.
