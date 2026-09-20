---
name: ar-vr-content
description: Helps configure and build ar vr content processes. Master immersive content creation with augmented reality experiences, virtual reality environments, and 3D asset production for extended reality platforms. Use when configuring, building, or troubleshooting AI agent workflows.
---

# AR/VR Content Skill

## Instructions


> Master immersive content creation with augmented reality experiences, virtual reality environments, and 3D asset production for extended reality platforms.

## Skill Overview

This skill provides expertise in creating content for augmented reality (AR) and virtual reality (VR) platforms. It covers 3D asset creation, experience design, platform requirements, and performance optimization.

## Core Capabilities

### AR Content
- Face filters and effects
- World tracking experiences
- Image/object recognition
- Product visualization
- Web AR experiences
- Platform-specific content

### VR Content
- 360 video production
- Virtual environments
- Interactive experiences
- Spatial audio
- Comfort considerations
- Cross-platform delivery

### 3D Assets
- 3D modeling
- Texturing and materials
- Rigging and animation
- Format optimization
- Real-time rendering
- LOD systems

## AR Content Creation

### AR Experience Types
```yaml
ar_experiences:
  face_effects:
    description: "Filters applied to user's face"
    applications:
      - Social media filters
      - Virtual try-on (makeup, accessories)
      - Character masks
      - Face distortions
    platforms:
      - Instagram/Facebook (Spark AR)
      - Snapchat (Lens Studio)
      - TikTok (Effect House)

  world_tracking:
    description: "Content placed in physical environment"
    applications:
      - Product visualization
      - Virtual showrooms
      - Interactive installations
      - Navigation overlays
    platforms:
      - ARKit (iOS)
      - ARCore (Android)
      - WebXR

  image_tracking:
    description: "Content triggered by image recognition"
    applications:
      - Product packaging activation
      - Print-to-digital experiences
      - Business cards
      - Art installations
    platforms:
      - All major AR platforms
      - Web AR (8th Wall, Mind AR)

  object_tracking:
    description: "Track and augment 3D objects"
    applications:
      - Product manuals
      - Training applications
      - Interactive toys
    platforms:
      - ARKit/ARCore
      - Vuforia
```

### AR Platform Requirements
```yaml
platform_specifications:
  spark_ar:
    platform: "Instagram, Facebook"
    file_limits:
      instagram: "4MB compressed"
      facebook: "40MB compressed"
    texture_formats: "PNG, JPG"
    model_formats: "FBX, glTF"
    features:
      - Face tracking
      - Hand tracking
      - Body tracking
      - World effects
      - Target tracking

  lens_studio:
    platform: "Snapchat"
    file_limits: "8MB compressed"
    texture_formats: "PNG, JPG"
    model_formats: "FBX, OBJ, glTF"
    features:
      - Face Lens
      - World Lens
      - Landmarkers
      - Connected Lens

  effect_house:
    platform: "TikTok"
    file_limits: "5MB"
    texture_formats: "PNG, JPG"
    model_formats: "FBX, glTF"
    features:
      - Face effects
      - Body tracking
      - Hand gestures
      - Background segmentation

  web_ar:
    platforms: "8th Wall, Mind AR, A-Frame"
    access: "Browser-based, no app required"
    features:
      - SLAM (Simultaneous Localization and Mapping)
      - Image tracking
      - Face tracking
      - World effects
```

### AR Asset Optimization
```yaml
ar_optimization:
  3d_models:
    polygon_count:
      face_effects: "5,000-15,000 triangles"
      world_objects: "10,000-50,000 triangles"
      hero_objects: "Up to 100,000 triangles"
    best_practices:
      - Use LOD (Level of Detail)
      - Optimize mesh topology
      - Remove hidden faces
      - Combine objects when possible

  textures:
    size_limits:
      max_dimension: "1024x1024 or 2048x2048"
      atlas: "Combine multiple textures"
    compression:
      - Use platform-specific compression
      - PNG for transparency
      - JPEG for photos

  animation:
    frame_rate: "30fps typically sufficient"
    bone_count: "Under 50 for face tracking"
    keyframe_reduction: "Remove redundant keyframes"

  performance:
    target_fps: "60fps for smooth experience"
    memory: "Stay within platform limits"
    battery: "Minimize heavy processing"
```

## VR Content Creation

### VR Experience Types
```yaml
vr_content:
  360_video:
    description: "Spherical video content"
    types:
      - Monoscopic (2D 360)
      - Stereoscopic (3D 360)
    applications:
      - Virtual tours
      - Documentary
      - Brand experiences
      - Training
    resolution: "4K-8K minimum"

  virtual_environments:
    description: "Real-time 3D spaces"
    types:
      - Static environments
      - Interactive environments
      - Social spaces
    applications:
      - Showrooms
      - Games
      - Training simulations
      - Virtual events

  interactive_experiences:
    description: "User-controlled VR"
    elements:
      - Hand/controller interaction
      - Gaze-based selection
      - Locomotion systems
      - Object manipulation
```

