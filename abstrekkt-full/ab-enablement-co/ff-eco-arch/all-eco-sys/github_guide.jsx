import { useState, useEffect } from "react";

const uid = () => Math.random().toString(36).slice(2, 8);

const DEFAULTS = {
  p1: {
    intro: "Master the web UI loop before moving to Codespaces. Every step works in GitHub's browser — no installs needed.",
    steps: [
      { id:"s1", n:1, name:"Create a repository", sum:"Versioned project container on GitHub's servers", tags:"Foundation",
        tip:"A repo is like a running-config backup that never forgets. Owner field must be set to your ORGANIZATION — not your personal account. Repo name should be lowercase-with-hyphens.",
        aug:"Starting from an existing folder? Create on GitHub first — it shows the exact CLI commands to connect. Always set to Private unless you have an approved reason to go public.",
        pro:"gh repo create via the GitHub CLI skips the web form entirely.",
        warn:"Default to Private on work repos. You cannot undo an accidental credential exposure buried in commit history. Re-check the Owner dropdown before hitting Create." },
      { id:"s2", n:2, name:"Understand repo structure", sum:"Files, history, branches — what lives where", tags:"Mental model",
        tip:"Main branch = running config. Commit history = a changelog you never had to write. The .github/ directory is special — it holds CODEOWNERS, PR templates, issue templates, workflows, and Dependabot config.",
        aug:"Inherited a repo with no README? Check commit history first — shows who touched what even when code is undocumented. The .gitignore file controls what never gets committed (node_modules, .env files, secrets).",
        pro:"Press . (period) on any GitHub repo to open github.dev — lightweight VS Code in the browser, no install.",
        warn:"Some older repos use 'master' instead of 'main'. Identical meaning — GitHub changed the default in 2020." },
      { id:"s3", n:3, name:"Create a branch", sum:"Isolated copy of main where changes happen safely", tags:"Core habit",
        tip:"A branch is a config snapshot before you make changes. Edit the copy, not the running config. Delete the branch if things go wrong — main is completely untouched. This is the core safety mechanism.",
        aug:"Branch naming matters: feature/add-monitoring, fix/acl-typo, docs/update-readme. Clear names make PR history scannable. Short-lived is the goal — long-lived branches = merge conflicts.",
        pro:"Click the branch dropdown, type your new branch name, press Enter. GitHub creates it from main automatically.",
        warn:"Never commit directly to main in a shared repo. Always branch → PR → merge. Direct pushes bypass review entirely and are blocked by branch protection on properly configured repos." },
      { id:"s4", n:4, name:"Edit a file", sum:"Make changes in GitHub's built-in web editor", tags:"Pro shortcut",
        tip:"Click any file in your branch → pencil icon top-right. Sufficient for docs, config files, and small changes. For multi-file editing: press . to open github.dev — full VS Code, still no install.",
        aug:"Need multi-file editing without Codespaces? Press . to open github.dev. It has file explorer, IntelliSense, and source control panel. No terminal, no compute — but full editor.",
        pro:"The . shortcut is the most underused feature on GitHub. Works from any repo page.",
        warn:"Always check the branch selector before editing. If it shows 'main', switch to your branch first. Editing main directly bypasses the entire review process." },
      { id:"s5", n:5, name:"Commit the change", sum:"Named, timestamped snapshot of exactly what changed", tags:"Core habit",
        tip:"A commit = named checkpoint with author, timestamp, and diff. Conventional Commits prefix format: feat: fix: docs: chore: refactor: — makes git log machine-readable and history scannable at a glance.",
        aug:"Committed with a bad message before pushing? Use the '...' menu on the commit to amend in the web editor. In Codespaces: git commit --amend before you push.",
        pro:"Format: `fix: correct VLAN tagging on core-02` — type: description under 72 chars. Body (optional) explains WHY, not what.",
        warn:"Messages like 'Update file' and 'misc changes' are actively harmful to future-you. Write the message you'd want to read in an incident postmortem six months from now." },
      { id:"s6", n:6, name:"Open a pull request", sum:"Propose branch changes for review before merging", tags:"Collaboration",
        tip:"A PR = structured change request with built-in diff view. Fill the PR template completely: What changed / Why (link the issue: Closes #N) / How to test / Risks. CODEOWNERS auto-assigns required reviewers for specific file paths.",
        aug:"GitHub shows a yellow banner after pushing a branch — click it to open the PR. If you miss it: Pull requests tab → New pull request. If PR template doesn't load: copy from .github/pull_request_template.md manually.",
        pro:"Use 'Closes #N' or 'Fixes #N' in the PR body to auto-close the linked issue on merge. Use Draft PRs for work in progress — signals you want feedback before it's production-ready.",
        warn:"Don't wait for 'perfect' to open a PR. Open a Draft PR early. Every section of the PR template must be filled — incomplete templates are the #1 cause of slow review cycles." },
      { id:"s7", n:7, name:"Review and merge", sum:"Validate the diff, approve, merge strategy, cleanup", tags:"Decision point",
        tip:"Files changed tab = side-by-side diff of every line. Merge strategies: Squash merge = all commits become one (most common). Merge commit = preserves full history. Rebase = linear history, no merge bubble. Follow CONTRIBUTING.md for the project's required strategy.",
        aug:"Merge conflict? Click 'Resolve conflicts' in the PR. CODEOWNERS-required reviewers are mandatory — approvals from non-required reviewers don't count. PR stuck 2+ business days → post link in Slack and escalate to team lead.",
        pro:"Click 'Delete branch' immediately after merge — GitHub shows this button right after. Locally: `git checkout main && git pull && git branch -d your-branch-name`.",
        warn:"Required approvals and all CI checks must be green before merging. Check 'X of Y required reviews' in the PR merge box. Branch protection rules shown there tell you exactly what's blocking." },
    ],
  },
  p2: {
    intro: "Codespaces gives you VS Code in the browser backed by a cloud container. GitHub.com is the remote source of truth. Edits stay local until you push.",
    github: [
      { id:"g1", n:"01", name:"Open repo on GitHub.com", tip:"Always your starting point. Navigate to github.com/org/repo-name. Free tier: 60 core-hours/month — track at github.com/settings/billing.", aug:"Don't have the URL? github.com/username lists all repos. Or use the GitHub search bar.", pro:"Bookmark your most-used repos. Set a dotfiles repo at github.com/settings/codespaces to auto-configure every Codespace with your aliases and settings.", warn:"" },
      { id:"g2", n:"02", name:"Launch Codespace", tip:"Green 'Code' button → Codespaces tab → 'New codespace on main'. Provisions full VS Code in ~30s. Nothing installs on your machine.", aug:"Check github.com/codespaces for active sessions. A stopped Codespace resumes with work preserved. First launch takes longer — subsequent starts are fast.", pro:"Use the Codespace from mobile with github.com/codespaces — full editor in any browser, including phone.", warn:"Codespaces time out after 30 minutes idle. Enable auto-save (File → Auto Save) to avoid losing in-progress edits on disconnect." },
      { id:"g7", n:"07", name:"Review pull request", tip:"After pushing from Codespaces, GitHub shows a banner to open a PR. Fill the PR template completely. CODEOWNERS auto-assigns required reviewers. Check Files changed tab before requesting review.", aug:"Changes look wrong after opening the PR? Don't close it. Return to Codespace, edit, commit, push — PR auto-updates with new commits.", pro:"GitHub Actions CI runs automatically after each push. Watch the checks at the bottom of the PR page.", warn:"GitHub Actions stuck or queued? Check githubstatus.com first. Re-run failed jobs from the Actions tab." },
      { id:"g8", n:"08", name:"Merge to main", tip:"All CI checks green + required approvals = ready to merge. Choose merge strategy (check CONTRIBUTING.md). Click 'Delete branch' immediately after merge.", aug:"After merging, return to Codespace. Switch to main (bottom-left selector) and pull: Ctrl+Shift+P → Git: Pull. Codespace is now in sync.", pro:"Post-merge cleanup: delete branch on GitHub, `git checkout main`, `git pull`, `git branch -d your-branch`.", warn:"Merge strategy matters: Squash = cleaner main history. Merge commit = full traceability. Rebase = linear. Never rebase a branch others are actively working on." },
    ],
    codespaces: [
      { id:"c3", n:"03", name:"Create branch", tip:"Bottom-left of VS Code shows current branch. Click it → 'Create new branch'. Pattern: feature/what-you're-doing. You're now on an isolated copy — safe to edit.", aug:"Started editing before creating a branch? Source Control → click branch name at bottom → 'Create branch from'. VS Code offers to carry uncommitted changes.", pro:"Ctrl+Shift+P → Git: Create Branch → type name → Enter. Full keyboard branch creation.", warn:"Check the bottom-left branch name before every session. Starting work on main by accident is the most common first-timer mistake — and the hardest to unwind cleanly." },
      { id:"c4", n:"04", name:"Edit files", tip:"Full VS Code editor. File explorer left, editor center, terminal bottom (Ctrl+`). Open files, edit, save. Extensions, IntelliSense, multi-cursor all available.", aug:"Need a file that doesn't exist? Right-click file explorer → New File. Or Ctrl+N → Ctrl+S to name and save.", pro:"Ctrl+P → fuzzy search to open any file by name. Dramatically faster than navigating the file tree on large repos.", warn:"" },
      { id:"c5", n:"05", name:"Stage changes", tip:"Source Control panel (Ctrl+Shift+G). Changed files under 'Changes'. Click + next to a file to stage it. Click any changed file to see the line-by-line diff — review before staging.", aug:"Accidentally staged something? Click − to unstage. Your edits are preserved — you're just un-selecting it from the commit.", pro:"Click the + at the top of Changes to stage everything at once. Fine for small, focused changesets.", warn:"Don't commit blindly. This is your last review checkpoint before the diff hits the PR. Read the diff in the Source Control panel before staging." },
      { id:"c6", n:"06", name:"Commit and push", tip:"Type commit message in Source Control box → Ctrl+Enter to commit → click sync icon or Ctrl+Shift+P → Git: Push. Commit = local checkpoint. Push = sends to GitHub.", aug:"Push rejected? Someone pushed to the same branch. Pull first: Ctrl+Shift+P → Git: Pull. Resolve any conflicts shown, then push again.", pro:"Conventional Commits: `fix: corrected VLAN tagging on core-02` beats 'misc changes' in team history six months later.", warn:"Until you push, teammates cannot see your work and nothing is backed up to GitHub. Commit + push are two separate actions — don't stop at commit." },
      { id:"c7", n:"→", name:"Open PR from Codespace", tip:"After pushing, a notification appears in VS Code bottom-right: 'Would you like to create a Pull Request?' Click it to open the PR flow without leaving the editor.", aug:"Notification dismissed? Go to github.com/your-repo — a yellow banner prompts you. Or Pull requests tab → New pull request.", pro:"With 'GitHub Pull Requests and Issues' extension installed, create, review, and merge PRs entirely from inside VS Code.", warn:"" },
    ],
  },
  p3: {
    intro: "Concepts this audience will assume they understand — but almost certainly don't. Cover these before the first real session.",
    cards: [
      { id:"u1", c:"Local vs. remote", b:"Your Codespace and GitHub.com are two separate copies of the repo. They drift apart whenever changes happen on either side. Pull syncs GitHub → Codespace. Push syncs Codespace → GitHub. You are always managing two states." },
      { id:"u2", c:"What HEAD means", b:"HEAD is a pointer to the commit you're currently on. Switch branches and HEAD moves. Make a commit and HEAD advances. It's just a bookmark in the history." },
      { id:"u3", c:"What 'origin' means", b:"'Origin' is the default alias for your remote repo on GitHub.com. 'Push to origin' = send this to GitHub. You can have multiple remotes — origin is the convention for the primary one." },
      { id:"u4", c:"The staging area", b:"Between editing and committing is a middle layer: the staging area (also called 'the index'). You choose which changed files to include in each commit. VS Code's + button is the staging action." },
      { id:"u5", c:"Merge vs. rebase", b:"Two ways to integrate changes. Merge preserves full branch history with a merge commit. Rebase replays your commits on top of main for a linear history. For beginners: always merge. Never rebase a branch others are actively using — it rewrites shared history." },
      { id:"u6", c:"Detached HEAD state", b:"If you check out a specific commit instead of a branch name, you enter detached HEAD state. Commits here aren't attached to a branch and can be lost. Fix: git checkout -b new-branch-name." },
      { id:"u7", c:"Git is not GitHub", b:"Git is the version control software. GitHub is a hosting platform that wraps git in a web UI, collaboration features, and automation. You can use git without GitHub." },
      { id:"u8", c:"The .git folder", b:"Every repo has a hidden .git folder storing the entire history, all branches, all commits. Don't touch it manually. This is why you clone rather than just copy files." },
      { id:"u9", c:"CODEOWNERS", b:"A file at .github/CODEOWNERS maps file paths to required reviewers. When a PR touches a covered file, the listed team is auto-requested and their approval becomes mandatory — not optional — for merge to proceed." },
      { id:"u10", c:"Branch protection rules", b:"Settings that prevent anyone (including admins) from pushing directly to main without a PR + review + CI passing. 'Include administrators' must be checked or org owners bypass all rules. This is the most critical repo security setting." },
    ],
  },
  p4: {
    intro: "Run this checklist before every merge. Critical (★) items must pass — no exceptions. Optional (○) items apply where relevant.",
    items: [
      { id:"qc1",  label:"All CI checks are green (passing)",                         critical:true,  checked:false },
      { id:"qc2",  label:"Required approvals received",                               critical:true,  checked:false },
      { id:"qc3",  label:"PR template fully completed — no empty sections",           critical:true,  checked:false },
      { id:"qc4",  label:"Issue linked in PR body (Closes #N or Fixes #N)",           critical:true,  checked:false },
      { id:"qc5",  label:"No secrets or credentials anywhere in the diff",            critical:true,  checked:false },
      { id:"qc6",  label:"Tests written or updated for new/changed behavior",         critical:true,  checked:false },
      { id:"qc7",  label:"Documentation updated if behavior changed",                 critical:false, checked:false },
      { id:"qc8",  label:"CHANGELOG updated (if project requires it)",                critical:false, checked:false },
      { id:"qc9",  label:"Breaking changes documented and version bumped",            critical:false, checked:false },
      { id:"qc10", label:"Screenshots or recordings added for UI changes",            critical:false, checked:false },
    ],
  },
  p5: {
    intro: "One-time setup that makes every future PR safer and faster. Do these in order — each step builds on the previous.",
    steps: [
      { id:"r1", n:1, name:"Protect the main branch", sum:"Prevent direct pushes; require PR + review + CI", tags:"Critical",
        tip:"Repo Settings → Branches → Add branch protection rule. Branch name pattern: main. Enable: Require a pull request before merging. Required approvals: 1 minimum. Enable: Dismiss stale pull request approvals when new commits are pushed.",
        aug:"Enable: Require status checks to pass before merging. Enable: Require branches to be up to date before merging. Then enable: Include administrators. Test it by trying to push directly to main — it should fail.",
        pro:"Test from the CLI: `git checkout main && echo 'test' >> README.md && git commit -am 'test' && git push` — if branch protection is working, GitHub rejects this push.",
        warn:"'Include administrators' must be checked — without it, org owners bypass all rules. This is the most common misconfiguration. Check it. Non-negotiable." },
      { id:"r2", n:2, name:"Add a CODEOWNERS file", sum:"Auto-assign required reviewers by file path", tags:"Setup",
        tip:"Create .github/CODEOWNERS. Syntax: `* @YOUR-ORG/your-team-name` for all files. Maps file patterns to reviewer teams. When a PR touches a covered path, listed owners are auto-requested AND their approval becomes mandatory.",
        aug:"Last matching pattern wins. Use team slugs (@org/team-name) not individuals — teams auto-update as members change. Then go to branch protection rule → enable 'Require review from Code Owners'.",
        pro:"Path-specific owners: `src/ @YOUR-ORG/backend-team` and `.github/ @YOUR-ORG/platform-team` — different teams own different directories.",
        warn:"CODEOWNERS only enforces if branch protection has 'Require review from Code Owners' checked. Creating the file without enabling that rule has no effect on merge requirements." },
      { id:"r3", n:3, name:"Add a PR template", sum:"Auto-populate PR description with required fields", tags:"Setup",
        tip:"Create .github/pull_request_template.md. Auto-populates every new PR. Standard sections: ## What changed / ## Why (Closes #N) / ## How to test / ## Risks. Cuts review back-and-forth in half.",
        aug:"PR template not loading? Copy from .github/pull_request_template.md manually and paste into the PR description. Template only applies to new PRs — it won't appear in existing open PRs.",
        pro:"Add <!-- comment hints --> in the template to guide contributors without cluttering the final description — GitHub renders these invisible in the PR preview.",
        warn:"Every section of the template must be filled. 'N/A' or 'None' is a valid answer — an empty section signals the contributor skipped it." },
      { id:"r4", n:4, name:"Enable secret scanning + push protection", sum:"Block credentials before they hit the repo", tags:"Security",
        tip:"Org Settings → Code security and analysis. Enable: Secret scanning on all repos. Enable: Push protection — blocks commits containing detected secrets at the source, before they reach GitHub.",
        aug:"Custom patterns for internal secret formats (API keys, service tokens) can be added under Org Settings → Code security → Secret scanning → Custom patterns.",
        pro:"Secret scanning detects 200+ secret types including AWS keys, Azure tokens, PATs, and common API keys. Push protection is the important one — it stops at commit, not after.",
        warn:"Push protection blocks the commit. If a secret was already committed: remove from code immediately, rotate the credential externally, then use `git rebase -i` to scrub the commit history." },
      { id:"r5", n:5, name:"Configure Dependabot", sum:"Automated PRs for dependency and action version updates", tags:"Security",
        tip:"Create .github/dependabot.yml. Dependabot opens automatic PRs when dependencies have security updates or new versions. Also handles GitHub Actions version pins — critical for supply chain security.",
        aug:"Dependabot PRs can be noisy on large dependency graphs. Use the `groups` field to batch related updates. Set `schedule.interval: weekly` to avoid daily PR flood.",
        pro:"Actions pinned to @main or @latest are a supply-chain risk — a compromised action update could silently exfiltrate tokens. Always pin to exact commit SHA or version tag.",
        warn:"Never use @main or @latest for GitHub Actions in workflows. SHA-pinning is the most secure. Exact version tag (@v4.2.0) is acceptable. Add Dependabot for github-actions package ecosystem to keep pins current." },
    ],
    fixes: [
      { id:"f1", trigger:"CI lint failure",         fix:"Run lint locally with --fix flag first: `npm run lint`, `flake8`, `gofmt -w`. Fix errors, commit, push." },
      { id:"f2", trigger:"CI test failure",         fix:"Reproduce locally before pushing: `npm test`, `pytest`, `go test ./...`. Read 'expected X, received Y' — that's your answer." },
      { id:"f3", trigger:"PR template incomplete",  fix:"Every section must be filled. 'N/A' is acceptable — blank is not. Copy from .github/pull_request_template.md if it doesn't auto-load." },
      { id:"f4", trigger:"Merge conflict",          fix:"`git pull --rebase origin main` → resolve conflicts shown → push. In VS Code: Source Control panel highlights conflicts with Accept Current / Accept Incoming options." },
      { id:"f5", trigger:"Missing reviewer",        fix:"Check .github/CODEOWNERS for required owners. Also assign manually from PR sidebar → Reviewers → gear icon." },
      { id:"f6", trigger:"Secret committed in diff",fix:"Remove from code immediately. Rotate the credential externally — assume it's compromised. Use `git rebase -i` to scrub from history, force-push, then rotate the secret." },
      { id:"f7", trigger:"Branch protection blocking merge", fix:"PR merge box shows exactly which rule is blocking. Repo Settings → Branches → check required rules. Most common: missing approval or failing CI check." },
      { id:"f8", trigger:"Actions stuck or queued", fix:"Check githubstatus.com first. If GitHub is up: Actions tab → failed run → Re-run all jobs." },
    ],
    escalations: [
      { id:"e1", issue:"Architecture or design dispute",      route:"Senior engineer / Tech Lead" },
      { id:"e2", issue:"Security vulnerability discovered",   route:"SECURITY.md contact — PRIVATE, never open a public issue" },
      { id:"e3", issue:"CI infrastructure broken",            route:"DevOps / Platform team" },
      { id:"e4", issue:"Repo permissions issue",              route:"GitHub org admin" },
      { id:"e5", issue:"PR stuck without review 2+ days",     route:"Team lead / maintainer — post link in Slack with context" },
    ],
  },
};

