import React, { useState, useEffect } from 'react';

// 90-DAY SPRINT PLANNER
// WSJF (Weighted Shortest Job First) scoring across 3 lanes
// Fibonacci scoring (1, 2, 3, 5, 8, 13) for value, urgency, complexity, risk
// Auto-ranking by (value × urgency) / (complexity × risk)
// localStorage persistence

const TOKENS = {
  bg: '#0c0c0b', surface: '#111110', card: '#181815', border: '#232320',
  borderHi: '#303030', accent: '#d4893a', accentHi: '#e8a050',
  text: '#ddd8ce', text2: '#807c74', text3: '#3a3835',
  green: '#5a9c5a', red: '#c05050'
};

const FIB = [1, 2, 3, 5, 8, 13];

const LANES = [
  { id: 'flashfusion', name: 'FlashFusion', color: '#d4893a' },
  { id: 'brand', name: 'Personal Brand', color: '#7a6db8' },
  { id: 'intinc', name: 'INT Inc', color: '#5a9c5a' }
];

const SAMPLE_ITEMS = [
  { id: '1', lane: 'flashfusion', title: 'Close first paid Audit (Ryan)', value: 13, urgency: 13, complexity: 5, risk: 3 },
  { id: '2', lane: 'brand', title: 'Send Lee Chong Ming pitch', value: 8, urgency: 8, complexity: 2, risk: 2 },
  { id: '3', lane: 'flashfusion', title: 'Resolve Skills Library compliance (4 gaps)', value: 8, urgency: 5, complexity: 3, risk: 2 },
  { id: '4', lane: 'brand', title: 'Publish Chris Butler case study', value: 8, urgency: 8, complexity: 2, risk: 1 },
  { id: '5', lane: 'flashfusion', title: 'Lafu co-founder agreement', value: 13, urgency: 5, complexity: 8, risk: 8 }
];

function calcScore(item) {
  return Math.round(((item.value * item.urgency) / (item.complexity * item.risk)) * 10) / 10;
}

function classify(item) {
  const score = calcScore(item);
  if (score >= 10) return { label: 'CRITICAL', color: TOKENS.red };
  if (score >= 5) return { label: 'HIGH', color: TOKENS.accent };
  if (score >= 2) return { label: 'MEDIUM', color: TOKENS.text2 };
  return { label: 'LOW', color: TOKENS.text3 };
}

