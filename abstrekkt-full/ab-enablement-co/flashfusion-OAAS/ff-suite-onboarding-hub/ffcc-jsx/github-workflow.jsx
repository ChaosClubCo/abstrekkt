import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ══════════════════════════════════════════════════════════════════════
   GITHUB PROJECT CONTRIBUTION WORKFLOW
   Interactive Process Flowchart — Beginners → Senior Staff Engineers
   Single .jsx | Anthropic API embedded | window.storage persistence
   ══════════════════════════════════════════════════════════════════════ */

const SK   = "github-workflow-v1";
const MOD  = "claude-sonnet-4-20250514";
const PRI  = "#1e293b";
const ACC  = "#f59e0b";
const SC   = { todo:"#94a3b8", active:"#7c3aed", done:"#15803d", blocked:"#dc2626", skipped:"#cbd5e1" };
const NW   = { terminal:192, process:192, decision:176, escalation:192 };
const NH   = { terminal:44,  process:52,  decision:58,  escalation:52  };

// ── AI SYSTEM PROMPT ─────────────────────────────────────────────────
const AI_SYS = `You are an assistant embedded in a GitHub project contribution workflow tool used by everyone from complete non-coders to senior staff engineers.

ENVIRONMENT:
- Platform: GitHub.com
- Workflow: Issue → Fork/Branch → Implement → Test → PR → CI → Review → Merge → Release
- CI: GitHub Actions (config at .github/workflows/)
- Branch protection: main/master require PR + CI pass + review approval(s)
- Templates: .github/ISSUE_TEMPLATE/, .github/pull_request_template.md
- Auto-review-assign: .github/CODEOWNERS
- Primary reference: CONTRIBUTING.md at repo root

COMMON FAILURES in likelihood order:
1. CI lint failure → run the lint command locally first (npm run lint, flake8, gofmt, etc.)
2. CI test failure → run tests locally before pushing (npm test, pytest, go test ./...)
3. PR template incomplete → every section must be filled out
4. Merge conflict → git pull --rebase origin main → resolve → push
5. Missing reviewer → check CODEOWNERS; also assign manually
6. Secret committed accidentally → remove immediately, rotate the credential
7. Branch protection unsatisfied → Repo Settings → Branches → check required rules
8. Tests missing → most repos require tests for new behavior

ESCALATION ROUTING:
- Architecture or design dispute → Senior engineer / Tech Lead
- Security vulnerability → SECURITY.md contact — PRIVATE, NEVER open public issue
- CI infrastructure broken → DevOps / Platform team
- Repo permissions → GitHub org admin
- PR stuck without review 2+ business days → Team lead / maintainer

CREDENTIALS:
- Personal Access Tokens: GitHub Settings → Developer settings → Personal access tokens
- CI Secrets: Repo → Settings → Secrets and variables → Actions
- SSH Keys: GitHub Settings → SSH and GPG keys

WORKAROUNDS:
- PR template not loading: copy manually from .github/pull_request_template.md
- GitHub Actions stuck/queued: githubstatus.com; re-run from Actions tab
- Fork out of sync: "Sync fork" on GitHub; or git fetch upstream && git merge upstream/main

EDIT MODE: When Flowchart Edit Mode is active, output changes as:
[FLOWCHART_CHANGE]{"action":"add_node"|"remove_node"|"update_node_label"|"update_exp"|"add_edge"|"remove_edge",...}[/FLOWCHART_CHANGE]
Fields per action — add_node: id,type,label,x,y,expMinutes,bypassable,detail,removeEdge(optional). remove_node: id. update_node_label: id,label. update_exp: id,expMinutes. add_edge: id,from,to,label. remove_edge: id.
After the block, explain the change in plain English.

TONE: Mid-task operator. Most likely fix first. Plain English for beginners; precise and terse for engineers. Exhaust self-service before escalation.`;

// ── CLIPBOARD UTILITY ────────────────────────────────────────────────
// Sandbox-safe: Clipboard API → execCommand fallback → returns false if both fail
const tryClipboard = async (text) => {
  // Method 1: Clipboard API (needs clipboard-write permission — blocked in sandbox)
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {}
  // Method 2: execCommand — deprecated but works in sandboxed iframes
  try {
    const el = Object.assign(document.createElement('textarea'), {
      value: text,
      style: 'position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none'
    });
    document.body.appendChild(el);
    el.focus(); el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    if (ok) return true;
  } catch {}
  return false;
};

