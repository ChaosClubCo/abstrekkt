"""Safety contract for the legacy Cloudflare apex binding workflow."""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = ROOT / ".github/workflows/bind-abstrekkt-custom-domain-one-shot.yml"


class DomainBindingWorkflowSafetyTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.text = WORKFLOW.read_text(encoding="utf-8")

    def test_legacy_dns_workflow_does_not_delete_records(self) -> None:
        self.assertNotIn("--request DELETE", self.text)
        self.assertNotIn("/tmp/dns-delete.json", self.text)

    def test_preflight_before_any_domain_mutation(self) -> None:
        preflight = self.text.index("- name: Refuse conflicting apex DNS before any mutation")
        add_domain = self.text.index("- name: Add custom domain when absent")
        reconcile = self.text.index("- name: Reconcile apex DNS to certified Pages project")
        self.assertLess(preflight, add_domain)
        self.assertLess(add_domain, reconcile)
        self.assertIn("paginated DNS response requires manual inspection", self.text)
        self.assertIn("existing apex CNAME target differs", self.text)

    def test_race_recheck_refuses_conflicting_records(self) -> None:
        self.assertIn("if [[ -s /tmp/conflict-ids ]]; then", self.text)
        self.assertIn("conflicting apex DNS records appeared after preflight", self.text)

    def test_execution_is_main_and_environment_bound(self) -> None:
        self.assertIn("if: github.ref == 'refs/heads/main'", self.text)
        self.assertIn("environment: production", self.text)


if __name__ == "__main__":
    unittest.main()
