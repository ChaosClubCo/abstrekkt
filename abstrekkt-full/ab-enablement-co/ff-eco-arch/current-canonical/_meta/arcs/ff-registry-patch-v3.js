/* ============================================================
   FF App Registry — Patch Script v3
   Generated: 2026-06-01
   Source-of-truth: Base44 list_user_apps + list_entity_schemas (49 apps)
   ------------------------------------------------------------
   USAGE:
     1. Open flashfusion-app-registry.html in your browser
     2. DevTools → Console → paste this whole block → Enter
     3. Reload the page

   CHANGES vs v2:
     - FIX: 6a112bc6 record corrected. Live Base44 says this app is
       "Vibecode-Workshop" (UserProgress schema), NOT a Lovable
       migration stub. v2 had stale name/lane/notes.
     - HARDEN B1: writes to SK only happen when patches actually
       applied (was: wrote whenever array was non-empty, which could
       round-trip corrupt or re-shaped data back to storage).
     - HARDEN B3: warns when a patch-target id isn't found in SK —
       it likely lives in SK_ADD instead, which the original silently
       ignored.
     - HARDEN: corrupt-JSON guard on every read.
   ============================================================ */

(function ffRegistryPatchV3() {
  const SK     = 'ff_registry_v2';
  const SK_ADD = 'ff_registry_added_v2';
  const SK_DEL = 'ff_registry_deleted_v2'; // unused, reserved

  const readArr = (k) => {
    try { return JSON.parse(localStorage.getItem(k) || '[]'); }
    catch (e) { console.error(`[ff-patch] corrupt ${k} — skipping write to it`, e); return null; }
  };

  // ---------- 7 NEW APPS (added via SK_ADD bucket) ----------
  const newApps = [
    // (Keep your v2 newApps array here unchanged — 7 records.)
    // The original 7 from v2 were verified against Base44 list_user_apps
    // and are correct. Paste them in place of this comment.
  ];

  // ---------- IDEMPOTENT ADD ----------
  const added = readArr(SK_ADD);
  if (added === null) { console.error('[ff-patch] aborting: SK_ADD unreadable'); return; }

  const existingIds = new Set(added.map(a => a && a.id).filter(Boolean));
  let addedCount = 0;
  newApps.forEach(app => {
    if (!existingIds.has(app.id)) { added.push(app); existingIds.add(app.id); addedCount++; }
  });
  if (addedCount > 0) {
    localStorage.setItem(SK_ADD, JSON.stringify(added));
    console.log(`[ff-patch] added ${addedCount} new app(s) to ${SK_ADD}`);
  } else {
    console.log('[ff-patch] no new apps to add (all already present)');
  }

  // ---------- PATCH 3 EXISTING RECORDS ----------
  // Targets (verified Base44 ids):
  //   68dd8e79ca073475565c8e16  Fusion AI
  //   69b6f0ff7b33fdefbbb4148f  Tessa  (KanbanProject schema)
  //   69f5480fb2b733d922d915ff  Studio Spark
  // Plus the one corrected record:
  //   6a112bc61dbbd11731f8cdaf  Vibecode-Workshop (was mis-labeled in v2)
  const wantPatch = new Set([
    '68dd8e79ca073475565c8e16',
    '69b6f0ff7b33fdefbbb4148f',
    '69f5480fb2b733d922d915ff',
    '6a112bc61dbbd11731f8cdaf',
  ]);

  const PATCHES = {
    '68dd8e79ca073475565c8e16': { /* your v2 Fusion AI patch fields here */ },
    '69b6f0ff7b33fdefbbb4148f': { /* your v2 Tessa patch fields here */ },
    '69f5480fb2b733d922d915ff': { /* your v2 Studio Spark patch fields here */ },
    '6a112bc61dbbd11731f8cdaf': {
      name: 'Vibecode-Workshop',
      platform: 'Base44',
      lane: 'Personal',
      sub: '—', custom: '', dnsT: '—', dnsN: '—', dnsC: '—', proxy: false,
      gh: 'vibecode-standard-app',
      desc: 'Vibecode-Workshop. Minimal schema so far: UserProgress (user_email, completed_tasks[]) + User. Task/progress tracker — early scaffold.',
      aud: '', stack: 'Base44', rev: '', wsjf: 1,
      notes: 'Renamed from a Lovable migration stub. Schema still minimal; confirm intended scope.',
      created: '2026-05-01',
    },
  };

  const saved = readArr(SK);
  if (saved === null) { console.error('[ff-patch] aborting: SK unreadable'); return; }

  const found = new Set();
  let patched = 0;
  saved.forEach(app => {
    if (app && wantPatch.has(app.id)) {
      Object.assign(app, PATCHES[app.id]);
      found.add(app.id);
      patched++;
    }
  });

  if (patched > 0) {
    localStorage.setItem(SK, JSON.stringify(saved));
    console.log(`[ff-patch] patched ${patched} record(s) in ${SK}`);
  } else {
    console.log(`[ff-patch] no patches applied to ${SK}`);
  }

  // B3: surface targets that weren't in SK — they likely live in SK_ADD,
  // which the original script silently skipped.
  const missing = [...wantPatch].filter(id => !found.has(id));
  if (missing.length) {
    console.warn(
      `[ff-patch] ${missing.length} patch target(s) not found in ${SK}. ` +
      `Check ${SK_ADD} — they may have been added rather than seeded:`,
      missing
    );
  }

  console.log('[ff-patch] done. Reload the page to see changes.');
})();
