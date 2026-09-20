import { useState, useCallback, useEffect, useRef } from "react";
// Note: React is needed for React.Fragment in the phase stepper
import React from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const PH = {
  IDLE:"idle", SEARCHING:"searching", ANALYZING:"analyzing",
  GENERATING:"generating", AUDITING:"auditing", REGENNING:"regenning", DEPLOYING:"deploying",
};
const PH_LABELS = { searching:"Search", analyzing:"Analyze", generating:"Generate", auditing:"Audit", regenning:"Re-gen", deploying:"Deploy" };
const PH_ORDER  = ["searching","analyzing","generating","auditing","regenning","deploying"];

const PROV = {
  anthropic: { name:"Claude",  color:"#e8724a", nsfw:false, hint:"Built-in — no key needed" },
  openai:    { name:"GPT-4o",  color:"#10a37f", nsfw:false, hint:"Requires OpenAI API key" },
  gemini:    { name:"Gemini",  color:"#4285f4", nsfw:false, hint:"Requires Google AI key" },
  grok:      { name:"Grok",    color:"#ff6b35", nsfw:true,  hint:"NSFW allowed · X.AI key" },
};

const TIERS = [
  { id:"top5",  label:"🏆 Top 5%",      desc:"Extraordinary — memorable, grid-breaking, showcase quality" },
  { id:"pro",   label:"✦ Professional", desc:"Polished — clean, production-ready, every state designed" },
  { id:"quick", label:"⚡ Quick",        desc:"Functional — fast output, solid foundations, move fast" },
  { id:"exp",   label:"🧪 Experimental", desc:"Unconventional — push limits, break norms intentionally" },
];

const FORMATS = [
  { id:"auto",     label:"Auto",    ext:"html", desc:"Detected from brief" },
  { id:"HTML",     label:"HTML",    ext:"html", desc:"Standalone page" },
  { id:"React",    label:"React",   ext:"jsx",  desc:"Component + hooks" },
  { id:"SVG",      label:"SVG",     ext:"svg",  desc:"Vector graphic" },
  { id:"Markdown", label:"MD",      ext:"md",   desc:"Document" },
  { id:"Vue",      label:"Vue",     ext:"vue",  desc:"SFC component" },
  { id:"NextJS",   label:"Next.js", ext:"tsx",  desc:"App Router page" },
  { id:"Vanilla",  label:"Vanilla", ext:"js",   desc:"No framework" },
];

