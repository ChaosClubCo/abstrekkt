# Freelancer Business OS - Notion Template Structure

## Database Architecture (Build This in Notion)

### 1. **Clients Database** (Master Hub)
**Properties:**
- Name (Title)
- Status (Select): Lead, Active, Completed, Inactive
- Contact Email (Email)
- Phone (Phone)
- Project Count (Rollup from Projects DB)
- Total Revenue (Rollup from Invoices DB)
- Last Contact (Date)
- Notes (Rich Text)
- Tags (Multi-select): High-Priority, Long-term, One-off

**Views:**
- Active Clients (Filter: Status = Active)
- Pipeline (Filter: Status = Lead, Sort: Last Contact)
- Top Revenue (Sort: Total Revenue DESC)

---

### 2. **Projects Database**
**Properties:**
- Project Name (Title)
- Client (Relation → Clients DB)
- Status (Select): Planning, In Progress, Review, Completed
- Start Date (Date)
- Deadline (Date)
- Budget (Number, $)
- Actual Hours (Rollup from Time Tracker DB)
- Files (Files & Media)
- Description (Rich Text)

**Views:**
- Active Projects (Filter: Status = In Progress)
- This Week (Filter: Deadline within 7 days)
- By Client (Group by: Client)
- Calendar (Timeline view)

---

### 3. **Invoices Database**
**Properties:**
- Invoice # (Title, Formula: "INV-" + ID)
- Client (Relation → Clients DB)
- Project (Relation → Projects DB)
- Amount (Number, $)
- Status (Select): Draft, Sent, Paid, Overdue
- Issue Date (Date)
- Due Date (Date)
- Payment Date (Date)
- Notes (Rich Text)

**Views:**
- Outstanding (Filter: Status = Sent OR Overdue)
- This Month (Filter: Issue Date within current month)
- Paid (Filter: Status = Paid, Sort: Payment Date DESC)

---

### 4. **Time Tracker Database** (Optional but valuable)
**Properties:**
- Task (Title)
- Project (Relation → Projects DB)
- Date (Date)
- Hours (Number)
- Billable (Checkbox)
- Notes (Rich Text)

**Views:**
- This Week (Filter: Date within 7 days)
- By Project (Group by: Project)
- Unbilled Hours (Filter: Billable = Yes, linked Invoice = empty)

---

### 5. **Financial Dashboard Database**
**Properties:**
- Month (Title, Format: "2025-01")
- Total Income (Rollup from Invoices: SUM where Status = Paid)
- Total Expenses (Number, manual entry)
- Net Profit (Formula: Income - Expenses)
- Active Projects (Rollup from Projects: COUNT where Status = Active)
- New Clients (Number, manual)

**Views:**
- Current Year (Filter: Month starts with "2025")
- Profitability Chart (Table → Export for analysis)

---

## Page Structure (Notion Hierarchy)

```
🏠 Freelancer Business OS (Main Dashboard)
├── 📊 Overview (Embed: Charts + Quick Stats)
│   ├── This Month Revenue: [Rollup]
│   ├── Active Projects: [Inline DB filtered view]
│   ├── Overdue Invoices: [Inline DB filtered view]
│   └── This Week Time Log: [Inline DB filtered view]
│
├── 👥 Clients (Full-page DB)
│   └── [All views: Active, Pipeline, Top Revenue]
│
├── 📁 Projects (Full-page DB)
│   └── [All views: Active, This Week, By Client, Calendar]
│
├── 💰 Invoices (Full-page DB)
│   └── [All views: Outstanding, This Month, Paid]
│
├── ⏱️ Time Tracker (Full-page DB)
│   └── [All views: This Week, By Project, Unbilled]
│
├── 📈 Financials (Full-page DB)
│   └── Monthly breakdown + Charts
│
├── 📚 Resources (Toggle blocks)
│   ├── 📄 Proposal Templates (3 pre-written)
│   ├── 📧 Email Templates (Welcome, Invoice, Follow-up)
│   ├── ✅ Onboarding Checklist (Template button)
│   └── 📝 Contract Template (Editable)
│
└── ⚙️ Settings & Instructions
    ├── How to Use This Template
    ├── Customization Guide
    └── FAQ

```

---

## Build Timeline

**Day 3 (4 hours):**
- Create 5 databases in Notion
- Set up basic properties
- Link relations between DBs

**Day 4 (3 hours):**
- Build all filtered views
- Add formulas & rollups
- Create dashboard page with embedded views

**Day 5 (3 hours):**
- Write 3 proposal templates
- Write 5 email templates (welcome, invoice reminder, project update, follow-up, thank you)
- Create onboarding checklist (template button)
- Polish aesthetics (icons, covers, spacing)

---

## Quality Checklist (Before Launch)

- [ ] All databases linked correctly (test: add dummy client → project → invoice)
- [ ] Formulas calculate properly (Invoice #, Net Profit, etc.)
- [ ] Rollups display accurate counts/sums
- [ ] Mobile responsive (check on phone)
- [ ] Template instructions clear (test with someone unfamiliar)
- [ ] No broken links
- [ ] Duplicate template → test in fresh workspace
- [ ] Screenshots ready (6-8 high-quality images)

---

## Notion-Specific Tips

**Use Template Buttons:**
- "New Client" button (pre-fills template)
- "New Invoice" button (auto-increments invoice #)
- "Weekly Review" button (creates review page)

**Aesthetic Elements:**
- Consistent icon set (e.g., all emojis or all Notion icons)
- Cover images (use Unsplash integration)
- Callout blocks for instructions (colored backgrounds)
- Dividers between sections

**Performance:**
- Keep inline DBs to <50 items on dashboard (use filters)
- Archive completed projects after 90 days (via Status change)

---

## MVP vs Full Version

**For 7-Day Launch (MVP):**
Build: Clients, Projects, Invoices, Dashboard
Skip: Time Tracker (add in v2 after first sales)

**Full Version (v2 - Week 2):**
Add: Time Tracker, Financial Dashboard, more templates

This lets you launch faster while still delivering core value.

---

**Next:** Once built, duplicate as template → upload to Gumroad with screenshots & description
