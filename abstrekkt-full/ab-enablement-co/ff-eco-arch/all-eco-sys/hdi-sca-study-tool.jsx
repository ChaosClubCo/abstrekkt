import { useState, useEffect, useRef } from "react";

const CONF = ['','Very Low','Low','Medium','High','Very High'];
function fmtTime(ms) {
  if (!ms && ms !== 0) return '--:--:--';
  const s = Math.floor(Math.max(0,ms)/1000);
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sc = s%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`;
}
function hexRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '212,137,58';
}

const DOMAINS = [
  {
    id:'role', short:'Role of SCA', label:'Role of the Support Center Analyst',
    weight:8, range:'~8%', color:'#d4893a',
    concepts:[
      { title:'Industry Evolution', pts:[
        'Break-fix era → service-oriented → experience-driven — know the trajectory',
        'Shift-left: resolve at lowest cost tier, move knowledge to L0/self-service',
        'AI augmentation: bots handle routine; analysts handle complexity and emotion',
        'Support center is no longer a cost center — it\'s a value center measuring business outcomes',
      ]},
      { title:'The SCA Role', pts:[
        'First point of contact for incidents and requests — owns the interaction',
        'Incident ownership: log it, track it, communicate it — even if someone else resolves it',
        'Knowledge contributor: capture what you learn, don\'t hoard it',
        'Brand ambassador: every contact shapes perception of IT and the organization',
        'NOT a technician who happens to answer phones — a service professional with tech skills',
      ]},
      { title:'Value of the Analyst', pts:[
        'FCR (First Contact Resolution) is the primary value metric — resolve it now, not later',
        'Cost per contact: phone highest, self-service lowest — analysts drive channel shift',
        'CSAT/NPS: analyst behavior directly drives satisfaction scores',
        'Escalation reduction: an empowered SCA escalates less, costs less, satisfies more',
      ]},
    ],
    scripts:[
      { label:'Value Chain Flow', content:`Customer Contact\n  ↓\nSCA: Log + Categorize + Prioritize\n  ↓\nAttempt Resolution (L1)\n  ↓\n[Resolved] → Close + Capture Knowledge\n[Not Resolved] → Escalate to L2/L3 (retain ownership)\n  ↓\nFollow up with customer after escalation\n  ↓\nConfirm resolution → Close` },
    ],
  },
  {
    id:'structure', short:'Structural Framework', label:'Structural Framework of Service & Support',
    weight:10, range:'~10%', color:'#7c6bcc',
    concepts:[
      { title:'Service Agreements Hierarchy', pts:[
        'SLA (Service Level Agreement): IT ↔ Business — what service will be delivered',
        'OLA (Operational Level Agreement): internal IT groups — how they support each other',
        'UC (Underpinning Contract): IT ↔ vendor — external support commitments',
        'TRAP: SLAs are with the BUSINESS. OLAs are INTERNAL. UCs are EXTERNAL vendors.',
        'All three must align: UC supports OLA; OLA supports SLA',
      ]},
      { title:'Service Catalog', pts:[
        'Defines what IT offers, how to request it, expected delivery times',
        'Business service catalog: customer-facing language, non-technical',
        'Technical service catalog: underpins the business catalog, internal view',
        'SCA uses the catalog to set expectations and handle requests consistently',
      ]},
      { title:'Standard Operating Procedures', pts:[
        'SOPs = documented, repeatable steps for common situations',
        'Why: consistency, quality, training, audit trail',
        'SCA role: follow SOPs, flag when they\'re wrong or outdated',
        'SOPs should be reviewed regularly — stale SOPs create bad habits',
      ]},
      { title:'Business Alignment', pts:[
        'IT exists to enable the business mission — not to protect technology',
        'Business impact = the lens for prioritizing every incident',
        'SCA must understand which systems are business-critical',
        'Downtime cost = visibility into why Priority 1 is actually Priority 1',
      ]},
    ],
    scripts:[
      { label:'Agreement Hierarchy', content:`Business Needs\n  ↓\nSLA: Business ↔ IT (what is promised)\n  ↓\nOLA: IT Group ↔ IT Group (how it\'s delivered internally)\n  ↓\nUC: IT ↔ Vendor (external support backing)\n\nAlignment rule: If UC breaks → OLA is at risk → SLA may breach` },
      { label:'Business Alignment Check', content:`Before prioritizing an incident ask:\n1. What business function does this affect?\n2. How many users/customers are impacted?\n3. Is there a workaround?\n4. What is the cost of downtime per hour?\n→ These answers determine IMPACT (not just urgency)` },
    ],
  },
  {
    id:'process', short:'Service Management', label:'Service Management Processes',
    weight:16, range:'~15–18%', color:'#4a9e6b',
    concepts:[
      { title:'Incident vs Request — Critical Distinction', pts:[
        'INCIDENT: unplanned interruption or degradation of service — INVESTIGATE to resolve',
        'REQUEST: predefined, pre-approved service action (password reset, new software install)',
        'TRAP: "My laptop is slow" = incident. "I need Adobe Acrobat" = request. Never confuse.',
        'Different process paths: incidents need triage; requests need fulfillment workflow',
        'Problem: underlying cause of one or more incidents — SCA logs incidents; Problem Mgmt investigates root cause',
      ]},
      { title:'Incident Management Process', pts:[
        '1. Detection/Identification → 2. Logging → 3. Categorization → 4. Prioritization',
        '5. Initial Diagnosis → 6. Escalation (if needed) → 7. Investigation & Diagnosis',
        '8. Resolution & Recovery → 9. Incident Closure',
        'SCA owns steps 1–6 and 9 (closure confirmation) even when L2/L3 handles 7–8',
        'Closure requires customer confirmation — do not close without consent',
      ]},
      { title:'Priority Matrix', pts:[
        'Priority = IMPACT × URGENCY — both required, neither alone determines priority',
        'Impact: how many users/business functions affected',
        'Urgency: how quickly must it be resolved (time sensitivity)',
        'P1: High impact + High urgency (system down, many users, business-critical)',
        'P2: High impact or High urgency (not both)',
        'P3: Medium impact + medium urgency (single user, non-critical)',
        'P4: Low — informational, minor inconvenience',
      ]},
      { title:'Knowledge Management (KCS)', pts:[
        'KCS = Knowledge-Centered Service: capture knowledge as a byproduct of solving problems',
        'Four practices: Capture (in the workflow), Structure, Reuse, Improve',
        'Known Error: a problem with identified root cause and workaround — document it',
        'SCA obligation: search before solving, capture what you find, improve bad articles',
        'TRAP: KCS is a discipline, not just a database — it changes HOW you work',
      ]},
      { title:'Access & Security Management', pts:[
        'Access Management: granting right access to right people at right time — principle of least privilege',
        'SCA role: verify identity, follow provisioning/de-provisioning SOPs, never bypass policy',
        'Security Management: protect info assets, enforce policy, report violations',
        'Phishing, social engineering: SCA is a target — know the red flags',
        'Never grant access without proper authorization — even if user is "nice"',
      ]},
    ],
    scripts:[
      { label:'Incident Lifecycle', content:`DETECT → LOG → CATEGORIZE → PRIORITIZE\n  ↓\nINITIAL DIAGNOSIS (SCA — attempt L1 resolution)\n  ↓\n[Resolved at L1] → Recover → Close (with customer confirmation)\n[Not Resolved] → ESCALATE (functional or hierarchical)\n  ↓\nL2/L3 INVESTIGATION & DIAGNOSIS\n  ↓\nRESOLUTION & RECOVERY\n  ↓\nCLOSURE (SCA confirms with customer)` },
      { label:'Priority Matrix', content:`         | HIGH URGENCY | LOW URGENCY\n---------+--------------+------------\nHIGH     |     P1       |     P2\nIMPACT   |  (critical)  |  (serious)\n---------+--------------+------------\nLOW      |     P2/P3    |     P3/P4\nIMPACT   |  (moderate)  |   (minor)\n\nRule: Impact drives priority more than urgency in most frameworks.` },
      { label:'KCS Workflow', content:`Incoming incident:\n1. SEARCH knowledge base first\n2. Found article? → Follow it, flag if outdated\n3. No article? → Solve it, then CREATE/UPDATE the article\n4. Close incident, link knowledge article to ticket\n\nKCS is PART of solving — not extra work after solving` },
    ],
  },
  {
    id:'tools', short:'Tools & Technology', label:'Tools, Technology & Service Delivery',
    weight:8, range:'~8%', color:'#5ba3c9',
    concepts:[
      { title:'ITSM Platform Functions', pts:[
        'Ticket/incident logging: structured, searchable, auditable record of every contact',
        'SLA tracking: auto-alerts when tickets approach breach, visibility to management',
        'Reporting/dashboards: real-time operational view + trend analysis',
        'Knowledge base integration: surfaced articles during incident investigation',
        'TRAP: ITSM tool is only as good as the data entered — garbage in, garbage out',
      ]},
      { title:'Support Delivery Methods', pts:[
        'Phone: highest cost, highest emotional bandwidth, best for complex/sensitive issues',
        'Chat: medium cost, multitasking possible (handle 2–3 simultaneously), text-based limit',
        'Email/web form: async, documented, best for non-urgent requests',
        'Self-service portal: lowest cost, best scalability, requires excellent knowledge base',
        'Walk-in/on-site: highest touch, reserved for physical/hardware issues',
        'Channel selection: match channel to issue complexity and customer emotional state',
      ]},
      { title:'Remote Support Tools', pts:[
        'Remote desktop/screen sharing: see exactly what the user sees — reduces misdiagnosis',
        'Remote control: take over the session with user permission — explicit consent required',
        'Unattended access: server/device management without user present — requires policy approval',
        'Security rule: always announce what you\'re doing on a remote session',
      ]},
      { title:'AI & Self-Service', pts:[
        'Virtual agents/chatbots: L0 handling — password resets, status checks, FAQs',
        'AI-assisted suggestions: ticket categorization, next-best-action, article surfacing',
        'Shift-left: moving resolution capability to lower (cheaper) tiers',
        'SCA role evolves: handle what AI can\'t — judgment, empathy, complexity',
      ]},
    ],
    scripts:[
      { label:'Channel Cost/Complexity Matrix', content:`COMPLEXITY:  LOW ←————————→ HIGH\n\nSelf-Service   Chat    Email    Phone    On-site\n   $0.10      $2–5    $2–3    $8–15    $25–40\n   (cost per contact estimates)\n\nRule: Match channel to issue, not user preference.\nHigh emotion + complex = phone first.` },
    ],
  },
  {
    id:'metrics', short:'Metrics', label:'Understanding Metrics',
    weight:10, range:'~10%', color:'#c94f4f',
    concepts:[
      { title:'Key Performance Metrics — Know Each Cold', pts:[
        'FCR (First Contact Resolution): % of contacts resolved without escalation or callback — primary quality metric',
        'MTTR (Mean Time to Resolution): avg time from detection to resolution — efficiency indicator',
        'AHT (Average Handle Time): talk time + hold time + after-call work — cost driver',
        'CSAT (Customer Satisfaction): post-contact survey score — outcome metric',
        'SLA Compliance %: % of tickets resolved within target SLA — commitment metric',
        'Abandon Rate: % of callers who hang up before reaching SCA — queue health',
        'TRAP: High AHT ≠ bad. Low FCR = bad. CSAT is a lagging indicator — it measures past performance.',
      ]},
      { title:'Metrics Relationships', pts:[
        'FCR and CSAT are strongly correlated — resolve it first time, satisfaction goes up',
        'AHT and FCR can conflict: rushing to lower AHT can hurt FCR — balance required',
        'Volume metrics (calls handled) ≠ quality metrics (FCR, CSAT) — both matter',
        'Dashboards: real-time operational view (live queue, current abandon rate)',
        'Reports: trend analysis over time (weekly FCR, monthly CSAT trends)',
      ]},
      { title:'Quality Assurance', pts:[
        'QA: structured evaluation of actual contacts against defined criteria',
        'QA components: technical accuracy, process adherence, communication quality',
        'Calibration: supervisors score same contact to align scoring standards',
        'Coaching vs scoring: QA is a development tool, not just a compliance check',
        'TRAP: QA score and CSAT can diverge — a technically correct call can still feel bad',
      ]},
    ],
    scripts:[
      { label:'Metric Decision Tree', content:`Is the issue about SPEED? → MTTR, AHT, Response Time\nIs the issue about QUALITY? → FCR, CSAT, QA Score\nIs the issue about CAPACITY? → Volume, Abandon Rate, Utilization\nIs the issue about COMMITMENT? → SLA Compliance %\n\nRule: Always ask "what behavior does this metric encourage?"` },
    ],
  },
  {
    id:'comms', short:'Communication', label:'Communication Essentials',
    weight:14, range:'~13–15%', color:'#9e6b9e',
    concepts:[
      { title:'Active Listening — The Exam Tests This Hard', pts:[
        'Active listening ≠ hearing — it\'s deliberate, engaged processing of what is said',
        '4 components: ATTEND (focus), UNDERSTAND (comprehend), RESPOND (acknowledge), REMEMBER (retain)',
        'Paraphrase: restate in your own words to confirm understanding — not parrot back',
        'Clarifying questions: open-ended to gather info, closed to confirm specific details',
        'DO NOT: interrupt, finish sentences, assume you know the issue before they finish',
        'TRAP: Silence ≠ listening. Note-taking during a call IS active listening.',
      ]},
      { title:'Voice Components (38% Rule)', pts:[
        '7% of communication = words. 38% = vocal quality. 55% = body language (in person).',
        'Vocal quality components: TONE, PACE, PITCH, VOLUME, CLARITY, INFLECTION',
        'Tone: warm and professional, never flat or dismissive',
        'Pace: match the customer but slow down when giving instructions',
        'TRAP: On phone, vocal quality carries 93% of the non-verbal message — it matters enormously',
        'Smiling while speaking is audible — customers can hear warmth',
      ]},
      { title:'Effective Word Choice', pts:[
        'Avoid negatives: "I can\'t do that" → "What I can do is..."',
        'Avoid tech jargon with non-technical users — translate to plain language',
        'Avoid absolute guarantees: "I will fix this in 5 minutes" → "I\'ll work on this now and update you in 10"',
        '"Unfortunately" — use sparingly; overuse feels like you\'re reading a script',
        'Ownership language: "I will" vs "someone will" — own the interaction',
      ]},
      { title:'Written Communication', pts:[
        'Subject line: specific and searchable — "Email not working" vs "Outlook not opening on Jane\'s laptop"',
        'One issue per email/ticket note — don\'t bundle unrelated items',
        'Formal tone in professional contexts — no emoji, no abbreviations in tickets',
        'Proofread before sending — typos undermine credibility',
        'Document while fresh — ticket notes written 2 hours later miss details',
      ]},
      { title:'Cross-Cultural Communication', pts:[
        'Avoid idioms ("ball park," "hit the ground running") — don\'t translate across cultures',
        'Be explicit — don\'t assume shared cultural context',
        'Speak clearly, moderate pace — never raise volume (loudness ≠ clarity)',
        'Confirm understanding without condescending: "Does that make sense?" vs "Was I clear?"',
        'Written follow-up after verbal helps bridge language gaps',
      ]},
    ],
    scripts:[
      { label:'Active Listening Steps', content:`1. PREPARE: clear distractions, open ticket ready\n2. ATTEND: focus fully on what customer says\n3. ABSORB: take notes, don\'t plan your response yet\n4. CLARIFY: ask targeted questions to fill gaps\n5. PARAPHRASE: "So what I\'m hearing is..."\n6. CONFIRM: "Is that correct before I proceed?"\n7. ACT: solve with verified understanding` },
      { label:'Positive Reframes', content:`Instead of:              Say:\n"I don\'t know"      → "Let me find out for you"\n"That\'s not my job"  → "Let me connect you with the right person"\n"You\'ll have to..."  → "What I recommend is..."\n"I can\'t"            → "What I can do is..."\n"It\'s broken"        → "We\'re working to restore service"\n"Calm down"          → "I understand this is frustrating"` },
    ],
  },
  {
    id:'troubleshoot', short:'Troubleshooting', label:'Troubleshooting & Incident Management',
    weight:18, range:'~17–20%', color:'#6b9e9e',
    concepts:[
      { title:'Troubleshooting Methodology', pts:[
        '1. GATHER INFO: what, when, where, who, how many affected, recent changes',
        '2. IDENTIFY SYMPTOMS: distinguish symptoms from root cause — they are not the same',
        '3. FORM HYPOTHESIS: propose the most likely cause based on evidence',
        '4. TEST: try the simplest fix first, isolate variables',
        '5. RESOLVE or REVISE: if test works → resolve + document; if not → new hypothesis',
        '6. DOCUMENT: capture what you found and what fixed it — required, not optional',
        'TRAP: Jumping to step 4 (fixing) without steps 1–3 is the most common SCA error.',
      ]},
      { title:'Critical Thinking Framework', pts:[
        'Ask: "What changed recently?" — 80% of incidents are change-related',
        'Narrow scope: is it this user only? This location? This application version?',
        'Replicate if safe: can you reproduce the issue? Reproducible = easier to solve',
        'Check the obvious first: is it plugged in, logged in, connected to network?',
        'One change at a time: don\'t change multiple variables simultaneously — you lose traceability',
        'TRAP: Confirmation bias — don\'t fit evidence to your hypothesis; fit hypothesis to evidence',
      ]},
      { title:'Escalation Criteria', pts:[
        'Escalate when: SLA breach imminent, needs higher technical skill, affects multiple users',
        'Functional escalation: to someone with more technical skill (L1 → L2 → L3)',
        'Hierarchical escalation: to management when authority or resources needed',
        'Always escalate with context: symptoms, steps taken, customer info, priority',
        'TRAP: Escalation ≠ abandonment. SCA retains ownership and customer communication.',
        'Never escalate prematurely to avoid the work — attempt resolution first',
      ]},
      { title:'Workaround vs Resolution', pts:[
        'Workaround: temporary measure that restores service without fixing root cause',
        'Resolution: permanent fix that eliminates the incident cause',
        'Both close incidents — but document workarounds as Known Errors for Problem Management',
        'Communicate to customer: "This is a temporary fix while we work on the permanent solution"',
        'TRAP: Closing an incident with a workaround without flagging it is incomplete — it will recur',
      ]},
    ],
    scripts:[
      { label:'Troubleshooting Script', content:`GATHER:\n  "When did this start?"\n  "What changed recently?"\n  "Is anyone else affected?"\n  "What error message are you seeing?"\n\nNARROW:\n  Test other app → rules out network\n  Test other user on same machine → rules out user profile\n  Test same user on different machine → rules out hardware\n\nHYPOTHESIZE → TEST → DOCUMENT` },
      { label:'Escalation Handoff Template', content:`When escalating, always provide:\n1. Customer name + contact info\n2. Incident/ticket number\n3. Issue summary (1–2 sentences)\n4. Priority level and SLA target time\n5. Steps already taken + results\n6. Current impact (users affected)\n7. Any workaround in place?\n\nNever: "The customer is having an issue" without this context` },
    ],
  },
  {
    id:'customer', short:'Customer Management', label:'Customer Management Skills',
    weight:12, range:'~11–13%', color:'#d4893a',
    concepts:[
      { title:'Types of Challenging Callers', pts:[
        'Irate: angry, possibly shouting — do not match energy, do not apologize excessively',
        'Rambling: gives too much irrelevant info — politely redirect to the core issue',
        'Silent/evasive: minimal answers — use open-ended questions, build safety',
        'Demanding: insists on escalation or special treatment — acknowledge, hold your boundary professionally',
        'Crying/distressed: genuine emotional distress — empathy first, solution second, always',
        'TRAP: "Difficult" callers are almost always responding rationally to a frustrating situation',
      ]},
      { title:'Emotional Intelligence (EI)', pts:[
        '4 components: Self-Awareness, Self-Regulation, Empathy, Social Skills',
        'Self-awareness: recognize your own emotional state before it affects the call',
        'Self-regulation: choose your response rather than react automatically',
        'Empathy: understand the customer\'s perspective without being consumed by it',
        'Social skills: use EI to navigate difficult interactions toward resolution',
        'TRAP: Empathy is not sympathy. You don\'t have to feel what they feel — just acknowledge it.',
      ]},
      { title:'Expressing Empathy — AEC Formula', pts:[
        'A — Acknowledge: "I can see why this would be frustrating"',
        'E — Empathize: "If this happened to me, I would feel the same way"',
        'C — Commit to Action: "Here\'s what I\'m going to do right now..."',
        'Order matters: acknowledgment BEFORE action — customers need to feel heard first',
        'TRAP: Moving straight to solutions without acknowledgment feels dismissive even when correct',
        'Never say "I understand how you feel" — you don\'t. Say "I can understand that\'s frustrating."',
      ]},
      { title:'Managing Escalating Behavior', pts:[
        'Stay calm: your calm is contagious, as is your panic',
        'Set professional limits: "I want to help you — I need us to work together to do that"',
        'Broken record: calmly repeat your offer/boundary until they engage',
        'Do not: argue, become defensive, match aggression, make promises you can\'t keep',
        'If abusive: warn once, then professionally end the call — you have the right and sometimes obligation',
        'After a difficult call: take a breath, debrief if needed — it\'s normal to need recovery time',
      ]},
    ],
    scripts:[
      { label:'AEC Empathy Framework', content:`STEP 1: ACKNOWLEDGE\n"I understand this has been really frustrating"\n"I can see why this is a problem for you"\n\nSTEP 2: EMPATHIZE\n"That\'s definitely not the experience we want you to have"\n"I would feel the same way in your position"\n\nSTEP 3: COMMIT TO ACTION\n"Here\'s exactly what I\'m going to do right now:"\n"I\'m going to [specific action] and I\'ll update you by [specific time]"\n\nDO NOT skip to step 3 — it always lands wrong` },
      { label:'Limit-Setting Script', content:`Escalating caller (verbal aggression):\n\n1st response:\n"I really do want to help you resolve this.\n To do that, I need us to work together."\n\n2nd response (if continues):\n"I understand you\'re frustrated and I\'m committed\nto resolving this. I need you to work with me\nor I\'ll need to call you back when we can discuss calmly."\n\n3rd response:\n"I\'m going to end this call now and have a supervisor\ncall you back within [timeframe]."\n→ Politely disconnect. Document. Notify supervisor.` },
    ],
  },
  {
    id:'develop', short:'Professional Dev', label:'Personal & Professional Development',
    weight:4, range:'~4–5%', color:'#9e9e4a',
    concepts:[
      { title:'SWOT for Career Planning', pts:[
        'S (Strengths): what you do better than average — communication, technical depth, empathy',
        'W (Weaknesses): honest gaps — not "I work too hard" but real limitations',
        'O (Opportunities): trends creating openings — AI skills, ITSM certifications, shift-left roles',
        'T (Threats): forces that could limit growth — automation replacing routine, gaps in specialty knowledge',
        'TRAP: SWOT is only useful if honest. Inflated strengths and hidden weaknesses = useless plan',
      ]},
      { title:'Time & Stress Management', pts:[
        'Prioritization matrix: urgent + important first; important but not urgent = schedule it',
        'Avoid multitasking during active calls — quality drops, customers notice',
        'Stress signals: irritability, errors, slower call handling — recognize them early',
        'Healthy coping: physical activity, peer support, post-call debrief, scheduled breaks',
        'Burnout is real in support roles — high emotional labor + repetitive work = risk',
      ]},
    ],
    scripts:[
      { label:'Priority Matrix (Personal)', content:`              URGENT    NOT URGENT\nIMPORTANT   | DO NOW  | SCHEDULE\n            | (P1)    | (Plan ahead)\n------------+---------+----------\nNOT         | DELEGATE| ELIMINATE\nIMPORTANT   | (if can)| (if possible)\n\nSupport corollary: Treat your task queue like an incident queue — triage, don\'t panic.` },
    ],
  },
];

