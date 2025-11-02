// Автоматическое определение производительности устройства
(function() {
    // Проверяем производительность
    const isLowPerformance = 
        navigator.hardwareConcurrency < 4 || // Менее 4 ядер
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || // Мобильные
        window.innerWidth < 768; // Маленький экран
    
    if (isLowPerformance) {
        // Добавляем класс для упрощенной версии
        document.documentElement.classList.add('low-performance');
        
        // Уменьшаем частоту анимации
        if (window.plasmaBackground) {
            window.plasmaBackground.fps = 20;
        }
    }
    
    // Проверяем Battery API для экономии энергии
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            if (battery.level < 0.2 || !battery.charging) {
                // Снижаем качество при низком заряде
                document.documentElement.classList.add('power-saving');
            }
        });
    }
})();
