// Фильтры, поиск, сортировка и кнопки
document.addEventListener('DOMContentLoaded',()=>{
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.product-item');
  const grid = document.getElementById('productsGrid');
  const search = document.getElementById('searchInput');
  const sort = document.getElementById('sortSelect');
  const empty = document.getElementById('noResults');

  let cat='all', q='';

  function apply(){
    let visible=0;
    items.forEach(it=>{
      const okCat = cat==='all' || it.dataset.category===cat;
      const okSearch = !q || it.dataset.name.toLowerCase().includes(q);
      const show = okCat && okSearch;
      it.style.display = show ? '' : 'none';
      if(show) visible++;
    });
    if(empty){ empty.style.display = visible? 'none':'block'; }
  }

  filterButtons.forEach(b=>b.addEventListener('click',()=>{
    filterButtons.forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); cat=b.dataset.category; apply();
  }));
  if(search) search.addEventListener('input', e=>{ q=e.target.value.toLowerCase(); apply(); });
  if(sort) sort.addEventListener('change', e=>{
    const type=e.target.value;
    const arr=[...items].filter(it=>it.style.display!=='none');
    arr.sort((a,b)=>{
      const pa=+a.dataset.price, pb=+b.dataset.price;
      const na=a.dataset.name, nb=b.dataset.name;
      switch(type){
        case 'price-asc': return pa-pb;
        case 'price-desc': return pb-pa;
        case 'name-asc': return na.localeCompare(nb);
        case 'name-desc': return nb.localeCompare(na);
        default: return 0;
      }
    });
    arr.forEach(x=>grid.appendChild(x));
  });

  document.querySelectorAll('.product-btn').forEach(btn=>{
    btn.addEventListener('click', function(){
      const prev=this.textContent;
      this.textContent='✓ Добавлено!'; this.style.background='linear-gradient(135deg, #10b981, #059669)';
      setTimeout(()=>{ this.textContent=prev; this.style.background=''; },1500);
    });
  });

  window.resetFilters = function(){
    const all = document.querySelector('.filter-btn[data-category="all"]');
    if(all){ all.click(); }
    if(search){ search.value=''; q=''; }
    if(sort){ sort.value='default'; }
    apply();
  }

  apply();
});
