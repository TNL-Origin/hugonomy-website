# Business and SEBANORI film placements — November 18, 2026

Requested by Jo; prepared by Chamlexx. Based on public website main `a0b755a` after the shared-site and Systems-navigation merges. This is a review branch, not a production change. Keep `[skip netlify]` in the commit and PR title; Jo reviews and merges.

## What changed

- Business page: the existing 10-second product-introduction film follows the hero/status strip, before the product details.
- SEBANORI page: the existing 10-second mentor-training explainer opens the example section, above the interactive workspace. Existing `#example` links bring visitors to the film and the workspace; a direct skip link reaches `#interactive-lab`.
- Native video controls, `playsinline`, `preload="none"`, local posters, default English captions, expandable narration/visual descriptions. No autoplay, third-party player, provider key, account or analytics change.
- Shared responsive film CSS only; no script, CSP, privacy-policy, deployment-config, navigation or application-code changes. Original film bytes retained; source/hash records under assets/video/sebanori/manifest.json.

The films introduce the mentor relationship and its before/after learning conversation. They are not recordings of the application or evidence of customer outcomes. The website's interactive example remains a separate template-based walkthrough, and the private SEBANORI app remains a working prototype under development. Wording preserves those distinctions without presenting the whole product as fictional.

## Verification

Ten focused Chromium checks: both pages at 1440, 1024, 820, 390 and 320 px, served with the candidate Netlify CSP. Both clips decoded and played, the English cues loaded/displayed, transcripts opened, no initial MP4 request before interaction, no autoplay, overflow, page errors, missing assets or outside requests. The interactive example still drafts its tree. Desktop and phone film-section screenshots visually reviewed. Development output is ignored under `.readiness-results/films/`.

Narration transcripts use local speech recognition, not an external service; they need a human listen-through before merge. Original generator-account rights and asset-specific legal clearance are not established here. No real employee information or testimonial was used. Physical-device/screen-reader and cross-engine video-playback certification are not claimed.

The existing Edge readiness run reached its final JavaScript-disabled navigation assertion, which still expected `/systems.html` after the already merged Systems-navigation changes. Corrected that single stale test expectation to `/foldspace`, the current approved destination. No navigation was changed for the films. Reran the readiness check after that correction.

Final existing readiness result: **PASS — 30 responsive/keyboard page loads and seven analytics-consent scenarios in Edge.** Provider analytics requests were intercepted, not sent. Focused film results are committed at `checks/business-films-2026-11-18.json`. This is scoped implementation verification, not a full independent audit or approval to publish.

## Review before merging

Listen to both 10-second clips, confirm captions and the two locations, review the inherited source/rights limits in ASSET_SOURCES.md, and compare the exact deployment candidate. The live site is unchanged by this branch. No merge, deployment or hosting setting was changed by this work.
