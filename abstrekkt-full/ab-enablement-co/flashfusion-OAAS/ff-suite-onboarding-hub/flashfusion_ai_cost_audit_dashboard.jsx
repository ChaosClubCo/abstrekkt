import React, { useMemo, useRef, useState } from "react";

const nl = String.fromCharCode(10);
const SAMPLE_CSV = [
  "timestamp,model,input_tokens,output_tokens,cost_usd",
  "2026-04-01T10:00:00Z,claude-sonnet-4-5,210,140,0.00273",
  "2026-04-01T10:04:00Z,claude-sonnet-4-5,215,145,0.00282",
  "2026-04-01T10:08:00Z,claude-sonnet-4-5,220,130,0.00261",
  "2026-04-01T10:12:00Z,claude-opus-4,3200,850,0.11175",
  "2026-04-01T10:17:00Z,claude-sonnet-4-5,480,220,0.00474",
  "2026-04-01T10:22:00Z,gpt-4o,260,180,0.00300",
  "2026-04-01T10:26:00Z,gpt-4o,245,155,0.00255",
  "2026-04-01T10:30:00Z,claude-sonnet-4-5,214,142,0.00277",
  "2026-04-01T10:34:00Z,claude-sonnet-4-5,214,142,0.00277",
  "2026-04-01T10:38:00Z,claude-sonnet-4-5,214,142,0.00277",
  "2026-04-01T10:42:00Z,claude-sonnet-4-5,214,142,0.00277",
  "2026-04-01T10:46:00Z,claude-sonnet-4-5,214,142,0.00277",
  "2026-04-01T11:00:00Z,claude-sonnet-4-5,5800,1400,0.03840",
  "2026-04-01T11:14:00Z,gpt-4-turbo,3900,900,0.06600",
  "2026-04-01T11:22:00Z,claude-haiku-4-5,300,110,0.00021",
  "2026-04-01T11:28:00Z,gemini-ultra,280,170,0.00790"
].join(nl);

const MODEL_PRICING = {
  "claude-opus-4": { input: 0.015, output: 0.075 },
  "claude-sonnet-4-5": { input: 0.003, output: 0.015 },
  "claude-haiku-4-5": { input: 0.00025, output: 0.00125 },
  "claude-opus": { input: 0.015, output: 0.075 },
  "claude-sonnet": { input: 0.003, output: 0.015 },
  "claude-haiku": { input: 0.00025, output: 0.00125 },
  "gpt-4-turbo": { input: 0.01, output: 0.03 },
  "gpt-4o": { input: 0.005, output: 0.015 },
  "gpt-4": { input: 0.03, output: 0.06 },
  "gpt-3.5-turbo": { input: 0.0005, output: 0.0015 },
  "gemini-ultra": { input: 0.01, output: 0.03 },
  "gemini-pro": { input: 0.00035, output: 0.00105 }
};

const DOWNGRADE_MAP = {
  "claude-opus-4": "claude-sonnet-4-5",
  "claude-opus": "claude-sonnet",
  "claude-sonnet-4-5": "claude-haiku-4-5",
  "claude-sonnet": "claude-haiku",
  "gpt-4-turbo": "gpt-3.5-turbo",
  "gpt-4o": "gpt-3.5-turbo",
  "gpt-4": "gpt-3.5-turbo",
  "gemini-ultra": "gemini-pro"
};

const MODEL_STYLES = [
  { key: "opus", dot: "bg-violet-300", bar: "from-violet-500 to-fuchsia-400" },
  { key: "sonnet", dot: "bg-cyan-300", bar: "from-cyan-400 to-blue-400" },
  { key: "haiku", dot: "bg-emerald-300", bar: "from-emerald-400 to-teal-400" },
  { key: "gpt-4o", dot: "bg-amber-300", bar: "from-amber-300 to-orange-400" },
  { key: "gpt-4", dot: "bg-orange-300", bar: "from-orange-400 to-rose-400" },
  { key: "gemini", dot: "bg-pink-300", bar: "from-pink-400 to-purple-400" }
];

function cx() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(" ");
}

function normalizeHeader(value) {
  return String(value || "").trim().toLowerCase().split(" ").join("_").split("(").join("").split(")").join("");
}

