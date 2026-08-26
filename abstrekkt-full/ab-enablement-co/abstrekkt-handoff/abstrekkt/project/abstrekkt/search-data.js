/* Abstrekkt archive — search corpus.
   Real memoir source material for Kyle Rosebrook's "Construction, Not Recovery."
   Grounded in the Clinical Evidence Board, Primary Source Archive, and verified timeline.

   PROTECTIONS (enforced in the data itself):
   - Kinsley appears only as the letter's reader / grounding frame — no biographical detail.
   - The Michael relationship journal appears as evidence-of-existence only — no quotations,
     no intimate specifics. (This Michael = the former partner, distinct from Dr. Michael Easton.)
   - Overdose / hospital material is stated soberly and marked redacted — evidence, never spectacle.
   confidence mirrors the thesis: 1.0 = documented; lower = recall-based and unreliable by design;
   null = deliberately unscored. */
window.ABSTREKKT_CORPUS = [
  // ---- CLINICAL DOCUMENTS ----
  { id: "Rosebrook_K_Eval", type: "document", title: "History & Final Evaluation",
    excerpt: "15-page clinical evaluation, Amen Clinics Chicago. Chief complaint at intake, two words: “Addiction, depression.” Diagnoses include R94.02 abnormal brain scan and evidence of past brain injury and encephalopathic process.",
    date: "2022-08-02", place: "Amen Clinics, Chicago", tags: ["clinical","spect","brain-injury","verified"],
    meta: { source: "Scanned PDF · Dr. Michael Easton", confidence: 1.0, pages: 15 }, redacted: false, media: null },
  { id: "SPECT-concentration", type: "media", title: "SPECT — concentration study",
    excerpt: "99mTc-HMPAO tracer captured during a task. Surface renders show decreased perfusion across temporal, prefrontal, parietal and occipital cortex; the thalamus runs severely hot. Scalloping consistent with toxic exposure and anoxia.",
    date: "2022-07-07", place: "Amen Clinics, Chicago", tags: ["spect","scan","perfusion","verified"],
    meta: { source: "SPECT render", confidence: 1.0, views: 4 }, redacted: false, media: "photo" },
  { id: "SPECT-baseline", type: "media", title: "SPECT — baseline study (at rest)",
    excerpt: "The resting scan, four days after the concentration study. Decreased perfusion worse at rest across most affected regions — the gaps the external systems were later built to bridge.",
    date: "2022-07-11", place: "Amen Clinics, Chicago", tags: ["spect","scan","at-rest","verified"],
    meta: { source: "SPECT render", confidence: 1.0, views: 4 }, redacted: false, media: "photo" },
  { id: "rosebrook_k_tbr_7-7-2022", type: "document", title: "Total Brain / WebNeuro assessment",
    excerpt: "Cognitive battery. Processing speed 99th percentile against recall memory 12th; flexibility 17th, resilience 2nd; readiness-to-change a maximum 10/10 against a “slight” hope score. The thesis in two data points.",
    date: "2022-07-07", place: "Amen Clinics, Chicago", tags: ["cognitive","processing-speed","recall","verified"],
    meta: { source: "Scanned PDF", confidence: 1.0, pages: 6 }, redacted: false, media: null },
  { id: "RosebrookK_CPT_20220707", type: "document", title: "Conners CPT3 — attention test",
    excerpt: "Computerized attention/impulsivity test found no pervasive ADHD pattern despite years of prior diagnosis — only “some indication” of sustained-attention difficulty. The attention problem reads as downstream of the injury, not classical ADHD.",
    date: "2022-07-07", place: "Amen Clinics, Chicago", tags: ["cognitive","attention","adhd","verified"],
    meta: { source: "Scanned PDF", confidence: 1.0, pages: 3 }, redacted: false, media: null },
  { id: "MyBrain", type: "media", title: "Brand-color renders of the SPECT data",
    excerpt: "Kyle's own reframing of the clinical imaging as personal-branding renders. When and why he chose to translate a perfusion map into design language is itself an open question in the archive.",
    date: "date TBD", place: "—", tags: ["render","design","self-authored"],
    meta: { source: "Created by Kyle", confidence: 0.6, links: 1 }, redacted: false, media: "photo" },

  // ---- THE DISPUTED RECORD ----
  { id: "eval-date-contradiction", type: "document", title: "The document's own contradiction",
    excerpt: "Page 2 of the evaluation dates the hypoxia event to “summer of 2020.” Page 3 and the physician section say “October 2021.” The Rogers admission note resolves it — early June 2020 — but the eval never does: the record that proves memory is broken cannot keep its own timeline straight. It stays unresolved on purpose. The book in a single exhibit.",
    date: "2022 (dates disputed)", place: "within Rosebrook_K_Eval", tags: ["contradiction","timeline","memory","redacted"],
    meta: { source: "Cross-page finding", confidence: null, pages: 2 }, redacted: true, media: null },
  { id: "PD-20-004270", type: "document", title: "Incident report 20-004270",
    excerpt: "February 3, 2020: found unresponsive behind the wheel, engine running, brake still held. The blood panel returned alprazolam and — though Kyle told officers he used no illegal drug — morphine at 15 ng/mL. That number sits two years ahead of the eval's own account of when hard drugs began. A record that indicts the timeline and the memory at once.",
    date: "2020-02-03", place: "West Allis, WI", tags: ["legal","toxicology","contradiction","redacted"],
    meta: { source: "Police report + State Lab of Hygiene", confidence: 1.0, pages: 1 }, redacted: true, media: null },
  { id: "onset-19-or-21", type: "moment", title: "Nineteen. Or twenty-one.",
    excerpt: "Whether dependency began at 19 or 21 cannot be cleanly pinned. The uncertainty is not smoothed over — recall memory measured at the 12th percentile, and the archive holds the question open on purpose.",
    date: "onset window disputed", place: "—", tags: ["memory","timeline","unresolved"],
    meta: { source: "Recall — unreliable by design", confidence: null, words: 0 }, redacted: false, media: null },

  // ---- PEOPLE ----
  { id: "PSN-kyle", type: "person", title: "Kyle Rosebrook",
    excerpt: "Author and subject. Self-taught. In July 2022: bartender, 36, living with parents. By 2026: L1 service-desk technician, ~30 tools used hands-on, a literary memoir in progress. Reliability deliberately left unscored.",
    date: "narrator / present", place: "Wisconsin", tags: ["self","compiler","subject"],
    meta: { source: "Cross-ref · all entries", confidence: null, links: 258 }, redacted: false, media: "portrait" },
  { id: "PSN-easton", type: "person", title: "Dr. Michael Easton",
    excerpt: "Amen Clinics physician. Conducted the evaluation review on August 2, 2022 — the results Kyle received weeks late and had already forgotten. Author of the physician section of the eval.",
    date: "2022", place: "Amen Clinics, Chicago", tags: ["clinician","evidence"],
    meta: { source: "Rosebrook_K_Eval", confidence: 1.0, links: 4 }, redacted: false, media: "portrait" },
  { id: "PSN-creado", type: "person", title: "Dr. Shane Creado",
    excerpt: "Psychiatry, sleep medicine. Wrote the Phase 1/2/3 treatment plan, ordered the home sleep test, signed off on the SPECT study parameters.",
    date: "2022", place: "Amen Clinics, Chicago", tags: ["clinician","sleep","treatment"],
    meta: { source: "HomeSleepTestReferral", confidence: 1.0, links: 2 }, redacted: false, media: "portrait" },
  { id: "PSN-mackenzie", type: "person", title: "Mackenzie Campbell",
    excerpt: "Held pending readiness.", seal: "mackenzie-relationship",
    date: "2020–2021", place: "Rogers", tags: ["rogers","protected","pending"],
    meta: { source: "Recall · excavation pending", confidence: 0.5, links: 3 }, redacted: true, media: "portrait" },
  { id: "PSN-bear", type: "person", title: "Soaring Bear",
    excerpt: "Life coach / spiritual mentor met around Sedona. Sent mentorship assignments through FlashFusion's own ticket system — Kyle's own tool becoming part of his healing infrastructure.",
    date: "2025", place: "Sedona, AZ", tags: ["mentor","sedona","healing"],
    meta: { source: "Email correspondence", confidence: 0.9, links: 2 }, redacted: false, media: "portrait" },
  { id: "PSN-michael", type: "person", title: "Michael (former partner)",
    excerpt: "Evidentiary existence only.", seal: "coercive-control",
    date: "relationship period", place: "—", tags: ["protected","coercive-control","evidence"],
    meta: { source: "Primary Source Archive §1", confidence: null, links: 1 }, redacted: true, media: "portrait" },
  { id: "PSN-michael-ex", type: "person", title: "The ex-husband",
    excerpt: "Sealed.", seal: "coercive-control",
    date: "—", place: "—", tags: ["protected","sealed","legal"],
    meta: { source: "Sealed by policy", confidence: null, links: 1 }, redacted: true, media: "portrait" },

  // family
  { id: "PSN-phyllis", type: "person", title: "Phyllis Rosebrook",
    excerpt: "Kyle's mother — the one who kept reaching when he'd stopped reaching back. Found him after the 2020 overdose; later arranged the Sedona lifeline that became the Soaring Bear mentorship. Present at the hospital bed in 2021. Documented across the clinical records as referral source.",
    date: "present", place: "family", tags: ["family","mother","lifeline","verified"],
    meta: { source: "Amen eval + Rogers records", confidence: 1.0, links: 6 }, redacted: false, media: "portrait" },
  { id: "PSN-dad", type: "person", title: "Kyle's father",
    excerpt: "Unnamed in the clinical records. Present at the hospital bed after the 2021 overdose — the character archive notes he wouldn't look at him. Part of the childhood pattern the archive has barely excavated.",
    date: "present", place: "family", tags: ["family","father","void"],
    meta: { source: "Amen eval (unnamed) + recall", confidence: 0.7, links: 2 }, redacted: false, media: "portrait" },
  { id: "PSN-corey", type: "person", title: "Corey Rosebrook",
    excerpt: "Kyle's older brother, named in the Amen evaluation. Largely a background figure so far — a documented relation with almost no excavated scenes. Another gap where family should be.",
    date: "—", place: "family", tags: ["family","brother","background"],
    meta: { source: "Amen eval", confidence: 0.9, links: 1 }, redacted: false, media: "portrait" },

  // the five (settlement-money crew)
  { id: "PSN-matt", type: "person", title: "Matt Horne",
    excerpt: "One of the settlement-money crew — “the Five.” Married, a father now. Came when Kyle reached out after years of silence. One of the survivors of the group.",
    date: "—", place: "the Five", tags: ["the-five","friend","survivor"],
    meta: { source: "Recall + photograph", confidence: 0.75, links: 2 }, redacted: false, media: "portrait" },
  { id: "PSN-stephanie", type: "person", title: "Stephanie Horne",
    excerpt: "Married to Matt; the one behind the camera in both eras — she took the crew's Trump Tower photograph and was there again at the recent reunion. The photographer of then and now.",
    date: "—", place: "the Five", tags: ["the-five","photographer"],
    meta: { source: "Recall + photograph", confidence: 0.7, links: 1 }, redacted: false, media: "portrait" },
  { id: "PSN-tom", type: "person", title: "Tom Ropel",
    excerpt: "Best friend from before the break — flagged in the archive as “an entire chapter by itself,” and still largely unexcavated. Married with kids; came to the reunion. One of the deepest threads not yet written.",
    date: "—", place: "the Five", tags: ["the-five","friend","not-excavated"],
    meta: { source: "Recall — flagged for excavation", confidence: 0.6, links: 1 }, redacted: false, media: "portrait" },
  { id: "PSN-dave", type: "person", title: "Dave Datt",
    excerpt: "One of the crew, lost young to a brain aneurysm; Kyle attended the funeral. His memory later placed Dave in the Trump Tower photograph — except Dave was abroad that year and never in the frame. The archive keeps both: the friend, and the false memory of him.",
    date: "died young", place: "the Five", tags: ["the-five","deceased","memory","recall"],
    meta: { source: "Recall — memory error preserved", confidence: 0.55, links: 2 }, redacted: false, media: "portrait" },
  { id: "PSN-ryan", type: "person", title: "Ryan",
    excerpt: "One of the crew, forgotten until the act of counting forced his retrieval — a memory surfacing under load. Now a counselor. Kyle reached out once; nothing came back. The friendship faded a decade ago.",
    date: "—", place: "the Five", tags: ["the-five","friend","memory","recall"],
    meta: { source: "Recall — retrieved under load", confidence: 0.5, links: 1 }, redacted: false, media: "portrait" },
  { id: "PSN-ryan-grandma", type: "person", title: "Ryan's grandmother",
    excerpt: "A blue kitchen full of candles, plants, and furniture protectors; a single sofa angled for one. She paid a teenage Kyle in rice-and-beef empanadas for cleaning her gutters. One of the archive's most vivid surviving scenes.",
    date: "youth", place: "—", tags: ["scene","sensory","youth"],
    meta: { source: "Recall — sensory intact", confidence: 0.65, links: 1 }, redacted: false, media: "portrait" },

  // treatment / work
  { id: "PSN-john", type: "person", title: "John of Herrington",
    excerpt: "President of Herrington, a treatment setting in the 2020 sequence. Soft-spoken; ran bonfire meetings; offered a letter of recommendation. Kyle's line for him: “you made hell a little softer and easier to swallow.”",
    date: "2020", place: "Herrington", tags: ["treatment","mentor","2020"],
    meta: { source: "Recall + session material", confidence: 0.7, links: 1 }, redacted: false, media: "portrait" },
  { id: "PSN-pete", type: "person", title: "Pete",
    excerpt: "Salvation Army roommate, then a construction-work partner. Relapsed, overdosed, and died. Held here as evidence of what the loop costs the people inside it — named, not narrated for effect.",
    date: "—", place: "Milwaukee", tags: ["addiction","deceased","the-loop"],
    meta: { source: "Recall", confidence: 0.5, links: 1 }, redacted: false, media: "portrait" },
  { id: "PSN-nicole", type: "person", title: "Nicole (colleague)",
    excerpt: "A colleague in Kyle's service-desk role (employer withheld by his own standing rule). The person on the other side of the workplace disclosure — the 23-minute hesitation before the call, and the line that came out of it: “I'm not broken. My brain routes differently.”",
    date: "present", place: "work", tags: ["work","disclosure","self-authored"],
    meta: { source: "Recall", confidence: 0.7, links: 1 }, redacted: false, media: "portrait" },

  // business lane — flagged non-memoir; present for completeness, filter by tag
  { id: "PSN-kelan", type: "person", title: "Kelan",
    excerpt: "A co-founder candidate from the venture side of Kyle's life. Business lane — not memoir material. Catalogued so the archive is complete, not because the book needs him.",
    date: "—", place: "business", tags: ["business","non-memoir","founder"],
    meta: { source: "Contact record", confidence: 0.8, links: 0 }, redacted: false, media: "portrait" },
  { id: "PSN-butler", type: "person", title: "Chris Butler",
    excerpt: "A strictly-business contact. No memoir role — kept in the archive for completeness and clearly tagged out of the narrative.",
    date: "—", place: "business", tags: ["business","non-memoir"],
    meta: { source: "Contact record", confidence: 0.8, links: 0 }, redacted: false, media: "portrait" },
  { id: "PSN-hoppe", type: "person", title: "Mark Hoppe",
    excerpt: "A business-lane contact. Non-memoir; present only so the cast list is exhaustive.",
    date: "—", place: "business", tags: ["business","non-memoir"],
    meta: { source: "Contact record", confidence: 0.8, links: 0 }, redacted: false, media: "portrait" },
  { id: "PSN-anderskow", type: "person", title: "Ryan Anderskow",
    excerpt: "A business contact (distinct from Ryan of the Five). No narrative role — catalogued and tagged out of the memoir.",
    date: "—", place: "business", tags: ["business","non-memoir"],
    meta: { source: "Contact record", confidence: 0.8, links: 0 }, redacted: false, media: "portrait" },

  // ---- MOMENTS ----
  { id: "MNT-king", type: "moment", title: "“Among the living dead, I was king.”",
    excerpt: "Rogers Behavioral Health, ~six weeks residential. Model resident — organizing tournaments, leading groups, top privilege level in a week. Kyle's own line about that summer.",
    date: "2020", place: "Rogers Behavioral Health", tags: ["rogers","residential","quote"],
    meta: { source: "Session material, Apr 2026", confidence: 0.8, words: 0 }, redacted: false, media: null },
  { id: "MNT-forgotten-results", type: "moment", title: "The results that didn't register",
    excerpt: "The August 2, 2022 review with Dr. Easton — except the results arrived weeks later and had already been forgotten. The scan that proves memory damage was itself forgotten. Possibly the book's most important non-scene.",
    date: "2022-08-02", place: "—", tags: ["memory","evidence","non-scene"],
    meta: { source: "Recall + eval", confidence: 0.7, words: 0 }, redacted: false, media: null },
  { id: "VOID-childhood", type: "moment", title: "The missing childhood",
    excerpt: "Before O'Toole's, before the tools, the archive holds almost nothing — no excavated childhood scenes, no people beyond family. The one line that survives: “never exceptional at anything, choices always corrected — and I'm terrified to find out I'm not good at this either.” The absence is itself evidence.",
    date: "pre-2016", place: "—", tags: ["pre-injury","void","memory"],
    meta: { source: "Character archive — flagged VOID", confidence: null, words: 0 }, redacted: false, media: null },
  { id: "MNT-window-girl", type: "moment", title: "The window girl at O'Toole's",
    excerpt: "A resident from the Rogers back hallway turned up years later as a bar customer — and didn't remember him. The man with 12th-percentile recall remembers her; she doesn't remember him.",
    date: "~2022", place: "Timothy O'Tool's", tags: ["otooles","memory","recall"],
    meta: { source: "Recall", confidence: 0.55, words: 0 }, redacted: false, media: null },
  { id: "MNT-2021-emergencies", type: "moment", title: "2021 — medical emergencies",
    excerpt: "Held — stated as evidence, not scene.", seal: "overdose-detail",
    date: "2021", place: "—", tags: ["addiction","the-loop","redacted"],
    meta: { source: "Recall + eval (1 formally recorded)", confidence: 0.6, words: 0 }, redacted: true, media: null },
  { id: "MNT-trump-tower", type: "moment", title: "The Trump Tower photograph",
    excerpt: "A photograph of the crew from the settlement-money years — one friend in an all-black suit at the left, another at the right, shot by Stephanie. Kyle's memory inserts a fourth who wasn't there. A then-image the present keeps correcting.",
    date: "settlement years", place: "Chicago", tags: ["the-five","photo","memory","then-and-now"],
    meta: { source: "Photograph + recall", confidence: 0.7, links: 3 }, redacted: false, media: "photo" },
  { id: "MNT-reunion", type: "moment", title: "The reunion",
    excerpt: "Years after the crew scattered, Kyle reached out to old friends “out of the blue.” They came — Matt with his family, Tom with his firstborn — to a family gathering. The diagnostic instinct turned, for once, toward repair.",
    date: "recent", place: "—", tags: ["the-five","reunion","repair"],
    meta: { source: "Recall", confidence: 0.7, links: 2 }, redacted: false, media: null },
  { id: "MNT-couch", type: "moment", title: "“You don't have to.”",
    excerpt: "The first time. Someone on a couch said the exact words that opened the door — permission, not pressure. Whether the couch is remembered or reconstructed is itself unresolved; the sentence is the hinge the whole loop turns on.",
    date: "pre-injury", place: "—", tags: ["addiction","origin","the-loop","unresolved"],
    meta: { source: "Recall — factual status unknown", confidence: null, words: 0 }, redacted: false, media: null },

  // ---- MEDIA: songs & poems ----
  { id: "POE-america", type: "media", title: "“America” — poem",
    excerpt: "A printed, largely clean poem with minor handwritten annotation — one of the more finished pieces in the archive. Political-historical register, distinct from the raw confessional songs.",
    date: "undated", place: "Primary Source Archive §2", tags: ["poem","printed","finished"],
    meta: { source: "Printed page", confidence: 0.9, links: 1 }, redacted: false, media: "audio" },
  { id: "MED-annotated-songs", type: "media", title: "Annotated rap / spoken-word pages",
    excerpt: "Printed lyrics carrying dense handwritten margin notes and timing marks — “LOVE SEEDS,” “IN CONTEXT,” circled sections. The revision layer is part of the evidence: the mind editing itself on the page.",
    date: "undated", place: "Primary Source Archive §2", tags: ["song","annotation","revision"],
    meta: { source: "Printed, annotated", confidence: 0.85, links: 4 }, redacted: false, media: "audio" },

  // ---- WORKSHEETS ----
  { id: "WKS-cbt", type: "document", title: "CBT thought record",
    excerpt: "A printed cognitive-behavioral worksheet with handwritten entries — situation, feelings, automatic thoughts, balanced thoughts. Physical evidence of the scaffolding used before the digital external-cognition systems.",
    date: "undated", place: "Primary Source Archive §4", tags: ["worksheet","cbt","scaffolding"],
    meta: { source: "Printed worksheet", confidence: 0.85, pages: 1 }, redacted: false, media: null },

  // ---- LOCATIONS ----
  { id: "LOC-amen", type: "location", title: "Amen Clinics, Chicago",
    excerpt: "Where the SPECT scans and cognitive battery were taken in July 2022. Kyle's mother, Phyllis, found the clinic; he would not have found it himself. The place the damage became visible.",
    date: "2022", place: "Chicago, IL", tags: ["clinic","spect","evidence"],
    meta: { source: "Registry + eval", confidence: 1.0, photos: 0 }, redacted: false, media: "map" },
  { id: "LOC-rogers", type: "location", title: "Rogers Behavioral Health",
    excerpt: "Five separate admissions across 2020–2021 — 159 documented days over thirteen months, from inpatient through residential, PHP, and IOP. Beautiful grounds, a lake, daily counselor walks, a privilege-level system Kyle topped in a week. Where he met Mackenzie Campbell and John of Herrington.",
    date: "2020–2021", place: "Wisconsin", tags: ["residential","recovery","verified"],
    meta: { source: "Rogers verification letter, 2024", confidence: 1.0, photos: 0 }, redacted: false, media: "map" },
  { id: "LOC-otooles", type: "location", title: "Timothy O'Tool's",
    excerpt: "The bartending years, roughly October 2021 to March 2025 — five miles walked a shift, the diagnostic instinct reading rooms under live pressure. They never knew about the heroin.",
    date: "2021–2025", place: "Wisconsin", tags: ["hospitality","diagnostic-instinct"],
    meta: { source: "Recall", confidence: 0.6, photos: 0 }, redacted: false, media: "map" },
  { id: "LOC-sedona", type: "location", title: "Sedona",
    excerpt: "The trip that informed Chaos Club Co.'s crisis protocols — the ones designed to “connect rather than save.” Where the Soaring Bear mentorship began.",
    date: "2025", place: "Sedona, AZ", tags: ["sedona","chaos-club","turning-point"],
    meta: { source: "Recall + correspondence", confidence: 0.7, photos: 0 }, redacted: false, media: "map" },
];

