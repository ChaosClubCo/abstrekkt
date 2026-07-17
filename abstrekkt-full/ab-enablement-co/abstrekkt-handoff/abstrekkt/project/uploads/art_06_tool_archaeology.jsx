import React, { useState } from 'react';

// MEMOIR ARTIFACT — TOOL ARCHAEOLOGY GALLERY
// Chapter 8 (The Arsenal) preparation. Session 3 excavation pending.
// Thesis: tools as cognitive prosthetics, not productivity flex.
// Anchor: card table, 1:30am photo, screenshot method as origin.

const TOKENS = {
  bg: '#0c0c0b', surface: '#111110', card: '#181815', border: '#232320',
  borderHi: '#303030', accent: '#d4893a', accentHi: '#e8a050',
  text: '#ddd8ce', text2: '#807c74', text3: '#3a3835', tag: '#1e1e1a',
  green: '#5a9c5a', red: '#c05050'
};

// ERAS — chronological, with cognitive context
const ERAS = [
  { id: 'hospitality', label: 'Hospitality', range: '2007–2014', color: '#7a6450', desc: 'Bartending. O\'Toole\'s. Pre-injury cognition still intact. Diagnostic instinct embodied, not yet named. Tools: physical, mnemonic, social.' },
  { id: 'qc', label: 'Quality Control', range: '2014–2017', color: '#806845', desc: 'After settlement money, after the car. First office work. Diagnostic instinct meets process. Tools: spreadsheets, checklists, the first taste of external memory.' },
  { id: 'rupture', label: 'The Rupture', range: '2017–2022', color: '#c05050', desc: 'Addiction era. NIU expulsion. Heroin. Sept 2021 OD and hypoxia. Old strategies fail. Most tools from this era are not memorable. Memory itself is the casualty.' },
  { id: 'construction', label: 'The Construction', range: '2022–2024', color: '#d4893a', desc: 'Sedona. Bear. Card table. Screenshot method. Self-teaching to code as a way of building external cognition. The arsenal begins here, not before.' },
  { id: 'present', label: 'Present', range: '2024–now', color: '#5a9c5a', desc: 'L1 service desk. FlashFusion build. Skills Library. Memoir. Tools as load-bearing infrastructure for a brain that can\'t be trusted unassisted.' }
];

