/**
 * FlashFusion AI-job state-machine executor (worker pickup loop).
 * --------------------------------------------------------------------------
 * Implements contracts/ai-job-contract.json against the schema in
 * migrations/0001-0006. Run as a long-lived Node worker (apps/workers), NOT in
 * an edge function — jobs are long-running and need the service role.
 *
 * SECURITY / SAFETY (untrusted-input model):
 *   - Uses the Supabase SERVICE ROLE key, which bypasses RLS. It is the ONLY
 *     writer of ai_jobs.state / cost columns and usage_events. Clients never do.
 *   - Secrets come from process.env ONLY. There are no credentials in this file.
 *     See ../.env.example. Never log the service-role key.
 *   - The model-call step (runModel) is a stub. It MUST NOT auto-execute any
 *     code contained in untrusted job input. Treat job.input as data.
 *
 * Concurrency: pickup uses an atomic conditional UPDATE (compare-and-set on the
 * lock columns) so two workers cannot win the same row. Stale leases (crashed
 * workers) are reclaimed after lock_timeout_seconds.
 *
 * This file is dependency-light on purpose: it expects a minimal client with a
 * `.rpc()`/SQL surface. Wire it to @supabase/supabase-js or pg in your app.
 * The DB calls are written as plain SQL so the logic is auditable.
 */

import contract from "../contracts/ai-job-contract.json" assert { type: "json" };

// --- Types -----------------------------------------------------------------

export type AiJobState =
  | "queued" | "validating" | "reserved" | "running"
  | "streaming" | "succeeded" | "failed" | "canceled" | "expired";

export interface AiJob {
  id: string;
  organization_id: string;
  created_by: string;
  kind: string;
  state: AiJobState;
  attempt: number;
  max_attempts: number;
  next_retry_at: string | null;
  input: Record<string, unknown>;
  estimated_cost_credits: number;
  reserved_cost_credits: number;
  final_cost_credits: number;
  idempotency_key: string;
}

/** Minimal DB port. Implement with supabase-js (service role) or node-postgres. */
export interface Db {
  /** Run parameterized SQL, returning rows. */
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
}

export interface ModelResult {
  ok: boolean;
  tokensIn: number;
  tokensOut: number;
  toolCalls: number;
  output: Record<string, unknown>;
  /** present when ok === false */
  errorCode?: string;
  errorMessage?: string;
}

// --- Contract helpers ------------------------------------------------------

const TRANSITIONS = contract.allowed_transitions as Record<AiJobState, AiJobState[]>;
const RETRYABLE = new Set(contract.retry_policy.retryable_error_codes);
const BACKOFF = contract.retry_policy.backoff_seconds as number[];
const LOCK_TIMEOUT_S = contract.locking_policy.lock_timeout_seconds as number;
const PRICE = contract.billing_policy.price_table as Record<string, number>;

export function canTransition(from: AiJobState, to: AiJobState): boolean {
  return (TRANSITIONS[from] ?? []).includes(to);
}

function backoffSeconds(attempt: number): number {
  return BACKOFF[Math.min(attempt, BACKOFF.length - 1)];
}

function reconcileCost(r: ModelResult): number {
  const inK = r.tokensIn / 1000;
  const outK = r.tokensOut / 1000;
  return Math.ceil(
    inK * (PRICE.ai_tokens_per_1k_in ?? 1) +
    outK * (PRICE.ai_tokens_per_1k_out ?? 3) +
    r.toolCalls * (PRICE.tool_call ?? 1),
  );
}

// --- Pickup (atomic lease) -------------------------------------------------

/**
 * Atomically claim one eligible job for this worker. Returns the job or null.
 * Eligible = (queued OR failed) AND retry window open AND (unlocked OR lease stale).
 * The conditional UPDATE guarantees only one worker wins.
 */
