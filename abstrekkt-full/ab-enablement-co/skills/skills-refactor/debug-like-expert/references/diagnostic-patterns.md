# Diagnostic Pattern Library & Language-Specific Debugging

Detailed diagnostic content split out of SKILL.md under the 500-line rule.
Load this when you need domain detection, per-domain expertise, or
per-error-type checklists.

---

## Context Scan

Run on every invocation to detect domain-specific debugging expertise.
Present findings before starting investigation.

```bash
# What files are we debugging?
echo "FILE_TYPES:"
find . -maxdepth 2 -type f 2>/dev/null | grep -E '\.(py|js|jsx|ts|tsx|rs|swift|c|cpp|go|java)$' | head -10

# Check for domain indicators
[ -f "package.json" ] && echo "DETECTED: JavaScript/Node project"
[ -f "Cargo.toml" ] && echo "DETECTED: Rust project"
[ -f "setup.py" ] || [ -f "pyproject.toml" ] && echo "DETECTED: Python project"
[ -f "*.xcodeproj" ] || [ -f "Package.swift" ] && echo "DETECTED: Swift/macOS project"
[ -f "go.mod" ] && echo "DETECTED: Go project"

# Scan for available domain expertise
echo "EXPERTISE_SKILLS:"
ls ~/.claude/skills/expertise/ 2>/dev/null | head -5
```

---

## Domain Expertise

Domain-specific expertise lives in `~/.claude/skills/expertise/`. Domain
skills contain comprehensive knowledge — debugging, testing, performance,
and common pitfalls. Before investigation, decide whether to load it.

```bash
ls ~/.claude/skills/expertise/ 2>/dev/null
```

This reveals available domain expertise (e.g., macos-apps, iphone-apps,
python-games, unity-games).

**If no expertise skills found:** Proceed without domain expertise
(graceful degradation). The skill works fine with general methodology.

### Inference rules

If the user's description or codebase contains domain keywords, INFER the
domain:

| Keywords / Files | Domain Skill |
|------------------|--------------|
| "Python", "game", "pygame", `.py` + game loop | expertise/python-games |
| "React", "Next.js", `.jsx/.tsx` | expertise/nextjs-ecommerce |
| "Rust", "cargo", `.rs` files | expertise/rust-systems |
| "Swift", "macOS", `.swift` + AppKit/SwiftUI | expertise/macos-apps |
| "iOS", "iPhone", `.swift` + UIKit | expertise/iphone-apps |
| "Unity", `.cs` + Unity imports | expertise/unity-games |
| "SuperCollider", `.sc`, `.scd` | expertise/supercollider |
| "Agent SDK", "claude-agent" | expertise/with-agent-sdk |

If a domain is inferred, confirm:

```
Detected: [domain] issue → expertise/[skill-name]
Load this debugging expertise? (Y / see other options / none)
```

### No obvious domain

If no domain is obvious, present options:

```
What type of project are you debugging?

Available domain expertise:
1. macos-apps   - macOS Swift (SwiftUI, AppKit, debugging, testing)
2. iphone-apps  - iOS Swift (UIKit, debugging, performance)
3. python-games - Python games (Pygame, physics, performance)
4. unity-games  - Unity (C#, debugging, optimization)
[... any others found in expertise/]

N. None - proceed with general debugging methodology
C. Create domain expertise for this domain

Select:
```

### Loading a domain

When a domain is selected, READ all references from that skill BEFORE
investigation:

```bash
cat ~/.claude/skills/expertise/[domain]/references/*.md 2>/dev/null
```

This loads comprehensive domain knowledge:
- Common issues and error patterns
- Domain-specific debugging tools and techniques
- Testing and verification approaches
- Performance profiling and optimization
- Known pitfalls and anti-patterns
- Platform-specific considerations

Announce: "Loaded [domain] expertise. Investigating with domain-specific
context."

**If domain skill not found:** Inform the user and offer to proceed with
general methodology or create the expertise.

### When to load (and when not to)

Load domain expertise BEFORE investigation when the domain is known.

Domain expertise is NOT needed for:
- Pure logic bugs (domain-agnostic)
- Generic algorithm issues
- When the user explicitly says "skip domain context"

---

## Per-Error-Type Checklists

Quick triage by the symptom you observe. Each routes to the
hypothesis-first procedure in SKILL.md.

### Crash / exception / stack trace
- [ ] Capture the FULL trace, not the top line — the root frame is often mid-stack
- [ ] Identify the exact file:line and the variable/state at that point
- [ ] Reproduce deterministically before changing anything
- [ ] Check whether the throwing code is yours or a dependency's contract being violated

### Wrong output (no error)
- [ ] Pin down expected vs actual with a concrete input
- [ ] Bisect the pipeline: log intermediate values at each stage to find where it diverges
- [ ] Suspect off-by-one, type coercion, mutation of shared state, stale cache

### Intermittent / flaky
- [ ] Look for timing, ordering, concurrency, and external state (network, clock, filesystem)
- [ ] Add observability first; do NOT "fix" what you can't reproduce
- [ ] Run repeatedly under varied conditions to characterize the failure rate

### Performance / hang
- [ ] Profile before guessing — measure, don't assume the hot path
- [ ] Check for N+1 calls, unbounded loops, blocking I/O on the main thread, missing indexes
- [ ] Confirm the regression boundary (what changed since it was fast?)

### "Works on my machine"
- [ ] Diff environments: versions, env vars, OS, dependency lockfiles, config
- [ ] Reproduce in the failing environment, not the working one
- [ ] Suspect implicit global state, absolute paths, locale/timezone, uncommitted files

### Integration / external system
- [ ] Verify the contract: actual request/response payloads vs documented schema
- [ ] Check auth, rate limits, version/breaking changes on the other side
- [ ] Isolate: can you reproduce with a minimal direct call outside your code?