// TOOLS — placeholder data; Kyle to validate during Session 3
// Each tool: id, era, name, what-it-replaced, status (CONFIRMED | NEEDS_VERIFICATION | PROSTHETIC), origin story
const TOOLS = [
  // Hospitality era
  { id: 't1', era: 'hospitality', name: 'The corner of the bar', replaced: 'visual processing of the room', status: 'CONFIRMED', origin: 'Position-based memory. The diagnostic instinct\'s first prosthetic — using physical placement to read the room without conscious effort.' },
  { id: 't2', era: 'hospitality', name: 'The mental tab', replaced: 'short-term recall', status: 'CONFIRMED', origin: 'Tracking 12 customers\' drinks in active short-term memory. This is the working memory that later breaks. The skill, in retrospect, was load-balancing — not memorizing.' },
  { id: 't3', era: 'hospitality', name: 'Repeat-back protocol', replaced: 'absent error correction', status: 'CONFIRMED', origin: 'Reading the order back. Originally a customer-service script. Later, the foundation of the screenshot method — show your work, verify before commit.' },

  // QC era
  { id: 't4', era: 'qc', name: 'First spreadsheet', replaced: 'whiteboard tracking', status: 'NEEDS_VERIFICATION', origin: 'The first time external storage replaced internal recall. Possibly Excel, possibly Google Sheets. Worth excavating: what was the trigger event?' },
  { id: 't5', era: 'qc', name: 'Standardized checklists', replaced: 'process memory', status: 'NEEDS_VERIFICATION', origin: 'Quality control as a discipline is, structurally, the same insight as the memoir: trust the process, not the operator. The QC year is where this got named without being claimed.' },

  // Rupture era — sparse and uncertain
  { id: 't6', era: 'rupture', name: '[Mostly missing]', replaced: '—', status: 'NEEDS_VERIFICATION', origin: 'This is where the memoir\'s memory uncertainty sits. Tools from the addiction era do not generally survive into present recall. The absence is itself evidence. Session 3 should not force tools into this slot.' },

  // Construction era — the load-bearing material
  { id: 't7', era: 'construction', name: 'The card table', replaced: 'a desk, a setup, professional context', status: 'CONFIRMED', origin: 'Folding card table. Bear\'s website. 1:30am photo. The screenshot method is born here — taking a picture of what you\'re looking at, opening it in another window, copying what you see. Obviously the wrong way to do it. Built anyway.' },
  { id: 't8', era: 'construction', name: 'The screenshot method', replaced: 'reading and understanding code', status: 'CONFIRMED', origin: 'Origin of learning to code. Not from tutorials. From copying what worked, fragment by fragment, until the structure clicked. This is the diagnostic instinct applied to systems Kyle didn\'t yet understand.' },
  { id: 't9', era: 'construction', name: 'The first repository', replaced: 'tracking what was built', status: 'NEEDS_VERIFICATION', origin: 'GitHub account creation. First commit. The shift from copying code to authoring code — even if the authorship was thin at first. Worth excavating: when, what was the first repo, what did it do?' },
  { id: 't10', era: 'construction', name: 'Documentation compulsion', replaced: 'reliance on memory of decisions', status: 'CONFIRMED', origin: 'The pattern Kyle later named "obsessive documentation as survival mechanism." Not productivity culture — necessity. Memory cannot be trusted; therefore, every decision must leave a trace.' },

  // Present era
  { id: 't11', era: 'present', name: 'Claude (the assistant)', replaced: 'a colleague who never gets tired', status: 'CONFIRMED', origin: 'Used as a diagnostic mirror, not as a code generator. Forces articulation of why something is broken before opening a ticket. The shift was from "AI helps me write" to "AI helps me think out loud."' },
  { id: 't12', era: 'present', name: 'Notion as second brain', replaced: 'remembering what was decided', status: 'CONFIRMED', origin: 'Project state docs, decision logs, daily checklists. The thing memory can\'t hold reliably. Kyle\'s Notion is structurally a prosthetic — it remembers because the original storage doesn\'t.' },
  { id: 't13', era: 'present', name: 'Skills Library (FlashFusion)', replaced: 'starting from scratch each session', status: 'CONFIRMED', origin: '50 skill packs codifying repeated workflows. Each one is a piece of process Kyle no longer has to remember to run correctly. The library is, in cognitive terms, a lookup table for context that used to live in his head.' },
  { id: 't14', era: 'present', name: 'Project state files', replaced: 'session-to-session continuity', status: 'CONFIRMED', origin: 'Markdown files at /mnt/project/PROJECT_STATE.md. Ground truth between sessions. Without these, every conversation starts from zero and most decisions get re-litigated. The state file is the thing that makes the work compound.' },
  { id: 't15', era: 'present', name: 'Base44 (FlashFusion build)', replaced: 'custom infrastructure', status: 'CONFIRMED', origin: 'Allows Kyle to ship products at the speed of thinking, not the speed of code. The platform is itself a prosthetic for the engineering team Kyle does not have.' },
  { id: 't16', era: 'present', name: 'The 14-day brag doc', replaced: 'reconstructed memory of what got done', status: 'NEEDS_VERIFICATION', origin: 'Daily wins logged against time. Also doubles as evidence for self when the diagnostic instinct turns inward and starts saying "you haven\'t done anything."' }
];

const STATUS_COLORS = {
  CONFIRMED: TOKENS.green,
  NEEDS_VERIFICATION: TOKENS.accent,
  PROSTHETIC: TOKENS.text2
};

