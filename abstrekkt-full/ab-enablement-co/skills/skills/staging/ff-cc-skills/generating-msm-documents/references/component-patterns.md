# MSM Component Patterns — docx-js Code Reference

All components use `const docx = require("docx");` with destructured imports.

---

## 1. Document Shell (Base Setup)

```javascript
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        ImageRun, Header, Footer, AlignmentType, LevelFormat,
        HeadingLevel, BorderStyle, WidthType, ShadingType,
        VerticalAlign, PageNumber, PageBreak, TabStopType } = require("docx");

// Load MSM logo
const logoBuffer = fs.readFileSync("SKILL_ASSETS_PATH/msm-logo.png");

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Rubik", size: 22 }, // 11pt body
        paragraph: { spacing: { after: 240, line: 320, lineRule: "exact" } }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { font: "Roboto Condensed Medium", size: 48, color: "00405F" },
        paragraph: { spacing: { before: 120, after: 240 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { font: "Roboto Condensed Medium", size: 40, color: "E27305" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { font: "Roboto Condensed Medium", size: 28, bold: true, color: "00405F" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 }
      },
      {
        id: "Heading4", name: "Heading 4", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { font: "Roboto Condensed Medium", size: 24, color: "00405F" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 3 }
      },
    ]
  },
  numbering: {
    config: [
      {
        reference: "msm-bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
      {
        reference: "msm-numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: { default: msmHeader(logoBuffer) },
    footers: { default: msmFooter() },
    children: [
      // Document content goes here
    ]
  }]
});
```

---

## 2. Header (with MSM Logo)

```javascript
function msmHeader(logoBuffer) {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new ImageRun({
            data: logoBuffer,
            transformation: { width: 112, height: 48 }, // ~1.17" x 0.5"
            type: "png",
            floating: {
              horizontalPosition: { relative: "leftMargin", offset: 400050 },
              verticalPosition: { relative: "topMargin", offset: 387985 },
              wrap: { type: "square", side: "right" },
              behindDocument: true,
              lockAnchor: true,
              allowOverlap: false,
            }
          }),
        ]
      }),
    ]
  });
}
```

---

## 3. Footer (2-Column: Address | Copyright + Page)

```javascript
function msmFooter() {
  const footerFont = { font: "Rubik", size: 16, color: "5391AA" }; // 8pt
  const noBorder = { style: BorderStyle.NONE, size: 0, color: "auto" };
  const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

  return new Footer({
    children: [
      new Paragraph({ children: [] }), // spacer
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
                   insideH: noBorder, insideV: noBorder },
        rows: [
          new TableRow({
            children: [
              // Left: address
              new TableCell({
                borders: noBorders,
                width: { size: 4680, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: [
                      new TextRun({ ...footerFont,
                        text: "175 Olde Half Day Rd, Ste #240  |  Lincolnshire, IL 60069  847.215.4900  |  www.msminc.com"
                      })
                    ]
                  })
                ]
              }),
              // Right: copyright + page
              new TableCell({
                borders: noBorders,
                width: { size: 4680, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                      new TextRun({ ...footerFont,
                        text: "Copyright \u00A9 2025  MSM Inc.  All rights reserved.    Page "
                      }),
                      new TextRun({ ...footerFont,
                        children: [PageNumber.CURRENT]
                      }),
                      new TextRun({ ...footerFont, text: " of " }),
                      new TextRun({ ...footerFont,
                        children: [PageNumber.TOTAL_PAGES]
                      }),
                    ]
                  })
                ]
              }),
            ]
          })
        ]
      })
    ]
  });
}
```

**Note**: The template uses a DATE field for dynamic year. In docx-js, hardcode the current year or use `new Date().getFullYear()`.

---

## 4. Callout Boxes (Single-Cell Tables)

