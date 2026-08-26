// Abstrekkt — Pillar Icons
// Brand-pillar vocabulary (NOT the UI Icon set in primitives.jsx).
// Tier 1: <PillarGlyphBox name tone size> — 44×44 tinted box, used in pillar cards / feature grids.
// Tier 2: <PillarIcon     name tone size> — flat single-color stroke, used inline in lists / section markers.
//
// Tones: 'r' (#e11d48 red) | 'o' (#ea580c orange) | 'a' (#d97706 amber)
// Each name has a canonical default tone — omit `tone` to use it.
// Hard rules: no gradient, no glow, no 12px radius. 8px radius. Inter + JetBrains Mono.

const PILLAR_TONES = {
  r: { fg: '#e11d48', bg: 'rgba(225,29,72,0.10)', bdr: 'rgba(225,29,72,0.28)' },
  o: { fg: '#ea580c', bg: 'rgba(234,88,12,0.10)', bdr: 'rgba(234,88,12,0.28)' },
  a: { fg: '#d97706', bg: 'rgba(217,119,6,0.10)', bdr: 'rgba(217,119,6,0.28)' },
};

// Each entry: { tone: default, paths: <SVG inner content> }
// Paths are Lucide originals. 1.75 stroke, currentColor, viewBox 0 0 24 24.
const PILLAR_ICONS = {
  'no-masks': {
    tone: 'r',
    paths: <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>,
  },
  community: {
    tone: 'r',
    paths: (<>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <path d="M16 3.128a4 4 0 0 1 0 7.744"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <circle cx="9" cy="7" r="4"/>
    </>),
  },
  climb: {
    tone: 'r',
    paths: (<>
      <path d="M16 7h6v6"/>
      <path d="m22 7-8.5 8.5-5-5L2 17"/>
    </>),
  },
  growth: {
    tone: 'o',
    paths: <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>,
  },
  cycles: {
    tone: 'o',
    paths: <path d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8"/>,
  },
  progress: {
    tone: 'o',
    paths: (<>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </>),
  },
  'safe-space': {
    tone: 'a',
    paths: (<>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      <path d="m9 12 2 2 4-4"/>
    </>),
  },
  human: {
    tone: 'a',
    paths: (<>
      <circle cx="12" cy="12" r="10"/>
      <path d="M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z"/>
    </>),
  },
  connection: {
    tone: 'a',
    paths: (<>
      <path d="m11 17 2 2a1 1 0 1 0 3-3"/>
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/>
      <path d="m21 3 1 11h-2"/>
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/>
      <path d="M3 4h8"/>
    </>),
  },
};

// Tier 2 — flat accent stroke, no box
function PillarIcon({ name, tone, size = 22, strokeWidth = 1.75, style }){
  const def = PILLAR_ICONS[name];
  if (!def) return null;
  const t = PILLAR_TONES[tone || def.tone] || PILLAR_TONES.r;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
      stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      style={{ color: t.fg, flex: 'none', display: 'block', ...style }}>
      {def.paths}
    </svg>
  );
}

// Tier 1 — 44×44 tinted box (8px radius — NOT 12)
function PillarGlyphBox({ name, tone, size = 44, iconSize, style }){
  const def = PILLAR_ICONS[name];
  if (!def) return null;
  const t = PILLAR_TONES[tone || def.tone] || PILLAR_TONES.r;
  const inner = iconSize || Math.round(size * 0.5);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: 8,
      border: `1px solid ${t.bdr}`, background: t.bg, color: t.fg,
      flex: 'none', ...style,
    }}>
      <svg viewBox="0 0 24 24" width={inner} height={inner} fill="none"
        stroke="currentColor" strokeWidth={1.75}
        strokeLinecap="round" strokeLinejoin="round" style={{display:'block'}}>
        {def.paths}
      </svg>
    </span>
  );
}

// Names in the canonical r → o → a rotation, useful for default-ordered lists.
const PILLAR_NAMES = ['no-masks','community','growth','cycles','progress','safe-space','human','connection','climb'];

Object.assign(window, { PillarIcon, PillarGlyphBox, PILLAR_TONES, PILLAR_ICONS, PILLAR_NAMES });
