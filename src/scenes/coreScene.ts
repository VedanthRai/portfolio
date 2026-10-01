import { BufferAttribute, BufferGeometry, IcosahedronGeometry, ConeGeometry, CylinderGeometry, SphereGeometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Points, PointsMaterial, Scene, WebGLRenderer, Raycaster, Vector2 } from 'three';
import { prefersReducedMotion } from '../utils/dom';
import { sound } from '../utils/sound';

let wormholeActive = 0;
export function triggerWormhole() {
  wormholeActive = 1.0;
}

let jumpPhase = 0;
let jumpTimer = 0;
const getBaseZ = () => innerWidth < 640 ? 6.8 : 4.6;
export let targetZ = getBaseZ();
export function triggerProjectJump() {
  jumpPhase = 1;
  jumpTimer = 0;
  targetZ = getBaseZ();
}
export function resetZoom() {
  targetZ = getBaseZ();
}
let scanTimer = 0;
export function triggerSystemScan() {
  scanTimer = 1.0;
}
(window as any).triggerWormhole = triggerWormhole;
(window as any).triggerProjectJump = triggerProjectJump;
(window as any).resetZoom = resetZoom;
(window as any).triggerSystemScan = triggerSystemScan;

/**
 * Decorative V/CORE: wireframe icosahedron plus a particle field. Purely visual;
 * every piece of content it frames also exists as HTML. Throws if WebGL is missing
 * (the caller falls back to the plain 2D page).
 */