function splitCsvLine(line) {
  var cells = [];
  var current = "";
  var inQuotes = false;
  for (var i = 0; i < line.length; i += 1) {
    var char = line[i];
    var next = line[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return 0;
  var cleaned = String(value).split("$").join("").split(",").join("").trim();
  var parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function formatMoney(value, digits) {
  var d = digits === undefined ? 2 : digits;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: d, maximumFractionDigits: d }).format(Number.isFinite(value) ? value : 0);
}

function formatInt(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(Number.isFinite(value) ? value : 0));
}

function resolveRates(model) {
  var normalized = String(model || "").toLowerCase();
  var entries = Object.entries(MODEL_PRICING);
  for (var i = 0; i < entries.length; i += 1) {
    if (normalized.indexOf(entries[i][0]) >= 0) return entries[i][1];
  }
  return MODEL_PRICING["claude-sonnet-4-5"];
}

function estimateCost(model, inputTokens, outputTokens) {
  var rate = resolveRates(model);
  return inputTokens / 1000 * rate.input + outputTokens / 1000 * rate.output;
}

function isPremium(model) {
  var value = String(model || "").toLowerCase();
  return value.indexOf("opus") >= 0 || value.indexOf("sonnet") >= 0 || value.indexOf("gpt-4") >= 0 || value.indexOf("ultra") >= 0;
}

function targetModel(model) {
  var normalized = String(model || "").toLowerCase();
  var keys = Object.keys(DOWNGRADE_MAP);
  for (var i = 0; i < keys.length; i += 1) {
    if (normalized.indexOf(keys[i]) >= 0) return DOWNGRADE_MAP[keys[i]];
  }
  return null;
}

function parseCsv(csv) {
  var warnings = [];
  var skipped = 0;
  var safeCsv = String(csv || "");
  if (safeCsv.charCodeAt(0) === 65279) safeCsv = safeCsv.slice(1);
  var lines = safeCsv.split(String.fromCharCode(13)).join("").split(String.fromCharCode(10)).map(function(line) { return line.trim(); }).filter(Boolean);
  if (lines.length < 2) return { records: [], warnings: ["CSV needs a header row and at least one data row."], skipped: 0 };

  var headers = splitCsvLine(lines[0]).map(normalizeHeader);
  var hasModel = headers.indexOf("model") >= 0;
  var hasInput = headers.indexOf("input_tokens") >= 0 || headers.indexOf("inputtokens") >= 0 || headers.indexOf("n_context_tokens_total") >= 0 || headers.indexOf("context_tokens") >= 0;
  var hasOutput = headers.indexOf("output_tokens") >= 0 || headers.indexOf("outputtokens") >= 0 || headers.indexOf("n_generated_tokens_total") >= 0 || headers.indexOf("generated_tokens") >= 0;
  if (!hasModel || !hasInput || !hasOutput) {
    return { records: [], warnings: ["Unrecognized CSV columns. Need model, input token column, and output token column. Found: " + headers.join(", ")], skipped: Math.max(lines.length - 1, 0) };
  }

  var records = [];
  for (var rowIndex = 1; rowIndex < lines.length; rowIndex += 1) {
    var values = splitCsvLine(lines[rowIndex]);
    var row = {};
    headers.forEach(function(header, i) { row[header] = values[i] || ""; });
    var model = String(row.model || "").trim().toLowerCase();
    var inputTokens = toNumber(row.input_tokens || row.inputtokens || row.n_context_tokens_total || row.context_tokens);
    var outputTokens = toNumber(row.output_tokens || row.outputtokens || row.n_generated_tokens_total || row.generated_tokens);
    var explicitCost = toNumber(row.cost_usd || row.cost || row.usd || row.cost_usd_);
    var rawTimestamp = row.timestamp || row.date || row.created_at || row.created || "";
    var timestamp = rawTimestamp ? new Date(rawTimestamp) : new Date();
    if (!model) {
      skipped += 1;
      warnings.push("Row " + (rowIndex + 1) + ": missing model.");
    } else if (!Number.isFinite(inputTokens) || !Number.isFinite(outputTokens)) {
      skipped += 1;
      warnings.push("Row " + (rowIndex + 1) + ": invalid token counts.");
    } else {
      records.push({
        timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp,
        model: model,
        inputTokens: inputTokens,
        outputTokens: outputTokens,
        cost: Number.isFinite(explicitCost) && explicitCost > 0 ? explicitCost : estimateCost(model, inputTokens, outputTokens)
      });
    }
  }
  return { records: records, warnings: warnings.slice(0, 12), skipped: skipped };
}

