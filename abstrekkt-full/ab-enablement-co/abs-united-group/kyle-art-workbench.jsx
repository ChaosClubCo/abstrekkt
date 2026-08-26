import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// KYLE ⇄ ART — Shared Capability Workbench
// Two-player artifact. Shared state via window.storage (shared:true).
// Publish this artifact, send Art the link. Both sides read/write
// the same map. "Court" items flag whose move it is.
// ─────────────────────────────────────────────────────────────

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=IBM+Plex+Mono:wght@400;500&display=swap');`;

const T = {
  bg: "#0a0a0d", surface: "#101016", raised: "#16161f", border: "#23232f",
  borderHot: "#3a3a4d", text: "#e9e7f2", muted: "#8c89a3", dim: "#56536b",
  kyle: "#8b78f8", kyleBg: "rgba(139,120,248,0.10)",
  art: "#e8a050", artBg: "rgba(232,160,80,0.10)",
  seam: "#4fd1a5", seamBg: "rgba(79,209,165,0.10)",
  danger: "#e8638c",
};

const hd = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const mn = { fontFamily: "'IBM Plex Mono', monospace" };

// Kyle's pre-filled side — verified facts only, FlashFusion lane.
const KYLE_SEED = [
  { id: "k1", text: "Curriculum infrastructure — SparkAcademy: 32 courses, 125 lessons, structured learning paths, role-based onboarding flows", locked: false },
  { id: "k2", text: "Automation & systems layer — n8n workflows, 50+ custom Claude skills, multi-step agent pipelines", locked: false },
  { id: "k3", text: "Live assessment platform — audit.flashfusion.co (free AI setup scorecard, report generation)", locked: false },
  { id: "k4", text: "Deep GUI/web Claude practice — Projects, custom instructions, prompt libraries, artifact tooling", locked: false },
  { id: "k5", text: "CLC connection — College of Lake County; existing relationship inside, interest in teaching there", locked: false },
];

// Art's side — pre-filled from due diligence. Hypotheses, not facts:
// each carries its reasoning. Confirm or correct LIVE in the meeting.
const ART_SEED = [
  { id: "a1", hyp: "open", text: "DOMAIN — Knows the day-to-day agents actually struggle with: follow-up, listing copy, CMAs, compliant marketing — plus how agents think and what keeps them motivated. That insider read is rare. (Basis: he lives both sides — runs the business and coaches.)" },
  { id: "a2", hyp: "open", text: "TEACHING MODEL — Live, relationship-driven coaching: 2x/wk base, heavier tiers, team tiers. Guessing renewals come from accountability + AI moving fast enough that there's always new material. (Basis: the package structure.)" },
  { id: "a3", hyp: "open", text: "CLIENT BASE — Guessing 10–25 active clients given the high-touch cadence — a mix of solo agents and a few teams. (Basis: rough calendar math; could easily be wrong.)" },
  { id: "a4", hyp: "open", text: "TOOL STACK — Guessing ChatGPT and/or Claude on paid tiers, with Custom GPTs or Projects in the mix. Curious where his personal stack differs from what clients start with. (Basis: web/GUI focus.)" },
  { id: "a5", hyp: "open", text: "★ THE OPPORTUNITY — A version of the coaching that earns without live hours: course, toolkit, or async tier. Guess: it's been on the list a while and keeps losing to the calendar — and that's exactly the kind of build Kyle does all day. (If this read is wrong, edit or delete it.)" },
];

const SEAM_SEED = [
  { id: "s1", text: "Real estate CE course — agents need continuing-ed hours every cycle; an AI course they actually want", votes: { kyle: false, art: false } },
  { id: "s2", text: "CLC adult-ed / workforce channel — community colleges need AI curriculum; neither of us gets in the door alone", votes: { kyle: false, art: false } },
  { id: "s3", text: "Scale the coaching model — turn live-hours-only delivery into tiers that don't require calendar time", votes: { kyle: false, art: false } },
];

// ── storage helpers ──────────────────────────────────────────
async function loadShared(key, fallback) {
  try {
    const r = await window.storage.get(key, true);
    return r ? JSON.parse(r.value) : fallback;
  } catch (e) { return fallback; }
}
async function saveShared(key, val) {
  try { await window.storage.set(key, JSON.stringify(val), true); } catch (e) { console.error("save failed", e); }
}
async function loadLocal(key, fallback) {
  try {
    const r = await window.storage.get(key, false);
    return r ? JSON.parse(r.value) : fallback;
  } catch (e) { return fallback; }
}
async function saveLocal(key, val) {
  try { await window.storage.set(key, JSON.stringify(val), false); } catch (e) { console.error("save failed", e); }
}

