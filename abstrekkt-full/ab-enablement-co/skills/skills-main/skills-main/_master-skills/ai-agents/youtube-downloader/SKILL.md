---
name: youtube-downloader
description: Configure and build YouTube video download workflows with customizable quality and format options. Use when the user asks to download, save, or grab YouTube videos, extract audio, or build automated media acquisition pipelines.
---

# YouTube Downloader

> Build robust YouTube download workflows with quality selection, format conversion, and batch processing capabilities.

## Core Workflow

1. **Assess download requirements** - Determine target content type (single video, playlist, channel), desired quality, and output format
2. **Configure the download tool** - Set up yt-dlp with appropriate flags for quality, format, subtitles, and metadata
3. **Handle format selection** - Choose between video formats (mp4, webm, mkv) or audio extraction (mp3, m4a, opus)
4. **Set quality parameters** - Configure resolution limits, codec preferences, and bitrate targets
5. **Implement error handling** - Add retry logic, network timeout handling, and graceful failure recovery
6. **Organize output** - Structure downloaded files with consistent naming, metadata embedding, and directory organization

## Tool Configuration

### yt-dlp (Recommended)

yt-dlp is the maintained fork of youtube-dl with active development and better performance.

#### Installation

```bash
# pip install
pip install yt-dlp

# Or with pipx for isolated environment
pipx install yt-dlp

# Homebrew (macOS)
brew install yt-dlp

# Windows (winget)
winget install yt-dlp

# Update to latest
yt-dlp -U
```

#### Basic Usage

```bash
# Download best quality video + audio
yt-dlp "https://youtube.com/watch?v=VIDEO_ID"

# Download specific quality
yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" URL

# Download audio only as MP3
yt-dlp -x --audio-format mp3 --audio-quality 0 URL

# Download with subtitles
yt-dlp --write-subs --sub-langs en URL

# Download playlist
yt-dlp --yes-playlist -o "%(playlist_title)s/%(playlist_index)03d - %(title)s.%(ext)s" URL
```

## Quality Presets

### Video Quality Tiers

| Preset | Format String | Typical Size |
|--------|--------------|-------------|
| Best | `bestvideo+bestaudio/best` | 500MB-2GB/hr |
| 1080p | `bestvideo[height<=1080]+bestaudio/best[height<=1080]` | 300MB-800MB/hr |
| 720p | `bestvideo[height<=720]+bestaudio/best[height<=720]` | 150MB-400MB/hr |
| 480p | `bestvideo[height<=480]+bestaudio/best[height<=480]` | 80MB-200MB/hr |
| 360p | `bestvideo[height<=360]+bestaudio/best[height<=360]` | 40MB-100MB/hr |

### Audio Quality Tiers

| Preset | Flags | Typical Size |
|--------|-------|-------------|
| Best MP3 | `-x --audio-format mp3 --audio-quality 0` | 10MB/hr |
| Standard MP3 | `-x --audio-format mp3 --audio-quality 5` | 5MB/hr |
| Best M4A | `-x --audio-format m4a --audio-quality 0` | 8MB/hr |
| Opus | `-x --audio-format opus --audio-quality 0` | 6MB/hr |

## Configuration Templates

### Download Config File (`yt-dlp.conf`)

```ini
# Output template
-o %(title)s [%(id)s].%(ext)s

# Prefer mp4 container
--merge-output-format mp4

# Embed metadata
--embed-metadata
--embed-thumbnail
--embed-subs

# Download subtitles
--write-subs
--sub-langs en,es,fr

# Rate limiting (be respectful)
--sleep-interval 2
--max-sleep-interval 5

# Retry on failure
--retries 10
--fragment-retries 10

# Archive tracking (skip already downloaded)
--download-archive downloaded.txt
```

### Python Automation Script

