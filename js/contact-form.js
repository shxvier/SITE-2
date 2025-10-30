// Валидация контактной формы
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Простая валидация
            if (!name || !email || !message) {
                alert('Заполните все обязательные поля!');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Введите корректный email адрес!');
                return;
            }
            
            // Имитация отправки
            alert('Сообщение отправлено! Спасибо за обращение.');
            contactForm.reset();
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
