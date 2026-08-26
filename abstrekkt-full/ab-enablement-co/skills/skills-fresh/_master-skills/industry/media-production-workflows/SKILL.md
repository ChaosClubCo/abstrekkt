---
name: media-production-workflows
description: Comprehensive guidance for media production workflows including pre-production planning, production scheduling, post-production pipelines, digital asset management, broadcast operations, content delivery, and multi-platform distribution for film, television, streaming, and digital media. Use when navigating industry-specific regulations, processes, or operations.
---

# Media Production Workflows Skill

> Production pipeline management, content creation, post-production, and multi-platform delivery

## Description

This skill provides comprehensive guidance for media production workflows spanning film, television, streaming, commercial, and digital content creation. It covers pre-production planning, production scheduling and logistics, post-production pipelines, digital asset management, broadcast operations, quality control, and multi-platform distribution. The skill supports producers, production managers, post-production supervisors, and media operations professionals in managing efficient, on-budget content creation pipelines.

## Activation Triggers

- User mentions "production workflow", "post-production", "media pipeline"
- User asks about production scheduling or call sheets
- User needs help with editorial workflows or color grading pipelines
- User discusses content delivery or distribution specifications
- User asks about digital asset management or media asset management
- User mentions broadcast standards or technical specifications
- User needs production budgeting or cost tracking guidance
- User asks about VFX pipelines or compositing workflows
- User discusses dailies processing or transcoding
- User mentions multi-platform delivery or adaptive streaming

## Instructions

### Core Workflow

1. **Pre-Production Planning**
   - Break down script and identify production requirements
   - Build production schedule and shooting calendar
   - Establish technical specifications and deliverables
   - Set up digital asset management infrastructure
   - Define post-production pipeline and vendor workflows

2. **Production Execution**
   - Manage daily call sheets and shooting schedules
   - Oversee media capture and data management on set
   - Process dailies and sync audio/video elements
   - Track production progress against schedule and budget
   - Coordinate with post-production for editorial turnover

3. **Post-Production Pipeline**
   - Manage editorial workflow from assembly to final cut
   - Coordinate VFX pulls, reviews, and integration
   - Execute color correction and finishing pipeline
   - Supervise audio post-production and mixing
   - Deliver masters per distributor specifications

4. **Quality Control and Delivery**
   - Perform automated and manual QC passes
   - Generate deliverables per platform specifications
   - Create metadata packages and closed captions
   - Execute archive and long-term storage workflows
   - Track delivery acceptance and version management

5. **Asset Management**
   - Organize and catalog all production media
   - Manage rights, licensing, and usage tracking
   - Maintain version control across all deliverables
   - Execute backup and disaster recovery procedures
   - Support re-use and derivative content workflows

### Production Pipeline Framework

