# AI Agent Protocol — hugonomy-website
# This repository contains the public hugonomy.com website only.
# Authority: Jo Tingling (TNL-Origin) — human override supersedes all rules below.
# Last updated: 2026-06-30 by mClaude (Claude Sonnet 4.6)

---

## 1. What this repository contains

This repository is the source for hugonomy.com. It is **public**.

| Path | What it is | Risk level |
|------|-----------|------------|
| `*.html`, `*.css`, `*.js` | hugonomy.com website source | HIGH (live site) |
| `netlify.toml` | Netlify config, CSP headers | HIGH (breaks live site if wrong) |
| `privacy.html` | Chrome/Edge store linked privacy policy | CRITICAL (store compliance) |
| `.github/workflows/` | GitHub Actions config | HIGH (affects CI) |
| `NEW_AI_START_HERE.md` | AI onboarding gate | Read before touching anything |
| `AI_AGENT_PROTOCOL.md` | This file | Read before touching anything |

**This repository governs the public website only.**
Marketing Intelligence and operational governance are maintained separately in a private repository. If you are here to work on marketing data, you are in the wrong repo.

---

## 2. Who you are — roles and write permissions

| Agent | Role | Write to website files? | Open PRs? |
|-------|------|------------------------|-----------|
| **mClaude (Claude)** | Primary writer + governance | YES (with care) | YES |
| **Copilot (GitHub)** | Automation scripts, issue triage | NO — open PR instead | YES |
| **Chamlin (ChatGPT)** | Review, analysis | NO — open PR instead | YES |
| **Opus / Parliamentarian** | Strategic review | NO — voice decisions only | NO |
| **Chamlexx (Codex)** | Counter-audit | NO — open PR instead | YES |

**If you are a new AI not listed above:** Stop. Do not commit anything. Open a GitHub issue titled `[NEW AI] Requesting access — [your name]` and wait for Jo to approve your role.

No agent has blanket authority over this repository. Jo's instruction in any active conversation overrides every rule in this file.

---

## 3. Mandatory agent attribution (every commit)

Every commit from an AI agent **must** include an `Agent:` trailer. This is non-negotiable.

**Required format:**
```
Agent: [Name] ([Model/Version]) | [YYYY-MM-DD] | [role]
```

**Examples:**
```
Agent: mClaude (Claude Sonnet 4.6) | 2026-06-30 | primary-writer
Agent: Chamlin (ChatGPT-4o) | 2026-06-30 | reviewer
```

**Full commit message template:**
```
[scope]: [what changed] — [brief reason]

[optional body]

Agent: [Name] ([Model]) | [YYYY-MM-DD] | [role]
```

Audit command: `git log --grep="Agent:"` — Jo uses this to see every AI touch.

If you forget the trailer: do not amend. Add a follow-up commit:
```
meta: add attribution to [previous-commit-hash]

Agent: [Name] ([Model]) | [YYYY-MM-DD] | [role]
```

---

## 4. Safe write protocol

### 4A — Low-risk: README, documentation, non-live assets (direct to main)

```
1. git pull origin main
2. make your changes
3. git add [specific files]
4. git commit -m "[scope]: [what] — [why]" (with Agent: trailer)
5. git push origin main
```

If push is rejected: `git pull --no-rebase origin main` → resolve conflict → push. Never force-push.

### 4B — Medium-risk: CSS, JavaScript, non-critical HTML, script files

```
1. git pull origin main
2. git checkout -b agent/[your-name]-[short-description]
3. make your changes
4. git push origin agent/[your-name]-[short-description]
5. open a PR — do NOT merge it yourself
6. tag Jo or leave a comment explaining what changed and why
```

### 4C — High-risk: website HTML (live pages), netlify.toml, privacy.html, .github/workflows/

**Stop. Do not write directly.** Open a PR with your proposed changes and note `[HIGH RISK]` in the PR title. Wait for Jo to review before merging. These files affect the live site and Chrome/Edge Store compliance — a mistake is public.

---

## 5. Chrome Web Store and Edge Store compliance

`privacy.html` is linked directly from the Chrome Web Store listing and the Microsoft Edge Add-ons Store listing. It is store-critical.

**Rules for privacy.html specifically:**
- Never edit it without Jo's explicit approval in the current session
- After any edit, verify the privacy URL in the CWS/Edge developer dashboard still resolves
- Do not remove any disclosure that covers a declared extension permission
- Content must reflect the actual data handling of the published extension — no aspirational claims

