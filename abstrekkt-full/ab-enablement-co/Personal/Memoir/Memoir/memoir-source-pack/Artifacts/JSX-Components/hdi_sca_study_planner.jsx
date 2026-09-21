// HDI-SCA Study Planner — v4.3.0
// v4.0.0: Full rebuild from v3 audit — Anthropic API, HDI navy/orange brand, SVG gauge,
//          window.storage persistence, three-persona UX, dynamic Tailwind bugs removed.
// v4.1.0: Real HDI logo img, course unit mapping, 5 invisible-text bugs fixed,
//          domain weight bar upgraded, manager cert badge.
// v4.2.0: 4-tab layout — Flashcards, Mock Exam (65Q timed), Quick Reference, quiz history.
// v4.3.0: FC_CARDS expanded 42→88 cards from HDI Standard v5.3 activities + metrics xlsx.
//          Per-domain quiz and mock exam prompts enriched with activity IDs.
// v4.4.0: 15 additional metric cards (89-103). 5th tab: Study Guide with 10-Q reveal quiz
//          from official answer key + 5 essay prompts with AI outline generator.
//
// SMOKE TEST: Load → sliders at defaults → score shows ~73.3% → adjust
// Process & Procedures to 18h → score climbs toward 80% → Analyze Plan
// returns coach feedback → Quiz generates a question → answer reveals
// explanation → Manager view shows ROI numbers → Export copies JSON to clipboard.

import React, { useState, useMemo, useEffect, useCallback } from 'react';

// ── DOMAIN CONFIG (HDI-SCA Certification Standard) ──────────────────────
// Source: thinkhdi.com — 65 questions, 75 min, 80% to pass
// Unit mapping from official HDI-SCA course outline (thinkhdi.com)
const DOMAINS = [
  { id: 'proc', name: 'Process & Procedures', weight: 45, color: '#F5841F',
    units: ['U3: Service Management Processes', 'U7: Troubleshooting & Incident Mgmt'] },
  { id: 'res',  name: 'Resources',            weight: 20, color: '#3B82F6',
    units: ['U4: Tools, Technology & Delivery', 'U6: Communication Essentials'] },
  { id: 'lead', name: 'Leadership',           weight: 10, color: '#60A5FA',
    units: ['U8: Customer Management Skills'] },
  { id: 'pol',  name: 'Policy & Strategy',    weight: 10, color: '#818CF8',
    units: ['U2: Structural Framework of Service & Support'] },
  { id: 'peop', name: 'People Management',    weight: 10, color: '#A78BFA',
    units: ['U1: Role of the Support Center Analyst', 'U9: Personal & Professional Dev'] },
  { id: 'perf', name: 'Performance Results',  weight:  5, color: '#64748B',
    units: ['U5: Understanding Metrics'] },
];

const DEFAULT_ALLOC = { proc: 18, res: 8, lead: 4, pol: 4, peop: 4, perf: 2 };
const DEFAULT_HRS   = 40;
const PASS_SCORE    = 80;
const STORAGE_KEY   = 'hdi-sca-v4';
const HIST_KEY      = 'hdi-sca-exam-hist';

// ── MOCK EXAM QUESTION DISTRIBUTION (domain-weighted) ────────────────────
const MOCK_DIST = {
  quick: { total: 15, secs: 20 * 60, dist: { proc:7, res:3, lead:2, pol:1, peop:1, perf:1 } },
  full:  { total: 65, secs: 75 * 60, dist: { proc:28, res:13, lead:7, pol:7, peop:7, perf:3 } },
};

