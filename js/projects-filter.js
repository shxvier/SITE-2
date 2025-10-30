// Фильтрация проектов
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Обновляем активную кнопку
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Фильтруем проекты
            projectCards.forEach(card => {
                const category = card.closest('[data-category]').getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.closest('[data-category]').style.display = 'block';
                } else {
                    card.closest('[data-category]').style.display = 'none';
                }
            });
        });
    });
});
