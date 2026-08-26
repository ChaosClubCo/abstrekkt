# Sales/SPIKE Lane — Redirect

## When This Runs

User mentions a design brief in the context of Sales, SPIKE, B2B proposals,
client deliverables, or pricing documents. This lane does NOT produce UI
design briefs — it produces documents and proposals.

## Why This Is a Redirect

Sales/SPIKE work is document-oriented, not interface-oriented:
- Proposals are .docx or .pptx, not web UIs
- Client-facing materials follow INT brand standards, not the void/violet design system
- The deliverable is persuasion + information architecture, not interactive design
- Design tokens (surface, accent, typography) don't apply to Word docs

Creating a design brief for Sales/SPIKE work would produce a spec nobody
implements. Redirect to the right tool instead.

## Redirect Map

| Request | Redirect To | Why |
|---------|------------|-----|
| "Design a proposal" | `intinc-doc-generator` skill | INT-branded .docx with proper templates |
| "Make a pitch deck" | `pptx` skill | Presentation with slide design |
| "Build an ROI calculator" | `roi-calculator-building` skill | B2B ROI model, not a UI |
| "Create a client one-pager" | `intinc-doc-generator` skill | Single-page INT-branded document |
| "Design a pricing page" | Check: is this a web page or a doc? | If web → Product lane brief. If doc → `intinc-doc-generator` |
| "SPIKE POC visual" | `elite-ui-design` skill | If it's actually a UI prototype, route to Product lane |
| "Sales demo UI" | Product lane brief | This IS a UI → create a brief via the New Brief workflow |

## Decision Logic

```
Is the deliverable a document (.docx, .pptx, .pdf)?
  YES → intinc-doc-generator or pptx skill. Not a design brief.
  NO →
    Is it a web UI or interactive prototype?
      YES → This is actually Product lane work. Route to the New Brief workflow
            and confirm lane = Product.
      NO →
        Is it a spreadsheet or calculator?
          YES → xlsx skill or roi-calculator-building skill.
          NO → Ask for clarification. "What format is the final deliverable?"
```

## What To Say

When redirecting, explain briefly:

> "Sales/SPIKE deliverables are documents and presentations, not interactive UIs.
> The design brief system is for building interfaces. For [what they asked for],
> the right tool is [redirect target] — want me to switch to that?"

If the user insists they want a design brief for a Sales deliverable, ask:
> "Is this actually a web UI or interactive prototype that happens to be for
> a sales use case? If so, we'll route it through the Product lane with a
> brief. If it's a document, the design brief won't help — the doc generator
> will."

## Exception: MSM (Multimedia Sales & Marketing)

If the request is MSM-specific (client deployment guides, MSM-branded materials),
redirect to `msm-doc-generator` instead of `intinc-doc-generator`.
