/* ─── sections3d.js ─── Per-section Three.js scenes ─── */
(function () {

  /* ══════ UTILITY ══════ */
  function makeRenderer(canvas, alpha) {
    if (!canvas) return null;
    const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: !!alpha });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.setClearColor(0x000000, 0);
    return r;
  }

  /* ══════════════════════════════════
     ABOUT SECTION — Wormhole ring field
  ══════════════════════════════════ */
  (function aboutScene() {
    const canvas = document.getElementById('about-canvas');
    if (!canvas) return;
    const W = canvas.parentElement.offsetWidth, H = canvas.parentElement.offsetHeight || 700;
    const renderer = makeRenderer(canvas, true);
    renderer.setSize(W, H);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 100);
    camera.position.z = 5;

    /* Torus ring field */
    const rings = [];
    for (let i = 0; i < 12; i++) {
      const geo = new THREE.TorusGeometry(1.5 + i * 0.5, 0.015, 8, 80);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? 0xb8ff3c : i % 3 === 1 ? 0x00f5d4 : 0x7c3aed,
        transparent: true, opacity: 0.15 - i * 0.008
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      ring.userData.rx = (Math.random() - 0.5) * 0.008;
      ring.userData.ry = (Math.random() - 0.5) * 0.006;
      scene.add(ring); rings.push(ring);
    }

    /* Star particles */
    const sCnt = 500, sPos = new Float32Array(sCnt * 3);
    for (let i = 0; i < sCnt; i++) {
      sPos[i*3]   = (Math.random() - 0.5) * 30;
      sPos[i*3+1] = (Math.random() - 0.5) * 20;
      sPos[i*3+2] = (Math.random() - 0.5) * 10;
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0x4a5568, size: 0.04 })));

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      rings.forEach((r, i) => {
        r.rotation.x += r.userData.rx;
        r.rotation.y += r.userData.ry;
        r.material.opacity = (0.08 + Math.sin(t * 0.5 + i * 0.5) * 0.05);
      });
      renderer.render(scene, camera);
    }
    animate();
  })();

  /* ══════════════════════════════════
     SKILLS SECTION — Plasma sphere
  ══════════════════════════════════ */
  (function skillsScene() {
    const canvas = document.getElementById('skills-canvas');
    if (!canvas) return;
    const W = canvas.parentElement.offsetWidth, H = canvas.parentElement.offsetHeight || 700;
    const renderer = makeRenderer(canvas, true);
    renderer.setSize(W, H);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 6;

    /* Wireframe icosphere orbiting in background */
    const icoGeo = new THREE.IcosahedronGeometry(3, 2);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0xb8ff3c, wireframe: true, transparent: true, opacity: 0.04 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    scene.add(ico);

    /* Floating skill orbs */
    const orbData = [
      { col: 0xb8ff3c, pos: [-5, 2, -2], r: 0.4 },
      { col: 0x00f5d4, pos: [5, -1, -3], r: 0.35 },
      { col: 0xff2d78, pos: [-6, -2, -1], r: 0.3 },
      { col: 0x7c3aed, pos: [6, 3, -4], r: 0.45 },
    ];
    const orbs = orbData.map(({ col, pos, r }) => {
      const geo = new THREE.SphereGeometry(r, 32, 32);
      const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.4, roughness: 0.1, metalness: 0.9 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.userData.origPos = [...pos];
      scene.add(mesh);
      const light = new THREE.PointLight(col, 1.5, 8);
      light.position.set(...pos);
      scene.add(light);
      mesh.userData.light = light;
      return mesh;
    });

    scene.add(new THREE.AmbientLight(0xffffff, 0.05));

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      ico.rotation.x = t * 0.05; ico.rotation.y = t * 0.08;
      orbs.forEach((orb, i) => {
        const op = orb.userData.origPos;
        orb.position.y = op[1] + Math.sin(t * 0.6 + i * 1.5) * 0.8;
        orb.position.x = op[0] + Math.cos(t * 0.4 + i) * 0.4;
        orb.material.emissiveIntensity = 0.3 + Math.sin(t + i) * 0.2;
        orb.userData.light.position.copy(orb.position);
      });
      renderer.render(scene, camera);
    }
    animate();
  })();

  /* ══════════════════════════════════
     PROJECTS SECTION — Galaxy spiral
  ══════════════════════════════════ */
  (function projectsScene() {
    const canvas = document.getElementById('projects-canvas');
    if (!canvas) return;
    const W = canvas.parentElement.offsetWidth, H = canvas.parentElement.offsetHeight || 900;
    const renderer = makeRenderer(canvas, true);
    renderer.setSize(W, H);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.set(0, 8, 0);
    camera.lookAt(0, 0, 0);

    /* Spiral galaxy particles */
    const ARMS = 3, PPS = 800;
    const gPos = new Float32Array(ARMS * PPS * 3);
    const gCol = new Float32Array(ARMS * PPS * 3);
    const armColors = [new THREE.Color(0xb8ff3c), new THREE.Color(0x00f5d4), new THREE.Color(0xff2d78)];
    for (let a = 0; a < ARMS; a++) {
      const baseAngle = (a / ARMS) * Math.PI * 2;
      for (let p = 0; p < PPS; p++) {
        const idx = (a * PPS + p) * 3;
        const r = (p / PPS) * 20;
        const angle = baseAngle + (p / PPS) * Math.PI * 4;
        const scatter = (Math.random() - 0.5) * (r * 0.15);
        gPos[idx]   = Math.cos(angle) * r + scatter;
        gPos[idx+1] = (Math.random() - 0.5) * 0.5;
        gPos[idx+2] = Math.sin(angle) * r + scatter;
        const c = armColors[a];
        const fade = 1 - p / PPS;
        gCol[idx] = c.r * fade; gCol[idx+1] = c.g * fade; gCol[idx+2] = c.b * fade;
      }
    }
    const gGeo = new THREE.BufferGeometry();
    gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3));
    gGeo.setAttribute('color',    new THREE.BufferAttribute(gCol, 3));
    const galaxy = new THREE.Points(gGeo, new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.6 }));
    scene.add(galaxy);

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      galaxy.rotation.y = t * 0.05;
      renderer.render(scene, camera);
    }
    animate();
  })();

  /* ══════════════════════════════════
     CONTACT SECTION — Electric wormhole
  ══════════════════════════════════ */
  (function contactScene() {
    const canvas = document.getElementById('contact-canvas');
    if (!canvas) return;
    const W = canvas.parentElement.offsetWidth, H = canvas.parentElement.offsetHeight || 700;
    const renderer = makeRenderer(canvas, true);
    renderer.setSize(W, H);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(80, W / H, 0.1, 100);
    camera.position.z = 5;

    /* Wormhole rings */
    const wRings = [];
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.TorusGeometry(0.5 + i * 0.3, 0.02, 8, 60);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xb8ff3c : 0x00f5d4,
        transparent: true, opacity: 0.3 - i * 0.012
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.position.z = -i * 0.6;
      ring.userData.idx = i;
      scene.add(ring); wRings.push(ring);
    }

    /* Center glow sphere */
    const glowGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const glowMat = new THREE.MeshStandardMaterial({ color: 0xb8ff3c, emissive: 0xb8ff3c, emissiveIntensity: 0.8, roughness: 0.1 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);
    scene.add(new THREE.PointLight(0xb8ff3c, 3, 10));

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      wRings.forEach((r, i) => {
        r.rotation.z = t * (0.2 + i * 0.02);
        r.rotation.x = Math.sin(t * 0.3 + i) * 0.3;
        r.material.opacity = (0.2 - i * 0.008) * (0.6 + Math.sin(t * 2 + i) * 0.4);
      });
      glow.material.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.4;
      glow.scale.setScalar(1 + Math.sin(t * 3) * 0.1);
      renderer.render(scene, camera);
    }
    animate();
  })();

  /* ══════════════════════════════════
     PROJECT MINI CANVASES
  ══════════════════════════════════ */
  document.querySelectorAll('.project-mini-canvas').forEach((canvas) => {
    const scene = canvas.dataset.scene;
    const W = canvas.offsetWidth || 400, H = canvas.offsetHeight || 250;
    const renderer = makeRenderer(canvas, true);
    renderer.setSize(W, H);
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, W / H, 0.1, 50);
    cam.position.z = 4;

    sc.add(new THREE.AmbientLight(0xffffff, 0.1));
    const pl = new THREE.PointLight(0xb8ff3c, 3, 15);
    pl.position.set(2, 2, 2);
    sc.add(pl);

    let mesh;
    if (scene === 'queue') {
      /* Queue orb cluster */
      const group = new THREE.Group();
      for (let i = 0; i < 6; i++) {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xb8ff3c, emissive: 0x2a4000, roughness: 0.2, metalness: 0.8 })
        );
        const angle = (i / 6) * Math.PI * 2;
        m.position.set(Math.cos(angle) * 1.5, Math.sin(i * 0.5) * 0.5, Math.sin(angle) * 1.5);
        group.add(m);
      }
      group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 1), new THREE.MeshStandardMaterial({ color: 0x00f5d4, roughness: 0.1, metalness: 0.9 })));
      sc.add(group); mesh = group;
      pl.color.set(0xb8ff3c);
    } else if (scene === 'skill') {
      /* SkillSwap connected nodes */
      const group = new THREE.Group();
      const nodes = [];
      for (let i = 0; i < 5; i++) {
        const m = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.35, 0),
          new THREE.MeshStandardMaterial({ color: 0xff2d78, emissive: 0x4a0020, roughness: 0.2, metalness: 0.8 })
        );
        const angle = (i / 5) * Math.PI * 2;
        m.position.set(Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6);
        group.add(m); nodes.push(m.position);
      }
      sc.add(group); mesh = group;
      pl.color.set(0xff2d78);
    } else if (scene === 'auth') {
      /* Auth shield */
      const group = new THREE.Group();
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.2, 0.08, 16, 80),
        new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x2a1060, roughness: 0.1, metalness: 1 })
      );
      const core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.7, 1),
        new THREE.MeshStandardMaterial({ color: 0xb8ff3c, roughness: 0.1, metalness: 0.9 })
      );
      group.add(ring, core);
      sc.add(group); mesh = group;
      pl.color.set(0x7c3aed);
    }

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (mesh) {
        mesh.rotation.y = t * 0.5;
        mesh.rotation.x = Math.sin(t * 0.3) * 0.2;
      }
      pl.intensity = 2.5 + Math.sin(t * 2) * 0.8;
      renderer.render(sc, cam);
    }
    animate();
  });

})();
