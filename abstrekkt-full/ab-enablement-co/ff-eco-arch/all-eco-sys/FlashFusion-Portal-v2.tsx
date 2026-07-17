import React, { useState, useCallback, useMemo, useReducer, ReactNode } from 'react';
import {
  ShieldCheck, Zap, LayoutGrid, Settings, BarChart3, Users, Cpu, History, Search,
  ChevronRight, Database, Lock, Timer, Sparkles, ArrowUpRight, Terminal, FileCode,
  Download, Trash2, ChevronLeft, Play, CheckCircle2, RefreshCcw, Lightbulb, Waves,
  Fingerprint, Atom, Activity, ZapOff
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type ViewType = 'portal' | 'tool';
type VibeModeType = 'Rigid' | 'Balanced' | 'Creative' | 'Fusion';
type DepartmentName = 'AIaaS' | 'Engineering' | 'Sales' | 'HR' | 'Finance' | 'Legal';

interface Department {
  name: DepartmentName;
  color: string;
  icon: ReactNode;
}

interface SuggestionSet {
  [key in DepartmentName]: string[];
}

interface BuildLog {
  timestamp: string;
  module: string;
  status: 'pending' | 'active' | 'complete' | 'error';
  message: string;
}

interface AppState {
  view: ViewType;
  activeDept: DepartmentName;
  isBuilding: boolean;
  buildStep: number;
  prompt: string;
  refreshRotation: number;
  vibeMode: VibeModeType;
}

type AppAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'SET_DEPT'; payload: DepartmentName }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'START_BUILD' }
  | { type: 'NEXT_BUILD_STEP' }
  | { type: 'COMPLETE_BUILD' }
  | { type: 'RESET_BUILD' }
  | { type: 'SET_VIBE'; payload: VibeModeType }
  | { type: 'ROTATE_IDEA' };

// ============================================================================
// REDUCER
// ============================================================================

const initialState: AppState = {
  view: 'portal',
  activeDept: 'AIaaS',
  isBuilding: false,
  buildStep: 0,
  prompt: '',
  refreshRotation: 0,
  vibeMode: 'Balanced',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_DEPT':
      return { ...state, activeDept: action.payload };
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload };
    case 'START_BUILD':
      return state.prompt ? { ...state, isBuilding: true, buildStep: 0 } : state;
    case 'NEXT_BUILD_STEP':
      return { ...state, buildStep: state.buildStep + 1 };
    case 'COMPLETE_BUILD':
      return { ...state, isBuilding: false };
    case 'RESET_BUILD':
      return { ...state, isBuilding: false, buildStep: 0 };
    case 'SET_VIBE':
      return { ...state, vibeMode: action.payload };
    case 'ROTATE_IDEA':
      return { ...state, refreshRotation: state.refreshRotation + 1 };
    default:
      return state;
  }
}

// ============================================================================
// DATA & CONSTANTS
// ============================================================================

const DEPARTMENTS: Department[] = [
  { name: 'AIaaS', color: 'fuchsia', icon: <Atom size={18} className="text-fuchsia-500" /> },
  { name: 'Engineering', color: 'fuchsia', icon: <Cpu size={18} /> },
  { name: 'Sales', color: 'amber', icon: <BarChart3 size={18} /> },
  { name: 'HR', color: 'purple', icon: <Users size={18} /> },
  { name: 'Finance', color: 'rose', icon: <Database size={18} /> },
  { name: 'Legal', color: 'slate', icon: <ShieldCheck size={18} /> },
];

const SUGGESTIONS: SuggestionSet = {
  AIaaS: [
    'Fuse Multi-Agent SOC 2 Evidence Collection',
    'Flash-Deploy Ephemeral MCP Proxy',
    'Sync Token-Cost Attribution across Substrates',
  ],
  Engineering: [
    'Flash-Gen Unit Tests for Stripe Webhooks',
    'Synthesize Architecture RFC for Global Redis',
    'Audit PR #402 for Zero-Day Vulnerabilities',
  ],
  Sales: [
    'Atomic Summary: Q1 Gong Calls (Territory B)',
    'Flash-Reach: Personalized Top 50 Leads',
    'Fusion Map: Competitor Pricing Segments',
  ],
  HR: [
    'Instant Anonymization: 500 Resumes',
    'Vibe Audit: Slack Q3 Engagement Sentiment',
    'Fusion-Loop: Staff Engineer Interview Set',
  ],
  Finance: [
    'Substrate Reconciliation: Redis vs Stripe',
    'Anomaly Flash: Detect Expense Deviations',
    'Instant 10-K: R&D Tax Credit Synthesis',
  ],
  Legal: [
    'Atomic Abstraction: 50 Vendor Leases',
    'Flash-Review: MSA Indemnity Variance',
    'Fusion Report: Internal IP Provenance',
  ],
};

