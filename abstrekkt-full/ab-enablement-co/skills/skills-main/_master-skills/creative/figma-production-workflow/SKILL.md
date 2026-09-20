---
name: figma-production-workflow
description: Professional Figma file organization, version control, and handoff processes for high-velocity product teams. Covers best practices including variables, component properties, auto-layout, Dev Mode, and cross-functional collaboration. Use when designing, creating, or reviewing creative deliverables.
---

# Figma Production Workflow Skill

## Overview
Professional Figma file organization, version control, and handoff processes for high-velocity product teams. Covers 2025 best practices including variables, component properties, auto-layout, Dev Mode, and cross-functional collaboration.

---

## When to Use This Skill
- Setting up new product design files
- Auditing messy Figma workspaces
- Onboarding designers to team standards
- Preparing files for developer handoff
- Creating design system libraries

---

## File Structure Architecture

### Team Organization (Workspace Level)
```
├── 📁 Design Systems/
│   ├── 🎨 [Product] Design System (Library)
│   └── 📐 [Product] Templates
├── 📁 Products/
│   ├── 📄 [Product] - Web App
│   ├── 📄 [Product] - Mobile App
│   └── 📄 [Product] - Marketing Site
├── 📁 Projects/
│   ├── 📄 [Project Name] - [Quarter]
│   └── 📄 [Feature Name] - [Status]
├── 📁 Explorations/
│   └── 📄 [Designer Name] - Sandbox
└── 📁 Archive/
    └── 📄 [Deprecated Files]
```

**Naming conventions:**
- **Design systems:** `[Product] Design System v2.5`
- **Product files:** `[Product] - [Platform] - [Version]`
- **Projects:** `[Feature] - [Q1 2025] - [WIP/Review/Final]`
- **Status tags:** 🟢 Active, 🟡 In Review, 🔴 Blocked, ⚪ Archive

---

### Page Structure (Within Files)

#### Recommended page hierarchy:
```
📄 Product - Web App
  ├── 📃 🏠 Cover (Overview, changelog, navigation)
  ├── 📃 📱 Flows (User journeys, happy paths)
  ├── 📃 🖼️ Screens (High-fidelity designs by section)
  │   ├── Dashboard
  │   ├── Settings
  │   └── Onboarding
  ├── 📃 🎨 Components (Local components, instances)
  ├── 📃 📐 Specs (Redlines, measurements, annotations)
  ├── 📃 🧩 Explorations (Variations, discarded ideas)
  └── 📃 🗑️ Archive (Old versions, deprecated)
```

**Page naming:**
- Use emojis for visual scanning (optional but recommended)
- Prefix with numbers if order matters: `01 - Onboarding`, `02 - Dashboard`
- Group related pages with `/` separator: `Screens / Dashboard`, `Screens / Settings`

---

### Frame Structure (Artboard Level)

#### Best practices:
1. **Consistent sizing:**
   - Desktop: 1440×900 (MacBook Air standard)
   - Tablet: 768×1024 (iPad)
   - Mobile: 390×844 (iPhone 14 Pro)

2. **Clear naming:**
   - Format: `[Section] / [Screen] / [State]`
   - Example: `Dashboard / Overview / Default`
   - Example: `Dashboard / Overview / Empty State`

3. **Frame organization:**
   - Use sections (purple boxes) to group related frames
   - Section names: `[Epic] - [Status]` → `User Auth - ✅ Shipped`

4. **Variants vs multiple frames:**
   - Use variants for states (hover, active, disabled)
   - Use multiple frames for different content scenarios

---

## Component Architecture

### Component Hierarchy (3 Levels)

#### Level 1: Atoms (Base Library)
**Location:** Separate library file  
**Examples:** Button, Input, Icon, Badge, Avatar  
**Properties:**
- Variant (visual style)
- State (interaction)
- Size (scale)

**Example: Button component**
```
Button (Component Set)
├── Variant: Primary, Secondary, Ghost
├── State: Default, Hover, Active, Disabled
├── Size: SM, MD, LG
└── Icon: None, Left, Right, Only
```

**Claude action:** Generate component property matrix when creating base components.

---

#### Level 2: Molecules (Composite)
**Location:** Same library or separate "Patterns" library  
**Examples:** Search bar (Input + Button), Card (Image + Text + Button), Form field (Label + Input + Error)  
**Properties:** Fewer than atoms, focused on composition

---

