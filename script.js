// === ТЕМЫ ===
const root = document.body;
const themeBtns = document.querySelectorAll('.theme-switch button');
const saved = localStorage.getItem('theme') || root.getAttribute('data-theme') || 'dark';
setTheme(saved);
themeBtns.forEach(b => b.addEventListener('click', () => setTheme(b.dataset.theme)));

function setTheme(t) {
  root.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeBtns.forEach(x => x.classList.toggle('active', x.dataset.theme === t));
}

// === АНИМАЦИИ НА СКРОЛЛ ===
const rev = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  rev.forEach(el => io.observe(el));
} else {
  rev.forEach(el => el.classList.add('in'));
}

// === СЧЁТЧИК СТАТИСТИКИ (анимация чисел) ===
const statNumbers = document.querySelectorAll('.stat-number');
let animated = false;

function animateNumbers() {
  if (animated) return;
  statNumbers.forEach(stat => {
    const text = stat.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const number = parseInt(text.replace(/\D/g, ''));
    
    let current = 0;
    const increment = number / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        current = number;
        clearInterval(timer);
      }
      let display = Math.floor(current);
      if (display >= 1000) display = (display / 1000).toFixed(1) + 'K';
      stat.textContent = display + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
    }, 30);
  });
  animated = true;
}

// Запуск анимации при скролле к статистике
if (statNumbers.length > 0) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) animateNumbers();
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));
}
