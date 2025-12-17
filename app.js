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
        ? `مرحباً،
