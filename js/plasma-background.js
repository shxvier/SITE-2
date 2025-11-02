class PlasmaBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d', { alpha: false, desynchronized: true });
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * devicePixelRatio;
        this.canvas.height = this.height * devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);

        this.time = 0;
        this.mousePos = { x: this.width / 2, y: this.height / 2 };

        this.colors = [
            { r: 138, g: 43, b: 226 },
            { r: 147, g: 51, b: 234 },
            { r: 168, g: 85, b: 247 },
            { r: 192, g: 132, b: 252 },
            { r: 216, g: 180, b: 254 },
            { r: 236, g: 72, b: 153 }
        ];

        // Создаем плазменные орбы
        this.orbs = [];
        const orbCount = 6;
        for (let i = 0; i < orbCount; i++) {
            this.orbs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                baseRadius: 180,
                radiusVariance: 60,
                vx: (Math.random() - 0.5) * 0.7,
                vy: (Math.random() - 0.5) * 0.7,
                color: this.colors[i % this.colors.length],
                phase: Math.random() * Math.PI * 2
            });
        }

        // Следим за мышью
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        window.addEventListener('resize', () => this.resize());

        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * devicePixelRatio;
        this.canvas.height = this.height * devicePixelRatio;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    updateOrbs() {
        for (const orb of this.orbs) {
            orb.x += orb.vx;
            orb.y += orb.vy;

            // Отскок от краев
            if (orb.x < -orb.baseRadius) orb.x = this.width + orb.baseRadius;
            else if (orb.x > this.width + orb.baseRadius) orb.x = -orb.baseRadius;

            if (orb.y < -orb.baseRadius) orb.y = this.height + orb.baseRadius;
            else if (orb.y > this.height + orb.baseRadius) orb.y = -orb.baseRadius;

            // Пульсация радиуса
            orb.radius = orb.baseRadius + Math.sin(this.time * 0.002 + orb.phase) * orb.radiusVariance;
        }
    }

    drawOrbs() {
        for (let i = 0; i < this.orbs.length; i++) {
            const orb = this.orbs[i];

            // Рассчитываем удаление от курсора - для анимации хвоста
            const dx = orb.x - this.mousePos.x;
            const dy = orb.y - this.mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Цвет орба с интерактивностью
            const baseAlpha = 0.35 + Math.sin(this.time * 0.002 + i) * 0.15;
            const alpha = baseAlpha * (dist < 300 ? 1 - dist / 300 : 1);

            const grad = this.ctx.createRadialGradient(
                orb.x, orb.y, 0,
                orb.x, orb.y, orb.radius
            );

            const c = orb.color;

            grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${alpha})`);
            grad.addColorStop(0.6, `rgba(${c.r},${c.g},${c.b},${alpha * 0.5})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');

            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }

    drawWaves() {
        const waveCount = 4;

        this.ctx.globalAlpha = 0.18;

        for (let i = 0; i < waveCount; i++) {
            this.ctx.beginPath();

            for (let x = 0; x <= this.width; x += 8) {
                const y = this.height / 2 +
                    Math.sin(x * 0.003 + this.time * 0.002 + i * 3) * 120 +
                    Math.sin(x * 0.008 + this.time * 0.003 + i * 2) * 60;

                if (x === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            const c = this.colors[i % this.colors.length];
            this.ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.85)`;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        }

        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.time += 1;

        // Темный фон с небольшим градиентом
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        grad.addColorStop(0, '#130637');
        grad.addColorStop(1, '#0a0a14');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.updateOrbs();
        this.drawOrbs();

        // Гладкое размытие - раздваиваем
        this.ctx.filter = 'blur(40px)';
        this.ctx.drawImage(this.canvas, 0, 0);
        this.ctx.filter = 'none';

        this.drawWaves();

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PlasmaBackground('plasmaCanvas');
});
