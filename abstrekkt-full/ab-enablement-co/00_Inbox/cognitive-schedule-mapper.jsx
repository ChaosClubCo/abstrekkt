import React, { useState, useMemo } from 'react';
import { Clock, Sun, Moon, AlertTriangle, Compass, Briefcase, Layers, BookOpen, Coffee } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

// Schedule constraints from the project description
const CONSTRAINTS = {
  peakStart: 7, peakEnd: 11,
  fridayCutoff: 13, // 1pm
  wednesdayIsWriting: true,
  noEveningHighStakes: 19, // 7pm
};

// Suggested task → window mapping
const TASK_TYPES = [
  { id: 'ff_strategy', label: 'FF strategy work', lane: 'ff', accent: '#7c3aed', ideal: 'peak', avoid: 'evening', why: 'High-stakes drafting needs the 7-11am peak. Strategy = load-bearing decisions.' },
  { id: 'ff_delivery', label: 'FF delivery work', lane: 'ff', accent: '#7c3aed', ideal: 'afternoon', avoid: 'wednesday', why: 'Delivery is execution, fits afternoons. Avoid Wednesday (writing day).' },
  { id: 'ff_comms', label: 'FF client comms', lane: 'ff', accent: '#7c3aed', ideal: 'afternoon', avoid: 'evening', why: 'Async-friendly. Afternoon hours work. Don\'t send substantive replies post-7pm.' },
  { id: 'ccc_build', label: 'Products build', lane: 'ccc', accent: '#34d399', ideal: 'evening', avoid: 'peak', why: 'Lower-stakes execution. Peak hours belong to FF strategy + memoir.' },
  { id: 'ccc_content', label: 'Products content writing', lane: 'ccc', accent: '#34d399', ideal: 'morning', avoid: 'late_evening', why: 'Drafting needs morning energy but isn\'t as load-bearing as memoir.' },
  { id: 'memoir_draft', label: 'Memoir drafting', lane: 'memoir', accent: '#b89968', ideal: 'wednesday', avoid: 'evening', why: 'Wednesday writing day is structural. Evening drafting prohibited.' },
  { id: 'memoir_excav', label: 'Memoir excavation', lane: 'memoir', accent: '#b89968', ideal: 'peak', avoid: 'evening', why: 'Excavation sessions require peak cognitive window. Specificity discipline is energy-intensive.' },
  { id: 'admin', label: 'Admin / email / ops', lane: null, accent: '#8a8f9a', ideal: 'afternoon', avoid: 'peak', why: 'Never burn peak windows on admin. Afternoon is fine. Evening if needed.' },
];

// Pre-populated example assignments
const SEEDED_ASSIGNMENTS = {
  'Mon-7': 'memoir_excav', 'Mon-8': 'memoir_excav', 'Mon-9': 'memoir_excav', 'Mon-10': 'memoir_excav',
  'Mon-14': 'ff_delivery', 'Mon-15': 'ff_delivery', 'Mon-16': 'ff_comms',
  'Tue-7': 'ff_strategy', 'Tue-8': 'ff_strategy', 'Tue-9': 'ff_strategy', 'Tue-10': 'ff_strategy',
  'Tue-14': 'ff_delivery', 'Tue-15': 'ff_delivery', 'Tue-20': 'ccc_build',
  'Wed-7': 'memoir_draft', 'Wed-8': 'memoir_draft', 'Wed-9': 'memoir_draft', 'Wed-10': 'memoir_draft',
  'Wed-13': 'memoir_draft', 'Wed-14': 'memoir_draft', 'Wed-15': 'memoir_draft',
  'Thu-7': 'ff_strategy', 'Thu-8': 'ff_strategy', 'Thu-9': 'ff_strategy', 'Thu-10': 'ff_strategy',
  'Thu-14': 'admin', 'Thu-15': 'ff_comms', 'Thu-20': 'ccc_build',
  'Fri-7': 'ff_strategy', 'Fri-8': 'ff_strategy', 'Fri-9': 'ff_strategy', 'Fri-10': 'ff_strategy',
  'Fri-11': 'ff_delivery', 'Fri-12': 'ff_comms',
  'Sun-8': 'ccc_content', 'Sun-9': 'ccc_content',
};

