import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY = path.join(HERE, "source-registry.json");

const CLAIM_STATES = new Set([
  "VERIFIED", "SUPPORTED", "INTERNAL", "PROVISIONAL", "HISTORICAL", "UNVERIFIED"
]);
const REPO_STATES = new Set(["VERIFIED", "UNKNOWN", "NOT_APPLICABLE"]);
const PORTFOLIO_STATES = new Set(["ACTIVE", "REFERENCE_ONLY", "HISTORICAL", "PROVISIONAL", "EXCLUDED"]);
const VISIBILITY_STATES = new Set(["PUBLIC", "PRIVATE", "MIXED"]);
const SHA40 = /^[0-9a-f]{40}$/;

export function loadRegistry(file = REGISTRY) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function validateRegistry(data) {
  const errors = [];
  const seenIds = new Set();
  const seenSlugs = new Set();

  if (data?.schema !== "AbstrekktPortfolioAtlas/v1") errors.push("schema must be AbstrekktPortfolioAtlas/v1");
  if (!SHA40.test(data?.generated_from?.revision ?? "")) errors.push("generated_from.revision must be a 40-char lowercase SHA");
  if (!Array.isArray(data?.entities) || data.entities.length === 0) errors.push("entities must be a non-empty array");

  for (const [index, entity] of (data.entities ?? []).entries()) {
    const at = `entities[${index}]`;
    if (!entity.id) errors.push(`${at}.id is required`);
    if (seenIds.has(entity.id)) errors.push(`${at}.id duplicates ${entity.id}`);
    seenIds.add(entity.id);

    if (!entity.slug) errors.push(`${at}.slug is required`);
    if (seenSlugs.has(entity.slug)) errors.push(`${at}.slug duplicates ${entity.slug}`);
    seenSlugs.add(entity.slug);

    if (!PORTFOLIO_STATES.has(entity.portfolio_state)) {
      errors.push(`${at}.portfolio_state is invalid`);
    }

    if (!VISIBILITY_STATES.has(entity.visibility)) {
      errors.push(`${at}.visibility must be PUBLIC, PRIVATE, or MIXED`);
    }

    const repo = entity.repository ?? {};
    if (!REPO_STATES.has(repo.state)) errors.push(`${at}.repository.state is invalid`);

    if (repo.state === "VERIFIED") {
      if (!repo.full_name || !repo.default_branch || !SHA40.test(repo.head_sha ?? "")) {
        errors.push(`${at} VERIFIED repository requires full_name, default_branch, and exact head_sha`);
      }
      if (entity.canonical_owner_repository !== repo.full_name) {
        errors.push(`${at}.canonical_owner_repository must equal repository.full_name when VERIFIED`);
      }
    }

    if (repo.state === "UNKNOWN") {
      if (repo.full_name !== null || repo.default_branch !== null || repo.head_sha !== null) {
        errors.push(`${at} UNKNOWN repository must not guess repository identity or revision`);
      }
    }

    if (!Array.isArray(entity.claims)) errors.push(`${at}.claims must be an array`);
    for (const [claimIndex, claim] of (entity.claims ?? []).entries()) {
      if (!CLAIM_STATES.has(claim.claim_status)) {
        errors.push(`${at}.claims[${claimIndex}].claim_status is invalid`);
      }
      if (claim.public === true && !["VERIFIED", "SUPPORTED"].includes(claim.claim_status)) {
        errors.push(`${at}.claims[${claimIndex}] public claim must be VERIFIED or SUPPORTED`);
      }
    }

    if (!Array.isArray(entity.evidence) || entity.evidence.length === 0) {
      errors.push(`${at}.evidence must contain at least one source`);
    }

    if (entity.id === "company.loxihart" &&
        entity.canonical_owner_repository !== "ChaosClubCo/Loxihart") {
      errors.push("company.loxihart must resolve runtime/product ownership to ChaosClubCo/Loxihart");
    }
  }

  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = validateRegistry(loadRegistry());
  if (errors.length) {
    console.error(errors.map((e) => `FAIL: ${e}`).join("\n"));
    process.exit(1);
  }
  console.log("PASS: Portfolio Atlas source registry is structurally valid and fail-closed.");
}
