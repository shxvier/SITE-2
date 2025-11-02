// Plasma Background Effect с фиолетовым цветом
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
        
        // Фиолетовые и розовые оттенки
        this.colors = [
            { r: 138, g: 43, b: 226 },   // Фиолетовый (blueviolet)
            { r: 147, g: 51, b: 234 },   // Фиолетовый (purple-600)
            { r: 168, g: 85, b: 247 },   // Фиолетовый (purple-500)
            { r: 192, g: 132, b: 252 },  // Светло-фиолетовый (purple-400)
            { r: 216, g: 180, b: 254 },  // Очень светлый фиолетовый (purple-300)
            { r: 236, g: 72, b: 153 }    // Розовый (pink-500)
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
        const numOrbs = 8;
        for (let i = 0; i < numOrbs; i++) {
            this.orbs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: 150 + Math.random() * 250,
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
            
            // Отскок от краев
            if (orb.x < -orb.radius || orb.x > this.width + orb.radius) {
                orb.vx *= -1;
            }
            if (orb.y < -orb.radius || orb.y > this.height + orb.radius) {
                orb.vy *= -1;
            }
            
            // Пульсация размера
            orb.radius = 200 + Math.sin(this.time * 0.002 + orb.phase) * 80;
        });
    }
    
    drawOrbs() {
        this.orbs.forEach((orb, index) => {
            const gradient = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius
            );
            
            const color = orb.color;
            const alpha = 0.35 + Math.sin(this.time * 0.003 + index) * 0.15;
            
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.6})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        });
    }
    
    drawWaves() {
        const numWaves = 4;
        
        for (let i = 0; i < numWaves; i++) {
            this.ctx.beginPath();
            this.ctx.globalAlpha = 0.2;
            
            for (let x = 0; x <= this.width; x += 8) {
                const y = this.height / 2 + 
                    Math.sin((x * 0.004) + (this.time * 0.002) + (i * 2.5)) * 120 +
                    Math.sin((x * 0.008) + (this.time * 0.003) + (i * 3)) * 60;
                
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            
            const color = this.colors[i % this.colors.length];
            this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.time += 1.2;
        
        // Темный фон
        this.ctx.fillStyle = '#0a0a14';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Обновляем и рисуем орбы
        this.updateOrbs();
        this.drawOrbs();
        
        // Размываем для плавности
        this.ctx.filter = 'blur(50px)';
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
