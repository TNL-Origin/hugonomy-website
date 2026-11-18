# Shared landing-page integration ? draft review

Prepared November 17, 2026. **Unmerged candidate; do not deploy without Jo's separate approval.** The complete readiness result and limits are in [DEPLOYMENT_READINESS.md](DEPLOYMENT_READINESS.md).

| Address | Purpose |
|---|---|
| `/` | Shared homepage with Systems and Business paths |
| `/systems.html` | Systems introduction, vision/news and FoldSpace installation link |
| `/business/` | Business introduction and contact choices |
| `/business/sebanori/` | SEBANORI explanation and fictional walkthrough |
| `/foldspace` and `/foldspace.html` | Preserved original FoldSpace homepage |
| `/privacy` and `/privacy.html` | Existing extension policy, unedited |
| `/website-notices.html` | Website data practices and analytics-choice scope |

Existing `/#install`, `/#install-actions` and `/#research` destinations stay usable. The FoldSpace page retains its store links, attribution/events, mailing-list code and original content; its canonical/share URL changes to `/foldspace`. Existing vision, about, news, shape, faculty and demo pages and their assets remain unchanged.

This is a static Netlify website. No application server, database, account system or live AI integration is required for these pages. Contact selection changes a mailto link; it does not send mail. The sample walkthrough uses fictional data in page memory.

Jo selected opt-in Google Analytics for the five new shared pages. Accept/reject choices and a footer preference control implement that decision. Existing FoldSpace pages keep their original analytics. Hosting request logs and Netlify performance monitoring are separate; the notice explains the boundary. The draft CSP adds only named Google tag endpoints needed by this implementation, preserving all existing directives and other protections. Privacy, redirects, robots and workflows are unchanged.

Preview labels/noindex are removed deliberately in this unmerged candidate, and titles/descriptions/canonicals/share tags and sitemap entries are supplied. Current source uses the existing vector symbol beside the founder and retains AI labels on generated scenes and the SEBANORI logo; see [ASSET_SOURCES.md](ASSET_SOURCES.md).

Run the [repeatable local checks](tests/readiness/README.md) before a subsequent revision. They use simulated local HTML aliases and intercepted Analytics responses; they do not deploy or verify production account settings. No private project notes, internal decision log, workplace records or credentials were copied.

Keep `[skip netlify]` in every draft commit and the PR title. [Netlify documents these skip markers](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/) for branch/production and preview deploys. The next unmarked commit can deploy skipped changes. No production setting was changed to achieve this.

Jo remains the sole approver and merger. The readiness report lists final account/host checks and manual-device/accessibility limits. This draft implementation is not independent certification or publication approval.