export default function SprintPlanner() {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSampleData, setShowSampleData] = useState(false);

  // Load from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sprint-planner-items');
      if (stored) setItems(JSON.parse(stored));
    } catch(e) {}
  }, []);

  // Save on every change
  useEffect(() => {
    try {
      localStorage.setItem('sprint-planner-items', JSON.stringify(items));
    } catch(e) {}
  }, [items]);

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      lane: 'flashfusion',
      title: 'New item',
      value: 5, urgency: 5, complexity: 3, risk: 2
    };
    setItems([...items, newItem]);
    setEditingId(newItem.id);
  };

  const loadSamples = () => {
    setItems(SAMPLE_ITEMS);
    setShowSampleData(false);
  };

  const updateItem = (id, patch) => {
    setItems(items.map(i => i.id === id ? { ...i, ...patch } : i));
  };

  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    if (editingId === id) setEditingId(null);
  };

  // Sort by score descending
  const sorted = [...items].sort((a, b) => calcScore(b) - calcScore(a));

  // Distribute into 3 phases (Weeks 1-4, 5-8, 9-12)
  const phase1 = sorted.slice(0, Math.ceil(sorted.length / 3));
  const phase2 = sorted.slice(Math.ceil(sorted.length / 3), Math.ceil(sorted.length * 2 / 3));
  const phase3 = sorted.slice(Math.ceil(sorted.length * 2 / 3));

  return (
    <div style={{
      background: TOKENS.bg, color: TOKENS.text, minHeight: '100vh',
      fontFamily: 'IBM Plex Sans, system-ui, sans-serif', fontSize: 14, lineHeight: 1.5,
      padding: '32px 24px 64px'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 500,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: TOKENS.accent, marginBottom: 12
          }}>
            Planning &middot; 90-day sprint
          </div>
          <h1 style={{
            fontFamily: 'Fraunces, Georgia, serif', fontSize: 32, fontWeight: 600,
            letterSpacing: '-0.02em', marginBottom: 12, color: TOKENS.text
          }}>
            Sprint planner
          </h1>
          <p style={{ color: TOKENS.text2, fontSize: 15, maxWidth: 720 }}>
            Score each item on value, urgency, complexity, and risk (Fibonacci 1-13). The planner ranks by WSJF
            (value &times; urgency / complexity &times; risk) and distributes into three 4-week phases.
            Saves to browser storage.
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${TOKENS.border}` }}>
          <button onClick={addItem} style={btnPrimary}>+ Add item</button>
          {items.length === 0 && (
            <button onClick={loadSamples} style={btnSecondary}>Load sample items</button>
          )}
          {items.length > 0 && (
            <button onClick={() => { if (confirm('Clear all items?')) setItems([]); }} style={btnSecondary}>Clear all</button>
          )}
          <div style={{ marginLeft: 'auto', fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: TOKENS.text2, alignSelf: 'center' }}>
            {items.length} items &middot; auto-sorted by score
          </div>
        </div>

        {/* Item list */}
        {items.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: TOKENS.text2, fontSize: 15 }}>
            No items yet. Click "Add item" or "Load sample items" to start.
          </div>
        ) : (
          <div style={{ marginBottom: 48 }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 60px 60px 60px 60px 80px 70px',
              gap: 8, padding: '12px 16px', fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10, color: TOKENS.text3, letterSpacing: '0.15em', textTransform: 'uppercase'
            }}>
              <div>Item</div><div>Lane</div><div>Value</div><div>Urgency</div>
              <div>Complex</div><div>Risk</div><div>Score</div><div></div>
            </div>
            {sorted.map(item => {
              const score = calcScore(item);
              const cls = classify(item);
              const lane = LANES.find(l => l.id === item.lane);
              const isEditing = editingId === item.id;
              return (
                <div key={item.id} style={{
                  display: 'grid', gridTemplateColumns: '1fr 100px 60px 60px 60px 60px 80px 70px',
                  gap: 8, padding: '12px 16px', alignItems: 'center',
                  background: isEditing ? TOKENS.surface : TOKENS.card,
                  border: `1px solid ${isEditing ? TOKENS.accent : TOKENS.border}`,
                  borderLeft: `2px solid ${lane.color}`,
                  borderRadius: 2, marginBottom: 4
                }}>
                  {isEditing ? (
                    <input
                      autoFocus
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      onBlur={() => setEditingId(null)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setEditingId(null); }}
                      style={inputStyle}
                    />
                  ) : (
                    <div onClick={() => setEditingId(item.id)} style={{ cursor: 'text', fontSize: 14, fontWeight: 500 }}>
                      {item.title}
                    </div>
                  )}

                  <select
                    value={item.lane}
                    onChange={(e) => updateItem(item.id, { lane: e.target.value })}
                    style={selectStyle}>
                    {LANES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>

                  {['value', 'urgency', 'complexity', 'risk'].map(f => (
                    <select
                      key={f}
                      value={item[f]}
                      onChange={(e) => updateItem(item.id, { [f]: parseInt(e.target.value) })}
                      style={selectStyle}>
                      {FIB.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  ))}

                  <div style={{
                    fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, fontWeight: 500,
                    color: cls.color, textAlign: 'right'
                  }}>
                    {score}
                  </div>

                  <button
                    onClick={() => deleteItem(item.id)}
                    style={{ ...btnGhost, fontSize: 11, padding: '4px 8px' }}>
                    delete
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Phase distribution */}
        {items.length > 0 && (
          <>
            <h2 style={{
              fontFamily: 'Fraunces, Georgia, serif', fontSize: 22, fontWeight: 500,
              marginTop: 48, marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${TOKENS.border}`
            }}>
              90-day plan
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <PhaseCard title="Phase 1 — Weeks 1-4" items={phase1} subtitle="Highest score, ship first" />
              <PhaseCard title="Phase 2 — Weeks 5-8" items={phase2} subtitle="Mid-priority, parallel where possible" />
              <PhaseCard title="Phase 3 — Weeks 9-12" items={phase3} subtitle="Lower urgency or higher complexity" />
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 64, paddingTop: 24, borderTop: `1px solid ${TOKENS.border}`,
          fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
          color: TOKENS.text3, letterSpacing: '0.05em', lineHeight: 1.7
        }}>
          WSJF = Weighted Shortest Job First &middot; Score = (value &times; urgency) / (complexity &times; risk)<br/>
          Saves to browser localStorage &middot; not synced across devices &middot; export to JSON before clearing browser data<br/>
          Critical {'>='}10 &middot; High {'>='}5 &middot; Medium {'>='}2 &middot; Low {'<'}2
        </div>

      </div>
    </div>
  );
}

