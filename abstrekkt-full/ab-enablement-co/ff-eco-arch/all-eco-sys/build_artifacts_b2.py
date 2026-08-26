import os
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
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem}
.field{margin-bottom:.75rem}
label{font-size:12px;color:#94a3b8;display:block;margin-bottom:.4rem}
input,select,textarea{width:100%;background:#0d0a1a;border:1px solid rgba(124,58,237,.3);border-radius:6px;color:#f1f5f9;padding:.5rem .75rem;font-size:13px;font-family:system-ui}
input:focus,select:focus{outline:none;border-color:#7c3aed}
.btn{padding:.75rem 1.5rem;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer}
.btn:hover{background:#6d28d9}
.btn-ghost{background:transparent;border:1px solid rgba(124,58,237,.4);color:#a78bfa}
.badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:500}
.badge-green{background:rgba(16,185,129,.15);color:#34d399;border:1px solid rgba(16,185,129,.25)}
.badge-amber{background:rgba(245,158,11,.15);color:#fbbf24;border:1px solid rgba(245,158,11,.25)}
.badge-red{background:rgba(239,68,68,.15);color:#f87171;border:1px solid rgba(239,68,68,.25)}
.badge-purple{background:rgba(124,58,237,.2);color:#a78bfa;border:1px solid rgba(124,58,237,.3)}
.badge-blue{background:rgba(59,130,246,.15);color:#93c5fd;border:1px solid rgba(59,130,246,.25)}
table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;padding:.5rem .75rem;border-bottom:1px solid rgba(124,58,237,.15)}
td{padding:.6rem .75rem;border-bottom:1px solid rgba(255,255,255,.05);color:#cbd5e1;vertical-align:top}
tr:hover td{background:rgba(124,58,237,.04)}
.mcard{background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.2);border-radius:8px;padding:.875rem}
.mlbl{font-size:11px;color:#64748b;margin-bottom:.3rem}
.mval{font-size:22px;font-weight:600}
.msub{font-size:10px;color:#475569;margin-top:.2rem}"""

# ─── 06 AUDIT REPORT GENERATOR ─────────────────────────────────────────────
f06 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Audit Report Generator</title><style>{BASE_CSS}
#report{{background:#0d0a1a;border:1px solid rgba(124,58,237,.3);border-radius:10px;padding:1.5rem;display:none;white-space:pre-wrap;font-size:13px;color:#cbd5e1;line-height:1.7;font-family:system-ui;margin-top:1rem}}
.gap-row{{display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem}}
.gap-row input[type=checkbox]{{accent-color:#7c3aed;width:16px;height:16px;flex-shrink:0}}
.gap-label{{font-size:13px;color:#cbd5e1}}
.sev{{font-size:11px;padding:1px 7px;border-radius:99px}}
.sev-h{{background:rgba(239,68,68,.2);color:#f87171;border:1px solid rgba(239,68,68,.3)}}
.sev-m{{background:rgba(245,158,11,.2);color:#fbbf24;border:1px solid rgba(245,158,11,.3)}}
.sev-l{{background:rgba(16,185,129,.2);color:#34d399;border:1px solid rgba(16,185,129,.3)}}
.slider-row{{display:flex;align-items:center;gap:.75rem}}
.slider-row input[type=range]{{flex:1;accent-color:#7c3aed}}
.sval{{font-size:14px;font-weight:600;color:#a78bfa;min-width:24px}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>AI Setup Audit Report Generator</h1>
<p class="sub">Score the client's setup — generates a formatted audit report.</p>
<div class="card"><div class="ct">Client</div>
<div class="g2">
<div class="field"><label>Company</label><input id="co" placeholder="Acme Corp"></div>
<div class="field"><label>Auditor</label><input id="aud" value="Kyle Rosebrook — FlashFusion"></div>
</div>
<div class="g2">
<div class="field"><label>Audit date</label><input id="dt" type="date"></div>
<div class="field"><label>Primary use case</label><input id="uc" placeholder="e.g. Support ticket triage, document drafting"></div>
</div>
</div>
<div class="card"><div class="ct">Dimension Scores (1–10)</div>
<div id="dims"></div>
</div>
<div class="card"><div class="ct">Gaps Identified</div>
<div id="gaps"></div>
</div>
<div class="card"><div class="ct">Recommended Actions</div>
<div class="field"><label>Top recommendation</label><input id="rec1" placeholder="e.g. Deploy 5 core skill packs for the support team"></div>
<div class="field"><label>Second recommendation</label><input id="rec2" placeholder="e.g. Establish prompt governance policy"></div>
<div class="field"><label>Third recommendation</label><input id="rec3" placeholder="e.g. Set up usage tracking with PostHog"></div>
<div class="field"><label>Recommended next step</label>
<select id="next"><option value="audit">Full Enablement Sprint — $5,000</option><option value="retainer">Managed Retainer — $2,000/mo</option><option value="custom">Custom skill development</option><option value="none">No immediate commercial next step</option></select>
</div>
</div>
<button class="btn" style="width:100%;margin-bottom:1rem" onclick="generate()">Generate Audit Report</button>
<div id="report"></div>
<button class="btn btn-ghost" id="cb" style="width:100%;display:none;margin-top:.75rem" onclick="copy()">Copy Report</button>
</div>
<script>
var DIMS=[
{{id:"tools",name:"Tool selection fit",desc:"Are the right AI tools chosen for the use case?"}},
{{id:"prompts",name:"Prompt quality",desc:"Are prompts structured, specific, and consistent?"}},
{{id:"skills",name:"Skill deployment",desc:"Are skill packs or custom instructions in use?"}},
{{id:"governance",name:"Governance and policy",desc:"Are there usage policies, guardrails, and approval flows?"}},
{{id:"training",name:"Team training",desc:"Does the team know how to use AI tools effectively?"}},
{{id:"measurement",name:"Measurement",desc:"Are time savings and ROI being tracked?"}},
{{id:"integration",name:"Stack integration",desc:"Are AI tools connected to existing workflows and systems?"}},
{{id:"security",name:"Data security",desc:"Is sensitive data handled according to policy?"}},
]
var scores={{}};
var el=document.getElementById("dims");
DIMS.forEach(function(d){{
scores[d.id]=5;
var row=document.createElement("div");row.style.marginBottom="1rem";
row.innerHTML='<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.3rem"><span style="font-size:13px;font-weight:500;color:#e2e8f0">'+d.name+'</span><span style="font-size:12px;color:#64748b">— '+d.desc+'</span></div><div class="slider-row"><input type="range" min="1" max="10" value="5" oninput="setScore(\\'' + d.id + '\\',this.value,this.nextElementSibling)"><span class="sval">5</span><span style="font-size:12px;color:#64748b">/10</span></div>';
el.appendChild(row);
}});
function setScore(id,v,el){{scores[id]=+v;el.textContent=v;}}
var GAPS=[
{{label:"No skill packs deployed",sev:"h"}},{{label:"Prompts are ad-hoc and inconsistent",sev:"h"}},
{{label:"No usage policy in place",sev:"h"}},{{label:"No measurement or ROI tracking",sev:"m"}},
{{label:"AI tools not connected to workflows",sev:"m"}},{{label:"Team has not been trained",sev:"m"}},
{{label:"Tool selection not optimized for use case",sev:"m"}},{{label:"Data handling policy unclear",sev:"h"}},
{{label:"No governance or approval flows",sev:"l"}},{{label:"Prompt library not maintained",sev:"l"}},
];
var gapEl=document.getElementById("gaps");
var gapChecks={{}};
GAPS.forEach(function(g,i){{
gapChecks[i]=false;
var sevClass="sev-"+(g.sev==="h"?"h":g.sev==="m"?"m":"l");
var sevLabel=g.sev==="h"?"High":g.sev==="m"?"Medium":"Low";
var row=document.createElement("div");row.className="gap-row";
row.innerHTML='<input type="checkbox" id="g'+i+'" onchange="gapChecks['+i+']=this.checked"><label class="gap-label" for="g'+i+'">'+g.label+'</label><span class="sev '+sevClass+'">'+sevLabel+'</span>';
gapEl.appendChild(row);
}});
function generate(){{
var co=document.getElementById("co").value||"[Company]";
var aud=document.getElementById("aud").value;
var dt=document.getElementById("dt").value;
var uc=document.getElementById("uc").value||"[Use case]";
var total=Object.values(scores).reduce(function(a,b){{return a+b}},0);
var max=DIMS.length*10;
var pct=Math.round(total/max*100);
var level=pct>=80?"Strong":pct>=60?"Developing":pct>=40?"Early-stage":"Critical gaps";
var gapsList=GAPS.filter(function(g,i){{return gapChecks[i]}}).map(function(g){{
return "  ["+((g.sev==="h")?"HIGH":(g.sev==="m")?"MED":"LOW")+"] "+g.label;
}}).join("\\n")||"  None identified";
var recs=["  1. "+(rec1.value||"[Add recommendation]"),"  2. "+(rec2.value||"[Add recommendation]"),"  3. "+(rec3.value||"[Add recommendation]")].join("\\n");
var out="FLASHFUSION — AI SETUP AUDIT REPORT\\n";
out+="══════════════════════════════════════════════════\\n";
out+="Company: "+co+"\\nAuditor: "+aud+"\\nDate: "+dt+"\\nUse case: "+uc+"\\n\\n";
out+="OVERALL AI READINESS SCORE: "+total+"/"+max+" ("+pct+"%) — "+level+"\\n\\n";
out+="──────────────────────────────────────────────────\\n";
out+="DIMENSION SCORES\\n──────────────────────────────────────────────────\\n";
DIMS.forEach(function(d){{out+="  "+d.name.padEnd(30)+scores[d.id]+"/10\\n";}});
out+="\\n──────────────────────────────────────────────────\\n";
out+="GAPS IDENTIFIED\\n──────────────────────────────────────────────────\\n";
out+=gapsList+"\\n\\n";
out+="──────────────────────────────────────────────────\\n";
out+="RECOMMENDATIONS\\n──────────────────────────────────────────────────\\n";
out+=recs+"\\n\\n";
out+="RECOMMENDED NEXT STEP: "+document.getElementById("next").options[document.getElementById("next").selectedIndex].text+"\\n\\n";
out+="──────────────────────────────────────────────────\\n";
out+="Questions: kyle@flashfusion.co | audit.flashfusion.co";
document.getElementById("report").textContent=out;
document.getElementById("report").style.display="block";
document.getElementById("cb").style.display="block";
}}
function copy(){{
navigator.clipboard.writeText(document.getElementById("report").textContent).then(function(){{
cb.textContent="Copied!";setTimeout(function(){{cb.textContent="Copy Report"}},2000);
}});
}}
document.getElementById("dt").value=new Date().toISOString().split("T")[0];
</script></body></html>"""

with open(f'{D}/06-audit-report-generator.html','w') as f: f.write(f06)
print("06 done")

# ─── 07 PIPELINE DASHBOARD ──────────────────────────────────────────────────
f07 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Pipeline Dashboard</title><style>{BASE_CSS}
.stage{{text-align:center;padding:.75rem;border-radius:8px;border:1px solid rgba(124,58,237,.2);cursor:pointer}}
.stage.active{{border-color:#7c3aed;background:rgba(124,58,237,.12)}}
.stage-num{{font-size:22px;font-weight:700;color:#a78bfa}}
.stage-lbl{{font-size:11px;color:#64748b;margin-top:.2rem}}
.add-form{{display:flex;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap}}
.add-form input,.add-form select{{flex:1;min-width:140px}}
.pipe-table{{width:100%;border-collapse:collapse}}
.pipe-table th{{text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;padding:.5rem .75rem;border-bottom:1px solid rgba(124,58,237,.15)}}
.pipe-table td{{padding:.625rem .75rem;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px;color:#cbd5e1}}
.pipe-table tr:hover td{{background:rgba(124,58,237,.04)}}
.del-btn{{background:none;border:none;color:#475569;cursor:pointer;font-size:16px;padding:0 4px}}
.del-btn:hover{{color:#f87171}}
.move-btn{{background:none;border:1px solid rgba(124,58,237,.3);color:#a78bfa;cursor:pointer;font-size:11px;padding:2px 6px;border-radius:4px}}
.move-btn:hover{{background:rgba(124,58,237,.15)}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Pipeline Dashboard</h1>
<p class="sub">Track prospects from first contact to closed. $222K Y1 target.</p>
<div class="card g4" id="stages"></div>
<div class="card" style="margin-top:-.25rem">
<div class="ct">Add Prospect</div>
<div class="add-form">
<input id="pname" placeholder="Company name">
<input id="pcont" placeholder="Contact name">
<select id="pstage"><option value="0">Lead</option><option value="1">Qualified</option><option value="2">Proposal sent</option><option value="3">Negotiating</option><option value="4">Closed</option></select>
<select id="pprod"><option value="4500">Audit — $4,500</option><option value="5000">Sprint — $5,000</option><option value="24000">Retainer — $2K/mo (12mo)</option><option value="0">TBD</option></select>
<button class="btn" onclick="addProspect()">Add</button>
</div>
<table class="pipe-table"><thead><tr><th>Company</th><th>Contact</th><th>Stage</th><th>Value</th><th>Added</th><th></th></tr></thead>
<tbody id="ptbl"></tbody></table>
<div id="empty" style="text-align:center;padding:2rem;color:#475569;font-size:14px">No prospects yet — add one above</div>
</div>
<div class="card"><div class="ct">Target Tracking</div>
<div class="g3">
<div class="mcard"><div class="mlbl">Y1 Target</div><div class="mval" style="color:#f1f5f9">$222,000</div></div>
<div class="mcard"><div class="mlbl">Pipeline value</div><div class="mval" id="pval" style="color:#a78bfa">$0</div></div>
<div class="mcard"><div class="mlbl">Closed (won)</div><div class="mval" id="pclose" style="color:#34d399">$0</div></div>
</div>
</div>
</div>
<script>
var STAGES=["Lead","Qualified","Proposal sent","Negotiating","Closed won"];
var STAGE_COLORS=["badge-blue","badge-purple","badge-amber","badge-amber","badge-green"];
var prospects=[];
var el=document.getElementById("stages");
STAGES.forEach(function(s,i){{
var d=document.createElement("div");d.className="stage";d.id="st"+i;
d.innerHTML='<div class="stage-num" id="sn'+i+'">0</div><div class="stage-lbl">'+s+'</div>';
el.appendChild(d);
}});
function addProspect(){{
var n=document.getElementById("pname").value.trim();
if(!n) return;
prospects.push({{
id:Date.now(),name:n,contact:document.getElementById("pcont").value,
stage:+document.getElementById("pstage").value,
value:+document.getElementById("pprod").value,
date:new Date().toLocaleDateString()
}});
document.getElementById("pname").value="";document.getElementById("pcont").value="";
render();
}}
function advance(id){{
var p=prospects.find(function(x){{return x.id===id}});
if(p&&p.stage<4){{p.stage++;render();}}
}}
function remove(id){{
prospects=prospects.filter(function(x){{return x.id!==id}});render();
}}
function render(){{
var counts=[0,0,0,0,0],pipeline=0,closed=0;
prospects.forEach(function(p){{
counts[p.stage]++;
if(p.stage<4) pipeline+=p.value;
if(p.stage===4) closed+=p.value;
}});
counts.forEach(function(c,i){{document.getElementById("sn"+i).textContent=c;}});
document.getElementById("pval").textContent="$"+pipeline.toLocaleString();
document.getElementById("pclose").textContent="$"+closed.toLocaleString();
var tbl=document.getElementById("ptbl");tbl.innerHTML="";
document.getElementById("empty").style.display=prospects.length?"none":"block";
prospects.forEach(function(p){{
var tr=document.createElement("tr");
tr.innerHTML='<td style="font-weight:500;color:#e2e8f0">'+p.name+'</td><td>'+p.contact+'</td><td><span class="badge '+STAGE_COLORS[p.stage]+'">'+STAGES[p.stage]+'</span></td><td style="color:#a78bfa">'+( p.value?"$"+p.value.toLocaleString():"TBD")+'</td><td style="color:#64748b">'+p.date+'</td><td><button class="move-btn" onclick="advance('+p.id+')" title="Advance stage">→</button> <button class="del-btn" onclick="remove('+p.id+')" title="Remove">×</button></td>';
tbl.appendChild(tr);
}});
}}
render();
</script></body></html>"""

with open(f'{D}/07-pipeline-dashboard.html','w') as f: f.write(f07)
print("07 done")

# ─── 08 REVENUE TRACKER ─────────────────────────────────────────────────────
f08 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Revenue Tracker</title><style>{BASE_CSS}
.prog-wrap{{background:#1a1a2e;border-radius:8px;overflow:hidden;height:10px;margin:.5rem 0}}
.prog{{height:100%;border-radius:8px;background:linear-gradient(90deg,#7c3aed,#06b6d4);transition:width .4s}}
.rev-row{{display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem}}
.rev-row input{{width:100%;background:#0d0a1a;border:1px solid rgba(124,58,237,.3);border-radius:6px;color:#f1f5f9;padding:.4rem .65rem;font-size:13px}}
.rev-row select{{background:#0d0a1a;border:1px solid rgba(124,58,237,.3);border-radius:6px;color:#f1f5f9;padding:.4rem .65rem;font-size:13px}}
.rev-row .del{{background:none;border:none;color:#475569;cursor:pointer;font-size:16px}}
.rev-row .del:hover{{color:#f87171}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Revenue Tracker</h1>
<p class="sub">Log every invoice and contract. $222K Y1 target.</p>
<div class="g3 card">
<div class="mcard"><div class="mlbl">Y1 target</div><div class="mval" style="color:#f1f5f9">$222,000</div><div class="msub">100% = done</div></div>
<div class="mcard"><div class="mlbl">Invoiced (YTD)</div><div class="mval" id="ytd" style="color:#a78bfa">$0</div><div class="msub" id="ytdpct">0% of target</div></div>
<div class="mcard"><div class="mlbl">Collected</div><div class="mval" id="col" style="color:#34d399">$0</div><div class="msub" id="mrr">$0 MRR from retainers</div></div>
</div>
<div class="card"><div class="ct">Progress to Target</div>
<div class="prog-wrap"><div class="prog" id="progbar" style="width:0%"></div></div>
<div style="font-size:12px;color:#64748b;margin-top:.3rem" id="progtext">$0 of $222,000</div>
</div>
<div class="card"><div class="ct">Add Revenue Entry</div>
<div class="g2" style="margin-bottom:.75rem">
<input id="client" placeholder="Client / company">
<select id="type"><option value="audit">Audit — $4,500</option><option value="sprint">Sprint — $5,000</option><option value="retainer">Retainer — $2,000/mo</option><option value="custom">Custom amount</option></select>
</div>
<div class="g2" style="margin-bottom:.75rem">
<input id="amt" type="number" placeholder="Amount ($)" value="4500">
<input id="invdate" type="date">
</div>
<div class="g2" style="margin-bottom:.75rem">
<select id="status"><option value="invoiced">Invoiced</option><option value="collected">Collected</option></select>
<input id="note" placeholder="Note (optional)">
</div>
<button class="btn" onclick="add()">Add Entry</button>
</div>
<div class="card">
<div class="ct">Revenue Log</div>
<table><thead><tr><th>Client</th><th>Type</th><th>Amount</th><th>Date</th><th>Status</th><th>Note</th><th></th></tr></thead>
<tbody id="rtbl"></tbody></table>
<div id="rempty" style="text-align:center;padding:2rem;color:#475569;font-size:14px">No revenue logged yet</div>
</div>
</div>
<script>
var entries=[];
var TYPE_LABELS={{audit:"Audit",sprint:"Sprint",retainer:"Retainer",custom:"Custom"}};
document.getElementById("type").addEventListener("change",function(){{
var map={{audit:4500,sprint:5000,retainer:2000,custom:""}}
document.getElementById("amt").value=map[this.value];
}});
document.getElementById("invdate").value=new Date().toISOString().split("T")[0];
function add(){{
var client=document.getElementById("client").value.trim();
if(!client) return alert("Enter a client name.");
entries.push({{id:Date.now(),client:client,type:document.getElementById("type").value,
amt:+document.getElementById("amt").value,date:document.getElementById("invdate").value,
status:document.getElementById("status").value,note:document.getElementById("note").value}});
document.getElementById("client").value="";document.getElementById("note").value="";
render();
}}
function remove(id){{entries=entries.filter(function(e){{return e.id!==id}});render();}}
function render(){{
var ytd=0,col=0,mrr=0;
entries.forEach(function(e){{ytd+=e.amt;if(e.status==="collected") col+=e.amt;if(e.type==="retainer") mrr+=e.amt;}});
document.getElementById("ytd").textContent="$"+ytd.toLocaleString();
document.getElementById("ytdpct").textContent=Math.round(ytd/222000*100)+"% of target";
document.getElementById("col").textContent="$"+col.toLocaleString();
document.getElementById("mrr").textContent="$"+mrr.toLocaleString()+"/mo MRR";
var pct=Math.min(ytd/222000*100,100);
document.getElementById("progbar").style.width=pct+"%";
document.getElementById("progtext").textContent="$"+ytd.toLocaleString()+" of $222,000 ("+Math.round(pct)+"%)";
var tbl=document.getElementById("rtbl");tbl.innerHTML="";
document.getElementById("rempty").style.display=entries.length?"none":"block";
entries.slice().reverse().forEach(function(e){{
var tr=document.createElement("tr");
var sc=e.status==="collected"?"badge-green":"badge-amber";
tr.innerHTML="<td style='font-weight:500;color:#e2e8f0'>"+e.client+"</td><td>"+TYPE_LABELS[e.type]+"</td><td style='color:#a78bfa;font-weight:500'>$"+e.amt.toLocaleString()+"</td><td style='color:#64748b'>"+e.date+"</td><td><span class='badge "+sc+"'>"+e.status+"</span></td><td style='color:#64748b;font-size:12px'>"+e.note+"</td><td><button style='background:none;border:none;color:#475569;cursor:pointer;font-size:15px' onclick='remove("+e.id+")'>×</button></td>";
tbl.appendChild(tr);
}});
}}
render();
</script></body></html>"""

with open(f'{D}/08-revenue-tracker.html','w') as f: f.write(f08)
print("08 done")

# ─── 09 OUTREACH TRACKER ─────────────────────────────────────────────────────
f09 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Outreach Tracker</title><style>{BASE_CSS}
.ot-card{{background:#12121e;border:1px solid rgba(124,58,237,.2);border-radius:10px;padding:1.25rem;margin-bottom:.75rem}}
.ot-header{{display:flex;align-items:flex-start;gap:.75rem;margin-bottom:.875rem}}
.ot-name{{font-size:15px;font-weight:600;color:#e2e8f0}}
.ot-co{{font-size:13px;color:#64748b}}
.ot-actions{{margin-left:auto;display:flex;gap:.5rem;align-items:center}}
.stage-dots{{display:flex;gap:.3rem;margin-bottom:.75rem}}
.dot{{width:24px;height:8px;border-radius:4px;background:#1a1a2e}}
.dot.done{{background:#7c3aed}}
.dot.current{{background:#a78bfa}}
.ot-notes{{font-size:12px;color:#64748b;border-top:1px solid rgba(255,255,255,.06);padding-top:.75rem;margin-top:.75rem}}
.add-card{{background:#0d0a1a;border:1px solid rgba(124,58,237,.35);border-radius:10px;padding:1.25rem;margin-bottom:1rem}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Outreach Tracker</h1>
<p class="sub">Track every prospect from first touch to decision.</p>
<div class="g3 card" style="margin-bottom:1rem">
<div class="mcard"><div class="mlbl">Total prospects</div><div class="mval" id="tot">0</div></div>
<div class="mcard"><div class="mlbl">Active sequences</div><div class="mval" id="act" style="color:#a78bfa">0</div></div>
<div class="mcard"><div class="mlbl">Responded</div><div class="mval" id="resp" style="color:#34d399">0</div></div>
</div>
<div class="add-card">
<div class="ct">Add Prospect</div>
<div class="g2"><input id="pn" placeholder="Name"><input id="pc" placeholder="Company"></div>
<div class="g2" style="margin-top:.75rem"><input id="pe" placeholder="Email / LinkedIn"><input id="prole" placeholder="Role / title"></div>
<div class="g2" style="margin-top:.75rem">
<select id="pst"><option value="0">Not contacted</option><option value="1">Email sent</option><option value="2">Follow-up sent</option><option value="3">Responded</option><option value="4">Meeting scheduled</option><option value="5">Disqualified</option></select>
<input id="pnote" placeholder="Notes (ICP fit, referral source...)">
</div>
<button class="btn" style="margin-top:.75rem" onclick="addP()">Add Prospect</button>
</div>
<div id="plist"></div>
</div>
<script>
var STAGES=["Not contacted","Email sent","Follow-up sent","Responded","Meeting scheduled","Disqualified"];
var DOTS=5;
var prospects=[
{{id:1,name:"Ryan Anderskow",co:"[Company TBD]",role:"Decision maker",email:"Pending site launch",stage:0,note:"First outreach pending flashfusion.co live + FreeAssessment confirmed functional"}},
{{id:2,name:"Mark Hope",co:"Large healthcare/pension fund",role:"Director of Applications",email:"Warm intro — personal network",stage:3,note:"Dinner meeting context established. Role must be formalized before formal introduction."}}
];
var nextId=3;
function addP(){{
var n=document.getElementById("pn").value.trim();if(!n) return;
prospects.push({{id:nextId++,name:n,co:document.getElementById("pc").value,role:document.getElementById("prole").value,email:document.getElementById("pe").value,stage:+document.getElementById("pst").value,note:document.getElementById("pnote").value}});
document.getElementById("pn").value="";document.getElementById("pc").value="";
document.getElementById("pe").value="";document.getElementById("prole").value="";
document.getElementById("pnote").value="";
render();
}}
function advance(id){{
var p=prospects.find(function(x){{return x.id===id}});
if(p&&p.stage<5){{p.stage++;render();}}
}}
function remove(id){{prospects=prospects.filter(function(x){{return x.id!==id}});render();}}
function render(){{
var tot=prospects.length,act=prospects.filter(function(p){{return p.stage>0&&p.stage<5}}).length;
var resp=prospects.filter(function(p){{return p.stage>=3&&p.stage<5}}).length;
document.getElementById("tot").textContent=tot;
document.getElementById("act").textContent=act;
document.getElementById("resp").textContent=resp;
var el=document.getElementById("plist");el.innerHTML="";
prospects.forEach(function(p){{
var dots="";
for(var i=0;i<DOTS;i++) dots+='<div class="dot'+(i<p.stage?" done":i===p.stage?" current":"")+'"></div>';
var sc=p.stage===5?"badge-red":p.stage>=3?"badge-green":p.stage>0?"badge-amber":"badge-purple";
var d=document.createElement("div");d.className="ot-card";
d.innerHTML='<div class="ot-header"><div><div class="ot-name">'+p.name+'</div><div class="ot-co">'+p.co+(p.role?" · "+p.role:"")+'</div></div><div class="ot-actions"><span class="badge '+sc+'">'+STAGES[p.stage]+'</span><button class="btn" style="padding:4px 10px;font-size:12px" onclick="advance('+p.id+')" title="Advance">Next →</button><button style="background:none;border:none;color:#475569;cursor:pointer;font-size:16px" onclick="remove('+p.id+')">×</button></div></div><div class="stage-dots">'+dots+'</div>'+(p.note?'<div class="ot-notes">'+p.note+'</div>':'');
el.appendChild(d);
}});
}}
render();
</script></body></html>"""

with open(f'{D}/09-outreach-tracker.html','w') as f: f.write(f09)
print("09 done")

# ─── 10 BATTLE CARD BROWSER ─────────────────────────────────────────────────
f10 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Battle Card Browser</title><style>{BASE_CSS}
.comp-tabs{{display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1.5rem}}
.comp-tab{{padding:.5rem 1rem;border-radius:8px;border:1px solid rgba(124,58,237,.25);background:transparent;color:#94a3b8;cursor:pointer;font-size:13px;font-family:system-ui}}
.comp-tab.on{{border-color:#7c3aed;background:rgba(124,58,237,.15);color:#a78bfa;font-weight:500}}
.bc-section{{margin-bottom:1.5rem}}
.bc-title{{font-size:12px;color:#7c3aed;text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:.75rem}}
.bc-grid{{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}}
.bc-item{{background:#0d0a1a;border:1px solid rgba(124,58,237,.15);border-radius:8px;padding:.875rem}}
.bc-label{{font-size:11px;color:#64748b;margin-bottom:.3rem}}
.bc-val{{font-size:13px;color:#e2e8f0;line-height:1.5}}
.win{{border-left:3px solid #34d399}}
.loss{{border-left:3px solid #f87171}}
.neutral{{border-left:3px solid #7c3aed}}
.objection{{background:#12121e;border-radius:8px;padding:1rem;margin-bottom:.75rem}}
.obj-q{{font-size:13px;color:#fbbf24;margin-bottom:.5rem}}
.obj-a{{font-size:13px;color:#cbd5e1;line-height:1.5}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Battle Card Browser</h1>
<p class="sub">Live competitive intelligence for sales calls.</p>
<div class="comp-tabs" id="tabs"></div>
<div id="bc-content"></div>
</div>
<script>
var COMPS=[
{{id:"copilot",name:"Microsoft Copilot",
pos:"Productivity-first, locked to Microsoft stack, no native compliance layer.",
their_pitch:"AI integrated with M365. Your team already uses Teams and Outlook.",
our_counter:"Copilot doesn't have a Trust layer. No audit trail. No auto-generated compliance artifacts. When your auditor asks what your AI agents did last quarter, Copilot has no answer.",
wins:[
{{lbl:"Compliance requirement",val:"We generate audit artifacts automatically. Copilot requires manual documentation sprints."}},
{{lbl:"Stack flexibility",val:"FlashFusion is platform-agnostic. We work with your existing tools, not Microsoft's."}},
{{lbl:"Audit trail",val:"Every agent action is logged with timestamp and actor. Copilot has no equivalent."}},
],
losses:[
{{lbl:"M365 native integration",val:"If they're 100% Microsoft and have no compliance obligations, Copilot may be sufficient."}},
{{lbl:"Price per seat",val:"Copilot is bundled into E3/E5. Appears 'free' even if ROI isn't there."}},
],
objs:[
{{q:"We already have Copilot.",a:"Copilot is a productivity tool. FlashFusion is a governance and enablement layer. They solve different problems. Ask your auditor how they'd document your Copilot agent actions."}},
{{q:"Copilot is cheaper.",a:"Copilot appears free because it's bundled. But when you factor in manual compliance documentation time — 40-80 hours per audit cycle at your team's rates — FlashFusion is cheaper."}}
]
}},
{{id:"langchain",name:"LangChain / DIY",
pos:"Powerful but requires significant engineering effort. No compliance layer.",
their_pitch:"Open source, infinitely customizable. We can build exactly what we need.",
our_counter:"LangChain gives you the engine. You have to build the compliance infrastructure yourself — and maintain it. That's an ongoing engineering cost most teams underestimate by 3-5x.",
wins:[
{{lbl:"Time to value",val:"FlashFusion deploys in 4-5 weeks. DIY LangChain takes 3-6 months for comparable capability."}},
{{lbl:"Compliance layer",val:"We ship a Trust layer as a first-class feature. LangChain has nothing built in."}},
{{lbl:"Ongoing maintenance",val:"We own the platform. You don't pay an engineer to maintain it every time the API changes."}},
],
losses:[
{{lbl:"Full customization",val:"If they need truly custom agent logic not covered by our builder, LangChain wins on flexibility."}},
{{lbl:"Open source credibility",val:"Some engineering teams have strong OSS bias. Hard to overcome without a technical champion."}},
],
objs:[
{{q:"We can build this ourselves.",a:"You can. Most teams that try spend 3-6 months getting to parity, then 20% of an engineer's ongoing time maintaining it. What's the opportunity cost of that engineering capacity?"}},
{{q:"LangChain is more flexible.",a:"True. What specific workflow requires LangChain-level customization? In most cases, FlashFusion's builder covers it — and ships in weeks, not months."}}
]
}},
{{id:"nothing",name:"Doing Nothing",
pos:"Status quo. No AI tooling in production, or ad-hoc usage with no governance.",
their_pitch:"We're not ready. We'll evaluate AI later when it's more mature.",
our_counter:"Every month of delay is a month of compounding competitive disadvantage. The teams moving fast now are the ones who will have the institutional knowledge when AI becomes table stakes.",
wins:[
{{lbl:"Regulatory risk",val:"Every unaudited AI agent you deploy today is a liability tomorrow. The question isn't if regulators will scrutinize AI — it's when."}},
{{lbl:"Competitive lag",val:"Your competitors are already deploying. Waiting 6-12 months to start means starting with 6-12 months of disadvantage."}},
{{lbl:"Low entry cost",val:"An AI Setup Audit is $4,500 and takes one week. The cost of inaction compounds monthly."}},
],
losses:[
{{lbl:"Budget cycle timing",val:"If there's genuinely no budget until next FY, nothing to do but stay warm and follow up."}},
{{lbl:"Org readiness",val:"If leadership hasn't bought in at all, a single champion can't move it. Find the blocker."}},
],
objs:[
{{q:"We're not ready for AI yet.",a:"What would ready look like? In most cases, 'not ready' means 'we haven't scoped it.' An AI Setup Audit is designed for that exact moment — it tells you exactly where you are and what to do first."}},
{{q:"We'll wait until it's more stable.",a:"The underlying models are already stable enough for production. What's unstable is your team's process for using them. That's exactly what FlashFusion fixes."}}
]
}},
{{id:"openai",name:"OpenAI / ChatGPT Enterprise",
pos:"Strong model capability, enterprise tier available. Limited workflow integration.",
their_pitch:"GPT-4o is the best model. Enterprise tier has SSO and data privacy.",
our_counter:"ChatGPT Enterprise solves data privacy. It doesn't solve workflow integration, skill deployment, or compliance artifact generation. It's a chat interface with guardrails — not an enablement platform.",
wins:[
{{lbl:"Skill deployment",val:"FlashFusion deploys configured skill packs to your team. ChatGPT Enterprise requires each user to configure their own custom instructions."}},
{{lbl:"Audit trail",val:"ChatGPT Enterprise has no agent audit trail. No auto-generated compliance artifacts."}},
{{lbl:"Workflow integration",val:"We integrate with your existing stack — n8n, Notion, HubSpot, Drive. ChatGPT stays in the chat interface."}},
],
losses:[
{{lbl:"Model quality for raw generation",val:"If they need the best raw writing or code generation, GPT-4o has an edge for some use cases."}},
{{lbl:"Brand recognition",val:"OpenAI has better brand recognition with non-technical buyers. FlashFusion is unknown."}},
],
objs:[
{{q:"We use ChatGPT Enterprise already.",a:"Great. FlashFusion isn't a replacement — it's a deployment and governance layer. You can use Claude models or GPT-4o underneath. We add the skill packs, the audit trail, and the compliance artifacts ChatGPT doesn't have."}},
{{q:"GPT-4o is smarter.",a:"Model benchmarks matter for generation tasks. For workflow enablement and compliance, model quality is table stakes — the layer above it is where value gets created. That's where FlashFusion lives."}}
]
}}
];

function renderComp(c){{
var wins=c.wins.map(function(w){{return '<div class="bc-item win"><div class="bc-label">'+w.lbl+'</div><div class="bc-val">'+w.val+'</div></div>'}}).join("");
var losses=c.losses.map(function(l){{return '<div class="bc-item loss"><div class="bc-label">'+l.lbl+'</div><div class="bc-val">'+l.val+'</div></div>'}}).join("");
var objs=c.objs.map(function(o){{return '<div class="objection"><div class="obj-q">Objection: "'+o.q+'"</div><div class="obj-a">→ '+o.a+'</div></div>'}}).join("");
return '<div class="bc-section"><div class="bc-title">Their positioning</div><div class="bc-item neutral"><div class="bc-val">'+c.their_pitch+'</div></div></div><div class="bc-section"><div class="bc-title">Our counter</div><div class="bc-item" style="background:rgba(124,58,237,.1);border:1px solid rgba(124,58,237,.3)"><div class="bc-val" style="color:#a78bfa">'+c.our_counter+'</div></div></div><div class="bc-section"><div class="bc-title">We win when</div><div class="bc-grid">'+wins+'</div></div><div class="bc-section"><div class="bc-title">We lose when</div><div class="bc-grid">'+losses+'</div></div><div class="bc-section"><div class="bc-title">Objections and responses</div>'+objs+'</div>';
}}

var active=COMPS[0].id;
var tabs=document.getElementById("tabs");
COMPS.forEach(function(c){{
var btn=document.createElement("button");
btn.className="comp-tab"+(c.id===active?" on":"");
btn.textContent=c.name;btn.id="tab-"+c.id;
btn.onclick=function(){{
active=c.id;
document.querySelectorAll(".comp-tab").forEach(function(t){{t.classList.remove("on")}});
btn.classList.add("on");
document.getElementById("bc-content").innerHTML=renderComp(c);
}};
tabs.appendChild(btn);
}});
document.getElementById("bc-content").innerHTML=renderComp(COMPS[0]);
</script></body></html>"""

with open(f'{D}/10-battle-card-browser.html','w') as f: f.write(f10)
print("10 done")

# ─── 11 CLIENT DASHBOARD ─────────────────────────────────────────────────────
f11 = f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<title>FF — Client Dashboard</title><style>{BASE_CSS}
.client-selector{{margin-bottom:1.5rem}}
.del-item{{display:flex;align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid rgba(255,255,255,.05)}}
.del-item:last-child{{border-bottom:none}}
.del-check{{accent-color:#7c3aed;width:16px;height:16px;cursor:pointer;flex-shrink:0}}
.del-text{{font-size:13px;color:#cbd5e1;flex:1}}
.del-text.done{{text-decoration:line-through;color:#475569}}
.del-due{{font-size:11px;color:#64748b}}
.activity-item{{padding:.625rem 0;border-bottom:1px solid rgba(255,255,255,.05);display:flex;gap:.75rem}}
.activity-item:last-child{{border-bottom:none}}
.act-dot{{width:8px;height:8px;border-radius:50%;background:#7c3aed;flex-shrink:0;margin-top:5px}}
.act-text{{font-size:13px;color:#cbd5e1}}
.act-date{{font-size:11px;color:#475569;margin-top:.2rem}}
</style></head><body><div class="w">
<div class="brand">FlashFusion AI Enablement</div>
<h1>Client Dashboard</h1>
<p class="sub">Per-client view: sprint status, deliverables, activity log.</p>
<div class="card client-selector">
<div class="ct">Active Client</div>
<select id="client-sel" onchange="switchClient()" style="width:100%;background:#0d0a1a;border:1px solid rgba(124,58,237,.3);border-radius:6px;color:#f1f5f9;padding:.5rem .75rem;font-size:14px">
<option value="butler">Chris Butler</option>
<option value="new">+ Add client</option>
</select>
</div>
<div id="client-view"></div>
</div>
<script>
var CLIENTS={{
butler:{{
name:"Chris Butler",co:"[Company]",type:"Skills Library — 5-skill suite",start:"2026-03",stage:4,
health:100,
deliverables:[
{{t:"Skills needs assessment",done:true,due:"Week 1"}},
{{t:"5 custom skill packs configured",done:true,due:"Week 2"}},
{{t:"Skill deployment to environment",done:true,due:"Week 3"}},
{{t:"Training session (60 min)",done:true,due:"Week 4"}},
{{t:"Skills user guide delivered",done:true,due:"Week 4"}},
],
activity:[
{{text:"5-skill suite complete — all skills deployed",date:"Apr 2026"}},
{{text:"Teams migration agent in progress",date:"Apr 2026"}},
{{text:"Skills needs assessment complete",date:"Mar 2026"}},
]
}}
}};
var checks={{}};
function switchClient(){{
var v=document.getElementById("client-sel").value;
if(v==="new"){{alert("Client management: add clients to CLIENTS object in source.");return;}}
if(CLIENTS[v]) renderClient(CLIENTS[v],v);
}}
function renderClient(c,id){{
if(!checks[id]){{
checks[id]={{}};
c.deliverables.forEach(function(d,i){{checks[id][i]=d.done;}});
}}
var health=c.health;
var hcolor=health>=80?"#34d399":health>=50?"#fbbf24":"#f87171";
var stageLabels=["Not started","Discovery","Delivery","Review","Complete"];
var dels=c.deliverables.map(function(d,i){{
var done=checks[id][i];
return '<div class="del-item"><input type="checkbox" class="del-check" '+(done?"checked":"")+" onchange=\"toggleDel('"+id+"',"+i+",this.checked)\"><span class='del-text"+(done?" done":"")+"' id='dt-"+id+"-"+i+"'>"+d.t+"</span><span class='del-due'>"+d.due+"</span></div>";
}}).join("");
var acts=c.activity.map(function(a){{
return '<div class="activity-item"><div class="act-dot"></div><div><div class="act-text">'+a.text+'</div><div class="act-date">'+a.date+'</div></div></div>';
}}).join("");
document.getElementById("client-view").innerHTML='<div class="g3 card"><div class="mcard"><div class="mlbl">Engagement</div><div class="mval" style="font-size:14px;color:#f1f5f9">'+c.type+'</div></div><div class="mcard"><div class="mlbl">Stage</div><div class="mval" style="font-size:14px;color:#a78bfa">'+stageLabels[Math.min(c.stage,4)]+'</div></div><div class="mcard"><div class="mlbl">Health</div><div class="mval" style="color:'+hcolor+'">'+health+'%</div></div></div><div class="card"><div class="ct">Deliverables</div>'+dels+'</div><div class="card"><div class="ct">Activity Log</div>'+acts+'</div>';
}}
function toggleDel(cid,idx,val){{
checks[cid][idx]=val;
var el=document.getElementById("dt-"+cid+"-"+idx);
if(el) el.className="del-text"+(val?" done":"");
}}
switchClient();
</script></body></html>"""

with open(f'{D}/11-client-dashboard.html','w') as f: f.write(f11)
print("11 done")

print("\nBatch 2 (06-11) complete.")
