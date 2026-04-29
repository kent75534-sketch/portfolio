// Initialize Three.js
let scene, camera, renderer, currentModel, mixer;
const clock = new THREE.Clock();
const models = {};
const modelPaths = {
    home: 'Hitem3d-1777390120323.glb',
    about: 'Hitem3d-1777390120323.glb',
    skills: 'Hitem3d-1777390120323.glb',
    projects: 'Hitem3d-1777397066275.glb',
    experience: 'Hitem3d-1777397066275.glb',
    contact: 'Hitem3d-1777397047039.glb'
};

// --- Interactive Cursor State ---
let mx = 0, my = 0;

window.addEventListener('mousemove', (e) => {
    mx = (e.clientX - window.innerWidth / 2) * 0.001;
    my = (e.clientY - window.innerHeight / 2) * 0.001;
});

function initThree() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.0;
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    // --- Cinematic Biotech Lighting ---
    const ambientLight = new THREE.AmbientLight(0x0a1f0a, 0.5);
    scene.add(ambientLight);
    
    // Strong Green Top-Light (Lab Feel)
    const topLight = new THREE.DirectionalLight(0x7CFF00, 6);
    topLight.position.set(0, 15, 5);
    scene.add(topLight);
    
    // Cyan Rim Light
    const rimLight = new THREE.DirectionalLight(0x00FFB2, 4);
    rimLight.position.set(-10, 2, -10);
    scene.add(rimLight);
    
    // Front Fill
    const fillLight = new THREE.PointLight(0xffffff, 1, 10);
    fillLight.position.set(0, 0, 5);
    scene.add(fillLight);

    // Pre-load all models
    const loader = new THREE.GLTFLoader();
    let loadedCount = 0;
    const totalModels = new Set(Object.values(modelPaths)).size;
    const uniquePaths = [...new Set(Object.values(modelPaths))];

            const m = gltf.scene;
            m.scale.set(4, 4, 4);
            m.position.set(3, -2, 0); 
            m.rotation.y = Math.PI * 0.2;
            m.visible = false;
            
            m.traverse(node => {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    if (node.material) {
                        node.material.roughness = 1.0;
                        node.material.metalness = 0.0;
                    }
                }
            });

            // Map the path back to the section keys
            for (const [key, p] of Object.entries(modelPaths)) {
                if (p === path) {
                    models[key] = {
                        scene: m.clone(),
                        animations: gltf.animations
                    };
                    scene.add(models[key].scene);
                }
            }

            loadedCount++;
            if (loadedCount === totalModels) {
                runBootSequence();
            }
        });
    });

    animate();
}

function runBootSequence() {
    const bootBar = document.getElementById('boot-bar');
    const initBtn = document.getElementById('init-button');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            initBtn.style.opacity = 1;
            initBtn.style.pointerEvents = 'all';
        }
        bootBar.style.width = progress + '%';
    }, 50);

    initBtn.onclick = () => {
        gsap.to('#boot-loader', { opacity: 0, duration: 1, onComplete: () => {
            document.getElementById('boot-loader').style.display = 'none';
            initGSAP();
            switchModel('home');
            welcomeVoice();
        }});
    };
}

function welcomeVoice() {
    const msg = new SpeechSynthesisUtterance("Welcome. System Initialized.");
    msg.rate = 0.8;
    msg.pitch = 0.6; // Deep Authoritative
    window.speechSynthesis.speak(msg);
}

function switchModel(key) {
    if (currentModel) {
        gsap.to(currentModel.scene.position, { x: 5, opacity: 0, duration: 0.8, ease: 'power2.in', onComplete: () => {
            currentModel.scene.visible = false;
            showNewModel(key);
        }});
    } else {
        showNewModel(key);
    }
}

function showNewModel(key) {
    currentModel = models[key];
    if (!currentModel) return;

    currentModel.scene.visible = true;
    currentModel.scene.position.x = 8;
    gsap.to(currentModel.scene.position, { x: 3, duration: 1.5, ease: 'expo.out' });

    // Handle animations
    if (currentModel.animations && currentModel.animations.length > 0) {
        mixer = new THREE.AnimationMixer(currentModel.scene);
        const action = mixer.clipAction(currentModel.animations[0]);
        action.play();
    }
}

function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
    
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: `#${section}`,
            start: 'top center',
            onEnter: () => {
                switchModel(section);
                updateNav(section);
            },
            onEnterBack: () => {
                switchModel(section);
                updateNav(section);
            }
        });
    });

    // Animate section content on scroll
    sections.forEach(section => {
        gsap.from(`#${section} .section-content > *`, {
            scrollTrigger: {
                trigger: `#${section}`,
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        });
    });
}

function updateNav(section) {
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${section}`) a.classList.add('active');
    });
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    if (mixer) mixer.update(delta);

    if (currentModel) {
        // Subtle Breathing & Hover
        currentModel.scene.position.y = -2 + Math.sin(time * 0.5) * 0.15;
        
        // Head Tracking (Subtle)
        currentModel.scene.rotation.y = Math.PI * 0.2 + mx * 0.4;
        currentModel.scene.rotation.x = -0.2 + my * 0.15;
    }

    renderer.render(scene, camera);
}

// --- Particles.js Config ---
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#7CFF00' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
        size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
        line_linked: { enable: false },
        move: { enable: true, speed: 1, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false, attact: { enable: false, rotateX: 600, rotateY: 1200 } }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'bubble' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 200, size: 6, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
    },
    retina_detect: true
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initThree();
