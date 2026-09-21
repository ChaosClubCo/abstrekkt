/* Screen: Decisions & Risk Registers (07) — filterable browser across 9 registers. */
(function () {
  const e = React.createElement;
  const { Section, SubHead, CardBlock, Table, Pill, FilterBar, Badge } = window.ConsoleUI;
  const G = window.ConsoleData.registers;

  const REGISTERS = ['All', 'Decisions', 'Contradictions', 'Risks', 'Gaps', 'Bottlenecks', 'Blindspots', 'Failure modes', 'Unknown unknowns', 'Open loops'];

  function RegistersScreen() {
    const [active, setActive] = React.useState('All');
    const show = (name) => active === 'All' || active === name;

    return e('div', { className: 'op-screen' },
      e(Section, {
        kicker: '07 \u00B7 Decisions & risk',
        title: 'Nine registers, one watch list',
        lead: 'Every locked and package-level decision, contradiction, risk, gap, bottleneck, blindspot, failure mode, unknown-unknown, and open loop found while assembling this package.',
      },
        e(FilterBar, { options: REGISTERS, active, onChange: setActive })
      ),

      show('Decisions') && e(Section, { title: 'Decision log \u2014 locked (from the KB)' },
        e(Table, {
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'decision', label: 'Decision' },
            { key: 'source', label: 'Source' },
            { key: 'confidence', label: 'Confidence', render: (r) => e(Pill, null, r.confidence) },
          ],
          rows: G.decisionsLocked,
        })
      ),

      show('Decisions') && e(Section, { title: 'Decision log \u2014 package decisions' },
        G.decisionsPackage.map((d) => e(CardBlock, { key: d.id },
          e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--fg-1)', marginBottom: 4 } }, d.id + ' \u00B7 ' + d.title),
          e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 6px' } }, e('b', null, 'Context: '), d.context),
          e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 6px' } }, e('b', { style: { color: 'var(--brass)' } }, 'Decision: '), d.decision),
          e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 6px' } }, e('b', null, 'Rationale: '), d.rationale),
          e('p', { className: 'op-p', style: { fontSize: 12, margin: 0, fontStyle: 'italic' } }, 'Reversal cost: ' + d.reversal)
        ))
      ),

      show('Contradictions') && e(Section, { title: 'Contradiction log' },
        G.contradictions.map((c) => e(CardBlock, { key: c.id, accent: true },
          e('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 } },
            e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--fg-1)' } }, c.id + ' \u00B7 ' + c.title),
            e(Pill, null, c.status)
          ),
          e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 4px' } }, e('b', null, 'A: '), c.sourceA),
          e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 8px' } }, e('b', null, 'B: '), c.sourceB),
          e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 6px' } }, e('b', { style: { color: 'var(--brass)' } }, 'Resolution: '), c.resolution),
          e('p', { className: 'op-p', style: { fontSize: 11.5, margin: 0, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--fg-mute)' } }, 'Owner: ' + c.owner)
        ))
      ),

      show('Risks') && e(Section, { title: 'Risk register (consolidated)' },
        e(Table, {
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'risk', label: 'Risk' },
            { key: 'category', label: 'Category' },
            { key: 'severity', label: 'Severity', render: (r) => e(Pill, null, r.severity) },
            { key: 'mitigation', label: 'Mitigation' },
            { key: 'status', label: 'Status' },
          ],
          rows: G.risks,
        }),
        e('p', { className: 'op-p', style: { marginTop: 12, fontStyle: 'italic' } }, G.risksNote)
      ),

      show('Gaps') && e(Section, { title: 'Gap register' },
        e(Table, {
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'gap', label: 'Gap' },
            { key: 'why', label: 'Why it matters' },
            { key: 'severity', label: 'Severity', render: (r) => e(Pill, null, r.severity) },
            { key: 'blocking', label: 'Blocking?', render: (r) => r.blocking ? 'Yes' : 'No' },
            { key: 'resolution', label: 'Resolution' },
          ],
          rows: G.gaps,
        })
      ),

      show('Bottlenecks') && e(Section, { title: 'Bottleneck register' },
        G.bottlenecks.map((b) => e(CardBlock, { key: b.id },
          e('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 } },
            e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--fg-1)' } }, b.id + ' \u00B7 ' + b.title),
            e(Pill, null, b.severity)
          ),
          e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 4px' } }, e('b', null, 'Trigger: '), b.trigger),
          b.symptoms && e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 4px' } }, e('b', null, 'Symptoms: '), b.symptoms),
          e('p', { className: 'op-p', style: { fontSize: 13, margin: 0 } }, e('b', { style: { color: 'var(--brass)' } }, 'Fix: '), b.fix)
        ))
      ),

      show('Blindspots') && e(Section, { title: 'Blindspot register' },
        e('p', { className: 'op-p', style: { fontStyle: 'italic' } }, 'Areas the project may be underestimating. not necessarily surfaced in the KB \u2014 that is the point.'),
        G.blindspots.map((b) => e(CardBlock, { key: b.id },
          e('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 } },
            e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--fg-1)' } }, b.id + ' \u00B7 ' + b.title),
            e(Pill, null, b.severity)
          ),
          e('p', { className: 'op-p', style: { margin: 0 } }, b.body)
        ))
      ),

      show('Failure modes') && e(Section, { title: 'Failure modes' },
        G.failureModes.map((grp) => e('div', { key: grp.group, style: { marginBottom: 28 } },
          e(SubHead, null, grp.group),
          e(Table, {
            columns: [
              { key: 'mode', label: 'Failure mode' },
              { key: 'cause', label: 'Cause' },
              { key: 'impact', label: 'Impact' },
              { key: 'prevention', label: 'Prevention' },
              { key: 'residual', label: 'Residual', render: (r) => e(Pill, null, r.residual) },
            ],
            rows: grp.rows,
          })
        ))
      ),

      show('Unknown unknowns') && e(Section, { title: 'Unknown unknowns' },
        e('p', { className: 'op-p', style: { fontStyle: 'italic' } }, 'Structured techniques applied to surface risks not explicitly visible in the KB.'),
        G.unknownUnknowns.map((u) => e(CardBlock, { key: u.id },
          e('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: 4 } }, u.technique),
          e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--fg-1)', marginBottom: 6 } }, u.id + ' \u00B7 ' + u.title),
          e('p', { className: 'op-p', style: { margin: 0, fontSize: 13 } }, u.body)
        ))
      ),

      show('Open loops') && e(Section, { title: 'Open-loop register' },
        e(Table, {
          columns: [
            { key: 'id', label: 'ID' },
            { key: 'loop', label: 'Open loop' },
            { key: 'category', label: 'Category' },
            { key: 'canCloseNow', label: 'Close now?', render: (r) => r.canCloseNow === true ? 'Yes' : r.canCloseNow === 'partial' ? 'Partial' : 'No' },
            { key: 'resolution', label: 'Resolution' },
          ],
          rows: G.openLoops,
        }),
        e('div', { style: { marginTop: 16 } },
          e(SubHead, null, 'Resolved this package \u2014 no further action'),
          e('ul', { style: { margin: 0, paddingLeft: 20 } },
            G.openLoopsResolved.map((r, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 6 } }, r))
          )
        )
      )
    );
  }

  window.ConsoleScreens = window.ConsoleScreens || {};
  window.ConsoleScreens.registers = RegistersScreen;
})();
