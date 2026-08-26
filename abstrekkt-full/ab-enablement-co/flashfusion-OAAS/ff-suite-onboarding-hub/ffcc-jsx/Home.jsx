import React, { useEffect, useRef, useState, useCallback } from 'react';

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const TICKER_ITEMS = [
  'USER FLOW BUILDER', '·', 'PERSONA SIMULATION', '·',
  'VISUAL REGRESSION', '·', 'MOBILE FRICTION AUDIT', '·',
  'CI/CD INTEGRATION', '·', 'BROWSER E2E TESTING', '·',
  'USER FLOW BUILDER', '·', 'PERSONA SIMULATION', '·',
  'VISUAL REGRESSION', '·', 'MOBILE FRICTION AUDIT', '·',
  'CI/CD INTEGRATION', '·', 'BROWSER E2E TESTING', '·',
];

const MOCKUP_CONTENT = {
  flow: [
    { label: 'Login flow',      pct: 94,  color: 'lime' },
    { label: 'Checkout flow',   pct: 78,  color: 'lime' },
    { label: 'Onboarding flow', pct: 62,  color: 'lime' },
  ],
  persona: [
    { label: 'Power user · Chrome desktop', pct: 100, color: 'lime',    badge: 'Active'  },
    { label: 'First-timer · Safari iOS',    pct: 100, color: 'lime',    badge: 'Active'  },
    { label: 'Screen reader user',          pct: 40,  color: 'bta-blue', badge: 'Queued' },
  ],
  runner: [
    { label: 'Chrome 124 · 1920×1080', pct: 100, color: 'lime',    badge: '✓ Pass' },
    { label: 'Safari 17 · iPhone 15 Pro', pct: 100, color: 'lime', badge: '✓ Pass' },
    { label: 'Firefox · 375×667',       pct: 100, color: 'danger', badge: '✗ Fail' },
  ],
};

const PRICING_TIERS = [
  {
    id: 'starter', tier: 'Starter', price: '$0', cadence: 'Free forever — no credit card',
    cta: 'Get Started Free', ctaVariant: 'outline', featured: false,
    features: ['Up to 5 User Flows', '10 AI Personas', 'Basic browser E2E', 'Weekly reports', 'Community support'],
  },
  {
    id: 'pro', tier: 'Pro', price: '$49', cadence: 'Billed monthly — cancel anytime',
    cta: 'Start Pro Trial', ctaVariant: 'primary', featured: true,
    features: ['Unlimited User Flows', '100 AI Personas', 'Full E2E + visual regression', 'Mobile friction audits', 'CI/CD integration', 'Real-time reports + Slack alerts', 'Priority support'],
  },
  {
    id: 'enterprise', tier: 'Enterprise', price: 'Custom', cadence: 'Annual contract — volume pricing',
    cta: 'Talk to Sales', ctaVariant: 'outline', featured: false,
    features: ['Unlimited everything', 'Custom AI persona profiles', 'On-prem or dedicated cloud', 'SSO + RBAC', 'SLA guarantee', 'Dedicated success manager'],
  },
];

const DEFAULT_FEATURES = [
  { name: 'User Flow Builder',    icon: '⚡', desc: 'Visually design and automate complex multi-step user journeys with zero code.',             benefit: 'Ship faster, test deeper'  },
  { name: 'Persona Simulation',   icon: '👥', desc: 'Test with an army of AI personas that mimic real-world user archetypes and behaviors.',     benefit: 'Real-world coverage'      },
  { name: 'Browser E2E Testing',  icon: '🌐', desc: 'Execute tests in real browsers with performance, accessibility, and network audits.',        benefit: 'Production-grade confidence' },
  { name: 'Mobile Friction Audit',icon: '📱', desc: 'Automatically detect tap targets, scroll issues, and UX friction on mobile viewports.',     benefit: 'Zero mobile regression'   },
  { name: 'Visual Regression',    icon: '◈',  desc: 'Catch unintended UI changes pixel-by-pixel before they reach production.',                  benefit: 'No more visual bugs'      },
  { name: 'CI/CD Integration',    icon: '⚙',  desc: 'Hook into GitHub Actions, CircleCI, or any pipeline with a single YAML block.',             benefit: 'Shift-left testing'       },
];

