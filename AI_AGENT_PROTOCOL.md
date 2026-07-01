# AI Agent Protocol — hugonomy-website Repository
# Read this FIRST before touching anything in this repo.
# Authority: Jo Tingling (jtingling@gmail.com) — human override supersedes all rules below.
# Last updated: 2026-06-30 by mClaude (Claude Sonnet)

---

## 1. What this repo contains

| Path | What it is | Risk level |
|------|-----------|------------|
| `marketing/marketing_experiments_master.csv` | Marketing Intelligence Layer — one row per experiment | LOW (data append) |
| `marketing/README_AI_AGENTS.md` | Canonical workflow doc for all AIs | MEDIUM (schema governance) |
| `marketing/generate_ledger_xlsx.py` | xlsx formatter — run locally only | LOW |
| `*.html`, `*.css`, `*.js` | hugonomy.com website source | HIGH (live site) |
| `netlify.toml` | Netlify config, CSP headers | HIGH (breaks live site if wrong) |
| `privacy.html` | Chrome/Edge store linked privacy policy | CRITICAL (store compliance) |
| `.github/workflows/` | GitHub Actions config | HIGH (affects CI) |

---

## 2. Who you are — roles and write permissions

| Agent | Role | Write to main (CSV data)? | Write to main (website)? | Write PRs? |
|-------|------|--------------------------|--------------------------|-----------|
| **mClaude (Claude)** | Primary writer + governance | YES | YES (with care) | YES |
| **Chamlin (ChatGPT)** | Strategy analyst + backup writer | YES (CSV only) | NO — open PR instead | YES |
| **Copilot (GitHub)** | Data extraction, automation scripts | NO — hand rows to Claude/Chamlin | NO — open PR instead | YES |
| **Gemini** | Creative scoring, thumbnail analysis | NO — send notes to Claude to append | NO | NO |
| **Opus / Parliamentarian** | Strategic review, architecture decisions | NO — voice decisions, Claude implements | NO | NO |
| **Chamlexx (Codex)** | Counter-audit + **conditional backup writer** | YES — only if mClaude is unavailable AND Jo explicitly authorizes in the current session | NO — open PR instead | YES |

**Chamlexx write condition:** Chamlexx has write privileges as a failsafe — if Claude (Anthropic) becomes unavailable or unaffordable, Chamlexx can maintain the marketing ledger. However, every Chamlexx write commit requires explicit Jo authorization in the current session ("Chamlexx, go ahead and append this"). Chamlexx does not write autonomously. The last incident involving Chamlexx required human intervention; this permission is granted with that context in mind.

**If you are a new AI not listed above:** Stop. Read this file. Do not commit anything. Open a GitHub issue titled `[NEW AI] Requesting access — [your name]` and wait for Jo to approve your role.

---

## 3. Mandatory agent attribution (every commit)

Every commit to this repo from an AI agent **must** include an `Agent:` trailer at the bottom of the commit message. This is how Jo knows who touched what and when.

**Required format:**
```
Agent: [Name] ([Model/Version]) | [YYYY-MM-DD] | [role]
```

**Examples:**
```
Agent: mClaude (Claude Sonnet 4.6) | 2026-06-30 | primary-writer
Agent: Chamlin (ChatGPT-4o) | 2026-06-30 | backup-writer
Agent: Copilot (GitHub Copilot) | 2026-06-30 | automation
```

**Full commit message template:**
```
[scope]: [what changed] — [brief reason]

[optional body: why, backfill notes, schema version, etc.]

Agent: [Name] ([Model]) | [YYYY-MM-DD] | [role]
Co-Authored-By: [Name] <[email or noreply]>
```

**Why this matters:** Git shows the account that pushed (often shared as TNL-Origin), but not which AI decided to make the change. The `Agent:` trailer makes the audit trail human-readable without reading the full diff. Jo can run `git log --grep="Agent: Chamlin"` to see every Chamlin commit at a glance.

If you forget the trailer on a commit: do not amend. Add a follow-up commit:
```
meta: add attribution to [previous-commit-hash]

Agent: [Name] ([Model]) | [YYYY-MM-DD] | [role]
```

---

## 4. Safe write protocol

### 4A — Low-risk: appending data to marketing CSV (direct to main)

Data appends are low-risk because git history is the backup. Follow exactly:

```
1. git pull origin main          ← always sync first before writing
2. append your row(s) to marketing/marketing_experiments_master.csv
3. verify column count = 32 (count commas + 1 in your new row)
4. git add marketing/marketing_experiments_master.csv
5. git commit -m "marketing: add [ExperimentID] — [Platform] [ContentTitle]"
6. git push origin main
```

If push is rejected (remote diverged): `git pull --no-rebase origin main` → resolve conflict → push. **Never force-push to main.**

### 4B — Medium-risk: schema changes, README updates, script changes

```
1. git pull origin main
2. git checkout -b agent/[your-name]-[short-description]
3. make your changes
4. git push origin agent/[your-name]-[short-description]
5. open a PR — do NOT merge it yourself
6. tag Jo or leave a comment explaining what changed and why
```

### 4C — High-risk: website HTML/CSS/JS, netlify.toml, privacy.html, workflows

**Stop. Do not write directly.** Open a PR with your proposed changes and tag `@TNL-Origin` in the PR description. Wait for Jo to review before merging. These files are live on hugonomy.com and Chrome/Edge stores — a mistake is public.

---

## 5. Merge conflict protocol

> **Hard rule from research (AgenticFlict, GitHub agentic workflows): Humans resolve agent conflicts. Not other agents.**

When you hit a merge conflict:

| Conflict in | What to do |
|-------------|-----------|
| `marketing/marketing_experiments_master.csv` | If you are the primary writer (mClaude): pull, take your version if it has more/newer data, commit merge, push. If you are a backup writer (Chamlin): STOP — open a GitHub issue titled `[CONFLICT] marketing CSV — needs mClaude resolution` and wait. |
| Any website file | STOP — open a GitHub issue, do not resolve. Tag Jo. |
| `netlify.toml` or `privacy.html` | STOP — these are store-compliance sensitive. Escalate to Jo immediately. |
| Any `.github/workflows/` file | STOP — open issue, wait for mClaude or Jo. |

**Never resolve a conflict by deleting the other agent's data.** Always preserve both sides and let Jo decide if there is genuine ambiguity.

---

## 6. Circuit breakers — STOP and wait for Jo

Stop all repo operations and open a GitHub issue if ANY of these occur:

| Trigger | Why it's a hard stop |
|---------|---------------------|
| You are about to push to main with `--force` or `--force-with-lease` | Overwrites history; can destroy other agents' work |
| The pre-commit hook fires and blocks your commit | A hard line was tripped (IP language, credentials). Fix the content; NEVER use `--no-verify` |
| You notice a row was deleted from the CSV (not a blank placeholder) | Data loss — check `git log` and restore from last good commit |
| You find a credential, API key, or token anywhere in the repo | Do not commit. Alert Jo immediately via GitHub issue titled `[SECURITY] Potential credential in repo` |
| Two consecutive pushes fail for the same reason | You may be in a fix-fail loop. Stop; open issue; wait. |
| A file outside `marketing/` was changed by another AI without a PR | Flag it. Do not silently accept or revert it. |
| You are unsure whether Jo authorized the action | Default to NOT doing it. Ask first via GitHub issue or next conversation. |

---

## 7. Backup procedure (before any risky operation)

Before schema changes, bulk edits, or anything that touches more than 3 rows at once:

```bash
# Tag the current state before the risky op
git tag backup/YYYY-MM-DD-before-[description] HEAD
git push origin backup/YYYY-MM-DD-before-[description]
```

Example: `git tag backup/2026-06-30-before-schema-v2 HEAD`

This creates a recoverable point. Jo can restore from it anytime with:
```bash
git checkout backup/YYYY-MM-DD-before-[description] -- marketing/marketing_experiments_master.csv
```

Tags live on GitHub and are not affected by branch resets.

---

## 8. Hard lines (repo-wide — non-negotiable)

These apply to every file in this repo, not just marketing/:

