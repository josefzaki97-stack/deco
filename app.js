// ===== إعدادات عامة =====
const whatsappNumber = '212691010696';
const adminPassword = 'admin123'; // ← يمكنك تغييره هنا

let products = JSON.parse(localStorage.getItem('decolab_products')) || [
  {
    id:'1',
    name_ar:'طاولة قهوة',
    name_fr:'Table basse',
    price:'1200 د.م',
    images:[
      'IMAGES/coffee_table1.jpg',
      'IMAGES/coffee_table2.jpg',
      'IMAGES/coffee_table3.jpg'
    ]
  },
  {
    id:'2',
    name_ar:'رف جداري',
    name_fr:'Étagère murale',
    price:'850 د.م',
    images:[
      'IMAGES/wall_shelf1.jpg',
      'IMAGES/wall_shelf2.jpg'
    ]
  }
];

let currentLang = 'ar';

// ===== عناصر الصفحة =====
const grid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const footerText = document.getElementById('footer-text');
const adminPanel = document.getElementById('adminPanel');
const loginModal = document.getElementById('loginModal');

// ===== ترجمة =====
const i18n = {
  ar:{
    buy:'اشتري عبر واتساب',
    details:'تفاصيل',
    noResults:'لا توجد نتائج',
    search:'ابحث عن منتج...',
    footer:'اتصل/واتساب: 0691010696 — DECOLAB',
    subtitle:'ديكور منزلي • التصميم العصري'
  },
  fr:{
    buy:'Acheter via WhatsApp',
    details:'Détails',
    noResults:'Aucun résultat',
    search:'Rechercher...',
    footer:'Contact/WhatsApp: 0691010696 — DECOLAB',
    subtitle:'Décoration intérieure • Design moderne'
  }
};

// ===== عرض المنتجات =====
function renderProducts(filter='') {
  grid.innerHTML='';
  const list = products.filter(p=>{
    const name=(p['name_'+currentLang]||'').toLowerCase();
    return !filter || name.includes(filter.toLowerCase());
  });
  if(list.length===0){grid.innerHTML=`<p style="color:#888">${i18n[currentLang].noResults}</p>`;return;}
  list.forEach(p=>{
    const card=document.createElement('div');card.className='card';
    const imgWrap=document.createElement('div');imgWrap.className='img-wrap';
// عرض الصورة الأولى فقط في الصفحة الرئيسية
const img = document.createElement('img');
img.src = p.images[0];
img.alt = p['name_' + currentLang];
imgWrap.appendChild(img);


    const h3=document.createElement('h3');h3.textContent=p['name_'+currentLang];
    h3.style.cursor='pointer';
h3.onclick=()=>openProductModal(p);
imgWrap.onclick=()=>openProductModal(p);

    const price=document.createElement('div');price.textContent=p.price;price.className='price';
    const swatches=document.createElement('div');swatches.className='swatches';
    const colors=[
      {label:'أخضر-أزرق',value:'linear-gradient(135deg,#7fcf88,#9fd6e5)'},
      {label:'أزرق فاتح',value:'#9fd6e5'},
      {label:'أبيض',value:'#ffffff'}
    ];
    colors.forEach((c,idx)=>{
      const s=document.createElement('div');s.className='swatch';s.style.background=c.value;
      if(idx===0)s.classList.add('selected');
      s.addEventListener('click',()=>{
        swatches.querySelectorAll('.swatch').forEach(x=>x.classList.remove('selected'));
        s.classList.add('selected');
        imgWrap.style.background=c.value.includes('gradient')?c.value:`linear-gradient(180deg,${c.value},#fff)`;
      });
      swatches.appendChild(s);
    });

    const actions=document.createElement('div');actions.className='actions';
    const buy=document.createElement('button');buy.className='btn';buy.textContent=i18n[currentLang].buy;
    buy.onclick=()=>{
      const selected=swatches.querySelector('.selected');
      const colorText=selected?selected.style.background:'';
      const msg=currentLang==='ar'
        ?`مرحباً، أود شراء ${p.name_ar} بلون ${colorText} بسعر ${p.price}`
        :`Bonjour, je veux acheter ${p.name_fr} couleur ${colorText} prix ${p.price}`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,'_blank');
    };
    const info=document.createElement('button');info.className='btn secondary';info.textContent=i18n[currentLang].details;
    info.onclick=()=>alert(`${p['name_'+currentLang]} - ${p.price}`);
    actions.append(buy,info);

    card.append(imgWrap,h3,price,swatches,actions);
    grid.appendChild(card);
  });
}

// ===== البحث =====
searchInput.placeholder=i18n[currentLang].search;
searchInput.addEventListener('input',e=>renderProducts(e.target.value));

