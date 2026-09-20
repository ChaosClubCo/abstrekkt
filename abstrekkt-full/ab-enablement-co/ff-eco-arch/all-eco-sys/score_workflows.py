#!/usr/bin/env python3
"""
n8n Workflow Gumroad Scoring Tool
Fetches workflow JSONs from GitHub repos, scores each against a 5-axis
sellability framework, and exports a ranked CSV of candidates.

Usage:
    python score_workflows.py
    python score_workflows.py --repo enescingoz/awesome-n8n-templates --max 500
    python score_workflows.py --repo Zie619/n8n-workflows --min-score 15
    python score_workflows.py --local /path/to/workflows/dir

Requirements:
    pip install requests tqdm
    Optional: set GITHUB_TOKEN env var to avoid rate limits (5000 req/hr vs 60)
"""

import argparse
import csv
import json
import logging
import os
import re
import sys
import time
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Optional
import requests

try:
    from tqdm import tqdm
    HAS_TQDM = True
except ImportError:
    HAS_TQDM = False

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
HEADERS = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}

DEFAULT_REPOS = [
    "enescingoz/awesome-n8n-templates",
    "Danitilahun/n8n-workflow-templates",
    "Zie619/n8n-workflows",
]

# Known business-buyer integrations → raise pain_specificity score
BUSINESS_INTEGRATIONS = {
    "gmail", "outlook", "smtp", "imap",
    "hubspot", "salesforce", "pipedrive", "close",
    "notion", "airtable", "googlesheets", "google_sheets",
    "slack", "discord", "telegram",
    "stripe", "quickbooks", "xero",
    "shopify", "woocommerce",
    "typeform", "jotform",
    "linkedin", "twitter", "x",
    "openai", "anthropic", "gemini", "ollama",
    "wordpress", "ghost",
    "trello", "asana", "monday", "clickup",
    "dropbox", "googledrive", "google_drive",
    "zoom", "calendly",
    "twilio", "sendgrid", "mailchimp",
}

# Trigger types that indicate recurring/scheduled workflows
RECURRING_TRIGGERS = {
    "n8n-nodes-base.scheduletrigger",
    "n8n-nodes-base.cron",
    "@n8n/n8n-nodes-langchain.scheduletrigger",
}

# Trigger types that indicate strong integration (external push)
WEBHOOK_TRIGGERS = {
    "n8n-nodes-base.webhook",
    "n8n-nodes-base.formtrigger",
    "n8n-nodes-base.emailimap",
}

# Node types that signal developer-facing workflows (penalize business buyer score)
DEV_NODES = {
    "n8n-nodes-base.github",
    "n8n-nodes-base.gitlab",
    "n8n-nodes-base.ssh",
    "n8n-nodes-base.docker",
    "n8n-nodes-base.aws",
    "n8n-nodes-base.executecommand",
}

# High-value AI nodes
AI_NODES = {
    "@n8n/n8n-nodes-langchain.openai",
    "n8n-nodes-base.openai",
    "@n8n/n8n-nodes-langchain.lmchatopenai",
    "@n8n/n8n-nodes-langchain.agent",
    "@n8n/n8n-nodes-langchain.chainllm",
}

# Price bands
def estimate_price(total_score: int, integration_count: int) -> str:
    if total_score >= 22:
        return "$59–$79"
    elif total_score >= 18:
        return "$39–$59"
    elif total_score >= 14:
        return "$19–$39"
    else:
        return "<$19 or skip"


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class WorkflowScore:
    filename: str
    repo: str
    name: str
    node_count: int
    integration_count: int
    integrations: str           # comma-separated list
    trigger_type: str
    has_ai_node: bool
    is_recurring: bool
    has_webhook: bool
    has_error_handler: bool
    has_sticky_notes: bool
    has_readme: bool            # if there's a paired README in the same dir

    # Scores (1–5 each, max 25)
    pain_specificity: int       # Named, recurring business problem?
    integration_count_score: int  # 3+ services = higher value
    recurrence_score: int       # Runs on schedule or trigger?
    business_buyer_score: int   # SMB/freelancer/ops vs dev audience
    documentation_gap_score: int  # How bare is the existing doc?

    total_score: int = 0
    price_estimate: str = ""
    notes: str = ""

    def compute(self):
        self.total_score = (
            self.pain_specificity
            + self.integration_count_score
            + self.recurrence_score
            + self.business_buyer_score
            + self.documentation_gap_score
        )
        self.price_estimate = estimate_price(self.total_score, self.integration_count)
        return self


