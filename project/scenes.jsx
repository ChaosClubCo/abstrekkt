// scenes.jsx — Claude Design (fictional) launch briefing, 1080×1920, 25s
// Pulls Stage / Sprite / useTime / useSprite / Easing / clamp from window.

const PAPER = '#F6F4EF';
const PAPER_DIM = '#EDEAE2';
const INK = '#141414';
const INK_SOFT = '#2A2A26';
const CLAY = '#C97B5A';
const CLAY_DIM = '#A35E40';
const MUTED = '#8A857C';
const HAIR = 'rgba(20,20,20,0.14)';
const HAIR_DARK = 'rgba(246,244,239,0.18)';

const FD = "'Inter Tight', 'Inter', system-ui, sans-serif";
const FS = "'Instrument Serif', Georgia, serif";
const FM = "'JetBrains Mono', ui-monospace, monospace";

const SCENES = [
  { start: 0,    end: 3.2,  label: 'S01 · WRONG HEADLINE' },
  { start: 3.2,  end: 6.8,  label: 'S02 · GAP FILLER' },
  { start: 6.8,  end: 15.5, label: 'S03 · IN PLAIN SIGHT' },
  { start: 15.5, end: 19.5, label: 'S04 · ON RECORD' },
  { start: 19.5, end: 25.0, label: 'S05 · ROLLING OUT' },
];

// ── helpers ────────────────────────────────────────────────────────────────
const fadeIn = (lt, delay = 0, dur = 0.5, ease = Easing.easeOutCubic) => {
  const t = clamp((lt - delay) / dur, 0, 1);
  return ease(t);
};
const slideUp = (lt, delay = 0, dur = 0.5, dist = 24) => {
  const op = fadeIn(lt, delay, dur);
  return { opacity: op, transform: `translateY(${(1 - op) * dist}px)` };
};

