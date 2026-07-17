/**
 * FF App Registry — Patch Script
 * Generated: 2026-05-23
 *
 * USAGE:
 *   1. Open flashfusion-app-registry.html in Chrome
 *   2. Open DevTools → Console
 *   3. Paste this entire script and press Enter
 *   4. Reload the page — all 7 apps will appear, stale data corrected
 *
 * WHAT THIS DOES:
 *   - Adds 7 apps missing from registry (via SK_ADD localStorage key)
 *   - Fixes Fusion AI domain (app.flashfusion.co, not flashfusion.co)
 *   - Clears Tessa stale warning flag
 *   - Marks 2 Lovable stubs as Archived
 */

// ── Storage keys (must match registry constants) ──────────────────────────
const SK     = 'ff_registry_v2';
const SK_ADD = 'ff_registry_added_v2';
const SK_DEL = 'ff_registry_deleted_v2';

// ── 7 NEW APPS ────────────────────────────────────────────────────────────
const newApps = [
  {
    id: '6a02ac1bad2b4e37732ef382',
    name: 'FlashFusion',
    platform: 'Base44',
    lane: 'FlashFusion',
    sub: 'client',
    custom: 'client.flashfusion.co',
    dnsT: 'CNAME',
    dnsN: 'client',
    dnsC: 'base44.onrender.com',
    proxy: true,
    gh: 'flashfusion-client',
    desc: 'Client delivery OS — post-sale project management, onboarding, outcome tracking, and case study capture for FlashFusion consulting engagements.',
    aud: 'FlashFusion clients',
    stack: 'Base44',
    rev: 'Consulting',
    wsjf: 8,
    notes: 'Seeded with demo client chain. Wire Invoke Purchase event → Lead creation here.',
    created: '2026-04-15',
  },
  {
    id: '69d64045d159060e89b95019',
    name: 'Beta Tester Army',
    platform: 'Base44',
    lane: 'FlashFusion',
    sub: '—',
    custom: 'betatestersarmy.com',
    dnsT: 'CNAME',
    dnsN: '@',
    dnsC: 'base44.onrender.com',
    proxy: true,
    gh: 'beta-tester-army',
    desc: 'AI-powered UX testing platform. Persona simulation, agentic browser testing (Browserbase/Playwright), A/B testing, CI/CD integration, accessibility audits, visual regression, and video walkthroughs.',
    aud: 'Product teams',
    stack: 'Base44',
    rev: 'SaaS',
    wsjf: 6,
    notes: '72 entities. Resend from: reports@betatestersarmy.com. NOT a FlashFusion brand asset — independent product.',
    created: '2026-04-20',
  },
  {
    id: '6a10df3add3938c2959fb258',
    name: 'SkySync',
    platform: 'Base44',
    lane: 'Personal',
    sub: '—',
    custom: '',
    dnsT: '—',
    dnsN: '—',
    dnsC: '—',
    proxy: false,
    gh: 'skysync',
    desc: 'Firework show designer. Festive, midnight, and pro modes. FireworkShell designer, multi-track Show timeline, FiringSquad multiplayer sessions, Showcase Gallery.',
    aud: '',
    stack: 'Base44',
    rev: '',
    wsjf: 1,
    notes: '6 entities. Personal creative project.',
    created: '2026-04-25',
  },
  {
    id: '6a112bc61dbbd11731f8cdaf',
    name: 'Migrated from Lovable (Progress Tracker)',
    platform: 'Base44',
    lane: 'Archived',
    sub: '—',
    custom: '',
    dnsT: '—',
    dnsN: '—',
    dnsC: '—',
    proxy: false,
    gh: '',
    desc: 'Lovable migration stub. UserProgress entity only (2 entities). Learning/task progress tracker — likely a scaffolding artifact from Lovable migration.',
    aud: '',
    stack: 'Base44',
    rev: '',
    wsjf: 0,
    notes: 'Archive candidate — 2 entities, stub only. Identify or delete.',
    created: '2026-05-01',
  },
  {
    id: '6a11151c53f6b52067e38894',
    name: 'Migrated from Lovable (Empty)',
    platform: 'Base44',
    lane: 'Archived',
    sub: '—',
    custom: '',
    dnsT: '—',
    dnsN: '—',
    dnsC: '—',
    proxy: false,
    gh: '',
    desc: 'Lovable migration stub. User entity only (1 entity). Empty shell — no schema beyond default User.',
    aud: '',
    stack: 'Base44',
    rev: '',
    wsjf: 0,
    notes: 'Archive candidate — delete unless intentional scaffold.',
    created: '2026-05-01',
  },
  {
    id: '69f43f0643bb023bc2f3025d',
    name: 'Inner-Odyssey',
    platform: 'Base44',
    lane: 'Personal',
    sub: '—',
    custom: '',
    dnsT: '—',
    dnsN: '—',
    dnsC: '—',
    proxy: false,
    gh: 'inner-odyssey',
    desc: '[GENERATED] Personal reflective journaling or self-development app.',
    aud: '',
    stack: 'Base44',
    rev: '',
    wsjf: 0,
    notes: 'Schema not audited — verify purpose before assigning lane.',
    created: '2026-05-02',
  },
  {
    id: '69f6549bc82b9bbc8cac2f6d',
    name: 'FlowState',
    platform: 'Base44',
    lane: 'Personal',
    sub: '—',
    custom: '',
    dnsT: '—',
    dnsN: '—',
    dnsC: '—',
    proxy: false,
    gh: 'flowstate',
    desc: '[GENERATED] Personal productivity or focus/flow management app.',
    aud: '',
    stack: 'Base44',
    rev: '',
    wsjf: 0,
    notes: 'Schema not audited — verify purpose before assigning lane.',
    created: '2026-05-03',
  },
];