### VR Production Pipeline
```yaml
vr_workflow:
  360_video:
    capture:
      camera: "360 camera rig (Insta360, GoPro, RED)"
      resolution: "Minimum 5.7K, prefer 8K"
      frame_rate: "30-60fps"
      audio: "Spatial audio capture"

    post_production:
      stitching: "Mistika VR, Autopano, camera software"
      editing: "Premiere Pro, Final Cut (360 mode)"
      color: "DaVinci Resolve"
      audio: "Facebook 360 Spatial Workstation"

    export:
      format: "H.264 or H.265"
      resolution: "4K-8K equirectangular"
      metadata: "Inject 360 metadata"

  realtime_vr:
    development:
      engine: "Unity or Unreal Engine"
      sdk: "Oculus SDK, SteamVR, OpenXR"

    assets:
      modeling: "Maya, Blender, Cinema 4D"
      texturing: "Substance Painter/Designer"
      optimization: "LOD, occlusion culling"

    testing:
      comfort: "Motion sickness evaluation"
      performance: "90fps target"
      interaction: "User testing"
```

### VR Comfort Guidelines
```yaml
vr_comfort:
  motion_sickness_prevention:
    avoid:
      - Camera movement not initiated by user
      - Acceleration/deceleration
      - Rotation not matching head movement
      - Low frame rates (<90fps)

    techniques:
      - Teleportation locomotion
      - Vignette during movement
      - Fixed reference points
      - Snap turning

  ergonomics:
    field_of_view: "Keep important content in center 90 degrees"
    text_distance: "1-2 meters for readability"
    interaction_zone: "Comfortable arm reach"
    session_length: "15-30 minute sessions recommended"

  accessibility:
    - Seated experience option
    - One-handed mode
    - Subtitle support
    - Color blind considerations
```

## 3D Asset Creation

### 3D Workflow
```yaml
3d_pipeline:
  modeling:
    high_poly:
      tool: "ZBrush, Maya, Blender"
      purpose: "Detail sculpting"

    low_poly:
      tool: "Maya, Blender, 3ds Max"
      purpose: "Game-ready mesh"
      optimization: "Retopology"

  uv_mapping:
    tool: "Maya, Blender, RizomUV"
    guidelines:
      - Minimize seams
      - Maximize UV space usage
      - Consistent texel density

  texturing:
    pbr_workflow:
      tools: "Substance Painter, Mari"
      maps:
        - Base color/Albedo
        - Normal map
        - Roughness
        - Metallic
        - Ambient occlusion
        - Emissive (if needed)

  baking:
    purpose: "Transfer high-poly detail to low-poly"
    maps:
      - Normal map
      - AO map
      - Curvature
      - Position

  export:
    formats:
      glTF: "Web, cross-platform (preferred)"
      FBX: "Universal exchange"
      USDZ: "Apple AR"
      OBJ: "Legacy support"
```

### Real-Time 3D Optimization
```yaml
realtime_optimization:
  polygon_budget:
    mobile_ar: "50,000-200,000 total scene"
    mobile_vr: "200,000-500,000 total scene"
    desktop_vr: "1M+ triangles possible"
    web_ar: "Under 100,000 recommended"

  texture_optimization:
    compression:
      - ASTC (mobile)
      - DXT/BC (desktop)
      - ETC2 (Android)
      - PVRTC (iOS legacy)

    resolution:
      hero_objects: "2048x2048"
      secondary: "1024x1024"
      distant: "512x512"

  lod_system:
    lod_0: "Full detail (close)"
    lod_1: "50% triangles"
    lod_2: "25% triangles"
    lod_3: "Billboard or simple shape"

  draw_call_optimization:
    - Texture atlasing
    - Material batching
    - Instance rendering
    - Occlusion culling
```

## Platform Distribution

### AR Publishing
```yaml
ar_distribution:
  social_platforms:
    instagram:
      approval: "Meta Spark Hub review"
      timeline: "1-5 business days"
      requirements:
        - Community guidelines compliant
        - Technical requirements met

    snapchat:
      approval: "Lens Studio review"
      timeline: "1-3 business days"
      requirements:
        - Community guidelines
        - Performance standards

    tiktok:
      approval: "Effect House review"
      timeline: "1-5 business days"

  web_ar:
    deployment: "Host on web server"
    access: "URL or QR code"
    requirements:
      - HTTPS required
      - Mobile-optimized
```

### VR Distribution
```yaml
vr_distribution:
  platforms:
    meta_quest:
      store: "Meta Quest Store"
      requirements:
        - 72-90fps
        - VRC (Virtual Reality Check)
        - Content guidelines

    steamvr:
      store: "Steam"
      requirements:
        - 90fps
        - Steamworks integration

    youtube_360:
      upload: "Standard YouTube upload"
      requirements:
        - 360 metadata
        - Equirectangular format
```

## Integration Points

### Related Skills
- `video-editing` - 360 video post-production
- `animation-production` - 3D animation
- `brand-compliance` - Brand in immersive
- `accessibility-design` - XR accessibility

### Tool Ecosystem
```yaml
tools:
  ar_platforms:
    - Spark AR
    - Lens Studio
    - Effect House
    - 8th Wall

  game_engines:
    - Unity
    - Unreal Engine

  3d_software:
    - Maya
    - Blender
    - Cinema 4D
    - ZBrush

  360_production:
    - Mistika VR
    - Premiere Pro 360
    - After Effects 360
```

## Success Metrics

### XR Content KPIs
```yaml
metrics:
  engagement:
    - View/play count
    - Average session time
    - Completion rate
    - Shares/saves

  quality:
    - Frame rate stability
    - User ratings
    - Comfort feedback

  performance:
    - Load time
    - Memory usage
    - Battery impact
```

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | XR Team | Initial skill creation |

---

*Use this skill to create immersive AR and VR experiences that engage users with innovative spatial content.*