const GLOBAL_IDEAS = [
  'Flash-Migrate: Legacy CRM to Supabase Substrate',
  'Instant Health Dashboard: Vercel Edge Metrics',
  'Atomic Parser: High-Volume Lease Abstraction',
  'Fusion Security: PR Secret Scanning Agent',
  'Predictive Churn: Stripe Event Fusion Model',
  'Internal Vibe-Bot: HR Policy Instant Lookup',
  'Edge Monitor: Lambda Cold-Start Flash Audit',
  'Finance Fusion: Weekly SaaS-Waste Summary',
];

function generateBuildLogs(vibeMode: VibeModeType): BuildLog[] {
  return [
    { timestamp: new Date().toLocaleTimeString([], { hour12: false }), module: 'FUSION_CORE', status: 'active', message: 'Spinning up Fusion Core v4.6...' },
    { timestamp: new Date().toLocaleTimeString([], { hour12: false }), module: 'FUSION_CORE', status: 'active', message: 'Aligning Flash-Frequencies with Agent Cluster...' },
    { timestamp: new Date().toLocaleTimeString([], { hour12: false }), module: 'FUSION_CORE', status: 'active', message: 'Establishing Isolated Substrate (RLS Enforced)...' },
    { timestamp: new Date().toLocaleTimeString([], { hour12: false }), module: 'FUSION_CORE', status: 'active', message: 'Atomic Intent Analysis via Claude 4.6...' },
    { timestamp: new Date().toLocaleTimeString([], { hour12: false }), module: 'FUSION_CORE', status: 'active', message: `Synthesizing Ephemeral Logic (Vibe: ${vibeMode.toUpperCase()})...` },
    { timestamp: new Date().toLocaleTimeString([], { hour12: false }), module: 'FUSION_CORE', status: 'active', message: 'Hardened Security Audit (FlashScan Active)...' },
    { timestamp: new Date().toLocaleTimeString([], { hour12: false }), module: 'FUSION_CORE', status: 'active', message: 'Deploying to Fusion-Edge Infrastructure...' },
    { timestamp: new Date().toLocaleTimeString([], { hour12: false }), module: 'FUSION_CORE', status: 'complete', message: 'Sealing Substrate with FLASH_SOVEREIGN keys...' },
  ];
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface DepartmentButtonProps {
  dept: Department;
  isActive: boolean;
  onClick: () => void;
}

const DepartmentButton = React.memo(({ dept, isActive, onClick }: DepartmentButtonProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
      isActive
        ? 'bg-fuchsia-600/10 border border-fuchsia-500/50 text-fuchsia-400 shadow-[0_0_30px_rgba(192,38,211,0.1)]'
        : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
    }`}
    aria-pressed={isActive}
  >
    <div className="flex items-center gap-4 text-sm font-bold">
      <span className={isActive ? 'text-fuchsia-400' : 'text-slate-600 group-hover:text-fuchsia-400 transition-colors'}>
        {dept.icon}
      </span>
      {dept.name}
    </div>
    {isActive && <Waves size={14} className="animate-pulse" />}
  </button>
));
DepartmentButton.displayName = 'DepartmentButton';

interface SuggestionCardProps {
  text: string;
  onClick: () => void;
}

const SuggestionCard = React.memo(({ text, onClick }: SuggestionCardProps) => (
  <button
    onClick={onClick}
    className="group text-left p-6 bg-white/5 hover:bg-fuchsia-600 border border-white/5 hover:border-fuchsia-500 rounded-3xl transition-all duration-500 shadow-lg"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(192,38,211,1)]" />
      <ArrowUpRight size={16} className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </div>
    <span className="text-xs font-black text-slate-400 group-hover:text-white leading-tight uppercase tracking-tight">{text}</span>
  </button>
));
SuggestionCard.displayName = 'SuggestionCard';

interface BuildLogItemProps {
  log: BuildLog;
}

const BuildLogItem = React.memo(({ log }: BuildLogItemProps) => (
  <div className="flex items-start gap-6 text-fuchsia-400/90 animate-in fade-in slide-in-from-left-6">
    <span className="text-slate-700 shrink-0 font-mono text-xs">[{log.timestamp}]</span>
    <span className="text-amber-500 font-black uppercase text-xs">{log.module}</span>
    <span className="text-slate-400 text-xs md:text-sm font-mono">{log.message}</span>
  </div>
));
BuildLogItem.displayName = 'BuildLogItem';

interface PortalViewProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const PortalView = React.memo(({ state, dispatch }: PortalViewProps) => {
  const activeDeptData = DEPARTMENTS.find(d => d.name === state.activeDept);
  const currentSuggestions = SUGGESTIONS[state.activeDept];
  const currentIdea = GLOBAL_IDEAS[state.refreshRotation % GLOBAL_IDEAS.length];
  const buildLogs = useMemo(() => generateBuildLogs(state.vibeMode), [state.vibeMode]);

  const handleRefreshIdea = useCallback(() => {
    const nextIdea = GLOBAL_IDEAS[(state.refreshRotation + 1) % GLOBAL_IDEAS.length];
    dispatch({ type: 'SET_PROMPT', payload: nextIdea });
    dispatch({ type: 'ROTATE_IDEA' });
  }, [state.refreshRotation, dispatch]);

  const handleBuild = useCallback(() => {
    if (state.prompt) {
      dispatch({ type: 'START_BUILD' });
    }
  }, [state.prompt, dispatch]);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans antialiased selection:bg-fuchsia-500/30">
      <nav className="h-16 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-fuchsia-600 p-1.5 rounded-lg text-white shadow-[0_0_20px_rgba(192,38,211,0.5)]">
            <Atom size={20} className="animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="flex flex-col">
            <span className="font-black tracking-tighter text-xl leading-none italic uppercase">FlashFusion</span>
            <span className="text-[10px] font-bold text-fuchsia-500 tracking-[0.3em] uppercase">Substrate Alpha</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold text-slate-500 tracking-widest">
            <span className="flex items-center gap-2"><Activity size={12} className="text-fuchsia-500" /> CORE_STABLE</span>
            <span className="flex items-center gap-2 text-amber-500"><ShieldCheck size={12} /> RLS_LOCKED</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-fuchsia-600 to-amber-500 p-0.5 shadow-[0_0_15px_rgba(192,38,211,0.3)]">
            <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-xs font-bold">KY</div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-12 gap-10">
        <aside className="col-span-12 lg:col-span-3 space-y-2">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-3 mb-6">Domain Substrate</h2>
          {DEPARTMENTS.map((dept) => (
            <DepartmentButton
              key={dept.name}
              dept={dept}
              isActive={state.activeDept === dept.name}
              onClick={() => dispatch({ type: 'SET_DEPT', payload: dept.name })}
            />
          ))}

          <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-black rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-fuchsia-600/20 transition-all" />
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4 text-fuchsia-500">
              <Zap size={14} /> Flash Logic
            </div>
            <p className="text-sm font-bold leading-relaxed text-slate-300 italic">
              "We don't buy seats. We manifest outcomes."
            </p>
            <div className="mt-6 pt-6 border-t border-white/5 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              Fusion Core v4.6
            </div>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-10">
          <section className="bg-gradient-to-b from-slate-900/50 to-black rounded-[3rem] border border-white/5 p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-600 to-transparent opacity-50" />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-fuchsia-600/20 p-3 rounded-2xl text-fuchsia-500 border border-fuchsia-500/20 shadow-[0_0_20px_rgba(192,38,211,0.2)]">
                  <Sparkles size={28} />
                </div>
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Atomic Manifest</h2>
              </div>

              <div className="flex bg-black/50 p-1.5 rounded-2xl border border-white/10">
                {(['Rigid', 'Balanced', 'Creative', 'Fusion'] as VibeModeType[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => dispatch({ type: 'SET_VIBE', payload: mode })}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      state.vibeMode === mode
                        ? 'bg-fuchsia-600 text-white shadow-lg'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={state.prompt}
                onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
                placeholder={`Input intent for ${state.activeDept} fusion...`}
                className="w-full h-56 bg-black/40 border border-white/10 rounded-[2.5rem] p-10 text-2xl font-bold focus:outline-none focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/5 transition-all resize-none placeholder:text-slate-800 tracking-tight text-slate-100"
              />
              <div className="absolute bottom-8 right-8 flex items-center gap-4">
                <button
                  onClick={handleRefreshIdea}
                  className="p-4 text-slate-600 hover:text-fuchsia-500 hover:bg-fuchsia-500/10 rounded-2xl transition-all group"
                  aria-label="Refresh idea suggestion"
                >
                  <RefreshCcw
                    size={24}
                    className={state.isBuilding ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}
                  />
                </button>
                <button
                  onClick={handleBuild}
                  disabled={state.isBuilding || !state.prompt}
                  className={`flex items-center gap-4 px-12 py-5 rounded-[2rem] font-black text-xl italic uppercase tracking-tighter shadow-2xl transition-all ${
                    state.isBuilding || !state.prompt
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 hover:scale-[1.02] active:scale-95 shadow-fuchsia-600/40'
                  }`}
                >
                  <Zap size={24} fill="currentColor" />
                  Fuse Intent
                </button>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                <LayoutGrid size={16} className="text-fuchsia-600" /> Logic Blueprints
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentSuggestions.map((suggestion, idx) => (
                  <SuggestionCard
                    key={idx}
                    text={suggestion}
                    onClick={() => dispatch({ type: 'SET_PROMPT', payload: suggestion })}
                  />
                ))}
              </div>
            </div>
          </section>

          {(state.isBuilding || state.buildStep > 0) && (
            <BuildSequence
              buildLogs={buildLogs}
              currentStep={state.buildStep}
              isBuilding={state.isBuilding}
              vibeMode={state.vibeMode}
              onLaunch={() => dispatch({ type: 'SET_VIEW', payload: 'tool' })}
              onDispatch={dispatch}
            />
          )}
        </main>
      </div>
    </div>
  );
});
PortalView.displayName = 'PortalView';

interface BuildSequenceProps {
  buildLogs: BuildLog[];
  currentStep: number;
  isBuilding: boolean;
  vibeMode: VibeModeType;
  onLaunch: () => void;
  onDispatch: React.Dispatch<AppAction>;
}

const BuildSequence = React.memo(({ buildLogs, currentStep, isBuilding, vibeMode, onLaunch, onDispatch }: BuildSequenceProps) => {
  React.useEffect(() => {
    if (isBuilding && currentStep < buildLogs.length) {
      const timer = setTimeout(() => {
        onDispatch({ type: 'NEXT_BUILD_STEP' });
      }, 500);
      return () => clearTimeout(timer);
    } else if (!isBuilding && currentStep === buildLogs.length) {
      onDispatch({ type: 'COMPLETE_BUILD' });
    }
  }, [isBuilding, currentStep, buildLogs.length, onDispatch]);

  const visibleLogs = buildLogs.slice(0, currentStep);
  const isComplete = currentStep === buildLogs.length;

  return (
    <section className="bg-slate-950 rounded-[3.5rem] overflow-hidden shadow-[0_0_60px_rgba(192,38,211,0.15)] border border-fuchsia-500/20 animate-in slide-in-from-bottom-12 duration-700">
      <div className="p-8 bg-black/60 border-b border-fuchsia-500/20 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-fuchsia-600 animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-amber-600 animate-pulse" style={{ animationDelay: '75ms' }} />
            <div className="w-3 h-3 rounded-full bg-fuchsia-600 animate-pulse" style={{ animationDelay: '150ms' }} />
          </div>
          <span className="text-[11px] font-black font-mono text-fuchsia-500 tracking-[0.4em] uppercase ml-6">Fusion_Terminal_v4.6</span>
        </div>
        <div className="flex items-center gap-4 px-5 py-2 bg-fuchsia-600/10 rounded-full border border-fuchsia-500/30">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
          <span className="text-[10px] font-black font-mono text-fuchsia-400 uppercase">RLS_LOCKED</span>
        </div>
      </div>

      <div className="p-12 font-mono text-xs md:text-sm space-y-5">
        {visibleLogs.map((log, i) => (
          <BuildLogItem key={i} log={log} />
        ))}

        {isBuilding && currentStep < buildLogs.length && (
          <div className="flex items-start gap-6 text-white animate-pulse">
            <span className="text-slate-700 shrink-0 font-mono text-xs">[{buildLogs[currentStep]?.timestamp || new Date().toLocaleTimeString([], { hour12: false })}]</span>
            <span className="text-fuchsia-500 font-black uppercase text-xs">FLASH_SYNC</span>
            <span className="text-white font-bold text-xs md:text-sm">{buildLogs[currentStep]?.message || 'Building...'}</span>
          </div>
        )}

        {isComplete && (
          <div className="mt-14 p-14 border border-fuchsia-500/20 rounded-[3rem] bg-fuchsia-600/5 flex flex-col items-center justify-center space-y-10 animate-in zoom-in-95 duration-700">
            <div className="bg-fuchsia-600 p-6 rounded-[2rem] shadow-[0_0_50px_rgba(192,38,211,0.6)] border-4 border-white/20">
              <Atom size={48} className="text-white" style={{ animation: 'spin 3s linear infinite' }} />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">Fusion Successful</h3>
              <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed font-bold tracking-tight">
                Ephemeral substrate manifested with <span className="text-fuchsia-500 font-black">{vibeMode.toUpperCase()}</span> logic. Security scan verified 100% integrity.
              </p>
            </div>
            <button
              onClick={onLaunch}
              className="bg-white text-black px-16 py-6 rounded-[2.5rem] font-black text-xl italic uppercase shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
            >
              Launch Flash-Tool
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
});
BuildSequence.displayName = 'BuildSequence';

interface ToolViewProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const ToolView = React.memo(({ state, dispatch }: ToolViewProps) => {
  const metrics = useMemo(() => ({
    time: '2.8s',
    efficiency: '99.1%',
    risk: 'Zero',
  }), []);

  return (
    <div className="min-h-screen bg-[#020202] text-slate-100 flex flex-col font-sans antialiased">
      <header className="h-20 border-b border-white/5 bg-black/80 backdrop-blur-2xl px-10 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'portal' })}
            className="text-slate-600 hover:text-fuchsia-500 p-3 hover:bg-fuchsia-500/10 rounded-2xl transition-all"
            aria-label="Back to portal"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <Atom className="text-fuchsia-500" size={20} />
              <h1 className="text-lg font-black tracking-tighter text-white uppercase truncate max-w-[500px] italic">
                {state.prompt}
              </h1>
            </div>
            <div className="text-[10px] font-black text-slate-700 tracking-[0.5em] uppercase">Fusion Sequence: {state.vibeMode}</div>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 px-6 py-2.5 bg-amber-500/10 rounded-full border border-amber-500/20">
            <Timer size={16} className="text-amber-500" />
            <span className="text-[11px] font-black text-amber-500 font-mono tracking-widest uppercase">Incineration in 23:59:42</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 hover:text-white transition-colors" aria-label="Download">
              <Download size={24} />
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'SET_VIEW', payload: 'portal' });
                dispatch({ type: 'RESET_BUILD' });
              }}
              className="text-slate-600 hover:text-fuchsia-500 transition-colors"
              aria-label="Close tool"
            >
              <ZapOff size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-96 border-r border-white/5 bg-black/40 p-12 space-y-12 hidden lg:block overflow-y-auto">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Substrate Context</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="text-[9px] text-slate-600 mb-2 uppercase font-black tracking-widest">Logic Partition</div>
                <div className="text-sm font-black text-fuchsia-400 italic uppercase tracking-tighter">{state.activeDept} Core</div>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <div className="text-[9px] text-slate-600 mb-2 uppercase font-black tracking-widest">Vibe Scaling</div>
                <div className="text-sm font-black text-amber-500 italic uppercase tracking-tighter">{state.vibeMode}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-10 border-t border-white/5">
            <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Atomic Components</h3>
            <div className="space-y-3">
              {['fusion_manifest.json', 'agent_prime.ts', 'substrate_auth.rs', 'rls_policy.sql'].map(file => (
                <div key={file} className="flex items-center justify-between p-4 rounded-2xl text-xs text-slate-500 hover:bg-fuchsia-600 hover:text-white cursor-pointer group transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <FileCode size={18} className="text-fuchsia-500 group-hover:text-white" />
                    <span className="font-bold uppercase tracking-tight">{file}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-fuchsia-600/5 rounded-[2.5rem] border border-fuchsia-500/20 space-y-6">
            <div className="flex items-center gap-3 text-[10px] font-black text-fuchsia-500 uppercase tracking-[0.3em]">
              <ShieldCheck size={18} /> Substrate Trust
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed font-bold tracking-tight">
              Hardware-sealed integrity via <span className="text-fuchsia-400 font-black">FLASH_SOVEREIGN</span>. Partition {state.activeDept} isolation active.
            </div>
          </div>
        </aside>

        <div className="flex-1 bg-black p-12 md:p-24 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-fuchsia-500 font-black text-xs uppercase tracking-[0.4em]">Synthesis Complete</div>
                <h2 className="text-6xl font-black text-white tracking-tighter italic uppercase">Atomic Core Ready.</h2>
                <p className="text-slate-600 text-xl font-bold tracking-tight max-w-2xl">FlashFusion agents have synthesized a high-performance response aligned with your vibe intent.</p>
              </div>
              <button className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl italic uppercase shadow-[0_0_50px_rgba(192,38,211,0.4)] hover:scale-105 active:scale-95 transition-all mb-2 flex items-center gap-4">
                <Play size={24} fill="currentColor" />
                Launch Core
              </button>
            </div>

            <div className="space-y-10">
              <div className="bg-gradient-to-br from-slate-900/50 to-black border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-10 py-6 text-[11px] font-black font-mono text-slate-500 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Atom size={18} className="text-fuchsia-500" />
                    <span className="tracking-[0.5em] uppercase italic">FLASH_CORE_SYNTHESIS</span>
                  </div>
                  <span className="text-fuchsia-500 font-black px-4 py-1 bg-fuchsia-500/10 rounded-full tracking-widest text-[9px]">SUBSTRATE_TS</span>
                </div>
                <div className="p-12 font-mono text-sm md:text-lg text-fuchsia-400/80 leading-relaxed whitespace-pre overflow-x-auto selection:bg-fuchsia-500/30">
                  {`/**\n * FLASHFUSION SOVEREIGN SUBSTRATE\n * DOMAIN: ${state.activeDept} | VIBE: ${state.vibeMode.toUpperCase()}\n */\n\nexport async function atomic_workflow() {\n  const partition = '${state.activeDept}';\n  const vibeContext = '${state.vibeMode}';\n  \n  // Intent Mapping\n  const intent = '${state.prompt}';\n\n  return await orchestrate({\n    partition,\n    vibe_bias: vibeContext,\n    intent,\n    rls: true,\n    integrity: 'FLASH_MAX'\n  });\n}`}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white/5 p-10 rounded-[3rem] border border-white/5 space-y-10">
                  <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] flex items-center gap-3">
                    <Fingerprint size={20} className="text-fuchsia-500" /> Flash Provenance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-black rounded-3xl border border-white/5 text-center">
                      <div className="text-[9px] text-slate-600 mb-2 uppercase font-black">Fusion Time</div>
                      <div className="text-2xl font-black text-white italic">{metrics.time}</div>
                    </div>
                    <div className="p-6 bg-black rounded-3xl border border-white/5 text-center">
                      <div className="text-[9px] text-slate-600 mb-2 uppercase font-black">Efficiency</div>
                      <div className="text-2xl font-black text-emerald-400 italic">{metrics.efficiency}</div>
                    </div>
                    <div className="p-6 bg-black rounded-3xl border border-white/5 text-center">
                      <div className="text-[9px] text-slate-600 mb-2 uppercase font-black">Risk Factor</div>
                      <div className="text-2xl font-black text-fuchsia-500 italic uppercase">{metrics.risk}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-fuchsia-600 to-amber-600 p-10 rounded-[3rem] shadow-2xl shadow-fuchsia-600/20 flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-all">
                  <div className="space-y-6">
                    <div className="bg-black/20 w-16 h-16 rounded-3xl flex items-center justify-center text-white">
                      <Lightbulb size={32} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
                    </div>
                    <h4 className="text-2xl font-black text-white italic leading-tight uppercase tracking-tighter">Fusion Suggestion</h4>
                    <p className="text-white/80 text-sm font-bold leading-tight">
                      "Since you are in {state.vibeMode} mode, consider shifting to 'Atomic Depth' to optimize substrate I/O."
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-black text-white uppercase tracking-widest mt-10">
                    Flash Apply <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-12 bg-fuchsia-600 px-10 flex items-center justify-between text-[11px] font-black text-white uppercase tracking-[0.4em] shrink-0 shadow-[0_-15px_40px_rgba(192,38,211,0.4)] relative z-50 italic">
        <div className="flex items-center gap-8">
          <span className="flex items-center gap-3"><Lock size={14} fill="currentColor" /> Substrate_Isolated</span>
          <span className="flex items-center gap-3 opacity-80"><CheckCircle2 size={14} /> Flash_Audit_Sealed</span>
        </div>
        <div className="hidden md:block opacity-70">
          CORE_HASH: {Math.random().toString(16).substring(2, 12).toUpperCase()}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,1)]" />
          FUSION_CORE_ACTIVE
        </div>
      </footer>
    </div>
  );
});
ToolView.displayName = 'ToolView';

// ============================================================================
// MAIN APP
// ============================================================================

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return state.view === 'portal' ? (
    <PortalView state={state} dispatch={dispatch} />
  ) : (
    <ToolView state={state} dispatch={dispatch} />
  );
}
