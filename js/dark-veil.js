// Dark Veil Background Effect
class DarkVeil {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.time = 0;
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    drawBackground() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        // Базовый градиент
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0a1929');
        gradient.addColorStop(0.5, '#1e3c72');
        gradient.addColorStop(1, '#0a1929');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Волновой эффект
        this.drawWaves();
        
        // Шум
        this.drawNoise();
        
        // Виньетка
        this.drawVignette();
    }
    
    drawWaves() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        ctx.globalAlpha = 0.1;
        
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            
            for (let x = 0; x < width; x += 5) {
                const y = height / 2 + 
                    Math.sin((x + this.time * (i + 1)) * 0.01) * 50 +
                    Math.sin((x + this.time * (i + 1)) * 0.02) * 30;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            const hue = 200 + i * 20;
            ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
    
    drawNoise() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        ctx.globalAlpha = 0.05;
        
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 2;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y, size, size);
        }
        
        ctx.globalAlpha = 1;
    }
    
    drawVignette() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, height * 0.2,
            width / 2, height / 2, height * 0.8
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    animate() {
        this.time += 0.5;
        this.drawBackground();
        requestAnimationFrame(() => this.animate());
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    new DarkVeil('darkVeilCanvas');
});
