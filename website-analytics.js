/* Optional analytics for the shared website pages; legacy FoldSpace pages are separate. */
(() => {
  'use strict';
  const ID = 'G-ZVT4SCXJSF';
  const KEY = 'hugonomy.website.analytics.v1';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  let loaded = false;
  const signal = navigator.globalPrivacyControl === true;
  window['ga-disable-' + ID] = true;

  function storedChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (!saved || saved.version !== 1 || !['accepted', 'rejected'].includes(saved.choice)) return null;
      const age = Date.now() - saved.savedAt;
      if (!Number.isFinite(saved.savedAt) || age < 0 || age > MAX_AGE) return null;
      return saved.choice;
    } catch { return null; }
  }

  function loadAnalytics() {
    if (loaded || signal) return;
    loaded = true;
    window['ga-disable-' + ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', ID, {
      allow_google_signals: false, allow_ad_personalization_signals: false,
      cookie_expires: 180 * 24 * 60 * 60, cookie_update: false
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
    document.head.append(script);
  }

  function clearAnalyticsCookies() {
    for (const pair of document.cookie.split(';')) {
      const name = pair.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      const expiry = name + '=; Max-Age=0; Path=/; SameSite=Lax';
      document.cookie = expiry;
      document.cookie = expiry + '; Domain=' + location.hostname;
      document.cookie = expiry + '; Domain=.' + location.hostname;
    }
  }

  const banner = document.createElement('section');
  banner.className = 'analytics-banner';
  banner.setAttribute('aria-labelledby', 'analytics-banner-title');
  const dialog = document.createElement('dialog');
  dialog.className = 'analytics-dialog';
  dialog.setAttribute('aria-labelledby', 'analytics-dialog-title');
  function content(prefix) {
    return '<h2 id="' + prefix + '-title">Optional analytics</h2>' +
      '<p>May we use Google Analytics to understand visits to these shared Hugonomy pages? It is off until you accept.</p>' +
      '<p class="analytics-detail">This choice covers the landing, Systems introduction, Business, SEBANORI walkthrough and website-notices pages. Existing FoldSpace pages have separate analytics. Hosting request logs and Netlify performance monitoring are separate from this choice. <a href="/website-notices.html#website-analytics">Read the website notice</a>.</p>' +
      '<p class="analytics-message" role="status"></p>' +
      '<div class="analytics-actions"><button type="button" data-analytics-choice="rejected">Reject optional analytics</button>' +
      '<button type="button" data-analytics-choice="accepted">Accept Google Analytics</button></div>';
  }
  banner.innerHTML = content('analytics-banner');
  dialog.innerHTML = content('analytics-dialog') +
    '<p class="analytics-detail">Changing an existing choice reloads this page and resets the sample walkthrough.</p>' +
    '<button type="button" class="analytics-close">Close analytics choices</button>';
  document.body.append(banner, dialog);
  dialog.querySelector('.analytics-close').addEventListener('click', () => dialog.close());

  function hideBanner() {
    banner.hidden = true;
    document.body.classList.remove('analytics-prompt');
  }
  function choose(choice, surface) {
    window['ga-disable-' + ID] = true;
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: 1, choice, savedAt: Date.now() }));
    } catch {
      surface.querySelector('.analytics-message').textContent =
        'Your browser could not save this choice. Optional analytics stays off. You may be asked again on another page.';
      // Do not reload into an old accepted preference if persistence failed.
      if (loaded) clearAnalyticsCookies();
      return;
    }
    if (choice === 'rejected') clearAnalyticsCookies();
    const reload = loaded || surface === dialog;
    if (dialog.open) dialog.close();
    hideBanner();
    if (reload) { location.reload(); return; }
    if (choice === 'accepted') loadAnalytics();
  }
  for (const surface of [banner, dialog]) {
    surface.addEventListener('click', event => {
      const button = event.target.closest('[data-analytics-choice]');
      if (button) choose(button.dataset.analyticsChoice, surface);
    });
    if (signal) {
      surface.querySelector('.analytics-message').textContent =
        'Your browser sends Global Privacy Control. Optional Google Analytics remains off.';
      surface.querySelector('[data-analytics-choice="accepted"]').disabled = true;
    }
  }
  document.querySelectorAll('[data-analytics-settings]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => dialog.showModal());
  });
  const choice = storedChoice();
  if (choice || signal) hideBanner();
  else document.body.classList.add('analytics-prompt');
  if (choice === 'accepted') loadAnalytics();
})();
