# Design System Specification: The Brutalist Archive

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Brutalist Archive."** This is not a standard interface; it is a high-fidelity digital terminal designed to evoke the cold, pressurized atmosphere of a surveillance bunker and the tactile decay of weathered industrial steel.

By rejecting the "softness" of modern SaaS aesthetics, we embrace intentional friction. The system utilizes a strict **0px border-radius** across all elements to convey structural rigidity. Visual interest is generated not through decoration, but through **Microfilm Grain Overlays**, desaturated **Hazard Red** accents, and high-contrast typography scales that mimic redacted documents and telemetry readouts. We break the "template" look by using aggressive, asymmetrical layouts and tonal depth to create an experience that feels inherited rather than manufactured.

---

## 2. Colors & Surface Architecture
The palette is rooted in deep obsidian and weathered metallic tones, punctuated by urgent, desaturated reds.

### Tonal Hierarchy
*   **Background (`#0c0e10`):** The absolute base. Think of this as the dark room in which the archive sits.
*   **Primary (`#ffb3b1`):** The "Hazard Red." Used sparingly for critical telemetry and call-to-actions. It is desaturated to feel aged, like sun-bleached emergency paint.
*   **Surface Containers:** These define our structural layers.
    *   `surface-container-lowest`: Used for recessed backgrounds or "cut-outs" in the UI.
    *   `surface-container-high`: Used for elevated terminal panels.

### The "No-Line" Rule
Explicitly prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` sidebar should sit against a `surface` background without a dividing line. The eye must perceive the change in "metal grade" via color, not a stroke.

### Signature Textures & Glassmorphism
*   **Brushed Gradients:** For main CTAs, use a subtle linear gradient from `primary` to `primary-container`. This adds a "soul" to the color that flat hex codes cannot achieve.
*   **The Industrial Glass Rule:** Use `surface-container-highest` with a 60% opacity and a `20px` backdrop-blur for floating overlays. This mimics the thick, reinforced glass of a surveillance monitor.
*   **Grain Overlays:** Apply a low-opacity microfilm grain (SVG noise or PNG texture) globally. This breaks the sterile digital perfection and reinforces the "Weathered Steel" aesthetic.

---

## 3. Typography
The typography scale is designed to feel like a high-end editorial meets a classified technical manual.

*   **Display & Headlines (Space Grotesk):** This font carries the "telemetry" weight. It is technical, wide, and authoritative. Use `display-lg` (3.5rem) for major section headers to create an intentional, aggressive scale contrast against body text.
*   **Body & Titles (Work Sans):** This is the "archival" font. It provides high readability for dense data. It is neutral, allowing the industrial surroundings to do the heavy lifting.
*   **Label Scale:** Use `label-sm` (Space Grotesk) in all-caps for metadata, timestamps, and surveillance coordinates. This reinforces the "monitoring" theme.

---

## 4. Elevation & Depth
In this design system, depth is a product of material stacking, not lighting.

### The Layering Principle
Hierarchy is achieved by "stacking" surface-container tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural "recessed" effect. This mimics the way panels are bolted onto industrial machinery.

### Ambient Shadows
Shadows are rarely used. When a floating panel (like a modal) is required, use an extra-diffused shadow (40px-60px blur) at 8% opacity. The shadow color should be a tinted version of `on-surface` (a deep, cool grey) rather than pure black, ensuring the shadow feels like ambient light hitting a metal surface.

### The "Ghost Border" Fallback
If a container requires a boundary for accessibility, use a **Ghost Border**: the `outline-variant` token at 15% opacity. Full-opacity borders are strictly forbidden as they break the immersive, "weathered" feel.

---

## 5. Components

### Buttons
*   **Primary:** Sharp 0px corners. Background: `primary`. Text: `on-primary` (Space Grotesk, Bold). No border.
*   **Secondary:** `surface-container-high` background. `on-surface` text.
*   **Interaction:** On hover, shift the background to `primary-dim`. The transition should be instant (50ms) to feel like a mechanical switch.

### Input Fields
*   **Styling:** Use `surface-container-lowest` for the input track.
*   **Indicator:** Instead of a full border, use a 2px bottom-bar in `outline` that shifts to `primary` (Hazard Red) on focus.
*   **Typography:** All user input should be rendered in `body-md` (Work Sans) to look like typed archival entries.

### Cards & Lists
*   **Forbid Dividers:** Do not use lines to separate list items. Use a 4px vertical gap or a subtle toggle between `surface-container-low` and `surface-container-highest`.
*   **Surveillance Metadata:** Every card should feature a `label-sm` timestamp or ID in the top-right corner to maintain the "monitored" aesthetic.

### Chips
*   **Action Chips:** Small, rectangular boxes with `outline-variant` ghost borders. Use for status indicators (e.g., "ARCHIVED," "ACTIVE").

---

## 6. Do's and Don'ts

### Do:
*   **Embrace Asymmetry:** Align text to the left but place metadata (telemetry) in unconventional corners to break the grid.
*   **Use High Contrast:** Let the `display-lg` headers dwarf the `body-sm` text to create an editorial, high-end feel.
*   **Prioritize Hard Edges:** Ensure every single component maintains a 0px radius.

### Don't:
*   **No Rounded Corners:** Never use `border-radius`. It destroys the industrial brutalism of the system.
*   **No Standard Shadows:** Avoid heavy, 1990s-style drop shadows. Use tonal layering first.
*   **No Vibrant Colors:** Avoid any color outside the provided palette. If the user needs "success," use a desaturated metallic green, never a bright neon.
*   **No Centered Layouts:** Archive data is rarely centered. Stick to strong left-aligned grids with right-aligned telemetry.