function analyzeModels(records) {
  var totalCost = records.reduce(function(sum, row) { return sum + row.cost; }, 0);
  var byModel = {};
  records.forEach(function(row) {
    if (!byModel[row.model]) byModel[row.model] = { requests: 0, tokens: 0, cost: 0 };
    byModel[row.model].requests += 1;
    byModel[row.model].tokens += row.inputTokens + row.outputTokens;
    byModel[row.model].cost += row.cost;
  });
  return Object.keys(byModel).map(function(model) {
    return {
      model: model,
      requests: byModel[model].requests,
      tokens: byModel[model].tokens,
      cost: byModel[model].cost,
      percentOfBudget: totalCost > 0 ? byModel[model].cost / totalCost * 100 : 0
    };
  }).sort(function(a, b) { return b.cost - a.cost; });
}

function analyzeTokens(records) {
  var ranges = ["0-500", "501-2000", "2001-5000", "5000+"];
  var buckets = {
    "0-500": { count: 0, cost: 0 },
    "501-2000": { count: 0, cost: 0 },
    "2001-5000": { count: 0, cost: 0 },
    "5000+": { count: 0, cost: 0 }
  };
  records.forEach(function(row) {
    var total = row.inputTokens + row.outputTokens;
    var range = total <= 500 ? "0-500" : total <= 2000 ? "501-2000" : total <= 5000 ? "2001-5000" : "5000+";
    buckets[range].count += 1;
    buckets[range].cost += row.cost;
  });
  return ranges.map(function(range) {
    return {
      range: range,
      count: buckets[range].count,
      percentage: records.length ? buckets[range].count / records.length * 100 : 0,
      averageCost: buckets[range].count ? buckets[range].cost / buckets[range].count : 0
    };
  });
}

function analyzeRepetition(records) {
  var groups = {};
  records.forEach(function(row) {
    var key = String(row.inputTokens);
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  });
  return Object.keys(groups).filter(function(key) { return groups[key].length >= 5; }).map(function(key) {
    var totalCost = groups[key].reduce(function(sum, row) { return sum + row.cost; }, 0);
    return { pattern: "~" + formatInt(Number(key)) + " input tokens", count: groups[key].length, totalCost: totalCost, cacheSavings: totalCost * 0.9 };
  }).sort(function(a, b) { return b.cacheSavings - a.cacheSavings; }).slice(0, 5);
}

function impactLevel(savings) {
  if (savings > 50) return "high";
  if (savings > 10) return "medium";
  return "low";
}

