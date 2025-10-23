// Тема без мигания
const root = document.body;
const themeBtns = document.querySelectorAll('.theme-switch button');
const saved = localStorage.getItem('theme') || root.getAttribute('data-theme') || 'neo';
setTheme(saved);
themeBtns.forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.theme)));
function setTheme(t){
  root.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeBtns.forEach(x=>x.classList.toggle('active', x.dataset.theme===t));
}

// Плавные появления
const rev = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  rev.forEach(el=>io.observe(el));
} else {
  rev.forEach(el=>el.classList.add('in'));
}
