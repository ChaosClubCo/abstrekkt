from pathlib import Path
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]
CURRENT_ABSTREKKT_REPOSITORY = "ChaosClubCo/abstrekkt"
HISTORICAL_ABSTREKKT_REPOSITORY = "Krosebrook/abstrekkt"
CURRENT_LOXIHART_REPOSITORY = "ChaosClubCo/Loxihart"
HISTORICAL_LOXIHART_REPOSITORY = "Krosebrook/Loxihart"


class RepositoryAuthorityContractTests(unittest.TestCase):
    def test_registry_routes_current_loxihart_mutations_to_current_owner(self) -> None:
        registry = (ROOT / "repository-registry.yaml").read_text(encoding="utf-8")
        self.assertIn(
            f"owner_repository: {CURRENT_LOXIHART_REPOSITORY}",
            registry,
        )
        self.assertIn(
            f"belong to {CURRENT_LOXIHART_REPOSITORY}",
            registry,
        )

    def test_integrity_checker_points_frozen_subtree_to_current_owner(self) -> None:
        checker = (ROOT / "scripts" / "repo_integrity.py").read_text(encoding="utf-8")
        self.assertIn(
            f'"owner_repository: {CURRENT_LOXIHART_REPOSITORY}"',
            checker,
        )
        self.assertIn(
            f"migrate in {CURRENT_LOXIHART_REPOSITORY} instead",
            checker,
        )

    def test_repository_authority_preserves_historical_loxihart_repository_name(self) -> None:
        authority = (ROOT / "REPOSITORY.md").read_text(encoding="utf-8")
        self.assertIn(
            f"`{CURRENT_LOXIHART_REPOSITORY}` owns Loxihart governance",
            authority,
        )
        self.assertIn(HISTORICAL_LOXIHART_REPOSITORY, authority)
        self.assertIn("historical provenance", authority.lower())

    def test_active_loxihart_routing_surfaces_use_current_owner(self) -> None:
        current_surfaces = (
            "README.md",
            "AGENTS.md",
            "CLAUDE.md",
            ".github/copilot-instructions.md",
            ".github/agents/repository-steward.agent.md",
            "docs/user-flows/README.md",
            "docs/user-flows/loxihart-pilot-operator-reference.md",
        )
        for relative in current_surfaces:
            with self.subTest(relative=relative):
                text = (ROOT / relative).read_text(encoding="utf-8")
                self.assertIn(CURRENT_LOXIHART_REPOSITORY, text)
                self.assertNotIn(HISTORICAL_LOXIHART_REPOSITORY, text)

        projects = json.loads(
            (ROOT / "docs/gitbook/registry/project-bindings.json").read_text(encoding="utf-8")
        )
        systems = {item["system"]: item for item in projects["systems"]}
        self.assertEqual(systems["Loxihart"]["repository"], CURRENT_LOXIHART_REPOSITORY)

    def test_historical_loxihart_evidence_keeps_historical_repository_name(self) -> None:
        historical_surfaces = (
            "docs/release/RELEASE_CHECKLIST.md",
            "docs/repository/LOXIHART_BRANCH_CONSOLIDATION_2026-08-26.md",
            "docs/migrations/loxihart/evidence-room-v1.2-certification-docs-sync.md",
        )
        for relative in historical_surfaces:
            with self.subTest(relative=relative):
                text = (ROOT / relative).read_text(encoding="utf-8")
                self.assertIn(HISTORICAL_LOXIHART_REPOSITORY, text)

    def test_root_authority_routes_current_abstrekkt_to_current_owner(self) -> None:
        authority = (ROOT / "REPOSITORY.md").read_text(encoding="utf-8")
        self.assertIn(
            f"`{CURRENT_ABSTREKKT_REPOSITORY}` is the canonical repository",
            authority,
        )
        self.assertIn(HISTORICAL_ABSTREKKT_REPOSITORY, authority)
        self.assertIn("historical provenance", authority.lower())

    def test_registry_routes_current_abstrekkt_domains_to_current_owner(self) -> None:
        registry = (ROOT / "repository-registry.yaml").read_text(encoding="utf-8")
        lines = registry.splitlines()
        self.assertIn(f"repository: {CURRENT_ABSTREKKT_REPOSITORY}", lines)
        self.assertGreaterEqual(
            lines.count(f"    owner_repository: {CURRENT_ABSTREKKT_REPOSITORY}"),
            4,
        )

    def test_gitbook_bindings_route_to_current_abstrekkt_owner(self) -> None:
        binding = json.loads(
            (ROOT / "docs/gitbook/registry/gitbook-binding.json").read_text(encoding="utf-8")
        )
        projects = json.loads(
            (ROOT / "docs/gitbook/registry/project-bindings.json").read_text(encoding="utf-8")
        )
        self.assertEqual(binding["repository"]["full_name"], CURRENT_ABSTREKKT_REPOSITORY)
        systems = {item["system"]: item for item in projects["systems"]}
        self.assertEqual(systems["Abstrekkt"]["repository"], CURRENT_ABSTREKKT_REPOSITORY)
        self.assertEqual(systems["Execution Architect"]["repository"], CURRENT_ABSTREKKT_REPOSITORY)

    def test_active_abstrekkt_docs_do_not_claim_historical_owner_as_current(self) -> None:
        current_surfaces = (
            ".github/agents/repository-steward.agent.md",
            ".github/agents/security-reviewer.agent.md",
            "docs/gitbook/public/README.md",
            "governance/execution-architect/README.md",
            "scripts/verify-gitbook-docs.mjs",
            "worlds/abstrekkt/entities/abstrekkt-documentation.md",
            "worlds/abstrekkt/entities/chaosclubco-abstrekkt-repository.md",
            "worlds/abstrekkt/relations/abstrekkt-repository-on-github.md",
            "worlds/abstrekkt/relations/knowledge-os-source-artifacts.md",
        )
        for relative in current_surfaces:
            with self.subTest(relative=relative):
                text = (ROOT / relative).read_text(encoding="utf-8")
                self.assertIn(CURRENT_ABSTREKKT_REPOSITORY, text)
                self.assertNotIn(HISTORICAL_ABSTREKKT_REPOSITORY, text)

        self.assertFalse(
            (ROOT / "worlds/abstrekkt/entities/krosebrook-abstrekkt-repository.md").exists()
        )

    def test_historical_abstrekkt_evidence_keeps_historical_repository_name(self) -> None:
        historical_audit = (ROOT / "docs/SECURITY-AUDIT.md").read_text(encoding="utf-8")
        self.assertIn(HISTORICAL_ABSTREKKT_REPOSITORY, historical_audit)


if __name__ == "__main__":
    unittest.main()
