import React, { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, AlertTriangle, Flag, Compass, Mic } from 'lucide-react';

// ---------------------------------------------------------------------------
// CONTENT — 12-month Voice & Realtime Arc
// Kyle-specific: text chat is the current paradigm, voice is the next.
// OpenAI Realtime API, Pipecat, sub-700ms perceived latency, real applications.
// ---------------------------------------------------------------------------

const ARC = [
  {
    quarter: 'Q1',
    phase: 'AUDIO FOUNDATIONS',
    subtitle: 'Latency budget, ASR, TTS — the three components of the speech pipeline mastered before the agent.',
    months: [
      {
        n: 1,
        title: 'The latency budget — voice begins with milliseconds',
        why: 'Every other arc treats latency as a "make it fast enough" concern. Voice arcs treat it as the primary engineering constraint. Sub-700ms perceived turn latency is the bar — past 800ms a voice agent feels broken, past 1200ms users disengage entirely. This month establishes the budget mental model: VAD + ASR + LLM + TTS + network = your turn time, and every component competes for the same pool.',
        weeks: [
          'Audio fundamentals: sample rates (16kHz vs 24kHz vs 48kHz), encodings (PCM, Opus, MP3), the tradeoffs each makes for voice agents specifically. Build a spike that records, encodes, and plays back audio. Most voice work assumes 16kHz Opus — know why.',
          'The latency budget exercise: map out a single turn from "user stops speaking" to "assistant starts speaking." Document every component (VAD ~50ms, ASR ~100-200ms, LLM ~200-400ms, TTS ~100-200ms, network ~50-150ms). Your sub-700ms target is the sum of these decisions.',
          'VAD and end-of-turn detection: the underrated hard problem. Silero VAD setup, threshold tuning, the "is the user done speaking?" decision. Bad VAD cuts users off mid-sentence (worst) or waits 2 seconds for them to start over (almost as bad). Tune it on your own voice first.',
          'Streaming Claude text output: the foundation for every voice agent that uses the pipeline approach (vs Realtime API). Server-sent events, partial completion handling, cancelable streams. Measure the time-to-first-token from your closest Anthropic region.',
        ],
        gate: 'A documented latency budget for one voice agent type with target milliseconds per component. Working VAD with tuned thresholds. Streaming Claude output with measured time-to-first-token. The numbers are real, not estimated.',
      },
      {
        n: 2,
        title: 'ASR — speech-to-text, the input layer',
        why: 'The user\'s voice becomes text the LLM can reason over. Whisper is the obvious starting point but rarely the production answer for low-latency agents — Deepgram, Google, AssemblyAI all win on real-time transcription latency. This month is the input layer survey, decision, and integration.',
        weeks: [
          'Whisper API basics: synchronous transcription for testing, the cost model, the language support, the accuracy on noisy or accented speech. Build a spike with the OpenAI Whisper API and a self-hosted whisper.cpp variant. Compare latency.',
          'Streaming ASR providers: Deepgram Nova (most popular for voice agents), OpenAI Realtime ASR, Google Cloud Speech-to-Text streaming, AssemblyAI. Pick one based on latency targets and cost. Most production voice agents under 800ms total latency use Deepgram.',
          'Self-hosted vs API decision: at scale, self-hosted Whisper on a GPU can be cheaper than API calls. The break-even is usually 100k+ minutes per month. Document the decision tree for your use cases.',
          'Partial transcript handling: streaming ASR produces hypothesis updates that change as the model gains confidence. The downstream LLM, the UI, and the end-of-turn logic all need to handle partial vs final transcripts. Build the abstraction once, reuse forever.',
        ],
        gate: 'A streaming ASR pipeline with measurable latency under 200ms time-to-first-partial. Partial transcript handling working end-to-end. Cost model documented for both API and self-hosted paths. Decision tree written for each use case type.',
      },
      {
        n: 3,
        title: 'TTS — text-to-speech, the output layer',
        why: 'TTS is where voice agents either feel professional or feel like 2018 Alexa. Quality matters enormously — bad TTS loses users in the first 30 seconds. Latency matters too — streaming TTS that starts playing before the LLM finishes is the production pattern. This month chooses the voice and engineers the streaming.',
        weeks: [
          'TTS provider survey: ElevenLabs (highest quality, premium pricing), OpenAI TTS (good quality, moderate pricing), Cartesia Sonic (newer, fastest), Azure Speech (cheapest, good quality), Google Cloud TTS, self-hosted XTTS. For each, generate the same paragraph and compare quality, latency, cost.',
          'Streaming TTS: the chunk-based generation pattern that lets audio start playing while text is still being generated by the LLM. Cartesia and ElevenLabs both support sub-100ms streaming. Build the streaming integration end-to-end on one provider.',
          'Voice selection and consistency: stock voices vs custom cloned voices. Most enterprise deployments use stock voices for consent and compliance reasons. Pick one stock voice for testing and stick with it across the arc — voice consistency matters.',
          'Audio playback patterns: queue-based playback for streaming TTS chunks, interruption handling (user starts talking — drop the queue, fade the audio), the audio buffer management that prevents stuttering. The hardest production engineering problem in voice agents.',
        ],
        gate: 'A streaming TTS pipeline with chunked output and proper queue management. Interruption handling tested with real user audio. Provider chosen with documented rationale. End-to-end audio quality validated on at least one external listener.',
      },
    ],
  },
  {
    quarter: 'Q2',
    phase: 'REALTIME PIPELINE',
    subtitle: 'OpenAI Realtime API, Pipecat framework, WebRTC transport — the production voice agent stack.',
    months: [
      {
        n: 4,
        title: 'OpenAI Realtime API — speech-to-speech model',
        why: 'The Realtime API bypasses the ASR-LLM-TTS pipeline by directly accepting audio input and producing audio output. Lower latency (sub-300ms achievable), higher cost, less control over each component. This month is the deep evaluation: when does Realtime win vs the pipeline approach?',
        weeks: [
          'Realtime API basics: WebSocket connection, audio in/out streams, function calling, the session model. Build a spike that runs a real voice conversation through the Realtime API. Measure the actual latency vs your M1-M3 pipeline baseline.',
          'Capabilities and limits: what Realtime does well (low latency, natural turn-taking, emotional prosody) and what it doesn\'t (multi-modal output, deep tool chains, fine-grained voice control, cost predictability at scale). Document the decision tree.',
          'Cost analysis: Realtime API audio tokens cost significantly more than text tokens. For a 10-minute conversation, what\'s the actual bill? When does Realtime\'s latency advantage justify the cost premium, and when does the pipeline approach win economically?',
          'Function calling in Realtime: voice agents that take actions (book meetings, query CRM, send messages) ship business value. Voice agents that only chat ship demos. Build one Realtime agent with at least 3 working function calls.',
        ],
        gate: 'A working voice conversation through the OpenAI Realtime API with at least 3 function calls. Measured latency vs M1-M3 pipeline baseline. Cost analysis for representative use cases. Decision tree for Realtime vs pipeline written.',
      },
      {
        n: 5,
        title: 'Pipecat — the voice agent framework',
        why: 'Building voice agents from scratch means orchestrating ASR + LLM + TTS + VAD + transport + interrupt handling + session state. Pipecat (Daily.co\'s open-source framework) handles the orchestration so you focus on agent logic. Vocode is the alternative. Most production voice agents that need pipeline-level control use one of these.',
        weeks: [
          'Pipecat architecture: the pipeline model where frames flow through processors, the built-in components (Deepgram, Cartesia, Daily transport, ElevenLabs), the extension points for custom processors. Read the source — it is small enough to read end-to-end.',
          'Wrap an existing agent in voice: take the Bitwarden migration agent, the Drive automation chain, or a Customization Service workflow. Keep the agent logic identical; add a voice interface using Pipecat. The agent logic stays; the interface changes.',
          'Latency optimization in Pipecat: parallel ASR processing, streaming TTS, optimized turn-taking, prompt caching. Measure the latency before and after each optimization. The full optimization pass typically reduces perceived latency by 200-300ms.',
          'Custom processors: when you need behavior not in the framework — a prompt rewriter, a guardrail check, a custom TTS wrapper. Build one custom processor end-to-end. The processor pattern is what makes Pipecat extensible without forking.',
        ],
        gate: 'A production-grade voice agent built on Pipecat wrapping an existing text agent. Sub-800ms perceived latency measured. At least one custom processor extending framework behavior. Latency optimization deltas documented.',
      },
      {
        n: 6,
        title: 'WebRTC transport, telephony, deployment',
        why: 'A voice agent on your laptop is a demo. A voice agent in production needs WebRTC transport for browser/mobile users, telephony integration for phone calls, session management for disconnects, and real deployment with regional latency considerations. This is the production transport layer.',
        weeks: [
          'WebRTC fundamentals: ICE, STUN, TURN, the connection negotiation. Most voice agents use a managed service (LiveKit, Daily, Agora) rather than raw WebRTC — pick one and integrate. The 80/20 of production voice transport is choosing the right service, not building your own.',
          'Telephony integration: Twilio Programmable Voice for inbound and outbound phone calls, the Stream API for connecting Twilio audio bidirectionally to your voice agent, SIP for enterprise PBX integration. The hardest production transport problem because PSTN audio is 8kHz and lossy.',
          'Session management: handling disconnects, reconnects, conversation persistence across sessions. Voice sessions are typically short and ephemeral, but high-fidelity — losing context mid-call is worse than text agents losing context mid-conversation. Build the state model deliberately.',
          'Deployment and regional latency: voice agents on Cloud Run, Fly.io (excellent for voice — low cold start, easy multi-region), or specialized infra. Multi-region deployment for global latency. Sub-700ms total budget means region selection contributes ~50-100ms — not negotiable.',
        ],
        gate: 'A voice agent deployed on managed WebRTC transport, accessible via web call. Telephony integration tested with a real phone number. Session management with disconnect/reconnect verified. Multi-region deployment plan documented with latency targets per region.',
      },
    ],
  },
  {
    quarter: 'Q3',
    phase: 'APPLICATIONS & PRODUCTION',
    subtitle: 'Two real voice applications shipped. Production observability, safety, and compliance.',
    months: [
      {
        n: 7,
        title: 'Application 1 — meeting assistant',
        why: 'The first real application. Meeting assistants — bots that join video calls, transcribe, extract action items, generate summaries — are one of the most common enterprise voice use cases and a strong first deliverable. Tests speaker diarization, real-time transcription, action item extraction, and structured output generation in one product.',
        weeks: [
          'Meeting bot architecture: how to get audio out of Zoom/Teams/Meet (recording APIs, bot participants like Recall.ai), the legal/consent layer for recording, the audio processing pipeline. Recall.ai handles the platform integration so you focus on the agent logic.',
          'Real-time transcription with speaker attribution: who said what. Diarization is hard — Daily.co built-in, Pyannote for self-hosted, Deepgram with diarization mode. Pick one and integrate. False speaker attribution erodes trust faster than missing transcription.',
          'Live action item detection: as the meeting progresses, detect commitments and assignments using LLM-as-extractor. The challenge: low false positive rate. False action items destroy trust faster than missing real ones. Calibrate against real meeting recordings before shipping.',
          'Post-meeting structured summary: topic, decisions, action items with owner and due date, follow-ups, the format that makes the summary actually useful. Cross-reference with the Eval arc M2 dataset design — this is the kind of output that needs eval calibration.',
        ],
        gate: 'A working meeting assistant deployed and tested on at least 5 real meetings. Documented accuracy on action item extraction. Generated summaries reviewed by meeting participants and rated useful (or specific feedback collected on what was missed).',
      },
      {
        n: 8,
        title: 'Application 2 — voice-first internal tool',
        why: 'Application 2 — an Intinc-internal voice-first tool for a workflow that genuinely benefits from being hands-free. Voice agents that replace text-based tools with no real benefit are demos. Voice agents that make a daily workflow faster or possible-while-driving are products. Pick the workflow that meets that bar.',
        weeks: [
          'Use case definition: pick one Intinc workflow where voice would genuinely be better than typing. "What\'s the status of [client]?" or "Schedule a follow-up with [contact] next Tuesday at 2pm." The workflow has to be simple enough for voice, common enough to justify the build, complete enough to ship.',
          'Build the agent: voice interface, tool calls (CRM lookup, calendar API, ticketing system, internal Intinc systems), response patterns. Use Pipecat or Realtime API based on the M4 decision tree.',
          'Real user deployment: one Intinc colleague uses it for a week of real work. Daily check-ins. What works? What breaks? What is genuinely faster than typing? What is annoying? The feedback loop is the value, not the build.',
          'Iteration and v1.1: based on the week of use, ship v1.1 with the top three changes. Measure whether the changes moved the user\'s actual usage frequency. If they used it twice in week 1 and once in week 2 of v1.1, the product is not landing — re-scope before continuing.',
        ],
        gate: 'A voice-first internal tool deployed and used by one real Intinc user for a full week. Documented usage frequency, friction points, and iteration cycle. v1.1 shipped with measurable improvements.',
      },
      {
        n: 9,
        title: 'Production hardening — observability, safety, compliance',
        why: 'Voice agents in production are different from text agents. Audio data has compliance implications (HIPAA, GDPR, recording consent). Latency monitoring is per-component, not per-request. Cost monitoring is critical because voice cost compounds fast — a poorly optimized agent burns hundreds of dollars per day at scale.',
        weeks: [
          'Observability for voice: per-turn latency tracking with component breakdown, per-call cost tracking, quality monitoring (audio dropouts, ASR confidence, TTS errors). Build the dashboards that show what is actually happening in production, not what you assume is happening.',
          'Safety and content moderation: ASR captures everything users say, including PII. TTS generates everything the LLM produces, including potential hallucinations. Build the moderation layer for both directions — input scrubbing for PII, output filtering for harmful content. The Security Arc M2 work applied to audio.',
          'Recording, consent, compliance: what gets recorded, who has access, retention policies, the consent flow. Two-party consent states require explicit notification at call start. HIPAA and GDPR considerations for healthcare and EU users. Document the compliance posture before regulators ask.',
          'The voice agent runbook: alert thresholds for audio quality degradation, TTS provider failures, ASR transcript anomalies, latency spikes. The on-call playbook for "users report the agent sounds choppy" — most voice issues are latency or transport issues, not LLM issues.',
        ],
        gate: 'A voice agent in production with full observability dashboards. Safety moderation in both directions tested with adversarial inputs. Compliance posture documented. Production runbook covering the top 5 voice failure modes.',
      },
    ],
  },
  {
    quarter: 'Q4',
    phase: 'FLAGSHIP & PUBLISH',
    subtitle: 'The flagship voice product launched. Methodology published. Voice as a productized AIaaS service line.',
    months: [
      {
        n: 10,
        title: 'Build the flagship voice product',
        why: 'M7 and M8 proved the pattern. M10 builds the flagship — the voice product worth being known for. Pick the highest-value use case from your work that has a real path to revenue or significant adoption. Go deep on the design, not just the technical build.',
        weeks: [
          'Pick the flagship use case: an internal Intinc tool that becomes a service line, a FlashFusion client tool that becomes a referenceable case study, or a public voice product targeting your security-first practitioner audience. The use case must have a path to either revenue or strategic positioning, not just technical demonstration.',
          'Design before build: voice UX patterns specific to this product, agent personality, the failure mode recovery scripts (silence detection, interruption handling, off-topic recovery, repetition handling). Voice agents fail differently from text — the design has to anticipate the failure modes explicitly.',
          'Build the spine: core agent logic, tool integrations, deployment infrastructure, end-to-end happy path working. By the end of week 3, the agent can complete its primary use case in real conditions with at least one real user.',
          'Build the failure modes: the agent has to handle silence (user thinking? user gone? prompt them after 8 seconds), interruption (user starts talking — fade out, listen), off-topic (user asks something unrelated — graceful redirect), confusion (LLM produces something nonsensical — recovery message). Each failure mode is designed, not accidental.',
        ],
        gate: 'A flagship voice product end-to-end with documented failure mode recovery for at least 5 named scenarios. One real user beyond Kyle has used it for a real task. The product feels professional, not engineered.',
      },
      {
        n: 11,
        title: 'Polish, latency optimization, production-grade',
        why: 'The flagship needs to feel professional. M11 is the optimization pass — every component measured, every latency hot path optimized, every interaction polished. The difference between "AI demo" and "AI product" is largely M11 work.',
        weeks: [
          'Latency optimization deep dive: measure every component end-to-end, identify the bottleneck, optimize it, re-measure. Iterate. Most voice agents have one component consuming 60% of perceived latency — find it, fix it. Common culprits: synchronous TTS waiting for full LLM response, ASR finalization delay, suboptimal region selection.',
          'Voice quality optimization: TTS prompt tuning for natural delivery (proper pauses, emphasis, pacing), pronunciation handling for proper nouns and acronyms, the "this sounds like AI" tells that you can engineer out. Voice quality is harder to fix later than to build correctly.',
          'Conversation design polish: every spoken word the agent says has been read aloud, edited, and tested. The system prompt, the tool descriptions, the error responses, the personality. Voice agents say their words out loud — wooden language is more obvious than in text.',
          'Cost optimization: which API calls can be cached, which can be reduced, which model can be swapped for a smaller one. Voice cost compounds — a 5% per-turn cost reduction is 5% of every minute the agent runs. Document cost-per-minute as a tracked metric.',
        ],
        gate: 'Flagship voice agent at sub-700ms median perceived latency. Polished voice quality validated by external listeners. Documented cost-per-minute as a tracked metric. Production runbook updated with current performance baselines.',
      },
      {
        n: 12,
        title: 'Launch, publish methodology, and the year retrospective',
        why: 'Twelve months of voice work. The flagship is built and polished. M12 is the public launch, the methodology publication that turns this arc into brand asset, and the retrospective that ties the arc to the next year of voice work — including the multimodal direction the field is moving.',
        weeks: [
          'Launch the flagship: ProductHunt for public products, internal launch at Intinc for company tools, client deployment for FlashFusion engagements. The launch is what turns the build into something that exists in the world rather than something on your laptop.',
          'Publish the methodology: a long-form post or video about building production voice agents — the latency budget worksheet from M1, the framework decision tree from M4-M5, the production hardening checklist from M9, the cost optimization patterns from M11. The artifact other practitioners actually use.',
          'Voice agent service offering: package the methodology as a productized AIaaS service line. "Build a production voice agent in 90 days" with a defined deliverable, defined price, defined client profile. The Partner Network listing updated to feature voice as a named capability.',
          'Year retrospective: what changed in your understanding when voice became a paradigm? What does Y2 look like — multimodal agents, voice-first products, the agentic voice pattern (voice agents that take real-world actions autonomously)? The retro feeds the Personal Brand arc Q4 work.',
        ],
        gate: 'Flagship launched publicly. Methodology published with at least one external practitioner referencing it. Voice service line defined with at least one paid commitment. Year retrospective written and integrated into the Personal Brand arc Q4 retrospective.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// VOICE STRIP — four pipeline components + one cross-cutting metric
// ---------------------------------------------------------------------------
const VOICE_DIMS = [
  { type: 'component', label: 'Pipeline', name: 'ASR',         sub: 'Speech-in · M2',         fill: 90  },
  { type: 'component', label: 'Pipeline', name: 'LLM',         sub: 'Reasoning · M4',         fill: 100 },
  { type: 'component', label: 'Pipeline', name: 'TTS',         sub: 'Speech-out · M3',        fill: 85  },
  { type: 'component', label: 'Pipeline', name: 'Transport',   sub: 'WebRTC · phone · M6',    fill: 70  },
  { type: 'metric',    label: 'Constraint', name: 'Latency',   sub: 'Sub-700ms · M1 onward',  fill: 100 },
];

// ---------------------------------------------------------------------------
// STYLES — Voice & Realtime Arc / purple on deep purple-black
// ---------------------------------------------------------------------------
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* { box-sizing: border-box; }

:root {
  --bg:           #0e0a18;
  --bg-2:         #160e26;
  --fg:           #ede7f5;
  --fg-dim:       #9784b3;
  --accent:       #a855f7;
  --accent-2:     #c084fc;
  --accent-dim:   #9333ea;
  --gate:         #fb923c;
  --metric:       #f0abfc;
  --muted:        #3d2a55;
  --card:         #150f23;
  --border:       #241836;
  --border-bright:#332550;
}

body, .arc-root {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 14px; line-height: 1.55; -webkit-font-smoothing: antialiased;
}

.arc-root {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168,85,247,0.10), transparent 60%),
    radial-gradient(ellipse 55% 35% at 100% 100%, rgba(251,146,60,0.05), transparent 65%),
    var(--bg);
  padding: 48px 24px 96px;
}

.container { max-width: 1120px; margin: 0 auto; }

.header-grid {
  display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: end;
  padding-bottom: 32px; border-bottom: 1px solid var(--border); margin-bottom: 48px;
}
.kicker {
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em;
  color: var(--accent); margin: 0 0 16px; display: flex; align-items: center; gap: 8px;
}
.title-serif {
  font-family: 'Instrument Serif', serif; font-size: clamp(42px, 6vw, 76px);
  line-height: 0.95; letter-spacing: -0.02em; margin: 0; font-weight: 400; color: var(--fg);
}
.title-serif em { color: var(--accent); font-style: italic; }
.title-sub { font-size: 13px; color: var(--fg-dim); margin: 16px 0 0; max-width: 54ch; }
.meta { text-align: right; font-size: 11px; color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.12em; }
.meta strong { color: var(--accent); font-weight: 500; }

.voice-strip {
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  margin-bottom: 48px; border: 1px solid var(--border); overflow: hidden;
}
.voice-item { padding: 16px 16px 20px; border-right: 1px solid var(--border); position: relative; }
.voice-item:last-child { border-right: none; }
.voice-item.is-metric { background: rgba(240,171,252,0.05); border-left: 1px solid rgba(240,171,252,0.22); }

.voice-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--fg-dim); margin-bottom: 5px; }
.voice-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; line-height: 1.15; font-weight: 400; margin-bottom: 3px;
}
.is-component .voice-name { color: var(--accent); }
.is-metric    .voice-name { color: var(--metric); }
.voice-sub { font-size: 9px; letter-spacing: 0.08em; text-transform: uppercase; }
.is-component .voice-sub { color: rgba(168,85,247,0.65); }
.is-metric    .voice-sub { color: rgba(240,171,252,0.7); }
.voice-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--border); }
.is-component .voice-bar-fill { background: var(--accent); height: 100%; opacity: 0.85; }
.is-metric    .voice-bar-fill { background: var(--metric); height: 100%; opacity: 0.85; }

