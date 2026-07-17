import os, json
D = '/home/claude/builds'

BASE_CSS = """*{box-sizing:border-box;margin:0;padding:0}
body{background:#09090f;color:#f1f5f9;font-family:system-ui,sans-serif;padding:2rem 1rem}
.w{max-width:820px;margin:0 auto}
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
.badge-green{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.25)}
.badge-amber{background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.25)}
.badge-purple{background:rgba(124,58,237,.2);color:#a78bfa;border:1px solid rgba(124,58,237,.3)}
.mcard{background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.2);border-radius:8px;padding:.875rem}
.mlbl{font-size:11px;color:#64748b;margin-bottom:.3rem}
.mval{font-size:22px;font-weight:600}"""

# ─── 12 NEWSLETTER GENERATOR (Claude-in-Claude) ─────────────────────────────
f12 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Newsletter Generator</title><style>{BASE_CSS}
#out{{background:#0d0a1a;border:1px solid rgba(124,58,237,.3);border-radius:10px;padding:1.5rem;white-space:pre-wrap;font-size:13px;color:#cbd5e1;line-height:1.7;min-height:200px;display:none;margin-top:1rem}}
.loading{{color:#a78bfa;font-size:14px;display:none}}
.signal-row{{display:flex;gap:.5rem;margin-bottom:.5rem;align-items:center}}
.signal-row input{{flex:1}}
.signal-row button{{background:none;border:none;color:#475569;cursor:pointer;font-size:18px;flex-shrink:0}}
.signal-row button:hover{{color:#f87171}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Newsletter Generator</h1>
<p class="sub">The Prompt — weekly AI enablement briefing. Add this week's signals, generate draft.</p>
<div class="card"><div class="ct">Edition Info</div>
<div class="g2">
<div class="field"><label>Edition number</label><input id="enum" placeholder="e.g. 12" type="number"></div>
<div class="field"><label>Week of</label><input id="edate" type="date"></div>
</div>
<div class="field"><label>Audience focus this week</label>
<select id="focus">
<option value="all">All — general AI enablement</option>
<option value="compliance">Compliance-heavy orgs (healthcare, finance)</option>
<option value="smb">SMB teams (sub-100 employees)</option>
<option value="technical">Technical leaders (VPE, architects)</option>
</select></div>
</div>
<div class="card"><div class="ct">This Week's Signals (3-7 items)</div>
<div id="signals">
<div class="signal-row"><input placeholder="e.g. Anthropic releases Claude 4 with extended context" class="sig"><button onclick="removeSignal(this)">×</button></div>
<div class="signal-row"><input placeholder="e.g. SOC 2 Type 2 now requires AI agent documentation" class="sig"><button onclick="removeSignal(this)">×</button></div>
<div class="signal-row"><input placeholder="e.g. Gartner: 40% of enterprises will have AI governance policies by 2026" class="sig"><button onclick="removeSignal(this)">×</button></div>
</div>
<button class="btn btn-ghost" style="margin-top:.75rem;padding:.5rem 1rem;font-size:12px" onclick="addSignal()">+ Add signal</button>
</div>
<div class="card"><div class="ct">Skill or Tool Spotlight</div>
<div class="field"><label>Spotlight this week</label><input id="spotlight" placeholder="e.g. workflow-automation skill pack — what it does and when to use it"></div>
</div>
<button class="btn" style="width:100%;margin-bottom:.5rem" onclick="generate()">Generate Newsletter Draft</button>
<div class="loading" id="load">Generating with Claude...</div>
<div id="out"></div>
<button class="btn btn-ghost" id="cpbtn" style="width:100%;display:none;margin-top:.75rem" onclick="copyOut()">Copy Draft</button>
</div>
<script>
function addSignal(){{
var row=document.createElement("div");row.className="signal-row";
row.innerHTML='<input placeholder="Add signal..." class="sig"><button onclick="removeSignal(this)">×</button>';
document.getElementById("signals").appendChild(row);
}}
function removeSignal(btn){{btn.parentElement.remove()}}
async function generate(){{
var sigs=Array.from(document.querySelectorAll(".sig")).map(function(i){{return i.value.trim()}}).filter(Boolean);
if(sigs.length<2){{alert("Add at least 2 signals.");return;}}
var num=document.getElementById("enum").value||"[N]";
var date=document.getElementById("edate").value||"this week";
var focus=document.getElementById("focus").value;
var spotlight=document.getElementById("spotlight").value;
var prompt="You are writing 'The Prompt', a weekly AI enablement newsletter by FlashFusion. Write Edition "+num+" for the week of "+date+". Audience: "+focus+". Voice: direct, no fluff, written like a practitioner for practitioners. No sycophancy. Format: short intro (2 sentences), 3-4 'This Week' bullets from these signals, a skill spotlight section, and a closing CTA to visit audit.flashfusion.co. Signals: "+sigs.join("; ")+". Spotlight: "+(spotlight||"no spotlight this week")+". Write the complete newsletter edition, ready to publish. Use plain text, no markdown.";
document.getElementById("load").style.display="block";
document.getElementById("out").style.display="none";
document.getElementById("cpbtn").style.display="none";
try{{
var resp=await fetch("https://api.anthropic.com/v1/messages",{{
method:"POST",headers:{{"Content-Type":"application/json"}},
body:JSON.stringify({{model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{{role:"user",content:prompt}}]}})
}});
var data=await resp.json();
var text=data.content&&data.content[0]&&data.content[0].text?"The Prompt — Edition "+num+"\\nWeek of "+date+"\\n\\n"+data.content[0].text:"[Generation failed — check API]";
document.getElementById("out").textContent=text;
document.getElementById("out").style.display="block";
document.getElementById("cpbtn").style.display="block";
}}catch(e){{document.getElementById("out").textContent="API error: "+e.message;document.getElementById("out").style.display="block";}}
document.getElementById("load").style.display="none";
}}
function copyOut(){{
navigator.clipboard.writeText(document.getElementById("out").textContent).then(function(){{
cpbtn.textContent="Copied!";setTimeout(function(){{cpbtn.textContent="Copy Draft"}},2000);
}});
}}
document.getElementById("edate").value=new Date().toISOString().split("T")[0];
</script></body></html>"""

with open(f'{D}/12-newsletter-generator.html','w') as f: f.write(f12)
print("12 done")

# ─── 13 SKILLS GAP DETECTOR ─────────────────────────────────────────────────
f13 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Skills Gap Detector</title><style>{BASE_CSS}
.q-block{{margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid rgba(255,255,255,.06)}}
.q-block:last-child{{border-bottom:none;margin-bottom:0;padding-bottom:0}}
.q-text{{font-size:15px;font-weight:500;color:#e2e8f0;margin-bottom:.75rem}}
.options{{display:flex;flex-direction:column;gap:.4rem}}
.option{{display:flex;align-items:center;gap:.75rem;cursor:pointer;padding:.5rem .75rem;border-radius:6px;border:1px solid rgba(124,58,237,.15);background:transparent;transition:all .15s}}
.option:hover{{background:rgba(124,58,237,.08);border-color:rgba(124,58,237,.3)}}
.option.sel{{background:rgba(124,58,237,.15);border-color:#7c3aed}}
.option input{{accent-color:#7c3aed;flex-shrink:0}}
.option label{{font-size:13px;color:#cbd5e1;cursor:pointer;flex:1}}
.rec-card{{background:#0d0a1a;border:1px solid rgba(124,58,237,.35);border-radius:10px;padding:1.25rem;margin-bottom:.75rem}}
.rec-name{{font-size:14px;font-weight:600;color:#a78bfa;margin-bottom:.3rem}}
.rec-reason{{font-size:13px;color:#94a3b8;margin-bottom:.5rem}}
.rec-priority{{font-size:11px;font-weight:600}}
.pri-h{{color:#f87171}}.pri-m{{color:#fbbf24}}.pri-l{{color:#34d399}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Skills Gap Detector</h1>
<p class="sub">Answer 5 questions — get your personalized skill pack recommendation.</p>
<div class="card" id="quiz">
<div class="q-block">
<div class="q-text">1. What is your team's primary AI use case?</div>
<div class="options" data-q="usecase">
<label class="option"><input type="radio" name="uc" value="content"> <label>Writing, content, and communications</label></label>
<label class="option"><input type="radio" name="uc" value="automation"> <label>Automating repetitive workflows</label></label>
<label class="option"><input type="radio" name="uc" value="analysis"> <label>Research, analysis, and decision support</label></label>
<label class="option"><input type="radio" name="uc" value="dev"> <label>Software development and engineering</label></label>
<label class="option"><input type="radio" name="uc" value="sales"> <label>Sales, outreach, and client work</label></label>
</div>
</div>
<div class="q-block">
<div class="q-text">2. What is your biggest current AI frustration?</div>
<div class="options">
<label class="option"><input type="radio" name="fr" value="inconsistent"> <label>Output quality is inconsistent</label></label>
<label class="option"><input type="radio" name="fr" value="slow"> <label>AI tools don't connect to our workflows</label></label>
<label class="option"><input type="radio" name="fr" value="training"> <label>Team doesn't know how to use AI effectively</label></label>
<label class="option"><input type="radio" name="fr" value="governance"> <label>No policies or guardrails in place</label></label>
<label class="option"><input type="radio" name="fr" value="roi"> <label>Can't measure what AI is actually doing for us</label></label>
</div>
</div>
<div class="q-block">
<div class="q-text">3. How large is the team that will use AI tools?</div>
<div class="options">
<label class="option"><input type="radio" name="sz" value="small"> <label>1-10 people</label></label>
<label class="option"><input type="radio" name="sz" value="mid"> <label>11-50 people</label></label>
<label class="option"><input type="radio" name="sz" value="large"> <label>51-200 people</label></label>
<label class="option"><input type="radio" name="sz" value="enterprise"> <label>200+ people</label></label>
</div>
</div>
<div class="q-block">
<div class="q-text">4. What best describes your compliance situation?</div>
<div class="options">
<label class="option"><input type="radio" name="comp" value="heavy"> <label>Heavy — SOC 2, HIPAA, or similar requirements</label></label>
<label class="option"><input type="radio" name="comp" value="moderate"> <label>Moderate — we have internal policies</label></label>
<label class="option"><input type="radio" name="comp" value="light"> <label>Light — startup, minimal requirements</label></label>
</div>
</div>
<div class="q-block">
<div class="q-text">5. What's your timeline for getting AI workflows in production?</div>
<div class="options">
<label class="option"><input type="radio" name="tl" value="now"> <label>Now — we have urgency</label></label>
<label class="option"><input type="radio" name="tl" value="quarter"> <label>This quarter</label></label>
<label class="option"><input type="radio" name="tl" value="year"> <label>Within the year</label></label>
<label class="option"><input type="radio" name="tl" value="exploring"> <label>Just exploring</label></label>
</div>
</div>
<button class="btn" style="width:100%;margin-top:.5rem" onclick="recommend()">See My Skill Recommendations</button>
</div>
<div id="recs" style="display:none">
<div style="font-size:16px;font-weight:600;color:#f1f5f9;margin-bottom:1rem" id="rec-title"></div>
<div id="rec-list"></div>
<div class="card" style="text-align:center;margin-top:1rem">
<div style="font-size:14px;color:#94a3b8;margin-bottom:.75rem">Get a full AI Setup Audit to see all gaps — not just the top ones.</div>
<button class="btn" onclick="window.open('https://audit.flashfusion.co','_blank')">Free AI Setup Audit</button>
</div>
</div>
</div>
<script>
var SKILL_MAP={{
content:["generating-social-posts","drafting-multi-format-content","producing-ai-newsletter"],
automation:["workflow-automation","orchestrating-ai-agents","task-decomposition"],
analysis:["applying-adversarial-review","code-auditor","task-decomposition"],
dev:["code-auditor","applying-sparc-methodology","engineering-staff-workflows","debug-like-expert"],
sales:["roi-calculator-building","ai-solution-architecture","generating-social-posts"],
inconsistent:["applying-adversarial-review","developing-skills"],
slow:["workflow-automation","orchestrating-ai-agents"],
training:["generating-kb-articles","drafting-multi-format-content"],
governance:["applying-adversarial-review","engineering-staff-workflows"],
roi:["roi-calculator-building","applying-adversarial-review"],
heavy:["engineering-staff-workflows","applying-adversarial-review"],
now:["ai-audit-delivery","enablement-sprint-planning"],
}};
var SKILL_DESC={{
"generating-social-posts":"Produces LinkedIn/X/Threads content in your brand voice — hook A/B/C variants, ready to post.",
"drafting-multi-format-content":"48 templates covering scripts, threads, carousels, and customer lifecycle emails.",
"workflow-automation":"Connects your SaaS tools via n8n, Zapier, or Make. Multi-step automation without code.",
"orchestrating-ai-agents":"Designs and deploys multi-agent systems using MCP, LangChain, or CrewAI.",
"applying-adversarial-review":"Every claim labeled sourced or generated. Flags agreement streaks. Anti-hallucination.",
"roi-calculator-building":"Builds B2B ROI models with payback period, net value, and executive narrative.",
"ai-solution-architecture":"Pre-sales technical architectures for AI/ML. Integration mapping, risk flags.",
"code-auditor":"Full codebase analysis: architecture, security, performance, tech debt.",
"applying-sparc-methodology":"Structured dev: Spec → Pseudocode → Architecture → Refinement → Completion.",
"engineering-staff-workflows":"Security-first staff engineer workflow. WSJF prioritization, threat modeling.",
"debug-like-expert":"Systematic root cause analysis with hypothesis testing.",
"generating-kb-articles":"Formatted .docx KB articles, SOPs, runbooks, onboarding guides.",
"task-decomposition":"Breaks complex multi-part requests into parallel workstreams.",
"producing-ai-newsletter":"Research, draft, edit, format, and deliver newsletter editions end-to-end.",
"developing-skills":"Creates and manages Claude skill packs per Anthropic March 2026 spec.",
"ai-audit-delivery":"Runs FF AI Setup Audits end-to-end — gap analysis, priority matrix, report.",
"enablement-sprint-planning":"Plans 5-week enablement sprints with milestones and client delivery checklist.",
}};
function recommend(){{
var uc=document.querySelector("input[name='uc']:checked");
var fr=document.querySelector("input[name='fr']:checked");
var comp=document.querySelector("input[name='comp']:checked");
var tl=document.querySelector("input[name='tl']:checked");
if(!uc||!fr){{alert("Please answer all questions.");return;}}
var picks={{}};
var score=function(skills,pri){{skills.forEach(function(s){{picks[s]=(picks[s]||0)+pri;}});}};
if(SKILL_MAP[uc.value]) score(SKILL_MAP[uc.value],3);
if(SKILL_MAP[fr.value]) score(SKILL_MAP[fr.value],2);
if(comp&&comp.value==="heavy") score(["engineering-staff-workflows","applying-adversarial-review"],2);
if(tl&&tl.value==="now") score(["ai-audit-delivery","enablement-sprint-planning"],3);
var sorted=Object.entries(picks).sort(function(a,b){{return b[1]-a[1]}}).slice(0,6);
document.getElementById("rec-title").textContent="Top "+sorted.length+" recommended skill packs for your team";
var el=document.getElementById("rec-list");el.innerHTML="";
sorted.forEach(function(pair,i){{
var s=pair[0],score=pair[1];
var pri=score>=5?"h":score>=3?"m":"l";
var priLabel=pri==="h"?"High priority":pri==="m"?"Medium priority":"Supporting";
var priClass="pri-"+(pri==="h"?"h":pri==="m"?"m":"l");
var d=document.createElement("div");d.className="rec-card";
d.innerHTML='<div class="rec-name">'+(i+1)+". "+s+'</div><div class="rec-reason">'+(SKILL_DESC[s]||"Production-ready Claude skill pack.")+'</div><div class="rec-priority '+priClass+'">'+priLabel+'</div>';
el.appendChild(d);
}});
document.getElementById("quiz").style.display="none";
document.getElementById("recs").style.display="block";
}}
document.querySelectorAll(".option").forEach(function(opt){{
opt.addEventListener("click",function(){{
var inp=opt.querySelector("input");
if(inp){{
inp.checked=true;
var name=inp.name;
document.querySelectorAll("input[name='"+name+"']").forEach(function(r){{
r.closest(".option").classList.remove("sel");
}});
opt.classList.add("sel");
}}
}});
}});
</script></body></html>"""

with open(f'{D}/13-skills-gap-detector.html','w') as f: f.write(f13)
print("13 done")

# ─── 14 ONBOARDING HUB ─────────────────────────────────────────────────────
f14 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Client Onboarding Hub</title><style>{BASE_CSS}
.step{{display:flex;gap:1rem;align-items:flex-start;padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.06)}}
.step:last-child{{border-bottom:none}}
.step-num{{width:32px;height:32px;border-radius:50%;background:rgba(124,58,237,.2);color:#a78bfa;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex-shrink:0}}
.step-num.done{{background:#7c3aed;color:#fff}}
.step-body{{flex:1}}
.step-title{{font-size:14px;font-weight:500;color:#e2e8f0;margin-bottom:.25rem}}
.step-desc{{font-size:13px;color:#64748b;margin-bottom:.5rem}}
.step-check{{display:flex;align-items:center;gap:.5rem;font-size:13px;color:#94a3b8;cursor:pointer}}
.step-check input{{accent-color:#7c3aed}}
.resource{{display:flex;align-items:center;gap:.75rem;padding:.6rem .875rem;background:#0d0a1a;border:1px solid rgba(124,58,237,.2);border-radius:8px;margin-bottom:.5rem}}
.resource-icon{{font-size:18px}}
.resource-name{{font-size:13px;color:#e2e8f0}}
.resource-desc{{font-size:11px;color:#64748b}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Client Onboarding Hub</h1>
<p class="sub">Everything you need to get started — in one place.</p>
<div class="card"><div class="ct">Your Engagement</div>
<div class="g3">
<div class="mcard"><div class="mlbl">Service</div><div class="mval" style="font-size:14px;color:#f1f5f9" id="svc-type">Enablement Sprint</div></div>
<div class="mcard"><div class="mlbl">Your contact</div><div class="mval" style="font-size:14px;color:#a78bfa">Kyle Rosebrook</div></div>
<div class="mcard"><div class="mlbl">Kickoff call</div><div class="mval" style="font-size:14px;color:#34d399" id="kickoff-date">TBD</div></div>
</div>
</div>
<div class="card"><div class="ct">Getting Started — Checklist</div>
<div id="steps"></div>
</div>
<div class="card"><div class="ct">Resources</div>
<div class="resource"><div class="resource-icon">📋</div><div><div class="resource-name">AI Setup Audit</div><div class="resource-desc">audit.flashfusion.co — start here if not yet complete</div></div></div>
<div class="resource"><div class="resource-icon">📧</div><div><div class="resource-name">Direct contact</div><div class="resource-desc">kyle@flashfusion.co — response within 24hr business hours</div></div></div>
<div class="resource"><div class="resource-icon">📅</div><div><div class="resource-name">Schedule time</div><div class="resource-desc">calendly.com/flashfusion — book calls directly</div></div></div>
<div class="resource"><div class="resource-icon">📚</div><div><div class="resource-name">Skills Library</div><div class="resource-desc">25 production-ready Claude skill packs — your team's toolkit</div></div></div>
</div>
<div class="card"><div class="ct">What to Expect — Week by Week</div>
<div style="font-size:13px;color:#94a3b8;line-height:1.7">
<strong style="color:#e2e8f0">Week 1:</strong> Audit and discovery. We learn your stack, workflows, and biggest pain points.<br>
<strong style="color:#e2e8f0">Week 2:</strong> Skill pack selection and configuration. We match and configure the right skills for your team.<br>
<strong style="color:#e2e8f0">Week 3:</strong> Pilot deployment. Small group tests in real workflows. We collect feedback and fix friction.<br>
<strong style="color:#e2e8f0">Week 4:</strong> Full rollout and training. Everyone onboarded. Team training session delivered.<br>
<strong style="color:#e2e8f0">Week 5:</strong> Measurement and handoff. ROI summary, sprint report, and next steps.
</div>
</div>
</div>
<script>
var STEPS=[
{{title:"Sign and return the SOW",desc:"Check your email for the Statement of Work. Sign and return within 2 business days.",check:"SOW signed and returned"}},
{{title:"Complete the client intake form",desc:"15 questions about your team, tools, and use cases. Takes about 10 minutes.",check:"Intake form submitted"}},
{{title:"Confirm kickoff call timing",desc:"Reply to the calendar invite or book at calendly.com/flashfusion.",check:"Kickoff call confirmed"}},
{{title:"Share access to your Claude environment",desc:"Admin access needed to deploy skill packs. Instructions provided in the intake form.",check:"Claude environment access shared"}},
{{title:"Identify your internal champion",desc:"One person on your team who will help with pilot testing and team comms.",check:"Champion identified and introduced"}},
];
var checks=STEPS.map(function(){{return false;}});
var el=document.getElementById("steps");
STEPS.forEach(function(s,i){{
var d=document.createElement("div");d.className="step";
d.innerHTML='<div class="step-num" id="sn'+i+'">'+( i+1)+'</div><div class="step-body"><div class="step-title">'+s.title+'</div><div class="step-desc">'+s.desc+'</div><label class="step-check"><input type="checkbox" id="sc'+i+'" onchange="toggle('+i+',this.checked)"> '+s.check+'</label></div>';
el.appendChild(d);
}});
function toggle(i,v){{
checks[i]=v;
var sn=document.getElementById("sn"+i);
sn.className="step-num"+(v?" done":"");
}}
document.getElementById("kickoff-date").textContent=new Date(Date.now()+7*86400000).toLocaleDateString("en-US",{{month:"short",day:"numeric",year:"numeric"}});
</script></body></html>"""

with open(f'{D}/14-onboarding-hub.html','w') as f: f.write(f14)
print("14 done")

# ─── 15 AGENT BUILDER UI ─────────────────────────────────────────────────────
f15 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Agent Builder UI</title><style>{BASE_CSS}
.ab-section{{margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid rgba(255,255,255,.06)}}
.ab-section:last-child{{border-bottom:none;margin-bottom:0}}
.tag{{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:99px;font-size:12px;background:rgba(124,58,237,.15);color:#a78bfa;border:1px solid rgba(124,58,237,.3);cursor:pointer;margin:2px}}
.tag.on{{background:#7c3aed;color:#fff;border-color:#7c3aed}}
.spec-output{{background:#0d0a1a;border:1px solid rgba(124,58,237,.3);border-radius:10px;padding:1.25rem;white-space:pre-wrap;font-size:13px;color:#cbd5e1;line-height:1.7;display:none;margin-top:1rem;font-family:monospace}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Agent Builder UI</h1>
<p class="sub">Compose an agent spec. Generates an n8n/Claude agent blueprint.</p>
<div class="card">
<div class="ab-section">
<div class="ct">Trigger</div>
<div class="field"><label>What kicks this agent off?</label>
<select id="trigger">
<option value="form">Form submission (e.g. audit scorecard)</option>
<option value="email">Incoming email</option>
<option value="schedule">Scheduled (daily / weekly)</option>
<option value="webhook">Webhook from another system</option>
<option value="manual">Manual / on-demand</option>
<option value="crm">CRM event (new lead, stage change)</option>
</select>
</div>
</div>
<div class="ab-section">
<div class="ct">Tools the Agent Can Use</div>
<div id="tools-grid" style="margin-bottom:.5rem"></div>
<div style="font-size:12px;color:#64748b">Click to toggle. Selected tools are included in the spec.</div>
</div>
<div class="ab-section">
<div class="ct">Goal and Output</div>
<div class="field"><label>What should this agent accomplish?</label>
<textarea id="goal" rows="3" placeholder="e.g. When an audit scorecard is submitted, analyze the gaps, draft a proposal, and notify me in Slack with a summary and the proposal link."></textarea>
</div>
<div class="field"><label>Primary output</label>
<select id="output">
<option value="doc">Document (proposal, report, guide)</option>
<option value="notification">Notification (Slack, email)</option>
<option value="crm">CRM record update</option>
<option value="calendar">Calendar event or meeting prep</option>
<option value="data">Structured data / database entry</option>
</select>
</div>
</div>
<div class="ab-section">
<div class="ct">Guardrails</div>
<div class="field"><label>What should this agent never do?</label>
<textarea id="guardrails" rows="2" placeholder="e.g. Never send external emails without human review. Never access client data beyond the submitted form."></textarea>
</div>
<div class="field"><label>Human-in-the-loop?</label>
<select id="hitl">
<option value="always">Always — human reviews before any action</option>
<option value="notify">Notify only — agent acts, human is informed</option>
<option value="exception">Exception only — human reviews if confidence is low</option>
<option value="none">None — fully automated</option>
</select>
</div>
</div>
<button class="btn" style="width:100%" onclick="buildSpec()">Generate Agent Spec</button>
<div class="spec-output" id="spec"></div>
<button class="btn btn-ghost" id="cpspec" style="width:100%;display:none;margin-top:.75rem" onclick="copySpec()">Copy Spec</button>
</div>
</div>
<script>
var TOOLS=["Claude (AI reasoning)","n8n (workflow engine)","Gmail","Google Drive","Notion","HubSpot CRM","Slack","Apollo.io","Stripe","Google Calendar","Airtable","Linear","GitHub","PostHog","Supabase"];
var selected=new Set(["Claude (AI reasoning)","n8n (workflow engine)","Notion","Slack"]);
var grid=document.getElementById("tools-grid");
TOOLS.forEach(function(t){{
var btn=document.createElement("button");
btn.className="tag"+(selected.has(t)?" on":"");btn.textContent=t;
btn.onclick=function(){{
if(selected.has(t)){{selected.delete(t);btn.classList.remove("on");}}
else{{selected.add(t);btn.classList.add("on");}}
}};
grid.appendChild(btn);
}});
var TRIGGER_MAP={{form:"Form submission",email:"Incoming email",schedule:"Scheduled run",webhook:"Inbound webhook",manual:"Manual trigger",crm:"CRM event"}};
var OUTPUT_MAP={{doc:"Document generation",notification:"Notification dispatch",crm:"CRM update",calendar:"Calendar/scheduling",data:"Database entry"}};
var HITL_MAP={{always:"Full human review before any action",notify:"Agent acts, human notified",exception:"Human review on low-confidence outputs only",none:"Fully automated — no human in loop"}};
function buildSpec(){{
var trigger=document.getElementById("trigger").value;
var goal=document.getElementById("goal").value||"[Define the agent goal]";
var output=document.getElementById("output").value;
var guardrails=document.getElementById("guardrails").value||"None specified";
var hitl=document.getElementById("hitl").value;
var toolList=Array.from(selected).join(", ")||"None selected";
var spec="FLASHFUSION AGENT SPECIFICATION\\n";
spec+="══════════════════════════════════════════════════\\n\\n";
spec+="TRIGGER\\n──────────────────────────────────────────\\n";
spec+=TRIGGER_MAP[trigger]+"\\n\\n";
spec+="TOOLS\\n──────────────────────────────────────────\\n";
spec+=toolList+"\\n\\n";
spec+="GOAL\\n──────────────────────────────────────────\\n";
spec+=goal+"\\n\\n";
spec+="PRIMARY OUTPUT\\n──────────────────────────────────────────\\n";
spec+=OUTPUT_MAP[output]+"\\n\\n";
spec+="GUARDRAILS\\n──────────────────────────────────────────\\n";
spec+=guardrails+"\\n\\n";
spec+="HUMAN-IN-THE-LOOP\\n──────────────────────────────────────────\\n";
spec+=HITL_MAP[hitl]+"\\n\\n";
spec+="SUGGESTED N8N WORKFLOW STRUCTURE\\n──────────────────────────────────────────\\n";
spec+="1. "+TRIGGER_MAP[trigger]+" → validate inputs\\n";
spec+="2. Route to Claude for analysis/reasoning\\n";
spec+="3. Execute primary action ("+OUTPUT_MAP[output]+")\\n";
if(hitl!=="none") spec+="4. Human review gate → approve/reject\\n";
spec+="5. Dispatch notification → Slack/email\\n";
spec+="6. Log to Notion/Drive for audit trail\\n\\n";
spec+="NEXT STEP: Build this workflow in n8n at krosebrook.app.n8n.cloud";
document.getElementById("spec").textContent=spec;
document.getElementById("spec").style.display="block";
document.getElementById("cpspec").style.display="block";
}}
function copySpec(){{
navigator.clipboard.writeText(document.getElementById("spec").textContent).then(function(){{
cpspec.textContent="Copied!";setTimeout(function(){{cpspec.textContent="Copy Spec"}},2000);
}});
}}
</script></body></html>"""

with open(f'{D}/15-agent-builder-ui.html','w') as f: f.write(f15)
print("15 done")

# ─── 16 CHAOS CLUB DAILY DISPATCH ────────────────────────────────────────────
f16 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>Chaos Club — Daily Dispatch Generator</title><style>{BASE_CSS.replace('#7c3aed','#e11d48').replace('#a78bfa','#fb7185').replace('rgba(124,58,237','rgba(225,29,72')}
.dispatch-out{{background:#0d0a1a;border:1px solid rgba(225,29,72,.3);border-radius:10px;padding:1.5rem;white-space:pre-wrap;font-size:13px;color:#cbd5e1;line-height:1.8;display:none;margin-top:1rem}}
</style></head><body><div class="w">
<div class="brand" style="color:#e11d48">Chaos Club Co.</div>
<h1>Daily Dispatch Generator</h1>
<p class="sub">Generate peer support content for Chaos Club members. No pretending required.</p>
<div class="card"><div class="ct">Today's Dispatch</div>
<div class="g2">
<div class="field"><label>Date</label><input id="dt" type="date"></div>
<div class="field"><label>Theme</label>
<select id="theme">
<option value="accountability">Accountability without shame</option>
<option value="chaos">Embracing the chaos</option>
<option value="progress">Progress over perfection</option>
<option value="connection">You belong here</option>
<option value="reset">Starting over (again)</option>
<option value="energy">Managing your energy</option>
<option value="hard">When it's just hard</option>
</select>
</div>
</div>
<div class="field"><label>Tone today</label>
<select id="tone">
<option value="honest">Honest and direct</option>
<option value="warm">Warm and grounding</option>
<option value="sharp">Sharp and no-BS</option>
<option value="quiet">Quiet and steady</option>
</select>
</div>
<div class="field"><label>Optional: real signal from the community (what people are feeling)</label>
<textarea id="signal" rows="2" placeholder="e.g. A lot of people posting about feeling behind this week."></textarea>
</div>
</div>
<button class="btn" style="width:100%;background:#e11d48;margin-bottom:.5rem" onclick="generate()">Generate Today's Dispatch</button>
<div class="loading" style="display:none;color:#fb7185;font-size:14px;text-align:center;padding:.5rem" id="load">Generating with Claude...</div>
<div class="dispatch-out" id="out"></div>
<button class="btn btn-ghost" id="cp" style="width:100%;display:none;margin-top:.75rem;border-color:rgba(225,29,72,.4);color:#fb7185" onclick="copy()">Copy Dispatch</button>
</div>
</div>
<script>
var FALLBACKS={{
accountability:"Some days accountability feels like a punishment. It isn't. It's just a mirror. You're not failing — you're looking at where you actually are. That's the only place anything real starts.\\n\\nToday: one honest look. Not at where you should be. At where you are. That's enough.",
chaos:"The chaos isn't the problem. The pretending isn't the problem either — except it costs you energy you don't have. Today, try naming one thing that's actually chaotic instead of managing around it. You belong here even on the messy days.",
progress:"Progress doesn't always feel like progress. Sometimes it just feels like getting through the next hour. That counts. It has always counted.\\n\\nOne small thing forward today. That's the whole ask.",
connection:"You don't have to earn your place here by being okay. That's not how this works. The Club is for when you're not okay. Especially then.",
reset:"Starting over is not failure. It is the move. Again. Whatever happened before this moment — you can begin from here.",
energy:"Your energy is a resource. Not a character flaw when it's low. Today: what drains it, what restores it. One of each. That's the whole equation.",
hard:"Some days just are. No reframe makes it not hard. You don't have to turn this into a lesson. You're allowed to just move through it."
}};
document.getElementById("dt").value=new Date().toISOString().split("T")[0];
async function generate(){{
var theme=document.getElementById("theme").value;
var tone=document.getElementById("tone").value;
var signal=document.getElementById("signal").value;
var date=document.getElementById("dt").value;
var prompt="You are writing the Daily Dispatch for Chaos Club Co., a peer support platform with the philosophy: no masks required, no pretending, everyone belongs. Write a short daily message (150-200 words) with this theme: "+theme+". Tone: "+tone+". "+( signal?"Community signal: "+signal+".")+" Voice rules: direct, human, no recovery language, no toxic positivity, no 'you've got this' clichés. Write for someone who is having a genuinely hard day and needs to feel less alone — not more motivated. End with one small, specific, doable thing.";
document.getElementById("load").style.display="block";
document.getElementById("out").style.display="none";
document.getElementById("cp").style.display="none";
try{{
var resp=await fetch("https://api.anthropic.com/v1/messages",{{
method:"POST",headers:{{"Content-Type":"application/json"}},
body:JSON.stringify({{model:"claude-sonnet-4-20250514",max_tokens:500,messages:[{{role:"user",content:prompt}}]}})
}});
var data=await resp.json();
var text=data.content&&data.content[0]&&data.content[0].text?data.content[0].text:FALLBACKS[theme];
document.getElementById("out").textContent="CHAOS CLUB — DAILY DISPATCH\\n"+date+"\\n\\n"+text+"\\n\\n— The Club";
}}catch(e){{
document.getElementById("out").textContent="CHAOS CLUB — DAILY DISPATCH\\n"+date+"\\n\\n"+FALLBACKS[theme]+"\\n\\n— The Club";
}}
document.getElementById("load").style.display="none";
document.getElementById("out").style.display="block";
document.getElementById("cp").style.display="block";
}}
function copy(){{
navigator.clipboard.writeText(document.getElementById("out").textContent).then(function(){{
cp.textContent="Copied!";setTimeout(function(){{cp.textContent="Copy Dispatch"}},2000);
}});
}}
</script></body></html>"""

with open(f'{D}/16-chaos-club-daily-dispatch.html','w') as f: f.write(f16)
print("16 done")

print("\nAll 16 artifacts complete.")
print("\nListing files:")
files = sorted(os.listdir(D))
for f in files:
    if f.endswith('.html'):
        size = os.path.getsize(f'{D}/{f}')
        print(f"  {f} ({size:,} bytes)")