const DEFAULT_TESTIMONIALS = [
  { name: 'Sarah Chen',   role: 'Senior QA Engineer', company: 'Luma Labs',  quote: 'Beta Tester Army cut our regression cycle from 3 days to 40 minutes. We caught a critical checkout bug on mobile Safari that would have cost thousands in lost conversions.' },
  { name: 'Marcus Webb',  role: 'CTO',                company: 'Stackly',    quote: 'We went from shipping with fear to shipping with confidence. The CI/CD integration was running in our pipeline within an hour of signing up.' },
  { name: 'Priya Nair',   role: 'Head of Product',    company: 'Formr',      quote: 'The persona simulation is genuinely unlike anything else. Watching 50 AI users with different accessibility needs navigate our onboarding in real-time was a revelation.' },
];

// ─── THREE.JS CANVAS ────────────────────────────────────────────────────────

function ThreeCanvas() {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    function initThree() {
      const THREE = window.THREE;
      const canvas = mountRef.current;
      if (!canvas || !THREE) return;

      const W = window.innerWidth;
      const H = window.innerHeight;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.z = 80;

      const COUNT = 120;
      const positions = [];
      const velocities = [];
      const posArr = new Float32Array(COUNT * 3);

      for (let i = 0; i < COUNT; i++) {
        positions.push([(Math.random() - 0.5) * 180, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 60]);
        velocities.push([(Math.random() - 0.5) * 0.04, Math.random() * 0.02 + 0.01, (Math.random() - 0.5) * 0.01]);
        posArr[i * 3]     = positions[i][0];
        posArr[i * 3 + 1] = positions[i][1];
        posArr[i * 3 + 2] = positions[i][2];
      }

      const geoP = new THREE.BufferGeometry();
      geoP.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      const matP = new THREE.PointsMaterial({ color: 0xa8ff3e, size: 0.8, transparent: true, opacity: 0.7 });
      const points = new THREE.Points(geoP, matP);
      scene.add(points);

      let animId;
      function animate() {
        animId = requestAnimationFrame(animate);
        const pa = geoP.attributes.position.array;
        for (let i = 0; i < COUNT; i++) {
          positions[i][0] += velocities[i][0];
          positions[i][1] += velocities[i][1];
          positions[i][2] += velocities[i][2];
          if (positions[i][1] > 55) positions[i][1] = -55;
          if (Math.abs(positions[i][0]) > 95) velocities[i][0] *= -1;
          pa[i * 3]     = positions[i][0];
          pa[i * 3 + 1] = positions[i][1];
          pa[i * 3 + 2] = positions[i][2];
        }
        geoP.attributes.position.needsUpdate = true;

        // Remove old connection lines (keep only the Points mesh)
        scene.children = scene.children.filter(c => c === points);

        for (let i = 0; i < COUNT; i++) {
          for (let j = i + 1; j < COUNT; j++) {
            const dx = positions[i][0] - positions[j][0];
            const dy = positions[i][1] - positions[j][1];
            const dz = positions[i][2] - positions[j][2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < 28) {
              const geo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(positions[i][0], positions[i][1], positions[i][2]),
                new THREE.Vector3(positions[j][0], positions[j][1], positions[j][2]),
              ]);
              const mat = new THREE.LineBasicMaterial({ color: 0xa8ff3e, transparent: true, opacity: (1 - dist / 28) * 0.25 });
              scene.add(new THREE.Line(geo, mat));
            }
          }
        }
        renderer.render(scene, camera);
      }
      animate();

      function onResize() {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      window.addEventListener('resize', onResize);

      cleanupRef.current = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
      };
    }

    if (window.THREE) {
      initThree();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = initThree;
      document.head.appendChild(script);
    }

    return () => { cleanupRef.current?.(); };
  }, []);

  return (
    <canvas
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// ─── MOCKUP BAR ROW ─────────────────────────────────────────────────────────

function MockRow({ label, pct, color, badge }) {
  const colorMap = {
    lime:     { dot: '#A8FF3E', bar: '#A8FF3E', badge: '#A8FF3E' },
    'bta-blue': { dot: '#3E8BFF', bar: '#3E8BFF', badge: '#3E8BFF' },
    danger:   { dot: '#FF6B6B', bar: '#FF6B6B', badge: '#FF6B6B' },
  };
  const c = colorMap[color] || colorMap.lime;
  return (
    <div className="flex items-center gap-3 p-3 rounded-none border border-lime/10 bg-lime/[0.02] animate-bta-pulse">
      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.dot }} />
      <span className="text-xs text-bta-muted">{label}</span>
      <div className="flex-1 h-1 bg-white/5 rounded-none overflow-hidden">
        <div className="h-full rounded-none transition-all duration-1000" style={{ width: `${pct}%`, background: c.bar }} />
      </div>
      {badge && <span className="text-[11px] ml-2 shrink-0" style={{ color: c.badge }}>{badge ?? `${pct}%`}</span>}
      {!badge && <span className="text-[11px] ml-2 shrink-0" style={{ color: c.badge }}>{pct}%</span>}
    </div>
  );
}