```python
import yt_dlp
import os

def download_video(url, output_dir="downloads", quality="1080p"):
    """Download a YouTube video with specified quality."""

    quality_map = {
        "best": "bestvideo+bestaudio/best",
        "1080p": "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
        "720p": "bestvideo[height<=720]+bestaudio/best[height<=720]",
        "480p": "bestvideo[height<=480]+bestaudio/best[height<=480]",
        "360p": "bestvideo[height<=360]+bestaudio/best[height<=360]",
    }

    os.makedirs(output_dir, exist_ok=True)

    ydl_opts = {
        "format": quality_map.get(quality, quality_map["1080p"]),
        "outtmpl": os.path.join(output_dir, "%(title)s [%(id)s].%(ext)s"),
        "merge_output_format": "mp4",
        "embedmetadata": True,
        "embedthumbnail": True,
        "writethumbnail": True,
        "retries": 10,
        "fragment_retries": 10,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return info


def download_audio(url, output_dir="audio", fmt="mp3"):
    """Extract audio from a YouTube video."""

    os.makedirs(output_dir, exist_ok=True)

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": os.path.join(output_dir, "%(title)s [%(id)s].%(ext)s"),
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": fmt,
            "preferredquality": "0",
        }],
        "embedmetadata": True,
        "retries": 10,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return info


def download_playlist(url, output_dir="playlists", quality="720p"):
    """Download an entire playlist with numbered filenames."""

    quality_map = {
        "best": "bestvideo+bestaudio/best",
        "1080p": "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
        "720p": "bestvideo[height<=720]+bestaudio/best[height<=720]",
    }

    os.makedirs(output_dir, exist_ok=True)

    ydl_opts = {
        "format": quality_map.get(quality, quality_map["720p"]),
        "outtmpl": os.path.join(
            output_dir,
            "%(playlist_title)s",
            "%(playlist_index)03d - %(title)s [%(id)s].%(ext)s"
        ),
        "merge_output_format": "mp4",
        "embedmetadata": True,
        "download_archive": os.path.join(output_dir, "downloaded.txt"),
        "retries": 10,
        "sleep_interval": 2,
        "max_sleep_interval": 5,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return info
```

### Batch Download Script

```bash
#!/bin/bash
# batch_download.sh - Download videos from a URL list

URL_FILE="${1:-urls.txt}"
OUTPUT_DIR="${2:-downloads}"
QUALITY="${3:-720p}"
ARCHIVE="${OUTPUT_DIR}/downloaded.txt"

mkdir -p "$OUTPUT_DIR"

yt-dlp \
  --batch-file "$URL_FILE" \
  -f "bestvideo[height<=${QUALITY%p}]+bestaudio/best[height<=${QUALITY%p}]" \
  -o "${OUTPUT_DIR}/%(title)s [%(id)s].%(ext)s" \
  --merge-output-format mp4 \
  --embed-metadata \
  --embed-thumbnail \
  --download-archive "$ARCHIVE" \
  --sleep-interval 3 \
  --max-sleep-interval 8 \
  --retries 10 \
  --fragment-retries 10 \
  --no-overwrites \
  2>&1 | tee "${OUTPUT_DIR}/download.log"

echo "Download complete. Check ${OUTPUT_DIR}/download.log for details."
```

## Common Patterns

### Extract Video Metadata Without Downloading

```bash
# Print JSON metadata
yt-dlp --dump-json --no-download URL

# List available formats
yt-dlp -F URL

# Print title and duration
yt-dlp --print "%(title)s (%(duration_string)s)" --no-download URL
```

### Subtitle Workflows

```bash
# Download only subtitles (no video)
yt-dlp --write-subs --skip-download --sub-langs "en.*" URL

# Auto-generated subtitles
yt-dlp --write-auto-subs --skip-download --sub-langs en URL

# Convert subtitles to SRT
yt-dlp --write-subs --convert-subs srt URL
```

### Channel/Playlist Filtering

```bash
# Download only videos from last 30 days
yt-dlp --dateafter "$(date -d '30 days ago' +%Y%m%d)" CHANNEL_URL

# Download videos matching title pattern
yt-dlp --match-title "tutorial" CHANNEL_URL

# Limit playlist range
yt-dlp --playlist-start 1 --playlist-end 10 PLAYLIST_URL

# Skip videos longer than 30 minutes
yt-dlp --match-filter "duration < 1800" PLAYLIST_URL
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Video unavailable" | Check if video is region-locked; try with `--geo-bypass` |
| Slow downloads | Use `--concurrent-fragments 4` for parallel fragment downloading |
| Merge errors | Install FFmpeg: `brew install ffmpeg` or `winget install ffmpeg` |
| Format not available | Run `yt-dlp -F URL` to see available formats, pick an alternative |
| Age-restricted content | Pass cookies: `--cookies-from-browser chrome` |
| Rate limiting | Add `--sleep-interval 5 --max-sleep-interval 15` |
| Incomplete downloads | Resume with `--no-overwrites` flag; yt-dlp auto-resumes partial downloads |

## Best Practices

- Always use `--download-archive` for recurring downloads to avoid re-downloading
- Set `--sleep-interval` when downloading multiple videos to avoid rate limiting
- Use `--embed-metadata` and `--embed-thumbnail` for self-contained media files
- Prefer `mp4` as merge output format for maximum compatibility
- Store config in `~/.config/yt-dlp/config` for persistent defaults
- Use `--restrict-filenames` when downloading to filesystems with character limitations
- Test format selection with `--print filename -f FORMAT --no-download` before bulk downloads
