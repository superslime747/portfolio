// js/main.js

// ⚠️ URL backend на Render (не меняется)
const API_URL = 'https://portfolio-backend-pxdb.onrender.com';

// ============================================================
// === 1. Активный пункт меню ===
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage) item.classList.add('active');
  });

  initCursorGlow();
  initRevealOnScroll();
  initToTop();
  initCounters();
  initTypewriter();
  initLightbox();
  initRipple();
});

// ============================================================
// === 2. Обработка формы связи (BACKEND НЕ ТРОГАЕМ) ===
// ============================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;

    const payload = {
      name: document.getElementById('name').value.trim(),
      method: document.getElementById('method').value,
      contact: document.getElementById('contact').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    if (!payload.name || !payload.method || !payload.contact) {
      showToast('Заполните все обязательные поля', '#e74c3c');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        showToast('✅ Заявка отправлена! Я свяжусь с вами.', '#22c55e');
        contactForm.reset();
      } else {
        const errMsg = (data.errors || ['Ошибка отправки']).join(', ');
        showToast(`❌ ${errMsg}`, '#e74c3c');
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Не удалось связаться с сервером', '#e74c3c');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// ============================================================
// === 3. Toast ===
// ============================================================
function showToast(text, color = '#4d8dff') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.style.background = color;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ============================================================
// === 4. Свечение за курсором ===
// ============================================================
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let gx = mx;
  let gy = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function loop() {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(loop);
  }
  loop();
}

// ============================================================
// === 5. Reveal on scroll ===
// ============================================================
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
}

// ============================================================
// === 6. Кнопка "наверх" ===
// ============================================================
function initToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('show');
    else btn.classList.remove('show');
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// === 7. Счётчики (на главной) ===
// ============================================================
function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
}

// ============================================================
// === 8. Typewriter в hero ===
// ============================================================
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const text = el.dataset.text || '';
  el.textContent = '';
  let i = 0;

  function tick() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(tick, 35);
    }
  }
  setTimeout(tick, 600);
}

// ============================================================
// === 9. Lightbox для галереи ===
// ============================================================
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('.gallery img, .project-main-image').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
  }
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

// ============================================================
// === 10. Ripple на кнопках ===
// ============================================================
function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
}