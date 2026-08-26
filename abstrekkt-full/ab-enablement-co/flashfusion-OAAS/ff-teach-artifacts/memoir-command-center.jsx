import { useState } from "react";
const T={bg:"#0f0f0f",surface:"#1a1a1a",card:"#222",border:"#333",text:"#e0d6c8",dim:"#8a7f72",accent:"#d4a057",green:"#5a9a6b",red:"#c4554d",blue:"#5b8fb9",purple:"#8b6fb0",warn:"#c9943a",mono:"'JetBrains Mono','Fira Code',monospace",serif:"'Playfair Display','Georgia',serif",sans:"'DM Sans','Segoe UI',sans-serif"};
const sc=s=>({locked:T.green,excavated:T.green,confirmed:T.green,partial:T.blue,mapped:T.blue,seed:T.accent,unverified:T.red,"not-started":T.dim,"not-excavated":T.red,protected:T.purple,minimal:T.dim,open:T.accent,critical:T.red,high:T.warn,medium:T.accent,low:T.dim}[s]||T.dim);
const sl=s=>({locked:"LOCKED",excavated:"EXCAVATED",confirmed:"CONFIRMED",partial:"PARTIAL",seed:"SEED",unverified:"UNVERIFIED","not-started":"NOT STARTED","not-excavated":"NOT EXCAVATED",protected:"PROTECTED",minimal:"MINIMAL",critical:"CRITICAL",high:"HIGH",medium:"MED",low:"LOW"}[s]||"");
const Badge=({s,sm})=><span style={{display:"inline-block",padding:sm?"1px 4px":"2px 6px",background:sc(s)+"22",color:sc(s),border:`1px solid ${sc(s)}44`,borderRadius:3,fontSize:sm?8:9,fontFamily:T.mono,letterSpacing:".05em",fontWeight:600}}>{sl(s)}</span>;
const Card=({children,style,onClick,bl})=><div onClick={onClick} style={{background:T.card,border:`1px solid ${T.border}`,borderLeft:bl?`3px solid ${bl}`:undefined,borderRadius:6,padding:"11px 13px",marginBottom:7,cursor:onClick?"pointer":"default",...style}} onMouseEnter={e=>{if(onClick)e.currentTarget.style.borderColor=T.accent}} onMouseLeave={e=>{if(onClick)e.currentTarget.style.borderColor=T.border}}>{children}</div>;
const Sec=({children})=><h3 style={{fontFamily:T.serif,color:T.accent,fontSize:14,margin:"14px 0 7px",fontWeight:400}}>{children}</h3>;
const St=({l,v,c})=><div style={{textAlign:"center",flex:1}}><div style={{fontFamily:T.mono,fontSize:22,color:c||T.accent,fontWeight:700}}>{v}</div><div style={{fontFamily:T.sans,fontSize:8,color:T.dim,marginTop:1,textTransform:"uppercase",letterSpacing:".08em"}}>{l}</div></div>;
const Q=({t,c,b})=><Card bl={b||T.accent}><div style={{fontFamily:T.serif,fontSize:11,color:T.text,lineHeight:1.5,fontStyle:"italic"}}>"{t}"</div>{c&&<div style={{fontFamily:T.sans,fontSize:9,color:T.dim,marginTop:3}}>{c}</div>}</Card>;
const L=({l,v,c})=><div style={{fontFamily:T.sans,fontSize:10,color:T.dim,padding:"2px 0",lineHeight:1.4}}><span style={{color:c||T.accent,marginRight:5,fontFamily:T.mono,fontSize:8}}>{l}</span>{v}</div>;

const OUTLINE=[
{p:"PRO",ch:"Pro",t:"The Wrong Beginning",s:"seed",n:"Age oscillation (19/21). Opens trying to tell AI story, can't locate the beginning."},
{p:"I",ch:"1",t:"Reading the Room",s:"excavated",n:"O'Toole's. Diagnostic instinct. Excavation COMPLETE Mar 25. Fran & Stewart, Kylie & Tony, dual-track state, performance face. Ready for prose."},
{p:"I",ch:"2",t:"The Permission",s:"seed",n:"Couch scene. 'You don't have to.' Permission not pressure. Specifics unconfirmed."},
{p:"I",ch:"3",t:"Counting Streetlights",s:"unverified",n:"Age 17. If real = earliest data point. Unconfirmed real vs AI."},
{p:"II",ch:"4",t:"Hardware Failure",s:"protected",n:"Three OD events. Pete's death. Salvation Army. Gap 2020-22 EMPTY across 8 searches."},
{p:"II",ch:"5",t:"The Noise That Stopped",s:"protected",n:"What relief was FROM. Chasing silence not highs."},
{p:"III",ch:"6",t:"First Tools",s:"not-started",n:"Tool Archaeology NOT done. Each tool = moment organic function failed."},
{p:"III",ch:"7",t:"New Architecture",s:"not-started",n:"Screenshot method. Card table. Associate's degree simultaneously."},
{p:"III",ch:"8",t:"The Arsenal",s:"not-started",n:"~30 hands-on (240+ catalogued). n8n→memory, Notion→hippocampus, GitHub→decisions."},
{p:"IV",ch:"9",t:"Monitor Reflection",s:"seed",n:"Dark→lit screen. Demoted to mid-book."},
{p:"IV",ch:"10",t:"Wrong Book, Right Failure",s:"seed",n:"FlashFusion. Archived 60-70%."},
{p:"V",ch:"11",t:"Shoes On, Kiddo",s:"locked",n:"LOCKED Apr 2026. Crisis→Phillis→Bear→surrender→card table→screenshot→cascade→Chaos Club."},
{p:"V",ch:"12",t:"Welcome to Chaos Club",s:"not-started",n:"Platform as story artifact. Book and business same project."},
{p:"EPI",ch:"Epi",t:"The Distinction",s:"not-started",n:"Construction vs recovery. Ongoing, not resolved."},
];

