import React, { useState } from 'react';
import { Send, Copy, Zap, RotateCcw } from 'lucide-react';

export default function PitchKanban() {
  const [emails, setEmails] = useState({
    mit: `Subject: PITCH — TBI + Addiction + 240+ Tools = The Construction Story Nobody's Told

Hi Rachel,

I broke my brain twice. Not metaphorically—clinically. October 2021 overdose, hypoxia, SPECT scan showing scalloping in temporal lobes and prefrontal cortex. Followed by addiction, homelessness, and the kind of cognitive collapse where mid-sentence, you lose the thread and someone has to stop you mid-word before you even notice you've fallen apart.

Most brain injury memoirs end with "recovery." Mine begins with a question: What if reconstruction beats recovery?

Instead of trying to remember what I lost, I engineered what never existed. 240+ tools. Custom automation. Cognitive prosthetics. Not inspiration porn—system design. The story is:
- Clinical TBI data (Amen Clinics eval, Conners CPT 3) proving I'm ADHD + impulse regulation decay
- How I built two companies (FlashFusion: B2B AI enablement; Chaos Club Co: peer support) after the break
- Why "diagnostic instinct" (reading systems, not just people) survived intact and became the throughline
- Tools as evidence of construction, not recovery rhetoric

This is literary nonfiction for your readers who care about how humans rebuild agency post-disruption. Not "overcoming adversity." It's "How do you engineer a life when your mind doesn't work the way it used to?"

I have:
- Completed O'Toole's excavation (4-year arc, confirmed scenes)
- Clinical documentation (TBI eval, neuropsych)
- Timeline locked (Michaels 2018 → Injury 2021 → O'Toole's 2021-2025 → Intinc 2025+)
- Live companies (FlashFusion Base44 app live, Skills Library 50+ production-ready skills)

Playbook is live: abstrekkt.com (launching this week after 3 manual WordPress clicks)

Are you interested in a 4,000-5,500 word feature on how cognitive reconstruction actually works—told by someone who did it?

Kyle Rosebrook
abstrekkt.com | FlashFusion`,
    
    sifted: `Subject: Founder Story — The Engineer Who Built His Brain Back

Hi Amy,

I have a Startup Life story that flips the script: What if a founder's neurodiversity + brain injury became the R&D for two companies?

October 2021: TBI from overdose. SPECT scan showed damage across temporal lobes, prefrontal cortex, basal ganglia. ADHD unspecified. Executive function: decimated. Memory: shattered. The clinical diagnosis: "You can't do what you used to."

The response: Don't rebuild what was lost. Engineer what never existed.

I catalogued 240+ tools—AI agents, n8n workflows, Base44 databases, GitHub repos—as cognitive prosthetics. Turned that inventory into FlashFusion (B2B AI enablement for enterprises) and Chaos Club Co. (peer support for people like me).

This is a Startup Life story because:
- It's about a founder who became his own product research
- It shows how neurodiversity + constraint breeds a specific kind of builder (diagnostic systems thinkers, not productivity optimizers)
- It's the angle on founder resilience nobody's writing: not "overcoming" but "reconstructing"
- The practical insight: If you can't remember, systematize. If you can't focus, automate. If isolation breaks you, you build community.

I'm based in Illinois, US-founded, but this resonates for European founders because neurodiversity discrimination is universal (96% of neurodiverse founders report discrimination—you reported that).

Angle: "The Founder Who Engineered His Own Mind"

I have:
- Completed TBI + addiction + homelessness timeline (confirmed)
- Two live companies with product (FlashFusion Skills Library 50+ production-ready skills; Chaos Club Co. launching Q2)
- Playbook + clinical documentation
- One-pager ready

Are you interested in a 1,500-2,000 word Startup Life profile on how a broken brain became a competitive advantage in building?

Kyle
abstrekkt.com`
  });

  const [assistance, setAssistance] = useState({ mit: '', sifted: '' });
  const [loading, setLoading] = useState({ mit: false, sifted: false });
  const [copied, setCopied] = useState({ mit: false, sifted: false });

  const publications = [
    {
      id: 'mit',
      name: 'MIT Technology Review',
      contact: 'Rachel Courtland',
      email: 'rachel.courtland@technologyreview.com',
      bestPractices: [
        'Subject line: "PITCH" + one-line hook',
        'Lead with the news angle (construction vs. recovery)',
        'Include: credentials, why this matters, how you\'d tell it',
        'Mention why you\'re qualified (lived experience + founder)',
        'Show what\'s been covered elsewhere (TBI memoirs, neurodiversity pieces)',
        'Explain your unique angle (tools as evidence, not inspiration)',
        'Expected: 4,000-5,500 words (feature)',
        'Response time: 1 week typical',
        'Rate: $1-3/word'
      ],
      tone: 'Technical + narrative. Lead with the how (cognitive reconstruction), not the why (inspiration).',
      audience: 'Readers who care about tech + human cognition intersection'
    },
    {
      id: 'sifted',
      name: 'Sifted',
      contact: 'Amy Lewin (editor) / news@sifted.eu',
      email: 'amy@sifted.eu or news@sifted.eu',
      bestPractices: [
        'Send to: amy@sifted.eu (editor) for Startup Life pieces',
        'Emphasize: founder story (not just health angle)',
        'Include: practical insight (how neurodiversity shaped building)',
        'Mention: European relevance (even though US-based, neurodiversity is global)',
        'Lead with the business angle (two live companies, product)',
        'Keep it under 2,000 words (Startup Life sweet spot)',
        'Tone: conversational, founder voice, practical wisdom',
        'They love: cultural trends, founder lessons, practical advice',
        'Avoid: medical jargon, recovery narrative'
      ],
      tone: 'Conversational founder voice. "Here\'s what I built because my brain is wired differently."',
      audience: 'European startup founders, operators, investors'
    }
  ];

  const refineEmail = async (pub) => {
    setLoading({ ...loading, [pub]: true });
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `You are a pitch refinement expert. The user is pitching their story to a tech journalist. Provide 2-3 specific, actionable improvements to make this pitch TIGHTER and MORE COMPELLING. Focus on: (1) hook strength, (2) newsworthiness clarity, (3) why THIS publication should care. Be direct, no fluff.\n\nCurrent pitch:\n\n${emails[pub]}\n\nProvide ONLY the improvements, not the full rewrite.`
            }
          ]
        })
      });

      const data = await response.json();
      const suggestions = data.content[0].text;
      setAssistance({ ...assistance, [pub]: suggestions });
    } catch (error) {
      setAssistance({ ...assistance, [pub]: 'Error getting suggestions. Try again.' });
    }
    setLoading({ ...loading, [pub]: false });
  };

  const copyEmail = (pub) => {
    navigator.clipboard.writeText(emails[pub]);
    setCopied({ ...copied, [pub]: true });
    setTimeout(() => setCopied({ ...copied, [pub]: false }), 2000);
  };

  const resetEmail = (pub) => {
    // Reset to default template
    if (pub === 'mit') {
      setEmails({ ...emails, mit: `Subject: PITCH — TBI + Addiction + 240+ Tools = The Construction Story Nobody's Told

Hi Rachel,

[Your pitch here...]` });
    } else {
      setEmails({ ...emails, sifted: `Subject: Founder Story — The Engineer Who Built His Brain Back

Hi Amy,

[Your pitch here...]` });
    }
    setAssistance({ ...assistance, [pub]: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Final Pitch Targets</h1>
          <p className="text-lg text-slate-600">2 publications. Built-in AI assistance. Ready to send tonight.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {publications.map((pub) => (
            <div key={pub.id} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{pub.name}</h2>
                    <p className="text-sm text-slate-600 mt-1">{pub.contact}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono bg-blue-200 text-blue-900 px-3 py-1 rounded">
                      {pub.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-900 mb-3 text-sm">Best Practices for This Publication</h3>
                <ul className="space-y-2">
                  {pub.bestPractices.map((practice, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Tone:</p>
                  <p className="text-sm text-blue-800">{pub.tone}</p>
                </div>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
                  <p className="text-xs font-semibold text-amber-900 mb-1">Target Audience:</p>
                  <p className="text-sm text-amber-800">{pub.audience}</p>
                </div>
              </div>

              {/* Pitch Email Editor */}
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Your Pitch Email</h3>
                <textarea
                  value={emails[pub.id]}
                  onChange={(e) => setEmails({ ...emails, [pub.id]: e.target.value })}
                  className="w-full h-96 p-3 border border-slate-300 rounded font-mono text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your pitch email here..."
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => copyEmail(pub.id)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded font-medium hover:bg-slate-800 transition"
                  >
                    <Copy size={16} />
                    {copied[pub.id] ? 'Copied!' : 'Copy Email'}
                  </button>
                  <button
                    onClick={() => refineEmail(pub.id)}
                    disabled={loading[pub.id]}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Zap size={16} />
                    {loading[pub.id] ? 'Refining...' : 'Get AI Assistance'}
                  </button>
                  <button
                    onClick={() => resetEmail(pub.id)}
                    className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded font-medium hover:bg-slate-300 transition"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>
              </div>

              {/* AI Assistance */}
              {assistance[pub.id] && (
                <div className="p-6 bg-amber-50 border-t border-amber-200">
                  <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                    <Zap size={16} className="text-amber-600" />
                    Claude's Suggestions for Improvement
                  </h4>
                  <div className="prose prose-sm text-amber-800 whitespace-pre-wrap">
                    {assistance[pub.id]}
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="p-6 bg-green-50 border-t border-green-200">
                <p className="text-sm text-green-900 font-medium mb-3">Ready to send?</p>
                <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
                  <li>Copy your email (button above)</li>
                  <li>Paste into your email client</li>
                  <li>Send to: <span className="font-mono font-bold">{pub.email}</span></li>
                  <li>Check for response in 5-7 days</li>
                </ol>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 bg-slate-900 text-white rounded-lg">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Send size={18} />
            Tonight's Game Plan
          </h3>
          <ul className="space-y-2 text-sm">
            <li>✅ <strong>MIT Technology Review:</strong> Rachel Courtland (rachel.courtland@technologyreview.com) — Response in 1 week</li>
            <li>✅ <strong>Sifted:</strong> Amy Lewin (amy@sifted.eu) — Startup Life beat, neurodiversity angle</li>
            <li>📋 Each email is personalized, best-practice optimized, and ready to copy-paste</li>
            <li>🔄 Use "Get AI Assistance" to refine further if needed</li>
            <li>📧 Send both tonight if ready, or batch them tomorrow morning</li>
          </ul>
        </div>
      </div>
    </div>
  );
}