/* Abstrekkt search — interactive archive search. */
const { useState, useEffect, useRef, useMemo } = React;

const CORPUS = window.ABSTREKKT_CORPUS || [];
const SYNTH = window.ABSTREKKT_SYNTH || (() => null);
const PS = window.ABSTREKKT_PROTECTIONS || null;

/* publish-safe: set by App each render; safe() de-identifies at the choke points. */
let PUBLISH_SAFE = false;
function safe(text) { return PUBLISH_SAFE && PS && PS.publishSafe ? PS.publishSafe(text) : text; }

const TYPE_META = {
  moment:   { label: "MOMENT",   glyph: "❝" },
  document: { label: "DOCUMENT", glyph: "▤" },
  person:   { label: "PERSON",   glyph: "◐" },
  media:    { label: "MEDIA",    glyph: "▷" },
  location: { label: "LOCATION", glyph: "⊕" },
};
const MEDIA_GLYPH = { video: "▷", audio: "♪", photo: "▣", map: "⊕", portrait: "◐" };

/* ---- search ---- */
const STOPWORDS = new Set(["the","a","an","of","and","or","to","in","on","at","for","is","was","it","his","her","he","she","that","this","with","as"]);
function score(entry, q) {
  if (!q) return 0;
  const terms = q.toLowerCase().split(/\s+/).filter((t) => t && !STOPWORDS.has(t));
  if (!terms.length) return 0;
  const hay = (entry.title + " " + entry.excerpt + " " + entry.tags.join(" ") + " " + entry.place + " " + entry.id).toLowerCase();
  let s = 0;
  for (const t of terms) {
    if (entry.title.toLowerCase().includes(t)) s += 5;
    if (entry.tags.some((g) => g.includes(t))) s += 3;
    if (entry.id.toLowerCase().includes(t)) s += 4;
    if (hay.includes(t)) s += 1;
  }
  return s;
}
function highlight(text, q) {
  text = safe(text);
  const terms = (q || "").toLowerCase().split(/\s+/).filter((t) => t.length > 1 && !STOPWORDS.has(t));
  if (!terms.length) return text;
  const re = new RegExp("(" + terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  const parts = text.split(re);
  return parts.map((p, i) => (re.test(p) ? <mark key={i} className="hl">{p}</mark> : p));
}

const SUGGESTIONS = ["the disputed dates", "the SPECT scan", "99th / 12th", "the diagnostic instinct", "Rogers", "Chaos Club"];
const FACETS = ["moment", "document", "person", "media", "location"];

/* ---- shared bits ---- */
function Meta({ entry }) {
  const m = entry.meta;
  const conf = m.confidence == null ? "—" : Math.round(m.confidence * 100) + "%";
  return (
    <div className="rmeta">
      <span>{entry.id}</span><i>·</i>
      <span>{entry.date}</span><i>·</i>
      <span>{entry.place}</span><i>·</i>
      <span className="conf" data-low={m.confidence != null && m.confidence < 0.5}>conf {conf}</span>
    </div>
  );
}
function SealBadge({ entry }) {
  if (entry.sealed) {
    const label = entry.sealState === "sealed" ? "▮ SEALED" : "▮ HELD";
    return <span className="sealtag" title={entry.sealReason || ""}>{label}</span>;
  }
  if (entry.redacted) return <span className="redtag">▮ REDACTED</span>;
  return null;
}
function Tags({ tags, q }) {
  return <div className="rtags">{tags.map((t) => <span key={t} className={"rtag" + (t === "redacted" ? " red" : "")}>{highlight(t, q)}</span>)}</div>;
}
function MediaThumb({ entry, big }) {
  const g = MEDIA_GLYPH[entry.media] || "▤";
  return (
    <div className={"thumb" + (big ? " big" : "")} data-kind={entry.media || entry.type}>
      <span className="tg">{g}</span>
      {entry.media === "video" && <span className="dur">{entry.meta.duration}</span>}
      {entry.media === "audio" && <span className="dur">{entry.meta.duration}</span>}
      {entry.redacted && <span className="redbar" />}
    </div>
  );
}

/* ---- result item, 4 layouts ---- */
function ResultCard({ entry, q, onOpen }) {
  return (
    <button className="rcard" onClick={() => onOpen(entry)}>
      <div className="rcard-top">
        <span className="rtype">{TYPE_META[entry.type].label}</span>
        <SealBadge entry={entry} />
      </div>
      <h3 className="rtitle">{highlight(entry.title, q)}</h3>
      <p className={"rexcerpt" + (entry.redacted ? " doc" : "")}>{highlight(entry.excerpt, q)}</p>
      <Tags tags={entry.tags} q={q} />
      <Meta entry={entry} />
    </button>
  );
}
function ResultRow({ entry, q, onOpen }) {
  return (
    <button className="rrow" onClick={() => onOpen(entry)}>
      <span className="rrow-glyph">{TYPE_META[entry.type].glyph}</span>
      <span className="rrow-main">
        <span className="rrow-title">{highlight(entry.title, q)}</span>
        <span className="rrow-ex">{highlight(entry.excerpt, q)}</span>
      </span>
      <span className="rrow-meta">
        <span className="mono">{entry.id}</span>
        <span className="mono dim">{entry.date}</span>
      </span>
    </button>
  );
}
function ResultPreview({ entry, q, onOpen }) {
  return (
    <button className="rprev" onClick={() => onOpen(entry)}>
      <MediaThumb entry={entry} />
      <div className="rprev-body">
        <div className="rcard-top">
          <span className="rtype">{TYPE_META[entry.type].label}</span>
          <SealBadge entry={entry} />
        </div>
        <h3 className="rtitle">{highlight(entry.title, q)}</h3>
        <p className="rexcerpt">{highlight(entry.excerpt, q)}</p>
        <Meta entry={entry} />
      </div>
    </button>
  );
}

/* ---- AI synthesis panel (blueprint-blue machine layer) ---- */
function SynthPanel({ q, prominence, byId, onOpen }) {
  const synth = useMemo(() => SYNTH(q), [q]);
  if (prominence === "none" || !synth) return null;
  return (
    <div className={"synth p-" + prominence + (synth.protectedQ ? " protected" : "")}>
      <div className="synth-head">
        <span className="synth-badge">{synth.protectedQ ? "◆ PROTECTED" : "◆ MACHINE LAYER"}</span>
        <span className="synth-sub">{synth.protectedQ ? "guardrail — content withheld by design" : "synthesis over " + synth.cites.length + " entries"}</span>
      </div>
      <p className="synth-text">{safe(synth.text)}</p>
      <div className="synth-cites">
        {synth.cites.map((id) => {
          const e = byId[id];
          if (!e) return null;
          return <button key={id} className="cite" onClick={() => onOpen(e)}>{id} <i>{safe(e.title)}</i></button>;
        })}
      </div>
    </div>
  );
}

/* ---- detail drawer ---- */
function Detail({ entry, q, onClose, onOpen, byId }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  if (!entry) return null;
  const synth = SYNTH(entry.tags[0]);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="detail">
        <div className="detail-head">
          <span className="rtype">{TYPE_META[entry.type].label}</span>
          <button className="iconbtn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {entry.media && <MediaThumb entry={entry} big />}
        <h2 className="detail-title">{safe(entry.title)}</h2>
        <Meta entry={entry} />
        <p className={"detail-ex" + (entry.redacted ? " doc" : "")}>{safe(entry.excerpt)}</p>
        {entry.sealed && (
          <div className="seal-note">
            <span className="sn-kick">{entry.sealState === "sealed" ? "▮ SEALED" : "▮ HELD PENDING READINESS"}</span>
            <p>{entry.sealReason || "Withheld by the protections policy."} Only evidentiary metadata is retained in the archive — the material itself is not stored here.</p>
          </div>
        )}
        <Tags tags={entry.tags} q={q} />
        <div className="detail-grid">
          {Object.entries(entry.meta).map(([k, v]) => (
            <div className="dg" key={k}><span className="dg-k">{k}</span><span className="dg-v mono">{v == null ? "unscored" : String(v)}</span></div>
          ))}
        </div>
      </aside>
    </>
  );
}

