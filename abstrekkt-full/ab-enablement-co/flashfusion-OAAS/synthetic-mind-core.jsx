import { useState } from "react";

const VIEWS = { FEED: "feed", LOGS: "logs", ARCHIVE: "archive", DIAG: "diag" };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400;1,700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500&display=swap');

.smc*{box-sizing:border-box;margin:0;padding:0;}
.smc{
  --bg:#07090e;--surf:#0c1220;--surf2:#111927;--side:#05070f;
  --cy:#00d8ff;--pu:#8b5cf6;--pk:#f06292;--am:#ffa03c;
  --tx:#cdd6ed;--tm:#4d5f7a;--td:#232f42;
  --br:rgba(255,255,255,0.065);--bcy:rgba(0,216,255,0.28);
  font-family:'Inter',-apple-system,sans-serif;
  font-size:14px;color:var(--tx);
  background:var(--bg);display:flex;
  height:100vh;min-height:600px;overflow:hidden;
}

/* ─── SIDEBAR ─── */
.s-bar{
  width:206px;min-width:206px;background:var(--side);
  border-right:1px solid var(--br);
  display:flex;flex-direction:column;
}
.s-head{
  padding:18px 16px 15px;border-bottom:1px solid var(--br);
}
.s-wordmark{
  font-family:'JetBrains Mono',monospace;font-size:10.5px;font-weight:500;
  color:var(--cy);letter-spacing:.12em;text-transform:uppercase;
}
.s-st{
  font-family:'JetBrains Mono',monospace;font-size:9.5px;
  color:var(--tm);margin-top:3px;letter-spacing:.08em;
}
.s-nav{padding:12px 0;flex:1;}
.s-item{
  display:flex;align-items:center;gap:9px;
  padding:9px 16px;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--tm);cursor:pointer;
  border-left:2px solid transparent;
  transition:color .15s,border-color .15s,background .15s;
  user-select:none;
}
.s-item:hover{color:var(--tx);background:rgba(255,255,255,0.025);}
.s-item.on{color:var(--cy);border-left-color:var(--cy);background:rgba(0,216,255,0.045);}
.s-item svg{width:13px;height:13px;flex-shrink:0;opacity:.75;}
.s-item.on svg{opacity:1;}
.s-div{height:1px;background:var(--br);margin:8px 16px;}

.s-live{
  margin:0 12px 14px;
  background:rgba(0,216,255,0.04);
  border:1px solid rgba(0,216,255,0.12);
  border-radius:5px;padding:11px 13px;
}
.s-live-top{display:flex;align-items:center;gap:6px;margin-bottom:8px;}
.s-dot{
  width:5px;height:5px;border-radius:50%;
  background:var(--cy);animation:blink 2s infinite;
}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.35;}}
.s-live-lbl{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;color:var(--cy);letter-spacing:.1em;text-transform:uppercase;
}
.s-row{
  display:flex;justify-content:space-between;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;color:var(--tm);margin-bottom:3px;letter-spacing:.05em;
}
.s-row b{color:var(--tx);font-weight:400;}

/* ─── MAIN ─── */
.s-main{flex:1;overflow-y:auto;background:var(--bg);position:relative;}

