CREATE TABLE `canonical_runtime_config` (
  `id` text PRIMARY KEY NOT NULL,
  `suite_id` text NOT NULL,
  `required_assertions` integer NOT NULL,
  `policy_version` text NOT NULL,
  `release_lineage` text NOT NULL,
  `environment` text NOT NULL,
  `adapter_version` text NOT NULL,
  `max_result_age_seconds` integer NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `canonical_state` (
  `id` text PRIMARY KEY NOT NULL,
  `canonical_head` text NOT NULL UNIQUE,
  `version` integer NOT NULL,
  `state_json` text NOT NULL,
  `policy_version` text NOT NULL,
  `release_lineage` text NOT NULL,
  `environment` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `canonical_trusted_signers` (
  `key_id` text PRIMARY KEY NOT NULL,
  `algorithm` text NOT NULL,
  `public_key_spki_base64` text NOT NULL,
  `active_from` text NOT NULL,
  `active_until` text,
  `revoked_at` text,
  `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `canonical_trusted_signers_active_idx` ON `canonical_trusted_signers` (`revoked_at`);
--> statement-breakpoint
CREATE TABLE `canonical_conformance_results` (
  `result_id` text PRIMARY KEY NOT NULL,
  `suite_id` text NOT NULL,
  `policy_version` text NOT NULL,
  `release_lineage` text NOT NULL,
  `environment` text NOT NULL,
  `canonical_head` text NOT NULL,
  `status` text NOT NULL,
  `assertion_count` integer NOT NULL,
  `signature_algorithm` text NOT NULL,
  `signer_key_id` text NOT NULL,
  `signature` text NOT NULL,
  `signature_verified` integer DEFAULT 0 NOT NULL,
  `issued_at` text NOT NULL,
  `expires_at` text NOT NULL,
  `payload_hash` text NOT NULL,
  `evidence_manifest_hash` text NOT NULL,
  `envelope_json` text NOT NULL,
  `received_at` text NOT NULL,
  `consumed_at` text
);
--> statement-breakpoint
CREATE INDEX `canonical_conformance_received_idx` ON `canonical_conformance_results` (`received_at`);
--> statement-breakpoint
CREATE INDEX `canonical_conformance_expires_idx` ON `canonical_conformance_results` (`expires_at`);
--> statement-breakpoint
CREATE INDEX `canonical_conformance_signer_idx` ON `canonical_conformance_results` (`signer_key_id`);
--> statement-breakpoint
CREATE TABLE `canonical_mutation_operations` (
  `operation_id` text PRIMARY KEY NOT NULL,
  `result_id` text NOT NULL UNIQUE,
  `actor_id` text NOT NULL,
  `mutation_hash` text NOT NULL,
  `mutation_json` text NOT NULL,
  `before_head` text NOT NULL,
  `after_head` text NOT NULL,
  `before_version` integer NOT NULL,
  `after_version` integer NOT NULL,
  `policy_version` text NOT NULL,
  `release_lineage` text NOT NULL,
  `status` text NOT NULL,
  `created_at` text NOT NULL,
  `committed_at` text
);
--> statement-breakpoint
CREATE INDEX `canonical_mutation_created_idx` ON `canonical_mutation_operations` (`created_at`);
--> statement-breakpoint
CREATE INDEX `canonical_mutation_status_idx` ON `canonical_mutation_operations` (`status`);
--> statement-breakpoint
CREATE TABLE `canonical_conformance_replay` (
  `result_id` text PRIMARY KEY NOT NULL REFERENCES `canonical_conformance_results` (`result_id`) ON DELETE RESTRICT,
  `operation_id` text NOT NULL UNIQUE,
  `claimed_at` text NOT NULL,
  `expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `canonical_conformance_replay_expires_idx` ON `canonical_conformance_replay` (`expires_at`);
--> statement-breakpoint
CREATE TABLE `canonical_mutation_receipts` (
  `receipt_id` text PRIMARY KEY NOT NULL,
  `operation_id` text,
  `result_id` text,
  `receipt_type` text NOT NULL,
  `decision` text NOT NULL,
  `actor_id` text,
  `mutation_hash` text,
  `before_head` text,
  `after_head` text,
  `reason_codes_json` text NOT NULL,
  `receipt_json` text NOT NULL,
  `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `canonical_receipts_created_idx` ON `canonical_mutation_receipts` (`created_at`);
--> statement-breakpoint
CREATE INDEX `canonical_receipts_operation_idx` ON `canonical_mutation_receipts` (`operation_id`);
--> statement-breakpoint
CREATE INDEX `canonical_receipts_result_idx` ON `canonical_mutation_receipts` (`result_id`);
--> statement-breakpoint
CREATE TABLE `canonical_commit_guards` (
  `operation_id` text PRIMARY KEY NOT NULL REFERENCES `canonical_mutation_operations` (`operation_id`) ON DELETE RESTRICT,
  `committed` integer NOT NULL CHECK (`committed` = 1),
  `created_at` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `canonical_runtime_config` VALUES (
  'primary', 'canonical-truth.acceptance.v1', 10, 'canonical-policy.v1',
  'loxihart/main@667542d3909996699ea2b23e3e12b4f37ba5f0fa', 'production',
  'd1-canonical-state.v1', 900, '2026-08-16T00:00:00.000Z'
);
--> statement-breakpoint
INSERT INTO `canonical_state` VALUES (
  'primary', '38aed4593d3dcd1b5f31eabf874831dea010ac605212abcbf83162c35fb4cde4',
  0, '{"claims":{},"schemaVersion":1}', 'canonical-policy.v1',
  'loxihart/main@667542d3909996699ea2b23e3e12b4f37ba5f0fa', 'production',
  '2026-08-16T00:00:00.000Z'
);
--> statement-breakpoint
CREATE TRIGGER `canonical_receipts_no_update` BEFORE UPDATE ON `canonical_mutation_receipts`
BEGIN SELECT RAISE(ABORT, 'canonical mutation receipts are append-only'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_receipts_no_delete` BEFORE DELETE ON `canonical_mutation_receipts`
BEGIN SELECT RAISE(ABORT, 'canonical mutation receipts are append-only'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_replay_no_update` BEFORE UPDATE ON `canonical_conformance_replay`
BEGIN SELECT RAISE(ABORT, 'canonical conformance replay claims are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_replay_no_delete` BEFORE DELETE ON `canonical_conformance_replay`
BEGIN SELECT RAISE(ABORT, 'canonical conformance replay claims are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_conformance_consume_only` BEFORE UPDATE ON `canonical_conformance_results`
WHEN NOT (
  OLD.`consumed_at` IS NULL AND NEW.`consumed_at` IS NOT NULL
  AND NEW.`result_id` = OLD.`result_id` AND NEW.`suite_id` = OLD.`suite_id`
  AND NEW.`policy_version` = OLD.`policy_version` AND NEW.`release_lineage` = OLD.`release_lineage`
  AND NEW.`environment` = OLD.`environment` AND NEW.`canonical_head` = OLD.`canonical_head`
  AND NEW.`status` = OLD.`status` AND NEW.`assertion_count` = OLD.`assertion_count`
  AND NEW.`signature_algorithm` = OLD.`signature_algorithm` AND NEW.`signer_key_id` = OLD.`signer_key_id`
  AND NEW.`signature` = OLD.`signature` AND NEW.`signature_verified` = OLD.`signature_verified`
  AND NEW.`issued_at` = OLD.`issued_at` AND NEW.`expires_at` = OLD.`expires_at`
  AND NEW.`payload_hash` = OLD.`payload_hash` AND NEW.`evidence_manifest_hash` = OLD.`evidence_manifest_hash`
  AND NEW.`envelope_json` = OLD.`envelope_json` AND NEW.`received_at` = OLD.`received_at`
)
BEGIN SELECT RAISE(ABORT, 'signed conformance results are immutable except for first consumption'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_conformance_no_delete` BEFORE DELETE ON `canonical_conformance_results`
BEGIN SELECT RAISE(ABORT, 'signed conformance results are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_operations_commit_only` BEFORE UPDATE ON `canonical_mutation_operations`
WHEN NOT (
  OLD.`status` = 'PENDING' AND NEW.`status` = 'COMMITTED'
  AND OLD.`committed_at` IS NULL AND NEW.`committed_at` IS NOT NULL
  AND NEW.`operation_id` = OLD.`operation_id` AND NEW.`result_id` = OLD.`result_id`
  AND NEW.`actor_id` = OLD.`actor_id` AND NEW.`mutation_hash` = OLD.`mutation_hash`
  AND NEW.`mutation_json` = OLD.`mutation_json` AND NEW.`before_head` = OLD.`before_head`
  AND NEW.`after_head` = OLD.`after_head` AND NEW.`before_version` = OLD.`before_version`
  AND NEW.`after_version` = OLD.`after_version` AND NEW.`policy_version` = OLD.`policy_version`
  AND NEW.`release_lineage` = OLD.`release_lineage` AND NEW.`created_at` = OLD.`created_at`
)
BEGIN SELECT RAISE(ABORT, 'canonical mutation operations may only transition from pending to committed'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_operations_no_delete` BEFORE DELETE ON `canonical_mutation_operations`
BEGIN SELECT RAISE(ABORT, 'canonical mutation operations are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_state_versioned_update_only` BEFORE UPDATE ON `canonical_state`
WHEN NOT (
  NEW.`id` = OLD.`id` AND NEW.`version` = OLD.`version` + 1
  AND NEW.`canonical_head` <> OLD.`canonical_head` AND NEW.`state_json` <> OLD.`state_json`
  AND NEW.`policy_version` = OLD.`policy_version` AND NEW.`release_lineage` = OLD.`release_lineage`
  AND NEW.`environment` = OLD.`environment` AND NEW.`updated_at` > OLD.`updated_at`
)
BEGIN SELECT RAISE(ABORT, 'canonical state updates must advance exactly one immutable version'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_state_no_delete` BEFORE DELETE ON `canonical_state`
BEGIN SELECT RAISE(ABORT, 'canonical state cannot be deleted'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_commit_guards_no_update` BEFORE UPDATE ON `canonical_commit_guards`
BEGIN SELECT RAISE(ABORT, 'canonical commit guards are immutable'); END;
--> statement-breakpoint
CREATE TRIGGER `canonical_commit_guards_no_delete` BEFORE DELETE ON `canonical_commit_guards`
BEGIN SELECT RAISE(ABORT, 'canonical commit guards are immutable'); END;
