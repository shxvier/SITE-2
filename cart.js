// === УПРАВЛЕНИЕ КОРЗИНОЙ ===
let cart = [];

// Загрузка корзины из localStorage при старте
function loadCart() {
  try {
    const saved = localStorage.getItem('cart');
    cart = saved ? JSON.parse(saved) : [];
  } catch (e) {
    cart = [];
  }
  updateCartUI();
}

// Сохранение корзины
function saveCart() {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Ошибка сохранения корзины:', e);
  }
}

// Обновление UI корзины
function updateCartUI() {
  const cartCount = document.getElementById('cartCount');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  // Обновляем счётчик в иконке корзины
  if (cartCount) {
    const totalItems = cart.reduce(function(sum, item) {
      return sum + item.qty;
    }, 0);
    cartCount.textContent = totalItems;
  }
  
  // Обновляем содержимое корзины
  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = '<div class="cart-empty"><div style="font-size:64px;opacity:.5;margin-bottom:1rem">🛒</div><p>Корзина пуста</p><small class="text-muted">Добавьте товары из каталога</small></div>';
    } else {
      let html = '';
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        html += '<div class="cart-item">';
        html += '<div class="cart-item-icon">' + item.image + '</div>';
        html += '<div class="cart-item-info">';
        html += '<div class="cart-item-name">' + item.name + '</div>';
        html += '<div class="cart-item-price">' + formatPrice(item.price) + ' ₽</div>';
        html += '</div>';
        html += '<div class="cart-item-controls">';
        html += '<button class="qty-btn" onclick="changeQty(' + item.id + ', -1)">−</button>';
        html += '<span class="qty-display">' + item.qty + '</span>';
        html += '<button class="qty-btn" onclick="changeQty(' + item.id + ', 1)">+</button>';
        html += '</div>';
        html += '<button class="cart-item-remove" onclick="removeFromCart(' + item.id + ')">✕</button>';
        html += '</div>';
      }
      cartItems.innerHTML = html;
    }
  }
  
  // Обновляем итоговую сумму
  if (cartTotal) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].qty;
    }
    cartTotal.textContent = formatPrice(total) + ' ₽';
  }
  
  saveCart();
}

// Добавление товара в корзину
function addToCart(id, name, price, image) {
  let found = false;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].qty++;
      found = true;
      break;
    }
  }
  
  if (!found) {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      qty: 1
    });
  }
  
  updateCartUI();
  showNotification('✓ ' + name + ' добавлен в корзину');
}

// Удаление товара из корзины
function removeFromCart(id) {
  cart = cart.filter(function(item) {
    return item.id !== id;
  });
  updateCartUI();
  showNotification('Товар удалён из корзины');
}

// Изменение количества
function changeQty(id, delta) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id) {
      cart[i].qty += delta;
      if (cart[i].qty <= 0) {
        removeFromCart(id);
        return;
      }
      break;
    }
  }
  updateCartUI();
}

// Переключение видимости корзины
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  
  if (sidebar && overlay) {
    const isOpen = sidebar.classList.contains('open');
    
    if (isOpen) {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    } else {
      sidebar.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }
}

// Оформление заказа
function checkout() {
  if (cart.length === 0) {
    showNotification('Корзина пуста', 'error');
    return;
  }
  
  let total = 0;
  let itemsList = '';
  
  for (let i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].qty;
    if (i > 0) itemsList += ', ';
    itemsList += cart[i].name + ' x' + cart[i].qty;
  }
  
  const message = 'Оформить заказ на сумму ' + formatPrice(total) + ' ₽?\n\nТовары: ' + itemsList;
  
  if (confirm(message)) {
    showNotification('✓ Заказ оформлен! Мы свяжемся с вами.', 'success');
    cart = [];
    updateCartUI();
    toggleCart();
  }
}

// Форматирование цены
function formatPrice(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Показ уведомлений
function showNotification(message, type) {
  if (!type) type = 'success';
  
  const notif = document.createElement('div');
  notif.className = 'notification notification-' + type;
  notif.textContent = message;
  document.body.appendChild(notif);
  
  setTimeout(function() {
    notif.classList.add('show');
  }, 10);
  
  setTimeout(function() {
    notif.classList.remove('show');
    setTimeout(function() {
      if (notif.parentNode) {
        notif.parentNode.removeChild(notif);
      }
    }, 300);
  }, 3000);
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCart);
} else {
  loadCart();
}
