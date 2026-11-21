> Release candidate — November 20, 2026. Jo reviewed the hosted draft and authorized production release after the current-section navigation fix. Business and Systems homepages now show a non-clickable, accessible current-section label in header/footer navigation; other destinations and branch-logo links remain usable. The walkthrough retains links to all three destinations. Existing Systems content, extension privacy text and store links are preserved.
>
> Verified existing Netlify project/team and GitHub main connection. The hosted draft passed 53 regression scenarios, 36 navigation checks, 12 logo checks, file-boundary/header/privacy checks and same-origin embedding. The final navigation adjustment is covered by targeted release tests. Publish only the public-site build. Prior production rollback deploy: 6aff757ee5f87da24c3d96ec. Final release results are recorded in the governance repository at docs/audits/WEBSITE_RELEASE_REVIEW_2026-11-20.md.
>
> Remaining limits: existing public Git history is not made private by the website build; Analytics account settings, actual MailerLite delivery and manual assistive-technology testing are not certified. Jo accepted these documented limits for release. Existing FoldSpace text-fade animation can trigger transient automated contrast flags; reduced-motion checks pass. No private application or backend changes and no account-policy changes. No additional Claude review gate.

## Historical review (superseded by release status above)
# Website deployment readiness — November 17, 2026

**Technical pre-deployment checks: PASS for the candidate described here. Not deployed; Jo's approval is still required.** This covers the shared landing page, Systems introduction, Business page, SEBANORI website walkthrough and website notice. It does not certify the private SEBANORI application or its use with workplace records.

## What was completed

- Prepared the two destination paths, preserved FoldSpace at `/foldspace`, and retained root install/research fragments and existing store links.
- Preserved `privacy.html`, legacy pages and legacy assets. The extension privacy file remains byte-identical; both live privacy URLs return HTTP 200 with TLS validation. Chrome and Edge public store links also return 200. The Chrome listing response contains the privacy address; the Edge dashboard's configured privacy field was not inspected.
- Added visitor-controlled Google Analytics on the five new shared pages, as Jo requested. No Google request occurs before acceptance or after rejection. A persistent footer control supports withdrawal. Choice expiry, cookie expiry, invalid storage, Global Privacy Control and unavailable storage have defined behavior. Legacy pages have their original analytics; the new notice says so.
- Added only three named Google destinations to existing CSP allowlists: `region1.google-analytics.com` and `www.google.com` for connections; `www.googletagmanager.com` for frames. Existing directives, trusted sources, redirects and other security headers are retained. No new unsafe-inline or unsafe-eval allowance. [Google's CSP guidance](https://developers.google.com/tag-platform/security/guides/csp) was checked. These edits are in this draft source, not live settings.
- Corrected step-number contrast and gave the photograph caption an opaque, contrasting background. Added explicit skip-focus targets. Scoped AI captions to each page and used the existing vector symbol instead of an uncertain Microsoft-emblem copy.
- Completed the current primary-source image-policy review; see [asset records](ASSET_SOURCES.md) and its limits.

## Verification results

| Check | Result |
|---|---|
| Responsive/image/metadata/error checks | 90 loads: five pages × six widths × Edge, Firefox and WebKit |
| Optional analytics and preference checks | 21 scenarios: seven in each engine; Google requests intercepted, not transmitted |
| Automated accessibility | 60 initial-page/open-dialog checks with axe-core 4.14.1; zero reported WCAG-tag violations |
| Fictional walkthrough | 78 checkpoints in six complete desktop/phone flows across the three engines; additional axe scans, escaped HTML input, disabled private sample document, no outside requests and no saved learning records |
| Keyboard | Edge/Firefox native Tab and skip flow; all engines skip activation and analytics-dialog Escape. Windows WebKit native link-Tab limitation documented |
| Links/legacy fragments | Filesystem verification with no introduced broken links; preserved install/research fragments and FoldSpace navigation |
| Existing production links | Privacy aliases, vision/news and both public store links returned 200; production homepage remains the old FoldSpace page |
| Source hygiene | JavaScript syntax, whitespace, secret scan and repository commit hook checked before push |

Repeatable local checks are in [tests/readiness](tests/readiness/README.md); [evidence and source fingerprints](checks/readiness-2026-11-17.json) accompany this report. New page source uses static hosting and mailto links; no application backend/database or live AI service is needed for the landing page. No dependency was added to the website's deployment runtime.

## Exact limits and release steps

- These are headless browser/engine checks, not a physical phone, NVDA/VoiceOver or Safari-device test. Automated accessibility has incomplete visual checks and is not a compliance certificate. The implementation is Chamlexx-authored and still needs independent review or Jo's explicit acceptance.
- Analytics was exercised with intercepted provider responses. Verify the actual Analytics property's retention/data-sharing configuration and its connection to this domain before enabling production measurement. No account settings were changed. The preference controls cover the five new shared pages, not all legacy site pages or Netlify's separate performance monitoring.
- Asset records document source statements, policies and preserved bytes; they do not guarantee legal ownership, rights clearance or historical service-account terms. Final permissions and publication decisions remain Jo's.
- Preserve both `/privacy` and `/privacy.html`; preserve the public store destinations and the existing privacy policy. Final live routing, headers and host-injected monitoring can only be verified on the actual deployment. Prepare a rollback to the prior published deploy before release.
- Keep `[skip netlify]` in every draft commit and the PR title. No merge, Netlify preview, branch deploy, production deploy or settings change is authorized by this report. After Jo separately authorizes release, verify the exact merged candidate, then smoke-test the published routes, privacy aliases, store links and consent states. If any fails, restore the prior Netlify deploy.

The remaining release verification is explicit above; a local PASS is not a claim that every real device, legal issue or hosting-account setting has been examined.