```yaml
production_pipeline:
  pre_production:
    script_breakdown:
      elements:
        - Cast and speaking roles
        - Extras and background
        - Locations (interior/exterior)
        - Props and set dressing
        - Wardrobe and makeup
        - Visual effects shots
        - Special equipment requirements
        - Stunts and special effects

    scheduling:
      tools:
        stripboard: "Scene ordering and day planning"
        one_liner: "Condensed shooting schedule"
        call_sheet: "Daily crew and cast notification"
        dood: "Day out of days (cast availability)"

      considerations:
        - Location availability and permits
        - Cast availability and contracts
        - Weather and seasonal constraints
        - Equipment and crew availability
        - Budget and overtime implications

    technical_planning:
      camera:
        - Shooting format (4K, 6K, 8K, film)
        - Frame rate (23.976, 24, 25, 29.97, 30, 48, 60)
        - Color space (ACES, Rec.709, Rec.2020, DCI-P3)
        - Codec selection (ProRes, DNxHR, ARRIRAW, R3D)
        - Aspect ratio (1.78:1, 1.85:1, 2.00:1, 2.39:1)

      audio:
        - Sample rate (48kHz standard, 96kHz high-res)
        - Bit depth (24-bit minimum)
        - Channel configuration
        - Timecode synchronization
        - Backup recording strategy

  production:
    data_management:
      on_set_workflow:
        - Camera media offload (dual backup minimum)
        - Checksum verification (MD5/XXHash)
        - LTO tape backup creation
        - Cloud upload for remote access
        - Media log and shot report generation

      naming_conventions:
        structure: "[Show]_[Season]_[Episode]_[Scene]_[Take]_[Camera]"
        example: "PROJ_S01_E03_SC24_TK02_ACAM"

      daily_deliverables:
        - Camera reports and metadata
        - Sound reports and wild track logs
        - Continuity notes and script supervisor logs
        - VFX data (LIDAR, HDRIs, witness cameras)
        - Production stills and BTS footage

    dailies_processing:
      pipeline:
        - Ingest and verify all camera media
        - Sync audio to video (timecode/slate)
        - Apply show LUT or CDL per DP specification
        - Generate editorial proxy media (DNxHD 36, ProRes Proxy)
        - Distribute to editorial, director, producers
        - Upload to dailies review platform (PIX, Frame.io, DAX)

  post_production:
    editorial:
      phases:
        assembly: "String-out of all selected takes"
        rough_cut: "First structured edit with temp music/VFX"
        fine_cut: "Refined edit with timing and pacing locked"
        picture_lock: "Final approved edit, no further changes"
        online: "Conform from proxy to full-resolution media"

      deliverables:
        - EDL (Edit Decision List) per format
        - AAF/OMF for audio post-production
        - VFX pull lists with handles
        - Conform timeline for finishing

    visual_effects:
      pipeline:
        - VFX editorial pulls with frame handles
        - Plate preparation and element organization
        - Shot creation (modeling, animation, simulation)
        - Compositing and integration
        - Review and approval cycles (internal, client)
        - Final delivery at master resolution and color space

      tracking:
        - Shot count and complexity tiers
        - Artist assignments and workload
        - Review notes and version history
        - Deadline tracking per delivery schedule

    color_and_finishing:
      pipeline:
        - Conform editorial timeline to original camera media
        - Primary color correction (shot matching, exposure)
        - Secondary grading (power windows, qualifiers)
        - Look development per creative direction
        - HDR and SDR pass creation
        - Title and graphic integration
        - Final render and master creation

    audio_post:
      pipeline:
        - Dialogue editing and ADR
        - Sound effects design and Foley
        - Music composition, licensing, and integration
        - Premix and predub sessions
        - Final mix (theatrical, broadcast, streaming)
        - Printmaster and stems delivery

      deliverables:
        stems:
          - Dialogue stem (Lt/Rt or 5.1/7.1)
          - Music stem
          - Effects stem
          - Mix minus narration
        formats:
          theatrical: "Dolby Atmos / 7.1.4"
          broadcast: "5.1 surround + stereo Lt/Rt"
          streaming: "5.1 + stereo + Atmos (where supported)"
```

### Distribution and Delivery Framework

```yaml
distribution:
  platform_specifications:
    theatrical:
      format: "DCP (Digital Cinema Package)"
      resolution: "2K (2048x1080) or 4K (4096x2160)"
      color: "DCI-P3, 12-bit XYZ"
      audio: "Dolby Atmos / 7.1 / 5.1"
      frame_rate: "24fps"
      encryption: "KDM-based access control"

    broadcast:
      format: "AS-11, MXF Op1a"
      resolution: "1920x1080 (HD) or 3840x2160 (UHD)"
      codec: "AVC-Intra 100, DNxHD 185, XDCAM HD422"
      audio: "PCM, 48kHz/24-bit, channel mapping per spec"
      loudness: "ATSC A/85 (-24 LKFS) or EBU R128 (-23 LUFS)"
      closed_captions: "CEA-608/708 embedded or sidecar"

    streaming_svod:
      format: "IMF (Interoperable Master Format) or mezzanine file"
      resolution: "3840x2160 (UHD) preferred, 1920x1080 minimum"
      codec: "ProRes 4444, DNxHR 444, TIFF sequence"
      hdr: "Dolby Vision, HDR10, HDR10+"
      audio: "Dolby Atmos, 5.1, stereo"
      metadata: "EIDR, content ID, episode metadata"

    digital_distribution:
      itunes:
        video: "ProRes 4444 or 422HQ, HDR where applicable"
        audio: "Dolby Atmos ADM BWF + 5.1 + stereo"
        subtitles: "iTT format"
      youtube:
        video: "H.264 or H.265, up to 8K"
        audio: "AAC stereo or 5.1"
        captions: "SRT or SBV"

  quality_control:
    automated_qc:
      tools: "Baton, Cerify, Aurora, Vidchecker"
      checks:
        - File wrapper and codec validation
        - Resolution and aspect ratio verification
        - Frame rate and duration check
        - Audio channel mapping and levels
        - Loudness measurement (LKFS/LUFS)
        - Black and silence detection
        - Gamut and luma range verification
        - Closed caption timing and accuracy

    manual_qc:
      visual:
        - Dropout and corruption artifacts
        - Color consistency and grading accuracy
        - Title safety and action safe compliance
        - Subtitle readability and timing
        - Seamless branching verification
      audio:
        - Dialogue clarity and sync
        - Music and effects balance
        - Channel assignment verification
        - Click, pop, and distortion detection
        - Descriptive audio track validation
```