export async function pickup(db: Db, workerId: string): Promise<AiJob | null> {
  const rows = await db.query<AiJob>(
    `
    update public.ai_jobs j
       set locked_by = $1,
           locked_at = now()
     where j.id = (
       select id from public.ai_jobs
        where state in ('queued','failed')
          and (next_retry_at is null or next_retry_at <= now())
          and (locked_at is null or locked_at < now() - ($2 || ' seconds')::interval)
        order by next_retry_at nulls first, priority asc, created_at asc
        for update skip locked
        limit 1
     )
    returning j.*;
    `,
    [workerId, String(LOCK_TIMEOUT_S)],
  );
  return rows[0] ?? null;
}

// --- Transition + audit (DB guard double-checks us) ------------------------

async function transition(
  db: Db, job: AiJob, to: AiJobState, patch: Record<string, unknown> = {},
): Promise<void> {
  if (!canTransition(job.state, to)) {
    // Defensive: the DB trigger would also reject this.
    throw new Error(`illegal transition ${job.state} -> ${to} (job ${job.id})`);
  }
  const cols = Object.keys(patch);
  const setExtra = cols.map((c, i) => `${c} = $${i + 3}`).join(", ");
  const sql = `
    update public.ai_jobs
       set state = $2 ${setExtra ? "," + setExtra : ""}
     where id = $1`;
  await db.query(sql, [job.id, to, ...cols.map((c) => patch[c])]);
  job.state = to;
}

// --- Billing (idempotent usage_events) -------------------------------------

async function writeUsage(
  db: Db, job: AiJob, suffix: "reserve" | "finalize" | "refund",
  totalCost: number, quantity: number,
): Promise<void> {
  // ON CONFLICT DO NOTHING makes the write idempotent per the contract's
  // unique(organization_id, idempotency_key). A retried finalize is a no-op.
  await db.query(
    `
    insert into public.usage_events
      (organization_id, user_id, kind, quantity, unit_cost_credits,
       total_cost_credits, ref_type, ref_id, idempotency_key)
    values ($1,$2,'ai_tokens',$3,0,$4,'ai_job',$5,$6)
    on conflict (organization_id, idempotency_key) do nothing;
    `,
    [job.organization_id, job.created_by, quantity, totalCost, job.id, `${job.id}:${suffix}`],
  );
}

/** Check the org has >= cost credits available (sum granted - sum spent). */
async function hasCredits(db: Db, orgId: string, cost: number): Promise<boolean> {
  const rows = await db.query<{ remaining: number }>(
    `
    select coalesce(p.monthly_credits,0)
         - coalesce((select sum(total_cost_credits) from public.usage_events u
                      where u.organization_id = p.organization_id),0) as remaining
      from public.organization_plans p
     where p.organization_id = $1;
    `,
    [orgId],
  );
  return (rows[0]?.remaining ?? 0) >= cost;
}

// --- Model step (STUB — replace with your model router) ---------------------

/**
 * Execute the actual AI work. THIS IS A STUB.
 * Real impl: route by job.kind to your model router, stream tokens, run tools.
 * Do NOT eval/exec anything from job.input — it is untrusted user data.
 */
async function runModel(job: AiJob): Promise<ModelResult> {
  // Placeholder deterministic result so the worker is exercisable end-to-end
  // before a model is wired in. Replace before production.
  return {
    ok: true,
    tokensIn: 500,
    tokensOut: 800,
    toolCalls: 0,
    output: { note: "stub result; wire runModel() to your model router", kind: job.kind },
  };
}

// --- Process one job through the full lifecycle -----------------------------

