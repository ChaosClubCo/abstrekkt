import { useState, useCallback, useMemo, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// SEED DATA GENERATION
// ═══════════════════════════════════════════════════════════════
const TS = () => {
  const d = new Date(2026, 1, 13, 8 + Math.floor(Math.random()*10), Math.floor(Math.random()*60));
  d.setDate(d.getDate() - Math.floor(Math.random()*30));
  return d.toISOString();
};
const ENVS = ["dev","stage","prod"];
const MODELS = ["claude-sonnet-4-5","claude-opus-4-6","gpt-4o","claude-haiku-4-5","gemini-2.5-flash"];
const AGENT_ROLES = ["Code Review","Security Scan","Deploy Gate","Cost Monitor","Incident Triage","Data Pipeline","Prompt QA","Compliance Check","Onboarding Bot","Metrics Collector"];
const STATUSES_AGENT = ["active","idle","failing","disabled"];
const DEPLOY_STATUSES = ["success","failed","rolling","pending","rolled_back"];
const INCIDENT_SEV = ["SEV0","SEV1","SEV2","SEV3"];
const INCIDENT_STATUS = ["open","investigating","mitigated","resolved"];
const SECRET_STATUS = ["ok","overdue","expiring_soon"];
const PROMPT_STATUS = ["draft","active","deprecated"];
const EXP_STATUS = ["running","completed","killed"];
const EXP_DECISION = ["ship","iterate","kill","pending"];
const CONNECTOR_NAMES = ["Supabase","GitHub","Notion","Slack","Stripe","Vercel"];
const NOTIF_TYPES = ["incident","agent_failure","budget_overage","overdue_secret","deploy_failure","policy_violation"];

const pick = a => a[Math.floor(Math.random()*a.length)];
const rid = () => Math.random().toString(36).slice(2,9);
const rNum = (a,b) => Math.floor(Math.random()*(b-a+1))+a;

const genAgents = () => Array.from({length:10},(_,i)=>({
  id:`agent-${rid()}`,name:AGENT_ROLES[i],model:pick(MODELS),env:pick(ENVS),
  status:pick(STATUSES_AGENT),runs_today:rNum(0,50),tokens_today:rNum(1000,90000),
  avg_latency_ms:rNum(200,4500),last_run:TS(),error_rate:Math.random()*0.3,
  created:TS(),description:`Handles ${AGENT_ROLES[i].toLowerCase()} tasks across the platform.`
}));

const genRuns = (agents) => Array.from({length:40},()=>{
  const a = pick(agents);
  return {id:`run-${rid()}`,agent_id:a.id,agent_name:a.name,status:pick(["success","failure","timeout"]),
    tokens:rNum(500,20000),latency_ms:rNum(100,5000),env:a.env,timestamp:TS(),
    input_preview:"Process request for "+pick(["user onboarding","code scan","deploy check","metric calc"]),
    output_preview:pick(["Completed successfully","Found 3 issues","Timeout after 5s","Approved"])};
});

const genDeployments = () => Array.from({length:15},(_,i)=>({
  id:`dep-${rid()}`,service:pick(["api-gateway","auth-service","agent-orchestrator","web-app","worker-queue","ml-pipeline"]),
  version:`v${rNum(1,5)}.${rNum(0,20)}.${rNum(0,99)}`,env:ENVS[i%3],status:pick(DEPLOY_STATUSES),
  deployed_by:pick(["kyle","ci-bot","deploy-agent"]),timestamp:TS(),
  commit:rid()+rid(),rollback_available:Math.random()>0.3,notes:pick(["Hotfix","Feature release","Config update","Dependency bump"])
}));

const genUsage = () => Array.from({length:45},(_,i)=>{
  const d = new Date(2026,1,13); d.setDate(d.getDate()-i);
  return {date:d.toISOString().slice(0,10),tokens:rNum(50000,500000),cost:+(Math.random()*80+5).toFixed(2),
    requests:rNum(200,5000),errors:rNum(0,50),model_breakdown:{
      [MODELS[0]]:rNum(10000,100000),[MODELS[1]]:rNum(5000,80000),[MODELS[3]]:rNum(20000,200000)}};
});

const genBacklog = () => {
  const features = ["Agent Auto-Scaling","Prompt Version Diff UI","Cost Anomaly Alerts","Multi-Tenant RLS","Incident Postmortem Templates","Webhook Retry Logic","Dashboard Export PDF","Role-Based Access","API Rate Limiting","Audit Log Search","Secret Auto-Rotation","Canary Deploy Support","Agent Health Checks","SOP Auto-Suggest","Experiment Bayesian Engine","Slack Alert Integration","Budget Forecasting","Compliance Report Gen","Runbook Execution Engine","Data Connector OAuth","Agent Chaining","Prompt A/B Testing","Cost Attribution Tags","Incident Escalation Rules","Deployment Approval Flow"];
  return features.map((f,i)=>{
    const bv=rNum(1,13),tc=rNum(1,8),rr=rNum(1,8),js=rNum(1,13);
    return {id:`bl-${rid()}`,feature:f,bv,tc,rr_oe:rr,job_size:js,wsjf:+((bv+tc+rr)/js).toFixed(2),
      description:`Implement ${f.toLowerCase()} to improve platform reliability and developer experience.`,
      acceptance_criteria:["Passes all unit tests","Documentation updated","Security review complete","Deployed to staging"],
      risks:pick(["Complexity risk","Integration risk","Performance risk","Security risk"]),
      dependencies:pick(["Auth service","Agent framework","Database migration","None"]),status:pick(["proposed","approved","in_progress","done"])};
  });
};

const genAuditLog = () => Array.from({length:40},()=>({
  id:`audit-${rid()}`,action:pick(["agent.created","agent.disabled","deploy.initiated","deploy.rolled_back","incident.created","incident.resolved","secret.rotated","prompt.promoted","experiment.started","budget.updated","policy.exception","connector.tested","runbook.created","notification.acked"]),
  actor:pick(["kyle","system","ci-bot","deploy-agent"]),target:pick(["agent-001","dep-prod-api","incident-42","secret-db-key","prompt-summarizer"]),
  env:pick(ENVS),timestamp:TS(),details:pick(["Routine operation","Emergency change","Scheduled maintenance","User requested"]),
  metadata:{ip:"10.0."+rNum(0,255)+"."+rNum(1,254)}
}));

const genIncidents = () => Array.from({length:12},(_,i)=>({
  id:`inc-${rid()}`,title:pick(["API Latency Spike","Auth Service 503","Agent Timeout Cascade","Database Connection Pool","Memory Leak in Worker","SSL Cert Expiry","Rate Limit Breach","Webhook Delivery Failure","Search Index Corruption","Cache Invalidation Storm","DNS Resolution Failure","Payment Gateway Timeout"]),
  severity:INCIDENT_SEV[i%4],system:pick(["api-gateway","auth-service","agent-orchestrator","database","cdn"]),
  env:pick(ENVS),status:pick(INCIDENT_STATUS),created:TS(),updated:TS(),
  timeline:[{ts:TS(),note:"Incident detected by monitoring"},{ts:TS(),note:"Team alerted and investigating"}],
  action_items:["Implement retry logic","Add circuit breaker","Update runbook"],
  postmortem:i<4?{impact:"~500 users affected for 15min",root_cause:"Connection pool exhaustion under load",fixes_shipped:["Pool size increased","Added connection timeout"],follow_ups:["Load test quarterly","Add pool metrics dashboard"]}:null
}));

const genSecrets = () => Array.from({length:20},()=>{
  const lr = new Date(2026,1,13); lr.setDate(lr.getDate()-rNum(5,180));
  const nd = new Date(lr); nd.setDate(nd.getDate()+90);
  const overdue = nd < new Date(2026,1,13);
  return {id:`sec-${rid()}`,name:pick(["DB_PASSWORD","API_KEY_STRIPE","JWT_SECRET","REDIS_AUTH","S3_ACCESS_KEY","GITHUB_TOKEN","SLACK_WEBHOOK","SUPABASE_KEY","VERCEL_TOKEN","SENTRY_DSN","CLOUDFLARE_TOKEN","RESEND_API_KEY","POSTHOG_KEY","NOTION_TOKEN","N8N_WEBHOOK_SECRET","OPENAI_KEY","ANTHROPIC_KEY","DATADOG_KEY","PG_SSL_CERT","ENCRYPTION_KEY"]),
    system:pick(["api-gateway","auth-service","agent-orchestrator","web-app","worker-queue","ml-pipeline"]),
    last_rotated:lr.toISOString().slice(0,10),next_due:nd.toISOString().slice(0,10),
    owner:pick(["kyle","platform-team","security-team","devops"]),
    status:overdue?"overdue":nd<new Date(new Date(2026,1,13).getTime()+7*86400000)?"expiring_soon":"ok"};
});

const genPrompts = () => {
  const names = ["Summarizer","Code Reviewer","Incident Triager","Deploy Gatekeeper","Cost Analyst","Security Scanner","Onboarding Guide","Data Classifier","Metric Reporter","Compliance Checker","Bug Reproducer","Test Generator","Doc Writer","API Designer","Schema Validator","Prompt Optimizer","Risk Assessor","Change Analyzer","Escalation Router","Feedback Synthesizer"];
  return names.map((n,i)=>({
    id:`prompt-${rid()}`,name:n,purpose:`${n} prompt for automated ${n.toLowerCase()} tasks`,
    model_target:pick(MODELS),version:rNum(1,5),status:pick(PROMPT_STATUS),last_updated:TS(),
    versions:i<8?[
      {v:1,content:`You are a ${n.toLowerCase()}. Analyze the input and provide structured output.`,date:TS()},
      {v:2,content:`You are an expert ${n.toLowerCase()}. Analyze the input carefully, consider edge cases, and provide structured output with confidence scores.`,date:TS()}
    ]:[{v:1,content:`You are a ${n.toLowerCase()}. Process the input and respond.`,date:TS()}]
  }));
};

const genExperiments = () => Array.from({length:15},()=>({
  id:`exp-${rid()}`,hypothesis:pick(["Reducing prompt tokens by 30% maintains quality","Batching agent calls improves throughput 2x","Caching embeddings reduces cost 40%","Claude Haiku handles 80% of tier-1 queries","Parallel agent execution cuts latency 50%","Pre-computed summaries reduce token usage","Dynamic model routing saves 25% cost","Streaming responses improve UX satisfaction","Context window pruning maintains accuracy","Few-shot examples improve classification 15%","Temperature 0.3 produces more consistent output","System prompts under 500 tokens perform equally","RAG retrieval top-3 matches top-5 quality","Async processing improves throughput 3x","Prompt chaining outperforms single-shot"]),
  metric:pick(["latency_p95","cost_per_request","accuracy","throughput","user_satisfaction","error_rate"]),
  start:TS(),end:TS(),status:pick(EXP_STATUS),uplift:+(Math.random()*40-10).toFixed(1),
  confidence:pick(["high","medium","low"]),decision:pick(EXP_DECISION),
  results:pick(["Significant improvement observed","No significant difference","Marginal improvement","Regression detected"])
}));

const genSOPs = () => {
  const titles = ["Agent Failure Recovery","Database Failover","SSL Certificate Renewal","Secret Rotation Procedure","Incident Escalation Protocol","Deployment Rollback","Cache Purge Procedure","Rate Limit Adjustment","Log Level Change","Feature Flag Toggle","DNS Record Update","Load Balancer Config","Container Restart","Memory Leak Investigation","API Key Rotation","Webhook Retry Config","Search Index Rebuild","Queue Drain Procedure","Backup Verification","Disaster Recovery Activation","Access Revocation","Compliance Audit Prep","Performance Load Test","Security Patch Deployment","Data Migration Runbook"];
  return titles.map(t=>({
    id:`sop-${rid()}`,title:t,system:pick(["api-gateway","auth-service","agent-orchestrator","database","cdn","all"]),
    tags:pick([["incident","recovery"],["maintenance","scheduled"],["security","compliance"],["deployment","rollback"],["monitoring","alerting"]]),
    severity_applicability:pick(["SEV0-SEV1","SEV2-SEV3","All","SEV0 only"]),
    estimated_time:pick(["5 min","15 min","30 min","1 hour","2 hours"]),
    prerequisites:pick(["VPN access","Admin credentials","Runbook familiarity","None"]),
    owner:pick(["kyle","platform-team","security-team","devops"]),
    steps:["Verify the issue scope and affected systems","Check monitoring dashboards for anomalies","Execute the primary remediation action","Verify recovery and confirm system health","Update incident log and notify stakeholders"],
    confidence:rNum(70,99)
  }));
};

const genNotifications = () => Array.from({length:30},()=>({
  id:`notif-${rid()}`,type:pick(NOTIF_TYPES),severity:pick(["critical","warning","info"]),
  title:pick(["Agent 'Code Review' failing","Budget threshold 80% reached","Secret DB_PASSWORD overdue","Deploy to prod failed","Incident SEV1 opened","Policy check failed"]),
  env:pick(ENVS),timestamp:TS(),acknowledged:Math.random()>0.6,snoozed:false,
  assigned_to:Math.random()>0.7?pick(["kyle","platform-team"]):null
}));

const genBudgets = () => [
  {id:"budget-daily",period:"daily",threshold:100,current:+(Math.random()*120).toFixed(2),currency:"USD"},
  {id:"budget-weekly",period:"weekly",threshold:500,current:+(Math.random()*600).toFixed(2),currency:"USD"},
  {id:"budget-monthly",period:"monthly",threshold:2000,current:+(Math.random()*2200).toFixed(2),currency:"USD"}
];

const genPolicies = () => [
  {id:"pol-1",name:"Secrets Rotation Compliance",category:"security",status:Math.random()>0.3?"pass":"fail",last_check:TS(),remediation:"Rotate overdue secrets immediately"},
  {id:"pol-2",name:"Audit Logging Enabled",category:"compliance",status:"pass",last_check:TS(),remediation:"N/A"},
  {id:"pol-3",name:"Confirm Flows for Writes",category:"safety",status:"pass",last_check:TS(),remediation:"N/A"},
  {id:"pol-4",name:"RLS Posture Check",category:"security",status:pick(["pass","fail"]),last_check:TS(),remediation:"Enable RLS on all tenant tables"},
  {id:"pol-5",name:"Agent Error Rate < 5%",category:"reliability",status:pick(["pass","fail"]),last_check:TS(),remediation:"Investigate failing agents"},
  {id:"pol-6",name:"Deploy Approval Required",category:"compliance",status:"pass",last_check:TS(),remediation:"N/A"},
  {id:"pol-7",name:"Budget Alerts Configured",category:"cost",status:"pass",last_check:TS(),remediation:"N/A"},
  {id:"pol-8",name:"Incident Postmortems Complete",category:"reliability",status:pick(["pass","fail"]),last_check:TS(),remediation:"Complete outstanding postmortems"},
  {id:"pol-9",name:"Prompt Version Control",category:"safety",status:"pass",last_check:TS(),remediation:"N/A"},
  {id:"pol-10",name:"Data Encryption at Rest",category:"security",status:"pass",last_check:TS(),remediation:"N/A"},
  {id:"pol-11",name:"Access Review Quarterly",category:"compliance",status:pick(["pass","fail"]),last_check:TS(),remediation:"Schedule access review"},
  {id:"pol-12",name:"Backup Verification Monthly",category:"reliability",status:pick(["pass","fail"]),last_check:TS(),remediation:"Run backup restore test"}
];

const genConnectors = () => CONNECTOR_NAMES.map(n=>({
  id:`conn-${rid()}`,name:n,status:Math.random()>0.2?"connected":"disconnected",
  last_sync:TS(),scopes:pick(["read","read/write","admin"]),
  health:pick(["healthy","degraded","down"])
}));

const genRunbooks = () => Array.from({length:12},(_,i)=>({
  id:`rb-${rid()}`,title:pick(["API Gateway Recovery","Database Failover","Agent Restart Procedure","Cache Rebuild","SSL Renewal","DNS Cutover","Load Shedding","Canary Rollback","Queue Recovery","Index Rebuild","Auth Service Reset","Payment Retry"]),
  trigger_conditions:pick(["Error rate > 5% for 5 min","P95 latency > 3s","Health check failures > 3","Memory usage > 90%"]),
  immediate_checks:["Verify monitoring alerts","Check service health endpoints","Review recent deployments"],
  mitigation_steps:["Scale up affected service","Enable circuit breaker","Route traffic to healthy instances"],
  rollback_steps:["Revert to last known good config","Restore from backup","DNS failover to secondary"],
  verification_steps:["Confirm error rate normalized","Verify all health checks pass","Test critical user flows"],
  owner:pick(["kyle","platform-team","devops"]),
  escalation_path:"On-call → Team Lead → Engineering Manager → VP Engineering",
  linked_systems:[pick(["api-gateway","auth-service","database"])],
  linked_sop_tags:pick([["incident","recovery"],["maintenance"],["security"]]),
  created:TS(),updated:TS()
}));

// ═══════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════
const initAgents = genAgents();
const INIT = {
  agents:initAgents, agent_runs:genRuns(initAgents), deployments:genDeployments(),
  usage_daily:genUsage(), backlog:genBacklog().sort((a,b)=>b.wsjf-a.wsjf),
  audit_log:genAuditLog().sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp)),
  incidents:genIncidents(), secrets:genSecrets(), prompts:genPrompts(),
  experiments:genExperiments(), sops:genSOPs(), notifications:genNotifications(),
  budgets:genBudgets(), policies:genPolicies(), connectors:genConnectors(), runbooks:genRunbooks()
};

