---
name: video-editing
description: Master video post-production with editing workflows, color grading, sound design, and delivery optimization for multi-platform distribution. Use when designing, creating, or reviewing creative deliverables.
---

# Video Editing Skill

## Instructions


> Master video post-production with editing workflows, color grading, sound design, and delivery optimization for multi-platform distribution.

## Skill Overview

This skill provides expertise in video post-production from rough cut to final delivery. It covers editing techniques, color correction, audio mixing, and format optimization.

## Core Capabilities

### Video Editing
- Narrative editing
- Pacing and rhythm
- Transition techniques
- Multi-cam editing
- Motion graphics integration
- Visual effects compositing

### Color Grading
- Color correction
- Look development
- Scene matching
- HDR workflows
- Color management
- Delivery specifications

### Sound Design
- Audio editing
- Mixing and mastering
- Sound effects
- Music integration
- Dialogue cleanup
- Audio sweetening

## Editing Workflow

### Post-Production Pipeline
```yaml
post_production_phases:
  phase_1_ingest:
    duration: "Day 1"
    activities:
      - Import and organize footage
      - Create project structure
      - Sync audio if needed
      - Create proxies if necessary
      - Review all footage
      - Note selects and issues

  phase_2_assembly:
    duration: "Days 2-3"
    activities:
      - Rough cut assembly
      - Basic structure
      - Scene ordering
      - Major selections
    output: "Assembly cut"

  phase_3_rough_cut:
    duration: "Days 4-7"
    activities:
      - Refine timing
      - Tighten edits
      - Initial sound work
      - Placeholder graphics
    output: "Rough cut for review"

  phase_4_fine_cut:
    duration: "Days 8-10"
    activities:
      - Address feedback
      - Fine-tune pacing
      - Add transitions
      - Refine audio
    output: "Fine cut"

  phase_5_picture_lock:
    duration: "Day 11"
    activities:
      - Final timing approval
      - Lock edit timeline
      - Prepare for finishing
    output: "Picture lock"

  phase_6_finishing:
    duration: "Days 12-15"
    activities:
      - Color grading
      - Audio mix
      - Graphics finalization
      - VFX completion
      - Quality control
    output: "Final master"

  phase_7_delivery:
    duration: "Day 16"
    activities:
      - Export deliverables
      - Format conversions
      - Quality check
      - Archive project
    output: "Final deliverables"
```

### Project Organization
```yaml
project_structure:
  folder_structure:
    /Project_Name
    ├── /01_Source
    │   ├── /Camera_A
    │   ├── /Camera_B
    │   ├── /Audio
    │   ├── /Graphics
    │   └── /Music
    ├── /02_Project_Files
    │   ├── /Premiere (or DaVinci, FCP)
    │   ├── /After_Effects
    │   └── /Audition
    ├── /03_Proxies
    ├── /04_Work_In_Progress
    │   ├── /Exports
    │   └── /Reviews
    ├── /05_Final
    │   ├── /Masters
    │   └── /Deliverables
    └── /06_Archive
        └── /Project_Backup

  naming_convention:
    format: "[Project]_[Type]_[Version]_[Date]"
    examples:
      - "BrandX_Hero_v1_20250115"
      - "BrandX_Hero_v2_Review_20250116"
      - "BrandX_Hero_FINAL_20250120"

  version_tracking:
    v1: "First assembly"
    v2-v5: "Revision rounds"
    LOCK: "Picture lock version"
    FINAL: "Approved master"
```

### Editing Techniques
```yaml
editing_techniques:
  cuts:
    hard_cut:
      description: "Standard direct cut"
      use_when: "General transitions, dialogue"

    jump_cut:
      description: "Cut within same shot"
      use_when: "Condensing time, social content"

    j_cut:
      description: "Audio leads video"
      use_when: "Smooth scene transitions"

    l_cut:
      description: "Video leads audio"
      use_when: "Dialogue scenes"

    match_cut:
      description: "Visual or audio match"
      use_when: "Creative transitions"

  transitions:
    dissolve:
      use_when: "Time passage, gentle transitions"
      duration: "12-24 frames typical"

    wipe:
      use_when: "Stylized content, retro feel"

    push:
      use_when: "Dynamic, energetic content"

  pacing:
    fast_paced:
      shot_duration: "1-3 seconds"
      use_for: "Action, energy, excitement"

    medium_paced:
      shot_duration: "3-5 seconds"
      use_for: "Standard narrative"

    slow_paced:
      shot_duration: "5+ seconds"
      use_for: "Drama, emotion, contemplation"
```

## Color Grading

### Color Workflow
```yaml
color_workflow:
  step_1_correction:
    purpose: "Technical correction"
    tasks:
      - White balance
      - Exposure adjustment
      - Contrast correction
      - Color casts removal
    goal: "Neutral, balanced image"

  step_2_matching:
    purpose: "Scene consistency"
    tasks:
      - Match shots within scene
      - Balance multi-cam
      - Consistent skin tones
    goal: "Seamless continuity"

  step_3_look_development:
    purpose: "Creative grade"
    tasks:
      - Develop color palette
      - Create mood/atmosphere
      - Apply creative LUTs
      - Adjust for narrative
    goal: "Defined visual style"

  step_4_refinement:
    purpose: "Fine tuning"
    tasks:
      - Secondary corrections
      - Power windows
      - Skin tone refinement
      - Detail adjustments
    goal: "Polished final look"
```