/* ─── NEURAL FEED ─── */
.v-feed{
  min-height:100%;display:flex;align-items:center;
  padding:60px 68px;position:relative;overflow:hidden;
}
.f-orb{position:absolute;border-radius:50%;pointer-events:none;}
.f-o1{
  width:480px;height:480px;top:-80px;right:-60px;
  background:radial-gradient(circle,rgba(139,92,246,.13) 0%,transparent 68%);
}
.f-o2{
  width:260px;height:260px;bottom:-50px;left:80px;
  background:radial-gradient(circle,rgba(0,216,255,.09) 0%,transparent 68%);
}
.f-body{position:relative;max-width:560px;}
.f-meta{
  display:flex;align-items:center;gap:10px;margin-bottom:26px;
}
.f-tag{
  font-family:'JetBrains Mono',monospace;font-size:9.5px;
  color:var(--cy);letter-spacing:.1em;
  background:rgba(0,216,255,.08);
  border:1px solid rgba(0,216,255,.22);
  border-radius:3px;padding:4px 9px;
}
.f-slash{
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;color:var(--td);letter-spacing:.1em;
}
.f-h1{
  font-family:'Playfair Display',Georgia,serif;
  font-size:74px;line-height:.93;
  font-weight:400;color:var(--tx);
  letter-spacing:-.025em;margin-bottom:2px;
}
.f-h1i{font-style:italic;color:var(--pk);}
.f-quote{
  font-family:'Playfair Display',Georgia,serif;
  font-style:italic;font-size:15.5px;
  color:var(--tm);line-height:1.75;
  max-width:460px;margin:28px 0 38px;
  border-left:2px solid var(--pu);padding-left:16px;
}
.f-acts{display:flex;align-items:center;gap:24px;}
.btn-cy{
  background:var(--cy);color:#050810;
  font-family:'JetBrains Mono',monospace;
  font-size:10.5px;font-weight:500;
  letter-spacing:.12em;text-transform:uppercase;
  padding:13px 26px;border:none;border-radius:3px;
  cursor:pointer;transition:opacity .15s,transform .15s;
}
.btn-cy:hover{opacity:.82;transform:translateY(-1px);}
.btn-cy:focus-visible{outline:2px solid var(--cy);outline-offset:3px;}
.f-lat{
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;color:var(--tm);line-height:1.8;letter-spacing:.07em;
}
.f-lat span{display:block;}

/* ─── SYSTEM LOGS ─── */
.v-logs{padding:42px 50px;}
.l-meta{
  display:flex;gap:20px;flex-wrap:wrap;
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;color:var(--tm);
  letter-spacing:.1em;margin-bottom:10px;
}
.l-meta span{display:flex;align-items:center;gap:5px;}
.mdot{width:5px;height:5px;border-radius:50%;display:inline-block;}
.l-title{
  font-family:'Playfair Display',Georgia,serif;
  font-style:italic;font-size:48px;
  font-weight:400;color:var(--tx);
  line-height:1;margin-bottom:26px;
  letter-spacing:-.01em;
}
.l-filters{display:flex;gap:10px;margin-bottom:32px;flex-wrap:wrap;align-items:center;}
.f-inp{
  flex:1;min-width:180px;
  background:var(--surf);border:1px solid var(--br);border-radius:4px;
  padding:9px 13px;
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--tx);letter-spacing:.06em;outline:none;
  transition:border-color .15s;
}
.f-inp:focus{border-color:var(--bcy);}
.f-inp::placeholder{color:var(--td);}
.f-sel{
  background:var(--surf);border:1px solid var(--br);border-radius:4px;
  padding:9px 13px;
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--tx);letter-spacing:.06em;outline:none;cursor:pointer;
}
.l-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(270px,1fr));
  gap:14px;
}
.lc{
  background:var(--surf);border:1px solid var(--br);
  border-radius:8px;overflow:hidden;cursor:pointer;
  transition:border-color .2s,transform .2s;
}
.lc:hover{border-color:rgba(0,216,255,.22);transform:translateY(-2px);}
.lc:focus-visible{outline:2px solid var(--cy);outline-offset:2px;}
.lc-img{height:130px;position:relative;overflow:hidden;background:#09101e;}
.lc-orb{position:absolute;border-radius:50%;pointer-events:none;}
.lc-tag{
  position:absolute;top:11px;left:11px;
  font-family:'JetBrains Mono',monospace;
  font-size:8.5px;letter-spacing:.12em;text-transform:uppercase;
  padding:3px 8px;border-radius:3px;
}
.tc{background:rgba(0,216,255,.12);border:1px solid rgba(0,216,255,.25);color:var(--cy);}
.td2{background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.25);color:var(--pu);}
.ta{background:rgba(240,98,146,.12);border:1px solid rgba(240,98,146,.25);color:var(--pk);}
.ts2{background:rgba(255,160,60,.12);border:1px solid rgba(255,160,60,.25);color:var(--am);}
.lc-id{
  position:absolute;bottom:9px;right:11px;
  font-family:'JetBrains Mono',monospace;
  font-size:8.5px;color:var(--tm);letter-spacing:.07em;
}
.lc-body{padding:15px 17px 17px;}
.lc-name{
  font-family:'Playfair Display',Georgia,serif;
  font-size:16px;font-weight:400;color:var(--tx);
  margin-bottom:7px;
}
.lc-desc{
  font-size:11.5px;color:var(--tm);
  line-height:1.6;margin-bottom:13px;
}
.lc-foot{
  display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid var(--br);padding-top:11px;
}
.lc-stat{
  font-family:'JetBrains Mono',monospace;
  font-size:9px;color:var(--td);letter-spacing:.06em;
}
.lc-stat b{color:var(--tm);font-weight:400;}
.btn-dl{
  background:transparent;
  border:1px solid rgba(0,216,255,.3);
  border-radius:3px;padding:5px 11px;
  font-family:'JetBrains Mono',monospace;
  font-size:8.5px;color:var(--cy);
  letter-spacing:.1em;text-transform:uppercase;
  cursor:pointer;transition:background .15s;
}
.btn-dl:hover{background:rgba(0,216,255,.08);}
.btn-dl:focus-visible{outline:2px solid var(--cy);outline-offset:2px;}

