# FULL PROJECT EXPORT PROTOCOL

You are about to perform a full project export. Do NOT generate placeholder content,
stubs, one-liners, or titles without bodies. Every file must contain the actual
content from this conversation — the real specs, code, diagrams, matrices, and text
that was produced here.

Follow this exact sequence:

---

STEP 1 — INVENTORY

List every artifact, deliverable, document, spec, diagram, code block, table,
architecture, and strategy produced in this entire conversation thread. Number them.
Do not skip anything. Include partial drafts.

Format:
[n] <title> — <one-sentence description of what it actually contains>

Do not proceed to Step 2 until the full inventory is listed and I confirm.

---

STEP 2 — EXTRACTION

For each item in the inventory, output the full content. No summarizing. No
truncating. If it was a table, output the full table. If it was code, output all
the code. If it was a spec, output every section.

Do this sequentially. If the content is long, paginate — do not skip sections.

Confirm when all items are extracted and I approve before Step 3.

---

STEP 3 — FILE STRUCTURE

Organize the extracted content into a logical directory structure:
- /architecture/
- /specs/
- /agents/
- /brand/
- /roadmaps/
- /code/
- /ux/
- /security/
- README.md (table of contents with file descriptions)

Map each inventory item to the correct directory. Show me the proposed tree.
Confirm before Step 4.

---

STEP 4 — PACKAGE

Use Python (code interpreter) to:
1. Create all files with their full content written to disk
2. Verify each file: open it, check byte count > 0, print filename + size
3. Reject any file under 100 bytes and rewrite it with correct content
4. zip -r flashfusion_export.zip ./flashfusion/
5. Provide a download link

Print the final file list with sizes before offering the download.

HARD RULES:
- Any file containing only a title, one sentence, or a category label = FAIL.
  Rewrite it before zipping.
- Do not invent content not present in this conversation.
- If content for an item is genuinely missing from the thread, write:
  MISSING: <item name> — not found in conversation history.
  Do not fabricate a substitute.
- Show me the Python output, not just the download link.

---

Begin Step 1 now.