# ---------------------------------------------------------------------------
# Scoring logic
# ---------------------------------------------------------------------------

def extract_node_types(workflow: dict) -> list[str]:
    nodes = workflow.get("nodes", [])
    return [n.get("type", "").lower() for n in nodes if n.get("type")]


def extract_integrations(node_types: list[str]) -> set[str]:
    found = set()
    for nt in node_types:
        # Strip namespace prefix e.g. "n8n-nodes-base.gmail" → "gmail"
        short = nt.split(".")[-1].replace("-", "_").lower()
        if short in BUSINESS_INTEGRATIONS:
            found.add(short)
        # Also match partial (e.g. "googlesheets" inside "googlesheetstrigger")
        for bi in BUSINESS_INTEGRATIONS:
            if bi in short:
                found.add(bi)
    return found


def score_workflow(workflow: dict, filename: str, repo: str) -> WorkflowScore:
    nodes = workflow.get("nodes", [])
    node_types = extract_node_types(workflow)
    integrations = extract_integrations(node_types)
    node_count = len(nodes)

    name = workflow.get("name", Path(filename).stem).strip()

    trigger_types = [nt for nt in node_types if "trigger" in nt]
    trigger_type = trigger_types[0] if trigger_types else "manual"

    is_recurring = any(t in RECURRING_TRIGGERS for t in node_types)
    has_webhook = any(t in WEBHOOK_TRIGGERS for t in node_types)
    has_error_handler = any("errortrigger" in t or "errorworkflow" in t for t in node_types)
    has_sticky_notes = any(n.get("type") == "n8n-nodes-base.stickyNote" for n in nodes)
    has_ai_node = any(t in AI_NODES for t in node_types)
    has_readme = False  # populated by caller if known

    ic = len(integrations)
    dev_node_count = sum(1 for t in node_types if t in DEV_NODES)

    # ---- pain_specificity (1-5) ----
    # More specific integrations + AI = higher pain signal
    if ic >= 3 and has_ai_node:
        pain = 5
    elif ic >= 3:
        pain = 4
    elif ic == 2:
        pain = 3
    elif ic == 1:
        pain = 2
    else:
        pain = 1

    # Boost for clearly named business workflows
    name_lower = name.lower()
    business_keywords = [
        "invoice", "lead", "crm", "client", "customer", "onboard",
        "report", "digest", "monitor", "alert", "notify", "email",
        "social", "post", "content", "support", "ticket", "review",
        "approval", "contract", "payment", "overdue", "reminder",
    ]
    keyword_hits = sum(1 for kw in business_keywords if kw in name_lower)
    pain = min(5, pain + (1 if keyword_hits >= 2 else 0))

    # ---- integration_count_score (1-5) ----
    if ic >= 5:
        ic_score = 5
    elif ic == 4:
        ic_score = 4
    elif ic == 3:
        ic_score = 3
    elif ic == 2:
        ic_score = 2
    else:
        ic_score = 1

    # ---- recurrence_score (1-5) ----
    if is_recurring:
        rec = 5
    elif has_webhook:
        rec = 4
    elif "manual" in trigger_type:
        rec = 2
    else:
        rec = 3

    # ---- business_buyer_score (1-5) ----
    # Penalize heavy dev-node usage
    if dev_node_count >= 3:
        biz = 1
    elif dev_node_count >= 1:
        biz = 2
    elif ic >= 2 and keyword_hits >= 1:
        biz = 5
    elif ic >= 2:
        biz = 4
    else:
        biz = 3

    # ---- documentation_gap_score (1-5) ----
    # Higher = MORE gap = MORE opportunity (no docs = we add all value)
    if not has_sticky_notes and not has_readme:
        doc_gap = 5
    elif not has_sticky_notes:
        doc_gap = 4
    elif not has_readme:
        doc_gap = 3
    else:
        doc_gap = 2

    # Build notes
    notes_parts = []
    if has_ai_node:
        notes_parts.append("AI nodes")
    if is_recurring:
        notes_parts.append("scheduled")
    if has_webhook:
        notes_parts.append("webhook")
    if dev_node_count >= 2:
        notes_parts.append(f"⚠ dev-heavy ({dev_node_count} dev nodes)")
    if has_error_handler:
        notes_parts.append("has error handler")
    if node_count > 20:
        notes_parts.append(f"complex ({node_count} nodes)")
    elif node_count < 5:
        notes_parts.append(f"simple ({node_count} nodes)")

    score = WorkflowScore(
        filename=filename,
        repo=repo,
        name=name,
        node_count=node_count,
        integration_count=ic,
        integrations=", ".join(sorted(integrations)) or "none",
        trigger_type=trigger_type,
        has_ai_node=has_ai_node,
        is_recurring=is_recurring,
        has_webhook=has_webhook,
        has_error_handler=has_error_handler,
        has_sticky_notes=has_sticky_notes,
        has_readme=has_readme,
        pain_specificity=pain,
        integration_count_score=ic_score,
        recurrence_score=rec,
        business_buyer_score=biz,
        documentation_gap_score=doc_gap,
        notes="; ".join(notes_parts),
    )
    return score.compute()


