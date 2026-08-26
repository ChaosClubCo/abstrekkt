import { useState } from "react";

const voiceData = {
  dna: {
    title: "Your Voice DNA",
    subtitle: "What makes Kyle's writing unmistakably Kyle's",
    traits: [
      {
        name: "Systems Thinker Writing for Humans",
        description:
          "You explain complex things through engineering metaphors — but you never lose the person inside the system. Your brain maps everything to architecture, scaffolding, and infrastructure. That's your superpower.",
        example: {
          bad: "I developed coping mechanisms to manage my cognitive challenges after my injury.",
          good: "My brain's hardware got corrupted. So I built external systems to do what the internal ones couldn't. 240 of them, actually.",
        },
      },
      {
        name: "Strategic Profanity as Punctuation",
        description:
          "You don't curse for shock. You curse for emphasis — like a drummer hitting a cymbal at exactly the right moment. It signals authenticity and breaks through the noise of polished corporate nothing.",
        example: {
          bad: "Embrace the challenges. Make room for the positive outcomes.",
          good: "Embrace the mess. Make room for the good shit.",
        },
      },
      {
        name: "Anti-Toxic-Positivity Directness",
        description:
          'You say what\'s true, not what sounds nice. You don\'t pretend struggle is a "gift" or failure is a "lesson." You acknowledge the mess first, then offer something real.',
        example: {
          bad: "Every setback is just a setup for a comeback! Believe in yourself!",
          good: "Chaos is normal. Pretending isn't. Growth is uncomfortable. You in?",
        },
      },
      {
        name: "Dumpster Fire Metaphors",
        description:
          "Your metaphors are vivid, grounded, slightly absurd, and always land because they're drawn from real experience rather than writing workshops. They make abstract concepts tangible.",
        example: {
          bad: "Managing anxiety is like navigating turbulent waters.",
          good: "Your brain is a dumpster fire. That smoke detector going off? It's reacting to burnt toast, not an actual emergency.",
        },
      },
      {
        name: "Technical Precision Meets Emotional Truth",
        description:
          "You can describe a feeling with the specificity of a bug report. This is rare. Most writers do emotion OR precision. You do both at the same time.",
        example: {
          bad: "I felt really lost and confused after what happened.",
          good: "Memory doesn't fail gracefully. It doesn't give you an error code or a stack trace. One day you just reach for something that should be there — and it isn't.",
        },
      },
      {
        name: "Earned Authority, Not Credentialed Authority",
        description:
          "You don't cite degrees or titles. Your authority comes from having built the thing, survived the thing, figured out the thing. That self-taught trajectory IS your credential.",
        example: {
          bad: "As a Staff Engineer with extensive experience in application security...",
          good: "No CS degree. Bartender to Staff Engineer. I learned to code because I needed my brain to work differently — and it turns out, that's exactly what code does.",
        },
      },
    ],
  },
  contexts: {
    title: "Voice Across Contexts",
    subtitle: "Same DNA, different volume",
    modes: [
      {
        name: "Memoir / Personal Writing",
        icon: "📖",
        color: "#6B46C1",
        volume: "Full",
        description: "All dials up. Raw, metaphor-dense, profanity where it earns its place. This is where the voice lives unfiltered.",
        rules: [
          "Let memory gaps be visible — don't smooth them over",
          "Technical descriptions of emotional states > poetic abstraction",
          "If a sentence could appear in a self-help book, rewrite it",
          "Declarative observations. Let the reader do the meaning-making.",
          "Strategic silence. Not every thought needs three more sentences.",
        ],
        sample:
          "Recovery assumes you're going back somewhere. I can't go back — the injury changed the hardware. So the question isn't recovery. It's construction. Can you build a functional self from scratch using different materials than the original?",
      },
      {
        name: "Chaos Club / Brand Voice",
        icon: "🔥",
        color: "#EC4899",
        volume: "High",
        description: "Almost full volume but directed outward. You're writing TO someone navigating chaos, not about yourself navigating it.",
        rules: [
          "Lead with the reader's reality, not your philosophy",
          "Profanity is permission — it says 'this isn't a clinical space'",
          "Every brand pillar is a sentence that could be the only one someone reads today",
          "Normalize struggle without romanticizing it",
          "Community language: 'we' and 'you belong' > 'I' and 'you should'",
        ],
        sample:
          "No masks required. No perfection expected. You belong here — especially on the messy days. Chaos isn't a problem to solve. It's a reality to navigate with wit, grit, and grounded tools.",
      },
      {
        name: "Technical / Thought Leadership",
        icon: "⚡",
        color: "#F59E0B",
        volume: "Medium",
        description: "The systems brain leads, but the human is always visible underneath. You explain complex security or platform concepts the way a sharp bartender explains a drink — with precision and no pretension.",
        rules: [
          "Open with the problem, not the solution",
          "One good metaphor > three paragraphs of explanation",
          "Self-taught perspective is an asset — use it",
          "Show your thinking, not just your conclusions",
          "If you wouldn't say it to a junior engineer at a whiteboard, rewrite it",
        ],
        sample:
          "AppSec isn't a gate you add at the end. It's plumbing. You either build it into the foundation or you're paying to rip up floors later. I learned this the hard way — self-taught engineers don't get the luxury of 'someone else handles security.'",
      },
      {
        name: "LinkedIn / Professional Brand",
        icon: "💼",
        color: "#06B6D4",
        volume: "Low-Medium",
        description: "Most restrained version — but still recognizably you. The directness stays. The metaphors stay. The profanity mostly takes a seat. Your non-linear path is the story.",
        rules: [
          "Lead with a specific insight or observation, never a platitude",
          "Your bartender-to-Staff-Engineer arc speaks louder than credentials",
          "One strategic 'hell' or 'damn' per post max — deployed for impact",
          "Short paragraphs. One idea per paragraph. White space is your friend.",
          "End with a question or observation, never 'like and share'",
        ],
        sample:
          "I built 240 systems to compensate for a brain that doesn't store things the way it used to. Most people would call that obsessive. I call it engineering. Turns out the skills you build to survive cognitive disruption — documentation, externalized memory, systematic approaches to everything — translate directly to enterprise-scale platform work.",
      },
      {
        name: "Internal Comms & Documentation",
        icon: "📋",
        color: "#10B981",
        volume: "Low",
        description: "Quietest version. Precision dominates, but warmth is still there. You respect your reader's time while making complex things accessible.",
        rules: [
          "State the context, the problem, the recommendation — in that order",
          "One metaphor per doc to anchor the concept",
          "Direct language ≠ cold language. 'Here's what I'd recommend' > 'Per the requirements'",
          "If someone could skim this in 2 minutes, you wrote it right",
          "End with clear next steps, not summaries of what you just said",
        ],
        sample:
          "The auth layer has three single points of failure. Think of it like a building with three doors that all use the same key — lose one key and you've lost the building. Here's the remediation plan, prioritized by blast radius.",
      },
    ],
  },
  antiPatterns: {
    title: "The Anti-Kyle Detector",
    subtitle: "If you catch yourself writing any of this — stop, rewrite",
    patterns: [
      {
        category: "AI Slop Phrases",
        icon: "🤖",
        items: [
          '"Let\'s dive in" / "dive deep"',
          '"Unlock your potential"',
          '"In today\'s fast-paced world"',
          '"Game-changer" / "Revolutionary"',
          '"Seamlessly" / "Synergy"',
          '"Leverage" (as a verb, outside of technical contexts)',
          '"At the end of the day"',
          '"It\'s important to note that"',
        ],
      },
      {
        category: "Recovery Memoir Clichés",
        icon: "🚫",
        items: [
          '"And that\'s when I realized..."',
          '"Looking back, I can see that..."',
          '"It was then that everything changed..."',
          '"Rock bottom became the solid foundation..."',
          '"I found myself" / "I discovered who I really was"',
          '"Grateful for the journey"',
          "Any sentence that makes meaning too available too fast",
        ],
      },
      {
        category: "Corporate Emptiness",
        icon: "💀",
        items: [
          '"Per my previous communication"',
          '"Moving forward" (without specifics)',
          '"Thought leader" / "Visionary"',
          '"Passionate about" (followed by generic concept)',
          '"Results-driven" / "Solutions-oriented"',
          '"Circle back" / "Touch base"',
          "Any sentence a LinkedIn influencer would post unironically",
        ],
      },
      {
        category: "Toxic Positivity Leaks",
        icon: "🌈",
        items: [
          '"Everything happens for a reason"',
          '"Just stay positive!"',
          '"Failure is just a stepping stone"',
          '"If you believe it, you can achieve it"',
          '"Choose happiness"',
          '"Your only limit is yourself"',
          "Any sentence that treats struggle as a branding opportunity",
        ],
      },
    ],
  },
  toolkit: {
    title: "The Kyle Voice Toolkit",
    subtitle: "Practical moves to deploy across any context",
    tools: [
      {
        name: "The Bartender Open",
        description:
          "Start by reading the room, not announcing your topic. A good bartender notices what someone needs before they order. Your writing should do the same — open with the problem your reader is already feeling.",
        before: "In this article, I'll explore the challenges of application security in modern organizations.",
        after: "Your auth layer has three doors that all use the same key. Let's talk about why that's a problem before someone else finds it.",
      },
      {
        name: "The System Metaphor",
        description:
          "Translate abstract concepts into physical/mechanical metaphors drawn from your actual experience — construction, infrastructure, bartending, brain hardware. One grounded metaphor does more than five paragraphs of explanation.",
        before: "Implementing cognitive behavioral strategies helped me manage recurring intrusive thoughts.",
        after: "I built a smoke detector calibration system for my brain. It still goes off — but now I can tell the difference between burnt toast and an actual fire.",
      },
      {
        name: "The Honest Admission",
        description:
          "State what you don't know, can't remember, or got wrong. This is your anti-corporate-bullshit move. It builds more trust in one sentence than a page of qualifications.",
        before: "Drawing from my extensive experience in platform engineering...",
        after: "I've been wrong about this before. Here's what I've learned since — and what I'm still figuring out.",
      },
      {
        name: "The Precision Feeling",
        description:
          "Describe emotions with the specificity of a technical report. Don't say 'sad' — describe the exact malfunction. This is where your engineer brain and your human heart collide, and it's where your best writing lives.",
        before: "Dropping off my daughter on Sundays is really hard.",
        after: "The Sunday goodbye isn't grief. It's a specific kind of system failure — every routine you built together over the weekend decompiles in the 15 minutes between 'shoes on, kiddo' and the rearview mirror.",
      },
      {
        name: "The Strategic F-Bomb",
        description:
          "One well-placed profanity does more than twenty exclamation points. Use it to break through politeness barriers, signal authenticity, or punctuate a point that needs to land hard. Never for shock. Always for emphasis.",
        before: "Embrace the challenges life throws at you! Make room for the positive things!",
        after: "Embrace the mess. Make room for the good shit.",
      },
      {
        name: "The Quiet Close",
        description:
          "End with an observation or a question, not a summary or a call to action. Let the last sentence sit. Your best writing trusts the reader to carry the thought forward.",
        before: "In conclusion, building systems for cognitive support has been transformative for my career and personal life. I hope this inspires others to find their own path.",
        after: "240 systems. Not because I'm organized. Because I can't afford not to be. That distinction matters more than I can explain.",
      },
    ],
  },
};

