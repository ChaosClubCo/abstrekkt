---
description: FlashFusion stack gotchas — B44 and n8n specific behaviors
---

# Stack gotchas

## Base44
- Bearer credential for n8n: must be set manually in credential store. Never auto-provisioned.
- SCH-02 lane field: required for all workflow routing. Missing it = silent failure.
- GitHub integration breaks after org migration. Fix = account-level OAuth disconnect/reconnect.

## n8n
- Most workflow failures are auth, not logic. Check credentials before debugging code.
- IMPORTANT: do not deploy workflow changes during active agent sessions.
