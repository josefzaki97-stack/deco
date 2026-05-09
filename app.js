document.addEventListener('DOMContentLoaded', () => {

  /* ======================
     إعدادات عامة
  ====================== */
  const whatsappNumber = '212691010969';
  const adminPassword = 'admin123';

  let products = JSON.parse(localStorage.getItem('decolab_products')) || [
    {
      id: '1',
      name_ar: 'طاولة قهوة',
      name_fr: 'Table basse',
      price: '1200 د.م',
      images: ['./IMAGES/coffee_table1.jpg']
    },
    {
      id: '2',
      name_ar: 'رف جداري',
      name_fr: 'Étagère murale',
      price: '850 د.م',
      images: ['./IMAGES/wall_shelf1.jpg']
    }
  ];

  let currentLang = 'ar';

  /* ======================
     عناصر الصفحة
  ====================== */
  const grid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const footerText = document.getElementById('footer-text');

  const adminPanel = document.getElementById('adminPanel');
  const adminToggle = document.getElementById('adminToggle');
  const loginModal = document.getElementById('loginModal');
  const loginBtn = document.getElementById('loginBtn');
  const adminPassInput = document.getElementById('adminPassword');
  const loginError = document.getElementById('loginError');

  /* ======================
     الترجمة
  ====================== */
  const i18n = {
    ar: {
      buy: 'اشتري عبر واتساب',
      details: 'تفاصيل',
      noResults: 'لا توجد نتائج',
      search: 'ابحث عن منتج...',
      footer: 'اتصل/واتساب: 0691010969 — DECOLAB',
      subtitle: 'ديكور منزلي • التصميم العصري'
    },

    fr: {
      buy: 'Acheter via WhatsApp',
      details: 'Détails',
      noResults: 'Aucun résultat',
      search: 'Rechercher...',
      footer: 'Contact/WhatsApp: 0691010969 — DECOLAB',
      subtitle: 'Décoration intérieure • Design moderne'
    }
  };

  /* ======================
     عرض المنتجات
  ====================== */
  function renderProducts(filter = '') {

    grid.innerHTML = '';

    const list = products.filter(p =>
      p['name_' + currentLang]
      .toLowerCase()
      .includes(filter.toLowerCase())
    );

    if (!list.length) {
      grid.innerHTML = `
        <p class="no-results">
          ${i18n[currentLang].noResults}
        </p>
      `;
      return;
    }

    list.forEach(p => {

      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${p.images[0]}" alt="${p['name_' + currentLang]}">

        <div class="card-content">

          <h3>${p['name_' + currentLang]}</h3>

          <div class="price">
            ${p.price}
          </div>

          <button class="btn buy-btn">
            ${i18n[currentLang].buy}
          </button>

        </div>
      `;

      /* زر واتساب */
      card.querySelector('button').onclick = () => {

        const msg = currentLang === 'ar'
          ? `أريد شراء ${p.name_ar}`
          : `Je veux acheter ${p.name_fr}`;

        window.open(
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,
          '_blank'
        );
      };

      grid.appendChild(card);

    });

  }

  /* ======================
     البحث
  ====================== */
  searchInput.addEventListener('input', e => {
    renderProducts(e.target.value);
  });

  /* ======================
     اللغة
  ====================== */
  document.getElementById('btn-ar').onclick = () => {
    setLang('ar');
  };

  document.getElementById('btn-fr').onclick = () => {
    setLang('fr');
  };

  function setLang(lang) {

    currentLang = lang;

    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

    searchInput.placeholder = i18n[lang].search;

    footerText.textContent = i18n[lang].footer;

    renderProducts(searchInput.value);

  }

  /* ======================
     الأدمن
  ====================== */
  if (adminToggle) {

    adminToggle.onclick = () => {

      if (loginModal) {
        loginModal.classList.remove('hidden');
      }

      if (adminPassInput) {
        adminPassInput.value = '';
      }

      if (loginError) {
        loginError.textContent = '';
      }

    };

  }

  if (loginBtn) {

    loginBtn.onclick = () => {

      if (adminPassInput.value === adminPassword) {

        loginModal.classList.add('hidden');

        if (adminPanel) {
          adminPanel.classList.remove('hidden');
        }

      } else {

        loginError.textContent =
          '❌ كلمة المرور غير صحيحة';

        setTimeout(() => {

          loginModal.classList.add('hidden');

          loginError.textContent = '';

        }, 1500);

      }

    };

  }

  /* ======================
     زر العودة للأعلى
  ====================== */
  const backToTopBtn =
    document.getElementById('backToTop');

  window.addEventListener('scroll', () => {

    if (backToTopBtn) {

      backToTopBtn.classList.toggle(
        'show',
        window.scrollY > 300
      );

    }

  });

  if (backToTopBtn) {

    backToTopBtn.onclick = () => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    };

  }

  /* ======================
     بدء التشغيل
  ====================== */
  setLang('ar');

});