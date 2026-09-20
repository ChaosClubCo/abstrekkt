/* Abstrekkt Operator Console — shared presentational components for the screen files.
   Exposed on window.ConsoleUI. Uses the Abstrekkt Design System bundle where it fits
   (Card, Badge, Rule, Kicker) and plain elements styled via console.css utility classes
   elsewhere (tables, checklists, filter bars) that the DS doesn't cover. */
(function () {
  const { Card, Badge, Rule, Kicker } = window.AbstrekktDesignSystem_00b28e;
  const e = React.createElement;

  function Section({ kicker, title, lead, children }) {
    return e('div', { className: 'op-section' },
      kicker && e(Kicker, { style: { marginBottom: 12 } }, kicker),
      title && e('h2', { className: 'op-h1', style: { fontSize: 'clamp(24px,3vw,34px)', marginBottom: 10 } }, title),
      lead && e('p', { className: 'op-lead' }, lead),
      children
    );
  }

  function SubHead({ children }) { return e('h3', { className: 'op-h2' }, children); }

  function Prose({ children }) { return e('p', { className: 'op-p' }, children); }

  // severity/status -> pill class
  function pillClass(v) {
    if (!v) return 'low';
    const s = String(v).toUpperCase();
    if (s.includes('CRITICAL') || s.includes('HIGH')) return 'high';
    if (s.includes('MEDIUM') || s.includes('MED') || s.includes('OPEN') || s.includes('PENDING') || s.includes('MISSING') || s.includes('REQUIRES')) return 'mid';
    return 'low';
  }
  function Pill({ children }) {
    return e('span', { className: 'op-pill ' + pillClass(children) }, children);
  }

  function Meta({ items }) {
    return e('div', { style: { display: 'flex', gap: 22, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-mute)', borderTop: '1px solid var(--border-1)', borderBottom: '1px solid var(--border-1)', padding: '14px 0', margin: '0 0 32px' } },
      items.map((it, i) => e('span', { key: i }, it.label + ': ', e('b', { style: { color: 'var(--brass)' } }, it.value)))
    );
  }

  function Table({ columns, rows }) {
    return e('div', { style: { overflowX: 'auto' } },
      e('table', { className: 'op-table' },
        e('thead', null, e('tr', null, columns.map((c, i) => e('th', { key: i }, c.label)))),
        e('tbody', null, rows.map((row, ri) => e('tr', { key: ri },
          columns.map((c, ci) => e('td', { key: ci }, c.render ? c.render(row) : row[c.key]))
        )))
      )
    );
  }

  function CardBlock({ accent, children, style }) {
    return e(Card, { accent: !!accent, padding: 'md', style: { marginBottom: 14, ...style } }, children);
  }

  function ProgressBar({ done, total }) {
    const pct = total ? Math.round((done / total) * 100) : 0;
    return e('div', null,
      e('div', { style: { display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-dim)', marginBottom: 8 } },
        e('span', null, done + ' / ' + total + ' closed'),
        e('span', { style: { color: 'var(--brass)' } }, pct + '%')
      ),
      e('div', { className: 'op-progress-track' }, e('div', { className: 'op-progress-fill', style: { width: pct + '%' } }))
    );
  }

  // Persistent checklist hook (localStorage-backed)
  function useChecklist(storageKey) {
    const [state, setState] = React.useState(() => {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : {};
      } catch (err) { return {}; }
    });
    const toggle = (id) => {
      setState((prev) => {
        const next = { ...prev, [id]: !prev[id] };
        try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch (err) {}
        return next;
      });
    };
    return [state, toggle];
  }

  function CheckRow({ id, text, sourceTag, checked, onToggle }) {
    return e('label', { className: 'op-check-row', htmlFor: id },
      e('input', { type: 'checkbox', id, className: 'op-checkbox', checked: !!checked, onChange: () => onToggle(id) }),
      e('span', { className: 'op-check-text' + (checked ? ' done' : '') }, text, sourceTag && e('span', { className: 'op-check-source' }, sourceTag))
    );
  }

  function FilterBar({ options, active, onChange }) {
    return e('div', { className: 'op-filterbar' },
      options.map((opt) => e('button', {
        key: opt,
        className: 'op-chip' + (active === opt ? ' active' : ''),
        onClick: () => onChange(opt),
      }, opt))
    );
  }

  function MonoBlock({ children }) { return e('pre', { className: 'op-mono-block' }, children); }

  window.ConsoleUI = { Section, SubHead, Prose, Pill, Meta, Table, CardBlock, ProgressBar, useChecklist, CheckRow, FilterBar, MonoBlock, Card, Badge, Rule, Kicker };
})();