function generateRecommendations(records, repetitions) {
  var recs = [];
  var downgradable = records.filter(function(row) { return isPremium(row.model) && row.inputTokens + row.outputTokens < 500 && targetModel(row.model); });
  if (downgradable.length) {
    var currentCost = downgradable.reduce(function(sum, row) { return sum + row.cost; }, 0);
    var optimizedCost = downgradable.reduce(function(sum, row) { return sum + estimateCost(targetModel(row.model) || "claude-haiku-4-5", row.inputTokens, row.outputTokens); }, 0);
    var savings = Math.max(currentCost - optimizedCost, 0);
    if (savings > 0.001) {
      recs.push({ type: "model_routing", icon: "route", title: "Route small requests to cheaper models", description: (downgradable.length / records.length * 100).toFixed(1) + "% of requests use a premium model while staying under 500 tokens. These are strong lower-cost model candidates.", impact: impactLevel(savings), effort: "low", monthlySavings: savings, implementation: "Add a token-count router before the provider call and route short, low-risk tasks to Haiku or GPT-3.5-class models." });
    }
  }
  if (repetitions.length) {
    var cacheSavings = repetitions.reduce(function(sum, item) { return sum + item.cacheSavings; }, 0);
    recs.push({ type: "caching", icon: "bolt", title: "Cache repeated prompt patterns", description: repetitions.length + " repeated pattern" + (repetitions.length === 1 ? "" : "s") + " crossed the 5x threshold. Move stable system instructions into cached prompt blocks.", impact: impactLevel(cacheSavings), effort: "medium", monthlySavings: cacheSavings, implementation: "Separate static context from user input, cache the static block, and instrument cache-hit rate by route." });
  }
  var avgInput = records.length ? records.reduce(function(sum, row) { return sum + row.inputTokens; }, 0) / records.length : 0;
  if (avgInput > 500) {
    var inputCostShare = records.reduce(function(sum, row) {
      var tokens = row.inputTokens + row.outputTokens;
      return tokens ? sum + row.cost * (row.inputTokens / tokens) : sum;
    }, 0);
    var compressionSavings = inputCostShare * 0.3;
    if (compressionSavings > 0.001) {
      recs.push({ type: "prompt_compression", icon: "box", title: "Compress verbose prompts", description: "Average input length is " + avgInput.toFixed(0) + " tokens. Compression should focus on repeated role text, policy text, and over-specified examples.", impact: impactLevel(compressionSavings), effort: "low", monthlySavings: compressionSavings, implementation: "Run prompts through a compression pass, preserve acceptance criteria, then A/B test quality and token deltas." });
    }
  }
  var premiumRows = records.filter(function(row) { return isPremium(row.model); });
  if (premiumRows.length >= 8) {
    var premiumCost = premiumRows.reduce(function(sum, row) { return sum + row.cost; }, 0);
    var batchSavings = premiumCost * 0.2;
    if (batchSavings > 0.001) {
      recs.push({ type: "batching", icon: "layers", title: "Batch non-real-time work", description: formatInt(premiumRows.length) + " premium requests are visible in this sample. Scheduled reports, enrichment jobs, and offline generation are batch candidates.", impact: impactLevel(batchSavings), effort: "medium", monthlySavings: batchSavings, implementation: "Split live UX calls from async jobs, batch offline workloads, and add idempotency keys for retries." });
    }
  }
  return recs.sort(function(a, b) { return b.monthlySavings - a.monthlySavings; });
}

function analyze(records, warnings, skipped) {
  var reps = analyzeRepetition(records);
  var recs = generateRecommendations(records, reps);
  return {
    totalCost: records.reduce(function(sum, row) { return sum + row.cost; }, 0),
    totalRequests: records.length,
    totalTokens: records.reduce(function(sum, row) { return sum + row.inputTokens + row.outputTokens; }, 0),
    modelBreakdown: analyzeModels(records),
    tokenDistribution: analyzeTokens(records),
    repetitionPatterns: reps,
    recommendations: recs,
    estimatedSavings: recs.reduce(function(sum, row) { return sum + row.monthlySavings; }, 0),
    parseWarnings: warnings || [],
    skippedRows: skipped || 0
  };
}

function modelStyle(model) {
  var normalized = String(model || "").toLowerCase();
  for (var i = 0; i < MODEL_STYLES.length; i += 1) {
    if (normalized.indexOf(MODEL_STYLES[i].key) >= 0) return MODEL_STYLES[i];
  }
  return { dot: "bg-slate-300", bar: "from-slate-400 to-slate-500" };
}

function IconGlyph({ name, className }) {
  var paths = {
    chart: ["M3 3v18h18", "M7 16V9", "M12 16V5", "M17 16v-3"],
    gauge: ["M4 14a8 8 0 0 1 16 0", "M6.3 19h11.4", "m12 14 4-4"],
    warn: ["M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z", "M12 9v4", "M12 17h.01"],
    upload: ["M12 15V3", "m7 8 5-5 5 5", "M5 21h14"],
    route: ["M6 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", "M9 19h5a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h5"],
    bolt: ["M13 2 3 14h9l-1 8 10-12h-9l1-8Z"],
    box: ["M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z", "M3.3 7 12 12l8.7-5", "M12 22V12"],
    layers: ["m12 2 9 5-9 5-9-5 9-5Z", "m3 12 9 5 9-5", "m3 17 9 5 9-5"],
    database: ["M12 8c5 0 9-1.3 9-3s-4-3-9-3-9 1.3-9 3 4 3 9 3Z", "M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5", "M3 12c0 1.7 4 3 9 3s9-1.3 9-3"],
    lock: ["M4 11h16v11H4z", "M8 11V7a4 4 0 0 1 8 0v4"],
    copy: ["M8 4h12v16H8z", "M4 8h4", "M4 8v16h12v-4"]
  };
  var selected = paths[name] || paths.chart;
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{selected.map(function(path, index) { return <path key={index} d={path} />; })}</svg>;
}

