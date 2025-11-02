// Красивый анимированный Plasma Background с фиолетовыми оттенками
class PlasmaBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d', { 
            alpha: false,
            desynchronized: true
        });
        
        this.time = 0;
        this.mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.resize();
        
        // Фиолетовые и розовые оттенки
        this.colors = [
            { r: 138, g: 43, b: 226 },   // blueviolet
            { r: 147, g: 51, b: 234 },   // purple-600
            { r: 168, g: 85, b: 247 },   // purple-500
            { r: 192, g: 132, b: 252 },  // purple-400
            { r: 216, g: 180, b: 254 },  // purple-300
            { r: 236, g: 72, b: 153 }    // pink-500
        ];
        
        // Создаем орбы
        this.orbs = [];
        this.initOrbs();
        
        // Следим за мышью для интерактивности
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
        
        window.addEventListener('resize', () => this.resize());
        
        this.animate();
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    
    initOrbs() {
        this.orbs = [];
        const numOrbs = 7;
        for (let i = 0; i < numOrbs; i++) {
            this.orbs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                baseRadius: 200,
                radiusVariation: 70,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                color: this.colors[i % this.colors.length],
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    updateOrbs() {
        this.orbs.forEach(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;
            
            // Плавный отскок от краев
            if (orb.x < -orb.baseRadius) orb.x = this.width + orb.baseRadius;
            else if (orb.x > this.width + orb.baseRadius) orb.x = -orb.baseRadius;
            
            if (orb.y < -orb.baseRadius) orb.y = this.height + orb.baseRadius;
            else if (orb.y > this.height + orb.baseRadius) orb.y = -orb.baseRadius;
            
            // Пульсация радиуса
            orb.radius = orb.baseRadius + Math.sin(this.time * 0.002 + orb.phase) * orb.radiusVariation;
        });
    }
    
    drawOrbs() {
        this.orbs.forEach((orb, index) => {
            // Рассчитываем расстояние до курсора для интерактивности
            const dx = orb.x - this.mousePos.x;
            const dy = orb.y - this.mousePos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const gradient = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius
            );
            
            const color = orb.color;
            let alpha = 0.4 + Math.sin(this.time * 0.003 + index) * 0.15;
            
            // Увеличиваем яркость рядом с курсором
            if (distance < 300) {
                alpha *= 1 + (1 - distance / 300) * 0.5;
            }
            
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.6})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        });
    }
    
    drawWaves() {
        const numWaves = 4;
        this.ctx.globalAlpha = 0.2;
        
        for (let i = 0; i < numWaves; i++) {
            this.ctx.beginPath();
            
            for (let x = 0; x <= this.width; x += 6) {
                const y = this.height / 2 + 
                    Math.sin((x * 0.003) + (this.time * 0.002) + (i * 2.5)) * 130 +
                    Math.sin((x * 0.007) + (this.time * 0.0025) + (i * 3)) * 65;
                
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            const color = this.colors[i % this.colors.length];
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.time += 1.2;
        
        // Градиентный темный фон
        const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        bgGradient.addColorStop(0, '#140b2e');
        bgGradient.addColorStop(0.5, '#0f0820');
        bgGradient.addColorStop(1, '#0a0614');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Обновляем и рисуем орбы
        this.updateOrbs();
        this.drawOrbs();
        
        // Применяем размытие для плавности
        this.ctx.filter = 'blur(45px)';
        this.ctx.drawImage(this.canvas, 0, 0);
        this.ctx.filter = 'none';
        
        // Рисуем волны поверх
        this.drawWaves();
        
        requestAnimationFrame(() => this.animate());
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('plasmaCanvas');
    if (canvas) {
        window.plasmaBackground = new PlasmaBackground('plasmaCanvas');
    }
});
