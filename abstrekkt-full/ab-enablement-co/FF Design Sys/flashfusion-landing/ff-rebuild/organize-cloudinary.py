#!/usr/bin/env python3
"""
organize-cloudinary.py — deterministic, idempotent, URL-safe bulk organizer
for the FlashFusion Cloudinary library (cloud: dj8gynjnf).

WHAT IT DOES
  - Lists every image asset (paginated).
  - Classifies each into a folder + tag set using DETERMINISTIC rules
    (filename substrings + aspect ratio + format). No vision, no guessing
    beyond what the metadata supports.
  - Sets `asset_folder` (URL-SAFE: does NOT rename, so delivery URLs are
    unchanged) and ADDS tags (additive — never removes your manual tags).
  - Writes a full manifest CSV of every decision.

WHY ADDITIVE / FOLDER-ONLY
  Cloudinary delivery URLs are keyed on public_id, NOT on asset_folder.
  Moving an asset's folder or adding tags never changes its URL. Renaming
  WOULD break URLs — this script never renames.

SAFETY
  - DRY-RUN BY DEFAULT. Prints + writes manifest, makes zero changes.
  - Pass --apply to actually write.
  - Idempotent: re-running converges to the same state. Assets already
    carrying the `ffmgr-v1` tag are skipped unless --force.
  - Credentials come from the environment ONLY. Never hardcode secrets.

USAGE
  export CLOUDINARY_URL='cloudinary://<API_KEY>:<API_SECRET>@dj8gynjnf'
  python3 organize-cloudinary.py                 # dry run, writes manifest
  python3 organize-cloudinary.py --apply         # execute
  python3 organize-cloudinary.py --apply --force # re-process already-tagged
  python3 organize-cloudinary.py --self-test     # classify-rule unit checks

REQUIREMENTS
  pip install cloudinary>=1.40
"""
from __future__ import annotations

import argparse
import csv
import logging
import os
import re
import sys
import time
from dataclasses import dataclass, field
from typing import Callable

try:
    import cloudinary
    import cloudinary.api
    import cloudinary.uploader
    from cloudinary.exceptions import Error as CloudinaryError
except ImportError:
    sys.stderr.write("ERROR: cloudinary SDK missing. Run: pip install cloudinary>=1.40\n")
    sys.exit(2)

# --------------------------------------------------------------------------
# config
# --------------------------------------------------------------------------
PROCESSED_TAG = "ffmgr-v1"          # idempotency marker
MANIFEST_PATH = "cloudinary-manifest.csv"
PAGE_SIZE = 100                      # Cloudinary admin api max is 500; 100 is gentle
WRITE_SLEEP = 0.15                   # seconds between writes (rate-limit courtesy)
MAX_BACKOFF = 60.0
EXPECTED_CLOUD = "dj8gynjnf"         # guard against pointing at the wrong account

# Exact-match brand allowlist -> canonical placement. Mirrors what was set live.
BRAND_ALLOWLIST: dict[str, tuple[str, list[str]]] = {
    "MyBrain-Final_sc11du": ("FlashFusion/Brand", ["brain", "hero", "fusion", "spectrum"]),
    "RedBraimn_qo3nmd": ("FlashFusion/Brand", ["brain", "fusion", "stock-watermark", "review-provenance"]),
    "FlashFusionEnterprise_phgeyf": ("FlashFusion/Heroes", ["hero", "dashboard", "enterprise"]),
    "ChatGPT_Image_Nov_14_2025_06_57_15_PM_kj6z4f": ("FlashFusion/Brand/Mascot", ["mascot", "orange"]),
    "ChatGPT_Image_Nov_1_2025_06_20_39_PM_1_tcd2ze": ("FlashFusion/Brand/Mascot", ["mascot", "purple"]),
    "ChatGPT_Image_Nov_1_2025_06_20_41_PM_yw4zzr": ("FlashFusion/Brand/Mascot", ["mascot", "blue"]),
    "ChatGPT_Image_Nov_1_2025_06_20_38_PM_wwh2ph": ("FlashFusion/Brand/Mascot", ["mascot", "magenta"]),
    "93b8e135-7320-4006-94ef-c02763196f82_ivclyu": ("FlashFusion/Brand/Mascot", ["mascot", "orange", "parachute"]),
}

