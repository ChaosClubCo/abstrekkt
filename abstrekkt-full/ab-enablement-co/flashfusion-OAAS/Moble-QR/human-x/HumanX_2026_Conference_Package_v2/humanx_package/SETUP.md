# HumanX Assessment Tool — Setup & Deployment Guide
**INT Inc. | Kyle Rosebrook | Target deploy: week of March 10, 2026**

---

## OVERVIEW

What you're deploying:
- **Assessment Tool** (`HumanX_Assessment_Tool_v2.jsx`) — React app, Claude-powered, mobile-first
- **Supabase** — Lead capture database with RLS (anon = insert only)
- **AWS S3** — Backup sink, CMK-encrypted (optional but recommended)
- **Vercel** — Hosting + serverless, your existing account
- **QR Code** — Auto-generated from deploy URL, print-ready

Estimated setup time: **45–90 minutes** (first time). Supabase is the longest step.

---

## PREREQUISITES CHECKLIST

Before starting, confirm you have access to:

- [ ] Anthropic API key (claude.ai → Settings → API Keys)
- [ ] Supabase account (supabase.com — free tier sufficient)
- [ ] Vercel account (vercel.com — you have 31 projects, use same account)
- [ ] Node.js 18+ installed locally (`node --version`)
- [ ] npm or pnpm installed
- [ ] Git installed

---

## STEP 1 — Supabase Database Setup (~20 min)

### 1a. Create a new Supabase project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **New Project**
3. Name: `humanx-assessments`
4. Database password: generate a strong one and save it somewhere safe
5. Region: **US East (N. Virginia)** — closest to Moscone fallback, lowest latency
6. Click **Create new project** — takes ~2 minutes to provision

### 1b. Run the schema SQL

1. In your project, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `supabase_setup.sql` from this package
4. Paste the entire contents into the editor
5. Click **Run** (or Ctrl+Enter)
6. You should see: `Success. No rows returned`

### 1c. Verify the table and RLS

1. Go to **Table Editor** → you should see `assessments` table
2. Go to **Authentication** → **Policies** → select `assessments`
3. Confirm you see two policies:
   - `anon_insert_only` — FOR INSERT, TO anon
   - `auth_select_all` — FOR SELECT, TO authenticated
4. No UPDATE or DELETE policies should exist (intentional — append-only)

### 1d. Get your API credentials

1. Go to **Project Settings** → **API**
2. Copy two values:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public** key: `eyJ...` (long JWT — safe to expose in client code)
3. Save both — you'll add them as env vars in Step 3

---

## STEP 2 — Create the Next.js App (~15 min)

Open your terminal:

```bash
# Create the app
npx create-next-app@latest humanx-assessment \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd humanx-assessment
```

### 2a. Copy files from this package

```bash
# Core app files
cp /path/to/package/app/page.jsx          ./app/page.jsx
cp /path/to/package/app/api/assess/route.ts  ./app/api/assess/route.ts
cp /path/to/package/app/layout.tsx        ./app/layout.tsx

# Config + security files
cp /path/to/package/next.config.js        ./next.config.js
cp /path/to/package/.gitignore            ./.gitignore
cp /path/to/package/.env.example         ./.env.example
cp /path/to/package/public/robots.txt    ./public/robots.txt
```

Create the API directory if it doesn't exist:
```bash
mkdir -p app/api/assess
```

### 2b. Install dependencies

The component uses only React built-ins and `fetch` — no additional npm installs needed.

---

## STEP 3 — Environment Variables (~5 min)

Create `.env.local` in the project root:

```bash
touch .env.local
```

Add the following — replace placeholder values with yours:

```env
# Anthropic — NO NEXT_PUBLIC_ prefix (server-side only, never in browser bundle)
ANTHROPIC_API_KEY=sk-ant-...

# Supabase — anon key is safe to expose (RLS blocks reads from anon users)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Your Vercel deploy URL (update after Step 4)
NEXT_PUBLIC_ASSESSMENT_URL=https://humanx-assessment.vercel.app

# AWS backup (optional — see Step 5, server-side only)
AWS_BACKUP_URL=
```

> **Security architecture:**
> - `ANTHROPIC_API_KEY` — no `NEXT_PUBLIC_` prefix. Lives only on the server.
>   All Claude calls go through `/api/assess` (your own API route). Browser never
>   touches Anthropic directly — no 401s, no CORS, no key exposure.
> - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — intentionally public. RLS policies mean
>   anon users can only INSERT, never read other records.
> - `AWS_BACKUP_URL` — no `NEXT_PUBLIC_` prefix. Backup sink is called server-side.