/* Enforce the canonical protections manifest STRUCTURALLY over the corpus.
   Sealed entries carry only an evidentiary stub; sealCorpus stamps + firewalls them. */
if (window.ABSTREKKT_PROTECTIONS) {
  window.ABSTREKKT_CORPUS = window.ABSTREKKT_PROTECTIONS.sealCorpus(window.ABSTREKKT_CORPUS);
}

/* AI synthesis layer (blueprint-blue "machine layer"). Cites real entry IDs.
   Protected intents return the guardrail stance instead of content. */
window.ABSTREKKT_SYNTH = function (q) {
  const s = (q || "").toLowerCase();
  if (!s.trim()) return null;

  // --- protected queries: driven by the canonical manifest, not inline rules ---
  const P = window.ABSTREKKT_PROTECTIONS;
  if (P) {
    const stance = P.isProtectedQuery(q);
    if (stance) return { text: stance.text, cites: stance.cites, protectedQ: true };
  }

  // --- thesis / content intents ---
  if (/memory|recall|forget|date|timeline|19|21/.test(s)) return { text: "Memory is unreliable by design. The eval dates the hypoxia event to both “summer 2020” (p.2) and “October 2021” (p.3); dependency onset sits at 19 or 21; recall tested at the 12th percentile. The archive holds these open rather than resolving them — the uncertainty is the subject.", cites: ["eval-date-contradiction","onset-19-or-21","rosebrook_k_tbr_7-7-2022"] };
  if (/scan|spect|brain|perfusion|injury|thalamus/.test(s)) return { text: "Two July 2022 SPECT scans (99mTc-HMPAO) show decreased perfusion across temporal, prefrontal, parietal and occipital cortex and cerebellum, with a thalamus running hot — read as past brain injury and encephalopathic process. Kyle later reframed the imaging as brand-color renders.", cites: ["SPECT-concentration","SPECT-baseline","Rosebrook_K_Eval","MyBrain"] };
  if (/processing|split|99|12|cognitive|speed/.test(s)) return { text: "The cognitive battery holds the thesis in two data points: processing speed 99th percentile against recall memory 12th. An elite engine, nearly empty storage — which is why the diagnostic instinct survives while memory fails, and why external systems become prosthetic recall.", cites: ["rosebrook_k_tbr_7-7-2022","RosebrookK_CPT_20220707"] };
  if (/instinct|room|read|pattern|diagnostic/.test(s)) return { text: "The diagnostic instinct — reading rooms, systems, and failures before they're named — is the one faculty the injury left intact. It transfers substrate to substrate: the bar at O'Toole's, quality control, engineering, the manuscript. Input changes; the processing doesn't.", cites: ["MNT-window-girl","LOC-otooles","VOID-childhood"] };
  if (/arrest|morphine|police|owi|2020|toxicolog/.test(s)) return { text: "The February 2020 arrest is the archive's hardest exhibit against a clean story: found unresponsive at the wheel, the blood panel returned morphine at 15 ng/mL while Kyle denied all illegal drug use — two years before the eval dates hard drugs beginning. It is kept as evidence, soberly, contradiction intact.", cites: ["PD-20-004270","eval-date-contradiction"] };
  if (/rogers|residential|king|mackenzie/.test(s)) return { text: "Rogers Behavioral Health, ~six weeks residential in 2020: model resident — “among the living dead, I was king.” Where Kyle met Mackenzie Campbell, whose thread is held pending his readiness.", cites: ["LOC-rogers","MNT-king","PSN-mackenzie"] };
  if (/chaos|sedona|bear|platform/.test(s)) return { text: "Chaos Club Co. applies the memoir's philosophy — chaos organized, not erased. Its crisis protocols “connect rather than save,” informed by the Sedona trip and the Soaring Bear mentorship that arrived, fittingly, through Kyle's own ticketing tool.", cites: ["LOC-sedona","PSN-bear"] };
  if (/overdose|heroin|addiction|loop/.test(s)) return { text: "The addiction caused the brain injury, and the injury made escape harder — a recursive trap visible on the scan. 2021 held multiple overdoses; the record formally logs one, Kyle discloses four. Stated as evidence, not spectacle; the rest is held pending readiness.", cites: ["MNT-2021-emergencies","Rosebrook_K_Eval"] };
  if (/mother|\bmom\b|phyllis|family|brother|corey|father|\bdad\b|parent/.test(s)) return { text: "Family is where the archive is thinnest and most load-bearing. Phyllis — the mother who kept reaching when Kyle had stopped — is documented across the records; the father and brother appear but are barely excavated. The childhood behind them is a near-total void.", cites: ["PSN-phyllis","PSN-dad","PSN-corey","VOID-childhood"] };
  if (/friend|crew|the five|\bmatt\b|\btom\b|\bryan\b|photo|reunion/.test(s)) return { text: "“The Five” — the settlement-money crew — are the archive's clearest picture of before. Matt and Tom survived and returned when Kyle reached out; the Trump Tower photograph is also a memory test, since Kyle recalls a fourth friend in a frame he was never in.", cites: ["MNT-trump-tower","PSN-matt","PSN-tom","PSN-dave","MNT-reunion"] };
  if (/died|death|\blost\b|\bpete\b|\bdave\b|aneurysm|funeral|gone/.test(s)) return { text: "The cost is counted in people, not just scans. Dave was lost young to an aneurysm; Pete relapsed and overdosed. They are named and held with dignity — evidence of what the loop takes, never rendered as cautionary spectacle.", cites: ["PSN-dave","PSN-pete"] };
  if (/business|founder|venture|kelan|butler|hoppe|anderskow/.test(s)) return { text: "These are business-lane contacts, deliberately outside the memoir. They're catalogued for completeness and tagged ‘non-memoir’ so they never bleed into the narrative — filter by the business tag to separate the venture from the book.", cites: ["PSN-kelan","PSN-butler"] };
  return null;
};