- **IP HARD LINE:** No references to IP filings, application numbers, filing agencies, or pending-application claims. The pre-commit hook will block it. If you need to discuss IP in a comment, use "IP HARD LINE" phrasing — see HUGONOMY_LESSONS_LEARNED.md 2026-05-14.
- **NO CREDENTIALS:** No API keys, tokens, secrets, or `.env` content anywhere. If a key appears accidentally, open a `[SECURITY]` issue immediately — do not commit it and do not try to scrub it yourself.
- **NO STORE FILE EDITS:** `privacy.html` is linked from the Chrome Web Store and Microsoft Edge Add-ons Store. Any change requires Jo approval. Do not touch without explicit authorization.
- **NO CSP WEAKENING:** If you edit `netlify.toml`, never remove a trusted domain or add `unsafe-eval` or `unsafe-inline` to `script-src`. Only add domains, never remove.
- **CSV SCHEMA IS LOCKED AT 32 COLUMNS:** Do not add, remove, or rename columns without a schema version PR approved by mClaude and Jo. New columns require a backfill plan.

---

## 9. Escalation matrix

| Situation | Action | Where |
|-----------|--------|--------|
| Minor data question (which ExperimentID, what HookStructure value) | Ask in the next conversation with Jo | Chat |
| Merge conflict you cannot safely resolve | GitHub issue: `[CONFLICT] [filename]` | GitHub Issues |
| Credential or security concern | GitHub issue: `[SECURITY] [description]` — mark as high priority | GitHub Issues |
| Schema change proposal | GitHub issue: `[SCHEMA] Proposed v3 — [summary]` | GitHub Issues |
| Hard line violation found in someone else's commit | GitHub issue: `[HARD LINE] [violation type] in commit [hash]` | GitHub Issues |
| Uncertainty about whether an action is authorized | Do nothing. Ask Jo. | Next chat session |
| Another AI is behaving unexpectedly (writing wrong schema, deleting rows) | GitHub issue: `[AI BEHAVIOR] [agent name] — unexpected action in commit [hash]` | GitHub Issues |

---

## 10. Recovery playbook (if something goes wrong)

```bash
# See recent commits
git log --oneline -10

# See what changed in a specific commit
git show [commit-hash] -- marketing/marketing_experiments_master.csv

# Restore a single file from a previous commit (does NOT lose other changes)
git checkout [commit-hash] -- marketing/marketing_experiments_master.csv
git commit -m "recovery: restore [filename] from [commit-hash]"

# Restore from a backup tag
git checkout backup/YYYY-MM-DD-before-[description] -- marketing/marketing_experiments_master.csv

# See all backup tags
git tag | grep backup/
```

**Never run `git reset --hard` on main without Jo's explicit approval.** It rewrites history and can destroy commits from other agents.

```bash
# Audit by agent — see everything a specific AI touched
git log --oneline --grep="Agent: Chamlin"
git log --oneline --grep="Agent: mClaude"
git log --oneline --grep="Agent: Copilot"

# See all agent commits in one view
git log --oneline --grep="Agent:"

# See what an agent changed in a specific file over time
git log --oneline --grep="Agent: Chamlin" -- marketing/marketing_experiments_master.csv
```

---

## 11. Adding a new AI to this repo

Before giving any new AI write access:

1. Jo adds them to this file under Section 2 with explicit permissions
2. The new AI reads this file before its first commit
3. First operation must be read-only (pull and read the CSV, open no PRs yet)
4. First write must be a test row in the CSV with `ExperimentID: TEST-[agent-name]-001` — mClaude verifies it matches schema before the AI is cleared for regular appends
5. Test row is deleted after verification: `git revert [commit-hash]`

---

## 12. TNL-Origin repository inventory (as of 2026-06-30)

All repos are under `https://github.com/TNL-Origin/`. Know your scope before touching anything.

| Repo | Visibility | What it is | AI write access |
|------|-----------|-----------|-----------------|
| `hugonomy-website` | **Public** | hugonomy.com website + Marketing Intelligence Layer | mClaude (primary), Chamlin (CSV backup), Copilot (PRs only) |
| `allminds-lens` | Private | AllMinds Lens MV3 extension — active build | mClaude (primary), Chamlexx (audits + conditional backup) |
| `vibeai-foldspace-v2` | Private | VibeAI FoldSpace extension source backup | mClaude only — do not touch without Jo authorization |
| `hugonomy-origin-archive` | Private | Lineage/authorship archive | Read-only for all AIs unless Jo says otherwise |
| `hugonomy-promo-videos` | Private | Campaign video archive | Read-only |
| `strataiq` | Private | Illinois county records platform | SEPARATE PRODUCT — CCC/HugoScore logic must not cross here |
| `shadowdancer` | Private | VAULT — ShadowDancer / CCC Second Generation | NO AI ACCESS without explicit Jo authorization per session |
| `HUGONOMY` | Private | Project Aurorith | Read-only unless Jo authorizes |
| All others | Private | Older experiments and archives | Read-only unless Jo authorizes |

