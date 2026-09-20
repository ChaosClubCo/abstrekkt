/* Screen: Overview (00 · Executive) */
(function () {
  const e = React.createElement;
  const { Section, Prose, Meta, Table, CardBlock, Pill, Rule, Kicker, Badge } = window.ConsoleUI;
  const D = window.ConsoleData.core;

  function OverviewScreen() {
    return e('div', { className: 'op-screen' },
      e(Section, {
        kicker: '00 \u00B7 Executive summary',
        title: e('span', null, 'Abstrekkt is pre-revenue, ', e('em', { className: 'op-em' }, 'blocked'), ' from earning by two unstarted gates.'),
        lead: 'A solo-founder holding org whose revenue engine (FlashFusion) has a working offer, a validated brand, a stack, and a live pipeline \u2014 but has not yet earned a dollar.',
      },
        e(Meta, { items: [
          { label: 'Generated', value: D.meta.generated },
          { label: 'Tier', value: D.meta.tier },
          { label: 'Booked revenue', value: D.meta.bookedRevenue },
          { label: 'Status', value: D.statusClassification },
        ]}),

        e(CardBlock, { accent: true },
          e('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: 8 } }, 'The one-sentence recommendation'),
          e('p', { style: { fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.6, color: 'var(--fg-1)', margin: 0 } }, D.recommendation)
        ),

        e(Prose, null, D.orgParagraph)
      ),

      e(Section, { title: 'Where the value and the risk concentrate' },
        e('div', { className: 'op-grid op-grid-2' },
          e(CardBlock, null,
            e('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-mute)', marginBottom: 10 } }, 'Value'),
            e('p', { className: 'op-p', style: { margin: 0 } }, D.valueParagraph)
          ),
          e(CardBlock, null,
            e('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--fg-mute)', marginBottom: 10 } }, 'Risk \u2014 everything downstream of \u201Csign a paying client\u201D'),
            D.riskPoints.map((r) => e('div', { key: r.n, style: { marginBottom: 10 } },
              e('span', { style: { color: 'var(--brass)', fontFamily: 'var(--font-mono)', fontSize: 12, marginRight: 8 } }, r.n + '.'),
              e('b', { style: { color: 'var(--fg-1)' } }, r.title + ' \u2014 '),
              e('span', { style: { color: 'var(--fg-dim)', fontSize: 13.5 } }, r.body)
            ))
          )
        )
      ),

      e(Section, { title: 'Status by dimension' },
        e('p', { className: 'op-p' }, D.statusNote),
        e(Table, {
          columns: [
            { key: 'dim', label: 'Dimension' },
            { key: 'status', label: 'Status', render: (r) => e(Pill, null, r.status) },
            { key: 'note', label: 'Note' },
          ],
          rows: D.statusDims,
        })
      ),

      e(Section, { title: 'Current maturity by workstream' },
        e(Table, {
          columns: [
            { key: 'workstream', label: 'Workstream' },
            { key: 'maturity', label: 'Maturity' },
            { key: 'next', label: 'Next milestone' },
          ],
          rows: D.maturityRows,
        })
      ),

      e(Section, { title: 'Org structure' },
        e('div', { className: 'op-grid op-grid-2' },
          D.structure.map((s) => e(CardBlock, { key: s.name },
            e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--fg-1)', marginBottom: 6 } }, s.name),
            e('div', { style: { fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.6 } }, s.role)
          ))
        )
      ),

      e(Section, { title: 'Source-of-truth hierarchy (read in this order)' },
        D.sourceHierarchy.map((s) => e('div', { key: s.n, className: 'op-check-row' },
          e('span', { style: { fontFamily: 'var(--font-mono)', color: 'var(--brass)', fontSize: 13, minWidth: 18 } }, s.n),
          e('span', null, e('b', { style: { color: 'var(--fg-1)' } }, s.label + ' \u2014 '), e('span', { style: { color: 'var(--fg-dim)' } }, s.detail))
        ))
      ),

      e(Section, { title: 'Provenance tagging (used throughout this console)' },
        e('div', { className: 'op-taglist' },
          D.provenanceLegend.map((p) => e(Badge, { key: p.tag, tone: 'neutral' }, p.tag + ' \u2014 ' + p.desc))
        )
      ),

      e(Section, { title: 'Known limitations of this package' },
        e('ul', { style: { margin: 0, paddingLeft: 20 } },
          D.limitations.map((l, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 8 } }, l))
        )
      )
    );
  }

  window.ConsoleScreens = window.ConsoleScreens || {};
  window.ConsoleScreens.overview = OverviewScreen;
})();
