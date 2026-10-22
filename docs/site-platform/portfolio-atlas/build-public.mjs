import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRegistry, validateRegistry } from "./validate.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(HERE, "public-atlas.json");

export function buildPublicProjection(registry) {
  const errors = validateRegistry(registry);
  if (errors.length) throw new Error(`Registry invalid:\n${errors.join("\n")}`);

  return {
    schema: "AbstrekktPublicPortfolioAtlas/v1",
    checked_at: registry.checked_at,
    entities: registry.entities
      .filter((entity) =>
        entity.portfolio_state === "ACTIVE" &&
        ["PUBLIC", "MIXED"].includes(entity.visibility)
      )
      .map((entity) => ({
        id: entity.id,
        slug: entity.slug,
        name: entity.name,
        entity_type: entity.entity_type,
        owner_domain: entity.owner_domain,
        claims: entity.claims
          .filter((claim) =>
            claim.public === true &&
            ["VERIFIED", "SUPPORTED"].includes(claim.claim_status)
          )
          .map(({ key, value, claim_status }) => ({ key, value, claim_status }))
      }))
      .filter((entity) => entity.claims.length > 0)
  };
}

const projection = buildPublicProjection(loadRegistry());
const serialized = `${JSON.stringify(projection, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const existing = fs.readFileSync(OUTPUT, "utf8");
  if (existing !== serialized) {
    console.error("FAIL: public-atlas.json is stale. Run build-public.mjs and commit the result.");
    process.exit(1);
  }
  console.log("PASS: public-atlas.json matches the deterministic source projection.");
} else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(OUTPUT, serialized);
  console.log("WROTE: public-atlas.json");
}
