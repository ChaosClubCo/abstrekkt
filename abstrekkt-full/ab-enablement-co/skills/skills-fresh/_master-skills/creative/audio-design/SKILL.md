---
name: audio-design
description: Sound design and audio branding for products and media. Creates soundscapes, UI audio, sonic logos, audio UX systems, and immersive audio environments for digital products, brands, and multimedia experiences. Use when designing, creating, or reviewing creative deliverables.
---

# Audio Design

> Shaping experience through what people hear.

## Description

Audio design is the discipline of creating purposeful sound for products, brands, and media experiences. It spans the full spectrum from functional UI sounds that provide interaction feedback to immersive soundscapes that define the emotional atmosphere of environments and narratives. This skill covers sonic branding (audio logos, brand mnemonics, sound palettes), product audio UX (notification sounds, interaction feedback, system alerts), environmental sound design (spatial audio, ambient design, acoustic storytelling), and the systematic creation of audio design languages that ensure consistency across touchpoints. Effective audio design operates at the intersection of psychoacoustics, emotional design, and technical implementation, creating sounds that inform, orient, delight, and reinforce brand identity without contributing to auditory fatigue or environmental noise pollution.

## Activation Triggers

- "Design the sound palette for this product"
- "Create a sonic logo for the brand"
- "Develop UI sounds for the app interactions"
- "Build the soundscape for this environment"
- "Design notification and alert sounds"
- "Create an audio branding system"
- "Plan the audio UX for this digital product"
- "Design sound effects for the interface"
- "Develop an audio design language for the platform"
- "Create ambient audio for this experience"
- "Design the audio feedback system for user interactions"

## Instructions

### Core Workflow

**Step 1: Audio Context Analysis**
- Identify all touchpoints where sound will be present in the product or experience
- Map the user's audio environment: where will they hear these sounds (office, commute, home)
- Catalog existing audio in the competitive landscape and identify sonic differentiation
- Determine technical constraints: playback devices, codec limitations, latency requirements
- Define the emotional palette the audio must convey: the feelings sounds should evoke

**Step 2: Sonic Identity Definition**
- Establish the brand's sonic attributes: 3-5 descriptive characteristics (warm, precise, organic)
- Define the tonal range: fundamental frequency, harmonic content, and timbre direction
- Select the instrument family or synthesis method that embodies the brand character
- Create a reference playlist of existing audio that represents the desired sonic territory
- Develop a sonic moodboard with annotated audio references explaining relevance

**Step 3: Sound Design and Production**
- Design the sonic logo or mnemonic as the cornerstone of the audio identity
- Build the UI sound palette: interaction feedback, state changes, notifications, alerts
- Create environmental soundscapes if applicable: ambient loops, spatial audio elements
- Ensure every sound has a clear functional purpose tied to a user action or system state
- Layer sounds with intentional frequency separation to prevent masking and muddiness

**Step 4: System Integration and Testing**
- Test all sounds on target playback hardware at realistic volume levels
- Verify that sounds are distinguishable from each other and from environmental noise
- Evaluate repetition tolerance: sounds that play frequently must be the least intrusive
- Test sound combinations that may play simultaneously and resolve conflicts
- Validate accessibility: ensure audio cues have visual or haptic counterparts

**Step 5: Documentation and Delivery**
- Create an audio design system document specifying every sound and its usage rules
- Deliver assets in required formats with metadata: filename, trigger, duration, format
- Document the sonic identity guidelines for future sound design consistency
- Provide implementation specifications: volume levels, ducking behavior, priority tiers
- Establish governance for adding new sounds to the system over time

### Sonic Branding Framework

A sonic brand is the auditory equivalent of a visual identity. It must be as carefully designed, consistently applied, and strategically managed as the logo, color palette, and typography.

**The Sonic Brand Architecture:**
- Sonic Logo: A 1-3 second audio signature used at the start or end of brand communications (like Intel's five-note mnemonic or Netflix's "ta-dum")
- Brand Sound Palette: A collection of tonal qualities, textures, and rhythmic patterns that define the brand's sonic character
- Functional Sounds: UI interactions, notifications, and system feedback that carry the brand's sonic DNA into daily product use
- Ambient Identity: Background audio or environmental soundscapes for branded spaces, retail, events, or digital environments
- Musical Direction: Guidelines for music selection, composition style, and licensing that align with the brand voice

