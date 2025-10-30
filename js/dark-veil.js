// Dark Veil Background Effect
class DarkVeil {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        
        // Параметры эффекта
        this.time = 0;
        this.hueShift = 220; // Синий оттенок
        this.noiseIntensity = 0.15;
        this.scanlineIntensity = 0.08;
        this.warpAmount = 0.025;
        this.speed = 0.5;
        
        // Создание буфера для шума
        this.noiseData = this.createNoiseTexture(256, 256);
        
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNoiseTexture(width, height) {
        const imageData = this.ctx.createImageData(width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const value = Math.random() * 255;
            data[i] = value;
            data[i + 1] = value;
            data[i + 2] = value;
            data[i + 3] = 255;
        }
        
        return imageData;
    }
    
    drawVeil() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        // Базовый градиент
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        const hue1 = (this.hueShift) % 360;
        const hue2 = (this.hueShift + 30) % 360;
        const hue3 = (this.hueShift - 30) % 360;
        
        gradient.addColorStop(0, `hsl(${hue1}, 70%, 5%)`);
        gradient.addColorStop(0.5, `hsl(${hue2}, 60%, 3%)`);
        gradient.addColorStop(1, `hsl(${hue3}, 65%, 4%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Волновой эффект с искажением
        this.drawWarpEffect();
        
        // Шум
        this.drawNoise();
        
        // Сканлайны
        this.drawScanlines();
        
        // Виньетка
        this.drawVignette();
    }
    
    drawWarpEffect() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.15;
        
        const gridSize = 40;
        
        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                const warpX = Math.sin(this.time * 0.001 + x * 0.01 + y * 0.005) * this.warpAmount * 100;
                const warpY = Math.cos(this.time * 0.001 + y * 0.01 + x * 0.005) * this.warpAmount * 100;
                
                const brightness = Math.sin(this.time * 0.002 + x * 0.02) * 0.5 + 0.5;
                const hue = (this.hueShift + brightness * 30) % 360;
                
                ctx.fillStyle = `hsl(${hue}, 80%, ${brightness * 20}%)`;
                ctx.fillRect(x + warpX, y + warpY, gridSize * 1.5, gridSize * 1.5);
            }
        }
        
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }
    
    drawNoise() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        // Обновление шума каждый кадр для анимации
        if (Math.random() > 0.9) {
            this.noiseData = this.createNoiseTexture(256, 256);
        }
        
        // Создание паттерна из шума
        const noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = 256;
        noiseCanvas.height = 256;
        const noiseCtx = noiseCanvas.getContext('2d');
        noiseCtx.putImageData(this.noiseData, 0, 0);
        
        const pattern = ctx.createPattern(noiseCanvas, 'repeat');
        
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = this.noiseIntensity;
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }
    
    drawScanlines() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = this.scanlineIntensity;
        
        const lineHeight = 4;
        const offset = (this.time * 0.5) % (lineHeight * 2);
        
        for (let y = -offset; y < height; y += lineHeight * 2) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, y, width, lineHeight);
        }
        
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }
    
    drawVignette() {
        const { width, height } = this.canvas;
        const ctx = this.ctx;
        
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, height * 0.3,
            width / 2, height / 2, height * 0.8
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }
    
    animate() {
        this.time += this.speed;
        this.drawVeil();
        requestAnimationFrame(() => this.animate());
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('darkVeilCanvas');
    if (canvas) {
        new DarkVeil(canvas);
    }
});