// ── FLASHCARD DECK (88 cards, sourced from HDI Support Center Standard v5.3) ─
// actId = HDI Standard activity reference. d = SCA exam domain.
const FC_CARDS = [

  // ═══ PROCESS & PROCEDURES (45% of exam) ════════════════════════════════
  { id:1,  d:'proc', actId:'5.06', term:'Incident Management',
    def:'Responds to unplanned interruptions with the objective of restoring service ASAP. L1: documented process with defined owner. L4: support center actively involved in continual improvement reviews.' },
  { id:2,  d:'proc', actId:null, term:'Incident (definition)',
    def:'An unplanned interruption to or reduction in quality of an IT service. Goal: restore service ASAP — root cause is NOT required for closure. Distinguishes incident from problem management.' },
  { id:3,  d:'proc', actId:'5.13', term:'Problem Management',
    def:'Prevents incident recurrence or reduces impact by identifying root cause and transferring known errors. L4: support center actively participates in proactive problem management activities.' },
  { id:4,  d:'proc', actId:null, term:'Problem (definition)',
    def:'The root cause of one or more incidents. Problem mgmt finds root cause; incident mgmt restores service. These run as separate concurrent processes — not sequential.' },
  { id:5,  d:'proc', actId:null, term:'Known Error',
    def:'A problem with an identified root cause and a documented workaround. Stored in the Known Error Database (KEDB). Enables faster incident resolution without full problem resolution.' },
  { id:6,  d:'proc', actId:null, term:'Workaround',
    def:'A temporary fix that reduces or eliminates the impact of an incident or problem without resolving the root cause. Documents into the KEDB as part of Problem Management.' },
  { id:7,  d:'proc', actId:'5.05', term:'Request Fulfillment',
    def:'Handling and fulfillment of service requests — the formal channel for standard changes and information requests. L4: procedures regularly reviewed for continual improvement.' },
  { id:8,  d:'proc', actId:null, term:'Incident vs. Service Request',
    def:'Incident = unplanned disruption (restore it). Service Request = standard user request (fulfill it). Different workflows, different SLAs, different ownership chains.' },
  { id:9,  d:'proc', actId:'5.08', term:'Prioritization of Incidents/Requests',
    def:'Assigns priority levels based on business impact and urgency. L1: documented priority schema exists. L4: procedures for assigning and changing priority regularly reviewed.' },
  { id:10, d:'proc', actId:null, term:'Priority = Impact x Urgency',
    def:'Impact = the effect on the business (how many people/functions affected). Urgency = how fast resolution is required. Priority determines the order in which incidents are addressed.' },
  { id:11, d:'proc', actId:'5.10', term:'Escalation of Incidents/Requests',
    def:'Defines parameters for functional and hierarchical escalation within and outside the support center. L4: procedures regularly reviewed for continual improvement.' },
  { id:12, d:'proc', actId:null, term:'Functional Escalation',
    def:'Transfer to a higher tier based on skill or knowledge requirements. Driven by technical complexity. Analyst lacks access, tools, or expertise to resolve at current tier.' },
  { id:13, d:'proc', actId:null, term:'Hierarchical Escalation',
    def:'Transfer based on authority, SLA breach risk, or business urgency. Bypasses technical tier structure. Triggered by policy violations, SLA risk, or political urgency — not technical complexity.' },
  { id:14, d:'proc', actId:null, term:'Total Contact Ownership (TCO)',
    def:'Analyst takes end-to-end responsibility for a contact — even after escalation — until the customer confirms satisfaction. Prevents "lost in escalation" failures.' },
  { id:15, d:'proc', actId:'5.07', term:'Categorization of Incidents/Requests',
    def:'Assigns category types based on customer descriptions of affected or requested services. L4: procedures for categorization regularly reviewed. Accurate categorization enables trend analysis.' },
  { id:16, d:'proc', actId:'5.12', term:'Closure of Incidents',
    def:'Ensures customers agree to closure before incidents are finalized. L4: procedures regularly reviewed. Customer confirmation is required — not unilateral analyst closure.' },
  { id:17, d:'proc', actId:'5.125', term:'Reopening of Incidents',
    def:'Procedures for reopening incidents not satisfactorily resolved. L4: procedures regularly reviewed. Reopening rate is tracked as a quality metric — high rates indicate poor first-pass resolution.' },
  { id:18, d:'proc', actId:'5.03', term:'Service Level Management',
    def:'Measures performance against customer expectations through service level targets or agreements. L1: documented SLTs exist. L4: formal SLAs established between provider and customer.' },
  { id:19, d:'proc', actId:null, term:'SLA vs. OLA vs. UC',
    def:'SLA = agreement with the customer. OLA (Operational Level Agreement) = internal team agreement supporting the SLA. UC (Underpinning Contract) = external vendor agreement supporting the OLA.' },
  { id:20, d:'proc', actId:'5.14', term:'Change Management',
    def:'Manages introduction of new/changed services, tools, and processes into operation. L4: support center is authorized to HALT a change if the process is violated or stakeholders are not ready.' },
  { id:21, d:'proc', actId:'5.18', term:'Quality Assurance Management (5.18)',
    def:'Reviews quality of interactions between staff and users. L1: QA procedures in place. L4: QA results used as a performance indicator in the performance management process.' },
  { id:22, d:'proc', actId:'5.16', term:'Continual Improvement of Processes',
    def:'Involvement in identifying deficiencies and implementing updates. L1: procedures identified and documented. L4: documented process for regular reviews and timely communication of updates.' },
  { id:23, d:'proc', actId:'5.01', term:'Event Management',
    def:'Detects events impacting service delivery and identifies events likely to result in incidents. L4: support center representative actively involved in continual review of event management procedures.' },
  { id:24, d:'proc', actId:'5.15', term:'Service Asset and Configuration Management',
    def:'Provides reliable information about assets that support services. L4: configuration data actively used by support center to facilitate request and incident resolution — not just stored.' },
  { id:25, d:'proc', actId:'5.17', term:'Service Continuity Management',
    def:'Regularly maintained plans for managing interruptions to normal operations. L4: continuity plan regularly updated and periodic tests conducted — untested plans are not maturity L4.' },
  { id:26, d:'proc', actId:'5.065', term:'Logging of Incidents/Requests',
    def:'Documented procedures for recording incidents and requests prior to escalation or resolution. L4: procedures regularly reviewed. Every contact must be logged — no off-the-record resolutions.' },
  { id:27, d:'proc', actId:'5.095', term:'Initial Investigation and Diagnosis',
    def:'Procedures for initial troubleshooting and recording of diagnosis activities. L4: procedures regularly reviewed. Documentation enables handoff without information loss.' },
  { id:28, d:'proc', actId:'5.09', term:'Status Levels of Incidents/Requests',
    def:'Defines and communicates the status of incidents throughout their lifecycle. L4: procedures for updating, changing, and communicating status levels regularly reviewed.' },
  { id:29, d:'proc', actId:null, term:'Full Incident Lifecycle',
    def:'Detection to Logging to Categorization to Prioritization to Initial Diagnosis to Escalation (if needed) to Resolution to Closure. L4 = accurate categorization and customer confirmation at every stage.' },
  { id:30, d:'proc', actId:'5.11', term:'Resolution of Incidents',
    def:'Procedures for resolving incidents and notifying customers upon completion. L4: procedures regularly reviewed. Resolution includes customer notification — not just the technical fix.' },
  { id:31, d:'proc', actId:null, term:'RACI Matrix',
    def:'Responsible / Accountable / Consulted / Informed. Only ONE person should be Accountable per task. Clarifies process ownership. Key tool for procedure documentation and governance.' },

  // === RESOURCES (20% of exam) =============================================
  { id:32, d:'res',  actId:'4.07', term:'Service Management Tool/System',
    def:'Tracks and facilitates handling of all incidents/requests. L1: automated system implemented. L4: system proactively notifies customers of status changes AND management of SLA breach risk.' },
  { id:33, d:'res',  actId:'4.09', term:'Knowledge Management Tool/System',
    def:'Captures, structures, and shares knowledge across the organization. L1: searchable repository in place. L4: integrated with self-service to benefit users and customers directly.' },
  { id:34, d:'res',  actId:'4.10', term:'Knowledge Resources',
    def:'Knowledge captured as an asset for reuse. L1: content used by support staff. L4: OWNERSHIP of knowledge content shared among support center staff and primary support groups.' },
  { id:35, d:'res',  actId:'4.08', term:'Remote Support Tools',
    def:'Tools to remotely view and control components. L1: tool enables remote view of workstations. L4: use of remote support tools tracked in incident records and reported to management.' },
  { id:36, d:'res',  actId:'4.11', term:'Reporting Tool/System',
    def:'Compiles data into performance results reports. L1: reporting tools in place. L4: analytic tools that FORECAST and PREDICT outcomes and impact of changes are available and used.' },
  { id:37, d:'res',  actId:'4.06', term:'Workforce Management Tool/System',
    def:'Automates workforce management for staffing and scheduling. L1: uses volume and work time to determine staffing. L4: integrated with other support center tools to automate scheduling.' },
  { id:38, d:'res',  actId:'4.03', term:'Infrastructure',
    def:'Ensures availability, capacity, and reliability of technology critical to operations. L4: support center regularly participates in identification, review, and continual improvement of tech infrastructure.' },
  { id:39, d:'res',  actId:'4.04', term:'Incoming Contact Distribution System',
    def:'Distributes incoming contacts across all channels in a timely manner. L4: distribution system(s) integrated with the service management system — unified routing across all channels.' },
  { id:40, d:'res',  actId:null, term:'KCS (Knowledge-Centered Service)',
    def:'Integrates knowledge creation INTO the support workflow. Capture knowledge as a by-product of solving — not a separate task. Enables faster resolution and reduces duplicated effort.' },
  { id:41, d:'res',  actId:null, term:'Service Catalog',
    def:'Published list of IT services available to users, with descriptions and ordering instructions. Customer-facing view of what IT offers. Activity 2.06 requires it be maintained and regularly reviewed.' },
  { id:42, d:'res',  actId:null, term:'CMDB (Configuration Management Database)',
    def:'Repository of configuration items (CIs) and their relationships. Supports change, incident, and problem management with accurate asset data. Used by Service Asset & Configuration Management (5.15).' },
  { id:43, d:'res',  actId:'4.01', term:'Financial Resources',
    def:'Ensures sufficient financial resources for support center goals. L1: own budget exists. L4: appropriate funding adjustments made in a timely manner when substantial changes occur between budget cycles.' },

  // === LEADERSHIP (10% of exam) ============================================
  { id:44, d:'lead', actId:'1.01', term:'Alignment to Organization (1.010)',
    def:'Management promotes understanding of how support services link to critical organizational functions. L1: can describe 3 success factors. L4: adjusts services in response to changes in org or customer requirements.' },
  { id:45, d:'lead', actId:'1.02', term:'Integration within Support Model (1.020)',
    def:'Develops understanding of the support model (all internal and external resources that provide support). L4: support center representative actively engaged in change and release processes.' },
  { id:46, d:'lead', actId:'1.03', term:'Resource Allocation and Alignment (1.030)',
    def:'Establishes optimal allocation of people, processes, and technology. L1: methodology to determine resource needs. L4: allocations aligned to service level targets supporting established goals.' },
  { id:47, d:'lead', actId:'1.04', term:'Promoting Teamwork (1.040)',
    def:'Management actively advocates teamwork throughout the support organization. L4: results of team-based efforts successfully applied to improve processes that support the success of the support center.' },
  { id:48, d:'lead', actId:'1.05', term:'Marketing and Promotion (1.050)',
    def:'All members responsible for increasing visibility of the support center as a valued partner. L4: management participates in activities to promote support center value throughout the organization.' },
  { id:49, d:'lead', actId:'1.06', term:'Distribution and Communication of Information',
    def:'Facilitates distribution of performance information within and outside the support center. L1: operational results distributed to staff monthly. L4: progress toward strategic goals communicated to all stakeholders.' },
  { id:50, d:'lead', actId:null, term:'Active Listening',
    def:'Fully focusing, understanding, and responding to a speaker. Techniques: reflection, paraphrasing, clarifying questions, summarizing. Core skill for managing difficult customer interactions.' },
  { id:51, d:'lead', actId:null, term:'De-escalation Techniques',
    def:'Calm upset customers: acknowledge feelings first, avoid arguing, offer choices, set realistic expectations, stay calm. Emotional Intelligence (EQ) is the underlying competency.' },
  { id:52, d:'lead', actId:'8.1', term:'Emotional Intelligence (EQ) in Support',
    def:'Mastering techniques for managing the human emotional response to technical failure. L1: impulsive reactions or robotic interactions. L4: mastery of self-awareness and empathy to de-escalate conflict.' },

  // === POLICY & STRATEGY (10% of exam) =====================================
  { id:53, d:'pol',  actId:'2.01', term:'Purpose (2.010)',
    def:'Support center purpose must be established, documented, communicated, and reviewed. L1: staff can articulate the purpose. L4: annual review ensures alignment with org vision, mission, and objectives.' },
  { id:54, d:'pol',  actId:'2.02', term:'Goals and Objectives (2.020)',
    def:'Establishes goals that reflect the support center purpose. L1: operational goals defined and documented. L4: strategic goals aligned with organizational strategic goals and communicated to all staff.' },
  { id:55, d:'pol',  actId:'2.03', term:'Operational Plans (2.030)',
    def:'Defines activities necessary for ongoing support center operations. L1: SOPs and work instructions exist. L4: operational plan updated regularly and reviewed for continual improvement at least annually.' },
  { id:56, d:'pol',  actId:'2.04', term:'Stakeholder Engagement (2.040)',
    def:'Actively solicits and uses stakeholder input to improve services and performance. L1: stakeholders identified. L4: support center proactively provides feedback on action plan results to stakeholders.' },
  { id:57, d:'pol',  actId:'2.05', term:'Service Improvement Plans (SIPs)',
    def:'Defines focus, goals, resources, and actions for improvement opportunities. L1: management identifies improvement initiatives. L4: procedures for developing and tracking SIPs reviewed annually.' },
  { id:58, d:'pol',  actId:'2.06', term:'Support Center Services Definition',
    def:'Maintains list of services in terminology understood by staff, customers, and users. L4: services list regularly reviewed and updated as services are introduced, changed, or retired.' },
  { id:59, d:'pol',  actId:'2.07', term:'Security of Systems and Information',
    def:'Supports and complies with organizational security requirements. L1: access control procedures in place. L4: security policies independently audited OUTSIDE support center management.' },
  { id:60, d:'pol',  actId:null, term:'ITIL Framework',
    def:'IT Infrastructure Library — best practices for IT service management. Not prescriptive; guidance to adapt. Integrated into the HDI Standard. Focus: aligning IT services to business value.' },
  { id:61, d:'pol',  actId:null, term:'Mission vs. Vision',
    def:'Mission = what the support center does TODAY. Vision = what it aspires to become. Both documented in Activity 2.01 (Purpose). Mission drives day-to-day; vision drives strategy.' },

  // === PEOPLE MANAGEMENT (10% of exam) =====================================
  { id:62, d:'peop', actId:'3.01', term:'Job Descriptions',
    def:'All staff must have documented job descriptions describing role, responsibilities, and requirements. L4: jointly reviewed by management AND staff at least annually.' },
  { id:63, d:'peop', actId:'3.02', term:'Orientation Training Plans',
    def:'Documented plans supporting training period and ensuring technical, professional, and customer service skills. L4: integrated into change management processes to keep training plans current.' },
  { id:64, d:'peop', actId:'3.025', term:'Ongoing Skill Assessment and Training Plans',
    def:'Based on skills inventory and gap assessments. L1: skills inventory exists. L4: TIME (and funding if required) allotted to achieve minimum training level based on both assessment processes.' },
  { id:65, d:'peop', actId:'3.03', term:'Career Development Plans',
    def:'Fundamental to engaging and retaining staff. L1: career development discussion formally initiated annually. L4: career development planning integrated with the performance appraisal process.' },
  { id:66, d:'peop', actId:'3.04', term:'Performance Management',
    def:'Evaluates staff through planning, coaching, mentoring, and feedback. L1: documented process conducted at least annually. L4: appraisal process integrated with the compensation review process.' },
  { id:67, d:'peop', actId:'3.05', term:'Staff Satisfaction Management',
    def:'Regularly collects staff feedback, measures trends, and responds to improve the workplace. L4: measurable satisfaction feedback collected at least twice annually and reported to management.' },
  { id:68, d:'peop', actId:'3.07', term:'Recognition and Reward Programs',
    def:'Acknowledges accomplishments and contributions, perceived as fair and achievable. L4: management analyzes the IMPACT of recognition programs and reports results at least annually.' },
  { id:69, d:'peop', actId:'3.08', term:'Workforce Management',
    def:'Forecasts and schedules the right number of staff with the right skills at the right time. L1: staffing determined using volume models. L4: process reviewed for continual improvement at least annually.' },
  { id:70, d:'peop', actId:'3.09', term:'Retention Program',
    def:'Reduces unplanned turnover and decreases loss of knowledge and talent. L4: management analyzes impact and reports results to SENIOR MANAGEMENT at least annually.' },
  { id:71, d:'peop', actId:null, term:'Emotional Intelligence — Four Components',
    def:'Self-awareness, self-management, social awareness, relationship management. Core HDI-SCA analyst competency. High EQ enables de-escalation, empathy, and consistent customer satisfaction.' },

  // === PERFORMANCE RESULTS (5% of exam) ====================================
  { id:72, d:'perf', actId:'8.050', term:'First Contact Resolution (FCR)',
    def:'% of incidents resolved during initial contact. Formula: (solved on first call / total interactions) x 100. Improves efficiency and lowers operating costs. Key Tier 1 quality metric.' },
  { id:73, d:'perf', actId:null, term:'Average Handle Time (AHT)',
    def:'(talk + hold + follow-up times) / total calls. Measures efficiency and identifies bottlenecks. Must be balanced against quality — low AHT plus poor resolution = reopened incidents.' },
  { id:74, d:'perf', actId:'8.030', term:'Abandon Rate',
    def:'% of contacts terminated by user before being answered. Indicates resource inadequacy and impacts customer perception of reliability. Inversely correlated with staffing levels.' },
  { id:75, d:'perf', actId:'8.040', term:'Incident Resolution Time',
    def:'Total time from incident detection to full resolution. Directly impacts user downtime and organizational productivity. Must be balanced against FCR — fast but wrong = reopened incident.' },
  { id:76, d:'perf', actId:'8.120', term:'Cost per Unit',
    def:'Total support center cost / unit of work (e.g., per incident). Ultimate measure of financial efficiency. High FCR reduces cost per unit by handling more at first contact without escalation.' },
  { id:77, d:'perf', actId:null, term:'Mean Time to Resolution (MTTR)',
    def:'Average time to restore service after detection. Accelerates restoring service and minimizing downtime. Differs from Incident Resolution Time in that it encompasses all incidents in aggregate.' },
  { id:78, d:'perf', actId:null, term:'First Level Resolution Rate',
    def:'% of incidents resolved at Tier 1 without escalation. Reduces costs and prevents escalations to more expensive resources. High rate = effective analyst training and strong knowledge base.' },
  { id:79, d:'perf', actId:null, term:'Reopened Incidents',
    def:'Measures quality and accuracy of initial resolutions. High reopened rate = analysts closing incidents without confirming resolution. Direct indicator of first-time fix quality.' },
  { id:80, d:'perf', actId:null, term:'KPI vs. Metric',
    def:'Metric = raw measurement. KPI (Key Performance Indicator) = a metric tied to a strategic objective. Not all metrics are KPIs. KPIs answer "are we achieving goals?" — metrics answer "what is happening?"' },
  { id:81, d:'perf', actId:null, term:'4 Maturity Levels — Results',
    def:'L1: Measured (data collected). L2: Comparison to Goals (data vs targets). L3: Trending to Goals (6-month upward trend). L4: Consistently Meeting Goals (targets met in 9 of last 12 months).' },
  { id:82, d:'perf', actId:null, term:'4 Maturity Levels — Enablers',
    def:'L1: Just Started (plans beginning). L2: Some Progress (activity being performed, early wins). L3: Considerable Progress (consistent but not yet universal). L4: Fully Achieved/Optimized (universal + continual improvement baked in).' },
  { id:83, d:'perf', actId:null, term:'Enablers vs. Results',
    def:'Enablers = 5 input categories (Leadership, Strategy & Policy, People Mgmt, Resources, Process & Procedure). Results = 3 output categories (People Satisfaction, Customer Satisfaction, Performance Results).' },
  { id:84, d:'perf', actId:null, term:'Customer Satisfaction (CSAT)',
    def:'Measures overall user experience and perception of organizational value. Both periodic (surveys) and ongoing (post-contact) methods used. Leading indicator for analyst quality.' },
  { id:85, d:'perf', actId:null, term:'Staff Satisfaction — Leading Indicator',
    def:'Turnover and unplanned absence act as "canary in the coal mine" metrics. Staff satisfaction drops BEFORE customer satisfaction drops. People metrics predict service metrics.' },
  { id:86, d:'peop', actId:null, term:'Closed-Loop Communication',
    def:'Sender confirms receiver understood correctly. "So what I am hearing is... is that correct?" Prevents misdiagnosis and wrong-path troubleshooting. Critical in high-stakes support interactions.' },
  { id:87, d:'lead', actId:null, term:'Four Difficult Customer Types',
    def:'Angry (acknowledge first), Demanding (set clear expectations), Complaining (validate then redirect), Chatty (politely redirect to issue). Each needs a distinct approach — not a single script.' },
  { id:88, d:'pol',  actId:null, term:'Stakeholders (Definition)',
    def:'Individuals or groups with an interest in or affected by the support center services. Activity 2.04: stakeholder input actively solicited to improve services. Includes customers, staff, and senior management.' },
  // === ADDITIONAL METRICS (appended from HDI metrics xlsx) =================
  { id:89,  d:'res',  actId:null, term:'Article Quality Index (AQI)',
    def:'Score based on: Uniqueness, Completeness, Clarity, Title Accuracy, Link Validity, Metadata correctness. Measures accuracy and usefulness of knowledge contributed by analysts. Identifies coaching opportunities and improves self-service effectiveness.' },
  { id:90,  d:'res',  actId:null, term:'Knowledge Management Link Rate',
    def:'% of closed cases with a knowledge article linked. Formula: linked cases / total cases. Recommended range: 60-80%. Identifies operational improvements and ensures reuse of existing knowledge to minimize rework.' },
  { id:91,  d:'res',  actId:null, term:'Solution Reuse Rate',
    def:'Number and % of articles reused, showing which solutions are popular. Indicates effectiveness of the knowledge base in providing existing solutions and reducing duplication of effort.' },
  { id:92,  d:'res',  actId:null, term:'Knowledge Base Contributions',
    def:'Number of articles added per day, week, or month. Provides evidence of the overall growth and health of the knowledge management system. Low contribution rate = knowledge base stagnation.' },
  { id:93,  d:'res',  actId:null, term:'Contribution Index',
    def:'Ratio of times an article was linked, modified, or created compared to total opportunities where those actions were appropriate. A KCS metric measuring how often the "right thing" is being done.' },
  { id:94,  d:'res',  actId:null, term:'Self-Service Effectiveness',
    def:'Measures adoption: portal visits, knowledge content use, portal-initiated tickets. Evaluates self-service adoption leading to case deflection and improved customer success.' },
  { id:95,  d:'proc', actId:null, term:'Target Response vs. Target Restore',
    def:'Target Response = time from case creation to technician taking OWNERSHIP. Target Restore = time from case creation to RESOLUTION. Both are SLA commitments. Response sets the first engagement expectation; Restore defines the service recovery window.' },
  { id:96,  d:'proc', actId:null, term:'Average Time to Respond',
    def:'Average time for the support center to answer or respond to incoming contacts across all channels. Ensures responsiveness and is critical to meeting established service level targets.' },
  { id:97,  d:'proc', actId:null, term:'Backlog',
    def:'Total number or % of open incidents/requests compared to their age. Identifies bottlenecks in support processes and indicates if staffing is sufficient to keep up with demand. Aging backlog = capacity problem.' },
  { id:98,  d:'proc', actId:null, term:'Hierarchical Escalation Rate (metric)',
    def:'Number or % of items escalated to management due to resource needs, policy issues, or customer feedback. Provides visibility to policy/procedure issues and identifies resource constraints. Different from technical escalation — this is a management escalation.' },
  { id:99,  d:'proc', actId:null, term:'Functional Escalation Within Support Center',
    def:'Count of items escalated internally due to workload or lack of knowledge/skills. Identifies training opportunities and internal process bottlenecks. High rate = skill gap or knowledge base gap.' },
  { id:100, d:'proc', actId:null, term:'Functional Escalation Outside Support Center',
    def:'Count of items escalated to Tier 2/3 external groups due to lack of skills or policy requirements. Measures dependency on more expensive resources and identifies knowledge gaps that training could close.' },
  { id:101, d:'peop', actId:null, term:'Utilization',
    def:'Optimal use of support staff compared to an established goal. Necessary for successful support center performance and maximizing efficiency of human resources. Too high = burnout risk. Too low = overstaffing cost.' },
  { id:102, d:'perf', actId:null, term:'Periodic vs. Ongoing Satisfaction Measurement',
    def:'Periodic (relationship) surveys measure OVERALL satisfaction with the support center annually. Ongoing (transactional) surveys measure satisfaction with a SPECIFIC incident, collected monthly. Both are required for a comprehensive satisfaction program (Activity 5.02).' },
  { id:103, d:'perf', actId:null, term:'Mean Time to Detect (MTTD)',
    def:'Average time to identify that an incident has occurred. Dramatically reduces time to identify incidents, enabling proactive resolution before major disruptions occur. Tied to event management (Activity 5.01) and monitoring maturity.' },
];

