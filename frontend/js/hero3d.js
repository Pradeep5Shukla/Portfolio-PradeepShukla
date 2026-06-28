/* ─── hero3d.js ─── Three.js Hero Scene: Morphing DNA Helix + Particle Storm ─── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 14);

  /* ── LIGHTS ── */
  scene.add(new THREE.AmbientLight(0xffffff, 0.1));
  const limeLight = new THREE.PointLight(0xb8ff3c, 3, 30);
  limeLight.position.set(-5, 5, 5);
  scene.add(limeLight);
  const aquaLight = new THREE.PointLight(0x00f5d4, 2, 30);
  aquaLight.position.set(5, -5, 3);
  scene.add(aquaLight);
  const magLight = new THREE.PointLight(0xff2d78, 1.5, 20);
  magLight.position.set(0, 8, -5);
  scene.add(magLight);

  /* ── DNA HELIX ── */
  const helixGroup = new THREE.Group();
  scene.add(helixGroup);
  helixGroup.position.x = 4;

  const strandMat1 = new THREE.MeshStandardMaterial({ color: 0xb8ff3c, emissive: 0x3a5c00, roughness: 0.2, metalness: 0.8 });
  const strandMat2 = new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x004a43, roughness: 0.2, metalness: 0.8 });
  const barMat    = new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x2d1470, roughness: 0.3, metalness: 0.6, transparent: true, opacity: 0.7 });

  const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
  const nodes1 = [], nodes2 = [], bars = [];
  const TURNS = 5, PTS = 40;

  for (let i = 0; i < PTS; i++) {
    const t = (i / PTS) * TURNS * Math.PI * 2;
    const y = (i / PTS) * 16 - 8;
    const r = 1.8;

    const m1 = new THREE.Mesh(sphereGeo, strandMat1.clone());
    m1.position.set(Math.cos(t) * r, y, Math.sin(t) * r);
    helixGroup.add(m1); nodes1.push(m1);

    const m2 = new THREE.Mesh(sphereGeo, strandMat2.clone());
    m2.position.set(Math.cos(t + Math.PI) * r, y, Math.sin(t + Math.PI) * r);
    helixGroup.add(m2); nodes2.push(m2);

    if (i % 4 === 0) {
      const barGeo = new THREE.CylinderGeometry(0.04, 0.04, r * 2, 8);
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set(0, y, 0);
      bar.lookAt(m1.position.x, y, m1.position.z);
      bar.rotateX(Math.PI / 2);
      helixGroup.add(bar); bars.push(bar);
    }
  }

  /* ── TUBE ALONG HELIX STRANDS ── */
  function makeHelixCurve(offset) {
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const t = (i / 80) * TURNS * Math.PI * 2;
      const y = (i / 80) * 16 - 8;
      pts.push(new THREE.Vector3(Math.cos(t + offset) * 1.8, y, Math.sin(t + offset) * 1.8));
    }
    return new THREE.CatmullRomCurve3(pts);
  }
  const tube1 = new THREE.Mesh(
    new THREE.TubeGeometry(makeHelixCurve(0), 120, 0.04, 8, false),
    new THREE.MeshStandardMaterial({ color: 0xb8ff3c, emissive: 0x2a4000, roughness: 0.1, metalness: 1 })
  );
  const tube2 = new THREE.Mesh(
    new THREE.TubeGeometry(makeHelixCurve(Math.PI), 120, 0.04, 8, false),
    new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x003d38, roughness: 0.1, metalness: 1 })
  );
  helixGroup.add(tube1, tube2);

  /* ── FLOATING GEOMETRY CLUSTER ── */
  const geoGroup = new THREE.Group();
  scene.add(geoGroup);
  geoGroup.position.set(-5, 0, 0);

  const geoItems = [
    { geo: new THREE.IcosahedronGeometry(1.2, 1), col: 0xb8ff3c, pos: [0, 0, 0], speed: 0.4 },
    { geo: new THREE.OctahedronGeometry(0.7, 0),   col: 0xff2d78, pos: [2.5, 1.5, -1], speed: 0.6 },
    { geo: new THREE.TetrahedronGeometry(0.6, 0),  col: 0x00f5d4, pos: [-2, -1.5, 1], speed: 0.5 },
    { geo: new THREE.TorusGeometry(0.8, 0.2, 16, 40), col: 0x7c3aed, pos: [0, -2.5, -2], speed: 0.3 },
  ];
  geoItems.forEach(({ geo, col, pos, speed }) => {
    const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.15, metalness: 0.9, wireframe: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.userData.speed = speed;
    mesh.userData.origPos = [...pos];
    geoGroup.add(mesh);

    /* Wireframe overlay */
    const wf = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, wireframe: true, opacity: 0.15, transparent: true }));
    wf.position.set(...pos);
    geoGroup.add(wf);
    mesh.userData.wf = wf;
  });

  /* ── PARTICLE FIELD ── */
  const PARTICLE_COUNT = 2000;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const pColors   = new Float32Array(PARTICLE_COUNT * 3);
  const palette   = [
    new THREE.Color(0xb8ff3c),
    new THREE.Color(0x00f5d4),
    new THREE.Color(0x7c3aed),
    new THREE.Color(0xff2d78),
    new THREE.Color(0x4a90d9),
  ];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i*3]   = (Math.random() - 0.5) * 50;
    positions[i*3+1] = (Math.random() - 0.5) * 30;
    positions[i*3+2] = (Math.random() - 0.5) * 20 - 5;
    const c = palette[Math.floor(Math.random() * palette.length)];
    pColors[i*3] = c.r; pColors[i*3+1] = c.g; pColors[i*3+2] = c.b;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pColors, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.7 }));
  scene.add(particles);

  /* ── GRID PLANE ── */
  const gridHelper = new THREE.GridHelper(60, 40, 0x1a2a1a, 0x0d1a0d);
  gridHelper.position.y = -9;
  scene.add(gridHelper);

  /* ── MOUSE PARALLAX ── */
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── SCROLL ── */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  /* ── RESIZE ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── ANIMATE ── */
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    /* Helix spin + float */
    helixGroup.rotation.y = t * 0.25;
    helixGroup.position.y = Math.sin(t * 0.5) * 0.4;

    /* Nodes pulse */
    nodes1.forEach((n, i) => { const s = 1 + Math.sin(t * 2 + i * 0.3) * 0.15; n.scale.setScalar(s); });
    nodes2.forEach((n, i) => { const s = 1 + Math.cos(t * 2 + i * 0.3) * 0.15; n.scale.setScalar(s); });

    /* Floating geos */
    geoGroup.children.forEach((mesh) => {
      if (!mesh.userData.speed) return;
      const sp = mesh.userData.speed;
      const op = mesh.userData.origPos;
      mesh.rotation.x += sp * 0.008;
      mesh.rotation.y += sp * 0.012;
      mesh.position.y = op[1] + Math.sin(t * sp + op[0]) * 0.5;
      if (mesh.userData.wf) {
        mesh.userData.wf.rotation.copy(mesh.rotation);
        mesh.userData.wf.position.copy(mesh.position);
      }
    });

    /* Particle drift */
    const posArr = pGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArr[i*3+1] += 0.008;
      if (posArr[i*3+1] > 15) posArr[i*3+1] = -15;
    }
    pGeo.attributes.position.needsUpdate = true;

    /* Camera parallax */
    camera.position.x += (mx * 2 - camera.position.x) * 0.04;
    camera.position.y += (-my * 1.5 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    /* Lights pulse */
    limeLight.intensity = 2.5 + Math.sin(t * 1.5) * 0.8;
    aquaLight.intensity = 2 + Math.cos(t * 1.2) * 0.6;

    renderer.render(scene, camera);
  }
  animate();
})();
