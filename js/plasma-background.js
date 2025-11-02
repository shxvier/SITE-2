// Оптимизированный Plasma Background с лучшей производительностью
class PlasmaBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d', { 
            alpha: false,
            desynchronized: true // Улучшает производительность
        });
        
        this.time = 0;
        this.animationId = null;
        this.isVisible = true;
        this.lastFrameTime = 0;
        this.fps = 30; // Ограничиваем FPS для лучшей производительности
        this.frameInterval = 1000 / this.fps;
        
        // Определяем размер устройства для адаптивной оптимизации
        this.isMobile = window.innerWidth < 768;
        this.resize();
        
        // Фиолетовые оттенки
        this.colors = [
            { r: 138, g: 43, b: 226 },
            { r: 147, g: 51, b: 234 },
            { r: 168, g: 85, b: 247 },
            { r: 192, g: 132, b: 252 },
            { r: 216, g: 180, b: 254 },
            { r: 236, g: 72, b: 153 }
        ];
        
        // Уменьшаем количество орбов на мобильных
        this.numOrbs = this.isMobile ? 4 : 6;
        this.orbs = [];
        this.initOrbs();
        
        // Оптимизация: останавливаем анимацию когда вкладка неактивна
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible) {
                this.animate(performance.now());
            }
        });
        
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.resize(), 250);
        });
        
        this.animate(performance.now());
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        // Ограничиваем DPR для производительности
        const safeDpr = Math.min(dpr, 2);
        
        this.canvas.width = window.innerWidth * safeDpr;
        this.canvas.height = window.innerHeight * safeDpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        this.ctx.scale(safeDpr, safeDpr);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Проверяем, мобильное ли устройство
        this.isMobile = window.innerWidth < 768;
        this.numOrbs = this.isMobile ? 4 : 6;
        
        // Пересоздаем орбы при изменении размера
        if (this.orbs.length !== this.numOrbs) {
            this.initOrbs();
        }
    }
    
    initOrbs() {
        this.orbs = [];
        for (let i = 0; i < this.numOrbs; i++) {
            this.orbs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                baseRadius: this.isMobile ? 120 : 180,
                radiusVariation: this.isMobile ? 40 : 60,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: this.colors[i % this.colors.length],
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    updateOrbs() {
        this.orbs.forEach(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;
            
            // Простой отскок от краев
            if (orb.x < 0 || orb.x > this.width) orb.vx *= -1;
            if (orb.y < 0 || orb.y > this.height) orb.vy *= -1;
            
            // Пульсация радиуса
            orb.radius = orb.baseRadius + Math.sin(this.time * 0.001 + orb.phase) * orb.radiusVariation;
        });
    }
    
    drawOrbs() {
        // Используем более эффективный метод отрисовки
        this.orbs.forEach((orb, index) => {
            const gradient = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius
            );
            
            const color = orb.color;
            const alpha = 0.3 + Math.sin(this.time * 0.002 + index) * 0.1;
            
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
            gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        });
    }
    
    drawSimplifiedWaves() {
        // Упрощенные волны для лучшей производительности
        const numWaves = this.isMobile ? 2 : 3;
        
        this.ctx.globalAlpha = 0.15;
        
        for (let i = 0; i < numWaves; i++) {
            this.ctx.beginPath();
            
            const step = this.isMobile ? 15 : 10;
            
            for (let x = 0; x <= this.width; x += step) {
                const y = this.height / 2 + 
                    Math.sin((x * 0.003) + (this.time * 0.0015) + (i * 2)) * 100 +
                    Math.sin((x * 0.006) + (this.time * 0.002) + (i * 2.5)) * 50;
                
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            const color = this.colors[i % this.colors.length];
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.6)`;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    animate(currentTime) {
        if (!this.isVisible) return;
        
        // Ограничение FPS
        const elapsed = currentTime - this.lastFrameTime;
        
        if (elapsed > this.frameInterval) {
            this.lastFrameTime = currentTime - (elapsed % this.frameInterval);
            
            this.time += 0.8;
            
            // Базовый фон
            this.ctx.fillStyle = '#0a0a14';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            // Обновляем и рисуем орбы
            this.updateOrbs();
            this.drawOrbs();
            
            // Применяем размытие один раз (самая затратная операция)
            // На мобильных уменьшаем размытие
            const blurAmount = this.isMobile ? 30 : 40;
            this.ctx.filter = `blur(${blurAmount}px)`;
            this.ctx.drawImage(this.canvas, 0, 0);
            this.ctx.filter = 'none';
            
            // Рисуем упрощенные волны
            this.drawSimplifiedWaves();
        }
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    // Метод для остановки анимации (если нужно)
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Инициализация с задержкой для ускорения загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Небольшая задержка для приоритета загрузки контента
    setTimeout(() => {
        const canvas = document.getElementById('plasmaCanvas');
        if (canvas) {
            window.plasmaBackground = new PlasmaBackground('plasmaCanvas');
        }
    }, 100);
});