---

## STEP 4 — Deploy to Vercel (~10 min)

### 4a. Push to GitHub first

```bash
cd humanx-assessment
git init
git add .
git commit -m "HumanX assessment tool v2"
gh repo create humanx-assessment --private --push --source=.
# or: git remote add origin https://github.com/yourname/humanx-assessment.git && git push -u origin main
```

### 4b. Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

Vercel will ask a few questions — accept all defaults. At the end you'll get a URL like:
`https://humanx-assessment-abc123.vercel.app`

### 4c. Add env vars to Vercel

```bash
vercel env add ANTHROPIC_API_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_ASSESSMENT_URL production
# Optional AWS backup (no NEXT_PUBLIC — server only)
vercel env add AWS_BACKUP_URL production
# Redeploy to pick up env vars
vercel deploy --prod
```

Or add them in the Vercel dashboard: Project → Settings → Environment Variables.

### 4d. Custom domain (optional but recommended)

If INT owns `intinc.ai` or `intinc.com`:
1. Vercel → Project → Settings → Domains
2. Add `assess.intinc.ai`
3. Add CNAME record at your DNS provider pointing to `cname.vercel-dns.com`
4. Propagation: 5–30 minutes

If not: use the `humanx-assessment-xxx.vercel.app` URL — still works fine.

---

## STEP 5 — AWS S3 Backup (Optional, ~20 min)

Skip this if you just want Supabase. The assessment tool writes to S3 silently
only if `NEXT_PUBLIC_AWS_BACKUP_URL` is set.

### 5a. Create S3 bucket

```bash
aws s3api create-bucket \
  --bucket int-humanx-assessments \
  --region us-east-1

# Enable default KMS encryption
aws s3api put-bucket-encryption \
  --bucket int-humanx-assessments \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms"
      }
    }]
  }'
```

### 5b. Create Lambda + API Gateway

In AWS Console → Lambda → Create function:
- Runtime: Node.js 20.x
- Handler: index.handler

Paste this as the function code:

```javascript
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client({ region: "us-east-1" });

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body);
    const key = `assessments/${new Date().toISOString().split("T")[0]}/${body.session_id}.json`;

    await s3.send(new PutObjectCommand({
      Bucket: "int-humanx-assessments",
      Key: key,
      Body: JSON.stringify({ ...body, saved_at: new Date().toISOString() }),
      ContentType: "application/json",
      ServerSideEncryption: "aws:kms",
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
  }
};
```

Add API Gateway trigger → HTTP API → copy the invoke URL → add to Vercel env:
```bash
vercel env add NEXT_PUBLIC_AWS_BACKUP_URL production
# value: https://xxxx.execute-api.us-east-1.amazonaws.com/prod/capture
```

---

## STEP 6 — n8n Lead Notifications (~10 min)

Get a Slack/email ping every time someone completes an assessment.

### 6a. In n8n, create a new workflow

**Trigger:** Webhook node
- Method: POST
- Copy the webhook URL (looks like: `https://krosebrook.app.n8n.cloud/webhook/humanx-lead`)

**Node 2:** IF node
- Condition: `{{ $json.consent }}` equals `true`
- True branch → Slack DM to Kyle
- False branch → Log only (no PII)

**Slack message template (true branch):**
```
🎯 *New HumanX Lead*
*Company:* {{ $json.contact_company }}
*Name:* {{ $json.contact_name }}
*Role:* {{ $json.contact_role }}
*Email:* {{ $json.contact_email }}

*Score:* {{ $json.overall_score }}/100
*Risk:* {{ $json.risk_level }}
*Shadow IT:* {{ $json.shadow_it }}
*Cloud:* {{ $json.cloud_platform }}
*Tenants:* {{ $json.tenant_count }}
```

**False branch message:**
```
📊 Anonymous assessment completed
Score: {{ $json.overall_score }}/100 | Risk: {{ $json.risk_level }} | Shadow IT: {{ $json.shadow_it }}
```

### 6b. Add the webhook to Supabase (Database Webhook)

1. Supabase → Database → Webhooks → Create webhook
2. Name: `n8n_lead_notify`
3. Table: `assessments`
4. Events: `INSERT`
5. URL: your n8n webhook URL
6. HTTP Method: POST
7. Save

Now every INSERT fires n8n → Slack. No polling, real-time.

