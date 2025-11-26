// ============================================
// ИНИЦИАЛИЗАЦИЯ САКУРА ТЕМЫ
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🌸 Инициализация японской сакура-темы...');

  try {
    // Основной AquaEngine
    if (typeof AquaEngine !== 'undefined') {
      AquaEngine.init();
    }

    // Система уведомлений
    if (typeof OceanNotifications !== 'undefined') {
      window.notifications = OceanNotifications;
    }

    // Взаимодействия
    if (typeof OceanInteractions !== 'undefined') {
      new OceanInteractions();
    }

    // Анимации
    if (typeof WaterAnimations !== 'undefined') {
      new WaterAnimations();
    }

    console.log('✅ Сакура тема успешно активирована!');

    // Приветственное уведомление
    setTimeout(() => {
      if (window.notifications) {
        window.notifications.success('🌸 Сакура тема загружена! Добро пожаловать в японскую ночь.', 4000);
      }
    }, 800);

  } catch (error) {
    console.error('❌ Ошибка инициализации сакура-темы:', error);
  }

  // Оптимизация производительности
  setupSakuraPerformance();
});

function setupSakuraPerformance() {
  // Ленивая загрузка изображений
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Обработка ошибок
  window.addEventListener('error', function(e) {
    console.error('Глобальная ошибка:', e.error);
    if (window.notifications) {
      window.notifications.error('⚠️ Произошла ошибка при загрузке страницы');
    }
  });

  // Обработка видимости страницы
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      // Страница не видна - снижаем нагрузку
      reduceSakuraEffects();
    } else {
      // Страница видна - восстанавливаем эффекты
      restoreSakuraEffects();
    }
  });
}

function reduceSakuraEffects() {
  document.documentElement.style.setProperty('--wave-speed', '35s');
  if (window.AquaEngine && window.AquaEngine.pauseEffects) {
    window.AquaEngine.pauseEffects();
  }
}

function restoreSakuraEffects() {
  document.documentElement.style.setProperty('--wave-speed', '18s');
  if (window.AquaEngine && window.AquaEngine.resumeEffects) {
    window.AquaEngine.resumeEffects();
  }
}

// Улучшенное название
console.log('%c🌸 SAKURA NIGHT THEME EDITION 🌸', 'color: #ff69b4; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(255, 105, 180, 0.8);');
