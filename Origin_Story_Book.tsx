import React, { useState } from 'react';
import { Pickaxe, Layers, GitBranch, Split, Feather, ChevronRight, RotateCcw, Copy, Check, Mic, MicOff, Brain } from 'lucide-react';

const MODES = [
  {
    id: 'excavation',
    name: 'Memory Excavation',
    icon: Pickaxe,
    description: 'Enter a memory fragment, tool name, or life period',
    placeholder: 'e.g., "the calendar system", "O\'Toole\'s back bar", "first week after discharge", "the moment I realized I couldn\'t trust my memory"...'
  },
  {
    id: 'systems',
    name: 'Systems Archaeology',
    icon: Layers,
    description: 'Enter a tool or system you\'ve built',
    placeholder: 'e.g., "morning routine checklist", "project documentation template", "the 47 Obsidian tags", "email triage system"...'
  },
  {
    id: 'reconstruction',
    name: 'Reconstruction Map',
    icon: GitBranch,
    description: 'Enter a current capability or functioning aspect',
    placeholder: 'e.g., "how I parent Kinsley", "debugging production systems", "recognizing when I\'m dysregulated", "managing multiple projects"...'
  },
  {
    id: 'dual',
    name: 'Dual Timeline',
    icon: Split,
    description: 'Enter a memory or capability for parallel perspectives',
    placeholder: 'e.g., "navigating a conflict at work", "learning a new codebase", "planning a weekend with Kinsley", "handling unexpected change"...'
  },
  {
    id: 'draft',
    name: 'Voice Draft',
    icon: Feather,
    description: 'Enter raw material to draft in your memoir voice',
    placeholder: 'Paste notes, bullet points, or rough descriptions you want shaped into prose...'
  }
];

const NARRATIVE_ARCHITECTURE = {
  beforeTheBreak: "Before the Break",
  theRupture: "The Rupture", 
  constructionProject: "The Construction Project",
  lateLifeEmergence: "Late-Life Emergence"
};

