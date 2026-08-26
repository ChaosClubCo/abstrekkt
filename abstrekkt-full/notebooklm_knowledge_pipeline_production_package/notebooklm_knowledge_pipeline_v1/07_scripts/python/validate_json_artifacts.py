from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

ROOT = Path(r"C:\Users\kyler\Downloads\NLM_PIPELINE")
JSON_DIRS = [ROOT / "06_concepts", ROOT / "07_graphs", ROOT / "09_company_brain_ingest"]


def iter_json_files(paths: Iterable[Path]) -> Iterable[Path]:
    for base in paths:
        if base.exists():
            yield from base.rglob("*.json")


def main() -> int:
    failures: list[str] = []
    for path in iter_json_files(JSON_DIRS):
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001 - validation script should report all parsing failures
            failures.append(f"{path}: {exc}")
    if failures:
        print("JSON validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1
    print("All JSON artifacts parsed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
