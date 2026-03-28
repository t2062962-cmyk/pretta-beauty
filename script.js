document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER & SECCIONES (Tu lógica base) ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => { if (preloader) preloader.classList.add('fade-out'); }, 1200);
    });

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('section-visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => sectionObserver.observe(section));

    // --- 2. PANEL HEXAGONAL ESTILO ALMOHADÓN (CAPITONÉ) ---
    const canvas = document.getElementById('pentagon-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let hexagons = [];
        const mouse = { x: -1000, y: -1000, radius: 180 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        }

        class Hexagon {
            constructor(x, y, size) {
                this.x = x;
                this.y = y;
                this.baseX = x;
                this.baseY = y;
                this.size = size;
                // Colores de marca PRETTA
                this.colorBase = { r: 250, g: 240, b: 242 }; // #FAF0F2
                this.colorActive = { r: 216, g: 134, b: 151 }; // #D88697
            }

            drawPath(ctx, x, y, size) {
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    ctx.lineTo(x + size * Math.cos(angle), y + size * Math.sin(angle));
                }
                ctx.closePath();
            }

            draw() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                let ratio = Math.max(0, 1 - dist / mouse.radius);
                
                // Mezcla de color suave
                const r = Math.round(this.colorBase.r + (this.colorActive.r - this.colorBase.r) * ratio);
                const g = Math.round(this.colorBase.g + (this.colorActive.g - this.colorBase.g) * ratio);
                const b = Math.round(this.colorBase.b + (this.colorActive.b - this.colorBase.b) * ratio);

                ctx.save();
                
                // 1. Efecto "Hundido" en los bordes (Sombra de profundidad)
                this.drawPath(ctx, this.x, this.y, this.size);
                ctx.fillStyle = `rgb(${r-15}, ${g-15}, ${b-15})`; // Un tono más oscuro para el fondo del surco
                ctx.fill();

                // 2. El "Almohadón" (Cuerpo principal con relieve)
                // Reducimos un poco el tamaño interno para crear el surco del panal
                const innerSize = this.size * 0.96;
                this.drawPath(ctx, this.x, this.y, innerSize);
                
                // Degradado radial para simular volumen (Centro inflado)
                const grad = ctx.createRadialGradient(
                    this.x - innerSize * 0.2, this.y - innerSize * 0.2, 0,
                    this.x, this.y, innerSize
                );
                
                grad.addColorStop(0, `rgb(${Math.min(255, r+15)}, ${Math.min(255, g+15)}, ${Math.min(255, b+15)})`); // Brillo superior
                grad.addColorStop(0.6, `rgb(${r}, ${g}, ${b})`); // Color base
                grad.addColorStop(1, `rgb(${r-10}, ${g-10}, ${b-10})`); // Sombra de borde interno
                
                ctx.fillStyle = grad;
                ctx.fill();

                // 3. Brillo de seda (Especular)
                if (ratio > 0.1) {
                    ctx.globalAlpha = ratio * 0.4;
                    const specGrad = ctx.createLinearGradient(this.x - innerSize, this.y - innerSize, this.x, this.y);
                    specGrad.addColorStop(0, 'rgba(255,255,255,0.8)');
                    specGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
                    ctx.fillStyle = specGrad;
                    this.drawPath(ctx, this.x, this.y, innerSize);
                    ctx.fill();
                }

                ctx.restore();
            }

            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Efecto de presión: el almohadón se desplaza sutilmente
                    this.x -= (dx / dist) * force * 3;
                    this.y -= (dy / dist) * force * 3;
                } else {
                    this.x += (this.baseX - this.x) * 0.08;
                    this.y += (this.baseY - this.y) * 0.08;
                }
            }
        }

        function init() {
            hexagons = [];
            const size = 42; 
            const xStep = size * 1.5;
            const yStep = size * Math.sqrt(3);

            // Generación precisa para evitar huecos (Estilo panal real)
            for (let y = -yStep; y < canvas.height + yStep; y += yStep) {
                for (let x = -xStep; x < canvas.width + xStep; x += xStep * 2) {
                    hexagons.push(new Hexagon(x, y, size));
                    hexagons.push(new Hexagon(x + xStep, y + yStep / 2, size));
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hexagons.forEach(h => {
                h.update();
                h.draw();
            });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        resize();
        animate();
    }
});