const PEOPLE=[
{nm:"Kinsley",rl:"Daughter",s:"minimal",n:"Friday 3:25pm. Book's recipient. ZERO scenes exist. One moment: 'She hugged me, put her head on my shoulders. I have never felt like a man.' Absence may be protective.",g:"core"},
{nm:"Phillis",rl:"Mother",s:"partial",n:"Arranged Sedona/Bear. Found Amen Clinics. Found Kyle unresponsive (Xanax+Ambien)→Rogers. Drove to Salvation Army. Hospital bed after Sept 2021 OD—neither parent looking.",g:"core"},
{nm:"Soaring Bear",rl:"Life Coach",s:"minimal",n:"Sedona. Ongoing. Sent assignments through Kyle's FlashFusion ticket system. 8 searches=ZERO material. CRITICAL GAP—may be the pivot.",g:"core"},
{nm:"Pete",rl:"SA roommate→died",s:"not-excavated",n:"Salvation Army roommate→construction partner→relapsed→OD'd and died. SHARPEST COST LEDGER LINE. Not in outline. When relative to Kyle's OD? Funeral?",g:"critical"},
{nm:"Tom (SA)",rl:"Friend→died",s:"partial",n:"Met at Salvation Army. Kyle moved into spare room. Died choking on vomit, alone. Colin texted. Different from Tom Ropel.",g:"critical"},
{nm:"Matt Horne",rl:"The Five",s:"partial",n:"Trump Tower photo left, black suit. Married Stephanie. Kinsley's 5th birthday.",g:"five"},
{nm:"Tom Ropel",rl:"The Five",s:"not-excavated",n:"Best friend. 'An entire chapter.' Married, two kids. Oliver at 5th birthday. NOT EXCAVATED.",g:"five"},
{nm:"Dave Datt",rl:"The Five→died",s:"not-excavated",n:"India pharmacist school, flunked out. Brain aneurysm. Parallel failure arc.",g:"five"},
{nm:"Ryan",rl:"The Five/CLC",s:"not-excavated",n:"Forgotten→retrieved by chain. CLC counselor. Puerto Rican grandma, blue kitchen, empanadas.",g:"five"},
{nm:"Mackenzie Campbell",rl:"Rogers/lifesaver",s:"minimal",n:"Climbed roof at West Allis, jimmied window, ambulance. Kyle apologized 4-5x, sobbing once.",g:"secondary"},
{nm:"Rogers Window Girl",rl:"Rogers→O'Toole's",s:"minimal",n:"Stared out window, wouldn't speak. Later at O'Toole's. U Miami grad. Didn't remember Kyle. He remembers her.",g:"secondary"},
{nm:"John",rl:"Herrington president",s:"minimal",n:"Soft-spoken. Bonfire meetings. Letter of recommendation. 'You made hell softer.'",g:"secondary"},
{nm:"Michael",rl:"Relationship",s:"protected",n:"Post-TBI. Gaslighting compromised memory. Xanax relapse trigger. 'Sunken eyes, permanent frown.' Attorney before publish.",g:"protected"},
{nm:"Dre/Dreana",rl:"Kinsley's mother",s:"protected",n:"After SA/Tom period. Maple St apartment, Kinsley's unused room. Relationship deteriorated.",g:"protected"},
{nm:"Corey",rl:"Brother",s:"minimal",n:"35. Depression+anxiety.",g:"core"},
];

