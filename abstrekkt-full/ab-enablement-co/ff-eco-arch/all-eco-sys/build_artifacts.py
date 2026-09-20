import os
D = '/home/claude/builds'
os.makedirs(D, exist_ok=True)

FF = dict(
    bg='#09090f', card='#12121e', purple='#7c3aed',
    lpurple='#a78bfa', text='#f1f5f9', muted='#94a3b8',
    border='rgba(124,58,237,.25)', dark='#0d0a1a'
)

BASE_CSS = """*{box-sizing:border-box;margin:0;padding:0}
body{background:#09090f;color:#f1f5f9;font-family:system-ui,sans-serif;padding:2rem 1rem}
.w{max-width:800px;margin:0 auto}
.brand{font-size:12px;color:#7c3aed;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1rem}
h1{font-size:24px;font-weight:600;margin-bottom:.4rem}
.sub{font-size:14px;color:#94a3b8;margin-bottom:1.75rem}
.card{background:#12121e;border:1px solid rgba(124,58,237,.25);border-radius:12px;padding:1.5rem;margin-bottom:1rem}
.ct{font-size:11px;color:#7c3aed;text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:1rem}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.75rem}
.field{margin-bottom:.75rem}
label{font-size:12px;color:#94a3b8;display:block;margin-bottom:.4rem}
input,select,textarea{width:100%;background:#0d0a1a;border:1px solid rgba(124,58,237,.3);border-radius:6px;color:#f1f5f9;padding:.5rem .75rem;font-size:13px;font-family:system-ui}
input:focus,select:focus,textarea:focus{outline:none;border-color:#7c3aed}
.btn{padding:.75rem 1.5rem;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer}
.btn:hover{background:#6d28d9}
.btn-ghost{background:transparent;border:1px solid rgba(124,58,237,.4);color:#a78bfa}
.badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:500}
.badge-purple{background:rgba(124,58,237,.2);color:#a78bfa;border:1px solid rgba(124,58,237,.3)}
.badge-green{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.25)}
.badge-amber{background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.25)}
.badge-red{background:rgba(239,68,68,.15);color:#f87171;border:1px solid rgba(239,68,68,.25)}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;padding:.5rem .75rem;border-bottom:1px solid rgba(124,58,237,.15)}
td{padding:.6rem .75rem;border-bottom:1px solid rgba(255,255,255,.05);color:#cbd5e1}
tr:hover td{background:rgba(124,58,237,.05)}
.score-ring{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:50%;border:3px solid;font-size:16px;font-weight:700}"""

