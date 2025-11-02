// Эффект свечения за курсором
document.addEventListener('DOMContentLoaded', function() {
    const glow = document.getElementById('cursorGlow');
    
    if (!glow) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Следим за мышью
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Плавное следование за курсором
    function updateGlow() {
        const speed = 0.15;
        currentX += (mouseX - currentX) * speed;
        currentY += (mouseY - currentY) * speed;
        
        glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        
        requestAnimationFrame(updateGlow);
    }
    
    updateGlow();
    
    // Скрываем свечение когда курсор за пределами окна
    document.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
    });
});