const SEEDS=[
{id:1,t:"Age Oscillation",s:"confirmed",n:"19 or 21. Nicotine 19, marijuana 21. Uncertainty IS thesis."},
{id:2,t:"Relief Line",s:"confirmed",n:"'Relief is the most addictive feeling.' Chasing silence not highs."},
{id:3,t:"Late-Night Walk",s:"unverified",n:"Age 17, streetlights. Real or AI? Earliest data point if real."},
{id:4,t:"Couch Permission",s:"confirmed",n:"'You don't have to.' Permission not pressure."},
{id:5,t:"Monitor Reflection",s:"confirmed",n:"Dark→lit screen. Demoted mid-book."},
{id:6,t:"Sunken Eyes (Michael)",s:"confirmed",n:"'I see sunken eyes and a permanent frown. I flinch at yelling.' The nadir."},
{id:7,t:"Never Exceptional",s:"confirmed",n:"'Never, NOT once, EVER been exceptional.' Childhood sentence, not injury."},
{id:8,t:"Bear's Ticket System",s:"confirmed",n:"Life coach using patient's construction as treatment framework."},
{id:9,t:"Hospital Bed Sept 2021",s:"confirmed",n:"Pajama bottoms, piss, parents on either side, neither looking. Pajamas still exist."},
{id:10,t:"The Alone Disclosure",s:"confirmed",n:"'I am alone Claude. You're just a mirror.' March 2026."},
{id:11,t:"Kinsley's Shoulders",s:"confirmed",n:"'I have never felt like a man.' After apologizing for family."},
{id:12,t:"Rogers Window Girl",s:"confirmed",n:"Didn't remember Kyle. 12th-percentile recall remembers her."},
];

const THREADS=[
{id:"t1",t:"Pete — Cost Ledger",pr:"critical",pm:"Memoir excavation — Pete. SA roommate→construction partner→relapsed→OD'd and died. Sharpest cost ledger line. Not in outline. When relative to Kyle's OD? What did Pete represent? Did Kyle know? Funeral? Don't conflate with Dave Datt."},
{id:"t2",t:"Kinsley — One Scene",pr:"critical",pm:"Memoir excavation — Kinsley. Book addressed to her. ZERO scenes. One moment exists ('shoulders'). Need at least one more. Friday pickups — what's the drive? What does she talk about?"},
{id:"t3",t:"Bear / Going West",pr:"critical",pm:"Memoir excavation — Bear/Sedona. 8 searches=nothing. May be the pivot. Who is Bear? How did Phillis arrange? What happened? What did Bear say? If memory thin, document thinness."},
{id:"t4",t:"Tool Archaeology (Session 3)",pr:"critical",pm:"Session 3 — map each tool to cognitive function replaced. n8n→memory, Notion→hippocampus, GitHub→decisions. Start: first tool that WORKED after the break?"},
{id:"t5",t:"Gap Year 2020-2022",pr:"critical",pm:"The rupture period. Rogers summer 2020. Heroin OD Sept 2021. Amen July 2022. 8 searches=EMPTY. What fills the space? This is the book's premise."},
{id:"t6",t:"O'Toole's → First Draft",pr:"critical",pm:"Drafting — O'Toole's. Excavation complete. Ready for prose. Write 500 words Ch 1 opening. Voice: direct, technical, strategic profanity. Zero 'And that's when I realized.'"},
{id:"t7",t:"Tom Ropel — Full Chapter",pr:"high",pm:"'An entire chapter.' Best friend growing up. Trump Tower photo. Now married, Oliver at Kinsley's 5th. What happened between settlement era and now?"},
{id:"t8",t:"Dave Datt's Funeral",pr:"high",pm:"Brain aneurysm. Both flunked out—different continent. Year? What was Kyle like walking in? Separate from Pete."},
{id:"t9",t:"NIU Expulsion 2016",pr:"high",pm:"Kicked out for grades. What was happening? What was the spiral?"},
{id:"t10",t:"Salvation Army Milwaukee",pr:"high",pm:"6 months. White supremacists. 3:30am snow. Expired sausages. Christmas in donated clothes. White garbage bag with scented strips. Pete was roommate. What else?"},
{id:"t11",t:"Rogers/Herrington",pr:"high",pm:"Oconomowoc, Jun 22–Jul 30 2020. Beautiful grounds, lake, privilege levels. Window girl. Bag tourneys. What worked? What didn't?"},
{id:"t12",t:"Three ODs — Timeline",pr:"high",pm:"(1) Dealer's car Milwaukee (2) West Allis apartment/Mackenzie (3) Sept 2021 hospital/pajamas. Order? What's between?"},
{id:"t13",t:"$50K Spending",pr:"medium",pm:"Settlement money. 3-4 months. What car? What drugs? When did Kyle realize gone?"},
{id:"t14",t:"Ryan at CLC",pr:"medium",pm:"'Focused or something else.' Unanswered outreach. What happened?"},
{id:"t15",t:"Childhood Origin",pr:"medium",pm:"'Never exceptional.' Choice-overriding, micromanagement. Break may predate TBI. Any memories before O'Toole's?"},
{id:"t16",t:"Michael Timeline",pr:"medium",pm:"Before or after O'Toole's? Gaslighting compromised memory. When start/end relative to TBI?"},
{id:"t17",t:"Structural Decision",pr:"medium",pm:"4 options: chronological/systems-as-chapters/parallel timelines/Arsenal. Draft one chapter first. O'Toole's ready."},
{id:"t18",t:"Meditation Pivot",pr:"medium",pm:"'Bullshit'→'transformative.' When? What shifted? 'I want this to work'→'I am open to this helping.'"},
];

