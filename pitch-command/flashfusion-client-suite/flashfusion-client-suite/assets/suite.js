/* ─────────────────────────────────────────────────────────────
   FlashFusion Client Suite — shared helpers
   Loaded by each tool. Provides React UMD globals + small utils.
   ───────────────────────────────────────────────────────────── */
window.RR = (function(){
  const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch(e){ console.error(e); return false; } };
  const load = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(e){ return fallback; } };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  const today = () => new Date().toISOString().split('T')[0];
  const download = (filename, text) => {
    const blob = new Blob([text], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  };
  return { save, load, uid, today, download };
})();