// ─── Shared ───────────────────────────────────────────────────────────────────
const bStyle = (v="neutral",ex={}) => ({
  padding:"5px 11px", fontSize:12, borderRadius:"var(--border-radius-md)", cursor:"pointer",
  fontFamily:"var(--font-sans)", lineHeight:1.4,
  background: v==="info"?"var(--color-background-info)":"none",
  color: v==="info"?"var(--color-text-info)":v==="danger"?"var(--color-text-danger)":"var(--color-text-secondary)",
  border: v==="info"?"0.5px solid var(--color-border-info)":v==="danger"?"0.5px solid var(--color-border-danger)":"0.5px solid var(--color-border-tertiary)",
  ...ex,
});

function EP({ form, setForm, fields, onSave, onCancel, onDelete }) {
  return (
    <div>
      {fields.map(f => (
        <div key={f.key} style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>{f.label}</div>
          {f.rows>1
            ? <textarea value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} rows={f.rows} style={{width:"100%",resize:"vertical",padding:"7px 9px",fontSize:13,lineHeight:1.55,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",boxSizing:"border-box"}}/>
            : <input value={form[f.key]||""} onChange={e=>setForm({...form,[f.key]:e.target.value})} style={{width:"100%",padding:"7px 9px",fontSize:13,borderRadius:"var(--border-radius-md)",border:"0.5px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",fontFamily:"var(--font-sans)",boxSizing:"border-box"}}/>
          }
        </div>
      ))}
      <div style={{display:"flex",gap:6,marginTop:14,alignItems:"center"}}>
        <button onClick={onSave} style={bStyle("info")}>Save</button>
        <button onClick={onCancel} style={bStyle()}>Discard</button>
        {onDelete && <button onClick={onDelete} style={bStyle("danger",{marginLeft:"auto"})}>Delete</button>}
      </div>
    </div>
  );
}

function Ann({ label, text, type }) {
  if (!text) return null;
  const c = { tip:{bg:"var(--color-background-info)",bl:"var(--color-border-info)",lc:"var(--color-text-info)"}, aug:{bg:"var(--color-background-secondary)",bl:"var(--color-border-secondary)",lc:"var(--color-text-secondary)"}, pro:{bg:"var(--color-background-success)",bl:"var(--color-border-success)",lc:"var(--color-text-success)"}, warn:{bg:"var(--color-background-warning)",bl:"var(--color-border-warning)",lc:"var(--color-text-warning)"} }[type]||{bg:"var(--color-background-secondary)",bl:"var(--color-border-secondary)",lc:"var(--color-text-secondary)"};
  const html = text.replace(/`([^`]+)`/g,'<code style="font-family:var(--font-mono);font-size:11.5px;background:rgba(128,128,128,0.12);padding:1px 4px;border-radius:3px">$1</code>');
  return (
    <div style={{background:c.bg,borderLeft:`2px solid ${c.bl}`,borderRadius:"0 var(--border-radius-md) var(--border-radius-md) 0",padding:"9px 11px",marginBottom:6}}>
      <div style={{fontSize:10,fontWeight:500,color:c.lc,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>
      <div style={{fontSize:13,lineHeight:1.65,color:"var(--color-text-primary)"}} dangerouslySetInnerHTML={{__html:html}}/>
    </div>
  );
}

function Toast({msg}){if(!msg)return null;return <div style={{background:"var(--color-background-success)",color:"var(--color-text-success)",border:"0.5px solid var(--color-border-success)",borderRadius:"var(--border-radius-md)",padding:"8px 13px",fontSize:13,marginBottom:12}}>{msg}</div>;}

const STEP_F = [{key:"name",label:"Step name",rows:1},{key:"sum",label:"Summary",rows:1},{key:"tags",label:"Tag",rows:1},{key:"tip",label:"Why this matters",rows:3},{key:"aug",label:"When it goes sideways",rows:3},{key:"pro",label:"Pro move",rows:2},{key:"warn",label:"Common mistake",rows:2}];
const NODE_F = [{key:"n",label:"Step #",rows:1},{key:"name",label:"Node name",rows:1},{key:"tip",label:"Why this matters",rows:3},{key:"aug",label:"When it goes sideways",rows:3},{key:"pro",label:"Pro move",rows:2},{key:"warn",label:"Common mistake",rows:2}];
const CARD_F = [{key:"c",label:"Concept name",rows:1},{key:"b",label:"Explanation",rows:4}];
const FIX_F  = [{key:"trigger",label:"Trigger",rows:1},{key:"fix",label:"Fix",rows:2}];
const ESC_F  = [{key:"issue",label:"Issue / situation",rows:1},{key:"route",label:"Who to contact",rows:1}];

export default function App() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [selNode, setSelNode] = useState(null);
  const [editNodeId, setEditNodeId] = useState(null);
  const [editNodeForm, setEditNodeForm] = useState({});
  const [editInlineId, setEditInlineId] = useState(null);
  const [editInlineForm, setEditInlineForm] = useState({});
  const [toast, setToast] = useState("");

  useEffect(() => {
    (async () => {
      try { const r=await window.storage.get("ghg_v4"); setData(r?JSON.parse(r.value):JSON.parse(JSON.stringify(DEFAULTS))); }
      catch { setData(JSON.parse(JSON.stringify(DEFAULTS))); }
    })();
  }, []);

  const persist = async d => { setData(d); try{await window.storage.set("ghg_v4",JSON.stringify(d));}catch{} };
  const flash = msg => { setToast(msg); setTimeout(()=>setToast(""),2200); };
  const clearEdit = () => { setEditId(null); setOpenId(null); setSelNode(null); setEditNodeId(null); setEditInlineId(null); };

  if (!data) return <div style={{padding:24,fontSize:14,color:"var(--color-text-secondary)"}}>Loading…</div>;

  // P1
  const startEditStep = s => { if(editId===s.id){setEditId(null);return;} setEditId(s.id);setEditForm({...s});setOpenId(s.id); };
  const saveStep = () => { persist({...data,p1:{...data.p1,steps:data.p1.steps.map(s=>s.id===editId?{...s,...editForm}:s)}}); setEditId(null);flash("Saved"); };
  const delStep = id => { persist({...data,p1:{...data.p1,steps:data.p1.steps.filter(s=>s.id!==id)}}); setOpenId(null);setEditId(null); };
  const addStep = () => { const ns={id:uid(),n:data.p1.steps.length+1,name:"New step",sum:"",tags:"",tip:"",aug:"",pro:"",warn:""}; persist({...data,p1:{...data.p1,steps:[...data.p1.steps,ns]}}); setOpenId(ns.id);setEditId(ns.id);setEditForm({...ns}); };

  // P2
  const saveNode = lane => { persist({...data,p2:{...data.p2,[lane]:data.p2[lane].map(n=>n.id===editNodeId?{...n,...editNodeForm}:n)}}); setSelNode({...selNode,...editNodeForm});setEditNodeId(null);flash("Saved"); };
  const delNode = (lane,id) => { persist({...data,p2:{...data.p2,[lane]:data.p2[lane].filter(n=>n.id!==id)}}); setSelNode(null);setEditNodeId(null); };
  const addNode = lane => { const nn={id:uid(),n:"?",name:"New node",tip:"",aug:"",pro:"",warn:""}; persist({...data,p2:{...data.p2,[lane]:[...data.p2[lane],nn]}}); setSelNode({...nn,lane});setEditNodeId(nn.id);setEditNodeForm({...nn}); };

  // P3
  const saveCard = () => { persist({...data,p3:{...data.p3,cards:data.p3.cards.map(c=>c.id===editId?{...c,...editForm}:c)}}); setEditId(null);flash("Saved"); };
  const delCard = id => { persist({...data,p3:{...data.p3,cards:data.p3.cards.filter(c=>c.id!==id)}}); setEditId(null); };
  const addCard = () => { const nc={id:uid(),c:"New concept",b:"Description."}; persist({...data,p3:{...data.p3,cards:[...data.p3.cards,nc]}}); setEditId(nc.id);setEditForm({...nc}); };

  // P4
  const toggleQC = id => persist({...data,p4:{...data.p4,items:data.p4.items.map(i=>i.id===id?{...i,checked:!i.checked}:i)}});
  const resetQC = () => { persist({...data,p4:{...data.p4,items:data.p4.items.map(i=>({...i,checked:false}))}}); flash("Checklist reset"); };
  const critItems = data.p4.items.filter(i=>i.critical);
  const optItems  = data.p4.items.filter(i=>!i.critical);
  const critDone  = critItems.filter(i=>i.checked).length;
  const allCrit   = critDone===critItems.length;

  // P5
  const saveRepoStep = () => { persist({...data,p5:{...data.p5,steps:data.p5.steps.map(s=>s.id===editId?{...s,...editForm}:s)}}); setEditId(null);flash("Saved"); };
  const delRepoStep = id => { persist({...data,p5:{...data.p5,steps:data.p5.steps.filter(s=>s.id!==id)}}); setEditId(null); };
  const addRepoStep = () => { const ns={id:uid(),n:data.p5.steps.length+1,name:"New step",sum:"",tags:"",tip:"",aug:"",pro:"",warn:""}; persist({...data,p5:{...data.p5,steps:[...data.p5.steps,ns]}}); setOpenId(ns.id);setEditId(ns.id);setEditForm({...ns}); };
  const saveInline = key => { persist({...data,p5:{...data.p5,[key]:data.p5[key].map(i=>i.id===editInlineId?{...i,...editInlineForm}:i)}}); setEditInlineId(null);flash("Saved"); };
  const delInline = (key,id) => { persist({...data,p5:{...data.p5,[key]:data.p5[key].filter(i=>i.id!==id)}}); setEditInlineId(null); };

  // Global
  const exportJSON = () => { const t=JSON.stringify(data,null,2); navigator.clipboard.writeText(t).then(()=>flash("JSON copied")).catch(()=>flash("Logged to console")); console.log(t); };
  const reset = () => { persist(JSON.parse(JSON.stringify(DEFAULTS))); clearEdit(); flash("Reset to defaults"); };

  const TABS = ["Phase 1 — Web UI","Phase 2 — Codespaces","Phase 3 — Unknowns","Phase 4 — QC Gate","Phase 5 — Repo Setup"];

  // Reusable accordion
  const Accordion = ({ s, onToggle, onEditS, onSaveS, onCancelS, onDelS, fields }) => {
    const isOpen = openId===s.id, isEdit = editId===s.id;
    return (
      <div style={{border:`0.5px solid ${isEdit?"var(--color-border-info)":isOpen?"var(--color-border-secondary)":"var(--color-border-tertiary)"}`,borderRadius:"var(--border-radius-md)",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"var(--color-background-primary)",cursor:"pointer"}} onClick={()=>!isEdit&&onToggle(s.id,isOpen)}>
          <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500,background:isOpen?"var(--color-background-info)":"var(--color-background-secondary)",border:`0.5px solid ${isOpen?"var(--color-border-info)":"var(--color-border-tertiary)"}`,color:isOpen?"var(--color-text-info)":"var(--color-text-secondary)"}}>{s.n}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:1}}>{s.name}</div>
            <div style={{fontSize:12,color:"var(--color-text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.sum}</div>
          </div>
          {s.tags&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:100,border:"0.5px solid var(--color-border-info)",color:"var(--color-text-info)",flexShrink:0,whiteSpace:"nowrap"}}>{s.tags}</span>}
          <div onClick={e=>e.stopPropagation()} style={{display:"flex",gap:4,flexShrink:0}}>
            <button onClick={()=>onEditS(s)} style={bStyle()}>{isEdit?"Cancel":"Edit"}</button>
          </div>
          <svg style={{width:14,height:14,color:"var(--color-text-secondary)",flexShrink:0,transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s"}} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6l4 4 4-4"/></svg>
        </div>
        {isOpen&&!isEdit&&(
          <div style={{padding:"10px 12px 12px",background:"var(--color-background-secondary)",borderTop:"0.5px solid var(--color-border-tertiary)"}}>
            <Ann label="Why this matters" text={s.tip} type="tip"/>
            <Ann label="When it goes sideways" text={s.aug} type="aug"/>
            <Ann label="Pro move" text={s.pro} type="pro"/>
            <Ann label="Common mistake" text={s.warn} type="warn"/>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}><button onClick={()=>onDelS(s.id)} style={bStyle("danger")}>Delete step</button></div>
          </div>
        )}
        {isEdit&&(
          <div style={{padding:12,background:"var(--color-background-secondary)",borderTop:"0.5px solid var(--color-border-info)"}}>
            <EP form={editForm} setForm={setEditForm} fields={fields} onSave={onSaveS} onCancel={onCancelS} onDelete={()=>onDelS(s.id)}/>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{fontFamily:"var(--font-sans)",paddingBottom:48}}>

      {/* Toolbar */}
      <div style={{display:"flex",alignItems:"center",gap:4,paddingBottom:12,borderBottom:"0.5px solid var(--color-border-tertiary)",marginBottom:16,flexWrap:"wrap"}}>
        {TABS.map((t,i)=>(
          <button key={i} onClick={()=>{setTab(i);clearEdit();}}
            style={{padding:"6px 11px",fontSize:12,borderRadius:"var(--border-radius-md)",cursor:"pointer",fontFamily:"var(--font-sans)",fontWeight:tab===i?500:400,border:`0.5px solid ${tab===i?"var(--color-border-info)":"var(--color-border-tertiary)"}`,background:tab===i?"var(--color-background-info)":"none",color:tab===i?"var(--color-text-info)":"var(--color-text-secondary)"}}>
            {t}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:5}}>
          <button onClick={exportJSON} style={bStyle()}>Export JSON</button>
          <button onClick={reset} style={bStyle("danger")}>Reset</button>
        </div>
      </div>

      <Toast msg={toast}/>

      {/* ── P1 ── */}
      {tab===0&&(
        <div>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.65,marginBottom:14}}>{data.p1.intro}</p>
          <div style={{display:"flex",flexDirection:"column",gap:3}}>
            {data.p1.steps.map(s=>(
              <Accordion key={s.id} s={s}
                onToggle={(id,isOpen)=>setOpenId(isOpen?null:id)}
                onEditS={startEditStep} onSaveS={saveStep} onCancelS={()=>setEditId(null)} onDelS={delStep} fields={STEP_F}/>
            ))}
          </div>
          <button onClick={addStep} style={{marginTop:10,width:"100%",padding:10,fontSize:13,borderRadius:"var(--border-radius-md)",border:"0.5px dashed var(--color-border-secondary)",background:"none",color:"var(--color-text-secondary)",cursor:"pointer",fontFamily:"var(--font-sans)"}}>+ Add step</button>
        </div>
      )}

      {/* ── P2 ── */}
      {tab===1&&(
        <div>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.65,marginBottom:14}}>{data.p2.intro}</p>
          {[{key:"github",label:"GitHub.com — remote repository, source of truth",dot:"var(--color-text-info)"},{key:"codespaces",label:"Codespaces — cloud editor, ephemeral dev environment",dot:"var(--color-text-success)"}].map(lane=>(
            <div key={lane.key} style={{marginBottom:10,border:"0.5px solid var(--color-border-tertiary)",borderRadius:"var(--border-radius-lg)",overflow:"hidden"}}>
              <div style={{padding:"8px 13px",background:"var(--color-background-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)",display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:500,color:"var(--color-text-secondary)"}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:lane.dot,flexShrink:0}}/> {lane.label}
                <button onClick={()=>addNode(lane.key)} style={{...bStyle(),marginLeft:"auto",fontSize:11}}>+ Add node</button>
              </div>
              <div style={{display:"flex",alignItems:"center",padding:"12px 14px",overflowX:"auto",gap:0,background:"var(--color-background-primary)"}}>
                {data.p2[lane.key].map((node,i)=>{
                  const isSel=selNode&&selNode.id===node.id;
                  return (
                    <div key={node.id} style={{display:"flex",alignItems:"center",flexShrink:0}}>
                      <div onClick={()=>{isSel?setSelNode(null):setSelNode({...node,lane:lane.key});setEditNodeId(null);}}
                        style={{flexShrink:0,background:isSel?"var(--color-background-info)":"var(--color-background-secondary)",border:`0.5px solid ${isSel?"var(--color-border-info)":"var(--color-border-tertiary)"}`,borderRadius:"var(--border-radius-md)",padding:"8px 11px",minWidth:108,cursor:"pointer",transition:"all .15s"}}>
                        <div style={{fontSize:10,color:"var(--color-text-tertiary)",marginBottom:3}}>Step {node.n}</div>
                        <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-primary)",lineHeight:1.3}}>{node.name}</div>
                      </div>
                      {i<data.p2[lane.key].length-1&&<div style={{display:"flex",alignItems:"center",padding:"0 4px",flexShrink:0}}><div style={{height:1,width:12,background:"var(--color-border-secondary)"}}/><svg width="5" height="9" viewBox="0 0 5 9" fill="none"><path d="M1 1l3 3.5L1 8" stroke="var(--color-border-secondary)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{fontSize:12,color:"var(--color-text-tertiary)",textAlign:"center",margin:"0 0 10px"}}>Codespace syncs from GitHub.com · edits stay local · push sends back to GitHub</div>
          {selNode&&(
            <div style={{border:"0.5px solid var(--color-border-info)",borderRadius:"var(--border-radius-lg)",padding:14,background:"var(--color-background-secondary)"}}>
              {editNodeId!==selNode.id?(
                <>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                    <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",flex:1}}>Step {selNode.n} — {selNode.name}</div>
                    <button onClick={()=>{setEditNodeId(selNode.id);setEditNodeForm({...selNode});}} style={bStyle()}>Edit</button>
                    <button onClick={()=>delNode(selNode.lane,selNode.id)} style={bStyle("danger")}>Delete</button>
                  </div>
                  <Ann label="Why this matters" text={selNode.tip} type="tip"/>
                  <Ann label="When it goes sideways" text={selNode.aug} type="aug"/>
                  <Ann label="Pro move" text={selNode.pro} type="pro"/>
                  <Ann label="Common mistake" text={selNode.warn} type="warn"/>
                </>
              ):(
                <>
                  <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:12}}>Editing — {selNode.name}</div>
                  <EP form={editNodeForm} setForm={setEditNodeForm} fields={NODE_F} onSave={()=>saveNode(selNode.lane)} onCancel={()=>setEditNodeId(null)} onDelete={null}/>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── P3 ── */}
      {tab===2&&(
        <div>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.65,marginBottom:14}}>{data.p3.intro}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
            {data.p3.cards.map(card=>{
              const isEdit=editId===card.id;
              return (
                <div key={card.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderLeft:`2px solid ${isEdit?"var(--color-border-info)":"var(--color-border-warning)"}`,borderRadius:"var(--border-radius-lg)",padding:"12px 13px"}}>
                  {!isEdit?(
                    <>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:7}}>
                        <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-warning)",lineHeight:1.3}}>{card.c}</div>
                        <div style={{display:"flex",gap:3,flexShrink:0}}>
                          <button onClick={()=>{setEditId(card.id);setEditForm({...card});}} style={{...bStyle(),padding:"3px 7px",fontSize:11}}>Edit</button>
                          <button onClick={()=>delCard(card.id)} style={{...bStyle("danger"),padding:"3px 7px",fontSize:11}}>×</button>
                        </div>
                      </div>
                      <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.65}}>{card.b}</div>
                    </>
                  ):(
                    <EP form={editForm} setForm={setEditForm} fields={CARD_F} onSave={saveCard} onCancel={()=>setEditId(null)} onDelete={()=>delCard(card.id)}/>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={addCard} style={{marginTop:10,width:"100%",padding:10,fontSize:13,borderRadius:"var(--border-radius-md)",border:"0.5px dashed var(--color-border-secondary)",background:"none",color:"var(--color-text-secondary)",cursor:"pointer",fontFamily:"var(--font-sans)"}}>+ Add concept</button>
        </div>
      )}

      {/* ── P4 QC Gate ── */}
      {tab===3&&(
        <div>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.65,marginBottom:16}}>{data.p4.intro}</p>
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--color-text-secondary)",marginBottom:6}}>
              <span>Critical: {critDone} / {critItems.length}</span>
              <span style={{color:allCrit?"var(--color-text-success)":"var(--color-text-secondary)",fontWeight:allCrit?500:400}}>{allCrit?"Ready to merge":`${critItems.length-critDone} blocking`}</span>
            </div>
            <div style={{height:4,background:"var(--color-background-secondary)",borderRadius:2,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(critDone/critItems.length)*100}%`,background:allCrit?"var(--color-text-success)":"var(--color-text-info)",borderRadius:2,transition:"width .3s"}}/>
            </div>
          </div>
          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Critical — must pass</div>
          <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:16}}>
            {critItems.map(item=>(
              <div key={item.id} onClick={()=>toggleQC(item.id)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:`0.5px solid ${item.checked?"var(--color-border-success)":"var(--color-border-tertiary)"}`,borderRadius:"var(--border-radius-md)",cursor:"pointer",background:item.checked?"var(--color-background-success)":"var(--color-background-primary)",transition:"all .15s"}}>
                <div style={{width:18,height:18,borderRadius:4,flexShrink:0,border:`1.5px solid ${item.checked?"var(--color-text-success)":"var(--color-border-secondary)"}`,background:item.checked?"var(--color-background-success)":"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {item.checked&&<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="var(--color-text-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{fontSize:11,fontWeight:500,color:item.checked?"var(--color-text-success)":"var(--color-text-danger)",marginRight:2,flexShrink:0}}>★</span>
                <span style={{fontSize:13,color:item.checked?"var(--color-text-success)":"var(--color-text-primary)",flex:1,textDecoration:item.checked?"line-through":"none",lineHeight:1.4}}>{item.label}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Optional — apply where relevant</div>
          <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:20}}>
            {optItems.map(item=>(
              <div key={item.id} onClick={()=>toggleQC(item.id)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:`0.5px solid ${item.checked?"var(--color-border-success)":"var(--color-border-tertiary)"}`,borderRadius:"var(--border-radius-md)",cursor:"pointer",background:item.checked?"var(--color-background-success)":"var(--color-background-secondary)",transition:"all .15s"}}>
                <div style={{width:18,height:18,borderRadius:4,flexShrink:0,border:`1.5px solid ${item.checked?"var(--color-text-success)":"var(--color-border-secondary)"}`,background:item.checked?"var(--color-background-success)":"none",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {item.checked&&<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="var(--color-text-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{fontSize:11,color:"var(--color-text-tertiary)",marginRight:2,flexShrink:0}}>○</span>
                <span style={{fontSize:13,color:item.checked?"var(--color-text-success)":"var(--color-text-primary)",flex:1,textDecoration:item.checked?"line-through":"none",lineHeight:1.4}}>{item.label}</span>
              </div>
            ))}
          </div>
          <button onClick={resetQC} style={{...bStyle(),width:"100%",padding:9,fontSize:13,textAlign:"center"}}>Reset checklist for next PR</button>
        </div>
      )}

      {/* ── P5 Repo Setup ── */}
      {tab===4&&(
        <div>
          <p style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.65,marginBottom:14}}>{data.p5.intro}</p>
          <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:24}}>
            {data.p5.steps.map(s=>(
              <Accordion key={s.id} s={s}
                onToggle={(id,isOpen)=>setOpenId(isOpen?null:id)}
                onEditS={s=>{ if(editId===s.id){setEditId(null);return;} setEditId(s.id);setEditForm({...s});setOpenId(s.id); }}
                onSaveS={saveRepoStep} onCancelS={()=>setEditId(null)} onDelS={delRepoStep} fields={STEP_F}/>
            ))}
          </div>
          <button onClick={addRepoStep} style={{marginBottom:28,width:"100%",padding:10,fontSize:13,borderRadius:"var(--border-radius-md)",border:"0.5px dashed var(--color-border-secondary)",background:"none",color:"var(--color-text-secondary)",cursor:"pointer",fontFamily:"var(--font-sans)"}}>+ Add setup step</button>

          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>CI fix quick reference</div>
          <div style={{display:"flex",flexDirection:"column",gap:2,marginBottom:24}}>
            {data.p5.fixes.map(f=>{
              const isE=editInlineId===f.id;
              return (
                <div key={f.id} style={{border:`0.5px solid ${isE?"var(--color-border-info)":"var(--color-border-tertiary)"}`,borderRadius:"var(--border-radius-md)",overflow:"hidden"}}>
                  {!isE?(
                    <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 12px",background:"var(--color-background-primary)"}}>
                      <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-warning)",minWidth:170,flexShrink:0,paddingTop:1}}>{f.trigger}</div>
                      <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.55,flex:1}} dangerouslySetInnerHTML={{__html:f.fix.replace(/`([^`]+)`/g,'<code style="font-family:var(--font-mono);font-size:11px;background:rgba(128,128,128,0.12);padding:1px 4px;border-radius:3px">$1</code>')}}/>
                      <div style={{display:"flex",gap:3,flexShrink:0}}>
                        <button onClick={()=>{setEditInlineId(f.id);setEditInlineForm({...f});}} style={{...bStyle(),padding:"3px 7px",fontSize:11}}>Edit</button>
                        <button onClick={()=>delInline("fixes",f.id)} style={{...bStyle("danger"),padding:"3px 7px",fontSize:11}}>×</button>
                      </div>
                    </div>
                  ):(
                    <div style={{padding:10,background:"var(--color-background-secondary)"}}>
                      <EP form={editInlineForm} setForm={setEditInlineForm} fields={FIX_F} onSave={()=>saveInline("fixes")} onCancel={()=>setEditInlineId(null)} onDelete={()=>delInline("fixes",f.id)}/>
                    </div>
                  )}
                </div>
              );
            })}
            <button onClick={()=>{const nf={id:uid(),trigger:"New trigger",fix:"Fix steps here."};persist({...data,p5:{...data.p5,fixes:[...data.p5.fixes,nf]}});setEditInlineId(nf.id);setEditInlineForm({...nf});}}
              style={{marginTop:4,width:"100%",padding:8,fontSize:12,borderRadius:"var(--border-radius-md)",border:"0.5px dashed var(--color-border-secondary)",background:"none",color:"var(--color-text-secondary)",cursor:"pointer",fontFamily:"var(--font-sans)"}}>+ Add fix</button>
          </div>

          <div style={{fontSize:12,fontWeight:500,color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Escalation routing</div>
          <div style={{display:"flex",flexDirection:"column",gap:2}}>
            {data.p5.escalations.map(e=>{
              const isE=editInlineId===e.id;
              return (
                <div key={e.id} style={{border:`0.5px solid ${isE?"var(--color-border-info)":"var(--color-border-tertiary)"}`,borderRadius:"var(--border-radius-md)",overflow:"hidden"}}>
                  {!isE?(
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:"var(--color-background-primary)"}}>
                      <div style={{fontSize:13,color:"var(--color-text-primary)",flex:1}}>{e.issue}</div>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{color:"var(--color-text-tertiary)",flexShrink:0}}><path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <div style={{fontSize:13,fontWeight:500,color:"var(--color-text-info)",flex:1.2}}>{e.route}</div>
                      <div style={{display:"flex",gap:3,flexShrink:0}}>
                        <button onClick={()=>{setEditInlineId(e.id);setEditInlineForm({...e});}} style={{...bStyle(),padding:"3px 7px",fontSize:11}}>Edit</button>
                        <button onClick={()=>delInline("escalations",e.id)} style={{...bStyle("danger"),padding:"3px 7px",fontSize:11}}>×</button>
                      </div>
                    </div>
                  ):(
                    <div style={{padding:10,background:"var(--color-background-secondary)"}}>
                      <EP form={editInlineForm} setForm={setEditInlineForm} fields={ESC_F} onSave={()=>saveInline("escalations")} onCancel={()=>setEditInlineId(null)} onDelete={()=>delInline("escalations",e.id)}/>
                    </div>
                  )}
                </div>
              );
            })}
            <button onClick={()=>{const ne={id:uid(),issue:"New situation",route:"Who to contact"};persist({...data,p5:{...data.p5,escalations:[...data.p5.escalations,ne]}});setEditInlineId(ne.id);setEditInlineForm({...ne});}}
              style={{marginTop:4,width:"100%",padding:8,fontSize:12,borderRadius:"var(--border-radius-md)",border:"0.5px dashed var(--color-border-secondary)",background:"none",color:"var(--color-text-secondary)",cursor:"pointer",fontFamily:"var(--font-sans)"}}>+ Add escalation</button>
          </div>
        </div>
      )}
    </div>
  );
}