// ═══════════════════════════════════════════════════════════════
// ICONS (inline SVG components)
// ═══════════════════════════════════════════════════════════════
const Icon = ({d,size=16,color="currentColor"}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>;
const Icons = {
  dashboard:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  agents:"M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z",
  deploy:"M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  usage:"M18 20V10 M12 20V4 M6 20v-6",
  backlog:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z",
  audit:"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  incident:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  secrets:"M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5z",
  prompt:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  experiment:"M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 1 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
  sop:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z",
  notifications:"M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  cost:"M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  policy:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  connectors:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  runbook:"M4 4h16v16H4z M9 4v16 M14 4v16 M4 9h16 M4 14h16",
  search:"M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  close:"M18 6L6 18 M6 6l12 12",
  check:"M20 6L9 17l-5-5",
  chevron:"M9 18l6-6-6-6",
  menu:"M3 12h18 M3 6h18 M3 18h18",
  plus:"M12 5v14 M5 12h14",
  info:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 16v-4 M12 8h.01",
  settings:"M12 2a3 3 0 0 0 0 6 3 3 0 0 0 0-6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9",
  refresh:"M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  trash:"M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  help:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01",
  filter:"M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
};

const I = ({name,size=16,color="currentColor"}) => Icons[name] ? <Icon d={Icons[name]} size={size} color={color}/> : null;

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
const STATUS_COLORS = {
  active:"#22c55e",idle:"#94a3b8",failing:"#ef4444",disabled:"#64748b",
  success:"#22c55e",failed:"#ef4444",rolling:"#f59e0b",pending:"#94a3b8",rolled_back:"#8b5cf6",
  open:"#ef4444",investigating:"#f59e0b",mitigated:"#3b82f6",resolved:"#22c55e",
  ok:"#22c55e",overdue:"#ef4444",expiring_soon:"#f59e0b",
  draft:"#94a3b8",deprecated:"#64748b",
  running:"#3b82f6",completed:"#22c55e",killed:"#ef4444",
  ship:"#22c55e",iterate:"#f59e0b",kill:"#ef4444",
  connected:"#22c55e",disconnected:"#ef4444",healthy:"#22c55e",degraded:"#f59e0b",down:"#ef4444",
  pass:"#22c55e",fail:"#ef4444",critical:"#ef4444",warning:"#f59e0b",info:"#3b82f6",
  SEV0:"#ef4444",SEV1:"#f59e0b",SEV2:"#3b82f6",SEV3:"#94a3b8",
  proposed:"#94a3b8",approved:"#3b82f6",in_progress:"#f59e0b",done:"#22c55e",
  timeout:"#f59e0b",failure:"#ef4444"
};

const Badge = ({status,label}) => {
  const c = STATUS_COLORS[status] || "#94a3b8";
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 10px",borderRadius:12,fontSize:11,fontWeight:600,background:`${c}22`,color:c,border:`1px solid ${c}44`,whiteSpace:"nowrap"}} role="status" aria-label={label||status}><span style={{width:6,height:6,borderRadius:"50%",background:c}}/>{label||status}</span>;
};

const KPICard = ({title,value,subtitle,color="#8b5cf6",icon}) => (
  <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"16px 20px",minWidth:140,flex:"1 1 200px",backdropFilter:"blur(10px)"}} role="region" aria-label={title}>
    <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:4,display:"flex",alignItems:"center",gap:6}}>{icon&&<I name={icon} size={13} color="#64748b"/>}{title}</div>
    <div style={{fontSize:28,fontWeight:700,color,lineHeight:1.2}}>{value}</div>
    {subtitle&&<div style={{fontSize:11,color:"#64748b",marginTop:2}}>{subtitle}</div>}
  </div>
);

const EmptyState = ({message="No data available",icon="info"}) => (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:48,color:"#64748b",gap:12}} role="status">
    <I name={icon} size={40} color="#475569"/><div style={{fontSize:14}}>{message}</div>
  </div>
);

const Toast = ({msg,type="info",onClose}) => {
  const bg = type==="success"?"#22c55e33":type==="error"?"#ef444433":"#3b82f633";
  const bc = type==="success"?"#22c55e":type==="error"?"#ef4444":"#3b82f6";
  return <div style={{position:"fixed",bottom:24,right:24,background:"#1e293b",border:`1px solid ${bc}`,borderLeft:`4px solid ${bc}`,padding:"12px 20px",borderRadius:8,color:"#e2e8f0",fontSize:13,zIndex:10000,maxWidth:400,boxShadow:`0 8px 32px ${bg}`,display:"flex",alignItems:"center",gap:12,animation:"slideIn 0.3s ease"}} role="alert">
    <span style={{flex:1}}>{msg}</span>
    <button onClick={onClose} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:4}} aria-label="Dismiss"><I name="close" size={14}/></button>
  </div>;
};

