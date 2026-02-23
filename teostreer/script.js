/* =========================
   🔥 ESTADO GLOBAL
========================= */

console.log("JS CONECTADO");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const authModal = document.getElementById("auth-modal");
const userArea = document.getElementById("user-area");


/* =========================
   🔥 UTILIDADES
========================= */

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function formatPrice(price) {
  return new Intl.NumberFormat("es-CO").format(price);
}


/* =========================
   🔥 CARRITO
========================= */

function updateCartCount() {
  const countElement = document.getElementById("cart-count");
  if (!countElement) return;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  countElement.textContent = totalItems;
}

function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");

  if (!cartItems || !totalElement) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
        <span>${item.name}</span>
        <div style="display:flex; align-items:center; gap:8px;">
          <button onclick="decreaseQuantity(${index})">➖</button>
          <span>x${item.quantity}</span>
          <button onclick="increaseQuantity(${index})">➕</button>
        </div>
        <span>$${formatPrice(item.price * item.quantity)} COP</span>
      </div>
    `;

    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  totalElement.textContent = formatPrice(total);
  updateCartCount();
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  renderCart();
  toggleCart();
  showMessage("Agregado correctamente ✔");
}

function increaseQuantity(index) {
  cart[index].quantity++;
  saveCart();
  renderCart();
}

function decreaseQuantity(index) {
  cart[index].quantity--;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function toggleCart() {
  document.getElementById("cart")?.classList.toggle("active");
  document.getElementById("overlay")?.classList.toggle("active");
}


/* =========================
   🔥 MENSAJES
========================= */

function showMessage(text) {
  const msg = document.createElement("div");
  msg.textContent = text;

  msg.style.position = "fixed";
  msg.style.bottom = "30px";
  msg.style.left = "50%";
  msg.style.transform = "translateX(-50%)";
  msg.style.background = "#00ff9c";
  msg.style.color = "#000";
  msg.style.padding = "12px 20px";
  msg.style.borderRadius = "30px";
  msg.style.fontWeight = "700";
  msg.style.zIndex = "3000";

  document.body.appendChild(msg);

  setTimeout(() => msg.remove(), 2000);
}


/* =========================
   🔐 AUTH SISTEMA REAL
========================= */

function openAuth() {
  authModal.classList.add("active");
}

function closeAuth() {
  authModal.classList.remove("active");
}

authModal?.addEventListener("click", function(e) {
  if (e.target === authModal) {
    closeAuth();
  }
});

function showRegister() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("register-form").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("register-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
}

function registerUser() {
  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!name || !email || !password) {
    alert("Completa todos los campos");
    return;
  }

  const user = { name, email, password };
  localStorage.setItem("teostreetUser", JSON.stringify(user));

  showMessage("Cuenta creada correctamente 🔥");
  closeAuth();
  updateUserUI();
}

function loginUser() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const savedUser = JSON.parse(localStorage.getItem("teostreetUser"));

  if (!savedUser) {
    alert("No existe una cuenta registrada");
    return;
  }

  if (email === savedUser.email && password === savedUser.password) {
    showMessage("Bienvenido " + savedUser.name);
    closeAuth();
    updateUserUI();
  } else {
    alert("Datos incorrectos");
  }
}

function logoutUser() {
  localStorage.removeItem("teostreetUser");
  updateUserUI();
}

function updateUserUI() {
  const savedUser = JSON.parse(localStorage.getItem("teostreetUser"));
  if (!userArea) return;

  if (savedUser) {

    const initial = savedUser.name.charAt(0).toUpperCase();

    userArea.innerHTML = `
      <div class="user-dropdown">
        <div class="avatar" onclick="toggleUserMenu()">
          ${initial}
        </div>

        <div class="dropdown-menu" id="dropdown-menu">
          <p class="user-fullname">${savedUser.name}</p>
          <button onclick="logoutUser()">Cerrar sesión</button>
        </div>
      </div>
    `;

  } else {
    userArea.innerHTML = `
      <button class="login-btn" onclick="openAuth()">Iniciar Sesión</button>
    `;
  }
}
function toggleUserMenu() {
  const menu = document.getElementById("dropdown-menu");
  menu.classList.toggle("active");
}

/* =========================
   🚀 INICIALIZACIÓN
========================= */

document.addEventListener("DOMContentLoaded", function () {
  renderCart();
  updateCartCount();
  updateUserUI();
});
// ===== CHECKOUT =====

function checkout() {
  const cartItems = document.getElementById("cart-items");
  const checkoutSection = document.getElementById("checkout-section");
  const summary = document.getElementById("checkout-summary");

  if (cartItems.children.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  // Copiar contenido del carrito al resumen
  summary.innerHTML = cartItems.innerHTML;

  // Mostrar ventana de pago
  checkoutSection.style.display = "flex";

  // Cerrar carrito
  document.getElementById("cart").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

function closeCheckout() {
  document.getElementById("checkout-section").style.display = "none";
}

function confirmPayment() {
  const checkoutSection = document.getElementById("checkout-section");
  const success = document.getElementById("payment-success");

  checkoutSection.style.display = "none";

  success.style.display = "flex";

  setTimeout(() => {
    success.style.display = "none";
    clearCart();
  }, 2500);
}
document.addEventListener("DOMContentLoaded", function () {

  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
    });

    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
      });
    });

  }

});