### Templates

#### Production Schedule Template
```markdown
# Production Schedule: [Project Title]

## Project Overview
- Format: [Feature / Series / Commercial / Documentary]
- Duration: [Runtime]
- Shooting Format: [Camera/Resolution/Codec]
- Delivery Date: [Date]

## Pre-Production: [Start Date] - [End Date]
| Week | Activity | Deliverable | Owner |
|------|----------|-------------|-------|
| Wk 1-2 | Script breakdown | Breakdown sheets | AD |
| Wk 2-3 | Casting | Cast list | Casting Director |
| Wk 3-4 | Location scouting | Location book | Locations Mgr |
| Wk 4-5 | Scheduling | Stripboard, DOOD | 1st AD |
| Wk 5-6 | Tech prep | Camera/sound tests | DP / Sound |

## Production: [Start Date] - [End Date]
| Shoot Day | Date | Scenes | Location | Cast | Pages |
|-----------|------|--------|----------|------|-------|
| Day 1 | [Date] | [Sc#] | [Location] | [Cast#] | [Pages] |

## Post-Production: [Start Date] - [End Date]
| Phase | Start | End | Duration | Owner |
|-------|-------|-----|----------|-------|
| Assembly | [Date] | [Date] | [Weeks] | Editor |
| Rough Cut | [Date] | [Date] | [Weeks] | Editor |
| VFX | [Date] | [Date] | [Weeks] | VFX Sup |
| Color | [Date] | [Date] | [Weeks] | Colorist |
| Sound Mix | [Date] | [Date] | [Weeks] | Mixer |
| QC & Delivery | [Date] | [Date] | [Weeks] | Post Sup |
```

#### Deliverables Specification Template
```markdown
# Deliverables Specification: [Project Title]

## Master Deliverables
| Element | Format | Resolution | Color Space | Audio |
|---------|--------|------------|-------------|-------|
| Theatrical Master | DCP 4K | 4096x[height] | DCI-P3 | Atmos |
| Broadcast Master | MXF Op1a | 1920x1080 | Rec.709 | 5.1+2.0 |
| Streaming Master | IMF | 3840x2160 | Rec.2020 PQ | Atmos |
| Archive Master | [Format] | [Res] | [Space] | [Config] |

## Supplemental Elements
- [ ] Textless backgrounds (main/end titles)
- [ ] Closed captions (English, [Languages])
- [ ] Subtitles ([Languages])
- [ ] Descriptive audio track
- [ ] Trailer/promo masters
- [ ] Key art and publicity stills
- [ ] EPK (Electronic Press Kit)
- [ ] Music cue sheet
- [ ] Credits list
```

### Best Practices

1. **3-2-1 Backup Rule**: Maintain 3 copies on 2 different media types with 1 offsite for all production media
2. **Checksum Everything**: Verify data integrity at every transfer point using MD5 or XXHash
3. **Lock Before Finishing**: Never begin color, VFX, or sound mix until editorial picture lock is confirmed
4. **Standardize Naming**: Enforce consistent file naming conventions from day one of production
5. **Dailies Same Day**: Process and distribute dailies within 24 hours of wrap
6. **Version Control**: Maintain clear version numbering for all cuts, VFX shots, and deliverables
7. **Spec Compliance**: Obtain distributor delivery specifications before beginning post-production
8. **Reference Monitors**: Calibrate all critical viewing monitors to target color space standards
9. **Audio Loudness**: Measure loudness compliance (LKFS/LUFS) before every delivery
10. **Archival Strategy**: Create LTO tape archives at picture lock and after final delivery
11. **Metadata from Source**: Capture and preserve metadata from camera originals through the entire pipeline
12. **Communication Cadence**: Hold daily production standups and weekly post-production status meetings

