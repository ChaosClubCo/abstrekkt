# Asyncio Parallel Fix — Council Throughput

**Load this file when:** Batch size > 5 files, applying the parallel improvement, reverting to sequential, or debugging race conditions in council execution.

---

## Problem Statement

The default `council_webhook()` function in `agent_council.py` runs all 10 crews **sequentially** per file. With a default Haiku model and 10 crews per file, a 5-file batch takes approximately **8–12 minutes**. A 20-file batch can take **35–50 minutes**.

The fix replaces the sequential `for` loop with `asyncio.gather()` backed by a `ThreadPoolExecutor`, running multiple files in parallel while respecting Anthropic RPM limits.

---

## Constraint: RPM Cap

10 crews × concurrent files = LLM call volume. Haiku (default model) RPM limit must be respected.

**Rule: Cap `ThreadPoolExecutor` at 5 workers maximum.**

With 5 workers and 10 crews per file = up to 50 simultaneous LLM calls. At Haiku's RPM limits this is safe. Do NOT increase beyond 5 without re-testing against your current Anthropic plan's rate limits.

---

## The Diff

Apply to `personal/drive-automation/agent_council.py` in the `council_webhook()` function.

```python
# ── BEFORE (sequential) ────────────────────────────────────────────────────
async def council_webhook(manifest: dict) -> list[dict]:
    results = []
    for item in manifest["items"]:
        memo = await evaluate_file(item)   # Runs one at a time
        results.append(memo)
    return results


# ── AFTER (parallel with ThreadPoolExecutor) ───────────────────────────────
import asyncio
from concurrent.futures import ThreadPoolExecutor

MAX_WORKERS = 5  # RPM guard — do NOT exceed without rate limit testing

async def council_webhook(manifest: dict) -> list[dict]:
    loop = asyncio.get_event_loop()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        tasks = [
            loop.run_in_executor(executor, run_evaluate_sync, item)
            for item in manifest["items"]
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    # Handle any exceptions from gather
    memos = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            # Log failed file, don't crash the entire batch
            failed_item = manifest["items"][i]
            memos.append({
                "file_id": failed_item["file_id"],
                "file_name": failed_item["name"],
                "overall_status": "ERROR",
                "error": str(result),
                "human_review_required": True
            })
        else:
            memos.append(result)

    return memos


def run_evaluate_sync(item: dict) -> dict:
    """
    Synchronous wrapper for evaluate_file() — required for ThreadPoolExecutor.
    evaluate_file() must remain synchronous (see Risk Notes below).
    """
    return evaluate_file(item)   # evaluate_file stays sync — do NOT make it async
```

---

## Application Steps

```bash
# 1. Back up the current file before applying
cp personal/drive-automation/agent_council.py \
   personal/drive-automation/agent_council.py.bak-$(date +%Y%m%d)

# 2. Apply the diff manually or via your editor:
#    - Find the existing council_webhook() function
#    - Replace the function body with the AFTER block above
#    - Add the import statements at the top of the file if not present:
#      import asyncio
#      from concurrent.futures import ThreadPoolExecutor

# 3. Verify smoke tests still pass after the change
python personal/drive-automation/smoke_test.py
# Expected: all PASS

# 4. Run a 3-file test batch before using on large batches
# (see SKILL.md §Golden Path: Chain 2)

# 5. Push to GitHub (file is 22KB — must use git push, not Zapier)
git add personal/drive-automation/agent_council.py
git commit -m "perf: apply asyncio parallel fix to council_webhook (cap=5 workers)"
git push
```

---

## Risk Notes

**1. `execute_actions()` must stay synchronous.**
If `execute_actions()` (the function that writes to Supabase or triggers downstream operations) is ever refactored to be async, the `ThreadPoolExecutor` approach introduces a race condition — multiple coroutines could write to the same Supabase row. **Keep `execute_actions()` synchronous.** If you need async Supabase writes in the future, switch from `ThreadPoolExecutor` to proper `asyncio.Semaphore` rate limiting.

**2. Exception isolation.**
The `return_exceptions=True` flag in `asyncio.gather()` prevents one failing file from crashing the entire batch. Failed files are logged as `ERROR` memos and flagged for human review. Always review ERROR rows in `council_memos` after a batch.

**3. Haiku RPM limits.**
If you switch from Haiku to a higher-cost model (Sonnet, Opus), recalculate safe worker count. 5 workers × 10 crews = 50 concurrent calls. Sonnet's RPM is significantly lower than Haiku's.

**4. `run_evaluate_sync` wrapper.**
`evaluate_file()` must be a regular (non-async) function. The wrapper exists because `ThreadPoolExecutor` requires synchronous callables. Do not remove it even if evaluate_file looks like it could be awaited directly.

---

## Rollback

```bash
# Revert to sequential version
cp personal/drive-automation/agent_council.py.bak-<YYYYMMDD> \
   personal/drive-automation/agent_council.py

# Verify smoke tests
python personal/drive-automation/smoke_test.py

# Push revert
git add personal/drive-automation/agent_council.py
git commit -m "revert: restore sequential council_webhook (asyncio parallel reverted)"
git push
```

---

## Expected Throughput Improvement

| Batch Size | Sequential (est.) | Parallel 5-workers (est.) | Speedup |
|---|---|---|---|
| 3 files | ~5 min | ~2 min | ~2.5× |
| 5 files | ~10 min | ~2.5 min | ~4× |
| 10 files | ~20 min | ~5 min | ~4× |
| 20 files | ~40 min | ~10 min | ~4× |

Times are estimates based on Haiku latency at ~6 sec/crew call. Actual times vary with API load.
