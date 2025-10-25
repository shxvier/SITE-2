// === ФИЛЬТРЫ, ПОИСК, СОРТИРОВКА ===
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.product-item');
  const grid = document.getElementById('productsGrid');
  const search = document.getElementById('searchInput');
  const sort = document.getElementById('sortSelect');
  const empty = document.getElementById('noResults');

  let currentCategory = 'all';
  let currentSearch = '';

  function applyFilters() {
    let visibleCount = 0;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const category = item.getAttribute('data-category');
      const name = item.getAttribute('data-name').toLowerCase();
      
      const categoryMatch = currentCategory === 'all' || category === currentCategory;
      const searchMatch = !currentSearch || name.indexOf(currentSearch) !== -1;
      
      if (categoryMatch && searchMatch) {
        item.style.display = '';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    }
    
    if (empty) {
      empty.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Фильтры по категориям
  for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener('click', function() {
      for (let j = 0; j < filterButtons.length; j++) {
        filterButtons[j].classList.remove('active');
      }
      this.classList.add('active');
      currentCategory = this.getAttribute('data-category');
      applyFilters();
    });
  }

  // Поиск
  if (search) {
    search.addEventListener('input', function() {
      currentSearch = this.value.toLowerCase();
      applyFilters();
    });
  }

  // Сортировка
  if (sort) {
    sort.addEventListener('change', function() {
      const sortType = this.value;
      const itemsArray = [];
      
      for (let i = 0; i < items.length; i++) {
        itemsArray.push(items[i]);
      }
      
      itemsArray.sort(function(a, b) {
        const priceA = parseInt(a.getAttribute('data-price'));
        const priceB = parseInt(b.getAttribute('data-price'));
        const nameA = a.getAttribute('data-name');
        const nameB = b.getAttribute('data-name');
        
        if (sortType === 'price-asc') return priceA - priceB;
        if (sortType === 'price-desc') return priceB - priceA;
        if (sortType === 'name-asc') return nameA.localeCompare(nameB);
        if (sortType === 'name-desc') return nameB.localeCompare(nameA);
        return 0;
      });
      
      for (let i = 0; i < itemsArray.length; i++) {
        grid.appendChild(itemsArray[i]);
      }
    });
  }

  applyFilters();
});

// Функция сброса фильтров
function resetFilters() {
  const allBtn = document.querySelector('.filter-btn[data-category="all"]');
  const search = document.getElementById('searchInput');
  const sort = document.getElementById('sortSelect');
  
  if (allBtn) allBtn.click();
  if (search) search.value = '';
  if (sort) sort.value = 'default';
}
