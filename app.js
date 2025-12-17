// ======================
// إعدادات عامة
// ======================
const whatsappNumber = '212691010969';
const adminPassword = 'admin123';

let products = JSON.parse(localStorage.getItem('decolab_products')) || [
  {
    id: '1',
    name_ar: 'طاولة قهوة',
    name_fr: 'Table basse',
    price: '1200 د.م',
    images: [
      './images/coffee_table1.jpg',
      './images/coffee_table2.jpg',
      './images/coffee_table3.jpg'
    ]
  },
  {
    id: '2',
    name_ar: 'رف جداري',
    name_fr: 'Étagère murale',
    price: '850 د.م',
    images: [
      './images/wall_shelf1.jpg',
      './images/wall_shelf2.jpg'
    ]
  }
];

let currentLang = 'ar';


// ======================
// عناصر الصفحة
// ======================
const grid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const footerText = document.getElementById('footer-text');
const adminPanel = document.getElementById('adminPanel');
const loginModal = document.getElementById('loginModal');


// ======================
// الترجمة
// ======================
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


// ======================
// عرض المنتجات
// ======================
function renderProducts(filter = '') {
  grid.innerHTML = '';

  const list = products.filter(p => {
    const name = (p['name_' + currentLang] || '').toLowerCase();
    return !filter || name.includes(filter.toLowerCase());
  });

  if (list.length === 0) {
    grid.innerHTML = `<p style="color:#888">${i18n[currentLang].noResults}</p>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'img-wrap';

    const img = document.createElement('img');
    img.src = p.images[0];
    img.alt = p['name_' + currentLang];
    imgWrap.appendChild(img);

    imgWrap.onclick = () => openProductModal(p);

    const h3 = document.createElement('h3');
    h3.textContent = p['name_' + currentLang];
    h3.onclick = () => openProductModal(p);

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = p.price;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const buy = document.createElement('button');
    buy.className = 'btn';
    buy.textContent = i18n[currentLang].buy;
    buy.onclick = () => {
      const msg = currentLang === 'ar'
        ? `مرحباً، أود شراء ${p.name_ar} بسعر ${p.price}`
        : `Bonjour, je veux acheter ${p.name_fr} prix ${p.price}`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const info = document.createElement('button');
    info.className = 'btn secondary';
    info.textContent = i18n[currentLang].details;
    info.onclick = () => openProductModal(p);

    actions.append(buy, info);
    card.append(imgWrap, h3, price, actions);
    grid.appendChild(card);
  });
}


// ======================
// البحث
// ======================
searchInput.addEventListener('input', e => renderProducts(e.target.value));


// ======================
// اللغة
// ======================
document.getElementById('btn-ar').onclick = () => setLang('ar');
document.getElementById('btn-fr').onclick = () => setLang('fr');

function setLang(l) {
  currentLang = l;
  document.body.classList.toggle('lang-ar', l === 'ar');
  searchInput.placeholder = i18n[l].search;
  footerText.textContent = i18n[l].footer;
  document.getElementById('site-sub').textContent = i18n[l].subtitle;
  renderProducts(searchInput.value);
}


// ======================
// لوحة الإدارة
// ======================
document.getElementById('adminToggle').onclick = () => {
  loginModal.classList.remove('hidden');
};

document.getElementById('loginBtn').onclick = () => {
  const pass = document.getElementById('adminPassword').value;

  if (pass === adminPassword) {
    loginModal.classList.add('hidden');
    adminPanel.classList.remove('hidden');
  } else {
    document.getElementById('loginError').textContent = '❌ كلمة المرور غير صحيحة';
    setTimeout(() => {
      loginModal.classList.add('hidden');
      document.getElementById('loginError').textContent = '';
      document.getElementById('adminPassword').value = '';
    }, 1500);
  }
};

loginModal.addEventListener('click', e => {
  if (e.target === loginModal) loginModal.classList.add('hidden');
});


// ======================
// نافذة التفاصيل
// ======================
const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
const closeModal = document.getElementById('closeModal');

let currentImages = [];
let currentIndex = 0;

function openProductModal(product) {
  modal.classList.remove('hidden');
  currentImages = product.images;
  currentIndex = 0;
  modalImage.src = currentImages[0];
  modalName.textContent = product['name_' + currentLang];
  modalPrice.textContent = product.price;
}

closeModal.onclick = () => modal.classList.add('hidden');
modal.addEventListener('click', e => {
  if (e.target === modal) modal.classList.add('hidden');
});


// ======================
// زر العودة للأعلى (آمن)
// ======================
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('show', window.scrollY > 300);
  });

  backToTopBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}


// ======================
// بدء التشغيل
// ======================
document.addEventListener('DOMContentLoaded', () => {
  setLang('ar');
});
