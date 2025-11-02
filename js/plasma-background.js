// Plasma Background Effect
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
        
        // Настройки плазмы
        this.colors = [
            { r: 138, g: 43, b: 226 },   // Фиолетовый
            { r: 75, g: 0, b: 130 },     // Индиго
            { r: 255, g: 20, b: 147 },   // Розовый
            { r: 0, g: 191, b: 255 },    // Голубой
            { r: 148, g: 0, b: 211 }     // Темно-фиолетовый
        ];
        
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    
    // Функция для создания плазменного эффекта
    plasma(x, y, time) {
        const value = Math.sin(x * 0.01 + time) +
                     Math.sin(y * 0.01 + time) +
                     Math.sin((x + y) * 0.01 + time) +
                     Math.sin(Math.sqrt(x * x + y * y) * 0.01 + time);
        return value;
    }
    
    // Интерполяция цветов
    interpolateColor(value) {
        const normalized = (value + 4) / 8; // Нормализация от -4 до 4 в 0-1
        const colorIndex = normalized * (this.colors.length - 1);
        const index = Math.floor(colorIndex);
        const nextIndex = Math.min(index + 1, this.colors.length - 1);
        const blend = colorIndex - index;
        
        const color1 = this.colors[index];
        const color2 = this.colors[nextIndex];
        
        return {
            r: Math.floor(color1.r + (color2.r - color1.r) * blend),
            g: Math.floor(color1.g + (color2.g - color1.g) * blend),
            b: Math.floor(color1.b + (color2.b - color1.b) * blend)
        };
    }
    
    drawPlasma() {
        const imageData = this.ctx.createImageData(this.width, this.height);
        const data = imageData.data;
        
        // Уменьшаем разрешение для производительности
        const step = 4;
        
        for (let y = 0; y < this.height; y += step) {
            for (let x = 0; x < this.width; x += step) {
                const value = this.plasma(x, y, this.time);
                const color = this.interpolateColor(value);
                
                // Заполняем блок пикселей
                for (let dy = 0; dy < step && y + dy < this.height; dy++) {
                    for (let dx = 0; dx < step && x + dx < this.width; dx++) {
                        const index = ((y + dy) * this.width + (x + dx)) * 4;
                        data[index] = color.r;
                        data[index + 1] = color.g;
                        data[index + 2] = color.b;
                        data[index + 3] = 255;
                    }
                }
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        
        // Добавляем размытие для плавности
        this.ctx.filter = 'blur(20px)';
        this.ctx.drawImage(this.canvas, 0, 0);
        this.ctx.filter = 'none';
    }
    
    // Рисуем градиентные орбы
    drawOrbs() {
        const numOrbs = 5;
        
        for (let i = 0; i < numOrbs; i++) {
            const angle = (this.time * 0.001 + i * Math.PI * 2 / numOrbs);
            const x = this.width / 2 + Math.cos(angle) * 200;
            const y = this.height / 2 + Math.sin(angle) * 150;
            const size = 300 + Math.sin(this.time * 0.002 + i) * 100;
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
            const color = this.colors[i % this.colors.length];
            
            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`);
            gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }
    
    animate() {
        this.time += 0.5;
        
        // Очищаем canvas
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Рисуем орбы
        this.drawOrbs();
        
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
