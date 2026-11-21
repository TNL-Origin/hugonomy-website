# Local pre-deployment checks

These tools test static website files locally. They do not deploy, send email or send synthetic analytics to Google. They are development-only dependencies; the public website needs no Python/Node server or package installation.

From the repository root:

```
python -m pip install -r tests/readiness/requirements.txt
python -m playwright install chromium firefox webkit
npm install --prefix .readiness-tools --ignore-scripts --no-audit --no-fund axe-core@4.14.1
python tests/readiness/serve.py 5302
```

In a second terminal:

```
python tests/readiness/verify.py chromium firefox webkit
python tests/readiness/accessibility.py chromium firefox webkit
python tests/readiness/walkthrough.py chromium firefox webkit
```

On Windows, `edge` may replace `chromium` if installed in the usual Program Files (x86) location. Playwright browser processes need sufficient local process permissions. `HUGONOMY_TEST_URL` can select another local origin; `HUGONOMY_AXE_PATH` can point to an existing axe-core script. Output goes to ignored `.readiness-results/`. Stop the local server afterward.

`verify.py` covers five routes at six widths, image loading, metadata, errors, overflow, skip activation and consent scenarios. Google tag/collection URLs are intercepted with synthetic responses. Acceptance exercises the loader and the configured regional endpoint under the candidate CSP; it does not validate the live Analytics property or its reports. Reject, withdraw, cookie cleanup, stored/expired/corrupt preferences, blocked storage, Global Privacy Control, modal Escape and JavaScript-disabled behavior are covered.

The Windows WebKit build used in this review skips links during native Tab navigation; its skip link is activated after programmatic focus. Edge and Firefox check native first Tab, Enter and next Tab. This distinction is recorded in the output. WebKit is not a test on Safari hardware.

`accessibility.py` runs axe-core against initial pages and the open analytics dialog at desktop/phone widths. Zero automated violations does not prove full accessibility; incomplete photo/visual checks and physical-device/screen-reader testing require human review.

`walkthrough.py` rejects optional analytics, exercises thirteen checkpoints through the fictional flow at desktop/phone widths and runs axe at each checkpoint. It includes an escaped HTML-input probe, disabled private sample-document control, storage and outside-request checks.

`serve.py` applies the candidate Netlify headers and simulates extensionless flat HTML aliases. This validates local files/header compatibility; actual Netlify routing, host-injected scripts and production Analytics settings still need release verification. No browser permission or production hosting setting is changed.

## November 20 release regression additions

Run `python tests/readiness/source_checks.py` to build and validate the public-only `public-site/` artifact. Netlify now uses `python3 tests/readiness/build_public.py` and publishes that folder. Working docs/tests/config are excluded, independent of redirect rules.

Run `python tests/readiness/serve.py 5320 --public` after building. Set `HUGONOMY_TEST_URL=http://127.0.0.1:5320` and run `python tests/readiness/regressions.py` (installed Windows Edge required). This adds 53 cases for five businesses at three widths, approved snapshots across edit/redraft/reapproval/reset, keyboard list focus, legacy consent/GPC, registered attribution and stubbed MailerLite submission. No provider receives a test submission. Results go to `.readiness-results/`.

`--public` serves the built artifact and simulates HTML aliases with candidate headers. It does not emulate Netlify redirect processing or host-injected scripts. Rebuild after changes. The existing source preview server reads headers at startup; restart a test server to test changed headers. The workflow now runs the credential-free source command rather than the broken token-dependent assistant.
