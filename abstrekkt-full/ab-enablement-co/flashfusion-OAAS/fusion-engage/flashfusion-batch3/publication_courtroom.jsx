import React, { useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export default function PublicationCourtroom() {
  const [expandedPub, setExpandedPub] = useState(null);
  const [filterTier, setFilterTier] = useState('all');

  const publications = [
    // TIER 1: FLAGSHIP
    {
      id: 1,
      name: 'The Atlantic',
      tier: 'tier1',
      category: 'Literary/Culture',
      editor: 'Charlie Warzel (Tech Culture) + editorial',
      verdict: 'VIABLE - HIGH PRIORITY',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Flagship position. If this lands, everything opens.',
      roles: {
        publicist: 'FOR: Atlantic byline = instant credibility. "Staff engineer, no CS degree" + diagnostic instinct + systems thinking = exactly their narrative voice.',
        legal: 'CAUTION: Intinc must be anonymized completely ("tech company," "50-200 engineer org"). Complete transparency on TBI/addiction is FINE. Risk: LOW if anonymized, HIGH if identifying details slip. Recommend: Legal review before submission.',
        marketing: 'FOR: Atlantic readers = exactly Kyle\'s audience (systems thinkers, non-traditional paths). Once Atlantic publishes, every outlet becomes easier.',
        assistant: 'FOR: One submission. Essays are done. 2-3 days for cover letter. Clean process.',
        agent: 'FOR: Atlantic takes first NA rights (standard). No exclusivity window beyond publication. Essay becomes anchor for memoir proposal.'
      },
      nextSteps: ['Legal review of Intinc anonymization', 'Customize cover letter', 'Submit Week 1'],
      paymentRange: '$500-2000',
      timeline: '30-90 days',
      responseRate: 'High (3-4 weeks)'
    },
    {
      id: 2,
      name: 'The Sun Magazine',
      tier: 'tier1',
      category: 'Literary/Personal',
      editor: 'Rob Bowers (Managing Editor)',
      verdict: 'VIABLE - SIMULTANEOUS',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Pays best ($1000+). Explicitly rejects toxic positivity. Safe simultaneous submission.',
      roles: {
        publicist: 'FOR: Sun audience = exact fit. Anti-hype, anti-recovery-narrative readers. "Direct without coldness" is The Sun\'s house voice.',
        legal: 'FOR: Sun is most forgiving on transparency. Complete disclosure of TBI/addiction is expected, preferred. Intinc anonymization still required. Risk: LOW.',
        marketing: 'FOR: Smaller audience but DEEPER. High-quality engagement. Publication ripples in writing/literary circles.',
        assistant: 'FOR: Submittable platform. Same timeline as Atlantic.',
        agent: 'FOR: Allows simultaneous submissions explicitly. Can submit same essay to both Atlantic + Sun simultaneously.'
      },
      nextSteps: ['Submit Week 1 (simultaneous with Atlantic)', 'Same Intinc anonymization'],
      paymentRange: '$1000+',
      timeline: '30-90 days',
      responseRate: 'Very high (2-3 weeks)'
    },
    {
      id: 3,
      name: 'Guernica',
      tier: 'tier1',
      category: 'Literary/Political',
      editor: 'editors@guernicamag.com',
      verdict: 'VIABLE - CONDITIONAL',
      verdictColor: 'bg-yellow-100 border-yellow-400',
      rationale: 'Excellent fit (political + systems thinking). REQUIRES COMPLETED MANUSCRIPT (2500+ words minimum).',
      roles: {
        publicist: 'FOR: Guernica publishes marginalized, unapologetic voices. "Broken brain" + systems architecture = exactly their lane.',
        legal: 'CAUTION: More forgiving on disclosure but also gets reacted to. Make sure Intinc anonymization is airtight—no product details, no timeline specificity. Risk: MEDIUM if anonymization is sloppy.',
        marketing: 'FOR: Readers overlap with Atlantic but Guernica adds political/cultural credibility.',
        assistant: 'CAUTION: Requires COMPLETED manuscript (not pitch). Check word count—if under 2500, either expand or save for elsewhere.',
        agent: 'FOR: First NA rights (standard). Submit SAME WEEK as Atlantic/Sun. If Atlantic rejects, Guernica likely accepts.'
      },
      nextSteps: ['Verify essay is 2500+ words', 'Final legal anonymization review', 'Submit Week 1 (simultaneous)'],
      paymentRange: '$250-500',
      timeline: '60-120 days',
      responseRate: 'Moderate (6-8 weeks)'
    },
    {
      id: 4,
      name: 'Granta',
      tier: 'tier1',
      category: 'Literary/International',
      editor: 'Editorial team',
      verdict: 'VIABLE - WAIT FOR WINDOW',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Top-tier prestige. Irregular submission windows. Worth the wait.',
      roles: {
        publicist: 'FOR: Granta = *the* prestige literary journal globally. Publication here = book deal conversation starter.',
        legal: 'FOR: Intinc anonymization standard. TBI/addiction transparency expected + welcomed. Risk: LOW.',
        marketing: 'FOR: Audience is sophisticated + international. Gets noticed by agents, publishers, optioners.',
        assistant: 'CAUTION: Irregular submission windows = must watch for announcements. Not ideal for "saturate immediately" strategy.',
        agent: 'FOR: Takes first NA rights. Wait for submission window, then submit. This is strategic #2-3 move, not #1.'
      },
      nextSteps: ['Sign up for submission window alerts', 'Submit when window opens (typically annual)'],
      paymentRange: '$500-1500',
      timeline: '90-180 days',
      responseRate: 'Moderate (8-12 weeks)'
    },
    {
      id: 5,
      name: 'MIT Technology Review',
      tier: 'tier1',
      category: 'Tech/Systems',
      editor: 'Karen Hao or Will Douglas Heaven',
      verdict: 'VIABLE - DIRECT PITCH',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Direct reporter pitch (not general submissions). Hao covers labor/cognition. Heaven covers systems design.',
      roles: {
        publicist: 'FOR: MIT TR byline = credibility in tech + academic circles. Positions Kyle as "systems thinker" not "recovery story".',
        legal: 'FOR: MIT TR comfortable with technical specificity + anonymization. TBI/addiction transparency expected. Risk: LOW.',
        marketing: 'FOR: Audience = people who cite essays in technical + business contexts. Good for Chaos Club credibility.',
        assistant: 'FOR: Pitch-based (not submission). 200-300 word pitch to reporter directly. 2-3 days work.',
        agent: 'FOR: Faster decision cycle. Can pitch same angle to both Hao + Heaven (different specialties, no conflict).'
      },
      nextSteps: ['Craft 200-word pitch for Karen Hao (labor angle)', 'Craft 200-word pitch for Will Heaven (systems angle)', 'Send direct emails Week 1-2'],
      paymentRange: '$500-2000',
      timeline: '14-30 days',
      responseRate: 'High (reporters respond quickly or not at all)'
    },
    {
      id: 6,
      name: 'WIRED (Culture/Tech)',
      tier: 'tier1',
      category: 'Tech/Culture',
      editor: 'Editorial team',
      verdict: 'VIABLE - PITCH',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Culture section actively seeks "how tech shapes thinking" essays.',
      roles: {
        publicist: 'FOR: WIRED = reaching both tech insiders + general readers. "Self-taught + diagnostic instinct" = exactly their cultural angle.',
        legal: 'FOR: WIRED forgiving on transparency + technical specificity. Risk: LOW.',
        marketing: 'FOR: Audience = designers/engineers/builders. Reaches startup world + investors. Strategic for Chaos Club positioning.',
        assistant: 'FOR: Pitch-based. 200 words. 2 hours.',
        agent: 'FOR: Takes first NA rights. Can pitch simultaneously with Atlantic/Sun (different submission routes).'
      },
      nextSteps: ['Craft WIRED-specific pitch (angle: "how broken brains become builders")', 'Send to editorial contact', 'Week 1-2'],
      paymentRange: '$500-1500',
      timeline: '14-30 days',
      responseRate: 'Moderate (2-3 weeks)'
    },
    {
      id: 7,
      name: 'Longreads',
      tier: 'tier2',
      category: 'Literary/Essays',
      editor: 'Brendan, Carolyn, Cheri (editor preferences on site)',
      verdict: 'VIABLE - SAFE TIER-2 ANCHOR',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: '$500 payment. Editors listed with preferences. Very safe submission.',
      roles: {
        publicist: 'FOR: Longreads = solid literary credibility. Publication here doesn\'t hurt tier-1 strategy.',
        legal: 'FOR: Forgiving on all fronts. Risk: VERY LOW.',
        marketing: 'FOR: Audience = writers + thinkers. Smaller reach but high engagement.',
        assistant: 'FOR: Full draft required (we have it). Straightforward process.',
        agent: 'FOR: Takes first NA rights. Can submit simultaneously with tier-1 (different audience, standard practice).'
      },
      nextSteps: ['Check editor preferences', 'Submit full essay draft', 'Week 2-3 (after tier-1)'],
      paymentRange: '$500',
      timeline: '30-90 days',
      responseRate: 'Moderate (4-6 weeks)'
    },
    {
      id: 8,
      name: 'River Teeth Journal',
      tier: 'tier2',
      category: 'Literary/Narrative',
      editor: 'Editorial team',
      verdict: 'VIABLE - SOLID TIER-2',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: '"Good Writing Counts, Facts Matter" ethos = perfect fit. 2500-5000 word range.',
      roles: {
        publicist: 'FOR: River Teeth = respected in literary circles. Audience cares about precision + honesty.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-2 safe position. Good for saturation strategy.',
        assistant: 'FOR: Straightforward submission.',
        agent: 'FOR: Standard terms. Safe simultaneous submission.'
      },
      nextSteps: ['Submit Sept-May window', 'Check word count (2500-5000)'],
      paymentRange: '$200-400',
      timeline: '60-120 days',
      responseRate: 'Moderate'
    },
    {
      id: 9,
      name: 'Slate (Tech Culture)',
      tier: 'tier1',
      category: 'Tech/Culture',
      editor: 'Editorial team (pitches welcome)',
      verdict: 'VIABLE - PITCH',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Tech culture section actively seeks essays. Pitch-based. Fast feedback.',
      roles: {
        publicist: 'FOR: Slate = mass culture appeal + tech credibility. Reaches both sides.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Audience = educated general readers + tech professionals. Wider reach than WIRED.',
        assistant: 'FOR: Pitch-based. One pitch, 200 words. Fast.',
        agent: 'FOR: Standard terms. Pitch-based = faster feedback.'
      },
      nextSteps: ['Craft Slate pitch (angle: "Why building systems isn\'t recovery")', 'Send to editorial contact', 'Week 1'],
      paymentRange: '$500-1200',
      timeline: '7-14 days',
      responseRate: 'Very high (fast reject or commission)'
    },
    {
      id: 10,
      name: 'Vox (Explainers/Essays)',
      tier: 'tier1',
      category: 'Tech/Culture',
      editor: 'Editorial team',
      verdict: 'VIABLE - PITCH',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Systems thinking focus. Explainer audience. Pitch-based.',
      roles: {
        publicist: 'FOR: Vox = huge reach. Systems angle fits perfectly.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Vox readers = 5+ million. Huge amplification potential.',
        assistant: 'FOR: Pitch-based. Standard process.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Craft Vox pitch (systems angle)', 'Send to editorial', 'Week 1'],
      paymentRange: '$500-1500',
      timeline: '7-21 days',
      responseRate: 'High (fast)'
    },
    {
      id: 11,
      name: 'Aeon',
      tier: 'tier2',
      category: 'Philosophy/Culture',
      editor: 'Editorial team',
      verdict: 'VIABLE - PHILOSOPHICAL ANGLE',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Philosophy + science + culture. Systems thinking welcome.',
      roles: {
        publicist: 'FOR: Aeon audience = intellectuals + thinkers. Positions Kyle as philosopher + systems thinker.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-2 solid. Different audience (academic/philosophical).',
        assistant: 'FOR: Pitch-based.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Craft Aeon pitch (philosophy angle)', 'Send to editorial'],
      paymentRange: '$250-500',
      timeline: '14-30 days',
      responseRate: 'Moderate'
    },
    {
      id: 12,
      name: 'Smithsonian Magazine (Ingenuity)',
      tier: 'tier2',
      category: 'Culture/Science',
      editor: 'Editorial team',
      verdict: 'VIABLE - CONDITIONAL',
      verdictColor: 'bg-yellow-100 border-yellow-400',
      rationale: 'Ingenuity section = perfect fit BUT requires more general framing. Angle shift needed.',
      roles: {
        publicist: 'FOR: Smithsonian = credibility + mass reach. "Ingenious problem-solving" angle is perfect.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'CAUTION: Smithsonian audience = very broad (older, general interest). Need to reframe systems angle for mass accessibility. Different essay or significant revision required.',
        assistant: 'CAUTION: May require reframing/rewrite.',
        agent: 'FOR: Standard terms. But need different angle/framing.'
      },
      nextSteps: ['Assess if essay needs reframing for Smithsonian', 'If yes, plan rewrite', 'If no, pitch as-is'],
      paymentRange: '$500-1500',
      timeline: '30-90 days',
      responseRate: 'Moderate'
    },
    {
      id: 13,
      name: 'The Verge',
      tier: 'tier1',
      category: 'Tech Culture',
      editor: 'Editorial team',
      verdict: 'VIABLE - PITCH',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Tech culture with philosophy. Culture section welcomes essays. High reach.',
      roles: {
        publicist: 'FOR: The Verge = massive reach in tech world. Perfect for builders, engineers, investors.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Audience = builders + designers. Target audience for Chaos Club. High strategic value.',
        assistant: 'FOR: Pitch-based. Standard process.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Craft Verge pitch (builder/designer angle)', 'Send to editorial', 'Week 1'],
      paymentRange: '$500-1500',
      timeline: '7-21 days',
      responseRate: 'High (fast)'
    },
    {
      id: 14,
      name: 'TechCrunch (Culture)',
      tier: 'tier2',
      category: 'Startup Culture',
      editor: 'Editorial team',
      verdict: 'VIABLE - STARTUP ANGLE',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Startup culture + unconventional founders = perfect for "founder without credentials".',
      roles: {
        publicist: 'FOR: TechCrunch audience = startup world + investors. Positions Kyle as founder + systems thinker.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: TechCrunch = startup ecosystem reach. Good for business positioning.',
        assistant: 'FOR: Pitch-based.',
        agent: 'FOR: Standard terms. Good for founder positioning.'
      },
      nextSteps: ['Craft TechCrunch pitch (founder/unconventional path)', 'Send to editorial'],
      paymentRange: '$250-750',
      timeline: '7-21 days',
      responseRate: 'High (fast)'
    },
    {
      id: 15,
      name: 'Ploughshares',
      tier: 'tier2',
      category: 'Literary',
      editor: 'Guest editors rotate',
      verdict: 'VIABLE - EDITOR-DEPENDENT',
      verdictColor: 'bg-yellow-100 border-yellow-400',
      rationale: 'Prestigious literary journal. Guest editor model means quality varies.',
      roles: {
        publicist: 'FOR: Ploughshares = literary credibility. Outcome uncertain until editor match.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-2 solid if upcoming editor fits.',
        assistant: 'CAUTION: Check upcoming editor first.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Check Ploughshares upcoming editor', 'If fit, submit during open window'],
      paymentRange: '$200-400',
      timeline: '60-120 days',
      responseRate: 'Moderate'
    },
    {
      id: 16,
      name: 'Creative Nonfiction',
      tier: 'tier2',
      category: 'Literary/Nonfiction',
      editor: 'Editorial team',
      verdict: 'VIABLE - PREMIER JOURNAL',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Premier journal for creative nonfiction. Check upcoming themes.',
      roles: {
        publicist: 'FOR: Creative Nonfiction = credibility in the form.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-2 safe. Good for literary positioning.',
        assistant: 'FOR: Straightforward submission. Check themed calls.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Check upcoming themed issues', 'Submit if theme fits'],
      paymentRange: '$200-400',
      timeline: '60-120 days',
      responseRate: 'Moderate'
    },
    {
      id: 17,
      name: 'The Rumpus',
      tier: 'tier2',
      category: 'Literary/Essays',
      editor: 'Editorial team',
      verdict: 'VIABLE - EXPERIMENTAL FORMS',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Experimental forms welcome. No traditional narrative arc required.',
      roles: {
        publicist: 'FOR: The Rumpus = credibility + unconventional work. Good fit for Kyle\'s systems-based style.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-2 solid. Audience appreciates experimental writing.',
        assistant: 'FOR: Straightforward submission.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Submit to The Rumpus'],
      paymentRange: '$200-300',
      timeline: '30-90 days',
      responseRate: 'Moderate'
    },
    {
      id: 18,
      name: 'Literary Hub',
      tier: 'tier2',
      category: 'Literary/Culture',
      editor: 'Editorial team',
      verdict: 'VIABLE - SOLID TIER-2',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Essays on craft, culture, identity. Non-traditional voices preferred.',
      roles: {
        publicist: 'FOR: Literary Hub = credibility. Audience seeks non-traditional, systems thinkers.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-2 safe. Good saturation outlet.',
        assistant: 'FOR: Straightforward submission.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Submit to Literary Hub'],
      paymentRange: '$200-400',
      timeline: '30-90 days',
      responseRate: 'Moderate'
    },
    {
      id: 19,
      name: 'Electric Literature',
      tier: 'tier2',
      category: 'Digital Essays',
      editor: 'Editorial team',
      verdict: 'VIABLE - DIGITAL-FIRST',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Digital essays platform. No print limitation. Experimental formats.',
      roles: {
        publicist: 'FOR: Electric Literature = digital literary credibility. Tech-forward readers.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Digital-first = faster turnaround + promotion.',
        assistant: 'FOR: Straightforward submission.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Submit to Electric Literature'],
      paymentRange: '$100-300',
      timeline: '30-60 days',
      responseRate: 'Moderate-high'
    },
    {
      id: 20,
      name: 'The Point Magazine',
      tier: 'tier3',
      category: 'Philosophy/Culture',
      editor: 'Editorial team',
      verdict: 'VIABLE - INTELLECTUAL ANGLE',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Intellectual essays. Doesn\'t require accessibility.',
      roles: {
        publicist: 'FOR: The Point = intellectual credibility. Philosopher + systems thinker positioning.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-3 but prestige in intellectual circles.',
        assistant: 'FOR: Straightforward submission.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Submit to The Point'],
      paymentRange: '$100-300',
      timeline: '30-90 days',
      responseRate: 'Moderate'
    },
    {
      id: 21,
      name: 'Axios AI+',
      tier: 'tier3',
      category: 'Newsletter/Tech',
      editor: 'Editorial team',
      verdict: 'VIABLE - NEWSLETTER ANGLE',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Daily AI newsletter. Shorter form (800-1500 words). Fast turnaround.',
      roles: {
        publicist: 'FOR: Axios audience = decision-makers + builders. Good for Chaos Club visibility.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Fast publication + high readership. Good for saturation.',
        assistant: 'FOR: May need shorter form but straightforward.',
        agent: 'FOR: Standard terms. Fast publication timeline.'
      },
      nextSteps: ['If essay is 800-1500 words, submit', 'If longer, edit down + submit'],
      paymentRange: '$200-500',
      timeline: '7-14 days',
      responseRate: 'Very high (fast)'
    },
    {
      id: 22,
      name: 'OneZero (Medium)',
      tier: 'tier3',
      category: 'Tech/Culture',
      editor: 'Editorial team',
      verdict: 'VIABLE - MEDIUM OUTLET',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Medium tech section. Fast submission. Good for saturation.',
      roles: {
        publicist: 'FOR: OneZero = reach in tech community. Good visibility.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Medium platform = built-in audience. Fast publication.',
        assistant: 'FOR: Straightforward submission.',
        agent: 'FOR: Standard terms. Can also self-publish on Medium if rejected.'
      },
      nextSteps: ['Submit to OneZero'],
      paymentRange: '$100-300 + Medium revenue share',
      timeline: '7-21 days',
      responseRate: 'Moderate-high'
    },
    {
      id: 23,
      name: 'Protocol (AI/Work)',
      tier: 'tier3',
      category: 'Tech/Work',
      editor: 'Editorial team',
      verdict: 'VIABLE - WORK/AI ANGLE',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Work + AI section. Perfect for "tools for work" angle.',
      roles: {
        publicist: 'FOR: Protocol audience = HR + business leaders. Good for business positioning.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Enterprise/B2B visibility.',
        assistant: 'FOR: Straightforward submission.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Submit to Protocol'],
      paymentRange: '$200-500',
      timeline: '7-21 days',
      responseRate: 'High'
    },
    {
      id: 24,
      name: 'IEEE Spectrum (Culture)',
      tier: 'tier3',
      category: 'Engineering Culture',
      editor: 'Editorial team',
      verdict: 'VIABLE - ENGINEER AUDIENCE',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Engineering culture section. Professional engineer audience.',
      roles: {
        publicist: 'FOR: IEEE Spectrum = credibility in professional engineering circles.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Professional positioning. Good for consulting/speaking credibility.',
        assistant: 'FOR: Straightforward submission.',
        agent: 'FOR: Standard terms.'
      },
      nextSteps: ['Submit to IEEE Spectrum'],
      paymentRange: '$200-500',
      timeline: '30-60 days',
      responseRate: 'Moderate'
    },
    {
      id: 25,
      name: 'Brevity',
      tier: 'tier3',
      category: 'Flash Nonfiction',
      editor: 'Dinty W. Moore',
      verdict: 'VIABLE - IF UNDER 750 WORDS',
      verdictColor: 'bg-yellow-100 border-yellow-400',
      rationale: 'Flash nonfiction only (under 750 words). Need excerpt if main essay longer.',
      roles: {
        publicist: 'FOR: Brevity = literary credibility for flash form.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-3 but respectable if essay fits form.',
        assistant: 'CAUTION: Check essay length. If over 750 words, need excerpt or skip.',
        agent: 'FOR: Standard terms if form fits.'
      },
      nextSteps: ['If essay excerpt under 750 words, submit', 'If longer, skip'],
      paymentRange: '$50-100 honorarium',
      timeline: '30-60 days',
      responseRate: 'Moderate'
    },
    {
      id: 26,
      name: 'Catapult (Literary)',
      tier: 'tier3',
      category: 'Flash Essays',
      editor: 'Editorial team',
      verdict: 'VIABLE - FLASH FORM',
      verdictColor: 'bg-yellow-100 border-yellow-400',
      rationale: 'Flash essays (500-2000 words). Good for saturation if excerpt available.',
      roles: {
        publicist: 'FOR: Catapult = literary credibility + experimental.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-3 but respected. Good for saturation.',
        assistant: 'FOR: If essay fits word range, straightforward submission.',
        agent: 'FOR: Standard terms. $200 payment.'
      },
      nextSteps: ['If essay 500-2000 words, submit to Catapult'],
      paymentRange: '$200',
      timeline: '30-90 days',
      responseRate: 'Moderate'
    },
    {
      id: 27,
      name: 'Narrative Magazine',
      tier: 'tier3',
      category: 'Literary Journal',
      editor: 'Editorial team',
      verdict: 'VIABLE - NONPROFIT JOURNAL',
      verdictColor: 'bg-green-100 border-green-400',
      rationale: 'Nonprofit literary journal. Open submissions. Safe outlet.',
      roles: {
        publicist: 'FOR: Narrative = literary credibility. Respected editorial. Good for CV.',
        legal: 'FOR: No concerns. Risk: VERY LOW.',
        marketing: 'FOR: Tier-3 but respectable. Good for saturation.',
        assistant: 'FOR: Straightforward submission.',
        agent: 'FOR: Standard terms. Nonprofit (no payment typically).'
      },
      nextSteps: ['Submit to Narrative Magazine'],
      paymentRange: '$0 (publication credit)',
      timeline: '60-120 days',
      responseRate: 'Moderate'
    },
    {
      id: 28,
      name: 'Substack (Personal Newsletter)',
      tier: 'tier3',
      category: 'Digital/Self-Published',
      verdict: 'VIABLE BACKUP - SELF-PUBLISH OPTION',
      verdictColor: 'bg-blue-100 border-blue-400',
      rationale: 'If rejected everywhere, self-publish on Substack. Build subscriber base. Control brand.',
      roles: {
        publicist: 'FOR: Substack as backup = control + direct audience. Owned audience = better long-term asset than single publication.',
        legal: 'FOR: Full control over content. Risk: VERY LOW.',
        marketing: 'FOR: If essays don\'t place, Substack becomes primary distribution. Build audience while pitching.',
        assistant: 'FOR: Easy to set up. Can launch concurrent with pitches.',
        agent: 'FOR: Substack newsletter = portfolio piece for agents + publishers. Audience first = better book deal leverage.'
      },
      nextSteps: ['Create Substack as backup distribution', 'Publish essays there if they don\'t place', 'Build subscriber base as leverage for book deal'],
      paymentRange: '$0 (audience-dependent revenue share)',
      timeline: 'Immediate',
      responseRate: 'N/A (owned platform)'
    }
  ];

  const verdictCounts = {
    viable: publications.filter(p => p.verdict.includes('VIABLE')).length,
    conditional: publications.filter(p => p.verdict.includes('CONDITIONAL')).length
  };

  const filteredPublications = filterTier === 'all' 
    ? publications 
    : publications.filter(p => p.tier === filterTier);

  const topSequence = publications.filter(p => p.tier === 'tier1').slice(0, 7);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Publication Courtroom Verdicts</h1>
        <p className="text-lg text-gray-600 mb-4">Kyle Rosebrook's Memoir Essay: 28 Publications | Market Saturation Strategy</p>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-900">VIABLE</p>
            <p className="text-2xl font-bold text-green-700">{verdictCounts.viable}/28</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm font-semibold text-yellow-900">CONDITIONAL</p>
            <p className="text-2xl font-bold text-yellow-700">{verdictCounts.conditional}/28</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-900">ROLES ANALYZING</p>
            <p className="text-2xl font-bold text-gray-700">5 Voices</p>
          </div>
        </div>

        {/* TIER FILTER */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button 
            onClick={() => setFilterTier('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filterTier === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All (28)
          </button>
          <button 
            onClick={() => setFilterTier('tier1')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filterTier === 'tier1' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Tier 1 Flagship
          </button>
          <button 
            onClick={() => setFilterTier('tier2')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filterTier === 'tier2' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Tier 2 Strong
          </button>
          <button 
            onClick={() => setFilterTier('tier3')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${filterTier === 'tier3' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Tier 3 Saturation
          </button>
        </div>
      </div>

      {/* TOP SEQUENCE PRIORITY */}
      {filterTier === 'all' && (
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-300">
          <h2 className="text-2xl font-bold text-purple-900 mb-4">⚡ WEEK 1-3: PRIORITY SEQUENCE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {topSequence.map((pub, idx) => (
              <div key={pub.id} className="bg-white p-4 rounded-lg border-2 border-purple-200">
                <div className="text-sm font-semibold text-purple-700 mb-1">#{idx + 1}</div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{pub.name}</h3>
                <div className="text-xs bg-purple-100 text-purple-900 px-2 py-1 rounded font-semibold inline-block">
                  {pub.verdict.includes('PITCH') ? '🎯 Pitch' : '📝 Submit'}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700"><strong>Strategy:</strong> Submit all tier-1 simultaneously in Week 1-2. Different submission routes (pitches vs. direct) = no conflict. Expect first decisions in 14-30 days. If tier-1 rejects, move to tier-2/3 backups.</p>
          </div>
        </div>
      )}

      {/* PUBLICATION LIST */}
      <div className="space-y-3">
        {filteredPublications.map(pub => (
          <div key={pub.id} className={`border-2 rounded-lg overflow-hidden transition ${pub.verdictColor}`}>
            {/* HEADER BAR */}
            <button
              onClick={() => setExpandedPub(expandedPub === pub.id ? null : pub.id)}
              className="w-full p-4 flex justify-between items-start hover:bg-opacity-75 transition text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{pub.name}</h3>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-200 text-gray-800">{pub.category}</span>
                </div>
                <p className="text-sm text-gray-700">{pub.editor}</p>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4">
                <div className="text-sm font-bold text-gray-900 whitespace-nowrap">{pub.verdict}</div>
                <ChevronDown 
                  size={20} 
                  className={`transition ${expandedPub === pub.id ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* EXPANDED DETAILS */}
            {expandedPub === pub.id && (
              <div className="bg-white border-t-2 p-6 space-y-4">
                <p className="text-gray-700 font-semibold">{pub.rationale}</p>
                
                {/* ROLES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(pub.roles).map(([roleName, argument]) => {
                    const roleNames = {
                      publicist: '👤 Publicist',
                      legal: '⚖️ Legal',
                      marketing: '📊 Marketing',
                      assistant: '📋 Assistant',
                      agent: '🤝 Agent'
                    };
                    return (
                      <div key={roleName} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-sm font-bold text-gray-900 mb-1">{roleNames[roleName]}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{argument}</p>
                      </div>
                    );
                  })}
                </div>

                {/* METADATA */}
                <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-lg text-sm">
                  <div>
                    <p className="font-semibold text-gray-600">Payment</p>
                    <p className="text-gray-900">{pub.paymentRange}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Response</p>
                    <p className="text-gray-900">{pub.responseRate}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Timeline</p>
                    <p className="text-gray-900">{pub.timeline}</p>
                  </div>
                </div>

                {/* NEXT STEPS */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-2">NEXT STEPS:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {pub.nextSteps.map((step, idx) => (
                      <li key={idx}>• {step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER: TOP 3 UNKNOWNS */}
      {filterTier === 'all' && (
        <div className="mt-12 bg-red-50 p-8 rounded-lg border-2 border-red-300">
          <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2"><AlertCircle size={28} /> TOP 3 UNKNOWNS (BEFORE FIRST PITCH)</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. LEGAL REVIEW: Intinc Boundaries</h3>
              <p className="text-gray-700 mb-3"><strong>Why:</strong> Non-competes + IP agreements vary. Publishing "I'm a Staff Engineer at a 50-200 person tech company" might violate your Intinc contract.</p>
              <p className="text-gray-700 mb-3"><strong>Action:</strong> Tech employment lawyer (1 hour, ~$200-300). Review Intinc agreement + draft essay. Ask: (1) Can I publish about cognitive disruption while employed? (2) What product/incident details are off-limits? (3) Do I need legal review before submission?</p>
              <p className="text-sm text-red-600 font-semibold">Risk: Without this = cease-and-desist + forced unpublication. With this = full peace of mind.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. RIGHTS NEGOTIATION STRATEGY: What's Your Endgame?</h3>
              <p className="text-gray-700 mb-3"><strong>Why:</strong> Different outlets = different rights terms. You don't yet know if this essay is (a) standalone publication, (b) book deal opening chapter, (c) evergreen republish-everywhere, or (d) stepping stone.</p>
              <p className="text-gray-700 mb-3"><strong>Action:</strong> Decide: Republish everywhere (saturation = higher uptake chance)? Exclusive first-publication then open? Customize per outlet? Keep exclusive for book proposal then open?</p>
              <p className="text-sm text-red-600 font-semibold">Recommended: Republish everywhere. Clarify before pitching.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-red-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. PITCH TEMPLATE VARIATIONS: Different Angles for Different Outlets</h3>
              <p className="text-gray-700 mb-3"><strong>Why:</strong> The Atlantic wants "construction vs. recovery" (philosophical). MIT TR wants "systems thinking for cognition" (technical). WIRED wants "unconventional engineer" (cultural). Same essay, different angles.</p>
              <p className="text-gray-700 mb-3"><strong>Action:</strong> Create pitch variations for: (1) Literary (recovery → agency), (2) Tech culture (self-taught + diagnostic instinct), (3) Tech systems (240+ tools as cognitive architecture), (4) Business/work (AI augmentation). Each pitch shows why essay is perfect *for them*.</p>
              <p className="text-sm text-red-600 font-semibold">Without this = generic pitches = low opens. With this = each outlet sees why.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