UUID_RE = re.compile(r"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.I)

log = logging.getLogger("ffmgr")


# --------------------------------------------------------------------------
# classification (pure function — deterministic, unit-testable)
# --------------------------------------------------------------------------
@dataclass
class Decision:
    public_id: str
    folder: str
    tags: list[str] = field(default_factory=list)
    rule: str = ""


def _aspect(width: int, height: int) -> str:
    if not width or not height:
        return "square"
    ar = width / height
    if ar >= 1.20:
        return "landscape"
    if ar <= 0.83:
        return "portrait"
    return "square"


def classify(public_id: str, width: int, height: int, fmt: str) -> Decision:
    """Map one asset to (folder, tags) using only reliable metadata signals."""
    pid = public_id.lower()
    aspect = _aspect(width, height)
    base_tags = [PROCESSED_TAG, aspect]
    if fmt:
        base_tags.append(f"fmt-{fmt.lower()}")

    # 1) exact brand allowlist — highest priority, stable placement
    if public_id in BRAND_ALLOWLIST:
        folder, extra = BRAND_ALLOWLIST[public_id]
        return Decision(public_id, folder, base_tags + ["flashfusion-brand"] + extra, "brand-allowlist")

    def has(*keys: str) -> bool:
        return any(k in pid for k in keys)

    # 2) keyword rules (substring on full public_id)
    if has("logo", "wordmark", "brandmark", "favicon", "lockup"):
        return Decision(public_id, "FlashFusion/Brand/Logos", base_tags + ["flashfusion-brand", "logo"], "kw-logo")
    if has("mascot", "robot"):
        return Decision(public_id, "FlashFusion/Brand/Mascot", base_tags + ["flashfusion-brand", "mascot"], "kw-mascot")
    if has("mybrain", "redbrain", "redbraimn", "brain", "neural", "fusion"):
        return Decision(public_id, "FlashFusion/Brand", base_tags + ["flashfusion-brand", "brain", "fusion"], "kw-brain")
    if has("flashfusion", "flash-fusion", "flash_fusion", "enterprise"):
        return Decision(public_id, "FlashFusion/Heroes", base_tags + ["flashfusion-brand", "hero"], "kw-ff")
    if has("hero", "banner", "cover", "header", "headline"):
        return Decision(public_id, "FlashFusion/Heroes", base_tags + ["hero"], "kw-hero")
    if has("screenshot", "screen_shot", "screen-shot", "screen shot", "snip"):
        return Decision(public_id, "Screenshots", base_tags + ["screenshot"], "kw-screenshot")
    if has("chatgpt_image", "chatgpt", "dall-e", "dalle", "midjourney", "_mj", "sdxl", "stable-diffusion", "leonardo", "ideogram"):
        return Decision(public_id, f"Generated/{aspect.capitalize()}", base_tags + ["generated"], "kw-genai")

    # 3) opaque / uuid dumps -> Generated by aspect
    if pid.startswith("file_") or UUID_RE.search(pid):
        return Decision(public_id, f"Generated/{aspect.capitalize()}", base_tags + ["generated"], "opaque")

    # 4) fallback: arbitrary named -> Unsorted by aspect (honest: unclassifiable blind)
    return Decision(public_id, f"Unsorted/{aspect.capitalize()}", base_tags, "fallback")


# --------------------------------------------------------------------------
# cloudinary plumbing
# --------------------------------------------------------------------------
def configure_or_die() -> str:
    """Configure from env (CLOUDINARY_URL or discrete vars). Returns cloud name."""
    if os.getenv("CLOUDINARY_URL"):
        cloudinary.config()  # reads CLOUDINARY_URL
    else:
        name = os.getenv("CLOUDINARY_CLOUD_NAME")
        key = os.getenv("CLOUDINARY_API_KEY")
        secret = os.getenv("CLOUDINARY_API_SECRET")
        if not (name and key and secret):
            sys.stderr.write(
                "ERROR: missing credentials. Set CLOUDINARY_URL, or "
                "CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET.\n"
            )
            sys.exit(2)
        cloudinary.config(cloud_name=name, api_key=key, api_secret=secret, secure=True)

    cfg = cloudinary.config()
    cloud = getattr(cfg, "cloud_name", None)
    if not cloud:
        sys.stderr.write("ERROR: cloud_name not resolved from environment.\n")
        sys.exit(2)
    if cloud != EXPECTED_CLOUD:
        sys.stderr.write(
            f"REFUSING TO RUN: configured cloud '{cloud}' != expected '{EXPECTED_CLOUD}'.\n"
            f"Set EXPECTED_CLOUD in the script if this is intentional.\n"
        )
        sys.exit(3)
    return cloud


def iter_assets():
    """Yield every image resource dict, paginating defensively."""
    cursor: str | None = None
    while True:
        try:
            resp = cloudinary.api.resources(
                resource_type="image",
                max_results=PAGE_SIZE,
                next_cursor=cursor,
                tags=True,
                fields="public_id,asset_id,width,height,format,asset_folder,tags",
            )
        except CloudinaryError as exc:  # network / auth / rate
            log.error("list page failed: %s", exc)
            raise
        for res in resp.get("resources", []):
            yield res
        cursor = resp.get("next_cursor")
        if not cursor:
            return


def apply_decision(d: Decision, existing_tags: list[str]) -> None:
    """Set folder + add tags, with exponential backoff on rate limits."""
    backoff = 1.0
    while True:
        try:
            # folder move (URL-safe; no public_id change)
            cloudinary.api.update(d.public_id, asset_folder=d.folder)
            # additive tags only (preserves manual tags)
            new_tags = [t for t in d.tags if t not in set(existing_tags)]
            if new_tags:
                cloudinary.uploader.add_tag(",".join(new_tags), [d.public_id])
            time.sleep(WRITE_SLEEP)
            return
        except CloudinaryError as exc:
            msg = str(exc).lower()
            if "rate" in msg or "420" in msg or "429" in msg:
                if backoff > MAX_BACKOFF:
                    log.error("giving up on %s after backoff: %s", d.public_id, exc)
                    raise
                log.warning("rate limited; sleeping %.1fs", backoff)
                time.sleep(backoff)
                backoff *= 2
                continue
            log.error("update failed for %s: %s", d.public_id, exc)
            raise


# --------------------------------------------------------------------------
# self-test (smoke)
# --------------------------------------------------------------------------
def self_test() -> int:
    cases = [
        ("MyBrain-Final_sc11du", 1536, 1024, "png", "FlashFusion/Brand"),
        ("FlashFusionEnterprise_phgeyf", 1536, 1024, "png", "FlashFusion/Heroes"),
        ("ChatGPT_Image_Nov_14_2025_06_57_15_PM_kj6z4f", 1024, 1536, "png", "FlashFusion/Brand/Mascot"),
        ("ff-logo-primary", 512, 512, "svg", "FlashFusion/Brand/Logos"),
        ("Screenshot_2026-01-02", 1920, 1080, "png", "Screenshots"),
        ("ChatGPT_Image_random_xyz", 1024, 1024, "png", "Generated/Square"),
        ("file_00000000a1b2", 1024, 1536, "png", "Generated/Portrait"),
        ("3f2c9e10-aaaa-bbbb-cccc-1234567890ab_x", 1536, 1024, "png", "Generated/Landscape"),
        ("client-deck-q3", 1280, 720, "jpg", "Unsorted/Landscape"),
    ]
    ok = True
    for pid, w, h, fmt, expect in cases:
        got = classify(pid, w, h, fmt).folder
        flag = "OK " if got == expect else "FAIL"
        if got != expect:
            ok = False
        print(f"  [{flag}] {pid:48s} -> {got}  (expected {expect})")
    print("SELF-TEST:", "PASS" if ok else "FAIL")
    return 0 if ok else 1


# --------------------------------------------------------------------------
# main
# --------------------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser(description="FlashFusion Cloudinary bulk organizer")
    ap.add_argument("--apply", action="store_true", help="actually write (default: dry run)")
    ap.add_argument("--force", action="store_true", help="re-process assets already tagged ffmgr-v1")
    ap.add_argument("--self-test", action="store_true", help="run classification unit checks and exit")
    ap.add_argument("--manifest", default=MANIFEST_PATH, help="manifest CSV output path")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )

    if args.self_test:
        return self_test()

    configure_or_die()
    mode = "APPLY" if args.apply else "DRY-RUN"
    log.info("mode=%s  manifest=%s", mode, args.manifest)

    seen = changed = skipped = errors = 0
    rows: list[dict[str, str]] = []

    for res in iter_assets():
        seen += 1
        pid = res["public_id"]
        existing = res.get("tags") or []
        cur_folder = res.get("asset_folder", "") or ""

        if PROCESSED_TAG in existing and not args.force:
            skipped += 1
            rows.append({"public_id": pid, "current_folder": cur_folder,
                         "proposed_folder": cur_folder, "tags": ";".join(existing),
                         "rule": "skip-already-processed", "action": "skip"})
            continue

        d = classify(pid, res.get("width", 0), res.get("height", 0), res.get("format", ""))
        action = "move+tag" if d.folder != cur_folder else "tag-only"
        rows.append({"public_id": pid, "current_folder": cur_folder,
                     "proposed_folder": d.folder, "tags": ";".join(d.tags),
                     "rule": d.rule, "action": action if args.apply else f"would-{action}"})

        if args.apply:
            try:
                apply_decision(d, existing)
                changed += 1
                log.debug("%s -> %s", pid, d.folder)
            except CloudinaryError:
                errors += 1
        else:
            log.debug("[dry] %s -> %s (%s)", pid, d.folder, d.rule)

    # write manifest
    try:
        with open(args.manifest, "w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=["public_id", "current_folder",
                                               "proposed_folder", "tags", "rule", "action"])
            w.writeheader()
            w.writerows(rows)
    except OSError as exc:
        log.error("could not write manifest: %s", exc)
        return 1

    log.info("done. seen=%d changed=%d skipped=%d errors=%d", seen, changed, skipped, errors)
    log.info("manifest written: %s (%d rows)", args.manifest, len(rows))
    if not args.apply:
        log.info("DRY RUN — no changes made. Re-run with --apply to execute.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