// ── Persistent chrome (top + bottom bar) ───────────────────────────────────
function ChromeBg() {
  const time = useTime();
  const inkBgAlpha =
    time < 15.3 ? 0
      : time < 15.6 ? (time - 15.3) / 0.3
      : time < 19.4 ? 1
      : time < 19.7 ? 1 - (time - 19.4) / 0.3
      : 0;
  return (
    <div style={{
      position: 'absolute', inset: 0, background: INK,
      opacity: inkBgAlpha, pointerEvents: 'none',
    }} />
  );
}
function Chrome() {
  const time = useTime();
  const isBlack = time >= 15.5 && time < 19.5;

  const sceneNow = SCENES.find(s => time >= s.start && time < s.end) || SCENES[SCENES.length - 1];
  const sub = isBlack ? 'rgba(246,244,239,0.55)' : MUTED;
  const hair = isBlack ? HAIR_DARK : HAIR;
  const tc = time.toFixed(2);

  return (
    <>
      {/* TOP BAR */}
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 70,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: FM, fontSize: 22, color: sub, letterSpacing: '0.06em',
      }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <div style={{ width: 16, height: 16, background: CLAY }} />
          <span>ANTHROPIC&nbsp;&nbsp;·&nbsp;&nbsp;BRIEFING</span>
        </div>
        <div>APR 17 &nbsp;·&nbsp; 2026</div>
      </div>
      <div style={{
        position: 'absolute', left: 60, right: 60, top: 122, height: 1, background: hair,
      }} />

      {/* BOTTOM BAR */}
      <div style={{
        position: 'absolute', left: 60, right: 60, bottom: 70, height: 1, background: hair,
      }} />
      <div style={{
        position: 'absolute', left: 60, right: 60, bottom: 30,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: FM, fontSize: 22, color: sub, letterSpacing: '0.06em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ color: isBlack ? CLAY : CLAY }}>{sceneNow.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>{tc}s / 25.00s</span>
          <div className="cursor-blink" style={{
            width: 14, height: 22, background: CLAY,
          }} />
        </div>
      </div>
    </>
  );
}

// ── Scene 1 ────────────────────────────────────────────────────────────────
function Scene1() {
  return (
    <Sprite start={0} end={3.2}>
      {({ localTime: lt, duration }) => {
        const exitT = clamp((lt - (duration - 0.4)) / 0.4, 0, 1);
        const exitOp = 1 - Easing.easeInCubic(exitT);
        const exitY = -Easing.easeInCubic(exitT) * 16;

        const lineDelay = i => 0.15 + i * 0.10;
        const lines = [
          { txt: "Everyone's",  italic: false, color: INK },
          { txt: 'writing the', italic: false, color: INK },
          { txt: 'wrong',       italic: true,  color: CLAY },
          { txt: 'headline.',   italic: false, color: INK },
        ];
        const LINE_SIZE = 108;
        const LINE_STEP = 130;
        const strike1 = clamp((lt - 1.85) / 0.45, 0, 1);
        const strike2 = clamp((lt - 2.15) / 0.45, 0, 1);
        const arrow   = fadeIn(lt, 2.55, 0.4);

        const wrap = { opacity: exitOp, transform: `translateY(${exitY}px)` };

        return (
          <div style={wrap}>
            {/* Kicker */}
            <div style={{
              position: 'absolute', left: 60, top: 200,
              fontFamily: FM, fontSize: 26, color: MUTED, letterSpacing: '0.10em',
              ...slideUp(lt, 0, 0.45, 16),
            }}>
              HOT TAKE &nbsp;·&nbsp; THREAD 01
            </div>

            {/* Display lines */}
            {lines.map((l, i) => (
              <div key={i} style={{
                position: 'absolute', left: 60, right: 60, top: 300 + i * LINE_STEP,
                fontFamily: FD, fontWeight: 800,
                fontStyle: l.italic ? 'italic' : 'normal',
                fontSize: LINE_SIZE, color: l.color,
                letterSpacing: '-0.035em', lineHeight: 1.05,
                ...slideUp(lt, lineDelay(i), 0.55, 32),
              }}>
                {l.txt}
              </div>
            ))}

            {/* Struck phrases */}
            <Phrase y={1100} text="Canva killer"      strike={strike1} delay={1.55} lt={lt} />
            <Phrase y={1220} text="Figma replacement" strike={strike2} delay={1.85} lt={lt} />

            {/* Actually arrow */}
            <div style={{
              position: 'absolute', left: 60, top: 1540,
              fontFamily: FM, fontSize: 32, color: CLAY, letterSpacing: '0.06em',
              opacity: arrow, transform: `translateY(${(1 - arrow) * 16}px)`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span>↓ ACTUALLY</span>
              <span style={{ flex: '0 0 80px', height: 2, background: CLAY }} />
              <span>→</span>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}
function Phrase({ y, text, strike, delay, lt }) {
  const op = fadeIn(lt, delay, 0.4);
  const ty = (1 - op) * 22;
  return (
    <div style={{
      position: 'absolute', left: 60, top: y,
      opacity: op, transform: `translateY(${ty}px)`,
    }}>
      <div style={{
        fontFamily: FD, fontWeight: 600, fontSize: 64,
        color: MUTED, letterSpacing: '-0.02em',
        position: 'relative', display: 'inline-block', paddingRight: 8,
        whiteSpace: 'nowrap',
      }}>
        {text}
        <div style={{
          position: 'absolute', left: -4, top: '54%', height: 8, width: '100%',
          background: CLAY, transformOrigin: 'left center',
          transform: `translateY(-50%) scaleX(${strike})`,
        }} />
      </div>
    </div>
  );
}

// ── Scene 2 ────────────────────────────────────────────────────────────────
function Scene2() {
  return (
    <Sprite start={3.2} end={6.8}>
      {({ localTime: lt, duration }) => {
        const exitT = clamp((lt - (duration - 0.4)) / 0.4, 0, 1);
        const exitOp = 1 - Easing.easeInCubic(exitT);
        const wrap = { opacity: exitOp };

        const bracket = Easing.easeOutCubic(clamp((lt - 0.55) / 0.55, 0, 1));
        const personas = [
          { num: '01', name: 'Founders' },
          { num: '02', name: 'PMs' },
          { num: '03', name: 'Marketers' },
        ];

        return (
          <div style={wrap}>
            <div style={{
              position: 'absolute', left: 60, top: 220,
              fontFamily: FM, fontSize: 28, color: MUTED, letterSpacing: '0.10em',
              ...slideUp(lt, 0, 0.4, 16),
            }}>
              IT'S A —
            </div>

            {/* GAP with brackets */}
            <div style={{
              position: 'absolute', left: 60, top: 290, height: 280,
              display: 'flex', alignItems: 'stretch', gap: 28,
              ...slideUp(lt, 0.2, 0.45, 24),
            }}>
              <div style={{
                width: 12, background: CLAY, transformOrigin: 'top center',
                transform: `scaleY(${bracket})`,
              }} />
              <div style={{
                fontFamily: FD, fontWeight: 800, fontSize: 280,
                color: INK, letterSpacing: '-0.05em', lineHeight: 0.9,
              }}>GAP</div>
              <div style={{
                width: 12, background: CLAY, transformOrigin: 'top center',
                transform: `scaleY(${bracket})`,
              }} />
            </div>

            {/* filler. */}
            <div style={{
              position: 'absolute', left: 60, top: 620,
              fontFamily: FD, fontStyle: 'italic', fontWeight: 600, fontSize: 168,
              color: INK, letterSpacing: '-0.035em', lineHeight: 1,
              ...slideUp(lt, 0.85, 0.5, 32),
            }}>
              filler.
            </div>

            {/* Persona list */}
            <div style={{ position: 'absolute', left: 60, right: 60, top: 1000 }}>
              {personas.map((p, i) => {
                const d = 1.25 + i * 0.18;
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'baseline', gap: 32,
                    borderTop: `1px solid ${HAIR}`,
                    padding: '24px 0',
                    ...slideUp(lt, d, 0.45, 28),
                  }}>
                    <div style={{
                      flex: '0 0 80px',
                      fontFamily: FM, fontSize: 30, color: CLAY, letterSpacing: '0.06em',
                    }}>{p.num}</div>
                    <div style={{
                      flex: 1,
                      fontFamily: FD, fontWeight: 700, fontSize: 112,
                      color: INK, letterSpacing: '-0.03em', lineHeight: 1,
                    }}>{p.name}</div>
                    <div style={{
                      fontFamily: FM, fontSize: 22, color: MUTED, letterSpacing: '0.08em',
                    }}>—</div>
                  </div>
                );
              })}
              <div style={{ borderTop: `1px solid ${HAIR}`, marginTop: 0 }} />
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Scene 3 ────────────────────────────────────────────────────────────────
function Scene3() {
  return (
    <Sprite start={6.8} end={15.5}>
      {({ localTime: lt, duration }) => {
        const exitT = clamp((lt - (duration - 0.45)) / 0.45, 0, 1);
        const exitOp = 1 - Easing.easeInCubic(exitT);

        // card entry delays (relative to scene start)
        const c1d = 0.15;
        const c2d = 2.5;
        const c3d = 4.9;

        return (
          <div style={{ opacity: exitOp }}>
            {/* SECTION HEADER */}
            <div style={{
              position: 'absolute', left: 60, top: 200,
              fontFamily: FM, fontSize: 26, color: MUTED, letterSpacing: '0.10em',
              ...slideUp(lt, 0, 0.4, 14),
            }}>
              THREE THINGS · HIDING IN PLAIN SIGHT
            </div>

            <Card1 lt={lt} delay={c1d} />
            <Card2 lt={lt} delay={c2d} />
            <Card3 lt={lt} delay={c3d} />
          </div>
        );
      }}
    </Sprite>
  );
}

function CardShell({ y, h, dark, children, lt, delay }) {
  const s = slideUp(lt, delay, 0.55, 32);
  return (
    <div style={{
      position: 'absolute', left: 60, right: 60, top: y, height: h,
      background: dark ? INK : 'transparent',
      border: dark ? `1px solid ${INK}` : `1px solid ${HAIR}`,
      color: dark ? PAPER : INK,
      padding: '28px 32px',
      ...s,
    }}>
      {children}
    </div>
  );
}

function CardLabel({ num, title, dark }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: FM, fontSize: 22, letterSpacing: '0.10em',
      color: dark ? 'rgba(246,244,239,0.65)' : MUTED,
    }}>
      <span style={{ color: CLAY }}>{num}</span>
      <span style={{ flex: '0 0 24px', height: 1, background: dark ? HAIR_DARK : HAIR }} />
      <span>{title}</span>
    </div>
  );
}

function Card1({ lt, delay }) {
  // file pills cascade in
  const files = ['theme.ts', 'colors.css', 'tokens.json', 'Button.tsx', 'logo.svg'];
  // arrow draw + tokens panel after files
  const arrowOp = fadeIn(lt, delay + 1.0, 0.45);
  const tokOp   = fadeIn(lt, delay + 1.2, 0.45);

  return (
    <CardShell y={260} h={460} lt={lt} delay={delay}>
      <CardLabel num="01" title="CONTEXT ON ARRIVAL" />
      <div style={{
        marginTop: 18,
        fontFamily: FD, fontWeight: 700, fontSize: 64,
        color: INK, letterSpacing: '-0.03em', lineHeight: 1.02,
      }}>
        It reads what you<br />already <em style={{ color: CLAY, fontStyle: 'italic', fontWeight: 700 }}>have</em>.
      </div>

      {/* visual row */}
      <div style={{
        position: 'absolute', left: 32, right: 32, bottom: 28,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        {/* files column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '0 0 auto' }}>
          {files.map((f, i) => {
            const d = delay + 0.35 + i * 0.07;
            const op = fadeIn(lt, d, 0.35);
            return (
              <div key={f} style={{
                fontFamily: FM, fontSize: 18, color: INK,
                background: PAPER_DIM, border: `1px solid ${HAIR}`,
                padding: '6px 12px',
                opacity: op, transform: `translateX(${(1 - op) * -10}px)`,
              }}>
                {f}
              </div>
            );
          })}
        </div>

        {/* arrow */}
        <div style={{
          flex: '0 0 80px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: arrowOp,
        }}>
          <div style={{ width: '100%', height: 2, background: CLAY, position: 'relative' }}>
            <div style={{
              position: 'absolute', right: -2, top: -8,
              width: 0, height: 0,
              borderLeft: `14px solid ${CLAY}`,
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
            }} />
          </div>
        </div>

        {/* tokens panel */}
        <div style={{
          flex: 1, alignSelf: 'stretch',
          background: PAPER_DIM, border: `1px solid ${HAIR}`,
          padding: '14px 18px',
          display: 'flex', flexDirection: 'column', gap: 12,
          opacity: tokOp, transform: `translateX(${(1 - tokOp) * 12}px)`,
        }}>
          <div style={{
            fontFamily: FM, fontSize: 16, color: MUTED, letterSpacing: '0.10em',
          }}>BRAND TOKENS · DETECTED</div>
          {/* swatch row */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[CLAY, INK, '#F6F4EF', MUTED, '#E8DCC8'].map((c, i) => (
              <div key={i} style={{
                flex: 1, height: 38, background: c,
                border: c === '#F6F4EF' ? `1px solid ${HAIR}` : 'none',
              }} />
            ))}
          </div>
          {/* type stack */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontFamily: FD, fontWeight: 800, fontSize: 28, color: INK, letterSpacing: '-0.02em' }}>Aa</span>
            <span style={{ fontFamily: FS, fontStyle: 'italic', fontSize: 28, color: INK }}>Aa</span>
            <span style={{ fontFamily: FM, fontSize: 16, color: MUTED }}>Inter Tight · Instrument Serif</span>
          </div>
          {/* radius scale */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {[0, 4, 8, 14].map((r, i) => (
              <div key={i} style={{
                width: 28, height: 28, background: 'transparent',
                border: `2px solid ${INK}`, borderRadius: r,
              }} />
            ))}
            <span style={{ fontFamily: FM, fontSize: 16, color: MUTED, marginLeft: 8 }}>r 0 / 4 / 8 / 14</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

function Card2({ lt, delay }) {
  const chips = ['PROMPT', 'DOCX', 'PPTX', 'XLSX', 'URL'];
  // cycling highlight: starts after entry, advances every 0.45s
  const phase = Math.max(0, lt - delay - 0.5);
  const active = Math.floor(phase / 0.45) % chips.length;

  return (
    <CardShell y={760} h={300} lt={lt} delay={delay}>
      <CardLabel num="02" title="ANY STARTING POINT" />
      <div style={{
        marginTop: 18,
        fontFamily: FD, fontWeight: 700, fontSize: 64,
        color: INK, letterSpacing: '-0.03em', lineHeight: 1.02,
      }}>
        Start <em style={{ color: CLAY, fontStyle: 'italic', fontWeight: 700 }}>anywhere</em>.
      </div>

      <div style={{
        position: 'absolute', left: 32, right: 32, bottom: 28,
        display: 'flex', flexWrap: 'wrap', gap: 12,
      }}>
        {chips.map((c, i) => {
          const d = delay + 0.5 + i * 0.08;
          const op = fadeIn(lt, d, 0.35);
          const isActive = i === active && lt > delay + 0.95;
          return (
            <div key={c} style={{
              fontFamily: FM, fontSize: 22, letterSpacing: '0.08em',
              padding: '10px 22px',
              borderRadius: 999,
              border: `1.5px solid ${isActive ? CLAY : INK}`,
              background: isActive ? CLAY : 'transparent',
              color: isActive ? PAPER : INK,
              opacity: op, transform: `translateY(${(1 - op) * 8}px)`,
              transition: 'background 180ms ease, color 180ms ease, border-color 180ms ease',
            }}>{c}</div>
          );
        })}
      </div>
    </CardShell>
  );
}

function Card3({ lt, delay }) {
  // pipe flow: a clay block travels left → right repeatedly
  const flow = Math.max(0, lt - delay - 0.4);
  const cycle = (flow % 1.6) / 1.6; // 1.6s per pass

  return (
    <CardShell y={1100} h={640} dark lt={lt} delay={delay}>
      <CardLabel num="03" title="DESIGN → CODE · ONE LOOP" dark />
      <div style={{
        marginTop: 18,
        fontFamily: FD, fontWeight: 700, fontSize: 72,
        color: PAPER, letterSpacing: '-0.03em', lineHeight: 1.0,
      }}>
        One <em style={{ color: CLAY, fontStyle: 'italic', fontWeight: 700 }}>context</em><br />window.
      </div>

      {/* Visual: design tile → pipe → code tile */}
      <div style={{
        position: 'absolute', left: 32, right: 32, bottom: 28,
        display: 'flex', alignItems: 'stretch', gap: 16, height: 280,
      }}>
        {/* DESIGN TILE */}
        <div style={{
          flex: '0 0 300px',
          background: '#1B1B17', border: `1px solid ${HAIR_DARK}`,
          padding: 16, position: 'relative',
        }}>
          <div style={{
            fontFamily: FM, fontSize: 14, color: 'rgba(246,244,239,0.55)',
            letterSpacing: '0.10em', marginBottom: 10,
          }}>DESIGN.FIG</div>
          {/* fake button mock */}
          <div style={{
            background: PAPER, color: INK, padding: '14px 18px',
            fontFamily: FD, fontWeight: 700, fontSize: 22,
            display: 'inline-block', marginBottom: 12, letterSpacing: '-0.02em',
          }}>Get started</div>
          <div style={{
            height: 8, width: '70%', background: 'rgba(246,244,239,0.18)', marginBottom: 6,
          }} />
          <div style={{
            height: 8, width: '40%', background: 'rgba(246,244,239,0.10)', marginBottom: 12,
          }} />
          {/* swatches */}
          <div style={{ display: 'flex', gap: 4 }}>
            {[CLAY, PAPER, MUTED].map((c, i) => (
              <div key={i} style={{ width: 20, height: 20, background: c }} />
            ))}
          </div>
        </div>

        {/* PIPE */}
        <div style={{
          flex: 1, position: 'relative', alignSelf: 'center', height: 6,
          background: 'rgba(246,244,239,0.10)',
        }}>
          <div style={{
            position: 'absolute', left: `${cycle * 100}%`, top: -7,
            width: 36, height: 20, background: CLAY,
            transform: 'translateX(-50%)',
          }} />
          {/* arrow caps */}
          <div style={{
            position: 'absolute', right: -1, top: -7,
            width: 0, height: 0,
            borderLeft: `14px solid ${CLAY}`,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
          }} />
        </div>

        {/* CODE TILE */}
        <div style={{
          flex: '0 0 320px',
          background: '#1B1B17', border: `1px solid ${HAIR_DARK}`,
          padding: 16, position: 'relative',
          fontFamily: FM, fontSize: 16, lineHeight: 1.5,
          color: PAPER,
        }}>
          <div style={{
            fontFamily: FM, fontSize: 14, color: 'rgba(246,244,239,0.55)',
            letterSpacing: '0.10em', marginBottom: 10,
          }}>BUTTON.TSX</div>
          <div><span style={{ color: '#7AA0C4' }}>{'<Button'}</span></div>
          <div>&nbsp;&nbsp;<span style={{ color: CLAY }}>variant</span>=<span style={{ color: '#B5C99A' }}>"primary"</span></div>
          <div>&nbsp;&nbsp;<span style={{ color: CLAY }}>size</span>=<span style={{ color: '#B5C99A' }}>"lg"</span></div>
          <div><span style={{ color: '#7AA0C4' }}>{'>'}</span></div>
          <div>&nbsp;&nbsp;Get started</div>
          <div><span style={{ color: '#7AA0C4' }}>{'</Button>'}</span></div>
        </div>
      </div>
    </CardShell>
  );
}

// ── Scene 4 ────────────────────────────────────────────────────────────────
function Scene4() {
  return (
    <Sprite start={15.5} end={19.5}>
      {({ localTime: lt, duration }) => {
        // entry/exit fade for content (the ink bg is handled by Chrome)
        const inOp = fadeIn(lt, 0.25, 0.4);
        const exitT = clamp((lt - (duration - 0.4)) / 0.4, 0, 1);
        const exitOp = 1 - Easing.easeInCubic(exitT);
        const op = inOp * exitOp;

        // Quote tokens
        const tokens = [
          { w: 'What' },        { w: 'used' }, { w: 'to' },
          { w: 'take' }, { w: 'a' },
          { w: 'week', clay: true },
          { w: 'of' },
          { w: 'back-and-' },
          { w: 'forth' },
          { w: 'now' }, { w: 'happens' }, { w: 'in' }, { w: 'a' },
          { w: 'single', clay: true },
          { w: 'conversation', clay: true, period: true },
        ];
        const wordStart = 0.75;
        const wordStep = 0.10;

        // big quote scaleY draw-in
        const quoteOp = fadeIn(lt, 0.05, 0.55, Easing.easeOutCubic);
        const quoteScale = 0.85 + 0.15 * quoteOp;

        return (
          <div style={{ opacity: op }}>
            {/* GIANT CURLY OPEN QUOTE */}
            <div style={{
              position: 'absolute', left: 36, top: -40,
              fontFamily: FS, fontStyle: 'italic', fontWeight: 400,
              fontSize: 540, color: CLAY, lineHeight: 1,
              opacity: quoteOp, transform: `scale(${quoteScale})`,
              transformOrigin: 'top left',
              userSelect: 'none',
            }}>
              “
            </div>

            {/* QUOTE BODY */}
            <div style={{
              position: 'absolute', left: 60, right: 60, top: 480,
              fontFamily: FD, fontWeight: 600, fontSize: 92,
              color: PAPER, letterSpacing: '-0.025em', lineHeight: 1.08,
              display: 'flex', flexWrap: 'wrap', columnGap: 18, rowGap: 6,
            }}>
              {tokens.map((tk, i) => {
                const d = wordStart + i * wordStep;
                const o = fadeIn(lt, d, 0.32);
                return (
                  <span key={i} style={{
                    opacity: o,
                    transform: `translateY(${(1 - o) * 14}px)`,
                    color: tk.clay ? CLAY : PAPER,
                    fontStyle: tk.clay ? 'italic' : 'normal',
                    display: 'inline-block',
                  }}>
                    {tk.w}{tk.period ? '.' : ''}
                  </span>
                );
              })}
            </div>

            {/* attribution */}
            <div style={{
              position: 'absolute', left: 60, right: 60, top: 1620,
              opacity: fadeIn(lt, 2.5, 0.5),
              transform: `translateY(${(1 - fadeIn(lt, 2.5, 0.5)) * 14}px)`,
            }}>
              <div style={{ height: 1, width: 140, background: CLAY, marginBottom: 22 }} />
              <div style={{
                fontFamily: FM, fontSize: 24, color: 'rgba(246,244,239,0.7)',
                letterSpacing: '0.08em',
              }}>
                PRODUCT MANAGER &nbsp;·&nbsp; OBSERVABILITY TEAM
              </div>
              <div style={{
                fontFamily: FM, fontSize: 18, color: 'rgba(246,244,239,0.4)',
                letterSpacing: '0.08em', marginTop: 8,
              }}>
                NAME WITHHELD ON REQUEST
              </div>
            </div>
          </div>
        );
      }}
    </Sprite>
  );
}

// ── Scene 5 ────────────────────────────────────────────────────────────────
function Scene5() {
  return (
    <Sprite start={19.5} end={25.0}>
      {({ localTime: lt }) => {
        const lines = ['The blank-page', 'problem just got', 'a lot smaller.'];
        const pills = ['Pro', 'Max', 'Team', 'Enterprise'];

        return (
          <>
            {/* Kicker */}
            <div style={{
              position: 'absolute', left: 60, top: 220,
              fontFamily: FM, fontSize: 26, color: MUTED, letterSpacing: '0.10em',
              ...slideUp(lt, 0, 0.45, 14),
            }}>
              ROLLING OUT TODAY
            </div>

            {/* Display lines */}
            {lines.map((l, i) => {
              const d = 0.2 + i * 0.14;
              const isLast = i === lines.length - 1;
              return (
                <div key={i} style={{
                  position: 'absolute', left: 60, top: 300 + i * 156,
                  fontFamily: FD, fontWeight: 800, fontSize: 138,
                  color: INK, letterSpacing: '-0.04em', lineHeight: 1,
                  ...slideUp(lt, d, 0.55, 32),
                }}>
                  {isLast ? (
                    <>
                      a lot <em style={{ color: CLAY, fontStyle: 'italic', fontWeight: 800 }}>smaller</em>.
                    </>
                  ) : l}
                </div>
              );
            })}

            {/* AVAILABLE ON */}
            <div style={{
              position: 'absolute', left: 60, top: 1080,
              fontFamily: FM, fontSize: 24, color: MUTED, letterSpacing: '0.12em',
              ...slideUp(lt, 0.85, 0.45, 14),
            }}>
              AVAILABLE ON
            </div>

            {/* PILLS */}
            <div style={{
              position: 'absolute', left: 60, right: 60, top: 1160,
              display: 'flex', gap: 14, flexWrap: 'wrap',
            }}>
              {pills.map((p, i) => {
                const d = 1.05 + i * 0.12;
                const op = fadeIn(lt, d, 0.45);
                return (
                  <div key={p} style={{
                    flex: 1,
                    fontFamily: FD, fontWeight: 700, fontSize: 38,
                    color: INK, letterSpacing: '-0.02em',
                    padding: '24px 28px',
                    borderRadius: 999,
                    border: `2px solid ${INK}`,
                    textAlign: 'center',
                    opacity: op, transform: `translateY(${(1 - op) * 18}px)`,
                  }}>{p}</div>
                );
              })}
            </div>

            {/* Big horizontal rule + accent square */}
            <div style={{
              position: 'absolute', left: 60, right: 60, top: 1400,
              opacity: fadeIn(lt, 1.7, 0.5),
            }}>
              <div style={{ height: 1, background: HAIR }} />
              <div style={{
                marginTop: 26,
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                fontFamily: FM, fontSize: 22, color: MUTED, letterSpacing: '0.06em',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 12, height: 12, background: CLAY }} />
                  <span>POWERED BY CLAUDE OPUS 4.7</span>
                </div>
                <div>FILED BY KYLE ROSEBROOK</div>
              </div>

              {/* big mark */}
              <div style={{
                marginTop: 70,
                fontFamily: FS, fontStyle: 'italic',
                fontSize: 280, color: CLAY, lineHeight: 0.9,
                opacity: fadeIn(lt, 2.0, 0.6),
              }}>
                CD<span style={{ color: INK }}>.</span>
              </div>
              <div style={{
                fontFamily: FM, fontSize: 22, color: MUTED, letterSpacing: '0.18em',
                opacity: fadeIn(lt, 2.4, 0.5),
              }}>
                CLAUDE&nbsp;&nbsp;DESIGN &nbsp;·&nbsp; CONCEPT · NOT A REAL PRODUCT
              </div>
            </div>
          </>
        );
      }}
    </Sprite>
  );
}

// ── Film grain overlay ─────────────────────────────────────────────────────
function Grain() {
  // SVG turbulence as data URL — multiply blend, low opacity
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'>
       <filter id='n'>
         <feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' stitchTiles='stitch'/>
         <feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/>
       </filter>
       <rect width='100%' height='100%' filter='url(#n)'/>
     </svg>`
  );
  return (
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: `url("data:image/svg+xml;utf8,${svg}")`,
      backgroundSize: '320px 320px',
      mixBlendMode: 'multiply',
      opacity: 0.25,
      pointerEvents: 'none',
    }} />
  );
}

// ── Wrapper ────────────────────────────────────────────────────────────────
function VideoScenes() {
  return (
    <>
      <ChromeBg />
      <Scene1 />
      <Scene2 />
      <Scene3 />
      <Scene4 />
      <Scene5 />
      <Chrome />
      <Grain />
    </>
  );
}

Object.assign(window, { VideoScenes });