/* ---- main ---- */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "cards",
  "barPlacement": "centered",
  "aiProminence": "medium",
  "publishSafe": false,
  "dark": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  PUBLISH_SAFE = !!t.publishSafe;
  const [raw, setRaw] = useState("");
  const [q, setQ] = useState("");
  const [phase, setPhase] = useState("rest"); // rest | typing | loading | results
  const [focus, setFocus] = useState(false);
  const [facet, setFacet] = useState(null);
  const [open, setOpen] = useState(null);
  const debounce = useRef(null);
  const loadTimer = useRef(null);

  const byId = useMemo(() => Object.fromEntries(CORPUS.map((e) => [e.id, e])), []);
  const committed = phase === "results" || phase === "loading";

  // theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.dark ? "dark" : "light");
  }, [t.dark]);

  const onType = (v) => {
    setRaw(v);
    if (loadTimer.current) clearTimeout(loadTimer.current);
    if (debounce.current) clearTimeout(debounce.current);
    if (!v.trim()) { setPhase("rest"); setQ(""); return; }
    setPhase("typing");
    debounce.current = setTimeout(() => commit(v), 650);
  };
  const commit = (v) => {
    const val = (v == null ? raw : v).trim();
    if (!val) return;
    if (debounce.current) clearTimeout(debounce.current);
    setPhase("loading");
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => { setQ(val); setPhase("results"); }, 520);
  };

  const ranked = useMemo(() => {
    if (!q) return [];
    return CORPUS.map((e) => ({ e, s: score(e, q) })).filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s).map((x) => x.e);
  }, [q]);
  const filtered = facet ? ranked.filter((e) => e.type === facet) : ranked;

  const liveSuggest = useMemo(() => {
    const v = raw.toLowerCase().trim();
    if (!v) return [];
    return CORPUS.filter((e) => e.title.toLowerCase().includes(v) || e.tags.some((g) => g.includes(v)))
      .slice(0, 5);
  }, [raw]);

  const facetCounts = useMemo(() => {
    const c = {};
    for (const e of ranked) c[e.type] = (c[e.type] || 0) + 1;
    return c;
  }, [ranked]);

  const Item = { cards: ResultCard, list: ResultRow, preview: ResultPreview, grouped: ResultCard }[t.layout] || ResultCard;

  const grouped = useMemo(() => {
    if (t.layout !== "grouped") return null;
    const g = {};
    for (const e of filtered) (g[e.type] = g[e.type] || []).push(e);
    return g;
  }, [filtered, t.layout]);

  return (
    <div className={"app place-" + t.barPlacement + (committed ? " committed" : "") + (t.publishSafe ? " publish-safe" : "")}>
      <div className="grain" />

      {/* top bar (when committed or top-placement) */}
      <header className="topbar">
        <button className="brand" onClick={() => { setRaw(""); setQ(""); setPhase("rest"); setFacet(null); }}>
          <span className="brand-mark">▚</span> ABSTREKKT<span className="brand-sub">/ archive</span>
        </button>
        {(committed || t.barPlacement === "top") && (
          <div className="topsearch">
            <SearchField raw={raw} onType={onType} onEnter={() => commit()} focus={focus} setFocus={setFocus}
              suggest={liveSuggest} phase={phase} onPick={(e) => { setRaw(e.title); commit(e.title); }} compact />
          </div>
        )}
        <button className={"pubsafe mono" + (t.publishSafe ? " on" : "")} onClick={() => setTweak("publishSafe", !t.publishSafe)}
          aria-pressed={t.publishSafe}
          title="Publish-safe: reduce living private individuals to initials for sharing">
          <span className="ps-dot">{t.publishSafe ? "◉" : "○"}</span> publish-safe
        </button>
        <div className="topmeta mono">{CORPUS.length} entries indexed</div>
      </header>

      {/* hero search (centered, pre-commit) */}
      {!committed && t.barPlacement === "centered" && (
        <section className="hero">
          <div className="hero-kicker mono">PERSONAL ARCHIVE · SEARCH</div>
          <h1 className="hero-title">What does the record remember?</h1>
          <SearchField raw={raw} onType={onType} onEnter={() => commit()} focus={focus} setFocus={setFocus}
            suggest={liveSuggest} phase={phase} onPick={(e) => { setRaw(e.title); commit(e.title); }} />
          <div className="seeds">
            {SUGGESTIONS.map((s) => <button key={s} className="seed" onClick={() => { setRaw(s); commit(s); }}>{s}</button>)}
          </div>
        </section>
      )}

      {/* results region */}
      {committed && (
        <main className="results-wrap">
          <aside className="facets">
            <div className="facets-head mono">FILTER</div>
            <button className={"facet" + (!facet ? " on" : "")} onClick={() => setFacet(null)}>
              <span>All</span><span className="fc mono">{ranked.length}</span>
            </button>
            {FACETS.map((f) => (
              <button key={f} className={"facet" + (facet === f ? " on" : "")} onClick={() => setFacet(facet === f ? null : f)} disabled={!facetCounts[f]}>
                <span>{TYPE_META[f].glyph} {TYPE_META[f].label.toLowerCase()}</span>
                <span className="fc mono">{facetCounts[f] || 0}</span>
              </button>
            ))}
          </aside>

          <section className="results">
            {phase === "loading" ? (
              <SkeletonList layout={t.layout} aria-hidden="true" />
            ) : (
              <>
                <div className="results-bar">
                  <span className="mono" aria-live="polite">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for <b>"{q}"</b></span>
                  {facet && <button className="clearf mono" onClick={() => setFacet(null)}>clear filter ✕</button>}
                </div>

                <SynthPanel q={q} prominence={t.aiProminence} byId={byId} onOpen={setOpen} />

                {filtered.length === 0 ? (
                  <NoResults q={q} onSeed={(s) => { setRaw(s); commit(s); setFacet(null); }} />
                ) : grouped ? (
                  Object.entries(grouped).map(([type, items]) => (
                    <div className="group" key={type}>
                      <div className="group-head"><span className="mono">{TYPE_META[type].label}</span><span className="group-line" /><span className="mono dim">{items.length}</span></div>
                      <div className="grid cards">{items.map((e) => <ResultCard key={e.id} entry={e} q={q} onOpen={setOpen} />)}</div>
                    </div>
                  ))
                ) : (
                  <div className={"grid " + t.layout}>
                    {filtered.map((e) => <Item key={e.id} entry={e} q={q} onOpen={setOpen} />)}
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      )}

      <Detail entry={open} q={q} onClose={() => setOpen(null)} onOpen={setOpen} byId={byId} />

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="Results layout" />
        <TweakSelect label="Layout" value={t.layout}
          options={["cards", "list", "preview", "grouped"]} onChange={(v) => setTweak("layout", v)} />
        <TweakSection label="Search bar" />
        <TweakRadio label="Placement" value={t.barPlacement} options={["centered", "top"]} onChange={(v) => setTweak("barPlacement", v)} />
        <TweakSection label="Machine layer" />
        <TweakSelect label="AI prominence" value={t.aiProminence} options={["none", "subtle", "medium", "prominent"]} onChange={(v) => setTweak("aiProminence", v)} />
        <TweakSection label="Sharing" />
        <TweakToggle label="Publish-safe (initials)" value={t.publishSafe} onChange={(v) => setTweak("publishSafe", v)} />
        <TweakSection label="Theme" />
        <TweakToggle label="Dark" value={t.dark} onChange={(v) => setTweak("dark", v)} />
      </TweaksPanel>
    </div>
  );
}

function SearchField({ raw, onType, onEnter, focus, setFocus, suggest, phase, onPick, compact }) {
  const ref = useRef(null);
  useEffect(() => {
    const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); ref.current && ref.current.focus(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  const showSug = focus && raw.trim() && suggest.length > 0 && phase !== "loading";
  return (
    <div className={"field" + (compact ? " compact" : "") + (focus ? " focus" : "")}>
      <div className="field-row">
        <span className="field-icon">⌕</span>
        <input ref={ref} className="field-input" value={raw} placeholder={compact ? "Search the archive…" : "Search moments, documents, people, media…"}
          aria-label="Search the archive"
          onChange={(e) => onType(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 140)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()} spellCheck={false} />
        {phase === "typing" && <span className="field-spin mono">…</span>}
        {!compact && <kbd className="field-kbd mono">⌘K</kbd>}
      </div>
      {showSug && (
        <div className="suggest">
          {suggest.map((e) => (
            <button key={e.id} className="sug" onMouseDown={() => onPick(e)}>
              <span className="sug-g">{TYPE_META[e.type].glyph}</span>
              <span className="sug-t">{e.title}</span>
              <span className="sug-id mono">{e.id}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonList({ layout, ...rest }) {
  const n = layout === "list" ? 7 : 6;
  return (
    <div className={"grid " + layout} {...rest}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className={"skel-item " + layout} style={{ animationDelay: i * 60 + "ms" }}>
          <div className="skel l1" /><div className="skel l2" /><div className="skel l3" />
        </div>
      ))}
    </div>
  );
}

function NoResults({ q, onSeed }) {
  return (
    <div className="noresults">
      <div className="nr-glyph">▮▮▮</div>
      <h3 className="nr-title">The archive returns nothing for "{q}".</h3>
      <p className="nr-sub">No entry, redacted or otherwise, matches that query. Try a broader term, or one of these confirmed threads:</p>
      <div className="seeds center">{SUGGESTIONS.slice(0, 4).map((s) => <button key={s} className="seed" onClick={() => onSeed(s)}>{s}</button>)}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