/* ─── ARCHIVE / CONSULTING ─── */
.v-arch{padding:42px 50px;}
.a-head{text-align:center;margin-bottom:40px;}
.a-title{
  font-family:'JetBrains Mono',monospace;
  font-size:24px;font-weight:500;
  letter-spacing:.07em;text-transform:uppercase;
  color:var(--tx);margin-bottom:8px;
}
.a-sub{
  font-family:'Playfair Display',Georgia,serif;
  font-style:italic;font-size:15px;color:var(--tm);
}
.av-sec{text-align:center;margin-bottom:36px;}
.av-lbl{
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--tm);margin-bottom:16px;
}
.av-orb{
  width:120px;height:120px;border-radius:50%;margin:0 auto 12px;
  border:1px solid rgba(139,92,246,.3);
  background:radial-gradient(circle at 38% 35%,rgba(139,92,246,.28),rgba(0,216,255,.12),transparent 70%);
  animation:glow 5s ease-in-out infinite;
}
@keyframes glow{
  0%,100%{box-shadow:0 0 18px rgba(0,216,255,.12);}
  50%{box-shadow:0 0 28px rgba(139,92,246,.18);}
}
.av-focus{
  font-family:'JetBrains Mono',monospace;
  font-size:10.5px;color:var(--tm);letter-spacing:.06em;
}
.av-focus em{color:var(--cy);font-style:normal;}
.svc-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:14px;margin-bottom:36px;
}
.sc{
  background:var(--surf);border:1px solid var(--br);
  border-radius:9px;padding:22px;
  position:relative;overflow:hidden;cursor:pointer;
  transition:border-color .2s,transform .2s;
}
.sc:hover{border-color:rgba(139,92,246,.3);transform:translateY(-2px);}
.sc:focus-visible{outline:2px solid var(--pu);outline-offset:2px;}
.sc-orb{
  position:absolute;right:-16px;top:-16px;
  width:110px;height:110px;border-radius:50%;
  background:radial-gradient(circle,rgba(139,92,246,.14),transparent 70%);
  pointer-events:none;
}
.sc-name{
  font-family:'JetBrains Mono',monospace;
  font-size:10.5px;font-weight:500;
  letter-spacing:.1em;text-transform:uppercase;
  color:var(--tx);margin-bottom:9px;
}
.sc-desc{
  font-size:12px;color:var(--tm);
  line-height:1.65;margin-bottom:20px;min-height:50px;
}
.sc-price{
  font-family:'Playfair Display',Georgia,serif;
  font-size:30px;color:var(--tx);margin-bottom:12px;
}
.sc-price small{
  font-size:12px;color:var(--tm);
  font-family:'JetBrains Mono',monospace;
  font-style:normal;
}
.btn-bk{
  display:flex;align-items:center;gap:7px;
  background:transparent;
  border:1px solid var(--br);border-radius:3px;
  padding:8px 14px;
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--tm);cursor:pointer;
  transition:color .15s,border-color .15s;
}
.btn-bk:hover{color:var(--tx);border-color:rgba(255,255,255,.18);}
.btn-bk:focus-visible{outline:2px solid var(--cy);outline-offset:2px;}
.faq-sec{}
.faq-hd{
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;letter-spacing:.13em;text-transform:uppercase;
  color:var(--tm);margin-bottom:12px;
}
.faq-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px;}
.faq{
  background:var(--surf);border:1px solid var(--br);
  border-radius:6px;padding:13px 15px;
  cursor:pointer;transition:border-color .15s;
}
.faq:hover{border-color:rgba(255,255,255,.11);}
.faq:focus-visible{outline:2px solid var(--cy);outline-offset:2px;}
.faq-q{
  font-size:12px;color:var(--tm);
  display:flex;justify-content:space-between;align-items:center;gap:8px;
}
.faq-ch{color:var(--td);font-size:10px;flex-shrink:0;}
.faq-a{
  font-size:11.5px;color:var(--tm);
  line-height:1.6;margin-top:9px;
  border-top:1px solid var(--br);padding-top:9px;
}