**Hard rule:** If a repo is not listed above as having your write access, treat it as read-only. Ask before touching.

---

## 13. ExperimentID standard (all AIs must follow — applies to marketing CSV)

Every row in `marketing_experiments_master.csv` must use one of these two ID formats:

**Format A — Individual post experiments:**
```
[PLATFORM]-[NNN]     (3-digit zero-padded number, sequential per platform)

TT-001  TT-009  TT-010    ← TikTok posts
LI-001  LI-002            ← LinkedIn posts
FB-001                    ← Facebook posts
EMAIL-001                 ← MailerLite campaigns
CWS-001                   ← Chrome Web Store featured placements (future)
```

**Format B — Platform/account snapshots (not individual posts):**
```
SNAP-[PLATFORM]-[YYYYMMDD]-[PERIOD]

SNAP-TT-20260630-7D        ← TikTok 7-day account snapshot
SNAP-CWS-20260630-30D      ← CWS 30-day snapshot
SNAP-CWS-20260630-180D     ← CWS 180-day snapshot
SNAP-LI-20260701-30D       ← LinkedIn 30-day snapshot (future)
```

**Platform codes:** `TT` (TikTok) · `LI` (LinkedIn) · `FB` (Facebook) · `CWS` (Chrome Web Store) · `EMAIL` (MailerLite) · `EDGE` (Edge Add-ons, future)

**Never use:** `EXP-YYYY-MM-DD-NN` format — this was a non-standard format used before this convention was locked. All such rows have been renamed.

---

## 14. UTM / SourceTag convention (locked — use before first tagged post goes live)

The `SourceTag` column in the CSV stores the UTM value that ties a /shape signup back to the exact experiment.

**URL parameter:** `?src=`

**SourceTag format:** `platform-experimentid` — all lowercase, hyphen-separated, no spaces

```
Platform codes (lowercase):  tiktok  linkedin  facebook  email  cws  direct

Examples:
  tiktok-tt009       → https://hugonomy.com/shape?src=tiktok-tt009
  tiktok-tt010       → https://hugonomy.com/shape?src=tiktok-tt010
  linkedin-li001     → https://hugonomy.com/shape?src=linkedin-li001
  facebook-fb001     → https://hugonomy.com/shape?src=facebook-fb001
  email-email001     → https://hugonomy.com/shape?src=email-email001
  direct             → https://hugonomy.com/shape?src=direct   (no campaign)
```

**Rules:**
- Every new post gets a SourceTag assigned BEFORE the post goes live — never retroactively (retroactive = unattributable)
- SourceTag in the CSV must exactly match the `?src=` value in the link posted
- Pre-2026-06-29 rows: SourceTag is blank (no catch-net existed). Do not fill in retroactively.
- Rows on/after 2026-06-29 with no SourceTag: mark `ConversionConfidence = Instrumented` but note in Notes_Claude that no SourceTag was applied

**Where to put the tagged link:**
- TikTok: bio link (bio can only hold one URL — update it to the latest active experiment's tagged URL)
- LinkedIn: post body or "visit link" field
- Email: CTA button href
- Facebook: post link

---

*Sources informing this protocol:*
- [GitHub: AI Agent Orchestration best practices](https://github.com/resources/articles/what-is-ai-agent-orchestration)
- [AgenticFlict: Merge Conflicts in AI Agent PRs (arXiv 2025)](https://arxiv.org/html/2604.03551v1)
- [GitHub's agentic security principles](https://github.blog/ai-and-ml/github-copilot/how-githubs-agentic-security-principles-make-our-ai-agents-as-secure-as-possible/)
- [GitAgent: 14 patterns AI agents should follow](https://medium.com/@shreyas.kapale/gitagent-all-ai-agents-should-follow-these-14-patterns-ffc0a79bac0e)
- [Git Worktrees for parallel AI agent execution](https://www.mindstudio.ai/blog/git-worktrees-parallel-ai-coding-agents)
- [Git workflow for AI-assisted development 2026](https://www.buildmvpfast.com/blog/git-workflow-ai-assisted-development-agent-commits-2026)
