import React, { useState } from 'react';
import { Heart, Share2, ExternalLink, ChevronDown } from 'lucide-react';

export default function HoldOnDad() {
  const [expandedSection, setExpandedSection] = useState('hero');
  const [shareMessage, setShareMessage] = useState('');

  const handleShare = async (text) => {
    const message = `"Hold On, Dad" – A song about why presence matters more than perfection.\n\n${text}\n\n988 (Suicide & Crisis Lifeline) | Crisis Text Line: text HOME to 741741`;
    
    if (navigator.share) {
      navigator.share({ title: 'Hold On, Dad', text: message });
    } else {
      navigator.clipboard.writeText(message);
      setShareMessage('Copied to clipboard');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 antialiased">
      {/* Crisis Banner - Always visible */}
      <div className="sticky top-0 z-50 bg-red-900/80 backdrop-blur border-b border-red-700 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 text-sm">
          <span className="font-medium">If you're in crisis right now:</span>
          <div className="flex gap-3">
            <a href="tel:988" className="font-bold hover:text-red-100 transition">
              Call 988
            </a>
            <span className="text-red-300">•</span>
            <a href="sms:741741?body=HOME" className="font-bold hover:text-red-100 transition">
              Text HOME to 741741
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Hold On, Dad
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              A letter from the future. A child, grown, writes back to a parent drowning in shame—telling him what he couldn't hear in the darkness: <span className="text-amber-300 font-medium">your presence was never a burden. Your survival was the promise I needed.</span>
            </p>
          </div>

          {/* Expandable Song Description */}
          <button
            onClick={() => setExpandedSection(expandedSection === 'description' ? 'hero' : 'description')}
            className="w-full text-left p-4 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 transition group"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="font-semibold text-amber-300">What This Song Is About</span>
              <ChevronDown className={`w-5 h-5 mt-1 transition-transform ${expandedSection === 'description' ? 'rotate-180' : ''}`} />
            </div>
            {expandedSection === 'description' && (
              <div className="mt-4 space-y-4 text-slate-300">
                <p>
                  This song cuts through the isolation of depression by asking the hardest question: "What if the person you think you're sparing is actually waiting for you?"
                </p>
                <p>
                  It challenges the lie that perfection, sobriety, or conquest is the price of love. Instead, it offers something quieter and fiercer—that showing up broken, making mistakes, breathing through the chaos is <span className="italic">exactly</span> what mattered.
                </p>
                <div className="pt-4 border-t border-slate-700 space-y-3 text-sm">
                  <p className="font-semibold text-slate-200">For anyone who's:</p>
                  <ul className="space-y-2 text-slate-400">
                    <li className="flex gap-3"><span className="text-amber-300">•</span> Felt like a burden to the people they love</li>
                    <li className="flex gap-3"><span className="text-amber-300">•</span> Believed that leaving would somehow ease the pain for others</li>
                    <li className="flex gap-3"><span className="text-amber-300">•</span> Struggled with shame that whispers you're not enough</li>
                    <li className="flex gap-3"><span className="text-amber-300">•</span> Wondered if survival was worth it</li>
                  </ul>
                </div>
              </div>
            )}
          </button>

          <button
            onClick={() => handleShare('This song speaks to the isolation of depression—and reminds us that presence, broken and trying, is enough.')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 transition font-medium text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share This Song
          </button>
          {shareMessage && <p className="text-sm text-green-400">{shareMessage}</p>}
        </section>

        {/* Why This Matters - From Kyle */}
        <section className="space-y-6 border-t border-slate-700 pt-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Why This Matters to Me</h2>
            <p className="text-slate-400 italic">— From me to you</p>
          </div>

          <div className="space-y-6 text-slate-300 leading-relaxed">
            <p>
              I wrote this because I know what it feels like when the voice in your head gets so loud that leaving seems like the kindest thing you could do—and I need you to know that <span className="text-amber-300 font-semibold">that voice is lying.</span>
            </p>

            <p>
              I'm a father, an engineer, someone who builds things for other people to trust. For the longest time, I couldn't apply that same care to myself. I thought I had to be perfect to deserve the people I love—until my daughter showed me that my broken, trying, real self was exactly what she needed.
            </p>

            <p>
              If you're reading this and you believe everyone would be better off without you, I'm telling you directly: <span className="text-amber-300 font-semibold">you're wrong.</span> And there's someone—maybe someone you don't even know about yet—whose entire future depends on you staying.
            </p>

            <p>
              I'm putting this out because shame dies in silence. Your presence isn't a burden; it's a promise. And showing up at all is everything.
            </p>
          </div>

          <button
            onClick={() => handleShare('If you're in the dark right now, know this: your presence matters. Shame dies in silence. Call 988 or text HOME to 741741.')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 transition font-medium text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share This Message
          </button>
        </section>

        {/* Resources - Always Accessible */}
        <section className="space-y-6 bg-slate-800/50 border border-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold">You're Not Alone</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-amber-300">In Immediate Crisis</h3>
              <p className="text-slate-400 text-sm mb-3">Call or text anytime, 24/7. Free. Confidential.</p>
              <div className="space-y-2">
                <a
                  href="tel:988"
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition group"
                >
                  <span className="font-semibold">Suicide & Crisis Lifeline</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </a>
                <a
                  href="sms:741741?body=HOME"
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition group"
                >
                  <span className="font-semibold">Crisis Text Line (text HOME to 741741)</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </a>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-700">
              <h3 className="font-semibold text-amber-300">Other Languages & Populations</h3>
              <a
                href="https://www.iasp.info/resources/Crisis_Centres/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition group"
              >
                <span className="font-semibold">International Association for Suicide Prevention</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
              </a>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-700">
              <h3 className="font-semibold text-amber-300">What to Expect</h3>
              <p className="text-slate-400 text-sm">
                You'll talk to a real person. No judgment. No pressure to "be okay." Just someone who understands what it's like when the weight gets too heavy.
              </p>
            </div>
          </div>
        </section>

        {/* Closing */}
        <section className="space-y-6 border-t border-slate-700 pt-12">
          <p className="text-lg text-slate-300 leading-relaxed">
            If you're in the dark right now—not for me, but for the person waiting for you in the future—reach out.
          </p>
          
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            <span className="text-slate-400">You're worth staying for.</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700 pt-8 pb-4">
          <p className="text-sm text-slate-500 text-center">
            "Hold On, Dad" was written from lived experience. <br />
            If this song resonates, please share it. Someone needs to hear it.
          </p>
        </footer>
      </div>
    </div>
  );
}
