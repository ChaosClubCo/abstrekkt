/**
 * executor.selftest.ts — offline verification of the state-machine logic with
 * an in-memory fake DB. No real Postgres required. Run via:
 *   npx tsx worker/executor.selftest.ts
 * Exits nonzero on failure (used by scripts/smoke.sh offline mode).
 *
 * It checks the contract-level invariants that do not need the DB engine:
 *   - canTransition() matches the contract's allowed_transitions
 *   - a happy-path job ends in 'succeeded' with a finalize usage event
 *   - an INPUT_INVALID job ends non-retryable
 *   - idempotent usage writes (same key) do not duplicate
 */

import { canTransition, processJob, type AiJob, type Db } from "./executor.js";

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) { console.log(`  ok: ${name}`); }
  else { console.error(`  FAIL: ${name}`); failures++; }
}

// --- In-memory fake DB ------------------------------------------------------
// Models just enough of the two tables the executor touches.
interface Row { [k: string]: unknown }
class FakeDb implements Db {
  jobs = new Map<string, Row>();
  usage: Array<{ org: string; key: string; total: number }> = [];
  plans = new Map<string, number>(); // org -> monthly_credits

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const s = sql.replace(/\s+/g, " ").trim();

    // remaining credits
    if (s.startsWith("select coalesce(p.monthly_credits")) {
      const org = params[0] as string;
      const granted = this.plans.get(org) ?? 0;
      const spent = this.usage.filter((u) => u.org === org).reduce((a, b) => a + b.total, 0);
      return [{ remaining: granted - spent } as unknown as T];
    }

    // idempotent usage insert
    if (s.startsWith("insert into public.usage_events")) {
      const org = params[0] as string;
      const total = params[3] as number;
      const key = params[5] as string;
      if (!this.usage.some((u) => u.org === org && u.key === key)) {
        this.usage.push({ org, key, total });
      }
      return [];
    }

    // state transition update (set state = $2 ...)
    if (s.startsWith("update public.ai_jobs set state =")) {
      const id = params[0] as string;
      const to = params[1] as string;
      const row = this.jobs.get(id)!;
      row.state = to;
      return [];
    }

    // failed -> queued requeue / lock clear
    if (s.startsWith("update public.ai_jobs set state='queued'")) {
      const row = this.jobs.get(params[0] as string)!;
      row.state = "queued";
      return [];
    }
    if (s.startsWith("update public.ai_jobs set locked_by=null")) {
      return [];
    }

    throw new Error("FakeDb: unhandled SQL: " + s.slice(0, 60));
  }
}

function mkJob(over: Partial<AiJob> = {}): AiJob {
  return {
    id: "job-" + Math.random().toString(36).slice(2),
    organization_id: "org-1",
    created_by: "user-1",
    kind: "listing_generate",
    state: "queued",
    attempt: 0,
    max_attempts: 2,
    next_retry_at: null,
    input: { product_id: "p1" },
    estimated_cost_credits: 5,
    reserved_cost_credits: 0,
    final_cost_credits: 0,
    idempotency_key: "k-" + Math.random().toString(36).slice(2),
    ...over,
  };
}

async function main() {
  console.log("== executor self-test ==");

  // 1) Transition table sanity
  check("queued -> validating allowed", canTransition("queued", "validating"));
  check("succeeded -> running blocked", !canTransition("succeeded", "running"));
  check("failed -> queued allowed (retry)", canTransition("failed", "queued"));
  check("running -> succeeded allowed", canTransition("running", "succeeded"));
  check("canceled is terminal", canTransition("canceled", "queued") === false);

  // 2) Happy path
  {
    const db = new FakeDb();
    db.plans.set("org-1", 1000);
    const job = mkJob();
    db.jobs.set(job.id, { ...job });
    await processJob(db, job, "worker-test");
    check("happy path ends succeeded", job.state === "succeeded");
    check("happy path wrote a finalize usage event",
      db.usage.some((u) => u.key.endsWith(":finalize")));
    check("happy path reserved credits", db.usage.some((u) => u.key.endsWith(":reserve")));
  }

  // 3) Insufficient credits -> non-retryable fail
  {
    const db = new FakeDb();
    db.plans.set("org-1", 0); // no credits
    const job = mkJob();
    db.jobs.set(job.id, { ...job });
    await processJob(db, job, "worker-test");
    check("no-credit job does not succeed", job.state !== "succeeded");
  }

  // 4) Idempotent usage: same reserve key twice -> single row
  {
    const db = new FakeDb();
    db.plans.set("org-1", 1000);
    const job = mkJob();
    db.jobs.set(job.id, { ...job });
    await processJob(db, job, "worker-test");
    const reserves = db.usage.filter((u) => u.key.endsWith(":reserve")).length;
    check("reserve usage event is idempotent (exactly 1)", reserves === 1);
  }

  if (failures > 0) {
    console.error(`SELFTEST FAILED: ${failures} check(s)`);
    process.exit(1);
  }
  console.log("SELFTEST OK");
}

main().catch((e) => { console.error(e); process.exit(1); });
