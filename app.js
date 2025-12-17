const whatsappNumber = '212691010969';

let products = [
  {
    name_ar: 'طاولة قهوة',
    name_fr: 'Table basse',
    price: '1200 د.م',
    images: ['./IMAGES/coffee_table1.jpg']
  },
  {
    name_ar: 'رف جداري',
    name_fr: 'Étagère murale',
    price: '850 د.م',
    images: ['./IMAGES/wall_shelf1.jpg']
  }
];

let currentLang = 'ar';

const grid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const footerText = document.getElementById('footer-text');

const i18n = {
  ar: {
    buy: 'اشتري عبر واتساب',
    search: 'ابحث عن منتج...',
    footer: 'اتصل/واتساب: 0691010969 — DECOLAB'
  },
  fr: {
    buy: 'Acheter via WhatsApp',
    search: 'Rechercher...',
    footer: 'Contact/WhatsApp: 0691010969 — DECOLAB'
  }
};

function renderProducts(filter = '') {
  grid.innerHTML = '';

  products
    .filter(p => p['name_' + currentLang].includes(filter))
    .forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <img src="${p.images[0]}">
        <h3>${p['name_' + currentLang]}</h3>
        <div class="price">${p.price}</div>
        <button class="btn">${i18n[currentLang].buy}</button>
      `;

      card.querySelector('button').onclick = () => {
        const msg = currentLang === 'ar'
          ? `أريد شراء ${p.name_ar}`
          : `Je veux acheter ${p.name_fr}`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`);
      };

      grid.appendChild(card);
    });
}

function setLang(lang) {
  currentLang = lang;
  searchInput.placeholder = i18n[lang].search;
  footerText.textContent = i18n[lang].footer;
  renderProducts(searchInput.value);
}

searchInput.addEventListener('input', e => renderProducts(e.target.value));
document.getElementById('btn-ar').onclick = () => setLang('ar');
document.getElementById('btn-fr').onclick = () => setLang('fr');

const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('show', window.scrollY > 300);
});

backToTopBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', () => {
  setLang('ar');
});
