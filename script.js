document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER (Carga de la experiencia) ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        // Se mantiene el delay de 1.2s para que luzca el logo al cargar
        setTimeout(() => { 
            if (preloader) preloader.classList.add('fade-out'); 
        }, 1200);
    });

    // --- 2. SECCIONES REVEAL (Animación al hacer scroll) ---
    // Esta lógica hace que los elementos aparezcan suavemente al bajar
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { 
        threshold: 0.1 // Se activa cuando el 10% de la sección es visible
    });

    // Observar todas las secciones y elementos con la clase 'reveal'
    document.querySelectorAll('section, .reveal').forEach(el => {
        sectionObserver.observe(el);
    });

    // --- 3. NOTA SOBRE EL FONDO ---
    // La lógica de los hexágonos ha sido removida. 
    // El fondo cristalino con brillos ahora se gestiona puramente por CSS
    // para optimizar el rendimiento y la estética Premium.
});
