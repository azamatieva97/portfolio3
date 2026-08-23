(() => {
  const tg = 'https://t.me/Must1ofa1';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.querySelectorAll('img[data-static-src]').forEach(img => {
      img.src = img.dataset.staticSrc;
    });
  }
  if (reduceMotion) {
    document.querySelectorAll('.intro__dna-video, .dna-stage__video').forEach(video => {
      try { video.pause(); } catch (_) {}
      video.removeAttribute('autoplay');
    });
  }
  if (reduceMotion) { document.querySelectorAll('.section-motion').forEach(video => { try { video.pause(); } catch (_) {} }); }
  const intro = document.getElementById('intro');
  const skipIntro = document.getElementById('skipIntro');
  const hasSeenIntro = sessionStorage.getItem('mustafa-intro-seen-v4') === '1';

  const closeIntro = () => {
    if (!intro) return;
    intro.classList.add('is-hidden');
    sessionStorage.setItem('mustafa-intro-seen-v4', '1');
  };

  if (reduceMotion || hasSeenIntro) {
    intro?.classList.add('is-hidden');
  } else {
    window.setTimeout(closeIntro, 3000);
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
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } }), { threshold: .12, rootMargin: '0px 0px -40px' });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('is-visible'));

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
  leadForm?.addEventListener('submit', async e => {
    e.preventDefault();
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
    try { await navigator.clipboard.writeText(message); if (status) status.hidden = false; } catch (_) { if (status) { status.textContent = 'Откройте Telegram и отправьте Мустафе свой запрос.'; status.hidden = false; } }
    window.open(tg, '_blank', 'noopener,noreferrer');
  });
})();
