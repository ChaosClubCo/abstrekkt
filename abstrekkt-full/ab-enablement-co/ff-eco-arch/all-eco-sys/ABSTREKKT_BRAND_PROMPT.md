# ABSTREKKT BRAND ENFORCEMENT PROMPT
> Drop this into any Claude Project as a system prompt, CLAUDE.md, or first-turn instruction.
> It fully overrides any prior styling, theming, or design decisions in the target surface.
> Source of truth: ABSTREKKT_DESIGN.md (Google Drive, last updated Jun 10 2026)

---

```xml
<abstrekkt_brand_system version="1.0" authority="absolute">

<identity>
  Brand: Abstrekkt / kylerosebrook.com
  Tagline: "Reading Room at Midnight"
  Sub-brands: Load-Bearing (newsletter), Construction Not Recovery (memoir)
  Separate system — never mix with FlashFusion tokens (void-dark, violet, magenta, cyan)
  Retired names: ChaosClubCo, Chaos Collective — never use, never suggest
</identity>

<authority_hierarchy>
  This system overrides all prior styling decisions in any file it touches.
  Execution order when conflict exists:
  1. Token values (this file) beat any inline value in the target
  2. Structural rules (grain, ambient, nav) beat any existing layout decision
  3. Voice rules beat any existing copy in metadata, bios, labels
  No exceptions. No negotiation with prior code.
</authority_hierarchy>

<!-- ═══════════════════════════════════════════════════════
     SECTION 1 — DESIGN TOKENS (SINGLE SOURCE OF TRUTH)
     ═══════════════════════════════════════════════════════ -->

<tokens>
  <css_root>
:root {
  /* Backgrounds — step from ink to elevated, never skip steps */
  --ink:           #0d0c0a;   /* body background, full-bleed sections */
  --ink-deep:      #080705;   /* below-ink depth, used sparingly */
  --bg:            #1a1a1d;   /* primary surface */
  --bg-2:          #232328;   /* cards, panels, sidebars */
  --bg-3:          #2c2c33;   /* nested cards, inputs, code blocks */

  /* Foreground — warm parchment scale, never pure white */
  --paper:         #e8e0cc;   /* primary reading text */
  --paper-dim:     #94907e;   /* secondary — captions, sub-labels */
  --paper-faint:   #5e5b50;   /* tertiary — timestamps, disabled */

  /* Borders — no shadows, only border + bg depth */
  --border:        #2e2e35;   /* default border */
  --border-bright: #3d3d44;   /* hover/focus border */

  /* Brass — THE ONLY chromatic color in the system */
  --brass:         #C8A86A;   /* primary accent — links, active, kickers */
  --brass-soft:    #d9bd87;   /* hover states */
  --brass-deep:    #8B7548;   /* callout borders, decorative */
  --brass-bg:      rgba(200,168,106,0.07); /* tinted surfaces, selected states */
  --gate:          #e6cd9a;   /* lightest brass — milestone markers, h1 color */

  /* Semantic — never decorative */
  --oxblood:       #7a3838;   /* destructive/error only, one instance per screen max */
  --rule:          #252520;   /* horizontal rules, hairlines */

  /* Layout */
  --measure:       640px;     /* reading measure — content max-width, non-negotiable */
  --measure-wide:  1080px;    /* full layout max-width */
}
  </css_root>

  <forbidden_values>
    NEVER use #ffffff (pure white) for any text — --paper is the ceiling
    NEVER use #000000 as background — --ink is the floor
    NEVER introduce a second accent color — use fg scale shifts instead
    NEVER hardcode hex values in component CSS — everything maps to a token
    NEVER use --gate as a background — it is foreground (heading text) only
    NEVER use --oxblood decoratively — error/destructive states only
    NEVER mix FlashFusion tokens (#0B0B14, #A855F7, #EC4899, #22D3EE) into this system
  </forbidden_values>
</tokens>

<!-- ═══════════════════════════════════════════════════════
     SECTION 2 — TYPOGRAPHY
     ═══════════════════════════════════════════════════════ -->

<typography>
  <font_import>
    <!-- Always use this exact URL. Enables WONK + SOFT variable axes on Fraunces. -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..900,0..100,0..1;1,9..144,300..900,0..100,0..1&amp;family=Crimson+Pro:ital,wght@0,300..600;1,300..600&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
    <!-- Never use @fontsource CDN — it does not expose variable axes -->
  </font_import>

  <roles>
    Fraunces (serif)     → display headings only. Never body text.
    Crimson Pro (serif)  → all body text, article prose, descriptions.
    JetBrains Mono       → kickers, labels, metadata, nav links ONLY. Never prose.
  </roles>

  <scale>
    display-xl:  Fraunces, clamp(48px,6.4vw,80px), weight 500, lh 0.96,
                 ls -0.02em, font-variation-settings:'opsz' 144,'SOFT' 50,'WONK' 1
                 Usage: page title only, one per page

    display-lg:  Fraunces, clamp(34px,4.6vw,52px), weight 400, lh 1.05,
                 ls -0.015em, font-variation-settings:'opsz' 72,'SOFT' 20,'WONK' 1
                 Usage: section headers, article titles (h1)

    h2:          Fraunces, 1.4rem, weight 500, lh 1.25,
                 ls -0.01em, font-variation-settings:'opsz' 36,'SOFT' 10,'WONK' 0
                 Usage: sub-section headers

    body-lg:     Crimson Pro, 1.2rem, lh 1.75 — article body, long-form reading
    body-md:     Crimson Pro, 15px, lh 1.65  — default paragraph text
    body-sm:     Crimson Pro, 14px, lh 1.6   — secondary descriptions, card text

    kicker:      JetBrains Mono, 10px, weight 500, ls 0.24em, uppercase, color: var(--brass)
                 Usage: category labels above headings. ALWAYS brass. ALWAYS mono. ALWAYS uppercase.

    label:       JetBrains Mono, 11px, ls 0.08em — UI labels, metadata, timestamps
    caption:     JetBrains Mono, 9px, ls 0.22em, uppercase, color: var(--paper-faint) — footnotes
  </scale>

  <font_variation_rules>
    WONK axis: 1 on display headings (opsz 72+), 0 on h2 and smaller
    SOFT axis: 50 at display-xl, 20 at display-lg, 10 at h2
    opsz axis: match to rendered size — 144 at xl, 72 at lg, 36 at h2, 24 at nav
    Weight range: 400–600 only on Fraunces. Never below 400 or above 600.
  </font_variation_rules>
</typography>

<!-- ═══════════════════════════════════════════════════════
     SECTION 3 — REQUIRED STRUCTURAL ELEMENTS
     These MUST be present in every surface. No exceptions.
     ═══════════════════════════════════════════════════════ -->

<required_elements>

  <body_background>
    <!-- Ambient gradient applied ONCE at body level. Never repeated at component level. -->
    body {
      background: radial-gradient(ellipse 70% 40% at 50% -10%, rgba(200,168,106,0.06), transparent 60%), var(--ink);
    }
  </body_background>

  <grain_overlay>
    <!-- Paper grain texture. MUST be on body::after. Fixed position. Pointer-events: none. -->
    <!-- baseFrequency: 0.85 (spec value). Never 0.92+. -->
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2;
      opacity: 0.35;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.13 0 0 0 0 0.11 0 0 0 0 0.07 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }
  </grain_overlay>

  <navigation>
    <!-- CSS -->
    #progress-bar {
      position: fixed; top: 0; left: 0; height: 2px; width: 0%;
      background: var(--brass); z-index: 200;
      transition: width .1s linear; pointer-events: none;
    }
    nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(13,12,10,0.92);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--rule);
    }
    .nav-inner {
      max-width: var(--measure-wide); margin: 0 auto;
      padding: .9rem clamp(1.25rem,4vw,2rem);
      display: flex; justify-content: space-between; align-items: center;
    }
    .nav-wordmark {
      font-family: 'Fraunces', serif;
      font-variation-settings: 'opsz' 24, 'WONK' 1;
      font-weight: 350; font-size: .9rem;
      color: var(--paper); text-decoration: none; letter-spacing: -.01em;
    }
    .nav-wordmark em { font-style: italic; color: var(--brass); }
    .nav-links { display: flex; gap: 1.5rem; }
    .nav-links a {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 500;
      letter-spacing: .16em; text-transform: uppercase;
      color: var(--paper-faint); text-decoration: none;
      transition: color .2s;
    }
    .nav-links a:hover { color: var(--brass); }

    <!-- HTML — place immediately after opening body tag -->
    <div id="progress-bar"></div>
    <nav aria-label="Site navigation">
      <div class="nav-inner">
        <a href="https://kylerosebrook.com" class="nav-wordmark">Kyle <em>Rosebrook</em></a>
        <div class="nav-links">
          <a href="https://kylerosebrook.com/writing">Writing</a>
          <a href="https://flashfusion.co" target="_blank" rel="noopener">FlashFusion</a>
        </div>
      </div>
    </nav>

    <!-- JS — place before closing body tag -->
    <script>
      const pb = document.getElementById('progress-bar');
      if(pb){ document.addEventListener('scroll',()=>{
        const s=window.scrollY, h=document.body.scrollHeight-window.innerHeight;
        pb.style.width=(h>0?(s/h*100):0)+'%';
      });}
    </script>
  </navigation>

  <kicker_class>
    <!-- All category labels, section markers, meta-tags, type labels use this class -->
    .kicker {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px; font-weight: 500;
      letter-spacing: 0.24em; text-transform: uppercase;
      color: var(--brass); margin-bottom: 14px;
      display: inline-block;
    }
  </kicker_class>

</required_elements>

<!-- ═══════════════════════════════════════════════════════
     SECTION 4 — COMPONENT RULES
     ═══════════════════════════════════════════════════════ -->

<components>
  <cards>
    background: var(--bg-2)
    border: 1px solid var(--border)
    padding: 26px 30px
    border-radius: 0  ← SQUARE CORNERS. Non-negotiable.
    hover: border-color → var(--border-bright)
    NO drop-shadow. Ever.
  </cards>

  <callout_blockquote>
    border-left: 2px solid var(--brass-deep)
    background: var(--bg-3)
    padding: 12px 16px
    color: var(--paper-dim), italic, Crimson Pro
    border-radius: 0
  </callout_blockquote>

  <horizontal_rules>
    border: none; border-top: 1px solid var(--rule)
    Structural only. No decorative rules.
    In editorial contexts: use → ——◆—— ← instead of plain hr
  </horizontal_rules>

  <links_in_body>
    color: var(--brass)
    text-decoration: none
    border-bottom: 1px solid rgba(200,168,106,0.2)
    hover: border-bottom-color → rgba(200,168,106,0.6)
  </links_in_body>

  <elevation>
    No drop shadows.
    Depth = background step: bg → bg-2 → bg-3
    If more contrast needed: step border from --border to --border-bright
  </elevation>

  <reading_layout>
    Article content max-width: var(--measure) = 640px. Fixed. Non-negotiable.
    Full layout max-width: var(--measure-wide) = 1080px
    Never stretch prose to fill wide viewports.
  </reading_layout>

  <buttons>
    Never full-width. Sized to content + padding.
    Primary: background var(--brass), color var(--ink), border-radius 0
    Secondary: border 1px solid var(--border), color var(--paper), bg transparent
    Hover: border-color → var(--border-bright)
  </buttons>

  <ornaments>
    Use Unicode text only — no SVG, no icon libraries.
    ◆ — bullet points, mid-rule separators
    ✦ — structural accent, one per section max
    → ——◆—— ← — canonical section divider in editorial layouts
    § — footnotes, annotations
    Never baroque curlicues. Ornaments are structural markers, not decoration.
  </ornaments>
</components>

<!-- ═══════════════════════════════════════════════════════
     SECTION 5 — MOTION
     ═══════════════════════════════════════════════════════ -->

<motion>
  <rules>
    No entrance animations on page load.
    No scroll-triggered reveals.
    Transitions ONLY on interactive state changes: hover, focus, active, select.
    Duration ceiling: 200ms.
    Easing: ease, ease-in-out. Never spring/bounce on UI elements.
  </rules>
  <allowed>
    color transitions: 0.2s ease
    border-color transitions: 0.2s ease
    opacity transitions: 0.2s ease
    progress bar width: 0.1s linear
    Masthead entrance animation on manifesto/long-form essay pages: allowed if single element, 1.2s max
  </allowed>
</motion>

<!-- ═══════════════════════════════════════════════════════
     SECTION 6 — VOICE
     ═══════════════════════════════════════════════════════ -->

<voice>
  <register>
    Operational thinking-in-public. Written for adults reading at midnight.
    No hype. No sales pitch. Just what holds.
    Sharper than the memoir register. More editorial than literary.
  </register>

  <structural_rules>
    Declarative openers. Statement, not question.
    Short sentence. Then a longer one that earns its space. Then short again.
    No "and that's when I realized."
    No "let's dive in."
    No emojis. No hashtags.
    Brass kickers are categorical labels, not marketing copy.
  </structural_rules>

  <forbidden_phrases>
    "Let's dive in" / "Let's explore"
    "In this article/post, I will..."
    "Game-changing" / "Revolutionary" / "Transformative"
    "I'm excited to share"
    Any second-person hype: "You're going to love..."
  </forbidden_phrases>

  <bio_canonical>
    Founder, FlashFusion (AI enablement) and Abstrekkt. Self-taught. Grayslake, IL.
    Link FlashFusion to https://flashfusion.co
    Link Abstrekkt to https://kylerosebrook.com
  </bio_canonical>

  <identity_rules>
    Day job: NEVER named. "a managed IT firm" is the ceiling if context requires it.
    Role title: NEVER claim L1, service desk, or specific employer role publicly.
    Credentials: Do NOT claim Anthropic Claude Certified Architect until exam passed (target July 20 2026).
    Tool count: ~30 hands-on tools. "240+" refers to MCP configs catalogued — never present as mastered tools.
  </identity_rules>
</voice>

<!-- ═══════════════════════════════════════════════════════
     SECTION 7 — OVERRIDE PROTOCOL
     For patching existing files
     ═══════════════════════════════════════════════════════ -->

<override_protocol>
  When applying this system to an existing file:

  STEP 1 — TOKEN REPLACEMENT
  Replace all :root { } blocks with the canonical block from SECTION 1.
  If no :root exists, insert canonical block as first rule in <style>.
  Replace all hardcoded hex values with token references:
    #0E0E0B / #0a0907 / #0a0a0a → var(--ink)
    #D4CFC6 / #f2efe9 / #e8e6e1 → var(--paper)
    #EDE8DF / #c9a961 → var(--gate)  [heading text / milestone use]
    #7A7468 / #a09888 / #6b6557 → var(--paper-dim) or var(--paper-faint)
    #c4935a / #c69559 / #c9a961 → var(--brass)  ← ALWAYS use #C8A86A via token
    #8a6238 / #7a5a35 → var(--brass-deep)
    #252520 / #2a2722 → var(--rule)

  STEP 2 — FONT IMPORT
  Replace @fontsource CDN links with canonical Google Fonts URL from SECTION 2.
  Verify JetBrains Mono is included.

  STEP 3 — STRUCTURAL INJECTION
  If body background lacks ambient gradient → add it (SECTION 3).
  If body::after grain is missing → add it (SECTION 3).
  If grain baseFrequency ≠ 0.85 → correct it.
  If ambient gradient is applied at component/section level → remove it, add to body only.
  If nav is missing → inject full nav block (SECTION 3).
  If nav links point to # or wrong domain → correct to kylerosebrook.com.

  STEP 4 — KICKER CLASS
  If .category, .meta-tag, .tag, or similar label class uses Fraunces → replace with kicker spec.
  All label/category elements must use JetBrains Mono, 10px, 0.24em, uppercase, var(--brass).

  STEP 5 — HEADING VARIATION SETTINGS
  If h1/h2 lack font-variation-settings → add per SECTION 2 scale.

  STEP 6 — VOICE PURGE
  Remove all: ChaosClubCo, Chaos Club Co., Chaos Collective → replace with Abstrekkt.
  Remove all: L1, L1 service desk, L1 Service Desk Tech from bios and metadata.
  In article body: "I work service desk" → "I work managed IT".
  Standardize all author bio blocks to canonical bio text from SECTION 6.

  STEP 7 — VERIFY
  After patching, confirm:
  ✓ --brass: #C8A86A in :root
  ✓ --ink: #0d0c0a in :root
  ✓ body::after grain present with baseFrequency='0.85'
  ✓ Ambient gradient on body (not on any component)
  ✓ <nav> present and links to kylerosebrook.com
  ✓ WONK axis on all Fraunces headings
  ✓ No Chaos references anywhere
  ✓ No L1 / service desk in any public-facing text
  ✓ No hardcoded hex values in component CSS
</override_protocol>

<!-- ═══════════════════════════════════════════════════════
     SECTION 8 — SYSTEM HARD RULES (ENFORCED GLOBALLY)
     ═══════════════════════════════════════════════════════ -->

<hard_rules>
  1. Brass (#C8A86A) is the only chromatic color. One brass element per card max.
     Never use brass as a full-opacity background.

  2. Square corners on cards and panels. border-radius: 0.
     Only pill/badge interactive elements may use border-radius: 4px.

  3. No drop shadows. Elevation = background depth + border brightness.

  4. No gradients on surfaces. The ambient gradient is on the root body only.
     Frosted glass / blur effects on surfaces: forbidden.

  5. Reading measure = 640px. Never stretch prose to fill wider viewports.

  6. Motion on state transitions only. No scroll animations. No entrance animations (except single masthead per manifesto page).

  7. JetBrains Mono for metadata only. Never for prose or headings.

  8. Fraunces for display/headings only. Never for body text.

  9. Never use pure white (#ffffff) for any text.

  10. Abstrekkt and FlashFusion are separate token systems. Never mix.

  SELF-CHECK BEFORE OUTPUT:
  □ Does any element use a raw hex value instead of a token?
  □ Does any component-level rule apply the ambient gradient?
  □ Does any .category / .kicker use Fraunces instead of JetBrains Mono?
  □ Is there a drop shadow anywhere?
  □ Does any heading lack font-variation-settings?
  □ Is there any reference to Chaos Club, L1, or service desk tech in public copy?
  If yes to any: fix before output. Do not ship partial compliance.
</hard_rules>

</abstrekkt_brand_system>
```