# ---------------------------------------------------------------------------
# GitHub fetching
# ---------------------------------------------------------------------------

def gh_get(url: str, retries: int = 3) -> Optional[dict | list]:
    for attempt in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            if r.status_code == 403:
                reset = int(r.headers.get("X-RateLimit-Reset", time.time() + 60))
                wait = max(1, reset - int(time.time()) + 2)
                logging.warning(f"Rate limited. Waiting {wait}s...")
                time.sleep(wait)
                continue
            if r.status_code == 200:
                return r.json()
            logging.warning(f"HTTP {r.status_code} for {url}")
            return None
        except requests.RequestException as e:
            logging.warning(f"Request error ({attempt+1}/{retries}): {e}")
            time.sleep(2 ** attempt)
    return None


def list_json_files_in_repo(owner_repo: str, max_files: int = 1000) -> list[dict]:
    """Return list of {path, download_url} for all .json files in a repo."""
    owner, repo = owner_repo.split("/", 1)
    # Get default branch
    repo_meta = gh_get(f"https://api.github.com/repos/{owner}/{repo}")
    if not repo_meta:
        logging.error(f"Cannot access repo {owner_repo}")
        return []
    branch = repo_meta.get("default_branch", "main")

    # Get full tree
    tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
    tree_data = gh_get(tree_url)
    if not tree_data:
        return []

    files = []
    for item in tree_data.get("tree", []):
        if item.get("type") == "blob" and item["path"].endswith(".json"):
            dl_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{item['path']}"
            files.append({"path": item["path"], "download_url": dl_url})
        if len(files) >= max_files:
            break

    return files


