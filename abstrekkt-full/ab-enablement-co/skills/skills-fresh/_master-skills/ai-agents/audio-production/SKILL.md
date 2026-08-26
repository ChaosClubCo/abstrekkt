---
name: audio-production
description: Helps configure and build audio production processes. Master audio production with recording techniques, mixing workflows, podcast editing, and multi-platform delivery optimization. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Audio Production Skill

## Instructions


> Master audio production with recording techniques, mixing workflows, podcast editing, and multi-platform delivery optimization.

## Skill Overview

This skill provides expertise in audio production from recording to final delivery. It covers recording techniques, editing workflows, mixing processes, and format optimization for various platforms.

## Core Capabilities

### Recording
- Microphone techniques
- Room acoustics
- Signal chain setup
- Multi-track recording
- Remote recording
- Field recording

### Editing & Mixing
- Dialogue editing
- Noise reduction
- EQ and compression
- Stereo/surround mixing
- Loudness normalization
- Format conversion

### Podcast Production
- Episode structure
- Interview editing
- Show formatting
- Distribution setup
- RSS management
- Analytics tracking

## Recording Fundamentals

### Recording Setup
```yaml
recording_environment:
  acoustic_treatment:
    absorption:
      - Acoustic panels on walls
      - Bass traps in corners
      - Ceiling treatment
    diffusion:
      - Diffuser panels
      - Varied surfaces
    isolation:
      - Soundproofing doors/windows
      - Floating floors
      - Decoupled walls

  home_studio_basics:
    essential:
      - Quiet room selection
      - Soft furnishings for absorption
      - Distance from noise sources
      - Portable vocal booth option

signal_chain:
  voice_recording:
    path: "Microphone → Preamp → Interface → DAW"
    components:
      microphone:
        types:
          condenser: "Detail, sensitivity"
          dynamic: "Rugged, isolation"
          ribbon: "Warmth, smoothness"
        recommendations:
          budget: "Audio-Technica AT2020, Shure SM58"
          mid_range: "Rode NT1, Shure SM7B"
          professional: "Neumann U87, Sennheiser 416"

      preamp:
        purpose: "Amplify mic signal"
        features: "Gain, phantom power, pad"

      interface:
        purpose: "A/D conversion"
        specs: "24-bit, 48kHz minimum"
```

### Microphone Techniques
```yaml
microphone_placement:
  voice:
    distance: "6-12 inches from mouth"
    angle: "Slightly off-axis to reduce plosives"
    pop_filter: "4-6 inches from mic"
    height: "Slightly above mouth level"

  interview:
    two_person:
      option_1: "Separate mics for each"
      option_2: "Bidirectional mic between"
    multi_person:
      round_table: "Individual lavaliers or overhead"

  remote_recording:
    double_ender:
      description: "Each person records locally"
      sync: "Clap or sync tone"
      tools: "Riverside, Zencastr, local recording"

    backup:
      always: "Record backup via platform"
      sync: "TC or visual cue"
```

### Recording Best Practices
```yaml
recording_standards:
  technical:
    sample_rate: "48kHz (standard) or 96kHz (music)"
    bit_depth: "24-bit"
    file_format: "WAV or AIFF"
    headroom: "Peak at -12 to -6 dBFS"

  session_prep:
    - Test all equipment
    - Check levels with speaker
    - Monitor for noise
    - Record room tone
    - Note any issues

  during_recording:
    - Monitor levels constantly
    - Watch for clipping
    - Note timestamps of issues
    - Get clean room tone
    - Record safety takes

  file_management:
    naming: "[Project]_[Speaker]_[Date]_[Take]"
    backup: "Immediately to secondary location"
    notes: "Session log with timestamps"
```

## Editing Workflow