export function initCore(canvas: HTMLCanvasElement): void {
  const mobile = innerWidth < 640;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  // Use the actual device pixel ratio so it renders sharp on HiDPI/Retina screens.
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2.5));
  const scene = new Scene();
  const camera = new PerspectiveCamera(46, 1, 0.1, 100);
  camera.position.z = getBaseZ();  // Closer = more 3D presence and less depth-flatness
  const resize = () => {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    const base = getBaseZ();
    if (targetZ < base) targetZ = base;
    camera.updateProjectionMatrix();
  };
  resize();
  addEventListener('resize', resize);

  // Outer wireframe — more detail (detail 3 = 320 triangles, looks like a real sphere)
  const core = new Mesh(
    new IcosahedronGeometry(1.15, 3),
    new MeshBasicMaterial({ color: 0x8ccbff, wireframe: true, transparent: true, opacity: mobile ? 0.55 : 0.65 }),
  );
  scene.add(core);

  // Inner dim shell — gives depth and the illusion of volume
  const inner = new Mesh(
    new IcosahedronGeometry(0.82, 3),
    new MeshBasicMaterial({ color: 0x2a6fa8, wireframe: true, transparent: true, opacity: 0.18 }),
  );
  scene.add(inner);

  const count = mobile ? 350 : 1100;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const d = 2 + Math.random() * 4, t = Math.random() * Math.PI * 2, u = Math.acos(2 * Math.random() - 1);
    pos.set([d * Math.sin(u) * Math.cos(t), d * Math.sin(u) * Math.sin(t) * 0.6, d * Math.cos(u)], i * 3);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  const stars = new Points(geo, new PointsMaterial({ size: mobile ? 0.025 : 0.018, color: 0xffffff, transparent: true, opacity: 0.65 }));
  scene.add(stars);

  // Distant Project Orbital Stations
  const worlds = new Group();
  const worldGeo = new IcosahedronGeometry(1.2, 2);
  const worldPositions = [
    { id: 'codeoracle', x: -14, y: 5, z: -10 },
    { id: 'agroshield', x: 16, y: -4, z: -12 },
    { id: 'csr', x: 0, y: 18, z: -20 },
    { id: 'drishti', x: -10, y: -15, z: -8 },
    { id: 'docksmith', x: 12, y: 12, z: -15 },
    { id: 'skillbarter', x: -16, y: -8, z: -14 },
    { id: 'robot', x: 8, y: -18, z: -12 }
  ];
  worldPositions.forEach(p => {
    const worldGroup = new Group();
    worldGroup.position.set(p.x, p.y, p.z);
    
    const world = new Mesh(worldGeo, new MeshBasicMaterial({ color: 0x8ccbff, wireframe: true, transparent: true, opacity: 0.25 }));
    worldGroup.add(world);
    
    // Inner core
    const wInner = new Mesh(new IcosahedronGeometry(0.7, 2), new MeshBasicMaterial({ color: 0xffb27a, wireframe: true, transparent: true, opacity: 0.15 }));
    worldGroup.add(wInner);

    // Docking Arm Port (║)
    const dockPort = new Mesh(
      new CylinderGeometry(0.08, 0.08, 0.6, 6),
      new MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.7 })
    );
    dockPort.position.set(0, 1.3, 0);
    worldGroup.add(dockPort);
    
    worlds.add(worldGroup);
  });
  scene.add(worlds);

  // Orbiting spaceships/satellites
  const ships = new Group();
  const shipGeo = new ConeGeometry(0.03, 0.12, 3);
  shipGeo.rotateX(Math.PI / 2); // point forward
  const shipMat = new MeshBasicMaterial({ color: 0xffb27a, wireframe: true, transparent: true, opacity: 0.75 });
  
  for (let i = 0; i < 6; i++) {
    const ship = new Mesh(shipGeo, shipMat);
    const radius = 1.4 + Math.random() * 0.8;
    ship.position.set(radius, 0, 0);
    
    // create a pivot for each ship to orbit independently
    const pivot = new Group();
    pivot.rotation.x = Math.random() * Math.PI * 2;
    pivot.rotation.y = Math.random() * Math.PI * 2;
    pivot.userData.speed = 0.002 + Math.random() * 0.004;
    
    pivot.add(ship);
    ships.add(pivot);
  }
  scene.add(ships);

  // High-detail Wireframe Spaceship with flickering fire exhaust
  const bigRocket = new Group();
  
  const hullMat = new MeshBasicMaterial({ color: 0x8ccbff, wireframe: true, transparent: true, opacity: 0.8 });
  const fireMat = new MeshBasicMaterial({ color: 0xff5500, wireframe: true, transparent: true, opacity: 0.9 });
  
  const body = new Mesh(new CylinderGeometry(0.04, 0.05, 0.4, 6), hullMat);
  body.rotation.z = -Math.PI / 2;
  bigRocket.add(body);
  
  const nose = new Mesh(new ConeGeometry(0.04, 0.15, 6), hullMat);
  nose.position.x = 0.275;
  nose.rotation.z = -Math.PI / 2;
  bigRocket.add(nose);
  
  const fin1 = new Mesh(new ConeGeometry(0.08, 0.15, 3), hullMat);
  fin1.position.set(-0.1, 0.08, 0);
  fin1.rotation.z = -Math.PI / 2;
  bigRocket.add(fin1);
  
  const fin2 = new Mesh(new ConeGeometry(0.08, 0.15, 3), hullMat);
  fin2.position.set(-0.1, -0.08, 0);
  fin2.rotation.z = -Math.PI / 2;
  fin2.rotation.x = Math.PI;
  bigRocket.add(fin2);
  
  // The fire exhaust attached to the back of the rocket
  const fire = new Mesh(new ConeGeometry(0.03, 0.3, 5), fireMat);
  fire.position.x = -0.35;
  fire.rotation.z = Math.PI / 2;
  bigRocket.add(fire);
  
  // Enlarged solid hitbox (transparent opacity 0.001) so Raycaster intersects clicks 100% of the time
  const hitbox = new Mesh(
    new SphereGeometry(0.6, 8, 8),
    new MeshBasicMaterial({ transparent: true, opacity: 0.001, depthWrite: false })
  );
  bigRocket.add(hitbox);
  
  bigRocket.position.set(-8, 1.5, -4);
  scene.add(bigRocket);

  const applyRedAlert = () => {
    const red = 0xff3300;
    (core.material as MeshBasicMaterial).color.setHex(red);
    (inner.material as MeshBasicMaterial).color.setHex(0x660000);
    (stars.material as PointsMaterial).color.setHex(red);
    hullMat.color.setHex(red);

    worlds.children.forEach(wGroup => {
      wGroup.children.forEach(mesh => {
        if ((mesh as Mesh).material) {
          ((mesh as Mesh).material as MeshBasicMaterial).color.setHex(red);
        }
      });
    });

    ships.children.forEach(pivot => {
      pivot.children.forEach(s => {
        if ((s as Mesh).material) {
          ((s as Mesh).material as MeshBasicMaterial).color.setHex(red);
        }
      });
    });
  };

  let isAnomalyTriggered = false;
  
  if (isAnomalyTriggered) {
    applyRedAlert();
  }

  let mx = 0, my = 0;
  const raycaster = new Raycaster();
  const mouse = new Vector2();

  addEventListener('pointermove', (e) => {
    mx = e.clientX / innerWidth - 0.5;
    my = e.clientY / innerHeight - 0.5;

    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(bigRocket, true);
    if (intersects.length > 0) {
      document.body.style.cursor = 'pointer';
    } else if (document.body.style.cursor === 'pointer') {
      document.body.style.cursor = '';
    }
  });

  window.addEventListener('wheel', (e) => {
    if (!document.body.classList.contains('rec') && !document.body.classList.contains('ov-open')) {
      // Allow bidirectional zooming in/out
      targetZ += e.deltaY * 0.015;
      targetZ = Math.max(getBaseZ(), Math.min(targetZ, 35)); // max zoom out is 35
    }
  }, { passive: true });
  
  window.addEventListener('click', (e) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(bigRocket, true);
    if (intersects.length > 0) {
      if (!isAnomalyTriggered) {
        isAnomalyTriggered = true;
        applyRedAlert();
        sound.beep(240, 0.3);
        sound.beep(480, 0.4);
        
        // Show Anomaly Popup
        const anomalyPopup = document.getElementById('anomaly-popup');
        if (anomalyPopup) {
          anomalyPopup.style.display = 'block';
        }
      }
    }
  });

  const frame = () => {
    // Skip all GPU work while the tab is hidden or Recruiter Mode covers the scene.
    if (!document.hidden && !document.body.classList.contains('rec')) {
      if (!prefersReducedMotion()) {
        if (scanTimer > 0.01) {
          scanTimer *= 0.96;
          core.rotation.y += 0.08 * scanTimer;
          core.rotation.x += 0.04 * scanTimer;
          inner.rotation.y -= 0.06 * scanTimer;
          (core.material as MeshBasicMaterial).color.setHex(0x00ffff);
          (inner.material as MeshBasicMaterial).color.setHex(0x0088cc);
        } else if (scanTimer > 0) {
          scanTimer = 0;
          if (isAnomalyTriggered) {
            applyRedAlert();
          } else {
            (core.material as MeshBasicMaterial).color.setHex(0x8ccbff);
            (inner.material as MeshBasicMaterial).color.setHex(0x2a6fa8);
          }
        } else {
          core.rotation.y += 0.004; core.rotation.x += 0.0015;
          inner.rotation.y -= 0.003; inner.rotation.z += 0.001;  // contra-rotate inner shell for depth
        }
        stars.rotation.y += 0.0006;
        
        worlds.children.forEach(w => {
           w.rotation.y += 0.002;
           w.rotation.x += 0.001;
        });

        ships.children.forEach(pivot => {
          pivot.rotation.y += pivot.userData.speed;
        });
        
        // High and low flickering fire effect
        fire.scale.y = 0.5 + Math.random() * 1.5;
        fire.material.opacity = 0.5 + Math.random() * 0.5;
        
      }
      if (jumpPhase === 0) {
        // Normal patrol
        bigRocket.position.x += 0.01;
        if (bigRocket.position.x > 8) {
           bigRocket.position.x = -8;
           bigRocket.position.y = (Math.random() - 0.5) * 4;
        }
        bigRocket.rotation.y += (0 - bigRocket.rotation.y) * 0.1;
      } else if (jumpPhase === 1) {
        // Maneuver to center, aim away from camera
        jumpTimer += 0.02;
        bigRocket.position.x += (0 - bigRocket.position.x) * 0.1;
        bigRocket.position.y += (-0.5 - bigRocket.position.y) * 0.1;
        bigRocket.position.z += (3 - bigRocket.position.z) * 0.1;
        bigRocket.rotation.y += (Math.PI / 2 - bigRocket.rotation.y) * 0.1;
        
        if (jumpTimer > 1) {
           jumpPhase = 2;
           wormholeActive = 1.0;
        }
      } else if (jumpPhase === 2) {
        // Blast off into the wormhole
        bigRocket.position.z -= 1.2;
        fire.scale.y = 4 + Math.random() * 3;
        if (bigRocket.position.z < -100) {
           jumpPhase = 3;
        }
      } else if (jumpPhase === 3) {
        // Reset
        bigRocket.position.set(-8, 1.5, -4);
        bigRocket.rotation.y = 0;
        jumpPhase = 0;
      }
      
      if (wormholeActive > 0.01) {
        wormholeActive *= 0.85;
        camera.fov = 46 + wormholeActive * 80;
        camera.updateProjectionMatrix();
        stars.scale.z = 1 + wormholeActive * 20; // stretch stars into lines
      } else if (wormholeActive > 0) {
        wormholeActive = 0;
        camera.fov = 46;
        camera.updateProjectionMatrix();
        stars.scale.z = 1;
      }
      
      // Apply zoom out distance
      camera.position.z += (targetZ - camera.position.z) * 0.05;

      camera.position.x += (mx * 0.8 - camera.position.x) * 0.03;
      camera.position.y += (-my * 0.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);
  };
  frame();
}