# ─── 01 ROI CALCULATOR ─────────────────────────────────────────────────────
f01 = """<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — ROI Calculator</title><style>{css}
.res{{background:#0d0a1a;border:1px solid rgba(124,58,237,.4);border-radius:12px;padding:1.5rem;margin-top:1rem}}
.mg{{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.75rem;margin-bottom:1.25rem}}
.m{{background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.2);border-radius:8px;padding:.875rem}}
.ml{{font-size:11px;color:#64748b;margin-bottom:.3rem}}.mv{{font-size:20px;font-weight:600}}.ms{{font-size:10px;color:#475569;margin-top:.2rem}}
.bar{{height:6px;background:#1a1a2e;border-radius:6px;overflow:hidden;margin-bottom:.75rem}}
.fill{{height:100%;background:linear-gradient(90deg,#7c3aed,#06b6d4);transition:width .4s}}
input[type=range]{{accent-color:#7c3aed;cursor:pointer;width:100%;margin-top:.4rem}}
.bv{{font-size:20px;font-weight:600;color:#a78bfa}}.un{{font-size:13px;color:#64748b;margin-left:4px}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>AI Implementation ROI Calculator</h1>
<p class="sub">Estimate your return before the first conversation.</p>
<div class="card"><div class="ct">Team and Cost</div><div class="g2">
<div class="field"><label>Team size using AI tools</label><span class="bv" id="vt">15</span><span class="un">people</span><br><input type="range" id="rt" min="1" max="200" value="15" oninput="calc()"></div>
<div class="field"><label>Avg hourly fully-loaded cost</label>$<span class="bv" id="vr">85</span><span class="un">/hr</span><br><input type="range" id="rr" min="20" max="300" value="85" step="5" oninput="calc()"></div>
</div>
<div class="field"><label>Hours saved per person per week</label><span class="bv" id="vh">3</span><span class="un">hrs/week</span><br><input type="range" id="rh" min="0.5" max="20" value="3" step="0.5" oninput="calc()"></div>
</div>
<div class="card"><div class="ct">Engagement</div><div class="g2">
<div class="field"><label>FlashFusion investment</label>$<span class="bv" id="vc">4,500</span><br><input type="range" id="rc" min="1500" max="25000" value="4500" step="500" oninput="calc()"></div>
<div class="field"><label>Weeks to full deployment</label><span class="bv" id="vw">6</span><span class="un">weeks</span><br><input type="range" id="rw" min="1" max="26" value="6" oninput="calc()"></div>
</div></div>
<div class="res">
<div style="font-size:13px;font-weight:600;color:#c4b5fd;margin-bottom:1rem">Projected Return</div>
<div class="mg">
<div class="m"><div class="ml">Weekly value</div><div class="mv" id="mw">-</div><div class="ms">hrs x rate x team</div></div>
<div class="m"><div class="ml">Annual value</div><div class="mv" id="ma">-</div><div class="ms">52-week projection</div></div>
<div class="m"><div class="ml">Year-1 ROI</div><div class="mv" id="mr">-</div><div class="ms">net of engagement</div></div>
<div class="m"><div class="ml">Payback period</div><div class="mv" id="mp">-</div><div class="ms">break-even</div></div>
</div>
<div class="bar"><div class="fill" id="fill" style="width:0%"></div></div>
<div style="font-size:13px;color:#a78bfa;margin-bottom:1rem" id="nb"></div>
<button class="btn" style="width:100%;margin-bottom:.5rem" onclick="window.open('https://audit.flashfusion.co','_blank')">Get Your Free AI Setup Audit</button>
<div style="font-size:11px;color:#334155;text-align:center">Estimates only. Results vary by implementation.</div>
</div></div>
<script>
function fmt(n){{return n>=1e6?"$"+(n/1e6).toFixed(1)+"M":n>=1000?"$"+(n/1000).toFixed(0)+"K":"$"+Math.round(n)}}
function calc(){{
var t=+rt.value,r=+rr.value,h=+rh.value,c=+rc.value,w=+rw.value;
vt.textContent=t;vr.textContent=r;vh.textContent=h;vc.textContent=c.toLocaleString();vw.textContent=w;
var wk=t*r*h,ann=wk*52,net=ann-c,roi=c>0?Math.round(net/c*100):0,pb=wk>0?Math.ceil(c/wk):0;
mw.textContent=fmt(wk);ma.textContent=fmt(ann);mr.textContent=roi+"%";mp.textContent=pb+" wks";
fill.style.width=Math.min(Math.max(roi/2000*100,0),100)+"%";
nb.textContent=pb>0?"Break-even at week "+pb+". Everything after is recovered capacity.":"";
}}
calc();
</script></body></html>""".format(css=BASE_CSS)

with open(f'{D}/01-roi-calculator.html','w') as f: f.write(f01)
print("01 done")

