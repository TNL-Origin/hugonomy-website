/**
 * Hugonomy attribution + MailerLite capture — shared across pages.
 * Channel registry: content/canon.md §"Attribution channel registry".
 * Reads ?src= from the URL; falls back to a per-page default set via
 * <body data-src-default="...">. Injects the resolved value into any
 * MailerLite (.ml-embedded) form submission as fields[src].
 *
 * Per-form override (added 2026-07-03, Chamlexx audit finding MED-1):
 * a specific widget can force its own channel via
 * <div class="ml-embedded" data-src-override="mobile-bridge">, checked
 * BEFORE the page-level default. Without this, every form on a page
 * inherited the same page-wide default regardless of which widget it
 * was — e.g. the homepage's mobile-bridge form was silently attributed
 * as "homepage" unless the URL already carried ?src=mobile-bridge,
 * which defeats the point of a same-page channel distinction.
 *
 * NOTE: for this value to appear in the MailerLite dashboard, a custom
 * field named "src" must exist on the relevant MailerLite form/group.
 * This script sends the data correctly regardless — but if that field
 * isn't configured account-side, MailerLite will silently ignore it.
 * Flagged 2026-07-03, not something this script can verify or fix.
 */
(function () {
  'use strict';

  function resolvePageSrc() {
    var params = new URLSearchParams(window.location.search);
    var fromUrl = params.get('src');
    if (fromUrl) return fromUrl;
    var body = document.body;
    return (body && body.getAttribute('data-src-default')) || 'homepage';
  }

  var PAGE_SRC = resolvePageSrc();
  window.HugonomyAttribution = { src: PAGE_SRC };

  function handleMLSubmit(e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    var wrapper = form.closest ? form.closest('.ml-embedded') : null;
    if (!wrapper) return;
    e.preventDefault();
    e.stopPropagation();

    var submitBtn = form.querySelector('button[type="submit"]');
    var originalLabel = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    // Per-form override wins over the URL/page-level default — a specific
    // widget (e.g. the mobile bridge) always knows its own channel best.
    var src = wrapper.getAttribute('data-src-override') || PAGE_SRC;

    var formData = new FormData(form);
    formData.append('fields[src]', src);

    fetch(form.action, {
      method: form.method || 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.success) {
          var successMsg = wrapper.getAttribute('data-success-message') ||
            'Got it — founder reply within 2 days.<br><span style="font-size:0.9rem;font-weight:400;color:#ccc;">Check your inbox for a note from joseph@hugonomy.com</span>';
          wrapper.innerHTML = '<div style="padding:32px 16px;text-align:center;color:#f0c040;font-size:1.1rem;font-weight:700;line-height:1.5;">' + successMsg + '</div>';
        } else if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      })
      .catch(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      });
  }

  document.addEventListener('submit', handleMLSubmit, true);
})();
