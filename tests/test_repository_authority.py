from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
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

    def test_repository_authority_preserves_historical_repository_name(self) -> None:
        authority = (ROOT / "REPOSITORY.md").read_text(encoding="utf-8")
        self.assertIn(
            f"`{CURRENT_LOXIHART_REPOSITORY}` owns Loxihart governance",
            authority,
        )
        self.assertIn(HISTORICAL_LOXIHART_REPOSITORY, authority)
        self.assertIn("historical provenance", authority.lower())


if __name__ == "__main__":
    unittest.main()