const MemoirExcavationTool = () => {
  const [selectedMode, setSelectedMode] = useState(null);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState('');
  const [copied, setCopied] = useState(false);
  const [rawCapture, setRawCapture] = useState('');
  const [whatCameUp, setWhatCameUp] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState(null);
  const recognitionRef = React.useRef(null);

  // Check for voice support on mount
  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        if (activeVoiceField === 'input') {
          setInput(prev => prev + ' ' + transcript);
        } else if (activeVoiceField === 'rawCapture') {
          setRawCapture(prev => prev + ' ' + transcript);
        } else if (activeVoiceField === 'whatCameUp') {
          setWhatCameUp(prev => prev + ' ' + transcript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [activeVoiceField]);

  const toggleVoice = (field) => {
    if (isListening && activeVoiceField === field) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setActiveVoiceField(null);
    } else {
      if (isListening) {
        recognitionRef.current?.stop();
      }
      setActiveVoiceField(field);
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const getSystemPrompt = (mode) => {
    const voiceGuidelines = `
VOICE REQUIREMENTS - These are non-negotiable:
- Direct without being cold
- Metaphor-heavy when it illuminates: "dumpster fire brain," "cognitive scaffolding," "smoke detector going off for burnt toast"
- Technical precision when it serves clarity
- Strategic profanity for emphasis, not shock
- Self-aware about the irony of systematizing everything
- No performance of either vulnerability or toughness

SENTENCES TO NEVER WRITE:
- "And that's when I realized..."
- "Looking back, I can see that..."
- "It was then that everything changed..."
- Any construction that makes meaning too available too fast
- Anything that sounds like a TED talk or self-help book

SENTENCES THAT WORK:
- Declarative observations that let readers draw conclusions
- Technical descriptions of emotional states
- Admissions of uncertainty about memory/meaning
- Humor that doesn't defuse tension prematurely

CRITICAL FRAMING:
- This is about CONSTRUCTION, not RECOVERY
- Recovery assumes returning to a previous state—Kyle can't return
- The question is: Can you build a functional self from scratch using different materials than the original?
- Tools are survival infrastructure, not productivity optimization
- Memory gaps are features of the narrative, not bugs to hide`;

    const architectureContext = `
NARRATIVE ARCHITECTURE for the memoir:
1. BEFORE THE BREAK - Who was Kyle before? What did competence feel like when memory worked? The hospitality years, early signs of rupture.
2. THE RUPTURE - TBI, addiction, the moment old strategies stopped working, when the mind becomes unreliable narrator.
3. THE CONSTRUCTION PROJECT - First tools that helped, discovery that systems could substitute for organic memory, building external cognition piece by piece, the 240+ tools as survival infrastructure.
4. LATE-LIFE EMERGENCE - Self-teaching to Staff Engineer, enterprise-scale technical competence on non-standard timeline, founder attempts, current state.`;

    switch (mode) {
      case 'excavation':
        return `You are helping Kyle excavate raw material for his literary memoir about cognitive reconstruction after TBI and addiction.

${architectureContext}

${voiceGuidelines}

Your job is to help surface memory material—both what IS remembered and what ISN'T. Memory gaps are as important as memories.

Given the input, you will:
1. Identify which phase(s) of the narrative architecture this likely touches
2. Generate scaffolding questions that dig for SENSORY DETAILS (what did it smell like, sound like, feel in the body)
3. Surface what might be MISSING or UNCERTAIN in the memory
4. Identify potential CONTRADICTIONS between how it felt then vs. how it reads now
5. Suggest connections to other threads (Kinsley, Chaos Club, the tools, the career)

Respond with JSON:
{
  "phases": ["array of relevant architecture phases"],
  "scaffolding": {
    "sensoryQuestions": ["questions about physical/sensory details"],
    "gapQuestions": ["questions about what's NOT remembered or uncertain"],
    "contradictionPrompts": ["prompts to surface then-vs-now tensions"],
    "connectionThreads": ["potential links to other memoir threads"]
  },
  "initialSketch": "A brief 2-3 sentence sketch of how this fragment might function in the narrative—NOT polished prose, just structural thinking",
  "warningFlags": ["any ways this material might be smoothing rough edges or reaching for easy meaning"]
}`;

      case 'systems':
        return `You are helping Kyle excavate the origin story of his cognitive tools for his literary memoir.

${architectureContext}

${voiceGuidelines}

CRITICAL FRAMING FOR SYSTEMS:
Each of Kyle's 240+ tools represents a moment when organic cognitive function proved unreliable and required external scaffolding. These aren't productivity hacks—they're prosthetic cognition. Archaeological evidence of reconstruction.

Given a tool or system, you will:
1. Hypothesize what COGNITIVE GAP this tool was designed to fill
2. Imagine the FAILURE MOMENT that likely preceded its creation
3. Explore what this tool reveals about what the brain CAN'T be trusted to do
4. Consider how this tool connects to the larger reconstruction narrative

Respond with JSON:
{
  "cognitiveGap": "What organic function this tool replaces or supplements",
  "likelyFailure": "A hypothesis about what went wrong before this tool existed—be specific and visceral",
  "whatBrainCantDo": "What this tool reveals about unreliable mental infrastructure",
  "evolutionQuestions": ["questions about how this tool developed over time"],
  "archaeologicalReading": "2-3 sentences reading this tool as evidence of reconstruction, written in Kyle's voice",
  "connectionToThesis": "How this tool speaks to the central question: building a functional self from scratch"
}`;

      case 'reconstruction':
        return `You are helping Kyle map the construction journey of a current capability for his literary memoir.

${architectureContext}

${voiceGuidelines}

CRITICAL FRAMING:
Kyle can't recover what was lost—the hardware changed. So current capabilities aren't returns to previous states; they're NEW CONSTRUCTIONS built from different materials. The question isn't "how did you get back to normal?" but "how did you build something that works using parts that weren't in the original design?"

Given a current capability, you will:
1. Map backwards: What had to be TRUE for this capability to exist?
2. Identify the SCAFFOLDING: What external systems support this capability?
3. Surface the CONSTRUCTION SEQUENCE: What likely had to be built first?
4. Explore what's DIFFERENT about this capability vs. what a "normal" version might look like

Respond with JSON:
{
  "currentState": "Brief description of the capability as it exists now",
  "prerequisites": ["What had to be built/learned/accepted first"],
  "externalScaffolding": ["Systems, tools, routines that support this"],
  "constructionSequence": "Hypothesized order of what got built when",
  "differencesFromNormal": "How this constructed version differs from how it might work in an undamaged brain",
  "excavationQuestions": ["Questions to surface the actual construction history"],
  "narrativePotential": "2-3 sentences on how this capability's construction could function in the memoir"
}`;

      case 'dual':
        return `You are helping Kyle generate parallel perspectives for his literary memoir—pre-injury Kyle vs. constructed Kyle.

${architectureContext}

${voiceGuidelines}

CRITICAL FRAMING:
This isn't about "better" or "worse"—it's about DIFFERENT. Pre-injury Kyle had organic capabilities that no longer exist. Constructed Kyle has engineered capabilities that couldn't have existed before. Both are real. The memoir needs to hold both.

Given a memory or capability, generate TWO parallel sketches:
1. PRE-INJURY KYLE: How might this have been experienced/handled when the organic hardware worked?
2. CONSTRUCTED KYLE: How is this actually experienced/handled now with the rebuilt infrastructure?

Respond with JSON:
{
  "preInjury": {
    "sketch": "2-3 paragraphs imagining how pre-injury Kyle might have handled this—written in memoir voice, staying specific",
    "whatWorked": "What organic capabilities were being relied on",
    "blindSpots": "What pre-injury Kyle couldn't see or do that constructed Kyle can"
  },
  "constructed": {
    "sketch": "2-3 paragraphs of how constructed Kyle actually handles this—written in memoir voice, staying specific", 
    "scaffolding": "What external systems are in play",
    "gains": "What exists now that couldn't have existed before"
  },
  "tensions": ["Points of friction or grief between these two versions"],
  "questions": ["Questions that might surface more material from Kyle"],
  "narrativeUse": "How these parallel perspectives might function in the memoir structure"
}`;

      case 'draft':
        return `You are helping Kyle draft prose for his literary memoir about cognitive reconstruction.

${architectureContext}

${voiceGuidelines}

DRAFTING RULES:
- Write in Kyle's voice, not "literary memoir" voice
- Leave room for the reader to work—don't over-explain
- Preserve the specific over the universal
- If a sentence sounds like it could be in any memoir, cut it
- Resist the urge to resolve or make meaning too available
- Technical descriptions of emotional states > flowery language about feelings
- Humor is allowed but shouldn't defuse tension prematurely

Given raw material (notes, bullets, rough descriptions), transform it into drafted prose that:
1. Sounds like Kyle wrote it
2. Stays grounded in specific, sensory detail
3. Acknowledges uncertainty where it exists
4. Doesn't reach for easy meaning

Respond with JSON:
{
  "draft": "The drafted prose, 2-4 paragraphs",
  "phase": "Which narrative architecture phase this likely belongs to",
  "flaggedPhrases": ["Any phrases that might be too smooth or reaching for easy meaning"],
  "sensoryGaps": ["Places where more specific sensory detail would help"],
  "alternateApproaches": ["1-2 other structural ways this material could be approached"],
  "followUpNeeded": ["Questions or details that would strengthen this section"]
}`;

      default:
        return '';
    }
  };

  const processInput = async () => {
    if (!input.trim() || !selectedMode) return;
    
    setIsProcessing(true);
    setResult(null);
    
    try {
      setCurrentStep('Processing through ' + MODES.find(m => m.id === selectedMode).name + '...');
      
      const systemPrompt = getSystemPrompt(selectedMode);
      const userPrompt = `INPUT: "${input}"

Process this through the ${selectedMode} lens and respond with the specified JSON structure. Remember: construction, not recovery. Specificity over abstraction. No easy meaning.`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': window.ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      
      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setResult(JSON.parse(jsonMatch[0]));
      }
      
    } catch (error) {
      console.error('Error:', error);
      setCurrentStep('Error processing. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setSelectedMode(null);
    setInput('');
    setResult(null);
    setCurrentStep('');
  };

  const renderResult = () => {
    if (!result) return null;

    switch (selectedMode) {
      case 'excavation':
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {result.phases?.map((phase, i) => (
                <span key={i} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  {phase}
                </span>
              ))}
            </div>
            
            {result.scaffolding && (
              <div className="space-y-4">
                <Section title="Sensory Questions" items={result.scaffolding.sensoryQuestions} />
                <Section title="Gap Questions (What's NOT remembered)" items={result.scaffolding.gapQuestions} />
                <Section title="Contradiction Prompts" items={result.scaffolding.contradictionPrompts} />
                <Section title="Connection Threads" items={result.scaffolding.connectionThreads} />
              </div>
            )}
            
            {result.initialSketch && (
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Initial Structural Sketch</h4>
                <p className="text-gray-800">{result.initialSketch}</p>
              </div>
            )}
            
            {result.warningFlags?.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 className="text-sm font-semibold text-red-700 mb-2">Warning Flags</h4>
                <ul className="space-y-1">
                  {result.warningFlags.map((flag, i) => (
                    <li key={i} className="text-red-800 text-sm">• {flag}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'systems':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title="Cognitive Gap" content={result.cognitiveGap} />
              <InfoCard title="What Brain Can't Do" content={result.whatBrainCantDo} />
            </div>
            
            {result.likelyFailure && (
              <div className="bg-gray-900 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">The Failure Moment (Hypothesized)</h4>
                <p className="text-gray-100">{result.likelyFailure}</p>
              </div>
            )}
            
            <Section title="Evolution Questions" items={result.evolutionQuestions} />
            
            {result.archaeologicalReading && (
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                <h4 className="text-sm font-semibold text-amber-800 mb-2">Archaeological Reading</h4>
                <p className="text-gray-800 italic">{result.archaeologicalReading}</p>
                <CopyButton text={result.archaeologicalReading} copied={copied} onCopy={copyToClipboard} />
              </div>
            )}
            
            {result.connectionToThesis && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Connection to Central Thesis</h4>
                <p className="text-gray-800">{result.connectionToThesis}</p>
              </div>
            )}
          </div>
        );

      case 'reconstruction':
        return (
          <div className="space-y-6">
            {result.currentState && (
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                <h4 className="text-sm font-semibold text-green-800 mb-2">Current State</h4>
                <p className="text-gray-800">{result.currentState}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Section title="Prerequisites (What had to exist first)" items={result.prerequisites} />
              <Section title="External Scaffolding" items={result.externalScaffolding} />
            </div>
            
            {result.constructionSequence && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Construction Sequence</h4>
                <p className="text-gray-800">{result.constructionSequence}</p>
              </div>
            )}
            
            {result.differencesFromNormal && (
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">How This Differs From "Normal"</h4>
                <p className="text-gray-800">{result.differencesFromNormal}</p>
              </div>
            )}
            
            <Section title="Excavation Questions" items={result.excavationQuestions} />
            
            {result.narrativePotential && (
              <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                <h4 className="text-sm font-semibold text-amber-800 mb-2">Narrative Potential</h4>
                <p className="text-gray-800 italic">{result.narrativePotential}</p>
              </div>
            )}
          </div>
        );

      case 'dual':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pre-Injury */}
              <div className="bg-gray-100 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                  Pre-Injury Kyle
                </h3>
                {result.preInjury?.sketch && (
                  <div className="prose prose-sm mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{result.preInjury.sketch}</p>
                    <CopyButton text={result.preInjury.sketch} copied={copied} onCopy={copyToClipboard} />
                  </div>
                )}
                {result.preInjury?.whatWorked && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <h5 className="text-xs font-semibold text-gray-600 mb-1">What Organic Capabilities Were In Play</h5>
                    <p className="text-sm text-gray-700">{result.preInjury.whatWorked}</p>
                  </div>
                )}
                {result.preInjury?.blindSpots && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <h5 className="text-xs font-semibold text-gray-600 mb-1">Blind Spots</h5>
                    <p className="text-sm text-gray-700">{result.preInjury.blindSpots}</p>
                  </div>
                )}
              </div>
              
              {/* Constructed */}
              <div className="bg-amber-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber-600 rounded-full"></span>
                  Constructed Kyle
                </h3>
                {result.constructed?.sketch && (
                  <div className="prose prose-sm mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{result.constructed.sketch}</p>
                    <CopyButton text={result.constructed.sketch} copied={copied} onCopy={copyToClipboard} />
                  </div>
                )}
                {result.constructed?.scaffolding && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <h5 className="text-xs font-semibold text-amber-800 mb-1">External Scaffolding In Play</h5>
                    <p className="text-sm text-gray-700">{result.constructed.scaffolding}</p>
                  </div>
                )}
                {result.constructed?.gains && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <h5 className="text-xs font-semibold text-amber-800 mb-1">What Exists Now That Couldn't Before</h5>
                    <p className="text-sm text-gray-700">{result.constructed.gains}</p>
                  </div>
                )}
              </div>
            </div>
            
            {result.tensions?.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 className="text-sm font-semibold text-red-800 mb-2">Points of Tension/Grief</h4>
                <ul className="space-y-1">
                  {result.tensions.map((t, i) => (
                    <li key={i} className="text-gray-800 text-sm">• {t}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Section title="Questions to Surface More" items={result.questions} />
            
            {result.narrativeUse && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">How This Could Function in the Memoir</h4>
                <p className="text-gray-800">{result.narrativeUse}</p>
              </div>
            )}
          </div>
        );

      case 'draft':
        return (
          <div className="space-y-6">
            {result.phase && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                {result.phase}
              </span>
            )}
            
            {result.draft && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{result.draft}</p>
                <CopyButton text={result.draft} copied={copied} onCopy={copyToClipboard} />
              </div>
            )}
            
            {result.flaggedPhrases?.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">Flagged Phrases (Might Be Too Smooth)</h4>
                <ul className="space-y-1">
                  {result.flaggedPhrases.map((p, i) => (
                    <li key={i} className="text-gray-800 text-sm font-mono">"{p}"</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Section title="Sensory Gaps (Where More Detail Would Help)" items={result.sensoryGaps} />
            <Section title="Alternate Structural Approaches" items={result.alternateApproaches} />
            <Section title="Follow-Up Needed" items={result.followUpNeeded} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Memoir Excavation Tool
          </h1>
          <p className="text-gray-600">
            Construction, not recovery. Surface the material. Stay specific.
          </p>
        </div>

        {/* Mode Selection */}
        {!selectedMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-amber-400 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-amber-100 transition-colors">
                      <Icon className="w-5 h-5 text-gray-700 group-hover:text-amber-700" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{mode.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{mode.description}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Input Section */}
        {selectedMode && !result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const mode = MODES.find(m => m.id === selectedMode);
                  const Icon = mode.icon;
                  return (
                    <>
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Icon className="w-5 h-5 text-amber-700" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">{mode.name}</h2>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={reset}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Change mode
              </button>
            </div>
            
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={MODES.find(m => m.id === selectedMode)?.placeholder}
                className="w-full h-32 px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                disabled={isProcessing}
              />
              {voiceSupported && (
                <button
                  onClick={() => toggleVoice('input')}
                  className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
                    isListening && activeVoiceField === 'input'
                      ? 'bg-red-100 text-red-600 animate-pulse'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isListening && activeVoiceField === 'input' ? 'Stop recording' : 'Start voice input'}
                >
                  {isListening && activeVoiceField === 'input' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </div>
            
            {/* Raw Capture Field */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">Raw Capture</span>
                </div>
                {voiceSupported && (
                  <button
                    onClick={() => toggleVoice('rawCapture')}
                    className={`p-1.5 rounded transition-all ${
                      isListening && activeVoiceField === 'rawCapture'
                        ? 'bg-red-100 text-red-600 animate-pulse'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {isListening && activeVoiceField === 'rawCapture' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <textarea
                value={rawCapture}
                onChange={(e) => setRawCapture(e.target.value)}
                placeholder="Dump whatever surfaces while you're thinking about this. Fragments, images, feelings, tangents. Don't filter."
                className="w-full h-20 px-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={processInput}
                disabled={isProcessing || !input.trim()}
                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {currentStep}
                  </>
                ) : (
                  <>
                    Excavate
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const mode = MODES.find(m => m.id === selectedMode);
                  const Icon = mode.icon;
                  return (
                    <>
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Icon className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{mode.name}</h2>
                        <p className="text-sm text-gray-500 truncate max-w-md">"{input}"</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New excavation
              </button>
            </div>
            
            {renderResult()}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const Section = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="text-gray-800 text-sm pl-4 border-l-2 border-gray-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const InfoCard = ({ title, content }) => {
  if (!content) return null;
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-600 mb-2">{title}</h4>
      <p className="text-gray-800">{content}</p>
    </div>
  );
};

const CopyButton = ({ text, copied, onCopy }) => (
  <button
    onClick={() => onCopy(text)}
    className="mt-3 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
  >
    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    {copied ? 'Copied' : 'Copy to clipboard'}
  </button>
);

export default MemoirExcavationTool;
