import React, { useState, useEffect } from 'react';
import { BookOpen, DollarSign, Target, CheckCircle, AlertTriangle, HelpCircle, Activity, Users, Zap, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { SectionHeader } from '../common/SectionHeader';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';

export function OperationsManual() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'roi' | 'metrics' | 'troubleshooting'>('tiers');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader 
        title="Service Operations Manual" 
        description="Operational frameworks, service tiers, ROI methodologies, and troubleshooting guides for Claude Enterprise delivery."
        icon={BookOpen}
      />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'tiers', label: 'Service Tiers', icon: Target },
          { id: 'roi', label: 'ROI Framework', icon: DollarSign },
          { id: 'metrics', label: 'Success Metrics', icon: CheckCircle },
          { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-700 bg-amber-50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'tiers' && <ServiceTiers />}
        {activeTab === 'roi' && <ROIFramework />}
        {activeTab === 'metrics' && <SuccessMetrics />}
        {activeTab === 'troubleshooting' && <TroubleshootingGuide />}
      </div>
    </div>
  );
}

function ServiceTiers() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Foundation Tier */}
        <Card className="border-t-4 border-t-slate-400 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Foundation Tier</h3>
            <div className="text-2xl font-bold text-slate-700 mt-2">$15k - $50k</div>
            <p className="text-sm text-slate-500 mt-1">Small teams (10-50 users)</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="bg-slate-50 p-3 rounded text-sm">
              <span className="font-bold block mb-2">Includes:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>1-week discovery</li>
                <li>Basic roadmap (1 use case)</li>
                <li>Out-of-box setup</li>
                <li>2-day training workshop</li>
                <li>30-day support</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-sm block mb-2">Target Outcomes:</span>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 1-2 use cases live</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 70% adoption rate</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 20% productivity gain</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Strategy Tier */}
        <Card className="border-t-4 border-t-amber-500 flex flex-col h-full ring-1 ring-amber-100 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Strategy Tier</h3>
            <div className="text-2xl font-bold text-amber-600 mt-2">$50k - $150k</div>
            <p className="text-sm text-slate-500 mt-1">Mid-size teams (50-200 users)</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="bg-amber-50 p-3 rounded text-sm">
              <span className="font-bold block mb-2">Includes:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>2-week discovery</li>
                <li>Comprehensive roadmap</li>
                <li>Advanced setup (MCPs)</li>
                <li>Role-based training (3 days)</li>
                <li>90-day support + optimization</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-sm block mb-2">Target Outcomes:</span>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 3-5 use cases live</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 80% adoption rate</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 6-month ROI payback</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Advanced Tier */}
        <Card className="border-t-4 border-t-indigo-600 flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900">Advanced Tier</h3>
            <div className="text-2xl font-bold text-indigo-600 mt-2">$150k - $250k+</div>
            <p className="text-sm text-slate-500 mt-1">Large Enterprise (200+ users)</p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="bg-indigo-50 p-3 rounded text-sm">
              <span className="font-bold block mb-2">Includes:</span>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>4-week discovery (multi-dept)</li>
                <li>Enterprise roadmap (12-18 mo)</li>
                <li>Custom Dev (Forked Explorer)</li>
                <li>Executive training (5 days)</li>
                <li>6-month support + CSM</li>
              </ul>
            </div>
            <div>
              <span className="font-bold text-sm block mb-2">Target Outcomes:</span>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 10+ use cases live</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> Strategic advantage</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-emerald-500" /> 3-4x ROI (12-mo payback)</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h4 className="font-bold text-slate-900 mb-4">Training Delivery Model</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Delivery Methods</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Interactive Workshops</li>
              <li>• Hands-on Labs</li>
              <li>• Weekly Office Hours</li>
              <li>• Asynchronous Video Guides</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Measurement</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• NPS (Net Promoter Score)</li>
              <li>• Activation Rates</li>
              <li>• Feature Usage Metrics</li>
              <li>• Certification Pass Rates</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800 mb-2">Key Deliverables</h5>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Production Environment</li>
              <li>• Trained User Base</li>
              <li>• Operations Manual (Customized)</li>
              <li>• Success Metrics Dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ROIFramework() {
  // Live ROI Calculation State
  const [activeUsers, setActiveUsers] = useState(125); // Default simulated
  const [hourlyRate, setHourlyRate] = useState(75);
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(5);
  const [adoptionRate, setAdoptionRate] = useState(82);
  const [investment, setInvestment] = useState(100000);

  // Derived Calculations
  const weeklySavings = activeUsers * (adoptionRate / 100) * hoursSavedPerWeek * hourlyRate;
  const annualSavings = weeklySavings * 52;
  const roi = ((annualSavings - investment) / investment) * 100;
  const paybackMonths = (investment / (weeklySavings * 4.33));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              Live Inputs
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Users</label>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    value={activeUsers}
                    onChange={(e) => setActiveUsers(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Adoption Rate (%)</label>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <div className="flex-1 flex items-center gap-2">
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={adoptionRate}
                      onChange={(e) => setAdoptionRate(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-12 text-right">{adoptionRate}%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Avg Hourly Rate ($)</label>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hours Saved / User / Week</label>
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    value={hoursSavedPerWeek}
                    onChange={(e) => setHoursSavedPerWeek(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>

               <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Investment ($)</label>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="bg-slate-100 p-4 rounded-lg text-xs text-slate-500">
            <p className="mb-2 font-bold">Formula:</p>
            <code>ROI = (Annual Savings - Investment) / Investment</code>
            <p className="mt-2">
              Based on Larridin framework & LSE research on AI productivity.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-emerald-900 text-white border-none shadow-xl">
               <div className="p-2">
                 <p className="text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">Annual Savings</p>
                 <div className="text-3xl font-bold font-mono">
                   ${annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                 </div>
                 <div className="mt-2 flex items-center gap-2 text-xs text-emerald-200">
                   <TrendingUp className="w-3 h-3" />
                   <span>Based on current adoption</span>
                 </div>
               </div>
             </Card>

             <Card className="bg-slate-900 text-white border-none shadow-xl">
               <div className="p-2">
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">ROI (Year 1)</p>
                 <div className="text-3xl font-bold font-mono text-amber-400">
                   {roi.toLocaleString(undefined, { maximumFractionDigits: 0 })}%
                 </div>
                 <div className="mt-2 text-xs text-slate-400">
                   Payback in <span className="text-white font-bold">{paybackMonths.toFixed(1)} months</span>
                 </div>
               </div>
             </Card>
          </div>

          <Card>
            <h3 className="font-bold text-slate-900 mb-4">Projected Value Over Time</h3>
            <div className="h-48 flex items-end justify-between gap-2 border-b border-slate-200 pb-2 px-2">
               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
                 const monthlyValue = (weeklySavings * 4.33);
                 const cumulativeValue = monthlyValue * month;
                 const isPositive = cumulativeValue > investment;
                 const heightPercent = Math.min((cumulativeValue / (annualSavings)) * 100, 100);
                 
                 return (
                   <div key={month} className="flex-1 flex flex-col justify-end items-center group relative">
                     {/* Tooltip */}
                     <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs p-2 rounded z-10 whitespace-nowrap">
                       Month {month}: ${(cumulativeValue - investment).toLocaleString()} net
                     </div>
                     
                     <div 
                        className={`w-full rounded-t transition-all ${isPositive ? 'bg-emerald-500' : 'bg-rose-400'}`}
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                     />
                     <span className="text-[10px] text-slate-500 mt-2">M{month}</span>
                   </div>
                 );
               })}
            </div>
            <div className="flex justify-center gap-8 mt-4 text-xs">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-rose-400 rounded-sm" />
                 <span className="text-slate-600">Investment Recovery</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                 <span className="text-slate-600">Net Profit</span>
               </div>
            </div>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4">
            <div className="p-2 bg-amber-100 rounded-full h-fit text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Strategic Insight</h4>
              <p className="text-sm text-amber-800 mt-1">
                With {activeUsers} users and {adoptionRate}% adoption, you are on track to generate 
                <span className="font-bold"> ${(annualSavings / 1000000).toFixed(2)}M</span> in productivity value this year. 
                Increasing adoption by just 10% would add another <span className="font-bold">${((activeUsers * 0.10 * hoursSavedPerWeek * hourlyRate * 52) / 1000).toFixed(0)}k</span> in annual value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuccessMetrics() {
  const metrics = [
    {
      category: "Activation",
      items: [
        { label: "Users Logged In (30d)", target: "90%+" },
        { label: "Onboarding Complete", target: "80%+" },
        { label: "Time to First Value", target: "< 7 days" }
      ]
    },
    {
      category: "Adoption",
      items: [
        { label: "Weekly Active Users", target: "70%+" },
        { label: "Daily Active Users", target: "40%+" },
        { label: "Feature Usage", target: "3+ per week" }
      ]
    },
    {
      category: "Business Value",
      items: [
        { label: "Time Saved / User", target: "5+ hrs/week" },
        { label: "Error Reduction", target: "30%+" },
        { label: "Cost ROI (12mo)", target: "5x" }
      ]
    },
    {
      category: "Satisfaction",
      items: [
        { label: "Net Promoter Score", target: "50+" },
        { label: "User Satisfaction", target: "4.5/5 stars" },
        { label: "Support Volume", target: "< 5% users/mo" }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((section) => (
        <Card key={section.category} className="hover:shadow-md transition-shadow">
          <h4 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">{section.category} Metrics</h4>
          <div className="space-y-4">
            {section.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm text-slate-600">{item.label}</span>
                <Badge variant="success" className="font-mono">{item.target}</Badge>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function TroubleshootingGuide() {
  const issues = [
    {
      category: "Web Platform",
      items: [
        { issue: "Artifacts not rendering", cause: "Browser compatibility", fix: "Use Chrome/Edge/Firefox latest" },
        { issue: "File upload fails", cause: "Size >10MB or format", fix: "Compress file or convert format" },
        { issue: "Conversation load fail", cause: "Network/Timeout", fix: "Clear cache, check connection" }
      ]
    },
    {
      category: "Desktop & MCP",
      items: [
        { issue: "MCP server connect fail", cause: "Invalid JSON/Config", fix: "Validate JSON, check credentials" },
        { issue: "Computer use timeout", cause: "Permissions/Path", fix: "Check chmod +x, use absolute paths" },
        { issue: "Slow responses", cause: "Context >100K tokens", fix: "Start new chat, summarize context" }
      ]
    },
    {
      category: "Mobile",
      items: [
        { issue: "Camera upload fail", cause: "Permissions denied", fix: "Enable Camera in OS Settings" },
        { issue: "No push notifications", cause: "Background refresh off", fix: "Enable Background App Refresh" }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
        <HelpCircle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Quick Support Channels</h4>
          <ul className="text-sm text-amber-800 mt-1 space-y-1">
            <li>• Status Page: <a href="https://status.anthropic.com" target="_blank" rel="noreferrer" className="underline hover:text-amber-900">status.anthropic.com</a></li>
            <li>• Internal Slack: #claude-support</li>
            <li>• Urgent Issues: Contact Incident Response Team via PagerDuty</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {issues.map((section) => (
          <Card key={section.category}>
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-slate-400" />
              {section.category}
            </h4>
            <div className="space-y-4">
              {section.items.map((item, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="font-semibold text-slate-800 text-sm mb-1">{item.issue}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className="text-slate-500"><span className="font-bold">Cause:</span> {item.cause}</div>
                    <div className="text-emerald-600"><span className="font-bold">Fix:</span> {item.fix}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
