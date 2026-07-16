/* Abstrekkt Operator Console — app shell: header, tab nav, footer, mount. */
(function () {
  const e = React.createElement;
  const S = window.ConsoleScreens;

  const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'tracker', label: 'Milestone 0' },
    { key: 'roadmap', label: 'Roadmap' },
    { key: 'reqs', label: 'Requirements' },
    { key: 'registers', label: 'Decisions & risk' },
    { key: 'handoff', label: 'Handoff' },
  ];

  function useHashTab() {
    const initial = (location.hash || '#overview').replace('#', '');
    const [tab, setTab] = React.useState(TABS.some(t => t.key === initial) ? initial : 'overview');
    React.useEffect(() => {
      const onHash = () => {
        const t = location.hash.replace('#', '');
        if (TABS.some(x => x.key === t)) setTab(t);
      };
      window.addEventListener('hashchange', onHash);
      return () => window.removeEventListener('hashchange', onHash);
    }, []);
    const go = (key) => { location.hash = key; setTab(key); window.scrollTo({ top: 0, behavior: 'auto' }); };
    return [tab, go];
  }

  function App() {
    const [tab, setTab] = useHashTab();
    const Screen = S[tab] || S.overview;
    return e('div', { className: 'op-root' },
      e('header', { className: 'op-header' },
        e('div', { className: 'op-header-in' },
          e('div', { className: 'op-word' }, e('b', null, 'Abstrekkt'), e('span', { className: 'dot' }, '.')),
          e('div', { className: 'op-sub' }, 'Operator Console'),
          e('div', { className: 'op-header-spacer' }),
          e('div', { className: 'op-header-meta' }, 'Package snapshot \u00B7 2026-07-11 \u00B7 booked revenue $0')
        ),
        e('nav', { className: 'op-tabs' },
          TABS.map((t) => e('button', {
            key: t.key,
            className: 'op-tab' + (tab === t.key ? ' active' : ''),
            onClick: () => setTab(t.key),
          }, t.label))
        )
      ),
      e('main', { className: 'op-main' },
        e(Screen, null)
      ),
      e('footer', { className: 'op-footer' },
        e('div', { className: 'op-footer-in' },
          e('span', null, 'Abstrekkt Operator Console \u00B7 rendered from the portable project package, incorporating Kyle\u2019s direct edits'),
          e('span', null,
            e('a', { href: 'FlashFusion Business Plan.html' }, 'Business Plan'), ' \u00B7 ',
            e('a', { href: 'FlashFusion PRD - Strategic Expansion Engine.html' }, 'PRD'), ' \u00B7 ',
            e('a', { href: 'FlashFusion Strategic Expansion Console.html' }, 'Expansion Console'), ' \u00B7 ',
            e('a', { href: 'LLC Formation Kit.html' }, 'LLC Kit'), ' \u00B7 ',
            e('a', { href: 'CANON.md' }, 'CANON.md')
          )
        )
      )
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(e(App));
})();
