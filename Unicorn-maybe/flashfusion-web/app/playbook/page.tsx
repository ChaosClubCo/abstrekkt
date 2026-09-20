"use client";

import Link from "next/link";
import { useState } from "react";

export default function PlaybookPage() {
  const [copied, setCopied] = useState(false);

  const promptText = `Adversarial security review. For the code above, answer each question:

1. UNTRUSTED INPUT: Which function parameters could carry
   user-controlled data? Is each one validated before use?

2. SQL / QUERY CONSTRUCTION: Is any query assembled via
   string concatenation? If so, where and with what input?

3. CONCURRENCY: Are there race conditions possible under
   concurrent requests? Identify any shared mutable state.

4. DATA EXPOSURE: What data does this return or log?
   Is any of it sensitive? Is it scoped to the requesting
   user or tenant?

5. FAIL BEHAVIOR: Does this fail open or fail closed?
   What is the default behavior on error?

6. IMPLICIT PERMISSIONS: Does this code assume that
   authentication implies authorization? Where?

7. MISSING VALIDATION: What inputs, states, or edge cases
   are not covered by explicit validation?`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(promptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-ink text-paper selection:bg-ember selection:text-ink font-body text-[1.08rem] leading-[1.75]">
      <div className="max-w-[720px] mx-auto px-5 sm:px-6 py-10 sm:py-16 pb-24">
        {/* Masthead */}
        <header className="flex items-baseline justify-between pb-5 mb-12 border-b border-paper/10">
          <Link
            href="/"
            className="group flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase text-paper-dim hover:text-paper transition-colors"
          >
            <span className="text-ember-bright font-medium">ABSTREKKT</span>
            <span>·</span>
            <span>KYLE ROSEBROOK</span>
            <span className="text-ember-bright opacity-0 group-hover:opacity-100 transition-opacity ml-1">
              ← home
            </span>
          </Link>
          <span className="font-mono text-xs text-paper-faint tracking-wider uppercase px-2 py-0.5 rounded border border-paper/10 bg-surface">
            playbook
          </span>
        </header>

        {/* Kicker & Title */}
        <div className="font-mono text-xs tracking-[0.14em] uppercase text-ember-bright mb-3">
          Playbook · AI-Assisted Development
        </div>
        <h1 className="font-display text-[clamp(1.95rem,5.5vw,2.9rem)] font-bold leading-[1.14] text-paper mb-4 tracking-[-0.01em]">
          Vibe Coding Playbook: AppSec-First AI Development
        </h1>

        <div className="font-mono text-xs text-paper-faint tracking-wider flex gap-3 flex-wrap mb-10 pb-2">
          <span>Kyle Rosebrook</span>
          <span>·</span>
          <span>Self-taught AI practitioner</span>
          <span>·</span>
          <span>First written March 2026 · maintained</span>
        </div>

        {/* Lede */}
        <div className="text-[1.15rem] text-paper-dim border-l-2 border-ember pl-5 mb-12 space-y-4">
          <p>
            I did not come up through a traditional CS path. I came from hospitality and retail management, which means I learned systems thinking from a different angle: how failure modes in a service environment propagate, how trust between components breaks down under load, how the gap between &quot;works in the demo&quot; and &quot;works at 2am when no one is watching&quot; is almost entirely a function of how seriously you modeled failure before you shipped.
          </p>
          <p>
            That framing transfers directly to vibe coding. The tools are fast. The outputs are often good enough to look right. The failure modes are subtle — they surface at security boundaries, in multi-tenant data access patterns, and in edge cases that weren&apos;t covered by the prompt that generated the code.
          </p>
          <p>
            This playbook is what I apply to every AI-assisted system I build. It assumes you know how to code.{" "}
            <strong className="text-paper font-semibold">
              It&apos;s about knowing how to code with AI without introducing the classes of problems that get caught in prod instead of review.
            </strong>
          </p>
        </div>

        {/* Tip 01 */}
        <section className="mb-14">
          <span className="font-mono text-xs text-ember-bright tracking-[0.14em] uppercase block mb-1">
            Tip 01
          </span>
          <h2 className="font-display text-2xl font-semibold text-paper mb-4">
            Model Failure Modes Before You Prompt
          </h2>

          <blockquote className="font-display italic text-[1.12rem] text-paper-dim border-l-2 border-ember pl-5 my-6 py-1">
            &quot;Confident output and correct output are independent variables. At security boundaries they&apos;re often inversely correlated.&quot;
          </blockquote>

          <p className="mb-4 text-paper-dim">
            AI code generation fails in patterned ways. These aren&apos;t random bugs — they&apos;re structural gaps you can model before you start:
          </p>

          <div className="space-y-4 mb-6">
            <p className="text-paper-dim">
              <strong className="text-paper">Implicit permission assumptions.</strong> AI defaults to &quot;authenticated = authorized.&quot; It will generate code that checks for a valid session token and assumes that&apos;s sufficient. Row-level authorization, tenant isolation, and role-scoped access are not implicit. You have to require them explicitly.
            </p>
            <p className="text-paper-dim">
              <strong className="text-paper">Context window contamination.</strong> In long sessions, early assumptions bleed into later outputs. The auth model you described in turn three will silently inform the data access pattern generated in turn fourteen. Validate late-session outputs against your actual architecture, not the session history.
            </p>
            <p className="text-paper-dim">
              <strong className="text-paper">Confident wrongness at interfaces.</strong> AI is most dangerous at API boundaries, database queries, and auth handlers — exactly where errors have the highest blast radius. It will generate syntactically valid, logically confident, and subtly wrong code for edge cases it wasn&apos;t trained on.
            </p>
            <p className="text-paper-dim">
              <strong className="text-paper">Missing validation on untrusted input.</strong> Default behavior treats function arguments as clean. If the input originates from user-controlled sources, you&apos;re responsible for adding sanitization, type enforcement, and bounds checking. The AI won&apos;t add it unless you explicitly require it.
            </p>
          </div>

          <div className="bg-surface border border-paper/10 border-l-2 border-l-ember rounded p-5 my-6">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ember-bright block mb-2 font-medium">
              What this looked like in practice
            </span>
            <p className="text-sm text-paper-dim leading-relaxed mb-0">
              I ran a security audit on a Supabase project. The <code className="font-mono text-xs bg-surface-2 text-ember-bright px-1.5 py-0.5 rounded">invite_codes</code> and <code className="font-mono text-xs bg-surface-2 text-ember-bright px-1.5 py-0.5 rounded">api_keys</code> tables had no Row Level Security policies. They existed, they worked, they passed functional tests. But any authenticated user could query any row. The AI that generated the initial schema had no way to know the multi-tenant requirements — it built what multi-tenant schemas generally look like. <strong className="text-paper">General is not the same as correct for your system.</strong>
            </p>
          </div>
        </section>

        {/* Tip 02 */}
        <section className="mb-14">
          <span className="font-mono text-xs text-ember-bright tracking-[0.14em] uppercase block mb-1">
            Tip 02
          </span>
          <h2 className="font-display text-2xl font-semibold text-paper mb-4">
            Architecture-First Is Non-Negotiable
          </h2>

          <blockquote className="font-display italic text-[1.12rem] text-paper-dim border-l-2 border-ember pl-5 my-6 py-1">
            &quot;Features built without a modeled architecture are technical debt with a polished UI. AI accelerates the rate at which you can accumulate that debt.&quot;
          </blockquote>

          <p className="mb-4 text-paper-dim">
            Before you prompt for any feature, system, or component, the following must be modeled explicitly. Not implied. Not assumed. Written down where you can reference them in the session:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-paper-dim mb-6">
            <li><strong className="text-paper">System boundaries:</strong> What is inside this system and what is outside it? Where does trust change?</li>
            <li><strong className="text-paper">Data flows:</strong> Where does data enter, what transforms it, where does it persist, who can read it?</li>
            <li><strong className="text-paper">State transitions:</strong> What are the valid states of each entity? What triggers each transition? What&apos;s invalid?</li>
            <li><strong className="text-paper">Auth model:</strong> Authentication mechanism, session lifecycle, authorization model (RBAC/ABAC/tenant-scoped), token storage, revocation.</li>
            <li><strong className="text-paper">Failure modes:</strong> What happens when each dependency is unavailable?</li>
            <li><strong className="text-paper">Abuse vectors:</strong> Who are the adversarial actors? What do they gain by breaking each component? What&apos;s the blast radius?</li>
          </ul>

          <p className="text-paper-dim mb-4">
            <strong className="text-paper">The meta-prompt pattern I use:</strong> I enforce this via a structured prompt protocol with an explicit <code className="font-mono text-xs bg-surface-2 text-ember-bright px-1.5 py-0.5 rounded">SCOPE_MODE</code> parameter:
          </p>

          <ul className="list-disc pl-5 space-y-1.5 text-paper-dim mb-6 font-mono text-xs">
            <li><code>SCOPE_MODE: LITE</code> — spec + constraints only</li>
            <li><code>SCOPE_MODE: STANDARD</code> — spec + arch + implementation plan</li>
            <li><code>SCOPE_MODE: FULL</code> — complete implementation with tests, security notes, and observability hooks</li>
          </ul>

          <p className="text-paper-dim">
            The model doesn&apos;t move to code until the architecture is stated. This is the single highest-leverage habit for preventing AI-generated technical debt.
          </p>
        </section>

        {/* Tip 03 */}
        <section className="mb-14">
          <span className="font-mono text-xs text-ember-bright tracking-[0.14em] uppercase block mb-1">
            Tip 03
          </span>
          <h2 className="font-display text-2xl font-semibold text-paper mb-4">
            Security Prompting Is a Discipline, Not a Checkbox
          </h2>

          <blockquote className="font-display italic text-[1.12rem] text-paper-dim border-l-2 border-ember pl-5 my-6 py-1">
            &quot;The model will answer questions you ask. It will not ask the questions you didn&apos;t think of. Your job is to have a standing list of questions that covers the failure modes you&apos;ve seen.&quot;
          </blockquote>

          <p className="mb-4 text-paper-dim">
            After generating any security-relevant code — auth handlers, data access layers, API endpoints, input processing — run this prompt verbatim:
          </p>

          <div className="relative my-6 rounded border border-paper/20 bg-surface-2 overflow-hidden">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 font-mono text-xs tracking-wider uppercase px-3 py-1.5 rounded border border-paper/20 bg-ink hover:border-ember text-paper-dim hover:text-ember-bright transition-all"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <pre className="p-5 pr-20 overflow-x-auto font-mono text-xs text-paper-dim leading-relaxed">
              {promptText}
            </pre>
          </div>
        </section>

        {/* Trust Matrix */}
        <section className="mb-14">
          <h2 className="font-display text-2xl font-semibold text-paper mb-4">
            AI Trust Calibration Matrix
          </h2>
          <p className="text-paper-dim mb-4">
            Not all AI-generated output carries the same risk. Calibrate review depth to the actual blast radius.
          </p>

          <div className="overflow-x-auto my-6 border border-paper/10 rounded">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface font-mono text-[10px] tracking-wider uppercase text-paper-faint border-b border-paper/10">
                <tr>
                  <th className="p-3">Output type</th>
                  <th className="p-3">Trust level</th>
                  <th className="p-3">Required review action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper/5 font-body">
                <tr>
                  <td className="p-3 text-paper">Auth handlers / session logic</td>
                  <td className="p-3 font-mono text-xs text-ember-bright font-medium">Never trust</td>
                  <td className="p-3 text-paper-dim">Full adversarial review + CODEOWNERS sign-off</td>
                </tr>
                <tr>
                  <td className="p-3 text-paper">Data access / RLS-adjacent queries</td>
                  <td className="p-3 font-mono text-xs text-amber-300">Low trust</td>
                  <td className="p-3 text-paper-dim">RLS policy review + tenant scope verification</td>
                </tr>
                <tr>
                  <td className="p-3 text-paper">API endpoints / input handling</td>
                  <td className="p-3 font-mono text-xs text-amber-300">Low trust</td>
                  <td className="p-3 text-paper-dim">Input validation + 7-question adversarial pass</td>
                </tr>
                <tr>
                  <td className="p-3 text-paper">Business logic / algorithms</td>
                  <td className="p-3 font-mono text-xs text-paper-dim">Medium trust</td>
                  <td className="p-3 text-paper-dim">Unit test coverage + edge case review</td>
                </tr>
                <tr>
                  <td className="p-3 text-paper">UI components / boilerplate</td>
                  <td className="p-3 font-mono text-xs text-paper-faint">Higher trust</td>
                  <td className="p-3 text-paper-dim">Standard code review, no special protocol</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Closing */}
        <div className="pt-8 border-t border-paper/10 text-paper-dim space-y-4">
          <p>
            The tools are fast. The failure modes are not obvious. The security gaps I&apos;ve found in AI-generated production code were not caused by bad engineering — they were caused by engineers who trusted confident output without modeling the failure modes first.
          </p>
          <p>
            <strong className="text-paper">
              Architecture-first. Adversarial review on security surfaces. Structural gates that enforce quality independent of velocity pressure.
            </strong>{" "}
            These are not restrictions on how you use AI. They are the conditions under which AI actually accelerates safe production output.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-paper/10 flex justify-between flex-wrap gap-3 font-mono text-xs text-paper-faint">
          <Link href="/" className="hover:text-ember-bright transition-colors">
            Kyle Rosebrook · kyle.abstrekkt.com
          </Link>
          <span>© 2026 Abstrekkt LLC</span>
        </footer>
      </div>
    </div>
  );
}