// ── STUDY GUIDE DATA (HDI Support Center Standard Study Guide) ─────────────
// Source: HDI Support Center Standard Study Guide — quiz + essay prompts
const STUDY_GUIDE = {
  quiz: [
    { id:1,
      q: 'What is the HDI Support Center Standard, and how was it developed?',
      a: 'The Standard is an aggregate of industry best practices and methodologies representing the unique perspective of the support center. It was developed in 2000 by the HDI International Certification Standards Committee (ICSC) to serve as a basis for support center certification and service improvement.' },
    { id:2,
      q: 'Describe the organizational framework of the Standard and the source of its structure.',
      a: 'The Standard is organized into eight categories: five enablers and three results. This structure is based on the European Foundation for Quality Management (EFQM) Excellence Model, modified to meet the specific quality requirements of support centers.' },
    { id:3,
      q: 'What are the five "Enabler" categories identified in the Standard?',
      a: 'The five enablers are Leadership, Strategy and Policy, People Management, Resources, and Process and Procedure. These categories represent the foundational quality items and actionable activities that drive the maturity of the support center.' },
    { id:4,
      q: 'How do the maturity levels for Enablers differ from those for Results?',
      a: 'Enabler maturity levels track progress from initial planning (Just Started) to universal implementation (Fully Achieved/Optimized). In contrast, Results maturity levels are based on data collection and performance consistency, progressing from simple measurement to consistently meeting goals for at least nine of the previous twelve months.' },
    { id:5,
      q: 'Under the Leadership category, how is "Alignment to Organization" defined at its highest maturity level (Level 4)?',
      a: 'At Level 4, support center management proactively adjusts services in response to changes in the parent organization or customer requirements. This ensures that the support center remains a relevant and valuable partner as organizational needs evolve.' },
    { id:6,
      q: 'What is the role of "Marketing and Promotion" (Activity 1.050) within a support organization?',
      a: 'All members of the support organization are responsible for increasing the visibility of the support center as a valued partner. Management must ensure that successes are communicated to senior levels and other stakeholders to promote the center\'s overall value to the organization.' },
    { id:7,
      q: 'How does the Standard define the "Purpose" of a support center in Activity 2.010?',
      a: 'The purpose must be established, documented, and aligned with the organization\'s broader vision, mission, and objectives. It involves the development of vision and mission statements, service philosophies, and core values that are reviewed annually for continued alignment.' },
    { id:8,
      q: 'What is required for a support center to reach Maturity Level 4 in its "Operational Plans" (Activity 2.030)?',
      a: 'To reach Level 4, the support center must have a documented operational plan that is communicated to and understood by staff. This plan must be updated regularly as changes occur and must undergo a formal review for continual improvement at least once per year.' },
    { id:9,
      q: 'According to the Introduction, what are three specific benefits reported by support centers that have adopted the Standard?',
      a: 'Adopting the Standard can lead to increased service consistency, improved customer and staff satisfaction, and higher productivity. Support centers also report reduced unit costs, increased efficiency, and an improved ability to satisfy compliance requirements.' },
    { id:10,
      q: 'Who is responsible for maintaining and updating the HDI Support Center Standard?',
      a: 'The Standard is maintained by the HDI International Certification Standards Committee (ICSC). This committee consists of a panel of global industry experts and practitioners who work together to promote best practices within the support profession.' },
  ],
  essays: [
    { id:1,
      title: 'The Relationship Between Enablers and Results',
      prompt: 'Discuss how the five Enabler categories directly influence the three Results categories. Use specific examples from the Standard to explain why a support center cannot achieve high maturity in Results without first maturing its Enablers.' },
    { id:2,
      title: "Leadership's Role in Organizational Integration",
      prompt: 'Analyze the importance of Activity 1.010 (Alignment to Organization) and Activity 1.020 (Integration within Support Model). How does the Standard envision the leadership of a support center moving beyond simple management to becoming a strategic partner within the larger organization?' },
    { id:3,
      title: 'The Impact of Strategy and Policy on Daily Operations',
      prompt: 'Explore the hierarchy of Strategy and Policy as outlined in Category 2.0. Explain the progression from defining a high-level "Purpose" to the creation of "Operational Plans" and "Tactical Objectives," and discuss how this structure ensures service consistency.' },
    { id:4,
      title: 'Maturity as a Journey of Continuous Improvement',
      prompt: 'The Standard describes managing a support center as a "journey of continuous improvement." Using the four maturity levels for Enablers, describe how a support center might transition from the "Just Started" phase to "Fully Achieved/Optimized" for a specific activity, such as Resource Allocation (1.030).' },
    { id:5,
      title: 'External Framework Alignment',
      prompt: 'The HDI Support Center Standard aligns with several global standards, including ITIL, COBIT 5, and ISO/IEC 20000. Discuss the significance of this alignment and how it validates the HDI Standard as an authoritative resource for the support industry.' },
  ],
};

// ── ANTHROPIC API ────────────────────────────────────────────────────────
// Auth is handled by the artifact proxy — no key needed here.
const callAI = async (prompt, maxTokens = 512) => {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message || ''; } catch {}
    throw new Error(`API ${res.status}${detail ? `: ${detail}` : ''}`);
  }
  const data = await res.json();
  const text = data.content?.find(b => b.type === 'text')?.text;
  if (!text) throw new Error('Empty response from AI');
  return text;
};

