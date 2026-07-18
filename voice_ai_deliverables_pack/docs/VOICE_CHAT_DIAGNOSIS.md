# Why Live Voice Chat Feels Bad (and why it lies sometimes) — Notes (Generated 2026-02-04)

Live voice assistants are a stack of compromises wearing a friendly voice.

## 1) Latency forces the model to "guess early"
Voice systems often stream partial audio, then stream partial text back. To feel responsive, the system begins responding before you finish. That creates:
- interrupted turns
- shallow replies
- wrong assumptions that never get corrected because the next turn already started

## 2) Tool access is surface-dependent
The same brand name can represent different products:
- Chat UI voice mode: generally **no direct OS access**
- CLI/tooling: **can** touch files, because it's running locally

So you get contradictions like: “I can't interact with your computer” vs “I just used Claude Code CLI to edit files.”
Both can be true because they're different execution surfaces.

## 3) Safety policies + uncertainty + UX smoothing = "false negatives"
When a system is unsure whether it has tool access, it often defaults to “I can’t.” 
That prevents accidental overclaiming, but it reads like gaslighting when you *know* a path exists.

## 4) Context window + voice truncation
Voice UIs often capture less context than chat:
- shorter turns
- transcription errors
- lost system prompts / tool instructions
- aggressive summarization

## 5) What to do (practical)
- Use voice for exploration; use CLI/editor for execution.
- In voice mode, explicitly declare the surface:
  - “We are NOT executing commands. This is ideation only.”
- In CLI, explicitly constrain operations:
  - “Operate only in this folder; show plan; apply diff; run tests.”

## 6) Debug checklist
- Are you in a chat UI or a CLI session?
- Does the session show tool indicators?
- Can you run a trivial file write in the target directory?
- Are OS privacy protections blocking your terminal/editor?