```javascript
function calloutBox(type, bodyText) {
  const configs = {
    INFO:          { fill: "D6EAF8", color: "1A5276", emoji: "\u2139\uFE0F",  label: "INFO" },
    WARNING:       { fill: "FFF3CD", color: "856404", emoji: "\u26A0\uFE0F",  label: "WARNING" },
    BEST_PRACTICE: { fill: "D5F5E3", color: "1E8449", emoji: "\u2705",        label: "BEST PRACTICE" },
    CONTACT:       { fill: "D6EAF8", color: "1A5276", emoji: "\u260E\uFE0F",  label: "NEED HELP? CONTACT" },
  };
  const cfg = configs[type];
  const noBorder = { style: BorderStyle.NONE, size: 0, color: "auto" };

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: cfg.fill, type: ShadingType.CLEAR },
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            width: { size: 9360, type: WidthType.DXA },
            children: [
              // Title row
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: `${cfg.emoji} ${cfg.label}`,
                    bold: true, font: "Rubik Medium", size: 22, color: cfg.color,
                  }),
                ]
              }),
              // Body row
              new Paragraph({
                spacing: { after: 100 },
                children: [
                  new TextRun({
                    text: bodyText,
                    font: "Rubik", size: 21, color: cfg.color,
                  }),
                ]
              }),
            ]
          })
        ]
      })
    ]
  });
}
```

**Usage**:
```javascript
calloutBox("INFO", "This guide takes about 15 to 30 minutes to complete.")
calloutBox("WARNING", "If anything is missing, do not proceed. Contact Kyle immediately.")
calloutBox("BEST_PRACTICE", "Keep your desk tidy by routing cables behind the desk.")
calloutBox("CONTACT", "Email: kyle@intinc.com | Phone: ext. XXXX | Ticket Portal: FreshService URL")
```

---

## 5. Step Tables (4-Column Instructional)

```javascript
function stepTable(steps) {
  // steps = [{ num: "1", action: "...", expected: "...", fix: "..." }, ...]
  const headerBg = { fill: "1F4E79", type: ShadingType.CLEAR };
  const headerText = { bold: true, font: "Rubik Medium", size: 20, color: "FFFFFF" };
  const bodyText = { font: "Rubik", size: 20 };
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };
  const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

  // Column widths: # (600) | Action (3400) | Expected (2680) | Fix (2680) = 9360
  const colWidths = [600, 3400, 2680, 2680];

  const headerRow = new TableRow({
    children: ["#", "What to Do", "What You Should See", "Common Mistake / Fix"].map((text, i) =>
      new TableCell({
        shading: headerBg, borders, width: { size: colWidths[i], type: WidthType.DXA },
        margins: cellMargins,
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({ children: [new TextRun({ ...headerText, text })] })]
      })
    )
  });

  const dataRows = steps.map((step, idx) => {
    const rowBg = idx % 2 === 0
      ? { fill: "EBF5FB", type: ShadingType.CLEAR }
      : { fill: "FFFFFF", type: ShadingType.CLEAR };

    return new TableRow({
      children: [step.num, step.action, step.expected, step.fix].map((text, i) =>
        new TableCell({
          shading: rowBg, borders, width: { size: colWidths[i], type: WidthType.DXA },
          margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ ...bodyText, text,
            bold: i === 0 })] // Bold the step number
          })]
        })
      )
    });
  });

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows]
  });
}
```

**Usage**:
```javascript
stepTable([
  { num: "1", action: "Plug the dock's power cable into a wall outlet.",
    expected: "A small light on the dock turns on.",
    fix: "No light? Check that the outlet works." },
  { num: "2", action: "Connect USB-C cable from dock to laptop.",
    expected: "Laptop screen may flicker or show charging icon.",
    fix: "Wrong port? The oval plug only fits one shape." },
])
```

---

## 6. FAQ Blocks

```javascript
function faqBlock(question, answer) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [new TextRun({ text: `Q: ${question}`, bold: true, size: 22 })]
    }),
    new Paragraph({
      spacing: { after: 200 },
      indent: { left: 360 },
      children: [new TextRun({ text: `A: ${answer}`, size: 22, italics: true })]
    }),
  ];
}
```

---

## 7. Checklists (Categorized)

```javascript
function checklistSection(categoryTitle, items) {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      children: [new TextRun({ text: categoryTitle })]
    }),
    ...items.map(item =>
      new Paragraph({
        numbering: { reference: "msm-bullets", level: 0 },
        children: [new TextRun({ text: item, size: 22 })]
      })
    )
  ];
}
```

---

## 8. Plain Text Block (FreshService Copy/Paste)

