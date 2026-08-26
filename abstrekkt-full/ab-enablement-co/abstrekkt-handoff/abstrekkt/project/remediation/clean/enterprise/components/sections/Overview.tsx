import React from 'react';
import { Shield, Zap, Users, Lock, CheckCircle, AlertTriangle, LayoutDashboard, ArrowRight } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigation } from '../../contexts/NavigationContext';

export function Overview() {
  const { setActiveSection } = useNavigation();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Welcome to INT Inc Enterprise Claude" 
        description="Your comprehensive guide to safely and effectively using Claude AI across your role. Master baseline security, advanced workflows, and compliance standards."
        icon={LayoutDashboard}
      />

      {/* Hero / Quick Start */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 rounded-2xl p-8 shadow-sm">
             <h2 className="text-2xl font-bold text-indigo-900 mb-4">Start Here: Quick Guide</h2>
             <div className="space-y-4">
                {[
                  { step: 1, text: "Identify your role (Finance, Sales, Eng, etc.)", action: () => setActiveSection('roles') },
                  { step: 2, text: "Review Baseline Security Guidelines", action: () => setActiveSection('baseline') },
                  { step: 3, text: "Explore Feature Guides (Search, Memory, etc.)", action: () => setActiveSection('features') },
                  { step: 4, text: "Master Best Practices & Prompting", action: () => setActiveSection('best-practices') },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4 bg-white/60 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer group" onClick={item.action}>
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                    <span className="text-slate-700 font-medium flex-1">{item.text}</span>
                    <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <FeatureCard 
               icon={Shield} 
               title="Security First" 
               color="text-emerald-600" 
               bg="bg-emerald-50"
               items={[
                 "Zero Data Retention (ZDR)",
                 "Role-based Access Control",
                 "Audit Logging",
                 "Injection Defense"
               ]}
             />
             <FeatureCard 
               icon={Zap} 
               title="Powerful Features" 
               color="text-amber-600" 
               bg="bg-amber-50"
               items={[
                 "Real-time Web Search",
                 "30-day Role Memory",
                 "Code Execution Sandbox",
                 "Artifacts & Documents"
               ]}
             />
          </div>
        </div>

        <div className="space-y-6">
           <Card className="bg-white shadow-md border-slate-200 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-50 rounded-lg">
                  <Lock className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Critical Guardrails</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Never output customer PII or credentials",
                  "Escalate decisions >$10K to humans",
                  "All code requires peer review",
                  "Flag uncertainty, never hallucinate"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                 <h4 className="font-semibold text-slate-900 mb-2">Success Criteria</h4>
                 <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                       <CheckCircle className="w-4 h-4 text-emerald-500" />
                       <span>30% faster daily tasks</span>
                    </li>
                    <li className="flex items-center gap-2">
                       <CheckCircle className="w-4 h-4 text-emerald-500" />
                       <span>Zero security incidents</span>
                    </li>
                 </ul>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, items, color, bg }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <h3 className="font-bold text-slate-900">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item: string, i: number) => (
          <li key={i} className="flex items-center gap-2 text-slate-600 text-sm">
            <div className={`w-1.5 h-1.5 rounded-full ${color.replace('text-', 'bg-')}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