# ─── 02 DISCOVERY CALL SCORECARD ────────────────────────────────────────────
f02 = """<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Discovery Call Scorecard</title><style>{css}
.score-area{{background:#0d0a1a;border:1px solid rgba(124,58,237,.4);border-radius:12px;padding:1.5rem;margin-top:1rem}}
.criterion{{margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid rgba(255,255,255,.06)}}
.criterion:last-child{{border-bottom:none;margin-bottom:0;padding-bottom:0}}
.crit-name{{font-size:14px;font-weight:500;color:#e2e8f0;margin-bottom:.4rem}}
.crit-desc{{font-size:12px;color:#64748b;margin-bottom:.75rem}}
.stars{{display:flex;gap:.4rem}}
.star{{width:32px;height:32px;border-radius:6px;border:1px solid rgba(124,58,237,.3);background:transparent;color:#475569;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}}
.star.on{{background:rgba(124,58,237,.25);border-color:#7c3aed;color:#a78bfa}}
.total-card{{background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.4);border-radius:10px;padding:1.25rem;text-align:center;margin-bottom:1rem}}
.total-num{{font-size:48px;font-weight:700;color:#a78bfa}}
.verdict{{font-size:16px;font-weight:600;margin-top:.25rem}}
.note-area{{margin-top:1rem}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Discovery Call Scorecard</h1>
<p class="sub">Score each dimension live during the call. Qualification threshold: 18/25.</p>
<div class="card"><div class="ct">Prospect Info</div>
<div class="g2">
<div class="field"><label>Company</label><input id="co" placeholder="Acme Corp"></div>
<div class="field"><label>Contact</label><input id="ct" placeholder="Jane Smith, VP Eng"></div>
</div>
<div class="g2">
<div class="field"><label>Date</label><input id="dt" type="date"></div>
<div class="field"><label>Current AI tools</label><input id="tools" placeholder="Copilot, ChatGPT..."></div>
</div>
</div>
<div class="score-area">
<div style="font-size:13px;font-weight:600;color:#c4b5fd;margin-bottom:1.25rem">Score 1–5 per dimension</div>
<div id="criteria"></div>
</div>
<div class="total-card" style="margin-top:1rem">
<div style="font-size:12px;color:#94a3b8;margin-bottom:.25rem">Total Score</div>
<div class="total-num" id="total">0</div><div style="font-size:12px;color:#64748b">/ 25</div>
<div class="verdict" id="verdict" style="color:#64748b">Score the dimensions above</div>
</div>
<div class="card"><div class="ct">Notes and Next Steps</div>
<div class="field"><label>Pain points (their words)</label><textarea id="pain" rows="3" placeholder="What specific problem did they describe?"></textarea></div>
<div class="field"><label>Timeline and urgency</label><textarea id="timeline" rows="2" placeholder="Any deadlines, board pressure, audit dates?"></textarea></div>
<div class="field"><label>Recommended entry product</label>
<select id="prod"><option value="">Select...</option><option>AI Setup Audit — $4,500</option><option>Enablement Sprint — $5,000</option><option>Free Scorecard (nurture)</option><option>Not a fit — disqualify</option></select>
</div>
<div class="field"><label>Next action</label><input id="next" placeholder="e.g. Send proposal by Friday, schedule technical call"></div>
<button class="btn" style="width:100%;margin-top:.5rem" onclick="exportScore()">Export Scorecard Summary</button>
</div>
</div>
<script>
var criteria=[
{{id:"pain",name:"Pain clarity",desc:"Can they articulate a specific AI governance or productivity problem?"}},
{{id:"budget",name:"Budget signal",desc:"Do they have budget allocated or authority to approve?"}},
{{id:"timeline",name:"Timeline urgency",desc:"Is there a deadline — audit, board review, compliance cycle?"}},
{{id:"authority",name:"Decision authority",desc:"Are we talking to someone who can actually say yes?"}},
{{id:"fit",name:"ICP fit",desc:"200-2000 employees, compliance-sensitive, actively evaluating AI?"}}
];
var scores={{}};
var el=document.getElementById("criteria");
criteria.forEach(function(c){{
scores[c.id]=0;
var d=document.createElement("div");d.className="criterion";
var stars="";for(var i=1;i<=5;i++) stars+='<div class="star" data-id="'+c.id+'" data-v="'+i+'" onclick="score(this)">'+i+'</div>';
d.innerHTML='<div class="crit-name">'+c.name+'</div><div class="crit-desc">'+c.desc+'</div><div class="stars">'+stars+'</div>';
el.appendChild(d);
}});
function score(el){{
var id=el.dataset.id,v=+el.dataset.v;
scores[id]=v;
document.querySelectorAll('.star[data-id="'+id+'"]').forEach(function(s){{
s.classList.toggle("on",+s.dataset.v<=v);
}});
updateTotal();
}}
function updateTotal(){{
var t=Object.values(scores).reduce(function(a,b){{return a+b}},0);
document.getElementById("total").textContent=t;
var v=document.getElementById("verdict");
if(t>=20){{v.textContent="Strong fit — move to proposal";v.style.color="#34d399"}}
else if(t>=15){{v.textContent="Qualified — dig deeper on weak dimensions";v.style.color="#fbbf24"}}
else if(t>=10){{v.textContent="Marginal — nurture, revisit in 90 days";v.style.color="#fb923c"}}
else{{v.textContent="Not a fit — disqualify now";v.style.color="#f87171"}}
}}
function exportScore(){{
var t=Object.values(scores).reduce(function(a,b){{return a+b}},0);
var lines=["FLASHFUSION DISCOVERY SCORECARD","========================","","Company: "+co.value,"Contact: "+ct.value,"Date: "+dt.value,"Current tools: "+tools.value,"","SCORES:"];
criteria.forEach(function(c){{lines.push(c.name+": "+scores[c.id]+"/5")}});
lines.push("","TOTAL: "+t+"/25");
lines.push("Recommended product: "+prod.value);
lines.push("Pain points: "+pain.value);
lines.push("Timeline: "+timeline.value);
lines.push("Next action: "+next.value);
var blob=new Blob([lines.join("\\n")],{{type:"text/plain"}});
var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="discovery-scorecard.txt";a.click();
}}
document.getElementById("dt").value=new Date().toISOString().split("T")[0];
</script></body></html>""".format(css=BASE_CSS)