function PhaseCard({ title, items, subtitle }) {
  return (
    <div style={{
      background: TOKENS.card, border: `1px solid ${TOKENS.border}`,
      borderRadius: 2, padding: '20px 18px'
    }}>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: TOKENS.text3,
        letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4
      }}>
        {subtitle}
      </div>
      <div style={{
        fontFamily: 'Fraunces, Georgia, serif', fontSize: 16, fontWeight: 500,
        marginBottom: 14, color: TOKENS.text
      }}>
        {title}
      </div>
      {items.length === 0 ? (
        <div style={{ color: TOKENS.text3, fontSize: 13 }}>No items in this phase.</div>
      ) : (
        items.map(item => {
          const lane = LANES.find(l => l.id === item.lane);
          const score = calcScore(item);
          return (
            <div key={item.id} style={{
              padding: '10px 0', borderBottom: `1px solid ${TOKENS.border}`,
              display: 'flex', justifyContent: 'space-between', gap: 8
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: TOKENS.text, fontWeight: 500, marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{
                  fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
                  color: lane.color, letterSpacing: '0.1em', textTransform: 'uppercase'
                }}>
                  {lane.name}
                </div>
              </div>
              <div style={{
                fontFamily: 'IBM Plex Mono, monospace', fontSize: 12,
                color: TOKENS.accent, fontWeight: 500
              }}>
                {score}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const btnPrimary = {
  fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 500,
  padding: '8px 16px', background: TOKENS.accent, color: TOKENS.bg,
  border: `1px solid ${TOKENS.accent}`, borderRadius: 2, cursor: 'pointer',
  letterSpacing: '0.05em', transition: 'all 0.15s'
};

const btnSecondary = {
  ...btnPrimary, background: TOKENS.card, color: TOKENS.text,
  border: `1px solid ${TOKENS.border}`
};

const btnGhost = {
  fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
  padding: '4px 8px', background: 'transparent', color: TOKENS.text2,
  border: `1px solid ${TOKENS.border}`, borderRadius: 2, cursor: 'pointer'
};

const inputStyle = {
  background: TOKENS.bg, color: TOKENS.text, border: `1px solid ${TOKENS.border}`,
  borderRadius: 2, padding: '6px 10px', fontFamily: 'inherit', fontSize: 14, width: '100%'
};

const selectStyle = {
  background: TOKENS.bg, color: TOKENS.text, border: `1px solid ${TOKENS.border}`,
  borderRadius: 2, padding: '4px 6px', fontFamily: 'IBM Plex Mono, monospace',
  fontSize: 12, width: '100%', cursor: 'pointer'
};
