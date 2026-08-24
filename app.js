(() => {
  const tg = 'https://t.me/Must1ofa1';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.querySelectorAll('video').forEach(video => {
      try { video.pause(); } catch (_) {}
      video.removeAttribute('autoplay');
    });
  }
  const intro = document.getElementById('intro');
  const skipIntro = document.getElementById('skipIntro');

  const closeIntro = () => {
    if (!intro) return;
    intro.classList.add('is-hidden');
  };

  if (reduceMotion) {
    intro?.classList.add('is-hidden');
  } else {
    window.setTimeout(closeIntro, 2800);
  }

  skipIntro?.addEventListener('click', closeIntro);

  const menu = document.getElementById('menu');
  const nav = document.getElementById('nav');
  menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('nav--open') || false;
    menu.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('nav--open'); menu?.setAttribute('aria-expanded','false'); }));

  const heroVisual = document.getElementById('heroVisual');

  if (heroVisual && !reduceMotion) {
    let raf = 0;
    window.addEventListener('pointermove', e => {
      if (window.innerWidth < 900 || (intro && !intro.classList.contains('is-hidden'))) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - .5) * 10;
        const y = (e.clientY / window.innerHeight - .5) * 8;
        heroVisual.style.transform = `translate3d(${x}px,${y}px,0) rotateX(${-y/2}deg) rotateY(${x/2}deg)`;
      });
    }, { passive: true });
  }

  const leadForm = document.getElementById('leadForm');
  const status = document.getElementById('formStatus');
  const submitButton = document.getElementById('submitButton');
  leadForm?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!leadForm.reportValidity()) return;
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = 'Подготавливаю запрос…'; }
    const fd = new FormData(leadForm);
    const message = [
      'Здравствуйте! Хочу получить бесплатный персональный подбор.',
      `Имя: ${fd.get('name') || '—'}`,
      `Возраст: ${fd.get('age') || '—'}`,
      `Цель: ${fd.get('goal') || '—'}`,
      `Ситуация: ${fd.get('situation') || '—'}`,
      `Что принимаю сейчас: ${fd.get('current') || '—'}`,
      `Мой Telegram: ${fd.get('telegram') || '—'}`
    ].join('\n');
    const telegramWindow = window.open(`${tg}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    try {
      await navigator.clipboard.writeText(message);
      if (status) { status.textContent = 'Запрос подготовлен. Проверьте текст и отправьте его в открывшемся чате Telegram.'; status.hidden = false; }
    } catch (_) {
      if (status) { status.textContent = 'Откройте Telegram и отправьте Мустафе свой запрос.'; status.hidden = false; }
    }
    if (!telegramWindow) window.location.href = `${tg}?text=${encodeURIComponent(message)}`;
    if (submitButton) { submitButton.disabled = false; submitButton.textContent = 'Отправить запрос в Telegram'; }
  });
})();
