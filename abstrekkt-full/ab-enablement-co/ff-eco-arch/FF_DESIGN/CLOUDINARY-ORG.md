# Cloudinary Organization — FlashFusion (`dj8gynjnf`)

**TL;DR.** 534 images, previously 100% untagged and folder-less. The 8 confirmed
brand assets are now tagged + foldered **live** (URLs unchanged). The remaining
~526 are organized by an idempotent, URL-safe script you run once.

---

## Why it's split (live vs. script)

- **Folder + tag changes are URL-safe.** Cloudinary delivery URLs key on
  `public_id`, not `asset_folder`. Moving folders / adding tags never changes a
  URL. **Renaming would** — so nothing is ever renamed.
- **The 8 brand assets** were done live via MCP because they're identified and
  high-value.
- **The other ~526** are mostly opaque generated dumps (`file_*`, UUID names) and
  arbitrarily-named files I can't see. Classifying them blind beyond reliable
  metadata (filename substrings, aspect ratio, format) would be fabrication.
  Bulk-writing 526 assets over MCP is also rate-limited and impractical in one
  pass. The script does it correctly, locally, idempotently.

## Folder taxonomy

```
FlashFusion/
  Brand/            fusion brains, core brand imagery
    Mascot/         the robot mascot, all colorways
    Logos/          logo / wordmark / lockup / favicon source
  Heroes/           landscape hero / dashboard / banner imagery
Screenshots/        Screenshot_* / Screen_Shot_* / snips
Generated/          AI-gen output, bucketed by shape
  Portrait/  Landscape/  Square/
Unsorted/           arbitrarily-named, unclassifiable blind — bucketed by shape
  Portrait/  Landscape/  Square/
```

## Tagging convention

| tag | meaning |
|---|---|
| `ffmgr-v1` | processed by the organizer (idempotency marker) |
| `flashfusion-brand` | confirmed brand asset |
| `brain` `fusion` `mascot` `logo` `hero` `dashboard` `enterprise` | content role |
| `orange` `purple` `blue` `magenta` `spectrum` | colorway |
| `portrait` `landscape` `square` | aspect bucket |
| `fmt-png` `fmt-jpg` `fmt-svg` … | format |
| `generated` | AI-generated output |
| `screenshot` | screen capture |
| `stock-watermark` `review-provenance` | ⚠ licensing flag — verify before production use |

## Done live (8 assets — verified, URLs intact)

| public_id | folder | colorway |
|---|---|---|
| `MyBrain-Final_sc11du` | FlashFusion/Brand | spectrum |
| `RedBraimn_qo3nmd` | FlashFusion/Brand | ⚠ stock-watermark |
| `FlashFusionEnterprise_phgeyf` | FlashFusion/Heroes | dashboard |
| `ChatGPT_…_kj6z4f` | FlashFusion/Brand/Mascot | orange |
| `ChatGPT_…_tcd2ze` | FlashFusion/Brand/Mascot | purple |
| `ChatGPT_…_yw4zzr` | FlashFusion/Brand/Mascot | blue |
| `ChatGPT_…_wwh2ph` | FlashFusion/Brand/Mascot | magenta |
| `93b8e135…_ivclyu` | FlashFusion/Brand/Mascot | orange (parachute) |

## Run the bulk organizer (the other ~526)

```bash
pip install "cloudinary>=1.40"

# credentials from env ONLY — never hardcode. Find your secret in
# Cloudinary console → Settings → API Keys.
export CLOUDINARY_URL='cloudinary://<API_KEY>:<API_SECRET>@dj8gynjnf'

python3 organize-cloudinary.py             # DRY RUN — writes cloudinary-manifest.csv, changes nothing
#   review cloudinary-manifest.csv, then:
python3 organize-cloudinary.py --apply      # execute (idempotent, additive tags, URL-safe)
python3 organize-cloudinary.py --self-test  # classification unit checks (no creds needed)
```

- **Dry run is the default.** It produces `cloudinary-manifest.csv` (every asset,
  its current folder, proposed folder, tags, and the rule that fired) so you
  audit before writing.
- **Idempotent.** Re-runs converge; assets already tagged `ffmgr-v1` are skipped
  unless `--force`.
- **Additive.** Tags are added, never replaced — your manual flags survive.
- **Guarded.** Refuses to run if the configured cloud ≠ `dj8gynjnf`.
- **Rate-limit aware.** Exponential backoff on 420/429.

## Open items

- **Provenance (`RedBraimn`, possibly `MyBrain`).** Tagged `review-provenance` +
  `stock-watermark`. These look like licensed stock, not original work. **Confirm
  rights before any production/public use.** `MyBrain` is the live hero — if it's
  stock, swap it.
- **`Unsorted/*`** is the honest bucket for arbitrarily-named files. Re-home them
  by editing `BRAND_ALLOWLIST` or the keyword rules in the script and re-running.
- **No `create-folder` call needed** — dynamic-folder mode auto-creates a folder
  path the first time an asset is assigned to it.
