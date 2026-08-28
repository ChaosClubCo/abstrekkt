# Install into the FlashFusion repository

From the extracted package directory, copy:

```bash
cp -R .codex AGENTS.md prompts schemas config scripts docs /path/to/flashfusion/
```

Then open `/path/to/flashfusion` in Codex and paste the contents of `tooling/codex/START_HERE.md`.

Project agents will be loaded from:

```text
.codex/agents/
```

The project concurrency settings are in:

```text
.codex/config.toml
```