.tradeoff {
  border: 1px solid var(--accent); border-left-width: 3px;
  background: linear-gradient(90deg, rgba(168,85,247,0.07), rgba(168,85,247,0.01));
  padding: 20px 24px; margin-bottom: 56px;
  display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start;
}
.tradeoff-icon { color: var(--accent); margin-top: 2px; }
.tradeoff h3 {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 20px; margin: 0 0 8px; color: var(--accent); font-weight: 400;
}
.tradeoff-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 12px; font-size: 12.5px;
}
.tradeoff-grid h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: var(--fg-dim); margin: 0 0 6px; }
.tradeoff-grid ul { margin: 0; padding-left: 16px; color: var(--fg); }
.tradeoff-grid li { margin-bottom: 4px; }
.latency-note {
  margin-top: 14px; padding: 12px 16px;
  border: 1px dashed var(--border-bright); background: rgba(168,85,247,0.03);
  font-size: 12.5px; color: var(--fg);
}
.latency-note strong { color: var(--accent); }

.quarter-rail {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  margin-bottom: 40px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
.qtab {
  padding: 20px 18px; cursor: pointer; background: transparent; border: none;
  border-right: 1px solid var(--border); text-align: left; color: var(--fg-dim);
  transition: background 0.2s, color 0.2s; font-family: 'JetBrains Mono', monospace; position: relative;
}
.qtab:last-child { border-right: none; }
.qtab:hover  { background: var(--bg-2); color: var(--fg); }
.qtab.active { background: var(--bg-2); color: var(--fg); }
.qtab.active::before {
  content: ''; position: absolute; top: -1px; left: 0; right: 0; height: 2px; background: var(--accent);
}
.qtab-num { font-size: 10px; letter-spacing: 0.2em; color: var(--accent); text-transform: uppercase; }
.qtab-phase {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: 22px; line-height: 1.1; margin: 6px 0 4px; color: inherit; font-weight: 400;
}
.qtab.active .qtab-phase { color: var(--fg); }
.qtab-sub { font-size: 11px; color: var(--fg-dim); line-height: 1.4; }

.months { display: grid; gap: 16px; }
.month { border: 1px solid var(--border); background: var(--card); transition: border-color 0.2s; }
.month:hover { border-color: var(--border-bright); }
.month.open  { border-color: var(--accent); }

.month-head {
  padding: 20px 24px; cursor: pointer;
  display: grid; grid-template-columns: 80px 1fr auto; gap: 24px; align-items: center; user-select: none;
}
.month-num {
  font-family: 'Instrument Serif', serif; font-size: 48px; line-height: 1;
  color: var(--accent); font-style: italic; font-weight: 400;
}
.month-title { font-size: 15px; font-weight: 500; color: var(--fg); margin: 0 0 4px; letter-spacing: -0.01em; }
.month-why   { font-size: 12px; color: var(--fg-dim); margin: 0; max-width: 64ch; }
.month-chev  { color: var(--fg-dim); transition: transform 0.25s; }
.month.open .month-chev { transform: rotate(90deg); color: var(--accent); }

.month-body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.month.open .month-body { max-height: 900px; }
.month-body-inner { padding: 4px 24px 24px; border-top: 1px dashed var(--border); margin-top: 4px; }

.weeks { display: grid; gap: 8px; margin: 16px 0 20px; }
.week {
  display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: start;
  padding: 10px 12px; background: var(--bg-2); border-left: 2px solid var(--border-bright);
  cursor: pointer; transition: border-color 0.15s, background 0.15s;
}
.week:hover { border-left-color: var(--accent); }
.week.done  { border-left-color: var(--accent); background: rgba(168,85,247,0.06); }
.week-label { font-size: 10px; color: var(--fg-dim); letter-spacing: 0.14em; padding-top: 3px; white-space: nowrap; }
.week-text  { font-size: 12.5px; color: var(--fg); line-height: 1.55; }
.week.done .week-text { color: var(--fg-dim); text-decoration: line-through; text-decoration-color: rgba(168,85,247,0.4); }
.week-check { color: var(--muted); transition: color 0.15s; }
.week.done .week-check { color: var(--accent); }

.gate {
  display: grid; grid-template-columns: auto 1fr; gap: 12px;
  padding: 14px 16px; border: 1px solid rgba(251,146,60,0.3); background: rgba(251,146,60,0.04); align-items: start;
}
.gate-icon  { color: var(--gate); margin-top: 1px; }
.gate-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: var(--gate); margin-bottom: 4px; }
.gate-text {
  font-size: 13px; color: var(--fg);
  font-family: 'Instrument Serif', serif; font-style: italic; line-height: 1.45;
}

