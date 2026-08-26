---
name: browser-devtools-mcp
description: Integrating Chrome DevTools and browser automation via MCP for live UI inspection, screenshot-to-code workflows, and visual debugging. Bridges the gap between design and implementation. Use when configuring, building, or troubleshooting AI agent workflows.
---

# Browser DevTools MCP Integration

## Core Workflow


Leverage browser automation and DevTools through MCP (Model Context Protocol) for live UI inspection, screenshot-to-code workflows, and visual debugging. This skill enables direct observation and manipulation of running interfaces.

---

## When to Use This Skill

- Capturing screenshots of live UIs for analysis
- Inspecting CSS and computed styles programmatically
- Implementing screenshot-to-code workflows
- Debugging layout issues with visual feedback
- Extracting design tokens from existing sites
- Automating visual regression testing
- Building live preview workflows

---

## MCP Architecture Overview

### What is MCP?

Model Context Protocol (MCP) is Anthropic's standard for connecting LLMs to external tools. It provides:

- **Standardized tool interface** - Consistent way to expose capabilities
- **Bidirectional communication** - Tools can query the model
- **Stateful sessions** - Maintain context across interactions
- **Permission boundaries** - Control what tools can do

### Browser MCP Landscape

```
+-------------------+     +-------------------+     +-------------------+
|   Playwright MCP  |     |   Puppeteer MCP   |     | Chrome DevTools   |
|   (Full browser)  |     |   (Headless)      |     | Protocol (CDP)    |
+-------------------+     +-------------------+     +-------------------+
         |                         |                         |
         +-----------+-------------+-----------+-------------+
                     |                         |
              +------v------+           +------v------+
              | Screenshot  |           |  Element    |
              | Capture     |           |  Inspection |
              +-------------+           +-------------+
                     |                         |
              +------v------+           +------v------+
              | Visual      |           |  Style      |
              | Comparison  |           |  Extraction |
              +-------------+           +-------------+
```

---

## Core MCP Tools for UI Work

### Available Browser MCP Tools

When using Playwright MCP (common in Claude Code):

```typescript
// Navigation and page control
mcp__playwright__browser_navigate({ url: string })
mcp__playwright__browser_navigate_back()
mcp__playwright__browser_close()
mcp__playwright__browser_resize({ width: number, height: number })

// Screenshots and visual capture
mcp__playwright__browser_take_screenshot({
  filename?: string,
  fullPage?: boolean,
  type?: "png" | "jpeg",
  element?: string,  // Human-readable description
  ref?: string       // Element reference from snapshot
})

// Accessibility snapshots (better than screenshots for structure)
mcp__playwright__browser_snapshot({
  filename?: string  // Optional: save to file
})

// Interactions
mcp__playwright__browser_click({ element: string, ref: string })
mcp__playwright__browser_type({ element: string, ref: string, text: string })
mcp__playwright__browser_hover({ element: string, ref: string })

// Form handling
mcp__playwright__browser_fill_form({ fields: FormField[] })

// Evaluation
mcp__playwright__browser_evaluate({ function: string, element?: string, ref?: string })

// Tab management
mcp__playwright__browser_tabs({ action: "list" | "new" | "close" | "select" })
```

---

## Screenshot-to-Code Workflows

### Workflow 1: Direct Screenshot Analysis

Capture and analyze a live UI for recreation:

