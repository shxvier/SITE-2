// Управление дневником с уведомлениями
document.addEventListener('DOMContentLoaded', function() {
    const saveEntryBtn = document.getElementById('saveEntryBtn');
    const diaryForm = document.getElementById('diaryForm');
    const timeline = document.getElementById('timeline');

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
                    newEntry.style.opacity = '1';
                    newEntry.style.transform = 'translateX(0)';
                }, 10);

                // Закрытие модального окна
                const modal = bootstrap.Modal.getInstance(document.getElementById('addEntryModal'));
                modal.hide();

                // Очистка формы
                diaryForm.reset();

                // Показываем уведомление об успехе
                if (window.notify) {
                    notify.success('Запись успешно добавлена в дневник! 📝');
                }

                // Анимация прокрутки к новой записи
                setTimeout(() => {
                    newEntry.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 500);
            } else {
                // Показываем предупреждение
                if (window.notify) {
                    notify.warning('Пожалуйста, заполните все поля формы!');
                }
            }
        });
    }
});

// Создание элемента timeline
function createTimelineEntry(date, title, description, status) {
    const entry = document.createElement('div');
    entry.className = 'timeline-item mb-4';
    entry.style.opacity = '0';
    entry.style.transform = 'translateX(-30px)';
    entry.style.transition = 'all 0.6s ease';

    const statusClass = status === 'completed' ? 'completed' : status === 'in-progress' ? 'in-progress' : 'planned';
    const icon = status === 'completed' ? 'bi-check-circle-fill' : status === 'in-progress' ? 'bi-arrow-clockwise' : 'bi-clock';

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