const SLOP = [
  { id:"font",     lbl:"Typography",         w:11, test: c => !/(Inter|Roboto|Arial|system-ui|Poppins)\b/.test(c) },
  { id:"color",    lbl:"Color System",        w:11, test: c => !/(#8b5cf6|#6366f1|purple.*blue|cyan.*dark)/.test(c) },
  { id:"icons",    lbl:"Icon Library",        w: 8, test: c => !/(heroicons|lucide-react)/.test(c) },
  { id:"glass",    lbl:"Glassmorphism",       w: 7, test: c => (c.match(/backdrop-filter/g)||[]).length < 4 },
  { id:"nest",     lbl:"Layout Depth",        w: 7, test: c => (c.match(/card.*card/g)||[]).length < 2 },
  { id:"copy",     lbl:"Copy Quality",        w: 7, test: c => !/(transformative|seamless|next-gen|game-changer|empower|synergy)/.test(c) },
  { id:"states",   lbl:"Interaction States",  w: 7, test: c => /:hover|:focus/.test(c) },
  { id:"motion",   lbl:"Motion Purpose",      w: 6, test: c => /transition|@keyframes/.test(c) && !/animate-bounce/.test(c) },
  { id:"semantic", lbl:"Semantic HTML",       w: 5, test: c => /(section|article|header|main|nav)/.test(c) },
  { id:"a11y",     lbl:"ARIA Labels",         w: 5, test: c => /aria-|alt=/.test(c) },
  { id:"contrast", lbl:"Contrast Check",      w: 4, test: c => !/(color:#[89a-f]{1}[0-9a-f]|color:#[0-3][0-9a-f]{2})\b/.test(c) },
  { id:"touch",    lbl:"Touch Targets",       w: 3, test: c => /min-height:\s*(44|4[4-9]|[5-9]\d)px|padding:\s*\d+px/.test(c) },
  { id:"todos",    lbl:"No TODOs",            w: 3, test: c => !/TODO|FIXME|HACK/.test(c) },
  { id:"loading",  lbl:"Loading States",      w: 3, test: c => /loading|skeleton|spinner/.test(c) },
  { id:"errors",   lbl:"Error States",        w: 3, test: c => /error|invalid|catch/.test(c) },
  { id:"responsive",lbl:"Responsive Design",  w: 3, test: c => /@media|sm:|md:|lg:/.test(c) },
  { id:"cssprop",  lbl:"CSS Custom Props",    w: 3, test: c => /--[a-z]/.test(c) },
  { id:"reduced",  lbl:"Reduced Motion",      w: 2, test: c => /prefers-reduced-motion/.test(c) },
  { id:"focus",    lbl:"Focus Visibility",    w: 1, test: c => /:focus-visible|outline/.test(c) },
  { id:"forms",    lbl:"Form Accessibility",  w: 1, test: c => /<label|htmlFor|aria-labelledby/.test(c) },
];

const TMPLS = [
  { id:"dark-hero",   title:"Cinematic Dark Hero",    cat:"Landing",
    tags:["Dark","Editorial","Motion"],   bg:"#050505", fg:"#e8ff47",
    brief:"Full-bleed dark hero with oversized editorial headline in a distinct serif, noise texture, staggered entrance animation, single bold CTA. Reference: Vercel meets Pitch.com. Cinematic and authored — not generic SaaS." },
  { id:"pricing",     title:"Editorial Pricing",       cat:"Landing",
    tags:["Light","Editorial","Business"],bg:"#f5f0e8", fg:"#1a1a1a",
    brief:"Three-tier pricing table with editorial typography, asymmetric layout, bold middle-tier highlight. No generic cards — typographic contrast and spatial hierarchy. The Atlantic meets Linear pricing." },
  { id:"dashboard",   title:"Analytics Dashboard",     cat:"Dashboard",
    tags:["Dark","Data","Dense"],         bg:"#0d1117", fg:"#22c55e",
    brief:"Dark analytics dashboard: metric cards with sparklines, chart area, sidebar nav. Dense data, clear hierarchy, monospace numbers, brutalist grid. Reference: Raycast's design language on a data product." },
  { id:"auth",        title:"Split Auth Screen",        cat:"Auth",
    tags:["Split","Premium","Form"],      bg:"#ffffff", fg:"#6200ea",
    brief:"Split-screen login: left — bold brand statement with animated mesh gradient; right — minimal floating-label form. Progressive disclosure, one step at a time. Premium SaaS, no field overload." },
  { id:"bento",       title:"Bento Feature Grid",       cat:"Features",
    tags:["Bento","Dark","Illustrated"],  bg:"#1c1c1e", fg:"#ff6b35",
    brief:"Magazine-style bento section with mixed-size cells. Each cell has a focused icon or micro-illustration, oversized number or headline. Asymmetric, grid-breaking — no uniform cards. Each cell has distinct visual weight." },
  { id:"wall",        title:"Testimonial Wall",          cat:"Social",
    tags:["Light","Motion","Social"],     bg:"#fafafa", fg:"#0070f3",
    brief:"Masonry testimonial section with attributed quotes, company logos, star ratings. Alternating quote sizes, highlighted featured testimonial. Scroll-triggered reveals. No generic carousel." },
  { id:"brutalist",   title:"Brutalist Editorial",       cat:"Editorial",
    tags:["Brutalist","Bold","Print"],    bg:"#f0ec3f", fg:"#0a0a0a",
    brief:"Brutalist newspaper-inspired layout: stark typography, exposed raw grid, bold ruled lines, black-on-yellow system. Inspired by Neue Grafik applied digitally. Confrontational, not decorative. Must feel printed." },
  { id:"luxury",      title:"Luxury Product Showcase",   cat:"Commerce",
    tags:["Luxury","Dark","Editorial"],   bg:"#0e0c0a", fg:"#c9a96e",
    brief:"High-end product showcase: deep warm dark background, gold accent system, editorial product copy, serif typography. Reference: Bottega Veneta digital meets Jacquemus campaign. Zero discount-store energy." },
  { id:"coming-soon", title:"Coming Soon — Minimal",     cat:"Landing",
    tags:["Minimal","Light","Countdown"], bg:"#f8f8f8", fg:"#111111",
    brief:"Minimal coming-soon page with countdown timer, email capture, single strong typographic statement. No stock photos, no gradient blobs. Text as primary visual. Think Teenage Engineering meets Apple stealth launch." },
  { id:"mobile-app",  title:"Mobile App Landing",        cat:"Landing",
    tags:["Mobile","App","Dark"],         bg:"#0a0618", fg:"#a78bfa",
    brief:"App store-style landing for a mobile product: hero with device implied through CSS shapes, feature bullets with custom icons, download CTA. Reference: Craft Docs meets Linear mobile. Earned color system, not defaults." },
  { id:"docs",        title:"Developer Docs",             cat:"Docs",
    tags:["Docs","Mono","Clean"],         bg:"#0f1117", fg:"#58a6ff",
    brief:"Clean developer docs layout: sidebar nav with collapsible sections, content area with code blocks, inline examples, search bar, breadcrumb. Reference: Clerk Docs meets Stripe API docs. Monospace code, generous whitespace." },
  { id:"portfolio",   title:"Creative Portfolio Grid",    cat:"Portfolio",
    tags:["Portfolio","Grid","Personal"], bg:"#111010", fg:"#ff4e50",
    brief:"Creative portfolio with irregular CSS grid, project thumbnails with hover reveals, minimal nav, bold name as headline. Reference: Bruno Simon meets Mariana Castilho. Grid items overlap, no uniform sizing. Authored, memorable." },
];

const CATS = ["All","Landing","Dashboard","Auth","Features","Social","Editorial","Commerce","Docs","Portfolio"];
const EXTS = { HTML:"html", React:"jsx", SVG:"svg", Markdown:"md", Vue:"vue", NextJS:"tsx", Vanilla:"js", auto:"html" };

const SYSTEM = `You are an elite frontend engineer and designer.

TYPOGRAPHY: Use Instrument Serif, Bricolage Grotesque, Playfair Display, DM Serif Display, Cal Sans, or Fraunces.
FORBIDDEN FONTS: Inter, Roboto, Arial, Poppins, system-ui — never use these.

COLORS: Intentional palettes with specific hex values. Define a CSS custom property system.
FORBIDDEN COLORS: purple-to-blue defaults, #8b5cf6, #6366f1, generic cyan-on-dark.

ICONS: Phosphor, Font Awesome, Hugeicons, or custom inline SVG.
FORBIDDEN ICONS: heroicons, lucide-react.

LAYOUT: Asymmetric composition, strategic whitespace, grid-breaking elements.
FORBIDDEN LAYOUTS: 3-column uniform card grids, nested cards.

STATES: All interaction states — hover, focus, active, loading, error, empty.
FOCUS: Every interactive element must have :focus-visible with a visible outline.

MOTION: ease-out-quart only. 200–600ms. Purpose: state change or attention.
Always include: @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }

ACCESSIBILITY: aria-label on icon-only buttons, role attributes, alt text, semantic HTML.
FORMS: Every input has <label> or aria-label. Error messages use role="alert".
TOUCH: Interactive elements minimum 44px height.
CONTRAST: WCAG AA minimum on all text.

QUALITY: Zero TODOs. Zero placeholders. Production-ready.
Output raw code only — no markdown fences, no explanation.`;

// ─── API ──────────────────────────────────────────────────────────────────────

const strip = t => t.replace(/^```[\w]*\n?/,"").replace(/\n?```$/,"").trim();

async function callAnthropic(msgs, sys="", tools=[]) {
  const body = { model:"claude-sonnet-4-20250514", max_tokens:4096, system:sys, messages:msgs };
  if (tools.length) body.tools = tools;
  const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if (!r.ok) throw new Error(`Claude ${r.status}`);
  return (await r.json()).content?.find(b=>b.type==="text")?.text || "";
}
async function callOpenAI(msgs,sys="",key) {
  if (!key) throw new Error("OpenAI API key required — enter in sidebar");
  const r = await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:"gpt-4o",max_tokens:4096,messages:[{role:"system",content:sys},...msgs]})});
  if (!r.ok) throw new Error(`OpenAI ${r.status}`); return (await r.json()).choices?.[0]?.message?.content||"";
}
async function callGemini(msgs,sys="",key) {
  if (!key) throw new Error("Gemini API key required — enter in sidebar");
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({systemInstruction:{parts:[{text:sys}]},contents:[{role:"user",parts:[{text:msgs[msgs.length-1].content}]}],generationConfig:{maxOutputTokens:4096}})});
  if (!r.ok) throw new Error(`Gemini ${r.status}`); return (await r.json()).candidates?.[0]?.content?.parts?.[0]?.text||"";
}
async function callGrok(msgs,sys="",key) {
  if (!key) throw new Error("Grok API key required — enter in sidebar");
  const r = await fetch("https://api.x.ai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:"grok-3",max_tokens:4096,messages:[{role:"system",content:sys},...msgs]})});
  if (!r.ok) throw new Error(`Grok ${r.status}`); return (await r.json()).choices?.[0]?.message?.content||"";
}
async function llm(prov,msgs,keys,sys="") {
  if (prov==="openai") return callOpenAI(msgs,sys,keys.openai);
  if (prov==="gemini") return callGemini(msgs,sys,keys.gemini);
  if (prov==="grok")   return callGrok(msgs,sys,keys.grok);
  return callAnthropic(msgs,sys);
}

// ─── Operations ───────────────────────────────────────────────────────────────

async function searchRefs(brief) {
  try {
    const t = await callAnthropic([{role:"user",content:`Find 3-5 award-winning design references for: "${brief}". Return ONLY a JSON array: [{"title":"...","url":"...","why":"...","aesthetic":"..."}]`}],"Search Awwwards, Dribbble, brand sites. Return only the JSON array.",[{type:"web_search_20250305",name:"web_search"}]);
    const m=t.match(/\[[\s\S]*?\]/); return m?JSON.parse(m[0]):[];
  } catch { return []; }
}
async function extractCtx(brief) {
  try {
    const t = await callAnthropic([{role:"user",content:`Brief: ${brief}`}],`Analyze this brief. Return ONLY a JSON object: {"audience":"...","vibe":["adj1","adj2","adj3"],"industry":"...","format":"HTML|React|SVG|Markdown|Vue|NextJS|Vanilla","aesthetic":"..."}`);
    const m=t.match(/\{[\s\S]*?\}/); return m?JSON.parse(m[0]):{};
  } catch { return {}; }
}
async function genSuggestions(ctx) {
  try {
    const t = await callAnthropic([{role:"user",content:`Context: ${JSON.stringify(ctx)}\nGenerate 6 distinct, specific design briefs targeting top 5% quality. Vary by category and aesthetic.`}],"Return ONLY a JSON array of 6 strings: [\"brief1\",\"brief2\",...]");
    const m=t.match(/\[[\s\S]*?\]/); return m?JSON.parse(m[0]):[];
  } catch { return []; }
}
async function generate(brief,ctx,tier,fmtOvr,refs,prov,keys) {
  const tierMap={top5:"TOP 5%: Extraordinary. Invent the color system. Unexpected font pair. One unforgettable moment. Break the grid.",pro:"PROFESSIONAL: Polished, clean, every state designed. No shortcuts.",quick:"QUICK: Functional and solid. Fast output. Core states only.",exp:"EXPERIMENTAL: Unconventional. Push limits. Break norms on purpose. Wild."};
  const refCtx=refs.length?`\n\nDesign references:\n${refs.map(r=>`- ${r.title}: ${r.why}`).join("\n")}`:"";
  const resolvedFmt=fmtOvr==="auto"?(ctx.format||"HTML"):fmtOvr;
  const prompt=`Brief: ${brief}\nAudience: ${ctx.audience||"general"}\nVibe: ${(ctx.vibe||[]).join(", ")}\nIndustry: ${ctx.industry||"web"}\nAesthetic: ${ctx.aesthetic||"distinctive, authored"}\nFormat: ${resolvedFmt}${refCtx}\n\n${tierMap[tier]||""}\n\nOutput raw ${resolvedFmt} code only.`;
  const raw=await llm(prov,[{role:"user",content:prompt}],keys,SYSTEM);
  return {code:strip(raw),resolvedFmt};
}
async function runAudit(code) {
  const rules=SLOP.map(r=>({...r,pass:r.test(code)}));
  const score=rules.reduce((s,r)=>s+(r.pass?r.weight:0),0);
  const fonts=[...new Set((code.match(/font-family:[^;'"]+/g)||[]).map(f=>f.replace("font-family:","").trim()))];
  const colors=[...new Set((code.match(/#[0-9a-fA-F]{3,6}/g)||[]).slice(0,10))];
  const failed=rules.filter(r=>!r.pass).map(r=>r.lbl);
  let fixes=[];
  if (failed.length) {
    try {
      const t=await callAnthropic([{role:"user",content:`Failed: ${failed.join(", ")}.\nCode (2000 chars):\n${code.slice(0,2000)}\nOne specific fix per failure. Return ONLY JSON array: ["fix1","fix2"]`}],"Design quality auditor. Name exact properties. Return only JSON array.");
      const m=t.match(/\[[\s\S]*?\]/); fixes=m?JSON.parse(m[0]):[];
    } catch {}
  }
  return {score,rules,fonts,colors,fixes};
}
async function deployVercel(code,fmt,token) {
  const f=fmt==="auto"?"HTML":fmt;
  if (f!=="HTML") throw new Error(`Vercel deploy is HTML-only. Download .${EXTS[f]} and use Vercel CLI.`);
  const r=await fetch("https://api.vercel.com/v13/deployments",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${token}`},body:JSON.stringify({name:`artifact-${Date.now()}`,files:[{file:"index.html",data:btoa(unescape(encodeURIComponent(code)))}],target:"production"})});
  if (!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e.error?.message||`Vercel ${r.status}`);}
  const d=await r.json(); return d.url?`https://${d.url}`:null;
}
function dlFile(content,name){const a=Object.assign(document.createElement("a"),{href:URL.createObjectURL(new Blob([content],{type:"text/plain"})),download:name});a.click();URL.revokeObjectURL(a.href);}
const isNSFW  = t=>/\b(adult|sexual|nude|xxx|porn|explicit|nsfw|naked|erotic|onlyfans|escort)\b/i.test(t);
const grade   = s=>s>=90?"A+":s>=80?"A":s>=70?"B":s>=60?"C":"D";
const gColor  = s=>s>=90?"#22c55e":s>=75?"#84cc16":s>=60?"#f59e0b":"#ef4444";

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body,html,#root{height:100%;overflow:hidden}
body{font-family:'DM Sans',sans-serif;background:#080810;color:#e0e0e8;line-height:1.5}

/* Accessibility */
.skip{position:absolute;top:-40px;left:0;background:#e8ff47;color:#080810;padding:8px 14px;font-size:12px;font-weight:700;z-index:9999;border-radius:0 0 6px 0;transition:top .15s}
.skip:focus{top:0}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
*:focus-visible{outline:2px solid #e8ff47 !important;outline-offset:2px}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms !important;transition-duration:.01ms !important}}

::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:#0d0d1a}
::-webkit-scrollbar-thumb{background:#252538;border-radius:2px}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer}

/* Shell */
.shell{display:flex;height:100vh;overflow:hidden;position:relative}

/* Sidebar */
.sb{background:#09090f;border-right:1px solid #141422;overflow-y:auto;display:flex;flex-direction:column;transition:width .2s,min-width .2s;overflow-x:hidden}
.sb-open{width:284px;min-width:284px}
.sb-closed{width:0;min-width:0}
.sb-s{padding:12px 14px;border-bottom:1px solid #111120}
.sb-l{font-size:9px;font-weight:600;letter-spacing:.14em;color:#32324a;text-transform:uppercase;margin-bottom:8px}

/* Collapse button */
.col-btn{position:absolute;top:50%;transform:translateY(-50%);width:16px;height:40px;background:#141422;border:1px solid #252538;border-left:none;border-radius:0 4px 4px 0;cursor:pointer;z-index:10;color:#454560;font-size:10px;display:flex;align-items:center;justify-content:center;transition:all .15s}
.col-btn:hover{background:#1e1e2e;color:#9090a8}

/* Provider */
.prov-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.pb{padding:7px 8px;border-radius:6px;border:1px solid #181826;background:#0d0d1a;color:#484862;font-size:10.5px;font-weight:500;display:flex;align-items:center;gap:4px;transition:all .15s;text-align:left;min-height:36px;width:100%}
.pb:hover{border-color:#232338;color:#8888a4}
.pb[aria-pressed=true]{border-color:var(--pc);color:var(--pc);background:color-mix(in srgb,var(--pc) 8%,#0d0d1a)}
.pd{width:5px;height:5px;border-radius:50%;background:var(--pc);flex-shrink:0}
.nsfw-b{padding:1px 5px;border-radius:99px;background:rgba(255,107,53,.1);border:1px solid rgba(255,107,53,.25);color:#ff6b35;font-size:7.5px;font-weight:700;letter-spacing:.1em;flex-shrink:0}
.prov-hint{font-size:8.5px;color:#28284a;margin-top:5px;padding:0 1px}

/* Keys */
.ki{width:100%;padding:6px 9px;border-radius:5px;border:1px solid #181826;background:#0d0d1a;color:#b0b0c8;font-size:10.5px;font-family:'JetBrains Mono',monospace;outline:none;transition:border-color .15s;min-height:32px}
.ki:focus{border-color:#2a2a40}
.kl{font-size:9.5px;color:#2c2c42;margin-bottom:4px;display:flex;align-items:center;justify-content:space-between}
.kl-note{font-size:8px;color:#1e1e3a}

/* Brief */
.brief-ta{width:100%;min-height:84px;padding:9px 10px;border-radius:7px;border:1px solid #181826;background:#0d0d1a;color:#e0e0e8;font-family:'DM Sans',sans-serif;font-size:12.5px;line-height:1.55;outline:none;resize:vertical;transition:border-color .15s}
.brief-ta:focus{border-color:#e8ff47}
.brief-ta::placeholder{color:#28283e}
.brief-meta{display:flex;align-items:center;justify-content:space-between;margin-top:4px}
.ch-count{font-size:9.5px;font-family:'JetBrains Mono',monospace;color:#282848}
.ch-warn{color:#f59e0b}
.ch-over{color:#ef4444}
.clear-b{font-size:9.5px;color:#282848;background:none;border:none;padding:2px 5px;cursor:pointer;border-radius:3px;transition:color .15s}
.clear-b:hover{color:#8888a0}

/* Tiers */
.tier-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:8px}
.tb{padding:6px 8px;border-radius:6px;border:1px solid #181826;background:#0d0d1a;color:#484862;font-size:10.5px;text-align:center;transition:all .15s;min-height:32px;width:100%}
.tb:hover{color:#8888a4}
.tb[aria-pressed=true]{border-color:#e8ff47;color:#e8ff47;background:rgba(232,255,71,.05)}

/* Formats */
.fmt-row{display:flex;gap:4px;overflow-x:auto;padding-bottom:3px;margin-top:8px}
.fmt-row::-webkit-scrollbar{height:0}
.fb{padding:4px 8px;border-radius:4px;border:1px solid #181826;background:#0d0d1a;color:#404060;font-size:9.5px;white-space:nowrap;transition:all .15s;flex-shrink:0;min-height:26px}
.fb:hover{color:#8888a4}
.fb[aria-pressed=true]{border-color:rgba(232,255,71,.35);color:#c8d830;background:rgba(232,255,71,.04)}

/* Generate */
.gen-btn{width:100%;margin-top:9px;padding:10px;border-radius:7px;border:none;background:#e8ff47;color:#080810;font-weight:700;font-size:12.5px;letter-spacing:.01em;transition:all .15s;min-height:40px;display:flex;align-items:center;justify-content:center;gap:6px}
.gen-btn:hover:not(:disabled):not([aria-disabled=true]){background:#f0ff6a;transform:translateY(-1px)}
.gen-btn:disabled,.gen-btn[aria-disabled=true]{background:#181826;color:#343450;cursor:not-allowed;transform:none}
.kbd{padding:1px 5px;border-radius:3px;background:rgba(0,0,0,.2);border:1px solid rgba(0,0,0,.3);font-family:'JetBrains Mono',monospace;font-size:8px;color:#080810;opacity:.7}

/* Suggestions */
.si{padding:6px 9px;border-radius:6px;border:1px solid #131320;background:#0b0b16;font-size:10.5px;color:#585872;line-height:1.45;transition:all .15s;min-height:36px;text-align:left;width:100%}
.si:hover{border-color:#222234;color:#a0a0bc;background:#0f0f1e}

/* Context pills */
.cp{padding:3px 7px;border-radius:4px;background:#0d0d1a;border:1px solid #141422;font-size:9.5px;color:#505068;display:flex;gap:4px;overflow:hidden}
.cp b{color:#707088;font-weight:500;flex-shrink:0}
.cp span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* History */
.hi{padding:5px 8px;border-radius:5px;font-size:9.5px;color:#484860;cursor:pointer;display:flex;align-items:center;gap:5px;min-height:30px;width:100%;border:1px solid #131320;background:#0b0b16;text-align:left;transition:all .15s}
.hi:hover{border-color:#222234;color:#8888a4}
.hi[aria-pressed=true]{border-color:rgba(232,255,71,.2);color:#e8ff47;background:rgba(232,255,71,.03)}
.hi-t{font-family:'JetBrains Mono',monospace;font-size:8px;color:#282840;flex-shrink:0;margin-left:auto}

/* Main */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}

/* Phase bar */
.ph-bar{padding:8px 16px;background:#0c0c18;border-bottom:1px solid #141422;display:flex;align-items:center;gap:10px}
.ph-dot{width:6px;height:6px;border-radius:50%;background:#e8ff47;animation:phP 1.2s ease-in-out infinite;flex-shrink:0}
@keyframes phP{0%,100%{opacity:1}50%{opacity:.3}}
.ph-steps{display:flex;align-items:center;gap:5px;flex:1;overflow:hidden}
.ph-step{display:flex;align-items:center;gap:3px;font-size:10px;color:#282848;white-space:nowrap}
.ph-step.active{color:#e8ff47}
.ph-step.done{color:#404060}
.ph-step-d{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0}
.ph-sep{color:#1e1e30;font-size:9px}
.ph-cur{font-size:10.5px;color:#e8ff47;font-weight:500;flex-shrink:0}

/* Error */
.err-bar{padding:8px 16px;background:rgba(239,68,68,.05);border-bottom:1px solid rgba(239,68,68,.12);color:#ef4444;font-size:11px;display:flex;align-items:center;gap:8px}
.err-x{background:none;border:none;color:#ef4444;margin-left:auto;font-size:14px;cursor:pointer;padding:2px 6px;border-radius:3px}

/* Toast */
.toasts{position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;gap:6px;z-index:100;pointer-events:none}
.toast{padding:9px 14px;border-radius:7px;font-size:11.5px;font-weight:500;border:1px solid;animation:tIn .25s ease-out;max-width:280px}
.toast.success{background:rgba(34,197,94,.08);border-color:rgba(34,197,94,.25);color:#22c55e}
.toast.info{background:rgba(232,255,71,.06);border-color:rgba(232,255,71,.2);color:#c8d830}
@keyframes tIn{from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:none}}

/* Tabs */
.tabs{display:flex;border-bottom:1px solid #141422;padding:0 16px;overflow-x:auto}
.tabs::-webkit-scrollbar{height:0}
.tab{padding:11px 12px;font-size:11px;font-weight:500;color:#3a3a58;cursor:pointer;border-bottom:2px solid transparent;border-left:none;border-right:none;border-top:none;background:none;white-space:nowrap;display:flex;align-items:center;gap:5px;min-height:42px;transition:all .15s}
.tab:hover{color:#7878a0}
.tab[aria-selected=true]{color:#e8ff47;border-bottom-color:#e8ff47}
.tbadge{font-size:9px;padding:1px 5px;border-radius:99px}

/* Content */
.content{flex:1;overflow:hidden;display:flex;flex-direction:column}

/* Gallery */
.gallery{flex:1;overflow-y:auto;padding:14px}
.g-filter{display:flex;gap:5px;margin-bottom:12px;overflow-x:auto;padding-bottom:3px}
.g-filter::-webkit-scrollbar{height:0}
.gf{padding:4px 10px;border-radius:99px;border:1px solid #181826;background:#0d0d1a;color:#404060;font-size:10px;cursor:pointer;transition:all .15s;flex-shrink:0;min-height:28px}
.gf:hover{color:#8888a4}
.gf[aria-pressed=true]{border-color:rgba(232,255,71,.35);color:#c8d830;background:rgba(232,255,71,.04)}
.g-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px}
.g-card{border-radius:9px;border:1px solid #141422;overflow:hidden;cursor:pointer;transition:all .2s;background:#0a0a11;display:flex;flex-direction:column}
.g-card:hover{border-color:#282840;transform:translateY(-3px);box-shadow:0 14px 36px rgba(0,0,0,.55)}
.g-prev{height:100px;display:flex;align-items:center;justify-content:center;font-family:'Instrument Serif',serif;font-style:italic;font-size:18px;position:relative;overflow:hidden;flex-shrink:0}
.g-ovl{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.78);color:#e8ff47;font-family:'DM Sans',sans-serif;font-style:normal;font-size:10.5px;font-weight:600;opacity:0;transition:opacity .2s;letter-spacing:.05em}
.g-card:hover .g-ovl,.g-card:focus-visible .g-ovl{opacity:1}
.g-info{padding:8px 11px;background:#0d0d1a;flex:1}
.g-title{font-size:11px;font-weight:600;color:#b8b8d0;margin-bottom:2px}
.g-cat{font-size:9px;color:#383854;margin-bottom:5px}
.g-tags{display:flex;gap:3px;flex-wrap:wrap}
.g-tag{padding:1px 5px;border-radius:99px;font-size:7.5px;border:1px solid #1c1c2e;color:#383854}
.g-empty{grid-column:1/-1;text-align:center;padding:40px;color:#2a2a48;font-size:12px}

/* Output */
.out-wrap{flex:1;overflow-y:auto;padding:14px}
.code-blk{background:#060610;border-radius:8px;border:1px solid #141422;overflow:auto}
.code-blk pre{padding:16px;font-family:'JetBrains Mono',monospace;font-size:10.5px;line-height:1.8;color:#68688a;white-space:pre-wrap;word-break:break-word}
.empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1e1e32;text-align:center;gap:8px;padding:40px}
.empty-h{font-family:'Instrument Serif',serif;font-size:24px;color:#1e1e32}
.empty-p{font-size:11px;color:#252540;max-width:240px;line-height:1.65}
.empty-tips{font-size:10px;color:#1e1e38;text-align:left;margin-top:4px;display:flex;flex-direction:column;gap:3px;list-style:none}

/* Actions */
.act-bar{padding:8px 16px;border-top:1px solid #141422;display:flex;gap:5px;flex-wrap:wrap;align-items:center}
.ab{padding:6px 11px;border-radius:6px;border:1px solid #181826;background:#0d0d1a;color:#686888;font-size:10.5px;font-weight:500;transition:all .15s;min-height:32px;display:flex;align-items:center;gap:4px}
.ab:hover:not(:disabled){border-color:#2a2a40;color:#b0b0c8}
.ab:disabled{opacity:.3;cursor:not-allowed}
.ab.hi{background:rgba(232,255,71,.07);border-color:rgba(232,255,71,.25);color:#e8ff47}
.ab.go{background:rgba(34,197,94,.07);border-color:rgba(34,197,94,.25);color:#22c55e}
.deployed{padding:7px 16px;border-top:1px solid #141422;font-size:10.5px;font-family:'JetBrains Mono',monospace;color:#22c55e;background:rgba(34,197,94,.03)}
.iter-bar{padding:8px 16px;border-top:1px solid #141422;display:flex;gap:6px}
.iter-in{flex:1;padding:7px 11px;border-radius:6px;border:1px solid #181826;background:#0d0d1a;color:#e0e0e8;font-size:11.5px;outline:none;transition:border-color .15s;font-family:'DM Sans',sans-serif;min-height:34px}
.iter-in:focus{border-color:#2c2c44}
.iter-in::placeholder{color:#28283e}
.out-meta{margin-left:auto;font-size:9.5px;color:#282848;font-family:'JetBrains Mono',monospace}

/* Preview */
.prev-wrap{flex:1;overflow:hidden}
.prev-frame{width:100%;height:100%;border:none}

/* Audit */
.aud-wrap{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:14px}
.aud-top{display:flex;align-items:flex-end;gap:12px}
.aud-g{font-family:'Instrument Serif',serif;font-style:italic;font-size:60px;line-height:1}
.aud-n{font-family:'JetBrains Mono',monospace;font-size:22px;font-weight:700;color:#c0c0d8}
.aud-sub{font-size:10.5px;color:#383858;margin-top:2px}
.prog-wrap{height:4px;border-radius:2px;background:#1a1a2a;overflow:hidden}
.prog{height:100%;border-radius:2px;transition:width .4s ease-out}
.rule-r{display:flex;align-items:center;gap:7px;padding:5px 0;border-bottom:1px solid #0e0e1c;font-size:10.5px}
.rp{color:#22c55e;font-size:11px;flex-shrink:0}
.rf{color:#ef4444;font-size:11px;flex-shrink:0}
.rn{flex:1;color:#686888}
.rw{font-family:'JetBrains Mono',monospace;font-size:8.5px;color:#252540}
.tok-sw{width:12px;height:12px;border-radius:3px;border:1px solid rgba(255,255,255,.07);flex-shrink:0;display:inline-block}
.fix-i{padding:7px 10px;border-radius:6px;background:rgba(232,255,71,.03);border:1px solid rgba(232,255,71,.1);color:#9aab28;font-size:10.5px;line-height:1.5;cursor:pointer;transition:all .15s;text-align:left;width:100%;min-height:36px;display:flex;align-items:flex-start;gap:6px}
.fix-i:hover{background:rgba(232,255,71,.07);color:#bac830}

/* Search */
.srch-wrap{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px}
.ref-c{padding:10px 12px;border-radius:7px;border:1px solid #141422;background:#09090f}
.ref-t{font-size:11px;font-weight:600;color:#b0b0c8;margin-bottom:2px}
.ref-u{font-size:9px;color:#353552;font-family:'JetBrains Mono',monospace;margin-bottom:5px}
.ref-w{font-size:10.5px;color:#5a5a78;line-height:1.55}
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function ArtifactGenerator() {
  const [prov,       setProv]     = useState("anthropic");
  const [keys,       setKeys]     = useState({openai:"",gemini:"",grok:"",vercel:""});
  const [brief,      setBrief]    = useState("");
  const [tier,       setTier]     = useState("top5");
  const [fmtOvr,     setFmtOvr]  = useState("auto");
  const [tab,        setTab]      = useState("gallery");
  const [galFilter,  setGalFilter]= useState("All");
  const [phase,      setPhase]    = useState(PH.IDLE);
  const [ctx,        setCtx]      = useState({});
  const [code,       setCode]     = useState("");
  const [fmt,        setFmt]      = useState("HTML");
  const [aud,        setAud]      = useState(null);
  const [suggs,      setSuggs]    = useState([]);
  const [refs,       setRefs]     = useState([]);
  const [hist,       setHist]     = useState([]);
  const [curVer,     setCurVer]   = useState(-1);
  const [iterTxt,    setIterTxt]  = useState("");
  const [deplUrl,    setDeplUrl]  = useState("");
  const [err,        setErr]      = useState("");
  const [toasts,     setToasts]   = useState([]);
  const [copied,     setCopied]   = useState(false);
  const [annotated,  setAnnotated]= useState(false);
  const [sbOpen,     setSbOpen]   = useState(true);

  useEffect(()=>{
    const el=document.createElement("style");
    el.textContent=CSS;
    document.head.appendChild(el);
    return()=>el.remove();
  },[]);

  const toast=(msg,type="info")=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000);
  };

  const running   =phase!==PH.IDLE;
  const nsfw      =isNSFW(brief);
  const activeProv=nsfw?"grok":prov;
  const needKey   =activeProv!=="anthropic"&&!keys[activeProv];
  const chars     =brief.length;
  const charMax   =1000;

  const pushVer=(b,c,f,a)=>{
    const v={brief:b,code:c,format:f,audit:a,time:new Date().toLocaleTimeString()};
    setHist(h=>[v,...h].slice(0,10)); setCurVer(0);
  };

  const run=useCallback(async(overrideBrief=null)=>{
    const b=overrideBrief||brief;
    if(!b.trim())return;
    setErr(""); setAud(null); setDeplUrl(""); setAnnotated(false);
    try {
      setPhase(PH.SEARCHING);
      const r=await searchRefs(b); setRefs(r);

      setPhase(PH.ANALYZING);
      const c=await extractCtx(b); setCtx(c);
      genSuggestions(c).then(s=>{setSuggs(s);if(s.length)toast(`${s.length} suggestions ready`,"info");}).catch(()=>{});

      setPhase(PH.GENERATING);
      const{code:g,resolvedFmt:f}=await generate(b,c,tier,fmtOvr,r,activeProv,keys);
      setFmt(f);

      setPhase(PH.AUDITING);
      let a=await runAudit(g); setAud(a);

      if(a.score<70){
        setPhase(PH.REGENNING);
        toast(`Score ${a.score} — re-generating…`,"info");
        const{code:g2}=await generate(`${b}\n\nFix: ${a.fixes.join(". ")}. Score was ${a.score}/100.`,c,tier,fmtOvr,r,activeProv,keys);
        a=await runAudit(g2); setAud(a);
        pushVer(b,g2,f,a); setCode(g2);
      } else {
        pushVer(b,g,f,a); setCode(g);
      }

      toast(`Generated · Score ${a.score}/100 (${grade(a.score)})`,"success");
      setTab("output");
    } catch(e){setErr(e.message||"Generation failed");}
    finally{setPhase(PH.IDLE);}
  },[brief,tier,fmtOvr,activeProv,keys]);

  const iterate=useCallback(async()=>{
    if(!iterTxt.trim()||!code)return;
    setErr(""); setPhase(PH.GENERATING);
    try {
      const raw=await llm(activeProv,[{role:"user",content:`Existing code:\n${code.slice(0,3000)}\n\nChange: ${iterTxt}\n\nReturn complete updated code only.`}],keys,SYSTEM);
      const g=strip(raw);
      setPhase(PH.AUDITING);
      const a=await runAudit(g); setAud(a);
      pushVer(`Iter: ${iterTxt}`,g,fmt,a);
      setCode(g); setIterTxt(""); setAnnotated(false);
      toast(`Updated · Score ${a.score}/100`,"success");
    } catch(e){setErr(e.message);}
    finally{setPhase(PH.IDLE);}
  },[code,iterTxt,activeProv,keys,fmt]);

  const deploy=useCallback(async()=>{
    if(!code||!keys.vercel)return;
    setPhase(PH.DEPLOYING);
    try{const u=await deployVercel(code,fmt,keys.vercel);setDeplUrl(u);toast("Deployed to Vercel","success");}
    catch(e){setErr(e.message);}
    finally{setPhase(PH.IDLE);}
  },[code,fmt,keys.vercel]);

  const copy=()=>{navigator.clipboard.writeText(code);setCopied(true);toast("Copied","success");setTimeout(()=>setCopied(false),1500);};
  const download=()=>{dlFile(code,`artifact.${EXTS[fmt]||"txt"}`);toast(`Downloaded .${EXTS[fmt]}`,"success");};

  const toggleAnnotate=()=>{
    if(!annotated&&aud&&hist[curVer]){
      let ann=code;
      aud.rules.filter(r=>!r.pass).forEach(r=>{
        if(r.id==="font") ann=ann.replace(/(Inter|Roboto|Arial)/,`/* ⚠ AUDIT: Replace with Instrument Serif, Bricolage Grotesque, etc */ $1`);
        if(r.id==="icons") ann=ann.replace(/(heroicons|lucide-react)/,`/* ⚠ AUDIT: Replace with Phosphor, Font Awesome, Hugeicons */ $1`);
        if(r.id==="todos") ann=ann.replace(/\/\/ TODO/,"/* ⚠ AUDIT: TODO present — remove before shipping */\n// TODO");
      });
      setCode(ann);
    } else if(hist[curVer]){setCode(hist[curVer].code);}
    setAnnotated(!annotated);
  };

  const restoreVer=(i)=>{
    const v=hist[i]; setCode(v.code); setFmt(v.format); setAud(v.audit);
    setCurVer(i); setAnnotated(false); setTab("output");
    toast(`Restored v${i+1}`,"info");
  };

  const filteredTmpls=galFilter==="All"?TMPLS:TMPLS.filter(t=>t.cat===galFilter);

  const auditBadge=aud?(
    <span className="tbadge" style={{color:gColor(aud.score),background:`color-mix(in srgb,${gColor(aud.score)} 10%,transparent)`}}>
      {grade(aud.score)}
    </span>
  ):null;

  const previewDoc=code&&fmt==="HTML"?code:code?`<html><body style="background:#111;color:#555;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-size:13px"><div style="text-align:center"><div style="font-size:28px;margin-bottom:10px;opacity:.2">⬡</div><p>${fmt} — download to render</p></div></body></html>`:"";

  const phIdx=PH_ORDER.indexOf(phase);

  const TABS=[
    {id:"gallery",label:"Gallery"},
    {id:"output", label:"Output"},
    {id:"preview",label:"Preview"},
    {id:"audit",  label:"Audit",  badge:auditBadge},
    {id:"search", label:"Refs"},
  ];

  return(
    <div className="shell">
      <a className="skip" href="#main-content">Skip to main content</a>

      {/* ── Sidebar ── */}
      <nav className={`sb ${sbOpen?"sb-open":"sb-closed"}`} aria-label="Generator configuration">
        {sbOpen && <>
          {/* Provider */}
          <div className="sb-s">
            <div className="sb-l" id="prov-hd">Provider</div>
            {nsfw&&<div style={{marginBottom:7}}><span className="nsfw-b">NSFW DETECTED → GROK</span></div>}
            <div className="prov-grid" role="group" aria-labelledby="prov-hd">
              {Object.entries(PROV).map(([k,p])=>(
                <button key={k} className="pb" style={{"--pc":p.color}} onClick={()=>setProv(k)}
                  aria-pressed={prov===k} title={p.hint}>
                  <span className="pd" style={{"--pc":p.color}} aria-hidden="true"/>
                  {p.name}
                  {p.nsfw&&<span className="nsfw-b">18+</span>}
                </button>
              ))}
            </div>
            <p className="prov-hint" aria-live="polite">{PROV[nsfw?"grok":prov]?.hint}</p>
          </div>

          {/* API Keys */}
          {(prov!=="anthropic"||keys.vercel!=="")&&(
            <div className="sb-s">
              <div className="sb-l">API Keys</div>
              {prov!=="anthropic"&&(
                <div style={{marginBottom:8}}>
                  <div className="kl">
                    <label htmlFor="key-prov">{PROV[prov]?.name}</label>
                    <span className="kl-note">memory only</span>
                  </div>
                  <input id="key-prov" type="password" className="ki"
                    placeholder={`${prov}_key_…`} value={keys[prov]}
                    onChange={e=>setKeys(k=>({...k,[prov]:e.target.value}))}
                    aria-required="true"/>
                </div>
              )}
              <div>
                <div className="kl">
                  <label htmlFor="key-vercel">Vercel Token</label>
                  <span className="kl-note">for deploy</span>
                </div>
                <input id="key-vercel" type="password" className="ki"
                  placeholder="vercel_…" value={keys.vercel}
                  onChange={e=>setKeys(k=>({...k,vercel:e.target.value}))}/>
              </div>
            </div>
          )}

          {/* Brief */}
          <div className="sb-s">
            <div className="sb-l">
              <label htmlFor="brief-ta">Brief</label>
            </div>
            <textarea id="brief-ta" className="brief-ta" rows={4}
              placeholder={"What do you want to build?\nAudience, vibe, references…"}
              value={brief}
              onChange={e=>chars<charMax+50&&setBrief(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&e.metaKey&&!running&&run()}
              aria-describedby="brief-ch"
              maxLength={charMax+50}/>
            <div className="brief-meta">
              <span id="brief-ch"
                className={`ch-count ${chars>charMax?"ch-over":chars>charMax*.9?"ch-warn":""}`}
                aria-live="polite">
                {chars}/{charMax}
              </span>
              {brief&&<button className="clear-b" onClick={()=>{setBrief("");setSuggs([]);setCtx({});}} aria-label="Clear brief">Clear</button>}
            </div>

            {/* Tier */}
            <div style={{marginTop:6}}>
              <div className="sb-l" id="tier-hd">Tier</div>
              <div className="tier-grid" role="group" aria-labelledby="tier-hd">
                {TIERS.map(t=>(
                  <button key={t.id} className="tb" onClick={()=>setTier(t.id)}
                    aria-pressed={tier===t.id} title={t.desc}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div>
              <div className="sb-l" id="fmt-hd" style={{marginTop:8}}>Format</div>
              <div className="fmt-row" role="group" aria-labelledby="fmt-hd">
                {FORMATS.map(f=>(
                  <button key={f.id} className="fb" onClick={()=>setFmtOvr(f.id)}
                    aria-pressed={fmtOvr===f.id} title={f.desc}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="gen-btn"
              disabled={running||!brief.trim()||needKey}
              aria-disabled={running||!brief.trim()||needKey}
              aria-busy={running}
              onClick={()=>run()}>
              {running?"Working…":needKey?`Enter ${PROV[activeProv]?.name} key`:"⚡ Generate"}
              {!running&&<span className="kbd" aria-hidden="true">⌘↵</span>}
            </button>
          </div>

          {/* Suggestions */}
          {suggs.length>0&&(
            <div className="sb-s" aria-label="AI-generated brief suggestions">
              <div className="sb-l">Suggestions</div>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:4}}>
                {suggs.map((s,i)=>(
                  <li key={i}>
                    <button className="si" onClick={()=>{setBrief(s);run(s);}}>
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Context */}
          {ctx.audience&&(
            <div className="sb-s" aria-label="Auto-detected brief context">
              <div className="sb-l">Context</div>
              <div style={{display:"flex",flexDirection:"column",gap:3}} aria-live="polite">
                {ctx.audience&&<div className="cp"><b>audience</b><span>{ctx.audience}</span></div>}
                {ctx.industry&&<div className="cp"><b>industry</b><span>{ctx.industry}</span></div>}
                {ctx.format  &&<div className="cp"><b>format</b><span>{ctx.format}</span></div>}
                {ctx.aesthetic&&<div className="cp"><b>aesthetic</b><span>{ctx.aesthetic}</span></div>}
              </div>
            </div>
          )}

          {/* History */}
          {hist.length>0&&(
            <div className="sb-s" aria-label="Version history">
              <div className="sb-l">History ({hist.length})</div>
              <ol style={{listStyle:"none",display:"flex",flexDirection:"column",gap:3}}>
                {hist.map((v,i)=>(
                  <li key={i}>
                    <button className="hi" onClick={()=>restoreVer(i)}
                      aria-pressed={i===curVer}
                      aria-label={`Version ${i+1}: ${v.brief.slice(0,50)}, at ${v.time}`}>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>
                        {v.brief.slice(0,36)}…
                      </span>
                      <span className="hi-t">{v.time}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>}
      </nav>

      {/* Sidebar toggle */}
      <button className="col-btn" style={{left:sbOpen?"284px":"0"}}
        onClick={()=>setSbOpen(o=>!o)}
        aria-label={sbOpen?"Collapse sidebar":"Expand sidebar"}
        aria-expanded={sbOpen}>
        {sbOpen?"‹":"›"}
      </button>

      {/* ── Main ── */}
      <main className="main" id="main-content" aria-label="Artifact generator">

        {running&&(
          <div className="ph-bar" role="status" aria-live="polite"
            aria-label={`Processing: ${PH_LABELS[phase]||""}`}>
            <div className="ph-dot" aria-hidden="true"/>
            <div className="ph-steps" aria-hidden="true">
              {PH_ORDER.slice(0,5).map((p,i)=>(
                <React.Fragment key={p}>
                  {i>0&&<span className="ph-sep">›</span>}
                  <span className={`ph-step ${i===phIdx?"active":i<phIdx?"done":""}`}>
                    <span className="ph-step-d"/>
                    {PH_LABELS[p]}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <span className="ph-cur">{PH_LABELS[phase]||""}</span>
          </div>
        )}

        {err&&(
          <div className="err-bar" role="alert" aria-live="assertive">
            <span>⚠ {err}</span>
            <button className="err-x" onClick={()=>setErr("")} aria-label="Dismiss error">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs" role="tablist" aria-label="Generator views">
          {TABS.map(t=>(
            <button key={t.id} className="tab"
              role="tab"
              aria-selected={tab===t.id}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={()=>setTab(t.id)}>
              {t.label}{t.badge}
            </button>
          ))}
        </div>

        {/* Content panels */}
        <div className="content">

          {/* Gallery */}
          {tab==="gallery"&&(
            <section className="gallery"
              role="tabpanel" id="panel-gallery" aria-labelledby="tab-gallery">
              <div className="g-filter" role="group" aria-label="Filter by category">
                {CATS.map(c=>(
                  <button key={c} className="gf" onClick={()=>setGalFilter(c)}
                    aria-pressed={galFilter===c}>
                    {c}
                    {c!=="All"&&<span className="sr-only">{TMPLS.filter(t=>t.cat===c).length} templates</span>}
                  </button>
                ))}
              </div>
              <div className="g-grid" role="list"
                aria-label={`${filteredTmpls.length} templates${galFilter!=="All"?` in ${galFilter}`:""}`}>
                {filteredTmpls.length>0?filteredTmpls.map(t=>(
                  <article key={t.id} className="g-card"
                    role="listitem"
                    tabIndex={0}
                    onClick={()=>{setBrief(t.brief);run(t.brief);}}
                    onKeyDown={e=>(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),setBrief(t.brief),run(t.brief))}
                    aria-label={`${t.title} template, ${t.cat} category. Press Enter to generate.`}>
                    <div className="g-prev" style={{background:t.bg,color:t.fg}} aria-hidden="true">
                      {t.title.split(" ")[0]}
                      <div className="g-ovl">Generate ↗</div>
                    </div>
                    <div className="g-info">
                      <div className="g-title">{t.title}</div>
                      <div className="g-cat">{t.cat}</div>
                      <div className="g-tags" aria-hidden="true">
                        {t.tags.map(g=><span key={g} className="g-tag">{g}</span>)}
                      </div>
                    </div>
                  </article>
                )):(
                  <div className="g-empty" role="status">No templates in "{galFilter}"</div>
                )}
              </div>
            </section>
          )}

          {/* Output */}
          {tab==="output"&&(
            <section role="tabpanel" id="panel-output" aria-labelledby="tab-output"
              style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
              <div className="out-wrap">
                {code?(
                  <div className="code-blk" role="region" aria-label={`Generated ${fmt} code`}>
                    <pre tabIndex={0}>{code}</pre>
                  </div>
                ):(
                  <div className="empty" role="status" aria-label="No output yet">
                    <div className="empty-h">Nothing yet.</div>
                    <div className="empty-p">Enter a brief and Generate, or click a Gallery template.</div>
                    <ul className="empty-tips" aria-label="Keyboard shortcuts">
                      <li>⌘↵ — Generate from brief</li>
                      <li>Click gallery card — instant generate</li>
                      <li>Audit → click fix → applies to iteration</li>
                    </ul>
                  </div>
                )}
              </div>
              {code&&(
                <>
                  <div className="act-bar" role="toolbar" aria-label="Output actions">
                    <button className="ab hi" onClick={download}
                      aria-label={`Download as .${EXTS[fmt]||"txt"}`}>
                      ↓ .{EXTS[fmt]||"txt"}
                    </button>
                    <button className="ab" onClick={copy}
                      aria-label={copied?"Copied to clipboard":"Copy code to clipboard"}
                      aria-live="polite">
                      {copied?"✓ Copied":"Copy"}
                    </button>
                    {aud&&(
                      <button className="ab" onClick={toggleAnnotate}
                        aria-pressed={annotated}
                        aria-label={annotated?"Show original code":"Show annotated code with audit markers"}>
                        {annotated?"Original":"Annotate"}
                      </button>
                    )}
                    {keys.vercel&&(
                      <button className="ab go" onClick={deploy}
                        disabled={running} aria-disabled={running}
                        aria-label="Deploy to Vercel">
                        🚀 Deploy
                      </button>
                    )}
                    <span className="out-meta" aria-label={`${fmt} format, ${code.length.toLocaleString()} characters`}>
                      {fmt} · {code.length.toLocaleString()}c
                    </span>
                  </div>
                  {deplUrl&&(
                    <div className="deployed" role="status" aria-live="polite">
                      ✓ Live: <a href={deplUrl} target="_blank" rel="noreferrer"
                        aria-label={`Open deployed site at ${deplUrl}`} style={{color:"#22c55e"}}>
                        {deplUrl}
                      </a>
                    </div>
                  )}
                  <div className="iter-bar" role="group" aria-label="Iterate on output">
                    <label htmlFor="iter-in" className="sr-only">Describe a change</label>
                    <input id="iter-in" className="iter-in"
                      placeholder="Describe a change… then ↵"
                      value={iterTxt}
                      onChange={e=>setIterTxt(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&!running&&iterate()}
                      aria-label="Describe a change to apply to the generated code"/>
                    <button className="ab" onClick={iterate}
                      disabled={!iterTxt.trim()||running}
                      aria-disabled={!iterTxt.trim()||running}
                      aria-label="Apply change">
                      Apply
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Preview */}
          {tab==="preview"&&(
            <section className="prev-wrap"
              role="tabpanel" id="panel-preview" aria-labelledby="tab-preview">
              {previewDoc?(
                <iframe className="prev-frame"
                  srcDoc={previewDoc}
                  sandbox="allow-scripts allow-same-origin"
                  title={`Live preview of generated ${fmt} artifact`}
                  aria-label={`Preview: ${fmt} artifact`}/>
              ):(
                <div className="empty" role="status">
                  <div className="empty-h">No preview.</div>
                  <div className="empty-p">Generate an HTML artifact for a live preview. Other formats show a placeholder.</div>
                </div>
              )}
            </section>
          )}

          {/* Audit */}
          {tab==="audit"&&(
            <section className="aud-wrap"
              role="tabpanel" id="panel-audit" aria-labelledby="tab-audit">
              {aud?(
                <>
                  <div className="aud-top">
                    <div className="aud-g" style={{color:gColor(aud.score)}}
                      aria-label={`Grade ${grade(aud.score)}`}>
                      {grade(aud.score)}
                    </div>
                    <div>
                      <div className="aud-n" aria-label={`Score ${aud.score} out of 100`}>
                        {aud.score}<span style={{fontSize:12,color:"#30305a"}}>/100</span>
                      </div>
                      <div className="aud-sub">
                        {aud.score>=90?"Top 5% — showcase quality":aud.score>=70?"Professional grade":"Below threshold — auto-regen triggered"}
                      </div>
                    </div>
                  </div>

                  <div role="progressbar" aria-valuenow={aud.score} aria-valuemin={0} aria-valuemax={100}
                    aria-label={`Quality score ${aud.score} out of 100`}>
                    <div className="prog-wrap">
                      <div className="prog" style={{width:`${aud.score}%`,background:gColor(aud.score)}}/>
                    </div>
                  </div>

                  <div>
                    <div className="sb-l" id="rules-lbl">
                      Quality Rules — {aud.rules.filter(r=>r.pass).length}/{aud.rules.length} passing
                    </div>
                    <ul style={{listStyle:"none"}} aria-labelledby="rules-lbl">
                      {aud.rules.map(r=>(
                        <li key={r.id} className="rule-r">
                          <span className={r.pass?"rp":"rf"} aria-hidden="true">{r.pass?"✓":"✗"}</span>
                          <span className="rn">{r.lbl}</span>
                          <span className="rw">+{r.weight}pt</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(aud.fonts?.length>0||aud.colors?.length>0)&&(
                    <div aria-label="Design tokens detected in code">
                      <div className="sb-l">Design Tokens</div>
                      {aud.fonts?.length>0&&(
                        <div style={{marginBottom:10}}>
                          <div style={{fontSize:9,color:"#282848",marginBottom:5}}>FONTS</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                            {aud.fonts.map((f,i)=>(
                              <span key={i} style={{padding:"2px 7px",borderRadius:4,background:"#0d0d1a",border:"1px solid #181828",fontSize:9.5,color:"#686888",fontFamily:"'JetBrains Mono',monospace"}}>{f}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {aud.colors?.length>0&&(
                        <div>
                          <div style={{fontSize:9,color:"#282848",marginBottom:5}}>COLORS</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                            {aud.colors.map((c,i)=>(
                              <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                                <span className="tok-sw" style={{background:c}} aria-hidden="true"/>
                                <span style={{fontSize:9,color:"#383858",fontFamily:"'JetBrains Mono',monospace"}}
                                  aria-label={`Color ${c}`}>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {aud.fixes?.length>0&&(
                    <div>
                      <div className="sb-l">Auto-Fixes — click to iterate</div>
                      <div style={{display:"flex",flexDirection:"column",gap:5}}>
                        {aud.fixes.map((f,i)=>(
                          <button key={i} className="fix-i"
                            onClick={()=>{setIterTxt(f);setTab("output");}}
                            aria-label={`Apply fix: ${f}`}>
                            <span aria-hidden="true">↗</span>{f}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ):(
                <div className="empty" role="status">
                  <div className="empty-h">No audit.</div>
                  <div className="empty-p">Audit runs automatically after generation. Score below 70 triggers auto-regen.</div>
                </div>
              )}
            </section>
          )}

          {/* References */}
          {tab==="search"&&(
            <section className="srch-wrap"
              role="tabpanel" id="panel-search" aria-labelledby="tab-search">
              {refs.length>0?(
                <>
                  <p style={{fontSize:10,color:"#383858",marginBottom:2}} role="status">
                    {refs.length} design references found for your brief
                  </p>
                  {refs.map((r,i)=>(
                    <article key={i} className="ref-c" aria-label={`Reference: ${r.title}`}>
                      <div className="ref-t">{r.title}</div>
                      {r.url&&(
                        <div className="ref-u">
                          <a href={r.url} target="_blank" rel="noreferrer"
                            aria-label={`Open ${r.title} in new tab`} style={{color:"#353552"}}>
                            {r.url}
                          </a>
                        </div>
                      )}
                      <p className="ref-w">{r.why}</p>
                    </article>
                  ))}
                </>
              ):(
                <div className="empty" role="status">
                  <div className="empty-h">No references.</div>
                  <div className="empty-p">References are auto-searched on generate and injected into the prompt.</div>
                </div>
              )}
            </section>
          )}

        </div>
      </main>

      {/* Toasts */}
      <div className="toasts" role="status" aria-live="polite" aria-atomic="false"
        aria-label="Notifications">
        {toasts.map(t=>(
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