// ── SVG ARC GAUGE ────────────────────────────────────────────────────────
// 270° sweep, start at 135° (bottom-left), end at 45° (bottom-right).
// Orange fill = passing, amber = 60-79%, red = below 60%.
// 80% tick mark shows passing threshold.
function ScoreGauge({ score, isPassing }) {
  const cx = 150, cy = 148, R = 108;
  const START = 135, SWEEP = 270;

  // SVG polar coords: 0° = 3 o'clock, clockwise
  const polar = (deg, r = R) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: +(cx + r * Math.cos(rad)).toFixed(2),
      y: +(cy + r * Math.sin(rad)).toFixed(2),
    };
  };

  // Arc path string. Handles clockwise arcs > 180° correctly.
  const arcD = (from, to, r = R) => {
    const a = polar(from, r), b = polar(to, r);
    const delta = ((to - from) + 720) % 360; // normalize to [0, 360)
    return `M ${a.x} ${a.y} A ${r} ${r} 0 ${delta > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
  };

  const n = Math.min(Math.max(parseFloat(score) || 0, 0), 100);
  // Clamp near-100% to avoid arc collapsing when start ≈ end
  const fillEndDeg = n >= 99.9 ? START + SWEEP - 0.1 : START + (n / 100) * SWEEP;
  const goalDeg = START + 0.8 * SWEEP; // 80% pass threshold

  const fillColor = isPassing ? '#F5841F' : n > 60 ? '#F59E0B' : '#EF4444';

  const goalOuter = polar(goalDeg, R + 14);
  const goalInner = polar(goalDeg, R - 14);
  const goalLabel = polar(goalDeg, R + 27);
  const startLabel = polar(START, R + 25);
  const endLabel   = polar(START + SWEEP, R + 25);

  return (
    <svg viewBox="0 0 300 268" role="img" aria-label={`Projected exam score: ${score}%`}
      style={{ width: '100%', maxWidth: '252px', display: 'block', margin: '0 auto' }}>
      {/* Background track */}
      <path d={arcD(START, START + SWEEP)} fill="none"
        stroke="rgba(255,255,255,0.07)" strokeWidth="13" strokeLinecap="round" />
      {/* Score fill */}
      {n > 0.5 && (
        <path d={arcD(START, fillEndDeg)} fill="none"
          stroke={fillColor} strokeWidth="13" strokeLinecap="round"
          style={{ transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
      )}
      {/* 80% threshold tick */}
      <line x1={goalInner.x} y1={goalInner.y} x2={goalOuter.x} y2={goalOuter.y}
        stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Labels */}
      <text x={goalLabel.x} y={goalLabel.y} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.35)" fontSize="9.5" fontFamily="Inter, sans-serif">80</text>
      <text x={startLabel.x} y={startLabel.y} textAnchor="middle"
        fill="rgba(255,255,255,0.18)" fontSize="8.5" fontFamily="Inter, sans-serif">0</text>
      <text x={endLabel.x} y={endLabel.y} textAnchor="middle"
        fill="rgba(255,255,255,0.18)" fontSize="8.5" fontFamily="Inter, sans-serif">100</text>
      {/* Score number */}
      <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="48" fontWeight="700"
        fontFamily="'Space Grotesk', sans-serif" letterSpacing="-2">
        {score}%
      </text>
      {/* Sub-label */}
      <text x={cx} y={cy + 33} textAnchor="middle"
        fill="rgba(255,255,255,0.3)" fontSize="9.5" letterSpacing="2"
        fontFamily="Inter, sans-serif">PROJECTED</text>
      {/* Pass/fail badge */}
      <rect x={cx - 46} y={cy + 45} width="92" height="19" rx="9.5"
        fill={isPassing ? 'rgba(245,132,31,0.14)' : 'rgba(239,68,68,0.14)'} />
      <text x={cx} y={cy + 54.5} textAnchor="middle" dominantBaseline="middle"
        fill={fillColor} fontSize="9.5" fontWeight="700"
        letterSpacing="0.6" fontFamily="Inter, sans-serif">
        {isPassing ? '✓ PASS READY' : '✗ BELOW 80%'}
      </text>
    </svg>
  );
}

// ── ERROR BOUNDARY ────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(e) { return { err: e.message }; }
  componentDidCatch(e, i) { console.error('[HDI-SCA] Boundary caught:', e, i); }
  render() {
    if (this.state.err) {
      return (
        <div style={{ background: '#0B1929', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '2rem', maxWidth: '360px', textAlign: 'center' }}>
            <div style={{ color: '#EF4444', fontWeight: '600', marginBottom: '0.5rem' }}>Application Error</div>
            <div style={{ color: '#94A3B8', fontSize: '0.82rem', marginBottom: '1.25rem' }}>{this.state.err}</div>
            <button onClick={() => window.location.reload()}
              style={{ background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', cursor: 'pointer', fontSize: '0.85rem' }}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── MAIN APP ──────────────────────────────────────────────────────────────
function CalculatorApp() {
  const [totalHrs, setTotalHrs]     = useState(DEFAULT_HRS);
  const [alloc, setAlloc]           = useState(DEFAULT_ALLOC);
  const [examDate, setExamDate]     = useState('');
  const [isMobile, setIsMobile]     = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);

  // AI coach
  const [coachOut, setCoachOut]       = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachErr, setCoachErr]       = useState('');

  // Quiz
  const [quizDomain, setQuizDomain]   = useState(null);   // full domain object
  const [quizData, setQuizData]       = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswer, setQuizAnswer]   = useState(null);
  const [quizErr, setQuizErr]         = useState('');

  // Tab navigation
  const [activeTab, setActiveTab]     = useState('plan'); // 'plan'|'cards'|'exam'|'ref'

  // Flashcards
  const [fcFilter, setFcFilter]       = useState(null);   // null = all, else domain id
  const [fcIdx, setFcIdx]             = useState(0);
  const [fcFlipped, setFcFlipped]     = useState(false);
  const [fcMastered, setFcMastered]   = useState(new Set());

  // Mock exam
  const [mockMode, setMockMode]       = useState(null);   // null|'quick'|'full'|'running'|'done'
  const [mockQs, setMockQs]           = useState([]);     // generated questions
  const [mockIdx, setMockIdx]         = useState(0);
  const [mockAnswers, setMockAnswers] = useState({});     // idx → answer string
  const [mockTimerSec, setMockTimerSec] = useState(0);
  const [mockLoading, setMockLoading] = useState(false);
  const [mockGenProg, setMockGenProg] = useState({ done: 0, total: 0 }); // generation progress
  const [mockGenErr, setMockGenErr]   = useState('');     // set when generation yields 0 usable questions
  const [mockReview, setMockReview]   = useState(false);  // show review after done
  const [quizHistory, setQuizHistory] = useState([]);     // [{domain, correct, ts}]

  // Quick Reference tab search
  const [refSearch, setRefSearch]     = useState('');

  // Study Guide tab
  const [sgMode, setSgMode]           = useState('quiz');  // 'quiz' | 'essays'
  const [sgQIdx, setSgQIdx]           = useState(0);
  const [sgRevealed, setSgRevealed]   = useState(new Set());
  const [sgEssayIdx, setSgEssayIdx]   = useState(0);
  const [sgEssayOut, setSgEssayOut]   = useState('');
  const [sgEssayLoading, setSgEssayLoading] = useState(false);
  const [sgEssayErr, setSgEssayErr]   = useState('');

  // ── Mount: mobile detect + load persisted state ──
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 720);
    onResize();
    window.addEventListener('resize', onResize);

    if (typeof window.storage !== 'undefined') {
      window.storage.get(STORAGE_KEY)
        .then(r => {
          if (!r?.value) return;
          try {
            const s = JSON.parse(r.value);
            if (typeof s.totalHrs === 'number') setTotalHrs(s.totalHrs);
            if (s.alloc && typeof s.alloc === 'object') setAlloc(s.alloc);
            if (typeof s.examDate === 'string') setExamDate(s.examDate);
          } catch {}
        })
        .catch(() => {}); // key doesn't exist yet — normal on first load
    }

    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Persist on change ──
  useEffect(() => {
    if (typeof window.storage === 'undefined') return;
    window.storage.set(STORAGE_KEY, JSON.stringify({ totalHrs, alloc, examDate }))
      .catch(() => {});
  }, [totalHrs, alloc, examDate]);

  // ── Load quiz history ──
  useEffect(() => {
    if (typeof window.storage === 'undefined') return;
    window.storage.get(HIST_KEY)
      .then(r => {
        if (!r?.value) return;
        try { setQuizHistory(JSON.parse(r.value)); } catch {}
      })
      .catch(() => {});
  }, []);

  // ── Mock exam countdown timer ──
  useEffect(() => {
    if (mockMode !== 'running') return;
    if (mockTimerSec <= 0) { setMockMode('done'); return; }
    const id = setInterval(() => setMockTimerSec(s => {
      if (s <= 1) { clearInterval(id); setMockMode('done'); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [mockMode, mockTimerSec]);

  // ── Score computation ──
  const results = useMemo(() => {
    let totalScore = 0;
    let totalAllocHrs = 0;

    const domains = DOMAINS.map(d => {
      const req     = (d.weight / 100) * totalHrs;
      const got     = Math.max(0, alloc[d.id] || 0);
      totalAllocHrs += got;
      // Guard: if req is 0 (totalHrs=0), treat as maxed
      const earned  = req > 0
        ? Math.min((got / req) * d.weight, d.weight)
        : d.weight;
      totalScore += earned;
      return {
        ...d,
        req: Math.max(0.1, req),
        got,
        earned,
        isMaxed:  got >= req,
        toMax:    Math.max(0, req - got),
        pct:      Math.min(got / Math.max(req, 0.1), 1),
      };
    });

    // Highest ROI gap: most points per hour remaining
    const gaps = domains
      .filter(d => !d.isMaxed && d.toMax > 0)
      .map(d => ({ ...d, roi: (d.weight - d.earned) / d.toMax }))
      .sort((a, b) => b.roi - a.roi);

    return {
      domains,
      score:        totalScore.toFixed(1),
      totalAlloc:   totalAllocHrs.toFixed(1),
      passing:      totalScore >= PASS_SCORE,
      topGap:       gaps[0] || null,
      overAllocated: totalAllocHrs > totalHrs * 1.05,
    };
  }, [alloc, totalHrs]);

  const daysLeft = useMemo(() => {
    if (!examDate) return null;
    const d = Math.ceil((new Date(examDate) - new Date()) / 86400000);
    return d > 0 ? d : null;
  }, [examDate]);

  // ── Handlers ──
  const setDomain = useCallback((id, v) => {
    setAlloc(prev => ({ ...prev, [id]: Math.max(0, parseFloat(v) || 0) }));
  }, []);

  const reset = useCallback(() => {
    setAlloc(DEFAULT_ALLOC);
    setTotalHrs(DEFAULT_HRS);
    setExamDate('');
  }, []);

  const exportState = useCallback(() => {
    const payload = JSON.stringify({
      score:    results.score,
      passing:  results.passing,
      totalHrs,
      alloc,
      examDate,
      exported: new Date().toISOString(),
    }, null, 2);
    navigator.clipboard?.writeText(payload).then(() => {
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 2200);
    });
  }, [results.score, results.passing, totalHrs, alloc, examDate]);

  // ── AI Coach (Anthropic) ──
  const runCoach = async () => {
    setCoachLoading(true);
    setCoachOut('');
    setCoachErr('');

    const lines = results.domains.map(d =>
      `- ${d.name} (${d.weight}% weight): ${d.got}h allocated → ${d.earned.toFixed(1)}/${d.weight} pts${d.isMaxed ? ' [MAXED]' : ` [${d.toMax.toFixed(1)}h to max]`}`
    ).join('\n');

    const prompt =
`You are an expert HDI-SCA certification coach. Be specific and direct — no filler, no preamble.

HDI-SCA EXAM FACTS: 65 questions, 75 minutes, 80% required to pass. Delivered online via HDI Learning Center.

CANDIDATE STATUS:
- Projected score: ${results.score}% (${results.passing
  ? 'PASSING'
  : `FAILING — needs +${(80 - parseFloat(results.score)).toFixed(1)} more points`})
- Hours allocated: ${results.totalAlloc}h of ${totalHrs}h study baseline
${daysLeft ? `- Days until exam: ${daysLeft}` : '- Exam date: not set'}

DOMAIN BREAKDOWN:
${lines}

Give exactly 3 study recommendations as bullet points (start each with "•"). Reference domain names directly. Identify the highest ROI move first. Plain text only — no markdown, no headers.`;

    try {
      setCoachOut(await callAI(prompt, 420));
    } catch (e) {
      setCoachErr('Analysis failed. Check your connection and retry.');
      console.error('[HDI-SCA] Coach error:', e);
    } finally {
      setCoachLoading(false);
    }
  };

  // ── Quiz Generator (Anthropic) ──
  const runQuiz = async (domain) => {
    setQuizDomain(domain);
    setQuizData(null);
    setQuizAnswer(null);
    setQuizErr('');
    setQuizLoading(true);

    const DOMAIN_TOPICS = {
      proc: 'HDI Standard activities 5.01-5.18: incident management lifecycle (detection→logging→categorization→prioritization→diagnosis→escalation→resolution→closure), functional vs hierarchical escalation, request fulfillment vs incident, problem management, change management, SLA/OLA/UC, TCO, RACI, workarounds, known errors, QA management, service continuity',
      res:  'HDI Standard activities 4.01-4.11: service management tool (4.07), knowledge management tool (4.09), remote support tools (4.08), reporting/analytics tools (4.11), workforce management tools (4.06), CMDB/configuration management (5.15), KCS methodology, service catalog (2.06), financial resources (4.01)',
      lead: 'HDI Standard activities 1.01-1.06: alignment to organization (1.01), integration within support model (1.02), resource allocation (1.03), teamwork promotion (1.04), marketing and promotion (1.05), information distribution (1.06), emotional intelligence (8.1), de-escalation, active listening, difficult customer types',
      pol:  'HDI Standard activities 2.01-2.07: purpose/mission/vision (2.01), goals and objectives (2.02), operational plans (2.03), stakeholder engagement (2.04), service improvement plans (2.05), services definition (2.06), security (2.07), ITIL framework alignment, business alignment',
      peop: 'HDI Standard activities 3.01-3.09: job descriptions (3.01), orientation training (3.02), ongoing skill assessment (3.025), career development (3.03), performance management (3.04), staff satisfaction (3.05), compensation (3.06), recognition/reward (3.07), workforce management (3.08), retention (3.09)',
      perf: 'HDI Standard metrics: FCR (8.050), abandon rate (8.030), incident resolution time (8.040), cost per unit (8.120), AHT, MTTR, first level resolution rate, reopened incidents, CSAT, staff satisfaction metrics (turnover/unplanned absence), 4 maturity levels for both Enablers and Results, CSFs vs KPIs',
    };

    const prompt =
`Generate ONE HDI-SCA certification practice exam question for the domain: "${domain.name}" (${domain.weight}% of exam weight).

Source material for this domain — draw questions from these HDI Standard activities:
${DOMAIN_TOPICS[domain.id] || 'general support center best practices'}

Return ONLY valid JSON — no markdown, no backticks, no explanation outside the JSON:
{"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"correctAnswer":"A. ...","explanation":"..."}

Rules:
- correctAnswer MUST be the full exact string of one of the options (for string equality check)
- Test practical judgment a real analyst would need, not vocabulary trivia
- Vary question type: scenario-based ("An analyst receives a call..."), comparison ("What distinguishes X from Y..."), or best-practice ("According to the HDI Standard...")
- Explanation: 2 sentences — first says WHY correct, second references the specific activity or concept`;

    try {
      const raw   = await callAI(prompt, 650);
      const clean = raw.replace(/```json|```/g, '').trim();

      // Three-pass JSON parse with extraction fallback
      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch {
        const extracted = clean.match(/\{[\s\S]*\}/)?.[0];
        if (!extracted) throw new Error('No JSON object found in response');
        parsed = JSON.parse(extracted);
      }

      if (!parsed.question || !Array.isArray(parsed.options) || !parsed.options.length) {
        throw new Error('Quiz response missing required fields');
      }
      setQuizData(parsed);
    } catch (e) {
      setQuizErr('Question generation failed — retry.');
      console.error('[HDI-SCA] Quiz error:', e);
    } finally {
      setQuizLoading(false);
    }
  };

  const closeQuiz = () => {
    setQuizDomain(null);
    setQuizData(null);
    setQuizAnswer(null);
    setQuizErr('');
  };

  // ── Flashcard helpers ──
  const fcDeck = useMemo(() => {
    const deck = fcFilter ? FC_CARDS.filter(c => c.d === fcFilter) : [...FC_CARDS];
    return deck; // preserves insertion order (domain-grouped)
  }, [fcFilter]);

  const fcCard = fcDeck[fcIdx] || null;

  const fcNext = useCallback(() => {
    setFcFlipped(false);
    setFcIdx(i => (i + 1) % fcDeck.length);
  }, [fcDeck.length]);

  const fcPrev = useCallback(() => {
    setFcFlipped(false);
    setFcIdx(i => (i - 1 + fcDeck.length) % fcDeck.length);
  }, [fcDeck.length]);

  const toggleMastered = useCallback((id) => {
    setFcMastered(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // ── Mock exam generator ──
  const generateMockExam = async (mode) => {
    const cfg = MOCK_DIST[mode];
    setMockLoading(true);
    setMockQs([]);
    setMockAnswers({});
    setMockIdx(0);
    setMockReview(false);
    setMockGenErr('');

    // Root cause of prior "only 2 questions" bug: artifact proxy caps output at ~1000 tokens.
    // Multi-question batch prompts truncated mid-JSON. Fix: one question per API call.
    const DOMAIN_TOPICS = {
      proc: 'HDI Standard activities 5.01-5.18: full incident lifecycle (logging 5.065, categorization 5.07, prioritization 5.08, diagnosis 5.095, escalation 5.10, resolution 5.11, closure 5.12, reopening 5.125), request fulfillment 5.05, problem management 5.13, change management 5.14, SLM 5.03, QA 5.18, service continuity 5.17, TCO, RACI, SLA/OLA/UC, functional vs hierarchical escalation, incident vs problem vs known error',
      res:  'HDI Standard activities 4.01-4.11: service mgmt tool 4.07, knowledge mgmt tool 4.09, knowledge resources 4.10, remote support tools 4.08, reporting/analytics 4.11, workforce mgmt tool 4.06, CMDB, financial resources 4.01, KCS methodology, service catalog, self-service portals',
      lead: 'HDI Standard activities 1.01-1.06: org alignment 1.01, support model integration 1.02, resource allocation 1.03, teamwork 1.04, marketing/promotion 1.05, information distribution 1.06, emotional intelligence 8.1, active listening, de-escalation, four difficult customer types, closed-loop communication',
      pol:  'HDI Standard activities 2.01-2.07: purpose/mission/vision 2.01, goals & objectives 2.02, operational plans 2.03, stakeholder engagement 2.04, service improvement plans 2.05, services definition 2.06, security 2.07, ITIL framework, business alignment, strategic vs operational goals',
      peop: 'HDI Standard activities 3.01-3.09: job descriptions, orientation training 3.02, skill assessment 3.025, career development 3.03, performance management 3.04, staff satisfaction 3.05, compensation 3.06, recognition/reward 3.07, workforce management 3.08, retention 3.09, EQ components',
      perf: 'HDI Standard metrics: FCR 8.050 formula, abandon rate 8.030, incident resolution time 8.040, cost per unit 8.120, AHT formula, MTTR, MTTD, first level resolution rate, reopened incidents, CSAT, staff satisfaction (turnover/absence), 4 maturity levels for Enablers and Results, KPIs vs CSFs',
    };

    // Build flat domain list: [proc×7, res×3, lead×2, pol×1, peop×1, perf×1] for Quick
    const domainList = DOMAINS.flatMap(d =>
      Array(cfg.dist[d.id] || 0).fill(d)
    );
    const total = domainList.length;
    setMockGenProg({ done: 0, total });

    // Vary question type to avoid repetition across a domain
    const Q_TYPES = [
      'scenario — start with "An analyst receives a call..." or "A user reports..."',
      'comparison — "What is the key difference between X and Y..."',
      'best-practice — "According to the HDI Standard, which of the following..."',
      'maturity level — "A support center that has reached Maturity Level 4 for Activity X would..."',
    ];

    const makePrompt = (d, qNumber) => {
      const qType = Q_TYPES[qNumber % Q_TYPES.length];
      return `Generate ONE HDI-SCA practice exam question for the domain: "${d.name}" (${d.weight}% of exam weight).

Topic pool for this domain: ${DOMAIN_TOPICS[d.id]}
Question type to use: ${qType}

Return ONLY a valid JSON object — no markdown, no backticks, nothing else:
{"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"correctAnswer":"A. ...","explanation":"...","domainId":"${d.id}","domainName":"${d.name}"}

Rules:
- correctAnswer must be the exact string of one option (used for equality check)
- All four options must be plausible — no obvious throwaway answers
- Explanation: 1-2 sentences — why the correct answer is right, with the HDI Standard concept`;
    };

    const parseQ = (raw) => {
      const clean = raw.replace(/```json|```/g, '').trim();
      try { return JSON.parse(clean); }
      catch {
        const m = clean.match(/\{[\s\S]*\}/);
        if (!m) throw new Error('No JSON object in response');
        return JSON.parse(m[0]);
      }
    };

    // Fire in concurrent batches of 8 so the full set doesn't slam the rate limit
    const CONCURRENCY = 8;
    const allQs = [];
    let firstErr = null;

    for (let i = 0; i < domainList.length; i += CONCURRENCY) {
      const slice = domainList.slice(i, i + CONCURRENCY);
      const settled = await Promise.allSettled(
        slice.map((d, j) =>
          callAI(makePrompt(d, i + j), 1000)
            .then(raw => {
              setMockGenProg(p => ({ ...p, done: p.done + 1 }));
              return parseQ(raw);
            })
            .catch(err => {
              setMockGenProg(p => ({ ...p, done: p.done + 1 }));
              console.error(`[HDI-SCA] Q${i + j + 1} gen failed (${d.id}):`, err);
              if (!firstErr) firstErr = err?.message || String(err);
              return null;
            })
        )
      );
      settled.forEach(r => { if (r.status === 'fulfilled' && r.value) allQs.push(r.value); });
    }

    // Fisher-Yates shuffle
    for (let i = allQs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQs[i], allQs[j]] = [allQs[j], allQs[i]];
    }

    setMockQs(allQs);
    setMockTimerSec(cfg.secs);
    setMockLoading(false);

    if (allQs.length === 0) {
      // Every question failed to generate/parse. Surface the ACTUAL error instead
      // of guessing "transient" — a systemic failure (bad model string, auth, schema
      // change) looks identical to a rate-limit blip unless the real message ships.
      setMockGenErr(firstErr ? `Generation failed for all questions — ${firstErr}` : 'Generation failed for all questions — unknown error, check console.');
      setMockMode(null);
      return;
    }
    setMockGenErr('');
    setMockMode('running');
  };

  const submitMockExam = () => setMockMode('done');

  const resetMockExam = () => {
    setMockMode(null);
    setMockQs([]);
    setMockAnswers({});
    setMockIdx(0);
    setMockTimerSec(0);
    setMockReview(false);
    setMockGenErr('');
  };

  // ── Persist quiz history ──
  const saveQuizResult = useCallback((domainId, correct) => {
    setQuizHistory(prev => {
      const next = [...prev, { domainId, correct, ts: Date.now() }].slice(-200); // cap at 200 entries
      if (typeof window.storage !== 'undefined') {
        window.storage.set(HIST_KEY, JSON.stringify(next)).catch(() => {});
      }
      return next;
    });
  }, []);

  // ── Study Guide essay outline generator ──
  const runEssayOutline = async (essay) => {
    setSgEssayOut('');
    setSgEssayErr('');
    setSgEssayLoading(true);
    const prompt =
`You are an expert on the HDI Support Center Standard (v5.3). Generate a structured essay outline for the following HDI-SCA exam essay prompt.

Essay title: "${essay.title}"
Prompt: "${essay.prompt}"

HDI Standard context:
- 8 categories: 5 Enablers (Leadership, Strategy & Policy, People Management, Resources, Process & Procedure) and 3 Results (People Satisfaction, Customer Satisfaction, Performance Results)
- 4 Maturity Levels for Enablers: Just Started → Some Progress → Considerable Progress → Fully Achieved/Optimized
- 4 Maturity Levels for Results: Measured → Comparison to Goals → Trending to Goals → Consistently Meeting Goals (9 of 12 months)
- Key activities: 1.01 Alignment to Org, 1.02 Integration within Support Model, 2.01 Purpose, 2.03 Operational Plans, 3.04 Performance Mgmt, 5.06 Incident Management, 5.03 SLM

Produce a concise essay outline with:
1. Thesis statement (1-2 sentences)
2. Three main body points, each with a supporting HDI activity or maturity level reference
3. One concrete example per body point
4. Conclusion sentence

Plain text only — no markdown, no headers, use numbered lists. Keep each point to 2-3 sentences.`;
    try {
      setSgEssayOut(await callAI(prompt, 700));
    } catch (e) {
      setSgEssayErr('Outline generation failed — retry.');
      console.error('[HDI-SCA] Essay outline error:', e);
    } finally {
      setSgEssayLoading(false);
    }
  };

  // ── Style helpers (avoid Tailwind dynamic class construction) ──
  const C = {                      // surface tokens
    base:       '#0B1929',
    card:       '#122338',
    cardHi:     '#183048',
    orange:     '#F5841F',
    blue:       '#3B82F6',
    blueDark:   '#1D4ED8',
    blueDim:    '#60A5FA',
    green:      '#22C55E',
    red:        '#EF4444',
    amber:      '#F59E0B',
    text:       '#E2E8F0',
    muted:      '#64748B',
    mutedHi:    '#94A3B8',
    border:     'rgba(255,255,255,0.07)',
    borderHi:   'rgba(59,130,246,0.18)',
  };

  const card    = (x = {}) => ({ background: C.card,   border: `1px solid ${C.border}`,   borderRadius: '12px', padding: '1.125rem', ...x });
  const cardHi  = (x = {}) => ({ background: C.cardHi, border: `1px solid ${C.borderHi}`, borderRadius: '12px', padding: '1.125rem', ...x });
  const btnBase = (x = {}) => ({ border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.77rem', fontWeight: '500', lineHeight: '1', padding: '0.35rem 0.75rem', fontFamily: 'Inter, sans-serif', ...x });
  const label   = { fontSize: '0.64rem', fontWeight: '700', letterSpacing: '0.09em', textTransform: 'uppercase', color: C.muted };

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.base, color: C.text, minHeight: '100vh' }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadein  { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:focus-visible { outline: 2px solid #3B82F6; outline-offset: 2px; }
        input:focus-visible  { outline: 2px solid #3B82F6 !important; outline-offset: 1px; }
        a:focus-visible      { outline: 2px solid #3B82F6; outline-offset: 2px; border-radius: 2px; }
        input[type=range] {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.08);
          cursor: pointer;
          width: 100%;
          outline: none;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: white;
          border: 2px solid rgba(0,0,0,0.35);
          cursor: pointer;
        }
        input[type=range]:focus-visible::-webkit-slider-thumb {
          outline: 2px solid #3B82F6;
          outline-offset: 2px;
        }
        .fade-in { animation: fadein 0.22s ease; }
      `}</style>

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: isMobile ? '0.875rem' : '1.25rem' }}>

        {/* ══ HEADER ══════════════════════════════════════════════════════ */}
        <header style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.75rem',
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: '0.875rem', marginBottom: '1rem',
        }}>
          {/* HDI logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Real HDI logo — falls back to text badge on load error */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <img
                src="https://www.thinkhdi.com/-/media/HDICorp/Images/Logos/HDI.ashx"
                alt="HDI"
                referrerPolicy="no-referrer"
                style={{ height: '36px', width: 'auto', display: 'block' }}
                onError={e => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback text badge — hidden by default */}
              <div style={{
                display: 'none',
                background: C.orange, borderRadius: '8px',
                padding: '0.35rem 0.55rem',
                flexDirection: 'column', alignItems: 'center',
                lineHeight: 1, gap: '2px',
              }}>
                <span style={{ color: 'white', fontWeight: '800', fontSize: '1rem', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.04em' }}>HDI</span>
                <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.42rem', letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>CERT PREP</span>
              </div>
            </div>
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? '1rem' : '1.15rem', fontWeight: '700', color: 'white', letterSpacing: '-0.02em' }}>
                SCA Study Planner
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem', flexWrap: 'wrap' }}>
                <p style={{ color: C.muted, fontSize: '0.7rem', margin: 0 }}>
                  Support Center Analyst · 65Q · 75 min · 80% to pass
                </p>
                <span style={{ fontSize: '0.52rem', color: C.muted, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: '3px', padding: '0.08rem 0.28rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '600' }}>
                  unofficial prep tool
                </span>
              </div>
            </div>
          </div>

          {/* Header controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <label style={{ ...label }} htmlFor="hdi-exam-date">Exam date</label>
              <input
                id="hdi-exam-date"
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '0.28rem 0.5rem', color: C.text, fontSize: '0.77rem' }}
              />
            </div>
            {daysLeft !== null && (
              <span style={{
                fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '5px',
                background: daysLeft < 14 ? 'rgba(239,68,68,0.14)' : daysLeft < 30 ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.1)',
                color:      daysLeft < 14 ? '#F87171'              : daysLeft < 30 ? '#FBD74B'              : '#4ADE80',
              }}>
                {daysLeft}d left
              </span>
            )}
            <button
              onClick={exportState}
              aria-label="Export current study plan to clipboard"
              style={btnBase({
                background: exportCopied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)',
                color: exportCopied ? '#4ADE80' : C.mutedHi,
                border: `1px solid ${exportCopied ? 'rgba(34,197,94,0.25)' : C.border}`,
                transition: 'all 0.2s',
              })}>
              {exportCopied ? '✓ Copied' : 'Export'}
            </button>
            <button
              onClick={reset}
              aria-label="Reset to default allocations"
              style={btnBase({ background: 'rgba(239,68,68,0.07)', color: '#F87171', border: '1px solid rgba(239,68,68,0.18)' })}>
              Reset
            </button>
          </div>
        </header>

        {/* ══ TAB NAVIGATION ══════════════════════════════════════════════ */}
        <nav style={{
          display: 'flex', gap: '0.25rem', marginBottom: '1rem',
          background: 'rgba(255,255,255,0.02)', borderRadius: '10px',
          padding: '0.25rem', border: `1px solid ${C.border}`,
        }} role="tablist" aria-label="Study tools">
          {[
            { id:'plan',  label:'Study Plan', icon:'◎' },
            { id:'cards', label:'Flashcards',  icon:'⊞' },
            { id:'exam',  label:'Mock Exam',   icon:'▷' },
            { id:'ref',   label:'Reference',   icon:'≡' },
            { id:'guide', label:'Study Guide', icon:'✎' },
          ].map(t => (
            <button key={t.id} role="tab" aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              style={btnBase({
                flex: 1, background: activeTab === t.id ? C.cardHi : 'transparent',
                color: activeTab === t.id ? 'white' : C.muted,
                border: `1px solid ${activeTab === t.id ? C.borderHi : 'transparent'}`,
                borderRadius: '7px', padding: '0.5rem 0.25rem',
                fontSize: isMobile ? '0.58rem' : '0.72rem',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
              })}>
              <span aria-hidden="true">{t.icon}</span>
              {isMobile ? t.label.split(' ').pop() : t.label}
            </button>
          ))}
        </nav>

        {/* ══ STUDY PLAN TAB ══════════════════════════════════════════════ */}
        {activeTab === 'plan' && (<>
        {results.overAllocated && (
          <div role="alert" style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)',
            borderRadius: '8px', padding: '0.55rem 0.875rem', marginBottom: '0.875rem',
            fontSize: '0.77rem', color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '0.45rem',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Domain allocations exceed baseline hours. Increase baseline or trim domain hours.
          </div>
        )}

        {/* ══ MAIN GRID ════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) 368px',
          gap: '1rem',
          alignItems: 'start',
        }}>

          {/* ── LEFT: SLIDERS ─────────────────────────────────────────── */}
          <div style={card()}>
            {/* Panel header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.92rem', fontWeight: '600', color: 'white' }}>
                Study Hour Allocation
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <label style={label} htmlFor="hdi-baseline-hrs">Baseline hrs</label>
                <input
                  id="hdi-baseline-hrs"
                  type="number"
                  value={totalHrs}
                  onChange={e => setTotalHrs(Math.max(1, Number(e.target.value) || 1))}
                  min="1" max="500"
                  style={{ background: C.base, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '0.28rem 0.45rem', color: C.text, fontSize: '0.8rem', width: '58px', textAlign: 'right' }}
                  aria-label="Total baseline study hours"
                />
              </div>
            </div>

            {/* Exam weight bar — visual reference for all three personas */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.58rem', color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Exam Weight Distribution</span>
                <span style={{ fontSize: '0.58rem', color: C.muted }}>65 questions</span>
              </div>
              <div
                style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', gap: '1.5px' }}
                title="Exam weight distribution"
                aria-label="Exam domain weight breakdown"
                role="img">
                {DOMAINS.map(d => (
                  <div key={d.id} title={`${d.name}: ${d.weight}%`}
                    style={{ width: `${d.weight}%`, background: d.color, opacity: 0.85, position: 'relative' }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                {DOMAINS.map(d => (
                  <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '1px', background: d.color, opacity: 0.8 }} />
                    <span style={{ fontSize: '0.56rem', color: C.muted }}>{d.weight}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {results.domains.map((d, i) => (
                <div key={d.id} className="fade-in" style={{
                  padding: '0.875rem 0',
                  borderBottom: i < results.domains.length - 1 ? `1px solid rgba(255,255,255,0.04)` : 'none',
                }}>
                  {/* Row: name + stats + quiz btn */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', minWidth: 0, flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: d.color, flexShrink: 0 }} aria-hidden="true" />
                        <span style={{ fontSize: '0.84rem', fontWeight: '500', color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {d.name}
                        </span>
                        <span style={{ fontSize: '0.61rem', background: 'rgba(255,255,255,0.05)', color: C.muted, padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: '700', letterSpacing: '0.03em', flexShrink: 0 }}>
                          {d.weight}%
                        </span>
                      </div>
                      {d.units && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', paddingLeft: '1.1rem' }}>
                          {d.units.map(u => (
                            <span key={u} style={{
                              fontSize: '0.56rem', color: d.color, opacity: 0.7,
                              background: `${d.color}14`,
                              border: `1px solid ${d.color}28`,
                              borderRadius: '3px', padding: '0.08rem 0.3rem',
                              fontFamily: 'monospace', letterSpacing: '0.01em',
                              whiteSpace: 'nowrap',
                            }}>{u}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: d.isMaxed ? '#4ADE80' : C.muted }}>
                        {d.got}h → {d.earned.toFixed(1)}pt
                      </span>
                      <button
                        onClick={() => runQuiz(d)}
                        disabled={quizLoading}
                        aria-label={`Generate practice question for ${d.name}`}
                        style={btnBase({
                          background: 'rgba(59,130,246,0.09)',
                          border: '1px solid rgba(59,130,246,0.2)',
                          color: C.blueDim,
                          borderRadius: '20px',
                          padding: '0.18rem 0.55rem',
                          fontSize: '0.67rem',
                          opacity: quizLoading ? 0.45 : 1,
                          cursor: quizLoading ? 'not-allowed' : 'pointer',
                        })}>
                        Quiz
                      </button>
                    </div>
                  </div>

                  {/* Range slider — accentColor uses domain color */}
                  <input
                    type="range"
                    min="0"
                    max={Math.ceil(d.req * 1.5)}
                    step="0.5"
                    value={d.got}
                    onChange={e => setDomain(d.id, e.target.value)}
                    style={{ accentColor: d.color, marginBottom: '0.4rem' }}
                    aria-label={`Study hours for ${d.name}`}
                    aria-valuemin={0}
                    aria-valuemax={Math.ceil(d.req * 1.5)}
                    aria-valuenow={d.got}
                  />

                  {/* Fill bar + status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '2px', height: '3px', overflow: 'hidden' }} aria-hidden="true">
                      <div style={{
                        height: '100%',
                        width: `${d.pct * 100}%`,
                        background: d.isMaxed ? C.green : d.color,
                        borderRadius: '2px',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.64rem', color: d.isMaxed ? C.green : C.muted, whiteSpace: 'nowrap', minWidth: '64px', textAlign: 'right' }}>
                      {d.isMaxed ? '✓ maxed' : `${d.toMax.toFixed(1)}h to max`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Exam reference row */}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: '0.5rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.65rem', color: '#475569' }}>thinkhdi.com — HDI-SCA certification standard</span>
              <a href="https://www.thinkhdi.com/education/courses/hdi-support-center-analyst-new-version"
                target="_blank" rel="noreferrer"
                style={{ fontSize: '0.65rem', color: '#60A5FA', textDecoration: 'none' }}>
                Official course →
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN ──────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

            {/* Score Gauge */}
            <div style={card({ textAlign: 'center', padding: '1.25rem 0.875rem' })} aria-live="polite">
              <ScoreGauge score={results.score} isPassing={results.passing} />
              {/* Stat row */}
              <div style={{
                display: 'flex', justifyContent: 'space-around',
                marginTop: '0.875rem', paddingTop: '0.75rem',
                borderTop: `1px solid ${C.border}`,
              }}>
                {[
                  { val: `${results.totalAlloc}h`, lbl: 'Allocated', color: C.orange },
                  { val: `${totalHrs}h`,            lbl: 'Baseline',  color: C.blueDim },
                  ...(daysLeft !== null ? [{ val: `${daysLeft}d`, lbl: 'To Exam', color: daysLeft < 14 ? '#F87171' : '#4ADE80' }] : []),
                ].map(({ val, lbl, color }) => (
                  <div key={lbl} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif", color }}>{val}</div>
                    <div style={{ ...label, marginTop: '0.15rem' }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Next-hour ROI recommendation (Persona: Kyle / candidate) ── */}
            {results.topGap ? (
              <div style={{ background: 'rgba(245,132,31,0.07)', border: '1px solid rgba(245,132,31,0.17)', borderRadius: '12px', padding: '0.875rem' }}>
                <div style={{ ...label, color: C.orange, marginBottom: '0.3rem' }}>Next Hour → Highest ROI</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.2rem' }}>
                  {results.topGap.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: C.muted }}>
                  +{(results.topGap.weight - results.topGap.earned).toFixed(1)} pts available · {results.topGap.toMax.toFixed(1)}h to max this domain
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: '12px', padding: '0.875rem', textAlign: 'center' }}>
                <div style={{ color: '#4ADE80', fontWeight: '600', fontSize: '0.875rem' }}>All domains maxed ✓</div>
                <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: '0.2rem' }}>Increase baseline hours or use Quiz to reinforce weak areas</div>
              </div>
            )}

            {/* ── AI Study Coach (Persona: Kyle / candidate) ── */}
            <div style={cardHi()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <h3 style={{ fontSize: '0.74rem', fontWeight: '600', color: C.blueDim, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  AI Study Coach
                </h3>
                <button
                  onClick={runCoach}
                  disabled={coachLoading}
                  aria-label="Get AI analysis of your study plan"
                  style={btnBase({
                    background: coachLoading ? 'rgba(29,78,216,0.45)' : C.blueDark,
                    color: 'white',
                    opacity: coachLoading ? 0.7 : 1,
                    cursor: coachLoading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                  })}>
                  {coachLoading
                    ? <><span style={{ display: 'inline-block', animation: 'spin 0.85s linear infinite' }}>⟳</span> Analyzing…</>
                    : 'Analyze Plan'}
                </button>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.18)', borderRadius: '8px', padding: '0.75rem', minHeight: '72px', fontSize: '0.78rem', color: '#CBD5E1', lineHeight: '1.6' }}
                aria-live="polite" aria-label="AI coach feedback">
                {coachLoading && <span style={{ color: C.blueDim }}>Consulting AI coach…</span>}
                {!coachLoading && coachErr && <span style={{ color: '#F87171' }}>{coachErr}</span>}
                {!coachLoading && !coachErr && coachOut && <p style={{ whiteSpace: 'pre-wrap' }}>{coachOut}</p>}
                {!coachLoading && !coachErr && !coachOut && (
                  <span style={{ color: '#475569', fontStyle: 'italic' }}>Click Analyze Plan for personalized study advice based on your current allocations.</span>
                )}
              </div>
            </div>

            {/* ── Manager ROI Summary (Persona: Daniel Bell / sponsor) ── */}
            <button
              onClick={() => setManagerOpen(v => !v)}
              aria-expanded={managerOpen}
              aria-controls="manager-panel"
              style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.5rem 0.875rem', color: C.muted, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontFamily: 'Inter, sans-serif' }}>
              <span>Manager / ROI Summary</span>
              <span style={{ fontSize: '0.6rem' }}>{managerOpen ? '▲' : '▼'}</span>
            </button>

            {managerOpen && (
              <div id="manager-panel" role="region" aria-label="Manager ROI summary"
                style={card({ animation: 'fadein 0.2s ease' })}>
                {/* Panel header with cert badge when passing */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ ...label }}>Candidate Overview</div>
                  {results.passing && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {/* Cert badge shield SVG */}
                      <svg width="22" height="24" viewBox="0 0 22 24" fill="none" aria-label="Pass ready badge">
                        <path d="M11 1L2 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5L11 1z"
                          fill="rgba(245,132,31,0.18)" stroke="#F5841F" strokeWidth="1.4" />
                        <path d="M7.5 12l2.5 2.5L15 9" stroke="#F5841F" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ fontSize: '0.62rem', color: '#F5841F', fontWeight: '700', letterSpacing: '0.06em' }}>PASS READY</span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  {[
                    {
                      lbl: 'Exam Ready',
                      val: results.passing ? 'YES' : 'NO',
                      color: results.passing ? '#4ADE80' : '#F87171',
                    },
                    {
                      lbl: 'Projected Score',
                      val: `${results.score}%`,
                      color: C.orange,
                    },
                    {
                      lbl: 'Hours Invested',
                      val: `${results.totalAlloc}h`,
                      color: C.blueDim,
                    },
                    {
                      lbl: 'Gap to 80%',
                      val: results.passing ? '—' : `+${(80 - parseFloat(results.score)).toFixed(1)}pt`,
                      color: results.passing ? '#4ADE80' : C.amber,
                    },
                  ].map(({ lbl, val, color }) => (
                    <div key={lbl}>
                      <div style={{ fontSize: '0.62rem', color: C.muted, marginBottom: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{lbl}</div>
                      <div style={{ fontSize: '1rem', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif", color }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', lineHeight: '1.6', borderTop: `1px solid ${C.border}`, paddingTop: '0.75rem' }}>
                  HDI-SCA certifies front-line analysts in ITIL-aligned support practices —
                  incident management, escalation, SLA, and customer handling.
                  Industry-recognized across MSP, enterprise IT, and shared-services orgs.
                  Online exam: 65Q, 75 min, 80% to pass. Study bundle: $699 · Retake: $99.{' '}
                  <a href="https://www.thinkhdi.com/education/courses/hdi-support-center-analyst-new-version"
                    target="_blank" rel="noreferrer"
                    style={{ color: '#60A5FA', textDecoration: 'none' }}>
                    Official HDI-SCA Course →
                  </a>
                </div>
              </div>
            )}

          </div>{/* end right col */}
        </div>{/* end main grid */}

        {/* ══ QUIZ PANEL ══════════════════════════════════════════════════ */}
        {quizDomain && (quizLoading || quizData || quizErr) && (
          <div className="fade-in"
            role="region" aria-label={`Practice question for ${quizDomain.name}`}
            aria-live="assertive"
            style={{ ...cardHi({ marginTop: '1rem' }), position: 'relative' }}>
            {/* Left accent bar */}
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: C.blue, borderRadius: '12px 0 0 12px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
                Flashcard ·{' '}
                <span style={{ color: C.blueDim }}>{quizDomain.name}</span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.62rem', background: 'rgba(255,255,255,0.05)', color: C.muted, padding: '0.1rem 0.35rem', borderRadius: '4px', fontWeight: '700' }}>
                  {quizDomain.weight}% weight
                </span>
              </h3>
              <button
                onClick={closeQuiz}
                aria-label="Close practice question"
                style={{ background: 'none', border: 'none', color: C.muted, fontSize: '1rem', cursor: 'pointer', padding: '0.2rem 0.375rem', lineHeight: 1, borderRadius: '4px' }}>
                ✕
              </button>
            </div>

            {/* Loading state */}
            {quizLoading && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', gap: '0.625rem' }}>
                <div style={{ width: '25px', height: '25px', border: `3px solid ${C.blue}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} aria-hidden="true" />
                <span style={{ color: C.muted, fontSize: '0.77rem' }}>Generating question…</span>
              </div>
            )}

            {/* Error state */}
            {!quizLoading && quizErr && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: '8px', padding: '0.75rem', color: '#FCA5A5', fontSize: '0.78rem' }}>
                {quizErr}
                <button
                  onClick={() => runQuiz(quizDomain)}
                  style={btnBase({ display: 'block', marginTop: '0.5rem', background: 'rgba(239,68,68,0.14)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.22)' })}>
                  Retry
                </button>
              </div>
            )}

            {/* Question + answers */}
            {!quizLoading && quizData && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <p style={{ fontSize: '0.875rem', color: C.text, lineHeight: '1.6' }}>
                  {quizData.question}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.5rem' }}
                  role="group" aria-label="Answer options">
                  {quizData.options?.map((opt, i) => {
                    const sel     = quizAnswer === opt;
                    const correct = quizData.correctAnswer === opt;
                    const shown   = quizAnswer !== null;

                    let bg = 'rgba(255,255,255,0.03)', bc = 'rgba(255,255,255,0.07)', tc = '#CBD5E1', op = 1;
                    if (shown) {
                      if (correct)      { bg = 'rgba(34,197,94,0.1)';  bc = 'rgba(34,197,94,0.32)';  tc = '#86EFAC'; }
                      else if (sel)     { bg = 'rgba(239,68,68,0.1)';  bc = 'rgba(239,68,68,0.32)';  tc = '#FCA5A5'; }
                      else              { op = 0.32; }
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (shown) return;
                          setQuizAnswer(opt);
                          if (quizDomain) saveQuizResult(quizDomain.id, opt === quizData.correctAnswer);
                        }}
                        disabled={shown}
                        aria-pressed={sel}
                        style={{
                          background: bg, border: `1px solid ${bc}`, borderRadius: '8px',
                          padding: '0.7rem 0.875rem', textAlign: 'left', color: tc,
                          fontSize: '0.79rem', cursor: shown ? 'default' : 'pointer',
                          opacity: op, transition: 'all 0.14s', lineHeight: '1.45',
                          fontFamily: 'Inter, sans-serif',
                        }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Reveal + explanation */}
                {quizAnswer && (() => {
                  const isCorrect = quizAnswer === quizData.correctAnswer;
                  return (
                    <div style={{
                      background: isCorrect ? 'rgba(34,197,94,0.07)'  : 'rgba(239,68,68,0.07)',
                      border:     `1px solid ${isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                      borderRadius: '8px', padding: '0.875rem',
                    }}>
                      <div style={{ fontWeight: '600', fontSize: '0.8rem', color: isCorrect ? C.green : C.red, marginBottom: '0.375rem' }}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: C.mutedHi, lineHeight: '1.55' }}>
                        {quizData.explanation}
                      </p>
                      <button
                        onClick={() => runQuiz(quizDomain)}
                        style={btnBase({ marginTop: '0.75rem', background: C.blueDark, color: 'white' })}>
                        Next Question
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        </>)} {/* end activeTab === 'plan' */}

        {/* ══ FLASHCARDS TAB ══════════════════════════════════════════════ */}
        {activeTab === 'cards' && (() => {
          const masteredCount = fcDeck.filter(c => fcMastered.has(c.id)).length;
          const domainInfo = DOMAINS.find(d => d.id === fcCard?.d);
          return (
            <div className="fade-in">
              {/* Domain filter row */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                <button onClick={() => { setFcFilter(null); setFcIdx(0); setFcFlipped(false); }}
                  style={btnBase({ background: !fcFilter ? C.orange : 'rgba(255,255,255,0.04)', color: !fcFilter ? 'white' : C.muted, border: `1px solid ${!fcFilter ? C.orange : C.border}` })}>
                  All ({FC_CARDS.length})
                </button>
                {DOMAINS.map(d => {
                  const count = FC_CARDS.filter(c => c.d === d.id).length;
                  const active = fcFilter === d.id;
                  return (
                    <button key={d.id} onClick={() => { setFcFilter(d.id); setFcIdx(0); setFcFlipped(false); }}
                      style={btnBase({ background: active ? `${d.color}22` : 'rgba(255,255,255,0.03)', color: active ? d.color : C.muted, border: `1px solid ${active ? d.color : C.border}` })}>
                      {d.name.split(' ')[0]} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${fcDeck.length ? (masteredCount / fcDeck.length) * 100 : 0}%`, background: C.green, transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.67rem', color: C.muted, whiteSpace: 'nowrap' }}>
                  {masteredCount}/{fcDeck.length} mastered
                </span>
              </div>

              {/* Card */}
              {fcCard && (
                <div style={{ perspective: '1000px', marginBottom: '0.875rem' }}>
                  <div
                    role="button" tabIndex={0} aria-label={fcFlipped ? 'Definition — click to flip back' : 'Term — click to reveal definition'}
                    onClick={() => setFcFlipped(f => !f)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setFcFlipped(f => !f)}
                    style={{
                      background: fcFlipped ? C.cardHi : C.card,
                      border: `1px solid ${fcFlipped ? C.borderHi : C.border}`,
                      borderRadius: '16px', padding: '2rem 1.5rem',
                      minHeight: '200px', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'center', alignItems: 'center',
                      textAlign: 'center', position: 'relative',
                      transition: 'all 0.2s ease',
                      borderLeft: `4px solid ${domainInfo?.color || C.orange}`,
                    }}>
                    {/* Domain + card count badge */}
                    <div style={{ position: 'absolute', top: '0.875rem', left: '1rem', right: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.6rem', color: domainInfo?.color || C.muted, fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        {domainInfo?.name || ''}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: C.muted }}>
                        {fcIdx + 1} / {fcDeck.length}
                      </span>
                    </div>
                    {/* Flip hint */}
                    <span style={{ position: 'absolute', bottom: '0.875rem', right: '1rem', fontSize: '0.58rem', color: C.muted }}>
                      {fcFlipped ? '↩ term' : '→ definition'}
                    </span>
                    {/* Content */}
                    {!fcFlipped ? (
                      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.3rem', fontWeight: '700', color: 'white', letterSpacing: '-0.02em', lineHeight: '1.3' }}>
                        {fcCard.term}
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.9rem', color: C.text, lineHeight: '1.7', maxWidth: '520px' }}>
                        {fcCard.def}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Controls */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                <button onClick={fcPrev}
                  style={btnBase({ background: 'rgba(255,255,255,0.04)', color: C.mutedHi, border: `1px solid ${C.border}`, padding: '0.45rem 1.25rem' })}>
                  ← Prev
                </button>
                {fcCard && (
                  <button
                    onClick={() => toggleMastered(fcCard.id)}
                    style={btnBase({
                      background: fcMastered.has(fcCard.id) ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
                      color: fcMastered.has(fcCard.id) ? C.green : C.muted,
                      border: `1px solid ${fcMastered.has(fcCard.id) ? 'rgba(34,197,94,0.3)' : C.border}`,
                      padding: '0.45rem 1rem',
                    })}>
                    {fcMastered.has(fcCard.id) ? '✓ Mastered' : 'Mark Mastered'}
                  </button>
                )}
                <button onClick={fcNext}
                  style={btnBase({ background: C.blueDark, color: 'white', padding: '0.45rem 1.25rem' })}>
                  Next →
                </button>
              </div>
            </div>
          );
        })()}

        {/* ══ MOCK EXAM TAB ════════════════════════════════════════════════ */}
        {activeTab === 'exam' && (() => {
          // Timer formatting
          const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
          const totalQ  = mockQs.length;
          const answered = Object.keys(mockAnswers).length;
          const pct = totalQ ? Math.round((answered / totalQ) * 100) : 0;

          // Results computation (shown when done)
          const mockScore = (() => {
            if (mockMode !== 'done' || !totalQ) return null;
            let correct = 0;
            const byDomain = {};
            mockQs.forEach((q, i) => {
              const did = q.domainId || 'proc';
              if (!byDomain[did]) byDomain[did] = { correct: 0, total: 0 };
              byDomain[did].total++;
              if (mockAnswers[i] === q.correctAnswer) { correct++; byDomain[did].correct++; }
            });
            return { pct: Math.round((correct / totalQ) * 100), correct, total: totalQ, byDomain, pass: Math.round((correct / totalQ) * 100) >= PASS_SCORE };
          })();

          // ── GENERATING screen (must be checked BEFORE the pre-exam screen —
          //    mockMode stays null for the entire generation phase, so if the
          //    !mockMode check ran first, this branch was unreachable)
          if (mockLoading) return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ width: '36px', height: '36px', border: `3px solid ${C.orange}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 1rem' }} />
              <div style={{ color: C.mutedHi, fontSize: '0.875rem', marginBottom: '0.5rem' }}>Generating exam questions…</div>
              <div style={{ color: C.muted, fontSize: '0.72rem' }}>
                {mockGenProg.done} of {mockGenProg.total} questions generated
              </div>
              <div style={{ maxWidth: '240px', margin: '0.75rem auto 0', height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${mockGenProg.total ? (mockGenProg.done/mockGenProg.total)*100 : 0}%`, background: C.orange, transition: 'width 0.3s' }} />
              </div>
            </div>
          );

          // ── PRE-EXAM screen
          if (!mockMode || mockMode === null) return (
            <div className="fade-in" style={{ maxWidth: '560px', margin: '0 auto' }}>
              <div style={card({ textAlign: 'center', padding: '2rem 1.5rem' })}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>▷</div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                  Mock Exam
                </h2>
                <p style={{ fontSize: '0.8rem', color: C.muted, marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  AI-generated questions weighted exactly to the HDI-SCA exam. Questions are unique each session.
                </p>
                {mockGenErr && (
                  <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '0.625rem 0.875rem', marginBottom: '1.25rem', fontSize: '0.75rem', color: '#FCA5A5', textAlign: 'left' }}>
                    ⚠ {mockGenErr}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {[
                    { mode:'quick', label:'Quick Practice', qs:'15 Questions', time:'20 min', desc:'Best for daily review' },
                    { mode:'full',  label:'Full Mock Exam', qs:'65 Questions', time:'75 min', desc:'Matches real exam format' },
                  ].map(m => (
                    <button key={m.mode} onClick={() => generateMockExam(m.mode)} disabled={mockLoading}
                      style={{ background: C.card, border: `2px solid ${m.mode === 'full' ? C.orange : C.border}`, borderRadius: '12px', padding: '1.125rem 0.875rem', cursor: mockLoading ? 'not-allowed' : 'pointer', textAlign: 'left', opacity: mockLoading ? 0.5 : 1, transition: 'border-color 0.15s', fontFamily: 'inherit' }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.88rem', fontWeight: '700', color: m.mode === 'full' ? C.orange : 'white', marginBottom: '0.3rem' }}>{m.label}</div>
                      <div style={{ fontSize: '0.72rem', color: C.mutedHi, fontWeight: '600' }}>{m.qs} · {m.time}</div>
                      <div style={{ fontSize: '0.65rem', color: C.muted, marginTop: '0.2rem' }}>{m.desc}</div>
                    </button>
                  ))}
                </div>
                {/* Quiz history summary */}
                {quizHistory.length > 0 && (() => {
                  const recent = quizHistory.slice(-50);
                  const correct = recent.filter(h => h.correct).length;
                  return (
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1rem', fontSize: '0.72rem', color: C.muted }}>
                      Practice history (last {recent.length}): {correct}/{recent.length} correct ({Math.round((correct/recent.length)*100)}%)
                    </div>
                  );
                })()}
              </div>
            </div>
          );

          // ── RESULTS screen
          if (mockMode === 'done' && mockScore) return (
            <div className="fade-in">
              <div style={card({ textAlign: 'center', padding: '1.5rem', marginBottom: '1rem' })}>
                <div style={{ fontSize: '2.75rem', fontFamily: "'Space Grotesk', sans-serif", fontWeight: '700', color: mockScore.pass ? C.orange : C.red, marginBottom: '0.25rem' }}>
                  {mockScore.pct}%
                </div>
                <div style={{ fontSize: '0.8rem', color: mockScore.pass ? '#4ADE80' : '#F87171', fontWeight: '600', marginBottom: '0.3rem' }}>
                  {mockScore.pass ? '✓ PASS' : '✗ FAIL — need 80% to pass'}
                </div>
                <div style={{ fontSize: '0.72rem', color: C.muted, marginBottom: '1.25rem' }}>
                  {mockScore.correct}/{mockScore.total} correct
                </div>

                {/* Domain breakdown */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.62rem', color: C.muted, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>By Domain</div>
                  {DOMAINS.map(d => {
                    const r = mockScore.byDomain[d.id];
                    if (!r) return null;
                    const pct = Math.round((r.correct / r.total) * 100);
                    return (
                      <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.7rem', color: C.text, flex: 1, textAlign: 'left' }}>{d.name}</span>
                        <div style={{ width: '80px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? C.green : pct >= 60 ? C.amber : C.red }} />
                        </div>
                        <span style={{ fontSize: '0.65rem', color: pct >= 80 ? C.green : pct >= 60 ? C.amber : C.red, fontWeight: '700', minWidth: '36px', textAlign: 'right' }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => setMockReview(v => !v)}
                    style={btnBase({ background: 'rgba(255,255,255,0.05)', color: C.mutedHi, border: `1px solid ${C.border}` })}>
                    {mockReview ? 'Hide Review' : 'Review Answers'}
                  </button>
                  <button onClick={resetMockExam}
                    style={btnBase({ background: C.orange, color: 'white' })}>
                    New Exam
                  </button>
                </div>
              </div>

              {/* Answer review */}
              {mockReview && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {mockQs.map((q, i) => {
                    const ans = mockAnswers[i];
                    const correct = ans === q.correctAnswer;
                    return (
                      <div key={i} style={{ background: correct ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: '10px', padding: '0.875rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: '700', color: correct ? C.green : C.red, flexShrink: 0 }}>Q{i+1} {correct ? '✓' : '✗'}</span>
                          <span style={{ fontSize: '0.8rem', color: C.text, lineHeight: '1.5' }}>{q.question}</span>
                        </div>
                        {!correct && ans && (
                          <div style={{ fontSize: '0.72rem', color: '#FCA5A5', marginBottom: '0.25rem' }}>Your answer: {ans}</div>
                        )}
                        <div style={{ fontSize: '0.72rem', color: '#86EFAC', marginBottom: '0.3rem' }}>Correct: {q.correctAnswer}</div>
                        <div style={{ fontSize: '0.72rem', color: C.muted, lineHeight: '1.5' }}>{q.explanation}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );

          // ── RUNNING screen
          const q = mockQs[mockIdx];
          if (!q) return (
            <div className="fade-in" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p style={{ color: '#FCA5A5', fontSize: '0.8rem', marginBottom: '1rem' }}>
                ⚠ No question loaded at index {mockIdx} of {totalQ}. This shouldn't happen — mockMode is 'running' with an empty or short question set.
              </p>
              <button onClick={resetMockExam}
                style={btnBase({ background: C.orange, color: 'white' })}>
                Back to Start
              </button>
            </div>
          );
          const timerColor = mockTimerSec < 300 ? C.red : mockTimerSec < 600 ? C.amber : C.green;

          return (
            <div className="fade-in">
              {/* Exam header bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: C.mutedHi }}>
                  Q{mockIdx + 1} / {totalQ}
                </span>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: C.muted }}>{answered} answered</span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: '700', color: timerColor, minWidth: '48px', textAlign: 'right' }}>
                    {fmtTime(mockTimerSec)}
                  </span>
                  <button onClick={submitMockExam}
                    style={btnBase({ background: 'rgba(239,68,68,0.08)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.22)', fontSize: '0.68rem' })}>
                    Submit
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '1rem' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: C.orange, transition: 'width 0.3s' }} />
              </div>

              {/* Question card */}
              <div style={card({ marginBottom: '0.875rem' })}>
                <div style={{ fontSize: '0.58rem', color: C.muted, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {DOMAINS.find(d => d.id === q.domainId)?.name || 'Domain'} · {DOMAINS.find(d => d.id === q.domainId)?.weight || ''}% weight
                </div>
                <p style={{ fontSize: '0.925rem', color: C.text, lineHeight: '1.65', fontWeight: '500' }}>
                  {q.question}
                </p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {q.options?.map((opt, oi) => {
                  const selected = mockAnswers[mockIdx] === opt;
                  return (
                    <button key={oi}
                      onClick={() => setMockAnswers(prev => ({ ...prev, [mockIdx]: opt }))}
                      style={{
                        background: selected ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selected ? 'rgba(59,130,246,0.45)' : C.border}`,
                        borderRadius: '8px', padding: '0.75rem 1rem',
                        color: selected ? '#93C5FD' : C.text,
                        fontSize: '0.83rem', lineHeight: '1.5', cursor: 'pointer',
                        textAlign: 'left', fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.12s',
                      }}>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Nav */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                <button onClick={() => setMockIdx(i => Math.max(0, i - 1))} disabled={mockIdx === 0}
                  style={btnBase({ background: 'rgba(255,255,255,0.04)', color: mockIdx === 0 ? 'rgba(255,255,255,0.15)' : C.mutedHi, border: `1px solid ${C.border}`, cursor: mockIdx === 0 ? 'default' : 'pointer' })}>
                  ← Back
                </button>
                {mockIdx < totalQ - 1
                  ? <button onClick={() => setMockIdx(i => i + 1)}
                      style={btnBase({ background: C.blueDark, color: 'white' })}>
                      Next →
                    </button>
                  : <button onClick={submitMockExam}
                      style={btnBase({ background: C.orange, color: 'white', fontWeight: '700' })}>
                      Finish Exam
                    </button>
                }
              </div>
            </div>
          );
        })()}

        {/* ══ QUICK REFERENCE TAB ═════════════════════════════════════════ */}
        {activeTab === 'ref' && (() => {
          const filtered = refSearch.trim()
            ? FC_CARDS.filter(c =>
                c.term.toLowerCase().includes(refSearch.toLowerCase()) ||
                c.def.toLowerCase().includes(refSearch.toLowerCase()))
            : FC_CARDS;

          return (
            <div className="fade-in">
              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <input
                  type="search" placeholder="Search terms and definitions…"
                  value={refSearch}
                  onChange={e => setRefSearch(e.target.value)}
                  style={{
                    width: '100%', background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: '8px', padding: '0.6rem 0.875rem 0.6rem 2.25rem',
                    color: C.text, fontSize: '0.83rem', fontFamily: 'Inter, sans-serif',
                  }}
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>

              {/* Term count */}
              <div style={{ fontSize: '0.65rem', color: C.muted, marginBottom: '0.625rem' }}>
                {filtered.length} term{filtered.length !== 1 ? 's' : ''}{refSearch.trim() ? ` matching "${refSearch.trim()}"` : ''}
              </div>

              {/* Term list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {filtered.map(c => {
                  const d = DOMAINS.find(dom => dom.id === c.d);
                  return (
                    <div key={c.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '0.75rem 0.875rem', borderLeft: `3px solid ${d?.color || C.orange}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.83rem', fontWeight: '600', color: 'white' }}>{c.term}</span>
                          {c.actId && (
                            <span style={{ fontSize: '0.56rem', color: C.muted, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`, borderRadius: '3px', padding: '0.08rem 0.28rem', fontFamily: 'monospace' }}>
                              {c.actId}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.56rem', color: d?.color || C.muted, background: `${d?.color || C.orange}18`, border: `1px solid ${d?.color || C.orange}30`, borderRadius: '3px', padding: '0.08rem 0.3rem', whiteSpace: 'nowrap' }}>
                          {d?.name || ''} · {d?.weight || ''}%
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: C.mutedHi, lineHeight: '1.6', margin: 0 }}>{c.def}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ══ STUDY GUIDE TAB ═════════════════════════════════════════════ */}
        {activeTab === 'guide' && (() => {
          const qItem    = STUDY_GUIDE.quiz[sgQIdx];
          const essayItem = STUDY_GUIDE.essays[sgEssayIdx];
          const revealed = sgRevealed.has(qItem?.id);
          const revealedCount = STUDY_GUIDE.quiz.filter(q => sgRevealed.has(q.id)).length;

          return (
            <div className="fade-in">
              {/* Mode toggle */}
              <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem' }}>
                {[['quiz','Short-Answer Quiz (10Q)'],['essays','Essay Prompts (5)']].map(([m,l]) => (
                  <button key={m} onClick={() => setSgMode(m)}
                    style={btnBase({
                      flex: 1,
                      background: sgMode === m ? C.cardHi : 'rgba(255,255,255,0.03)',
                      color: sgMode === m ? 'white' : C.muted,
                      border: `1px solid ${sgMode === m ? C.borderHi : C.border}`,
                      padding: '0.5rem 0.75rem', fontSize: '0.75rem',
                    })}>{l}</button>
                ))}
              </div>

              {/* ── QUIZ MODE ── */}
              {sgMode === 'quiz' && (<>
                {/* Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(revealedCount / 10) * 100}%`, background: C.orange, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontSize: '0.65rem', color: C.muted, whiteSpace: 'nowrap' }}>
                    {revealedCount}/10 reviewed
                  </span>
                  {revealedCount > 0 && (
                    <button onClick={() => setSgRevealed(new Set())}
                      style={btnBase({ fontSize: '0.62rem', background: 'rgba(239,68,68,0.07)', color: '#F87171', border: '1px solid rgba(239,68,68,0.18)', padding: '0.25rem 0.5rem' })}>
                      Reset
                    </button>
                  )}
                </div>

                {/* Question card */}
                <div style={{ ...card(), marginBottom: '0.875rem', borderLeft: `3px solid ${C.orange}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                    <span style={{ fontSize: '0.62rem', color: C.orange, fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                      Q{sgQIdx + 1} of 10
                    </span>
                    <span style={{ fontSize: '0.6rem', color: sgRevealed.has(qItem.id) ? C.green : C.muted }}>
                      {sgRevealed.has(qItem.id) ? '✓ reviewed' : 'not yet revealed'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.925rem', color: C.text, lineHeight: '1.65', fontWeight: '500', marginBottom: revealed ? '1rem' : 0 }}>
                    {qItem.q}
                  </p>

                  {/* Answer reveal */}
                  {revealed ? (
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '0.875rem' }}>
                      <div style={{ fontSize: '0.6rem', color: C.muted, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Official Answer Key</div>
                      <p style={{ fontSize: '0.83rem', color: '#86EFAC', lineHeight: '1.65' }}>
                        {qItem.a}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSgRevealed(prev => new Set([...prev, qItem.id]))}
                      style={btnBase({
                        marginTop: '0.875rem',
                        background: 'rgba(245,132,31,0.1)',
                        color: C.orange,
                        border: `1px solid rgba(245,132,31,0.3)`,
                        padding: '0.5rem 1.25rem',
                        fontSize: '0.78rem',
                      })}>
                      Reveal Answer
                    </button>
                  )}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => setSgQIdx(i => Math.max(0, i - 1))} disabled={sgQIdx === 0}
                    style={btnBase({ background: 'rgba(255,255,255,0.04)', color: sgQIdx === 0 ? 'rgba(255,255,255,0.15)' : C.mutedHi, border: `1px solid ${C.border}`, cursor: sgQIdx === 0 ? 'default' : 'pointer' })}>
                    ← Prev
                  </button>
                  {/* Q dots */}
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {STUDY_GUIDE.quiz.map((q, i) => (
                      <button key={q.id} onClick={() => setSgQIdx(i)}
                        title={`Q${i+1}`}
                        style={{ width: '18px', height: '18px', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '0.55rem', fontWeight: '700',
                          background: i === sgQIdx ? C.orange : sgRevealed.has(q.id) ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.08)',
                          color: i === sgQIdx ? 'white' : sgRevealed.has(q.id) ? '#86EFAC' : C.muted,
                        }}>{i + 1}</button>
                    ))}
                  </div>
                  <button onClick={() => setSgQIdx(i => Math.min(9, i + 1))} disabled={sgQIdx === 9}
                    style={btnBase({ background: sgQIdx === 9 ? 'rgba(255,255,255,0.04)' : C.blueDark, color: sgQIdx === 9 ? 'rgba(255,255,255,0.15)' : 'white', cursor: sgQIdx === 9 ? 'default' : 'pointer' })}>
                    Next →
                  </button>
                </div>
              </>)}

              {/* ── ESSAY MODE ── */}
              {sgMode === 'essays' && (<>
                {/* Essay selector dots */}
                <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.875rem', justifyContent: 'center' }}>
                  {STUDY_GUIDE.essays.map((e, i) => (
                    <button key={e.id} onClick={() => { setSgEssayIdx(i); setSgEssayOut(''); setSgEssayErr(''); }}
                      style={btnBase({
                        padding: '0.3rem 0.65rem', fontSize: '0.68rem',
                        background: sgEssayIdx === i ? C.orange : 'rgba(255,255,255,0.04)',
                        color: sgEssayIdx === i ? 'white' : C.muted,
                        border: `1px solid ${sgEssayIdx === i ? C.orange : C.border}`,
                      })}>
                      Essay {i + 1}
                    </button>
                  ))}
                </div>

                {/* Essay card */}
                <div style={{ ...card(), marginBottom: '0.875rem', borderLeft: `3px solid ${C.blueDim}` }}>
                  <div style={{ fontSize: '0.6rem', color: C.blueDim, fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Essay {sgEssayIdx + 1} of 5
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.95rem', fontWeight: '700', color: 'white', marginBottom: '0.625rem', lineHeight: '1.4' }}>
                    {essayItem.title}
                  </h3>
                  <p style={{ fontSize: '0.83rem', color: C.mutedHi, lineHeight: '1.7', marginBottom: '0.875rem' }}>
                    {essayItem.prompt}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => { setSgEssayOut(''); setSgEssayErr(''); runEssayOutline(essayItem); }}
                      disabled={sgEssayLoading}
                      style={btnBase({
                        background: sgEssayLoading ? 'rgba(29,78,216,0.45)' : C.blueDark,
                        color: 'white', opacity: sgEssayLoading ? 0.7 : 1,
                        cursor: sgEssayLoading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                      })}>
                      {sgEssayLoading
                        ? <><span style={{ display: 'inline-block', animation: 'spin 0.85s linear infinite' }}>⟳</span> Generating…</>
                        : 'Generate Essay Outline'}
                    </button>
                    {sgEssayOut && (
                      <span style={{ fontSize: '0.65rem', color: C.muted }}>(AI-generated outline based on HDI Standard)</span>
                    )}
                  </div>
                </div>

                {/* Essay outline output */}
                {(sgEssayLoading || sgEssayOut || sgEssayErr) && (
                  <div style={{ ...cardHi(), minHeight: '80px' }}>
                    <div style={{ fontSize: '0.6rem', color: C.blueDim, fontWeight: '700', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Essay Outline
                    </div>
                    {sgEssayLoading && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: C.muted, fontSize: '0.78rem' }}>
                        <div style={{ width: '14px', height: '14px', border: `2px solid ${C.blue}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        Generating outline from HDI Standard context…
                      </div>
                    )}
                    {!sgEssayLoading && sgEssayErr && (
                      <p style={{ fontSize: '0.78rem', color: '#F87171' }}>{sgEssayErr}</p>
                    )}
                    {!sgEssayLoading && sgEssayOut && (
                      <p style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{sgEssayOut}</p>
                    )}
                  </div>
                )}

                {/* Essay nav */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', marginTop: '0.875rem' }}>
                  <button onClick={() => { setSgEssayIdx(i => Math.max(0, i - 1)); setSgEssayOut(''); setSgEssayErr(''); }} disabled={sgEssayIdx === 0}
                    style={btnBase({ background: 'rgba(255,255,255,0.04)', color: sgEssayIdx === 0 ? 'rgba(255,255,255,0.15)' : C.mutedHi, border: `1px solid ${C.border}`, cursor: sgEssayIdx === 0 ? 'default' : 'pointer' })}>
                    ← Prev Essay
                  </button>
                  <button onClick={() => { setSgEssayIdx(i => Math.min(4, i + 1)); setSgEssayOut(''); setSgEssayErr(''); }} disabled={sgEssayIdx === 4}
                    style={btnBase({ background: sgEssayIdx === 4 ? 'rgba(255,255,255,0.04)' : C.blueDark, color: sgEssayIdx === 4 ? 'rgba(255,255,255,0.15)' : 'white', cursor: sgEssayIdx === 4 ? 'default' : 'pointer' })}>
                    Next Essay →
                  </button>
                </div>
              </>)}
            </div>
          );
        })()}

        {/* ── FOOTER ── */}
        <footer style={{
          marginTop: '1.5rem', paddingTop: '0.875rem',
          borderTop: `1px solid rgba(255,255,255,0.04)`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.5rem',
        }}>
          <span style={{ fontSize: '0.64rem', color: '#475569' }}>
            HDI-SCA Study Planner · INT Technology Services · Not affiliated with HDI
          </span>
          <a href="https://www.thinkhdi.com/certification/professional"
            target="_blank" rel="noreferrer"
            style={{ fontSize: '0.64rem', color: '#60A5FA', textDecoration: 'none' }}>
            HDI Certification Resources →
          </a>
        </footer>

      </div>{/* end container */}
    </div>
  );
}

// Wrap in ErrorBoundary for production fault isolation
export default function App() {
  return (
    <ErrorBoundary>
      <CalculatorApp />
    </ErrorBoundary>
  );
}
