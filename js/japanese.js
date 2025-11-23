// ============================================
// ЯПОНСКАЯ ТЕМА - ВСЕ ФУНКЦИИ
// ============================================

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const container = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <i class="bi bi-${getToastIcon(type)} me-2"></i>
        ${message}
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-hide
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle-fill',
        error: 'exclamation-circle-fill',
        info: 'info-circle-fill'
    };
    return icons[type] || 'info-circle';
}

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
            
            showToast('Сообщение успешно отправлено!', 'success');
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
                validateForm();
            }, 2000);
        });
        
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
    
    mobileNav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !mobileNav.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
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
            
            if (href.startsWith('http') && !href.includes(window.location.origin)) {
                return;
            }
            
            e.preventDefault();
            
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
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    toggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        showToast(newTheme === 'dark' ? 'Тёмная тема включена' : 'Светлая тема включена', 'info');
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

// Модальные окна для проектов
function initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card');
    
    // Данные проектов
    const projectData = {
        'project1': {
            title: 'Личный сайт',
            description: 'Полностью адаптивный сайт-портфолио, разработанный с нуля. Использует современные технологии веб-разработки и следует принципам минималистичного дизайна.',
            fullDescription: 'Этот проект представляет собой личное портфолио, созданное для демонстрации навыков веб-разработки. Сайт построен на HTML5 и CSS3 с использованием CSS Grid и Flexbox для адаптивной верстки. JavaScript используется для добавления интерактивности и анимаций. Особое внимание уделено производительности и доступности. Сайт оптимизирован для быстрой загрузки и корректного отображения на всех устройствах.',
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'Git'],
            links: {
                github: 'https://github.com/shxvier/portfolio',
                demo: 'https://your-portfolio.com'
            },
            image: 'images/project1.jpg'
        },
        'project2': {
            title: 'Todo-приложение',
            description: 'Приложение для управления задачами с полной функциональностью CRUD и локальным хранилищем данных.',
            fullDescription: 'Полноценное приложение для управления задачами с возможностью создания, редактирования, удаления и отметки задач как выполненных. Все данные сохраняются в Local Storage браузера, что обеспечивает персистентность без сервера. Интерфейс интуитивно понятен и минималистичен.',
            technologies: ['JavaScript', 'Local Storage', 'HTML5', 'CSS3'],
            links: {
                github: 'https://github.com/shxvier/todo-app',
                demo: 'https://your-todo-app.com'
            },
            image: 'images/project2.jpg'
        },
        'project3': {
            title: 'Интернет-магазин',
            description: 'E-commerce платформа на React с полной корзиной покупок и интеграцией с API.',
            fullDescription: 'Современный интернет-магазин, построенный на React с использованием хуков и контекста для управления состоянием. Реализована полноценная корзина покупок, система фильтрации товаров и интеграция с внешним API для получения данных о товарах. Проект демонстрирует понимание современных подходов к разработке на React.',
            technologies: ['React', 'API', 'JavaScript', 'CSS Modules'],
            links: {
                github: 'https://github.com/shxvier/shop-react',
                demo: 'https://your-shop-react.com'
            },
            image: 'images/project3.jpg'
        },
        'project4': {
            title: 'Проект 4',
            description: 'Приложение на C++ с использованием Qt Framework для кроссплатформенной разработки.',
            fullDescription: 'Десктопное приложение, разработанное с использованием C++ и Qt Framework. Демонстрирует понимание объектно-ориентированного программирования, работу с графическим интерфейсом и кроссплатформенную разработку. Проект включает в себя современные подходы к управлению памятью и оптимизации производительности.',
            technologies: ['C++', 'Qt', 'OOP', 'CMake'],
            links: {
                github: 'https://github.com/shxvier/qt-project'
            },
            image: 'images/project4.jpg'
        },
        'project5': {
            title: 'Проект 5',
            description: 'UI/UX дизайн и прототипирование интерфейсов с акцентом на пользовательский опыт.',
            fullDescription: 'Проект по созданию дизайн-системы и прототипов для веб-приложения. Включает в себя исследование пользователей, создание wireframes, mockups и интерактивных прототипов. Работа велась в Figma с соблюдением современных принципов UX-дизайна и доступности.',
            technologies: ['Figma', 'UI/UX', 'Prototyping', 'Design System'],
            links: {
                figma: 'https://figma.com/your-project'
            },
            image: 'images/project5.jpg'
        },
        'project6': {
            title: 'Проект 6',
            description: 'Экспериментальное веб-приложение для тестирования новых технологий и паттернов.',
            fullDescription: 'Проект-лаборатория, где я экспериментирую с новыми веб-технологиями и архитектурными паттернами. Здесь я пробую новые фреймворки, библиотеки и подходы к разработке, чтобы постоянно расширять свой технический стек и находить лучшие решения.',
            technologies: ['Experimental', 'Innovation', 'Research'],
            links: {
                github: 'https://github.com/shxvier/experiments'
            },
            image: 'images/project6.jpg'
        }
    };
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.id || 'project' + (Array.from(projectCards).indexOf(card) + 1);
            openProjectModal(projectData[projectId]);
        });
    });
}

function openProjectModal(project) {
    const modal = createModal(project);
    document.body.appendChild(modal);
    
    setTimeout(() => modal.classList.add('open'), 10);
    
    // Close modal
    const closeBtn = modal.querySelector('.modal__close');
    closeBtn.addEventListener('click', () => closeModal(modal));
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal(modal);
    });
}

function createModal(project) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal__content">
            <button class="modal__close" aria-label="Закрыть">&times;</button>
            <div class="modal__header">
                <h2 class="modal__title">${project.title}</h2>
                <div class="modal__tech">
                    ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
            </div>
            <div class="modal__body">
                <img src="${project.image}" alt="${project.title}" style="width: 100%; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <p class="modal__description">${project.fullDescription}</p>
                <div class="modal__links">
                    ${project.links.github ? `<a href="${project.links.github}" target="_blank" class="btn btn--primary"><i class="bi bi-github me-2"></i>GitHub</a>` : ''}
                    ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" class="btn btn--ghost"><i class="bi bi-box-arrow-up-right me-2"></i>Демо</a>` : ''}
                    ${project.links.figma ? `<a href="${project.links.figma}" target="_blank" class="btn btn--ghost"><i class="bi bi-pencil-square me-2"></i>Figma</a>` : ''}
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

function closeModal(modal) {
    modal.classList.remove('open');
    setTimeout(() => modal.remove(), 300);
}

// Инициализация всех компонентов
document.addEventListener('DOMContentLoaded', function() {
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
    initProjectModals();
});