with open(f'{D}/02-discovery-scorecard.html','w') as f: f.write(f02)
print("02 done")

# ─── 03 SKILLS BROWSER ──────────────────────────────────────────────────────
skills_data = [
  ("generating-social-posts","Content","LinkedIn/X/Threads/Blog/Audio posts in Kyle's voice. Hook A/B/C variants.","Included"),
  ("drafting-multi-format-content","Content","48 templates: video scripts, threads, carousels, customer lifecycle emails.","Included"),
  ("roi-calculator-building","Sales","B2B AI ROI models for enterprise presales. Payback period, net value, narrative.","Included"),
  ("ai-solution-architecture","Sales","Pre-sales technical architectures. Integration mapping, risk flags, implementation path.","Included"),
  ("workflow-automation","Automation","n8n, Zapier, Make. Connects SaaS tools, automates multi-step processes.","Included"),
  ("orchestrating-ai-agents","Automation","MCP servers, LangChain, CrewAI. Multi-agent system design and deployment.","Included"),
  ("generating-kb-articles","Documentation","Formatted .docx KB articles. SOPs, runbooks, onboarding guides.","Included"),
  ("applying-adversarial-review","Analysis","Claims/counterexamples, sourced vs generated labeling, agreement streak detection.","Included"),
  ("code-auditor","Engineering","Architecture, security, performance analysis. Tech debt identification.","Included"),
  ("frontend-design","Engineering","Production-grade frontend. Design brief gate enforced before any code.","Included"),
  ("managing-design-briefs","Design","Anti-slop gates, locked design tokens. FF and INT brand profiles.","Included"),
  ("elite-ui-design","Design","Experience thesis to component architecture. Full product design orchestration.","Included"),
  ("producing-ai-newsletter","Content","Multi-config newsletter system. Research, draft, edit, format, deliver.","Included"),
  ("task-decomposition","Planning","Complex requests into parallel workstreams with dependency tracking.","Included"),
  ("applying-sparc-methodology","Engineering","Spec, Pseudocode, Architecture, Refinement, Completion. Structured dev.","Included"),
  ("engineering-staff-workflows","Engineering","Security-first staff engineer workflow. WSJF, threat modeling, full-stack.","Included"),
  ("writing-shell-scripts","Engineering","MSP-grade Bash/PS1 with adversarial audit gate and structured logging.","Included"),
  ("debug-like-expert","Engineering","Deep debugging with hypothesis testing and systematic root cause analysis.","Included"),
  ("developing-skills","Platform","Creating and managing Claude skills. Spec compliance, trigger density, hooks.","Included"),
  ("packaging-skills","Platform","Production zip files, March 2026 spec compliance, distribution ready.","Included"),
  ("ai-audit-delivery","Delivery","Run FF AI Setup Audits end-to-end. Gap analysis, priority matrix, report.","Add-on"),
  ("enablement-sprint-planning","Delivery","5-week sprint structure, milestone definition, client delivery checklist.","Add-on"),
  ("client-communication","Delivery","Lifecycle comms: intake, weekly update, milestone delivery, QBR.","Add-on"),
  ("competitive-intelligence","Sales","Battle card maintenance, competitor monitoring, objection preparation.","Add-on"),
  ("retainer-management","Delivery","Monthly retainer ops: reporting, scope management, renewal triggers.","Add-on"),
]

