/* Screen: Roadmap + Recommended Path (04 · Implementation) */
(function () {
  const e = React.createElement;
  const { Section, SubHead, CardBlock, Pill, Badge, Rule } = window.ConsoleUI;
  const R = window.ConsoleData.roadmap;

  function PathStep({ s, prevWindow }) {
    const showWindow = s.window !== prevWindow;
    return e('div', { key: s.n },
      showWindow && e('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brass)', margin: '22px 0 8px' } }, s.window),
      e('div', { className: 'op-check-row' },
        e('span', { style: { fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--brass)', minWidth: 22 } }, s.n),
        e('span', { style: { flex: 1 } },
          e('span', { style: { color: 'var(--fg-1)', fontSize: 13.5, lineHeight: 1.6 } }, s.text),
          s.flag && e('span', { style: { display: 'block', marginTop: 4 } }, e(Badge, { tone: 'brass' }, s.flag))
        )
      )
    );
  }

  function PhaseCard({ p }) {
    return e(CardBlock, { key: p.id },
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 6 } },
        e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--fg-1)' } }, p.id + ' \u2014 ' + p.name),
        e('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-mute)' } }, p.window)
      ),
      p.goal && e('p', { className: 'op-p', style: { fontStyle: 'italic' } }, p.goal),
      e('ul', { style: { margin: '0 0 12px', paddingLeft: 20 } },
        p.tasks.map((t, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 5 } }, t))
      ),
      e('div', { style: { fontSize: 12.5, paddingTop: 10, borderTop: '1px solid var(--border-1)' } },
        e('b', { style: { color: 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' } }, 'Gate: '),
        e('span', { style: { color: 'var(--fg-dim)' } }, p.gate)
      )
    );
  }

  function RoadmapScreen() {
    let prevWindow = null;
    return e('div', { className: 'op-screen' },
      e(Section, {
        kicker: '04 \u00B7 Implementation',
        title: 'Recommended path',
        lead: R.tldr,
      },
        e('p', { className: 'op-p' }, R.principle),
        R.recommendedPath.map((s) => {
          const el = e(PathStep, { key: s.n, s, prevWindow });
          prevWindow = s.window;
          return el;
        })
      ),

      e(Section, { title: 'Deferred until first invoice clears' },
        e(CardBlock, null,
          e('ul', { style: { margin: 0, paddingLeft: 20 } },
            R.deferred.map((d, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 6 } }, d))
          )
        )
      ),

      e(Section, { title: 'A / B / C \u2014 sequencing revenue vs. product' },
        e('div', { className: 'op-grid op-grid-3' },
          R.abc.map((o) => e(CardBlock, { key: o.key, accent: o.recommended },
            e('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 } },
              e('span', { style: { fontFamily: 'var(--font-display)', fontSize: 22, color: o.recommended ? 'var(--brass)' : 'var(--fg-1)' } }, o.key),
              e('span', { style: { fontFamily: 'var(--font-mono)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-dim)' } }, o.label),
              o.recommended && e(Badge, { tone: 'solid' }, 'Recommended')
            ),
            e('p', { className: 'op-p', style: { fontSize: 13 } }, o.body),
            e('p', { className: 'op-p', style: { fontSize: 12, fontStyle: 'italic', margin: 0 } }, 'Tradeoff: ' + o.tradeoff)
          ))
        ),
        e('p', { className: 'op-p', style: { marginTop: 14 } }, e('b', { style: { color: 'var(--fg-1)' } }, R.abcVerdict))
      ),

      e(Section, { title: 'Phased roadmap' },
        R.phases.map((p) => e(PhaseCard, { key: p.id, p }))
      ),

      e(Section, { title: 'Parallel, non-blocking tracks' },
        e('p', { className: 'op-p', style: { fontStyle: 'italic' } }, 'Do not let these preempt Phase 0\u20131.'),
        e('ul', { style: { margin: 0, paddingLeft: 20 } },
          R.parallelTracks.map((t, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 6 } }, t))
        )
      )
    );
  }

  window.ConsoleScreens = window.ConsoleScreens || {};
  window.ConsoleScreens.roadmap = RoadmapScreen;
})();