// ── APPLY: add new apps ───────────────────────────────────────────────────
const existing = JSON.parse(localStorage.getItem(SK_ADD) || '[]');
const existingIds = new Set(existing.map(a => a.id));
const toAdd = newApps.filter(a => !existingIds.has(a.id));
const merged = [...existing, ...toAdd];
localStorage.setItem(SK_ADD, JSON.stringify(merged));
console.log(`✓ Added ${toAdd.length} new apps to registry`);

// ── APPLY: fix stale records in saved state ────────────────────────────────
const saved = JSON.parse(localStorage.getItem(SK) || '[]');
let patchCount = 0;

saved.forEach(app => {
  // Fix Fusion AI domain
  if (app.id === '68dd8e79ca073475565c8e16') {
    app.custom = 'app.flashfusion.co';
    app.notes = (app.notes || '').replace('Register flashfusion.co in Base44.', '').trim()
      + ' Domain corrected to app.flashfusion.co — flashfusion.co freed for landing page.';
    patchCount++;
  }
  // Clear Tessa warning
  if (app.id === '69b6f0ff7b33fdefbbb4148f') {
    app.notes = (app.notes || '').replace('⚠ Not in Base44 app listing — possible duplicate of TESSA. Verify before DNS provisioning.', '').trim()
      + ' Confirmed live. 2-entity kanban app (KanbanProject). Separate from TESSA (68f83f5bde8a37c8491aec1f).';
    patchCount++;
  }
  // Flag spark.flashfusion.co conflict
  if (app.id === '69f5480fb2b733d922d915ff') {
    app.notes = (app.notes || '') + ' ⚠ spark.flashfusion.co DNS conflict with SparkAcademy (69180d077a5cbed7242f90ab). Repoint DNS to SparkAcademy.';
    patchCount++;
  }
});

if (saved.length) {
  localStorage.setItem(SK, JSON.stringify(saved));
}
console.log(`✓ Patched ${patchCount} stale records`);

// ── SUMMARY ───────────────────────────────────────────────────────────────
console.log('\n=== FF REGISTRY PATCH COMPLETE ===');
console.log(`New apps added: ${toAdd.length}`);
console.log(`Records patched: ${patchCount}`);
console.log('Reload the page to see changes.');
toAdd.forEach(a => console.log(`  + ${a.name} (${a.id})`));
