// Управление дневником
document.addEventListener('DOMContentLoaded', function() {
    const saveEntryBtn = document.getElementById('saveEntryBtn');
    const diaryForm = document.getElementById('diaryForm');
    const timeline = document.querySelector('.timeline');

    if (saveEntryBtn && diaryForm) {
        saveEntryBtn.addEventListener('click', function() {
            const date = document.getElementById('entryDate').value;
            const title = document.getElementById('entryTitle').value;
            const description = document.getElementById('entryDescription').value;
            const status = document.getElementById('entryStatus').value;

            if (date && title && description) {
                // Создание новой записи
                const newEntry = createTimelineEntry(date, title, description, status);
                
                // Добавление в timeline с анимацией
                timeline.insertBefore(newEntry, timeline.firstChild);
                
                // Анимация появления
                setTimeout(() => {
                    newEntry.style.animation = 'fadeInLeft 0.6s ease forwards';
                }, 10);

                // Закрытие модального окна
                const modal = bootstrap.Modal.getInstance(document.getElementById('addEntryModal'));
                modal.hide();

                // Очистка формы
                diaryForm.reset();

                // Уведомление
                showNotification('Запись успешно добавлена!', 'success');
            }
        });
    }
});

// Создание элемента timeline
function createTimelineEntry(date, title, description, status) {
    const entry = document.createElement('div');
    entry.className = 'timeline-item mb-4';
    entry.style.opacity = '0';

    const statusClass = status === 'completed' ? 'completed' : 'in-progress';
    const icon = status === 'completed' ? 'bi-check-circle-fill' : 'bi-arrow-clockwise';

    const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
    });

    entry.innerHTML = `
        <div class="d-flex">
            <div class="timeline-badge ${statusClass} me-3">
                <i class="bi ${icon}" style="font-size: 1.5rem;"></i>
            </div>
            <div class="timeline-content">
                <h5 class="text-white mb-1">${formattedDate} - ${title}</h5>
                <p class="text-light mb-0">${description}</p>
            </div>
        </div>
    `;

    return entry;
}

// Функция уведомлений (если не подключен contact-form.js)
if (typeof showNotification === 'undefined') {
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
}
