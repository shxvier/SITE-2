// Обработка формы контактов
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Анимация отправки
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Отправка...';
            submitBtn.disabled = true;

            // Симуляция отправки (замените на реальную отправку)
            setTimeout(() => {
                // Успешная отправка
                submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Отправлено!';
                submitBtn.classList.remove('btn-warning');
                submitBtn.classList.add('btn-success');

                // Показ уведомления
                showNotification('Спасибо! Ваше сообщение отправлено.', 'success');

                // Очистка формы
                contactForm.reset();

                // Возврат кнопки в исходное состояние
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('btn-success');
                    submitBtn.classList.add('btn-warning');
                    submitBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
});

// Функция показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.style.animation = 'slideDown 0.5s ease';
    notification.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>${message}
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Анимации для уведомлений
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -100%);
        }
    }
`;
document.head.appendChild(notificationStyles);