```python
class ScreenshotToCodeWorkflow:
    """
    Convert a screenshot of a UI into working code.
    """

    async def capture_and_analyze(self, url: str) -> CodeOutput:
        # Step 1: Navigate to target
        await mcp.browser_navigate(url=url)

        # Step 2: Wait for full render
        await mcp.browser_wait_for(time=2)

        # Step 3: Take high-quality screenshot
        screenshot = await mcp.browser_take_screenshot(
            filename="capture.png",
            fullPage=False,
            type="png"
        )

        # Step 4: Get accessibility snapshot for structure
        snapshot = await mcp.browser_snapshot()

        # Step 5: Analyze with vision + structure
        analysis = await self.analyze_screenshot(screenshot, snapshot)

        # Step 6: Generate code
        code = await self.generate_code(analysis)

        return code

    async def analyze_screenshot(self, screenshot: str, snapshot: str) -> UIAnalysis:
        """
        Combine visual and structural analysis.
        """
        prompt = f"""
        Analyze this UI screenshot and accessibility snapshot.

        ## Accessibility Snapshot (Structure)
        {snapshot}

        ## Analysis Tasks

        1. **Layout Structure**
           - Identify major sections (header, sidebar, main, footer)
           - Determine grid/flexbox patterns
           - Note responsive breakpoint hints

        2. **Visual Elements**
           - Extract color palette (background, text, accent)
           - Identify typography (font family, sizes, weights)
           - Note spacing patterns

        3. **Components**
           - List all UI components visible
           - Describe their visual treatment
           - Note interactive elements

        4. **Design System Inference**
           - What design system might this be based on?
           - What are the governing principles?

        Output as structured JSON.
        """

        return await self.llm.analyze_image(screenshot, prompt)
```

### Workflow 2: Element-Specific Extraction

Extract and recreate specific elements:

```python
class ElementExtractionWorkflow:
    """
    Extract and recreate specific UI elements.
    """

    async def extract_element(self, url: str, selector: str) -> ElementCode:
        # Navigate to page
        await mcp.browser_navigate(url=url)

        # Get page snapshot to find element
        snapshot = await mcp.browser_snapshot()

        # Find element reference in snapshot
        ref = self.find_element_ref(snapshot, selector)

        # Take element-specific screenshot
        element_screenshot = await mcp.browser_take_screenshot(
            element=f"Target element: {selector}",
            ref=ref
        )

        # Extract computed styles via evaluation
        styles = await mcp.browser_evaluate(
            function="""
            (element) => {
                const computed = window.getComputedStyle(element);
                return {
                    display: computed.display,
                    flexDirection: computed.flexDirection,
                    padding: computed.padding,
                    margin: computed.margin,
                    backgroundColor: computed.backgroundColor,
                    color: computed.color,
                    fontSize: computed.fontSize,
                    fontWeight: computed.fontWeight,
                    borderRadius: computed.borderRadius,
                    boxShadow: computed.boxShadow,
                };
            }
            """,
            element=f"Target element: {selector}",
            ref=ref
        )

        # Generate code from extracted data
        return await self.generate_element_code(element_screenshot, styles)
```

### Workflow 3: Design Token Extraction

Extract design tokens from a live site:

```python
class TokenExtractionWorkflow:
    """
    Extract design tokens from a live website.
    """

    async def extract_tokens(self, url: str) -> DesignTokens:
        await mcp.browser_navigate(url=url)

        # Extract colors from key elements
        colors = await mcp.browser_evaluate(
            function="""
            () => {
                const elements = document.querySelectorAll(
                    'button, a, h1, h2, h3, p, [class*="bg-"], [class*="text-"]'
                );

                const colors = new Set();
                elements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    colors.add(style.color);
                    colors.add(style.backgroundColor);
                    colors.add(style.borderColor);
                });

                return Array.from(colors).filter(c => c !== 'rgba(0, 0, 0, 0)');
            }
            """
        )

        # Extract typography
        typography = await mcp.browser_evaluate(
            function="""
            () => {
                const textElements = document.querySelectorAll('h1, h2, h3, h4, p, span, a');
                const fonts = new Map();

                textElements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    const key = `${style.fontFamily}|${style.fontSize}|${style.fontWeight}`;
                    if (!fonts.has(key)) {
                        fonts.set(key, {
                            fontFamily: style.fontFamily,
                            fontSize: style.fontSize,
                            fontWeight: style.fontWeight,
                            lineHeight: style.lineHeight,
                        });
                    }
                });

                return Array.from(fonts.values());
            }
            """
        )

        # Extract spacing patterns
        spacing = await mcp.browser_evaluate(
            function="""
            () => {
                const elements = document.querySelectorAll('[class*="p-"], [class*="m-"], [class*="gap-"]');
                const spacings = new Set();

                elements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    spacings.add(style.padding);
                    spacings.add(style.margin);
                    spacings.add(style.gap);
                });

                return Array.from(spacings);
            }
            """
        )

        return self.normalize_tokens(colors, typography, spacing)
```