### Color Tools
```yaml
color_grading_tools:
  primary_tools:
    davinci_resolve:
      strengths:
        - Industry standard
        - Advanced color tools
        - Node-based workflow
        - Free version available
      best_for: "Professional color grading"

    lumetri_premiere:
      strengths:
        - Integrated with Premiere
        - Good for basic grades
        - Familiar interface
      best_for: "Editorial color work"

  technical_settings:
    working_space:
      rec_709: "Standard HD/web"
      rec_2020: "HDR content"
      dci_p3: "Cinema delivery"

    bit_depth:
      8_bit: "Standard web delivery"
      10_bit: "Broadcast quality"
      12_bit_plus: "High-end production"

    color_science:
      log_footage: "Apply LUT or manual grade"
      raw_footage: "Debayer settings critical"
```

### Look Development
```yaml
look_creation:
  mood_palettes:
    warm_nostalgic:
      shadows: "Lifted, orange/brown"
      midtones: "Warm, desaturated"
      highlights: "Creamy yellow"

    cool_corporate:
      shadows: "Deep blue/teal"
      midtones: "Neutral to cool"
      highlights: "Clean white"

    cinematic_teal_orange:
      shadows: "Teal push"
      midtones: "Balanced"
      highlights: "Warm orange"
      skin_tones: "Protected warm"

    high_contrast_dramatic:
      shadows: "Crushed blacks"
      midtones: "Punchy"
      highlights: "Bright, clipped"
```

## Sound Design

### Audio Workflow
```yaml
audio_workflow:
  dialogue:
    cleanup:
      - Noise reduction
      - EQ for clarity
      - Compression
      - De-essing
      - Room tone matching

    mixing:
      level: "-12 to -6 dBFS average"
      headroom: "Peak at -6 dBFS"

  music:
    selection:
      - Licensed tracks
      - Custom composition
      - Mood matching
      - Pacing support

    mixing:
      under_dialogue: "-18 to -24 dBFS"
      standalone: "-12 to -6 dBFS"
      ducking: "Automated or manual"

  sound_effects:
    types:
      - Ambient/room tone
      - Foley (footsteps, cloth)
      - Hard effects (doors, impacts)
      - Design elements (whooshes, risers)

    mixing:
      level: "Support picture, not overpower"
      placement: "Match visual cues"

  final_mix:
    levels:
      dialogue: "-12 to -6 dBFS"
      music: "-18 to -12 dBFS"
      sfx: "-18 to -6 dBFS (varies)"
      overall: "Peak -3 dBFS, average -14 LUFS"
```

### Audio Standards
```yaml
delivery_standards:
  web_streaming:
    format: "AAC or MP3"
    sample_rate: "48kHz"
    loudness: "-14 LUFS"
    true_peak: "-1 dBTP"

  broadcast:
    format: "PCM"
    sample_rate: "48kHz"
    loudness: "-24 LUFS (ATSC) or -23 LUFS (EBU)"
    true_peak: "-2 dBTP"

  theatrical:
    format: "5.1 or 7.1"
    sample_rate: "48kHz"
    loudness: "85 dB SPL reference"
```

## Delivery Specifications

### Export Settings
```yaml
delivery_formats:
  web_streaming:
    youtube_hd:
      codec: "H.264"
      container: "MP4"
      resolution: "1920x1080"
      frame_rate: "Match source"
      bitrate: "10-15 Mbps"
      audio: "AAC, 320 kbps"

    youtube_4k:
      codec: "H.264 or H.265"
      container: "MP4"
      resolution: "3840x2160"
      bitrate: "35-68 Mbps"

    social_media:
      instagram_feed:
        resolution: "1080x1080 or 1080x1350"
        max_duration: "60 seconds"
        codec: "H.264"

      tiktok:
        resolution: "1080x1920"
        codec: "H.264"

      linkedin:
        resolution: "1920x1080"
        max_duration: "10 minutes"

  broadcast:
    prores_422:
      codec: "Apple ProRes 422"
      resolution: "1920x1080"
      frame_rate: "23.976, 29.97, or 59.94"

    dnxhd:
      codec: "Avid DNxHD"
      resolution: "1920x1080"
      profile: "DNxHD 145 or higher"

  archive:
    master:
      codec: "ProRes 4444 or DNxHR"
      color: "Full range"
      audio: "PCM, stems separated"
```

### Quality Control
```yaml
qc_checklist:
  visual:
    - [ ] No flash frames or black frames
    - [ ] No visible artifacts
    - [ ] Color consistent throughout
    - [ ] Graphics render correctly
    - [ ] Safe areas respected

  audio:
    - [ ] No audio pops or clicks
    - [ ] Levels within spec
    - [ ] No sync issues
    - [ ] Music fades smooth
    - [ ] Dialogue clear

  technical:
    - [ ] Correct resolution
    - [ ] Correct frame rate
    - [ ] Correct codec
    - [ ] File plays correctly
    - [ ] Duration matches
```

## Integration Points

### Related Skills
- `audio-production` - Audio workflows
- `animation-production` - Motion graphics
- `accessibility-design` - Captions/audio description
- `creative-review` - Review workflows

### Tool Ecosystem
```yaml
editing_tools:
  nle:
    - Adobe Premiere Pro
    - DaVinci Resolve
    - Final Cut Pro
    - Avid Media Composer

  color:
    - DaVinci Resolve
    - Baselight
    - FilmLight

  audio:
    - Adobe Audition
    - Pro Tools
    - Fairlight (Resolve)

  vfx_motion:
    - After Effects
    - Fusion (Resolve)
    - Nuke
```

## Success Metrics

### Video Production KPIs
```yaml
metrics:
  quality:
    - QC pass rate
    - Revision cycles
    - Client satisfaction

  efficiency:
    - Turnaround time
    - On-time delivery
    - Resource utilization

  performance:
    - Video engagement rates
    - Completion rates
    - Platform performance
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | Video Team | Initial skill creation |

---

*Use this skill to deliver professional video content with polished editing, color, and sound that meets platform requirements.*
