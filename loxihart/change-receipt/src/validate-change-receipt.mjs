const SHA256 = /^sha256:[a-f0-9]{64}$/;
const GIT_OBJECT = /^[a-f0-9]{40,64}$/;
const RECEIPT_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{15,127}$/;
const AGENT_ID = /^agent:[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/;
const REPOSITORY = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const FAILURE = /^[A-Z][A-Z0-9_]{2,63}$/;
const SIGNATURE = /^base64url:[A-Za-z0-9_-]{43,}$/;
const OPERATIONS = new Set(["CREATE", "UPDATE", "DELETE", "RENAME"]);
const VERDICTS = new Set(["VERIFIED", "REJECTED", "UNVERIFIED", "STALE"]);

export class ChangeReceiptValidationError extends Error {
  constructor(errors) {
    super(`Invalid ChangeReceipt: ${errors.join("; ")}`);
    this.name = "ChangeReceiptValidationError";
    this.errors = Object.freeze([...errors]);
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, required, path, errors) {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return false;
  }
  const expected = new Set(required);
  for (const key of required) if (!(key in value)) errors.push(`${path}.${key} is required`);
  for (const key of Object.keys(value)) if (!expected.has(key)) errors.push(`${path}.${key} is not allowed`);
  return true;
}

function validDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function uniqueStrings(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string") && new Set(value).size === value.length;
}

export function validateChangeReceipt(receipt) {
  const errors = [];
  const rootKeys = ["schema_version", "receipt_id", "verdict", "actor", "authority", "change", "verification", "evidence_manifest_hash", "issued_at", "signer", "signature", "failure_reasons"];
  if (!exactKeys(receipt, rootKeys, "$", errors)) throw new ChangeReceiptValidationError(errors);

  if (receipt.schema_version !== "loxihart.change-receipt.v1") errors.push("$.schema_version must equal loxihart.change-receipt.v1");
  if (!RECEIPT_ID.test(receipt.receipt_id ?? "")) errors.push("$.receipt_id is invalid");
  if (!VERDICTS.has(receipt.verdict)) errors.push("$.verdict is invalid");
  if (!SHA256.test(receipt.evidence_manifest_hash ?? "")) errors.push("$.evidence_manifest_hash is invalid");
  if (!validDate(receipt.issued_at)) errors.push("$.issued_at must be an RFC 3339 timestamp");
  if (!SIGNATURE.test(receipt.signature ?? "")) errors.push("$.signature is invalid");

  if (exactKeys(receipt.actor, ["type", "id", "provider"], "$.actor", errors)) {
    if (receipt.actor.type !== "agent") errors.push("$.actor.type must equal agent");
    if (!AGENT_ID.test(receipt.actor.id ?? "")) errors.push("$.actor.id is invalid");
    if (typeof receipt.actor.provider !== "string" || receipt.actor.provider.length < 1 || receipt.actor.provider.length > 64) errors.push("$.actor.provider is invalid");
  }

  if (exactKeys(receipt.authority, ["authorization_id", "repository", "base_ref", "allowed_paths", "operations", "expires_at"], "$.authority", errors)) {
    if (typeof receipt.authority.authorization_id !== "string" || receipt.authority.authorization_id.length < 8) errors.push("$.authority.authorization_id is invalid");
    if (!REPOSITORY.test(receipt.authority.repository ?? "")) errors.push("$.authority.repository is invalid");
    if (typeof receipt.authority.base_ref !== "string" || receipt.authority.base_ref.length < 1) errors.push("$.authority.base_ref is invalid");
    if (!uniqueStrings(receipt.authority.allowed_paths) || receipt.authority.allowed_paths.length === 0 || receipt.authority.allowed_paths.some((path) => path.startsWith("/") || path.split("/").includes("..") || /[\u0000-\u001f]/.test(path))) errors.push("$.authority.allowed_paths is invalid");
    if (!uniqueStrings(receipt.authority.operations) || receipt.authority.operations.length === 0 || receipt.authority.operations.some((operation) => !OPERATIONS.has(operation))) errors.push("$.authority.operations is invalid");
    if (!validDate(receipt.authority.expires_at)) errors.push("$.authority.expires_at must be an RFC 3339 timestamp");
  }

  if (exactKeys(receipt.change, ["request_hash", "base_commit", "result_commit", "patch_hash", "tree_hash"], "$.change", errors)) {
    if (!SHA256.test(receipt.change.request_hash ?? "")) errors.push("$.change.request_hash is invalid");
    if (!GIT_OBJECT.test(receipt.change.base_commit ?? "")) errors.push("$.change.base_commit is invalid");
    if (receipt.change.result_commit !== null && !GIT_OBJECT.test(receipt.change.result_commit ?? "")) errors.push("$.change.result_commit is invalid");
    if (receipt.change.patch_hash !== null && !SHA256.test(receipt.change.patch_hash ?? "")) errors.push("$.change.patch_hash is invalid");
    if (receipt.change.tree_hash !== null && !GIT_OBJECT.test(receipt.change.tree_hash ?? "")) errors.push("$.change.tree_hash is invalid");
  }

  if (exactKeys(receipt.verification, ["policy_version", "tests", "checks", "read_back"], "$.verification", errors)) {
    if (typeof receipt.verification.policy_version !== "string" || receipt.verification.policy_version.length < 3) errors.push("$.verification.policy_version is invalid");
    if (!Array.isArray(receipt.verification.tests)) errors.push("$.verification.tests must be an array");
    else receipt.verification.tests.forEach((item, index) => {
      const path = `$.verification.tests[${index}]`;
      if (exactKeys(item, ["name", "command_hash", "output_hash", "exit_code", "duration_ms"], path, errors)) {
        if (typeof item.name !== "string" || item.name.length < 1) errors.push(`${path}.name is invalid`);
        if (!SHA256.test(item.command_hash ?? "")) errors.push(`${path}.command_hash is invalid`);
        if (!SHA256.test(item.output_hash ?? "")) errors.push(`${path}.output_hash is invalid`);
        if (!Number.isInteger(item.exit_code) || item.exit_code < 0 || item.exit_code > 255) errors.push(`${path}.exit_code is invalid`);
        if (!Number.isInteger(item.duration_ms) || item.duration_ms < 0) errors.push(`${path}.duration_ms is invalid`);
      }
    });
    if (!Array.isArray(receipt.verification.checks)) errors.push("$.verification.checks must be an array");
    else receipt.verification.checks.forEach((item, index) => {
      const path = `$.verification.checks[${index}]`;
      if (exactKeys(item, ["name", "status", "evidence_ref"], path, errors)) {
        if (typeof item.name !== "string" || item.name.length < 1) errors.push(`${path}.name is invalid`);
        if (!["PASS", "FAIL", "SKIP"].includes(item.status)) errors.push(`${path}.status is invalid`);
        if (typeof item.evidence_ref !== "string" || item.evidence_ref.length < 1) errors.push(`${path}.evidence_ref is invalid`);
      }
    });
    if (exactKeys(receipt.verification.read_back, ["provider", "observed_commit", "status", "observed_at"], "$.verification.read_back", errors)) {
      const readBack = receipt.verification.read_back;
      if (typeof readBack.provider !== "string" || readBack.provider.length < 1) errors.push("$.verification.read_back.provider is invalid");
      if (readBack.observed_commit !== null && !GIT_OBJECT.test(readBack.observed_commit ?? "")) errors.push("$.verification.read_back.observed_commit is invalid");
      if (!["MATCH", "MISMATCH", "UNAVAILABLE"].includes(readBack.status)) errors.push("$.verification.read_back.status is invalid");
      if (!validDate(readBack.observed_at)) errors.push("$.verification.read_back.observed_at must be an RFC 3339 timestamp");
    }
  }

  if (exactKeys(receipt.signer, ["algorithm", "key_id"], "$.signer", errors)) {
    if (receipt.signer.algorithm !== "Ed25519") errors.push("$.signer.algorithm must equal Ed25519");
    if (typeof receipt.signer.key_id !== "string" || receipt.signer.key_id.length < 3) errors.push("$.signer.key_id is invalid");
  }

  if (!uniqueStrings(receipt.failure_reasons) || receipt.failure_reasons.some((reason) => !FAILURE.test(reason))) errors.push("$.failure_reasons is invalid");

  if (receipt.verdict === "VERIFIED") {
    if (receipt.failure_reasons?.length !== 0) errors.push("VERIFIED receipts cannot contain failure reasons");
    if (!receipt.change?.result_commit || !receipt.change?.patch_hash || !receipt.change?.tree_hash) errors.push("VERIFIED receipts require result_commit, patch_hash, and tree_hash");
    if (!Array.isArray(receipt.verification?.tests) || receipt.verification.tests.length === 0) errors.push("VERIFIED receipts require at least one test");
    if (receipt.verification?.tests?.some((item) => item.exit_code !== 0)) errors.push("VERIFIED receipts require every test to exit 0");
    if (receipt.verification?.checks?.some((item) => item.status !== "PASS")) errors.push("VERIFIED receipts require every check to PASS");
    if (receipt.verification?.read_back?.status !== "MATCH" || receipt.verification.read_back.observed_commit !== receipt.change?.result_commit) errors.push("VERIFIED receipts require a matching provider read-back");
  } else if (!Array.isArray(receipt.failure_reasons) || receipt.failure_reasons.length === 0) {
    errors.push("Non-VERIFIED receipts require at least one failure reason");
  }

  if (validDate(receipt.issued_at) && validDate(receipt.authority?.expires_at) && Date.parse(receipt.issued_at) > Date.parse(receipt.authority.expires_at)) errors.push("$.issued_at cannot be after authority expiry");

  if (errors.length > 0) throw new ChangeReceiptValidationError(errors);
  return Object.freeze(structuredClone(receipt));
}
