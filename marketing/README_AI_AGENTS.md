# Hugonomy Marketing Intelligence Layer — AI Agent Instructions
# Repo: https://github.com/TNL-Origin/hugonomy-website | Branch: main

## Cold-start resume command
At the start of any new session, Jo will say:
> "Read marketing/README_AI_AGENTS.md and resume."

Read this file first. It is the canonical source. No prior session memory required.

---

## What this is
One central CSV that tracks every Hugonomy marketing experiment across all platforms.
One row = one post or experiment. GitHub is the system of record — not any individual AI.

**Repo:** `https://github.com/TNL-Origin/hugonomy-website`
**Branch:** `main`
**Folder:** `marketing/`

```
marketing/
├── marketing_experiments_master.csv   ← THE LEDGER (one row per experiment)
├── README_AI_AGENTS.md                ← this file — canonical source for all AIs
└── generate_ledger_xlsx.py            ← run locally to produce a formatted .xlsx
```

---

## AI responsibilities

| Agent | Role | Can write to CSV? |
|-------|------|-------------------|
| **Copilot** | Reads analytics pages, normalizes raw metrics into schema rows | No — hands row to Claude or Jo |
| **Claude (mClaude)** | Primary writer. Appends rows, commits, pushes. Governance. | YES — primary |
| **Chamlin (ChatGPT)** | Strategy, funnel analysis, trend detection, weekly reports. Backup writer if Claude is unavailable. | YES — backup |
| **Gemini** | Creative scoring — hook, thumbnail, pacing. Writes Notes_Gemini. | No — sends notes to Claude to append |
| **Jo** | Final authority. Adds Notes_Human, sets Decisions, approves experiments. | Via Claude or Chamlin |

**Sovereignty principle:** Claude is primary writer. Chamlin writes directly if Claude (Anthropic) is unavailable for any external reason. CSV format — no vendor lock-in. Any AI with GitHub access can maintain the ledger.

---

## Workflow (every new experiment)

1. Jo opens platform analytics page in Edge/Chrome
2. Jo tells Copilot: *"Read this page and extract the metrics"*
3. Copilot outputs a structured row matching the schema below
4. Jo pastes the row to Claude or Chamlin
5. Writing AI appends the row to `marketing_experiments_master.csv`, commits, pushes
6. All AIs read from the same GitHub file for analysis and strategy

---

## Commit message convention

```
marketing: add [ExperimentID] — [Platform] [ContentTitle]
```

Examples:
```
marketing: add TT-009 — TikTok "Fluency Trap Remix — Student Version"
marketing: add LI-001 — LinkedIn "Don't Outsource Your Mind launch post"
marketing: update TT-001 — add Saves + RetentionRate from Copilot pull
```

Always append — never overwrite existing rows. Keep blank platform-placeholder rows at the bottom.

---

## CSV schema (28 columns)

```
ExperimentID      — Format: TT-001, LI-001, FB-001, EMAIL-001, CWS-001
Date              — YYYY-MM-DD
Platform          — TikTok | LinkedIn | Facebook | MailerLite | ChromeWebStore
ChannelType       — Organic | Paid | Owned | Partnership
ContentTitle      — Short human-readable title
ContentURL        — Direct link to the live post
HookType          — Problem-Agitate | Identity | Question-Challenge | Bold-Claim | Transformation | Philosophical | Announcement
PrimaryGoal       — Awareness | Conversion | Retention | Engagement
Hook              — Verbatim hook text (first 3 seconds or first line)
CoreMessage       — The main argument or claim
CTA               — Call to action shown (e.g. "Visit hugonomy.com/shape")
TargetAudience    — Who this was aimed at
Views             — Raw view count
Impressions       — Impressions (if platform separates from Views)
WatchTime         — Average watch time (seconds or mm:ss)
RetentionRate     — % retention (e.g. "42%")
Likes             — Count
Comments          — Count
Shares            — Count
Saves             — Count
ProfileVisits     — Count attributed to this post
WebsiteClicks     — Clicks to hugonomy.com or /shape
ExtensionInstalls — Attributed CWS installs
WaitlistSignups   — /shape form submissions attributed to this post
Notes_Human       — Jo's interpretation and context
Notes_Gemini      — Gemini creative scoring (hook, thumbnail, pacing)
Notes_Claude      — Claude governance or architecture notes
Decision          — Scale | Repeat | Remix | Investigate | Kill (+ one-line rationale)
```

### Decision definitions
| Decision | Meaning |
|----------|---------|
| **Scale** | Top performer in its lane. Make more like this immediately. |
| **Repeat** | Solid signal. Replicate format with minor variation. |
| **Remix** | Core concept works but execution needs a change (pacing, hook, delivery). |
| **Investigate** | Anomalous engagement signal. Read comments, understand who it reached before deciding. |
| **Kill** | Format or framing does not work on this platform. Do not repeat. |

---

## Copilot row-extraction prompt (standard)

Jo gives Copilot this prompt when on a platform analytics page:

> "Read this page and extract the metrics. Output a structured row for marketing_experiments_master.csv using these columns: ExperimentID, Date, Platform, ChannelType, ContentTitle, ContentURL, HookType, PrimaryGoal, Hook, CoreMessage, CTA, TargetAudience, Views, Impressions, WatchTime, RetentionRate, Likes, Comments, Shares, Saves, ProfileVisits, WebsiteClicks, ExtensionInstalls, WaitlistSignups. Leave blanks for anything not shown on the page."

---

## Governance rules (apply to this file and all marketing data)

- IP HARD LINE: No references to IP filings, application numbers, filing agencies, or pending-application claims anywhere in this folder (see HUGONOMY_LESSONS_LEARNED.md 2026-05-14)
- No API keys, tokens, or credentials in any marketing file
- This folder is public-safe — treat all content as visible to the Chrome Web Store reviewer and the general public
- Notes_Human is Jo's sovereign interpretation — do not overwrite it; only Jo edits that column
- Decisions are set by Jo or confirmed by Jo — AIs may propose, Jo finalizes
- When in doubt about a row: append and flag, do not skip

---

## Current experiment count (as of 2026-06-30)

- TT-001 through TT-008 (8 TikTok organic posts, pre-populated with views/likes/comments)
- LI-001, LI-002, FB-001, EMAIL-001 (blank rows, ready for data)
- Gaps: Saves, Impressions, RetentionRate, ProfileVisits, WebsiteClicks pending Copilot pull

---

*Last updated: 2026-06-30 by mClaude (Claude Sonnet). Update this file whenever the schema or workflow changes.*
