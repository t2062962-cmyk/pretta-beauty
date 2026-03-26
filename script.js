document.addEventListener('DOMContentLoaded', () => {
    
    // 0. LÓGICA DEL PRELOADER
    const preloader = document.getElementById('preloader');
    
    // Ocultar preloader cuando todo esté cargado
    window.addEventListener('load', () => {
        // Un pequeño retraso para que el usuario pueda ver el logo
        setTimeout(() => {
            preloader.classList.add('fade-out');
        }, 1200); // 1.2 segundos
    });

    // 1. REVELADO DE SECCIONES (Intersection Observer)
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.05 }); // Umbral bajo para que revele pronto

    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });

    // 2. THREE.JS (El objeto 3D - AHORA EN ROSA FUERTE VIBRANTE)
    let scene, camera, renderer, object;
    const container = document.getElementById('threejs-canvas');

    function init3D() {
        scene = new THREE.Scene();
        
        // Cámara bien posicionada
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderizador con antialias para bordes suaves
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Geometría grande y nítida (Toroide Nudo)
        const geometry = new THREE.TorusKnotGeometry(1.8, 0.5, 150, 20);
        
        // --- MATERIAL ACTUALIZADO: ROSA FUERTE VIBRANTE (FUCSIA/CEREZO) ---
        const material = new THREE.MeshPhysicalMaterial({ 
            color: 0xF7C8F4, // Rosa Fuerte (Deep Pink / Fucsia)
            metalness: 0.6,  // Un toque ligero de metal para brillo
            roughness: 0.05, // Muy pulido
            transmission: 0.8, // Traslúcido (pasa luz, se ve rosa intenso pero no tapa)
            thickness: 1.0,  // Grosor medio para refracción
            ior: 1.5,        // Índice de Refracción estándar
            specularColor: 0xffffff,
            specularIntensity: 1.0, // Brillos blancos intensos
            clearcoat: 1.0,  // Efecto laca brillante pulida
            clearcoatRoughness: 0.02,
        });
        
        object = new THREE.Mesh(geometry, material);
        scene.add(object);

        // --- ILUMINACIÓN AJUSTADA PARA ROSA INTENSO ---
        // Luz direccional principal frontal (para destellos y color)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(1, 2, 5);
        scene.add(directionalLight);

        // Luz de relleno lateral suave
        const fillLight = new THREE.DirectionalLight(0xfff0f5, 0.8);
        fillLight.position.set(-5, -2, 2);
        scene.add(fillLight);

        // Luz ambiental suave neutra
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    }

    // Movimiento de ratón con suavizado (Interpolación)
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        // Guardamos la posición relativa al centro (muy suave)
        mouseX = (e.clientX - window.innerWidth / 2) * 0.0003;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.0003;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (object) {
            // El objeto sigue al mouse con un retraso elegante
            object.rotation.y += (mouseX - object.rotation.y) * 0.05;
            object.rotation.x += (mouseY - object.rotation.x) * 0.05;
            
            // Un pequeño giro constante automático muy lento
            object.rotation.z += 0.001;
        }
        renderer.render(scene, camera);
    }

    // Inicializar si el contenedor existe
    if (container) {
        init3D();
        animate();
    }

    // Ajuste de ventana si cambia el tamaño
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
