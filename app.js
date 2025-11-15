// ----------------------
// 1. Database of products
// ----------------------
const products = [
    {
        id: 1,
        name_ar: "رف جداري",
        name_fr: "Étagère murale",
        price: 850,
        colors: ["#e0f7fa", "#b2ebf2", "#80deea"],
        image: "./images/product1.jpg",
        description_ar: "رف جداري بتصميم عصري مناسب لجميع الديكورات.",
        description_fr: "Étagère murale moderne adaptée à toutes les décorations."
    },
    {
        id: 2,
        name_ar: "طاولة قهوة",
        name_fr: "Table basse",
        price: 1200,
        colors: ["#fce4ec", "#f8bbd0", "#f48fb1"],
        image: "./images/product2.jpg",
        description_ar: "طاولة قهوة أنيقة تضيف لمسة فاخرة لغرفة المعيشة.",
        description_fr: "Table basse élégante ajoutant une touche luxueuse au salon."
    }
];


// ----------------------
// 2. Detect language
// ----------------------
let currentLang = localStorage.getItem("lang") || "ar";

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);
    renderProducts();
    applyText();
}

function applyText() {
    document.getElementById("site-title").textContent = currentLang === "ar" ? "ديكور منزلي ▪ التصميم العصري" : "Décoration intérieure ▪ Design moderne";
    document.getElementById("search").placeholder = currentLang === "ar" ? "ابحث عن منتج..." : "Rechercher...";
}

applyText();


// ----------------------
// 3. Render products
// ----------------------
function renderProducts() {
    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.image}" alt="${currentLang === "ar" ? product.name_ar : product.name_fr}" class="product-image" onclick="openPopup(${product.id})">

            <h3>${currentLang === "ar" ? product.name_ar : product.name_fr}</h3>

            <p class="price">${product.price} د.م</p>

            <div class="colors">
                ${product.colors.map(c => `<span class="color" style="background:${c}"></span>`).join("")}
            </div>

            <div class="buttons">
                <button onclick="openPopup(${product.id})">
                    ${currentLang === "ar" ? "تفاصيل" : "Détails"}
                </button>

                <a class="buy-btn" href="https://wa.me/212691010696?text=Je veux acheter: ${product.name_fr}">
                    ${currentLang === "ar" ? "اشتري عبر واتساب" : "Acheter sur WhatsApp"}
                </a>
            </div>
        `;

        container.appendChild(card);
    });
}

renderProducts();


// ----------------------
// 4. Product Popup
// ----------------------
function openPopup(id) {
    const product = products.find(p => p.id === id);

    document.getElementById("popup-image").src = product.image;
    document.getElementById("popup-title").textContent = currentLang === "ar" ? product.name_ar : product.name_fr;
    document.getElementById("popup-desc").textContent = currentLang === "ar" ? product.description_ar : product.description_fr;
    document.getElementById("popup-price").textContent = product.price + " د.م";

    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}


// ----------------------
// 5. Search System
// ----------------------
document.getElementById("search").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase().trim();

    document.querySelectorAll(".product-card").forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(searchValue) ? "block" : "none";
    });
});
