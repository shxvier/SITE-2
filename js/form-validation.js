/**
 * Валидация формы с доступностью (Практики 17 + 18)
 */

// Получаем элементы формы
const form = document.querySelector('form[novalidate]');
const formStatus = document.getElementById('form-status');

// Предыдущий активный элемент для модалки
let previousActiveElement;

// Обработчик отправки формы
if (form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Сбрасываем предыдущие ошибки
        clearErrors();
        
        // Проверяем валидность
        if (validateForm()) {
            // Форма валидна - отправляем
            submitForm();
        } else {
            // Форма невалидна - объявляем ошибки
            announceErrors();
        }
    });
    
    // Валидация при потере фокуса
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Убираем ошибку при вводе
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
}

/**
 * Валидация всей формы
 */
function validateForm() {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Валидация отдельного поля
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    const errorDiv = document.getElementById(`${fieldId}-error`);
    
    let isValid = true;
    let errorMessage = '';
    
    // Проверка на пустоту
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = `Пожалуйста, заполните поле "${field.labels[0].textContent}"`;
    }
    
    // Проверка email
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Пожалуйста, введите корректный email адрес';
        }
    }
    
    // Проверка минимальной длины
    if (field.hasAttribute('minlength')) {
        const minLength = parseInt(field.getAttribute('minlength'));
        if (value.length > 0 && value.length < minLength) {
            isValid = false;
            errorMessage = `Минимальная длина: ${minLength} символов`;
        }
    }
    
    // Применяем стили и ARIA-атрибуты
    if (!isValid) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        field.setAttribute('aria-invalid', 'true');
        if (errorDiv) {
            errorDiv.textContent = errorMessage;
        }
    } else {
        field.classList.remove('is-invalid');
        if (value !== '') {
            field.classList.add('is-valid');
        }
        field.setAttribute('aria-invalid', 'false');
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }
    
    return isValid;
}

/**
 * Очистка всех ошибок
 */
function clearErrors() {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
        input.setAttribute('aria-invalid', 'false');
    });
    
    const errorDivs = form.querySelectorAll('.invalid-feedback');
    errorDivs.forEach(div => {
        div.textContent = '';
    });
}

/**
 * Объявление ошибок для скринридеров
 */
function announceErrors() {
    const invalidFields = form.querySelectorAll('.is-invalid');
    const errorCount = invalidFields.length;
    
    // Объявляем количество ошибок
    formStatus.textContent = `Обнаружено ${errorCount} ${errorCount === 1 ? 'ошибка' : 'ошибок'}. Пожалуйста, исправьте выделенные поля.`;
    
    // Фокусируемся на первом невалидном поле
    if (invalidFields.length > 0) {
        invalidFields[0].focus();
    }
}

/**
 * Отправка формы (имитация)
 */
function submitForm() {
    // Собираем данные
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    console.log('Отправка формы:', data);
    
    // Объявляем успех
    formStatus.textContent = 'Форма успешно отправлена!';
    
    // Показываем модальное окно
    openSuccessModal();
    
    // Очищаем форму
    form.reset();
    clearErrors();
}

/**
 * Открытие модального окна (Задание 17)
 */
function openSuccessModal() {
    const modal = document.getElementById('successModal');
    const overlay = document.getElementById('successOverlay');
    
    // Запоминаем активный элемент
    previousActiveElement = document.activeElement;
    
    // Показываем модалку
    modal.style.display = 'block';
    overlay.style.display = 'block';
    modal.removeAttribute('aria-hidden');
    overlay.removeAttribute('aria-hidden');
    
    // Скрываем основной контент от скринридера
    document.querySelector('main').setAttribute('aria-hidden', 'true');
    document.querySelector('nav').setAttribute('aria-hidden', 'true');
    
    // Фокусируемся на модалке
    modal.focus();
    
    // Добавляем обработчик Escape
    document.addEventListener('keydown', handleModalEscape);
    
    // Ловим фокус внутри модалки
    modal.addEventListener('keydown', trapFocus);
}

/**
 * Закрытие модального окна
 */
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    const overlay = document.getElementById('successOverlay');
    
    // Скрываем модалку
    modal.style.display = 'none';
    overlay.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    
    // Возвращаем видимость основному контенту
    document.querySelector('main').removeAttribute('aria-hidden');
    document.querySelector('nav').removeAttribute('aria-hidden');
    
    // Возвращаем фокус
    if (previousActiveElement) {
        previousActiveElement.focus();
    }
    
    // Убираем обработчики
    document.removeEventListener('keydown', handleModalEscape);
    modal.removeEventListener('keydown', trapFocus);
}

/**
 * Обработчик Escape для модалки
 */
function handleModalEscape(event) {
    if (event.key === 'Escape') {
        closeSuccessModal();
    }
}

/**
 * Захват фокуса внутри модалки
 */
function trapFocus(event) {
    const modal = document.getElementById('successModal');
    
    if (event.key === 'Tab') {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
}

// Экспортируем функции для использования
window.closeSuccessModal = closeSuccessModal;