const ConfirmDialog = ({open,title,preview,onConfirm,onCancel,danger}) => {
  if(!open) return null;
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:9000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}} role="dialog" aria-modal="true" aria-label={title} onClick={onCancel}>
    <div style={{background:"#1e293b",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,padding:28,maxWidth:520,width:"90%",boxShadow:"0 24px 64px rgba(0,0,0,0.5)"}} onClick={e=>e.stopPropagation()}>
      <h3 style={{margin:"0 0 8px",color:"#f1f5f9",fontSize:18}}>{title}</h3>
      <div style={{fontSize:11,color:"#f59e0b",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>⚡ Dry-Run Preview</div>
      <div style={{background:"rgba(0,0,0,0.3)",borderRadius:8,padding:16,fontSize:13,color:"#cbd5e1",marginBottom:20,maxHeight:200,overflow:"auto",border:"1px solid rgba(255,255,255,0.05)"}}>{preview}</div>
      <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
        <button onClick={onCancel} style={{padding:"8px 20px",borderRadius:8,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:13}}>Cancel</button>
        <button onClick={onConfirm} style={{padding:"8px 20px",borderRadius:8,border:"none",background:danger?"#ef4444":"#8b5cf6",color:"white",cursor:"pointer",fontSize:13,fontWeight:600}}>Confirm</button>
      </div>
    </div>
  </div>;
};

const Drawer = ({open,title,onClose,children,width=480}) => {
  if(!open) return null;
  return <div style={{position:"fixed",inset:0,zIndex:8000,display:"flex"}} role="dialog" aria-modal="true" aria-label={title}>
    <div style={{flex:1,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(2px)"}} onClick={onClose}/>
    <div style={{width:Math.min(width,window.innerWidth*0.92),background:"#0f172a",borderLeft:"1px solid rgba(255,255,255,0.08)",overflow:"auto",animation:"slideRight 0.25s ease"}}>
      <div style={{padding:"20px 24px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#0f172a",zIndex:1}}>
        <h3 style={{margin:0,fontSize:16,color:"#f1f5f9"}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:4}} aria-label="Close drawer"><I name="close" size={18}/></button>
      </div>
      <div style={{padding:24}}>{children}</div>
    </div>
  </div>;
};

const SearchBar = ({value,onChange,placeholder="Search..."}) => (
  <div style={{position:"relative",flex:"1 1 200px",maxWidth:360}}>
    <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}><I name="search" size={14} color="#64748b"/></div>
    <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",padding:"8px 12px 8px 36px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box"}}
      aria-label={placeholder}/>
  </div>
);

const FilterDropdown = ({label,options,value,onChange}) => (
  <select value={value} onChange={e=>onChange(e.target.value)} aria-label={label}
    style={{padding:"8px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#e2e8f0",fontSize:13,cursor:"pointer"}}>
    <option value="">{label}: All</option>
    {options.map(o=><option key={o} value={o}>{o}</option>)}
  </select>
);

const DataTable = ({columns,data,onRowClick,pageSize=20,emptyMsg="No records found"}) => {
  const [sort,setSort] = useState({col:null,dir:"asc"});
  const [page,setPage] = useState(0);
  const sorted = useMemo(()=>{
    if(!sort.col) return data;
    return [...data].sort((a,b)=>{
      const va=a[sort.col],vb=b[sort.col];
      if(typeof va==="number") return sort.dir==="asc"?va-vb:vb-va;
      return sort.dir==="asc"?String(va).localeCompare(String(vb)):String(vb).localeCompare(String(va));
    });
  },[data,sort]);
  const paged = sorted.slice(page*pageSize,(page+1)*pageSize);
  const totalPages = Math.ceil(data.length/pageSize);
  if(!data.length) return <EmptyState message={emptyMsg}/>;
  return <div>
    <div style={{overflow:"auto",borderRadius:8,border:"1px solid rgba(255,255,255,0.06)"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}} role="table">
        <thead><tr>
          {columns.map(c=><th key={c.key} onClick={()=>setSort(s=>({col:c.key,dir:s.col===c.key&&s.dir==="asc"?"desc":"asc"}))}
            style={{padding:"10px 14px",textAlign:"left",color:"#94a3b8",fontWeight:600,fontSize:11,textTransform:"uppercase",letterSpacing:0.5,borderBottom:"1px solid rgba(255,255,255,0.06)",cursor:"pointer",whiteSpace:"nowrap",background:"rgba(255,255,255,0.02)",userSelect:"none"}}
            role="columnheader" aria-sort={sort.col===c.key?(sort.dir==="asc"?"ascending":"descending"):"none"}>
            {c.label} {sort.col===c.key?(sort.dir==="asc"?"↑":"↓"):""}
          </th>)}
        </tr></thead>
        <tbody>
          {paged.map((row,i)=><tr key={row.id||i} onClick={()=>onRowClick&&onRowClick(row)}
            style={{cursor:onRowClick?"pointer":"default",borderBottom:"1px solid rgba(255,255,255,0.03)"}}
            tabIndex={onRowClick?0:undefined} role="row"
            onKeyDown={e=>e.key==="Enter"&&onRowClick&&onRowClick(row)}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {columns.map(c=><td key={c.key} style={{padding:"10px 14px",color:"#cbd5e1",whiteSpace:"nowrap",maxWidth:240,overflow:"hidden",textOverflow:"ellipsis"}}>{c.render?c.render(row[c.key],row):String(row[c.key]??"—")}</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
    {totalPages>1&&<div style={{display:"flex",gap:8,alignItems:"center",justifyContent:"center",padding:"12px 0",fontSize:12,color:"#94a3b8"}}>
      <button disabled={page===0} onClick={()=>setPage(p=>p-1)} style={{padding:"4px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94a3b8",cursor:page===0?"not-allowed":"pointer",opacity:page===0?0.5:1}}>Prev</button>
      <span>{page+1} / {totalPages}</span>
      <button disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)} style={{padding:"4px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94a3b8",cursor:page>=totalPages-1?"not-allowed":"pointer",opacity:page>=totalPages-1?0.5:1}}>Next</button>
    </div>}
  </div>;
};

const DetailRow = ({label,children}) => <div style={{display:"flex",gap:12,padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:13}}>
  <span style={{color:"#64748b",minWidth:120,flexShrink:0}}>{label}</span>
  <span style={{color:"#e2e8f0",flex:1}}>{children}</span>
</div>;

const SectionHeader = ({children,action}) => <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,marginTop:8}}>
  <h3 style={{margin:0,fontSize:15,color:"#f1f5f9"}}>{children}</h3>{action}
</div>;

const ActionBtn = ({children,onClick,variant="default",small,disabled,title:t}) => {
  const bg = variant==="danger"?"#ef4444":variant==="primary"?"#8b5cf6":variant==="success"?"#22c55e":"transparent";
  const border = variant==="default"?"1px solid rgba(255,255,255,0.15)":"1px solid transparent";
  return <button onClick={onClick} disabled={disabled} title={t}
    style={{padding:small?"4px 10px":"8px 16px",borderRadius:8,border,background:disabled?"#334155":bg,color:disabled?"#64748b":"white",cursor:disabled?"not-allowed":"pointer",fontSize:small?11:13,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6,opacity:disabled?0.6:1,whiteSpace:"nowrap"}}>{children}</button>;
};

const TabBar = ({tabs,active,onChange}) => (
  <div style={{display:"flex",gap:2,overflowX:"auto",borderBottom:"1px solid rgba(255,255,255,0.06)",marginBottom:20}} role="tablist">
    {tabs.map(t=><button key={t.id} role="tab" aria-selected={active===t.id} onClick={()=>onChange(t.id)}
      style={{padding:"10px 16px",background:active===t.id?"rgba(139,92,246,0.15)":"transparent",border:"none",borderBottom:active===t.id?"2px solid #8b5cf6":"2px solid transparent",color:active===t.id?"#c4b5fd":"#94a3b8",cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>{t.label}</button>)}
  </div>
);

const MiniBar = ({value,max,color="#8b5cf6"}) => <div style={{width:80,height:6,borderRadius:3,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
  <div style={{width:`${Math.min(100,value/max*100)}%`,height:"100%",borderRadius:3,background:color}}/>
</div>;

const fmtDate = d => d ? new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"2-digit"}) : "—";
const fmtTime = d => d ? new Date(d).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}) : "—";

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
const TABS = [
  {id:"overview",label:"Overview",icon:"dashboard"},
  {id:"agents",label:"Agents",icon:"agents"},
  {id:"deployments",label:"Deploys",icon:"deploy"},
  {id:"usage",label:"Usage",icon:"usage"},
  {id:"backlog",label:"Backlog",icon:"backlog"},
  {id:"audit",label:"Audit Log",icon:"audit"},
  {id:"incidents",label:"Incidents",icon:"incident"},
  {id:"secrets",label:"Secrets",icon:"secrets"},
  {id:"prompts",label:"Prompts",icon:"prompt"},
  {id:"experiments",label:"Experiments",icon:"experiment"},
  {id:"sops",label:"KB / SOP",icon:"sop"},
  {id:"notifications",label:"Notifications",icon:"notifications"},
  {id:"cost",label:"Cost Guard",icon:"cost"},
  {id:"policy",label:"Policy",icon:"policy"},
  {id:"connectors",label:"Connectors",icon:"connectors"},
  {id:"runbooks",label:"Runbooks",icon:"runbook"},
];

export default function App() {
  const [state,setState] = useState(INIT);
  const [tab,setTab] = useState("overview");
  const [env,setEnv] = useState("all");
  const [search,setSearch] = useState("");
  const [sidebarOpen,setSidebarOpen] = useState(true);
  const [drawerData,setDrawerData] = useState(null);
  const [confirm,setConfirm] = useState(null);
  const [toast,setToast] = useState(null);
  const [infoPanel,setInfoPanel] = useState(null); // "help" | "dev" | null
  const [reducedMotion,setReducedMotion] = useState(false);
  const searchTimeout = useRef(null);
  const [debouncedSearch,setDebouncedSearch] = useState("");

  useEffect(()=>{
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(()=>setDebouncedSearch(search),250);
  },[search]);

  const showToast = useCallback((msg,type="info")=>{
    setToast({msg,type});
    setTimeout(()=>setToast(null),3500);
  },[]);

  const addAudit = useCallback((action,target,details="")=>{
    setState(s=>({...s,audit_log:[{id:`audit-${rid()}`,action,actor:"kyle",target,env:env==="all"?"prod":env,timestamp:new Date().toISOString(),details,metadata:{ip:"10.0.1.42"}},...s.audit_log]}));
  },[env]);

  const doConfirm = useCallback((title,preview,onOk,danger=false)=>{
    setConfirm({title,preview,onConfirm:()=>{setConfirm(null);onOk();},onCancel:()=>setConfirm(null),danger});
  },[]);

  const filtered = useCallback((arr,fields=[])=>{
    let r = arr;
    if(env!=="all") r = r.filter(x=>!x.env||x.env===env);
    if(debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      r = r.filter(x=>fields.some(f=>String(x[f]??"").toLowerCase().includes(q)));
    }
    return r;
  },[env,debouncedSearch]);

  const lastRefresh = useMemo(()=>new Date().toLocaleTimeString(),[tab]);
  const healthPill = useMemo(()=>{
    const failingAgents = state.agents.filter(a=>a.status==="failing").length;
    const openInc = state.incidents.filter(i=>i.status!=="resolved").length;
    return failingAgents > 0 || openInc > 2 ? "degraded" : "healthy";
  },[state.agents,state.incidents]);
  const unacked = state.notifications.filter(n=>!n.acknowledged).length;

  // ═══════════════════════════════════════════════════════════
  // OVERVIEW TAB
  // ═══════════════════════════════════════════════════════════
  const OverviewTab = () => {
    const kpis = useMemo(()=>{
      const today = state.usage_daily[0];
      const budget = state.budgets.find(b=>b.period==="daily");
      return {
        activeAgents: state.agents.filter(a=>a.status==="active").length,
        failingAgents: state.agents.filter(a=>a.status==="failing").length,
        failingDeploys: state.deployments.filter(d=>d.status==="failed").length,
        tokenSpend: today ? `$${today.cost}` : "$0",
        budgetRemaining: budget ? `$${(budget.threshold - budget.current).toFixed(2)}` : "—",
        openIncidents: state.incidents.filter(i=>i.status!=="resolved").length,
        overdueSecrets: state.secrets.filter(s=>s.status==="overdue").length,
        topWsjf: state.backlog[0]?.feature || "—",
        unackedNotifs: unacked,
      };
    },[state]);
    const criticalAlerts = state.notifications.filter(n=>n.severity==="critical"&&!n.acknowledged).slice(0,5);
    const todayFocus = [
      state.secrets.filter(s=>s.status==="overdue").length > 0 && "Rotate overdue secrets",
      state.incidents.filter(i=>i.status==="open").length > 0 && "Triage open incidents",
      state.backlog[0] && `Top backlog: ${state.backlog[0].feature}`
    ].filter(Boolean).slice(0,3);

    return <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:24}}>
        <KPICard title="Active Agents" value={kpis.activeAgents} color="#22c55e" icon="agents"/>
        <KPICard title="Failing Agents" value={kpis.failingAgents} color={kpis.failingAgents?"#ef4444":"#22c55e"} icon="incident"/>
        <KPICard title="Failed Deploys" value={kpis.failingDeploys} color={kpis.failingDeploys?"#ef4444":"#22c55e"} icon="deploy"/>
        <KPICard title="Token Spend Today" value={kpis.tokenSpend} color="#8b5cf6" icon="cost"/>
        <KPICard title="Budget Remaining" value={kpis.budgetRemaining} color={parseFloat(kpis.budgetRemaining.replace("$",""))<0?"#ef4444":"#22c55e"} icon="cost"/>
        <KPICard title="Open Incidents" value={kpis.openIncidents} color={kpis.openIncidents?"#f59e0b":"#22c55e"} icon="incident"/>
        <KPICard title="Overdue Secrets" value={kpis.overdueSecrets} color={kpis.overdueSecrets?"#ef4444":"#22c55e"} icon="secrets"/>
        <KPICard title="Top WSJF Item" value={kpis.topWsjf} subtitle={state.backlog[0]?`Score: ${state.backlog[0].wsjf}`:""} color="#c4b5fd" icon="backlog"/>
        <KPICard title="Unacked Alerts" value={kpis.unackedNotifs} color={kpis.unackedNotifs?"#f59e0b":"#22c55e"} icon="notifications"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <div style={{background:"rgba(255,255,255,0.02)",borderRadius:12,padding:20,border:"1px solid rgba(255,255,255,0.06)"}}>
          <SectionHeader>Today's Focus</SectionHeader>
          {todayFocus.length?todayFocus.map((f,i)=><div key={i} style={{padding:"8px 0",color:"#e2e8f0",fontSize:13,borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",gap:8}}>
            <span style={{color:"#8b5cf6",fontWeight:700}}>{i+1}.</span>{f}
          </div>):<div style={{color:"#64748b",fontSize:13}}>All clear — no urgent items.</div>}
        </div>
        <div style={{background:"rgba(255,255,255,0.02)",borderRadius:12,padding:20,border:"1px solid rgba(255,255,255,0.06)"}}>
          <SectionHeader>Critical Alerts</SectionHeader>
          {criticalAlerts.length?criticalAlerts.map(a=><div key={a.id} style={{padding:"6px 0",fontSize:13,color:"#fca5a5",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:6,height:6,borderRadius:"50%",background:"#ef4444",flexShrink:0}}/>{a.title}
          </div>):<div style={{color:"#22c55e",fontSize:13,display:"flex",alignItems:"center",gap:8}}>✓ All clear — no critical alerts.</div>}
        </div>
      </div>

      <SectionHeader>Quick Actions</SectionHeader>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {[{l:"Create Agent",t:"agents"},{l:"Run Agent",t:"agents"},{l:"Create Deploy",t:"deployments"},{l:"Log Incident",t:"incidents"},{l:"Add Backlog Item",t:"backlog"},{l:"Add SOP",t:"sops"},{l:"Add Runbook",t:"runbooks"}].map(({l,t})=>
          <ActionBtn key={l} onClick={()=>setTab(t)}><I name="plus" size={13}/>{l}</ActionBtn>
        )}
      </div>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // AGENTS TAB
  // ═══════════════════════════════════════════════════════════
  const AgentsTab = () => {
    const [sf,setSf] = useState("");
    const data = filtered(state.agents,["name","model","status"]).filter(a=>!sf||a.status===sf);
    return <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search agents..."/>
        <FilterDropdown label="Status" options={STATUSES_AGENT} value={sf} onChange={setSf}/>
        <ActionBtn variant="primary" onClick={()=>showToast("Agent creation wizard coming soon","info")}><I name="plus" size={13}/>New Agent</ActionBtn>
      </div>
      <DataTable columns={[
        {key:"name",label:"Agent",render:(v,r)=><span style={{fontWeight:600}}>{v}</span>},
        {key:"status",label:"Status",render:v=><Badge status={v}/>},
        {key:"model",label:"Model",render:v=><span style={{fontSize:11,color:"#94a3b8"}}>{v}</span>},
        {key:"env",label:"Env",render:v=><Badge status={v==="prod"?"active":v==="stage"?"idle":"draft"} label={v}/>},
        {key:"runs_today",label:"Runs",render:v=>v},
        {key:"tokens_today",label:"Tokens",render:v=>v.toLocaleString()},
        {key:"error_rate",label:"Error%",render:v=><span style={{color:v>0.1?"#ef4444":"#22c55e"}}>{(v*100).toFixed(1)}%</span>},
      ]} data={data} onRowClick={r=>setDrawerData({type:"agent",data:r})}/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // DEPLOYMENTS TAB
  // ═══════════════════════════════════════════════════════════
  const DeploymentsTab = () => {
    const data = filtered(state.deployments,["service","version","status","deployed_by"]);
    return <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search deploys..."/>
      </div>
      <DataTable columns={[
        {key:"service",label:"Service",render:v=><span style={{fontWeight:600}}>{v}</span>},
        {key:"version",label:"Version"},
        {key:"env",label:"Env"},
        {key:"status",label:"Status",render:v=><Badge status={v}/>},
        {key:"deployed_by",label:"By"},
        {key:"timestamp",label:"When",render:v=>fmtTime(v)},
        {key:"rollback_available",label:"Rollback",render:(v,r)=>v?<ActionBtn small onClick={e=>{e.stopPropagation();doConfirm("Rollback Deployment",<div><DetailRow label="Service">{r.service}</DetailRow><DetailRow label="Version">{r.version} → previous</DetailRow><DetailRow label="Env">{r.env}</DetailRow></div>,()=>{setState(s=>({...s,deployments:s.deployments.map(d=>d.id===r.id?{...d,status:"rolled_back"}:d)}));addAudit("deploy.rolled_back",r.service,"User initiated rollback");showToast("Deployment rolled back","success");},true);}}>Rollback</ActionBtn>:<span style={{color:"#64748b",fontSize:11}}>N/A</span>},
      ]} data={data} onRowClick={r=>setDrawerData({type:"deploy",data:r})}/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // USAGE TAB
  // ═══════════════════════════════════════════════════════════
  const UsageTab = () => {
    const data = state.usage_daily.slice(0,30);
    const maxTokens = Math.max(...data.map(d=>d.tokens));
    const maxCost = Math.max(...data.map(d=>d.cost));
    const totalCost = data.reduce((s,d)=>s+d.cost,0).toFixed(2);
    const totalTokens = data.reduce((s,d)=>s+d.tokens,0).toLocaleString();
    return <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <KPICard title="30d Token Usage" value={totalTokens} color="#8b5cf6" icon="usage"/>
        <KPICard title="30d Total Cost" value={`$${totalCost}`} color="#f59e0b" icon="cost"/>
        <KPICard title="Avg Daily Cost" value={`$${(totalCost/30).toFixed(2)}`} color="#3b82f6" icon="cost"/>
        <KPICard title="30d Errors" value={data.reduce((s,d)=>s+d.errors,0)} color="#ef4444" icon="incident"/>
      </div>
      <SectionHeader>Daily Usage (last 30 days)</SectionHeader>
      <div style={{display:"flex",gap:2,alignItems:"end",height:120,marginBottom:8,padding:"0 4px"}}>
        {data.slice().reverse().map((d,i)=><div key={d.date} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}} title={`${d.date}: ${d.tokens.toLocaleString()} tokens, $${d.cost}`}>
          <div style={{width:"100%",background:"linear-gradient(to top, #8b5cf6, #c4b5fd)",borderRadius:"3px 3px 0 0",height:`${(d.tokens/maxTokens)*100}%`,minHeight:2,opacity:0.8}}/>
        </div>)}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#64748b",padding:"0 4px",marginBottom:20}}>
        <span>{data[data.length-1]?.date}</span><span>{data[0]?.date}</span>
      </div>
      <SectionHeader>Daily Cost Breakdown</SectionHeader>
      <div style={{display:"flex",gap:2,alignItems:"end",height:80,padding:"0 4px"}}>
        {data.slice().reverse().map((d,i)=><div key={d.date+"-cost"} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div style={{width:"100%",background:d.cost>60?"#ef4444":d.cost>40?"#f59e0b":"#22c55e",borderRadius:"3px 3px 0 0",height:`${(d.cost/maxCost)*100}%`,minHeight:2,opacity:0.7}}/>
        </div>)}
      </div>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // BACKLOG TAB
  // ═══════════════════════════════════════════════════════════
  const BacklogTab = () => {
    const data = filtered(state.backlog,["feature","status"]);
    const editField = (id,field,val) => {
      const v = parseInt(val);
      if(isNaN(v)||v<1||v>21) return;
      setState(s=>{
        const bl = s.backlog.map(b=>{
          if(b.id!==id) return b;
          const u = {...b,[field]:v};
          u.wsjf = +((u.bv+u.tc+u.rr_oe)/u.job_size).toFixed(2);
          return u;
        });
        return {...s,backlog:bl.sort((a,b)=>b.wsjf-a.wsjf)};
      });
    };
    const InlineNum = ({val,onChange}) => <input type="number" value={val} min={1} max={21} onChange={e=>onChange(e.target.value)}
      style={{width:40,padding:"2px 4px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:4,color:"#e2e8f0",fontSize:12,textAlign:"center"}}
      onClick={e=>e.stopPropagation()} aria-label="Edit value"/>;
    return <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search backlog..."/>
      </div>
      <DataTable columns={[
        {key:"feature",label:"Feature",render:v=><span style={{fontWeight:600}}>{v}</span>},
        {key:"status",label:"Status",render:v=><Badge status={v}/>},
        {key:"bv",label:"BV",render:(v,r)=><InlineNum val={v} onChange={val=>editField(r.id,"bv",val)}/>},
        {key:"tc",label:"TC",render:(v,r)=><InlineNum val={v} onChange={val=>editField(r.id,"tc",val)}/>},
        {key:"rr_oe",label:"RR/OE",render:(v,r)=><InlineNum val={v} onChange={val=>editField(r.id,"rr_oe",val)}/>},
        {key:"job_size",label:"Job Size",render:(v,r)=><InlineNum val={v} onChange={val=>editField(r.id,"job_size",val)}/>},
        {key:"wsjf",label:"WSJF ↓",render:v=><span style={{fontWeight:700,color:"#c4b5fd"}}>{v}</span>},
      ]} data={data} onRowClick={r=>setDrawerData({type:"backlog",data:r})} pageSize={25}/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // AUDIT LOG TAB
  // ═══════════════════════════════════════════════════════════
  const AuditTab = () => {
    const data = filtered(state.audit_log,["action","actor","target","details"]);
    return <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search audit log..."/>
      </div>
      <DataTable columns={[
        {key:"timestamp",label:"When",render:v=>fmtTime(v)},
        {key:"action",label:"Action",render:v=><span style={{fontFamily:"monospace",fontSize:12,color:"#c4b5fd"}}>{v}</span>},
        {key:"actor",label:"Actor"},
        {key:"target",label:"Target"},
        {key:"env",label:"Env"},
        {key:"details",label:"Details"},
      ]} data={data} pageSize={25} emptyMsg="No audit entries"/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // INCIDENTS TAB
  // ═══════════════════════════════════════════════════════════
  const IncidentsTab = () => {
    const [sf,setSf] = useState("");
    const data = filtered(state.incidents,["title","system","severity","status"]).filter(i=>!sf||i.status===sf);
    return <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search incidents..."/>
        <FilterDropdown label="Status" options={INCIDENT_STATUS} value={sf} onChange={setSf}/>
        <ActionBtn variant="primary" onClick={()=>showToast("Incident creation form coming soon","info")}><I name="plus" size={13}/>Log Incident</ActionBtn>
      </div>
      <DataTable columns={[
        {key:"severity",label:"Sev",render:v=><Badge status={v}/>},
        {key:"title",label:"Title",render:v=><span style={{fontWeight:600}}>{v}</span>},
        {key:"system",label:"System"},
        {key:"env",label:"Env"},
        {key:"status",label:"Status",render:v=><Badge status={v}/>},
        {key:"created",label:"Created",render:v=>fmtTime(v)},
      ]} data={data} onRowClick={r=>setDrawerData({type:"incident",data:r})}/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // SECRETS TAB
  // ═══════════════════════════════════════════════════════════
  const SecretsTab = () => {
    const data = filtered(state.secrets,["name","system","owner","status"]);
    const overdueCount = state.secrets.filter(s=>s.status==="overdue").length;
    return <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:16}}>
        <KPICard title="Total Secrets" value={state.secrets.length} color="#94a3b8" icon="secrets"/>
        <KPICard title="Overdue" value={overdueCount} color={overdueCount?"#ef4444":"#22c55e"} icon="incident"/>
        <KPICard title="Expiring Soon" value={state.secrets.filter(s=>s.status==="expiring_soon").length} color="#f59e0b" icon="incident"/>
        <div style={{flex:"1 1 200px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"16px 20px"}}>
          <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Risk Meter</div>
          <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${Math.min(100,overdueCount*15)}%`,background:overdueCount>4?"#ef4444":overdueCount>2?"#f59e0b":"#22c55e",borderRadius:4,transition:"width 0.3s"}}/>
          </div>
          <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{overdueCount===0?"Low risk":overdueCount<3?"Moderate":"High risk"}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}><SearchBar value={search} onChange={setSearch} placeholder="Search secrets..."/></div>
      <DataTable columns={[
        {key:"name",label:"Secret",render:v=><span style={{fontFamily:"monospace",fontSize:12,fontWeight:600}}>{v}</span>},
        {key:"system",label:"System"},
        {key:"owner",label:"Owner"},
        {key:"last_rotated",label:"Last Rotated",render:v=>fmtDate(v)},
        {key:"next_due",label:"Next Due",render:v=>fmtDate(v)},
        {key:"status",label:"Status",render:v=><Badge status={v}/>},
        {key:"id",label:"Action",render:(_,r)=><ActionBtn small variant={r.status==="overdue"?"danger":"default"} onClick={e=>{
          e.stopPropagation();
          doConfirm("Mark Secret Rotated",<div><DetailRow label="Secret">{r.name}</DetailRow><DetailRow label="System">{r.system}</DetailRow><DetailRow label="Before">Last rotated: {r.last_rotated}</DetailRow><DetailRow label="After">Will reset to today</DetailRow></div>,()=>{
            const today = new Date().toISOString().slice(0,10);
            const next = new Date(); next.setDate(next.getDate()+90);
            setState(s=>({...s,secrets:s.secrets.map(x=>x.id===r.id?{...x,last_rotated:today,next_due:next.toISOString().slice(0,10),status:"ok"}:x)}));
            addAudit("secret.rotated",r.name);showToast(`${r.name} marked as rotated`,"success");
          });
        }}>Rotate</ActionBtn>},
      ]} data={data}/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // PROMPTS TAB
  // ═══════════════════════════════════════════════════════════
  const PromptsTab = () => {
    const data = filtered(state.prompts,["name","purpose","model_target","status"]);
    return <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search prompts..."/>
      </div>
      <DataTable columns={[
        {key:"name",label:"Prompt",render:v=><span style={{fontWeight:600}}>{v}</span>},
        {key:"model_target",label:"Model",render:v=><span style={{fontSize:11,color:"#94a3b8"}}>{v}</span>},
        {key:"version",label:"Ver",render:v=>`v${v}`},
        {key:"status",label:"Status",render:v=><Badge status={v}/>},
        {key:"last_updated",label:"Updated",render:v=>fmtTime(v)},
        {key:"id",label:"Action",render:(_,r)=>r.status==="draft"?<ActionBtn small variant="primary" onClick={e=>{
          e.stopPropagation();
          doConfirm("Promote Prompt to Active",<div><DetailRow label="Prompt">{r.name}</DetailRow><DetailRow label="Before">Status: draft (v{r.version})</DetailRow><DetailRow label="After">Status: active</DetailRow></div>,()=>{
            setState(s=>({...s,prompts:s.prompts.map(p=>p.id===r.id?{...p,status:"active"}:p)}));
            addAudit("prompt.promoted",r.name);showToast(`${r.name} promoted to active`,"success");
          });
        }}>Promote</ActionBtn>:<span style={{fontSize:11,color:"#64748b"}}>{r.status}</span>},
      ]} data={data} onRowClick={r=>setDrawerData({type:"prompt",data:r})}/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // EXPERIMENTS TAB
  // ═══════════════════════════════════════════════════════════
  const ExperimentsTab = () => {
    const data = filtered(state.experiments,["hypothesis","metric","status","decision"]);
    const suggestExperiments = () => {
      const suggestions = [
        "Hypothesis: Reducing system prompt tokens by 40% for tier-2 queries maintains accuracy above 95%",
        "Hypothesis: Async batch processing for non-urgent agent tasks improves daily throughput by 3x",
        "Hypothesis: Implementing semantic caching reduces duplicate API calls by 60%"
      ];
      showToast("3 experiment suggestions generated — check console","info");
      setDrawerData({type:"suggestions",data:suggestions});
    };
    return <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search experiments..."/>
        <ActionBtn variant="primary" onClick={suggestExperiments}><I name="zap" size={13}/>Suggest Experiments</ActionBtn>
      </div>
      <DataTable columns={[
        {key:"hypothesis",label:"Hypothesis",render:v=><span style={{fontWeight:600,maxWidth:280,overflow:"hidden",textOverflow:"ellipsis",display:"block"}}>{v}</span>},
        {key:"metric",label:"Metric"},
        {key:"status",label:"Status",render:v=><Badge status={v}/>},
        {key:"uplift",label:"Uplift",render:v=><span style={{color:v>0?"#22c55e":v<0?"#ef4444":"#94a3b8"}}>{v>0?"+":""}{v}%</span>},
        {key:"confidence",label:"Confidence"},
        {key:"decision",label:"Decision",render:v=><Badge status={v}/>},
      ]} data={data} onRowClick={r=>setDrawerData({type:"experiment",data:r})}/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // KB / SOP TAB
  // ═══════════════════════════════════════════════════════════
  const SOPTab = () => {
    const [sopSearch,setSopSearch] = useState("");
    const [systemFilter,setSystemFilter] = useState("");
    const data = state.sops.filter(s=>{
      const q = sopSearch.toLowerCase();
      const matchQ = !q || s.title.toLowerCase().includes(q) || s.tags.some(t=>t.toLowerCase().includes(q));
      const matchSys = !systemFilter || s.system===systemFilter;
      return matchQ && matchSys;
    });
    return <div>
      <div style={{background:"rgba(139,92,246,0.08)",borderRadius:12,padding:20,marginBottom:20,border:"1px solid rgba(139,92,246,0.2)"}}>
        <div style={{fontSize:14,fontWeight:600,color:"#c4b5fd",marginBottom:8}}>What are you trying to do?</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <SearchBar value={sopSearch} onChange={setSopSearch} placeholder="e.g. rotate secrets, restart agent, deploy rollback..."/>
          <FilterDropdown label="System" options={["api-gateway","auth-service","agent-orchestrator","database","cdn","all"]} value={systemFilter} onChange={setSystemFilter}/>
        </div>
      </div>
      {sopSearch && <div style={{fontSize:12,color:"#94a3b8",marginBottom:12}}>Top {Math.min(3,data.length)} matches:</div>}
      {data.slice(0,sopSearch?3:25).map(s=>(
        <div key={s.id} onClick={()=>setDrawerData({type:"sop",data:s})} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:8,padding:16,marginBottom:8,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}
          tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setDrawerData({type:"sop",data:s})}
          onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(139,92,246,0.3)"} onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,0.06)"}>
          <div>
            <div style={{fontWeight:600,color:"#e2e8f0",marginBottom:4}}>{s.title}</div>
            <div style={{fontSize:11,color:"#64748b",display:"flex",gap:8,flexWrap:"wrap"}}>
              <span>System: {s.system}</span>
              <span>Severity: {s.severity_applicability}</span>
              <span>Est: {s.estimated_time}</span>
              {s.tags.map(t=><span key={t} style={{background:"rgba(139,92,246,0.15)",padding:"1px 6px",borderRadius:4,color:"#c4b5fd"}}>{t}</span>)}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:12,color:s.confidence>85?"#22c55e":"#f59e0b"}}>{s.confidence}%</span>
            <ActionBtn small>Open</ActionBtn>
          </div>
        </div>
      ))}
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // NOTIFICATIONS TAB
  // ═══════════════════════════════════════════════════════════
  const NotificationsTab = () => {
    const [tf,setTf] = useState("");
    const [sf,setSf] = useState("");
    const data = state.notifications.filter(n=>{
      return (!tf||n.type===tf)&&(!sf||n.severity===sf);
    }).filter(n=>{
      if(!debouncedSearch) return true;
      return n.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    });
    return <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search notifications..."/>
        <FilterDropdown label="Type" options={NOTIF_TYPES} value={tf} onChange={setTf}/>
        <FilterDropdown label="Severity" options={["critical","warning","info"]} value={sf} onChange={setSf}/>
      </div>
      <DataTable columns={[
        {key:"severity",label:"Sev",render:v=><Badge status={v}/>},
        {key:"type",label:"Type",render:v=><span style={{fontSize:11,fontFamily:"monospace"}}>{v}</span>},
        {key:"title",label:"Alert",render:v=><span style={{fontWeight:600}}>{v}</span>},
        {key:"env",label:"Env"},
        {key:"timestamp",label:"When",render:v=>fmtTime(v)},
        {key:"acknowledged",label:"Acked",render:v=>v?<span style={{color:"#22c55e"}}>✓</span>:<span style={{color:"#f59e0b"}}>—</span>},
        {key:"id",label:"Actions",render:(_,r)=><div style={{display:"flex",gap:4}} onClick={e=>e.stopPropagation()}>
          {!r.acknowledged&&<ActionBtn small onClick={()=>{setState(s=>({...s,notifications:s.notifications.map(n=>n.id===r.id?{...n,acknowledged:true}:n)}));addAudit("notification.acked",r.title);showToast("Acknowledged","success");}}>Ack</ActionBtn>}
          <ActionBtn small onClick={()=>{setState(s=>({...s,notifications:s.notifications.map(n=>n.id===r.id?{...n,snoozed:true}:n)}));showToast("Snoozed for 1h","info");}}>Snooze</ActionBtn>
        </div>},
      ]} data={data}/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // COST OPTIMIZER TAB
  // ═══════════════════════════════════════════════════════════
  const CostTab = () => {
    const [simReduce,setSimReduce] = useState(0);
    const totalCost30d = state.usage_daily.slice(0,30).reduce((s,d)=>s+d.cost,0);
    const savings = (totalCost30d * simReduce / 100).toFixed(2);
    const topDrivers = state.agents.sort((a,b)=>b.tokens_today-a.tokens_today).slice(0,5);
    return <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:20}}>
        {state.budgets.map(b=>(
          <KPICard key={b.id} title={`${b.period.charAt(0).toUpperCase()+b.period.slice(1)} Budget`}
            value={`$${b.current} / $${b.threshold}`}
            color={b.current>b.threshold?"#ef4444":b.current>b.threshold*0.8?"#f59e0b":"#22c55e"}
            subtitle={`${((b.current/b.threshold)*100).toFixed(0)}% used`} icon="cost"/>
        ))}
      </div>

      <SectionHeader>Top Cost Drivers (Today)</SectionHeader>
      <DataTable columns={[
        {key:"name",label:"Agent",render:v=><span style={{fontWeight:600}}>{v}</span>},
        {key:"model",label:"Model"},
        {key:"tokens_today",label:"Tokens",render:v=>v.toLocaleString()},
        {key:"runs_today",label:"Runs"},
      ]} data={topDrivers}/>

      <div style={{marginTop:24,background:"rgba(255,255,255,0.02)",borderRadius:12,padding:20,border:"1px solid rgba(255,255,255,0.06)"}}>
        <SectionHeader>Recommendations</SectionHeader>
        {[
          {icon:"zap",text:"Cache repeated agent inputs — est. 15-20% token savings",impact:"high"},
          {icon:"zap",text:"Batch similar requests — est. 10% throughput improvement",impact:"medium"},
          {icon:"zap",text:"Route low-risk queries to Claude Haiku — est. 30% cost reduction",impact:"high"},
        ].map((r,i)=><div key={i} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",gap:12,fontSize:13}}>
          <I name={r.icon} size={14} color={r.impact==="high"?"#22c55e":"#f59e0b"}/>
          <span style={{color:"#e2e8f0",flex:1}}>{r.text}</span>
          <Badge status={r.impact==="high"?"success":"idle"} label={r.impact}/>
        </div>)}
      </div>

      <div style={{marginTop:24,background:"rgba(139,92,246,0.06)",borderRadius:12,padding:20,border:"1px solid rgba(139,92,246,0.15)"}}>
        <SectionHeader>What-If Simulator</SectionHeader>
        <div style={{fontSize:13,color:"#cbd5e1",marginBottom:12}}>If you reduce token usage by <strong style={{color:"#c4b5fd"}}>{simReduce}%</strong>, you save <strong style={{color:"#22c55e"}}>${savings}</strong> over 30 days.</div>
        <input type="range" min={0} max={60} value={simReduce} onChange={e=>setSimReduce(Number(e.target.value))}
          style={{width:"100%",accentColor:"#8b5cf6"}} aria-label="Token reduction percentage"/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#64748b"}}><span>0%</span><span>60%</span></div>
      </div>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // POLICY TAB
  // ═══════════════════════════════════════════════════════════
  const PolicyTab = () => {
    const passing = state.policies.filter(p=>p.status==="pass").length;
    const total = state.policies.length;
    return <div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,marginBottom:20}}>
        <KPICard title="Passing Checks" value={`${passing}/${total}`} color={passing===total?"#22c55e":"#f59e0b"} icon="policy"/>
        <KPICard title="Failing" value={total-passing} color={total-passing?"#ef4444":"#22c55e"} icon="incident"/>
        <div style={{flex:"1 1 280px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"16px 20px"}}>
          <div style={{fontSize:11,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Guardrails Status</div>
          <div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(passing/total)*100}%`,background:passing===total?"#22c55e":passing/total>0.7?"#f59e0b":"#ef4444",borderRadius:5}}/>
          </div>
          <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{((passing/total)*100).toFixed(0)}% compliant</div>
        </div>
      </div>

      <DataTable columns={[
        {key:"name",label:"Policy Check",render:v=><span style={{fontWeight:600}}>{v}</span>},
        {key:"category",label:"Category"},
        {key:"status",label:"Status",render:v=><Badge status={v}/>},
        {key:"last_check",label:"Last Check",render:v=>fmtTime(v)},
        {key:"remediation",label:"Remediation",render:v=><span style={{fontSize:12,color:v==="N/A"?"#64748b":"#fca5a5"}}>{v}</span>},
      ]} data={state.policies}/>

      <div style={{marginTop:24,background:"rgba(255,255,255,0.02)",borderRadius:12,padding:20,border:"1px solid rgba(255,255,255,0.06)"}}>
        <SectionHeader>Policy Exception Request</SectionHeader>
        <div style={{fontSize:13,color:"#94a3b8",marginBottom:12}}>Submit an exception request for audit trail.</div>
        <ActionBtn variant="primary" onClick={()=>{
          doConfirm("Submit Policy Exception",<div><DetailRow label="Requester">kyle</DetailRow><DetailRow label="Type">Temporary exception</DetailRow><DetailRow label="Duration">7 days</DetailRow><DetailRow label="Justification">Demo exception request</DetailRow></div>,()=>{
            addAudit("policy.exception","policy-exception","Temporary 7-day exception requested");
            showToast("Policy exception logged","success");
          });
        }}><I name="edit" size={13}/>Request Exception</ActionBtn>
      </div>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // CONNECTORS TAB
  // ═══════════════════════════════════════════════════════════
  const ConnectorsTab = () => (
    <div>
      <div style={{fontSize:11,color:"#f59e0b",background:"rgba(245,158,11,0.1)",padding:"8px 16px",borderRadius:8,marginBottom:20,border:"1px solid rgba(245,158,11,0.2)"}}>
        ⚠ Demo Mode — Connection statuses are simulated. Real connectors would use OAuth + MCP.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {state.connectors.map(c=>(
          <div key={c.id} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontWeight:700,fontSize:16,color:"#e2e8f0"}}>{c.name}</span>
              <Badge status={c.status}/>
            </div>
            <DetailRow label="Health"><Badge status={c.health}/></DetailRow>
            <DetailRow label="Last Sync">{fmtTime(c.last_sync)}</DetailRow>
            <DetailRow label="Scopes">{c.scopes}</DetailRow>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <ActionBtn small onClick={()=>{addAudit("connector.tested",c.name);showToast(`${c.name} connection test: OK`,"success");}}>Test</ActionBtn>
              <ActionBtn small onClick={()=>{addAudit("connector.synced",c.name);showToast(`${c.name} sync initiated`,"info");}}>Sync Now</ActionBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  // RUNBOOKS TAB
  // ═══════════════════════════════════════════════════════════
  const RunbooksTab = () => {
    const data = filtered(state.runbooks,["title","owner"]);
    return <div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search runbooks..."/>
        <ActionBtn variant="primary" onClick={()=>showToast("Runbook builder coming soon","info")}><I name="plus" size={13}/>New Runbook</ActionBtn>
      </div>
      <DataTable columns={[
        {key:"title",label:"Runbook",render:v=><span style={{fontWeight:600}}>{v}</span>},
        {key:"owner",label:"Owner"},
        {key:"trigger_conditions",label:"Trigger"},
        {key:"updated",label:"Updated",render:v=>fmtTime(v)},
      ]} data={data} onRowClick={r=>setDrawerData({type:"runbook",data:r})}/>
    </div>;
  };

  // ═══════════════════════════════════════════════════════════
  // DRAWERS
  // ═══════════════════════════════════════════════════════════
  const renderDrawer = () => {
    if(!drawerData) return null;
    const {type,data:d} = drawerData;
    const close = ()=>setDrawerData(null);

    if(type==="agent") return <Drawer open title={`Agent: ${d.name}`} onClose={close}>
      <DetailRow label="Status"><Badge status={d.status}/></DetailRow>
      <DetailRow label="Model">{d.model}</DetailRow>
      <DetailRow label="Environment">{d.env}</DetailRow>
      <DetailRow label="Runs Today">{d.runs_today}</DetailRow>
      <DetailRow label="Tokens Today">{d.tokens_today.toLocaleString()}</DetailRow>
      <DetailRow label="Avg Latency">{d.avg_latency_ms}ms</DetailRow>
      <DetailRow label="Error Rate">{(d.error_rate*100).toFixed(1)}%</DetailRow>
      <DetailRow label="Created">{fmtTime(d.created)}</DetailRow>
      <DetailRow label="Description">{d.description}</DetailRow>
      <div style={{marginTop:20,display:"flex",gap:8}}>
        {d.status!=="disabled"&&<ActionBtn variant="danger" onClick={()=>{close();doConfirm("Disable Agent",<div><DetailRow label="Agent">{d.name}</DetailRow><DetailRow label="Before">Status: {d.status}</DetailRow><DetailRow label="After">Status: disabled</DetailRow><DetailRow label="Impact">All scheduled runs will be paused</DetailRow></div>,()=>{
          setState(s=>({...s,agents:s.agents.map(a=>a.id===d.id?{...a,status:"disabled"}:a)}));
          addAudit("agent.disabled",d.name);showToast(`${d.name} disabled`,"success");
        },true);}}>Disable Agent</ActionBtn>}
        <ActionBtn onClick={()=>{close();showToast(`Running ${d.name}...`,"info");addAudit("agent.run",d.name);}}>Run Now</ActionBtn>
      </div>
      <div style={{marginTop:24}}>
        <SectionHeader>Recent Runs</SectionHeader>
        {state.agent_runs.filter(r=>r.agent_id===d.id).slice(0,5).map(r=><div key={r.id} style={{padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:12,display:"flex",gap:12,alignItems:"center"}}>
          <Badge status={r.status}/><span style={{color:"#94a3b8"}}>{r.tokens} tok</span><span style={{color:"#64748b"}}>{fmtTime(r.timestamp)}</span>
        </div>)}
      </div>
    </Drawer>;

    if(type==="deploy") return <Drawer open title={`Deploy: ${d.service} ${d.version}`} onClose={close}>
      <DetailRow label="Service">{d.service}</DetailRow>
      <DetailRow label="Version">{d.version}</DetailRow>
      <DetailRow label="Environment">{d.env}</DetailRow>
      <DetailRow label="Status"><Badge status={d.status}/></DetailRow>
      <DetailRow label="Deployed By">{d.deployed_by}</DetailRow>
      <DetailRow label="Timestamp">{fmtTime(d.timestamp)}</DetailRow>
      <DetailRow label="Commit"><code style={{fontSize:11,color:"#c4b5fd"}}>{d.commit}</code></DetailRow>
      <DetailRow label="Notes">{d.notes}</DetailRow>
    </Drawer>;

    if(type==="backlog") return <Drawer open title={d.feature} onClose={close}>
      <DetailRow label="WSJF Score"><span style={{color:"#c4b5fd",fontWeight:700,fontSize:20}}>{d.wsjf}</span></DetailRow>
      <DetailRow label="Status"><Badge status={d.status}/></DetailRow>
      <DetailRow label="BV / TC / RR">{d.bv} / {d.tc} / {d.rr_oe}</DetailRow>
      <DetailRow label="Job Size">{d.job_size}</DetailRow>
      <DetailRow label="Description">{d.description}</DetailRow>
      <DetailRow label="Risks">{d.risks}</DetailRow>
      <DetailRow label="Dependencies">{d.dependencies}</DetailRow>
      <div style={{marginTop:12}}><strong style={{color:"#94a3b8",fontSize:12}}>Acceptance Criteria:</strong>
        {d.acceptance_criteria.map((c,i)=><div key={i} style={{padding:"4px 0",fontSize:12,color:"#cbd5e1"}}>✓ {c}</div>)}
      </div>
      <div style={{marginTop:16}}><ActionBtn variant="primary" onClick={()=>{close();addAudit("backlog.converted",d.feature,"Converted to task");showToast(`"${d.feature}" converted to task`,"success");}}>Convert to Task</ActionBtn></div>
    </Drawer>;

    if(type==="incident") return <Drawer open title={`${d.severity}: ${d.title}`} onClose={close} width={540}>
      <DetailRow label="Severity"><Badge status={d.severity}/></DetailRow>
      <DetailRow label="Status"><Badge status={d.status}/></DetailRow>
      <DetailRow label="System">{d.system}</DetailRow>
      <DetailRow label="Environment">{d.env}</DetailRow>
      <DetailRow label="Created">{fmtTime(d.created)}</DetailRow>
      <div style={{marginTop:16}}><strong style={{color:"#94a3b8",fontSize:12}}>Timeline:</strong>
        {d.timeline.map((t,i)=><div key={i} style={{padding:"6px 0 6px 16px",borderLeft:"2px solid rgba(139,92,246,0.3)",marginTop:8,fontSize:12}}>
          <div style={{color:"#64748b"}}>{fmtTime(t.ts)}</div><div style={{color:"#e2e8f0"}}>{t.note}</div>
        </div>)}
      </div>
      <div style={{marginTop:16}}><strong style={{color:"#94a3b8",fontSize:12}}>Action Items:</strong>
        {d.action_items.map((a,i)=><div key={i} style={{padding:"4px 0",fontSize:12,color:"#cbd5e1"}}>• {a}</div>)}
      </div>
      {d.postmortem&&<div style={{marginTop:16,background:"rgba(255,255,255,0.02)",borderRadius:8,padding:16,border:"1px solid rgba(255,255,255,0.06)"}}>
        <strong style={{color:"#c4b5fd",fontSize:12}}>Postmortem</strong>
        <DetailRow label="Impact">{d.postmortem.impact}</DetailRow>
        <DetailRow label="Root Cause">{d.postmortem.root_cause}</DetailRow>
        <DetailRow label="Fixes Shipped">{d.postmortem.fixes_shipped.join(", ")}</DetailRow>
        <DetailRow label="Follow-ups">{d.postmortem.follow_ups.join(", ")}</DetailRow>
      </div>}
      {d.status!=="resolved"&&<div style={{marginTop:16}}><ActionBtn variant="success" onClick={()=>{close();doConfirm("Resolve Incident",<div><DetailRow label="Incident">{d.title}</DetailRow><DetailRow label="Before">Status: {d.status}</DetailRow><DetailRow label="After">Status: resolved</DetailRow></div>,()=>{
        setState(s=>({...s,incidents:s.incidents.map(i=>i.id===d.id?{...i,status:"resolved",updated:new Date().toISOString()}:i)}));
        addAudit("incident.resolved",d.title);showToast("Incident resolved","success");
      });}}>Resolve</ActionBtn></div>}
    </Drawer>;

    if(type==="prompt") return <Drawer open title={`Prompt: ${d.name}`} onClose={close} width={560}>
      <DetailRow label="Purpose">{d.purpose}</DetailRow>
      <DetailRow label="Model">{d.model_target}</DetailRow>
      <DetailRow label="Version">v{d.version}</DetailRow>
      <DetailRow label="Status"><Badge status={d.status}/></DetailRow>
      <DetailRow label="Last Updated">{fmtTime(d.last_updated)}</DetailRow>
      <div style={{marginTop:20}}><SectionHeader>Version History</SectionHeader>
        {d.versions.map((v,i)=><div key={i} style={{background:"rgba(255,255,255,0.02)",borderRadius:8,padding:12,marginBottom:8,border:"1px solid rgba(255,255,255,0.04)"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontWeight:600,color:"#c4b5fd",fontSize:12}}>v{v.v}</span>
            <span style={{fontSize:11,color:"#64748b"}}>{fmtTime(v.date)}</span>
          </div>
          <div style={{fontSize:12,color:"#cbd5e1",fontFamily:"monospace",background:"rgba(0,0,0,0.2)",padding:8,borderRadius:4}}>{v.content}</div>
        </div>)}
        {d.versions.length>=2&&<div style={{marginTop:12}}>
          <strong style={{fontSize:12,color:"#94a3b8"}}>Diff (v{d.versions[0].v} → v{d.versions[1].v}):</strong>
          <div style={{fontSize:12,fontFamily:"monospace",marginTop:8}}>
            <div style={{color:"#ef4444",background:"rgba(239,68,68,0.05)",padding:"4px 8px",borderRadius:4}}>- {d.versions[0].content.slice(0,80)}...</div>
            <div style={{color:"#22c55e",background:"rgba(34,197,94,0.05)",padding:"4px 8px",borderRadius:4,marginTop:4}}>+ {d.versions[1].content.slice(0,80)}...</div>
          </div>
        </div>}
      </div>
    </Drawer>;

    if(type==="experiment") return <Drawer open title="Experiment Detail" onClose={close}>
      <DetailRow label="Hypothesis">{d.hypothesis}</DetailRow>
      <DetailRow label="Metric">{d.metric}</DetailRow>
      <DetailRow label="Status"><Badge status={d.status}/></DetailRow>
      <DetailRow label="Uplift"><span style={{color:d.uplift>0?"#22c55e":"#ef4444",fontWeight:700}}>{d.uplift>0?"+":""}{d.uplift}%</span></DetailRow>
      <DetailRow label="Confidence">{d.confidence}</DetailRow>
      <DetailRow label="Decision"><Badge status={d.decision}/></DetailRow>
      <DetailRow label="Results">{d.results}</DetailRow>
      <DetailRow label="Started">{fmtTime(d.start)}</DetailRow>
      <DetailRow label="Ended">{fmtTime(d.end)}</DetailRow>
    </Drawer>;

    if(type==="sop") return <Drawer open title={d.title} onClose={close} width={520}>
      <DetailRow label="System">{d.system}</DetailRow>
      <DetailRow label="Severity">{d.severity_applicability}</DetailRow>
      <DetailRow label="Est. Time">{d.estimated_time}</DetailRow>
      <DetailRow label="Prerequisites">{d.prerequisites}</DetailRow>
      <DetailRow label="Owner">{d.owner}</DetailRow>
      <DetailRow label="Tags">{d.tags.map(t=><Badge key={t} status="active" label={t}/>)}</DetailRow>
      <div style={{marginTop:20}}><SectionHeader>Steps</SectionHeader>
        {d.steps.map((s,i)=><div key={i} style={{padding:"10px 0 10px 20px",borderLeft:"2px solid rgba(139,92,246,0.3)",marginBottom:4,fontSize:13,color:"#e2e8f0"}}>
          <span style={{color:"#8b5cf6",fontWeight:700,marginRight:8}}>{i+1}.</span>{s}
        </div>)}
      </div>
    </Drawer>;

    if(type==="runbook") return <Drawer open title={`Runbook: ${d.title}`} onClose={close} width={540}>
      <DetailRow label="Owner">{d.owner}</DetailRow>
      <DetailRow label="Escalation">{d.escalation_path}</DetailRow>
      <DetailRow label="Linked Systems">{d.linked_systems.join(", ")}</DetailRow>
      <DetailRow label="Updated">{fmtTime(d.updated)}</DetailRow>
      {[{label:"Trigger Conditions",val:d.trigger_conditions},{label:"Immediate Checks",val:d.immediate_checks},{label:"Mitigation Steps",val:d.mitigation_steps},{label:"Rollback Steps",val:d.rollback_steps},{label:"Verification Steps",val:d.verification_steps}].map(({label:l,val})=>
        <div key={l} style={{marginTop:16}}>
          <strong style={{fontSize:12,color:"#94a3b8"}}>{l}</strong>
          {Array.isArray(val)?val.map((s,i)=><div key={i} style={{padding:"6px 0 6px 16px",borderLeft:"2px solid rgba(139,92,246,0.2)",fontSize:12,color:"#cbd5e1",marginTop:4}}>{i+1}. {s}</div>)
          :<div style={{padding:"8px 0",fontSize:13,color:"#e2e8f0"}}>{val}</div>}
        </div>
      )}
    </Drawer>;

    if(type==="suggestions") return <Drawer open title="Suggested Experiments" onClose={close}>
      {d.map((s,i)=><div key={i} style={{background:"rgba(139,92,246,0.06)",borderRadius:8,padding:16,marginBottom:12,border:"1px solid rgba(139,92,246,0.15)"}}>
        <div style={{fontWeight:600,color:"#c4b5fd",marginBottom:4}}>Suggestion {i+1}</div>
        <div style={{fontSize:13,color:"#e2e8f0"}}>{s}</div>
      </div>)}
    </Drawer>;

    return null;
  };

  // ═══════════════════════════════════════════════════════════
  // INFO PANELS
  // ═══════════════════════════════════════════════════════════
  const InfoPanel = () => {
    if(!infoPanel) return null;
    return <Drawer open title={infoPanel==="help"?"How to Use":"Dev Notes"} onClose={()=>setInfoPanel(null)} width={460}>
      {infoPanel==="help"?<div style={{fontSize:13,color:"#cbd5e1",lineHeight:1.8}}>
        <p><strong style={{color:"#c4b5fd"}}>Navigation:</strong> Use the sidebar to switch between 16 tabs. Collapse it on mobile with the menu button.</p>
        <p><strong style={{color:"#c4b5fd"}}>Environment Filter:</strong> Use the top-bar dropdown to scope all data to dev, stage, or prod.</p>
        <p><strong style={{color:"#c4b5fd"}}>Search:</strong> The global search bar filters the current tab's data with debounced queries.</p>
        <p><strong style={{color:"#c4b5fd"}}>Tables:</strong> Click any column header to sort. Click any row to open a detail drawer.</p>
        <p><strong style={{color:"#c4b5fd"}}>Actions:</strong> All write operations show a dry-run preview before confirming. Look for purple "Confirm" buttons.</p>
        <p><strong style={{color:"#c4b5fd"}}>WSJF Backlog:</strong> Inline-edit BV, TC, RR/OE, and Job Size. WSJF auto-computes and re-sorts.</p>
        <p><strong style={{color:"#c4b5fd"}}>Audit Trail:</strong> Every action auto-appends to the Audit Log tab.</p>
        <p><strong style={{color:"#c4b5fd"}}>Keyboard:</strong> Tab to navigate, Enter to open, Escape to close drawers and modals.</p>
        <p><strong style={{color:"#c4b5fd"}}>Accessibility:</strong> Toggle reduced motion in the top bar. All status badges use text labels, not color-only.</p>
        <p><strong style={{color:"#c4b5fd"}}>Demo Data:</strong> All data is seeded for demonstration. Replace with real APIs in production.</p>
      </div>:<div style={{fontSize:13,color:"#cbd5e1",lineHeight:1.8}}>
        <p><strong style={{color:"#c4b5fd"}}>State Schema:</strong></p>
        <pre style={{fontSize:11,color:"#94a3b8",background:"rgba(0,0,0,0.3)",padding:12,borderRadius:8,overflow:"auto"}}>{`{
  agents: Agent[10],         // id, name, model, env, status, runs, tokens, error_rate
  agent_runs: Run[40],       // id, agent_id, status, tokens, latency_ms, timestamp
  deployments: Deploy[15],   // id, service, version, env, status, deployed_by
  usage_daily: Usage[45],    // date, tokens, cost, requests, errors, model_breakdown
  backlog: BacklogItem[25],  // id, feature, bv, tc, rr_oe, job_size, wsjf (computed)
  audit_log: AuditEntry[],   // id, action, actor, target, env, timestamp (append-only)
  incidents: Incident[12],   // id, title, severity, system, env, status, timeline, postmortem
  secrets: Secret[20],       // id, name, system, last_rotated, next_due, owner, status
  prompts: Prompt[20],       // id, name, purpose, model, version, status, versions[]
  experiments: Exp[15],      // id, hypothesis, metric, status, uplift, confidence, decision
  sops: SOP[25],             // id, title, system, tags, steps, owner, confidence
  notifications: Notif[30],  // id, type, severity, title, env, acknowledged, snoozed
  budgets: Budget[3],        // id, period, threshold, current
  policies: Policy[12],      // id, name, category, status, remediation
  connectors: Connector[6],  // id, name, status, last_sync, scopes, health
  runbooks: Runbook[12]      // id, title, trigger, checks, mitigation, rollback, verify
}`}</pre>
        <p style={{marginTop:16}}><strong style={{color:"#c4b5fd"}}>Extension Hooks:</strong></p>
        <pre style={{fontSize:11,color:"#94a3b8",background:"rgba(0,0,0,0.3)",padding:12,borderRadius:8,overflow:"auto"}}>{`// Replace demo data:
// 1. Swap INIT constant with API fetch in useEffect
// 2. Replace setState calls with API mutations + optimistic updates
// 3. Replace addAudit with POST /api/audit-log

// Add real-time:
// 1. Add WebSocket/SSE connection in useEffect
// 2. Merge incoming events into state
// 3. Add connection status indicator

// Auth integration:
// 1. Wrap with AuthProvider
// 2. Replace "kyle" actor with session user
// 3. Add role-based action visibility

// Persistence:
// 1. Supabase: agents, deployments, incidents tables
// 2. RLS policies per tenant/environment
// 3. Audit log as append-only table with created_at index`}</pre>
      </div>}
    </Drawer>;
  };

  // ═══════════════════════════════════════════════════════════
  // TAB ROUTING
  // ═══════════════════════════════════════════════════════════
  const renderTab = () => {
    switch(tab) {
      case "overview": return <OverviewTab/>;
      case "agents": return <AgentsTab/>;
      case "deployments": return <DeploymentsTab/>;
      case "usage": return <UsageTab/>;
      case "backlog": return <BacklogTab/>;
      case "audit": return <AuditTab/>;
      case "incidents": return <IncidentsTab/>;
      case "secrets": return <SecretsTab/>;
      case "prompts": return <PromptsTab/>;
      case "experiments": return <ExperimentsTab/>;
      case "sops": return <SOPTab/>;
      case "notifications": return <NotificationsTab/>;
      case "cost": return <CostTab/>;
      case "policy": return <PolicyTab/>;
      case "connectors": return <ConnectorsTab/>;
      case "runbooks": return <RunbooksTab/>;
      default: return <OverviewTab/>;
    }
  };

  // ═══════════════════════════════════════════════════════════
  // LAYOUT
  // ═══════════════════════════════════════════════════════════
  const animStyle = reducedMotion ? "" : `
    @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: none; opacity: 1; } }
    @keyframes slideRight { from { transform: translateX(100%); } to { transform: none; } }
  `;

  return (
    <div style={{display:"flex",height:"100vh",background:"#0a0e1a",color:"#e2e8f0",fontFamily:"'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",overflow:"hidden"}}>
      <style>{`
        ${animStyle}
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, [tabindex]:focus-visible {
          outline: 2px solid #8b5cf6; outline-offset: 2px;
        }
        select option { background: #1e293b; color: #e2e8f0; }
        input[type="number"]::-webkit-inner-spin-button { opacity: 0.5; }
      `}</style>

      {/* SIDEBAR */}
      {sidebarOpen && <nav style={{width:200,background:"rgba(255,255,255,0.02)",borderRight:"1px solid rgba(255,255,255,0.06)",display:"flex",flexDirection:"column",flexShrink:0,overflow:"auto"}} role="navigation" aria-label="Main navigation">
        <div style={{padding:"16px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{fontSize:13,fontWeight:800,color:"#c4b5fd",letterSpacing:1}}>⬡ CMD CENTER</div>
          <div style={{fontSize:9,color:"#64748b",marginTop:2}}>Agent Ops Console v1.0</div>
        </div>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setSearch("");}}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 20px",border:"none",background:tab===t.id?"rgba(139,92,246,0.12)":"transparent",color:tab===t.id?"#c4b5fd":"#94a3b8",cursor:"pointer",fontSize:12,fontWeight:tab===t.id?700:400,textAlign:"left",borderLeft:tab===t.id?"3px solid #8b5cf6":"3px solid transparent",fontFamily:"inherit"}}
            aria-current={tab===t.id?"page":undefined}>
            <I name={t.icon} size={14} color={tab===t.id?"#8b5cf6":"#64748b"}/>
            <span>{t.label}</span>
            {t.id==="notifications"&&unacked>0&&<span style={{marginLeft:"auto",background:"#ef4444",color:"white",borderRadius:8,padding:"1px 6px",fontSize:10,fontWeight:700}}>{unacked}</span>}
          </button>
        ))}
        <div style={{marginTop:"auto",padding:12,borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:4}}>
          <ActionBtn small onClick={()=>setInfoPanel("help")}><I name="help" size={12}/>Help</ActionBtn>
          <ActionBtn small onClick={()=>setInfoPanel("dev")}><I name="settings" size={12}/>Dev</ActionBtn>
        </div>
      </nav>}

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* TOP BAR */}
        <header style={{padding:"10px 20px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:12,flexShrink:0,background:"rgba(255,255,255,0.01)"}} role="banner">
          <button onClick={()=>setSidebarOpen(s=>!s)} style={{background:"none",border:"none",color:"#94a3b8",cursor:"pointer",padding:4}} aria-label="Toggle sidebar"><I name="menu" size={18}/></button>
          <select value={env} onChange={e=>setEnv(e.target.value)} aria-label="Environment filter"
            style={{padding:"6px 10px",borderRadius:6,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#e2e8f0",fontSize:12,cursor:"pointer"}}>
            <option value="all">All Envs</option>
            {ENVS.map(e=><option key={e} value={e}>{e}</option>)}
          </select>
          <SearchBar value={search} onChange={setSearch} placeholder={`Search ${TABS.find(t=>t.id===tab)?.label||""}...`}/>
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:12}}>
            <label style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"#64748b",cursor:"pointer"}}>
              <input type="checkbox" checked={reducedMotion} onChange={e=>setReducedMotion(e.target.checked)} style={{accentColor:"#8b5cf6"}}/>
              Reduced motion
            </label>
            <span style={{fontSize:10,color:"#475569"}}>Updated {lastRefresh}</span>
            <Badge status={healthPill} label={`System: ${healthPill}`}/>
          </div>
        </header>

        {/* CONTENT */}
        <main style={{flex:1,overflow:"auto",padding:24}} role="main" aria-label={TABS.find(t=>t.id===tab)?.label}>
          <div style={{maxWidth:1400,margin:"0 auto"}}>
            <h2 style={{margin:"0 0 20px",fontSize:20,fontWeight:700,color:"#f1f5f9",display:"flex",alignItems:"center",gap:10}}>
              <I name={TABS.find(t=>t.id===tab)?.icon||"dashboard"} size={22} color="#8b5cf6"/>
              {TABS.find(t=>t.id===tab)?.label||"Overview"}
              <span style={{fontSize:10,color:"#64748b",fontWeight:400,background:"rgba(245,158,11,0.1)",padding:"2px 8px",borderRadius:4,border:"1px solid rgba(245,158,11,0.2)"}}>Demo Data</span>
            </h2>
            {renderTab()}
          </div>
        </main>
      </div>

      {/* OVERLAYS */}
      {renderDrawer()}
      <InfoPanel/>
      {confirm&&<ConfirmDialog open {...confirm}/>}
      {toast&&<Toast {...toast} onClose={()=>setToast(null)}/>}
    </div>
  );
}