---

## STEP 7 — QR Code & Print Materials (~5 min)

1. Open `HumanX_QR_Code.html` in any browser
2. Paste your final deploy URL into the URL editor at the top
3. Click **Update QR** — all three QR variants refresh instantly
4. Click **Print All Cards**
5. Print settings:
   - Paper: Letter or A4
   - Scale: Fit to page
   - Background graphics: ON (important for dark card)
   - Margins: Minimum

**For the conference:**
- Print dark cards on matte cardstock (Staples same-day, ~$0.20/card)
- Print the booth banner on glossy photo paper or have Staples print it as an 8.5×11 flyer
- Laminate if you want it to survive 4 days

---

## STEP 8 — Pre-Conference Testing Checklist

Run through this the week before (March 30 – April 5):

### Functional
- [ ] Load `assess.intinc.ai` on your iPhone — full wizard works
- [ ] Load on Android (borrow one) — full wizard works
- [ ] Complete a test assessment — results render correctly
- [ ] Check Supabase Table Editor — test row appears
- [ ] Check n8n — Slack notification received
- [ ] Try with name/email filled + consent checked — PII appears in row
- [ ] Try skipping contact form — row saves with `consent: false`, no PII columns

### Edge cases
- [ ] Turn off WiFi on phone, load the app — does it fail gracefully?
- [ ] Submit with all "Not sure" / "None yet" answers — results still generate
- [ ] Submit with the worst-case Shadow IT answer — CRITICAL badge appears in results
- [ ] QR code scans correctly on both iOS and Android cameras

### Backup plan (Moscone WiFi is unreliable with 5,000 people)
- [ ] Download the app URL to Offline mode on your phone before leaving the hotel
- [ ] Have the Contact Tracker HTML open in a browser tab as fallback for manual capture
- [ ] Know your Supabase project URL by heart in case you need to check manually

---

## STEP 9 — Conference Day Setup

**Morning of April 6:**
1. Open `HumanX_Leads_Dashboard.html` on your laptop — leave it open
2. Add your Supabase URL + anon key when prompted — you'll see live captures
3. QR code printed card on the table, QR on your phone lock screen
4. Test scan yourself one more time

**During conversations:**
- Offer to scan for them: *"Scan this, takes 90 seconds, I'll pull up your results"*
- Or demo on your phone and hand it over at Q2
- The dashboard on your laptop shows scores coming in real time

---

## COST SUMMARY

| Item | Cost | Notes |
|------|------|-------|
| Claude API (100 assessments) | ~$6–15 | Sonnet 4, ~1.5K tokens per call |
| Supabase | $0 | Free tier (500MB, 50K rows) |
| Vercel | $0 | Free tier (100GB bandwidth) |
| AWS S3 (optional) | ~$0.01 | 100 JSON files |
| QR code service | $0 | api.qrserver.com, no key needed |
| Print (20 cards + 2 banners) | ~$8–15 | Staples same-day |
| **Total** | **~$15–30** | |

---

## TROUBLESHOOTING

**QR code scans but nothing loads**
→ Check that Vercel deploy succeeded: `vercel logs --prod`
→ Check env vars are set: `vercel env ls`

**Assessment generates but Supabase INSERT fails**
→ Open browser DevTools → Network → find the failing request
→ Common cause: RLS policy not created correctly — re-run `supabase_setup.sql`
→ Check: Supabase → Authentication → Policies → assessments table

**Claude API returns 401**
→ API key is wrong or expired — regenerate at console.anthropic.com
→ If using `NEXT_PUBLIC_` prefix, make sure you redeployed after adding the env var

**n8n webhook not firing**
→ Supabase → Database → Webhooks → check webhook is enabled and pointing to correct URL
→ Test manually: Supabase → Table Editor → insert a test row

**Slow response on conference WiFi**
→ Moscone WiFi degrades under load — this is expected
→ Claude API call is the bottleneck (~3–6 seconds) — processing animation covers it
→ Hotspot from your phone if WiFi is unusable

---

## SUPPORT

All source files in this package:
- Assessment tool: `HumanX_Assessment_Tool_v2.jsx`
- Database schema: `supabase_setup.sql`
- QR cards: `HumanX_QR_Code.html`
- Lead dashboard: `HumanX_Leads_Dashboard.html`
- SPIN scripts: `HumanX_SPIN_Scripts.md`

*Built by Claude for Kyle Rosebrook, INT Inc. | February 2026*
