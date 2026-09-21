# Whisper Transcription SOP

## Goal

Create timestamped transcripts for all NotebookLM M4A and MP4 files so audio/video content can enter the knowledge graph with reliable provenance.

## Required outputs

For each media asset produce:

```text
<asset>.txt
<asset>.srt
<asset>.vtt
<asset>.json
```

## Recommended command

```powershell
whisper "C:\Users\kyler\Downloads\NLM_PIPELINE\01_deduped\media\*.m4a" --model medium --language en --output_dir "C:\Users\kyler\Downloads\NLM_PIPELINE\03_transcripts"
whisper "C:\Users\kyler\Downloads\NLM_PIPELINE\01_deduped\media\*.mp4" --model medium --language en --output_dir "C:\Users\kyler\Downloads\NLM_PIPELINE\03_transcripts"
```

## Transcript QA

- Confirm the transcript starts with meaningful speech, not silence metadata.
- Confirm timestamps exist.
- Spot-check 3 timestamp ranges per file.
- Mark unclear sections with `[inaudible]` or `[low confidence]` rather than guessing.

## Production guidance

Use `medium` as the default balance of quality and speed. Use `large-v3` for final canonical transcripts when accuracy is more important than speed.