// ─── FEATURE CARD ───────────────────────────────────────────────────────────

function FeatureCard({ feature, delay, visible }) {
  return (
    <div
      className={`
        bg-bta-bg2 p-9 border-t-[3px] border-t-transparent border border-lime/10
        transition-all duration-500 cursor-default
        hover:border-t-lime hover:bg-lime/[0.02]
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      <div className="text-3xl mb-5">{feature.icon}</div>
      <div className="font-display text-lg font-bold mb-3">{feature.name}</div>
      <p className="text-sm text-bta-muted leading-relaxed">{feature.desc}</p>
      <span className="inline-block mt-4 text-[10px] tracking-[0.15em] text-lime uppercase px-2.5 py-1 border border-lime/15">
        {feature.benefit}
      </span>
    </div>
  );
}

// ─── SKELETON ───────────────────────────────────────────────────────────────

function Skeleton({ className = '' }) {
  return <div className={`bg-white/[0.06] animate-bta-shimmer rounded-none ${className}`} />;
}

// ─── TESTIMONIAL CARD ───────────────────────────────────────────────────────

function TestimonialCard({ t, delay, visible }) {
  return (
    <div
      className={`
        bg-bta-bg2 border border-lime/10 border-l-[3px] border-l-lime p-8
        transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      <p className="text-sm text-bta-muted leading-relaxed italic mb-6">"{t.quote}"</p>
      <div className="flex items-center gap-3">
        <img
          className="w-11 h-11 rounded-full border border-lime/10"
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=1A2030&color=A8FF3E&size=88&bold=true`}
          alt={t.name}
          loading="lazy"
        />
        <div>
          <div className="font-display text-sm font-bold">{t.name}</div>
          <div className="text-[11px] text-bta-muted mt-0.5">{t.role} · {t.company}</div>
        </div>
      </div>
    </div>
  );
}

// ─── PRICING CARD ───────────────────────────────────────────────────────────

function PricingCard({ tier, delay, visible }) {
  return (
    <div
      className={`
        relative p-9 border transition-all duration-500
        ${tier.featured ? 'border-lime bg-lime/[0.04]' : 'border-lime/10 bg-bta-bg3'}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
      `}
      style={{ transitionDelay: `${delay}s` }}
    >
      {tier.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-black text-[10px] tracking-[0.15em] font-mono font-medium px-3.5 py-1 uppercase">
          Most Popular
        </div>
      )}
      <div className="text-[11px] tracking-[0.2em] text-lime uppercase mb-4">{tier.tier}</div>
      <div className="font-display font-extrabold leading-none mb-1" style={{ fontSize: tier.price === 'Custom' ? '36px' : '48px' }}>
        {tier.price}
        {tier.price !== 'Custom' && <span className="text-xl text-bta-muted font-normal">/mo</span>}
      </div>
      <div className="text-xs text-bta-muted mb-7">{tier.cadence}</div>
      <ul className="flex flex-col gap-3 mb-8">
        {tier.features.map(f => (
          <li key={f} className="text-sm text-bta-muted pl-5 relative before:content-['✓'] before:absolute before:left-0 before:text-lime before:font-bold">
            {f}
          </li>
        ))}
      </ul>
      <a
        href="#final-cta"
        className={`
          block text-center font-mono text-sm tracking-widest uppercase py-4 px-6 transition-all duration-200
          ${tier.featured
            ? 'bg-lime text-black hover:opacity-85 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(168,255,62,0.3)]'
            : 'border border-white/25 text-white hover:border-white/60 hover:-translate-y-0.5'
          }
        `}
      >
        {tier.cta}
      </a>
    </div>
  );
}

// ─── MAIN HOME COMPONENT ────────────────────────────────────────────────────

export default function Home() {
  const [scrolled, setScrolled]           = useState(false);
  const [activeTab, setActiveTab]         = useState('flow');
  const [features, setFeatures]           = useState(null);
  const [testimonials, setTestimonials]   = useState(null);
  const [stepFill, setStepFill]           = useState(false);
  const [visibleEls, setVisibleEls]       = useState(new Set());

  const revealRefs   = useRef([]);
  const stepsRef     = useRef(null);

  // ── Navbar scroll ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // ── Scroll reveal observer ───────────────────────────────────────────────
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = e.target.dataset.revealId;
            if (id) setVisibleEls(prev => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.13 }
    );
    revealRefs.current.forEach(el => { if (el) io.observe(el); });
    return () => io.disconnect();
  }, [features, testimonials]); // re-run when dynamic content loads

  // ── Steps connector fill observer ────────────────────────────────────────
  useEffect(() => {
    if (!stepsRef.current) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStepFill(true); },
      { threshold: 0.3 }
    );
    io.observe(stepsRef.current);
    return () => io.disconnect();
  }, []);

  // ── Ref registration helper ──────────────────────────────────────────────
  const registerReveal = useCallback((el, id) => {
    if (el) {
      el.dataset.revealId = id;
      if (!revealRefs.current.includes(el)) revealRefs.current.push(el);
    }
  }, []);

  const isVisible = id => visibleEls.has(id);

  // ── Generative features ──────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{
              role: 'user',
              content: 'Generate a JSON array of exactly 6 feature objects for "Beta Tester Army", an AI-powered automated QA platform. Features must be: "User Flow Builder", "Persona Simulation", "Browser E2E Testing", "Mobile Friction Audit", "Visual Regression", "CI/CD Integration". Each object: { "name": string, "icon": single emoji, "desc": string (max 20 words, powerful, technical), "benefit": string (max 5 words, outcome-focused) }. Return ONLY the JSON array, no markdown, no explanation.',
            }],
          }),
        });
        const data = await res.json();
        const text = data.content[0].text.trim().replace(/```json|```/g, '').trim();
        setFeatures(JSON.parse(text));
      } catch {
        setFeatures(DEFAULT_FEATURES);
      }
    }
    load();
  }, []);

  // ── Generative testimonials ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 800,
            messages: [{
              role: 'user',
              content: 'Generate a JSON array of 3 realistic B2B testimonials for "Beta Tester Army", an AI QA platform. Roles: QA Engineer, CTO, Product Manager. Each: { "name": string, "role": string, "company": string, "quote": string (2 sentences max, specific and credible, mentions a real outcome) }. Return ONLY the JSON array, no markdown.',
            }],
          }),
        });
        const data = await res.json();
        const text = data.content[0].text.trim().replace(/```json|```/g, '').trim();
        setTestimonials(JSON.parse(text));
      } catch {
        setTestimonials(DEFAULT_TESTIMONIALS);
      }
    }
    load();
  }, []);

  // ── Reveal class helper ──────────────────────────────────────────────────
  const reveal = (id, extraDelay = 0) => ({
    ref: el => registerReveal(el, id),
    className: `transition-all duration-600 ease-out ${isVisible(id)
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-6'
    }`,
    style: { transitionDelay: `${extraDelay}s` },
  });

  const mockRows = MOCKUP_CONTENT[activeTab] || [];

  return (
    <div className="font-mono text-white overflow-x-hidden" style={{ background: 'var(--color-bta-bg)' }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-[5%]
        transition-all duration-300
        ${scrolled ? 'bg-bta-bg/85 backdrop-blur-md border-b border-lime/15' : ''}
      `}>
        <a href="#" className="font-display font-extrabold text-lg text-lime tracking-[0.08em] no-underline">BTA</a>
        <ul className="hidden md:flex gap-8 list-none">
          {['Features', 'How It Works', 'Pricing'].map(l => (
            <li key={l}>
              <a
                href={`#${l.toLowerCase().replace(' ', '-')}`}
                className="text-[11px] tracking-[0.12em] uppercase text-bta-muted hover:text-white transition-colors duration-200 no-underline"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#final-cta"
          className="bg-lime text-black font-mono text-[11px] tracking-[0.12em] uppercase font-medium px-5 py-2.5 transition-all duration-200 hover:opacity-85 hover:-translate-y-px no-underline"
        >
          Get Started
        </a>
      </nav>

      {/* ── HERO SPLASH ─────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'var(--color-bta-bg)',
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(168,255,62,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 20%, rgba(62,139,255,0.08) 0%, transparent 60%)
          `,
        }} />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(8,11,18,0.3) 0%, rgba(8,11,18,0.6) 50%, rgba(8,11,18,0.95) 100%)' }}
        />
        <ThreeCanvas />

        <div className="relative z-10 text-center max-w-4xl px-6">
          <span className="inline-block text-[11px] tracking-[0.2em] text-lime mb-7 animate-bta-fadeup opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            [ AI-POWERED QA PLATFORM ]
          </span>
          <h1 className="font-display font-extrabold leading-[1.05] tracking-tight mb-6 text-[clamp(36px,6vw,80px)] animate-bta-fadeup opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            Empowering <span className="text-lime">Flawless</span><br />Digital Experiences.
          </h1>
          <p className="text-[clamp(14px,2vw,18px)] text-bta-muted leading-relaxed max-w-xl mx-auto mb-10 animate-bta-fadeup opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            Your AI-driven army of virtual beta testers, meticulously auditing every user journey.
          </p>
          <div className="flex gap-4 justify-center flex-wrap animate-bta-fadeup opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
            <a href="#final-cta" className="bg-lime text-black font-mono text-[13px] tracking-[0.08em] font-medium px-8 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(168,255,62,0.3)] no-underline">
              Join the Beta Tester Army
            </a>
            <a href="#features" className="border border-white/25 text-white font-mono text-[13px] tracking-[0.08em] px-8 py-4 transition-all duration-200 hover:border-white/60 hover:-translate-y-0.5 no-underline">
              Discover Superpowers
            </a>
          </div>
        </div>

        {/* Ticker */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-lime/15 bg-bta-bg/80 py-3.5 overflow-hidden animate-bta-fadeup opacity-0" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
          <div className="flex whitespace-nowrap animate-bta-ticker">
            {TICKER_ITEMS.map((item, i) => (
              <span key={i} className="text-[11px] tracking-[0.2em] text-lime/70 uppercase px-10">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── LANDING HERO ─────────────────────────────────────────────────── */}
      <section id="landing-hero" className="py-24 px-[5%]" style={{
        background: 'var(--color-bta-bg2)',
        borderTop: '1px solid rgba(168,255,62,0.15)',
        backgroundImage: 'linear-gradient(rgba(168,255,62,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(168,255,62,0.04) 1px,transparent 1px)',
        backgroundSize: '60px 60px',
      }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span {...reveal('lh-tag')} className={reveal('lh-tag').className + ' block text-[11px] tracking-[0.2em] text-lime uppercase mb-4'} ref={reveal('lh-tag').ref} style={reveal('lh-tag').style}>
              [ BEYOND TRADITIONAL QA ]
            </span>
            <h2 {...reveal('lh-h2')} className={`font-display font-extrabold tracking-tight leading-[1.1] mb-5 text-[clamp(28px,4vw,52px)] ${reveal('lh-h2').className}`} ref={reveal('lh-h2').ref} style={reveal('lh-h2').style}>
              AI-Powered User Flow & Persona Testing.
            </h2>
            <p {...reveal('lh-sub')} className={`text-base text-bta-muted leading-relaxed max-w-md mb-9 ${reveal('lh-sub').className}`} ref={reveal('lh-sub').ref} style={{ ...reveal('lh-sub').style, transitionDelay: '0.1s' }}>
              Identify friction, detect regressions, and validate every user journey with unparalleled depth and speed.
            </p>
            <div {...reveal('lh-btns')} className={`flex gap-4 flex-wrap ${reveal('lh-btns').className}`} ref={reveal('lh-btns').ref} style={{ ...reveal('lh-btns').style, transitionDelay: '0.2s' }}>
              <a href="#final-cta" className="bg-lime text-black font-mono text-[13px] tracking-[0.08em] font-medium px-8 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(168,255,62,0.3)] no-underline">
                Start Testing for Free
              </a>
              <a href="#" className="border border-white/25 text-white font-mono text-[13px] tracking-[0.08em] px-8 py-4 transition-all duration-200 hover:border-white/60 hover:-translate-y-0.5 no-underline">
                Request a Demo
              </a>
            </div>
          </div>

          {/* Mockup */}
          <div {...reveal('lh-mock')} ref={reveal('lh-mock').ref} style={{ ...reveal('lh-mock').style, transitionDelay: '0.15s' }} className={reveal('lh-mock').className}>
            <div className="border border-lime/15 overflow-hidden" style={{ background: 'var(--color-bta-bg3)' }}>
              <div className="flex border-b border-lime/10">
                {Object.keys(MOCKUP_CONTENT).map(key => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`
                      font-mono text-[11px] tracking-[0.1em] uppercase px-5 py-3 border-none cursor-pointer transition-all duration-200
                      ${activeTab === key
                        ? 'text-lime bg-lime/[0.05] border-b-2 border-b-lime'
                        : 'text-bta-muted bg-transparent hover:text-white'
                      }
                    `}
                    style={{ borderBottom: activeTab === key ? '2px solid var(--color-lime)' : 'none' }}
                  >
                    {key === 'flow' ? 'UserFlow' : key === 'persona' ? 'PersonaBank' : 'TestRunner'}
                  </button>
                ))}
              </div>
              <div className="p-6 min-h-[220px] flex flex-col gap-3">
                {mockRows.map((row, i) => (
                  <MockRow key={`${activeTab}-${i}`} {...row} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ────────────────────────────────────────────── */}
      <section id="problem-solution" className="py-24 px-[5%]" style={{ background: 'var(--color-bta-bg3)', borderTop: '1px solid rgba(62,139,255,0.2)', borderBottom: '1px solid rgba(62,139,255,0.2)' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Problem */}
          <div {...reveal('ps-problem')} ref={reveal('ps-problem').ref} style={reveal('ps-problem').style} className={`p-10 border border-red-500/20 bg-red-500/[0.03] ${reveal('ps-problem').className}`}>
            <div className="text-3xl mb-5">⚠</div>
            <h3 className="font-display text-2xl font-extrabold text-red-400 mb-4">The Old Way is Broken</h3>
            <p className="text-sm text-bta-muted leading-relaxed">Manual QA can't keep up with modern release cycles. Teams ship blindly, bugs reach production, and users churn.</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {['Slow, expensive manual test cycles', 'Incomplete coverage across devices & viewports', 'No real user persona diversity in testing', 'Regression bugs ship undetected', 'Accessibility issues go unreported until too late'].map(item => (
                <li key={item} className="text-sm text-bta-muted pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-red-400">{item}</li>
              ))}
            </ul>
          </div>
          {/* Solution */}
          <div {...reveal('ps-solution')} ref={reveal('ps-solution').ref} style={{ ...reveal('ps-solution').style, transitionDelay: '0.15s' }} className={`p-10 border border-lime/15 bg-lime/[0.03] ${reveal('ps-solution').className}`}>
            <div className="text-3xl mb-5">⚡</div>
            <h3 className="font-display text-2xl font-extrabold text-lime mb-4">The Army Never Sleeps</h3>
            <p className="text-sm text-bta-muted leading-relaxed">Beta Tester Army deploys thousands of AI personas across your product 24/7 — catching what humans miss at the speed of CI/CD.</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {['Automated flows run on every commit', 'Diverse AI personas simulate real user behavior', 'Real browser execution with full accessibility audits', 'Visual regression catches every UI drift', 'Actionable reports, not raw logs'].map(item => (
                <li key={item} className="text-sm text-bta-muted pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[7px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-lime">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-[5%]" style={{ background: 'var(--color-bta-bg2)' }}>
        <div className="max-w-6xl mx-auto">
          <span {...reveal('feat-tag')} ref={reveal('feat-tag').ref} style={reveal('feat-tag').style} className={`block text-[11px] tracking-[0.2em] text-lime uppercase mb-4 ${reveal('feat-tag').className}`}>
            [ CAPABILITIES ]
          </span>
          <h2 {...reveal('feat-h2')} ref={reveal('feat-h2').ref} style={reveal('feat-h2').style} className={`font-display font-extrabold tracking-tight mb-4 text-[clamp(28px,4vw,52px)] ${reveal('feat-h2').className}`}>
            Everything Your QA Stack Needs.
          </h2>
          <p {...reveal('feat-sub')} ref={reveal('feat-sub').ref} style={{ ...reveal('feat-sub').style, transitionDelay: '0.1s' }} className={`text-base text-bta-muted mb-16 ${reveal('feat-sub').className}`}>
            Six core modules, one unified platform.
          </p>

          {!features ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-lime/10 bg-lime/10 gap-px">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-9" style={{ background: 'var(--color-bta-bg2)' }}>
                  <Skeleton className="w-10 h-10 mb-5" />
                  <Skeleton className="w-2/3 h-4 mb-3" />
                  <Skeleton className="w-full h-3 mb-1.5" />
                  <Skeleton className="w-4/5 h-3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-lime/10 gap-px" style={{ background: 'rgba(168,255,62,0.1)' }}>
              {features.map((f, i) => (
                <FeatureCard
                  key={f.name}
                  feature={f}
                  delay={i * 0.08}
                  visible={isVisible(`feat-card-${i}`)}
                  ref={el => registerReveal(el, `feat-card-${i}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-24 px-[5%]"
        style={{
          background: 'var(--color-bta-bg)',
          backgroundImage: 'linear-gradient(rgba(168,255,62,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(168,255,62,0.04) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <span {...reveal('how-tag')} ref={reveal('how-tag').ref} style={reveal('how-tag').style} className={`block text-[11px] tracking-[0.2em] text-lime uppercase mb-4 ${reveal('how-tag').className}`}>
            [ PROCESS ]
          </span>
          <h2 {...reveal('how-h2')} ref={reveal('how-h2').ref} style={reveal('how-h2').style} className={`font-display font-extrabold tracking-tight mb-16 text-[clamp(28px,4vw,52px)] ${reveal('how-h2').className}`}>
            Ship Confidence in 3 Steps.
          </h2>

          <div ref={stepsRef} className="relative grid md:grid-cols-3 gap-10">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[calc(16.7%+16px)] right-[calc(16.7%+16px)] h-px bg-lime/15">
              <div
                className="h-px bg-lime transition-all duration-[1500ms] ease-out"
                style={{ width: stepFill ? '100%' : '0%', transitionDelay: '0.5s' }}
              />
            </div>

            {[
              { num: '01', icon: '⚙', title: 'Define',  desc: 'Create User Flows and Personas. Map every critical path and define your diverse test audience — from power users to first-timers.' },
              { num: '02', icon: '▶', title: 'Run',     desc: 'Execute tests in parallel across environments. Real browsers, real viewports, real AI personas — all firing simultaneously.' },
              { num: '03', icon: '◉', title: 'Analyze', desc: 'Get actionable insights and detailed reports. Not raw logs — prioritized findings with reproduction steps and severity scoring.' },
            ].map((step, i) => (
              <div
                key={step.num}
                ref={el => registerReveal(el, `step-${i}`)}
                className={`flex flex-col transition-all duration-500 ${isVisible(`step-${i}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: `${i * 0.2}s` }}
              >
                <span className="font-display text-5xl font-extrabold text-lime/30 leading-none mb-5">{step.num}</span>
                <div className="w-16 h-16 border border-lime/15 flex items-center justify-center text-2xl mb-5 relative z-10" style={{ background: 'var(--color-bta-bg)' }}>
                  {step.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-2.5">{step.title}</h3>
                <p className="text-sm text-bta-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-[5%]" style={{ background: 'var(--color-bta-bg3)' }}>
        <div className="max-w-6xl mx-auto">
          <span {...reveal('test-tag')} ref={reveal('test-tag').ref} style={reveal('test-tag').style} className={`block text-[11px] tracking-[0.2em] text-lime uppercase mb-4 ${reveal('test-tag').className}`}>
            [ SOCIAL PROOF ]
          </span>
          <h2 {...reveal('test-h2')} ref={reveal('test-h2').ref} style={reveal('test-h2').style} className={`font-display font-extrabold tracking-tight mb-16 text-[clamp(28px,4vw,52px)] ${reveal('test-h2').className}`}>
            Trusted by Teams Who Ship with Confidence.
          </h2>

          {!testimonials ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="p-8 border border-lime/10" style={{ background: 'var(--color-bta-bg2)' }}>
                  <Skeleton className="w-full h-20 mb-6" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-11 h-11 rounded-full" />
                    <div><Skeleton className="w-28 h-3.5 mb-1.5" /><Skeleton className="w-20 h-2.5" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <TestimonialCard
                  key={t.name}
                  t={t}
                  delay={i * 0.1}
                  visible={isVisible(`tcard-${i}`)}
                  ref={el => registerReveal(el, `tcard-${i}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-[5%]" style={{ background: 'var(--color-bta-bg2)' }}>
        <div className="max-w-6xl mx-auto">
          <span {...reveal('price-tag')} ref={reveal('price-tag').ref} style={reveal('price-tag').style} className={`block text-[11px] tracking-[0.2em] text-lime uppercase mb-4 ${reveal('price-tag').className}`}>
            [ PLANS ]
          </span>
          <h2 {...reveal('price-h2')} ref={reveal('price-h2').ref} style={reveal('price-h2').style} className={`font-display font-extrabold tracking-tight mb-4 text-[clamp(28px,4vw,52px)] ${reveal('price-h2').className}`}>
            Simple, Scalable Pricing.
          </h2>
          <p {...reveal('price-sub')} ref={reveal('price-sub').ref} style={{ ...reveal('price-sub').style, transitionDelay: '0.1s' }} className={`text-base text-bta-muted mb-16 ${reveal('price-sub').className}`}>
            Start free. Scale as your product grows.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING_TIERS.map((tier, i) => (
              <PricingCard
                key={tier.id}
                tier={tier}
                delay={i * 0.15}
                visible={isVisible(`price-${tier.id}`)}
                ref={el => registerReveal(el, `price-${tier.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section id="final-cta" className="relative py-36 px-[5%] text-center overflow-hidden" style={{ background: 'var(--color-bta-bg)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(168,255,62,0.08) 0%, transparent 70%)' }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span {...reveal('cta-tag')} ref={reveal('cta-tag').ref} style={reveal('cta-tag').style} className={`block text-[11px] tracking-[0.2em] text-lime uppercase mb-4 ${reveal('cta-tag').className}`}>
            [ READY? ]
          </span>
          <h2 {...reveal('cta-h2')} ref={reveal('cta-h2').ref} style={reveal('cta-h2').style} className={`font-display font-extrabold tracking-tight mb-5 text-[clamp(32px,5vw,64px)] ${reveal('cta-h2').className}`}>
            Ready to Ship<br />with Confidence?
          </h2>
          <p {...reveal('cta-sub')} ref={reveal('cta-sub').ref} style={{ ...reveal('cta-sub').style, transitionDelay: '0.1s' }} className={`text-base text-bta-muted leading-relaxed mb-10 ${reveal('cta-sub').className}`}>
            Join the Beta Tester Army today. Your users deserve flawless — and so does your team.
          </p>
          <a
            href="#"
            {...reveal('cta-btn')}
            ref={reveal('cta-btn').ref}
            style={{ ...reveal('cta-btn').style, transitionDelay: '0.2s' }}
            className={`inline-block bg-lime text-black font-mono text-base tracking-widest uppercase font-medium px-12 py-5 transition-all duration-200 hover:opacity-85 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(168,255,62,0.3)] no-underline ${reveal('cta-btn').className}`}
          >
            Get Started Free
          </a>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="flex items-center justify-between flex-wrap gap-6 px-[5%] py-12" style={{ background: 'var(--color-bta-bg2)', borderTop: '1px solid rgba(168,255,62,0.2)' }}>
        <span className="font-display font-extrabold text-base text-lime tracking-[0.1em]">BETA TESTER ARMY</span>
        <div className="flex gap-7 flex-wrap">
          {['Features', 'Pricing', 'Docs', 'Blog', 'Contact'].map(l => (
            <a key={l} href="#" className="text-xs text-bta-muted tracking-[0.08em] no-underline hover:text-white transition-colors duration-200">{l}</a>
          ))}
        </div>
        <span className="text-[11px]" style={{ color: 'rgba(138,155,176,0.5)' }}>© 2026 Beta Tester Army. All rights reserved.</span>
      </footer>
    </div>
  );
}
