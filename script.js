
// APPLE STORE JAVASCRIPT

const accountModal = document.getElementById("accountModal");
const cartModal = document.getElementById("cartModal");
const accountForm = document.getElementById("accountForm");

let isLogin = false;
let selectedProduct = "";
let cart = JSON.parse(localStorage.getItem("appleCart")) || [];

const prices = {
    "iPhone 17 Pro": 15999000,
    "iPhone 17": 11999000,
    "MacBook Pro": 24999000,
    "iPad Pro": 13499000,
    "Apple Watch": 5499000,
    "AirPods": 2999000
};

// TOAST

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// ACCOUNT MODAL

function openAccount(product = "") {
    selectedProduct = product;

    document.getElementById("selectedProduct").textContent =
        product ? "Tanlangan mahsulot: " + product : "";

    accountModal.classList.add("show");
    cartModal.classList.remove("show");
}

document.getElementById("accountBtn").addEventListener("click", () => {
    openAccount();
});

document.querySelectorAll(".buy-btn").forEach(button => {
    button.addEventListener("click", () => {
        openAccount(button.dataset.product);
    });
});

// LOGIN / REGISTER SWITCH

document.getElementById("switchMode").addEventListener("click", () => {
    isLogin = !isLogin;

    document.getElementById("formTitle").textContent =
        isLogin ? "Apple ID bilan kiring" : "Apple ID yarating";

    document.getElementById("formDescription").textContent =
        isLogin
            ? "Hisobingizga kirish uchun ma'lumotlaringizni kiriting."
            : "Apple Store xizmatlaridan foydalanish uchun ro'yxatdan o'ting.";

    document.getElementById("fullName").style.display =
        isLogin ? "none" : "block";

    document.getElementById("fullName").required = !isLogin;

    document.getElementById("formSubmit").textContent =
        isLogin ? "Kirish" : "Ro'yxatdan o'tish";

    document.getElementById("switchQuestion").textContent =
        isLogin ? "Hisobingiz yo'qmi?" : "Hisobingiz bormi?";

    document.getElementById("switchMode").textContent =
        isLogin ? "Ro'yxatdan o'tish" : "Kirish";

    accountForm.reset();
});

// FORM SUBMIT

accountForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("appleUsers")) || [];

    if (isLogin) {
        const user = users.find(item =>
            item.email === email && item.password === password
        );

        if (!user) {
            showToast("Email yoki parol noto'g'ri!");
            return;
        }

        localStorage.setItem("appleCurrentUser", JSON.stringify(user));
        accountModal.classList.remove("show");
        showToast("Xush kelibsiz, " + user.name + "!");

    } else {
        if (users.some(item => item.email === email)) {
            showToast("Bu email avval ro'yxatdan o'tgan!");
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);

        localStorage.setItem("appleUsers", JSON.stringify(users));
        localStorage.setItem("appleCurrentUser", JSON.stringify(newUser));

        accountModal.classList.remove("show");
        showToast("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
    }

    accountForm.reset();

    if (selectedProduct) {
        showToast(selectedProduct + " tanlandi!");
    }
});

// CLOSE MODALS

document.querySelectorAll(".modal-close").forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById(button.dataset.close)
            .classList.remove("show");
    });
});

[accountModal, cartModal].forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        accountModal.classList.remove("show");
        cartModal.classList.remove("show");
    }
});

// ADD TO CART

document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
        const product = button.dataset.product;

        cart.push({
            id: Date.now() + Math.random(),
            name: product,
            price: prices[product] || 0
        });

        saveCart();
        showToast(product + " savatga qo'shildi!");
    });
});

// SAVE CART

function saveCart() {
    localStorage.setItem("appleCart", JSON.stringify(cart));

    document.getElementById("cartCount").textContent = cart.length;

    renderCart();
}

// RENDER CART

function renderCart() {
    const container = document.getElementById("cartItems");

    if (cart.length === 0) {
        container.innerHTML = "<p>Savatchangiz hozircha bo'sh.</p>";
    } else {
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div>
                    <strong>${escapeHTML(item.name)}</strong>
                    <p>${item.price.toLocaleString("uz-UZ")} so'm</p>
                </div>
                <button data-remove="${item.id}">O'chirish ✕</button>
            </div>
        `).join("");
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    document.getElementById("cartTotal").textContent =
        total.toLocaleString("uz-UZ") + " so'm";

    container.querySelectorAll("[data-remove]").forEach(button => {
        button.addEventListener("click", () => {
            cart = cart.filter(item =>
                String(item.id) !== button.dataset.remove
            );

            saveCart();
            showToast("Mahsulot savatdan o'chirildi!");
        });
    });
}

// SAFE TEXT

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// OPEN CART

document.getElementById("cartBtn").addEventListener("click", () => {
    renderCart();
    cartModal.classList.add("show");
});

// CHECKOUT

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Avval savatga mahsulot qo'shing!");
        return;
    }

    const user = localStorage.getItem("appleCurrentUser");

    if (!user) {
        cartModal.classList.remove("show");
        openAccount();
        showToast("Xaridni davom ettirish uchun tizimga kiring!");
    } else {
        showToast("Buyurtma qabul qilish demo rejimida!");
    }
});

// SEARCH

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");

document.getElementById("searchBtn").addEventListener("click", () => {
    searchPanel.classList.toggle("show");

    if (searchPanel.classList.contains("show")) {
        searchInput.focus();
    }
});

document.getElementById("closeSearch").addEventListener("click", () => {
    searchPanel.classList.remove("show");
    searchInput.value = "";
    filterProducts();
});

searchInput.addEventListener("input", filterProducts);

// CATEGORY FILTER

let activeCategory = "all";

document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".category.active")
            ?.classList.remove("active");

        button.classList.add("active");

        activeCategory = button.dataset.category;

        filterProducts();
    });
});

function filterProducts() {
    const search = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".product-card");

    let visible = 0;

    cards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category;

        const categoryMatch =
            activeCategory === "all" || category === activeCategory;

        const searchMatch = name.includes(search);

        if (categoryMatch && searchMatch) {
            card.style.display = "";
            visible++;
        } else {
            card.style.display = "none";
        }
    });

    document.getElementById("noResults").style.display =
        visible === 0 ? "block" : "none";
}

// INITIALIZE

saveCart();
