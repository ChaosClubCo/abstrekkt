# Real Estate AI Context & Use Case Library

## Business context
This project belongs to a real estate professional who:
- Owns and operates a real estate business (residential)
- Coaches other real estate agents on AI adoption as an additional revenue stream
- Uses Claude via web interface (claude.ai) — no command-line tools or code
- Runs the Room Configurator during live property showings on iPad
- Is building AI fluency to become self-sufficient, not dependent on a consultant

The goal of AI in this business is: do more with less time, look more professional to clients, and teach other agents to do the same.

---

## Listing copy frameworks

### MLS description formula
Structure: Hook (neighborhood/lifestyle angle) → Key features (3–4 specifics) → Standout element → Call to action

Example template:
```
[NEIGHBORHOOD/LIFESTYLE HOOK — 1 sentence]. This [BEDS/BATHS] [PROPERTY TYPE] features [FEATURE 1], [FEATURE 2], and [FEATURE 3]. [STANDOUT DETAIL — the thing that makes this listing memorable]. [LOCATION NOTE — proximity to schools, transit, parks]. Schedule your showing today.
```

**Common triggers for stronger hooks:**
- Corner lot, cul-de-sac, end unit → "Rare [corner/cul-de-sac/end unit] location..."
- Recent reno → "Completely transformed [year]..."
- View → "Wake up to [lake/skyline/golf course] views..."
- Price per sq ft below market → "Priced $X below comparable [neighborhood] homes..."

### Social caption formula (Instagram/Facebook)
```
[LIFESTYLE HOOK — what it feels like to live here, 1 sentence]

✓ [Feature]
✓ [Feature]  
✓ [Feature]

[Address or neighborhood] | [Price] | [Beds/Baths]

Showing requests in bio / DM for details 🔑
```

---

## Client communication templates

### Buyer follow-up after showing
```
Subject: Thoughts on [ADDRESS]?

Hi [NAME],

Thanks for coming out to [ADDRESS] today. I wanted to check in while it's fresh.

Based on what you said you're looking for — [RECALL 1-2 STATED PRIORITIES] — here's my honest take: [1-2 sentences of your assessment].

A few things worth flagging:
- [PRO/CON 1]
- [PRO/CON 2]

Happy to pull comps if you want to see how it stacks up on price, or schedule a second look if it's still on your radar. Just let me know where your head's at.

[SIGNATURE]
```

### Seller objection: "Your commission is too high"
Talking points (adapt to your style):
- "The commission doesn't come out of your pocket — it comes out of the buyer's offer. What matters is what you net."
- "My job is to get you more for the home than you'd get by listing it at a lower commission with a lower-service agent. Let me show you what that difference looks like in this market."
- "I'm not asking you to pay for marketing — I'm asking you to invest in representation. Those are different things."

### Seller objection: "I want to start higher and drop if needed"
Talking points:
- "Overpriced listings get fewer showings in the first 14 days — that's the window when buyers are most engaged and most likely to waive contingencies."
- "A price reduction signals to the market that something is wrong. We don't want buyers asking what they missed."
- "The price I'm recommending isn't conservative — it's aggressive for what the market will bear right now, based on [COMP 1] at [PRICE] and [COMP 2] at [PRICE]."

### Price reduction conversation
```
Hi [NAME],

I've been watching the activity on [ADDRESS] and wanted to give you an honest update.

In [TIME PERIOD], we've had [X] showings and [Y] offers/inquiries. The feedback I'm consistently hearing is [SUMMARIZE THEMES — e.g., "buyers like the layout but feel the price is above the neighborhood"]. 

The market in [NEIGHBORHOOD/PRICE RANGE] is [DESCRIBE — e.g., "averaging 45 days on market at an 96% list-to-sale ratio"]. At our current price, we're competing with homes at [COMPARABLE ADDRESSES/PRICES].

My recommendation is to adjust to [PRICE]. That puts us [DESCRIBE POSITION — e.g., "as the best-priced [beds/baths] in the zip code right now"].

I know this isn't easy news. I want to make sure we get you the best outcome in the timeframe that works for your life. Can we talk this week?

[SIGNATURE]
```

---

## Showing prep checklist (Claude can fill this out for any listing)

