// Plasma Background Effect с плавной анимацией
class PlasmaBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.resize();
        
        // Голубые и светлые оттенки
        this.colors = [
            { r: 14, g: 165, b: 233 },   // Светло-голубой (sky-500)
            { r: 59, g: 130, b: 246 },   // Синий (blue-500)
            { r: 6, g: 182, b: 212 },    // Бирюзовый (cyan-500)
            { r: 34, g: 211, b: 238 },   // Яркий cyan (cyan-400)
            { r: 96, g: 165, b: 250 },   // Мягкий голубой (blue-400)
            { r: 125, g: 211, b: 252 }   // Светло-голубой (sky-300)
        ];
        
        // Орбы для анимации
        this.orbs = [];
        this.initOrbs();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    initOrbs() {
        const numOrbs = 6;
        for (let i = 0; i < numOrbs; i++) {
            this.orbs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: 200 + Math.random() * 200,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: this.colors[i % this.colors.length]
            });
        }
    }
    
    updateOrbs() {
        this.orbs.forEach(orb => {
            orb.x += orb.vx;
            orb.y += orb.vy;
            
            // Отскок от краев
            if (orb.x < -orb.radius || orb.x > this.width + orb.radius) {
                orb.vx *= -1;
            }
            if (orb.y < -orb.radius || orb.y > this.height + orb.radius) {
                orb.vy *= -1;
            }
            
            // Пульсация размера
            orb.radius = 200 + Math.sin(this.time * 0.001) * 50;
        });
    }
    
    drawOrbs() {
        this.orbs.forEach((orb, index) => {
            const gradient = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius
            );
            
            const color = orb.color;
            const alpha = 0.3 + Math.sin(this.time * 0.002 + index) * 0.1;
            
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        });
    }
    
    drawWaves() {
        const numWaves = 3;
        
        for (let i = 0; i < numWaves; i++) {
            this.ctx.beginPath();
            this.ctx.globalAlpha = 0.15;
            
            for (let x = 0; x <= this.width; x += 10) {
                const y = this.height / 2 + 
                    Math.sin((x * 0.005) + (this.time * 0.001) + (i * 2)) * 100 +
                    Math.sin((x * 0.01) + (this.time * 0.002) + (i * 3)) * 50;
                
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
    
    animate() {
        this.time += 1;
        
        // Темный фон
        this.ctx.fillStyle = '#0a0f1e';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Обновляем и рисуем орбы
        this.updateOrbs();
        this.drawOrbs();
        
        // Размываем для плавности
        this.ctx.filter = 'blur(40px)';
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
        new PlasmaBackground('plasmaCanvas');
    }
});