/* ─── DIAGNOSTICS ─── */
.v-diag{padding:42px 50px;}
.d-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.dc{
  background:var(--surf);border:1px solid var(--br);
  border-radius:8px;padding:18px 20px;
}
.dc-hd{
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--tm);margin-bottom:12px;
  border-bottom:1px solid var(--br);padding-bottom:9px;
}
.dr{
  display:flex;justify-content:space-between;align-items:center;
  padding:6px 0;border-bottom:1px solid rgba(255,255,255,.025);
  font-size:12px;
}
.dr:last-child{border:none;}
.dk{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--tm);}
.dv{color:var(--tx);}
.ok{color:#4ade80;}.warn{color:#fbbf24;}
.db-lbl{
  display:flex;justify-content:space-between;
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;color:var(--tm);margin-bottom:4px;margin-top:9px;
}
.db-track{height:3px;background:var(--br);border-radius:2px;overflow:hidden;margin-bottom:10px;}
.db-fill{height:100%;border-radius:2px;background:var(--cy);}
.d-log{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;color:var(--tm);line-height:2;
}
.dl{display:flex;gap:10px;}
.dt{color:var(--td);min-width:40px;}
.ok .dm{color:#4ade80;}.info .dm{color:var(--cy);}.warn .dm{color:#fbbf24;}

/* ─── SECTION HEADER (shared) ─── */
.sec-hd{
  margin-bottom:26px;
}
.sec-hd-path{
  font-family:'JetBrains Mono',monospace;
  font-size:9.5px;color:var(--tm);
  letter-spacing:.1em;margin-bottom:10px;
  background:var(--surf);
  border:1px solid var(--br);border-radius:3px;
  padding:4px 10px;display:inline-block;
}
.sec-hd-title{
  font-family:'Playfair Display',Georgia,serif;
  font-size:38px;font-weight:400;color:var(--tx);
  letter-spacing:-.01em;margin-bottom:4px;
}
.sec-hd-sub{font-size:13px;color:var(--tm);line-height:1.6;max-width:520px;}
`;

const NavIcon = ({ type, active }) => {
  const c = active ? "#00d8ff" : "#4d5f7a";
  const icons = {
    feed: <svg viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.4"><path d="M7 2C4.2 2 2 4.2 2 7s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z"/><circle cx="7" cy="7" r="1.5" fill={c} stroke="none"/><path d="M7 4v1M7 9v1M4 7H3M11 7h-1"/></svg>,
    logs: <svg viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.4"><rect x="2" y="2" width="10" height="10" rx="1.5"/><path d="M4.5 5h5M4.5 7h5M4.5 9h3"/></svg>,
    archive: <svg viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.4"><path d="M2 4h10M3 4v7h8V4"/><path d="M5.5 7h3"/></svg>,
    diag: <svg viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.4"><path d="M2 10l2.5-4 2 2 2-5 2 4"/><circle cx="11.5" cy="7" r=".8" fill={c} stroke="none"/></svg>,
    docs: <svg viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.4"><rect x="3" y="1.5" width="8" height="11" rx="1"/><path d="M5 5h4M5 7.5h4M5 10h2"/></svg>,
    sec: <svg viewBox="0 0 14 14" fill="none" stroke={c} strokeWidth="1.4"><path d="M7 1.5L2.5 3.5v4c0 2.5 2 4.5 4.5 5 2.5-.5 4.5-2.5 4.5-5v-4L7 1.5z"/></svg>,
  };
  return icons[type] || null;
};

function Sidebar({ view, setView }) {
  const nav = [
    { id: VIEWS.FEED, label: "Home", icon: "feed" },
    { id: VIEWS.LOGS, label: "Projects", icon: "logs" },
    { id: VIEWS.ARCHIVE, label: "Consulting", icon: "archive" },
    { id: VIEWS.DIAG, label: "System Status", icon: "diag" },
  ];
  const btm = [
    { id: "docs", label: "Docs", icon: "docs" },
    { id: "sec", label: "Security", icon: "sec" },
  ];
  return (
    <nav className="s-bar" aria-label="Primary navigation">
      <div className="s-head">
        <div className="s-wordmark">Synthetic_Mind</div>
        <div className="s-st">[STATUS: ACTIVE]</div>
      </div>
      <div className="s-nav">
        {nav.map(n => (
          <div
            key={n.id}
            className={`s-item${view === n.id ? " on" : ""}`}
            onClick={() => setView(n.id)}
            role="button"
            tabIndex={0}
            aria-current={view === n.id ? "page" : undefined}
            onKeyDown={e => e.key === "Enter" && setView(n.id)}
          >
            <NavIcon type={n.icon} active={view === n.id} />
            {n.label}
          </div>
        ))}
        <div className="s-div" />
        {btm.map(n => (
          <div key={n.id} className="s-item" role="button" tabIndex={0}>
            <NavIcon type={n.icon} active={false} />
            {n.label}
          </div>
        ))}
      </div>
      <div className="s-live">
        <div className="s-live-top">
          <div className="s-dot" />
          <div className="s-live-lbl">Live_Connection_Active</div>
        </div>
        <div className="s-row"><span>NODE_CLUSTER</span><b>NORTH_ORBIT_4</b></div>
        <div className="s-row"><span>UPLINK</span><b>99.9%</b></div>
        <div className="s-row"><span>TEMP</span><b>23°C STABLE</b></div>
      </div>
    </nav>
  );
}

function BrainOrb({ w = 200, h = 200, c1 = "rgba(0,216,255,.22)", c2 = "rgba(139,92,246,.15)", x = "38%", y = "35%" }) {
  return (
    <div className="lc-orb" style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(circle at ${x} ${y}, ${c1}, ${c2}, transparent 72%)`
    }} aria-hidden="true" />
  );
}

