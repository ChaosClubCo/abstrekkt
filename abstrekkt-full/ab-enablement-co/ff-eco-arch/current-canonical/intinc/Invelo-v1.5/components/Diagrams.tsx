/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Activity, Server, Database, CheckCircle, AlertCircle, BarChart2, Brain, Rocket, Search, ArrowRight, Flag, ClipboardCheck, Layers, Play, UserCheck, Power } from 'lucide-react';

// --- INVELO 7-STAGE PIPELINE DIAGRAM ---
// Replaces SecurityArchitectureDiagram
export const InveloPipelineDiagram: React.FC = () => {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  
  // 7 Stages of InVelo
  const stages = [
    { id: 1, label: "Intake", icon: <Search size={14} />, desc: "Discovery call & success metrics definition. (1-2 Days)" },
    { id: 2, label: "Design", icon: <Brain size={14} />, desc: "Architecture sprint & tool selection. (3 Days)" },
    { id: 3, label: "Build", icon: <Layers size={14} />, desc: "Rapid development & compliance checks. (2 Weeks)" },
    { id: 4, label: "Deploy", icon: <Rocket size={14} />, desc: "Soft launch & data export testing. (1 Week)" },
    { id: 5, label: "Handoff", icon: <UserCheck size={14} />, desc: "Training & full ownership transfer. (Week 4)" },
    { id: 6, label: "Operate", icon: <Activity size={14} />, desc: "Optional managed support period. (2-6 Months)" },
    { id: 7, label: "Retire", icon: <Flag size={14} />, desc: "Mission Complete. Data export & deprecation. (No Lock-in)" },
  ];

  // Path coordinates for a "Snake" layout in a 300x300 box
  const coords = [
    { x: '20%', y: '20%' }, // 1. Intake
    { x: '50%', y: '20%' }, // 2. Design
    { x: '80%', y: '20%' }, // 3. Build
    { x: '80%', y: '50%' }, // 4. Deploy
    { x: '50%', y: '50%' }, // 5. Handoff
    { x: '20%', y: '50%' }, // 6. Operate
    { x: '20%', y: '80%' }, // 7. Retire
  ];

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm border border-int-navy/10 my-8" data-testid="diagram-pipeline">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck className="text-int-teal" size={24} />
        <h3 className="font-serif text-xl text-int-navy">7-Stage Delivery Playbook</h3>
      </div>
      <p className="text-sm text-gray-500 mb-8 text-center max-w-md">
        From intake to retirement. Hover to see the timeline.
      </p>
      
      <div className="relative w-72 h-72 bg-int-cream rounded-lg border border-int-navy/10 p-4">
         {/* Connector Lines */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
            <path d="M 57.6 57.6 L 144 57.6 L 230.4 57.6 L 230.4 144 L 144 144 L 57.6 144 L 57.6 230.4 L 144 230.4" fill="none" stroke="#1E3A5F" strokeWidth="2" strokeDasharray="4 4" />
         </svg>

         {stages.map((stage, i) => (
             <React.Fragment key={stage.id}>
                <motion.div
                    className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-help z-10 
                        ${stage.id === 7 
                            ? 'bg-int-gold border-int-gold text-white shadow-lg' 
                            : 'bg-white border-int-navy text-int-navy hover:border-int-teal hover:text-int-teal'
                        }
                        ${hoveredStage === stage.id ? 'scale-125 z-20' : ''}
                    `}
                    style={{ left: coords[i].x, top: coords[i].y }}
                    onMouseEnter={() => setHoveredStage(stage.id)}
                    onMouseLeave={() => setHoveredStage(null)}
                    data-testid={`pipeline-stage-${stage.id}`}
                >
                    {stage.icon}

                    <AnimatePresence>
                        {hoveredStage === stage.id && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-[10px] leading-tight p-3 rounded-md shadow-2xl pointer-events-none z-50"
                        >
                            <div className="text-int-gold font-bold mb-1 border-b border-white/10 pb-1 uppercase tracking-wider">{stage.label}</div>
                            <div className="text-gray-200 mt-1">{stage.desc}</div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                        </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                {/* Stage Label (small) */}
                <div 
                    className="absolute text-[9px] font-bold uppercase tracking-wider text-gray-500 text-center w-20 -ml-10 mt-8 pointer-events-none"
                    style={{ left: coords[i].x, top: coords[i].y }}
                >
                    {stage.label}
                </div>
             </React.Fragment>
         ))}
         
         <div className="absolute right-8 bottom-8 flex items-center gap-2 text-int-gold">
             <span className="text-xs font-bold uppercase tracking-widest">End Game</span>
             <ArrowRight size={16} />
         </div>
      </div>

      <div className="mt-6 flex justify-between w-full max-w-xs text-xs font-mono text-gray-500 uppercase tracking-widest">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-int-navy"></div> Build</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white border border-int-navy"></div> Operate</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-int-gold"></div> Retire</div>
      </div>
    </div>
  );
};

// --- SOC 2 SPRINT DIAGRAM ---
// Replaces AIServicePipelineDiagram
export const SOC2SprintDiagram: React.FC = () => {
  const [step, setStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
        setStep(s => (s + 1) % 4);
    }, 2000); // Faster sprint
    return () => clearInterval(interval);
  }, []);

  const stages = [
      { id: 0, label: "Discovery", icon: <Search size={24} />, description: "Week 1: Interview IT team, identify 15 key processes." },
      { id: 1, label: "Build", icon: <Database size={24} />, description: "Weeks 2-3: Build real-time access & incident logs." },
      { id: 2, label: "Review", icon: <ClipboardCheck size={24} />, description: "Week 4: Internal compliance validation & refinement." },
      { id: 3, label: "Audit Pass", icon: <CheckCircle size={24} />, description: "Weeks 5-6: Auditor review. System live. Passed." }
  ];

  return (
    <div className="flex flex-col items-center p-8 bg-int-navy rounded-xl border border-int-teal/20 my-8 shadow-2xl overflow-visible" data-testid="diagram-soc2">
      <h3 className="font-serif text-xl mb-4 text-white">The SOC 2 Sprint</h3>
      <p className="text-sm text-gray-300 mb-8 text-center max-w-md">
        How a healthcare IT firm went from chaos to compliant in 6 weeks.
      </p>

      <div className="relative w-full max-w-lg flex items-center justify-between mb-8 px-4">
        {stages.map((stage, i) => (
            <React.Fragment key={stage.id}>
                <motion.div 
                  className="flex flex-col items-center gap-3 relative z-10"
                  onMouseEnter={() => setHoveredStep(i)}
                  onMouseLeave={() => setHoveredStep(null)}
                  data-testid={`soc2-stage-${stage.label}`}
                >
                    <AnimatePresence>
                      {hoveredStep === i && (
                        <motion.div
                          data-testid={`tooltip-soc2-${stage.label}`}
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.9 }}
                          className="absolute bottom-full mb-4 w-48 bg-slate-900 border border-int-gold/30 text-white text-[10px] leading-snug p-3 rounded-lg shadow-2xl z-[100] pointer-events-none"
                        >
                           <p className="font-bold text-int-gold uppercase tracking-widest mb-1 border-b border-white/10 pb-1">{stage.label}</p>
                           <p className="text-gray-300 pt-1 leading-relaxed">{stage.description}</p>
                           <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div 
                        className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-help ${step === i ? 'border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.2)] ' + (i===3 ? 'bg-int-gold border-int-gold' : 'bg-int-teal') : 'border-gray-600 text-gray-500 bg-int-dark'} ${hoveredStep === i ? 'border-int-gold text-white scale-110' : ''}`}
                        animate={{ 
                          scale: hoveredStep === i ? 1.15 : (step === i ? 1.1 : 1),
                          y: step === i ? -4 : 0
                        }}
                    >
                        {stage.icon}
                    </motion.div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider transition-colors duration-300 ${step === i || hoveredStep === i ? 'text-white' : 'text-gray-600'}`}>
                        {stage.label}
                    </span>
                </motion.div>
                {i < stages.length - 1 && (
                    <div className="flex-1 h-[2px] bg-gray-700 mx-2 relative overflow-hidden">
                        <motion.div 
                            className="absolute inset-0 bg-white"
                            initial={{ x: '-100%' }}
                            animate={{ x: step > i ? '0%' : '-100%' }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                )}
            </React.Fragment>
        ))}
      </div>

      <div className="w-full bg-int-dark/50 p-4 rounded-lg border border-gray-700/50 min-h-[60px] flex items-center justify-center text-center">
          <AnimatePresence mode="wait">
            <motion.p 
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-gray-300 italic"
            >
                {step === 0 && "Week 1: Discovery & Requirements..."}
                {step === 1 && "Weeks 2-3: Rapid Compliance Build..."}
                {step === 2 && "Week 4: Verification & Handoff..."}
                {step === 3 && "Weeks 5-6: Audit Success. Mission Complete."}
            </motion.p>
          </AnimatePresence>
      </div>
    </div>
  );
};

// --- COST COMPARISON CHART ---
// Replaces ROIComparisonChart
export const CostComparisonChart: React.FC = () => {
    // Only cost metric needed for this story
    const [hoveredBar, setHoveredBar] = useState<'consultant' | 'invelo' | null>(null);
    
    // Data: $25K vs $150K
    const data = {
        consultant: { val: 150, label: "$150k" },
        invelo: { val: 25, label: "$25k" }
    };
    
    return (
        <div className="flex flex-col md:flex-row gap-8 items-center p-8 bg-white text-int-navy rounded-xl my-8 border border-gray-200 shadow-md" data-testid="diagram-cost">
            <div className="flex-1 min-w-[240px]">
                <h3 className="font-serif text-2xl mb-2 text-int-navy">The Cost of Compliance</h3>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Comparison for a standard SOC 2 Type II remediation project.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
                        <span>Big 4 Consultant (3 Months)</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-int-navy font-bold">
                        <div className="w-4 h-4 bg-int-teal rounded-sm"></div>
                        <span>InVelo Catalyst Build (6 Weeks)</span>
                    </div>
                </div>
            </div>
            
            <div className="relative w-64 h-72 bg-int-cream rounded-xl border border-gray-200 p-6 flex justify-around items-end">
                 {/* Grid */}
                 <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none opacity-10">
                   <div className="w-full h-[1px] bg-int-navy"></div>
                   <div className="w-full h-[1px] bg-int-navy"></div>
                   <div className="w-full h-[1px] bg-int-navy"></div>
                   <div className="w-full h-[1px] bg-int-navy"></div>
                </div>

                {/* Consultant Bar */}
                <div 
                    className="w-20 flex flex-col justify-end items-center h-full z-10"
                    onMouseEnter={() => setHoveredBar('consultant')}
                    onMouseLeave={() => setHoveredBar(null)}
                    data-testid="bar-consultant"
                >
                    <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                        <AnimatePresence>
                             {hoveredBar === 'consultant' && (
                                <motion.div 
                                    className="absolute bottom-full mb-3 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                >
                                    {data.consultant.label}
                                     <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                                </motion.div>
                             )}
                        </AnimatePresence>
                        <motion.div 
                            className="w-full bg-slate-400 rounded-t-sm"
                            initial={{ height: 0 }}
                            animate={{ height: '100%' }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        />
                    </div>
                    <div className="h-8 flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">Big 4 Firm</div>
                </div>

                {/* InVelo Bar */}
                <div 
                    className="w-20 flex flex-col justify-end items-center h-full z-10"
                    onMouseEnter={() => setHoveredBar('invelo')}
                    onMouseLeave={() => setHoveredBar(null)}
                    data-testid="bar-invelo"
                >
                     <div className="flex-1 w-full flex items-end justify-center relative mb-3">
                         <AnimatePresence>
                             {hoveredBar === 'invelo' && (
                                <motion.div 
                                    className="absolute bottom-full mb-3 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded shadow-xl whitespace-nowrap z-50 pointer-events-none"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                >
                                    {data.invelo.label}
                                     <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                                </motion.div>
                             )}
                        </AnimatePresence>
                        <motion.div 
                            className="w-full bg-gradient-to-t from-int-navy to-int-teal rounded-t-md shadow-lg"
                            initial={{ height: 0 }}
                            animate={{ height: '16.6%' }} // 25 is 1/6th of 150
                            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                        />
                    </div>
                     <div className="h-8 flex items-center text-[10px] font-bold text-int-navy uppercase tracking-wider text-center">InVelo</div>
                </div>
            </div>
        </div>
    )
}