    // â”€â”€ 3D CINEMATIC HOLOGRAM â”€â”€
        // â”€â”€ 3D CINEMATIC HOLOGRAM (High-Fidelity Humanoid) â”€â”€
    (function initHologram() {
      const container = document.getElementById('hologram-container');
      if (!container) return;
      const W = container.offsetWidth || window.innerWidth / 2;
      const H = container.offsetHeight || window.innerHeight;

      const scene = new THREE.Scene();
      // Cinematic fog for depth
      scene.fog = new THREE.FogExp2(0x0d0f12, 0.15);

      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      camera.position.set(0, 0, 5);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // Enable shadows
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // --- Audio Context for Voice/UI sounds ---
      let audioCtx;
      function playBeep(freq, type, duration) {
        try {
          if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(freq*0.5, audioCtx.currentTime + duration);
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        } catch(e) {}
      }

      // --- Materials (8D Immersive Glass/Neon) ---
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a1a, metalness: 0.9, roughness: 0.2,
        transmission: 0.9, ior: 1.5, clearcoat: 1.0,
        side: THREE.DoubleSide
      });
      const darkMat = new THREE.MeshStandardMaterial({
        color: 0x050505, roughness: 0.8, metalness: 0.5
      });
      const neonCyan = new THREE.MeshBasicMaterial({ color: 0x00d9ff });
      const neonRed = new THREE.MeshBasicMaterial({ color: 0xff1744 });
      const neonYellow = new THREE.MeshBasicMaterial({ color: 0xffd600 });

      // --- Humanoid Construction ---
      const figure = new THREE.Group();

      // Torso
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 1.2, 32), glassMat);
      torso.position.y = -0.5;
      torso.castShadow = true;
      figure.add(torso);

      // Core (Data Heart)
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.15, 1), neonCyan);
      core.position.y = 0.2;
      torso.add(core);

      // Neck
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.3, 16), darkMat);
      neck.position.y = 0.7;
      torso.add(neck);

      // Head Group
      const headGroup = new THREE.Group();
      headGroup.position.y = 0.25;
      neck.add(headGroup);

      // Head Mesh (Icosahedron for sci-fi look)
      const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.35, 3), glassMat);
      headGroup.add(head);

      // Eyes
      const eyeGeo = new THREE.SphereGeometry(0.05, 16, 16);
      const leftEye = new THREE.Mesh(eyeGeo, neonCyan);
      leftEye.position.set(-0.12, 0.05, 0.3);
      const rightEye = new THREE.Mesh(eyeGeo, neonCyan);
      rightEye.position.set(0.12, 0.05, 0.3);
      headGroup.add(leftEye, rightEye);

      // Mouth
      const mouthGeo = new THREE.BoxGeometry(0.15, 0.02, 0.05);
      const mouth = new THREE.Mesh(mouthGeo, neonCyan);
      mouth.position.set(0, -0.15, 0.32);
      headGroup.add(mouth);

      // Arms (Left)
      const lShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), darkMat);
      lShoulder.position.set(-0.5, 0.4, 0);
      torso.add(lShoulder);
      
      const lUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.6, 16), glassMat);
      lUpperArm.position.y = -0.3;
      lShoulder.add(lUpperArm);

      const lElbow = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), darkMat);
      lElbow.position.y = -0.35;
      lUpperArm.add(lElbow);

      const lLowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.6, 16), glassMat);
      lLowerArm.position.y = -0.35;
      lElbow.add(lLowerArm);

      const lHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.05), neonCyan);
      lHand.position.y = -0.35;
      lLowerArm.add(lHand);

      // Arms (Right)
      const rShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), darkMat);
      rShoulder.position.set(0.5, 0.4, 0);
      torso.add(rShoulder);
      
      const rUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.6, 16), glassMat);
      rUpperArm.position.y = -0.3;
      rShoulder.add(rUpperArm);

      const rElbow = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), darkMat);
      rElbow.position.y = -0.35;
      rUpperArm.add(rElbow);

      const rLowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 0.6, 16), glassMat);
      rLowerArm.position.y = -0.35;
      rElbow.add(rLowerArm);

      const rHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.15, 0.05), neonCyan);
      rHand.position.y = -0.35;
      rLowerArm.add(rHand);

      // Add floating data particles
      const ptGeo = new THREE.BufferGeometry();
      const ptCount = 400;
      const ptPos = new Float32Array(ptCount * 3);
      for(let i=0; i<ptCount*3; i++) ptPos[i] = (Math.random() - 0.5) * 8;
      ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3));
      const ptMat = new THREE.PointsMaterial({ color: 0x00d9ff, size: 0.02, transparent: true, opacity: 0.5 });
      const particles = new THREE.Points(ptGeo, ptMat);
      scene.add(particles);

      scene.add(figure);

      // --- Lighting ---
      const ambient = new THREE.AmbientLight(0x0d0f12, 2);
      scene.add(ambient);

      const spot1 = new THREE.SpotLight(0x00d9ff, 5);
      spot1.position.set(3, 5, 4);
      spot1.angle = Math.PI / 4;
      spot1.penumbra = 0.5;
      spot1.castShadow = true;
      scene.add(spot1);

      const spot2 = new THREE.SpotLight(0xff1744, 4);
      spot2.position.set(-3, -2, 2);
      scene.add(spot2);

      const backLight = new THREE.PointLight(0xffd600, 2);
      backLight.position.set(0, 2, -4);
      scene.add(backLight);

      // --- Interaction State ---
      let mx = 0, my = 0;
      let targetMx = 0, targetMy = 0;
      let stateTimer = 0;
      let emotion = 'calm'; // calm, curious, action

      document.addEventListener('mousemove', e => {
        const rect = container.getBoundingClientRect();
        targetMx = ((e.clientX - rect.left) / (rect.width || 200) - 0.5) * 2;
        targetMy = ((e.clientY - rect.top) / (rect.height || 200) - 0.5) * 2;
        
        // Emotion shifting based on rapid movement
        if (Math.abs(targetMx - mx) > 0.3) {
          emotion = 'curious';
          stateTimer = 2.0;
        }
      });

      const armorWrap = document.getElementById('humanoid-container');
      document.addEventListener('click', () => {
        emotion = 'action';
        stateTimer = 1.5;
        playBeep(800, 'sine', 0.1);
        setTimeout(() => playBeep(1200, 'square', 0.2), 100);
        
        // HUD reaction
        const status = document.getElementById('hud-status');
        const target = document.getElementById('hud-target');
        if (status) { status.innerText = 'SYS.PROCESSING'; status.style.color = '#ffd600'; }
        if (target) { target.innerText = 'TARGET.LOCKED'; target.style.color = '#ff1744'; }
        
        setTimeout(() => {
          if (status) { status.innerText = 'SYS.ONLINE'; status.style.color = '#00d9ff'; }
          if (target) { target.innerText = 'AWAITING_INPUT'; target.style.color = '#ff1744'; }
        }, 1500);

        // CSS class
        if (armorWrap) {
          armorWrap.classList.remove('clicking');
          void armorWrap.offsetWidth;
          armorWrap.classList.add('clicking');
          setTimeout(() => armorWrap.classList.remove('clicking'), 660);
        }
      });

      let scrollVel = 0;
      let lastScrollY = window.scrollY;
      window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        scrollVel = sy - lastScrollY;
        lastScrollY = sy;
        if (Math.abs(scrollVel) > 10) {
          emotion = 'action';
          stateTimer = 1.0;
        }
      });

      // --- Animation Loop ---
      let t = 0;
      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        const dt = clock.getDelta();
        t += dt;

        // Smooth mouse tracking
        mx += (targetMx - mx) * 5 * dt;
        my += (targetMy - my) * 5 * dt;

        stateTimer -= dt;
        if (stateTimer <= 0) emotion = 'calm';

        // 1. Posture & Breathing
        const breathe = Math.sin(t * 1.5);
        torso.scale.y = 1 + breathe * 0.03;
        torso.position.y = -0.5 + breathe * 0.02;
        lShoulder.position.y = 0.4 + breathe * 0.04;
        rShoulder.position.y = 0.4 + breathe * 0.04;

        // Parallax and sway
        figure.position.x = mx * 0.2;
        figure.position.y = -my * 0.2 - 0.2;
        figure.rotation.y = mx * 0.5 + Math.sin(t * 0.5) * 0.1;
        figure.rotation.x = my * 0.2 + Math.sin(t * 0.3) * 0.05;

        // 2. Head & Eye Contact
        // Head looks at cursor
        headGroup.rotation.y = mx * 0.8;
        headGroup.rotation.x = -my * 0.8;
        
        // Eyes shifting
        const eyeShiftX = mx * 0.05;
        const eyeShiftY = -my * 0.05;
        leftEye.position.x = -0.12 + eyeShiftX;
        rightEye.position.x = 0.12 + eyeShiftX;
        leftEye.position.y = 0.05 + eyeShiftY;
        rightEye.position.y = 0.05 + eyeShiftY;

        // 3. Facial Expressions (Emotion)
        if (emotion === 'calm') {
          // Blink occasionally
          const blink = Math.random() > 0.98 ? 0.1 : 1;
          leftEye.scale.y += (blink - leftEye.scale.y) * 10 * dt;
          rightEye.scale.y += (blink - rightEye.scale.y) * 10 * dt;
          
          mouth.scale.x += (1 - mouth.scale.x) * 10 * dt;
          mouth.scale.y += (1 - mouth.scale.y) * 10 * dt;
          leftEye.material.color.setHex(0x00d9ff);
          rightEye.material.color.setHex(0x00d9ff);
          mouth.material.color.setHex(0x00d9ff);
          core.material.color.setHex(0x00d9ff);
        } 
        else if (emotion === 'curious') {
          // Eyes widen
          leftEye.scale.y += (1.5 - leftEye.scale.y) * 10 * dt;
          rightEye.scale.y += (1.5 - rightEye.scale.y) * 10 * dt;
          // Head tilt
          headGroup.rotation.z += (0.2 - headGroup.rotation.z) * 5 * dt;
          // Mouth forms small 'o'
          mouth.scale.x += (0.4 - mouth.scale.x) * 10 * dt;
          mouth.scale.y += (2.0 - mouth.scale.y) * 10 * dt;
          
          leftEye.material.color.setHex(0xffd600);
          rightEye.material.color.setHex(0xffd600);
          mouth.material.color.setHex(0xffd600);
          core.material.color.setHex(0xffd600);
        }
        else if (emotion === 'action') {
          // Eyes narrow (angry/focused)
          leftEye.scale.y += (0.3 - leftEye.scale.y) * 15 * dt;
          rightEye.scale.y += (0.3 - rightEye.scale.y) * 15 * dt;
          headGroup.rotation.z += (0 - headGroup.rotation.z) * 10 * dt;
          // Mouth widens
          mouth.scale.x += (1.5 - mouth.scale.x) * 15 * dt;
          mouth.scale.y += (0.5 - mouth.scale.y) * 15 * dt;

          leftEye.material.color.setHex(0xff1744);
          rightEye.material.color.setHex(0xff1744);
          mouth.material.color.setHex(0xff1744);
          core.material.color.setHex(0xff1744);
        }

        // Voice modulation (Mouth pulses when action)
        if (emotion === 'action') {
          mouth.scale.y = 0.5 + Math.random() * 1.5;
        }

        // 4. Hand Gestures
        if (emotion === 'calm') {
          lUpperArm.rotation.z += (0.3 - lUpperArm.rotation.z) * 5 * dt;
          lUpperArm.rotation.x += (0 - lUpperArm.rotation.x) * 5 * dt;
          lElbow.rotation.x += (-0.1 - lElbow.rotation.x) * 5 * dt;
          
          rUpperArm.rotation.z += (-0.3 - rUpperArm.rotation.z) * 5 * dt;
          rUpperArm.rotation.x += (0 - rUpperArm.rotation.x) * 5 * dt;
          rElbow.rotation.x += (-0.1 - rElbow.rotation.x) * 5 * dt;
        } else if (emotion === 'curious') {
          // One hand up to chin
          rUpperArm.rotation.z += (-0.1 - rUpperArm.rotation.z) * 5 * dt;
          rUpperArm.rotation.x += (-1.0 - rUpperArm.rotation.x) * 5 * dt;
          rElbow.rotation.x += (-1.5 - rElbow.rotation.x) * 5 * dt;
        } else if (emotion === 'action') {
          // Defensive / Active pose
          lUpperArm.rotation.z += (0.5 - lUpperArm.rotation.z) * 10 * dt;
          lUpperArm.rotation.x += (-1.2 - lUpperArm.rotation.x) * 10 * dt;
          lElbow.rotation.x += (-1.0 - lElbow.rotation.x) * 10 * dt;
          
          rUpperArm.rotation.z += (-0.5 - rUpperArm.rotation.z) * 10 * dt;
          rUpperArm.rotation.x += (-1.2 - rUpperArm.rotation.x) * 10 * dt;
          rElbow.rotation.x += (-1.0 - rElbow.rotation.x) * 10 * dt;
        }

        // Core pulsing
        core.rotation.y += dt;
        core.rotation.x += dt * 0.5;

        // Particles slow drift
        particles.rotation.y = t * 0.05;
        
        // Scroll lean
        scrollVel *= 0.9; // damp
        const tilt = scrollVel * 0.002;
        figure.rotation.z = tilt;
        
        renderer.render(scene, camera);
      }
      animate();

      window.addEventListener('resize', () => {
        const nw = container.offsetWidth, nh = container.offsetHeight;
        if (nw > 0 && nh > 0) { 
          renderer.setSize(nw, nh); 
          camera.aspect = nw/nh; 
          camera.updateProjectionMatrix(); 
        }
      });
    })();