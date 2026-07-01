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
| **Chamlexx (Codex)** | Counter-audit | NO — report findings, never self-correct | NO | NO |

**If you are a new AI not listed above:** Stop. Read this file. Do not commit anything. Open a GitHub issue titled `[NEW AI] Requesting access — [your name]` and wait for Jo to approve your role.

---

## 3. Safe write protocol

### 3A — Low-risk: appending data to marketing CSV (direct to main)

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

### 3B — Medium-risk: schema changes, README updates, script changes

```
1. git pull origin main
2. git checkout -b agent/[your-name]-[short-description]
3. make your changes
4. git push origin agent/[your-name]-[short-description]
5. open a PR — do NOT merge it yourself
6. tag Jo or leave a comment explaining what changed and why
```

### 3C — High-risk: website HTML/CSS/JS, netlify.toml, privacy.html, workflows

**Stop. Do not write directly.** Open a PR with your proposed changes and tag `@TNL-Origin` in the PR description. Wait for Jo to review before merging. These files are live on hugonomy.com and Chrome/Edge stores — a mistake is public.

---

## 4. Merge conflict protocol

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

## 5. Circuit breakers — STOP and wait for Jo

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

## 6. Backup procedure (before any risky operation)

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

## 7. Hard lines (repo-wide — non-negotiable)

These apply to every file in this repo, not just marketing/:

- **IP HARD LINE:** No references to IP filings, application numbers, filing agencies, or pending-application claims. The pre-commit hook will block it. If you need to discuss IP in a comment, use "IP HARD LINE" phrasing — see HUGONOMY_LESSONS_LEARNED.md 2026-05-14.
- **NO CREDENTIALS:** No API keys, tokens, secrets, or `.env` content anywhere. If a key appears accidentally, open a `[SECURITY]` issue immediately — do not commit it and do not try to scrub it yourself.
- **NO STORE FILE EDITS:** `privacy.html` is linked from the Chrome Web Store and Microsoft Edge Add-ons Store. Any change requires Jo approval. Do not touch without explicit authorization.
- **NO CSP WEAKENING:** If you edit `netlify.toml`, never remove a trusted domain or add `unsafe-eval` or `unsafe-inline` to `script-src`. Only add domains, never remove.
- **CSV SCHEMA IS LOCKED AT 32 COLUMNS:** Do not add, remove, or rename columns without a schema version PR approved by mClaude and Jo. New columns require a backfill plan.

---

## 8. Escalation matrix

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

## 9. Recovery playbook (if something goes wrong)

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

---

## 10. Adding a new AI to this repo

Before giving any new AI write access:

1. Jo adds them to this file under Section 2 with explicit permissions
2. The new AI reads this file before its first commit
3. First operation must be read-only (pull and read the CSV, open no PRs yet)
4. First write must be a test row in the CSV with `ExperimentID: TEST-[agent-name]-001` — mClaude verifies it matches schema before the AI is cleared for regular appends
5. Test row is deleted after verification: `git revert [commit-hash]`

---

*Sources informing this protocol:*
- [GitHub: AI Agent Orchestration best practices](https://github.com/resources/articles/what-is-ai-agent-orchestration)
- [AgenticFlict: Merge Conflicts in AI Agent PRs (arXiv 2025)](https://arxiv.org/html/2604.03551v1)
- [GitHub's agentic security principles](https://github.blog/ai-and-ml/github-copilot/how-githubs-agentic-security-principles-make-our-ai-agents-as-secure-as-possible/)
- [GitAgent: 14 patterns AI agents should follow](https://medium.com/@shreyas.kapale/gitagent-all-ai-agents-should-follow-these-14-patterns-ffc0a79bac0e)
- [Git Worktrees for parallel AI agent execution](https://www.mindstudio.ai/blog/git-worktrees-parallel-ai-coding-agents)
- [Git workflow for AI-assisted development 2026](https://www.buildmvpfast.com/blog/git-workflow-ai-assisted-development-agent-commits-2026)