```javascript
function plainTextBlock(title, content) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            shading: { fill: "F2F3F4", type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            width: { size: 9360, type: WidthType.DXA },
            children: content.split("\n").map(line =>
              new Paragraph({
                spacing: { after: 40, line: 280, lineRule: "exact" },
                children: [new TextRun({ text: line, font: "Consolas", size: 18 })]
              })
            )
          })
        ]
      })
    ]
  });
}
```

---

## 9. Image with Caption

```javascript
function imageWithCaption(imageBuffer, altText, captionText, widthInches = 6.04) {
  const widthEmu = Math.round(widthInches * 914400);
  const heightEmu = Math.round(widthEmu * 0.667); // 3:2 default ratio, adjust per image

  return [
    new Paragraph({
      children: [
        new ImageRun({
          data: imageBuffer,
          transformation: {
            width: Math.round(widthInches * 96), // pixels at 96dpi
            height: Math.round(widthInches * 96 * 0.667),
          },
          type: "png",
          altText: { title: altText, description: altText },
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 60, after: 240 },
      children: [new TextRun({ text: captionText, italics: true, size: 20, color: "585858" })]
    }),
  ];
}
```

---

## 10. Shot List Table

```javascript
function shotListTable(shots) {
  // shots = [{ num: "01", name: "...", angle: "...", mustShow: "...", fileName: "..." }, ...]
  const headerBg = { fill: "1F4E79", type: ShadingType.CLEAR };
  const headerText = { bold: true, font: "Rubik Medium", size: 18, color: "FFFFFF" };
  const bodyText = { font: "Rubik", size: 18 };
  const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  const borders = { top: border, bottom: border, left: border, right: border };
  const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

  // # (500) | Name (1800) | Angle (2000) | Must Show (2400) | Filename (2660) = 9360
  const colWidths = [500, 1800, 2000, 2400, 2660];
  const headers = ["#", "Shot Name", "Angle / Framing", "Must Be Visible", "File Name"];

  const headerRow = new TableRow({
    children: headers.map((text, i) =>
      new TableCell({
        shading: headerBg, borders, width: { size: colWidths[i], type: WidthType.DXA },
        margins: cellMargins,
        children: [new Paragraph({ children: [new TextRun({ ...headerText, text })] })]
      })
    )
  });

  const dataRows = shots.map((shot, idx) => {
    const rowBg = idx % 2 === 0
      ? { fill: "EBF5FB", type: ShadingType.CLEAR }
      : { fill: "FFFFFF", type: ShadingType.CLEAR };
    return new TableRow({
      children: [shot.num, shot.name, shot.angle, shot.mustShow, shot.fileName].map((text, i) =>
        new TableCell({
          shading: rowBg, borders, width: { size: colWidths[i], type: WidthType.DXA },
          margins: cellMargins,
          children: [new Paragraph({ children: [new TextRun({ ...bodyText, text })] })]
        })
      )
    });
  });

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows]
  });
}
```

---

## 11. Page Break

```javascript
new Paragraph({ children: [new PageBreak()] })
```

---

## 12. Section Divider (Deliverable Separator)

Use a combination of page break + H1 with a deliverable label:

```javascript
function deliverableDivider(label, title) {
  return [
    new Paragraph({ children: [new PageBreak()] }),
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: label, bold: true, size: 20, color: "838D93", font: "Rubik" })]
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: title })]
    }),
  ];
}
```

**Usage**: `deliverableDivider("DELIVERABLE B:", "Photo Pack Shot List")`

---

## Assembly Pattern

```javascript
// Build final document
const children = [
  // Cover / Title section
  ...titleSection("New Computer Setup", "Step by Step Guide"),

  // Intro paragraph
  new Paragraph({ children: [new TextRun({ text: "Welcome to your new work computer..." })] }),

  // Info callout
  calloutBox("INFO", "This guide takes about 15 to 30 minutes."),

  // Section heading
  new Paragraph({ heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text: "1. Before You Start" })] }),

  // Content...
  // Step table
  stepTable([...]),

  // Warning callout
  calloutBox("WARNING", "If anything is missing, contact Kyle immediately."),

  // Page break before next deliverable
  ...deliverableDivider("DELIVERABLE B:", "Photo Pack Shot List"),

  // Shot list table
  shotListTable([...]),
];

// Assemble and write
const doc = new Document({ /* ... full config ... */, sections: [{ children }] });
Packer.toBuffer(doc).then(buf => fs.writeFileSync("output.docx", buf));
```