.progress-wrap {
  position: sticky; top: 0; background: var(--bg);
  padding: 12px 0 16px; margin-bottom: 24px; z-index: 10; border-bottom: 1px solid var(--border);
}
.progress-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
.progress-label { font-size: 10px; letter-spacing: 0.2em; color: var(--fg-dim); text-transform: uppercase; }
.progress-val   { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 20px; color: var(--accent); }
.progress-track { height: 2px; background: var(--border); position: relative; overflow: hidden; }
.progress-fill  { position: absolute; top: 0; left: 0; bottom: 0; background: var(--accent); transition: width 0.4s ease; }

.claims {
  margin-top: 72px; padding: 24px; border: 1px solid var(--border);
  background: var(--bg-2); font-size: 11.5px; color: var(--fg-dim); line-height: 1.7;
}
.claims h4 { font-size: 10px; letter-spacing: 0.22em; color: var(--fg); text-transform: uppercase; margin: 0 0 10px; }
.claims code { color: var(--accent-2); background: rgba(168,85,247,0.1); padding: 1px 6px; font-size: 11px; }
.claims ul { margin: 6px 0; padding-left: 18px; }
.claims li { margin-bottom: 4px; }

@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { opacity: 0; animation: rise 0.55s ease forwards; }
.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.10s; }
.stagger > *:nth-child(3) { animation-delay: 0.16s; }
.stagger > *:nth-child(4) { animation-delay: 0.22s; }
.stagger > *:nth-child(5) { animation-delay: 0.28s; }

