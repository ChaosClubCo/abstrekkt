import { useState, useEffect, useCallback } from "react";

const T = {
  bg:"#0c0c0b",surface:"#111110",card:"#181815",border:"#232320",
  borderHi:"#303030",accent:"#d4893a",accentHi:"#e8a050",text:"#ddd8ce",
  text2:"#807c74",text3:"#3a3835",green:"#5a9c5a",mono:"#7ab878",
  mono2:"#78afc8",red:"#c05050",tag:"#1e1e1a",
};
const F = { serif:"'Playfair Display',Georgia,serif", sans:"'IBM Plex Sans',sans-serif", mono:"'IBM Plex Mono',monospace" };
const radius = "2px";
const tr = "0.15s";

const STEPS = [
  { id:"s01", num:"01", label:"Create Account",
    plan:"Free", required:true,
    checks:["Account created · Work email confirmed"],
    tasks:["Sign up at claude.ai using your work/org email","Download desktop app from claude.com/download","Install mobile app: iOS App Store / Google Play"],
    links:[{label:"claude.ai",href:"https://claude.ai"},{label:"claude.com/download",href:"https://claude.com/download"}] },

  { id:"s02", num:"02", label:"Verify / Upgrade Plan",
    plan:"Free → Pro", required:true,
    checks:["Plan tier confirmed"],
    tasks:["Go to Settings → Plan (avatar, bottom-left)","Confirm current tier","Upgrade to Pro ($20/mo) for Projects, Connectors, Cowork"],
    links:[{label:"claude.ai/pricing",href:"https://claude.ai/pricing"}] },

  { id:"s03", num:"03", label:"Account Setup",
    plan:"Free", required:true,
    checks:["Work email confirmed · Display name set · Privacy reviewed"],
    tasks:["Settings → Account: confirm work email, set display name","Settings → Privacy: review data settings","Enterprise: verify SSO setup with IT"] },

  { id:"s04", num:"04", label:"Enable Memory",
    plan:"Free", required:true,
    checks:["Memory ON · Memory from chat history ON"],
    tasks:["Settings → Memory & Integrations","Toggle Memory ON","Toggle 'Memory from chat history' ON","Review any existing memories"] },

  { id:"s05", num:"05", label:"Write Memory Edits",
    plan:"Pro", required:true,
    checks:["3+ memory edits written · Tested in new conversation"],
    tasks:[
      'Write: "User is [Name], [Role] at [Org]."',
      'Write: "User prefers [your format preference]."',
      'Write: "User works primarily in [stack/tools/domain]."',
      'Write: "User\'s active projects are [X, Y, Z]."',
      "Test in a new conversation window",
    ] },

  { id:"s06", num:"06", label:"Create First Project",
    plan:"Pro", required:true,
    checks:["1+ project created"],
    tasks:["Left sidebar → + New Project","Name by context: 'Work — [Role]' or '[Initiative]'","Add icon/color for navigation","Each project = separate memory namespace + instructions + files"] },

  { id:"s07", num:"07", label:"Set Project Custom Instructions",
    plan:"Pro", required:true,
    checks:["Custom instructions written and tested"],
    tasks:["Project → gear icon → Project instructions","Write role/org context, output format prefs, domain rules","Add explicit prohibitions","Test: open conversation in project → verify Claude follows instructions"] },

  { id:"s08", num:"08", label:"Pin Knowledge Files",
    plan:"Pro", required:false,
    checks:["1+ knowledge file pinned and accessible"],
    tasks:["Project → paperclip icon → Upload files","Pin: SOPs, style guides, data schemas, brand docs","Supported: PDF, DOCX, CSV, TXT, images, code files"] },

  { id:"s09", num:"09", label:"Configure Writing Style",
    plan:"Free", required:false,
    checks:["Writing style configured"],
    tasks:["Settings → Writing style","Choose preset: Concise, Explanatory, Formal, Casual","Or write custom voice/tone description","Override per-conversation as needed"] },

  { id:"s10", num:"10", label:"MCP Connector Setup",
    plan:"Pro", required:false,
    checks:["1+ connector connected and tested"],
    tasks:["Settings → Connectors","All users: Google Drive, Notion, Slack/Teams","Developers: + GitHub, Vercel, Sentry, Linear, n8n","Fix 403 errors: disconnect → reconnect (session expiry)"],
    links:[{label:"Settings → Connectors",href:"https://claude.ai/settings/connectors"}] },

  { id:"s11", num:"11", label:"Install Desktop App",
    plan:"Pro", required:false,
    checks:["Desktop app installed · Chat/Cowork/Code tabs visible"],
    tasks:["Download from claude.com/download","Three tabs: Chat (full claude.ai), Cowork (automation agent), Code (coding agent)","Computer use: Settings → General → enable (Pro/Max only)"],
    links:[{label:"claude.com/download",href:"https://claude.com/download"}] },

  { id:"s12", num:"12", label:"Configure Cowork",
    plan:"Pro", required:false,
    checks:["Cowork tested with one task"],
    tasks:["Desktop app → Cowork tab","Grant folder access before first task","First test: 'Organize my Downloads folder — show me the plan first'"] },

  { id:"s13", num:"13", label:"Claude Code Setup",
    plan:"Pro", required:false,
    checks:["claude command works from terminal"],
    tasks:["npm install -g @anthropic-ai/claude-code","Run: claude (first run triggers OAuth login)","Create CLAUDE.md in each project repo","Test: claude 'what files are in this repo?'"],
    links:[{label:"code.claude.com/docs",href:"https://code.claude.com/docs"}] },

  { id:"s14", num:"14", label:"QC Gate — Verify All Critical Items",
    plan:"all", required:true,
    checks:["All critical items ★ confirmed"],
    tasks:[
      "★ Account on work/org email",
      "★ Memory enabled with 3+ edits",
      "★ 1+ Project with custom instructions (tested)",
      "◇ Writing style configured",
      "◇ 1+ MCP connector connected",
      "◇ Desktop app installed",
    ] },

  { id:"s15", num:"15", label:"Setup Complete",
    plan:"all", required:false,
    checks:["All surfaces documented"],
    tasks:["Copy session summary if onboarding someone else","Document anything skipped and why","Return here when upgrading plan or adding new surfaces"] },
];

