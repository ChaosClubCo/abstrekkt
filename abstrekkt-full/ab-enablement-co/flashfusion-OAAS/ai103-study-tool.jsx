import { useState, useEffect, useRef } from "react";

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : '212,137,58';
}
function fmtTime(ms) {
  if (!ms && ms !== 0) return '--:--:--';
  const s = Math.floor(Math.max(0,ms) / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`;
}
const CONF = ['','Very Low','Low','Medium','High','Very High'];

const DOMAINS = [
  {
    id:'plan', short:'Plan & Manage', label:'Plan & Manage Azure AI',
    weight:28, range:'25–30%', color:'#d4893a',
    concepts:[
      { title:'Model Selection', pts:[
        'LLM → complex reasoning, long context windows',
        'SLM → fast, cheap, edge/offline deployment',
        'Multimodal → vision + text combined tasks',
        'Foundry Tools → purpose-built: speech, vision, language services',
      ]},
      { title:'Deployment Options', pts:[
        'Serverless (pay-per-token) → variable / unpredictable load',
        'Provisioned Throughput (PTU) → consistent high volume, reserved capacity',
        'Global deployment → auto load-balances across regions',
        'Regional deployment → strict data residency requirements',
      ]},
      { title:'Security Defaults', pts:[
        'Managed Identity > API Keys — always prefer keyless',
        'DefaultAzureCredential() handles full auth chain automatically',
        'Private endpoints for production workloads',
        'RBAC: AI Developer, AI Inference Deployment Operator',
        'Key Vault for any secrets that must exist',
      ]},
      { title:'Monitoring + Observability', pts:[
        'Model drift → distribution shift in input or output patterns',
        'Safety events → content filter triggers (log + alert on these)',
        'Grounding quality → RAG relevance scoring',
        'Token analytics → cost tracking and rate limit proximity',
        'Azure Monitor → platform-level metrics, alerts, dashboards',
      ]},
      { title:'Responsible AI Controls', pts:[
        'Safety filters → configure input AND output content moderation',
        'Evaluators → groundedness, relevance, safety scoring',
        'Audit trail → trace logging + provenance metadata',
        'Oversight modes → agent behavior constraints and guardrails',
        'Tool-access controls → restrict which tools agents can call',
      ]},
    ],
    py:[
      { label:'Project client init', code:`from azure.ai.projects import AIProjectClient\nfrom azure.identity import DefaultAzureCredential\n\nclient = AIProjectClient(\n    endpoint=os.environ['PROJECT_ENDPOINT'],\n    credential=DefaultAzureCredential()\n)` },
      { label:'Get connection', code:`conn = client.connections.get(\n    connection_name='my-search-connection'\n)` },
    ],
  },
  {
    id:'genai', short:'GenAI + Agents', label:'Generative AI + Agentic Solutions',
    weight:33, range:'30–35%', color:'#7c6bcc',
    concepts:[
      { title:'RAG Pipeline — Know Every Step', pts:[
        'Ingest → Chunk → Embed → Index → Retrieve → Ground → Generate',
        'Hybrid search = keyword (BM25) + vector → best default for RAG',
        'Semantic ranker → ML reranking layer on top of hybrid results',
        'Grounding = attaching retrieved context to the model prompt',
        'Chunk tradeoff: smaller = more precise; larger = more context',
      ]},
      { title:'Agent Architecture', pts:[
        'Agent = model + tools + memory + system instructions',
        'Tool schemas → JSON function definitions the model can invoke',
        'Function calling → model decides which tool, when, with what args',
        'Thread = conversation state container (persists across turns)',
        'Multi-agent → orchestrator delegates tasks to specialist agents',
        'Approval flows = Human-in-the-loop checkpoints before action',
      ]},
      { title:'GenAI Optimization', pts:[
        'Prompt engineering BEFORE fine-tuning — cheaper and faster to iterate',
        'Temperature → controls randomness: 0 = deterministic, 1 = creative',
        'Top-p → nucleus sampling, alternative approach to temperature',
        'Chain-of-thought → structured step-by-step reasoning prompts',
        'Self-critique → model evaluates and refines its own output',
      ]},
      { title:'Operationalizing GenAI', pts:[
        'Tracing → distributed trace across model + tool calls',
        'Fabrication detection → groundedness evaluator on outputs',
        'Safety evaluation → run on sampled production outputs regularly',
        'Rate limit management → quota monitoring + exponential backoff',
        'A/B evaluation → compare model versions on identical prompts',
      ]},
    ],
    py:[
      { label:'Create agent', code:`agent = project_client.agents.create_agent(\n    model='gpt-4o',\n    name='my-agent',\n    instructions='You are a helpful assistant.',\n    tools=toolset.definitions\n)` },
      { label:'Run on thread', code:`thread = project_client.agents.create_thread()\nrun = project_client.agents.create_and_process_run(\n    thread_id=thread.id,\n    agent_id=agent.id\n)` },
      { label:'Chat completions', code:`response = openai_client.chat.completions.create(\n    model='gpt-4o',\n    messages=[{'role':'user','content':prompt}]\n)` },
    ],
  },
  {
    id:'vision', short:'Computer Vision', label:'Computer Vision',
    weight:13, range:'10–15%', color:'#4a9e6b',
    concepts:[
      { title:'Image Generation', pts:[
        'DALL-E 3 via Azure OpenAI → text-to-image generation',
        'Inpainting → mask-based editing of a region in an existing image',
        'Prompt-driven modifications → style / content changes to existing images',
        'Controls: size (1024x1024, 1792x1024), quality (standard/hd), style (vivid/natural)',
      ]},
      { title:'Multimodal Understanding', pts:[
        'GPT-4o → pass image_url in messages content array for vision QA',
        'Content Understanding → structured field extraction from images',
        'Video Indexer → transcript, OCR, scene detection, face detection from video',
        'Alt-text generation → WCAG accessibility compliance',
      ]},
      { title:'Responsible AI — Vision', pts:[
        'Content filters → classify unsafe visual content (violence, adult, etc.)',
        'Indirect prompt injection → text embedded in images can hijack model',
        'Watermarking → provenance tracking for AI-generated images',
        'Brand policy → detect prohibited symbols or logos in images',
        'Mitigation: verify image source, validate output against safety policies',
      ]},
      { title:'Content Understanding Pipelines', pts:[
        'Single-task mode → one extraction type per analyzer run',
        'Pro mode → complex multi-step extraction workflows',
        'Analyzers → output structured JSON or markdown for downstream RAG',
        'Combines OCR + layout analysis + vision models in a single pipeline',
      ]},
    ],
    py:[
      { label:'Image analysis', code:`from azure.ai.vision.imageanalysis import ImageAnalysisClient\nfrom azure.ai.vision.imageanalysis.models import VisualFeatures\n\nclient = ImageAnalysisClient(endpoint, DefaultAzureCredential())\nresult = client.analyze(\n    image_url='https://...',\n    visual_features=[VisualFeatures.CAPTION, VisualFeatures.OBJECTS]\n)` },
      { label:'GPT-4o vision', code:`response = openai_client.chat.completions.create(\n    model='gpt-4o',\n    messages=[{\n        'role':'user',\n        'content':[\n            {'type':'image_url','image_url':{'url':img_url}},\n            {'type':'text','text':'Describe this image.'}\n        ]\n    }]\n)` },
    ],
  },
  {
    id:'text', short:'Text + Speech', label:'Text Analysis + Speech',
    weight:13, range:'10–15%', color:'#5ba3c9',
    concepts:[
      { title:'Language Analysis', pts:[
        'NER (Named Entity Recognition) → extract people, places, orgs, dates',
        'Key phrase extraction → identify important concepts in text',
        'Sentiment analysis → document + sentence level (positive / negative / neutral)',
        'Summarization → extractive (copy sentences) vs abstractive (generate new text)',
        'Structured JSON output → constrained generation with defined schema',
      ]},
      { title:'Speech Solutions', pts:[
        'STT (Speech-to-Text) → audio → text for agent input channel',
        'TTS (Text-to-Speech) → text → audio for agent response output',
        'Custom speech models → domain vocabulary (medical, legal, technical)',
        'Speech translation → real-time source language speech → target language text',
        'Multimodal audio → GPT-4o-audio for direct audio reasoning',
      ]},
      { title:'Translation', pts:[
        'Azure Translator → batch / streaming translation, 100+ languages',
        'LLM-powered translation → better for nuanced or domain-specific content',
        'Decision: Azure Translator for speed/cost; LLM for quality/context fidelity',
      ]},
    ],
    py:[
      { label:'Text analytics', code:`from azure.ai.textanalytics import TextAnalyticsClient\nfrom azure.core.credentials import AzureKeyCredential\n\nclient = TextAnalyticsClient(endpoint, AzureKeyCredential(key))\nresult = client.analyze_sentiment(\n    ['I love Azure AI services.']\n)` },
      { label:'Speech config', code:`import azure.cognitiveservices.speech as sdk\n\nconfig = sdk.SpeechConfig(subscription=key, region=region)\naudio = sdk.audio.AudioConfig(use_default_microphone=True)\nrec = sdk.SpeechRecognizer(config, audio)\nresult = rec.recognize_once_async().get()` },
    ],
  },
  {
    id:'extract', short:'Info Extraction', label:'Information Extraction',
    weight:13, range:'10–15%', color:'#c94f4f',
    concepts:[
      { title:'Search Types — Know Cold', pts:[
        'Keyword (BM25) → exact term matching, fast, good for known terms',
        'Vector → embedding similarity, semantic recall, handles synonyms',
        'Hybrid → keyword + vector merged (best default for RAG)',
        'Semantic ranker → ML reranking layer on hybrid results',
        'RULE: Hybrid + Semantic Ranker = best retrieval quality in RAG',
      ]},
      { title:'RAG Ingestion Pipeline', pts:[
        'Source → Azure Blob Storage (most common connector)',
        'Chunking → size + overlap strategy (512 tokens, 10% overlap typical)',
        'Enrichment → built-in skills: OCR, language detection, entity recognition',
        'Embedding → text-embedding-3-large or text-embedding-ada-002',
        'Indexing → HNSW algorithm for approximate nearest neighbor (ANN) search',
      ]},
      { title:'Document Intelligence', pts:[
        'Layout model → document structure: tables, headings, paragraphs',
        'Prebuilt models → invoice, receipt, ID, tax forms (no training needed)',
        'Custom models → train on your specific document types',
        'Content Understanding → next-gen multimodal, integrates with Foundry',
      ]},
      { title:'Grounding Patterns', pts:[
        'Connect Azure AI Search directly as a tool in an agent definition',
        'Vector store → persistent embedding index for RAG',
        'Chunk metadata → enables filtered retrieval by date, category, author',
        'Reranker threshold → filter out low-confidence retrieved chunks',
      ]},
    ],
    py:[
      { label:'Hybrid search query', code:`from azure.search.documents import SearchClient\nfrom azure.search.documents.models import VectorizedQuery\n\nclient = SearchClient(endpoint, index_name, AzureKeyCredential(key))\nvq = VectorizedQuery(\n    vector=get_embedding(query),\n    k_nearest_neighbors=10,\n    fields='content_vector'\n)\nresults = client.search(\n    search_text=query,\n    vector_queries=[vq],\n    query_type='semantic',\n    semantic_configuration_name='my-config'\n)` },
      { label:'Document intelligence', code:`from azure.ai.documentintelligence import DocumentIntelligenceClient\n\nclient = DocumentIntelligenceClient(endpoint, AzureKeyCredential(key))\npoller = client.begin_analyze_document(\n    'prebuilt-layout', document=doc_bytes\n)\nresult = poller.result()` },
    ],
  },
];

const TREE = [
  { q:'Need to search/retrieve docs for RAG?', a:'Azure AI Search', d:'Use hybrid + semantic ranker for best quality' },
  { q:'Building a tool-using agent?', a:'AI Foundry Agents SDK', d:'Define tools as JSON schemas, use create_and_process_run()' },
  { q:'Analyze images or video content?', a:'GPT-4o (reasoning) or Content Understanding (extraction)', d:'GPT-4o for QA/reasoning; Content Understanding for structured fields' },
  { q:'Extract structured data from forms/PDFs?', a:'Azure AI Document Intelligence', d:'Layout model for structure; prebuilt/custom for field extraction' },
  { q:'Best auth pattern?', a:'Managed Identity + DefaultAzureCredential()', d:'Never hardcode keys. Keyless in prod, env vars in dev.' },
  { q:'High consistent load vs bursty traffic?', a:'PTU (Provisioned) vs Serverless', d:'PTU = reserved flat rate; Serverless = pay-per-token auto-scale' },
  { q:'LLM vs SLM selection?', a:'Task complexity is the decider', d:'Complex/long context → LLM. Fast/cheap/edge → SLM. Vision+text → multimodal.' },
  { q:'RAG quality is poor — first fix?', a:'Review chunking + add semantic ranker', d:'Chunks too large → less precise. Semantic ranker reranks for relevance.' },
  { q:'Image might contain injected text?', a:'Indirect prompt injection mitigation', d:'Validate image source, apply content filters, never blindly trust embedded text.' },
  { q:'Translation at scale?', a:'Azure Translator vs LLM translation', d:'Translator = fast/cheap/100+ langs. LLM = nuanced/domain accuracy.' },
  { q:'Monitor model behavior in prod?', a:'Azure Monitor + Foundry tracing', d:'Track drift, safety events, grounding quality, token usage.' },
  { q:'Agent needs human approval before action?', a:'Approval flow / HITL checkpoint', d:'Build as oversight mode or approval workflow in orchestration layer.' },
];

export default function AI103Tool() {
  const [mode, setMode] = useState('walkup');
  const [activeDomain, setActiveDomain] = useState('plan');
  const [expanded, setExpanded] = useState({});
  const [showPy, setShowPy] = useState({});
  const [confidence, setConfidence] = useState({});
  const [postScores, setPostScores] = useState({});
  const [examEnd, setExamEnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [treeSearch, setTreeSearch] = useState('');
  const [aiOut, setAiOut] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [planOut, setPlanOut] = useState('');
  const [planLoading, setPlanLoading] = useState(false);
  const [aiDomain, setAiDomain] = useState('');
  const timerRef = useRef(null);

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const c = await window.storage.get('ai103_conf');
        if (c) setConfidence(JSON.parse(c.value));
        const p = await window.storage.get('ai103_post');
        if (p) setPostScores(JSON.parse(p.value));
        const e = await window.storage.get('ai103_examEnd');
        if (e) setExamEnd(Number(e.value));
      } catch(_) {}
    })();
  }, []);

  // Timer
  useEffect(() => {
    if (!examEnd) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(Math.max(0, examEnd - Date.now()));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [examEnd]);

  const saveConf = async (v) => { try { await window.storage.set('ai103_conf', JSON.stringify(v)); } catch(_) {} };
  const savePost = async (v) => { try { await window.storage.set('ai103_post', JSON.stringify(v)); } catch(_) {} };

  const startExam = async (mins) => {
    const end = Date.now() + mins * 60000;
    setExamEnd(end);
    setTimeLeft(mins * 60000);
    try { await window.storage.set('ai103_examEnd', String(end)); } catch(_) {}
  };
  const resetExam = async () => {
    clearInterval(timerRef.current);
    setExamEnd(null);
    setTimeLeft(null);
    try { await window.storage.delete('ai103_examEnd'); } catch(_) {}
  };

  const toggleCard = (k) => setExpanded(p => ({...p,[k]:!p[k]}));
  const togglePy = (k) => setShowPy(p => ({...p,[k]:!p[k]}));
  const domain = (id) => DOMAINS.find(d => d.id === id);
  const active = domain(activeDomain);

  const generateQ = async (domId) => {
    const d = domain(domId);
    if (!d || aiLoading) return;
    setAiLoading(true);
    setAiOut('');
    setAiDomain(domId);
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content:
`Generate 3 scenario-based practice questions for the Microsoft AI-103 exam, domain: "${d.label}" (${d.range} of exam).

Key concepts: ${d.concepts.map(c => c.title).join(', ')}

Rules:
- Scenario format: "A company needs to..." or "You are designing..."
- 4 answer choices (A-D) per question
- Mark correct answer with brief 1-sentence explanation
- Vary: 1 easy / 1 medium / 1 hard
- Azure-specific — mention actual service names

Format:
Q1. [scenario]
A) B) C) D)
✓ Answer: X — [why]

