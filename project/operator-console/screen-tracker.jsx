/* Screen: Milestone 0 tracker (the gate) — interactive, localStorage-persisted. */
(function () {
  const e = React.createElement;
  const { Section, SubHead, Prose, CardBlock, Pill, ProgressBar, useChecklist, CheckRow, MonoBlock, Badge, Rule } = window.ConsoleUI;
  const T = window.ConsoleData.tracker;

  function BlockerCard({ b }) {
    return e(CardBlock, { accent: b.highlight, key: b.id },
      e('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8, flexWrap: 'wrap' } },
        e('div', { style: { fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--fg-1)' } }, b.id + ' \u00B7 ' + b.title),
        e(Pill, null, b.state)
      ),
      e('p', { className: 'op-p', style: { margin: '0 0 10px' } }, b.body),
      e('div', { style: { fontSize: 12.5, color: 'var(--fg-dim)', marginBottom: 6 } }, e('b', { style: { color: 'var(--brass)' } }, 'Close it: '), b.closeAction),
      e('div', { style: { display: 'flex', gap: 18, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-mute)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-1)' } },
        e('span', null, 'OWNER: ', e('b', { style: { color: 'var(--fg-dim)' } }, b.owner)),
        e('span', null, 'BY: ', e('b', { style: { color: 'var(--fg-dim)' } }, b.by)),
        e('span', null, 'BLOCKS: ', e('b', { style: { color: 'var(--fg-dim)' } }, b.blocks))
      )
    );
  }

  function ChecklistGroup({ title, lead, items, storageKey }) {
    const [checks, toggle] = useChecklist(storageKey);
    const done = items.filter((it) => checks[it.id]).length;
    return e('div', { style: { marginBottom: 40 } },
      title && e(SubHead, null, title),
      lead && e('p', { className: 'op-p' }, lead),
      e('div', { style: { marginBottom: 14 } }, e(ProgressBar, { done, total: items.length })),
      e(CardBlock, { padding: 'sm', style: { padding: '4px 20px' } },
        items.map((it) => e(CheckRow, {
          key: it.id, id: it.id, text: it.text, sourceTag: it.source, checked: checks[it.id], onToggle: toggle,
        }))
      )
    );
  }

  function TrackerScreen() {
    return e('div', { className: 'op-screen' },
      e(Section, {
        kicker: 'The gate',
        title: T.milestone0.title,
        lead: T.milestone0.lead,
      },
        e(ChecklistGroup, { title: 'Acceptance checklist', items: T.milestone0.items, storageKey: 'abstrekkt-console-m0' }),
        e('p', { className: 'op-p', style: { fontStyle: 'italic' } }, T.milestone0.note)
      ),

      e(Section, { title: 'Pre-revenue blockers B-1 \u2013 B-5' },
        T.blockers.map((b) => e(BlockerCard, { key: b.id, b }))
      ),

      e(Section, { title: 'Supporting artifacts owed at signing' },
        e(CardBlock, null,
          e('ul', { style: { margin: 0, paddingLeft: 20 } },
            T.supportingArtifacts.map((a, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 6 } }, a))
          )
        )
      ),

      e(Section, { title: 'Sequencing' },
        e(MonoBlock, null, T.sequencing)
      ),

      e(Section, { title: 'Milestone 1 \u2014 Revenue validated' },
        e('p', { className: 'op-p' }, T.milestone1.lead),
        e(ChecklistGroup, { title: '', items: T.milestone1.items, storageKey: 'abstrekkt-console-m1' })
      ),

      e(Section, { title: 'Milestone 2 \u2014 Motion proven' },
        e('p', { className: 'op-p' }, T.milestone2.lead)
      ),

      e('div', { className: 'op-grid op-grid-2' },
        e(Section, { title: T.ryan.title },
          e(ChecklistGroup, { title: '', items: T.ryan.items, storageKey: 'abstrekkt-console-ryan' })
        ),
        e(Section, { title: T.union.title },
          e(ChecklistGroup, { title: '', items: T.union.items, storageKey: 'abstrekkt-console-union' })
        )
      ),

      e(Section, { title: 'Explicit non-goals \u2014 what \u201Cdone\u201D does NOT require' },
        e(CardBlock, null,
          e('ul', { style: { margin: 0, paddingLeft: 20 } },
            T.nonGoals.map((g, i) => e('li', { key: i, className: 'op-p', style: { marginBottom: 6 } }, g))
          )
        )
      )
    );
  }

  window.ConsoleScreens = window.ConsoleScreens || {};
  window.ConsoleScreens.tracker = TrackerScreen;
})();
