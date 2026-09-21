/* ─────────────────────────────────────────────────────────────────────────
   ABSTREKKT — CANONICAL PROTECTIONS MANIFEST
   Single source of truth for how sensitive memoir material is handled across
   EVERY artifact (archive search, source-map graph, future tools).

   Design principle: protection is STRUCTURAL, not cosmetic.
   - A sealed entry never carries its sensitive text in the first place. The
     data file holds only an evidentiary stub; there is nothing to leak.
   - sealCorpus() enforces this by construction: it stamps the seal, and runs a
     firewall scrub that strips any forbidden identifying token that slipped in.
   - isProtectedQuery() drives the search "machine layer" refusals from here,
     so the rules live in one place instead of scattered inline regexes.

   HONEST LIMITATION: in a static client-side file this is editorial rigor and
   leak-reduction — NOT a security boundary. Anyone with the file can read what
   IS present. The protection is that sealed content is *absent by policy*, and
   that absence is enforced here rather than trusted to memory.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  const M = {
    version: "1.2",
    updated: "2026-07-07",
    maintainer: "Kyle Rosebrook (author) · Abstrekkt",

    /* WHO — protected identities. `policy` decides surfacing behavior. */
    people: {
      kinsley: {
        label: "Kinsley",
        match: /\bkinsley\b|\bdaughter\b/i,
        policy: "absent",            // never a node, never a result, no bio detail
        note: "The memoir's reader and grounding constraint — the letter is addressed to her. A person to honor, not a character to develop. The archive holds no biographical detail and search will not surface any.",
      },
      michael: {
        // matches "Michael" but NOT "Michael Easton" (the clinician is on the record)
        match: /\bmichael\b(?!\s+easton)/i,
        label: "Michael (former partner)",
        policy: "existence-only",    // may appear as evidence-of-existence, no content
        thread: "coercive-control",
        note: "Former partner. Subject of a contemporaneous journal documenting coercive control. Represented as evidentiary existence only — no quotations, no identifying specifics. Distinct from Dr. Michael Easton.",
      },
      mackenzie: {
        match: /\bmackenzie\b/i,
        label: "Mackenzie Campbell",
        policy: "readiness-gated",   // held until author marks the thread ready
        thread: "mackenzie-relationship",
        note: "Met at Rogers. Later connected to a 2021 medical emergency. Full excavation held pending Kyle's readiness.",
      },
      dre: {
        match: /\bdreana\b|\bdre\b/i,
        label: "Dre (co-parent)",
        policy: "existence-only",
        note: "Kinsley's mother and Kyle's co-parent. Named by role only — custody specifics and the allegations context that surface in the sealed journal stay out of every artifact. A third party with a child in the story, protected accordingly.",
      },
      michaelEx: {
        // the ex-husband of the former partner — legal/psychiatric third party
        match: /ex.?husband|michael'?s ex/i,
        label: "The ex-husband",
        policy: "sealed",
        thread: "coercive-control",
        note: "A third party entangled in the coercive-control thread through arrest, violence, and psychiatric crisis. Sealed entirely — no name, no charges, no specifics. Existence acknowledged only where the record demands it.",
      },
    },

    /* WHAT — sealed threads. `state` is author-controlled (held → ready). */
    threads: {
      "coercive-control": {
        label: "Coercive-control journal",
        state: "sealed",            // sealed = never opens in these tools
        public: "Held as evidence of coercive control — existence and evidentiary function only.",
        reason: "Third-party identity + legal-sensitive; kept out of all artifacts by policy.",
      },
      "mackenzie-relationship": {
        label: "Mackenzie thread",
        state: "held",              // held = withheld until marked ready
        public: "A relationship thread from the Rogers period, held pending readiness.",
        reason: "Third-party privacy; excavation timing is the author's to set.",
      },
      "overdose-detail": {
        label: "Overdose / emergency specifics",
        state: "held",
        public: "A 2021 sequence of medical emergencies, stated as evidence of the recursive trap — not narrated for effect.",
        reason: "Scene-level specifics reserved for the manuscript, under author control.",
      },
    },

    /* HOW — global editorial rules every artifact must respect. */
    rules: {
      thirdPartyFirewall: "Kyle's own family and named friends may appear in this PRIVATE working archive under the names his character list uses. What never enters ANY artifact: contact info, addresses, the employer name (permanent boundary — see `employer`), and the specifics of any sealed thread (custody, allegations, charges). Protected individuals in people{} are governed by their own policy. If this archive is ever published or shared beyond Kyle, living private individuals should be reduced to first-name or initials — flag it, do not assume consent.",
      deceased: "People who have died (e.g. lost to overdose or illness) are held with dignity: named, their loss acknowledged as evidence of the cost, never rendered as spectacle or cautionary prop. Cause of death stated plainly, once, without detail.",
      employer: "The employer (Intinc) is never named in any external-facing content — a permanent boundary Kyle set. Colleagues may appear by first name; the workplace stays generic ('a service-desk role').",
      quotable: "Only self-authored lines (Kyle's own poems, songs, session lines) may be quoted verbatim. Everything else is summarized in evidentiary register.",
      confidence: "Confidence mirrors the thesis: 1.0 = documented; lower = recall-based; null = deliberately unscored (memory contradictions, the self).",
      spectacle: "Addiction, overdose, and hospital material is stated soberly as evidence — never dramatized.",
      publishSafe: "A shareable mode, not a rewrite. When ON, every living private individual's full name (First + Last) is reduced to First + last-initial at render time; the working archive keeps full names. Clinicians on the public record (Easton, Creado) and Kyle himself are exempt. LIMITATION: only First+Last pairs are reduced — bare surnames in prose are not, so keep prose to first names. Already-protected people (Kinsley/Michael/Mackenzie/Dre/ex) are governed separately and unaffected.",
    },

    /* Publish-safe name map: full name → de-identified form. Order-independent
       (each is a whole-word replace). Clinicians + Kyle intentionally absent. */
    publishSafeNames: [
      ["Phyllis Rosebrook", "Phyllis R."],
      ["Corey Rosebrook", "Corey R."],
      ["Matt Horne", "Matt H."],
      ["Stephanie Horne", "Stephanie H."],
      ["Tom Ropel", "Tom R."],
      ["Dave Datt", "Dave D."],
      ["Chris Butler", "Chris B."],
      ["Mark Hoppe", "Mark H."],
      ["Ryan Anderskow", "Ryan A."],
    ],

    /* Firewall: tokens that must NEVER appear in a SEALED entry's public text.
       Defense-in-depth — if one slips into the data, sealCorpus scrubs it. */
    forbiddenInSealed: [
      /west allis/i, /\bfour\b/i, /heroin/i, /\bnames?\b\s+withheld/i,
    ],
  };

  /* Is this query aimed at protected material? Returns the stance or null. */
  M.isProtectedQuery = function (q) {
    const s = (q || "").toLowerCase();
    if (!s.trim()) return null;
    if (M.people.kinsley.match.test(s))
      return { key: "kinsley", policy: "absent", text: "Protected. " + M.people.kinsley.note, cites: [] };
    if (M.people.michael.match.test(s))
      return { key: "michael", policy: "existence-only", text: M.people.michael.note, cites: ["PSN-michael"] };
    if (M.people.dre.match.test(s))
      return { key: "dre", policy: "existence-only", text: M.people.dre.note, cites: [] };
    if (M.people.michaelEx.match.test(s))
      return { key: "michaelEx", policy: "sealed", text: M.people.michaelEx.note, cites: [] };
    return null;
  };

  /* Enforce the manifest over a raw corpus. Returns a NEW sealed array. */
  M.sealCorpus = function (corpus) {
    return (corpus || []).map(function (e) {
      const threadKey = e.seal;
      if (!threadKey) return e;
      const th = M.threads[threadKey] || {};
      let text = th.public || e.excerpt || "Sealed by protections policy.";
      // firewall scrub — strip anything forbidden that leaked into a seal
      M.forbiddenInSealed.forEach(function (re) { text = text.replace(re, "▮▮▮"); });
      return Object.assign({}, e, {
        excerpt: text,
        sealed: true,
        redacted: true,
        sealState: th.state || "held",
        sealReason: th.reason || "",
        sealLabel: th.label || threadKey,
      });
    });
  };

  /* Reduce a string to publish-safe form (full names → first + last-initial). */
  M.publishSafe = function (text) {
    if (text == null) return text;
    let out = String(text);
    M.publishSafeNames.forEach(function (pair) {
      const pat = pair[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp("\\b" + pat + "\\b", "g"), pair[1]);
    });
    return out;
  };

  window.ABSTREKKT_PROTECTIONS = M;
})();
