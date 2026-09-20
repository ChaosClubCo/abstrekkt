# Public API

## POST /api/generate/lesson
Body: `{ "topic": "Photosynthesis", "level": "Grade 6" }`
Returns: `{ topic, level, objectives[], activities[], standards[] }`

## POST /api/generate/flashcards
Body: `{ "topic": "French verbs" }`
Returns: `{ topic, cards: [{q,a}] }`
