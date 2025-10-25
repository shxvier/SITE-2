// === КОРЗИНА ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <div style="font-size:64px;opacity:.5;margin-bottom:1rem">🛒</div>
          <p>Корзина пуста</p>
          <small class="text-muted">Добавьте товары из каталога</small>
        </div>
      `;
    } else {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-icon">${item.image}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)} ₽</div>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
        </div>
      `).join('');
    }
  }
  
  if (cartTotal) {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotal.textContent = formatPrice(total) + ' ₽';
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id, name, price, image) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  updateCartUI();
  showNotification(`✓ ${name} добавлен в корзину`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
  showNotification('Товар удалён из корзины');
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      updateCartUI();
    }
  }
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar && overlay) {
    const isOpen = sidebar.classList.contains('open');
    sidebar.classList.toggle('open', !isOpen);
    overlay.classList.toggle('show', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }
}

function checkout() {
  if (cart.length === 0) {
    showNotification('Корзина пуста', 'error');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const items = cart.map(i => `${i.name} x${i.qty}`).join(', ');
  if (confirm(`Оформить заказ на сумму ${formatPrice(total)} ₽?\n\nТовары: ${items}`)) {
    showNotification('✓ Заказ оформлен! Мы свяжемся с вами.', 'success');
    cart = [];
    updateCartUI();
    toggleCart();
  }
}

function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function showNotification(message, type = 'success') {
  const notif = document.createElement('div');
  notif.className = `notification notification-${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add('show'), 10);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', updateCartUI);
