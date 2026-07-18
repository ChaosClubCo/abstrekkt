#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node scripts/evaluate-launch.mjs <report-directory>");
  process.exit(2);
}

const projectRoot = process.cwd();
const policyPath = path.join(projectRoot, "config", "launch-policy.json");
const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"));

const files = {
  manifest: "release-manifest.json",
  UX: "ux-report.json",
  SECURITY: "security-report.json",
  GROWTH: "growth-report.json",
  AI: "ai-report.json",
  INFRASTRUCTURE: "infrastructure-report.json"
};

function readJson(filename) {
  const p = path.join(dir, filename);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing required file: ${p}`);
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function fail(reason, details = {}) {
  const result = {
    verdict: "INSUFFICIENT_EVIDENCE",
    reason,
    ...details
  };
  fs.writeFileSync(
    path.join(dir, "deterministic-policy-result.json"),
    JSON.stringify(result, null, 2)
  );
  console.log(JSON.stringify(result, null, 2));
  process.exit(1);
}

let manifest;
const reports = {};
try {
  manifest = readJson(files.manifest);
  for (const domain of Object.keys(policy.weights)) {
    reports[domain] = readJson(files[domain]);
  }
} catch (error) {
  fail(error.message);
}

const releaseMismatches = [];
for (const [domain, report] of Object.entries(reports)) {
  const reportSha = report?.release?.commit_sha ?? null;
  const manifestSha = manifest?.repository?.commit_sha ?? null;
  if (reportSha !== manifestSha) {
    releaseMismatches.push({ domain, reportSha, manifestSha });
  }
  if (report?.release?.environment !== manifest?.build?.environment) {
    releaseMismatches.push({
      domain,
      reportEnvironment: report?.release?.environment,
      manifestEnvironment: manifest?.build?.environment
    });
  }
}
if (releaseMismatches.length) {
  fail("Release mismatch", { releaseMismatches });
}

let weightedScore = 0;
let weightedConfidence = 0;
const domainResults = [];
const allFindings = [];

for (const [domain, weight] of Object.entries(policy.weights)) {
  const report = reports[domain];
  const score = Number(report?.assessment?.score);
  const confidence = Number(report?.assessment?.confidence);

  if (!Number.isFinite(score) || !Number.isFinite(confidence)) {
    fail(`Invalid score or confidence for ${domain}`);
  }

  weightedScore += score * weight;
  weightedConfidence += confidence * weight;

  const floor = policy.domain_floors[domain];
  domainResults.push({
    domain,
    score,
    confidence,
    floor,
    floor_passed: score >= floor,
    weight,
    weighted_contribution: Number((score * weight).toFixed(2))
  });

  for (const finding of report.findings ?? []) {
    allFindings.push({ domain, ...finding });
  }
}

const openStatuses = new Set(policy.blocked_open_statuses);
const criticalBlockers = allFindings.filter(
  f => f.severity === "CRITICAL" && openStatuses.has(f.status)
);
const highBlockingFindings = allFindings.filter(
  f =>
    f.severity === "HIGH" &&
    f.blocks_launch === true &&
    openStatuses.has(f.status)
);

const domainFloorsPassed = domainResults.every(r => r.floor_passed);
const score = Number(weightedScore.toFixed(1));
const confidence = Number(weightedConfidence.toFixed(1));

const controls = new Map();
for (const [domain, report] of Object.entries(reports)) {
  for (const control of report.verified_controls ?? []) {
    if (typeof control?.control === "string") {
      controls.set(control.control, {
        domain,
        verified: control.verified === true,
        evidence: control.evidence ?? ""
      });
    }
  }
}

const mandatoryGateResults = policy.mandatory_gates.map(gate => {
  const control = controls.get(gate);
  return {
    gate,
    present: Boolean(control),
    verified: control?.verified === true,
    domain: control?.domain ?? null,
    evidence: control?.evidence ?? ""
  };
});

const missingMandatoryGates = mandatoryGateResults.filter(g => !g.present);
const failedMandatoryGates = mandatoryGateResults.filter(g => g.present && !g.verified);

let verdict = "CONDITIONAL_GO";
const reasons = [];

if (missingMandatoryGates.length > 0) {
  verdict = "INSUFFICIENT_EVIDENCE";
  reasons.push("One or more mandatory controls were not reported.");
}
if (failedMandatoryGates.length > 0 && verdict !== "INSUFFICIENT_EVIDENCE") {
  verdict = "NO_GO";
  reasons.push("One or more mandatory controls failed verification.");
}
if (criticalBlockers.length > 0 && verdict !== "INSUFFICIENT_EVIDENCE") {
  verdict = "NO_GO";
  reasons.push("Open critical findings exist.");
}
if (highBlockingFindings.length > 0 && verdict !== "INSUFFICIENT_EVIDENCE") {
  verdict = "NO_GO";
  reasons.push("Open high launch-blocking findings exist.");
}
if (score < policy.minimum_conditional_score && verdict !== "INSUFFICIENT_EVIDENCE") {
  verdict = "NO_GO";
  reasons.push(`Weighted score ${score} is below conditional minimum ${policy.minimum_conditional_score}.`);
}
if (
  !["NO_GO", "INSUFFICIENT_EVIDENCE"].includes(verdict) &&
  score >= policy.minimum_go_score &&
  confidence >= policy.minimum_confidence &&
  domainFloorsPassed
) {
  verdict = "GO";
} else if (!["NO_GO", "INSUFFICIENT_EVIDENCE"].includes(verdict)) {
  verdict = "CONDITIONAL_GO";
  if (score < policy.minimum_go_score) reasons.push("Overall GO threshold not met.");
  if (confidence < policy.minimum_confidence) reasons.push("Confidence threshold not met.");
  if (!domainFloorsPassed) reasons.push("One or more domain floors not met.");
}

const result = {
  schema_version: "1.0",
  verdict,
  weighted_score: score,
  weighted_confidence: confidence,
  minimum_go_score: policy.minimum_go_score,
  minimum_confidence: policy.minimum_confidence,
  domain_results: domainResults,
  critical_blockers: criticalBlockers,
  high_blocking_findings: highBlockingFindings,
  mandatory_gate_results: mandatoryGateResults,
  missing_mandatory_gates: missingMandatoryGates,
  failed_mandatory_gates: failedMandatoryGates,
  reasons
};

fs.writeFileSync(
  path.join(dir, "deterministic-policy-result.json"),
  JSON.stringify(result, null, 2)
);
console.log(JSON.stringify(result, null, 2));