// ── PRINT UTILITY ────────────────────────────────────────────────────
// window.print() is blocked in sandboxed iframes — download HTML instead
const downloadHTML = (html, filename) => {
  const blob = new Blob([html], {type:'text/html'});
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), {href:url, download:filename});
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};
const NODES_DEF = [
{id:"start",type:"terminal",label:"Start: New Contribution",x:395,y:52,expMinutes:2,bypassable:false,
 detail:{
  w:["Open the GitHub repository in your browser","Confirm you are logged in — check your avatar top-right","Read the project README.md — it's on the main repo page","Find and read CONTRIBUTING.md — usually linked from README"],
  u:["Decide your contribution type: Bug Fix | Feature | Documentation | Question","Note the project language, tech stack, and prerequisites listed"],
  c:["You have a clear, specific goal for this contribution"],
  i:["Repository: github.com/[ORG]/[REPO]","CONTRIBUTING.md: at repo root","Project board: Repo → Projects tab","Code of Conduct: CODE_OF_CONDUCT.md"]}},

{id:"identify",type:"process",label:"Identify Work Type",x:395,y:142,expMinutes:5,bypassable:false,
 detail:{
  w:["Bug Fix: something is broken and needs a fix","Feature: new capability that doesn't yet exist","Documentation: improving README, guides, or code comments","Question: use GitHub Discussions or open a 'question' issue"],
  u:["Beginners: filter Issues by the 'good first issue' label","Experienced: look for 'help wanted' or unassigned issues","Non-coders: look for 'docs', 'design', or 'content' labels — code not required"],
  c:["Contribution type clearly identified before proceeding"],
  i:["Good first issues: Issues → Labels → 'good first issue'","Discussions: Repo → Discussions tab"]}},

{id:"search",type:"process",label:"Search Issues & PRs",x:395,y:242,expMinutes:10,bypassable:false,
 detail:{
  w:["Go to the Issues tab on GitHub","Search keywords related to your bug or feature","Also check the Pull Requests tab — work may already be in progress","Check CLOSED issues — problem may have been fixed or rejected before"],
  u:["GitHub search syntax: is:open, is:closed, label:bug, label:enhancement","Try multiple keyword variations — authors use different words","Add 'in:comments' to search issue comment threads too"],
  c:["You have confirmed whether your issue or feature is already tracked"],
  i:["Issues: github.com/[ORG]/[REPO]/issues?q=keywords","PRs: github.com/[ORG]/[REPO]/pulls"]}},

{id:"exists",type:"decision",label:"Already Tracked?",x:395,y:352,expMinutes:3,bypassable:false,
 detail:{
  w:["Is there an open (or recently closed) issue or PR for your exact work?"],
  u:["Similar but not identical: still comment on the related issue","Same issue with an abandoned PR: ask if you can take it over"],
  c:["Decision made: join existing OR create new"],
  i:[]}},

{id:"join",type:"process",label:"Join / Claim Existing Issue",x:148,y:462,expMinutes:10,bypassable:false,
 detail:{
  w:["Read the full issue thread top-to-bottom","Check if someone is assigned (right sidebar → Assignees)","Leave a comment explaining what you plan to do","Ask to be assigned if the project workflow requires it"],
  u:["Don't start coding until maintainer acknowledges on complex issues","For simple bugs, stating intent in a comment is enough","Respect existing assignees — ask before duplicating effort"],
  c:["Issue claimed, context understood, work aligned with maintainer expectations"],
  i:["Assignment: right sidebar → Assignees → gear icon"]}},

{id:"create_issue",type:"process",label:"Create New Issue",x:642,y:462,expMinutes:15,bypassable:false,
 detail:{
  w:["Click 'New Issue' on the Issues tab","Select the correct template (Bug Report, Feature Request, etc.)","Fill in EVERY field — incomplete issues get closed without action","Add relevant labels: bug, enhancement, docs, question","Link related issues: 'Related to #123' in the description body"],
  u:["Bug reports must include: steps to reproduce, expected vs actual behavior, environment","Feature requests must include: problem statement, proposed solution, alternatives considered","Screenshots and error logs are extremely helpful"],
  c:["Issue created with complete info, correct labels, and maintainer acknowledgment"],
  i:["Templates: .github/ISSUE_TEMPLATE/","Label guide: check repo wiki or CONTRIBUTING.md → Labels section"]}},

{id:"scope",type:"decision",label:"Scope Manageable?",x:395,y:582,expMinutes:5,bypassable:false,
 detail:{
  w:["Can this work fit in one PR that a reviewer can reasonably review?","Rule of thumb: under 400 lines changed, focused on a single concern"],
  u:["Large PRs = slow review cycles and high rejection risk","When in doubt, smaller is almost always better","Ask the maintainer if you're unsure about scope"],
  c:["Work is scoped to a single, independently-reviewable pull request"],
  i:[]}},

{id:"breakdown",type:"process",label:"Break Into Smaller Issues",x:652,y:658,expMinutes:20,bypassable:true,
 detail:{
  w:["Identify natural separation points in the work","Create a tracking issue that lists sub-tasks using: - [ ] #123 Fix login","Create individual issues for each sub-task","Link each sub-issue back to the tracking issue"],
  u:["Order sub-issues by dependency — some must ship before others","Each sub-issue should be independently mergeable","Stacked PRs are advanced: each branch builds on the previous"],
  c:["Work broken into independently-reviewable pieces, each with its own issue"],
  i:["GitHub task list syntax: - [ ] Short description (#123)"]}},

{id:"env_check",type:"decision",label:"Dev Environment Ready?",x:395,y:708,expMinutes:2,bypassable:false,
 detail:{
  w:["Is Git installed? Run: git --version","Is the required language/runtime installed? Check README Prerequisites section","Do you have a code editor? VS Code is recommended for all levels"],
  u:["Even non-coders need Git for documentation contributions","README should list all prerequisites — if it doesn't, ask in an issue"],
  c:["All prerequisites from README are satisfied and verified"],
  i:["Git: git-scm.com/downloads","VS Code: code.visualstudio.com","GitHub Desktop (easier for beginners): desktop.github.com"]}},

{id:"setup",type:"process",label:"Set Up Local Environment",x:652,y:800,expMinutes:45,bypassable:false,
 detail:{
  w:["Install Git from git-scm.com","Configure name: git config --global user.name 'Your Name'","Configure email: git config --global user.email 'you@email.com'","Install the required runtime per README (Node, Python, Go, etc.)","Clone the repo: git clone [REPO_HTTPS_OR_SSH_URL]","Run setup commands from README: npm install / pip install -r requirements.txt / etc.","Verify: follow the README 'Running locally' section"],
  u:["SSH keys avoid password prompts: GitHub Settings → SSH and GPG keys","nvm manages multiple Node versions: nvm.sh","pyenv manages multiple Python versions: github.com/pyenv/pyenv","GitHub CLI (gh) simplifies many operations: cli.github.com"],
  c:["git status runs without error | project builds locally | all README setup steps complete"],
  i:["SSH setup: docs.github.com/en/authentication/connecting-to-github-with-ssh","Clone URL: green Code button → SSH or HTTPS tab"]}},

{id:"branch",type:"process",label:"Fork Repo & Create Branch",x:395,y:910,expMinutes:10,bypassable:false,
 detail:{
  w:["External contributors: click 'Fork' on GitHub (creates your own copy)","Internal contributors: clone directly, no fork needed","Always pull latest main first: git pull origin main","Create your branch: git checkout -b fix/describe-your-fix"],
  u:["Branch naming conventions: feat/, fix/, docs/, chore/ prefix + kebab-case","Good examples: fix/login-timeout, feat/dark-mode, docs/api-authentication","Never work directly on main — branch protection will block your PR"],
  c:["Branch created from latest main | branch name follows project convention"],
  i:["Fork button: top-right of the repo page","GitHub docs — forks: docs.github.com/en/get-started/quickstart/fork-a-repo"]}},

{id:"implement",type:"process",label:"Implement Changes",x:395,y:1022,expMinutes:120,bypassable:false,
 detail:{
  w:["Make ONLY changes related to your specific issue — no scope creep","Commit frequently with clear messages: git commit -m 'fix: handle empty login input'","Follow the project's code style — check .eslintrc, .prettierrc, pyproject.toml","Run linting as you go to catch issues early"],
  u:["Conventional commit format: type(scope): description","Types: feat | fix | docs | style | refactor | test | chore | perf","Keep commits atomic — one logical change per commit","Never commit: node_modules/, .env, *.pyc, build/, secrets, IDE config files"],
  c:["Changes implement the stated goal | no unrelated changes | code style respected"],
  i:["Conventional Commits spec: conventionalcommits.org","Run project locally to verify your changes work end-to-end"]}},

{id:"tests",type:"process",label:"Write / Update Tests",x:395,y:1134,expMinutes:60,bypassable:true,
 detail:{
  w:["Find existing test files: __tests__/, spec/, *.test.js, *_test.py, *_test.go","Add tests for your new code or for the bug you fixed","Bug fix golden rule: write a test that FAILS before your fix, PASSES after","Run the full test suite: npm test / pytest / go test ./..."],
  u:["Minimum: cover the happy path and the main error/edge case","Check for coverage requirements in CONTRIBUTING.md","Never delete or disable existing passing tests — fix them if needed"],
  c:["All existing tests pass | new behavior is covered by tests | suite passes locally"],
  i:["Check package.json scripts or CI config for exact test command","Coverage report: npm run test:coverage (if configured)"]}},

{id:"self_review",type:"process",label:"Self-Review Checklist",x:395,y:1246,expMinutes:15,bypassable:false,
 detail:{
  w:["Run: git diff main...HEAD — review every single line you are changing","Remove any debug console.log, print(), or debugger statements","No hardcoded secrets, tokens, passwords, or API keys anywhere","All TODO comments addressed or explicitly left with context","Function and variable names are clear and descriptive","README and docs updated if you changed behavior or added features"],
  u:["Read your diff as if you are a stranger with no context — does it make sense?","Check edge cases: empty inputs, null/undefined values, very large inputs","Verify error handling exists for every failure path"],
  c:["No secrets in diff | no debug artifacts | docs updated if needed | diff reviewed line-by-line"],
  i:[]}},

{id:"push",type:"process",label:"Push Changes to Remote",x:395,y:1348,expMinutes:5,bypassable:false,
 detail:{
  w:["Push: git push origin your-branch-name","First push ever: git push -u origin your-branch-name","For forks: push to YOUR fork, not the upstream repo"],
  u:["Push rejected (non-fast-forward)? Rebase first: git pull --rebase origin main","Resolve any merge conflicts, then push again","Never force-push to a branch others are reviewing — ask first"],
  c:["Branch is visible on GitHub | push completed without errors"],
  i:[]}},

{id:"open_pr",type:"process",label:"Open Pull Request",x:395,y:1450,expMinutes:20,bypassable:false,
 detail:{
  w:["GitHub shows 'Compare & pull request' banner after push — click it","Or: Pull Requests tab → New Pull Request → select your branch","Title: clear and concise, follows the project's commit convention","Body: fill in the PR TEMPLATE completely — every section","Link the issue: 'Closes #123' or 'Fixes #123' auto-closes on merge","Screenshots or screen recordings for any UI changes"],
  u:["PR template sections typically: What changed | Why | How to test | Screenshots | Checklist","Target branch: usually main or develop — verify in CONTRIBUTING.md","Draft PRs: click dropdown arrow → 'Create draft pull request' to signal WIP"],
  c:["PR created | template filled | issue linked | target branch correct | not accidental draft"],
  i:["PR template: .github/pull_request_template.md","Draft PR: dropdown on the green Create button"]}},

{id:"ci",type:"decision",label:"CI Passing?",x:395,y:1565,expMinutes:15,bypassable:false,
 detail:{
  w:["Check the CI status section below your PR description","Click 'Details' on any check to see full log output","Common checks: lint, unit tests, build, security scan, dependency audit"],
  u:["CI runs automatically on every push to the PR branch","First error in the log is usually the root cause — read top to bottom","Re-run specific failed jobs: Actions tab → failed run → Re-run failed jobs"],
  c:["Every CI check shows a green checkmark"],
  i:["CI config: .github/workflows/*.yml","Actions tab: Repo → Actions","GitHub status: githubstatus.com"]}},

{id:"fix_ci",type:"process",label:"Fix CI Failures",x:660,y:1640,expMinutes:30,bypassable:false,
 detail:{
  w:["Click 'Details' on the failing check and read the full error log","Lint failure: run the lint command locally with --fix flag","Test failure: reproduce locally with npm test / pytest / go test ./...","Build failure: run the build command locally to see the exact error","Secret detected: REMOVE from code immediately, then rotate the credential externally","Commit and push the fix to the same branch (CI re-runs automatically)"],
  u:["Always reproduce the failure locally before guessing at a fix","Lint auto-fix: eslint --fix, autopep8 --in-place, gofmt -w","Test failure message: read 'expected X, received Y' — that's your answer","Build failure: check for missing imports, wrong module paths, version incompatibilities","If you committed a secret: git rebase -i to remove it, force-push, then rotate"],
  c:["All CI checks pass locally | all checks green on GitHub after pushing fix"],
  i:["NEVER comment out, skip, or delete failing tests","Secret scanning: GitHub automatically alerts when secrets are detected"]}},

{id:"req_review",type:"process",label:"Request Reviewers",x:395,y:1725,expMinutes:5,bypassable:false,
 detail:{
  w:["If still Draft: click 'Ready for Review' button first","PR sidebar: Reviewers section → gear icon → select reviewers","CODEOWNERS file auto-assigns required reviewers for specific file paths","Add labels to the PR: e.g. 'ready-for-review', 'priority', 'breaking-change'"],
  u:["Allow 1–2 business days before following up — don't spam","For urgent PRs: post a link in Slack/Discord/Teams with context","CODEOWNERS reviewers are REQUIRED — their approval is mandatory"],
  c:["Reviewers assigned | PR is 'Ready for Review' (not in Draft state)"],
  i:["CODEOWNERS: .github/CODEOWNERS","Review expectations: CONTRIBUTING.md → Code Review section"]}},

{id:"review",type:"decision",label:"Review Outcome?",x:395,y:1840,expMinutes:120,bypassable:false,
 detail:{
  w:["Approved: all required reviewers approved → continue to next step","Changes Requested: fix the requested changes, re-push, re-request review","Commented: respond to each comment; no re-review needed unless blocked"],
  u:["Respond to EVERY comment, even if just 'Done' or 'Acknowledged'","For disagreements: discuss respectfully in the thread, don't just comply blindly","Use 'Resolve conversation' button only AFTER you have addressed the comment","Re-request review after pushing your fixes — reviewers don't auto-re-review"],
  c:["All required approvals received | no unresolved blocking comments"],
  i:[]}},

{id:"feedback",type:"process",label:"Address Review Feedback",x:660,y:1935,expMinutes:60,bypassable:false,
 detail:{
  w:["Read ALL comments before making any changes — understand the full picture first","Address blocking comments before optional suggestions","Make changes locally, commit clearly, push to the same branch","Reply to each comment: explain what you changed or why you respectfully disagree","Re-request review from each reviewer after pushing fixes"],
  u:["Don't force-push if reviewers have left comments — use new commits","Group related fixes into logical, atomic commits","If a comment is unclear: ask for clarification in the thread, don't guess"],
  c:["All comments addressed and replied to | fixes pushed | review re-requested"],
  i:[]}},

{id:"breaking",type:"decision",label:"Breaking / Security Change?",x:395,y:2048,expMinutes:5,bypassable:false,
 detail:{
  w:["Breaking change: existing behavior changes in a way that breaks users or integrations","Security vulnerability: discovered a security issue while working","Deprecation: removing or renaming a public-facing API, flag, or interface"],
  u:["Breaking = must bump MAJOR version, update CHANGELOG, write a migration guide","Security = NEVER discuss publicly — use private disclosure only"],
  c:["Change type correctly identified and documented before proceeding"],
  i:[]}},

{id:"escalate",type:"escalation",label:"Escalate: Security / Breaking Review",x:660,y:2145,expMinutes:30,bypassable:false,
 detail:{
  w:["SECURITY: Do NOT open a public GitHub issue for a vulnerability","Use: Repo → Security → Report a vulnerability (GitHub private security advisory)","Or email the contact in SECURITY.md directly","Include: description, exact reproduction steps, affected versions, potential impact","BREAKING: Discuss timing and approach with maintainers BEFORE merging"],
  u:["Wait for explicit maintainer sign-off before merging security-sensitive changes","Breaking changes need: CHANGELOG entry, version bump (MAJOR), migration guide"],
  c:["Security team or maintainer has been privately notified | disclosure plan agreed"],
  i:["SECURITY.md: at repo root","Private advisory: Repo → Security → Advisories → New draft advisory","Semantic versioning: semver.org"]}},

{id:"approvals",type:"decision",label:"Required Approvals Met?",x:395,y:2258,expMinutes:5,bypassable:false,
 detail:{
  w:["Check the PR merge section: it shows 'X of Y required reviews complete'","Some repos require 1 approval, others require 2 or more","CODEOWNERS-required reviewers must approve the specific files they own"],
  u:["Branch protection rules are displayed in the PR's merge box","Required reviewer unavailable 2+ days: escalate to maintainer","Approvals from non-required reviewers don't count toward the requirement"],
  c:["All required approvals received | every branch protection rule satisfied"],
  i:["Branch protection: Repo Settings → Branches → Branch protection rules","CODEOWNERS: .github/CODEOWNERS"]}},

{id:"qc_gate",type:"process",label:"QC / Handoff Gate",x:395,y:2378,expMinutes:15,bypassable:false,isChecklist:true,
 checklistItems:[
  {id:"qc1",label:"All CI checks are green (passing)",critical:true},
  {id:"qc2",label:"Required approvals received",critical:true},
  {id:"qc3",label:"PR template fully completed (no empty sections)",critical:true},
  {id:"qc4",label:"Issue linked in PR body (Closes #N or Fixes #N)",critical:true},
  {id:"qc5",label:"No secrets or credentials anywhere in the diff",critical:true},
  {id:"qc6",label:"Tests written or updated for new/changed behavior",critical:true},
  {id:"qc7",label:"Documentation updated if behavior changed",critical:false},
  {id:"qc8",label:"CHANGELOG updated (if project requires it)",critical:false},
  {id:"qc9",label:"Breaking changes documented and version bumped",critical:false},
  {id:"qc10",label:"Screenshots or recordings added for UI changes",critical:false},
 ],
 detail:{
  w:["Verify every ★ critical item before proceeding to merge","Non-critical (○) items should be addressed if they apply to this PR"],
  u:["This gate is a final sanity check — it prevents the most common post-merge issues","A maintainer may ask you to re-verify if this step is bypassed"],
  c:["All ★ critical items pass | 'Ready to merge' state confirmed"],
  i:[]}},

{id:"merge",type:"process",label:"Merge Pull Request",x:395,y:2500,expMinutes:5,bypassable:false,
 detail:{
  w:["Choose your merge strategy from the dropdown:","  Squash and merge — all commits become one (most common for features/fixes)","  Merge commit — preserves full commit history","  Rebase and merge — linear history, no merge bubble","Edit the squash commit message for clarity before confirming","Click the green merge button"],
  u:["CONTRIBUTING.md specifies which strategy the project uses — follow it","Merge Queue: some repos auto-merge when all checks pass (Settings → Branches)","After merge: GitHub offers 'Delete branch' — click it to keep the repo clean"],
  c:["PR merged | merge method matches project convention"],
  i:["Merge queue setup: Repo Settings → Branches → Merge queue","Squash message becomes the permanent commit message on main branch"]}},

{id:"cleanup",type:"process",label:"Post-Merge Cleanup",x:395,y:2602,expMinutes:10,bypassable:false,
 detail:{
  w:["Delete the merged branch on GitHub — 'Delete branch' button appears after merge","Locally: git checkout main","Locally: git pull origin main","Locally: git branch -d your-branch-name","Close the issue manually if it wasn't auto-closed by 'Closes #N'","Update any project board cards or kanban items for this work"],
  u:["Fork users: click 'Sync fork' on GitHub to bring your fork up to date","Or: git fetch upstream && git merge upstream/main","Check if any dependent issues or PRs are now unblocked by your merge"],
  c:["Remote branch deleted | local main up to date | issue closed | board updated"],
  i:[]}},

{id:"release_check",type:"decision",label:"Release Needed?",x:395,y:2718,expMinutes:5,bypassable:false,
 detail:{
  w:["Does this change need a formal published release with a version tag?","Check if the project uses automated releases (Release Please, semantic-release)","Breaking changes and significant features almost always need a release"],
  u:["Semantic versioning: MAJOR.MINOR.PATCH","Bug fix → PATCH (1.0.1) | New feature → MINOR (1.1.0) | Breaking → MAJOR (2.0.0)","Many projects automate releases — check .github/workflows/ for release workflows"],
  c:["Release requirement determined"],
  i:["Release automation: look for release.yml or release-please.yml in CI config"]}},

{id:"release",type:"process",label:"Create Release & Tag",x:168,y:2820,expMinutes:20,bypassable:true,
 detail:{
  w:["Go to: Repo → Releases → Draft a new release","Click 'Choose a tag' → create new tag: vX.Y.Z (follow project format)","Write release notes: summarize changes, credit contributors","Attach binaries or build artifacts if applicable","Click 'Publish release'"],
  u:["If using Release Please or semantic-release: just merge the auto-generated release PR","Always tag from main branch after your PR is already merged","Match the existing release note style for consistency"],
  c:["Release published | tag created on main | release notes complete"],
  i:["GitHub releases: Repo → Releases","Release Please: github.com/googleapis/release-please"]}},

{id:"end",type:"terminal",label:"Contribution Complete ✓",x:395,y:2930,expMinutes:2,bypassable:false,
 detail:{
  w:["Your contribution is live — thank you!","Consider thanking your reviewers; it builds a positive community","Share what you learned with your team"],
  u:["First contribution? You're officially a contributor — add it to your profile","Star the repo if you find it useful","Watch for any follow-up issues or regression reports"],
  c:["PR merged | cleanup done | issue closed | release published if required"],
  i:[]}},
];