const newId = () => "x" + Math.random().toString(36).slice(2, 9);

// ── small components ─────────────────────────────────────────
function Badge({ color, bg, children }) {
  return (
    <span style={{ ...mn, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color, background: bg, padding: "2px 8px", borderRadius: 4 }}>
      {children}
    </span>
  );
}

function Btn({ onClick, children, accent, small, danger }) {
  const c = danger ? T.danger : accent || T.muted;
  return (
    <button
      onClick={onClick}
      style={{
        ...mn, fontSize: small ? 10 : 11, letterSpacing: 0.5, cursor: "pointer",
        background: "transparent", color: c, border: `1px solid ${danger ? "rgba(232,99,140,0.4)" : accent ? c : T.border}`,
        borderRadius: 6, padding: small ? "3px 9px" : "6px 13px", transition: "all .15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = T.raised; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}

function ItemRow({ item, color, onEdit, onDelete, onVerify, editable }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);
  if (editing) {
    return (
      <div style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          style={{ flex: 1, background: T.raised, color: T.text, border: `1px solid ${T.borderHot}`, borderRadius: 6, padding: 8, fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Btn small accent={color} onClick={() => { onEdit(draft); setEditing(false); }}>save</Btn>
          <Btn small onClick={() => { setDraft(item.text); setEditing(false); }}>cancel</Btn>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, marginTop: 7, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, lineHeight: 1.55, color: T.text }}>{item.text}</div>
        {item.hyp === "open" ? (
          <button onClick={onVerify} style={{ ...mn, fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase", color: T.art, background: T.artBg, border: `1px solid rgba(232,160,80,0.35)`, borderRadius: 4, padding: "2px 8px", marginTop: 6, cursor: "pointer" }}>
            hypothesis — tap when confirmed live
          </button>
        ) : null}
        {item.hyp === "confirmed" ? (
          <span style={{ ...mn, fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase", color: T.seam, background: T.seamBg, borderRadius: 4, padding: "2px 8px", marginTop: 6, display: "inline-block" }}>
            ✓ confirmed live
          </span>
        ) : null}
      </div>
      {editable ? (
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <Btn small onClick={() => setEditing(true)}>edit</Btn>
          <Btn small danger onClick={onDelete}>×</Btn>
        </div>
      ) : null}
    </div>
  );
}

// ── main app ─────────────────────────────────────────────────
export default function Workbench() {
  const [who, setWho] = useState(null);          // "kyle" | "art"
  const [tab, setTab] = useState("map");
  const [state, setState] = useState(null);       // shared state blob
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [drafts, setDrafts] = useState({ kyle: "", art: "" });
  const [newCourtTitle, setNewCourtTitle] = useState("");
  const [newCourtOwner, setNewCourtOwner] = useState("art");
  const [lastDeleted, setLastDeleted] = useState(null); // { side, item, index }

  const defaultState = {
    kyleItems: KYLE_SEED,
    artItems: ART_SEED,
    seamItems: SEAM_SEED,
    court: [],
    nextStep: "",
    updatedBy: null,
    updatedAt: null,
  };

  // initial load
  useEffect(() => {
    (async () => {
      const me = await loadLocal("workbench-identity", null);
      if (me) setWho(me);
      const s = await loadShared("workbench-state-v1", defaultState);
      setState(s);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (next) => {
    const stamped = { ...next, updatedBy: who, updatedAt: new Date().toISOString() };
    setState(stamped);
    setSyncing(true);
    await saveShared("workbench-state-v1", stamped);
    setSyncing(false);
  }, [who]);

  const refresh = async () => {
    setSyncing(true);
    const s = await loadShared("workbench-state-v1", defaultState);
    setState(s);
    setSyncing(false);
  };

  const pickIdentity = async (id) => {
    setWho(id);
    await saveLocal("workbench-identity", id);
  };

  // ── identity gate ──
  if (loading) {
    return (
      <div style={{ ...hd, background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: T.muted }}>
        <style>{FONT}</style>
        <span style={mn}>loading shared state…</span>
      </div>
    );
  }

  if (!who) {
    return (
      <div style={{ ...hd, background: T.bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, padding: 24 }}>
        <style>{FONT}</style>
        <div style={{ ...mn, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: T.dim }}>Shared Workbench</div>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: T.text, textAlign: "center", lineHeight: 1.2 }}>Who's here?</h1>
        <p style={{ color: T.muted, fontSize: 13, maxWidth: 380, textAlign: "center", lineHeight: 1.6 }}>
          This workspace is shared — what either of you adds, the other sees. Pick your side once; it sticks on your device.
        </p>
        <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
          <button onClick={() => pickIdentity("kyle")} style={{ ...hd, fontSize: 17, fontWeight: 600, color: T.kyle, background: T.kyleBg, border: `1px solid ${T.kyle}`, borderRadius: 10, padding: "16px 38px", cursor: "pointer" }}>I'm Kyle</button>
          <button onClick={() => pickIdentity("art")} style={{ ...hd, fontSize: 17, fontWeight: 600, color: T.art, background: T.artBg, border: `1px solid ${T.art}`, borderRadius: 10, padding: "16px 38px", cursor: "pointer" }}>I'm Art</button>
        </div>
      </div>
    );
  }

  const myColor = who === "kyle" ? T.kyle : T.art;
  const other = who === "kyle" ? "art" : "kyle";
  const pendingForMe = (state.court || []).filter((c) => c.owner === who && c.status === "open").length;

  // ── mutations ──
  const addItem = (side) => {
    const t = (drafts[side] || "").trim();
    if (!t) return;
    const item = { id: newId(), text: t };
    const key = side === "kyle" ? "kyleItems" : "artItems";
    persist({ ...state, [key]: [...state[key], item] });
    setDrafts({ ...drafts, [side]: "" });
  };
  const editItem = (side, id, text) => {
    const key = side === "kyle" ? "kyleItems" : "artItems";
    persist({ ...state, [key]: state[key].map((i) => (i.id === id ? { ...i, text } : i)) });
  };
  const confirmItem = (side, id) => {
    const key = side === "kyle" ? "kyleItems" : "artItems";
    persist({ ...state, [key]: state[key].map((i) => (i.id === id ? { ...i, hyp: "confirmed" } : i)) });
  };
  const deleteItem = (side, id) => {
    const key = side === "kyle" ? "kyleItems" : "artItems";
    const index = state[key].findIndex((i) => i.id === id);
    if (index === -1) return;
    setLastDeleted({ side, item: state[key][index], index });
    persist({ ...state, [key]: state[key].filter((i) => i.id !== id) });
  };
  const undoDelete = () => {
    if (!lastDeleted) return;
    const key = lastDeleted.side === "kyle" ? "kyleItems" : "artItems";
    const arr = [...state[key]];
    arr.splice(Math.min(lastDeleted.index, arr.length), 0, lastDeleted.item);
    persist({ ...state, [key]: arr });
    setLastDeleted(null);
  };
  const restoreSeeds = () => {
    const haveK = new Set(state.kyleItems.map((i) => i.id));
    const haveA = new Set(state.artItems.map((i) => i.id));
    persist({
      ...state,
      kyleItems: [...state.kyleItems, ...KYLE_SEED.filter((s) => !haveK.has(s.id))],
      artItems: [...state.artItems, ...ART_SEED.filter((s) => !haveA.has(s.id))],
    });
  };
  const voteSeam = (id) => {
    persist({
      ...state,
      seamItems: state.seamItems.map((s) =>
        s.id === id ? { ...s, votes: { ...s.votes, [who]: !s.votes[who] } } : s
      ),
    });
  };
  const addSeam = () => {
    if (!newItemText.trim()) return;
    persist({ ...state, seamItems: [...state.seamItems, { id: newId(), text: newItemText.trim(), votes: { kyle: false, art: false } }] });
    setNewItemText("");
  };
  const addCourt = () => {
    if (!newCourtTitle.trim()) return;
    const item = { id: newId(), title: newCourtTitle.trim(), owner: newCourtOwner, createdBy: who, status: "open", createdAt: new Date().toISOString() };
    persist({ ...state, court: [item, ...(state.court || [])] });
    setNewCourtTitle("");
  };
  const completeCourt = (id) => {
    persist({ ...state, court: state.court.map((c) => (c.id === id ? { ...c, status: "done" } : c)) });
  };
  const setNextStep = (v) => persist({ ...state, nextStep: v });

  // ── column renderer ──
  const renderColumn = (side, items) => {
    const color = side === "kyle" ? T.kyle : T.art;
    const bg = side === "kyle" ? T.kyleBg : T.artBg;
    const label = side === "kyle" ? "KYLE — systems & curriculum" : "ART — domain & distribution";
    const mine = who === side;
    return (
      <div style={{ flex: 1, minWidth: 280, background: T.surface, border: `1px solid ${T.border}`, borderTop: `2px solid ${color}`, borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Badge color={color} bg={bg}>{label}</Badge>
          {mine ? <Badge color={T.seam} bg={T.seamBg}>your side</Badge> : null}
        </div>
        {items.map((item) => (
          <ItemRow key={item.id} item={item} color={color} editable
            onEdit={(t) => editItem(side, item.id, t)}
            onDelete={() => deleteItem(side, item.id)}
            onVerify={() => confirmItem(side, item.id)} />
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            value={drafts[side]}
            onChange={(e) => setDrafts({ ...drafts, [side]: e.target.value })}
            onKeyDown={(e) => { if (e.key === "Enter") addItem(side); }}
            placeholder={`Add to ${side}'s side…`}
            style={{ flex: 1, background: T.raised, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit" }}
          />
          <Btn accent={color} onClick={() => addItem(side)}>add</Btn>
        </div>
      </div>
    );
  };

  return (
    <div style={{ ...hd, background: T.bg, minHeight: "100vh", color: T.text }}>
      <style>{FONT}</style>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "28px 20px 80px" }}>

        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, paddingBottom: 18, borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
          <div>
            <div style={{ ...mn, fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: T.dim, marginBottom: 6 }}>Shared Workbench · live for both of you</div>
            <h1 style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.1 }}>
              <span style={{ color: T.kyle }}>Kyle</span>
              <span style={{ color: T.dim }}> ⇄ </span>
              <span style={{ color: T.art }}>Art</span>
              <span style={{ color: T.muted, fontWeight: 400 }}> — who knows what</span>
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {pendingForMe > 0 ? (
              <Badge color={T.danger} bg="rgba(232,99,140,0.12)">{pendingForMe} waiting on you</Badge>
            ) : null}
            <Badge color={myColor} bg={who === "kyle" ? T.kyleBg : T.artBg}>signed in: {who}</Badge>
            <Btn small onClick={restoreSeeds}>restore starter cards</Btn>
            <Btn small onClick={refresh}>{syncing ? "syncing…" : "↻ refresh"}</Btn>
          </div>
        </div>

        {lastDeleted ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: T.surface, border: `1px solid ${T.borderHot}`, borderRadius: 8, padding: "9px 14px", marginBottom: 16 }}>
            <span style={{ fontSize: 12.5, color: T.muted, flex: 1 }}>
              Card deleted: "{lastDeleted.item.text.slice(0, 60)}{lastDeleted.item.text.length > 60 ? "…" : ""}"
            </span>
            <Btn small accent={T.seam} onClick={undoDelete}>undo</Btn>
            <Btn small onClick={() => setLastDeleted(null)}>dismiss</Btn>
          </div>
        ) : null}

        {/* tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
          {[["map", "Capability Map"], ["seam", "The Seam"], ["court", `Court${pendingForMe ? " · " + pendingForMe : ""}`], ["next", "Next Step"]].map(([k, lbl]) => (
            <button key={k} onClick={() => setTab(k)}
              style={{ ...mn, fontSize: 11, letterSpacing: 0.5, padding: "7px 16px", borderRadius: 7, cursor: "pointer",
                background: tab === k ? T.raised : "transparent",
                color: tab === k ? T.text : T.muted,
                border: `1px solid ${tab === k ? T.borderHot : T.border}` }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* MAP */}
        {tab === "map" ? (
          <div>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 16, maxWidth: 720 }}>
              Both columns arrive pre-filled. Kyle's side is what's real today. Art's side is homework —
              honest guesses from the warm-up talks, each with its reasoning, written to be corrected.
              Tap a guess when it's confirmed live; edit it where the read was wrong. A corrected guess
              is worth more than a confirmed one.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {renderColumn("kyle", state.kyleItems)}
              {renderColumn("art", state.artItems)}
            </div>
          </div>
        ) : null}

        {/* SEAM */}
        {tab === "seam" ? (
          <div style={{ maxWidth: 720 }}>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 16 }}>
              Where the columns overlap into something neither of you does alone. Both of you can tap
              <strong style={{ color: T.seam }}> interested</strong> — two marks means it's worth a real conversation.
            </p>
            {state.seamItems.map((s) => {
              const both = s.votes.kyle && s.votes.art;
              return (
                <div key={s.id} style={{ background: T.surface, border: `1px solid ${both ? T.seam : T.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ fontSize: 13.5, lineHeight: 1.55, flex: 1 }}>{s.text}</div>
                    <Btn small accent={s.votes[who] ? T.seam : null} onClick={() => voteSeam(s.id)}>
                      {s.votes[who] ? "✓ interested" : "interested?"}
                    </Btn>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                    {s.votes.kyle ? <Badge color={T.kyle} bg={T.kyleBg}>kyle ✓</Badge> : null}
                    {s.votes.art ? <Badge color={T.art} bg={T.artBg}>art ✓</Badge> : null}
                    {both ? <Badge color={T.seam} bg={T.seamBg}>★ mutual — talk about this one</Badge> : null}
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <input value={newItemText} onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addSeam(); }}
                placeholder="Add a play either of you sees…"
                style={{ flex: 1, background: T.raised, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit" }} />
              <Btn accent={T.seam} onClick={addSeam}>add</Btn>
            </div>
          </div>
        ) : null}

        {/* COURT */}
        {tab === "court" ? (
          <div style={{ maxWidth: 720 }}>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 16 }}>
              The handoff ledger. Every item names whose move it is. When you open this and see
              <strong style={{ color: T.danger }}> waiting on you</strong>, that's your ding. Complete it,
              then put the ball back in the other court.
            </p>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
              <div style={{ ...mn, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.dim, marginBottom: 10 }}>New handoff</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <input value={newCourtTitle} onChange={(e) => setNewCourtTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addCourt(); }}
                  placeholder="What needs doing…"
                  style={{ flex: 1, minWidth: 220, background: T.raised, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit" }} />
                <select value={newCourtOwner} onChange={(e) => setNewCourtOwner(e.target.value)}
                  style={{ ...mn, background: T.raised, color: T.text, border: `1px solid ${T.border}`, borderRadius: 6, padding: "8px 10px", fontSize: 12 }}>
                  <option value="kyle">→ Kyle's move</option>
                  <option value="art">→ Art's move</option>
                </select>
                <Btn accent={myColor} onClick={addCourt}>hand off</Btn>
              </div>
            </div>
            {(state.court || []).length === 0 ? (
              <div style={{ ...mn, fontSize: 12, color: T.dim, textAlign: "center", padding: 30 }}>no handoffs yet — leave Sunday with at least one</div>
            ) : null}
            {(state.court || []).map((c) => {
              const oc = c.owner === "kyle" ? T.kyle : T.art;
              const mine = c.owner === who && c.status === "open";
              return (
                <div key={c.id} style={{ background: T.surface, border: `1px solid ${mine ? T.danger : T.border}`, borderRadius: 10, padding: "13px 16px", marginBottom: 8, opacity: c.status === "done" ? 0.45 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div style={{ fontSize: 13.5, textDecoration: c.status === "done" ? "line-through" : "none" }}>{c.title}</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                      <Badge color={oc} bg={c.owner === "kyle" ? T.kyleBg : T.artBg}>{c.owner}'s move</Badge>
                      {c.status === "open" ? <Btn small accent={T.seam} onClick={() => completeCourt(c.id)}>done</Btn> : <Badge color={T.seam} bg={T.seamBg}>✓</Badge>}
                    </div>
                  </div>
                  <div style={{ ...mn, fontSize: 10, color: T.dim, marginTop: 6 }}>handed off by {c.createdBy}</div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* NEXT STEP */}
        {tab === "next" ? (
          <div style={{ maxWidth: 640 }}>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, marginBottom: 16 }}>
              One field. The single named thing that happens after Sunday. If this is empty when the
              conversation ends, the conversation didn't end — it evaporated.
            </p>
            <textarea
              value={state.nextStep || ""}
              onChange={(e) => setNextStep(e.target.value)}
              rows={4}
              placeholder={'e.g. "Kyle drafts a one-page CE course outline by Friday; Art reviews with one of his cohorts."'}
              style={{ width: "100%", background: T.surface, color: T.text, border: `1px solid ${T.seam}`, borderRadius: 10, padding: 16, fontSize: 15, lineHeight: 1.6, fontFamily: "inherit", resize: "vertical" }}
            />
          </div>
        ) : null}

        {/* footer */}
        <div style={{ marginTop: 36, paddingTop: 14, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ ...mn, fontSize: 10, color: T.dim }}>
            {state.updatedAt ? `last change: ${state.updatedBy} · ${new Date(state.updatedAt).toLocaleString()}` : "no changes yet"}
          </span>
          <span style={{ ...mn, fontSize: 10, color: T.dim }}>shared state · hit ↻ to pull the other side's edits</span>
        </div>
      </div>
    </div>
  );
}
