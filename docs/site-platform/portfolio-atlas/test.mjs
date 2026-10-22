import assert from "node:assert/strict";
import { loadRegistry, validateRegistry } from "./validate.mjs";
import { buildPublicProjection } from "./build-public.mjs";

const registry = loadRegistry();
assert.deepEqual(validateRegistry(registry), []);

const byId = Object.fromEntries(registry.entities.map((entity) => [entity.id, entity]));

assert.equal(byId["company.loxihart"].canonical_owner_repository, "ChaosClubCo/Loxihart");
assert.equal(byId["company.loxihart"].repository.state, "VERIFIED");

assert.equal(byId["product.the-verdict"].repository.full_name, "Krosebrook/the-verdict");
assert.equal(byId["product.promptforge"].repository.full_name, "ChaosClubCo/PromptForge");
assert.equal(byId["product.archon"].repository.full_name, "ChaosClubCo/archon-orchestrator");

assert.equal(byId["product.universal-app-generator"].repository.state, "UNKNOWN");
assert.equal(byId["product.universal-app-generator"].repository.full_name, null);
assert.equal(byId["product.solemuchbetter"].repository.state, "UNKNOWN");
assert.equal(byId["product.solemuchbetter"].repository.full_name, null);

const projection = buildPublicProjection(registry);
const publicIds = new Set(projection.entities.map((entity) => entity.id));

assert.equal(publicIds.has("company.abstrekkt"), true);
assert.equal(publicIds.has("company.loxihart"), true);
assert.equal(publicIds.has("product.the-verdict"), true);
assert.equal(publicIds.has("product.promptforge"), false);
assert.equal(publicIds.has("product.archon"), false);
assert.equal(publicIds.has("product.universal-app-generator"), false);
assert.equal(publicIds.has("product.solemuchbetter"), false);

const serialized = JSON.stringify(projection);
assert.equal(serialized.includes("head_sha"), false);
assert.equal(serialized.includes("full_name"), false);
assert.equal(serialized.includes("00a63fddf1a8d581acc667e137ee3974adc365e4"), false);

const invalid = structuredClone(registry);
invalid.entities.find((e) => e.id === "product.universal-app-generator").repository.full_name = "guessed/repo";
assert.ok(validateRegistry(invalid).some((error) => error.includes("must not guess")));

const badPublicClaim = structuredClone(registry);
badPublicClaim.entities[0].claims.push({
  key: "unsafe",
  value: "Should fail closed",
  claim_status: "PROVISIONAL",
  public: true
});
assert.ok(validateRegistry(badPublicClaim).some((error) =>
  error.includes("public claim must be VERIFIED or SUPPORTED")
));


for (const visibility of [undefined, "PUBIC", "private", "", null, 123]) {
  const altered = structuredClone(registry);
  if (visibility === undefined) delete altered.entities[0].visibility;
  else altered.entities[0].visibility = visibility;
  assert.ok(
    validateRegistry(altered).some((error) => error.includes(".visibility")),
    `Invalid visibility ${String(visibility)} must fail validation`
  );
  assert.throws(() => buildPublicProjection(altered), /Registry invalid/);
}

for (const visibility of ["PUBLIC", "MIXED"]) {
  const altered = structuredClone(registry);
  altered.entities[0].visibility = visibility;
  assert.deepEqual(validateRegistry(altered), []);
  assert.equal(
    buildPublicProjection(altered).entities.some((entity) => entity.id === altered.entities[0].id),
    true,
    `${visibility} active entities with supported public claims must remain publishable`
  );
}

const privateEntity = structuredClone(registry);
privateEntity.entities[0].visibility = "PRIVATE";
assert.deepEqual(validateRegistry(privateEntity), []);
assert.equal(
  buildPublicProjection(privateEntity).entities.some((entity) => entity.id === privateEntity.entities[0].id),
  false
);

console.log("PASS: Portfolio Atlas contract, ownership boundary, privacy projection, and fail-closed tests.");