### Audio Editing Pipeline
```yaml
editing_phases:
  phase_1_organization:
    activities:
      - Import all audio files
      - Create project structure
      - Sync multi-track if needed
      - Label tracks clearly

  phase_2_rough_edit:
    activities:
      - Remove major issues
      - Cut unwanted sections
      - Arrange segments
      - Create rough flow

  phase_3_fine_edit:
    activities:
      - Tighten edits
      - Remove filler words
      - Smooth transitions
      - Adjust pacing

  phase_4_cleanup:
    activities:
      - Noise reduction
      - De-click, de-pop
      - Remove breaths (selective)
      - Room tone fill

  phase_5_mixing:
    activities:
      - EQ adjustment
      - Compression
      - Level balancing
      - Stereo positioning

  phase_6_mastering:
    activities:
      - Final EQ
      - Limiting
      - Loudness normalization
      - Format export
```

### Podcast Editing Specifics
```yaml
podcast_editing:
  content_editing:
    remove:
      - Long pauses
      - Filler words (um, uh, like)
      - False starts
      - Off-topic tangents
      - Technical issues
    preserve:
      - Natural speech patterns
      - Emotional moments
      - Authentic reactions
      - Important pauses

  timing_targets:
    short_form: "15-30 minutes"
    standard: "30-60 minutes"
    long_form: "60-90+ minutes"

  structure:
    intro:
      - Cold open/teaser (optional)
      - Theme music
      - Host intro
      - Episode overview
      duration: "1-3 minutes"

    main_content:
      - Segment 1
      - Transition/music break (optional)
      - Segment 2
      - etc.

    outro:
      - Recap/summary
      - Call to action
      - Credits
      - Theme music out
      duration: "1-2 minutes"
```

### Noise Reduction
```yaml
noise_reduction:
  types:
    broadband_noise:
      description: "Constant background hiss"
      tools:
        - iZotope RX (noise reduction)
        - Adobe Audition (adaptive noise reduction)
        - Waves NS1

    transient_noise:
      description: "Clicks, pops, crackles"
      tools:
        - iZotope RX (de-click, de-crackle)
        - Manual editing

    hum:
      description: "Electrical hum (50/60Hz)"
      tools:
        - Notch filter
        - iZotope RX (de-hum)

    room_noise:
      description: "HVAC, traffic, etc."
      approach:
        - Capture noise profile
        - Apply reduction carefully
        - Avoid artifacts

  best_practices:
    - Less is more (avoid artifacts)
    - Process before compression
    - Use noise profile from room tone
    - A/B compare frequently
```

## Mixing Techniques

### Voice Processing Chain
```yaml
voice_processing:
  signal_flow:
    1_cleanup:
      - Noise reduction (if needed)
      - De-click/de-pop
      - De-breath (gentle)

    2_eq:
      high_pass: "80-120Hz to remove rumble"
      presence: "2-5kHz boost for clarity"
      air: "10-12kHz subtle boost"
      mud: "200-400Hz cut if needed"

    3_compression:
      ratio: "3:1 to 6:1"
      threshold: "Catch peaks, 3-6dB reduction"
      attack: "10-30ms"
      release: "50-100ms"
      makeup: "Match input level"

    4_de_essing:
      frequency: "5-8kHz"
      threshold: "Catch harsh S sounds"
      ratio: "Gentle reduction"

    5_limiting:
      purpose: "Catch remaining peaks"
      ceiling: "-1 to -3 dBTP"
      release: "Fast"
```

### Multi-Track Mixing
```yaml
mixing_approach:
  level_balancing:
    dialogue:
      target: "-12 to -6 dBFS peaks"
      consistency: "Automate for even levels"

    music:
      under_dialogue: "-18 to -24 dBFS"
      standalone: "-12 to -6 dBFS"
      transitions: "Fade in/out 1-2 seconds"

    sfx:
      level: "Support, don't overpower"
      placement: "Match visual/narrative cues"

  stereo_positioning:
    dialogue: "Center"
    music: "Wide stereo"
    sfx: "Positioned as needed"
    ambience: "Wide, subtle"

  automation:
    volume: "Ride levels for consistency"
    panning: "Movement for interest"
    effects: "Dynamic processing"
```