#### Level 3: Organisms (Sections)
**Location:** Product files (not in library)  
**Examples:** Navigation bar, Footer, Pricing table, Dashboard header  
**Properties:** Minimal, content-driven

---

### Component Properties (Figma 2024+)

#### Property types:
1. **Boolean:** Toggle on/off (e.g., "Show icon")
2. **Instance swap:** Swap nested components (e.g., Icon selection)
3. **Text:** Editable labels
4. **Variant:** Switch between variants (e.g., "Type: Primary/Secondary")

#### Best practices:
- **Limit to 5-7 properties per component** (cognitive load)
- **Use clear labels:** "Icon position" not "IconPos"
- **Provide defaults:** Most common configuration
- **Group related properties:** Use separators in property panel

**Anti-pattern:** Exposing every possible configuration. Keep it simple.

---

### Auto-Layout (2025 Best Practices)

#### Core concepts:
- **Direction:** Horizontal, Vertical
- **Spacing:** Between items (use tokens: 8, 16, 24)
- **Padding:** Inside frame (use 8-point grid)
- **Alignment:** Start, Center, End, Stretch
- **Sizing:** Hug contents, Fill container, Fixed

#### Advanced features:
1. **Min/Max width/height:** Responsive constraints
2. **Absolute positioning:** Break out of flow (e.g., badges)
3. **Auto-layout wrap:** Grid-like behavior (Figma 2024+)

**Example: Responsive card**
```
Card (Auto-layout vertical)
├── Padding: 24px
├── Gap: 16px
├── Width: Fill container (min 280px, max 480px)
└── Height: Hug contents
  ├── Image (Fixed height: 200px)
  ├── Text (Hug contents)
  └── Button (Fill width)
```

**Claude action:** When generating component specs, include auto-layout config.

---

## Variables & Tokens (Figma 2023+)

### Variable Collections
**Structure mirrors design tokens:**
```
🎨 Primitives (Reference tokens)
  ├── Color / Brand / Blue / 500
  ├── Spacing / Base (8px)
  └── Typography / Font / Size / MD (16px)

🎨 Semantic (Context tokens)
  ├── Color / Text / Primary
  ├── Color / Background / Surface
  └── Spacing / Component / Padding / MD

🎨 Component (Specific usage)
  ├── Button / Background / Primary
  └── Input / Border / Default
```

### Variable Modes (Themes)
**Use cases:**
- Light/Dark themes
- Brand variants (multi-brand products)
- Platform-specific (iOS/Android)

**Example: Color variables with modes**
```
Variable: color/bg/primary
├── Mode: Light → #FFFFFF
├── Mode: Dark  → #1A1A1A
└── Mode: High Contrast → #000000
```