// ── EDGES ─────────────────────────────────────────────────────────────
const EDGES_DEF = [
  {id:"e1", from:"start",        to:"identify",      label:""},
  {id:"e2", from:"identify",     to:"search",        label:""},
  {id:"e3", from:"search",       to:"exists",        label:""},
  {id:"e4", from:"exists",       to:"join",          label:"Yes"},
  {id:"e5", from:"exists",       to:"create_issue",  label:"No"},
  {id:"e6", from:"join",         to:"scope",         label:""},
  {id:"e7", from:"create_issue", to:"scope",         label:""},
  {id:"e8", from:"scope",        to:"breakdown",     label:"Too Big"},
  {id:"e9", from:"scope",        to:"env_check",     label:"Scoped ✓"},
  {id:"e10",from:"breakdown",    to:"scope",         label:"Re-scope", routeX:820},
  {id:"e11",from:"env_check",    to:"setup",         label:"No"},
  {id:"e12",from:"env_check",    to:"branch",        label:"Yes"},
  {id:"e13",from:"setup",        to:"branch",        label:""},
  {id:"e14",from:"branch",       to:"implement",     label:""},
  {id:"e15",from:"implement",    to:"tests",         label:""},
  {id:"e16",from:"tests",        to:"self_review",   label:""},
  {id:"e17",from:"self_review",  to:"push",          label:""},
  {id:"e18",from:"push",         to:"open_pr",       label:""},
  {id:"e19",from:"open_pr",      to:"ci",            label:""},
  {id:"e20",from:"ci",           to:"fix_ci",        label:"Fail"},
  {id:"e21",from:"fix_ci",       to:"ci",            label:"Retry", routeX:815},
  {id:"e22",from:"ci",           to:"req_review",    label:"Pass"},
  {id:"e23",from:"req_review",   to:"review",        label:""},
  {id:"e24",from:"review",       to:"feedback",      label:"Changes\nRequested"},
  {id:"e25",from:"feedback",     to:"ci",            label:"Re-push", routeX:820},
  {id:"e26",from:"review",       to:"breaking",      label:"Approved"},
  {id:"e27",from:"breaking",     to:"escalate",      label:"Yes"},
  {id:"e28",from:"escalate",     to:"approvals",     label:"Resolved ↩"},
  {id:"e29",from:"breaking",     to:"approvals",     label:"No"},
  {id:"e30",from:"approvals",    to:"req_review",    label:"Need More", routeX:28},
  {id:"e31",from:"approvals",    to:"qc_gate",       label:"Met ✓"},
  {id:"e32",from:"qc_gate",      to:"merge",         label:""},
  {id:"e33",from:"merge",        to:"cleanup",       label:""},
  {id:"e34",from:"cleanup",      to:"release_check", label:""},
  {id:"e35",from:"release_check",to:"release",       label:"Yes"},
  {id:"e36",from:"release_check",to:"end",           label:"No"},
  {id:"e37",from:"release",      to:"end",           label:""},
];

// ── UTILITIES ─────────────────────────────────────────────────────────
const nBox = n => {
  const w = NW[n.type]||192, h = NH[n.type]||52;
  return { rx:n.x-w/2, ry:n.y-h/2, w, h, cx:n.x, cy:n.y };
};

const wrapTxt = (s, max=22) => {
  if (s.length <= max) return [s];
  const words = s.split(' ');
  const lines = []; let cur = '';
  for (const w of words) {
    if ((cur+' '+w).trim().length <= max) cur = (cur+' '+w).trim();
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines.slice(0,2);
};

const calcEdge = (e, nodes) => {
  const fn = nodes.find(n=>n.id===e.from), tn = nodes.find(n=>n.id===e.to);
  if (!fn||!tn) return {d:"",mx:0,my:0};
  const fb=nBox(fn), tb=nBox(tn);
  const x1=fb.cx, y1=fb.ry+fb.h+1, x2=tb.cx, y2=tb.ry-1;
  if (y1 > y2) {
    const rx = e.routeX||(x1>400?820:20);
    const d = `M${x1},${y1}L${x1},${y1+24}L${rx},${y1+24}L${rx},${y2-24}L${x2},${y2-24}L${x2},${y2}`;
    return {d, mx:rx, my:(y1+y2)/2};
  }
  const cy = (y1+y2)/2;
  return {d:`M${x1},${y1}C${x1},${cy} ${x2},${cy} ${x2},${y2}`, mx:(x1+x2)/2, my:(y1+y2)/2};
};

const fmtMs  = ms => { const m=Math.floor(ms/60000),s=Math.floor((ms%60000)/1000); return `${m}:${String(s).padStart(2,'0')}`; };
const fmtMin = m => m < 60 ? `${m}m` : `${Math.floor(m/60)}h ${m%60}m`;
const tsStr  = ts => new Date(ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});

const getDownstream = (id, edges, statuses) => {
  const vis=new Set([id]), q=[id], aff=[];
  while (q.length) {
    const cur=q.shift();
    edges.filter(e=>e.from===cur&&!vis.has(e.to)).forEach(e=>{
      vis.add(e.to); q.push(e.to);
      const s=statuses[e.to];
      if (s==='active'||s==='done') aff.push(e.to);
    });
  }
  return aff;
};