cats = sorted(set(s[1] for s in skills_data))
rows = ""
for s in skills_data:
  badge = "badge-green" if s[3]=="Included" else "badge-amber"
  rows += f'<tr data-cat="{s[1]}" data-search="{s[0].lower()} {s[1].lower()} {s[2].lower()}"><td><code style="font-size:12px;color:#7c3aed;background:rgba(124,58,237,.1);padding:2px 6px;border-radius:4px">{s[0]}</code></td><td>{s[1]}</td><td style="color:#94a3b8;font-size:12px">{s[2]}</td><td><span class="badge {badge}">{s[3]}</span></td></tr>'

cat_opts = '<option value="">All categories</option>' + "".join(f'<option value="{c}">{c}</option>' for c in cats)

f03 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Skills Browser</title><style>{BASE_CSS}
code{{font-family:monospace}}
.search-row{{display:flex;gap:.75rem;margin-bottom:1rem}}
.search-row input{{flex:1}}
.search-row select{{width:180px}}
.count{{font-size:13px;color:#64748b;margin-bottom:.75rem}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Skills Library Browser</h1>
<p class="sub">25 production-ready Claude skill packs. Filter by category or search by use case.</p>
<div class="card">
<div class="search-row">
<input id="srch" placeholder="Search skills..." oninput="filter()">
<select id="cat" onchange="filter()">{cat_opts}</select>
</div>
<div class="count" id="count">Showing 25 of 25 skills</div>
<table><thead><tr><th>Skill ID</th><th>Category</th><th>What it does</th><th>Tier</th></tr></thead>
<tbody id="tbody">{rows}</tbody></table>
</div>
<div class="card" style="text-align:center;padding:2rem">
<div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:.5rem">Ready to deploy skills for your team?</div>
<div style="font-size:14px;color:#94a3b8;margin-bottom:1.25rem">Start with a free AI Setup Audit to identify which skills will have the highest impact.</div>
<button class="btn" onclick="window.open('https://audit.flashfusion.co','_blank')">Get Your Free AI Setup Audit</button>
</div>
</div>
<script>
function filter(){{
var s=document.getElementById("srch").value.toLowerCase();
var c=document.getElementById("cat").value;
var rows=document.querySelectorAll("#tbody tr");
var shown=0;
rows.forEach(function(r){{
var match=r.dataset.search.includes(s)&&(c===""||r.dataset.cat===c);
r.style.display=match?"":"none";
if(match) shown++;
}});
document.getElementById("count").textContent="Showing "+shown+" of 25 skills";
}}
</script></body></html>"""

with open(f'{D}/03-skills-browser.html','w') as f: f.write(f03)
print("03 done")

# ─── 04 SPRINT TRACKER ──────────────────────────────────────────────────────
f04 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Enablement Sprint Tracker</title><style>{BASE_CSS}
.week{{background:#12121e;border:1px solid rgba(124,58,237,.2);border-radius:10px;padding:1.25rem;margin-bottom:.875rem}}
.week-header{{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem}}
.week-num{{background:rgba(124,58,237,.2);color:#a78bfa;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex-shrink:0}}
.week-title{{font-size:14px;font-weight:600}}
.week-status{{margin-left:auto}}
.task{{display:flex;align-items:center;gap:.75rem;padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.04)}}
.task:last-child{{border-bottom:none}}
.task input[type=checkbox]{{accent-color:#7c3aed;width:16px;height:16px;cursor:pointer;flex-shrink:0}}
.task-text{{font-size:13px;color:#cbd5e1;flex:1}}
.task-text.done{{text-decoration:line-through;color:#475569}}
.prog-bar{{height:4px;background:#1a1a2e;border-radius:4px;overflow:hidden;margin-top:.75rem}}
.prog-fill{{height:100%;background:linear-gradient(90deg,#7c3aed,#06b6d4);transition:width .3s}}
.summary-card{{background:#0d0a1a;border:1px solid rgba(124,58,237,.35);border-radius:12px;padding:1.5rem;margin-bottom:1rem}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Enablement Sprint Tracker</h1>
<p class="sub">5-week AI enablement sprint — shared client view.</p>
<div class="summary-card">
<div class="g3">
<div class="m" style="background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.2);border-radius:8px;padding:.875rem">
<div style="font-size:11px;color:#64748b;margin-bottom:.3rem">Overall progress</div>
<div style="font-size:24px;font-weight:600" id="ovr">0%</div>
</div>
<div class="m" style="background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.2);border-radius:8px;padding:.875rem">
<div style="font-size:11px;color:#64748b;margin-bottom:.3rem">Tasks complete</div>
<div style="font-size:24px;font-weight:600" id="tc">0/0</div>
</div>
<div class="m" style="background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.2);border-radius:8px;padding:.875rem">
<div style="font-size:11px;color:#64748b;margin-bottom:.3rem">Current week</div>
<div style="font-size:24px;font-weight:600" id="cw">—</div>
</div>
</div>
</div>
<div id="weeks"></div>
<script>
var WEEKS=[
{{n:1,title:"Audit and Discovery",tasks:["Kickoff call — align on goals and stakeholders","Conduct AI Setup Audit (scorecard + interview)","Map current tool stack and workflows","Identify top 3 automation opportunities","Deliver audit report with gap analysis"]}},
{{n:2,title:"Skill Pack Selection and Configuration",tasks:["Select skill packs from library based on audit","Configure skill packs for client's Claude environment","Set up allowed-tools and trigger phrases","Test skill activation across target workflows","Client review of configured skill set"]}},
{{n:3,title:"Pilot Deployment",tasks:["Deploy skill packs to pilot user group (3-5 people)","Run hands-on walkthrough session (60 min)","Collect day-1 feedback via async form","Troubleshoot any activation or trigger issues","Document initial wins and friction points"]}},
{{n:4,title:"Full Rollout and Training",tasks:["Deploy to full team","Deliver skills library user guide","Run team training session (90 min)","Set up usage tracking and feedback loop","Identify candidates for custom skill development"]}},
{{n:5,title:"Measurement and Handoff",tasks:["Collect usage data and self-reported time savings","Build ROI summary with actuals vs projections","Deliver Sprint Summary Report","Present retainer or follow-on options","Handoff documentation and admin access"]}},
];
var checks={{}};
var el=document.getElementById("weeks");
WEEKS.forEach(function(w){{
checks[w.n]={{}};
var tasks="";
w.tasks.forEach(function(t,i){{
checks[w.n][i]=false;
tasks+='<div class="task"><input type="checkbox" id="c'+w.n+'_'+i+'" onchange="updateProgress('+w.n+','+i+',this.checked)"><label class="task-text" id="tl'+w.n+'_'+i+'" for="c'+w.n+'_'+i+'">'+t+'</label></div>';
}});
var d=document.createElement("div");d.className="week";
d.innerHTML='<div class="week-header"><div class="week-num">'+w.n+'</div><div class="week-title">Week '+w.n+': '+w.title+'</div><div class="week-status"><span class="badge badge-purple" id="ws'+w.n+'">0/'+w.tasks.length+'</span></div></div>'+tasks+'<div class="prog-bar"><div class="prog-fill" id="pf'+w.n+'" style="width:0%"></div></div>';
el.appendChild(d);
}});
function updateProgress(wn,ti,val){{
checks[wn][ti]=val;
var el=document.getElementById("tl"+wn+"_"+ti);
el.classList.toggle("done",val);
var done=Object.values(checks[wn]).filter(Boolean).length;
var total=Object.values(checks[wn]).length;
document.getElementById("ws"+wn).textContent=done+"/"+total;
document.getElementById("pf"+wn).style.width=(done/total*100)+"%";
updateOverall();
}}
function updateOverall(){{
var totalDone=0,totalAll=0;
WEEKS.forEach(function(w){{
totalDone+=Object.values(checks[w.n]).filter(Boolean).length;
totalAll+=Object.values(checks[w.n]).length;
}});
document.getElementById("ovr").textContent=Math.round(totalDone/totalAll*100)+"%";
document.getElementById("tc").textContent=totalDone+"/"+totalAll;
var cw=1;
WEEKS.forEach(function(w){{
var d=Object.values(checks[w.n]).filter(Boolean).length,t=Object.values(checks[w.n]).length;
if(d===t) cw=Math.min(w.n+1,5);
}});
document.getElementById("cw").textContent="Week "+cw;
}}
</script></body></html>"""

with open(f'{D}/04-sprint-tracker.html','w') as f: f.write(f04)
print("04 done")

# ─── 05 PROPOSAL BUILDER ─────────────────────────────────────────────────────
f05 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Proposal Builder</title><style>{BASE_CSS}
#output{{background:#0d0a1a;border:1px solid rgba(124,58,237,.3);border-radius:10px;padding:1.5rem;white-space:pre-wrap;font-size:13px;color:#cbd5e1;line-height:1.7;font-family:system-ui;display:none;margin-top:1rem}}
.section-label{{font-size:11px;color:#7c3aed;text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:.5rem;margin-top:1rem}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Proposal Builder</h1>
<p class="sub">Fill from discovery notes — generates a formatted proposal draft.</p>
<div class="card"><div class="ct">Client Info</div>
<div class="g2">
<div class="field"><label>Company name</label><input id="co" placeholder="Acme Corp"></div>
<div class="field"><label>Contact name and title</label><input id="ct" placeholder="Jane Smith, VP Engineering"></div>
</div>
<div class="field"><label>Industry / company type</label><input id="ind" placeholder="Healthcare SaaS, 400 employees"></div>
</div>
<div class="card"><div class="ct">Problem (their words)</div>
<div class="field"><label>Pain point — what they said</label><textarea id="pain" rows="3" placeholder="e.g. Our auditor asked for AI agent documentation and we had nothing to show them."></textarea></div>
<div class="field"><label>Timeline pressure</label><input id="tl" placeholder="e.g. SOC 2 renewal in Q3, board review in June"></div>
<div class="field"><label>Current state</label><textarea id="curr" rows="2" placeholder="What they're doing now — manual, nothing, partial solution"></textarea></div>
</div>
<div class="card"><div class="ct">Recommended Engagement</div>
<div class="g2">
<div class="field"><label>Primary service</label>
<select id="svc"><option value="audit">AI Setup Audit — $4,500</option><option value="sprint">Enablement Sprint — $5,000</option><option value="retainer">Managed Retainer — $2,000/mo</option></select>
</div>
<div class="field"><label>Engagement duration</label>
<select id="dur"><option value="1 week">1 week (Audit)</option><option value="4-5 weeks">4-5 weeks (Sprint)</option><option value="ongoing">Ongoing (Retainer)</option></select>
</div>
</div>
<div class="field"><label>Key deliverables (one per line)</label><textarea id="dels" rows="3" placeholder="AI Setup Audit report&#10;Gap analysis and priority matrix&#10;Top 5 skill pack deployment&#10;Team training session"></textarea></div>
</div>
<button class="btn" style="width:100%;margin-bottom:1rem" onclick="generate()">Generate Proposal Draft</button>
<div id="output"></div>
<button class="btn btn-ghost" id="copy-btn" style="width:100%;display:none;margin-top:.75rem" onclick="copyProposal()">Copy Proposal to Clipboard</button>
</div>
<script>
var SVC_MAP={{audit:"AI Setup Audit",sprint:"Enablement Sprint",retainer:"Managed Retainer"}};
var PRICE_MAP={{audit:"$4,500",sprint:"$5,000",retainer:"$2,000/month"}};
function generate(){{
var co=document.getElementById("co").value||"[Company]";
var ct=document.getElementById("ct").value||"[Contact]";
var ind=document.getElementById("ind").value||"[Industry]";
var pain=document.getElementById("pain").value||"[Pain point]";
var tl=document.getElementById("tl").value||"[Timeline]";
var curr=document.getElementById("curr").value||"[Current state]";
var svc=document.getElementById("svc").value;
var dur=document.getElementById("dur").value;
var dels=document.getElementById("dels").value.split("\\n").filter(Boolean);
var d=new Date();var dateStr=d.toLocaleDateString("en-US",{{month:"long",day:"numeric",year:"numeric"}});
var validDate=new Date(d.getTime()+30*86400000).toLocaleDateString("en-US",{{month:"long",day:"numeric",year:"numeric"}});
var delStr=dels.map(function(x){{return "  • "+x}}).join("\\n")||"  • [Define deliverables]";
var out="FLASHFUSION — "+SVC_MAP[svc].toUpperCase()+" PROPOSAL\\n";
out+="══════════════════════════════════════════════════\\n\\n";
out+="Prepared for: "+ct+" — "+co+"\\n";
out+="Prepared by: Kyle Rosebrook — FlashFusion\\n";
out+="Date: "+dateStr+"\\nValid through: "+validDate+"\\n\\n";
out+="──────────────────────────────────────────────────\\n";
out+="EXECUTIVE SUMMARY\\n";
out+="──────────────────────────────────────────────────\\n\\n";
out+=co+" is deploying AI tools across "+ind+". As those deployments scale, \\nthe question of governance, auditability, and measurable ROI becomes unavoidable.\\n\\n";
out+='This proposal outlines a '+dur+' '+SVC_MAP[svc]+' to help '+co+' answer that question — \\nwith a clear picture of what\'s working, what\'s missing, and what to do next.\\n\\n';
out+="──────────────────────────────────────────────────\\n";
out+="THE PROBLEM WE'RE SOLVING\\n";
out+="──────────────────────────────────────────────────\\n\\n";
out+='"'+pain+'"\\n\\n';
out+="Current state: "+curr+"\\n";
out+="Timeline pressure: "+tl+"\\n\\n";
out+="──────────────────────────────────────────────────\\n";
out+="SCOPE OF WORK\\n";
out+="──────────────────────────────────────────────────\\n\\n";
out+="Service: "+SVC_MAP[svc]+"\\n";
out+="Duration: "+dur+"\\n";
out+="Investment: "+PRICE_MAP[svc]+"\\n\\n";
out+="Deliverables:\\n"+delStr+"\\n\\n";
out+="──────────────────────────────────────────────────\\n";
out+="INVESTMENT AND NEXT STEPS\\n";
out+="──────────────────────────────────────────────────\\n\\n";
out+="To move forward:\\n";
out+="  1. Reply with approval or questions\\n";
out+="  2. FlashFusion sends SOW for signature\\n";
out+="  3. Kickoff scheduled within 5 business days\\n\\n";
out+="Questions: kyle@flashfusion.co\\n";
out+="Audit: audit.flashfusion.co";
document.getElementById("output").textContent=out;
document.getElementById("output").style.display="block";
document.getElementById("copy-btn").style.display="block";
}}
function copyProposal(){{
navigator.clipboard.writeText(document.getElementById("output").textContent).then(function(){{
document.getElementById("copy-btn").textContent="Copied!";
setTimeout(function(){{document.getElementById("copy-btn").textContent="Copy Proposal to Clipboard"}},2000);
}});
}}
</script></body></html>"""

with open(f'{D}/05-proposal-builder.html','w') as f: f.write(f05)
print("05 done")

print("\nBatch 1 (01-05) complete.")