export default function ToolArchaeology() {
  const [selectedTool, setSelectedTool] = useState(null);
  const [filterEra, setFilterEra] = useState('all');

  const filtered = filterEra === 'all' ? TOOLS : TOOLS.filter(t => t.era === filterEra);
  const counts = ERAS.reduce((acc, e) => ({ ...acc, [e.id]: TOOLS.filter(t => t.era === e.id).length }), {});

  return (
    <div style={{
      background: TOKENS.bg, color: TOKENS.text, minHeight: '100vh',
      fontFamily: 'IBM Plex Sans, system-ui, sans-serif', fontSize: 15, lineHeight: 1.6,
      padding: '40px 24px 80px'
    }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: TOKENS.accent, marginBottom: 12
          }}>
            Memoir &middot; Chapter 8 prep &middot; Session 3 pending
          </div>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif', fontSize: 36, fontWeight: 600,
            letterSpacing: '-0.02em', marginBottom: 16, color: TOKENS.text
          }}>
            Tool Archaeology
          </h1>
          <p style={{ color: TOKENS.text2, fontSize: 16, lineHeight: 1.55, maxWidth: 720 }}>
            ~30 tools, mapped against eras. Not productivity flex — evidence of what organic function failed and had to be replaced.
            Click any tool to read its origin. Confirmed entries are validated against memory or artifact.
            Verification-pending entries need Session 3 input from Kyle before they enter the manuscript.
          </p>
        </div>

        {/* Era filter */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32,
          paddingBottom: 24, borderBottom: `1px solid ${TOKENS.border}`
        }}>
          <button
            onClick={() => setFilterEra('all')}
            style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 500,
              padding: '8px 14px', background: filterEra === 'all' ? TOKENS.accent : TOKENS.card,
              color: filterEra === 'all' ? TOKENS.bg : TOKENS.text,
              border: `1px solid ${filterEra === 'all' ? TOKENS.accent : TOKENS.border}`,
              borderRadius: 2, cursor: 'pointer', letterSpacing: '0.05em',
              transition: 'all 0.15s'
            }}>
            All eras ({TOOLS.length})
          </button>
          {ERAS.map(era => (
            <button
              key={era.id}
              onClick={() => setFilterEra(era.id)}
              style={{
                fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 500,
                padding: '8px 14px', background: filterEra === era.id ? era.color : TOKENS.card,
                color: filterEra === era.id ? TOKENS.bg : TOKENS.text,
                border: `1px solid ${filterEra === era.id ? era.color : TOKENS.border}`,
                borderRadius: 2, cursor: 'pointer', letterSpacing: '0.05em',
                transition: 'all 0.15s'
              }}>
              {era.label} ({counts[era.id]})
            </button>
          ))}
        </div>

        {/* Era detail card (when filtered to one era) */}
        {filterEra !== 'all' && (
          <div style={{
            background: TOKENS.card, border: `1px solid ${TOKENS.border}`,
            borderLeft: `2px solid ${ERAS.find(e => e.id === filterEra).color}`,
            padding: '20px 24px', marginBottom: 32, borderRadius: 2
          }}>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
              color: TOKENS.text2, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6
            }}>
              {ERAS.find(e => e.id === filterEra).range}
            </div>
            <p style={{ color: TOKENS.text, lineHeight: 1.6, margin: 0, fontSize: 15 }}>
              {ERAS.find(e => e.id === filterEra).desc}
            </p>
          </div>
        )}

        {/* Tools grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 12, marginBottom: 48
        }}>
          {filtered.map(tool => {
            const era = ERAS.find(e => e.id === tool.era);
            const isSelected = selectedTool?.id === tool.id;
            return (
              <div
                key={tool.id}
                onClick={() => setSelectedTool(isSelected ? null : tool)}
                style={{
                  background: isSelected ? TOKENS.surface : TOKENS.card,
                  border: `1px solid ${isSelected ? TOKENS.accent : TOKENS.border}`,
                  borderRadius: 2, padding: '16px 18px', cursor: 'pointer',
                  transition: 'all 0.15s'
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 10 }}>
                  <div style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
                    color: era.color, letterSpacing: '0.15em', textTransform: 'uppercase'
                  }}>
                    {era.label}
                  </div>
                  <div style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: 9,
                    color: STATUS_COLORS[tool.status], letterSpacing: '0.1em'
                  }}>
                    {tool.status === 'CONFIRMED' ? '\u25C6' : '\u25C7'} {tool.status === 'CONFIRMED' ? 'CONFIRMED' : 'NEEDS REVIEW'}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'Fraunces, Georgia, serif', fontSize: 18, fontWeight: 500,
                  marginBottom: 6, color: TOKENS.text, letterSpacing: '-0.01em'
                }}>
                  {tool.name}
                </div>
                <div style={{
                  fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 13,
                  color: TOKENS.text2, lineHeight: 1.45
                }}>
                  Replaced: {tool.replaced}
                </div>
                {isSelected && (
                  <div style={{
                    marginTop: 16, paddingTop: 14, borderTop: `1px solid ${TOKENS.border}`,
                    fontSize: 14, lineHeight: 1.6, color: TOKENS.text
                  }}>
                    {tool.origin}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Thesis footer */}
        <div style={{
          padding: '32px 28px', background: TOKENS.card,
          borderLeft: `2px solid ${TOKENS.accent}`, marginTop: 48,
          fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic',
          fontSize: 18, lineHeight: 1.6, color: TOKENS.text
        }}>
          The arsenal isn't impressive. It's evidence. Each tool marks the moment an organic function failed and an external one had to take its place. The chapter fails if a reader thinks "what a toolset." It works if they think — oh, that's what the tools are for.
        </div>

        <div style={{
          marginTop: 48, paddingTop: 24, borderTop: `1px solid ${TOKENS.border}`,
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
          color: TOKENS.text3, letterSpacing: '0.05em', lineHeight: 1.7
        }}>
          Tool Archaeology v1 &middot; May 2026 &middot; Session 3 (excavation) pending<br/>
          16 tools listed; expect 25-32 after full excavation &middot; "Confirmed" = validated against memory or artifact &middot; "Needs Review" = drafted, requires Kyle input before manuscript
        </div>

      </div>
    </div>
  );
}