**Sonic Logo Design Principles:**
- Keep it between 0.5 and 3 seconds for memorability and practical application
- Design for recognition after three exposures; test recall with unfamiliar listeners
- Ensure it works in isolation and as a tag appended to other audio content
- Make it format-agnostic: it should be recognizable on a phone speaker and in a theater
- Build in flexibility: create variations for different contexts (full, short, subtle)

**Sound Palette Construction:**
- Define a root key or tonal center that anchors all brand sounds
- Establish a harmonic language: major, minor, modal, atonal, or a specific interval set
- Select 2-3 primary timbres (instruments, synthesis types) that recur across touchpoints
- Define rhythmic characteristics: tempo range, groove feel, percussive or sustained
- Create a texture vocabulary: the quality of sonic surfaces (smooth, granular, metallic, organic)

**Brand Audio Governance:**
- Every new sound must be reviewed against the sonic identity guidelines before deployment
- Seasonal or campaign variations must maintain the core sonic DNA
- Partner and co-branded contexts require clear audio hierarchy rules
- Maintain a centralized asset library with usage examples and context specifications
- Conduct an annual sonic brand audit to ensure consistency and relevance

### Audio UX Design Framework

Audio UX is the practice of using sound to enhance usability, provide feedback, and create emotional resonance in digital product interactions.

**The Audio Feedback Hierarchy:**
- Critical alerts: Sounds that demand immediate attention (errors, security alerts, alarms). Use dissonant intervals, higher pitch, and rhythmic urgency. These must cut through ambient noise.
- Notifications: Sounds that inform without demanding (new messages, updates, reminders). Use consonant intervals, moderate pitch, and gentle attack. Pleasant enough for repeated exposure.
- Confirmations: Sounds that acknowledge completed actions (sent, saved, purchased). Use resolved intervals, satisfying timbres, and brief duration. Create a micro-moment of positive reinforcement.
- Navigation feedback: Sounds that orient the user in the interface (button press, scroll boundary, mode change). Use subtle, near-subliminal tones. The user should feel rather than consciously notice these.

**Design for Repetition Tolerance:**
- The most frequently heard sounds must be the shortest and most subtle
- Avoid melodic complexity in high-frequency sounds; simple tones endure
- Use organic, slightly varied timbres over perfectly static synthetic tones
- Test every sound by playing it 50 times in sequence; if it annoys, simplify
- Provide user control: allow muting or volume adjustment for non-critical sounds

**Spatial and Contextual Audio:**
- Use stereo positioning to create spatial awareness in the interface
- Design audio that adapts to context: quieter at night, more prominent in noisy environments
- Layer ambient audio with interactive sounds using frequency separation
- Implement dynamic mixing: duck background audio when interactive sounds play
- Consider haptic pairing: combine subtle audio with vibration for richer feedback

**Accessibility in Audio Design:**
- Never rely on audio as the sole feedback mechanism; always pair with visual or haptic cues
- Design distinct sounds for distinct events: avoid reusing the same tone for different meanings
- Ensure critical sounds are audible to users with partial hearing loss (avoid ultra-high frequencies)
- Provide captions or visual indicators for all meaningful audio content
- Test with hearing-assistive devices to verify compatibility

**Audio Performance Specifications:**
- Target file sizes under 50KB for UI sounds to minimize load impact
- Use appropriate formats: WAV for high-fidelity, OGG/AAC for compressed delivery
- Design sounds with clean attack transients for responsive-feeling playback
- Specify maximum latency tolerance: UI feedback should play within 50ms of the trigger
- Implement preloading for critical sounds to eliminate first-play delay

### Templates

**Template 1: Audio Design System Specification**

