// assets/js/modal.js
document.addEventListener('DOMContentLoaded', () => {
  const showDelay = Math.random() * 2000 + 4000; // 4‑6 seconds
  const storageKey = 'neelvedaGuaranteeDismissed';
  const sessionKey = 'guaranteeSeen';

  const isCooldownOver = () => {
    const ts = localStorage.getItem(storageKey);
    return !ts || (Date.now() - Number(ts) > 7200000); // 2 hours
  };

  if (!sessionStorage.getItem(sessionKey) && isCooldownOver()) {
    setTimeout(initModal, showDelay);
  }

  function initModal() {
    const overlay = document.createElement('div');
    overlay.id = 'guarantee-modal-overlay';
    overlay.className = 'guarantee-overlay';
    overlay.innerHTML = `
      <div class="guarantee-modal">
        <button class="guarantee-close" aria-label="Close">&times;</button>
        <h2 class="guarantee-title">🌿 Neelveda Cash Back Guarantee</h2>
        <p class="guarantee-badge"><strong>100&nbsp;%</strong></p>
        <p class="guarantee-desc">Use Neelveda Herbal Hair Oil regularly to help reduce dandruff naturally and nourish your scalp.</p>
        <p class="guarantee-text">If you do not notice improvement in dandruff care within 7 days of proper usage, contact us for cashback assistance and customer support.</p>
        <a href="https://neelveda.in/products/herbal-oil/" class="guarantee-cta" target="_blank" rel="noopener">Order now</a>
      </div>`;
    document.body.appendChild(overlay);
    // Show modal
    requestAnimationFrame(() => overlay.classList.add('active'));
    document.body.classList.add('modal-open');
    sessionStorage.setItem(sessionKey, 'true');

    const closeModal = () => {
      overlay.classList.remove('active');
      document.body.classList.remove('modal-open');
      localStorage.setItem(storageKey, Date.now().toString());
      setTimeout(() => overlay.remove(), 300);
    };

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
    overlay.querySelector('.guarantee-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
    });
  }
});