@media (max-width: 720px) {
  .header-grid { grid-template-columns: 1fr; }
  .meta { text-align: left; }
  .voice-strip { grid-template-columns: 1fr 1fr; }
  .voice-item:nth-child(2) { border-right: none; }
  .voice-item:nth-child(-n+4):not(:nth-child(2)) { border-bottom: 1px solid var(--border); }
  .tradeoff-grid { grid-template-columns: 1fr; }
  .quarter-rail { grid-template-columns: 1fr 1fr; }
  .qtab:nth-child(2) { border-right: none; }
  .qtab:nth-child(-n+2) { border-bottom: 1px solid var(--border); }
  .month-head { grid-template-columns: 56px 1fr auto; gap: 16px; padding: 16px; }
  .month-num { font-size: 36px; }
  .month-body-inner { padding: 4px 16px 20px; }
}
`;

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function VoiceRealtimeArc() {
  const [activeQ,   setActiveQ]   = useState(0);
  const [openMonth, setOpenMonth] = useState(1);
  const [done,      setDone]      = useState(new Set());

  const totalWeeks = 48;
  const pct = Math.round((done.size / totalWeeks) * 100);

  const toggleWeek = (key) => {
    setDone((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const quarter = ARC[activeQ];

  return (
    <>
      <style>{STYLE}</style>
      <div className="arc-root">
        <div className="container">

          <div className="header-grid stagger">
            <div>
              <p className="kicker"><Mic size={12} /> Learning Ops // Realtime Lane</p>
              <h1 className="title-serif">The <em>Voice</em> Arc.</h1>
              <p className="title-sub">
                12 months. Text chat is the current paradigm. Voice is the next. The latency budget,
                the speech pipeline (ASR · LLM · TTS), the OpenAI Realtime API, Pipecat, WebRTC
                transport, three voice applications shipped, and a flagship voice product launched
                publicly with the methodology published as a productized service line.
              </p>
            </div>
            <div className="meta">
              <div>Built for <strong>Kyle Rosebrook</strong></div>
              <div style={{ marginTop: 4 }}>Horizon: <strong>Apr 2026 → Apr 2027</strong></div>
              <div style={{ marginTop: 4 }}>Target: <strong>Sub-700ms turn latency</strong></div>
              <div style={{ marginTop: 4 }}>Capstone: <strong>Flagship · service line</strong></div>
            </div>
          </div>

          <div className="voice-strip stagger">
            {VOICE_DIMS.map((s) => (
              <div key={s.name} className={`voice-item is-${s.type}`}>
                <div className="voice-label">{s.label}</div>
                <div className="voice-name">{s.name}</div>
                <div className="voice-sub">{s.sub}</div>
                <div className="voice-bar">
                  <div className="voice-bar-fill" style={{ width: `${s.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="tradeoff">
            <AlertTriangle size={20} className="tradeoff-icon" />
            <div style={{ width: '100%' }}>
              <h3>Tradeoff flag — latency is the constraint that bends every other decision.</h3>
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg)' }}>
                Every other technical arc balances multiple factors — quality, cost, complexity, time.
                Voice arcs balance everything against latency. Sub-700ms perceived turn latency is the
                bar; past 800ms the agent feels broken; past 1200ms users disengage entirely. Every
                architectural decision in this arc is evaluated first against the latency budget.
                Quality, cost, and feature richness all get cut to defend the budget.
              </p>
              <div className="tradeoff-grid">
                <div>
                  <h4>What you gain</h4>
                  <ul>
                    <li>The interaction paradigm that is genuinely arriving — meeting assistants, call center AI, voice-first internal tools — and almost nobody on the practitioner side is building well yet</li>
                    <li>Streaming UI patterns from Full-Stack arc M7 transfer almost entirely to voice — building both arcs is significantly cheaper than building either one twice</li>
                    <li>A live voice product is the most demonstrable artifact in the entire portfolio — clients can experience it in 60 seconds rather than reading documentation</li>
                    <li>Voice agent service line becomes a productized AIaaS offering with low fulfillment cost — most enterprises want voice agents but cannot build them</li>
                    <li>The market window matters here uniquely — early-mover advantage compresses fast as Realtime APIs commoditize the technical layer</li>
                  </ul>
                </div>
                <div>
                  <h4>What you give up / risk</h4>
                  <ul>
                    <li>MED load (5–7 hrs/week) but the work requires real-time debugging — voice failures are harder to reproduce than text failures, every issue is a recording-and-replay exercise</li>
                    <li>API spend is real and front-loaded — Realtime API at <code>$0.30/min</code> on output, ElevenLabs streaming, Deepgram streaming. Plan <code>$80–200/month</code> through Q2, <code>$200–400/month</code> through Q3-Q4 with real applications running</li>
                    <li>Voice quality is the most subjective evaluation in the series — what sounds natural to you may sound robotic to a real listener. Plan for external listener feedback every month</li>
                    <li>The market window pressure is real but easy to over-rotate on — building three rushed voice agents is worse than building one polished one</li>
                  </ul>
                </div>
              </div>
              <div className="latency-note">
                <strong>The rule that overrides every other architecture decision:</strong> if a
                feature breaks the latency budget, cut the feature. Voice agents are forgiven for
                being simpler than expected. They are not forgiven for feeling laggy. The 200ms
                difference between 600ms and 800ms perceived latency is the difference between
                "this feels like a person" and "this feels like a chatbot." Every M11 polish
                week is fundamentally a latency-protection week.
              </div>
            </div>
          </div>

          <div className="progress-wrap">
            <div className="progress-top">
              <span className="progress-label">Weekly sprints complete</span>
              <span className="progress-val">{done.size} / {totalWeeks} · {pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="quarter-rail">
            {ARC.map((q, i) => (
              <button
                key={q.quarter}
                className={`qtab ${i === activeQ ? 'active' : ''}`}
                onClick={() => setActiveQ(i)}
              >
                <div className="qtab-num">{q.quarter} · Months {q.months[0].n}–{q.months[q.months.length - 1].n}</div>
                <div className="qtab-phase">{q.phase}</div>
                <div className="qtab-sub">{q.subtitle}</div>
              </button>
            ))}
          </div>

          <div className="months">
            {quarter.months.map((m) => {
              const isOpen = openMonth === m.n;
              return (
                <div key={m.n} className={`month ${isOpen ? 'open' : ''}`}>
                  <div className="month-head" onClick={() => setOpenMonth(isOpen ? null : m.n)}>
                    <div className="month-num">M{String(m.n).padStart(2, '0')}</div>
                    <div>
                      <h3 className="month-title">{m.title}</h3>
                      <p className="month-why">{m.why}</p>
                    </div>
                    <ChevronRight className="month-chev" size={20} />
                  </div>
                  <div className="month-body">
                    <div className="month-body-inner">
                      <div className="weeks">
                        {m.weeks.map((w, wi) => {
                          const key    = `${m.n}-${wi}`;
                          const isDone = done.has(key);
                          return (
                            <div
                              key={key}
                              className={`week ${isDone ? 'done' : ''}`}
                              onClick={() => toggleWeek(key)}
                            >
                              <span className="week-label">W{wi + 1}</span>
                              <span className="week-text">{w}</span>
                              {isDone
                                ? <CheckCircle2 size={16} className="week-check" />
                                : <Circle       size={16} className="week-check" />}
                            </div>
                          );
                        })}
                      </div>
                      <div className="gate">
                        <Flag size={16} className="gate-icon" />
                        <div>
                          <div className="gate-label">Voice gate · M{m.n}</div>
                          <div className="gate-text">{m.gate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="claims">
            <h4>
              <Compass size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              CLAIMS &amp; ASSUMPTIONS
            </h4>
            <ul>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Latency is the unforgiving constraint.</strong> Sub-700ms perceived turn
                latency is the bar; past 800ms the agent feels broken; past 1200ms users disengage.
                Every architectural decision in this arc is evaluated first against the budget. The
                rule "if it breaks the budget, cut the feature" overrides every quality and richness
                argument. Most voice arc failures are budget overruns, not technical impossibilities.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>API spend is real and front-loaded.</strong> Voice APIs are more expensive
                per-minute than text APIs. Realistic monthly spend: <code>$80-200</code> through Q2
                while learning, <code>$200-400</code> through Q3-Q4 with real applications running.
                Set up cost alerting on every account in M2 — the bills compound silently and a
                bug in production can produce a four-figure surprise overnight.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Voice quality is the most subjective evaluation in the series.</strong> What
                sounds natural to you may sound robotic to a fresh listener. Plan for monthly external
                listener feedback from M3 onward — a five-minute call with one person who has not
                heard your agent before catches what self-evaluation misses entirely. The Eval arc
                M6 LLM-as-judge calibration patterns transfer here for some metrics, but voice
                quality fundamentally needs human ears.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>This arc cross-leverages the Full-Stack arc heavily.</strong> The streaming
                UI patterns from Full-Stack M7 transfer almost entirely. The deployment patterns from
                Full-Stack M5 apply directly. The auth and multi-tenancy from M3 and M8 apply when
                voice agents need user accounts. Running this arc after Full-Stack reduces the
                effective load by 20-30% — the patterns are familiar before they appear in voice
                context.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>The market window pressure is real but easy to over-rotate on.</strong> The
                early-mover advantage in voice agents will compress as Realtime APIs commoditize the
                technical layer over the next 12-18 months. But three rushed voice agents are worse
                than one polished one. The flagship in M10-M12 must be the polished one — the
                portfolio piece that demonstrates voice work that is not a tutorial output.
              </li>
              <li>
                <strong style={{ color: 'var(--fg)' }}>Voice debugging is fundamentally harder than text debugging.</strong> Voice
                failures often involve audio quality, network conditions, transport-level issues, or
                timing-sensitive bugs that don\'t reproduce in development. The M9 production
                hardening is not optional — observability that captures audio recordings, latency
                breakdowns, and component-level metrics is the only way to debug production voice
                failures. Build the observability before you need it, not during the incident.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </>
  );
}
