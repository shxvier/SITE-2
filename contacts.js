// Функционал для страницы контактов

// Счётчик символов в textarea
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');

if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        if (count > 1000) {
            charCount.style.color = 'var(--price-color)';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    });
    
    // Ограничение на 1000 символов
    messageTextarea.setAttribute('maxlength', '1000');
}

// Обработка отправки формы
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация формы
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        const agree = document.getElementById('agree').checked;
        
        if (!name || !email || !subject || !message || !agree) {
            alert('Пожалуйста, заполните все обязательные поля и примите политику конфиденциальности.');
            return;
        }
        
        // Имитация отправки формы
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Отправка...</span> <span>⏳</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Скрыть форму и показать сообщение об успехе
            contactForm.style.display = 'none';
            formSuccess.classList.add('show');
            
            // Сброс формы
            contactForm.reset();
            if (charCount) charCount.textContent = '0';
            
            // Вернуть форму через 5 секунд
            setTimeout(() => {
                contactForm.style.display = 'block';
                formSuccess.classList.remove('show');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 5000);
        }, 1500);
    });
}

// Переключение FAQ
function toggleFAQ(element) {
    const faqItem = element.closest('.faq-item');
    const wasActive = faqItem.classList.contains('active');
    
    // Закрыть все другие FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Открыть текущий, если он был закрыт
    if (!wasActive) {
        faqItem.classList.add('active');
    }
}

// Плавная прокрутка к форме при переходе с других страниц
if (window.location.hash === '#contact-form') {
    const formSection = document.querySelector('.contact-form-section');
    if (formSection) {
        setTimeout(() => {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}