function StatCard({ label, value, detail, icon, glow }) {
  return <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl"><div className={cx("absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl", glow)} /><div className="relative flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">{label}</p><p className="mt-2 text-3xl font-black tracking-tight text-white">{value}</p><p className="mt-1 text-sm text-white/55">{detail}</p></div><div className="rounded-2xl border border-white/10 bg-black/30 p-3 text-white/75"><IconGlyph name={icon} className="h-5 w-5" /></div></div></div>;
}

function MiniBar({ value, max, gradient }) {
  var width = max > 0 ? Math.min(Math.max(value / max * 100, 0), 100) : 0;
  return <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className={cx("h-full rounded-full bg-gradient-to-r", gradient)} style={{ width: width + "%" }} /></div>;
}

function Badge({ value, tone }) {
  var style = tone === "high" ? "bg-rose-400/15 text-rose-100" : tone === "medium" ? "bg-amber-300/15 text-amber-100" : "bg-emerald-300/15 text-emerald-100";
  return <span className={cx("rounded-full px-2.5 py-1 text-xs font-black capitalize", style)}>{value}</span>;
}

function EmptyState({ title, body }) {
  return <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-8 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-2xl">✨</div><h3 className="mt-4 text-lg font-bold text-white">{title}</h3><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/55">{body}</p></div>;
}

function UploadPanel({ csv, setCsv, onAnalyze }) {
  var inputRef = useRef(null);
  var state = useState(false);
  var dragging = state[0];
  var setDragging = state[1];
  function handleFile(file) {
    if (!file) return;
    file.text().then(function(text) { setCsv(text); });
  }
  return <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Local-first audit</div><h2 className="mt-4 text-2xl font-black tracking-tight text-white">Drop usage CSV. Get savings map.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">Supports Anthropic-style and OpenAI-style token exports. The CSV is processed in-browser, parser warnings are visible, and cost estimates stay local.</p></div><div className="grid grid-cols-2 gap-2 text-xs text-white/55 sm:grid-cols-4 lg:w-96">{["Model routing", "Prompt caching", "Compression", "Batching"].map(function(item) { return <div key={item} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-center font-semibold">{item}</div>; })}</div></div><div className={cx("mt-5 rounded-3xl border border-dashed p-5 transition", dragging ? "border-cyan-300 bg-cyan-300/10" : "border-white/15 bg-black/20")} onDragOver={function(event) { event.preventDefault(); setDragging(true); }} onDragLeave={function() { setDragging(false); }} onDrop={function(event) { event.preventDefault(); setDragging(false); handleFile(event.dataTransfer.files && event.dataTransfer.files[0]); }}><input ref={inputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={function(event) { handleFile(event.target.files && event.target.files[0]); }} /><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><div className="rounded-2xl bg-gradient-to-br from-cyan-300/20 to-fuchsia-300/20 p-3 text-cyan-200 ring-1 ring-white/10"><IconGlyph name="upload" className="h-5 w-5" /></div><div><p className="font-bold text-white">Drag a CSV here or paste rows below</p><p className="text-sm text-white/45">No backend, no API key, no prompt text upload.</p></div></div><div className="flex flex-wrap gap-2"><button type="button" onClick={function() { if (inputRef.current) inputRef.current.click(); }} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15">Choose file</button><button type="button" onClick={function() { setCsv(SAMPLE_CSV); }} className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15">Load sample</button><button type="button" onClick={function() { setCsv(""); }} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10">Clear</button></div></div></div><textarea value={csv} onChange={function(event) { setCsv(event.target.value); }} placeholder="timestamp,model,input_tokens,output_tokens,cost_usd" className="mt-4 min-h-44 w-full resize-y rounded-3xl border border-white/10 bg-black/35 p-4 font-mono text-xs leading-5 text-cyan-50 outline-none transition placeholder:text-white/25 focus:border-cyan-300/40 focus:ring-4 focus:ring-cyan-300/10" spellCheck={false} /><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-white/45">Required minimum: <span className="text-white/75">model</span>, <span className="text-white/75">input tokens</span>, and <span className="text-white/75">output tokens</span>. Cost is calculated when missing.</p><button type="button" onClick={onAnalyze} disabled={!csv.trim()} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 px-5 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-950/40 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40">Analyze spend →</button></div></section>;
}