```
PRODUCT: [Name]                    VERSION: [#]
SONIC IDENTITY: [Brief description of overall sonic character]

ROOT KEY: [Key/frequency]          TEMPO RANGE: [BPM range]
PRIMARY TIMBRES: [List]            HARMONIC LANGUAGE: [Description]

SOUND INVENTORY:

| ID     | Name           | Trigger              | Duration | Priority | Volume | Format |
|--------|----------------|----------------------|----------|----------|--------|--------|
| SND-01 | Sonic logo     | App launch           | 2.1s     | High     | -6dB   | WAV    |
| SND-02 | Button press   | Primary CTA tap      | 0.15s    | Low      | -18dB  | OGG    |
| SND-03 | Success chime  | Action completed     | 0.8s     | Medium   | -12dB  | OGG    |
| SND-04 | Error alert    | Validation failure   | 0.5s     | High     | -8dB   | WAV    |
| SND-05 | Notification   | New message received | 1.2s     | Medium   | -10dB  | OGG    |
| SND-06 | Navigate       | Screen transition    | 0.2s     | Low      | -20dB  | OGG    |

MIXING RULES:
- Maximum simultaneous sounds: [#]
- Priority ducking: [High sounds duck Medium by -6dB, Low by -12dB]
- Repeat throttle: [Minimum interval between same-sound triggers: 200ms]

VOLUME CONTEXTS:
- Default: [Relative levels]
- Do Not Disturb: [Only critical alerts at -6dB reduction]
- Night mode: [All sounds reduced by -12dB, navigation sounds muted]
```

**Template 2: Sonic Brand Guidelines**

```
BRAND: [Name]
SONIC IDENTITY STATEMENT:
[2-3 sentences describing what the brand sounds like and why]

SONIC ATTRIBUTES:
1. [Attribute]: [Description of how this manifests in sound]
2. [Attribute]: [Description of how this manifests in sound]
3. [Attribute]: [Description of how this manifests in sound]

SONIC LOGO:
- Full version: [Duration, usage context]
- Short version: [Duration, usage context]
- Subtle version: [Duration, usage context]
- Usage rules: [When to use, when not to, minimum clear space equivalent]

DO: [3-5 examples of sounds that align with the brand]
DON'T: [3-5 examples of sounds that contradict the brand]

MUSIC DIRECTION:
- Genres: [Aligned genres and sub-genres]
- Tempo: [Range and preferred feel]
- Instrumentation: [Preferred and avoided]
- Mood: [Emotional range]
- Licensing: [Guidelines for music selection and clearance]
```

**Template 3: Sound Design Brief**

```
PROJECT: [Name]                   DATE: [Date]
CONTEXT: [Product/Campaign/Environment]

OBJECTIVE:
[What should this sound achieve? 2-3 sentences]

TRIGGER:
[What user action or system event plays this sound?]

FREQUENCY:
[How often will this sound be heard? Once, rarely, frequently, constantly]

ENVIRONMENT:
[Where will users hear this? Quiet room, commute, public space, headphones]

EMOTIONAL TARGET:
[What should the listener feel? Be specific]

TECHNICAL REQUIREMENTS:
- Duration: [Max length]
- Format: [File type and sample rate]
- Latency: [Maximum acceptable delay]
- File size: [Maximum]

REFERENCES:
[Links to reference sounds with notes on what to draw from each]

CONSTRAINTS:
[What to avoid: similarity to competitor sounds, cultural sensitivities, etc.]
```

### Best Practices

- Design the most frequently heard sounds first; they define the sonic experience more than any hero moment
- Test every sound in its real-world context, not in a quiet studio with studio monitors
- Use organic, slightly imperfect timbres for warmth; perfectly synthetic sounds feel clinical
- Keep UI sounds under 300 milliseconds unless the interaction warrants a longer resolution
- Design sound families with shared timbral DNA so the system feels cohesive
- Never use sound to punish: error sounds should be informative, not jarring or guilt-inducing
- Build in silence as a design element; not every interaction needs audio feedback
- Ensure the sonic logo works in mono, at low bitrate, and through a phone speaker
- Create a "sound of nothing" ambient baseline for environments rather than actual silence
- Layer no more than three simultaneous sounds; beyond that, the ear loses clarity
- Version all audio assets with clear naming conventions tied to their trigger events
- Test with real users to calibrate the line between "helpful feedback" and "annoying noise"
- Design for graceful degradation: if audio fails or is muted, the experience must still function
- Consider cultural sound associations: meanings of tones, intervals, and timbres vary globally
- Revisit and refresh the sound palette periodically; audio trends and listener expectations evolve