const PLAN_COLORS = { Free:T.text2, "Pro":T.mono, "Free → Pro":T.mono2, "Free → Pro+":T.mono2, all:T.accent };

export default function SelfServiceGuide() {
  const [checks, setChecks]   = useState({});
  const [plan, setPlan]       = useState("Pro");
  const [expanded, setExpanded] = useState({});
  const [saving, setSaving]   = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `*{box-sizing:border-box;margin:0;padding:0}body{background:${T.bg};color:${T.text};font-family:${F.sans}}`;
    document.head.appendChild(style);
  }, []);

  const loadState = useCallback(async () => {
    try {
      const r = await window.storage.get("self-setup-v1");
      if (r) {
        const d = JSON.parse(r.value);
        if (d.checkState) setChecks(d.checkState);
        if (d.plan) setPlan(d.plan);
      }
    } catch {}
  }, []);

  useEffect(() => { loadState(); }, [loadState]);

  const persist = useCallback(async (newChecks, newPlan) => {
    setSaving(true);
    try {
      await window.storage.set("self-setup-v1", JSON.stringify({ checkState: newChecks, plan: newPlan }));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(null), 1500);
    } catch { setSaveStatus("error"); }
    finally { setSaving(false); }
  }, []);

  const toggleCheck = (stepId, checkIdx) => {
    const key = `${stepId}-${checkIdx}`;
    const next = { ...checks, [key]: !checks[key] };
    setChecks(next);
    persist(next, plan);
  };

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const completed = STEPS.filter(st =>
    st.checks.every((_, i) => checks[`${st.id}-${i}`])
  ).length;
  const progress = Math.round((completed / STEPS.length) * 100);

  const s = {
    root:  { minHeight:"100vh", background:T.bg, padding:"32px 28px", fontFamily:F.sans },
    hdr:   { borderBottom:`1px solid ${T.border}`, paddingBottom:"20px", marginBottom:"28px" },
    title: { fontFamily:F.serif, fontSize:"26px", fontWeight:700, color:T.text, letterSpacing:"-0.5px" },
    sub:   { fontSize:"12px", fontFamily:F.mono, color:T.text2, marginTop:"4px" },
    progressBar:{ height:"2px", background:T.border, borderRadius:"1px", marginBottom:"24px" },
    progressFill:(pct) => ({
      height:"2px", width:`${pct}%`, background:T.accent,
      borderRadius:"1px", transition:`width 0.3s`,
    }),
    progressLabel:{ fontFamily:F.mono, fontSize:"11px", color:T.text2, marginBottom:"6px" },
    stepCard:(done, exp) => ({
      background: done ? T.tag : T.card,
      border:`1px solid ${done ? T.accent : (exp ? T.borderHi : T.border)}`,
      borderRadius:radius, marginBottom:"8px", overflow:"hidden",
      transition:`border-color ${tr}, background ${tr}`,
    }),
    stepHeader:{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px",
                 cursor:"pointer" },
    stepNum:{ fontFamily:F.mono, fontSize:"10px", color:T.text3, width:"22px", flexShrink:0 },
    stepLabel:(done) => ({
      fontFamily:F.sans, fontSize:"14px", fontWeight:500,
      color: done ? T.accent : T.text, flex:1,
      textDecoration: done ? "none" : "none",
    }),
    stepPlan:(c) => ({
      fontFamily:F.mono, fontSize:"10px", color:c, background:T.bg,
      padding:"2px 6px", borderRadius:radius, marginLeft:"auto",
    }),
    chevron:(exp) => ({
      fontFamily:F.mono, fontSize:"12px", color:T.text3,
      transform: exp ? "rotate(90deg)" : "none",
      transition:`transform ${tr}`, marginLeft:"8px",
    }),
    stepBody:{ padding:"0 14px 14px 46px" },
    checkItem:{ display:"flex", alignItems:"flex-start", gap:"8px", marginBottom:"6px", cursor:"pointer" },
    checkBox:(done) => ({
      width:"14px", height:"14px", minWidth:"14px",
      border:`1px solid ${done ? T.accent : T.border}`,
      background: done ? T.accent : "transparent",
      borderRadius:"1px", display:"flex", alignItems:"center", justifyContent:"center",
      marginTop:"2px", transition:`background ${tr}, border-color ${tr}`,
    }),
    checkText:(done) => ({
      fontSize:"12px", color: done ? T.text2 : T.text, lineHeight:"1.5",
      textDecoration: done ? "line-through" : "none",
    }),
    taskList:{ marginTop:"10px", borderTop:`1px solid ${T.border}`, paddingTop:"10px" },
    taskItem:{ fontSize:"12px", color:T.text2, padding:"3px 0", paddingLeft:"12px",
               position:"relative", lineHeight:"1.5" },
    link:{ fontFamily:F.mono, fontSize:"11px", color:T.mono2, textDecoration:"none",
           marginRight:"10px" },
    planToggle:{ display:"flex", gap:"8px", marginBottom:"20px" },
    planBtn:(active) => ({
      fontFamily:F.mono, fontSize:"11px", letterSpacing:"0.05em",
      padding:"5px 10px", borderRadius:radius,
      background: active ? T.accent : "transparent",
      color: active ? T.bg : T.text2,
      border:`1px solid ${active ? T.accent : T.border}`,
      cursor:"pointer", transition:`all ${tr}`,
    }),
  };

  return (
    <div style={s.root}>
      <div style={s.hdr}>
        <div style={s.title}>◆ Employee Self-Service Guide</div>
        <div style={s.sub}>ARTIFACT 03 · self-setup-v1 · {completed}/{STEPS.length} complete</div>
      </div>

      {/* Plan filter */}
      <div style={s.planToggle}>
        {["Free","Pro","Max"].map(p => (
          <button key={p} style={s.planBtn(plan===p)} onClick={() => { setPlan(p); persist(checks, p); }}>
            {p}
          </button>
        ))}
        <span style={{ fontFamily:F.mono, fontSize:"11px", color:T.text3, marginLeft:"auto", alignSelf:"center" }}>
          {saving ? "saving…" : saveStatus === "saved" ? "◆ saved" : saveStatus === "error" ? "✗ save error" : ""}
        </span>
      </div>

      {/* Progress */}
      <div style={s.progressLabel}>{progress}% complete — {completed} of {STEPS.length} steps</div>
      <div style={s.progressBar}><div style={s.progressFill(progress)} /></div>

      {/* Steps */}
      {STEPS.map(step => {
        const allDone = step.checks.every((_, i) => checks[`${step.id}-${i}`]);
        const isExp = expanded[step.id];
        const planColor = PLAN_COLORS[step.plan] || T.text2;
        return (
          <div key={step.id} style={s.stepCard(allDone, isExp)}>
            <div style={s.stepHeader} onClick={() => toggleExpand(step.id)}>
              <span style={s.stepNum}>{step.num}</span>
              <span style={s.stepLabel(allDone)}>{step.label}</span>
              {step.required && (
                <span style={{ fontFamily:F.mono, fontSize:"9px", color:T.red }}>★</span>
              )}
              <span style={s.stepPlan(planColor)}>{step.plan}</span>
              <span style={s.chevron(isExp)}>▶</span>
            </div>

            {isExp && (
              <div style={s.stepBody}>
                {/* Checks */}
                {step.checks.map((check, i) => (
                  <div key={i} style={s.checkItem}
                       onClick={() => toggleCheck(step.id, i)}>
                    <div style={s.checkBox(!!checks[`${step.id}-${i}`])}>
                      {checks[`${step.id}-${i}`] && (
                        <span style={{ fontSize:"9px", color:T.bg, fontWeight:700 }}>✓</span>
                      )}
                    </div>
                    <span style={s.checkText(!!checks[`${step.id}-${i}`])}>{check}</span>
                  </div>
                ))}

                {/* Tasks */}
                <div style={s.taskList}>
                  {step.tasks.map((task, i) => (
                    <div key={i} style={s.taskItem}>◇ {task}</div>
                  ))}
                </div>

                {/* Links */}
                {step.links && step.links.length > 0 && (
                  <div style={{ marginTop:"10px" }}>
                    {step.links.map((l, i) => (
                      <a key={i} href={l.href} target="_blank" rel="noopener noreferrer" style={s.link}>
                        ↗ {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
