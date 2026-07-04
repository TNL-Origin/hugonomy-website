# Hugonomy Website — Copy Canon
**Single source of truth for repeated facts/phrases across the site. Update ONE entry here, then propagate to every page that uses it — don't let copies drift.**
**Established:** 2026-07-03, per REDESIGN SPEC v1.0 §7, ratified by Council (Chamlin/Fable/Gemini) + Jo.

---

## Facts (verify before changing — these are load-bearing across multiple pages)

| Fact | Current value | Verified | Used on |
|---|---|---|---|
| Install count | **"nearly 200 installs"** | Per spec directive 2026-07-03 (supersedes stale "100+" on live site) | index.html hero |
| Qazi et al. citation year | **2026** | Verified via Crossref (published 2026-04-23) + primary abstract, 2026-07-03. Trial *ran* Jun–Aug 2025; cite by publication year. | index.html research card, vision.html reference list, faculty.html |
| Qazi et al. — accuracy drop | **14.0 percentage points, adjusted mean difference, 95% CI −8.3 to −19.7, P<.0001** | Verified verbatim from primary abstract (medRxiv preprint, NCT06963957), 2026-07-03 | index.html, faculty.html |
| Qazi et al. — top-choice accuracy drop | **18.3 percentage points, 95% CI −26.6 to −10.0, P<.0001** | Verified same source, 2026-07-03 — not yet used anywhere on-site; available for faculty.html deeper cite | faculty.html |
| Gerlich correlation | **r = −0.75** (n=666, offloading vs. critical thinking, p<0.001) | Already live and correct, index.html/vision.html | index.html, faculty.html |
| Study design N | **Recruit 60–70, target ~50 completing** (2-week randomized pilot, treatment vs. control, behavioral engagement primary) | Reconciled 2026-07-03 (Chamlexx audit finding MED-2): `vision.html#study` states "n≈50" (retention/completion figure) with no recruit number; `founder-real-world-outreach/website/faculty-response-section-brief.md:34` independently specifies "60-70 recruited." Not a contradiction — recruit vs. complete framing — and `faculty.html` already uses the correct reconciled wording. This row previously and incorrectly said 60-70 "was not propagated"; it was, just not into this table. | vision.html (n≈50 only), faculty.html (full recruit→complete wording) |

---

## Canonical sentences (copy verbatim, don't paraphrase per-page)

**NEJM/Qazi sentence:**
> Qazi et al., 2026 — NEJM AI: randomized trial, 44 physicians with 20 hours of AI-literacy training; erroneous LLM suggestions cut diagnostic accuracy by 14 points (P<0.0001).

**Gerlich sentence:**
> r = −0.75 between cognitive offloading to AI and critical thinking (n = 666, correlational).

**Efficacy verbs — approved list:** designed to · watches for · catches · detects
**Efficacy verbs — NEVER use:** prevents · fixes · neutralizes · proven
(Per `hugonomy-evidence/claims.md` C4 — the product-efficacy claim is OPEN, not yet demonstrated. Note: `index.html`'s existing Goldfish Effect section currently uses "neutralized" — flagged, not yet corrected; out of scope for this Phase 0 pass, see open items.)

**Standing taglines:**
- "Don't Outsource Your Mind" — index.html `<title>`
- "Think with AI. Not through it." — about.html Mission heading
- "Free for education, always."
- "Mirror, not a spy."
- "One signal, one moment, you decide."
- "Stay curious. Keep thinking. Stay human."

---

## Attribution channel registry (§6 of redesign spec)

Every capture path (MailerLite forms, install-CTA clicks tracked via analytics if added later) carries a `src` value. Full list — do not invent new channel names outside this registry without updating it here first:

`rpark0715` · `tiktok` · `faculty` · `nelson` · `mobile-bridge` · `homepage` · `reddit`

Implementation: `assets/js/attribution.js` — reads `?src=` from the URL on page load, falls back to a same-page default (see file for per-page defaults), writes it to any `.ml-embedded` hidden field or `data-attribution` element before MailerLite's form renders.

---

## Open items (known, not yet actioned — do not re-discover these as if new)

- Goldfish Effect section (index.html) still says "neutralized" — violates the efficacy-verb rule above. Flagged 2026-07-03, not fixed this pass (out of Phase 0 scope — cosmetic copy fix, not a Phase 0 blocker).
- Abandoned-provisional / patent-status wording: confirmed CLEAN on all live rendered pages as of 2026-07-03 (only exists in the dev-tooling forbidden-pattern blocker itself, correctly framed as a guard). The provisional lapses ~Aug 3, 2026 — separate founder business decision (convert vs. let lapse), not a content-fix task.
- `icon512.png` referenced in JSON-LD but never existed — fixed 2026-07-03 by pointing to the existing `icon128.png` asset. A true 512px asset is a nice-to-have for Phase 1's favicon refresh (spec §8), not required now.
- **RESOLVED 2026-07-03:** flyer PDF (Chamlexx finding LOW-2) — `assets/downloads/Hugonomy_Faculty_Outreach.pdf` now exists (v2, "bulletin-board" design per Council review) and `faculty.html`'s placeholder note now links to it. Note: the flyer's own copy was independently authored to match this canon file's facts (Qazi 2026/P<.0001/14pp, Gerlich r=-0.75/n=666, the recruit-60–70/~50-completing wording) rather than generated from it programmatically — if canon facts change again, the flyer PDF will NOT auto-update and must be manually re-checked for drift, unlike faculty.html which reads from the live page.
