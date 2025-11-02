// Система уведомлений
class NotificationSystem {
    constructor(containerId = 'notificationContainer') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 350px;';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'success', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show notification-item`;
        notification.style.cssText = `
            margin-bottom: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 212, 255, 0.3);
            border: 2px solid rgba(0, 212, 255, 0.5);
            background: rgba(15, 20, 35, 0.98);
            backdrop-filter: blur(10px);
            animation: slideInRight 0.5s ease;
        `;

        const icon = this.getIcon(type);
        notification.innerHTML = `
            <i class="bi ${icon} me-2"></i>
            <strong>${this.getTitle(type)}</strong>
            <p class="mb-0 mt-1">${message}</p>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        this.container.appendChild(notification);

        // Автоматическое удаление
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500);
        }, duration);
    }

    getIcon(type) {
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-exclamation-circle-fill',
            warning: 'bi-exclamation-triangle-fill',
            info: 'bi-info-circle-fill'
        };
        return icons[type] || icons.info;
    }

    getTitle(type) {
        const titles = {
            success: 'Успешно!',
            error: 'Ошибка!',
            warning: 'Внимание!',
            info: 'Информация'
        };
        return titles[type] || titles.info;
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'danger');
    }

    warning(message) {
        this.show(message, 'warning');
    }

    info(message) {
        this.show(message, 'info');
    }
}

// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    .notification-item {
        position: relative;
        overflow: hidden;
    }

    .notification-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.2), transparent);
        animation: shimmerNotification 2s infinite;
    }

    @keyframes shimmerNotification {
        0% { left: -100%; }
        100% { left: 100%; }
    }
`;
document.head.appendChild(style);

// Создаем глобальный экземпляр
const notify = new NotificationSystem();

// Делаем доступным глобально
window.notify = notify;
