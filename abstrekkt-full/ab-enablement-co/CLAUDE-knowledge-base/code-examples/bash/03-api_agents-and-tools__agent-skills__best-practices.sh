// --- block 18 (lang: bash) ---
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md


// --- block 48 (lang: bash) ---
python scripts/analyze_form.py input.pdf > fields.json


// --- block 50 (lang: bash) ---
python scripts/validate_boxes.py fields.json
# Returns: "OK" or lists conflicts


// --- block 51 (lang: bash) ---
python scripts/fill_form.py input.pdf fields.json output.pdf


// --- block 53 (lang: bash) ---
   python scripts/pdf_to_images.py form.pdf
   