// Функционал для products с Bootstrap

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    const noResults = document.getElementById('noResults');
    const productsGrid = document.getElementById('productsGrid');

    let currentCategory = 'all';
    let currentSearchTerm = '';

    // Фильтрация по категориям
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            filterProducts();
        });
    });

    // Поиск
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchTerm = this.value.toLowerCase();
            filterProducts();
        });
    }

    // Функция фильтрации
    function filterProducts() {
        let visibleCount = 0;

        productItems.forEach(item => {
            const category = item.dataset.category;
            const name = item.dataset.name.toLowerCase();

            const categoryMatch = currentCategory === 'all' || category === currentCategory;
            const searchMatch = currentSearchTerm === '' || name.includes(currentSearchTerm);

            if (categoryMatch && searchMatch) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        // Показать/скрыть сообщение
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Сортировка
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortType = this.value;
            const itemsArray = Array.from(productItems);

            itemsArray.sort((a, b) => {
                const priceA = parseInt(a.dataset.price);
                const priceB = parseInt(b.dataset.price);
                const nameA = a.dataset.name;
                const nameB = b.dataset.name;

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

            itemsArray.forEach(item => productsGrid.appendChild(item));
        });
    }

    // Добавление в корзину
    const productButtons = document.querySelectorAll('.product-btn');
    productButtons.forEach(button => {
        button.addEventListener('click', function() {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<span>✓ Добавлено!</span>';
            this.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.background = '';
            }, 2000);
        });
    });
});

// Сброс фильтров
function resetFilters() {
    document.querySelector('.filter-btn[data-category="all"]').click();
    document.getElementById('searchInput').value = '';
    document.getElementById('sortSelect').value = 'default';
}