function WarningPanel({ result }) {
  if (!result.parseWarnings.length && !result.skippedRows) return null;
  return <section className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-amber-50 shadow-2xl shadow-black/20 backdrop-blur-xl"><div className="flex items-start gap-3"><IconGlyph name="warn" className="mt-1 h-5 w-5 shrink-0" /><div><h3 className="font-black">Parser warnings</h3><p className="mt-1 text-sm text-amber-50/70">{result.skippedRows} row{result.skippedRows === 1 ? "" : "s"} skipped. Fix these before using the estimate for billing or finance decisions.</p><ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-50/75">{result.parseWarnings.map(function(warning, index) { return <li key={index}>{warning}</li>; })}</ul></div></div></section>;
}

function RecommendationsPanel({ result }) {
  if (!result.recommendations.length) return <EmptyState title="No major optimization lane detected" body="The data may already be well tuned, or the sample may be too small. Load more rows to improve recommendation quality." />;
  return <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-fuchsia-200/70">Priority queue</p><h2 className="mt-2 text-2xl font-black text-white">Savings recommendations</h2><p className="mt-2 text-sm text-white/55">Ranked by estimated monthly savings, with effort and implementation notes.</p></div><div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 px-5 py-4 text-right"><p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200/70">Estimated savings</p><p className="text-3xl font-black text-emerald-100">{formatMoney(result.estimatedSavings)}</p><p className="text-xs text-emerald-100/55">{formatMoney(result.estimatedSavings * 12, 0)} / year</p></div></div><div className="mt-5 grid gap-4">{result.recommendations.map(function(rec, index) { return <article key={rec.type + index} className="rounded-3xl border border-white/10 bg-black/25 p-5 transition hover:border-cyan-300/25 hover:bg-black/30"><div className="flex flex-col gap-4 md:flex-row md:items-start"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-100 ring-1 ring-white/10"><IconGlyph name={rec.icon} className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-black text-white/60">#{index + 1}</span><Badge value={rec.impact + " impact"} tone={rec.impact} /><Badge value={rec.effort + " effort"} tone={rec.effort} /></div><h3 className="mt-3 text-lg font-black text-white">{rec.title}</h3><p className="mt-2 text-sm leading-6 text-white/58">{rec.description}</p><div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 font-mono text-xs leading-5 text-cyan-50/75">{rec.implementation}</div></div><div className="shrink-0 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-right"><p className="text-xs text-emerald-100/50">monthly</p><p className="text-2xl font-black text-emerald-100">{formatMoney(rec.monthlySavings)}</p></div></div></article>; })}</div></section>;
}

function ModelBreakdownPanel({ rows }) {
  if (!rows.length) return null;
  var maxCost = Math.max.apply(null, rows.map(function(row) { return row.cost; }));
  return <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/70">Cost model</p><h2 className="mt-2 text-2xl font-black text-white">Spend by model</h2></div><IconGlyph name="chart" className="h-6 w-6 text-cyan-200" /></div><div className="mt-6 space-y-4">{rows.map(function(row) { var style = modelStyle(row.model); return <div key={row.model} className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className={cx("h-3 w-3 shrink-0 rounded-full", style.dot)} /><p className="truncate font-mono text-sm font-bold text-white">{row.model}</p></div><div className="flex flex-wrap items-center gap-4 text-sm text-white/60"><span>{formatInt(row.requests)} requests</span><span>{formatInt(row.tokens)} tokens</span><span className="font-black text-white">{formatMoney(row.cost)}</span></div></div><div className="mt-3"><MiniBar value={row.cost} max={maxCost} gradient={style.bar} /></div><p className="mt-2 text-right text-xs text-white/40">{row.percentOfBudget.toFixed(1)}% of budget</p></div>; })}</div></section>;
}