const TREE = [
  { q:'Incident or service request?', a:'Incident = unplanned disruption → investigate. Request = expected, approved → fulfill.', d:'Confusing these sends requests into incident queues — wrong SLA, wrong process.' },
  { q:'How to set priority?', a:'Priority = Impact × Urgency — both fields required.', d:'Never set priority on urgency alone. A slow but widespread issue may be P2 even if "not urgent to one person."' },
  { q:'When to escalate?', a:'When: SLA imminent breach, skill gap, >5 users affected, or security risk.', d:'Escalation ≠ failure. Holding a ticket you can\'t solve is the failure.' },
  { q:'What do you retain after escalating?', a:'Customer ownership: communication, SLA tracking, closure confirmation.', d:'The SCA stays as single point of contact. L2 solves it; SCA closes it.' },
  { q:'Caller is irate — first move?', a:'Acknowledge → Empathize → Commit to Action (AEC). Do NOT jump to solution.', d:'Customers who feel unheard become more irate. Empathy first unlocks problem-solving mode.' },
  { q:'Incident vs Problem?', a:'Incident = specific disruption to restore. Problem = root cause of recurring incidents.', d:'SCAs manage incidents. Problem Management investigates why incidents keep happening.' },
  { q:'Known Error?', a:'A problem with an identified root cause AND a documented workaround.', d:'Known Errors live in the KEDB (Known Error DB). Check it before reinvestigating known issues.' },
  { q:'SLA vs OLA vs UC?', a:'SLA = IT ↔ Business. OLA = IT internal. UC = IT ↔ Vendor.', d:'Always flows downward: UC supports OLA; OLA supports SLA.' },
  { q:'FCR vs CSAT correlation?', a:'Strong positive: resolve first contact → higher CSAT. Cannot buy CSAT without FCR.', d:'But they can diverge: technically correct call delivered coldly = low CSAT despite resolution.' },
  { q:'AHT is rising — likely cause?', a:'Complex tickets, inadequate knowledge base, poor troubleshooting process, or new analysts.', d:'Reducing AHT artificially by rushing = lower FCR. Diagnose before optimizing.' },
  { q:'Customer is rambling — how to redirect?', a:'Acknowledge → interrupt politely → ask a specific targeted question.', d:'"I want to make sure we resolve this for you — can I ask, when exactly did this start?" — focuses them.' },
  { q:'Workaround resolved the ticket — what next?', a:'Close ticket + document workaround + flag for Problem Management.', d:'Closing without flagging means the incident recurs. Problem Management needs the pattern.' },
  { q:'KCS obligation during a call?', a:'Search first → use/improve found article → create new article if not found.', d:'KCS is part of the workflow, not a separate task. It changes how you work, not adds to it.' },
  { q:'Active listening confirmation step?', a:'Paraphrase: "So what I\'m hearing is..." — do not parrot back verbatim.', d:'Verbatim echo sounds robotic. Paraphrase proves comprehension, not just hearing.' },
];

