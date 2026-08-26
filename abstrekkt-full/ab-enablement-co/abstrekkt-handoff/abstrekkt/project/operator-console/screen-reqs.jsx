/* Screen: Requirements & Architecture (02-03) */
(function () {
  const e = React.createElement;
  const { Section, SubHead, CardBlock, Table, Rule, Badge, MonoBlock } = window.ConsoleUI;
  const Q = window.ConsoleData.reqs;

  function ReqsScreen() {
    return e('div', { className: 'op-screen' },
      e(Section, { kicker: '02 \u00B7 Business requirements', title: 'The offer & the ladder', lead: Q.business.tldr },
        e('p', { className: 'op-p' }, Q.business.offer),
        e(Table, {
          columns: [
            { key: 'stage', label: 'Stage' },
            { key: 'what', label: 'What it is' },
            { key: 'pricing', label: 'Pricing rule' },
          ],
          rows: Q.business.ladder,
        }),
        e('p', { className: 'op-p', style: { marginTop: 14 } }, Q.business.conversion),
        e('p', { className: 'op-p' }, e('b', { style: { color: 'var(--fg-1)' } }, 'Revenue target: '), Q.business.revenueTarget)
      ),

      e(Section, { title: 'Hard business rules (constraints, not aspirations)' },
        e(CardBlock, null,
          e('ol', { style: { margin: 0, paddingLeft: 20 } },
            Q.business.hardRules.map((r, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 8 } }, r))
          )
        )
      ),

      e(Section, { title: 'Pipeline (business state, 2026-07-11)' },
        Q.business.pipeline.map((p, i) => e('div', { key: i, style: { marginBottom: 12 } },
          e(Badge, { tone: i === 0 ? 'solid' : 'neutral' }, p.tier),
          e('p', { className: 'op-p', style: { margin: '6px 0 0' } }, p.items)
        )),
        e('p', { className: 'op-p', style: { fontStyle: 'italic' } }, 'Concurrent cap: ' + Q.business.concurrentCap)
      ),

      e(Section, { kicker: '02 \u00B7 Product requirements', title: 'Software line', lead: Q.product.tldr },
        Q.product.items.map((it, i) => e(CardBlock, { key: i },
          e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--fg-1)', marginBottom: 6 } }, it.name),
          e('p', { className: 'op-p', style: { margin: '0 0 8px' } }, it.body),
          e('p', { className: 'op-p', style: { margin: 0, fontSize: 12.5 } }, e('b', { style: { color: 'var(--brass)' } }, 'Requirement: '), it.requirement)
        )),
        e('div', { style: { marginTop: 10 } },
          e(SubHead, null, 'Cross-cutting product rules'),
          e('ul', { style: { margin: 0, paddingLeft: 20 } },
            Q.product.crossCutting.map((c, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 6 } }, c))
          )
        )
      ),

      e(Section, { kicker: '03 \u00B7 Architecture', title: 'System architecture', lead: Q.architecture.tldr },
        e(Table, {
          columns: [
            { key: 'layer', label: 'Layer' },
            { key: 'tech', label: 'Technology' },
            { key: 'notes', label: 'Notes' },
          ],
          rows: Q.architecture.stack,
        })
      ),

      e(Section, { title: 'App topology' },
        e(Table, {
          columns: [
            { key: 'app', label: 'App' },
            { key: 'desc', label: 'Description' },
          ],
          rows: Q.architecture.topology,
        })
      ),

      e('div', { className: 'op-grid op-grid-2' },
        e(Section, { title: 'Hard architectural rules' },
          e(CardBlock, null,
            e('ol', { style: { margin: 0, paddingLeft: 20 } },
              Q.architecture.hardRules.map((r, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 8 } }, r))
            )
          )
        ),
        e(Section, { title: 'Known architectural debt' },
          e(CardBlock, null,
            e('ul', { style: { margin: 0, paddingLeft: 20 } },
              Q.architecture.debt.map((d, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 8 } }, d))
            )
          )
        )
      ),

      e(Section, { title: 'Dependency map \u2014 revenue-critical path' },
        e(MonoBlock, null, Q.dependency.revenueCriticalPath.join('\n')),
        e('p', { className: 'op-p', style: { fontStyle: 'italic', marginTop: 10 } }, Q.dependency.revenueCriticalNote)
      ),

      e(Section, { title: 'Other dependency chains' },
        e('div', { className: 'op-grid op-grid-2' },
          Q.dependency.chains.map((c, i) => e('div', { key: i },
            e('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-dim)', marginBottom: 6 } }, c.title),
            e(MonoBlock, null, c.lines.join('\n'))
          ))
        ),
        e('ul', { style: { margin: '18px 0 0', paddingLeft: 20 } },
          Q.dependency.crossCutting.map((c, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 6 } }, c))
        )
      )
    );
  }

  window.ConsoleScreens = window.ConsoleScreens || {};
  window.ConsoleScreens.reqs = ReqsScreen;
})();
