// Функционал для страницы товаров

// Фильтрация по категориям
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

let currentCategory = 'all';
let currentSearchTerm = '';

// Обработка кликов по фильтрам
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Убрать active у всех кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавить active текущей кнопке
        button.classList.add('active');
        
        // Получить категорию
        currentCategory = button.getAttribute('data-category');
        
        // Применить фильтрацию
        filterProducts();
    });
});

// Поиск товаров
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        filterProducts();
    });
}

// Функция фильтрации
function filterProducts() {
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const name = card.getAttribute('data-name').toLowerCase();
        
        // Проверка по категории
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        
        // Проверка по поиску
        const searchMatch = currentSearchTerm === '' || name.includes(currentSearchTerm);
        
        // Показать или скрыть карточку
        if (categoryMatch && searchMatch) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Показать сообщение если нет результатов
    if (visibleCount === 0) {
        noResults.classList.add('show');
    } else {
        noResults.classList.remove('show');
    }
}

// Сортировка товаров
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        const sortType = e.target.value;
        const productsGrid = document.getElementById('productsGrid');
        const cardsArray = Array.from(productCards);
        
        cardsArray.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            const nameA = a.getAttribute('data-name');
            const nameB = b.getAttribute('data-name');
            
            switch(sortType) {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                case 'name-asc':
                    return nameA.localeCompare(nameB);
                case 'name-desc':
                    return nameB.localeCompare(nameA);
                default:
                    return 0;
            }
        });
        
        // Перестроить DOM
        cardsArray.forEach(card => {
            productsGrid.appendChild(card);
        });
    });
}

// Добавление в корзину с анимацией
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const originalText = this.textContent;
        
        // Изменить текст кнопки
        this.textContent = '✓ Добавлено!';
        this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Вернуть через 2 секунды
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
        }, 2000);
    });
});