export default function HDISCATool() {
  const [mode, setMode] = useState('walkup');
  const [activeDomain, setActiveDomain] = useState('process');
  const [expanded, setExpanded] = useState({});
  const [showScript, setShowScript] = useState({});
  const [confidence, setConfidence] = useState({});
  const [postScores, setPostScores] = useState({});
  const [examEnd, setExamEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [treeSearch, setTreeSearch] = useState('');
  const [aiOut, setAiOut] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDomain, setAiDomain] = useState('');
  const [planOut, setPlanOut] = useState('');
  const [planLoading, setPlanLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const c = await window.storage.get('hdi_conf'); if (c) setConfidence(JSON.parse(c.value));
        const p = await window.storage.get('hdi_post'); if (p) setPostScores(JSON.parse(p.value));
        const e = await window.storage.get('hdi_end'); if (e) setExamEnd(Number(e.value));
      } catch(_) {}
    })();
  }, []);

  useEffect(() => {
    if (!examEnd) return;
    timerRef.current = setInterval(() => setTimeLeft(Math.max(0, examEnd - Date.now())), 1000);
    return () => clearInterval(timerRef.current);
  }, [examEnd]);

  const saveConf = async v => { try { await window.storage.set('hdi_conf', JSON.stringify(v)); } catch(_) {} };
  const savePost = async v => { try { await window.storage.set('hdi_post', JSON.stringify(v)); } catch(_) {} };
  const startExam = async m => {
    const e = Date.now() + m * 60000;
    setExamEnd(e); setTimeLeft(m * 60000);
    try { await window.storage.set('hdi_end', String(e)); } catch(_) {}
  };
  const resetExam = async () => {
    clearInterval(timerRef.current); setExamEnd(null); setTimeLeft(null);
    try { await window.storage.delete('hdi_end'); } catch(_) {}
  };

  const active = DOMAINS.find(d => d.id === activeDomain);
  const filteredTree = TREE.filter(t => !treeSearch || [t.q,t.a,t.d].some(s => s.toLowerCase().includes(treeSearch.toLowerCase())));
  const timerColor = !examEnd ? '#3a3a36' : timeLeft < 600000 ? '#c94f4f' : timeLeft < 1500000 ? '#d4893a' : '#e8e6e0';

  const prioritySort = DOMAINS.map(d => ({...d, score: postScores[d.id]||3}))
    .sort((a,b) => ((5-b.score)*b.weight)-((5-a.score)*a.weight));

  const generateQ = async (domId) => {
    const d = DOMAINS.find(x => x.id === domId);
    if (!d || aiLoading) return;
    setAiLoading(true); setAiOut(''); setAiDomain(domId);
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000,
          messages:[{role:'user', content:
`Generate 3 scenario-based practice questions for the HDI Support Center Analyst (HDI-SCA) certification exam. Domain: "${d.label}".

Key concepts: ${d.concepts.map(c=>c.title).join(', ')}

Rules:
- Each question starts with a realistic call center scenario
- 4 answer choices (A–D), one clearly correct
- Mark correct answer with brief 1-sentence explanation
- Vary: 1 easy / 1 medium / 1 hard
- Focus on decision-making and process, not definitions

Format:
Q1. [scenario]
A) B) C) D)
✓ Answer: X — [why]

Q2. Q3.`
          }]
        })
      });
      const data = await r.json();
      setAiOut((data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('')||'Generation failed.');
    } catch(e) { setAiOut('API error.'); }
    setAiLoading(false);
  };

  const generatePlan = async () => {
    if (planLoading) return;
    setPlanLoading(true); setPlanOut('');
    const scores = DOMAINS.map(d=>`${d.label} (${d.range} of exam): ${CONF[postScores[d.id]||3]}`).join('\n');
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000,
          messages:[{role:'user', content:
`I just took the HDI Support Center Analyst (HDI-SCA) certification exam. Post-exam confidence per domain (1=lowest, 5=highest):

${scores}

Generate a targeted 2-week retake study plan.
- Prioritize by weakness × exam weight
- Be specific: name exact HDI frameworks, processes, and skills to review
- Include scenario practice suggestions
- Format: Week 1 / Week 2, daily focus areas (1 hr/day available)
- Every line should be actionable, no generic advice`
          }]
        })
      });
      const data = await r.json();
      setPlanOut((data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('')||'Failed.');
    } catch(e) { setPlanOut('API error.'); }
    setPlanLoading(false);
  };

  const S = { bg:'#0c0c0b', surf:'#161614', border:'#2a2a26', text:'#e8e6e0', muted:'#6b6866', dim:'#4a4845', accent:'#d4893a' };

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:S.bg,color:S.text,minHeight:'100vh'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#161614}::-webkit-scrollbar-thumb{background:#3a3a36;border-radius:2px}
        button{font-family:'IBM Plex Sans',sans-serif;cursor:pointer}
        input{font-family:'IBM Plex Sans',sans-serif}
        .hb:hover{opacity:0.8!important}.cc:hover{border-color:#3a3a36!important;background:#1a1a18!important}
      `}</style>

      {/* HEADER */}
      <div style={{background:S.surf,borderBottom:`1px solid ${S.border}`,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap',position:'sticky',top:0,zIndex:50}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",color:S.accent,fontSize:17,fontWeight:700}}>HDI-SCA Study System</div>
          <div style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>HDI Support Center Analyst · 65 questions · 75 min · Pass = 80%</div>
        </div>
        <div style={{display:'flex',gap:5}}>
          {[{id:'walkup',label:'🎯 Walk-Up'},{id:'exam',label:'⚡ Exam'},{id:'post',label:'📊 Post-Exam'}].map(m=>(
            <button key={m.id} onClick={()=>setMode(m.id)} className="hb" style={{
              padding:'6px 14px',border:`1px solid ${mode===m.id?S.accent:S.border}`,
              borderRadius:6,background:mode===m.id?'rgba(212,137,58,0.1)':'transparent',
              color:mode===m.id?S.accent:S.muted,fontSize:12,fontWeight:mode===m.id?600:400
            }}>{m.label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:'20px',maxWidth:860,margin:'0 auto'}}>

        {/* ── WALK-UP ── */}
        {mode==='walkup' && <>
          {/* Weight bar */}
          <Sec label="Domain Weights">
            <div style={{display:'flex',height:26,borderRadius:6,overflow:'hidden',gap:2,marginBottom:10}}>
              {DOMAINS.map(d=>(
                <div key={d.id} onClick={()=>setActiveDomain(d.id)} title={d.label} style={{
                  width:`${d.weight}%`,background:d.color,display:'flex',alignItems:'center',
                  justifyContent:'center',fontSize:10,fontWeight:700,color:'#0c0c0b',
                  cursor:'pointer',opacity:activeDomain===d.id?1:0.55,transition:'opacity 0.15s'
                }}>{d.weight}%</div>
              ))}
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {DOMAINS.map(d=>(
                <span key={d.id} onClick={()=>setActiveDomain(d.id)} style={{
                  display:'flex',alignItems:'center',gap:4,cursor:'pointer',fontSize:11,
                  color:activeDomain===d.id?d.color:S.muted,transition:'color 0.15s'
                }}>
                  <span style={{width:6,height:6,borderRadius:1,background:d.color,display:'inline-block'}}/>
                  {d.short} · {d.range}
                </span>
              ))}
            </div>
          </Sec>

          {/* Confidence */}
          <Sec label="Pre-Exam Self-Assessment">
            {DOMAINS.map(d=>{
              const v = confidence[d.id]||3;
              return (
                <div key={d.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:9}}>
                  <div style={{width:120,fontSize:11,color:'#b0ada6',flexShrink:0}}>{d.short}</div>
                  <input type="range" min={1} max={5} value={v}
                    onChange={e=>{const n={...confidence,[d.id]:Number(e.target.value)};setConfidence(n);saveConf(n);}}
                    style={{flex:1,accentColor:d.color}}/>
                  <div style={{width:72,fontSize:11,fontFamily:"'IBM Plex Mono',monospace",textAlign:'right',flexShrink:0,
                    color:v<=2?'#c94f4f':v===3?S.accent:'#4a9e6b'}}>{CONF[v]}</div>
                </div>
              );
            })}
          </Sec>

          {/* Concept cards */}
          <Sec label="Concept Cards" extra={
            <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
              {DOMAINS.map(d=>(
                <button key={d.id} className="hb" onClick={()=>setActiveDomain(d.id)} style={{
                  padding:'2px 8px',borderRadius:4,fontSize:10,transition:'all 0.15s',
                  border:`1px solid ${activeDomain===d.id?d.color:S.border}`,
                  background:activeDomain===d.id?`rgba(${hexRgb(d.color)},0.1)`:'transparent',
                  color:activeDomain===d.id?d.color:S.muted
                }}>{d.short}</button>
              ))}
            </div>
          }>
            {active && active.concepts.map((c,i)=>{
              const k=`w_${activeDomain}_${i}`;
              return <Card key={k} id={k} title={c.title} pts={c.pts} color={active.color} expanded={expanded} toggle={k=>setExpanded(p=>({...p,[k]:!p[k]}))}/>;
            })}
            {active && active.scripts.length > 0 && (
              <div style={{marginTop:6}}>
                <button className="hb" onClick={()=>setShowScript(p=>({...p,[activeDomain]:!p[activeDomain]}))} style={{
                  padding:'4px 10px',border:`1px solid ${S.border}`,borderRadius:5,
                  background:'transparent',color:S.muted,fontSize:10,fontFamily:"'IBM Plex Mono',monospace"
                }}>{showScript[activeDomain]?'▾ Hide':'▸ Show'} Process Scripts</button>
                {showScript[activeDomain] && active.scripts.map((s,i)=>(
                  <Script key={i} label={s.label} content={s.content}/>
                ))}
              </div>
            )}
          </Sec>

          {/* Practice Qs */}
          <Sec label="Practice Question Generator" badge="AI">
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
              {DOMAINS.map(d=>(
                <button key={d.id} onClick={()=>generateQ(d.id)} disabled={aiLoading} className="hb" style={{
                  padding:'5px 10px',border:`1px solid rgba(${hexRgb(d.color)},0.35)`,
                  borderRadius:5,background:`rgba(${hexRgb(d.color)},0.08)`,
                  color:d.color,fontSize:11,opacity:aiLoading?0.4:1
                }}>{aiLoading&&aiDomain===d.id?'Generating...':d.short}</button>
              ))}
            </div>
            {aiOut && <div style={{border:`1px solid ${S.border}`,borderRadius:8,padding:14,fontSize:12,
              color:'#b0ada6',lineHeight:1.8,whiteSpace:'pre-wrap',maxHeight:420,overflowY:'auto'}}>{aiOut}</div>}
          </Sec>
        </>}

        {/* ── EXAM MODE ── */}
        {mode==='exam' && <>
          {/* Timer */}
          <div style={{background:S.surf,border:`1px solid ${timeLeft<600000&&examEnd?'rgba(201,79,79,0.35)':S.border}`,
            borderRadius:10,padding:'16px 20px',marginBottom:16,
            display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
            <div>
              <div style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Time Remaining</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:38,fontWeight:500,color:timerColor,lineHeight:1}}>{fmtTime(timeLeft)}</div>
              {examEnd && timeLeft > 0 && (
                <div style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",marginTop:5}}>
                  {timeLeft<600000?'⚠ Under 10 min':timeLeft<1500000?'⚠ Under 25 min':'On track'} · {Math.round(timeLeft/60000)} min left · ~{Math.round(timeLeft/75000)} questions remaining
                </div>
              )}
              {examEnd && timeLeft===0 && <div style={{fontSize:13,color:'#c94f4f',fontFamily:"'IBM Plex Mono',monospace",marginTop:4}}>TIME UP</div>}
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {!examEnd ? (
                <>
                  <button onClick={()=>startExam(75)} style={{padding:'8px 18px',background:S.accent,border:'none',borderRadius:6,color:'#0c0c0b',fontWeight:700,fontSize:13}}>Start 75 min</button>
                  <button onClick={()=>startExam(90)} style={{padding:'8px 14px',background:'transparent',border:`1px solid ${S.border}`,borderRadius:6,color:S.muted,fontSize:13}}>90 min</button>
                </>
              ) : (
                <button onClick={resetExam} style={{padding:'8px 14px',background:'transparent',border:'1px solid rgba(201,79,79,0.4)',borderRadius:6,color:'#c94f4f',fontSize:13}}>Reset</button>
              )}
            </div>
          </div>

          {/* Decision tree */}
          <Sec label="Quick Decision Reference">
            <input value={treeSearch} onChange={e=>setTreeSearch(e.target.value)}
              placeholder="Search: incident, escalate, empathy, priority, KCS, SLA..."
              style={{width:'100%',padding:'8px 12px',background:S.bg,border:`1px solid ${S.border}`,
                borderRadius:6,color:S.text,fontSize:12,fontFamily:"'IBM Plex Mono',monospace",marginBottom:10}}/>
            <div style={{display:'flex',flexDirection:'column',gap:5,maxHeight:340,overflowY:'auto'}}>
              {filteredTree.map((t,i)=>(
                <div key={i} style={{border:`1px solid ${S.border}`,borderRadius:8,padding:'9px 13px'}}>
                  <div style={{fontSize:11,color:'#b0ada6',marginBottom:3}}>{t.q}</div>
                  <div style={{fontSize:13,fontWeight:600,color:S.accent,marginBottom:2}}>{t.a}</div>
                  <div style={{fontSize:10,color:S.dim,fontFamily:"'IBM Plex Mono',monospace"}}>{t.d}</div>
                </div>
              ))}
              {filteredTree.length===0 && <div style={{fontSize:12,color:S.dim,padding:'6px 0'}}>No matches</div>}
            </div>
          </Sec>

          {/* Domain ref */}
          <Sec label="Domain Reference" extra={
            <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
              {DOMAINS.map(d=>(
                <button key={d.id} className="hb" onClick={()=>setActiveDomain(d.id)} style={{
                  padding:'2px 8px',borderRadius:4,fontSize:10,
                  border:`1px solid ${activeDomain===d.id?d.color:S.border}`,
                  background:activeDomain===d.id?`rgba(${hexRgb(d.color)},0.1)`:'transparent',
                  color:activeDomain===d.id?d.color:S.muted
                }}>{d.short}</button>
              ))}
            </div>
          }>
            {active && active.concepts.map((c,i)=>{
              const k=`e_${activeDomain}_${i}`;
              return <Card key={k} id={k} title={c.title} pts={c.pts} color={active.color} expanded={expanded} toggle={k=>setExpanded(p=>({...p,[k]:!p[k]}))}/>;
            })}
          </Sec>
        </>}

        {/* ── POST-EXAM ── */}
        {mode==='post' && <>
          <Sec label="Post-Exam Domain Feel">
            {DOMAINS.map(d=>{
              const pre=confidence[d.id]||3, post=postScores[d.id]||3, delta=post-pre;
              return (
                <div key={d.id} style={{marginBottom:14}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <div style={{width:6,height:6,borderRadius:1,background:d.color,flexShrink:0}}/>
                      <div style={{fontSize:12,color:S.text}}>{d.label}</div>
                      <div style={{fontSize:10,color:S.dim,fontFamily:"'IBM Plex Mono',monospace"}}>{d.range}</div>
                    </div>
                    <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",
                      color:delta>0?'#4a9e6b':delta<0?'#c94f4f':S.muted}}>
                      {CONF[pre]} → {CONF[post]} {delta>0?'↑':delta<0?'↓':'→'}
                    </div>
                  </div>
                  <input type="range" min={1} max={5} value={post}
                    onChange={e=>{const v={...postScores,[d.id]:Number(e.target.value)};setPostScores(v);savePost(v);}}
                    style={{width:'100%',accentColor:d.color}}/>
                </div>
              );
            })}
          </Sec>

          <Sec label="Retake Priority — Weakness × Exam Weight">
            {prioritySort.map(d=>{
              const pri=(5-d.score)*d.weight;
              const pct=Math.min(100,Math.round((pri/(4*20))*100));
              const col=pct>60?'#c94f4f':pct>35?S.accent:'#4a9e6b';
              return (
                <div key={d.id} style={{marginBottom:9}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <div style={{fontSize:12,color:'#b0ada6'}}>{d.short}</div>
                    <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:col}}>{pct>60?'HIGH':pct>35?'MED':'LOW'} · {CONF[d.score]}</div>
                  </div>
                  <div style={{height:5,background:S.border,borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:col,borderRadius:3,transition:'width 0.3s'}}/>
                  </div>
                </div>
              );
            })}
          </Sec>

          <Sec label="Generate Retake Study Plan" badge="AI">
            <button onClick={generatePlan} disabled={planLoading} className="hb" style={{
              padding:'8px 20px',background:S.accent,border:'none',borderRadius:6,
              color:'#0c0c0b',fontWeight:700,fontSize:13,marginBottom:14,opacity:planLoading?0.5:1
            }}>{planLoading?'Generating...':'Generate 2-Week Retake Plan'}</button>
            {planOut && <div style={{border:`1px solid ${S.border}`,borderRadius:8,padding:14,
              fontSize:12,color:'#b0ada6',lineHeight:1.8,whiteSpace:'pre-wrap',maxHeight:500,overflowY:'auto'}}>{planOut}</div>}
          </Sec>
        </>}
      </div>
    </div>
  );
}

function Sec({label, extra, badge, children}) {
  return (
    <div style={{background:'#161614',border:'1px solid #2a2a26',borderRadius:10,padding:'14px 18px',marginBottom:16}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,flexWrap:'wrap',gap:6}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:10,color:'#6b6866',fontFamily:"'IBM Plex Mono',monospace",textTransform:'uppercase',letterSpacing:'0.08em'}}>{label}</div>
          {badge && <div style={{padding:'1px 6px',background:'rgba(212,137,58,0.15)',border:'1px solid rgba(212,137,58,0.3)',borderRadius:4,fontSize:9,color:'#d4893a',fontFamily:"'IBM Plex Mono',monospace"}}>{badge}</div>}
        </div>
        {extra}
      </div>
      {children}
    </div>
  );
}

function Card({id, title, pts, color, expanded, toggle}) {
  const open = expanded[id];
  return (
    <div onClick={()=>toggle(id)} className="cc" style={{border:'1px solid #2a2a26',borderRadius:8,padding:'8px 12px',cursor:'pointer',transition:'all 0.15s',background:'#0c0c0b',marginBottom:5}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:12,fontWeight:600,color}}>{title}</div>
        <div style={{color:'#3a3a36',fontSize:14,lineHeight:1}}>{open?'−':'+'}</div>
      </div>
      {open && (
        <div style={{marginTop:8,display:'flex',flexDirection:'column',gap:4}}>
          {pts.map((p,i)=>(
            <div key={i} style={{display:'flex',gap:7,alignItems:'flex-start'}}>
              <div style={{color,fontSize:8,marginTop:4,flexShrink:0}}>▸</div>
              <div style={{fontSize:11,color:'#b0ada6',lineHeight:1.6}}>{p}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Script({label, content}) {
  return (
    <div style={{border:'1px solid #2a2a26',borderRadius:8,overflow:'hidden',marginTop:7}}>
      <div style={{padding:'5px 10px',background:'#1a1a18',fontSize:10,color:'#6b6866',borderBottom:'1px solid #2a2a26',fontFamily:"'IBM Plex Mono',monospace"}}>{label}</div>
      <pre style={{margin:0,padding:'10px 12px',fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:'#d4893a',background:'#0c0c0b',overflowX:'auto',lineHeight:1.7}}>{content}</pre>
    </div>
  );
}
