#!/usr/bin/env python3
"""Offline tests (fake client, no API key). Run: python3 scripts/orchestration/test_orchestration_mode_hardened.py"""
from __future__ import annotations

import sys
import tempfile
import threading
import unittest
from pathlib import Path
from types import SimpleNamespace as NS

sys.path.insert(0, str(Path(__file__).resolve().parent))

import orchestration_mode_hardened as om  # noqa: E402


def text(value: str) -> NS:
    return NS(type="text", text=value)


def tool(name: str, args: dict, ident: str = "t1") -> NS:
    return NS(type="tool_use", id=ident, name=name, input=args)


class FakeStream:
    def __init__(self, message: NS):
        self.message = message

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def get_final_message(self) -> NS:
        return self.message


class FakeClient:
    """Pops scripted replies per agent; sub-agents are told apart by their system prompt."""

    def __init__(self, lead: list[NS], sub: list[NS] | None = None, out_tokens: int = 100):
        self.lead, self.sub, self.out_tokens = list(lead), list(sub or []), out_tokens
        self.calls: list[dict] = []
        self._lock = threading.Lock()
        self.messages = self

    def stream(self, **kwargs):
        with self._lock:
            self.calls.append(kwargs)
            queue = self.lead if kwargs["system"] == om.LEAD_SYSTEM else self.sub
            content, stop = queue.pop(0) if queue else ([text("done")], "end_turn")
        usage = NS(output_tokens=min(self.out_tokens, kwargs["max_tokens"]))  # API cannot exceed max_tokens
        return FakeStream(NS(content=content, stop_reason=stop, usage=usage))


def make_repo() -> tempfile.TemporaryDirectory:
    tmp = tempfile.TemporaryDirectory()
    root = Path(tmp.name) / "repo"
    (root / "tests").mkdir(parents=True)
    (root / ".git").mkdir()
    (root / "tests" / "test_a.py").write_text("import time\ntime.sleep(1)  # flaky\nassert True\n")
    (root / "main.py").write_text("print('hi')\n")
    (root / ".env").write_text("API_KEY=should-never-be-read\n")
    (root / ".git" / "config").write_text("[core]\n")
    (Path(tmp.name) / "outside.txt").write_text("outside secret\n")
    return tmp


class FsTests(unittest.TestCase):
    def setUp(self):
        self.tmp = make_repo()
        self.root = Path(self.tmp.name) / "repo"
        self.fs = om.ReadOnlyFS(self.root)

    def tearDown(self):
        self.tmp.cleanup()

    def test_traversal_and_absolute_paths_refused(self):
        for bad in ("../outside.txt", "/etc/passwd", "tests/../../outside.txt"):
            with self.assertRaises(PermissionError, msg=bad):
                self.fs.read_file(bad)

    def test_symlink_escape_refused(self):
        (self.root / "link.txt").symlink_to(Path(self.tmp.name) / "outside.txt")
        with self.assertRaises(PermissionError):
            self.fs.read_file("link.txt")

    def test_deny_list_and_git_hidden(self):
        with self.assertRaises(PermissionError):
            self.fs.read_file(".env")
        with self.assertRaises(PermissionError):
            self.fs.read_file(".git/config")
        listing = self.fs.list_dir(".")
        self.assertNotIn(".env", listing)
        self.assertNotIn(".git", listing)
        self.assertIn("main.py", listing)

    def test_read_file_numbers_lines_and_rejects_binary(self):
        self.assertIn("2: time.sleep(1)", self.fs.read_file("tests/test_a.py"))
        (self.root / "blob.bin").write_bytes(b"\0\1\2")
        with self.assertRaises(ValueError):
            self.fs.read_file("blob.bin")

    def test_grep_finds_matches_skips_denied_and_validates_pattern(self):
        hits = self.fs.grep("sleep|API_KEY")
        self.assertIn("tests/test_a.py:2", hits)
        self.assertNotIn("API_KEY", hits)
        with self.assertRaises(ValueError):
            self.fs.grep("x" * 201)
        self.assertEqual(self.fs.grep("zzz_not_present"), "no matches")

    def test_extra_exclude_glob(self):
        fs = om.ReadOnlyFS(self.root, ("main.*",))
        with self.assertRaises(PermissionError):
            fs.read_file("main.py")