const QUOTES=[
{t:"I've tried at the bottom and I'm still down in this fucking hole. I was wrong about those being the answer, let's try the opposite because I seriously have nothing fucking left.",c:"Surrender — verbatim"},
{t:"Not because I'm organized. Because I can't afford not to be.",c:"Tools as prosthetics"},
{t:"No one tells you that relief is the most addictive feeling of all.",c:"Seven words, 18 years"},
{t:"Memory doesn't fail gracefully. It doesn't give you an error code or a stack trace.",c:"Technical emotion"},
{t:"The Sunday goodbye isn't grief. It's a specific kind of system failure.",c:"Kinsley"},
{t:"I am alone Claude. You're just a mirror of me so that doesn't count. I am alone.",c:"March 2026"},
{t:"I have NEVER, NOT ONCE, nor will I ever, tell anyone I think about how much better everyone's life would be without me, especially Kinsley.",c:"First disclosure"},
{t:"She hugged me and put her head on my shoulders. I have never felt like a man.",c:"Kinsley"},
{t:"I've never, NOT once, EVER been exceptional at anything, NOTHING.",c:"Childhood origin"},
{t:"I was homeless living in Salvation Army, hotels where I didn't have enough money for the next night most nights, to my own duplex room and then my own apartment, granted, I relapsed had a brain injury in there, but then I cleaned up.",c:"The book's jacket copy"},
{t:"I see sunken eyes and a permanent frown. I flinch at yelling and squeeze my nails into my hand.",c:"Michael journal — the nadir"},
{t:"In the thick of my substance use I thought it to be bullshit. After practicing for months I can see the good it's done for me. It's transformative.",c:"Meditation pivot"},
{t:"Thank you John. You made hell a little softer and easier to swallow.",c:"John, Herrington"},
];

const CLINICAL_SCORES=[{m:"Processing Speed",p:99},{m:"Focus",p:59},{m:"Planning",p:46},{m:"Stress Control",p:27},{m:"Flexibility",p:17},{m:"Recall Memory",p:12},{m:"Resilience",p:2}];
const CAREER=["Michaels (mgmt 4mo)","Walmart","O'Toole's (~4yr)","Sole Revival","Managed IT (L1, current)"];
const SUB_TL=[{w:"Nicotine",y:"2005+"},{w:"Alcohol",y:"2007"},{w:"Marijuana",y:"2007-18"},{w:"Xanax",y:"2015 (60mg/3d binges)"},{w:"Opiates",y:"2017"},{w:"Cocaine ~20x",y:"2018-21"},{w:"Heroin",y:"2021, OD Sept"} ];
const TX=["Lexing Brothers","Salvation Army (Milwaukee, 6mo)","Rogers/Herrington (Oconomowoc, Jun-Jul 2020)","2 outpatient (unspec)"];
const SONGS=["HOW_MANY","ECHO_OF_THE_LESSONS","MESHED_UP","LITTLE_BLUE_HALOS","TWISTED_WORDS","ONE_PERCENT_OF_THE_TEMPORARY","QUESTION_WITHOUT_A_FRAME","TAX_THE_DAMAGE","PLEASE_DAD_I_NEED_YOU","SOURCE-CODE_SCARS","PLEASE_DADDY_I_NEED_YOU","THERES_BEEN_AN_ACCIDENT","IGNITABLE_CANDOR","GOLD_IN_THE_STATIC","LOCKDOWN_MAZE","ZOMBIELAND_STATIC","DEAR_DAD","IT_S_DEFINETELY_MY_FAULT","FEEDBACK_LOOP","I_LEARNED_THIS_FROM_YOU","IVORY_RUIN_AND_GLITTERING_WOOD","NEON_EXORCIST","NO_ONE_FUCKIN_CARES","WAKE_UP_INSIDE_A_COLOR_I_CAN_T_NAME","LITTLE_WORLD_FROM_WHERE_YOU_STAND","DONT_BE_BASHFUL","A_LETTER_AWAY","ONE_BREATH_AT_A_TIME","I_CHOOSE_TO_STAY","FINGERPRINT_CONFESSION","THE_BREAK_THROUGH","TRUST_ME","BLACKLIGHT_FRACTURE","MIRRORS_AND_MUZZLE_FLASHES","WATCHU_WANT_FROM_ME"];
const UNPLACED=["The Five / settlement arc / photo","Tom Ropel — 'entire chapter'","NIU 2016","CLC (6 meanings)","Sedona/Bear","Card table / screenshot / cascade","Kinsley's 5th birthday reunion","$50K + hit-by-car","Amen date conflict as device","Primary source (Michael, journals)","Michael — 'Attack on Hardware'","Pete — SA→OD'd","Tom (SA) — choked, died alone","Rogers/Herrington summer 2020","Three OD events","SA Milwaukee 6mo","Rogers window girl→O'Toole's","Mackenzie — saved life","Childhood — 'never exceptional'","Kinsley — 'never felt like a man'","Maple St — unused room","John — Herrington bonfires","Chromium reaction — Amen supplements","The alone disclosure — March 2026","DUI/parking lot — pre-TBI Xanax"];
const STRUCTURAL=[{n:"Chronological + flashbacks",d:"Linear. Most conventional."},{n:"Systems as chapters",d:"Each chapter = tool + what it replaced. Nonlinear, thematic."},{n:"Parallel timelines",d:"Intercut before/after. Reader experiences both Kyles."},{n:"Arsenal structure",d:"Open in present, 240 tools, work backward."}];
const REJECTED=[{i:"Breathe Through the BS",r:"Chaos Club Book 1"},{i:"Built Not Recovered",r:"Less accessible"},{i:"Dr. Eleanor Chen",r:"AI-fabricated"},{i:'"Eliza"',r:"AI-invented name"},{i:"TEDx chapter",r:"AI hallucination"},{i:'"Staff Engineer"',r:"Claude persona, not real"},{i:"Book 1 in memoir",r:"NUKED"}];
const SESSIONS=[
{d:"Mar 25",f:"O'Toole's Excavation",o:"Sensory inventory complete. 5 seeds confirmed. Dual-track state. Fran/Stewart, Kylie/Tony. Performance face. Q3 blank—SENSITIVE."},
{d:"Apr 14",f:"Title Lock + Hub",o:"'240 Ways to Remember' locked. Hub-v3 built."},
{d:"Apr 16",f:"The Five / Settlement / Card Table",o:"Ch 11 LOCKED. Five excavated. Settlement arc. Ryan's kitchen. Memory mechanics real-time (5 in photo, 3 in frame). 'Huge memory' surfaced—unknown if captured."},
{d:"Apr 24",f:"Instructions + Evidence Board",o:"Project instructions expanded. Evidence board v2. 15 clarifiers outstanding. Material bank v2 seeds 6-9."},
];