const parseFCChange = txt => {
  const m = txt.match(/\[FLOWCHART_CHANGE\]([\s\S]*?)\[\/FLOWCHART_CHANGE\]/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
};

const applyFCChange = (change, nodes, edges) => {
  let ns=[...nodes], es=[...edges];
  const { action } = change;
  if (action==='add_node') {
    ns.push({id:change.id,type:change.type||'process',label:change.label,x:change.x||400,y:change.y||400,
      expMinutes:change.expMinutes||15,bypassable:!!change.bypassable,
      detail:change.detail||{w:[],u:[],c:[],i:[]}});
    if (change.removeEdge) es=es.filter(e=>e.id!==change.removeEdge);
  } else if (action==='remove_node') {
    ns=ns.filter(n=>n.id!==change.id);
    es=es.filter(e=>e.from!==change.id&&e.to!==change.id);
  } else if (action==='update_node_label') {
    ns=ns.map(n=>n.id===change.id?{...n,label:change.label}:n);
  } else if (action==='update_exp') {
    ns=ns.map(n=>n.id===change.id?{...n,expMinutes:change.expMinutes}:n);
  } else if (action==='add_edge') {
    es.push({id:change.id,from:change.from,to:change.to,label:change.label||''});
  } else if (action==='remove_edge') {
    es=es.filter(e=>e.id!==change.id);
  }
  return {nodes:ns, edges:es};
};

const genSummary = (change) => {
  const a = change.action;
  if (a==='add_node')          return `Add node "${change.label}" (${change.type})`;
  if (a==='remove_node')       return `Remove node "${change.id}"`;
  if (a==='update_node_label') return `Rename node "${change.id}" → "${change.label}"`;
  if (a==='update_exp')        return `Set expected time for "${change.id}" to ${change.expMinutes} min`;
  if (a==='add_edge')          return `Add edge: ${change.from} → ${change.to} (label: "${change.label||''}")`;
  if (a==='remove_edge')       return `Remove edge "${change.id}"`;
  return JSON.stringify(change);
};

// ── NODE SHAPE ────────────────────────────────────────────────────────
function NodeShape({ node, status, selected, overtime, editMode }) {
  const b = nBox(node);
  const sClr = SC[status]||SC.todo;
  const fill  = status==='done'?'#f0fdf4':status==='active'?'#f5f3ff':status==='blocked'?'#fff1f2':status==='skipped'?'#f1f5f9':'#ffffff';
  const stk   = selected ? ACC : status==='active' ? '#7c3aed' : '#94a3b8';
  const sw    = selected ? 2.5 : 1.5;
  const lines = wrapTxt(node.label);

  let shape;
  if (node.type==='terminal') {
    shape = <rect x={b.rx} y={b.ry} width={b.w} height={b.h} rx={22} fill={fill} stroke={stk} strokeWidth={sw}/>;
  } else if (node.type==='decision') {
    const pts = `${b.cx},${b.ry} ${b.rx+b.w},${b.cy} ${b.cx},${b.ry+b.h} ${b.rx},${b.cy}`;
    shape = <polygon points={pts} fill={fill} stroke={stk} strokeWidth={sw}/>;
  } else if (node.type==='escalation') {
    shape = <rect x={b.rx} y={b.ry} width={b.w} height={b.h} rx={5} fill="#fff7ed" stroke="#f97316" strokeWidth={sw}/>;
  } else {
    shape = <rect x={b.rx} y={b.ry} width={b.w} height={b.h} rx={5} fill={fill}
              stroke={node.isChecklist?ACC:stk} strokeWidth={sw}
              strokeDasharray={node.isChecklist?'6 3':undefined}/>;
  }

  return (
    <g data-nodeid={node.id} style={{cursor: editMode?'move':'pointer'}}>
      {overtime && (
        <rect x={b.rx-5} y={b.ry-5} width={b.w+10} height={b.h+10} rx={8}
          fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="7 4"/>
      )}
      {shape}
      <text textAnchor="middle" fontSize={10.5} fontFamily="system-ui" fill={PRI}
            style={{pointerEvents:'none',userSelect:'none'}}>
        {lines.map((l,i) => (
          <tspan key={i} x={b.cx} y={b.cy+(lines.length>1?(i===0?-8:10):0)}>{l}</tspan>
        ))}
      </text>
      <circle cx={b.rx+b.w-9} cy={b.ry+9} r={5} fill={sClr}/>
      {node.type==='escalation' && (
        <text x={b.rx+9} y={b.ry+b.h-7} fontSize={9} fill="#f97316" fontFamily="system-ui"
              style={{pointerEvents:'none'}}>⚠ ESCALATION</text>
      )}
      {node.isChecklist && (
        <text x={b.rx+9} y={b.ry+b.h-7} fontSize={9} fill={ACC} fontFamily="system-ui"
              style={{pointerEvents:'none'}}>★ CHECKLIST</text>
      )}
      {node.bypassable && (
        <text x={b.rx+b.w-9} y={b.ry+b.h-7} textAnchor="middle" fontSize={8} fill="#94a3b8"
              fontFamily="system-ui" style={{pointerEvents:'none'}}>↷</text>
      )}
      {selected && (
        <rect x={b.rx-2} y={b.ry-2} width={b.w+4} height={b.h+4} rx={8}
          fill="none" stroke={ACC} strokeWidth={1} opacity={0.5}/>
      )}
    </g>
  );
}

// ── CANVAS ────────────────────────────────────────────────────────────
function Canvas({ nodes, edges, statuses, timers, selected, editMode, now, onSelect, onNodeDrag }) {
  const svgRef  = useRef(null);
  const dragRef = useRef(null);
  const [view, setView] = useState({ tx:60, ty:20, scale:0.44 });

  useEffect(() => {
    const el = svgRef.current;
    const onWheel = e => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const mx = e.clientX-r.left, my = e.clientY-r.top;
      setView(v => {
        const ns = Math.max(0.1, Math.min(3, v.scale*(e.deltaY>0?0.88:1.14)));
        const f  = ns/v.scale;
        return { tx:mx*(1-f)+v.tx*f, ty:my*(1-f)+v.ty*f, scale:ns };
      });
    };
    el.addEventListener('wheel', onWheel, {passive:false});
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onMD = useCallback(e => {
    if (e.button!==0) return;
    const nid = e.target.closest('[data-nodeid]')?.dataset.nodeid;
    if (nid && editMode) {
      const node = nodes.find(n=>n.id===nid);
      dragRef.current = {type:'node', id:nid, ox:e.clientX, oy:e.clientY, moved:false,
        nx:node?.x, ny:node?.y};
    } else if (nid && !editMode) {
      // In view mode: track as a potential click, pan if dragged
      dragRef.current = {type:'nodeclick', id:nid, ox:e.clientX, oy:e.clientY,
        tx:view.tx, ty:view.ty, moved:false};
    } else {
      dragRef.current = {type:'pan', ox:e.clientX, oy:e.clientY, tx:view.tx, ty:view.ty};
    }
  }, [editMode, nodes, view]);

  const onMM = useCallback(e => {
    const d = dragRef.current; if (!d) return;
    if (d.type==='pan') {
      setView(v => ({...v, tx:d.tx+(e.clientX-d.ox), ty:d.ty+(e.clientY-d.oy)}));
    } else if (d.type==='nodeclick') {
      // Once dragged beyond dead zone, treat as pan
      const dx = e.clientX-d.ox, dy = e.clientY-d.oy;
      if (!d.moved && Math.abs(dx)+Math.abs(dy) < 4) return;
      dragRef.current = {...d, type:'pan', moved:true};
      setView(v => ({...v, tx:d.tx+dx, ty:d.ty+dy}));
    } else if (d.type==='node' && editMode) {
      const dx = e.clientX-d.ox, dy = e.clientY-d.oy;
      if (!d.moved && Math.abs(dx)+Math.abs(dy) < 4) return;
      dragRef.current = {...d, moved:true};
      const r = svgRef.current.getBoundingClientRect();
      const svgX = (e.clientX-r.left-view.tx)/view.scale;
      const svgY = (e.clientY-r.top -view.ty)/view.scale;
      onNodeDrag(d.id, svgX, svgY);
    }
  }, [editMode, view, onNodeDrag]);

  const onMU = useCallback(e => {
    const d = dragRef.current;
    dragRef.current = null;
    if ((d?.type==='node' || d?.type==='nodeclick') && !d.moved && e.type==='mouseup') {
      onSelect(d.id);
    }
  }, [onSelect]);

  const resetView = () => setView({tx:60,ty:20,scale:0.44});

  return (
    <svg ref={svgRef} style={{width:'100%',height:'100%',background:'#f8fafc',display:'block'}}
         onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}>
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0,0 0,6 8,3" fill="#94a3b8"/>
        </marker>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0L0 0 0 24" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <g transform={`translate(${view.tx},${view.ty}) scale(${view.scale})`}>
        {edges.map(e => {
          const {d,mx,my} = calcEdge(e, nodes);
          if (!d) return null;
          const isBack = e.routeX != null && !['e11','e13'].includes(e.id);
          return (
            <g key={e.id}>
              <path d={d} fill="none" stroke={isBack?'#c7d2fe':'#94a3b8'} strokeWidth={1.5}
                    markerEnd="url(#arr)" strokeDasharray={isBack?'5 3':undefined}/>
              {e.label && <text x={mx} y={my} textAnchor="middle" fontSize={9}
                fill={isBack?'#818cf8':'#6b7280'} fontFamily="system-ui"
                style={{pointerEvents:'none',userSelect:'none'}}>
                {e.label.split('\n').map((l,i)=><tspan key={i} x={mx} dy={i===0?0:11}>{l}</tspan>)}
              </text>}
            </g>
          );
        })}
        {nodes.map(n => {
          const st = statuses[n.id]||'todo';
          const ot = st==='active' && timers[n.id] && (now-timers[n.id])>n.expMinutes*60000*2;
          return (
            <NodeShape key={n.id} node={n} status={st} selected={selected===n.id}
              overtime={ot} editMode={editMode}/>
          );
        })}
      </g>
      {/* Mini controls */}
      <g>
        {[{y:12,lbl:'+',act:()=>setView(v=>({...v,scale:Math.min(3,v.scale*1.2)}))},
          {y:42,lbl:'−',act:()=>setView(v=>({...v,scale:Math.max(0.1,v.scale*0.83)}))},
          {y:72,lbl:'⊙',act:resetView}].map(({y,lbl,act},i)=>(
          <g key={i} onClick={act} style={{cursor:'pointer'}}>
            <rect x={10} y={y} width={26} height={26} rx={5} fill="white" stroke="#e2e8f0" strokeWidth={1}/>
            <text x={23} y={y+17} textAnchor="middle" fontSize={i<2?16:13} fill={PRI}
                  fontFamily="system-ui" style={{userSelect:'none'}}>{lbl}</text>
          </g>
        ))}
      </g>
      {/* Legend */}
      <g transform="translate(10,110)">
        <rect width={130} height={108} rx={5} fill="white" stroke="#e2e8f0" strokeWidth={1} opacity={0.9}/>
        {Object.entries(SC).map(([s,c],i)=>(
          <g key={s} transform={`translate(10,${14+i*18})`}>
            <circle cx={6} cy={0} r={5} fill={c}/>
            <text x={16} y={4} fontSize={9} fill="#475569" fontFamily="system-ui" style={{textTransform:'capitalize'}}>{s}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// ── DETAILS TAB ───────────────────────────────────────────────────────
function DetailsTab({ node }) {
  if (!node) return <div style={{padding:20,color:'#94a3b8',fontSize:13,flex:1}}>Select a node on the canvas to see details.</div>;
  const sections = [
    {key:'w',label:'Walk-Up / Before',    icon:'◎',color:'#3b82f6'},
    {key:'u',label:'During',              icon:'▶',color:'#7c3aed'},
    {key:'c',label:'Completion Criteria', icon:'✓',color:'#15803d'},
    {key:'i',label:'Org-Specific Info',   icon:'ℹ',color:'#f59e0b'},
  ];
  return (
    <div style={{padding:'14px 16px',overflowY:'auto',flex:1}}>
      <div style={{fontSize:11,color:'#94a3b8',marginBottom:12}}>
        Expected: <strong style={{color:PRI}}>{fmtMin(node.expMinutes)}</strong>
        {node.bypassable && <span style={{marginLeft:8,color:'#94a3b8'}}>· Bypassable ↷</span>}
        {node.isChecklist && <span style={{marginLeft:8,color:ACC}}>· ★ Checklist Gate</span>}
      </div>
      {sections.map(({key,label,icon,color})=>{
        const items = node.detail?.[key]||[];
        if (!items.length) return null;
        return (
          <div key={key} style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:600,color,marginBottom:6,
                         display:'flex',alignItems:'center',gap:5}}>
              <span>{icon}</span><span style={{textTransform:'uppercase',letterSpacing:'.04em'}}>{label}</span>
            </div>
            {items.map((item,i)=>(
              <div key={i} style={{display:'flex',gap:8,marginBottom:5,alignItems:'flex-start'}}>
                <span style={{color:color,fontSize:10,marginTop:2,flexShrink:0}}>›</span>
                <span style={{fontSize:12,color:'#334155',lineHeight:1.5}}>{item}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── AI HELP TAB ───────────────────────────────────────────────────────
function AIHelpTab({ node, nodes, edges, aiEdit, setAiEdit, chat, setChat,
                     onApplyChange, onLogEntry }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const endRef = useRef(null);
  const nodeId = node?.id||'_global';
  const msgs   = chat[nodeId]||[];

  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs]);

  const send = async () => {
    if (!input.trim()||loading) return;
    const userMsg = input.trim(); setInput('');
    const prevMsgs = chat[nodeId]||[];
    const newMsgs = [...prevMsgs, {role:'user',content:userMsg}];
    setChat(c=>({...c,[nodeId]:newMsgs}));
    setLoading(true);
    try {
      const simplifiedFC = aiEdit ? JSON.stringify({
        nodes:nodes.map(n=>({id:n.id,type:n.type,label:n.label,x:n.x,y:n.y,expMinutes:n.expMinutes})),
        edges:edges.map(e=>({id:e.id,from:e.from,to:e.to,label:e.label}))
      }) : null;
      const sysMsg = AI_SYS + (aiEdit?`\n\n[EDIT MODE ACTIVE - full flowchart below]\n${simplifiedFC}`:'');
      const ctxMsg = node ? `[Current step: ${node.label}]\n\n${userMsg}` : userMsg;
      const sendMsgs = [...prevMsgs, {role:'user',content:ctxMsg}];
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:MOD,max_tokens:800,system:sysMsg,messages:sendMsgs})
      });
      if (!res.ok) {
        const errBody = await res.text().catch(()=>'');
        throw new Error(`API ${res.status}: ${errBody||res.statusText}`);
      }
      const data = await res.json();
      const reply = data.content?.[0]?.text||'Error: empty response from API.';
      const updMsgs = [...newMsgs, {role:'assistant',content:reply}];
      setChat(c=>({...c,[nodeId]:updMsgs}));
      const change = parseFCChange(reply);
      if (change) setPendingChange(change);
      onLogEntry(`AI consulted on: ${node?.label||'general'}`);
    } catch(err) {
      setChat(c=>({...c,[nodeId]:[...newMsgs,{role:'assistant',content:`Error: ${err.message}`}]}));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => { setChat(c=>({...c,[nodeId]:[]})); setPendingChange(null); };

  const msgBubble = (m,i) => {
    const isUser = m.role==='user';
    const rawText = isUser ? m.content : m.content.replace(/\[FLOWCHART_CHANGE\][\s\S]*?\[\/FLOWCHART_CHANGE\]/g,'[📐 Flowchart change suggested — see below]');
    return (
      <div key={i} style={{marginBottom:10,display:'flex',flexDirection:'column',
                            alignItems:isUser?'flex-end':'flex-start'}}>
        <div style={{maxWidth:'90%',padding:'8px 12px',borderRadius:isUser?'12px 12px 2px 12px':'12px 12px 12px 2px',
                     background:isUser?PRI:'white',color:isUser?'white':'#1e293b',
                     fontSize:12,lineHeight:1.5,border:isUser?'none':'1px solid #e2e8f0',
                     boxShadow:'0 1px 2px rgba(0,0,0,0.05)'}}>
          {rawText}
        </div>
      </div>
    );
  };

  return (
    <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
      {/* Toolbar */}
      <div style={{padding:'8px 14px',borderBottom:'1px solid #e2e8f0',display:'flex',alignItems:'center',gap:8}}>
        <label style={{display:'flex',alignItems:'center',gap:6,fontSize:11,cursor:'pointer',userSelect:'none'}}>
          <div onClick={()=>setAiEdit(v=>!v)} style={{width:32,height:18,borderRadius:9,
               background:aiEdit?ACC:'#e2e8f0',position:'relative',transition:'background .2s',cursor:'pointer'}}>
            <div style={{position:'absolute',top:2,left:aiEdit?14:2,width:14,height:14,
                         borderRadius:'50%',background:'white',transition:'left .2s',
                         boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>
          </div>
          <span style={{color:aiEdit?'#92400e':'#64748b'}}>Edit Mode {aiEdit?'ON':'OFF'}</span>
        </label>
        {msgs.length>0&&<button onClick={clearChat} style={{marginLeft:'auto',fontSize:10,color:'#94a3b8',
          background:'none',border:'none',cursor:'pointer',padding:'2px 6px'}}>Clear</button>}
      </div>

      {/* Pending change */}
      {pendingChange && (
        <div style={{margin:'8px 12px',padding:'10px 12px',background:'#fefce8',border:'1px solid #fde68a',borderRadius:8}}>
          <div style={{fontSize:11,fontWeight:600,color:'#92400e',marginBottom:4}}>📐 Suggested Change</div>
          <div style={{fontSize:11,color:'#78350f',marginBottom:8}}>{genSummary(pendingChange)}</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>{onApplyChange(pendingChange);setPendingChange(null);onLogEntry('AI change applied: '+genSummary(pendingChange));}}
              style={{flex:1,padding:'5px 0',background:'#15803d',color:'white',border:'none',borderRadius:5,fontSize:11,cursor:'pointer',fontWeight:600}}>
              Apply
            </button>
            <button onClick={()=>setPendingChange(null)}
              style={{flex:1,padding:'5px 0',background:'white',color:'#dc2626',border:'1px solid #fca5a5',borderRadius:5,fontSize:11,cursor:'pointer'}}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{flex:1,overflowY:'auto',padding:'12px 14px'}}>
        {msgs.length===0&&(
          <div style={{color:'#94a3b8',fontSize:12,textAlign:'center',marginTop:24}}>
            {node?`Ask anything about "${node.label}"`:'Ask anything about this GitHub workflow'}
            {aiEdit&&<div style={{marginTop:8,color:'#fbbf24',fontSize:11}}>Edit mode active — AI can suggest flowchart changes</div>}
          </div>
        )}
        {msgs.map(msgBubble)}
        {loading&&<div style={{fontSize:12,color:'#94a3b8',fontStyle:'italic'}}>Thinking…</div>}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{padding:'10px 14px',borderTop:'1px solid #e2e8f0',display:'flex',gap:8}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder="Ask for help or suggest an edit…"
          style={{flex:1,resize:'none',height:54,padding:'7px 10px',borderRadius:8,border:'1px solid #e2e8f0',
                  fontSize:12,fontFamily:'system-ui',outline:'none',lineHeight:1.4}}/>
        <button onClick={send} disabled={loading||!input.trim()}
          style={{width:44,background:loading?'#e2e8f0':PRI,color:'white',border:'none',
                  borderRadius:8,fontSize:16,cursor:loading?'not-allowed':'pointer',flexShrink:0}}>
          ↑
        </button>
      </div>
    </div>
  );
}

// ── NOTES TAB ─────────────────────────────────────────────────────────
function NotesTab({ node, notes, setNotes, sessionLog }) {
  const [input, setInput] = useState('');
  const nodeId = node?.id;
  const nodeNotes = nodeId ? (notes[nodeId]||[]) : [];

  const addNote = () => {
    if (!input.trim()||!nodeId) return;
    setNotes(n=>({...n,[nodeId]:[...(n[nodeId]||[]),{t:input.trim(),ts:Date.now()}]}));
    setInput('');
  };

  return (
    <div style={{display:'flex',flexDirection:'column',flex:1,overflow:'hidden'}}>
      <div style={{flex:1,overflowY:'auto',padding:'12px 14px'}}>
        {nodeId&&(
          <>
            <div style={{fontSize:11,fontWeight:600,color:'#64748b',marginBottom:8,textTransform:'uppercase',letterSpacing:'.04em'}}>
              Notes for: {node.label}
            </div>
            {nodeNotes.length===0&&<div style={{color:'#94a3b8',fontSize:12}}>No notes yet.</div>}
            {nodeNotes.map((n,i)=>(
              <div key={i} style={{marginBottom:8,padding:'8px 10px',background:'#fefce8',
                                   borderRadius:6,border:'1px solid #fde68a'}}>
                <div style={{fontSize:12,color:'#1e293b',lineHeight:1.5}}>{n.t}</div>
                <div style={{fontSize:10,color:'#92400e',marginTop:3}}>{tsStr(n.ts)}</div>
              </div>
            ))}
          </>
        )}
        <div style={{fontSize:11,fontWeight:600,color:'#64748b',
                     margin:`${nodeId?16:0}px 0 8px`,textTransform:'uppercase',letterSpacing:'.04em'}}>
          Session Log
        </div>
        {sessionLog.length===0&&<div style={{color:'#94a3b8',fontSize:12}}>Session not started.</div>}
        {[...sessionLog].reverse().map((e,i)=>(
          <div key={i} style={{display:'flex',gap:8,marginBottom:5,fontSize:11}}>
            <span style={{color:'#94a3b8',flexShrink:0}}>{tsStr(e.ts)}</span>
            <span style={{color:'#475569'}}>{e.t}</span>
          </div>
        ))}
      </div>
      {nodeId&&(
        <div style={{padding:'10px 14px',borderTop:'1px solid #e2e8f0',display:'flex',gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{if(e.key==='Enter')addNote();}}
            placeholder={`Add note for "${node?.label}"…`}
            style={{flex:1,padding:'7px 10px',borderRadius:8,border:'1px solid #e2e8f0',
                    fontSize:12,fontFamily:'system-ui',outline:'none'}}/>
          <button onClick={addNote}
            style={{padding:'7px 14px',background:PRI,color:'white',border:'none',
                    borderRadius:8,fontSize:12,cursor:'pointer'}}>Add</button>
        </div>
      )}
    </div>
  );
}

// ── PROGRESS TAB ──────────────────────────────────────────────────────
function ProgressTab({ nodes, statuses, timers, sessionStart, now }) {
  const total   = nodes.length;
  const done    = nodes.filter(n=>statuses[n.id]==='done').length;
  const active  = nodes.filter(n=>statuses[n.id]==='active').length;
  const blocked = nodes.filter(n=>statuses[n.id]==='blocked').length;
  const skipped = nodes.filter(n=>statuses[n.id]==='skipped').length;
  const pct     = Math.round((done/total)*100);
  const elapsed = sessionStart ? now-sessionStart : 0;

  const statusOrder = ['active','blocked','todo','done','skipped'];
  const sorted = [...nodes].sort((a,b)=>{
    const ai=statusOrder.indexOf(statuses[a.id]||'todo');
    const bi=statusOrder.indexOf(statuses[b.id]||'todo');
    return ai-bi;
  });

  return (
    <div style={{padding:'14px 16px',overflowY:'auto',flex:1}}>
      {/* Session timer */}
      <div style={{marginBottom:16,padding:'12px 14px',background:'#f1f5f9',borderRadius:8}}>
        <div style={{fontSize:11,color:'#64748b',marginBottom:4}}>Session Duration</div>
        <div style={{fontSize:28,fontWeight:700,color:PRI,fontFamily:'monospace',letterSpacing:1}}>
          {sessionStart ? fmtMs(elapsed) : '—:——'}
        </div>
        {!sessionStart&&<div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>Start a session to begin timing</div>}
      </div>

      {/* Progress bar */}
      <div style={{marginBottom:16}}>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#64748b',marginBottom:5}}>
          <span>Progress</span><span style={{fontWeight:600,color:PRI}}>{done}/{total} steps ({pct}%)</span>
        </div>
        <div style={{height:8,background:'#e2e8f0',borderRadius:4,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${pct}%`,background:'#15803d',borderRadius:4,transition:'width .4s'}}/>
        </div>
        <div style={{display:'flex',gap:12,marginTop:6,fontSize:10,color:'#64748b'}}>
          {active>0&&<span style={{color:SC.active}}>● {active} active</span>}
          {blocked>0&&<span style={{color:SC.blocked}}>● {blocked} blocked</span>}
          {skipped>0&&<span style={{color:SC.skipped}}>● {skipped} skipped</span>}
          <span style={{color:SC.done}}>● {done} done</span>
        </div>
      </div>

      {/* Node list */}
      <div style={{fontSize:11,fontWeight:600,color:'#64748b',marginBottom:8,
                   textTransform:'uppercase',letterSpacing:'.04em'}}>All Steps</div>
      {sorted.map(n=>{
        const st  = statuses[n.id]||'todo';
        const clr = SC[st];
        const startTs = timers[n.id];
        const elapsed_n = st==='active'&&startTs ? now-startTs : null;
        return (
          <div key={n.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7,
                                   padding:'6px 8px',borderRadius:5,
                                   background:st==='active'?'#f5f3ff':st==='blocked'?'#fff1f2':'transparent'}}>
            <svg width={12} height={12} style={{flexShrink:0,overflow:'visible'}}>
              <circle cx={6} cy={6} r={5} fill={clr}/>
            </svg>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:11,color:PRI,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.label}</div>
              <div style={{fontSize:9.5,color:'#94a3b8'}}>exp: {fmtMin(n.expMinutes)}</div>
            </div>
            {elapsed_n&&<div style={{fontSize:10,color:SC.active,flexShrink:0,fontFamily:'monospace'}}>{fmtMs(elapsed_n)}</div>}
            <div style={{fontSize:10,color:clr,fontWeight:600,flexShrink:0,
                         textTransform:'capitalize',minWidth:42,textAlign:'right'}}>{st}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── QC GATE MODAL ─────────────────────────────────────────────────────
function QCModal({ node, qcState, setQcState, onClose, onPass }) {
  const items = node.checklistItems||[];
  const critItems = items.filter(i=>i.critical);
  const allCritPass = critItems.every(i=>qcState[i.id]==='pass');

  const setItem = (id, val) => setQcState(s=>({...s,[id]:val}));

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,
                 display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'white',borderRadius:12,width:480,maxHeight:'80vh',
                   display:'flex',flexDirection:'column',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        {/* Header */}
        <div style={{padding:'18px 20px',borderBottom:'1px solid #e2e8f0'}}>
          <div style={{fontWeight:700,fontSize:15,color:PRI}}>★ QC / Handoff Gate</div>
          <div style={{fontSize:12,color:'#64748b',marginTop:2}}>{node.label} — verify before merging</div>
        </div>

        {/* Items */}
        <div style={{overflowY:'auto',flex:1,padding:'14px 20px'}}>
          {['Critical (★ — required to merge)','Recommended (○ — complete if applicable)'].map((grpLabel,gi)=>{
            const grpItems = items.filter(i=>(gi===0?i.critical:!i.critical));
            return (
              <div key={gi} style={{marginBottom:16}}>
                <div style={{fontSize:10,fontWeight:600,color:gi===0?'#dc2626':ACC,
                             textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>
                  {grpLabel}
                </div>
                {grpItems.map(item=>{
                  const st = qcState[item.id]||null;
                  return (
                    <div key={item.id} style={{display:'flex',alignItems:'center',gap:10,
                                               marginBottom:8,padding:'8px 10px',borderRadius:6,
                                               background:st==='pass'?'#f0fdf4':st==='fail'?'#fff1f2':st==='skip'?'#f8fafc':'#f8fafc',
                                               border:`1px solid ${st==='pass'?'#86efac':st==='fail'?'#fca5a5':st==='skip'?'#e2e8f0':'#e2e8f0'}`}}>
                      <span style={{fontSize:11,color:gi===0?'#dc2626':ACC,flexShrink:0}}>
                        {gi===0?'★':'○'}
                      </span>
                      <span style={{flex:1,fontSize:12,color:'#334155'}}>{item.label}</span>
                      {['pass','fail','skip'].map(v=>(
                        <button key={v} onClick={()=>setItem(item.id,st===v?null:v)}
                          style={{padding:'3px 8px',borderRadius:5,border:'1px solid',fontSize:10,cursor:'pointer',
                                  fontWeight:600,
                                  background:st===v?(v==='pass'?'#15803d':v==='fail'?'#dc2626':'#6b7280'):'white',
                                  borderColor:st===v?(v==='pass'?'#15803d':v==='fail'?'#dc2626':'#6b7280'):'#e2e8f0',
                                  color:st===v?'white':(v==='pass'?'#15803d':v==='fail'?'#dc2626':'#6b7280')}}>
                          {v==='pass'?'✓ Pass':v==='fail'?'✗ Fail':'↷ Skip'}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{padding:'14px 20px',borderTop:'1px solid #e2e8f0'}}>
          {allCritPass ? (
            <div style={{padding:'8px 12px',background:'#f0fdf4',borderRadius:6,border:'1px solid #86efac',
                         marginBottom:12,fontSize:12,color:'#15803d',fontWeight:600,textAlign:'center'}}>
              ✓ Ready to merge — all critical items pass
            </div>
          ) : (
            <div style={{padding:'8px 12px',background:'#fff1f2',borderRadius:6,border:'1px solid #fca5a5',
                         marginBottom:12,fontSize:12,color:'#dc2626',textAlign:'center'}}>
              {critItems.filter(i=>qcState[i.id]!=='pass').length} critical item(s) not yet passing
            </div>
          )}
          <div style={{display:'flex',gap:8}}>
            <button onClick={onClose}
              style={{flex:1,padding:'9px',background:'white',border:'1px solid #e2e8f0',
                      borderRadius:8,fontSize:13,cursor:'pointer',color:'#64748b'}}>
              Close
            </button>
            <button onClick={()=>{ if(allCritPass) onPass(); }}
              disabled={!allCritPass}
              style={{flex:2,padding:'9px',background:allCritPass?'#15803d':'#e2e8f0',
                      color:allCritPass?'white':'#94a3b8',border:'none',borderRadius:8,
                      fontSize:13,cursor:allCritPass?'pointer':'not-allowed',fontWeight:600}}>
              Mark Complete →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DOWNSTREAM MODAL ──────────────────────────────────────────────────
function DownstreamModal({ nodeLabel, affectedIds, nodeMap, onConfirm, onCancel }) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,
                 display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'white',borderRadius:12,width:400,padding:24,
                   boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{fontSize:15,fontWeight:700,color:'#dc2626',marginBottom:8}}>⚠ Downstream Alert</div>
        <div style={{fontSize:13,color:'#334155',marginBottom:14}}>
          Marking <strong>"{nodeLabel}"</strong> as done will affect steps that are already active or done:
        </div>
        {affectedIds.map(id=>(
          <div key={id} style={{display:'flex',gap:8,marginBottom:6,alignItems:'center'}}>
            <span style={{fontSize:14}}>›</span>
            <span style={{fontSize:12,color:'#1e293b'}}>{nodeMap[id]?.label||id}</span>
          </div>
        ))}
        <div style={{fontSize:12,color:'#64748b',marginTop:12,marginBottom:18}}>
          These steps' statuses will not be changed automatically — you'll need to update them manually if needed.
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onCancel}
            style={{flex:1,padding:'9px',background:'white',border:'1px solid #e2e8f0',
                    borderRadius:8,fontSize:13,cursor:'pointer',color:'#64748b'}}>
            Cancel
          </button>
          <button onClick={onConfirm}
            style={{flex:1,padding:'9px',background:'#dc2626',color:'white',border:'none',
                    borderRadius:8,fontSize:13,cursor:'pointer',fontWeight:600}}>
            Mark Done Anyway
          </button>
        </div>
      </div>
    </div>
  );
}

// ── BYPASS MODAL ──────────────────────────────────────────────────────
function BypassModal({ nodeLabel, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,
                 display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'white',borderRadius:12,width:380,padding:24,
                   boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{fontSize:15,fontWeight:700,color:PRI,marginBottom:4}}>↷ Skip Step</div>
        <div style={{fontSize:13,color:'#64748b',marginBottom:14}}>
          Skipping: <strong>"{nodeLabel}"</strong>
        </div>
        <textarea value={reason} onChange={e=>setReason(e.target.value)}
          placeholder="Reason for skipping this step (required)…"
          style={{width:'100%',height:80,padding:'8px 10px',borderRadius:8,
                  border:'1px solid #e2e8f0',fontSize:12,fontFamily:'system-ui',
                  outline:'none',resize:'none',boxSizing:'border-box'}}/>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button onClick={onCancel}
            style={{flex:1,padding:'9px',background:'white',border:'1px solid #e2e8f0',
                    borderRadius:8,fontSize:13,cursor:'pointer',color:'#64748b'}}>
            Cancel
          </button>
          <button onClick={()=>{ if(reason.trim()) onConfirm(reason.trim()); }}
            disabled={!reason.trim()}
            style={{flex:1,padding:'9px',background:reason.trim()?'#6b7280':'#e2e8f0',
                    color:'white',border:'none',borderRadius:8,
                    fontSize:13,cursor:reason.trim()?'pointer':'not-allowed',fontWeight:600}}>
            Skip Step
          </button>
        </div>
      </div>
    </div>
  );
}

// ── LABEL EDIT MODAL ──────────────────────────────────────────────────
function LabelEditModal({ node, onSave, onCancel }) {
  const [val, setVal] = useState(node.label);
  const [exp, setExp] = useState(node.expMinutes);
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:200,
                 display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'white',borderRadius:12,width:360,padding:24,
                   boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{fontSize:15,fontWeight:700,color:PRI,marginBottom:14}}>Edit Node</div>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,color:'#64748b',display:'block',marginBottom:4}}>Label</label>
          <input value={val} onChange={e=>setVal(e.target.value)} autoFocus
            style={{width:'100%',padding:'8px 10px',borderRadius:8,border:'1px solid #e2e8f0',
                    fontSize:13,fontFamily:'system-ui',outline:'none',boxSizing:'border-box'}}/>
        </div>
        <div style={{marginBottom:18}}>
          <label style={{fontSize:11,color:'#64748b',display:'block',marginBottom:4}}>Expected Time (minutes)</label>
          <input type="number" value={exp} onChange={e=>setExp(Number(e.target.value))} min={1}
            style={{width:'100%',padding:'8px 10px',borderRadius:8,border:'1px solid #e2e8f0',
                    fontSize:13,fontFamily:'system-ui',outline:'none',boxSizing:'border-box'}}/>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={onCancel}
            style={{flex:1,padding:'9px',background:'white',border:'1px solid #e2e8f0',
                    borderRadius:8,fontSize:13,cursor:'pointer',color:'#64748b'}}>Cancel</button>
          <button onClick={()=>onSave(val.trim()||node.label, exp)}
            style={{flex:1,padding:'9px',background:PRI,color:'white',border:'none',
                    borderRadius:8,fontSize:13,cursor:'pointer',fontWeight:600}}>Save</button>
        </div>
      </div>
    </div>
  );
}

// ── RIGHT PANEL ───────────────────────────────────────────────────────
function RightPanel({ node, nodes, edges, statuses, timers, sessionLog, sessionStart,
                      sessionActive, now, tab, setTab, notes, setNotes, chat, setChat,
                      aiEdit, setAiEdit, qcState, setQcState, bypassReasons,
                      onStatusChange, onBypassClick, onQCOpen, onApplyChange, onLogEntry }) {
  const TABS = ['Details','AI Help','Notes','Progress'];
  const status = node ? (statuses[node.id]||'todo') : null;
  const isEscalation = node?.type==='escalation';

  return (
    <div style={{width:360,borderLeft:'1px solid #e2e8f0',display:'flex',flexDirection:'column',
                 background:'white',height:'100%',overflow:'hidden',flexShrink:0}}>

      {/* Node header */}
      <div style={{padding:'14px 16px',borderBottom:'1px solid #e2e8f0',background:'#f8fafc',minHeight:100}}>
        {!node ? (
          <div style={{color:'#94a3b8',fontSize:13,paddingTop:8}}>
            Click any step on the canvas to view details
          </div>
        ) : (
          <>
            <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8}}>
              <div style={{flex:1,fontSize:13,fontWeight:700,color:PRI,lineHeight:1.3}}>{node.label}</div>
              <span style={{fontSize:9,color:'#94a3b8',background:'#f1f5f9',padding:'2px 6px',borderRadius:10,
                            textTransform:'uppercase',letterSpacing:'.04em',flexShrink:0}}>{node.type}</span>
            </div>
            {/* Status row */}
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
              {Object.entries(SC).filter(([s])=>s!=='skipped').map(([s,c])=>(
                <button key={s} onClick={()=>onStatusChange(node.id,s)}
                  style={{padding:'3px 10px',borderRadius:12,border:`1.5px solid ${status===s?c:'#e2e8f0'}`,
                          background:status===s?c:'white',color:status===s?'white':'#64748b',
                          fontSize:10,cursor:'pointer',fontWeight:status===s?700:400,
                          textTransform:'capitalize',transition:'all .15s'}}>
                  {s}
                </button>
              ))}
            </div>
            {/* Action buttons */}
            <div style={{display:'flex',gap:6}}>
              {node.bypassable && status!=='done' && (
                <button onClick={()=>onBypassClick(node.id)}
                  style={{padding:'4px 10px',background:'white',border:'1px solid #e2e8f0',
                          borderRadius:6,fontSize:11,cursor:'pointer',color:'#6b7280'}}>
                  ↷ Skip
                </button>
              )}
              {node.isChecklist && (
                <button onClick={()=>onQCOpen(node.id)}
                  style={{padding:'4px 10px',background:ACC,border:'none',
                          borderRadius:6,fontSize:11,cursor:'pointer',color:'white',fontWeight:600}}>
                  ★ Open Checklist
                </button>
              )}
              {isEscalation && (
                <button onClick={()=>onStatusChange(node.id,'done')}
                  style={{padding:'4px 10px',background:'#f97316',border:'none',
                          borderRadius:6,fontSize:11,cursor:'pointer',color:'white',fontWeight:600}}>
                  ↩ Resolved
                </button>
              )}
            </div>
            {bypassReasons[node.id] && (
              <div style={{marginTop:6,fontSize:10,color:'#94a3b8'}}>
                ↷ Skipped: {bypassReasons[node.id]}
              </div>
            )}
          </>
        )}
      </div>

      {/* Tabs */}
      <div style={{display:'flex',borderBottom:'1px solid #e2e8f0',background:'white'}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{flex:1,padding:'9px 4px',background:'none',border:'none',cursor:'pointer',
                    fontSize:11,color:tab===t?PRI:'#94a3b8',fontWeight:tab===t?700:400,
                    borderBottom:tab===t?`2px solid ${ACC}`:'2px solid transparent',
                    transition:'all .15s'}}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
        {tab==='Details'  && <DetailsTab node={node}/>}
        {tab==='AI Help'  && <AIHelpTab node={node} nodes={nodes} edges={edges}
                              aiEdit={aiEdit} setAiEdit={setAiEdit} chat={chat} setChat={setChat}
                              onApplyChange={onApplyChange} onLogEntry={onLogEntry}/>}
        {tab==='Notes'    && <NotesTab node={node} notes={notes} setNotes={setNotes} sessionLog={sessionLog}/>}
        {tab==='Progress' && <ProgressTab nodes={nodes} statuses={statuses} timers={timers}
                              sessionStart={sessionStart} sessionActive={sessionActive} now={now}/>}
      </div>
    </div>
  );
}

// ── COPY MODAL ────────────────────────────────────────────────────────
// Shown when both Clipboard API and execCommand fail (sandboxed context)
function CopyModal({ text, onClose }) {
  const taRef = useRef(null);
  useEffect(() => {
    if (taRef.current) { taRef.current.focus(); taRef.current.select(); }
  }, []);
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',zIndex:200,
                 display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'white',borderRadius:12,width:520,padding:24,
                   boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <div style={{fontSize:15,fontWeight:700,color:PRI,marginBottom:4}}>📋 Copy Ticket</div>
        <div style={{fontSize:12,color:'#64748b',marginBottom:14}}>
          Clipboard access is blocked in this environment. The text below is pre-selected —
          press <kbd style={{background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:4,
          padding:'1px 5px',fontSize:11}}>Cmd+C</kbd> / <kbd style={{background:'#f1f5f9',
          border:'1px solid #e2e8f0',borderRadius:4,padding:'1px 5px',fontSize:11}}>Ctrl+C</kbd> to copy.
        </div>
        <textarea ref={taRef} readOnly value={text}
          style={{width:'100%',height:220,padding:'10px 12px',borderRadius:8,
                  border:'1px solid #e2e8f0',fontSize:11,fontFamily:'monospace',
                  lineHeight:1.6,resize:'none',outline:'none',
                  background:'#f8fafc',boxSizing:'border-box'}}/>
        <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
          <button onClick={onClose}
            style={{padding:'8px 20px',background:PRI,color:'white',border:'none',
                    borderRadius:8,fontSize:13,cursor:'pointer',fontWeight:600}}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [nodes,         setNodes]         = useState(NODES_DEF);
  const [edges,         setEdges]         = useState(EDGES_DEF);
  const [statuses,      setStatuses]      = useState({});
  const [timers,        setTimers]        = useState({});
  const [selected,      setSelected]      = useState(null);
  const [tab,           setTab]           = useState('Details');
  const [notes,         setNotes]         = useState({});
  const [sessionLog,    setSessionLog]    = useState([]);
  const [sessionStart,  setSessionStart]  = useState(null);
  const [chat,          setChat]          = useState({});
  const [aiEdit,        setAiEdit]        = useState(false);
  const [arrangeMode,   setArrangeMode]   = useState(false);
  const [qcState,       setQcState]       = useState({});
  const [bypassReasons, setBypassReasons] = useState({});
  const [qcOpen,        setQcOpen]        = useState(null);
  const [downModal,     setDownModal]     = useState(null);
  const [bypassModal,   setBypassModal]   = useState(null);
  const [labelModal,    setLabelModal]    = useState(null);
  const [now,           setNow]           = useState(Date.now());
  const [copyModal,     setCopyModal]     = useState(null);
  const [saved,         setSaved]         = useState(false);
  const [loaded,        setLoaded]        = useState(false);
  const savedTimerRef = useRef(null);

  // ── TICK ──────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // ── LOAD ──────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(SK);
        if (r?.value) {
          const d = JSON.parse(r.value);
          if (d.nodes)         setNodes(d.nodes);
          if (d.edges)         setEdges(d.edges);
          if (d.statuses)      setStatuses(d.statuses);
          if (d.timers)        setTimers(d.timers);
          if (d.notes)         setNotes(d.notes);
          if (d.sessionLog)    setSessionLog(d.sessionLog);
          if (d.sessionStart)  setSessionStart(d.sessionStart);
          if (d.chat)          setChat(d.chat);
          if (d.qcState)       setQcState(d.qcState);
          if (d.bypassReasons) setBypassReasons(d.bypassReasons);
        }
      } catch(e) { console.warn('Load error:', e); }
      setLoaded(true);
    })();
  }, []);

  // ── SAVE ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await window.storage.set(SK, JSON.stringify({
          nodes, edges, statuses, timers, notes, sessionLog,
          sessionStart, chat, qcState, bypassReasons
        }));
        setSaved(true);
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSaved(false), 1500);
      } catch(e) { console.warn('Save error:', e); }
    })();
  }, [nodes,edges,statuses,timers,notes,sessionLog,sessionStart,chat,qcState,bypassReasons,loaded]);

  // ── HELPERS ───────────────────────────────────────────────────────
  const addLog = useCallback(t => {
    setSessionLog(l => [...l, {t, ts:Date.now()}]);
  }, []);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map(n=>[n.id,n])), [nodes]);
  const selectedNode = selected ? nodeMap[selected] : null;

  // ── STATUS CHANGE ─────────────────────────────────────────────────
  const handleStatusChange = useCallback((nodeId, newStatus) => {
    const node = nodeMap[nodeId];

    // QC gate guard
    if (node?.isChecklist && newStatus==='done') {
      const critItems = (node.checklistItems||[]).filter(i=>i.critical);
      const allPass = critItems.every(i=>qcState[i.id]==='pass');
      if (!allPass) { setQcOpen(nodeId); return; }
    }

    // Downstream alert
    if (newStatus==='done') {
      const affected = getDownstream(nodeId, edges, statuses);
      if (affected.length > 0) {
        setDownModal({nodeId, nodeLabel:node?.label, affected});
        return;
      }
    }

    setStatuses(s => ({...s, [nodeId]:newStatus}));
    if (newStatus==='active') setTimers(t => ({...t, [nodeId]:Date.now()}));
    addLog(`${node?.label}: → ${newStatus}`);
  }, [nodeMap, edges, statuses, qcState, addLog]);

  const confirmDone = useCallback(() => {
    if (!downModal) return;
    setStatuses(s => ({...s, [downModal.nodeId]:'done'}));
    addLog(`${downModal.nodeLabel}: → done (downstream confirmed)`);
    setDownModal(null);
  }, [downModal, addLog]);

  // ── BYPASS ────────────────────────────────────────────────────────
  const handleBypassClick = useCallback(nodeId => setBypassModal({nodeId}), []);

  const confirmBypass = useCallback((nodeId, reason) => {
    setStatuses(s => ({...s, [nodeId]:'skipped'}));
    setBypassReasons(b => ({...b, [nodeId]:reason}));
    addLog(`${nodeMap[nodeId]?.label}: skipped — ${reason}`);
    setBypassModal(null);
  }, [nodeMap, addLog]);

  // ── QC GATE ───────────────────────────────────────────────────────
  const handleQCPass = useCallback((nodeId) => {
    setStatuses(s => ({...s, [nodeId]:'done'}));
    addLog(`QC Gate: passed — ${nodeMap[nodeId]?.label}`);
    setQcOpen(null);
  }, [nodeMap, addLog]);

  // ── NODE DRAG ─────────────────────────────────────────────────────
  const handleNodeDrag = useCallback((nodeId, x, y) => {
    setNodes(ns => ns.map(n => n.id===nodeId ? {...n, x, y} : n));
  }, []);

  // ── LABEL EDIT ────────────────────────────────────────────────────
  const handleLabelSave = useCallback((nodeId, label, expMinutes) => {
    setNodes(ns => ns.map(n => n.id===nodeId ? {...n, label, expMinutes} : n));
    addLog(`Node renamed: ${nodeMap[nodeId]?.label} → ${label}`);
    setLabelModal(null);
  }, [nodeMap, addLog]);

  // ── AI CHANGE ─────────────────────────────────────────────────────
  const handleApplyChange = useCallback(change => {
    const {nodes:ns, edges:es} = applyFCChange(change, nodes, edges);
    setNodes(ns); setEdges(es);
    // If the selected node was removed, clear selection
    if (change.action==='remove_node' && change.id===selected) setSelected(null);
  }, [nodes, edges, selected]);

  // ── TICKET TEXT ───────────────────────────────────────────────────
  const buildTicketText = useCallback(() => {
    const doneSorted = nodes.filter(n=>statuses[n.id]==='done')
      .sort((a,b)=>(timers[a.id]||0)-(timers[b.id]||0));
    const skipped = nodes.filter(n=>statuses[n.id]==='skipped');
    const el = sessionStart ? Math.floor((Date.now()-sessionStart)/60000) : 0;
    let txt = `=== GitHub Contribution Session ===\n`;
    txt += `Date: ${new Date().toLocaleString()}\n`;
    txt += `Duration: ${el} min\n\n`;
    txt += `COMPLETED STEPS:\n${doneSorted.map(n=>`  ✓ ${n.label}`).join('\n')||'  (none)'}\n\n`;
    if (skipped.length) txt += `SKIPPED:\n${skipped.map(n=>`  ↷ ${n.label}: ${bypassReasons[n.id]||'—'}`).join('\n')}\n\n`;
    txt += `SESSION LOG:\n${sessionLog.map(e=>`  [${tsStr(e.ts)}] ${e.t}`).join('\n')||'  (empty)'}`;
    return txt;
  }, [nodes, statuses, timers, bypassReasons, sessionStart, sessionLog]);

  const generateTicket = useCallback(async () => {
    const txt = buildTicketText();
    const ok = await tryClipboard(txt);
    if (!ok) setCopyModal(txt); // both methods failed — show manual copy modal
  }, [buildTicketText]);

  const handlePrint = useCallback(() => {
    const doneSorted = nodes.filter(n=>statuses[n.id]==='done')
      .sort((a,b)=>(timers[a.id]||0)-(timers[b.id]||0));
    const skippedNodes = nodes.filter(n=>statuses[n.id]==='skipped');
    const el = sessionStart ? Math.floor((Date.now()-sessionStart)/60000) : 0;
    const rows = [
      ...doneSorted.map(n=>`<tr><td style="color:#15803d">✓ Done</td><td>${n.label}</td><td>${fmtMin(n.expMinutes)}</td></tr>`),
      ...skippedNodes.map(n=>`<tr><td style="color:#94a3b8">↷ Skipped</td><td>${n.label}<br><small style="color:#94a3b8">${bypassReasons[n.id]||''}</small></td><td>${fmtMin(n.expMinutes)}</td></tr>`),
    ].join('');
    const logRows = sessionLog.map(e=>`<tr><td style="color:#94a3b8;white-space:nowrap">${tsStr(e.ts)}</td><td>${e.t}</td></tr>`).join('');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<title>GitHub Workflow Session — ${new Date().toLocaleDateString()}</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;padding:0 24px;color:#1e293b}
  h1{font-size:20px;border-bottom:2px solid #f59e0b;padding-bottom:8px}
  h2{font-size:14px;color:#64748b;text-transform:uppercase;letter-spacing:.04em;margin-top:28px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  td{padding:7px 10px;border-bottom:1px solid #e2e8f0;vertical-align:top}
  .meta{color:#64748b;font-size:12px;margin-bottom:24px}
  @media print{body{margin:20px}}
</style></head><body>
<h1>GitHub Contribution Session</h1>
<p class="meta">Date: ${new Date().toLocaleString()} &nbsp;·&nbsp; Duration: ${el} min</p>
<h2>Steps (${doneSorted.length} completed, ${skippedNodes.length} skipped)</h2>
<table>${rows||'<tr><td colspan="3" style="color:#94a3b8">No steps completed</td></tr>'}</table>
<h2>Session Log</h2>
<table>${logRows||'<tr><td colspan="2" style="color:#94a3b8">No log entries</td></tr>'}</table>
</body></html>`;
    downloadHTML(html, `github-session-${Date.now()}.html`);
  }, [nodes, statuses, timers, bypassReasons, sessionStart, sessionLog]);
  const handleReset = useCallback(() => {
    if (!confirm('Reset all progress? This cannot be undone.')) return;
    setStatuses({}); setTimers({}); setNotes({}); setSessionLog([]);
    setSessionStart(null); setChat({}); setQcState({}); setBypassReasons({});
    setNodes(NODES_DEF); setEdges(EDGES_DEF); setSelected(null);
    addLog('Session reset');
  }, [addLog]);

  // ── SESSION START / STOP ──────────────────────────────────────────
  const startSession = useCallback(() => {
    setSessionStart(Date.now());
    addLog('Session started');
  }, [addLog]);

  const stopSession = useCallback(() => {
    setSessionStart(null);
    addLog('Session stopped');
  }, [addLog]);

  // ── RENDER ───────────────────────────────────────────────────────
  const elapsed  = sessionStart ? now-sessionStart : 0;
  const doneCount = nodes.filter(n=>statuses[n.id]==='done').length;
  const pct = Math.round((doneCount/nodes.length)*100);

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',fontFamily:'system-ui',overflow:'hidden',background:'#f8fafc'}}>

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div style={{height:52,background:PRI,display:'flex',alignItems:'center',
                   padding:'0 16px',gap:12,flexShrink:0,boxShadow:'0 1px 4px rgba(0,0,0,0.2)'}}>
        {/* Title */}
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="white" opacity={0.9}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <span style={{color:'white',fontWeight:700,fontSize:14,letterSpacing:'.01em'}}>
            GitHub Contribution Workflow
          </span>
        </div>

        {/* Progress pill */}
        <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.1)',
                     padding:'4px 12px',borderRadius:16}}>
          <div style={{width:60,height:5,background:'rgba(255,255,255,.2)',borderRadius:3,overflow:'hidden'}}>
            <div style={{width:`${pct}%`,height:'100%',background:ACC,transition:'width .4s'}}/>
          </div>
          <span style={{fontSize:11,color:'rgba(255,255,255,.85)'}}>{pct}%</span>
        </div>

        {/* Timer */}
        {sessionStart ? (
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{fontSize:12,color:ACC,fontFamily:'monospace',letterSpacing:1,fontWeight:700}}>
              ⏱ {fmtMs(elapsed)}
            </div>
            <button onClick={stopSession}
              style={{padding:'3px 8px',background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',
                      border:'1px solid rgba(255,255,255,.15)',borderRadius:5,fontSize:10,
                      cursor:'pointer',lineHeight:1}}>
              ⏹
            </button>
          </div>
        ) : (
          <button onClick={startSession}
            style={{padding:'5px 12px',background:ACC,color:'white',border:'none',
                    borderRadius:6,fontSize:11,cursor:'pointer',fontWeight:700}}>
            ▶ Start Session
          </button>
        )}

        <div style={{flex:1}}/>

        {/* Controls */}
        {[
          {lbl: arrangeMode?'✓ Arrange ON':'⊞ Arrange', act:()=>setArrangeMode(v=>!v),
           style:{background:arrangeMode?'rgba(245,158,11,.2)':'rgba(255,255,255,.1)',color:arrangeMode?ACC:'rgba(255,255,255,.8)'}},
          {lbl:'📋 Copy Ticket', act:generateTicket,
           style:{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.8)'}},
          {lbl:'🖨 Print', act:handlePrint,
           style:{background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.8)'}},
          {lbl:'↺ Reset', act:handleReset,
           style:{background:'rgba(220,38,38,.2)',color:'#fca5a5'}},
        ].map(({lbl,act,style},i)=>(
          <button key={i} onClick={act}
            style={{padding:'5px 11px',border:'none',borderRadius:6,fontSize:11,
                    cursor:'pointer',fontWeight:500,...style}}>
            {lbl}
          </button>
        ))}

        {saved&&<span style={{fontSize:10,color:'#86efac',marginLeft:4}}>✓ saved</span>}
      </div>

      {/* ── MAIN AREA ───────────────────────────────────────── */}
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
        <div style={{flex:1,position:'relative',overflow:'hidden',display:'flex',flexDirection:'column'}}
          onDoubleClick={e=>{
            const nid=e.target.closest('[data-nodeid]')?.dataset.nodeid;
            if(nid&&arrangeMode) setLabelModal(nodeMap[nid]);
          }}>
          <Canvas nodes={nodes} edges={edges} statuses={statuses} timers={timers}
                  selected={selected} editMode={arrangeMode} now={now}
                  onSelect={id=>{setSelected(id); if(!['Notes','AI Help'].includes(tab)) setTab('Details');}}
                  onNodeDrag={handleNodeDrag}/>
          {arrangeMode&&(
            <div style={{position:'absolute',top:8,left:50,padding:'5px 12px',
                         background:'rgba(245,158,11,.9)',borderRadius:20,
                         fontSize:11,color:'white',fontWeight:600,pointerEvents:'none'}}>
              ⊞ Arrange Mode — drag nodes · double-click to rename
            </div>
          )}
        </div>

        <RightPanel
          node={selectedNode} nodes={nodes} edges={edges}
          statuses={statuses} timers={timers} sessionLog={sessionLog}
          sessionStart={sessionStart} sessionActive={!!sessionStart} now={now}
          tab={tab} setTab={setTab} notes={notes} setNotes={setNotes}
          chat={chat} setChat={setChat} aiEdit={aiEdit} setAiEdit={setAiEdit}
          qcState={qcState} setQcState={setQcState} bypassReasons={bypassReasons}
          onStatusChange={handleStatusChange} onBypassClick={handleBypassClick}
          onQCOpen={id=>setQcOpen(id)} onApplyChange={handleApplyChange}
          onLogEntry={addLog}/>
      </div>

      {/* ── MODALS ──────────────────────────────────────────── */}
      {copyModal && (
        <CopyModal text={copyModal} onClose={()=>setCopyModal(null)}/>
      )}

      {qcOpen && (() => {
        const n = nodeMap[qcOpen];
        return n ? (
          <QCModal node={n} qcState={qcState} setQcState={setQcState}
            onClose={()=>setQcOpen(null)}
            onPass={()=>handleQCPass(qcOpen)}/>
        ) : null;
      })()}

      {downModal && (
        <DownstreamModal nodeLabel={downModal.nodeLabel} affectedIds={downModal.affected}
          nodeMap={nodeMap} onConfirm={confirmDone} onCancel={()=>setDownModal(null)}/>
      )}

      {bypassModal && (() => {
        const n = nodeMap[bypassModal.nodeId];
        return n ? (
          <BypassModal nodeLabel={n.label}
            onConfirm={reason=>confirmBypass(bypassModal.nodeId, reason)}
            onCancel={()=>setBypassModal(null)}/>
        ) : null;
      })()}

      {labelModal && (
        <LabelEditModal node={labelModal}
          onSave={(label,exp)=>handleLabelSave(labelModal.id,label,exp)}
          onCancel={()=>setLabelModal(null)}/>
      )}

      {/* Print styles */}
      <style>{`
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          button, [data-nodeid] { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