class BudgetTests(unittest.TestCase):
    def test_call_cap_with_lead_reserve(self):
        budget = om.Budget(max_calls=5, max_output_tokens=1_000_000, max_subagents=3, lead_reserve_calls=2)
        for _ in range(3):
            budget.settle(budget.reserve(4096, lead=False), 0)
        with self.assertRaises(om.BudgetExceeded):
            budget.reserve(4096, lead=False)
        budget.settle(budget.reserve(4096, lead=True), 0)  # lead may still use the reserve
        budget.settle(budget.reserve(4096, lead=True), 0)
        with self.assertRaises(om.BudgetExceeded):
            budget.reserve(4096, lead=True)
        self.assertEqual(budget.snapshot()["calls"], 5)

    def test_parallel_reservations_cannot_overshoot_tokens(self):
        budget = om.Budget(max_calls=100, max_output_tokens=10_000, max_subagents=3, lead_reserve_tokens=0)
        grants, errors = [], []

        def worker():
            try:
                grants.append(budget.reserve(4_000, lead=False))
            except om.BudgetExceeded:
                errors.append(1)

        threads = [threading.Thread(target=worker) for _ in range(6)]
        [t.start() for t in threads]
        [t.join() for t in threads]
        self.assertLessEqual(sum(grants), 10_000)
        self.assertTrue(errors)

    def test_lead_token_reserve_protected_from_subagents(self):
        budget = om.Budget(max_calls=50, max_output_tokens=20_000, max_subagents=3, lead_reserve_tokens=8_000)
        grant = budget.reserve(32_000, lead=False)
        self.assertEqual(grant, 12_000)
        with self.assertRaises(om.BudgetExceeded):
            budget.reserve(32_000, lead=False)
        self.assertEqual(budget.reserve(32_000, lead=True), 8_000)

    def test_subagent_cap(self):
        budget = om.Budget(10, 100_000, max_subagents=2)
        self.assertEqual([budget.claim_subagent() for _ in range(3)], [True, True, False])