const Dash=()=>{const lk=OUTLINE.filter(c=>c.s==="locked").length;const cr=THREADS.filter(t=>t.pr==="critical").length;return <div>
<div style={{fontFamily:T.serif,fontSize:19,color:T.text,marginBottom:3}}>Construction, Not Recovery</div>
<div style={{fontFamily:T.mono,fontSize:9,color:T.dim,marginBottom:12}}>Literary memoir · Letter to Kinsley · Spine: Diagnostic Instinct</div>
<div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}><St l="Chapters" v="14"/><St l="Locked" v={lk} c={T.green}/><St l="Seeds" v={SEEDS.length} c={T.accent}/><St l="People" v={PEOPLE.length} c={T.blue}/><St l="Threads" v={THREADS.length} c={T.warn}/><St l="Critical" v={cr} c={T.red}/></div>
<Card bl={T.accent}><div style={{fontFamily:T.mono,fontSize:9,color:T.accent,marginBottom:3}}>THESIS</div><div style={{fontFamily:T.serif,fontSize:12,color:T.text,lineHeight:1.5,fontStyle:"italic"}}>"How does a person whose mind has been broken—by choice, by injury, by circumstance—rebuild agency not through recovery of what was lost, but through construction of what never existed?"</div></Card>
<Sec>Critical Blockers ({cr})</Sec>
{[{i:"🔴",x:"Pete — SA roommate OD'd. Sharpest cost ledger line. NOT excavated, NOT in outline.",t:"t1"},
{i:"🔴",x:"Kinsley — ZERO scenes. Book addressed to her.",t:"t2"},{i:"🔴",x:"Bear — 8 searches=nothing. May be the pivot.",t:"t3"},
{i:"🔴",x:"Tool Archaeology — NOT done.",t:"t4"},{i:"🔴",x:"Gap 2020-22 — EMPTY. No rupture material.",t:"t5"},
{i:"🔴",x:"Zero chapters drafted. O'Toole's ready for prose.",t:"t6"},
{i:"🟡",x:"Title: '240 Ways to Remember' vs 'Construction, Not Recovery'"},{i:"🟡",x:"Structure: 4 options, none chosen. Need 1 chapter first."},
{i:"🟢",x:"Ch 11 card table — LOCKED."},{i:"🟢",x:"O'Toole's excavation — COMPLETE."},{i:"🟢",x:`${SEEDS.length} scene seeds confirmed.`},
].map((it,i)=><Card key={i} onClick={it.t?()=>sendPrompt(THREADS.find(x=>x.id===it.t)?.pm||""):undefined}><div style={{display:"flex",gap:5,alignItems:"flex-start"}}><span style={{fontSize:10}}>{it.i}</span><div style={{fontFamily:T.sans,fontSize:10,color:T.text,lineHeight:1.4}}>{it.x}{it.t&&<span style={{fontFamily:T.mono,fontSize:7,color:T.accent,marginLeft:3}}>TAP→</span>}</div></div></Card>)}
<Sec>Career</Sec><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{CAREER.map((c,i)=><span key={i} style={{fontFamily:T.sans,fontSize:9,color:T.dim,background:T.surface,border:`1px solid ${T.border}`,borderRadius:3,padding:"2px 6px"}}>{i>0?"→ ":""}{c}</span>)}</div>
</div>};

