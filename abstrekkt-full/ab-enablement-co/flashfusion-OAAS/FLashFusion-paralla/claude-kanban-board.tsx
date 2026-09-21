import React, { useState, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'claude_kanban_v1';

const DEFAULT_LANES = [
  { id: 'backlog', title: '📋 Backlog', color: 'bg-gray-100', limit: null },
  { id: 'todo', title: '📌 To Do', color: 'bg-blue-50', limit: 10 },
  { id: 'in-progress', title: '🔨 In Progress', color: 'bg-yellow-50', limit: 5 },
  { id: 'review', title: '👀 Review', color: 'bg-purple-50', limit: 3 },
  { id: 'blocked', title: '🚫 Blocked', color: 'bg-red-50', limit: null },
  { id: 'done', title: '✅ Done', color: 'bg-green-50', limit: null },
];

const PRIORITY_COLORS = {
  1: 'border-l-gray-300', 2: 'border-l-blue-300', 3: 'border-l-yellow-400',
  4: 'border-l-orange-400', 5: 'border-l-red-500'
};

const LABELS = ['bug', 'feature', 'tech-debt', 'migration', 'urgent', 'client', 'internal', 'automation'];
const LABEL_COLORS = {
  bug: 'bg-red-100 text-red-700', feature: 'bg-blue-100 text-blue-700',
  'tech-debt': 'bg-yellow-100 text-yellow-700', migration: 'bg-purple-100 text-purple-700',
  urgent: 'bg-red-200 text-red-800', client: 'bg-green-100 text-green-700',
  internal: 'bg-gray-100 text-gray-700', automation: 'bg-cyan-100 text-cyan-700'
};

const defaultCard = {
  id: '', title: '', description: '', lane: 'backlog', priority: 3,
  labels: [], assignee: '', dueDate: '', estimate: '', health: null,
  repo: '', platform: '', createdAt: '', updatedAt: '', subtasks: [], comments: []
};

export default function ClaudeKanban() {
  const [lanes, setLanes] = useState(DEFAULT_LANES);
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState({ search: '', label: '', assignee: '', priority: '' });
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverLane, setDragOverLane] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [view, setView] = useState('board');
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setCards(data.cards || []);
      setLanes(data.lanes || DEFAULT_LANES);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cards, lanes }));
  }, [cards, lanes]);

  const filteredCards = useMemo(() => {
    return cards.filter(c => {
      if (filter.search && !c.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      if (filter.label && !c.labels.includes(filter.label)) return false;
      if (filter.assignee && c.assignee !== filter.assignee) return false;
      if (filter.priority && c.priority !== +filter.priority) return false;
      return true;
    });
  }, [cards, filter]);

  const assignees = useMemo(() => [...new Set(cards.map(c => c.assignee).filter(Boolean))], [cards]);

  const stats = useMemo(() => {
    const total = cards.length;
    const done = cards.filter(c => c.lane === 'done').length;
    const blocked = cards.filter(c => c.lane === 'blocked').length;
    const inProgress = cards.filter(c => c.lane === 'in-progress').length;
    const overdue = cards.filter(c => c.dueDate && new Date(c.dueDate) < new Date() && c.lane !== 'done').length;
    return { total, done, blocked, inProgress, overdue, completion: total ? Math.round(done / total * 100) : 0 };
  }, [cards]);

  const addCard = (laneId) => {
    const newCard = { ...defaultCard, id: Date.now().toString(), lane: laneId, title: 'New Card', createdAt: new Date().toISOString() };
    setCards([...cards, newCard]);
    setEditing(newCard.id);
  };

  const updateCard = (id, updates) => {
    setCards(cards.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
  };

  const deleteCard = (id) => {
    if (confirm('Delete this card?')) setCards(cards.filter(c => c.id !== id));
  };

  const moveCard = (cardId, toLane) => {
    setCards(cards.map(c => c.id === cardId ? { ...c, lane: toLane, updatedAt: new Date().toISOString() } : c));
  };

  const handleDragStart = (e, card) => {
    setDraggedCard(card);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, laneId) => {
    e.preventDefault();
    setDragOverLane(laneId);
  };

  const handleDrop = (e, laneId) => {
    e.preventDefault();
    if (draggedCard) {
      moveCard(draggedCard.id, laneId);
    }
    setDraggedCard(null);
    setDragOverLane(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDragOverLane(null);
  };

  const importFromPortfolio = () => {
    const portfolioData = localStorage.getItem('portfolio_command_center_v3');
    if (!portfolioData) {
      alert('No portfolio data found. Import projects into Command Center first.');
      return;
    }
    const { projects } = JSON.parse(portfolioData);
    if (!projects?.length) {
      alert('No projects in portfolio.');
      return;
    }
    
    const newCards = projects.map(p => ({
      ...defaultCard,
      id: `port-${p.id}`,
      title: p.name,
      description: p.notes || '',
      lane: p.status === 'Active' ? 'in-progress' : p.status === 'Blocked' ? 'blocked' : p.status === 'Paused' ? 'backlog' : 'backlog',
      priority: p.priority || 3,
      labels: [p.platform === 'Base44' || p.platform === 'Bolt' ? 'migration' : '', p.category === 'Client Work' ? 'client' : 'internal'].filter(Boolean),
      assignee: p.assignedTo || '',
      health: p.health,
      repo: p.repo,
      platform: p.platform,
      createdAt: new Date().toISOString()
    }));
    
    setCards([...cards, ...newCards.filter(nc => !cards.find(c => c.id === nc.id))]);
    setShowImport(false);
  };

  const runAiAnalysis = async () => {
    setAiLoading(true);
    try {
      const boardData = {
        lanes: lanes.map(l => ({ ...l, cards: filteredCards.filter(c => c.lane === l.id).length })),
        cards: filteredCards.map(c => ({ title: c.title, lane: c.lane, priority: c.priority, labels: c.labels, dueDate: c.dueDate, health: c.health })),
        stats
      };

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `Analyze this Kanban board and provide actionable recommendations. Return ONLY valid JSON.

BOARD DATA:
${JSON.stringify(boardData, null, 2)}

Return this exact structure:
{
  "summary": "1-2 sentence board health assessment",
  "bottlenecks": [{"lane": "lane-id", "issue": "description", "action": "fix"}],
  "priorityFixes": [{"card": "title", "currentLane": "lane", "suggestedLane": "lane", "reason": "why"}],
  "workloadBalance": {"assessment": "text", "suggestions": ["list"]},
  "quickActions": ["immediate action 1", "action 2", "action 3"],
  "wipWarnings": [{"lane": "lane", "current": n, "limit": n, "severity": "high/medium"}]
}`
          }]
        })
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || '';
      setAiSuggestions(JSON.parse(text));
    } catch (e) {
      console.error('AI error:', e);
      alert('AI analysis failed: ' + e.message);
    }
    setAiLoading(false);
  };

  const applyAiSuggestion = (suggestion) => {
    const card = cards.find(c => c.title === suggestion.card);
    if (card) {
      moveCard(card.id, suggestion.suggestedLane);
    }
  };

  const Card = ({ card }) => {
    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && card.lane !== 'done';
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, card)}
        onDragEnd={handleDragEnd}
        onClick={() => setEditing(card.id)}
        className={`bg-white rounded-lg shadow-sm p-3 mb-2 cursor-grab active:cursor-grabbing border-l-4 ${PRIORITY_COLORS[card.priority]} hover:shadow-md transition-shadow ${draggedCard?.id === card.id ? 'opacity-50' : ''}`}
      >
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-medium text-sm leading-tight flex-1">{card.title}</h4>
          {card.health !== null && (
            <span className={`text-xs px-1.5 py-0.5 rounded ml-2 ${card.health >= 60 ? 'bg-green-100 text-green-700' : card.health >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {card.health}
            </span>
          )}
        </div>
        
        {card.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {card.labels.map(l => (
              <span key={l} className={`text-xs px-1.5 py-0.5 rounded ${LABEL_COLORS[l] || 'bg-gray-100'}`}>{l}</span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {card.assignee && <span className="bg-gray-100 px-1.5 py-0.5 rounded">{card.assignee}</span>}
            {card.estimate && <span>⏱ {card.estimate}</span>}
          </div>
          {card.dueDate && (
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {isOverdue ? '⚠️' : '📅'} {new Date(card.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {card.subtasks?.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            ☑️ {card.subtasks.filter(s => s.done).length}/{card.subtasks.length}
          </div>
        )}
      </div>
    );
  };

  const EditModal = ({ card, onClose }) => {
    const [form, setForm] = useState(card);
    const [newSubtask, setNewSubtask] = useState('');
    
    const addSubtask = () => {
      if (newSubtask.trim()) {
        setForm({ ...form, subtasks: [...(form.subtasks || []), { id: Date.now(), text: newSubtask, done: false }] });
        setNewSubtask('');
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg p-5 max-w-lg w-full my-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Edit Card</h3>
            <button onClick={() => deleteCard(card.id)} className="text-red-500 text-sm">Delete</button>
          </div>
          
          <div className="space-y-3">
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className="border rounded px-3 py-2 w-full font-medium" />
            
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description..." className="border rounded px-3 py-2 w-full h-20 text-sm" />
            
            <div className="grid grid-cols-2 gap-3">
              <select value={form.lane} onChange={e => setForm({ ...form, lane: e.target.value })} className="border rounded px-3 py-2 text-sm">
                {lanes.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
              </select>
              
              <select value={form.priority} onChange={e => setForm({ ...form, priority: +e.target.value })} className="border rounded px-3 py-2 text-sm">
                {[1,2,3,4,5].map(p => <option key={p} value={p}>Priority {p} {p === 5 ? '🔥' : p === 1 ? '❄️' : ''}</option>)}
              </select>
              
              <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="border rounded px-3 py-2 text-sm" />
              
              <input value={form.estimate} onChange={e => setForm({ ...form, estimate: e.target.value })} placeholder="Estimate (e.g., 2h, 1d)" className="border rounded px-3 py-2 text-sm" />
              
              <input value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })} placeholder="Assignee" className="border rounded px-3 py-2 text-sm" />
              
              <input value={form.repo} onChange={e => setForm({ ...form, repo: e.target.value })} placeholder="Repo URL" className="border rounded px-3 py-2 text-sm" />
            </div>
            
            <div>
              <label className="text-xs text-gray-500 block mb-1">Labels</label>
              <div className="flex flex-wrap gap-1">
                {LABELS.map(l => (
                  <button key={l} onClick={() => setForm({ ...form, labels: form.labels.includes(l) ? form.labels.filter(x => x !== l) : [...form.labels, l] })}
                    className={`text-xs px-2 py-1 rounded border ${form.labels.includes(l) ? LABEL_COLORS[l] + ' border-transparent' : 'bg-white border-gray-200'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-xs text-gray-500 block mb-1">Subtasks</label>
              <div className="space-y-1 mb-2">
                {(form.subtasks || []).map(st => (
                  <div key={st.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={st.done} onChange={() => setForm({ ...form, subtasks: form.subtasks.map(s => s.id === st.id ? { ...s, done: !s.done } : s) })} />
                    <span className={st.done ? 'line-through text-gray-400' : ''}>{st.text}</span>
                    <button onClick={() => setForm({ ...form, subtasks: form.subtasks.filter(s => s.id !== st.id) })} className="text-red-400 text-xs">×</button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newSubtask} onChange={e => setNewSubtask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSubtask()} placeholder="Add subtask..." className="border rounded px-2 py-1 text-sm flex-1" />
                <button onClick={addSubtask} className="px-2 py-1 bg-gray-100 rounded text-sm">Add</button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
            <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={() => { updateCard(form.id, form); onClose(); }} className="px-4 py-2 bg-black text-white rounded">Save</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">🤖 Claude Kanban</h1>
            <p className="text-xs text-gray-500">{stats.total} cards • {stats.completion}% complete • {stats.blocked} blocked • {stats.overdue} overdue</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAiPanel(!showAiPanel)} className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${showAiPanel ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700'}`}>
              🤖 AI Assist
            </button>
            <button onClick={() => setShowImport(true)} className="px-3 py-1.5 border rounded text-sm">Import</button>
            <button onClick={() => addCard('backlog')} className="px-3 py-1.5 bg-black text-white rounded text-sm">+ Add Card</button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <input value={filter.search} onChange={e => setFilter({ ...filter, search: e.target.value })} placeholder="Search..." className="border rounded px-2 py-1 text-sm w-40" />
          <select value={filter.label} onChange={e => setFilter({ ...filter, label: e.target.value })} className="border rounded px-2 py-1 text-sm">
            <option value="">All Labels</option>
            {LABELS.map(l => <option key={l}>{l}</option>)}
          </select>
          <select value={filter.assignee} onChange={e => setFilter({ ...filter, assignee: e.target.value })} className="border rounded px-2 py-1 text-sm">
            <option value="">All Assignees</option>
            {assignees.map(a => <option key={a}>{a}</option>)}
          </select>
          <select value={filter.priority} onChange={e => setFilter({ ...filter, priority: e.target.value })} className="border rounded px-2 py-1 text-sm">
            <option value="">All Priorities</option>
            {[5,4,3,2,1].map(p => <option key={p} value={p}>P{p}</option>)}
          </select>
          <div className="flex-1" />
          <div className="flex border rounded overflow-hidden">
            {['board', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)} className={`px-3 py-1 text-sm ${view === v ? 'bg-black text-white' : ''}`}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Board */}
        <div className={`flex-1 p-4 ${showAiPanel ? 'pr-80' : ''}`}>
          {view === 'board' ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {lanes.map(lane => {
                const laneCards = filteredCards.filter(c => c.lane === lane.id);
                const isOverLimit = lane.limit && laneCards.length > lane.limit;
                
                return (
                  <div
                    key={lane.id}
                    onDragOver={(e) => handleDragOver(e, lane.id)}
                    onDrop={(e) => handleDrop(e, lane.id)}
                    className={`flex-shrink-0 w-72 rounded-lg ${lane.color} ${dragOverLane === lane.id ? 'ring-2 ring-blue-400' : ''}`}
                  >
                    <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setCollapsed({ ...collapsed, [lane.id]: !collapsed[lane.id] })} className="text-gray-400 hover:text-gray-600">
                          {collapsed[lane.id] ? '▶' : '▼'}
                        </button>
                        <h3 className="font-semibold text-sm">{lane.title}</h3>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${isOverLimit ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                          {laneCards.length}{lane.limit ? `/${lane.limit}` : ''}
                        </span>
                      </div>
                      <button onClick={() => addCard(lane.id)} className="text-gray-400 hover:text-gray-600 text-lg">+</button>
                    </div>
                    
                    {!collapsed[lane.id] && (
                      <div className="p-2 min-h-[200px]">
                        {laneCards.map(card => <Card key={card.id} card={card} />)}
                        {laneCards.length === 0 && (
                          <div className="text-center text-gray-400 text-sm py-8">Drop cards here</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3">Title</th>
                    <th className="text-left p-3">Lane</th>
                    <th className="text-left p-3">Priority</th>
                    <th className="text-left p-3">Labels</th>
                    <th className="text-left p-3">Assignee</th>
                    <th className="text-left p-3">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCards.map(card => (
                    <tr key={card.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setEditing(card.id)}>
                      <td className="p-3 font-medium">{card.title}</td>
                      <td className="p-3">{lanes.find(l => l.id === card.lane)?.title}</td>
                      <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${card.priority >= 4 ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>P{card.priority}</span></td>
                      <td className="p-3">{card.labels.map(l => <span key={l} className={`text-xs px-1.5 py-0.5 rounded mr-1 ${LABEL_COLORS[l]}`}>{l}</span>)}</td>
                      <td className="p-3 text-gray-600">{card.assignee || '-'}</td>
                      <td className="p-3 text-gray-500">{card.dueDate ? new Date(card.dueDate).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Panel */}
        {showAiPanel && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white border-l shadow-lg overflow-y-auto">
            <div className="p-4 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">🤖 AI Assistant</h3>
                <button onClick={() => setShowAiPanel(false)} className="text-gray-400">×</button>
              </div>
              <button onClick={runAiAnalysis} disabled={aiLoading} className="w-full mt-3 px-4 py-2 bg-purple-600 text-white rounded text-sm disabled:opacity-50">
                {aiLoading ? 'Analyzing...' : 'Analyze Board'}
              </button>
            </div>
            
            {aiSuggestions && (
              <div className="p-4 space-y-4">
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-purple-800 text-sm mb-1">Summary</h4>
                  <p className="text-sm text-purple-900">{aiSuggestions.summary}</p>
                </div>
                
                {aiSuggestions.wipWarnings?.length > 0 && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-red-800 text-sm mb-2">⚠️ WIP Warnings</h4>
                    {aiSuggestions.wipWarnings.map((w, i) => (
                      <div key={i} className="text-sm text-red-700">{w.lane}: {w.current}/{w.limit}</div>
                    ))}
                  </div>
                )}
                
                {aiSuggestions.quickActions?.length > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-800 text-sm mb-2">⚡ Quick Actions</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {aiSuggestions.quickActions.map((a, i) => <li key={i}>• {a}</li>)}
                    </ul>
                  </div>
                )}
                
                {aiSuggestions.priorityFixes?.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 text-sm mb-2">🔄 Suggested Moves</h4>
                    {aiSuggestions.priorityFixes.map((f, i) => (
                      <div key={i} className="text-sm mb-2 p-2 bg-white rounded">
                        <div className="font-medium">{f.card}</div>
                        <div className="text-xs text-gray-500">{f.currentLane} → {f.suggestedLane}</div>
                        <div className="text-xs text-yellow-700 mt-1">{f.reason}</div>
                        <button onClick={() => applyAiSuggestion(f)} className="mt-2 text-xs px-2 py-1 bg-yellow-200 rounded">Apply</button>
                      </div>
                    ))}
                  </div>
                )}
                
                {aiSuggestions.bottlenecks?.length > 0 && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-orange-800 text-sm mb-2">🚧 Bottlenecks</h4>
                    {aiSuggestions.bottlenecks.map((b, i) => (
                      <div key={i} className="text-sm text-orange-700 mb-1">
                        <strong>{b.lane}:</strong> {b.issue}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {!aiSuggestions && !aiLoading && (
              <div className="p-8 text-center text-gray-400">
                <div className="text-3xl mb-2">🤖</div>
                <p className="text-sm">Click "Analyze Board" for AI recommendations</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {editing && <EditModal card={cards.find(c => c.id === editing)} onClose={() => setEditing(null)} />}
      
      {showImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full">
            <h3 className="font-bold mb-4">Import Cards</h3>
            <div className="space-y-3">
              <button onClick={importFromPortfolio} className="w-full p-4 border-2 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 text-left">
                <div className="font-medium">📊 Import from Portfolio Command Center</div>
                <div className="text-xs text-gray-500 mt-1">Import projects as cards with health, labels, and assignments</div>
              </button>
              <button onClick={() => { const data = prompt('Paste JSON array of cards:'); if (data) { try { setCards([...cards, ...JSON.parse(data).map((c, i) => ({ ...defaultCard, ...c, id: Date.now().toString() + i }))]); setShowImport(false); } catch { alert('Invalid JSON'); } } }} className="w-full p-4 border-2 border-dashed rounded-lg hover:border-gray-400 text-left">
                <div className="font-medium">📋 Import JSON</div>
                <div className="text-xs text-gray-500 mt-1">Paste card data as JSON array</div>
              </button>
            </div>
            <button onClick={() => setShowImport(false)} className="w-full mt-4 px-4 py-2 border rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