function NeuralFeedView() {
  return (
    <main className="v-feed" aria-label="Neural Feed">
      <div className="f-orb f-o1" aria-hidden="true" />
      <div className="f-orb f-o2" aria-hidden="true" />
      <div className="f-body">
        <div className="f-meta">
          <span className="f-tag">[MEMOIR_ID: 0x7F]</span>
          <span className="f-slash">// INITIALIZING_SYNTHESIS</span>
        </div>
        <h1 className="f-h1">
          The Synthetic<br />
          <span className="f-h1i">Mind.</span>
        </h1>
        <p className="f-quote">
          Resilience is not merely enduring the void; it is the act of restructuring
          one's architecture to thrive within it. A study in calculated adaptation.
        </p>
        <div className="f-acts">
          <button className="btn-cy">Access Neural Record</button>
          <div className="f-lat">
            <span>LATENCY: 12MS</span>
            <span>SYNC: OPTIMAL</span>
          </div>
        </div>
      </div>
    </main>
  );
}

const CARDS = [
  {
    tag: "Framework", tagCls: "tc",
    id: "ID: 99_ALPHA", title: "Cognitive_Workflow_v2",
    desc: "Autonomous task orchestration for high-latency decentralized environments.",
    stat: "INTEGRITY", statVal: "CRITICAL_STABLE",
    o1: { c1: "rgba(0,216,255,.3)", c2: "rgba(0,216,255,.08)", x: "30%", y: "30%" },
  },
  {
    tag: "Dataset", tagCls: "td2",
    id: "ID: B_CORE_001", title: "Linguistic_Matrix_Delta",
    desc: "Multi-vector embedding space for semantic mapping of human-machine intent.",
    stat: "VOLUME", statVal: "4.2_PETABYTES",
    o1: { c1: "rgba(139,92,246,.3)", c2: "rgba(139,92,246,.08)", x: "60%", y: "40%" },
  },
  {
    tag: "Architecture", tagCls: "ta",
    id: "ID: XOS_OMEGA", title: "Neural_Bus_Interface",
    desc: "Hardware-level bridge for low-latency synchronization of synthetic minds.",
    stat: "BUILD_LINE", statVal: "BETA_RELEASE",
    o1: { c1: "rgba(240,98,146,.25)", c2: "rgba(240,98,146,.07)", x: "50%", y: "25%" },
  },
  {
    tag: "System_Core", tagCls: "tc",
    id: "ID: OMN_LEGACY", title: "Omni_Node_Protocol [LEGACY]",
    desc: "The foundational protocol for early autonomous agent networking. Deprecated but highly optimized.",
    stat: "SYNC_RATE", statVal: "99.9%_ACC",
    o1: { c1: "rgba(0,216,255,.18)", c2: "rgba(139,92,246,.12)", x: "40%", y: "50%" },
  },
  {
    tag: "Security", tagCls: "ts2",
    id: "ID: QFW_NODE", title: "Quantum_Firewall_Node",
    desc: "Probabilistic intrusion detection systems for high-value data repositories.",
    stat: "THREAT_LVL", statVal: "ZERO_TRUST",
    o1: { c1: "rgba(255,160,60,.22)", c2: "rgba(255,160,60,.06)", x: "55%", y: "30%" },
  },
  {
    tag: "Dataset", tagCls: "td2",
    id: "ID: LNG_ANOM", title: "Linguistic_Anomalies",
    desc: "Curated set of 4M multi-lingual edge cases for testing semantic boundary breakdown.",
    stat: "SIZE", statVal: "14.2_GB",
    o1: { c1: "rgba(139,92,246,.26)", c2: "rgba(0,216,255,.1)", x: "35%", y: "60%" },
  },
];

