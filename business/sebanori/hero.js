/* Presentation only: no storage, analytics, AI calls or remote image requests. */
(() => {
  const carousel = document.querySelector('.hero-media');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.hero-slide')];
  const dots = [...carousel.querySelectorAll('[data-hero-slide]')];
  const caption = carousel.querySelector('#mentor-caption');
  const toggle = carousel.querySelector('#mentor-play');
  const stage = carousel.querySelector('.hero-image-stage');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const captions = ['Experience, passed from person to person.', 'Make room for questions.', 'Learn the work, together.'];
  let index = 0;
  let playing = !motion.matches;
  let hovering = false;
  let timer;
  let touch = null;
  let pointerIntent = null;

  const schedule = () => {
    clearTimeout(timer);
    if (playing && !hovering && !document.hidden) timer = setTimeout(() => { show(index + 1); schedule(); }, 7000);
  };
  const playback = () => {
    toggle.textContent = playing ? 'Pause slideshow' : 'Play slideshow';
    toggle.setAttribute('aria-pressed', String(playing));
    caption.setAttribute('aria-live', playing ? 'off' : 'polite');
    schedule();
  };
  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === index)));
    caption.textContent = captions[index];
  };
  const select = (next) => { playing = false; show(next); playback(); };
  dots.forEach((dot, i) => dot.addEventListener('click', () => select(i)));
  carousel.querySelector('#mentor-previous').addEventListener('click', () => select(index - 1));
  carousel.querySelector('#mentor-next').addEventListener('click', () => select(index + 1));
  // Capture pointer intent before focusin pauses rotation, so a click on Pause stays paused.
  toggle.addEventListener('pointerdown', () => { pointerIntent = !playing; });
  toggle.addEventListener('pointercancel', () => { pointerIntent = null; });
  toggle.addEventListener('blur', () => { pointerIntent = null; });
  toggle.addEventListener('click', () => { playing = pointerIntent ?? !playing; pointerIntent = null; playback(); });
  // Keyboard interaction stops rotation; it does not move focus to the new slide.
  carousel.addEventListener('focusin', () => { playing = false; playback(); });
  carousel.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', () => { if (motion.matches) { playing = false; playback(); } });
  stage.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') touch = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointerup', (event) => {
    if (!touch || event.pointerType !== 'touch') return;
    const dx = event.clientX - touch.x;
    const dy = event.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) select(index + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => { touch = null; });
  carousel.querySelector('.hero-photo-controls').hidden = false;
  playback();
})();