const Arch=()=>{const[exp,se]=useState(null);const pts=[{k:"PRO",n:"Prologue"},{k:"I",n:"Before the Break"},{k:"II",n:"The Rupture"},{k:"III",n:"The Construction"},{k:"IV",n:"Late-Life Emergence"},{k:"V",n:"Parallel Constructions"},{k:"EPI",n:"Epilogue"}];return <div>
<div style={{fontFamily:T.serif,fontSize:16,color:T.text,marginBottom:10}}>Architecture</div>
{pts.map(({k,n})=><div key={k} style={{marginBottom:10}}><div style={{fontFamily:T.mono,fontSize:9,color:T.accent,marginBottom:3}}>{k==="PRO"||k==="EPI"?k:`PART ${k}`} — {n}</div>
{OUTLINE.filter(c=>c.p===k).map((ch,i)=><Card key={i} onClick={()=>se(exp===ch.ch?null:ch.ch)}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontFamily:T.mono,fontSize:9,color:T.dim,marginRight:5}}>{ch.ch}</span><span style={{fontFamily:T.sans,fontSize:11,color:T.text}}>{ch.t}</span></div><Badge s={ch.s} sm/></div>{exp===ch.ch&&<div style={{fontFamily:T.sans,fontSize:10,color:T.dim,marginTop:5,lineHeight:1.5,borderTop:`1px solid ${T.border}`,paddingTop:5}}>{ch.n}</div>}</Card>)}</div>)}
<Sec>Structure Options (None Chosen)</Sec>{STRUCTURAL.map((o,i)=><Card key={i}><span style={{fontFamily:T.sans,fontSize:11,color:T.text,fontWeight:600}}>{o.n}</span><div style={{fontFamily:T.sans,fontSize:10,color:T.dim}}>{o.d}</div></Card>)}
<Sec>{UNPLACED.length} Unplaced</Sec>{UNPLACED.map((u,i)=><L key={i} l="•" v={u} c={T.red}/>)}
</div>};

const Ppl=()=>{const[exp,se]=useState(null);const gs={critical:"Critical (Cost Ledger)",core:"Core",five:"The Five",secondary:"Secondary",protected:"Protected"};return <div>
<div style={{fontFamily:T.serif,fontSize:16,color:T.text,marginBottom:10}}>People ({PEOPLE.length})</div>
{Object.entries(gs).map(([k,lb])=>{const g=PEOPLE.filter(p=>p.g===k);if(!g.length)return null;return <div key={k}><Sec>{lb}</Sec>{g.map((p,i)=><Card key={i} onClick={()=>se(exp===p.nm?null:p.nm)} bl={k==="critical"?T.red:undefined}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><span style={{fontFamily:T.sans,fontSize:11,color:T.text,fontWeight:600}}>{p.nm}</span><span style={{fontFamily:T.mono,fontSize:8,color:T.dim,marginLeft:5}}>{p.rl}</span></div><Badge s={p.s} sm/></div>{exp===p.nm&&<div style={{fontFamily:T.sans,fontSize:10,color:T.dim,marginTop:5,lineHeight:1.5,borderTop:`1px solid ${T.border}`,paddingTop:5}}>{p.n}</div>}</Card>)}</div>})}
</div>};

