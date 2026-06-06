// HYDROON — MAIN SCRIPT

document.addEventListener('DOMContentLoaded', function () {

  // ===== LOADING OVERLAY =====
  window.addEventListener('load', function () {
    setTimeout(function () {
      const overlay = document.getElementById('loadingOverlay');
      if (overlay) overlay.classList.add('hidden');
    }, 600);
  });

  // ===== NAV SCROLL =====
  const nav = document.getElementById('siteNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===== MOBILE MENU =====
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }

  // ===== HERO PARTICLES =====
  const container = document.getElementById('heroParticles');
  if (container) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.width = (Math.random() * 2 + 1) + 'px';
      p.style.height = p.style.width;
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = (Math.random() * 10 + 8) + 's';
      container.appendChild(p);
    }
  }

  // ===== SCROLL REVEAL =====
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  // ===== FICHA: PRÉ-SELECIONAR RAÇA POR URL =====
  const racaSelect = document.getElementById('racaSelect');
  if (racaSelect) {
    const params = new URLSearchParams(window.location.search);
    const raca = params.get('raca');
    if (raca) {
      const option = racaSelect.querySelector('option[value="' + raca + '"]');
      if (option) racaSelect.value = raca;
    }
  }

  // ===== FICHA: SALVAR NO LOCALSTORAGE =====
  const fichaForm = document.getElementById('fichaForm');
  if (fichaForm) {
    // Carregar dados salvos
    const saved = localStorage.getItem('hydroon_ficha');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(function (key) {
          const el = fichaForm.querySelector('[name="' + key + '"]');
          if (el) el.value = data[key];
        });
      } catch (e) {}
    }

    // Salvar
    document.getElementById('btnSalvar')?.addEventListener('click', function () {
      const inputs = fichaForm.querySelectorAll('[name]');
      const data = {};
      inputs.forEach(function (el) { data[el.name] = el.value; });
      localStorage.setItem('hydroon_ficha', JSON.stringify(data));
      showToast('Ficha salva com sucesso!');
    });

    // Limpar
    document.getElementById('btnLimpar')?.addEventListener('click', function () {
      if (confirm('Tem certeza que quer apagar todos os dados?')) {
        fichaForm.querySelectorAll('input, select, textarea').forEach(function (el) {
          el.value = '';
        });
        localStorage.removeItem('hydroon_ficha');
        showToast('Ficha apagada.');
      }
    });
  }

  // ===== TOAST =====
  function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#1e1e30;border:1px solid rgba(200,169,90,0.4);color:#c8a95a;font-family:Cinzel,serif;font-size:0.78rem;letter-spacing:0.1em;padding:1rem 1.5rem;z-index:9999;opacity:0;transition:opacity 0.3s ease;text-transform:uppercase;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(function () { toast.style.opacity = '0'; }, 3000);
  }

});