const isWindowConflict = (day, hour, taskId) => {
  const task = TASK_TYPES.find(t => t.id === taskId);
  if (!task) return null;
  const inPeak = hour >= CONSTRAINTS.peakStart && hour < CONSTRAINTS.peakEnd;
  const inEvening = hour >= CONSTRAINTS.noEveningHighStakes;
  const isWed = day === 'Wed';
  const isFri = day === 'Fri';
  const friAfterCutoff = isFri && hour >= CONSTRAINTS.fridayCutoff;

  if (friAfterCutoff) return 'Friday after 1pm — custody day, work prohibited.';
  if (task.avoid === 'peak' && inPeak) return 'Peak window burn — this work doesn\'t earn 7-11am hours.';
  if (task.avoid === 'evening' && inEvening) return 'High-stakes work scheduled after 7pm — drafting prohibited per schedule.';
  if (task.avoid === 'wednesday' && isWed) return 'Wednesday is writing day — FF delivery displaces memoir.';
  if (task.avoid === 'late_evening' && hour >= 21) return 'Past 9pm — drafting quality degrades.';
  return null;
};

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap');
* { box-sizing: border-box; }
:root {
  --bg: #0c0d10; --bg-2: #14161b; --bg-3: #1c1f29;
  --fg: #e8e9ed; --fg-dim: #8a8f9a; --fg-mute: #555a65;
  --border: #1f2229; --border-bright: #2c303a; --accent: #cbd5e1;
  --peak: #fcd34d; --writing: #b89968; --custody: #ef4444;
}
body, .root { margin: 0; background: var(--bg); color: var(--fg); font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.55; }
.root { min-height: 100vh; padding: 48px 24px 96px; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(203,213,225,0.04), transparent 60%), var(--bg); }
.container { max-width: 1320px; margin: 0 auto; }

.header { display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end; padding-bottom: 24px; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
.kicker { font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase; color: var(--fg-dim); margin: 0 0 14px; display: flex; align-items: center; gap: 8px; }
.title-serif { font-family: 'Instrument Serif', serif; font-size: clamp(38px, 5.4vw, 64px); line-height: 0.96; margin: 0; font-weight: 400; letter-spacing: -0.02em; }
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 12.5px; color: var(--fg-dim); margin: 12px 0 0; max-width: 60ch; line-height: 1.6; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--fg); font-weight: 500; }

.legend { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 24px; padding: 12px 16px; background: var(--bg-2); border: 1px solid var(--border); font-size: 11px; }
.legend-item { display: flex; align-items: center; gap: 6px; color: var(--fg-dim); }
.legend-dot { width: 10px; height: 10px; }

.layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }

.grid-wrap { background: var(--bg-2); border: 1px solid var(--border); overflow: hidden; }
.grid-row { display: grid; grid-template-columns: 50px repeat(7, 1fr); border-bottom: 1px solid var(--border); }
.grid-row:last-child { border-bottom: none; }
.grid-cell { padding: 6px 8px; border-right: 1px solid var(--border); min-height: 38px; font-size: 11px; display: flex; align-items: center; position: relative; }
.grid-cell:last-child { border-right: none; }