### Loudness Standards
```yaml
loudness_targets:
  podcast:
    standard: "-16 LUFS (Spotify) to -19 LUFS"
    true_peak: "-1 dBTP"
    range: "Consistent throughout"

  broadcast:
    atsc: "-24 LUFS"
    ebu_r128: "-23 LUFS"
    true_peak: "-2 dBTP"

  streaming:
    spotify: "-14 LUFS"
    apple_music: "-16 LUFS"
    youtube: "-14 LUFS"

  measurement:
    integrated: "Overall average loudness"
    short_term: "3-second average"
    momentary: "400ms average"
    true_peak: "Maximum sample value"
```

## Delivery Formats

### Export Specifications
```yaml
delivery_formats:
  podcast:
    recommended:
      format: "MP3"
      bitrate: "128 kbps (mono) or 192 kbps (stereo)"
      sample_rate: "44.1kHz"
      channels: "Mono (preferred for speech)"

    high_quality:
      format: "AAC"
      bitrate: "192 kbps"
      sample_rate: "44.1kHz"

  video:
    standard:
      format: "AAC"
      bitrate: "320 kbps"
      sample_rate: "48kHz"
      channels: "Stereo"

    broadcast:
      format: "PCM (WAV)"
      bit_depth: "24-bit"
      sample_rate: "48kHz"

  music:
    streaming:
      format: "WAV or FLAC"
      bit_depth: "24-bit"
      sample_rate: "44.1kHz or 48kHz"

    archival:
      format: "WAV"
      bit_depth: "24-bit"
      sample_rate: "Original"
```

### Distribution Setup
```yaml
podcast_distribution:
  hosting_platforms:
    - Libsyn
    - Buzzsprout
    - Anchor (Spotify)
    - Transistor
    - Podbean

  directories:
    required:
      - Apple Podcasts
      - Spotify
      - Google Podcasts
    additional:
      - Stitcher
      - iHeartRadio
      - Amazon Music
      - Overcast

  metadata:
    episode:
      - Title
      - Description
      - Artwork
      - Episode number
      - Season (if applicable)
      - Category tags

    rss_feed:
      - Show title
      - Description
      - Artwork (3000x3000 min)
      - Author/owner
      - Category
      - Language
      - Explicit rating
```

## Production Tools

### DAW Comparison
```yaml
audio_software:
  adobe_audition:
    strengths:
      - Multi-track editing
      - Spectral editing
      - Integration with Premiere
      - Good noise reduction
    best_for: "Podcast/voice editing"

  pro_tools:
    strengths:
      - Industry standard
      - Advanced mixing
      - Collaboration features
    best_for: "Professional production"

  logic_pro:
    strengths:
      - Complete production suite
      - Good plugins included
      - Apple integration
    best_for: "Music and audio production"

  descript:
    strengths:
      - Text-based editing
      - Transcription included
      - Easy for beginners
      - Overdub feature
    best_for: "Podcast editing"

  hindenburg:
    strengths:
      - Voice-focused
      - Automatic leveling
      - Simple interface
    best_for: "Journalism/podcast"
```

## Integration Points

### Related Skills
- `video-editing` - Video audio tracks
- `accessibility-design` - Transcripts, audio description
- `content-performance` - Podcast analytics

### Workflow Integrations
```yaml
integrations:
  video_production:
    - Export stems for video mix
    - OMF/AAF exchange
    - Timecode sync

  transcription:
    - Descript integration
    - Otter.ai
    - Rev.com

  collaboration:
    - Frame.io for review
    - Dropbox for file sharing
    - Slack for communication
```

## Success Metrics

### Audio Production KPIs
```yaml
metrics:
  quality:
    - Technical QC pass rate
    - Listener feedback
    - Download/stream completion

  efficiency:
    - Production time per minute
    - Revision cycles
    - Turnaround time

  performance:
    - Download numbers
    - Listen-through rate
    - Subscriber growth
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Audio Team | Initial skill creation |

---

*Use this skill to produce professional audio content with clean recording, polished editing, and optimized delivery for all platforms.*