export async function processJob(db: Db, job: AiJob, workerId: string): Promise<void> {
  try {
    // queued/failed -> validating
    await transition(db, job, "validating");

    // Validate input shape here (Zod in real impl). On bad input: non-retryable.
    if (typeof job.input !== "object" || job.input === null) {
      return await fail(db, job, "INPUT_INVALID", "job.input must be an object");
    }

    // validating -> reserved (reserve credits first)
    const estimate = job.estimated_cost_credits || 1;
    if (!(await hasCredits(db, job.organization_id, estimate))) {
      return await fail(db, job, "INSUFFICIENT_CREDITS", "not enough credits to reserve");
    }
    await writeUsage(db, job, "reserve", estimate, estimate);
    await transition(db, job, "reserved", { reserved_cost_credits: estimate });
    job.reserved_cost_credits = estimate; // keep local copy in sync for fail() refund

    // reserved -> running -> streaming
    await transition(db, job, "running", { started_at: new Date().toISOString() });
    await transition(db, job, "streaming");

    const result = await runModel(job);
    if (!result.ok) {
      return await fail(db, job, result.errorCode ?? "UPSTREAM_5XX", result.errorMessage ?? "model failed");
    }

    // Reconcile cost and finalize.
    // Billing model (matches contract reconcile.adjustment = final - reserved):
    //   reserve event  = estimated_cost_credits (the hold)
    //   finalize event = adjustment (final - reserved); may be 0, +, or -.
    // Running credit usage = SUM(total_cost_credits) = reserve + adjustment =
    //   final cost. This keeps hasCredits()'s simple SUM correct with no
    //   special-casing. Exactly one finalize event is always written on success
    //   (idempotent), satisfying contract.finalize_on = ['succeeded','failed'].
    const finalCost = reconcileCost(result);
    const adjustment = finalCost - estimate; // negative = refund the over-hold
    await writeUsage(db, job, "finalize", adjustment, result.tokensIn + result.tokensOut);

    await transition(db, job, "succeeded", {
      output: JSON.stringify(result.output),
      tokens_in: result.tokensIn,
      tokens_out: result.tokensOut,
      final_cost_credits: finalCost,
      completed_at: new Date().toISOString(),
      locked_by: null,
      locked_at: null,
    });
  } catch (err) {
    // Unexpected error: treat as retryable transient failure.
    await fail(db, job, "TRANSIENT_NETWORK", (err as Error).message);
  }
}

/** Move a job to failed, then either re-queue (retryable + attempts left) or stop. */
async function fail(db: Db, job: AiJob, code: string, message: string): Promise<void> {
  const errorPatch = { error: JSON.stringify({ code, message }), error_code: code };
  // running/reserved/etc -> failed is always legal in the contract.
  await transition(db, job, "failed", errorPatch as Record<string, unknown>);

  // On terminal failure, finalize (refund the reservation per billing_policy).
  if (job.reserved_cost_credits > 0) {
    await writeUsage(db, job, "refund", -job.reserved_cost_credits, 0);
  }

  const retryable = RETRYABLE.has(code) && job.attempt + 1 < job.max_attempts;
  if (retryable) {
    const waitS = backoffSeconds(job.attempt);
    // failed -> queued (only legal exit from failed) with incremented attempt.
    await db.query(
      `update public.ai_jobs
          set state='queued', attempt=attempt+1,
              next_retry_at = now() + ($2 || ' seconds')::interval,
              locked_by=null, locked_at=null
        where id=$1`,
      [job.id, String(waitS)],
    );
  } else {
    await db.query(
      `update public.ai_jobs set locked_by=null, locked_at=null where id=$1`,
      [job.id],
    );
  }
}

// --- Main loop -------------------------------------------------------------

export interface RunOptions {
  workerId: string;
  pollMs?: number;
  /** stop after N idle polls; undefined = run forever */
  maxIdlePolls?: number;
}

export async function runLoop(db: Db, opts: RunOptions): Promise<void> {
  const pollMs = opts.pollMs ?? 1000;
  let idle = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const job = await pickup(db, opts.workerId);
    if (!job) {
      idle++;
      if (opts.maxIdlePolls !== undefined && idle >= opts.maxIdlePolls) return;
      await new Promise((r) => setTimeout(r, pollMs));
      continue;
    }
    idle = 0;
    await processJob(db, job, opts.workerId);
  }
}