.grid-cell.head { background: var(--bg-3); font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fg-dim); justify-content: center; font-weight: 600; }
.grid-cell.hour-label { background: var(--bg-3); color: var(--fg-mute); font-family: 'JetBrains Mono', monospace; font-size: 9.5px; justify-content: center; }
.grid-cell.is-peak { background: rgba(252,211,77,0.04); }
.grid-cell.is-writing-day { background: rgba(184,153,104,0.04); }
.grid-cell.is-custody { background: rgba(239,68,68,0.04); pointer-events: none; opacity: 0.5; }
.grid-cell.is-conflict { box-shadow: inset 0 0 0 1px #fb923c; }

.cell-task { padding: 3px 6px; font-size: 10px; line-height: 1.3; cursor: pointer; transition: all 0.15s; width: 100%; height: 100%; display: flex; align-items: center; background: var(--task-bg); color: var(--fg); border-left: 2px solid var(--task-color); }
.cell-task:hover { filter: brightness(1.15); }
.cell-empty { width: 100%; height: 100%; cursor: pointer; transition: background 0.12s; }
.cell-empty:hover { background: rgba(255,255,255,0.03); }
.cell-conflict-flag { position: absolute; top: 3px; right: 3px; color: #fb923c; }

.sidebar { position: sticky; top: 24px; display: grid; gap: 12px; }

.tasks-card { border: 1px solid var(--border); background: var(--bg-2); padding: 16px; }
.tasks-card-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 10px; }
.task-pill { display: grid; grid-template-columns: 4px 1fr auto; gap: 10px; align-items: center; padding: 7px 10px; cursor: pointer; transition: background 0.12s; margin-bottom: 4px; border-left: 2px solid var(--tp-accent); background: transparent; }
.task-pill:hover { background: rgba(255,255,255,0.02); }
.task-pill.active { background: rgba(255,255,255,0.04); }
.task-pill-bar { width: 4px; height: 100%; background: var(--tp-accent); }
.task-pill-label { font-size: 11px; color: var(--fg); }
.task-pill-ideal { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-mute); font-family: 'JetBrains Mono', monospace; }

.clear-btn { width: 100%; padding: 8px; background: var(--bg-3); border: 1px solid var(--border-bright); color: var(--fg-dim); cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; margin-top: 6px; }
.clear-btn:hover { color: var(--fg); }

.stat-card { border: 1px solid var(--border); background: var(--bg-2); padding: 16px; }
.stat-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.stat-value { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 28px; line-height: 1; }
.stat-meta { margin-top: 8px; font-size: 10.5px; color: var(--fg-dim); line-height: 1.55; }

