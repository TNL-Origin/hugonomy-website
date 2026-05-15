# Repo-tracked git hooks

These hooks travel with the repo so a fresh clone gets the same guarantees.

## One-time activation

From the repo root, run once per clone:

```sh
git config core.hooksPath hooks
```

That's it. Subsequent `git commit`s will run `pre-commit` automatically.

## What lives here

- **`pre-commit`** — blocks commits that reintroduce the abandoned provisional
  patent reference (`63/856,714`) or "patent pending" / "provisional patent"
  language. Background: USPTO provisional #63/856,714 was abandoned on
  2026-04-29; leaving "patent pending" copy on a public surface creates
  35 USC §292 false-marking exposure and FTC §5 false-advertising exposure.
  See `CODEX_TALMUD_INFINITICA.md` entry 001 (in the working repo, not this
  one) for the full reasoning.

## Bypassing intentionally

If you genuinely need to commit historical/archival content that quotes
the dead provisional (rare), bypass with:

```sh
git commit --no-verify
```

Use sparingly — the whole point is to catch accidental reintroductions
in regenerated dist artifacts, copy-pasted footers, etc.

## Verifying the hook is active

```sh
git config --get core.hooksPath
# Should print: hooks
```