def fetch_workflow_json(download_url: str) -> Optional[dict]:
    try:
        r = requests.get(download_url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            data = r.json()
            # Validate it looks like an n8n workflow
            if isinstance(data, dict) and "nodes" in data:
                return data
        return None
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Local file processing
# ---------------------------------------------------------------------------

def load_local_workflows(directory: str, max_files: int = 5000) -> list[tuple[str, dict]]:
    results = []
    p = Path(directory)
    for f in list(p.rglob("*.json"))[:max_files]:
        try:
            data = json.loads(f.read_text(encoding="utf-8", errors="ignore"))
            if isinstance(data, dict) and "nodes" in data:
                results.append((str(f.relative_to(p)), data))
        except Exception:
            pass
    return results


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def run(
    repos: list[str],
    max_per_repo: int,
    min_score: int,
    output_path: str,
    local_dir: Optional[str],
):
    all_scores: list[WorkflowScore] = []

    if local_dir:
        logging.info(f"Scanning local directory: {local_dir}")
        workflows = load_local_workflows(local_dir, max_per_repo)
        bar = tqdm(workflows, desc="Scoring local") if HAS_TQDM else workflows
        for filename, wf in bar:
            try:
                s = score_workflow(wf, filename, "local")
                all_scores.append(s)
            except Exception as e:
                logging.debug(f"Skip {filename}: {e}")
    else:
        for repo in repos:
            logging.info(f"Fetching file list: {repo}")
            files = list_json_files_in_repo(repo, max_per_repo)
            logging.info(f"  Found {len(files)} JSON files")

            bar = tqdm(files, desc=repo.split("/")[1][:20]) if HAS_TQDM else files
            for f in bar:
                wf = fetch_workflow_json(f["download_url"])
                if not wf:
                    continue
                try:
                    s = score_workflow(wf, f["path"], repo)
                    all_scores.append(s)
                except Exception as e:
                    logging.debug(f"Skip {f['path']}: {e}")
                time.sleep(0.05)  # gentle rate limiting

    # Sort by total_score descending
    all_scores.sort(key=lambda x: x.total_score, reverse=True)
    filtered = [s for s in all_scores if s.total_score >= min_score]

    logging.info(f"\nTotal scored: {len(all_scores)} | Above threshold ({min_score}): {len(filtered)}")

    # Write CSV
    if not filtered:
        logging.warning("No workflows met the minimum score threshold.")
        return

    csv_fields = [
        "rank", "total_score", "price_estimate", "name", "repo", "filename",
        "node_count", "integration_count", "integrations",
        "pain_specificity", "integration_count_score", "recurrence_score",
        "business_buyer_score", "documentation_gap_score",
        "trigger_type", "has_ai_node", "is_recurring", "has_webhook",
        "has_error_handler", "has_sticky_notes", "notes",
    ]

    with open(output_path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=csv_fields)
        writer.writeheader()
        for rank, s in enumerate(filtered, 1):
            row = asdict(s)
            row["rank"] = rank
            writer.writerow({k: row.get(k, "") for k in csv_fields})

    logging.info(f"Saved: {output_path}")

    # Print top 20 preview
    print(f"\n{'='*80}")
    print(f"TOP 20 CANDIDATES (of {len(filtered)} above score {min_score})")
    print(f"{'='*80}")
    print(f"{'#':<4} {'Score':<7} {'Price':<14} {'Name':<50} {'Integrations'}")
    print("-" * 120)
    for rank, s in enumerate(filtered[:20], 1):
        name_trunc = s.name[:48] + ".." if len(s.name) > 50 else s.name
        integ_trunc = s.integrations[:40] + ".." if len(s.integrations) > 42 else s.integrations
        print(f"{rank:<4} {s.total_score:<7} {s.price_estimate:<14} {name_trunc:<50} {integ_trunc}")
    print(f"\nFull results → {output_path}")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )

    parser = argparse.ArgumentParser(description="Score n8n workflows for Gumroad sellability")
    parser.add_argument("--repo", type=str, default=None,
                        help="Single GitHub repo (owner/name). Defaults to all 3 source repos.")
    parser.add_argument("--repos", nargs="+", default=DEFAULT_REPOS,
                        help="Multiple GitHub repos to scan")
    parser.add_argument("--max", type=int, default=500,
                        help="Max workflow files to fetch per repo (default 500)")
    parser.add_argument("--min-score", type=int, default=14,
                        help="Minimum total score to include in output (default 14, max 25)")
    parser.add_argument("--output", type=str, default="workflow_candidates.csv",
                        help="Output CSV filename")
    parser.add_argument("--local", type=str, default=None,
                        help="Score workflows from a local directory instead of GitHub")
    args = parser.parse_args()

    if not GITHUB_TOKEN and not args.local:
        logging.warning(
            "No GITHUB_TOKEN set. Using unauthenticated API (60 req/hr limit). "
            "Set GITHUB_TOKEN env var for 5,000 req/hr."
        )

    repos_to_scan = [args.repo] if args.repo else args.repos

    run(
        repos=repos_to_scan,
        max_per_repo=args.max,
        min_score=args.min_score,
        output_path=args.output,
        local_dir=args.local,
    )