### Common Patterns

#### Pattern 1: Episodic Series Post-Production Pipeline
```
Scenario: 10-episode streaming series, 8K capture, HDR delivery required.

Pipeline:
1. On-set DIT creates dual offloads to shuttle drives, verifies checksums
2. Near-set lab generates editorial proxies (ProRes Proxy 1920x1080)
   with show LUT applied, synced audio
3. Proxies uploaded to Frame.io for remote dailies review within 12 hours
4. Editorial works in proxy, delivering rough cut per episode on 3-week cycle
5. VFX editorial pulls plates at full 8K with 16-frame handles
6. Color pipeline: ACES 2065-1 working space, output transforms for
   Rec.2020 PQ (HDR) and Rec.709 (SDR)
7. Audio post receives AAF from locked timeline, 4-week mix schedule
8. Final deliverables: IMF package (HDR10 + SDR) per streamer spec
9. QC via Baton automated + 2-pass manual review
10. Archive: LTO-9 tape set, cloud archive to AWS Glacier
```

#### Pattern 2: Commercial Production Fast Turnaround
```
Scenario: 30-second broadcast commercial, 4-day production, 2-week post.

Pipeline:
1. Day 1: Shoot on ARRI Alexa 35, ARRIRAW 4.6K, 23.976fps
2. Day 1 evening: DIT offloads, creates ProRes 4444 transcodes
3. Day 2: Editor receives media, begins assembly from selects
4. Day 3-5: Offline edit in Avid/Premiere, 3 client review rounds
5. Day 6: Picture lock, VFX brief for 4 CGI shots
6. Day 7-9: VFX creation and client review via cineSync
7. Day 10: Color grade at finishing house, DaVinci Resolve
8. Day 11: Audio mix (VO record, music sync, SFX)
9. Day 12: Online conform, final QC, tag versions
10. Day 13: Deliver broadcast masters (HD XDCAM), digital (H.264),
    social cuts (16:9, 9:16, 1:1)
```

### Output Formats

#### Media Technical Specification Sheet
```markdown
# Technical Specifications: [Project Title]

## Capture Format
- Camera: [Camera Model]
- Resolution: [Width x Height]
- Codec: [Codec Name and Profile]
- Frame Rate: [fps]
- Color Space: [Camera Native]
- Bit Depth: [10/12/16-bit]
- Aspect Ratio: [Ratio]

## Post-Production
- Editorial System: [Avid/Premiere/Resolve]
- Proxy Format: [Codec, Resolution]
- Working Color Space: [ACES/Rec.709/Log]
- VFX Color Space: [ACES AP0/Linear EXR]
- Finishing Resolution: [Width x Height]

## Delivery Masters
| Deliverable | Wrapper | Codec | Resolution | Audio | Loudness |
|------------|---------|-------|------------|-------|----------|
| [Name] | [MXF/MOV/DCP] | [Codec] | [Res] | [Channels] | [LKFS] |
```

## Integration Points

- Non-linear editing systems (Avid Media Composer, Premiere Pro, DaVinci Resolve)
- Digital asset management (Iconik, CatDV, Reach Engine)
- Review and approval platforms (Frame.io, PIX, cineSync, ShotGrid)
- VFX pipeline tools (ShotGrid, ftrack, NIM)
- Scheduling software (Movie Magic, StudioBinder, Yamdu)
- Budgeting tools (Movie Magic Budgeting, Hot Budget)
- Broadcast automation (Grass Valley, Imagine Communications)
- MAM/PAM systems (Dalet, Avid MediaCentral, Tedial)
- Cloud infrastructure (AWS Media Services, Azure Media, GCP Transcoder)

## Version History

- 1.0.0: Initial media production workflows skill
- 1.0.1: Added streaming platform delivery specifications
- 1.0.2: Enhanced VFX pipeline and ACES color management guidance
