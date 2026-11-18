# Shared landing-page integration — draft review

Prepared November 17, 2026. **Do not merge or deploy until Jo approves the launch candidate.** This branch is a proposed source change; the current website is unchanged.

## Routes

| Address | Purpose |
|---|---|
| `/` | Shared landing page; full-panel links to Systems and Business |
| `/systems.html` | Systems introduction, existing vision/news, and visible FoldSpace installation link |
| `/business/` | Business introduction and contact choices |
| `/business/sebanori/` | SEBANORI explanation and fictional, template-based walkthrough |
| `/foldspace` and `/foldspace.html` | Preserved original FoldSpace homepage, with its own canonical/share URL |
| `/privacy` and `/privacy.html` | Existing extension privacy page, unedited |
| `/website-notices.html` | Proposed shared-website notice, distinct from the extension policy |

Existing `/#install`, `/#install-actions` and `/#research` links remain usable on the new homepage. The original FoldSpace page keeps its store buttons, markup, attribution code, event handlers and mailing-list integration. Its canonical and Open Graph URL point to `/foldspace`; those are the only substantive source changes to the preserved page. The new homepage also exposes the two existing store URLs directly.

Old vision, about, news, shape, faculty and demo pages and their assets are retained. No extension privacy file, security header, redirect, workflow or site setting is changed. New preview files collided only with `index.html`; this is an additive integration plus the deliberate homepage and sitemap replacements.

## Hosting and data flow

This remains a static website served by the existing Netlify configuration. No new application server, database, account, form submission endpoint or AI-provider connection is needed for the landing page. Both destination paths are ordinary page links. The sample walkthrough stays in browser memory; contact choices update a mailto link without sending email.

The new page source contains no Google Analytics loader. Analytics/consent configuration is a launch prerequisite, not silently invented here. Existing legacy pages retain their previous scripts. Netlify may inject monitoring in production. Do not interpret a clean local network test as proof of production data practices or consent behavior. The proposed website notice states these limits; final settings and wording still require approval.

Preview banners and noindex tags have been deliberately removed **inside this unmerged candidate**. Titles, descriptions, canonicals, Open Graph tags and sitemap entries are supplied. The website notice still identifies deployment details as awaiting approval. Removing preview labels does not make the notice final or authorize publication.

## Verification

- Local browser checks cover five new routes at six widths, including forced loading of lazy images, console/page errors, failed/external requests, overflow, metadata and the existing Content Security Policy.
- A filesystem link/fragment check compares the entire candidate with the baseline and distinguishes inherited broken links from introduced regressions.
- The local test server simulates flat `.html` aliases for legacy URLs; this is not a Netlify deployment or a guarantee about future host settings.
- Protected files and all other existing files except `index.html` and `sitemap.xml` are compared byte-for-byte with website baseline `83395acc3d89d68670f59fb539861922015c912b`.
- Existing legacy pages are tested with outside requests blocked, so synthetic visits do not call production analytics or mailing-list services.
- No physical phone, screen reader or live-host verification is claimed.

Detailed local verification results accompany the PR description. No private project notes, audit records, internal decision log, workplace records or credentials were copied into this public repository.

## Before merge

Jo must approve the final design, brand/domain decision, remaining permissions and legal review, asset terms/provenance, actual analytics/consent and notice, and device/accessibility checks. Confirm both extension-store dashboards still reference working privacy URLs. Verify the final host serves `/foldspace`, the Business directory paths and both privacy forms with the intended headers.

Keep `[skip netlify]` in this draft PR's title and commit message. Netlify documents that the title suppresses Deploy Previews and the commit message suppresses branch/production deploys: [Netlify manage-deploys documentation](https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/). The next unmarked commit can deploy skipped changes; retain the markers until deployment is separately authorized. No site setting was changed to achieve this.

Jo is the sole approver and merger. A technical review is not launch approval.