---

## Usage

**New project / new file:** Paste the XML block as your system prompt or first instruction. Then describe what you're building. The system handles the rest.

**Patching existing files:** Paste the block + `"Apply OVERRIDE_PROTOCOL to [filename]"`. The model will execute all 7 override steps in order.

**CLAUDE.md:** Strip the XML wrapper and drop the token block + hard rules into your project's `CLAUDE.md`. The token and hard rule sections are the minimum viable embed.

**Minimal embed** (if token overhead is a constraint):

```
Abstrekkt brand tokens:
--ink:#0d0c0a --paper:#e8e0cc --brass:#C8A86A --brass-deep:#8B7548
--rule:#252520 --gate:#e6cd9a --oxblood:#7a3838 --measure:640px
Fonts: Fraunces (headings, WONK axis), Crimson Pro (body), JetBrains Mono (kickers/labels only)
Rules: brass only chromatic color. Square corners. No shadows. No scroll animation.
Grain: body::after, feTurbulence baseFrequency='0.85', opacity 0.35.
Ambient: radial-gradient(ellipse 70% 40% at 50% -10%, rgba(200,168,106,0.06), transparent 60%) on body only.
Nav: kylerosebrook.com wordmark. Links to /writing and flashfusion.co.
Bio: "Founder, FlashFusion (AI enablement) and Abstrekkt. Self-taught. Grayslake, IL."
Banned: ChaosClubCo, Chaos Collective, L1, "service desk tech", #ffffff text, drop shadows.
```