---

## Live Inspection Patterns

### Pattern 1: Visual Debugging

Debug layout issues with visual feedback:

```python
class VisualDebugger:
    """
    Debug UI issues using browser inspection.
    """

    async def debug_layout(self, url: str, issue_description: str) -> DebugReport:
        await mcp.browser_navigate(url=url)

        # Take initial screenshot
        before = await mcp.browser_take_screenshot(filename="before.png")

        # Get page snapshot
        snapshot = await mcp.browser_snapshot()

        # Inject debug styles via evaluation
        await mcp.browser_evaluate(
            function="""
            () => {
                // Add debug overlay to all elements
                const style = document.createElement('style');
                style.textContent = `
                    * { outline: 1px solid rgba(255,0,0,0.2) !important; }
                    *:hover { outline: 2px solid red !important; }
                `;
                document.head.appendChild(style);
            }
            """
        )

        # Take debug screenshot
        debug_screenshot = await mcp.browser_take_screenshot(
            filename="debug-overlay.png"
        )

        # Analyze the issue
        analysis = await self.analyze_layout_issue(
            before=before,
            debug=debug_screenshot,
            snapshot=snapshot,
            issue=issue_description
        )

        return analysis

    async def compare_with_design(
        self,
        live_url: str,
        design_image_path: str
    ) -> ComparisonReport:
        """
        Compare live implementation against design mockup.
        """
        await mcp.browser_navigate(url=live_url)

        live_screenshot = await mcp.browser_take_screenshot(
            filename="live.png",
            fullPage=True
        )

        # Load and analyze both images
        prompt = """
        Compare these two images:
        1. Design mockup (what it should look like)
        2. Live implementation (what it actually looks like)

        Identify:
        - Color discrepancies (with specific values)
        - Spacing differences (estimate pixels)
        - Typography mismatches
        - Layout structural differences
        - Missing or extra elements

        Provide specific, actionable fixes.
        """

        return await self.compare_images(design_image_path, live_screenshot, prompt)
```

### Pattern 2: Responsive Testing

Test and capture across breakpoints:

```python
class ResponsiveTester:
    """
    Test UI across responsive breakpoints.
    """

    BREAKPOINTS = {
        "mobile": {"width": 375, "height": 812},
        "tablet": {"width": 768, "height": 1024},
        "desktop": {"width": 1440, "height": 900},
        "wide": {"width": 1920, "height": 1080},
    }

    async def capture_all_breakpoints(self, url: str) -> dict[str, str]:
        """
        Capture screenshots at all standard breakpoints.
        """
        await mcp.browser_navigate(url=url)

        captures = {}
        for name, dimensions in self.BREAKPOINTS.items():
            await mcp.browser_resize(**dimensions)
            await mcp.browser_wait_for(time=0.5)  # Let layout settle

            screenshot = await mcp.browser_take_screenshot(
                filename=f"responsive-{name}.png"
            )
            captures[name] = screenshot

        return captures

    async def analyze_responsiveness(self, url: str) -> ResponsivenessReport:
        """
        Analyze how well the UI responds to different sizes.
        """
        captures = await self.capture_all_breakpoints(url)

        prompt = """
        Analyze these screenshots at different viewport sizes.

        Check for:
        1. Layout breaks or overflow
        2. Touch target sizes on mobile (min 44x44px)
        3. Text readability at each size
        4. Navigation accessibility
        5. Image scaling issues
        6. Hidden content that shouldn't be

        Provide specific recommendations for each breakpoint.
        """

        return await self.analyze_screenshots(captures, prompt)
```

---


## References
- `references/mcp-tool-patterns.md` — MCP Tool Patterns