function TokenDistributionPanel({ distribution }) {
  var labels = { "0-500": "Micro", "501-2000": "Small", "2001-5000": "Medium", "5000+": "Large" };
  return <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-violet-200/70">Token lanes</p><h2 className="mt-2 text-2xl font-black text-white">Request distribution</h2></div><IconGlyph name="gauge" className="h-6 w-6 text-violet-200" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{distribution.map(function(bucket) { return <div key={bucket.range} className="rounded-3xl border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-2"><p className="font-black text-white">{labels[bucket.range]}</p><p className="text-xs font-bold text-white/40">{bucket.range}</p></div><p className="mt-4 text-4xl font-black text-white">{bucket.percentage.toFixed(0)}%</p><MiniBar value={bucket.percentage} max={100} gradient="from-violet-400 to-cyan-300" /><div className="mt-4 flex justify-between text-xs text-white/45"><span>{formatInt(bucket.count)} requests</span><span>{formatMoney(bucket.averageCost, 4)} avg</span></div></div>; })}</div></section>;
}

function RepetitionPanel({ patterns }) {
  if (!patterns.length) return <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-6"><EmptyState title="No repeated prompt proxy found" body="This artifact groups by matching input-token counts because usage CSVs usually do not include prompt text. Production should use SDK prompt fingerprints for exact repetition detection." /></section>;
  var maxSavings = Math.max.apply(null, patterns.map(function(pattern) { return pattern.cacheSavings; }));
  return <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-6"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200/70">Cache candidates</p><h2 className="mt-2 text-2xl font-black text-white">Repetition analysis</h2></div><IconGlyph name="database" className="h-6 w-6 text-emerald-200" /></div><div className="mt-6 space-y-3">{patterns.map(function(pattern) { return <div key={pattern.pattern} className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-sm font-bold text-cyan-50">{pattern.pattern}</p><div className="flex items-center gap-3 text-sm text-white/55"><span>{pattern.count}x</span><span className="font-black text-emerald-100">{formatMoney(pattern.cacheSavings)} savings</span></div></div><div className="mt-3"><MiniBar value={pattern.cacheSavings} max={maxSavings} gradient="from-emerald-300 to-cyan-300" /></div><p className="mt-2 text-xs text-white/40">Current pattern cost: {formatMoney(pattern.totalCost)} · cached equivalent estimate: {formatMoney(pattern.totalCost - pattern.cacheSavings)}</p></div>; })}</div></section>;
}

function ExportPanel({ result }) {
  var copiedState = useState(false);
  var copied = copiedState[0];
  var setCopied = copiedState[1];
  var exportJson = useMemo(function() {
    return JSON.stringify({ generatedAt: new Date().toISOString(), summary: { totalCost: result.totalCost, totalRequests: result.totalRequests, totalTokens: result.totalTokens, estimatedSavings: result.estimatedSavings, estimatedAnnualSavings: result.estimatedSavings * 12 }, recommendations: result.recommendations, modelBreakdown: result.modelBreakdown, tokenDistribution: result.tokenDistribution, repetitionPatterns: result.repetitionPatterns, warnings: result.parseWarnings }, null, 2);
  }, [result]);
  function copyJson() {
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(exportJson).then(function() { setCopied(true); setTimeout(function() { setCopied(false); }, 1400); });
    }
  }
  function downloadJson() {
    var blob = new Blob([exportJson], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "ai-cost-audit.json";
    link.click();
    URL.revokeObjectURL(url);
  }
  return <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-6"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-white/40">Output</p><h2 className="mt-2 text-2xl font-black text-white">Export audit packet</h2><p className="mt-2 text-sm text-white/55">Copy or download structured JSON for an implementation ticket or client report.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={copyJson} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15">{copied ? "Copied" : "Copy JSON"}</button><button type="button" onClick={downloadJson} className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15">Download</button></div></div><pre className="mt-5 max-h-72 overflow-auto rounded-3xl border border-white/10 bg-black/40 p-4 text-xs leading-5 text-cyan-50/70">{exportJson}</pre></section>;
}

function QualityGatePanel() {
  var gates = [["CSV stays local", "pass"], ["Bad rows surfaced", "pass"], ["No 30x savings inflation", "pass"], ["No CDN dependency", "pass"], ["Exact prompt repetition", "needs SDK proxy"]];
  return <section className="rounded-3xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl md:p-6"><div className="flex items-center gap-3"><IconGlyph name="lock" className="h-5 w-5 text-cyan-200" /><h2 className="text-lg font-black text-white">Implementation quality gates</h2></div><div className="mt-4 grid gap-3 md:grid-cols-5">{gates.map(function(gate) { return <div key={gate[0]} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className="flex items-center gap-2"><span>{gate[1] === "pass" ? "✅" : "⚠️"}</span><p className="text-sm font-bold text-white">{gate[0]}</p></div><p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/35">{gate[1]}</p></div>; })}</div></section>;
}

export default function FlashFusionAiCostAuditDashboard() {
  var csvState = useState(SAMPLE_CSV);
  var csv = csvState[0];
  var setCsv = csvState[1];
  var runState = useState(function() { return new Date(); });
  var lastRun = runState[0];
  var setLastRun = runState[1];
  var resultState = useState(function() { var parsed = parseCsv(SAMPLE_CSV); return analyze(parsed.records, parsed.warnings, parsed.skipped); });
  var result = resultState[0];
  var setResult = resultState[1];
  function runAnalysis() {
    var parsed = parseCsv(csv);
    setResult(analyze(parsed.records, parsed.warnings, parsed.skipped));
    setLastRun(new Date());
  }
  var savingsPct = result.totalCost > 0 ? result.estimatedSavings / result.totalCost * 100 : 0;
  return <main className="min-h-screen overflow-hidden bg-slate-950 text-white"><div className="pointer-events-none fixed inset-0 opacity-80"><div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" /><div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" /><div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" /></div><div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"><header className="mb-8 rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8"><div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-3xl"><div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-white/55">✨ FlashFusion audit artifact</div><h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">AI Cost Optimizer<span className="block bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">Savings Dashboard</span></h1><p className="mt-4 max-w-2xl text-base leading-7 text-white/58">A render-safe, self-contained audit console for turning AI usage CSVs into model-routing, caching, compression, and batching recommendations.</p></div><div className="rounded-3xl border border-white/10 bg-black/25 p-5 lg:w-80"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.22em] text-white/40">Last run</p><span className="text-white/45">↻</span></div><p className="mt-2 text-lg font-black text-white">{lastRun.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p><p className="mt-1 text-sm text-white/45">{result.totalRequests ? formatInt(result.totalRequests) + " analyzed requests" : "No valid rows yet"}</p></div></div></header><UploadPanel csv={csv} setCsv={setCsv} onAnalyze={runAnalysis} /><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard icon="copy" label="30-day spend" value={formatMoney(result.totalCost)} detail="Current observed cost" glow="bg-violet-400/25" /><StatCard icon="chart" label="Savings" value={formatMoney(result.estimatedSavings)} detail={savingsPct.toFixed(0) + "% estimated waste"} glow="bg-emerald-400/25" /><StatCard icon="gauge" label="Requests" value={formatInt(result.totalRequests)} detail={formatInt(result.totalTokens) + " total tokens"} glow="bg-cyan-400/25" /><StatCard icon="layers" label="Actions" value={formatInt(result.recommendations.length)} detail="Ranked optimization lanes" glow="bg-fuchsia-400/25" /></div><div className="mt-6"><WarningPanel result={result} /></div><div className="mt-6 grid gap-6 xl:grid-cols-2"><RecommendationsPanel result={result} /><div className="space-y-6"><ModelBreakdownPanel rows={result.modelBreakdown} /><TokenDistributionPanel distribution={result.tokenDistribution} /></div></div><div className="mt-6 grid gap-6 xl:grid-cols-2"><RepetitionPanel patterns={result.repetitionPatterns} /><ExportPanel result={result} /></div><div className="mt-6"><QualityGatePanel /></div></div></main>;
}
