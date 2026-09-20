from __future__ import annotations

import csv
import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import requests

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
MANIFEST_PATH = Path(os.environ.get("NLM_MANIFEST", r"C:\Users\kyler\Downloads\NLM_PIPELINE\10_qa\hash_manifest.csv"))


@dataclass(frozen=True)
class AssetRow:
    filename: str
    extension: str
    size_bytes: int
    sha256: str
    full_path: str


def require_env() -> None:
    missing = [name for name, value in {"SUPABASE_URL": SUPABASE_URL, "SUPABASE_SERVICE_ROLE_KEY": SUPABASE_SERVICE_ROLE_KEY}.items() if not value]
    if missing:
        raise RuntimeError(f"Missing required environment variables: {', '.join(missing)}")


def lane_for_extension(ext: str) -> str:
    return {".pdf": "deck", ".png": "visual", ".m4a": "audio", ".mp4": "video"}.get(ext.lower(), "derived")


def status_for_extension(ext: str) -> str:
    return {".pdf": "blocked_ocr", ".png": "processable", ".m4a": "blocked_transcript", ".mp4": "blocked_transcript"}.get(ext.lower(), "raw")


def load_manifest(path: Path) -> list[AssetRow]:
    if not path.exists():
        raise FileNotFoundError(f"Manifest not found: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        return [AssetRow(row["FileName"], row["Extension"], int(row["SizeBytes"]), row["SHA256"], row["FullPath"]) for row in reader]


def upsert_asset(row: AssetRow) -> None:
    assert SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
    payload: dict[str, Any] = {
        "asset_id": f"asset_{row.sha256[:16].lower()}",
        "filename": row.filename,
        "source_type": {".pdf": "deck_pdf", ".png": "visual_png", ".m4a": "audio_m4a", ".mp4": "video_mp4"}.get(row.extension, "unknown"),
        "lane": lane_for_extension(row.extension),
        "status": status_for_extension(row.extension),
        "sha256": row.sha256,
        "size_bytes": row.size_bytes,
        "storage_uri": row.full_path,
        "notes": "Imported from Downloads batch scan manifest. Review before canonical memory promotion.",
    }
    response = requests.post(
        f"{SUPABASE_URL.rstrip('/')}/rest/v1/knowledge_assets",
        headers={
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
        },
        json=payload,
        timeout=30,
    )
    if response.status_code not in {200, 201, 204}:
        raise RuntimeError(f"Supabase upsert failed for {row.filename}: {response.status_code} {response.text}")


def main() -> int:
    require_env()
    rows = load_manifest(MANIFEST_PATH)
    for row in rows:
        upsert_asset(row)
        print(f"Upserted {row.filename}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