const Mat=()=>{const[sub,ss]=useState("seeds");return <div>
<div style={{fontFamily:T.serif,fontSize:16,color:T.text,marginBottom:8}}>Material</div>
<div style={{display:"flex",gap:3,marginBottom:12,flexWrap:"wrap"}}>{[["seeds",`Seeds(${SEEDS.length})`],["clinical","Clinical"],["timeline","Timeline"],["quotes",`Quotes(${QUOTES.length})`],["songs",`Songs(${SONGS.length})`],["sources","Sources"],["rejected","Rejected"]].map(([k,l])=><button key={k} onClick={()=>ss(k)} style={{background:sub===k?T.accent+"22":"transparent",border:`1px solid ${sub===k?T.accent:T.border}`,color:sub===k?T.accent:T.dim,borderRadius:4,padding:"2px 7px",fontFamily:T.mono,fontSize:8,cursor:"pointer"}}>{l}</button>)}</div>
{sub==="seeds"&&SEEDS.map(s=><Card key={s.id}><div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><span style={{fontFamily:T.mono,fontSize:8,color:T.dim}}>SEED {s.id}</span><Badge s={s.s} sm/></div><div style={{fontFamily:T.sans,fontSize:11,color:T.text,fontWeight:600}}>{s.t}</div><div style={{fontFamily:T.sans,fontSize:9,color:T.dim,marginTop:1,lineHeight:1.4}}>{s.n}</div></Card>)}
{sub==="clinical"&&<><Sec>Total Brain (Jul 2022)</Sec><Card><div style={{fontFamily:T.mono,fontSize:8,color:T.dim,marginBottom:4}}>ENGINE FULL SPEED · STORAGE EMPTY</div>{CLINICAL_SCORES.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",marginBottom:3}}><div style={{fontFamily:T.sans,fontSize:9,color:T.dim,width:100}}>{s.m}</div><div style={{flex:1,background:T.border,borderRadius:2,height:10,overflow:"hidden"}}><div style={{width:`${s.p}%`,height:"100%",borderRadius:2,background:s.p>=80?T.green:s.p>=40?T.blue:T.red}}/></div><div style={{fontFamily:T.mono,fontSize:9,color:T.text,width:32,textAlign:"right"}}>{s.p}th</div></div>)}</Card>
<Sec>Amen — DATE CONFLICT</Sec><Card bl={T.red}><div style={{fontFamily:T.mono,fontSize:8,color:T.red}}>DO NOT RESOLVE</div><div style={{fontFamily:T.sans,fontSize:9,color:T.dim,lineHeight:1.5,marginTop:2}}>p2: "summer 2020" · p3+physician: "Oct 2021." Physician's notes have same confusion as patient. Evidence, not error.</div></Card>
<Sec>SPECT</Sec><Card><div style={{fontFamily:T.sans,fontSize:9,color:T.dim}}>Toxicity/scalloping from substance abuse + oxygen deprivation.</div></Card>
<Card><div style={{fontFamily:T.mono,fontSize:8,color:T.warn}}>CHROMIUM</div><div style={{fontFamily:T.sans,fontSize:9,color:T.dim}}>Allergic to Amen supplements. 3-4mo itching skin off legs while bartending.</div></Card></>}
{sub==="timeline"&&<><Sec>Substances</Sec>{SUB_TL.map((s,i)=><L key={i} l={s.y} v={s.w}/>)}<Sec>Treatment</Sec>{TX.map((t,i)=><L key={i} l="→" v={t}/>)}<Sec>Career</Sec>{CAREER.map((c,i)=><L key={i} l={`${i+1}`} v={c}/>)}</>}
{sub==="quotes"&&QUOTES.map((q,i)=><Q key={i} t={q.t} c={q.c} b={i<5?T.green:T.blue}/>)}
{sub==="songs"&&<div style={{display:"flex",flexWrap:"wrap",gap:2}}>{SONGS.map((s,i)=><span key={i} style={{fontFamily:T.mono,fontSize:7,color:T.dim,background:T.surface,border:`1px solid ${T.border}`,borderRadius:2,padding:"1px 4px"}}>{s.replace(/_/g," ")}</span>)}</div>}
{sub==="sources"&&<>{["PRIMARY SOURCE ARCHIVE — 895 lines transcribed. Journals, poems, emails, worksheets. Michael journal, therapy worksheets, letter never sent.","CLINICAL — Amen eval PDF, SPECT (4 views), CPT 3, lab orders, brain system handout, PHQ-9, CAGE-AID.","SUDOWRITE — Story bible + manuscript (Construction Manifesto prose + shells) + style profile (~1,700w).","PHOTOS — Trump Tower (~2015/16). Card table 1:30am (Ch 11 anchor). Hospital pajamas still exist."].map((s,i)=><Card key={i}><div style={{fontFamily:T.sans,fontSize:10,color:T.dim}}>{s}</div></Card>)}</>}
{sub==="rejected"&&REJECTED.map((r,i)=><Card key={i}><span style={{fontFamily:T.sans,fontSize:10,color:T.red,textDecoration:"line-through"}}>{r.i}</span><span style={{fontFamily:T.sans,fontSize:9,color:T.dim,marginLeft:6}}>{r.r}</span></Card>)}
</div>};

const Dig=()=>{const[f,sf]=useState("all");const fl=f==="all"?THREADS:THREADS.filter(t=>t.pr===f);return <div>
<div style={{fontFamily:T.serif,fontSize:16,color:T.text,marginBottom:8}}>Excavation ({THREADS.length})</div>
<div style={{display:"flex",gap:3,marginBottom:12}}>{[["all","All"],["critical","Critical"],["high","High"],["medium","Med"]].map(([k,l])=><button key={k} onClick={()=>sf(k)} style={{background:f===k?T.accent+"22":"transparent",border:`1px solid ${f===k?T.accent:T.border}`,color:f===k?T.accent:T.dim,borderRadius:4,padding:"2px 7px",fontFamily:T.mono,fontSize:8,cursor:"pointer"}}>{l}({k==="all"?THREADS.length:THREADS.filter(t=>t.pr===k).length})</button>)}</div>
{fl.map(t=><Card key={t.id} onClick={()=>sendPrompt(t.pm)} bl={t.pr==="critical"?T.red:t.pr==="high"?T.warn:T.dim}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:1}}><span style={{fontFamily:T.sans,fontSize:11,color:T.text,fontWeight:600}}>{t.t}</span><Badge s={t.pr} sm/></div><div style={{fontFamily:T.sans,fontSize:9,color:T.dim,lineHeight:1.4}}>{t.pm.substring(0,130)}...</div><div style={{fontFamily:T.mono,fontSize:7,color:T.accent,marginTop:3}}>TAP→START</div></Card>)}
</div>};