Q2. Q3.`
          }]
        })
      });
      const data = await r.json();
      const txt = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('') || 'Failed to generate.';
      setAiOut(txt);
    } catch(e) { setAiOut('API error. Check connection.'); }
    setAiLoading(false);
  };

  const generatePlan = async () => {
    if (planLoading) return;
    setPlanLoading(true);
    setPlanOut('');
    const scores = DOMAINS.map(d => `${d.label} (${d.range} of exam): ${CONF[postScores[d.id]||3]} (${postScores[d.id]||3}/5)`).join('\n');
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content:
`I just took the Microsoft AI-103 (Azure AI Apps and Agents Developer Associate) beta exam. Post-exam domain confidence (1–5):

${scores}

Generate a targeted 3-week retake study plan.
- Prioritize by: weakness × exam weight
- Be specific: name Microsoft Learn modules, Foundry services to lab, concepts to drill
- Format: Week 1 / Week 2 / Week 3 with daily time estimates (1–2 hrs/day available)
- Include free Microsoft Learn URLs where relevant
- Do not pad — every line should be actionable`
          }]
        })
      });
      const data = await r.json();
      const txt = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('') || 'Failed.';
      setPlanOut(txt);
    } catch(e) { setPlanOut('API error. Check connection.'); }
    setPlanLoading(false);
  };

  const filteredTree = TREE.filter(t =>
    !treeSearch ||
    t.q.toLowerCase().includes(treeSearch.toLowerCase()) ||
    t.a.toLowerCase().includes(treeSearch.toLowerCase()) ||
    t.d.toLowerCase().includes(treeSearch.toLowerCase())
  );

  const timerColor = !examEnd ? '#3a3a36' : timeLeft < 1800000 ? '#c94f4f' : timeLeft < 3600000 ? '#d4893a' : '#e8e6e0';

  const prioritySort = DOMAINS
    .map(d => ({ ...d, score: postScores[d.id]||3 }))
    .sort((a,b) => ((5-b.score)*b.weight) - ((5-a.score)*a.weight));

  const S = {
    bg: '#0c0c0b', surf: '#161614', elevated: '#1e1e1b',
    border: '#2a2a26', text: '#e8e6e0', muted: '#6b6866', dim: '#4a4845',
    accent: '#d4893a',
  };

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:S.bg,color:S.text,minHeight:'100vh'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#161614}
        ::-webkit-scrollbar-thumb{background:#3a3a36;border-radius:2px}
        input[type=range]{width:100%;height:4px;cursor:pointer}
        input[type=text],input[type=search]{outline:none}
        button{font-family:'IBM Plex Sans',sans-serif;cursor:pointer}
        .hov-card:hover{border-color:#3a3a36!important;background:#1a1a18!important}
        .hov-tab:hover{opacity:0.8}
        .hov-btn:hover{opacity:0.85}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:S.surf,borderBottom:`1px solid ${S.border}`,padding:'12px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap',position:'sticky',top:0,zIndex:50}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",color:S.accent,fontSize:17,fontWeight:700,lineHeight:1.2}}>AI-103 Study System</div>
          <div style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>Azure AI Apps & Agents Developer Associate · Beta · Pass = 700/1000</div>
        </div>
        <div style={{display:'flex',gap:5}}>
          {[{id:'walkup',label:'🎯 Walk-Up'},{id:'exam',label:'⚡ Exam'},{id:'post',label:'📊 Post-Exam'}].map(m=>(
            <button key={m.id} onClick={()=>setMode(m.id)} className="hov-btn" style={{
              padding:'6px 14px',border:`1px solid ${mode===m.id?S.accent:S.border}`,
              borderRadius:6,background:mode===m.id?`rgba(212,137,58,0.1)`:'transparent',
              color:mode===m.id?S.accent:S.muted,fontSize:12,fontWeight:mode===m.id?600:400,
              transition:'all 0.15s'
            }}>{m.label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:'20px',maxWidth:860,margin:'0 auto'}}>

        {/* ════════════════ WALK-UP ════════════════ */}
        {mode==='walkup' && <>
          {/* Domain weight bar */}
          <Section label="Domain Weights">
            <div style={{display:'flex',height:28,borderRadius:6,overflow:'hidden',gap:2,marginBottom:10}}>
              {DOMAINS.map(d=>(
                <div key={d.id} onClick={()=>setActiveDomain(d.id)} title={d.label} style={{
                  width:`${d.weight}%`,background:d.color,display:'flex',alignItems:'center',
                  justifyContent:'center',fontSize:11,fontWeight:700,color:'#0c0c0b',
                  cursor:'pointer',opacity:activeDomain===d.id?1:0.6,transition:'opacity 0.15s'
                }}>{d.weight}%</div>
              ))}
            </div>
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              {DOMAINS.map(d=>(
                <div key={d.id} onClick={()=>setActiveDomain(d.id)} style={{display:'flex',alignItems:'center',gap:5,cursor:'pointer'}}>
                  <div style={{width:7,height:7,borderRadius:2,background:d.color}}/>
                  <span style={{fontSize:11,color:activeDomain===d.id?d.color:S.muted,transition:'color 0.15s'}}>{d.short} · {d.range}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Confidence sliders */}
          <Section label="Pre-Exam Self-Assessment">
            {DOMAINS.map(d=>{
              const v = confidence[d.id]||3;
              return (
                <div key={d.id} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <div style={{width:110,fontSize:11,color:'#b0ada6',flexShrink:0}}>{d.short}</div>
                  <input type="range" min={1} max={5} value={v}
                    onChange={e=>{const nv={...confidence,[d.id]:Number(e.target.value)};setConfidence(nv);saveConf(nv);}}
                    style={{flex:1,accentColor:d.color}}
                  />
                  <div style={{width:70,fontSize:11,fontFamily:"'IBM Plex Mono',monospace",textAlign:'right',flexShrink:0,
                    color:v<=2?'#c94f4f':v===3?S.accent:'#4a9e6b'}}>{CONF[v]}</div>
                </div>
              );
            })}
          </Section>

          {/* Concept cards */}
          <Section label="Concept Cards" extra={
            <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
              {DOMAINS.map(d=>(
                <button key={d.id} className="hov-tab" onClick={()=>setActiveDomain(d.id)} style={{
                  padding:'2px 9px',borderRadius:4,
                  border:`1px solid ${activeDomain===d.id?d.color:S.border}`,
                  background:activeDomain===d.id?`rgba(${hexToRgb(d.color)},0.1)`:'transparent',
                  color:activeDomain===d.id?d.color:S.muted,fontSize:10,transition:'all 0.15s'
                }}>{d.short}</button>
              ))}
            </div>
          }>
            {active && active.concepts.map((c,i)=>{
              const k=`w_${activeDomain}_${i}`;
              return (
                <ConceptCard key={k} cardKey={k} title={c.title} pts={c.pts} color={active.color} expanded={expanded} toggle={toggleCard}/>
              );
            })}
            {active && (
              <div style={{marginTop:6}}>
                <button onClick={()=>togglePy(activeDomain)} style={{
                  padding:'4px 10px',border:`1px solid ${S.border}`,borderRadius:5,
                  background:'transparent',color:S.muted,fontSize:10,fontFamily:"'IBM Plex Mono',monospace"
                }}>{showPy[activeDomain]?'▾ Hide':'▸ Show'} Python Patterns</button>
                {showPy[activeDomain] && active.py.map((p,i)=>(
                  <PyBlock key={i} label={p.label} code={p.code}/>
                ))}
              </div>
            )}
          </Section>

          {/* Practice Q generator */}
          <Section label="Practice Question Generator" badge="AI">
            <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:12}}>
              {DOMAINS.map(d=>(
                <button key={d.id} onClick={()=>generateQ(d.id)} disabled={aiLoading} className="hov-btn" style={{
                  padding:'5px 11px',border:`1px solid rgba(${hexToRgb(d.color)},0.35)`,
                  borderRadius:5,background:`rgba(${hexToRgb(d.color)},0.08)`,
                  color:d.color,fontSize:11,opacity:aiLoading?0.4:1,
                  transition:'opacity 0.15s'
                }}>
                  {aiLoading && aiDomain===d.id ? 'Generating...' : `${d.short}`}
                </button>
              ))}
            </div>
            {aiOut && (
              <div style={{border:`1px solid ${S.border}`,borderRadius:8,padding:14,fontSize:12,
                color:'#b0ada6',lineHeight:1.75,whiteSpace:'pre-wrap',maxHeight:420,overflowY:'auto',
                fontFamily:"'IBM Plex Sans',sans-serif"}}>{aiOut}</div>
            )}
          </Section>
        </>}

        {/* ════════════════ EXAM MODE ════════════════ */}
        {mode==='exam' && <>
          {/* Timer */}
          <div style={{background:S.surf,border:`1px solid ${timeLeft<1800000&&examEnd?'rgba(201,79,79,0.35)':S.border}`,
            borderRadius:10,padding:'16px 20px',marginBottom:16,
            display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
            <div>
              <div style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Time Remaining</div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:38,fontWeight:500,color:timerColor,lineHeight:1}}>
                {fmtTime(timeLeft)}
              </div>
              {examEnd && timeLeft > 0 && (
                <div style={{fontSize:10,color:S.muted,fontFamily:"'IBM Plex Mono',monospace",marginTop:5}}>
                  {timeLeft < 1800000 ? '⚠ Under 30 min' : timeLeft < 3600000 ? '⚠ Under 60 min' : 'On track'} · {Math.round(timeLeft/60000)} min remaining
                </div>
              )}
              {examEnd && timeLeft === 0 && (
                <div style={{fontSize:12,color:'#c94f4f',fontFamily:"'IBM Plex Mono',monospace",marginTop:4}}>TIME UP</div>
              )}
            </div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {!examEnd ? (
                <>
                  <button onClick={()=>startExam(150)} style={{padding:'8px 18px',background:S.accent,border:'none',borderRadius:6,color:'#0c0c0b',fontWeight:700,fontSize:13}}>Start 150 min</button>
                  <button onClick={()=>startExam(120)} style={{padding:'8px 14px',background:'transparent',border:`1px solid ${S.border}`,borderRadius:6,color:S.muted,fontSize:13}}>120 min</button>
                </>
              ) : (
                <button onClick={resetExam} style={{padding:'8px 14px',background:'transparent',border:'1px solid rgba(201,79,79,0.4)',borderRadius:6,color:'#c94f4f',fontSize:13}}>Reset</button>
              )}
            </div>
          </div>

          {/* Decision tree */}
          <Section label="Service Decision Tree">
            <input value={treeSearch} onChange={e=>setTreeSearch(e.target.value)}
              placeholder="Search: RAG, agent, auth, translation, vision..."
              style={{width:'100%',padding:'8px 12px',background:S.bg,border:`1px solid ${S.border}`,
                borderRadius:6,color:S.text,fontSize:12,fontFamily:"'IBM Plex Mono',monospace",marginBottom:10}}
            />
            <div style={{display:'flex',flexDirection:'column',gap:5,maxHeight:340,overflowY:'auto'}}>
              {filteredTree.map((t,i)=>(
                <div key={i} style={{border:`1px solid ${S.border}`,borderRadius:8,padding:'9px 13px',transition:'border-color 0.15s'}}>
                  <div style={{fontSize:11,color:'#b0ada6',marginBottom:3}}>{t.q}</div>
                  <div style={{fontSize:13,fontWeight:600,color:S.accent,marginBottom:2}}>{t.a}</div>
                  <div style={{fontSize:10,color:S.dim,fontFamily:"'IBM Plex Mono',monospace"}}>{t.d}</div>
                </div>
              ))}
              {filteredTree.length===0 && <div style={{fontSize:12,color:S.dim,padding:'6px 0'}}>No matches</div>}
            </div>
          </Section>

          {/* Quick domain ref */}
          <Section label="Quick Domain Reference" extra={
            <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
              {DOMAINS.map(d=>(
                <button key={d.id} className="hov-tab" onClick={()=>setActiveDomain(d.id)} style={{
                  padding:'2px 9px',borderRadius:4,
                  border:`1px solid ${activeDomain===d.id?d.color:S.border}`,
                  background:activeDomain===d.id?`rgba(${hexToRgb(d.color)},0.1)`:'transparent',
                  color:activeDomain===d.id?d.color:S.muted,fontSize:10,transition:'all 0.15s'
                }}>{d.short} · {d.range}</button>
              ))}
            </div>
          }>
            {active && active.concepts.map((c,i)=>{
              const k=`e_${activeDomain}_${i}`;
              return <ConceptCard key={k} cardKey={k} title={c.title} pts={c.pts} color={active.color} expanded={expanded} toggle={toggleCard}/>;
            })}
          </Section>
        </>}

        {/* ════════════════ POST-EXAM ════════════════ */}
        {mode==='post' && <>
          {/* Post-exam domain scoring */}
          <Section label="Post-Exam Domain Feel">
            {DOMAINS.map(d=>{
              const pre = confidence[d.id]||3;
              const post = postScores[d.id]||3;
              const delta = post - pre;
              return (
                <div key={d.id} style={{marginBottom:14}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:5}}>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <div style={{width:7,height:7,borderRadius:2,background:d.color,flexShrink:0}}/>
                      <div style={{fontSize:12,color:S.text}}>{d.label}</div>
                      <div style={{fontSize:10,color:S.dim,fontFamily:"'IBM Plex Mono',monospace"}}>{d.range}</div>
                    </div>
                    <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",
                      color:delta>0?'#4a9e6b':delta<0?'#c94f4f':S.muted}}>
                      pre:{CONF[pre]} → post:{CONF[post]} {delta>0?'↑':delta<0?'↓':'→'}
                    </div>
                  </div>
                  <input type="range" min={1} max={5} value={post}
                    onChange={e=>{const v={...postScores,[d.id]:Number(e.target.value)};setPostScores(v);savePost(v);}}
                    style={{width:'100%',accentColor:d.color}}
                  />
                </div>
              );
            })}
          </Section>

          {/* Priority gap visualization */}
          <Section label="Retake Priority — Weakness × Exam Weight">
            {prioritySort.map(d=>{
              const pri = (5-d.score)*d.weight;
              const pct = Math.min(100, Math.round((pri/(4*33))*100));
              const label = pct>60?'HIGH':pct>35?'MED':'LOW';
              const col = pct>60?'#c94f4f':pct>35?S.accent:'#4a9e6b';
              return (
                <div key={d.id} style={{marginBottom:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <div style={{fontSize:12,color:'#b0ada6'}}>{d.short}</div>
                    <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:col}}>{label} · {CONF[d.score]}</div>
                  </div>
                  <div style={{height:5,background:S.border,borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:col,borderRadius:3,transition:'width 0.3s'}}/>
                  </div>
                </div>
              );
            })}
          </Section>

          {/* Study plan generator */}
          <Section label="Generate Retake Study Plan" badge="AI">
            <button onClick={generatePlan} disabled={planLoading} className="hov-btn" style={{
              padding:'8px 20px',background:S.accent,border:'none',borderRadius:6,
              color:'#0c0c0b',fontWeight:700,fontSize:13,marginBottom:14,
              opacity:planLoading?0.5:1,transition:'opacity 0.15s'
            }}>{planLoading?'Generating...':'Generate 3-Week Retake Plan'}</button>
            {planOut && (
              <div style={{border:`1px solid ${S.border}`,borderRadius:8,padding:14,
                fontSize:12,color:'#b0ada6',lineHeight:1.75,whiteSpace:'pre-wrap',
                maxHeight:500,overflowY:'auto',fontFamily:"'IBM Plex Sans',sans-serif"}}>{planOut}</div>
            )}
          </Section>
        </>}
      </div>
    </div>
  );
}

function Section({ label, extra, badge, children }) {
  return (
    <div style={{background:'#161614',border:'1px solid #2a2a26',borderRadius:10,padding:'14px 18px',marginBottom:16}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,flexWrap:'wrap',gap:6}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{fontSize:10,color:'#6b6866',fontFamily:"'IBM Plex Mono',monospace",textTransform:'uppercase',letterSpacing:'0.08em'}}>{label}</div>
          {badge && <div style={{padding:'1px 6px',background:'rgba(212,137,58,0.15)',border:'1px solid rgba(212,137,58,0.3)',borderRadius:4,fontSize:9,color:'#d4893a',fontFamily:"'IBM Plex Mono',monospace"}}>{badge}</div>}
        </div>
        {extra && <div>{extra}</div>}
      </div>
      {children}
    </div>
  );
}

function ConceptCard({ cardKey, title, pts, color, expanded, toggle }) {
  const open = expanded[cardKey];
  return (
    <div onClick={()=>toggle(cardKey)} className="hov-card" style={{
      border:'1px solid #2a2a26',borderRadius:8,padding:'8px 12px',
      cursor:'pointer',transition:'all 0.15s',background:'#0c0c0b',marginBottom:5
    }}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:12,fontWeight:600,color}}>{title}</div>
        <div style={{color:'#3a3a36',fontSize:14,lineHeight:1}}>{open?'−':'+'}</div>
      </div>
      {open && (
        <div style={{marginTop:8,display:'flex',flexDirection:'column',gap:3}}>
          {pts.map((p,i)=>(
            <div key={i} style={{display:'flex',gap:7,alignItems:'flex-start'}}>
              <div style={{color,fontSize:8,marginTop:4,flexShrink:0}}>▸</div>
              <div style={{fontSize:11,color:'#b0ada6',lineHeight:1.55}}>{p}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PyBlock({ label, code }) {
  return (
    <div style={{border:'1px solid #2a2a26',borderRadius:8,overflow:'hidden',marginTop:7}}>
      <div style={{padding:'5px 10px',background:'#1a1a18',fontSize:10,color:'#6b6866',
        borderBottom:'1px solid #2a2a26',fontFamily:"'IBM Plex Mono',monospace"}}>{label}</div>
      <pre style={{margin:0,padding:'10px 12px',fontSize:10,fontFamily:"'IBM Plex Mono',monospace",
        color:'#d4893a',background:'#0c0c0b',overflowX:'auto',lineHeight:1.65}}>{code}</pre>
    </div>
  );
}
