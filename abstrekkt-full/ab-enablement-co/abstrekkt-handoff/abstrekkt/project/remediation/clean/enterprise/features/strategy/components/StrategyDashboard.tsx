import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { ArrowUpRight, BookOpen, Printer, TrendingUp, Users, Zap, ShieldCheck } from 'lucide-react';

export function StrategyDashboard() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Strategy & Roadmap</h1>
          <p className="text-slate-500 mt-2">Executive summary and tiered platform recommendations for Q1 2026.</p>
        </div>
        <Button variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Print / PDF
        </Button>
      </div>

      {/* Key Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          label="Market Adoption"
          value="82%"
          subtext="of F500 using GenAI in prod"
          trend="+14% YoY"
        />
        <StatsCard 
          icon={<Zap className="w-5 h-5 text-amber-600" />}
          label="Avg. Productivity"
          value="2.5h"
          subtext="saved per employee / week"
          trend="Validated"
        />
        <StatsCard 
          icon={<Users className="w-5 h-5 text-blue-600" />}
          label="High Performers"
          value="3.8x"
          subtext="faster at complex tasks"
          trend="McKinsey"
        />
        <StatsCard 
          icon={<ShieldCheck className="w-5 h-5 text-purple-600" />}
          label="Risk Assessment"
          value="Low"
          subtext="for Tier 1 deployment"
          trend="ISO 27001"
        />
      </div>

      <Separator />

      {/* Tiered Recommendations */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#E97132]" />
          Strategic Recommendations
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <RecommendationCard 
            tier="Tier 1"
            title="Enterprise Foundation"
            models={['Claude 3.5 Sonnet', 'GPT-4o']}
            color="bg-[#E97132]"
            description="Approved for wide-scale internal deployment. High security, consistent performance, and SLA backing."
            useCases={[
              "General knowledge assistant",
              "Coding copilot (IDE)",
              "Document summarization"
            ]}
          />

          {/* Tier 2 */}
          <RecommendationCard 
            tier="Tier 2"
            title="Specialized / Pilot"
            models={['Mistral Large 2', 'Gemini 1.5 Pro']}
            color="bg-blue-600"
            description="Approved for specific business units or pilot programs. May have unique strengths (context window, pricing)."
            useCases={[
              "Long-context analysis (2M+)",
              "Cost-sensitive batch processing",
              "Specific language support"
            ]}
          />

          {/* Tier 3 */}
          <RecommendationCard 
            tier="Tier 3"
            title="Experimental / R&D"
            models={['Llama 3 400B (Preview)', 'O1 Reasoning']}
            color="bg-slate-600"
            description="Restricted to R&D sandbox. Not approved for production or customer data yet."
            useCases={[
              "Complex reasoning research",
              "Self-hosted model tuning",
              "Future capability testing"
            ]}
          />
        </div>
      </div>

      {/* Sources Footer */}
      <div className="bg-slate-50 rounded-lg p-6 border">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Research Sources & Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
          <ul className="list-disc pl-4 space-y-2">
            <li>
              <span className="font-semibold">McKinsey (2025):</span> "The Economic Potential of Generative AI" - Updated Q4 estimates on productivity impact.
            </li>
            <li>
              <span className="font-semibold">Gartner Magic Quadrant:</span> Enterprise Conversational AI Platforms (2025).
            </li>
            <li>
              <span className="font-semibold">Internal Benchmark:</span> INT Inc. "Project Velocity" Audit (N=500 users).
            </li>
          </ul>
          <ul className="list-disc pl-4 space-y-2">
             <li>
              <span className="font-semibold">Security Compliance:</span> Review against ISO 27001 and SOC 2 Type II controls.
            </li>
            <li>
              <span className="font-semibold">Cost Analysis:</span> Based on current API pricing per 1M tokens (blended input/output).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ icon, label, value, subtext, trend }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-slate-50 rounded-lg border">{icon}</div>
          <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100">{trend}</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-400">{subtext}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ tier, title, models, color, description, useCases }: any) {
  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className={`${color} p-1`}></div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white mb-2 ${color}`}>
              {tier}
            </span>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          </div>
        </div>
        
        <p className="text-sm text-slate-600 mb-6">{description}</p>
        
        <div className="space-y-4 mb-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase">Recommended Models</h4>
          <div className="flex flex-wrap gap-2">
            {models.map((m: string) => (
              <Badge key={m} variant="secondary" className="bg-slate-100 text-slate-800 hover:bg-slate-200">
                {m}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <Separator className="mb-4" />
          <h4 className="text-xs font-bold text-slate-900 uppercase mb-3">Primary Use Cases</h4>
          <ul className="space-y-2">
            {useCases.map((uc: string, i: number) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                {uc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