### Common Patterns

**Pattern 1: Mobile App Audio System**

A fintech mobile application needs a complete audio system covering 12 interaction types. The sonic identity is defined as "precise, trustworthy, and quietly confident," anchored in a root key of D major with clean sine-based timbres layered with subtle wooden mallet textures. The most frequent sound, button press feedback, is a 120ms tone at -20dB using a soft attack sine wave with a gentle high-frequency click transient. The notification sound is a two-note ascending interval (root to major third, 1.0 second) with a warm pad tail. The error sound uses a minor second interval with a slightly detuned quality, just enough tension to signal attention without causing anxiety. The success sound for completed transactions is a three-note ascending arpeggio (root, third, fifth) with a resonant sustain that resolves satisfyingly. All sounds share the same synthesis engine and timbral family, creating a unified sonic experience. The system includes ducking rules, a night-mode volume profile, and integration with device haptics for combined tactile-audio feedback.

**Pattern 2: Sonic Brand Development for Retail**

A premium retail brand creates a comprehensive sonic identity to unify their physical stores, mobile app, website, advertising, and customer service hold music. The process begins with translating the brand's visual identity attributes (minimal, luxurious, contemporary) into sonic equivalents: sparse arrangements, rich harmonic content, and modern production aesthetics. The sonic logo is a 2.2-second sequence built on a grand piano chord with an electronic shimmer tail, designed to feel handcrafted yet modern. The in-store soundscape uses generative ambient music that shifts with time of day: brighter and more energetic in the morning, warmer and slower in the evening. The app uses micro-sounds derived from the sonic logo's harmonic content, ensuring every tap and swipe carries brand DNA. Hold music uses the brand's musical direction guidelines: instrumental pieces in the approved key family and tempo range, avoiding vocals and recognizable melodies that might distract or date the brand.

**Pattern 3: Interactive Experience Sound Design**

A museum exhibition on ocean ecosystems requires spatial audio design for a 15-minute walkthrough experience. The design begins with field recordings: actual underwater soundscapes, whale songs, tidal patterns, and reef ecosystems. These raw recordings are processed and layered into a spatial audio environment that tracks visitor position through the exhibition space. The shallow reef zone uses high-frequency detail sounds (snapping shrimp, parrotfish grazing, wave action) positioned at ear level and above. The deep ocean zone shifts to low-frequency content (whale communication, tectonic rumble, deep current) with long reverb tails creating a sense of vast space. Interactive stations trigger educational sound events that duck the ambient layer by 8dB to maintain clarity. The transition between zones uses gradual crossfades over 12 seconds of walking distance to prevent jarring audio boundaries. Each zone's sound design is documented with a spatial map showing speaker placement, audio zones, trigger points, and volume contours across the physical space.

### Output Formats

**Format 1: Audio Design System Package**
A complete deliverable containing all audio assets (organized by category with consistent naming), the audio design system specification document (trigger map, volume levels, mixing rules, priority tiers), sonic brand guidelines, and implementation notes for developers. Includes both source files (high-resolution WAV) and deployment files (compressed OGG/AAC at target bitrates).

**Format 2: Sonic Brand Identity Guide**
A strategic document defining the brand's sonic identity: attributes, sonic logo variations and usage rules, sound palette descriptions, musical direction guidelines, and governance protocols. Includes embedded audio references, competitive analysis, and a rationale connecting every sonic decision to the brand strategy. Designed for creative teams, agencies, and partners who will create audio content for the brand.

**Format 3: Audio UX Specification**
A technical document for development teams specifying every sound in the product: trigger events, file references, volume levels, playback priority, simultaneous sound rules, contextual adaptations (night mode, accessibility mode, mute behavior), latency requirements, and fallback behavior when audio is unavailable. Includes a testing checklist for QA validation of the audio implementation.