function SystemLogsView() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("ALL_TYPES");
  const filtered = CARDS.filter(c =>
    (type === "ALL_TYPES" || c.tag.toUpperCase().includes(type)) &&
    (query === "" || c.title.toLowerCase().includes(query.toLowerCase()) || c.desc.toLowerCase().includes(query.toLowerCase()))
  );
  return (
    <main className="v-logs" aria-label="System Logs">
      <div className="l-meta">
        <span><span className="mdot" style={{ background: "#00d8ff" }} />MATCH_COUNT: {filtered.length}_NODES</span>
        <span><span className="mdot" style={{ background: "#8b5cf6" }} />SEARCH_LATENCY: 0.042MS</span>
        <span><span className="mdot" style={{ background: "#f06292" }} />FILTER_MODE: HEURISTIC_ACTIVE</span>
      </div>
      <h1 className="l-title">[Query_Results:<br />AI_Automation]</h1>
      <div className="l-filters">
        <input
          className="f-inp"
          placeholder="REFINE_PARAMETERS..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search assets"
        />
        <select
          className="f-sel"
          value={type}
          onChange={e => setType(e.target.value)}
          aria-label="Filter by node type"
        >
          <option value="ALL_TYPES">ALL_TYPES</option>
          <option value="FRAMEWORK">FRAMEWORK</option>
          <option value="DATASET">DATASET</option>
          <option value="ARCHITECTURE">ARCHITECTURE</option>
          <option value="SECURITY">SECURITY</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "var(--tm)", padding: "32px 0" }}>
          [NO_NODES_MATCHED] — Try broadening your query parameters.
        </div>
      ) : (
        <div className="l-grid" role="list">
          {filtered.map((c, i) => (
            <article key={i} className="lc" role="listitem" tabIndex={0} aria-label={c.title}>
              <div className="lc-img">
                <BrainOrb {...c.o1} />
                <div className="lc-orb" style={{
                  position: "absolute",
                  width: 80, height: 80,
                  bottom: -20, right: 30,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.05)",
                  background: "radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%)"
                }} aria-hidden="true" />
                <span className={`lc-tag ${c.tagCls}`}>{c.tag}</span>
                <span className="lc-id">{c.id}</span>
              </div>
              <div className="lc-body">
                <h2 className="lc-name">{c.title}</h2>
                <p className="lc-desc">{c.desc}</p>
                <div className="lc-foot">
                  <span className="lc-stat"><b>{c.stat}:</b> {c.statVal}</span>
                  <button className="btn-dl" aria-label={`Download blueprint for ${c.title}`}>
                    Download_Blueprint
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

const SERVICES = [
  {
    name: "Architectural Review",
    desc: "In-depth system audit & strategic roadmap. Includes cognitive data analysis and neural pattern mapping.",
    price: "$1,500", priceSub: "",
  },
  {
    name: "Custom Implementation",
    desc: "Tailored AI model development & integration. Full-stack execution across your infrastructure.",
    price: "$5,000", priceSub: "+",
  },
  {
    name: "Strategic Retainer",
    desc: "Long-term advisory & priority support. Continuous cognitive strategy and architecture review.",
    price: "$3,000", priceSub: " / month",
  },
];

const FAQS = [
  { q: "How do I prepare my data?", a: "Structure datasets in UTF-8 encoded JSON or Parquet. Include schema definitions and ensure no PII leakage. A preprocessing guide is provided on engagement." },
  { q: "What is your cognitive methodology?", a: "A hybrid approach: transformer-based semantic analysis combined with graph neural networks for relationship mapping. Iterative refinement across 3–5 synthesis cycles." },
  { q: "Do you offer remote consultations?", a: "All initial consultations are conducted via encrypted video. On-site engagements are available for retainer clients in the Chicago metro area." },
];

function ArchiveView() {
  const [open, setOpen] = useState(null);
  return (
    <main className="v-arch" aria-label="Consulting Archive">
      <div className="a-head">
        <h1 className="a-title">Consulting & Strategic Booking</h1>
        <p className="a-sub">Cognitive Power, Resilient Solutions. AI Consultant & Builder.</p>
      </div>
      <div className="av-sec">
        <div className="av-lbl">Cognitive Availability</div>
        <div className="av-orb" aria-hidden="true" />
        <div className="av-focus">Currently Focusing On: <em>Advanced AI Architectures</em></div>
      </div>
      <div className="svc-grid" role="list">
        {SERVICES.map((s, i) => (
          <div key={i} className="sc" role="listitem" tabIndex={0} aria-label={s.name}>
            <div className="sc-orb" aria-hidden="true" />
            <div className="sc-name">{s.name}</div>
            <p className="sc-desc">{s.desc}</p>
            <div className="sc-price">{s.price}<small>{s.priceSub}</small></div>
            <button className="btn-bk">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <rect x="1" y="1.5" width="8" height="7.5" rx="1"/><path d="M3 1v2M7 1v2M1 4.5h8"/>
              </svg>
              Scan to Book
            </button>
          </div>
        ))}
      </div>
      <div className="faq-sec">
        <div className="faq-hd">FAQ — Technical Manual</div>
        <div className="faq-grid" role="list">
          {FAQS.map((f, i) => (
            <div
              key={i}
              className="faq"
              role="button"
              tabIndex={0}
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? null : i)}
              onKeyDown={e => e.key === "Enter" && setOpen(open === i ? null : i)}
            >
              <div className="faq-q">
                {f.q}
                <span className="faq-ch">{open === i ? "▲" : "▼"}</span>
              </div>
              {open === i && <p className="faq-a">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function DiagnosticsView() {
  const bars = [
    { label: "CPU_LOAD", pct: 34 },
    { label: "MEMORY_USAGE", pct: 61 },
    { label: "NEURAL_THROUGHPUT", pct: 88 },
  ];
  const logs = [
    { t: "14:21", m: "NODE_SYNC INITIATED...", cls: "info" },
    { t: "14:22", m: "QUERY: AI_AUTOMATION RETURNED 142 RESULTS", cls: "ok" },
    { t: "14:23", m: "INDEXING DEEP-STORAGE LAYERS [8-9]", cls: "info" },
    { t: "14:24", m: "HEURISTIC FILTER: ACTIVE — THRESHOLD 0.72", cls: "ok" },
    { t: "14:25", m: "WARNING: NODE XOS_OMEGA LOAD AT 91%", cls: "warn" },
    { t: "14:26", m: "REBALANCING CLUSTER NORTH_ORBIT_4...", cls: "info" },
    { t: "14:27", m: "SYNC COMPLETE — UPLINK STABLE 99.9%", cls: "ok" },
  ];
  return (
    <main className="v-diag" aria-label="Diagnostics">
      <div className="sec-hd">
        <div className="sec-hd-path">[DIRECTORY: /SYSTEM/DIAGNOSTICS]</div>
        <h1 className="sec-hd-title">System Diagnostics</h1>
        <p className="sec-hd-sub">Live node health, cluster status, and system log stream.</p>
      </div>
      <div className="d-grid">
        <div className="dc">
          <div className="dc-hd">Node Status</div>
          {[
            ["CLUSTER", "NORTH_ORBIT_4"],
            ["UPLINK", <span className="ok">99.9%</span>],
            ["BANDWIDTH", "44.3 GB/S"],
            ["TEMP", <span className="ok">23°C STABLE</span>],
            ["ACTIVE_NODES", "142"],
            ["LATENCY_AVG", <span className="ok">12MS</span>],
            ["AUTH", <span className="ok">VERIFIED</span>],
          ].map(([k, v], i) => (
            <div key={i} className="dr">
              <span className="dk">{k}</span>
              <span className="dv">{v}</span>
            </div>
          ))}
        </div>
        <div className="dc">
          <div className="dc-hd">Resource Utilization</div>
          {bars.map((b, i) => (
            <div key={i}>
              <div className="db-lbl">
                <span>{b.label}</span>
                <span style={{ color: "var(--tx)" }}>{b.pct}%</span>
              </div>
              <div className="db-track">
                <div
                  className="db-fill"
                  style={{
                    width: `${b.pct}%`,
                    background: b.pct > 80 ? "#fbbf24" : "var(--cy)"
                  }}
                />
              </div>
            </div>
          ))}
          <div className="dr" style={{ marginTop: 8 }}>
            <span className="dk">COGNITIVE_INDEX</span>
            <span className="dv ok">CRITICAL_STABLE</span>
          </div>
          <div className="dr">
            <span className="dk">SYNC_RATE</span>
            <span className="dv">99.9%</span>
          </div>
          <div className="dr">
            <span className="dk">REVISION</span>
            <span className="dv">REV_4.0_STABLE</span>
          </div>
        </div>
        <div className="dc" style={{ gridColumn: "1 / -1" }}>
          <div className="dc-hd">System Log Stream</div>
          <div className="d-log">
            {logs.map((l, i) => (
              <div key={i} className={`dl ${l.cls}`}>
                <span className="dt">{l.t}</span>
                <span className="dm">{l.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SyntheticMindCore() {
  const [view, setView] = useState(VIEWS.FEED);
  const views = {
    [VIEWS.FEED]: <NeuralFeedView />,
    [VIEWS.LOGS]: <SystemLogsView />,
    [VIEWS.ARCHIVE]: <ArchiveView />,
    [VIEWS.DIAG]: <DiagnosticsView />,
  };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="smc" role="application" aria-label="Synthetic Mind Core interface">
        <Sidebar view={view} setView={setView} />
        <div className="s-main">
          {views[view]}
        </div>
      </div>
    </>
  );
}
