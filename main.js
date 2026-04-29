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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    // --- Cinematic Biotech Lighting (Enhanced for Realism) ---
    const ambientLight = new THREE.AmbientLight(0x050807, 0.2);
    scene.add(ambientLight);
    
    // Primary Green Top Light
    const topLight = new THREE.SpotLight(0x7CFF00, 10, 50, Math.PI * 0.3, 0.5);
    topLight.position.set(0, 15, 5);
    topLight.castShadow = true;
    scene.add(topLight);
    
    // Cyan Side/Rim Light
    const rimLight = new THREE.DirectionalLight(0x00FFB2, 4);
    rimLight.position.set(-10, 5, -5);
    scene.add(rimLight);
    
    // Subtle Warm Fill (for realism contrast)
    const warmFill = new THREE.PointLight(0xFF6A3D, 2, 15);
    warmFill.position.set(5, -2, 5);
    scene.add(warmFill);

    // Pre-load all models
    const loader = new THREE.GLTFLoader();
    let loadedCount = 0;
    const uniquePaths = [...new Set(Object.values(modelPaths))];
    const totalModels = uniquePaths.length;

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
                    
                    // Enhancement for "Natural" Look:
                    // Keep original materials but enhance their physical properties
                    if (node.material) {
                        node.material.envMapIntensity = 1.5;
                        if (node.material.name.toLowerCase().includes('glow') || node.material.name.toLowerCase().includes('vein')) {
                            node.material.emissive = new THREE.Color(0x7CFF00);
                            node.material.emissiveIntensity = 2;
                        }
                    }
                }
            });

            // Map keys
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
        }, undefined, (err) => {
            console.error(err);
            loadedCount++;
            window.modelProgress = (loadedCount / totalModels) * 100;
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
        if (displayProgress < actualProgress) {
            displayProgress += 2;
        } else if (displayProgress < 99) {
            displayProgress += 0.1;
        }

        if (displayProgress >= 100 && actualProgress >= 100) {
            displayProgress = 100;
            clearInterval(interval);
            gsap.to(initBtn, { opacity: 1, pointerEvents: 'all', duration: 0.5 });
        }
        
        if (bootBar) bootBar.style.width = displayProgress + '%';
    }, 50);

    initBtn.onclick = () => {
        gsap.to('#boot-loader', { opacity: 0, duration: 0.8, onComplete: () => {
            document.getElementById('boot-loader').style.display = 'none';
            initGSAP();
            switchModel('home');
            welcomeVoice();
        }});
    };
}

function welcomeVoice() {
    const msg = new SpeechSynthesisUtterance("Neural link established. System online.");
    msg.rate = 0.9;
    msg.pitch = 0.7;
    window.speechSynthesis.speak(msg);
}

function switchModel(key) {
    if (currentModel) {
        gsap.to(currentModel.scene.position, { x: 8, duration: 0.6, ease: 'power2.in', onComplete: () => {
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
    gsap.to(currentModel.scene.position, { x: 3, duration: 1.2, ease: 'power3.out' });

    if (currentModel.animations && currentModel.animations.length > 0) {
        mixer = new THREE.AnimationMixer(currentModel.scene);
        const action = mixer.clipAction(currentModel.animations[0]);
        action.play();
    }
}

function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Immediate visibility fix
    gsap.set('section .section-content > *', { opacity: 1, y: 0 });

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

        // Refined animation to prevent "Empty Section" look
        gsap.from(`#${section} .section-content > *`, {
            scrollTrigger: {
                trigger: `#${section}`,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            clearProps: 'all' // Ensure it doesn't get stuck at opacity 0
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
        currentModel.scene.position.y = -2 + Math.sin(time * 0.4) * 0.12;
        currentModel.scene.rotation.y = Math.PI * 0.2 + mx * 0.3;
        currentModel.scene.rotation.x = -0.15 + my * 0.1;
    }

    renderer.render(scene, camera);
}

if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 40, density: { enable: true, value_area: 800 } },
            color: { value: '#7CFF00' },
            shape: { type: 'circle' },
            opacity: { value: 0.2, random: true },
            size: { value: 1.5, random: true },
            line_linked: { enable: false },
            move: { enable: true, speed: 0.5, direction: 'none', random: true, out_mode: 'out' }
        }
    });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

initThree();