.conflict-card { border: 1px solid var(--border); background: var(--bg-2); border-left: 2px solid #fb923c; padding: 14px 16px; }
.conflict-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #fb923c; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.conflict-item { font-size: 11px; color: var(--fg); padding: 5px 0; border-bottom: 1px solid var(--border); line-height: 1.5; }
.conflict-item:last-child { border-bottom: none; }
.conflict-item strong { color: #fb923c; }

.claims { margin-top: 36px; padding: 22px; border: 1px solid var(--border); background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7; }
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }
.claims strong { color: var(--fg); font-weight: 500; }

@media (max-width: 1100px) { .layout { grid-template-columns: 1fr; } .sidebar { position: static; } }
@media (max-width: 700px) { .header { grid-template-columns: 1fr; } .meta { text-align: left; } .grid-cell { font-size: 9px; padding: 4px 2px; } }
`;

export default function CognitiveScheduleMapper() {
  const [assignments, setAssignments] = useState(SEEDED_ASSIGNMENTS);
  const [selectedTask, setSelectedTask] = useState('ff_strategy');

  const setSlot = (day, hour) => {
    const key = `${day}-${hour}`;
    setAssignments(prev => {
      const next = { ...prev };
      if (next[key] === selectedTask) delete next[key];
      else next[key] = selectedTask;
      return next;
    });
  };

  const conflicts = useMemo(() => {
    const result = [];
    Object.entries(assignments).forEach(([key, taskId]) => {
      const [day, hourStr] = key.split('-');
      const hour = parseInt(hourStr);
      const conflict = isWindowConflict(day, hour, taskId);
      if (conflict) {
        const task = TASK_TYPES.find(t => t.id === taskId);
        result.push({ day, hour, taskId, task, msg: conflict });
      }
    });
    return result;
  }, [assignments]);

  const stats = useMemo(() => {
    const totalSlots = Object.keys(assignments).length;
    const peakUsed = Object.entries(assignments).filter(([k]) => {
      const h = parseInt(k.split('-')[1]);
      return h >= CONSTRAINTS.peakStart && h < CONSTRAINTS.peakEnd;
    }).length;
    return { totalSlots, peakUsed };
  }, [assignments]);

  const clearAll = () => setAssignments({});

  const isPeak = (h) => h >= CONSTRAINTS.peakStart && h < CONSTRAINTS.peakEnd;
  const isWritingDay = (d) => d === 'Wed';
  const isCustody = (d, h) => d === 'Fri' && h >= CONSTRAINTS.fridayCutoff;

  return (
    <>
      <style>{STYLE}</style>
      <div className="root">
        <div className="container">

          <div className="header">
            <div>
              <p className="kicker"><Clock size={12} /> Scheduling Layer // Bio-Cognitive</p>
              <h1 className="title-serif">The <em>Schedule</em>.</h1>
              <p className="title-sub">
                Weekly grid with structural constraints visible: peak 7-11am highlighted, Wednesday writing day shaded, Friday post-1pm locked for custody. Pick a task type from the sidebar and click slots to assign. Conflicts flagged when scheduled work fights the schedule.
              </p>
            </div>
            <div className="meta">
              <div>Slots assigned <strong>{stats.totalSlots}</strong></div>
              <div style={{ marginTop: 4 }}>Peak hours used <strong>{stats.peakUsed} / 20</strong></div>
              <div style={{ marginTop: 4 }}>Conflicts <strong style={{ color: conflicts.length > 0 ? '#fb923c' : '#4ade80' }}>{conflicts.length}</strong></div>
            </div>
          </div>

          <div className="legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(252,211,77,0.4)' }} /> Peak window 7-11am</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(184,153,104,0.4)' }} /> Wednesday writing day</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: 'rgba(239,68,68,0.4)' }} /> Friday custody (post-1pm)</div>
            <div className="legend-item"><AlertTriangle size={11} color="#fb923c" /> Conflict — task fights window</div>
          </div>

          <div className="layout">

            <div className="grid-wrap">
              <div className="grid-row">
                <div className="grid-cell head"></div>
                {DAYS.map(d => <div key={d} className="grid-cell head">{d}</div>)}
              </div>
              {HOURS.map(h => (
                <div key={h} className="grid-row">
                  <div className="grid-cell hour-label">{h}:00</div>
                  {DAYS.map(d => {
                    const key = `${d}-${h}`;
                    const taskId = assignments[key];
                    const task = taskId ? TASK_TYPES.find(t => t.id === taskId) : null;
                    const conflict = taskId ? isWindowConflict(d, h, taskId) : null;
                    const peakClass = isPeak(h) && d !== 'Sat' && d !== 'Sun' ? 'is-peak' : '';
                    const writingClass = isWritingDay(d) ? 'is-writing-day' : '';
                    const custodyClass = isCustody(d, h) ? 'is-custody' : '';
                    const conflictClass = conflict ? 'is-conflict' : '';
                    return (
                      <div key={d} className={`grid-cell ${peakClass} ${writingClass} ${custodyClass} ${conflictClass}`}>
                        {task ? (
                          <div
                            className="cell-task"
                            style={{ ['--task-bg']: `${task.accent}20`, ['--task-color']: task.accent }}
                            onClick={() => setSlot(d, h)}
                            title={conflict || task.label}
                          >
                            {task.label.replace(' work', '').replace(' / email / ops', '').replace(' writing', '').replace('Memoir ', 'M:').replace('FF ', '').replace('Products ', '')}
                          </div>
                        ) : (
                          <div className="cell-empty" onClick={() => !isCustody(d, h) && setSlot(d, h)} />
                        )}
                        {conflict && <AlertTriangle size={10} className="cell-conflict-flag" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="sidebar">

              <div className="tasks-card">
                <div className="tasks-card-label">Task types · click then assign</div>
                {TASK_TYPES.map(t => (
                  <div
                    key={t.id}
                    className={`task-pill ${selectedTask === t.id ? 'active' : ''}`}
                    style={{ ['--tp-accent']: t.accent }}
                    onClick={() => setSelectedTask(t.id)}
                  >
                    <div className="task-pill-bar" />
                    <div className="task-pill-label">{t.label}</div>
                    <div className="task-pill-ideal">{t.ideal}</div>
                  </div>
                ))}
                <button className="clear-btn" onClick={clearAll}>Clear all assignments</button>
              </div>

              <div className="stat-card">
                <div className="stat-label"><Sun size={9} /> Peak window utilization</div>
                <div className="stat-value">{stats.peakUsed}<span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--fg-dim)', marginLeft: 4, fontStyle: 'normal' }}>/ 20</span></div>
                <div className="stat-meta">
                  {stats.peakUsed >= 16 ? 'Peak hours saturated. Strong allocation discipline.' : stats.peakUsed >= 10 ? 'Peak hours moderate. Room to push high-stakes work in.' : 'Peak hours under-used. The 7-11am window is the most valuable bandwidth Kyle has — don\'t leave it empty.'}
                </div>
              </div>

              {conflicts.length > 0 && (
                <div className="conflict-card">
                  <div className="conflict-label"><AlertTriangle size={9} /> Conflicts ({conflicts.length})</div>
                  {conflicts.slice(0, 6).map((c, i) => (
                    <div key={i} className="conflict-item">
                      <strong>{c.day} {c.hour}:00</strong> · {c.task.label}: {c.msg}
                    </div>
                  ))}
                  {conflicts.length > 6 && (
                    <div className="conflict-item" style={{ fontStyle: 'italic', color: 'var(--fg-dim)' }}>
                      +{conflicts.length - 6} more conflicts. Resolve or accept deliberately.
                    </div>
                  )}
                </div>
              )}

              {conflicts.length === 0 && stats.totalSlots > 0 && (
                <div className="stat-card">
                  <div className="stat-label"><Coffee size={9} /> Schedule integrity</div>
                  <div className="stat-meta">No conflicts. Tasks land in windows that match their cognitive load. The schedule is doing the work — not the heroics.</div>
                </div>
              )}

            </div>
          </div>

          <div className="claims">
            <h4><Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Constraints encoded in this artifact</h4>
            <ul>
              <li><strong>Peak window 7-11am</strong> across weekdays. High-stakes drafting (FF strategy, memoir excavation/draft) belongs here. Admin and Products build work do NOT — those are flagged as conflicts when scheduled in peak.</li>
              <li><strong>Wednesday = writing day</strong>. The full day belongs to memoir drafting. Scheduling FF delivery on Wednesday is a flagged conflict — it displaces the structural writing block.</li>
              <li><strong>Friday post-1pm = custody day</strong>. The grid renders these cells as locked (red tint, click disabled). Custody is non-negotiable — the artifact cannot be used to schedule work into Kinsley's time.</li>
              <li><strong>Evenings (post-7pm) prohibit high-stakes drafting</strong>. Memoir drafting after 7pm is flagged. FF strategy after 7pm is flagged. Products build is fine in evenings — that's its ideal window.</li>
              <li><strong>The "ideal" tag in the sidebar</strong> matches task type to recommended window. Peak (7-11am), morning (7am-noon), afternoon (12pm-7pm), evening (post-7pm), wednesday (full day). The conflict detector enforces the "avoid" rules.</li>
              <li><strong>What this scheduler does not model</strong>: day-job hours (assumed to overlap with most weekday slots but not blocked), exact day-job calendar conflicts, energy variation across the week, the toll of scheduling vs the toll of doing. Treat this as the ideal week — actual execution will deviate.</li>
              <li><strong>Peak utilization signal</strong>: if you're showing &lt;10 peak slots filled across a week, you're under-using the most valuable cognitive bandwidth Kyle has. Push high-stakes work into those slots before admin reaches up and steals them.</li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
