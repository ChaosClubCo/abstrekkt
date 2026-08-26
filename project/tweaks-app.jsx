// tweaks-app.jsx
// Small Tweaks panel for the Kyle Rosebrook / Abstrekkt homepage.
// The rest of the page is plain HTML/CSS/JS — this mounts only the floating
// panel, and pushes changes out to the page via CSS custom properties and
// direct DOM writes rather than rendering the page itself.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": ["#c4935a", "#7a5a35"],
  "density": "regular",
  "heroVoice": "systems"
}/*EDITMODE-END*/;

// Curated accent pairs: [base, deep-shade]. Stay inside the dark-editorial
// register — a cool blueprint blue and two muted earth tones alongside the
// current brass — rather than anything vibrant/neon.
const ACCENT_OPTIONS = [
  ['#c4935a', '#7a5a35'], // Brass — current
  ['#6f93b8', '#3d5468'], // Blueprint
  ['#b85a48', '#6e332a'], // Clay
  ['#7a9a7c', '#425244'], // Verdigris
];

const HERO_COPY = {
  systems: {
    thesis: "I read rooms, processes, and systems. Same instinct, different substrates.",
    sub: "I came up through hospitality and quality control before I taught myself to build software. What I make now is external cognition — systems, tools, and documentation for a brain that processes fast and holds almost nothing. FlashFusion is the work. <em>Construction, Not Recovery</em> is the book about why.",
  },
  direct: {
    thesis: "Self-taught. Systems-minded. Building in the open.",
    sub: "I taught myself software after years in hospitality and quality control \u2014 reading rooms, then processes, then code. FlashFusion is what I build for a living. <em>Construction, Not Recovery</em> is the book about how I got here.",
  },
  literary: {
    thesis: "What I build now is a memory I don\u2019t have to keep.",
    sub: "Hospitality, then quality control, then software \u2014 taught to myself in the margins of jobs that didn\u2019t ask for it. Somewhere in there, the old architecture broke. FlashFusion is what I built instead of the memory I lost. <em>Construction, Not Recovery</em> is the story of why.",
  },
};

const DENSITY_SCALE = { compact: 0.72, regular: 1, spacious: 1.4 };

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Accent color → CSS custom properties + live Calendly theme
  React.useEffect(() => {
    const [base, deep] = t.accent;
    const root = document.documentElement.style;
    root.setProperty('--brass', base);
    root.setProperty('--brass-deep', deep);
    root.setProperty('--brass-faint', hexToRgba(base, 0.2));
    root.setProperty('--rule-bright', hexToRgba(base, 0.25));

    const container = document.querySelector('.calendly-inline-widget');
    if (container) {
      const url = `https://calendly.com/kylerosebrook/30min?hide_gdpr_banner=1&background_color=0a0907&text_color=f2efe9&primary_color=${base.replace('#', '')}`;
      container.setAttribute('data-url', url);
      if (window.Calendly && window.Calendly.initInlineWidget) {
        container.innerHTML = '';
        window.Calendly.initInlineWidget({ url, parentElement: container });
      }
    }
  }, [t.accent]);

  // Layout density → global spacing scale used throughout the stylesheet
  React.useEffect(() => {
    document.documentElement.style.setProperty('--space-scale', DENSITY_SCALE[t.density]);
  }, [t.density]);

  // Hero copy voice
  React.useEffect(() => {
    const copy = HERO_COPY[t.heroVoice];
    const thesisEl = document.querySelector('.hero-thesis');
    const subEl = document.querySelector('.hero-sub');
    if (thesisEl) thesisEl.textContent = copy.thesis;
    if (subEl) subEl.innerHTML = copy.sub;
  }, [t.heroVoice]);

  return (
    <TweaksPanel>
      <TweakSection label="Theme" />
      <TweakColor label="Accent" value={t.accent} options={ACCENT_OPTIONS}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakSection label="Layout" />
      <TweakRadio label="Density" value={t.density}
                  options={['compact', 'regular', 'spacious']}
                  onChange={(v) => setTweak('density', v)} />
      <TweakSection label="Copy" />
      <TweakSelect label="Hero voice" value={t.heroVoice}
                   options={[
                     { value: 'systems', label: 'Systems' },
                     { value: 'direct', label: 'Direct' },
                     { value: 'literary', label: 'Literary' },
                   ]}
                   onChange={(v) => setTweak('heroVoice', v)} />
    </TweaksPanel>
  );
}

const __twkRoot = document.createElement('div');
document.body.appendChild(__twkRoot);
ReactDOM.createRoot(__twkRoot).render(<TweaksApp />);
