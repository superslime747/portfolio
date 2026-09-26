// js/main.js

// ⚠️ ЗАМЕНИ на URL своего backend на Render
const API_URL = 'https://portfolio-backend-pxdb.onrender.com';

// === Активный пункт меню ===
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage) {
      item.classList.add('active');
    }
  });
});

// === Обработка формы связи ===
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
        showToast('✅ Заявка отправлена! Я свяжусь с вами.', '#2a82da');
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

function showToast(text, color = '#2a82da') {
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
  setTimeout(() => toast.classList.remove('show'), 3500);
}