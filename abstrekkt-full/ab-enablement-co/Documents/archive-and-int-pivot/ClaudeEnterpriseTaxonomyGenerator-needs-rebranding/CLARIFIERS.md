# 3 Critical Clarifiers Before Final Delivery

## Clarifier 1: Role Grouping Strategy
**Question:** How should we **organize the 15 roles** in the interactive system?

**Current structure:** Separated by type (Internal 8 → External 6) + Advisory 1

**Option A: Combine by Function (Recommended)**
```
Executive Leadership (CEO, CFO, COO, VP HR, VP Client Services)
Engineering & Security (Staff, AppSec, Platform, Senior, Mid, Junior)
Product, Finance & Operations (PM, Financial Analyst, Marketing)
Sales & Customer Success (Sales Manager, CS Manager, Sales Rep, CS Support)
Contractors & Partners (Engineer, Agency, Reseller, Advisor)
```
**Pros:** Users find roles by job function, not employment type. Easier navigation.
**Cons:** Need toggle to filter Internal vs. External within each category.

**Option B: Keep Current (Internal → External → Advisory)**
**Pros:** Clear distinction: employees vs. contractors vs. advisors
**Cons:** May have to scroll far to find related roles (e.g., Senior Engineer vs. Contractor Engineer side-by-side)

**Option C: Hybrid (Department First, Then Level)**
```
Technology Department
  ├─ Staff Engineer (Internal)
  ├─ AppSec Engineer (Internal)
  ├─ Platform Engineer (Internal)
  ├─ Senior Engineer (Internal)
  ├─ Mid Engineer (Internal)
  ├─ Junior Engineer (Internal)
  └─ Contractor Engineer (External)

Finance & Operations Department
  ├─ VP Finance (Internal)
  ├─ Financial Analyst (Internal)
  └─ (No external variant)

Executive Leadership
  ├─ CEO (Internal)
  ├─ VP Finance (Internal)
  ├─ ...
  └─ Advisory Board Members (External)
```
**Pros:** Mirrors real org chart. Natural comparison (Senior vs. Contractor in same dept).
**Cons:** Slightly more complex navigation.

**What's your preference? A / B / C?**

---

## Clarifier 2: Auto-Recommend Variables & Defaults
**Question:** Which **editable fields** should be **pre-filled vs. left blank**?

**Current approach:** Some fields pre-filled (AWS CloudTrail, VPC isolation); others blank (custom integrations).

**Option A: Pre-Fill Enterprise Defaults (Recommended for Intinc)**
```
AppSec Engineer's AWS Implementation (auto-filled):
  "AWS Security Hub, CloudTrail (6-year retention), 
   AWS Secrets Manager (KMS-encrypted), 
   VPC isolation, least-privilege IAM"
```
Users can edit but have a starting point. Great for enterprise orgs.

**Option B: All Blank (Maximum Flexibility)**
```
Users fill everything in. Forces intentional decisions.
Takes longer but prevents "copy-paste defaults."
```

**Option C: Smart Pre-Fill (Different by Role Type)**
- **Internal roles (Staff, AppSec, PM):** Pre-filled with Intinc best practices
- **External roles (Contractor, Advisor):** Mostly blank (case-by-case)

**Also: Should we include a "Copy from similar role" button?**
- Example: New hire as "Senior Engineer"? → Copy config from existing Senior Engineer?

**What's your preference? A / B / C? + Copy button Y/N?**

---

## Clarifier 3: Output & Deployment Format
**Question:** **Who uses this system** and **how**?

**Scenario A: IT/Security Team Manual Setup (Most Common)**
- IT admin views role config → manually creates Claude Team/Enterprise workspace
- Distributes links + instructions to new hires
- **Output needed:** Export as JSON/Markdown/PDF for IT ticketing system
- **Frequency:** Manual per new hire (~1-2/month?)

**Scenario B: Automated Integration (Advanced)**
- New hire joins → LDAP/AD auto-detects role
- Role config auto-applies via Anthropic API + SCIM provisioning
- **Output needed:** API-ready JSON + SCIM schema
- **Timeline:** 3-6 months out (Anthropic expanding SCIM support)

**Scenario C: Self-Service (Employee Portal)**
- Employee logs in → sees their assigned role → reads config → optional Claude setup
- Like onboarding software (Lattice, Guidepoint)
- **Output needed:** Embeddable HTML + mobile-friendly design

**Which scenario fits Intinc best?**
- **A (Manual):** "IT controls all Claude access"
- **B (Automated):** "We want Slack-like auto-provisioning"
- **C (Self-Service):** "Employees self-onboard + IT reviews"
- **Hybrid (A→B roadmap):** "Start manual, evolve to automated"

**Also: Who owns/maintains this system after today?**
- IT team? Security team? HR team? You (Kyle) as staff engineer?

---

## Summary Table

| Clarifier | Option A | Option B | Option C |
|---|---|---|---|
| **1. Role Organization** | Combine by function | Keep internal/external separate | Hybrid: department + level |
| **2. Auto-Fill Defaults** | Pre-filled (enterprise best practices) | All blank (maximum flexibility) | Smart (internal filled, external blank) + copy button? |
| **3. Deployment** | Manual (IT controls) | Automated (LDAP/SCIM integration) | Self-service employee portal |

---

## Next Steps (After You Answer)

Once you clarify:
1. I'll **reorganize the interactive HTML** (final v2.2)
2. I'll **add/adjust export formats** (JSON, SCIM schema, PDF, etc.)
3. I'll **create IT runbooks** for deployment scenario you choose
4. System ready for **Intinc team rollout** (5-10 pilot users first)

