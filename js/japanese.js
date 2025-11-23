// ============================================
// ЯПОНСКАЯ ТЕМА - ВСЕ ФУНКЦИИ
// ============================================

// Анимация счетчиков
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const duration = 2000;
                const start = performance.now();
                
                function update(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(easeOutQuart * target);
                    
                    counter.innerText = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.innerText = target;
                    }
                }
                
                requestAnimationFrame(update);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

// Анимация прогресс-баров
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar__fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Плавная прокрутка для навигации
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Обновить активный пункт навигации
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

// Активация пунктов навигации при скролле
function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav__link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
                
                if (activeLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// Обработка формы контактов
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        const submitBtn = form.querySelector('.contact-form__submit');
        const inputs = form.querySelectorAll('.contact-form__input');
        
        // Валидация и disabled state
        function validateForm() {
            const isValid = Array.from(inputs).every(input => {
                if (input.hasAttribute('required')) {
                    return input.value.trim() !== '';
                }
                return true;
            });
            submitBtn.disabled = !isValid;
        }
        
        inputs.forEach(input => {
            input.addEventListener('input', validateForm);
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (submitBtn.disabled) return;
            
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Отправлено!';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        });
        
        // Initial validation
        validateForm();
    }
}

// Мобильное меню
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.nav--mobile');
    
    if (!toggle || !mobileNav) return;
    
    toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Закрыть при клике на ссылку
    mobileNav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Закрыть при клике вне меню
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Закрыть при ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.nav--mobile');
    
    toggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.nav--mobile');
    
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
}

// Плавные переходы между страницами
function initPageTransitions() {
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Только для внутренних ссылок
            if (href.startsWith('http') && !href.includes(window.location.origin)) {
                return;
            }
            
            e.preventDefault();
            
            // Fade out
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
}

// Темная тема
function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;
    
    // Загрузить тему из localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    toggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.className = theme === 'light' ? 'bi bi-moon-fill theme-icon' : 'bi bi-sun-fill theme-icon';
    }
}

// Parallax эффект
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.speed) || 0.5;
            const translateY = scrolled * speed * 0.1;
            element.style.transform = `translateY(${translateY}px)`;
        });
    });
}

// Ускорение лепестков при скролле
function initSakuraScroll() {
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
        const scrollSpeed = Math.abs(window.scrollY - lastScrollY);
        document.querySelectorAll('.sakura-petal').forEach(petal => {
            const baseDuration = parseFloat(getComputedStyle(petal).animationDuration) || 12;
            const newDuration = Math.max(4, baseDuration - scrollSpeed * 0.05);
            petal.style.animationDuration = `${newDuration}s`;
        });
        lastScrollY = window.scrollY;
    });
}

// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', function() {
    // Плавный fade-in при загрузке
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
    
    initCounters();
    initSkillBars();
    initSmoothScroll();
    initScrollSpy();
    initContactForm();
    initMobileMenu();
    initPageTransitions();
    initThemeToggle();
    initParallax();
    initSakuraScroll();
});
