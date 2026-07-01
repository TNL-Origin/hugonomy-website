# NEW AI — READ THIS BEFORE TOUCHING ANYTHING

You have been given access to this repository by Jo Tingling (jtingling@gmail.com).

**Stop. Read these three files in order before making any commit:**

## Step 1 — Understand the full protocol
Read [`AI_AGENT_PROTOCOL.md`](AI_AGENT_PROTOCOL.md)

It tells you:
- What you are allowed to touch (and what you are not)
- How to safely append data
- What to do if a conflict happens
- When to STOP and wait for Jo
- How to create a backup before risky operations
- How to escalate problems

## Step 2 — Understand the marketing data
Read [`marketing/README_AI_AGENTS.md`](marketing/README_AI_AGENTS.md)

It tells you:
- The exact CSV schema (32 columns)
- Which AI does what
- The resume command for returning sessions

## Step 3 — Confirm your role
Find your agent name in the roles table in `AI_AGENT_PROTOCOL.md` Section 2.

- If you are listed: proceed with the permissions shown.
- If you are NOT listed: do not commit anything. Open a GitHub issue titled `[NEW AI] Requesting access — [your name]` and wait for Jo to authorize you.

---

## The one rule that overrides everything else

> **Jo's instruction in the current conversation supersedes all rules in these files.**
> These files set safe defaults. Jo can change any rule at any time.

---

## Quick reference — things that always require human approval

| Action | Required approval |
|--------|------------------|
| Editing any `.html`, `.css`, `.js` website file | Jo |
| Editing `netlify.toml` (CSP headers) | Jo |
| Editing `privacy.html` (store-linked) | Jo |
| Editing any `.github/workflows/` file | Jo |
| Adding or removing CSV columns | mClaude + Jo |
| Force-pushing to main | Never — not even with approval |
| Using `--no-verify` to skip pre-commit hook | Never |
| Committing any credential, token, or API key | Never — open `[SECURITY]` issue instead |

---

*This file was written by mClaude (Claude Sonnet) on 2026-06-30.*
*Update it when Jo adds a new AI or changes access rules.*