class OrchestratorTests(unittest.TestCase):
    def setUp(self):
        self.tmp = make_repo()
        self.fs = om.ReadOnlyFS(Path(self.tmp.name) / "repo")

    def tearDown(self):
        self.tmp.cleanup()

    def run_orch(self, client, budget=None):
        budget = budget or om.Budget(80, 300_000, 12)
        return om.Orchestrator(client, self.fs, budget), budget

    def test_lead_spawns_subagents_in_parallel_and_synthesizes(self):
        client = FakeClient(
            lead=[([tool("spawn_subagent", {"task": "a"}, "s1"), tool("spawn_subagent", {"task": "b"}, "s2")],
                   "tool_use"), ([text("final report")], "end_turn")],
            sub=[([text("finding A")], "end_turn"), ([text("finding B")], "end_turn")])
        orch, budget = self.run_orch(client)
        result = orch.run("review")
        self.assertEqual((result.text, result.stop), ("final report", "end_turn"))
        self.assertEqual(budget.snapshot()["subagents"], 2)
        last_user = client.calls[-1]["messages"][-1]["content"]
        self.assertEqual({r["tool_use_id"] for r in last_user}, {"s1", "s2"})  # one message, all results
        self.assertEqual(sorted(r["content"] for r in last_user), ["finding A", "finding B"])

    def test_subagent_limit_returned_as_tool_error(self):
        client = FakeClient(lead=[([tool("spawn_subagent", {"task": "a"}, "s1"),
                                    tool("spawn_subagent", {"task": "b"}, "s2")], "tool_use"),
                                  ([text("ok")], "end_turn")])
        orch, _ = self.run_orch(client, om.Budget(80, 300_000, max_subagents=1))
        orch.run("review")
        results = client.calls[-1]["messages"][-1]["content"]
        self.assertEqual(sum(r["is_error"] for r in results), 1)
        self.assertIn("subagent limit", next(r["content"] for r in results if r["is_error"]))

    def test_tool_errors_do_not_crash_and_never_leak_denied_content(self):
        client = FakeClient(lead=[([tool("read_file", {"path": ".env"}, "r1"),
                                    tool("read_file", {"path": "../outside.txt"}, "r2"),
                                    tool("bogus", {}, "r3")], "tool_use"), ([text("ok")], "end_turn")])
        orch, _ = self.run_orch(client)
        orch.run("x")
        results = client.calls[-1]["messages"][-1]["content"]
        self.assertTrue(all(r["is_error"] for r in results))
        self.assertNotIn("should-never-be-read", repr(results))
        self.assertNotIn("outside secret", repr(results))

    def test_subagents_cannot_spawn(self):
        client = FakeClient(
            lead=[([tool("spawn_subagent", {"task": "a"}, "s1")], "tool_use"), ([text("ok")], "end_turn")],
            sub=[([tool("spawn_subagent", {"task": "nested"}, "n1")], "tool_use"), ([text("gave up")], "end_turn")])
        orch, budget = self.run_orch(client)
        orch.run("x")
        sub_tools = [c for c in client.calls if c["system"] == om.SUB_SYSTEM][0]["tools"]
        self.assertNotIn("spawn_subagent", [t["name"] for t in sub_tools])
        self.assertEqual(budget.snapshot()["subagents"], 1)  # hallucinated nested spawn not executed
        nested = [c for c in client.calls if c["system"] == om.SUB_SYSTEM][1]["messages"][-1]["content"][0]
        self.assertTrue(nested["is_error"])

    def test_call_budget_stops_runaway_loop_with_partial_text(self):
        looping = ([text("partial"), tool("list_dir", {"path": "."})], "tool_use")
        client = FakeClient(lead=[looping] * 50)
        orch, budget = self.run_orch(client, om.Budget(max_calls=4, max_output_tokens=300_000, max_subagents=2))
        result = orch.run("x")
        self.assertEqual(result.stop, "max-calls reached")
        self.assertEqual(result.text, "partial")
        self.assertEqual(len(client.calls), 4)
        self.assertEqual(budget.exhausted, "max-calls reached")

    def test_token_budget_stops_run(self):
        looping = ([text("p"), tool("list_dir", {"path": "."})], "tool_use")
        client = FakeClient(lead=[looping] * 50, out_tokens=9_000)
        orch, budget = self.run_orch(client, om.Budget(80, 30_000, 2, lead_reserve_tokens=0))
        orch.per_call_max = 10_000
        result = orch.run("x")
        self.assertEqual(result.stop, "max-output-tokens reached")
        self.assertLessEqual(budget.snapshot()["output_tokens"], 30_000)

    def test_api_error_is_reported_not_raised(self):
        class Boom(FakeClient):
            def stream(self, **kwargs):
                raise om.anthropic.APIConnectionError(request=NS(url="x"))

        orch, budget = self.run_orch(Boom(lead=[]))
        result = orch.run("x")
        self.assertTrue(result.stop.startswith("api error"))
        self.assertEqual(budget.snapshot()["output_tokens"], 0)


class CliTests(unittest.TestCase):
    def test_flags_parse_and_reject_nonpositive(self):
        args = om.parse_args(["--dir", ".", "--max-subagents", "12", "--max-calls", "80",
                              "--max-output-tokens", "300000", "task text"])
        self.assertEqual((args.max_subagents, args.max_calls, args.max_output_tokens), (12, 80, 300000))
        with self.assertRaises(SystemExit):
            om.parse_args(["--dir", ".", "--max-calls", "0", "t"])

    def test_missing_dir_exit_1(self):
        self.assertEqual(om.main(["--dir", "/nonexistent-dir-xyz", "t"]), 1)


if __name__ == "__main__":
    unittest.main()