**Best practices:**
- **Bind variables to components** (don't hardcode)
- **Use aliases:** Semantic → Primitive references
- **Document in description field:** Usage guidelines
- **Sync with code tokens:** Use plugins (Tokens Studio)

---

## Version Control & Collaboration

### Branching (Figma Branches)
**When to use:**
- Major redesigns
- Experimental features
- Parallel workstreams

**Workflow:**
1. Create branch: `feature/new-dashboard`
2. Work in isolation
3. Request review (comment mode)
4. Merge to main when approved
5. Archive or delete branch

**Naming:**
- `feature/[name]` - New features
- `fix/[issue]` - Bug fixes
- `experiment/[name]` - Explorations

---

### Version History
**Best practices:**
- **Save versions at milestones:** After each design review, before major changes
- **Name versions clearly:** "v1.2 - Added dark mode", not "Updates"
- **Add descriptions:** What changed, why, who requested

**Auto-save protection:**
- Figma auto-saves every change (no Cmd+S needed)
- Use "Restore from version history" to revert mistakes
- Pin important versions to prevent deletion

---

### Comments & Annotations

#### Comment types:
1. **Review comments:** Feedback from stakeholders
2. **Dev handoff notes:** Implementation details
3. **Design rationale:** Why decisions were made

**Best practices:**
- **Use threads:** Keep related comments together
- **Resolve when addressed:** Clean up clutter
- **@mention specific people:** Assign action items
- **Use emojis for status:**
  - 👀 Needs review
  - ✅ Approved
  - 🔧 In progress
  - ❌ Won't fix

---

## Developer Handoff (Dev Mode)

### Preparing Files for Dev Mode

#### Checklist:
- [ ] **Name everything:** Layers, frames, components
- [ ] **Remove hidden layers:** Declutter the layer panel
- [ ] **Flatten unnecessary groups:** Simplify structure
- [ ] **Mark as "Ready for dev":** Page or section tag
- [ ] **Add annotations:** Interaction notes, state changes
- [ ] **Link to prototypes:** Clickable flows
- [ ] **Document edge cases:** Empty states, errors, long text

---

### Dev Mode Features (Figma 2024+)

#### What developers see:
1. **Inspect panel:** CSS, iOS, Android code snippets
2. **Assets:** Exportable icons, images (SVG, PNG)
3. **Variables:** Token names and values
4. **Spacing measurements:** Automatic distance calculations
5. **Component links:** Storybook, GitHub (via plugins)

#### Annotations for devs:
- **Interactions:** "On click, open modal"
- **Animations:** "Fade in, 300ms ease-out"
- **Conditional logic:** "If user is admin, show button"
- **API data:** "Fetch from /api/users"

**Claude action:** Generate dev handoff checklists for complex features.

---

## Asset Export

### Export Settings (Per Layer)

#### Recommended formats:
- **Icons:** SVG (scalable, web-optimized)
- **Images:** PNG 2x or WebP (modern browsers)
- **Logos:** SVG + PNG fallback
- **Backgrounds:** JPG (smaller file size)

**Export presets:**
```
Icon (Small)
├── SVG (optimized)
├── PNG 1x (24×24)
└── PNG 2x (48×48)

Image (Photo)
├── WebP 1x (quality: 80)
├── WebP 2x (quality: 80)
└── PNG 2x (fallback)
```

**Naming convention:**
- `icon-[name]-[size].svg` → `icon-arrow-right-24.svg`
- `img-[context]-[descriptor].webp` → `img-hero-background.webp`

---

### Batch Export (Plugin Recommended)
**Tools:**
- Figma built-in export (File → Export)
- **Export Kit** (plugin) - Batch export with custom rules
- **Figma API** - Automated export via scripts

---

## Plugins & Integrations

### Essential Plugins (2025)

#### Design Tools:
1. **Tokens Studio** - Token management, sync with Style Dictionary
2. **Autoflow** - Flow diagrams and arrows
3. **Unsplash / Pexels** - Stock photos
4. **Stark** - Accessibility contrast checker

#### Handoff:
5. **Zeplin / Zeroheight** - Documentation export
6. **Anima** - Export to React/Vue code
7. **Figma to Code** - AI code generation (experimental)

#### Productivity:
8. **Rename It** - Batch layer renaming
9. **Content Reel** - Dummy data generation
10. **Instance Finder** - Find component usage

**Security note:** Only install verified plugins from trusted publishers. Review permissions before installing.

---

## Accessibility in Figma

### Built-in Tools:
- **Color contrast checker:** Right-click → Plugins → Contrast
- **Focus order:** Prototype → Set tab order
- **Alt text:** Layers → Right panel → Description field

### Manual Checks:
1. **Color contrast:** Text vs background (WCAG AA: 4.5:1)
2. **Touch targets:** Min 44×44px (iOS) or 48×48px (Android)
3. **Focus indicators:** Visible outline on interactive elements
4. **Semantic structure:** Use proper heading hierarchy (H1 → H6)

**Claude action:** When generating components, include accessibility annotations.

---

## Performance Optimization

### File Size Management
**Large files (>500MB) cause lag.**

#### Strategies:
1. **Flatten unused groups:** Remove nesting
2. **Remove hidden layers:** Cmd+Shift+H → Delete
3. **Compress images:** Use WebP or lower resolution
4. **Limit effects:** Shadows, blurs are expensive
5. **Archive old pages:** Move to separate file

**Pro tip:** Use "Merge files" to consolidate related work, or "Link libraries" to reduce duplication.

---

### Component Instances (Not Copies)
**Anti-pattern:** Copying and pasting base components.  
**Best practice:** Always use instances from library.

**Why?**
- Changes propagate instantly
- Smaller file size (references, not duplicates)
- Easier to audit usage

---

## Quality Assurance Checklist

### Before Sharing with Team:
- [ ] All frames named and organized
- [ ] Components use auto-layout (not absolute positioning)
- [ ] Variables applied (no hardcoded colors)
- [ ] Text styles consistent (no local overrides)
- [ ] Images optimized or placeholders marked
- [ ] Annotations added for complex interactions
- [ ] Accessibility notes documented
- [ ] Prototype flows linked

### Before Developer Handoff:
- [ ] Dev Mode enabled
- [ ] All layers named (no "Rectangle 123")
- [ ] Export settings configured
- [ ] Component props documented
- [ ] Edge cases designed (empty, error, loading)
- [ ] Responsive breakpoints shown
- [ ] Animation specs noted (duration, easing)

---

## Team Workflows

### Design Review Process
1. **Async review:** Post link in Slack, set deadline
2. **Synchronous crit:** Screen share, discuss live
3. **Comment resolution:** Designer addresses feedback
4. **Final approval:** Mark version as "Approved"
5. **Handoff:** Share Dev Mode link

**Tools:**
- Figma comments for feedback
- Loom for video walkthroughs
- Linear/Jira for tracking design tasks

---

### Cross-Functional Collaboration

#### With Product Managers:
- Share prototypes for user testing
- Annotate user flows with logic
- Link to requirements docs (Notion, Confluence)

#### With Engineers:
- Use Dev Mode for specs
- Pair on implementation (design QA)
- Document component behavior

#### With Content/UX Writers:
- Use shared text styles
- Collaborate on microcopy in-file
- Export copy to spreadsheets (plugins)

---

## Common Pitfalls

### ❌ Anti-Patterns:
1. **Detached instances:** Components not linked to library
2. **Inconsistent naming:** Makes search impossible
3. **Overusing absolute positioning:** Breaks responsiveness
4. **Hardcoded values:** Colors, spacing not using variables
5. **No version history:** Can't revert mistakes
6. **Overly complex components:** Too many nested layers

### ✅ Best Practices:
1. **Use libraries for shared components**
2. **Auto-layout everything** (even single elements)
3. **Name layers descriptively** (not "Frame 1")
4. **Save versions at milestones**
5. **Document decisions in comments**
6. **Export 2x for retina displays**

---

## Claude Workflow Integration

### When User Requests Figma Organization:

1. **Audit current state:**
   - How many files?
   - Component library exists?
   - Naming conventions?

2. **Generate action plan:**
   - File structure proposal
   - Component migration checklist
   - Naming convention guide

3. **Provide templates:**
   - Cover page structure
   - Component spec template
   - Handoff checklist

4. **Create documentation:**
   - README for design team
   - Onboarding guide for new designers

---

## Example Outputs

### Cover Page Template (Copy to Figma)
```
🏠 [Product Name] - Web App

📋 Quick Links
- [Figma Library]
- [Storybook]
- [Documentation Site]

📅 Changelog
- 2025-10-15: Added dark mode variants
- 2025-10-01: Redesigned navigation

👥 Team
- Design: @Alice, @Bob
- Engineering: @Charlie, @Dana
- Product: @Eve

⚠️ Status: 🟢 Active
```

### Component Spec Template (Notion/Markdown)
```markdown
## Button Component

### Overview
Primary interactive element for user actions.

### Variants
- **Primary:** High emphasis (filled)
- **Secondary:** Medium emphasis (outlined)
- **Ghost:** Low emphasis (text only)

### States
- Default, Hover, Active, Focus, Disabled, Loading

### Sizes
- SM: 32px height
- MD: 40px height
- LG: 48px height

### Properties
- Label (text)
- Icon (instance swap)
- Full width (boolean)
- Disabled (boolean)

### Accessibility
- Min touch target: 44×44px
- Focus ring: 2px, primary color
- Disabled: aria-disabled="true"

### Dev Notes
- Use semantic <button> element
- Handle loading state with spinner
- Prevent double clicks with debounce
```

---

## Gaps & Blindspots

### Known Limitations:
- **Figma performance:** Large files (>500MB) still lag
- **Version control:** No Git-like merge conflict resolution
- **Offline work:** Limited functionality without internet
- **Advanced animations:** No timeline editor (use ProtoPie, Principle)
- **Real data:** No live API connections (use plugins)

### Unknown Unknowns:
- **AI design tools maturity:** Quality of AI-generated components
- **Figma roadmap:** Unannounced features (e.g., video editing, 3D)
- **Cross-tool compatibility:** FigJam, Figjam AI, Figma Slides integration
- **Enterprise scaling:** 1000+ designers in one workspace

---

**Next Steps After Using This Skill:**
1. Audit current Figma workspace → Identify chaos
2. Establish file structure → Implement naming conventions
3. Migrate to component library → Link instances
4. Enable Dev Mode → Prepare handoff process
5. Train team → Run workshop on best practices