const tabs = [
  { id: "dna", label: "Voice DNA", icon: "🧬" },
  { id: "contexts", label: "Contexts", icon: "🎛️" },
  { id: "antiPatterns", label: "Anti-Patterns", icon: "🚨" },
  { id: "toolkit", label: "Toolkit", icon: "🔧" },
];

export default function VoiceDNA() {
  const [activeTab, setActiveTab] = useState("dna");
  const [expandedTrait, setExpandedTrait] = useState(null);
  const [expandedMode, setExpandedMode] = useState(0);
  const [expandedTool, setExpandedTool] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#e8e6e3",
        fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "2.5rem 2rem 1.5rem",
          borderBottom: "1px solid rgba(107, 70, 193, 0.3)",
          background:
            "linear-gradient(180deg, rgba(107, 70, 193, 0.08) 0%, transparent 100%)",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#6B46C1",
              marginBottom: "0.5rem",
            }}
          >
            Kyle's Writing System v1.0
          </div>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.2,
              background:
                "linear-gradient(135deg, #e8e6e3 0%, #6B46C1 50%, #EC4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Voice DNA
          </h1>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#8a8686",
              marginTop: "0.5rem",
              fontFamily: "'Georgia', serif",
              fontStyle: "italic",
            }}
          >
            A technical manual for writing like someone whose brain required
            external scaffolding — and who built it anyway.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(10, 10, 15, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(107, 70, 193, 0.15)",
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            display: "flex",
            gap: 0,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "0.9rem 0.5rem",
                background: "transparent",
                border: "none",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid #6B46C1"
                    : "2px solid transparent",
                color: activeTab === tab.id ? "#e8e6e3" : "#5a5858",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontFamily: "inherit",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
              }}
            >
              <span style={{ marginRight: "0.4rem" }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 2rem 4rem" }}>
        {/* DNA Tab */}
        {activeTab === "dna" && (
          <div>
            <SectionHeader
              title={voiceData.dna.title}
              subtitle={voiceData.dna.subtitle}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {voiceData.dna.traits.map((trait, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setExpandedTrait(expandedTrait === i ? null : i)
                  }
                  style={{
                    border: "1px solid rgba(107, 70, 193, 0.2)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    borderColor:
                      expandedTrait === i
                        ? "rgba(107, 70, 193, 0.5)"
                        : "rgba(107, 70, 193, 0.2)",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background:
                        expandedTrait === i
                          ? "rgba(107, 70, 193, 0.08)"
                          : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "#6B46C1",
                          fontWeight: 600,
                          minWidth: "1.5rem",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        {trait.name}
                      </span>
                    </div>
                    <span
                      style={{
                        color: "#6B46C1",
                        fontSize: "0.8rem",
                        transform:
                          expandedTrait === i
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      →
                    </span>
                  </div>
                  {expandedTrait === i && (
                    <div style={{ padding: "0 1.25rem 1.25rem" }}>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          lineHeight: 1.7,
                          color: "#b0adad",
                          margin: "0 0 1rem",
                          fontFamily: "'Georgia', serif",
                        }}
                      >
                        {trait.description}
                      </p>
                      <ComparisonBlock
                        bad={trait.example.bad}
                        good={trait.example.good}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contexts Tab */}
        {activeTab === "contexts" && (
          <div>
            <SectionHeader
              title={voiceData.contexts.title}
              subtitle={voiceData.contexts.subtitle}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {voiceData.contexts.modes.map((mode, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setExpandedMode(expandedMode === i ? null : i)
                  }
                  style={{
                    border: `1px solid ${expandedMode === i ? mode.color + "66" : "rgba(107, 70, 193, 0.15)"}`,
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background:
                        expandedMode === i
                          ? `${mode.color}11`
                          : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>{mode.icon}</span>
                      <div>
                        <span
                          style={{ fontSize: "0.85rem", fontWeight: 600 }}
                        >
                          {mode.name}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginTop: "0.25rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.6rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                              color: mode.color,
                            }}
                          >
                            Volume: {mode.volume}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              gap: "2px",
                            }}
                          >
                            {[1, 2, 3, 4, 5].map((bar) => {
                              const vol = { Full: 5, High: 4, Medium: 3, "Low-Medium": 2, Low: 1 };
                              return (
                                <div
                                  key={bar}
                                  style={{
                                    width: "3px",
                                    height: `${bar * 3 + 4}px`,
                                    borderRadius: "1px",
                                    background:
                                      bar <= (vol[mode.volume] || 3)
                                        ? mode.color
                                        : "rgba(255,255,255,0.1)",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        color: mode.color,
                        fontSize: "0.8rem",
                        transform:
                          expandedMode === i
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      →
                    </span>
                  </div>
                  {expandedMode === i && (
                    <div style={{ padding: "0 1.25rem 1.25rem" }}>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          lineHeight: 1.6,
                          color: "#b0adad",
                          margin: "0 0 1rem",
                          fontFamily: "'Georgia', serif",
                        }}
                      >
                        {mode.description}
                      </p>
                      <div style={{ marginBottom: "1rem" }}>
                        <div
                          style={{
                            fontSize: "0.65rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: mode.color,
                            marginBottom: "0.5rem",
                          }}
                        >
                          Rules for this context
                        </div>
                        {mode.rules.map((rule, j) => (
                          <div
                            key={j}
                            style={{
                              padding: "0.4rem 0",
                              fontSize: "0.78rem",
                              color: "#d0cdcd",
                              borderBottom:
                                j < mode.rules.length - 1
                                  ? "1px solid rgba(255,255,255,0.04)"
                                  : "none",
                              display: "flex",
                              gap: "0.5rem",
                            }}
                          >
                            <span style={{ color: mode.color, flexShrink: 0 }}>
                              ›
                            </span>
                            {rule}
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          background: `${mode.color}0a`,
                          border: `1px solid ${mode.color}22`,
                          borderRadius: "4px",
                          padding: "1rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.6rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: mode.color,
                            marginBottom: "0.5rem",
                          }}
                        >
                          Sample — this voice sounds like
                        </div>
                        <p
                          style={{
                            fontSize: "0.82rem",
                            lineHeight: 1.7,
                            color: "#e8e6e3",
                            margin: 0,
                            fontFamily: "'Georgia', serif",
                            fontStyle: "italic",
                          }}
                        >
                          "{mode.sample}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anti-Patterns Tab */}
        {activeTab === "antiPatterns" && (
          <div>
            <SectionHeader
              title={voiceData.antiPatterns.title}
              subtitle={voiceData.antiPatterns.subtitle}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              {voiceData.antiPatterns.patterns.map((pattern, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    borderRadius: "6px",
                    padding: "1.25rem",
                    background: "rgba(239, 68, 68, 0.03)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span style={{ fontSize: "1rem" }}>{pattern.icon}</span>
                    <span
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#EF4444",
                      }}
                    >
                      {pattern.category}
                    </span>
                  </div>
                  {pattern.items.map((item, j) => (
                    <div
                      key={j}
                      style={{
                        padding: "0.35rem 0",
                        fontSize: "0.75rem",
                        color: "#8a8686",
                        borderBottom:
                          j < pattern.items.length - 1
                            ? "1px solid rgba(255,255,255,0.03)"
                            : "none",
                        display: "flex",
                        gap: "0.5rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(239, 68, 68, 0.5)",
                          flexShrink: 0,
                          fontSize: "0.7rem",
                          lineHeight: "1.5rem",
                        }}
                      >
                        ✕
                      </span>
                      <span style={{ lineHeight: "1.5rem" }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Toolkit Tab */}
        {activeTab === "toolkit" && (
          <div>
            <SectionHeader
              title={voiceData.toolkit.title}
              subtitle={voiceData.toolkit.subtitle}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {voiceData.toolkit.tools.map((tool, i) => (
                <div
                  key={i}
                  onClick={() =>
                    setExpandedTool(expandedTool === i ? null : i)
                  }
                  style={{
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "border-color 0.2s",
                    borderColor:
                      expandedTool === i
                        ? "rgba(245, 158, 11, 0.4)"
                        : "rgba(245, 158, 11, 0.15)",
                  }}
                >
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background:
                        expandedTool === i
                          ? "rgba(245, 158, 11, 0.06)"
                          : "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "#F59E0B",
                          fontWeight: 600,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        {tool.name}
                      </span>
                    </div>
                    <span
                      style={{
                        color: "#F59E0B",
                        fontSize: "0.8rem",
                        transform:
                          expandedTool === i
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      →
                    </span>
                  </div>
                  {expandedTool === i && (
                    <div style={{ padding: "0 1.25rem 1.25rem" }}>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          lineHeight: 1.7,
                          color: "#b0adad",
                          margin: "0 0 1rem",
                          fontFamily: "'Georgia', serif",
                        }}
                      >
                        {tool.description}
                      </p>
                      <ComparisonBlock
                        bad={tool.before}
                        good={tool.after}
                        badLabel="Before"
                        goodLabel="After"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>
        {title}
      </h2>
      <p
        style={{
          fontSize: "0.78rem",
          color: "#8a8686",
          margin: "0.25rem 0 0",
          fontFamily: "'Georgia', serif",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

function ComparisonBlock({ bad, good, badLabel = "Not Kyle", goodLabel = "Kyle" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div
        style={{
          background: "rgba(239, 68, 68, 0.05)",
          border: "1px solid rgba(239, 68, 68, 0.15)",
          borderRadius: "4px",
          padding: "0.85rem",
        }}
      >
        <div
          style={{
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#EF4444",
            marginBottom: "0.4rem",
          }}
        >
          ✕ {badLabel}
        </div>
        <p
          style={{
            fontSize: "0.78rem",
            lineHeight: 1.6,
            color: "#8a8686",
            margin: 0,
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
          }}
        >
          "{bad}"
        </p>
      </div>
      <div
        style={{
          background: "rgba(16, 185, 129, 0.05)",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          borderRadius: "4px",
          padding: "0.85rem",
        }}
      >
        <div
          style={{
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#10B981",
            marginBottom: "0.4rem",
          }}
        >
          ✓ {goodLabel}
        </div>
        <p
          style={{
            fontSize: "0.78rem",
            lineHeight: 1.6,
            color: "#e8e6e3",
            margin: 0,
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
          }}
        >
          "{good}"
        </p>
      </div>
    </div>
  );
}
