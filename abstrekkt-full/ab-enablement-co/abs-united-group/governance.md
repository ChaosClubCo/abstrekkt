# Governance — Data Rules & Verification

One page. Everyone reads it once. This is what keeps a small manufacturer with
government customers safe while moving fast.

## The data-training point (lead with this to Paul)
On Claude **Team**, your data is **not used to train models**. Confirm the opt-out is
active (Settings → Privacy) and document the date. For a company serving GSA/government,
this is the sentence that earns the founder's sign-off.

## What NEVER goes into Claude
- Customer PII from warranty/returns beyond what's needed (no full SSNs, payment card data)
- Anything export-controlled or marked government-sensitive under a specific contract
- Employee personal / HR records
- Supplier pricing under NDA

## The verification rule (non-negotiable)
Claude is the **analyst, not the source of truth.**
- Every spec, weight rating, part number, price, lead time, or warranty term Claude
  produces gets checked against the real source before it leaves the building.
- A wrong number in a GSA bid is a real problem. Government/bid work gets a second
  human read. Always.

## Memory & projects hygiene
- Keep work in the right project so context doesn't bleed between departments.
- Review project knowledge quarterly — remove stale specs and superseded price lists.

## Access
- 🔑 **NEEDS WORKSPACE OWNER** — seat assignment, org connectors, and skill distribution.
- Offboarding: when someone leaves, the Owner removes their seat. Tie this to United
  Group's existing offboarding step.
