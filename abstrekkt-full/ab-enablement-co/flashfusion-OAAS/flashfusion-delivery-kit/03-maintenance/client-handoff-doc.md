# Client Handoff Document

**Client:** {{CLIENT_NAME}}
**Prepared by:** Kyle Rosebrook — FlashFusion
**Handoff date:** {{HANDOFF_DATE}}
**90-day support ends:** {{SUPPORT_END_DATE}}
**Support email:** kyle@flashfusion.co

This document is everything you need to run your Facebook ad system independently.
Keep it somewhere safe. If your team member changes, give them this document and have them complete the training sessions.

---

## What was built

| Component | Description | Where it lives |
|-----------|-------------|----------------|
| Facebook Campaigns | {{CLIENT_LOCATIONS}} campaigns targeting local customers | Facebook Ads Manager |
| Lead Forms | Instant forms capturing name, email, phone, service need | Inside each campaign |
| Lead CRM | Google Sheet receiving every form submission automatically | [link to Google Sheet] |
| Follow-up Automation | 3-message email sequence sent to every new lead | [Zapier/n8n — automation name] |
| Email Notification | Alert to {{CLIENT_CONTACT}} for every new lead | Sent to: [email] |

---

## Account access — save these

| Platform | URL | Login | Who has access |
|---------|-----|-------|---------------|
| Facebook Ads Manager | business.facebook.com | [client login] | {{CLIENT_CONTACT}} (Admin), Kyle (Partner) |
| Facebook Business Manager | business.facebook.com/settings | [client login] | {{CLIENT_CONTACT}} (Admin) |
| Google Sheet CRM | [URL] | [client Google account] | {{CLIENT_CONTACT}}, {{OPERATOR_NAME}} |
| Zapier/n8n Automation | [URL] | [client login or Kyle's account] | Kyle (notify Kyle if this needs to change) |

**Action before support ends:** Change Facebook Business Manager password and remove Kyle's Partner access if desired. Kyle will not have access after {{SUPPORT_END_DATE}} unless re-invited.

---

## Campaign settings reference

### Campaign 1 — {{CLIENT_NAME}} Chicago
- Campaign ID: ___
- Ad Account: ___
- Daily budget: $___/day
- Targeting: 10-mile radius from [address], ages 25–65, interests: guitar, music, live music
- Active ads: [list ad names]
- Lead form: [form name]

### Campaign 2 — {{CLIENT_NAME}} Palatine
- Campaign ID: ___
- Daily budget: $___/day
- Targeting: 10-mile radius from [address], ages 25–65
- Active ads: [list]
- Lead form: [form name]

### Campaign 3 — {{CLIENT_NAME}} Downers Grove
- Campaign ID: ___
- Daily budget: $___/day
- Targeting: 10-mile radius from [address], ages 25–65
- Active ads: [list]
- Lead form: [form name]

---

## Monthly tasks (takes about 30 min/month)

1. **Fill out the monthly report** (first Monday of each month)
   - Log into Ads Manager → Columns: Performance → date range: last month
   - Copy leads, spend, CPL into the monthly report template
   - Note any ads that were paused or changed during the month

2. **Check the Google Sheet** (weekly)
   - New leads should appear automatically
   - Mark each lead as Contacted / Quoted / Won / Lost in column G
   - Any lead unmarked for more than 3 days — follow up

3. **Refresh ad copy** (quarterly, or when CPL rises above $30 for 2 weeks)
   - Use the ad copy prompt library to generate 3 new variations
   - Pause the lowest-performing current ad
   - Publish one new variation per ad set

---

## What healthy looks like

| Metric | Target | Watch out if |
|--------|--------|-------------|
| Cost per lead (CPL) | $5–$20 | Above $40 for 2+ weeks |
| Leads per month | {{BENCHMARK_METRIC}} | Below half the target for 30+ days |
| Ad spend | Within 10% of budget | Sudden 2× spike (check for duplicated campaigns) |
| Lead form completion rate | > 30% | Below 15% (form may have too many questions) |
| Lead response rate | > 50% within 24 hr | Below 30% (follow-up automation may be broken) |

---

## When to email Kyle (within 90-day support period)

Email kyle@flashfusion.co for:
- Ads rejected by Facebook without explanation
- Unexpected spend spike (2× or more of normal daily)
- Zero leads for 5+ consecutive days
- Broken automation (leads not appearing in Google Sheet)
- Wanting to add a new location or campaign

Handle yourself (covered in training):
- Pausing and duplicating ads
- Updating copy text
- Adjusting budget up or down by 20%
- Reading and filing the monthly report
- Responding to leads in the CRM

---

## After 90-day support ends

{{SUPPORT_END_DATE}} — Kyle's included support period ends.

Options after that date:
1. **Continue independently** — you have everything you need in this document
2. **Build+coach retainer** — $350/mo for monthly advisory call + priority email
3. **Build+managed retainer** — $650/mo for Kyle to run everything

Contact kyle@flashfusion.co to discuss any of these.

---

## Emergency: system is broken and I can't reach Kyle

1. **Ads spending but no leads:** Pause all campaigns immediately in Ads Manager. Email Kyle.
2. **Leads not appearing in Google Sheet:** Check Zapier/n8n — look for a red error status on the automation. Email Kyle with a screenshot.
3. **Ads rejected:** Read the rejection reason in Ads Manager. Common fix: remove superlative claims ("best", "cheapest") from copy. Email Kyle if unclear.
4. **Account suspended:** Do not try to appeal without Kyle's guidance. Email Kyle immediately.
