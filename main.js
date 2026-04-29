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

    // Start boot sequence immediately to show progress
    runBootSequence();

    uniquePaths.forEach(path => {
        loader.load(path, (gltf) => {
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
            window.modelProgress = (loadedCount / totalModels) * 100;
        }, undefined, (error) => {
            console.error('Error loading model:', error);
            loadedCount++; // Count even on error to prevent hanging
        });
    });

    animate();
}

function runBootSequence() {
    const bootBar = document.getElementById('boot-bar');
    const initBtn = document.getElementById('init-button');
    let displayProgress = 0;

    const interval = setInterval(() => {
        const actualProgress = window.modelProgress || 0;
        
        // Smoothly approach actual loading progress
        if (displayProgress < actualProgress) {
            displayProgress += 2;
        } else if (displayProgress < 99) {
            displayProgress += 0.2; // Slow crawl while waiting
        }

        if (displayProgress >= 100 && actualProgress >= 100) {
            displayProgress = 100;
            clearInterval(interval);
            initBtn.style.opacity = 1;
            initBtn.style.pointerEvents = 'all';
        }
        
        if (bootBar) bootBar.style.width = displayProgress + '%';
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
    msg.pitch = 0.6;
    window.speechSynthesis.speak(msg);
}

function switchModel(key) {
    if (currentModel) {
        gsap.to(currentModel.scene.position, { x: 8, duration: 0.8, ease: 'power2.in', onComplete: () => {
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
        currentModel.scene.position.y = -2 + Math.sin(time * 0.5) * 0.15;
        currentModel.scene.rotation.y = Math.PI * 0.2 + mx * 0.4;
        currentModel.scene.rotation.x = -0.2 + my * 0.15;
    }

    renderer.render(scene, camera);
}

// --- Particles.js Config ---
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: '#7CFF00' },
            shape: { type: 'circle' },
            opacity: { value: 0.3, random: true },
            size: { value: 2, random: true },
            line_linked: { enable: false },
            move: { enable: true, speed: 0.8, direction: 'none', random: true, out_mode: 'out' }
        }
    });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initThree();
