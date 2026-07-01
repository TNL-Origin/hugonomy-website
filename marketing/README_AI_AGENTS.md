# Hugonomy Marketing Intelligence Layer — AI Agent Instructions

## What this folder is
One central CSV (`marketing_experiments_master.csv`) that tracks every marketing experiment across all platforms. One row = one post/experiment.

## Who does what

| Agent | Role | Write to CSV? |
|-------|------|---------------|
| **Copilot** | Reads analytics pages, normalizes raw data into schema rows | No — hands row to Claude |
| **Claude (mClaude)** | Appends rows, commits, pushes. Governance. | YES |
| **Chamlin (ChatGPT)** | Strategy, funnel analysis, trend detection, weekly reports. Can write directly to CSV if Claude is unavailable. | YES (backup writer) |
| **Gemini** | Creative scoring — hook, thumbnail, pacing | No — sends notes to Claude to append |
| **Jo** | Final authority. Adds Notes_Human. Sets Decisions. | Via Claude |

## Workflow (every new experiment)

1. Jo opens analytics page in browser
2. Jo tells Copilot: "Read this page and extract the metrics"
3. Copilot outputs a structured row using the schema below
4. Jo pastes the row to Claude or Chamlin
5. Primary writer (Claude) appends the row, commits, pushes — Chamlin writes directly if Claude is unavailable
6. All AIs read from the same GitHub file for analysis

**Sovereignty note:** Chamlin has direct GitHub write access as a backup writer. If Claude (Anthropic) becomes unavailable for any external reason, Chamlin can maintain the ledger without interruption. The CSV format ensures no vendor lock-in.

## Schema (28 columns)

```
ExperimentID      — Format: TT-001, LI-001, FB-001, EMAIL-001, CWS-001
Date              — YYYY-MM-DD
Platform          — TikTok | LinkedIn | Facebook | MailerLite | ChromeWebStore
ChannelType       — Organic | Paid | Owned | Partnership
ContentTitle      — Short human-readable title
ContentURL        — Direct link to the live post
HookType          — Problem-Agitate | Identity | Question-Challenge | Bold-Claim | Transformation | Philosophical
PrimaryGoal       — Awareness | Conversion | Retention | Engagement
Hook              — Verbatim hook text (first 3 seconds / first line)
CoreMessage       — The main argument or claim
CTA               — Call to action shown
TargetAudience    — Who this was aimed at
Views             — Raw views / reach
Impressions       — Impressions (if platform separates from Views)
WatchTime         — Average watch time (seconds or mm:ss)
RetentionRate     — % retention
Likes             — Count
Comments          — Count
Shares            — Count
Saves             — Count
ProfileVisits     — Count
WebsiteClicks     — Clicks to hugonomy.com or /shape
ExtensionInstalls — Attributed installs (CWS)
WaitlistSignups   — /shape form submissions attributed to this post
Notes_Human       — Jo's interpretation
Notes_Gemini      — Gemini creative scoring notes
Notes_Claude      — Claude architecture / governance notes
Decision          — Scale | Repeat | Remix | Investigate | Kill (+ rationale)
```

## Claude's append instruction

When Jo says "append this row", Claude should:
1. Read the current CSV (never overwrite, always append)
2. Add the new row at the bottom (above any blank platform-placeholder rows)
3. Keep blank platform-placeholder rows at the bottom
4. Commit: `marketing: add [ExperimentID] — [Platform] [ContentTitle]`
5. Push to origin main

## Hard lines (apply to this file too)

- No IP filing references, provisional numbers, or USPTO language
- No API keys or credentials in any marketing file
- This file is public-safe — treat it as if the Chrome Web Store reviewer can see it
