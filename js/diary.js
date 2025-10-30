// Управление дневником
document.addEventListener('DOMContentLoaded', function() {
    const saveEntryBtn = document.getElementById('saveEntryBtn');
    const diaryForm = document.getElementById('diaryForm');
    
    if (saveEntryBtn) {
        saveEntryBtn.addEventListener('click', function() {
            const date = document.getElementById('entryDate').value;
            const title = document.getElementById('entryTitle').value;
            const description = document.getElementById('entryDescription').value;
            const status = document.getElementById('entryStatus').value;
            
            if (date && title && description) {
                // Здесь можно добавить логику сохранения
                alert('Запись добавлена!');
                bootstrap.Modal.getInstance(document.getElementById('addEntryModal')).hide();
                diaryForm.reset();
            } else {
                alert('Заполните все поля!');
            }
        });
    }
});
