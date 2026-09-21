/* Screen: Handoff (01 · Source inventory, 09 · Handoff) */
(function () {
  const e = React.createElement;
  const { Section, SubHead, CardBlock, Table, Pill, MonoBlock, Badge } = window.ConsoleUI;
  const H = window.ConsoleData.handoff;

  function HandoffScreen() {
    return e('div', { className: 'op-screen' },
      e(Section, { kicker: '01 \u00B7 Source inventory', title: 'Source of truth', lead: H.sourceOfTruth.governing },
        e(Table, {
          columns: [
            { key: 'topic', label: 'Topic' },
            { key: 'authoritative', label: 'Authoritative source' },
            { key: 'superseded', label: 'Superseded / conflicting' },
          ],
          rows: H.sourceOfTruth.table,
        }),
        e('div', { style: { marginTop: 16 } },
          e(SubHead, null, 'Naming reconciliation needed'),
          e('ul', { style: { margin: 0, paddingLeft: 20 } },
            H.sourceOfTruth.reconciliation.map((r, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 8 } }, r))
          )
        )
      ),

      e(Section, { title: 'Inventory \u2014 sampled, not exhaustive' },
        e('p', { className: 'op-p' }, H.inventory.lead),
        H.inventory.groups.map((g) => e('div', { key: g.group, style: { marginBottom: 24 } },
          e(SubHead, null, g.group),
          e(Table, {
            columns: [
              { key: 'id', label: 'ID' },
              { key: 'doc', label: 'Doc' },
              { key: 'status', label: 'Status' },
              { key: 'authority', label: 'Authority', render: (r) => e(Pill, null, r.authority) },
              { key: 'disposition', label: 'Disposition' },
            ],
            rows: g.rows,
          })
        )),
        e('p', { className: 'op-p', style: { fontSize: 12.5 } }, e('b', null, 'Categories present: '), H.inventory.categoriesPresent),
        e('p', { className: 'op-p', style: { fontSize: 12.5 } }, e('b', { style: { color: 'var(--brass)' } }, 'Missing expected artifacts: '), H.inventory.missingArtifacts)
      ),

      e(Section, { title: 'Superseded material \u2014 preserved for history, not current guidance' },
        H.superseded.map((s, i) => e(CardBlock, { key: i },
          e('div', { style: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 6 } },
            e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--fg-1)' } }, s.title),
            e(Pill, null, s.scope)
          ),
          s.stillValid && e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 4px' } }, e('b', { style: { color: 'var(--brass)' } }, 'Still valid: '), s.stillValid),
          s.superseded && e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 4px' } }, e('b', null, 'Superseded: '), s.superseded),
          s.why && e('p', { className: 'op-p', style: { fontSize: 13, margin: '0 0 4px' } }, s.why),
          s.action && e('p', { className: 'op-p', style: { fontSize: 12.5, margin: 0, fontStyle: 'italic' } }, 'Action: ' + s.action)
        )),
        e('p', { className: 'op-p', style: { fontStyle: 'italic' } }, H.supersededNote)
      ),

      e(Section, { kicker: '09 \u00B7 Handoff', title: 'Validation report', lead: H.validation.verdict },
        e(Table, {
          columns: [
            { key: 'area', label: 'Area' },
            { key: 'result', label: 'Result' },
            { key: 'note', label: 'Note' },
          ],
          rows: H.validation.audits,
        }),
        e('div', { style: { display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 16 } },
          H.validation.confidence.map((c, i) => e('div', { key: i },
            e('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-mute)' } }, c.area),
            e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--brass)' } }, c.level)
          ))
        )
      ),

      e(Section, { title: 'Next operator brief \u2014 for a human picking this up cold' },
        e('p', { className: 'op-p' }, H.nextOperatorBrief.whatThisIs),
        e(CardBlock, { accent: true },
          e('div', { style: { fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--brass)', marginBottom: 8 } }, 'The one thing that matters right now'),
          e('p', { style: { margin: 0, fontSize: 14, color: 'var(--fg-1)', lineHeight: 1.65 } }, H.nextOperatorBrief.theOneThing)
        ),
        e('div', { style: { marginTop: 16 } },
          e(SubHead, null, 'Two time-sensitive things'),
          e('ul', { style: { margin: 0, paddingLeft: 20 } },
            H.nextOperatorBrief.timeSensitive.map((t, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 8 } }, t))
          )
        ),
        e('div', { style: { marginTop: 16 } },
          e(SubHead, null, 'What NOT to do'),
          e('ul', { style: { margin: 0, paddingLeft: 20 } },
            H.nextOperatorBrief.doNot.map((t, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 8 } }, t))
          )
        ),
        e('p', { className: 'op-p', style: { fontStyle: 'italic', marginTop: 10 } }, H.nextOperatorBrief.doneWithPhase0)
      ),

      e(Section, { title: 'Continuation \u2014 rules of engagement for the next AI session' },
        e('div', { className: 'op-grid op-grid-2' },
          e(CardBlock, null,
            e(SubHead, null, 'Do'),
            e('ul', { style: { margin: 0, paddingLeft: 20 } },
              H.continuation.rules.map((r, i) => e('li', { key: i, className: 'op-p', style: { fontSize: 12.5, marginBottom: 8 } }, r))
            )
          ),
          e(CardBlock, null,
            e(SubHead, null, 'Prohibited assumptions'),
            e('ul', { style: { margin: 0, paddingLeft: 20 } },
              H.continuation.prohibited.map((r, i) => e('li', { key: i, className: 'op-p', style: { fontSize: 12.5, marginBottom: 8 } }, r))
            )
          )
        ),
        e('p', { className: 'op-p', style: { marginTop: 14 } }, e('b', { style: { color: 'var(--fg-1)' } }, 'Standing contradictions: '), H.continuation.standingContradictions),
        e('p', { className: 'op-p' }, e('b', { style: { color: 'var(--brass)' } }, 'First action: '), H.continuation.firstAction),
        e('p', { className: 'op-p', style: { fontStyle: 'italic' } }, H.continuation.workingStyle)
      ),

      e(Section, { title: 'Model context \u2014 compact (paste-ready)' },
        e('p', { className: 'op-p' }, 'Paste this into another AI session (Claude / ChatGPT / Gemini) to continue this work without rediscovery.'),
        e(MonoBlock, null, H.modelContextCompact)
      )
    );
  }

  window.ConsoleScreens = window.ConsoleScreens || {};
  window.ConsoleScreens.handoff = HandoffScreen;
})();