**Before the showing:**
- [ ] Pull 3 recent comps (sold in last 90 days, same bed/bath, within 0.5 mi)
- [ ] Note: Days on market, price per sq ft, list-to-sale ratio
- [ ] Flag: anything unusual about the property (easements, HOA rules, known issues)
- [ ] Know: school district, utility costs if available, commute to [buyer's stated workplace]
- [ ] Prepare: 2-3 questions to ask the buyer to advance the conversation

**Buyer profile prompt for Claude:**
"My buyer is [describe: first-time buyer / investor / relocating / downsizing / upsizing]. They care most about [priority 1] and [priority 2]. Their budget is [range]. Give me 5 questions to ask them during this showing that help me understand if this is their house."

**Room configurator during the showing:**
Open the Room Configurator in Claude on your iPad. Set room dimensions (tap the sliders). Add the buyer's stated furniture needs. Show them how their pieces fit. Screenshot in Present Mode.

---

## Agent coaching content

### "Why should I use AI?" — talking points for skeptical agents
Real estate translation of common AI capabilities:

| What AI does | What that means for agents |
|---|---|
| Drafts copy fast | A listing description in 60 seconds, not 30 minutes |
| Adapts tone on request | Write for first-time buyers differently than investors, without starting over |
| Summarizes documents | Read a 40-page inspection report in 2 minutes |
| Answers questions | Research school districts, flood zones, utility providers without 5 browser tabs |
| Generates scripts | Objection responses, follow-up emails, offer cover letters — all in your voice |

### Workshop structure: "AI for Real Estate Agents" (1-hour version)
1. (10 min) What AI is not — dispel the anxiety (replacing agents, magic, always right)
2. (15 min) Three things it does better than you (speed on drafts, never tired, no ego about rewrites)
3. (20 min) Live demo — write a listing description together, start to finish
4. (10 min) The one habit that matters: use it before you write anything, not after you're stuck
5. (5 min) Q&A

### Common agent workshop questions and answers

**"What if it gets the facts wrong?"**
You're always the editor. AI drafts, you review. It's faster to fix a draft than to write from scratch. The same way you'd check a title commitment before closing — you check the copy before it goes live.

**"Isn't it obvious when AI writes something?"**
It is if you don't edit it. The goal isn't to send the AI's first draft — it's to get 80% of the work done in 20% of the time, then make it sound like you. One pass of editing on a good draft beats staring at a blank page.

**"My clients will think it's impersonal."**
Your clients care that you responded fast, that the information is accurate, and that the tone feels right. AI helps you do all three faster. They don't know or care how the sausage is made.

**"I'm not tech-savvy."**
You don't need to be. You talk to it the way you'd talk to an assistant: "Write a follow-up email to a buyer who toured a $350K townhome today and seemed interested but nervous about the price." That's it. No settings to configure.

---

## Market data prompts (Claude can help pull and contextualize)

**To analyze a neighborhood:**
"Explain what [ABSORPTION RATE / DAYS ON MARKET / LIST-TO-SALE RATIO] of [VALUE] means for a seller in [NEIGHBORHOOD] right now, in plain language I can share with a client."

**To frame a price:**
"I'm listing a [BEDS/BATHS/SQ FT] home in [NEIGHBORHOOD] at [PRICE]. The most recent comps are [COMP 1 at PRICE, COMP 2 at PRICE, COMP 3 at PRICE]. Write 3 sentences I can use to justify this price to a seller who thinks we should list $25K higher."

**To write a market update email:**
"Write a one-paragraph market update for [NEIGHBORHOOD/ZIP] that I can send to my past client list. The key point is [WHAT'S HAPPENING — e.g., inventory is down, rates shifted, prices are steady]. Tone: informative but not alarming."

---

## Room Configurator — furniture dimensions reference

Use these when setting up rooms during showings (approximate standard sizes):

| Item | Width | Depth |
|---|---|---|
| King bed | 2.1m / 7ft | 2.2m / 7.3ft |
| Queen bed | 1.6m / 5.3ft | 2.1m / 7ft |
| Sofa (standard) | 2.2m / 7.2ft | 0.95m / 3.1ft |
| Loveseat | 1.5m / 5ft | 0.9m / 3ft |
| Dining table (4-top) | 1.0m / 3.3ft | 1.0m / 3.3ft |
| Dining table (6-top) | 1.8m / 5.9ft | 1.0m / 3.3ft |
| Sectional | 2.8m / 9.2ft | 1.8m / 5.9ft |

Room configurator tip: Start with the largest piece (bed or sofa). Build outward. If it doesn't fit, show the buyer the next size down. This is more persuasive than telling them their furniture is too big.

---

## Hard rules for this project
- All deliverables are GUI/web — nothing that requires an app install or technical setup
- Art's name and identity are never shared externally in any case study or public content
- This engagement follows the champion model: the goal is Art becoming self-sufficient on these tools, not dependent on continued coaching
- Outputs are always in real estate language, not AI/tech language