**Netlify / CSP (netlify.toml):**
- Never remove a trusted domain from `Content-Security-Policy`
- Never add `unsafe-eval` or `unsafe-inline` to `script-src`
- When adding a new trusted domain: add it to all relevant directives, not just one
- After changes: verify the live site loads correctly before closing the session

**General store compliance:**
- If any website change could affect the store listing's accuracy (data handling, permissions, privacy policy), flag it to Jo before merging
- Do not add or modify anything that implies capabilities not present in the published extension

---

## 6. Merge conflict protocol

> Hard rule: Humans resolve conflicts. Not other agents.

| Conflict in | What to do |
|-------------|-----------|
| Any website file | STOP — open a GitHub issue: `[CONFLICT] [filename] — needs resolution`. Tag Jo. Do not resolve. |
| `netlify.toml` or `privacy.html` | STOP — store compliance is at stake. Escalate to Jo immediately. |
| `AI_AGENT_PROTOCOL.md` or `NEW_AI_START_HERE.md` | STOP — governance files require human resolution. |
| `.github/workflows/` | STOP — do not resolve. Tag Jo. |

Never resolve a conflict by deleting another agent's changes. Preserve both sides.

---

## 7. Circuit breakers — STOP and wait for Jo

Stop all operations and open a GitHub issue if any of these occur:

| Trigger | Why it's a hard stop |
|---------|---------------------|
| About to push with `--force` or `--force-with-lease` | Overwrites history |
| Pre-commit hook fires and blocks your commit | A hard line was tripped — fix the content; never use `--no-verify` |
| You find a credential, API key, or token anywhere | Open `[SECURITY]` issue immediately — do not commit, do not scrub yourself |
| Two consecutive pushes fail for the same reason | You may be in a fix-fail loop — stop and escalate |
| A file outside your authorized scope was modified | Flag it before proceeding |
| You are unsure whether Jo authorized the action | Default to NOT doing it |

---

## 8. Hard lines (non-negotiable)

- **IP HARD LINE:** No references to IP filings, application numbers, filing agencies, or pending-application claims — anywhere, in any file. The pre-commit hook will block it. If you need to discuss IP in a commit, use "IP HARD LINE" phrasing only.
- **NO CREDENTIALS:** No API keys, tokens, secrets, or `.env` content. If a key appears accidentally, open a `[SECURITY]` issue immediately. Do not commit it. Do not try to scrub it yourself.
- **NO STORE FILE EDITS WITHOUT APPROVAL:** `privacy.html` requires Jo's explicit approval. See Section 5.
- **NO CSP WEAKENING:** Never remove domains or add `unsafe-eval`/`unsafe-inline` to `script-src` in `netlify.toml`.
- **NO FORCE PUSH:** Never `git push --force` to any branch.
- **NO HOOK BYPASS:** Never `--no-verify` on any commit.

---

## 9. Escalation matrix

| Situation | Action | Where |
|-----------|--------|--------|
| Merge conflict | GitHub issue: `[CONFLICT] [filename]` | GitHub Issues |
| Credential or security concern | GitHub issue: `[SECURITY] [description]` | GitHub Issues |
| Store compliance question | GitHub issue: `[STORE] [description]` | GitHub Issues |
| Hard line violation found | GitHub issue: `[HARD LINE] [type] in commit [hash]` | GitHub Issues |
| Uncertain whether action is authorized | Do nothing — ask Jo in next session | Next chat |
| Unexpected AI behavior | GitHub issue: `[AI BEHAVIOR] [agent] in commit [hash]` | GitHub Issues |

---

## 10. Recovery playbook

```bash
# See recent commits
git log --oneline -10

# See what changed in a specific commit
git show [commit-hash] -- [filename]

# Restore a single file from a previous commit
git checkout [commit-hash] -- [filename]
git commit -m "recovery: restore [filename] from [commit-hash]"

# Audit by agent
git log --oneline --grep="Agent: [name]"
git log --oneline --grep="Agent:"
```

**Never run `git reset --hard` on main without Jo's explicit approval.**

---

## 11. Adding a new AI to this repository

Before giving any new AI write access:

1. Jo adds them to Section 2 with explicit permissions
2. The new AI reads this file before its first commit
3. First operation must be read-only
4. First write must be a low-risk documentation change — mClaude verifies before clearing for broader access

---

*This file governs the public hugonomy.com website repository only.*
*For marketing operations, experiment tracking, and internal governance: see the private Hugonomy Marketing repository.*
*For extension source code governance: see CLAUDE.md and AGENTS.md in the relevant extension repos.*
