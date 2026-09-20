# Troubleshooting Guide

**For:** {{CLIENT_NAME}} team
**Written by:** Kyle Rosebrook — FlashFusion

Written for non-technical users. You do not need to understand how any of this works — just follow the steps.

---

## Problem 1 — Leads stopped coming in

**Symptoms:** No new rows in Google Sheet for 3+ days. No email notifications.

**Step 1:** Check that campaigns are still running.
- Log into Facebook Ads Manager (business.facebook.com)
- Look at your campaigns. Are they Active (green dot) or Off (grey)?
- If Off: someone paused them. Turn them back on.

**Step 2:** Check if ads are approved.
- Click into a campaign → Ad Sets → Ads
- Do any ads show "In Review" or "Rejected"?
- If Rejected: read the rejection reason. Email kyle@flashfusion.co with a screenshot.

**Step 3:** Check the automation.
- Log into [Zapier/n8n URL]
- Look for a red error on the "Lead Routing" automation
- If red: Email kyle@flashfusion.co with a screenshot. Do not try to fix it yourself.

**Step 4:** If nothing above is the problem.
- Submit a test lead on your own lead form to see if it processes
- If the test works: the system is fine — there may just be fewer people seeing the ad
- Email Kyle: "campaigns are running, no issues found, just low volume"

---

## Problem 2 — Leads in Google Sheet but no email notification

**Symptoms:** You see new rows in the Sheet but the email alert isn't arriving.

**Step 1:** Check your spam folder. Email notifications from automations sometimes land there.

**Step 2:** Check the automation.
- Log into [Zapier/n8n URL]
- Open the Lead Routing automation
- Look at the email step — is it showing errors?

**Step 3:** Check the email address.
- Is the notification going to the right email? (Should be {{CLIENT_CONTACT}}'s email)
- If not: Email kyle@flashfusion.co to update it.

---

## Problem 3 — Ad spend doubled overnight

**Symptoms:** You got a Facebook billing notification for an unusually large charge.

**Step 1:** Pause all campaigns immediately.
- Log into Ads Manager → click each campaign → toggle to Off
- Do this first, before investigating. You can turn them back on.

**Step 2:** Email kyle@flashfusion.co immediately with:
- A screenshot of your billing tab
- The date the spike started

**Do not:** Try to change budgets, delete campaigns, or dispute the charge before talking to Kyle.

---

## Problem 4 — Facebook rejected an ad

**Symptoms:** One or more ads shows "Rejected" in Ads Manager.

**Step 1:** Read the rejection reason.
- Click on the rejected ad → look for the rejection reason text

**Common reasons and fixes:**

| Rejection reason | What it means | Fix |
|-----------------|--------------|-----|
| "Exaggerated or unverifiable claims" | Copy uses "best," "guaranteed," "fastest" | Remove superlative words from headline or text |
| "Misleading business practices" | Something in the copy sounds like a scam | Review copy for anything that implies false urgency or fake discounts |
| "Landing page issues" | Form or website has a problem | Email Kyle — may need to check the lead form |
| "Personal attributes" | Copy implies you know personal info about the viewer | Remove phrases like "Are you a guitarist in Chicago?" |

**Step 2:** If the reason is listed above — make the fix and resubmit the ad.
**Step 3:** If unclear — email kyle@flashfusion.co with a screenshot of the rejection.

---

## Problem 5 — Can't log into Facebook Ads Manager

**Symptoms:** Your login isn't working or you've been logged out.

**Step 1:** Use the "Forgot Password" flow at business.facebook.com.

**Step 2:** If you think your account was hacked:
- Go to facebook.com/hacked
- Follow the account recovery steps
- Email kyle@flashfusion.co — do not make any changes to campaigns until the account is secured

---

## Problem 6 — Google Sheet is not updating

**Symptoms:** Leads are coming in (you can see them in Facebook Lead Center) but they're not appearing in the Sheet.

**Step 1:** Check the automation.
- Log into [Zapier/n8n URL]
- Look for errors on the Lead Routing automation
- Screenshot and email kyle@flashfusion.co

**Step 2:** Manually export leads as a backup while waiting for Kyle.
- Facebook Ads Manager → Lead Center → Download CSV
- Paste into the Google Sheet manually

---

## When to call vs. email

**Email kyle@flashfusion.co (response within 24hr):**
- Everything above that requires Kyle's involvement
- Questions about strategy, new campaigns, new promotions

**Handle yourself (covered in training):**
- Pausing a low-performing ad
- Updating copy text on a running ad
- Adjusting daily budget up or down by 20%
- Responding to leads in the CRM Sheet

**This is urgent — say so in subject line:**
- Unexpected large billing charge
- Account suspended or hacked
- All leads stopped for 5+ days with no explanation

---

## Quick reference: important links

| Resource | Link |
|---------|------|
| Facebook Ads Manager | business.facebook.com |
| Lead CRM Google Sheet | [link] |
| Automation dashboard | [link] |
| Monthly report template | [stored in Google Drive] |
| Kyle's email | kyle@flashfusion.co |