const Voi=()=><div>
<div style={{fontFamily:T.serif,fontSize:16,color:T.text,marginBottom:10}}>Voice DNA</div>
<Sec>Working Examples ({QUOTES.length})</Sec>{QUOTES.slice(0,6).map((q,i)=><Q key={i} t={q.t} c={q.c} b={T.green}/>)}
<Sec>Never</Sec>{["And that's when I realized...","Looking back, I can see...","It was then that everything changed...","Rock bottom became the solid foundation...","Grateful for the journey","Meaning too available too fast","LinkedIn influencer energy","Epiphanies — only recalibrations"].map((v,i)=><div key={i} style={{fontFamily:T.sans,fontSize:10,color:T.red,padding:"2px 0",textDecoration:i<5?"line-through":"none"}}>{i<5?`"${v}"`:v}</div>)}
<Sec>Rules</Sec>{["Declarative — readers draw conclusions","Technical emotion descriptions","Uncertainty admitted","Humor doesn't defuse prematurely","Short. Long. Short again.","Contradictions held, not resolved","Profanity on the beat","Engineering metaphors = real processing","Pete/SA/homelessness — not smoothed","'Never exceptional' — childhood visible"].map((r,i)=><L key={i} l="→" v={r}/>)}
<Sec>Chapter Checklist</Sec>{["□ No self-help patterns","□ No epiphanies","□ Every claim traceable","□ Uncertainty labeled","□ Kinsley test: would 20yo understand?","□ Spine visible","□ Ends on image/question, NOT realization"].map((r,i)=><div key={i} style={{fontFamily:T.mono,fontSize:9,color:T.dim,padding:"2px 0"}}>{r}</div>)}
</div>;

const Ses=()=><div>
<div style={{fontFamily:T.serif,fontSize:16,color:T.text,marginBottom:10}}>Sessions</div>
{[...SESSIONS].reverse().map((s,i)=><Card key={i}><span style={{fontFamily:T.mono,fontSize:9,color:T.accent}}>{s.d}</span><div style={{fontFamily:T.sans,fontSize:11,color:T.text,fontWeight:600,marginTop:1}}>{s.f}</div><div style={{fontFamily:T.sans,fontSize:9,color:T.dim,marginTop:1,lineHeight:1.5}}>{s.o}</div></Card>)}
<Sec>Carry Forward</Sec>{["Card table 1:30am photo—not uploaded","'Huge memory' Apr 16—verify captured","Draft opening Kyle wrote—status unknown","Locked: Crisis→Phillis→Bear→card table→cascade→Chaos Club","Pete needs dedicated session","Structure after first draft","Michael timeline unknown","Kinsley birth vs TBI timing unknown","15 clarifiers still pending"].map((c,i)=><L key={i} l="→" v={c} c={T.accent}/>)}
</div>;

const TABS=[{k:"dash",l:"Dashboard",i:"◆"},{k:"arch",l:"Architecture",i:"▤"},{k:"ppl",l:"People",i:"◎"},{k:"mat",l:"Material",i:"▣"},{k:"dig",l:"Excavation",i:"⛏"},{k:"voi",l:"Voice",i:"¶"},{k:"ses",l:"Sessions",i:"◷"}];

export default function MemoirCommandCenter(){const[tab,st]=useState("dash");return <div style={{background:T.bg,minHeight:"100vh",color:T.text,fontFamily:T.sans}}>
<div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"9px 12px"}}><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:5,height:5,borderRadius:"50%",background:T.accent}}/><span style={{fontFamily:T.mono,fontSize:9,color:T.accent,letterSpacing:".1em"}}>MEMOIR COMMAND CENTER</span><span style={{fontFamily:T.mono,fontSize:8,color:T.dim,marginLeft:"auto"}}>{PEOPLE.length}p·{SEEDS.length}s·{THREADS.length}t·{SONGS.length}songs</span></div></div>
<div style={{display:"flex",overflowX:"auto",background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"0 4px"}}>{TABS.map(t=><button key={t.k} onClick={()=>st(t.k)} style={{background:"transparent",border:"none",padding:"7px 9px",color:tab===t.k?T.accent:T.dim,cursor:"pointer",fontFamily:T.mono,fontSize:8,whiteSpace:"nowrap",borderBottom:tab===t.k?`2px solid ${T.accent}`:"2px solid transparent"}}><span style={{marginRight:2,fontSize:10}}>{t.i}</span>{t.l}</button>)}</div>
<div style={{padding:"12px",maxWidth:660,margin:"0 auto"}}>{tab==="dash"&&<Dash/>}{tab==="arch"&&<Arch/>}{tab==="ppl"&&<Ppl/>}{tab==="mat"&&<Mat/>}{tab==="dig"&&<Dig/>}{tab==="voi"&&<Voi/>}{tab==="ses"&&<Ses/>}</div>
<div style={{padding:"14px 12px",textAlign:"center",borderTop:`1px solid ${T.border}`}}><div style={{fontFamily:T.mono,fontSize:7,color:T.dim}}>May 8 2026 · 0 drafted · 1 locked · {SEEDS.length} seeds · {PEOPLE.length} people · {THREADS.length} threads · {UNPLACED.length} unplaced · {SONGS.length} songs</div></div>
</div>}
