/* ============================================================
   KR MENTOR — private, owner-only AI thinking partner
   One shared module, included on every Kyle Rosebrook page.

   PRIVACY MODEL (read this):
   - The mentor is hidden until unlocked with your passphrase.
     Visitors never see a launcher. This is OBFUSCATION, not
     hard security — anyone can read this source file. Don't
     treat the gate as a vault for real secrets.
   - Your API keys + webhook URLs live ONLY in your browser's
     localStorage on devices where you unlock. They are never
     written into the shipped HTML/JS.
   - AI calls use the in-app runtime (window.claude.complete)
     when present; otherwise your own Anthropic key (entered in
     Settings) is sent directly from your browser. Browser-side
     keys are fine for personal/local use only.
   ============================================================ */
(function () {
  "use strict";
  if (window.__krMentorLoaded) return;
  window.__krMentorLoaded = true;

  // ---------- storage ----------
  var SK = {
    owner: "kr-mentor-owner",      // {hash, salt} passphrase
    unlocked: "kr-mentor-unlocked",// "1" on this device
    remember: "kr-mentor-remember",
    creds: "kr-mentor-creds",      // [{id,label,platform,key,needsProxy}]
    activeKey: "kr-mentor-activekey",
    conns: "kr-mentor-conns",      // [{id,type,label,url}]
    profile: "kr-mentor-profile",  // owner profile text
    model: "kr-mentor-model",
    provider: "kr-mentor-provider",     // built-in | anthropic | openai | gemini | grok
    providerModel: "kr-mentor-pmodel",
    modelCache: "kr-mentor-models",     // {prov:{best,all,bad,ts}} self-healing model discovery
    proxyUrl: "kr-mentor-proxy",        // optional backend proxy for key-based APIs
    proxyToken: "kr-mentor-proxytoken", // shared bearer token for the proxy
    supaUrl: "kr-mentor-supa-url",      // Supabase project URL (public)
    supaKey: "kr-mentor-supa-key",      // Supabase anon public key (safe to expose)
    chat: "kr-mentor-chat:",       // + pageId
  };
  var PAGE_ID = (location.pathname.split("/").pop() || "index").replace(/\.html$/i, "");
  var PAGE_TITLE = document.title || PAGE_ID;

  function jget(k, f) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function sget(k, f) { try { var v = localStorage.getItem(k); return v == null ? f : v; } catch (e) { return f; } }
  function sset(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  // ---------- crypto (passphrase hash) ----------
  async function hashPass(pass, salt) {
    salt = salt || (Math.random().toString(36).slice(2) + Date.now().toString(36));
    try {
      var enc = new TextEncoder().encode(salt + "::" + pass);
      var buf = await crypto.subtle.digest("SHA-256", enc);
      var hex = Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      return { hash: hex, salt: salt };
    } catch (e) {
      // fallback (non-secure contexts)
      var h = 0, s = salt + "::" + pass;
      for (var i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; }
      return { hash: "x" + (h >>> 0).toString(16), salt: salt };
    }
  }

  // ---------- LLM providers (browser-callable) ----------
  var PROVIDERS = {
    anthropic: {
      label: "Anthropic (Claude)", match: /anthropic|claude/i,
      models: ["claude-sonnet-4-6", "claude-opus-4-1", "claude-3-5-haiku-latest"],
      list: async function (key) {
        var r = await fetch("https://api.anthropic.com/v1/models?limit=100", { headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" } });
        var d = await r.json(); if (!r.ok) throw new Error("list"); return (d.data || []).map(function (m) { return m.id; });
      },
      call: async function (key, model, system, msgs) {
        var r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
          body: JSON.stringify({ model: model, max_tokens: 1200, system: system, messages: msgs }) });
        var d = await r.json(); if (!r.ok) throw new Error((d.error && d.error.message) || "Anthropic error");
        var t = (d.content || []).filter(function (b) { return b.type === "text"; })[0]; return t ? t.text : "";
      }
    },
    openai: {
      label: "OpenAI (GPT)", match: /openai|gpt|^o[0-9]/i,
      models: ["gpt-4o", "gpt-4o-mini", "o3-mini"],
      list: async function (key) {
        var r = await fetch("https://api.openai.com/v1/models", { headers: { "Authorization": "Bearer " + key } });
        var d = await r.json(); if (!r.ok) throw new Error("list"); return (d.data || []).map(function (m) { return m.id; });
      },
      call: async function (key, model, system, msgs) {
        var r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
          body: JSON.stringify({ model: model, messages: [{ role: "system", content: system }].concat(msgs) }) });
        var d = await r.json(); if (!r.ok) throw new Error((d.error && d.error.message) || "OpenAI error");
        return (d.choices && d.choices[0] && d.choices[0].message.content) || "";
      }
    },
    gemini: {
      label: "Google (Gemini)", match: /gemini|google/i,
      models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
      list: async function (key) {
        var r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=" + encodeURIComponent(key));
        var d = await r.json(); if (!r.ok) throw new Error("list");
        return (d.models || []).filter(function (m) { return (m.supportedGenerationMethods || []).indexOf("generateContent") >= 0; }).map(function (m) { return (m.name || "").replace(/^models\//, ""); });
      },
      call: async function (key, model, system, msgs) {
        var contents = msgs.map(function (m) { return { role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }; });
        var r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + encodeURIComponent(key), { method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: contents }) });
        var d = await r.json(); if (!r.ok) throw new Error((d.error && d.error.message) || "Gemini error");
        var c = d.candidates && d.candidates[0]; return (c && c.content && c.content.parts && c.content.parts[0] && c.content.parts[0].text) || "";
      }
    },
    grok: {
      label: "xAI (Grok)", match: /grok|xai/i,
      models: ["grok-3", "grok-2-latest"],
      list: async function (key) {
        var r = await fetch("https://api.x.ai/v1/models", { headers: { "Authorization": "Bearer " + key } });
        var d = await r.json(); if (!r.ok) throw new Error("list"); return (d.data || []).map(function (m) { return m.id; });
      },
      call: async function (key, model, system, msgs) {
        var r = await fetch("https://api.x.ai/v1/chat/completions", { method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
          body: JSON.stringify({ model: model, messages: [{ role: "system", content: system }].concat(msgs) }) });
        var d = await r.json(); if (!r.ok) throw new Error((d.error && d.error.message) || "Grok error");
        return (d.choices && d.choices[0] && d.choices[0].message.content) || "";
      }
    }
  };
  function providerKey(prov) {
    var creds = jget(SK.creds, []); var P = PROVIDERS[prov];
    var byProv = creds.filter(function (c) { return P && P.match.test((c.platform || "") + " " + (c.label || "")); })[0];
    if (byProv) return byProv.key;
    var ex = creds.filter(function (c) { return c.id === sget(SK.activeKey, ""); })[0];
    return ex ? ex.key : "";
  }

  // ---------- self-healing model resolution ----------
  // Rank discovered model ids: keep chat-capable, prefer flagship family, then newest version/date.
  var RANK = {
    anthropic: { include: /^claude/i, exclude: /(?!)/, prefer: [/sonnet/i, /opus/i, /haiku/i] },
    openai: { include: /^(gpt-|o[0-9]|chatgpt)/i, exclude: /(embed|whisper|tts|audio|image|dall|moderation|realtime|search|instruct|transcribe|babbage|davinci|ada|curie|^gpt-3)/i, prefer: [/^gpt-4\.1/i, /^gpt-4o(?!-mini)/i, /^o[0-9]/i, /^gpt-4o/i, /^gpt-4/i] },
    gemini: { include: /gemini/i, exclude: /(embedding|aqa|vision|tuning|-exp|thinking)/i, prefer: [/pro/i, /flash(?!-lite)/i, /flash/i] },
    grok: { include: /^grok/i, exclude: /(vision|image)/i, prefer: [/latest/i, /^grok-[0-9]+$/i] }
  };
  function rankModels(prov, ids) {
    var cfg = RANK[prov] || { include: /.*/, exclude: /(?!)/, prefer: [] };
    var pool = ids.filter(function (id) { return cfg.include.test(id) && !cfg.exclude.test(id); });
    if (!pool.length) pool = ids.slice();
    function prefRank(id) { for (var i = 0; i < cfg.prefer.length; i++) if (cfg.prefer[i].test(id)) return i; return cfg.prefer.length; }
    function nums(id) { return (id.match(/\d+(?:\.\d+)?/g) || []).map(Number); }
    pool.sort(function (a, b) {
      var pa = prefRank(a), pb = prefRank(b); if (pa !== pb) return pa - pb;
      var la = /latest/i.test(a) ? 1 : 0, lb = /latest/i.test(b) ? 1 : 0; if (la !== lb) return lb - la;
      var na = nums(a), nb = nums(b), L = Math.max(na.length, nb.length);
      for (var i = 0; i < L; i++) { var x = na[i] || 0, y = nb[i] || 0; if (x !== y) return y - x; }
      return b.localeCompare(a);
    });
    return pool;
  }
  function mcache() { return jget(SK.modelCache, {}); }
  function mcSet(prov, patch) { var c = mcache(); c[prov] = Object.assign({}, c[prov], patch, { ts: Date.now() }); jset(SK.modelCache, c); }
  function markBadModel(prov, model) { var c = mcache(); var e = c[prov] || {}; e.bad = (e.bad || []).concat([model]).filter(function (v, i, a) { return a.indexOf(v) === i; }); c[prov] = e; jset(SK.modelCache, c); }
  async function discoverModels(prov, key) { var P = PROVIDERS[prov]; if (!P || !P.list) return []; try { return await P.list(key); } catch (e) { return []; } }
  async function resolveModel(prov, key, opts) {
    opts = opts || {};
    var explicit = sget(SK.providerModel, "").trim();
    var c = mcache()[prov] || {}; var bad = c.bad || [];
    if (explicit && !opts.force && bad.indexOf(explicit) < 0) return explicit;
    if (!opts.force && c.best && c.ts && (Date.now() - c.ts < 864e5) && bad.indexOf(c.best) < 0) return c.best;
    var ids = await discoverModels(prov, key);
    if (ids.length) {
      var ranked = rankModels(prov, ids).filter(function (id) { return bad.indexOf(id) < 0; });
      if (ranked.length) { mcSet(prov, { best: ranked[0], all: ranked }); return ranked[0]; }
    }
    var hard = (PROVIDERS[prov].models || []).filter(function (id) { return bad.indexOf(id) < 0; });
    return explicit || hard[0] || (PROVIDERS[prov].models || [])[0];
  }
  function isModelError(e) { return /model|not[\s_-]?found|does not exist|deprecat|unsupported|unknown|no such|404|invalid.*model|model.*invalid/i.test(String((e && e.message) || "")); }

  async function complete(messages, system) {
    var prov = sget(SK.provider, "built-in");
    if (prov === "built-in" || !PROVIDERS[prov]) {
      if (window.claude && typeof window.claude.complete === "function") {
        var msgs = messages.slice();
        if (system) {
          if (msgs.length && msgs[0].role === "user") msgs[0] = { role: "user", content: system + "\n\n" + msgs[0].content };
          else msgs.unshift({ role: "user", content: system });
        }
        return await window.claude.complete({ messages: msgs });
      }
      prov = "anthropic"; // off-platform fallback
    }
    var P = PROVIDERS[prov]; var key = providerKey(prov);
    if (!key) throw new Error("No " + P.label + " key found. Add one in Settings \u2192 Keys (label it '" + prov + "').");
    var model = await resolveModel(prov, key);
    try {
      return await P.call(key, model, system, messages);
    } catch (e) {
      if (isModelError(e)) {
        markBadModel(prov, model);
        var model2 = await resolveModel(prov, key, { force: true });
        if (model2 && model2 !== model) { try { return await P.call(key, model2, system, messages); } catch (e2) { markBadModel(prov, model2); throw e2; } }
      }
      throw e;
    }
  }

  // ---------- Supabase auth (real OAuth / magic link, public anon key only) ----------
  var _supa = null;
  function supaConfigured() { return !!(sget(SK.supaUrl, "") && sget(SK.supaKey, "")); }
  async function getSupa() {
    if (!supaConfigured()) return null;
    if (_supa) return _supa;
    if (!window.supabase) {
      await new Promise(function (res, rej) {
        var s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
        s.onload = res; s.onerror = function () { rej(new Error("Could not load Supabase SDK.")); };
        document.head.appendChild(s);
      });
    }
    _supa = window.supabase.createClient(sget(SK.supaUrl, ""), sget(SK.supaKey, ""));
    return _supa;
  }
  async function supaGoogle() { var s = await getSupa(); if (!s) throw new Error("Supabase not configured."); var r = await s.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.href } }); if (r.error) throw r.error; }
  async function supaMagic(email) { var s = await getSupa(); if (!s) throw new Error("Supabase not configured."); var r = await s.auth.signInWithOtp({ email: email, options: { emailRedirectTo: location.href } }); if (r.error) throw r.error; }
  async function supaSignOut() { try { var s = await getSupa(); if (s) await s.auth.signOut(); } catch (e) {} }

  // ---------- persona + lenses ----------
  var PERSONA =
    "You are KR MENTOR, the private thinking partner embedded in Kyle Rosebrook's personal site. " +
    "You are NOT a cheerleader and NOT a sycophant. You are a forensic, high-candor mentor: blunt, specific, " +
    "allergic to flattery, hedging, and filler. You match the site's voice — archival, contemplative, hard-edged. " +
    "Rules: (1) Never open with praise or 'great question'. (2) If the work is weak, say so and say exactly why. " +
    "(3) Prefer concrete, falsifiable observations over vague encouragement. (4) Surface what's missing, not just " +
    "what's present. (5) Keep it tight — no preamble, no summary of what you're about to do. Lead with the sharpest point. " +
    "(6) When you don't know, say so. Use plain prose; short paragraphs or terse bullets. No emoji.";

  var LENSES = [
    { id: "gaps", label: "Cover my gaps", glyph: "◧",
      prompt: "Audit what's on this page for what's MISSING. List the specific gaps, omissions, and weak spots — the things a sharp reader would notice are absent. Rank by how much they undermine the work. Be concrete." },
    { id: "unknowns", label: "Unknown unknowns", glyph: "◌",
      prompt: "Name the blind spots — the things I likely don't even know to consider here. Surface assumptions I'm treating as given, second-order effects, and adjacent questions I haven't asked. Don't repeat what's obvious from the page." },
    { id: "bottleneck", label: "Find the bottleneck", glyph: "⌛",
      prompt: "Identify the single biggest constraint holding this back — the one thing that, if fixed, unlocks the most. Distinguish the real bottleneck from the symptoms. Then give the smallest action that attacks it." },
    { id: "whitepage", label: "Beat the white page", glyph: "▭",
      prompt: "I'm stuck starting. Give me 3 concrete, opinionated openings I could run with right now — actual first lines / first moves, not advice about how to start. Make them specific to what's on this page." },
    { id: "redteam", label: "Red-team this", glyph: "⚔",
      prompt: "Act as a hostile, intelligent critic. Attack the strongest version of what's on this page: where's the flawed logic, the unsupported leap, the thing a smart opponent would dismantle first? Steelman then break it." },
    { id: "gutcheck", label: "Gut-check (anti-sycophancy)", glyph: "⚖",
      prompt: "No flattery. Tell me the truth about the quality of what's here: is it actually good, or am I fooling myself? Where am I getting praise I haven't earned? Rate it honestly and justify the rating." },
    { id: "next", label: "Next best action", glyph: "→",
      prompt: "Given what's on this page, what is the single highest-leverage next action? One thing. Make it specific and doable today, and say why it beats the alternatives." },
    { id: "whatelse", label: "What else?", glyph: "✶",
      prompt: "What am I not asking you that I should be? Suggest the most useful angle, lens, or question for this page that I haven't requested — then answer it." },
  ];

  // ---------- page context ----------
  function pageContext() {
    var main = document.querySelector("main, .kr-wrap, article") || document.body;
    var txt = (main.innerText || "").replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    if (txt.length > 6000) txt = txt.slice(0, 6000) + "\n…[truncated]";
    return txt;
  }
  function connSummary() {
    var conns = jget(SK.conns, []);
    var creds = jget(SK.creds, []);
    var parts = [];
    if (conns.length) parts.push("Webhook tools available: " + conns.map(function (c) { return c.label + " (" + c.type + ")"; }).join(", ") + ".");
    if (creds.length) parts.push("Stored credentials (keys NOT shown): " + creds.map(function (c) { return c.platform || c.label; }).join(", ") + ".");
    return parts.join(" ");
  }
  function systemFor() {
    var profile = sget(SK.profile, "");
    var s = PERSONA + "\n\n--- CURRENT PAGE ---\nTitle: " + PAGE_TITLE + "\n\nVisible content:\n" + pageContext();
    if (profile) s += "\n\n--- ABOUT THE OWNER (Kyle) ---\n" + profile;
    var cs = connSummary();
    if (cs) s += "\n\n--- AVAILABLE TOOLS / CONNECTIONS ---\n" + cs;
    return s;
  }

  // ============================================================
  // STYLES
  // ============================================================
  var CSS = `
  .krm-root{ --krm-bg:#0f0c09; --krm-panel:#141009; --krm-ink:#f1e9d8; --krm-body:#b6a98f; --krm-dim:#8a7d66;
    --krm-brass:#c79a57; --krm-brass-b:#e6bd72; --krm-rule:rgba(199,154,87,.18); --krm-rule-soft:rgba(241,233,216,.08);
    --krm-mono:'JetBrains Mono',ui-monospace,monospace; --krm-disp:'Playfair Display',Georgia,serif; --krm-body-f:'EB Garamond',Georgia,serif;
    font-family:var(--krm-body-f); }
  .krm-hotspot{ position:fixed; right:0; bottom:0; width:30px; height:30px; z-index:2147483640; cursor:default; }
  .krm-launch{ position:fixed; right:22px; bottom:22px; z-index:2147483641; width:54px; height:54px; border-radius:50%;
    background:radial-gradient(120% 120% at 35% 30%, #1c160d, #0c0906); border:1px solid var(--krm-rule);
    color:var(--krm-brass-b); font-family:var(--krm-mono); font-size:15px; letter-spacing:.04em; cursor:pointer;
    box-shadow:0 10px 40px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.04); transition:transform .15s, border-color .15s; display:flex; align-items:center; justify-content:center; }
  .krm-launch:hover{ transform:translateY(-2px); border-color:var(--krm-brass); }
  .krm-launch .d{ width:7px; height:7px; border-radius:50%; background:var(--krm-brass-b); box-shadow:0 0 10px var(--krm-brass); }
  .krm-overlay{ position:fixed; inset:0; z-index:2147483645; background:rgba(6,5,3,.62); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; }
  .krm-modal{ width:min(440px,92vw); background:var(--krm-panel); border:1px solid var(--krm-rule); border-radius:10px; padding:28px; color:var(--krm-ink); box-shadow:0 30px 80px rgba(0,0,0,.6); }
  .krm-modal h2{ font-family:var(--krm-disp); font-weight:500; font-size:1.5rem; margin-bottom:6px; }
  .krm-modal p{ color:var(--krm-body); font-size:1rem; line-height:1.5; margin-bottom:16px; }
  .krm-modal .krm-mono{ font-family:var(--krm-mono); font-size:.7rem; letter-spacing:.12em; text-transform:uppercase; color:var(--krm-brass); margin-bottom:14px; }
  .krm-input,.krm-ta,.krm-sel{ width:100%; background:#0b0806; border:1px solid var(--krm-rule); color:var(--krm-ink);
    font-family:var(--krm-mono); font-size:.85rem; padding:11px 13px; border-radius:6px; outline:none; }
  .krm-input:focus,.krm-ta:focus,.krm-sel:focus{ border-color:var(--krm-brass); }
  .krm-ta{ resize:vertical; min-height:84px; font-family:var(--krm-body-f); font-size:1rem; line-height:1.5; }
  .krm-btn{ font-family:var(--krm-mono); font-size:.78rem; letter-spacing:.06em; padding:10px 16px; border-radius:6px;
    border:1px solid var(--krm-brass); background:var(--krm-brass); color:#1a1206; cursor:pointer; transition:opacity .15s; }
  .krm-btn:hover{ opacity:.9; } .krm-btn[disabled]{ opacity:.5; cursor:progress; }
  .krm-btn.ghost{ background:transparent; color:var(--krm-brass-b); }
  .krm-btn.ghost:hover{ background:var(--krm-brass-15,rgba(199,154,87,.12)); }
  .krm-row{ display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .krm-err{ color:#ffb4ab; font-family:var(--krm-mono); font-size:.78rem; margin-top:10px; min-height:1em; }

  .krm-panel{ position:fixed; right:22px; bottom:22px; z-index:2147483642; width:min(440px,calc(100vw - 32px));
    height:min(640px,calc(100vh - 44px)); background:var(--krm-panel); border:1px solid var(--krm-rule); border-radius:12px;
    display:flex; flex-direction:column; overflow:hidden; box-shadow:0 30px 90px rgba(0,0,0,.62), inset 0 0 0 1px rgba(255,255,255,.03); }
  .krm-head{ display:flex; align-items:center; gap:10px; padding:14px 16px; border-bottom:1px solid var(--krm-rule-soft); flex-shrink:0; }
  .krm-head .badge{ width:9px; height:9px; border-radius:50%; background:var(--krm-brass-b); box-shadow:0 0 8px var(--krm-brass); }
  .krm-head .ttl{ font-family:var(--krm-mono); font-size:.74rem; letter-spacing:.16em; text-transform:uppercase; color:var(--krm-brass); }
  .krm-head .sub{ font-family:var(--krm-mono); font-size:.62rem; color:var(--krm-dim); margin-top:2px; letter-spacing:.06em; }
  .krm-head .sp{ margin-left:auto; }
  .krm-ico{ background:none; border:0; color:var(--krm-dim); cursor:pointer; font-size:16px; padding:4px; line-height:1; transition:color .15s; }
  .krm-ico:hover{ color:var(--krm-brass-b); }
  .krm-lenses{ display:flex; gap:6px; padding:10px 12px; overflow-x:auto; border-bottom:1px solid var(--krm-rule-soft); flex-shrink:0; scrollbar-width:thin; }
  .krm-lens{ flex:0 0 auto; font-family:var(--krm-mono); font-size:.68rem; letter-spacing:.02em; padding:7px 11px; border-radius:999px;
    border:1px solid var(--krm-rule); background:transparent; color:var(--krm-body); cursor:pointer; white-space:nowrap; transition:border-color .15s,color .15s; }
  .krm-lens:hover{ border-color:var(--krm-brass); color:var(--krm-brass-b); }
  .krm-lens .g{ color:var(--krm-brass); margin-right:5px; }
  .krm-msgs{ flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:14px; }
  .krm-empty{ color:var(--krm-dim); font-family:var(--krm-body-f); font-size:1.02rem; line-height:1.55; text-align:left; margin:auto 0; }
  .krm-empty b{ color:var(--krm-brass-b); font-weight:500; }
  .krm-msg{ max-width:90%; font-size:1rem; line-height:1.55; }
  .krm-msg.user{ align-self:flex-end; background:#1a1409; border:1px solid var(--krm-rule); color:var(--krm-ink); padding:10px 13px; border-radius:9px 9px 2px 9px; font-family:var(--krm-mono); font-size:.82rem; }
  .krm-msg.ai{ align-self:flex-start; color:var(--krm-ink); white-space:pre-wrap; }
  .krm-msg.ai .tag{ display:block; font-family:var(--krm-mono); font-size:.6rem; letter-spacing:.14em; text-transform:uppercase; color:var(--krm-brass); margin-bottom:6px; }
  .krm-foot{ border-top:1px solid var(--krm-rule-soft); padding:12px; flex-shrink:0; }
  .krm-inrow{ display:flex; gap:8px; align-items:flex-end; }
  .krm-inrow textarea{ flex:1; background:#0b0806; border:1px solid var(--krm-rule); color:var(--krm-ink); border-radius:8px;
    font-family:var(--krm-body-f); font-size:1rem; padding:10px 12px; resize:none; outline:none; max-height:120px; line-height:1.4; }
  .krm-inrow textarea:focus{ border-color:var(--krm-brass); }
  .krm-send{ width:42px; height:42px; flex-shrink:0; border-radius:8px; border:1px solid var(--krm-brass); background:var(--krm-brass); color:#1a1206; cursor:pointer; font-size:16px; }
  .krm-send[disabled]{ opacity:.5; cursor:progress; }
  .krm-tools{ display:flex; gap:8px; margin-top:8px; flex-wrap:wrap; }
  .krm-chip{ font-family:var(--krm-mono); font-size:.64rem; letter-spacing:.04em; color:var(--krm-dim); border:1px solid var(--krm-rule-soft); border-radius:6px; padding:5px 9px; background:transparent; cursor:pointer; }
  .krm-chip:hover{ color:var(--krm-brass-b); border-color:var(--krm-rule); }
  .krm-settings{ position:absolute; inset:0; background:var(--krm-panel); display:flex; flex-direction:column; }
  .krm-tabs{ display:flex; border-bottom:1px solid var(--krm-rule-soft); flex-shrink:0; }
  .krm-tab{ flex:1; font-family:var(--krm-mono); font-size:.66rem; letter-spacing:.08em; text-transform:uppercase; padding:12px 6px; background:none; border:0; border-bottom:2px solid transparent; color:var(--krm-dim); cursor:pointer; }
  .krm-tab.on{ color:var(--krm-brass-b); border-bottom-color:var(--krm-brass); }
  .krm-sbody{ flex:1; overflow-y:auto; padding:18px; display:flex; flex-direction:column; gap:14px; }
  .krm-lbl{ font-family:var(--krm-mono); font-size:.64rem; letter-spacing:.1em; text-transform:uppercase; color:var(--krm-brass); }
  .krm-note{ font-family:var(--krm-mono); font-size:.66rem; line-height:1.5; color:var(--krm-dim); }
  .krm-cred{ display:flex; align-items:center; gap:10px; padding:9px 11px; border:1px solid var(--krm-rule-soft); border-radius:7px; }
  .krm-cred .nm{ font-family:var(--krm-mono); font-size:.76rem; color:var(--krm-ink); }
  .krm-cred .pf{ font-family:var(--krm-mono); font-size:.62rem; color:var(--krm-dim); }
  .krm-cred .proxy{ font-family:var(--krm-mono); font-size:.56rem; color:#ffb4ab; border:1px solid rgba(255,180,171,.3); padding:1px 5px; border-radius:4px; }
  .krm-cred .sp{ margin-left:auto; }
  .krm-del{ background:none; border:0; color:var(--krm-dim); cursor:pointer; font-size:14px; }
  .krm-del:hover{ color:#ffb4ab; }
  @media (prefers-reduced-motion: reduce){ .krm-launch{ transition:none; } }
  `;

  // ============================================================
  // DOM helpers
  // ============================================================
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  var root, launcher, hotspot, panel, busy = false;

  function injectStyles() {
    if (document.getElementById("krm-styles")) return;
    var st = el("style"); st.id = "krm-styles"; st.textContent = CSS; document.head.appendChild(st);
  }

  // ============================================================
  // GATE
  // ============================================================
  function setUnlocked(v, remember) {
    if (remember) { sset(SK.remember, "1"); sset(SK.unlocked, v ? "1" : ""); }
    else { sset(SK.remember, ""); sset(SK.unlocked, ""); try { sessionStorage.setItem(SK.unlocked, v ? "1" : ""); } catch (e) {} }
  }
  function isUnlocked() { try { if (sessionStorage.getItem(SK.unlocked) === "1") return true; } catch (e) {} return sget(SK.unlocked, "") === "1"; }
  function hasOwner() { return !!jget(SK.owner, null); }

  function openGate() {
    var owner = jget(SK.owner, null);
    var setup = !owner;
    var ov = el("div", "krm-overlay krm-root");
    var m = el("div", "krm-modal");
    m.innerHTML =
      '<div class="krm-mono">KR Mentor · Private</div>' +
      "<h2>" + (setup ? "Set up access" : "Unlock mentor") + "</h2>" +
      "<p>" + (setup
        ? "For your eyes only. Sign in below, or set an offline passphrase. Visitors without access never see the assistant."
        : "Sign in to reveal the mentor on this device.") + "</p>";

    var err = el("div", "krm-err");

    // --- Supabase auth (real) ---
    if (supaConfigured()) {
      var auth = el("div"); auth.style.cssText = "display:flex;flex-direction:column;gap:8px;margin-bottom:14px";
      var g = el("button", "krm-btn", "Continue with Google");
      g.onclick = async function () { try { await supaGoogle(); } catch (e) { err.textContent = e.message; } };
      var email = el("input", "krm-input"); email.type = "email"; email.placeholder = "you@email.com"; email.autocomplete = "email";
      var ml = el("button", "krm-btn ghost", "Email me a magic link");
      ml.onclick = async function () { if (!email.value.trim()) return; ml.disabled = true; try { await supaMagic(email.value.trim()); err.style.color = "var(--krm-brass-b)"; err.textContent = "Check your email for the sign-in link."; } catch (e) { err.style.color = ""; err.textContent = e.message; } ml.disabled = false; };
      auth.appendChild(g); auth.appendChild(email); auth.appendChild(ml);
      m.appendChild(auth);
      m.appendChild(el("div", "krm-note", "\u2014 or use an offline passphrase \u2014"));
    }

    // --- passphrase ---
    var inp = el("input", "krm-input"); inp.type = "password"; inp.placeholder = "Passphrase"; inp.autocomplete = "off"; inp.style.marginTop = "8px";
    m.appendChild(inp);
    var inp2 = null;
    if (setup) { inp2 = el("input", "krm-input"); inp2.type = "password"; inp2.placeholder = "Confirm passphrase"; inp2.style.marginTop = "8px"; m.appendChild(inp2); }
    var match = el("div", "krm-note"); match.style.minHeight = "1em"; if (setup) m.appendChild(match);

    var optRow = el("div", "krm-row"); optRow.style.cssText = "margin-top:10px;gap:18px";
    var revWrap = el("label"); revWrap.style.cssText = "display:flex;align-items:center;gap:6px;font-family:var(--krm-mono);font-size:.7rem;color:var(--krm-dim);cursor:pointer";
    var rev = el("input"); rev.type = "checkbox"; revWrap.appendChild(rev); revWrap.appendChild(document.createTextNode("Reveal"));
    var remWrap = el("label"); remWrap.style.cssText = revWrap.style.cssText;
    var rem = el("input"); rem.type = "checkbox"; rem.checked = true; remWrap.appendChild(rem); remWrap.appendChild(document.createTextNode("Remember me"));
    optRow.appendChild(revWrap); optRow.appendChild(remWrap); m.appendChild(optRow);
    rev.onchange = function () { var t = rev.checked ? "text" : "password"; inp.type = t; if (inp2) inp2.type = t; };

    function checkMatch() {
      if (!setup) return;
      if (!inp2.value) { match.textContent = ""; return; }
      if (inp.value === inp2.value) { match.style.color = "var(--krm-brass-b)"; match.textContent = "\u2713 match"; }
      else { match.style.color = "#ffb4ab"; match.textContent = "\u2717 don't match yet"; }
    }
    inp.addEventListener("input", checkMatch); if (inp2) inp2.addEventListener("input", checkMatch);

    m.appendChild(err);
    var row = el("div", "krm-row"); row.style.marginTop = "6px";
    var go = el("button", "krm-btn", setup ? "Set & unlock" : "Unlock");
    var cancel = el("button", "krm-btn ghost", "Cancel");
    row.appendChild(go); row.appendChild(cancel); m.appendChild(row);
    ov.appendChild(m); document.body.appendChild(ov);
    setTimeout(function () { (supaConfigured() && setup ? inp : inp).focus(); }, 30);

    function close() { ov.remove(); }
    cancel.onclick = close; ov.onclick = function (e) { if (e.target === ov) close(); };
    go.onclick = async function () {
      err.style.color = "";
      var pass = inp.value.trim();
      if (pass.length < 4) { err.textContent = "At least 4 characters."; return; }
      if (setup) {
        if (pass !== inp2.value.trim()) { err.textContent = "Passphrases don't match."; return; }
        var h = await hashPass(pass); jset(SK.owner, h); setUnlocked(true, rem.checked); close(); mount();
      } else {
        var hh = await hashPass(pass, owner.salt);
        if (hh.hash === owner.hash) { setUnlocked(true, rem.checked); close(); mount(); }
        else { err.textContent = "Wrong passphrase."; inp.select(); }
      }
    };
    function onEnter(e) { if (e.key === "Enter") go.click(); }
    inp.onkeydown = onEnter; if (inp2) inp2.onkeydown = onEnter;
  }

  // hidden reveal: keyboard combo OR corner triple-click
  function installReveal() {
    if (hotspot) return;
    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "M" || e.key === "m")) {
        e.preventDefault();
        if (isUnlocked()) { setUnlocked(false, sget(SK.remember, "") === "1"); supaSignOut(); if (root) { root.remove(); root = null; } pushHotspot(); }
        else openGate();
      }
    });
    pushHotspot();
  }
  var tapCount = 0, tapTimer = null;
  function pushHotspot() {
    if (hotspot) return;
    hotspot = el("div", "krm-hotspot krm-root");
    hotspot.title = "";
    hotspot.addEventListener("click", function () {
      tapCount++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(function () { tapCount = 0; }, 600);
      if (tapCount >= 3) { tapCount = 0; if (!isUnlocked()) openGate(); }
    });
    document.body.appendChild(hotspot);
  }

  // ============================================================
  // CHAT
  // ============================================================
  function loadChat() { return jget(SK.chat + PAGE_ID, []); }
  function saveChat(msgs) { jset(SK.chat + PAGE_ID, msgs.slice(-40)); }

  function renderMsgs(box) {
    var msgs = loadChat();
    box.innerHTML = "";
    if (!msgs.length) {
      box.appendChild(el("div", "krm-empty",
        "I read this page before answering. Pick a <b>lens</b> above, or ask me anything about <b>" + esc(PAGE_TITLE.split(",")[0]) + "</b>.<br><br>I won't flatter you. I'll tell you what's missing, what's weak, and what to do next."));
      return;
    }
    msgs.forEach(function (m) {
      if (m.role === "user") { box.appendChild(el("div", "krm-msg user", esc(m.content))); }
      else {
        var d = el("div", "krm-msg ai");
        d.innerHTML = (m.lens ? '<span class="tag">' + esc(m.lens) + "</span>" : "") + esc(m.content);
        box.appendChild(d);
      }
    });
    box.scrollTop = box.scrollHeight;
  }

  async function ask(userText, lensLabel, box, sendBtn) {
    if (busy) return;
    var msgs = loadChat();
    msgs.push({ role: "user", content: userText, lens: lensLabel });
    saveChat(msgs); renderMsgs(box);
    busy = true; if (sendBtn) sendBtn.disabled = true;
    var thinking = el("div", "krm-msg ai"); thinking.innerHTML = '<span class="tag">' + esc(lensLabel || "Mentor") + "</span>…thinking";
    box.appendChild(thinking); box.scrollTop = box.scrollHeight;
    try {
      var apiMsgs = loadChat().map(function (m) { return { role: m.role, content: m.content }; });
      var text = await complete(apiMsgs, systemFor());
      var arr = loadChat(); arr.push({ role: "assistant", content: text, lens: lensLabel }); saveChat(arr);
    } catch (e) {
      var arr2 = loadChat(); arr2.push({ role: "assistant", content: "⚠ " + (e.message || "Request failed.") , lens: "Error" }); saveChat(arr2);
    } finally {
      busy = false; if (sendBtn) sendBtn.disabled = false; renderMsgs(box);
    }
  }

  // ============================================================
  // SETTINGS
  // ============================================================
  var WEBHOOK_TYPES = ["Zapier", "Make", "n8n", "Webhook", "Cloudflare Worker", "Vercel Function", "Supabase Edge", "MCP Server"];
  function buildSettings(panelEl, onClose) {
    var wrap = el("div", "krm-settings");
    var tabs = el("div", "krm-tabs");
    var body = el("div", "krm-sbody");
    var TABS = ["Profile", "Auth", "Providers", "Keys", "Connections", "About"];
    var cur = "Profile";
    TABS.forEach(function (t) {
      var b = el("button", "krm-tab" + (t === cur ? " on" : ""), t);
      b.onclick = function () { cur = t; [].forEach.call(tabs.children, function (c) { c.classList.toggle("on", c.textContent === t); }); draw(); };
      tabs.appendChild(b);
    });
    var head = el("div", "krm-head");
    head.innerHTML = '<span class="ttl">Settings</span>';
    var close = el("button", "krm-ico", "✕"); close.style.marginLeft = "auto"; close.onclick = onClose;
    head.appendChild(close);
    wrap.appendChild(head); wrap.appendChild(tabs); wrap.appendChild(body);

    function draw() {
      body.innerHTML = "";
      if (cur === "Profile") drawProfile();
      else if (cur === "Auth") drawAuth();
      else if (cur === "Providers") drawProviders();
      else if (cur === "Keys") drawKeys();
      else if (cur === "Connections") drawConns();
      else drawAbout();
    }

    function drawAuth() {
      body.appendChild(el("div", "krm-lbl", "Supabase authentication (live)"));
      body.appendChild(el("div", "krm-note", "Enables real Google OAuth + email magic links. Paste your Supabase project URL and the ANON PUBLIC key (safe to expose; it is not a secret). Create a free project at supabase.com, enable the Google provider, and add this page's URL to the allowed redirect list."));
      var url = el("input", "krm-input"); url.placeholder = "https://xxxx.supabase.co"; url.value = sget(SK.supaUrl, "");
      var key = el("input", "krm-input"); key.placeholder = "anon public key (eyJ...)"; key.value = sget(SK.supaKey, "");
      body.appendChild(url); body.appendChild(key);
      var save = el("button", "krm-btn", "Save auth config");
      save.onclick = function () { sset(SK.supaUrl, url.value.trim()); sset(SK.supaKey, key.value.trim()); _supa = null; save.textContent = "Saved \u2713"; setTimeout(function () { save.textContent = "Save auth config"; }, 1200); };
      body.appendChild(save);
      var so = el("button", "krm-btn ghost", "Sign out (Supabase)"); so.onclick = function () { supaSignOut(); };
      body.appendChild(so);
      body.appendChild(el("div", "krm-note", "Offline passphrase still works without any of this \u2014 it's the zero-setup fallback. Reveal: Ctrl/Cmd+Shift+M or triple-click the bottom-right corner."));
    }

    function drawProviders() {
      body.appendChild(el("div", "krm-lbl", "Active AI provider"));
      body.appendChild(el("div", "krm-note", "Inside this workspace the built-in model is used automatically. Off-platform, pick a provider and add its key in the Keys tab. Browser-side keys are personal-use only."));
      var sel = el("select", "krm-sel");
      var opts = [["built-in", "Built-in (in-app runtime)"]];
      Object.keys(PROVIDERS).forEach(function (p) { opts.push([p, PROVIDERS[p].label]); });
      var curp = sget(SK.provider, "built-in");
      opts.forEach(function (o) { var e = el("option"); e.value = o[0]; e.textContent = o[1]; if (o[0] === curp) e.selected = true; sel.appendChild(e); });
      body.appendChild(sel);
      var modelLbl = el("div", "krm-lbl", "Model"); body.appendChild(modelLbl);
      var mi = el("input", "krm-input"); mi.value = sget(SK.providerModel, ""); mi.placeholder = "(leave blank = auto-latest, self-healing)";
      body.appendChild(mi);
      var hint = el("div", "krm-note"); body.appendChild(hint);
      function refreshHint() { var p = sel.value; hint.style.color = ""; hint.textContent = PROVIDERS[p] ? "Blank = newest model auto-detected from the provider and cached. Fallbacks: " + PROVIDERS[p].models.join(", ") : "Uses the in-app runtime \u2014 no model needed."; }
      refreshHint(); sel.onchange = refreshHint;
      var save = el("button", "krm-btn", "Save provider");
      save.onclick = function () { sset(SK.provider, sel.value); sset(SK.providerModel, mi.value.trim()); save.textContent = "Saved \u2713"; setTimeout(function () { save.textContent = "Save provider"; }, 1200); };
      body.appendChild(save);
      var det = el("button", "krm-btn ghost", "Detect latest now");
      det.onclick = async function () {
        var p = sel.value; if (!PROVIDERS[p]) { hint.textContent = "Built-in runtime \u2014 nothing to detect."; return; }
        var key = providerKey(p); if (!key) { hint.textContent = "Add a " + p + " key first (Keys tab)."; return; }
        det.disabled = true; det.textContent = "Detecting\u2026";
        try { var m = await resolveModel(p, key, { force: true }); hint.style.color = "var(--krm-brass-b)"; hint.textContent = "Latest detected: " + m + " (cached). Leave the model box blank to use it."; }
        catch (e) { hint.style.color = ""; hint.textContent = "Detection failed: " + (e.message || e); }
        det.disabled = false; det.textContent = "Detect latest now";
      };
      body.appendChild(det);
    }

    function drawProfile() {
      body.appendChild(el("div", "krm-lbl", "About you & your goals"));
      body.appendChild(el("div", "krm-note", "The mentor uses this on every page to ground its advice. Who you are, what you're building, what you're optimizing for."));
      var ta = el("textarea", "krm-ta"); ta.value = sget(SK.profile, ""); ta.placeholder = "I'm Kyle — builder/writer. I'm working toward… My current bottleneck is… Push me on…";
      body.appendChild(ta);
      var modelLbl = el("div", "krm-lbl", "Model (direct-API mode)"); body.appendChild(modelLbl);
      var mi = el("input", "krm-input"); mi.value = sget(SK.model, "claude-sonnet-4-6"); body.appendChild(mi);
      var save = el("button", "krm-btn", "Save"); save.onclick = function () { sset(SK.profile, ta.value.trim()); sset(SK.model, mi.value.trim() || "claude-sonnet-4-6"); save.textContent = "Saved ✓"; setTimeout(function () { save.textContent = "Save"; }, 1200); };
      body.appendChild(save);
    }

    function drawKeys() {
      var creds = jget(SK.creds, []);
      body.appendChild(el("div", "krm-lbl", "Credential vault (" + creds.length + ")"));
      body.appendChild(el("div", "krm-note", "Keys are stored ONLY in this browser, never in the site files. Anything not labeled 'anthropic' needs a backend proxy to actually call — they're held here for when you have one."));
      // add form
      var lab = el("input", "krm-input"); lab.placeholder = "Label (e.g. Notion prod)";
      var plat = el("input", "krm-input"); plat.placeholder = "Platform (e.g. notion, github, openai)";
      var keyi = el("input", "krm-input"); keyi.placeholder = "API key / token"; keyi.type = "password";
      body.appendChild(lab); body.appendChild(plat); body.appendChild(keyi);
      var add = el("button", "krm-btn", "Add key");
      add.onclick = function () {
        if (!keyi.value.trim()) return;
        var arr = jget(SK.creds, []);
        arr.push({ id: "c" + Date.now() + Math.random().toString(36).slice(2, 6), label: lab.value.trim() || plat.value.trim() || "key", platform: plat.value.trim().toLowerCase(), key: keyi.value.trim(), needsProxy: !/anthropic|claude/i.test(plat.value + lab.value) });
        jset(SK.creds, arr); draw();
      };
      body.appendChild(add);
      // bulk import
      body.appendChild(el("div", "krm-lbl", "Bulk import (.env paste)"));
      body.appendChild(el("div", "krm-note", "Paste KEY=VALUE lines. Each becomes a vault entry (platform = the part before the first underscore)."));
      var bulk = el("textarea", "krm-ta"); bulk.placeholder = "NOTION_TOKEN=secret_xxx\nGITHUB_PAT=ghp_xxx\nOPENAI_API_KEY=sk-xxx"; bulk.style.fontFamily = "var(--krm-mono)"; bulk.style.fontSize = ".78rem";
      body.appendChild(bulk);
      var imp = el("button", "krm-btn ghost", "Import lines");
      imp.onclick = function () {
        var arr = jget(SK.creds, []); var n = 0;
        bulk.value.split(/\n+/).forEach(function (line) {
          var m = line.match(/^\s*([A-Za-z0-9_.-]+)\s*=\s*(.+?)\s*$/); if (!m) return;
          var name = m[1], val = m[2].replace(/^["']|["']$/g, "");
          var platform = name.split("_")[0].toLowerCase();
          arr.push({ id: "c" + Date.now() + n + Math.random().toString(36).slice(2, 5), label: name, platform: platform, key: val, needsProxy: !/anthropic|claude/i.test(name) });
          n++;
        });
        jset(SK.creds, arr); bulk.value = ""; draw();
      };
      body.appendChild(imp);
      // active anthropic key picker
      var anth = creds.filter(function (c) { return /anthropic|claude/i.test(c.platform || c.label); });
      if (anth.length) {
        body.appendChild(el("div", "krm-lbl", "Active Anthropic key (for direct-API mode)"));
        var sel = el("select", "krm-sel");
        anth.forEach(function (c) { var o = el("option"); o.value = c.id; o.textContent = c.label; if (sget(SK.activeKey, "") === c.id) o.selected = true; sel.appendChild(o); });
        sel.onchange = function () { sset(SK.activeKey, sel.value); };
        if (!sget(SK.activeKey, "")) sset(SK.activeKey, anth[0].id);
        body.appendChild(sel);
      }
      // list
      creds.forEach(function (c) {
        var row = el("div", "krm-cred");
        row.innerHTML = '<div><div class="nm">' + esc(c.label) + '</div><div class="pf">' + esc(c.platform || "—") + " · ••••" + esc((c.key || "").slice(-4)) + "</div></div>";
        if (c.needsProxy) { var p = el("span", "proxy", "needs proxy"); row.appendChild(p); }
        var sp = el("span", "sp"); row.appendChild(sp);
        var del = el("button", "krm-del", "🗑");
        del.onclick = function () { var arr = jget(SK.creds, []).filter(function (x) { return x.id !== c.id; }); jset(SK.creds, arr); draw(); };
        row.appendChild(del);
        body.appendChild(row);
      });
    }

    function drawConns() {
      var conns = jget(SK.conns, []);
      body.appendChild(el("div", "krm-lbl", "Webhook tools (" + conns.length + ")"));
      body.appendChild(el("div", "krm-note", "These fire from your browser — they work on the live site. Zapier/Make/n8n catch-hooks and generic webhooks authenticate by unguessable URL, so no secret is exposed."));
      var type = el("select", "krm-sel"); WEBHOOK_TYPES.forEach(function (t) { var o = el("option"); o.textContent = t; type.appendChild(o); });
      var lab = el("input", "krm-input"); lab.placeholder = "Label (e.g. Log to Notion via Zapier)";
      var url = el("input", "krm-input"); url.placeholder = "Webhook URL (https://…)";
      body.appendChild(type); body.appendChild(lab); body.appendChild(url);
      var add = el("button", "krm-btn", "Add webhook");
      add.onclick = function () {
        if (!/^https?:\/\//.test(url.value.trim())) return;
        var arr = jget(SK.conns, []);
        arr.push({ id: "w" + Date.now(), type: type.value, label: lab.value.trim() || type.value, url: url.value.trim() });
        jset(SK.conns, arr); draw();
      };
      body.appendChild(add);
      conns.forEach(function (c) {
        var row = el("div", "krm-cred");
        var detail = c.kind === "native" ? (esc(c.target) + (c.resource ? " \u00b7 " + esc(c.resource) : "") + " \u00b7 via proxy") : (esc((c.url || "").slice(0, 38)) + "\u2026");
        row.innerHTML = '<div><div class="nm">' + esc(c.label) + '</div><div class="pf">' + esc(c.type) + " \u00b7 " + detail + "</div></div>";
        var sp = el("span", "sp"); row.appendChild(sp);
        var del = el("button", "krm-del", "🗑");
        del.onclick = function () { jset(SK.conns, jget(SK.conns, []).filter(function (x) { return x.id !== c.id; })); draw(); };
        row.appendChild(del);
        body.appendChild(row);
      });
      body.appendChild(el("div", "krm-lbl", "Backend proxy"));
      body.appendChild(el("div", "krm-note", "For key-based APIs (Notion, GitHub, Google, Microsoft, MCP). Deploy the included proxy (proxy-deploy/) to Cloudflare/Vercel/Supabase, then paste its URL + the PROXY_TOKEN you set. The proxy holds the real secrets server-side."));
      var px = el("input", "krm-input"); px.placeholder = "https://kr-mentor-proxy.you.workers.dev"; px.value = sget(SK.proxyUrl, "");
      var pt = el("input", "krm-input"); pt.type = "password"; pt.placeholder = "PROXY_TOKEN"; pt.value = sget(SK.proxyToken, "");
      body.appendChild(px); body.appendChild(pt);
      var pxs = el("button", "krm-btn ghost", "Save proxy");
      pxs.onclick = function () { sset(SK.proxyUrl, px.value.trim()); sset(SK.proxyToken, pt.value.trim()); pxs.textContent = "Saved \u2713"; setTimeout(function () { pxs.textContent = "Save proxy"; }, 1200); };
      body.appendChild(pxs);

      body.appendChild(el("div", "krm-lbl", "Native integration (routed through proxy)"));
      body.appendChild(el("div", "krm-note", "Adds a one-tap action chip. GitHub creates an issue in owner/repo; Notion adds a page to a database id; others POST page context. Requires the proxy above with the matching secret set."));
      var ntype = el("select", "krm-sel"); NATIVE_TARGETS.forEach(function (t) { var o = el("option"); o.value = t; o.textContent = t; ntype.appendChild(o); });
      var nlab = el("input", "krm-input"); nlab.placeholder = "Label (e.g. Log to my repo)";
      var nres = el("input", "krm-input"); nres.placeholder = "owner/repo";
      ntype.onchange = function () { nres.placeholder = ntype.value === "github" ? "owner/repo" : ntype.value === "notion" ? "database id" : "path (optional)"; };
      body.appendChild(ntype); body.appendChild(nlab); body.appendChild(nres);
      var nadd = el("button", "krm-btn", "Add native action");
      nadd.onclick = function () {
        var arr = jget(SK.conns, []);
        arr.push({ id: "n" + Date.now(), kind: "native", type: ntype.value, target: ntype.value, label: nlab.value.trim() || ntype.value, resource: nres.value.trim() });
        jset(SK.conns, arr); draw();
      };
      body.appendChild(nadd);
    }

    function drawAbout() {
      body.appendChild(el("div", "krm-lbl", "How privacy works"));
      body.appendChild(el("div", "krm-note",
        "• The mentor is hidden until unlocked with your passphrase; visitors never see a launcher.\n• Unlock with Ctrl/Cmd+Shift+M, or triple-click the bottom-right corner.\n• Same combo while unlocked = lock & hide again.\n• This is obfuscation, not hard security — the code is readable. Don't rely on it to protect real secrets.\n• Keys, profile, and chats live only in this browser's storage.".replace(/\n/g, "<br>")));
      body.appendChild(el("div", "krm-lbl", "Reset"));
      var wipe = el("button", "krm-btn ghost", "Erase all mentor data on this device");
      wipe.onclick = function () {
        if (!confirm("Erase passphrase, keys, connections, profile, and all chats from this browser?")) return;
        Object.keys(localStorage).forEach(function (k) { if (k.indexOf("kr-mentor") === 0) localStorage.removeItem(k); });
        location.reload();
      };
      body.appendChild(wipe);
    }

    draw();
    panelEl.appendChild(wrap);
    return wrap;
  }

  // ============================================================
  // PANEL
  // ============================================================
  function openPanel() {
    if (panel) { panel.remove(); panel = null; return; }
    panel = el("div", "krm-panel krm-root");
    // header
    var head = el("div", "krm-head");
    head.innerHTML = '<span class="badge"></span><div><div class="ttl">KR Mentor</div><div class="sub">' + esc(PAGE_TITLE.split(",")[0].slice(0, 32)) + "</div></div>";
    var sp = el("span", "sp"); head.appendChild(sp);
    var setBtn = el("button", "krm-ico", "⚙"); setBtn.title = "Settings";
    var clrBtn = el("button", "krm-ico", "⟲"); clrBtn.title = "Clear this page's chat";
    var minBtn = el("button", "krm-ico", "—"); minBtn.title = "Close";
    head.appendChild(setBtn); head.appendChild(clrBtn); head.appendChild(minBtn);
    panel.appendChild(head);
    // lenses
    var lenseRow = el("div", "krm-lenses");
    LENSES.forEach(function (L) {
      var b = el("button", "krm-lens", '<span class="g">' + L.glyph + "</span>" + L.label);
      b.onclick = function () { ask(L.prompt, L.label, msgs, send); };
      lenseRow.appendChild(b);
    });
    panel.appendChild(lenseRow);
    // messages
    var msgs = el("div", "krm-msgs"); panel.appendChild(msgs);
    // footer
    var foot = el("div", "krm-foot");
    var inrow = el("div", "krm-inrow");
    var ta = el("textarea"); ta.rows = 1; ta.placeholder = "Ask the mentor…";
    var send = el("button", "krm-send", "↑");
    inrow.appendChild(ta); inrow.appendChild(send); foot.appendChild(inrow);
    // tools row (webhooks)
    var tools = el("div", "krm-tools"); foot.appendChild(tools);
    function refreshTools() {
      tools.innerHTML = "";
      var conns = jget(SK.conns, []);
      conns.slice(0, 6).forEach(function (c) {
        var chip = el("button", "krm-chip", "\u21f2 " + esc(c.label));
        if (c.kind === "native") { chip.title = c.target + " action via proxy"; chip.onclick = function () { doNativeAction(c, chip); }; }
        else { chip.title = "Send page context + last reply to " + c.label; chip.onclick = function () { fireWebhook(c, chip); }; }
        tools.appendChild(chip);
      });
    }
    refreshTools();
    panel.appendChild(foot);
    document.body.appendChild(panel);
    renderMsgs(msgs);

    function autosize() { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 120) + "px"; }
    ta.addEventListener("input", autosize);
    function submit() { var v = ta.value.trim(); if (!v) return; ta.value = ""; autosize(); ask(v, null, msgs, send); }
    send.onclick = submit;
    ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } });
    minBtn.onclick = function () { panel.remove(); panel = null; };
    clrBtn.onclick = function () { if (confirm("Clear the mentor chat for this page?")) { saveChat([]); renderMsgs(msgs); } };
    setBtn.onclick = function () {
      var sw = buildSettings(panel, function () { sw.remove(); refreshTools(); });
    };
    setTimeout(function () { ta.focus(); }, 40);
  }

  var NATIVE_TARGETS = ["notion", "github", "google", "microsoft", "openai", "mcp"];
  async function proxyCall(target, method, path, body) {
    var base = sget(SK.proxyUrl, ""); var tok = sget(SK.proxyToken, "");
    if (!base) throw new Error("Set the Backend proxy URL in Settings \u2192 Connections.");
    var r = await fetch(base, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + tok }, body: JSON.stringify({ target: target, method: method, path: path, body: body }) });
    var txt = await r.text(); var d; try { d = JSON.parse(txt); } catch (e) { d = txt; }
    if (!r.ok) throw new Error((d && d.error) || ("Proxy " + r.status));
    return d;
  }
  async function doNativeAction(conn, chip) {
    var chat = loadChat(); var lastAi = chat.filter(function (m) { return m.role === "assistant"; }).slice(-1)[0];
    var content = ((lastAi && lastAi.content) || pageContext().slice(0, 1500));
    var orig = chip.textContent; chip.textContent = "sending\u2026"; chip.disabled = true;
    try {
      if (conn.target === "github") {
        if (!/.+\/.+/.test(conn.resource || "")) throw new Error("set owner/repo");
        var g = await proxyCall("github", "POST", "/repos/" + conn.resource + "/issues", { title: "[KR Mentor] " + PAGE_TITLE.split(",")[0], body: content + "\n\n\u2014 from " + location.href });
        chip.textContent = g.number ? "issue #" + g.number : "sent \u2713";
      } else if (conn.target === "notion") {
        if (!conn.resource) throw new Error("set database id");
        var n = await proxyCall("notion", "POST", "/v1/pages", { parent: { database_id: conn.resource }, properties: { Name: { title: [{ text: { content: PAGE_TITLE.split(",")[0] } }] } }, children: [{ object: "block", type: "paragraph", paragraph: { rich_text: [{ type: "text", text: { content: content.slice(0, 1900) } }] } }] });
        chip.textContent = n.id ? "saved \u2713" : "sent \u2713";
      } else {
        await proxyCall(conn.target || "url", "POST", conn.resource || "", { page: PAGE_ID, title: PAGE_TITLE, content: content });
        chip.textContent = "sent \u2713";
      }
    } catch (e) { chip.textContent = "\u2717 " + String(e.message || "failed").slice(0, 20); }
    finally { chip.disabled = false; setTimeout(function () { chip.textContent = orig; }, 2400); }
  }

  function fireWebhook(conn, chip) {
    var chat = loadChat();
    var lastAi = chat.filter(function (m) { return m.role === "assistant"; }).slice(-1)[0];
    var payload = {
      source: "kr-mentor", page: PAGE_ID, title: PAGE_TITLE, url: location.href,
      ts: new Date().toISOString(),
      lastReply: lastAi ? lastAi.content : "", context: pageContext().slice(0, 1500),
    };
    var orig = chip.textContent; chip.textContent = "sending…";
    fetch(conn.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function () { chip.textContent = "sent ✓"; })
      .catch(function () {
        // retry no-cors (fire-and-forget; webhooks often don't return CORS headers)
        fetch(conn.url, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) })
          .then(function () { chip.textContent = "sent ✓"; })
          .catch(function () { chip.textContent = "failed ✕"; });
      })
      .finally(function () { setTimeout(function () { chip.textContent = orig; }, 1600); });
  }

  // ============================================================
  // MOUNT
  // ============================================================
  function mount() {
    if (!isUnlocked()) return;
    if (hotspot) { hotspot.remove(); hotspot = null; }
    if (root) return;
    root = el("div", "krm-root");
    launcher = el("button", "krm-launch"); launcher.title = "KR Mentor (private)";
    launcher.innerHTML = '<span class="d"></span>';
    launcher.onclick = openPanel;
    root.appendChild(launcher);
    document.body.appendChild(root);
  }

  function init() {
    injectStyles();
    installReveal();
    if (isUnlocked() && (hasOwner() || supaConfigured())) mount();
    if (supaConfigured()) {
      getSupa().then(function (s) {
        if (!s) return;
        s.auth.getSession().then(function (r) { if (r && r.data && r.data.session) { setUnlocked(true, true); mount(); } });
        s.auth.onAuthStateChange(function (_evt, session) { if (session) { setUnlocked(true, true); mount(); } });
      }).catch(function () {});
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