// ===== اللغة =====
document.getElementById('btn-ar').onclick=()=>setLang('ar');
document.getElementById('btn-fr').onclick=()=>setLang('fr');
function setLang(l){currentLang=l;document.body.classList.toggle('lang-ar',l==='ar');
  searchInput.placeholder=i18n[l].search;
  footerText.textContent=i18n[l].footer;
  renderProducts(searchInput.value);
  document.getElementById('site-sub').textContent = i18n[l].subtitle;

}

// ===== لوحة الإدارة =====
document.getElementById('adminToggle').onclick=()=>showLogin();

function showLogin(){
  loginModal.classList.remove('hidden');
  document.getElementById('adminPassword').value='';
  document.getElementById('loginError').textContent='';
  document.getElementById('adminPassword').focus();
}
document.getElementById('loginBtn').onclick=()=>{
  const pass=document.getElementById('adminPassword').value;
  if(pass===adminPassword){
    loginModal.classList.add('hidden');
    adminPanel.classList.toggle('hidden');
  } else {
    document.getElementById('loginError').textContent='❌ كلمة المرور غير صحيحة';
  }
};

// ===== إضافة منتج =====
document.getElementById('addForm').addEventListener('submit',e=>{
  e.preventDefault();
  const p={
    id:Date.now().toString(),
    name_ar:document.getElementById('name_ar').value,
    name_fr:document.getElementById('name_fr').value,
    price:document.getElementById('price').value,
    images:document.getElementById('images').value.split(',').map(x=>'IMAGES/'+x.trim())
  };
  products.push(p);
  localStorage.setItem('decolab_products',JSON.stringify(products));
  e.target.reset();
  renderProducts();
  alert('✅ تمت إضافة المنتج!');
});

// ===== تصدير / استيراد =====
document.getElementById('exportBtn').onclick=()=>{
  const blob=new Blob([JSON.stringify(products,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download='decolab_products.json';
  a.click();
};
document.getElementById('importBtn').onclick=()=>document.getElementById('importFile').click();
document.getElementById('importFile').onchange=e=>{
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      products=JSON.parse(reader.result);
      localStorage.setItem('decolab_products',JSON.stringify(products));
      renderProducts();
      alert('📥 تم استيراد المنتجات بنجاح');
    }catch{alert('❌ ملف غير صالح');}
  };
  reader.readAsText(file);
};

// ===== بدء التشغيل =====
setLang('ar');
renderProducts();

// ===== نافذة تفاصيل المنتج =====
const modal = document.getElementById('productModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalColors = document.getElementById('modalColors');
const modalBuy = document.getElementById('modalBuy');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const closeModal = document.getElementById('closeModal');

let currentImages = [];
let currentIndex = 0;
let currentProduct = null;

function openProductModal(product) {
  modal.classList.remove('hidden');
  currentImages = product.images;
  currentIndex = 0;
  currentProduct = product;
  updateModal();
}

function updateModal() {
  modalImage.src = currentImages[currentIndex];
  modalName.textContent = currentProduct['name_'+currentLang];
  modalPrice.textContent = currentProduct.price;
  modalDesc.textContent = currentLang === 'ar'
    ? (currentProduct.desc_ar || 'منتج عالي الجودة لتزيين منزلك.')
    : (currentProduct.desc_fr || 'Produit de haute qualité pour décorer votre maison.');

  // الألوان
  modalColors.innerHTML = '';
  const colors = [
    {label:'أخضر-أزرق',value:'linear-gradient(135deg,#7fcf88,#9fd6e5)'},
    {label:'أزرق فاتح',value:'#9fd6e5'},
    {label:'أبيض',value:'#ffffff'}
  ];
  colors.forEach((c,idx)=>{
    const s=document.createElement('div');
    s.className='swatch';
    s.style.background=c.value;
    if(idx===0)s.classList.add('selected');
    s.onclick=()=>{
      modalColors.querySelectorAll('.swatch').forEach(x=>x.classList.remove('selected'));
      s.classList.add('selected');
    };
    modalColors.appendChild(s);
  });
}

modalPrev.onclick=()=>{currentIndex=(currentIndex-1+currentImages.length)%currentImages.length;updateModal();};
modalNext.onclick=()=>{currentIndex=(currentIndex+1)%currentImages.length;updateModal();};
closeModal.onclick=()=>modal.classList.add('hidden');

modalBuy.onclick=()=>{
  const selected=modalColors.querySelector('.selected');
  const colorText=selected?selected.style.background:'';
  const msg=currentLang==='ar'
    ?`مرحباً، أود شراء ${currentProduct.name_ar} بلون ${colorText} بسعر ${currentProduct.price}`
    :`Bonjour, je veux acheter ${currentProduct.name_fr} couleur ${colorText} prix ${currentProduct.price}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,'_blank');
};

// إغلاق عند الضغط خارج المربع
modal.addEventListener('click',e=>{
  if(e.target===modal) modal.classList.add('hidden');
});

// 🔝 زر العودة للأعلى
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
