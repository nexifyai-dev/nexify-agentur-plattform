'use client';

import { useEffect, useRef } from 'react';

/**
 * 3D-Hero exakt nach Anhang "NeXify Homepage.dc.html":
 * Icosahedron-Wireframe (#C8FF00) + Crystal Core + Lime-Nodes + PointLight.
 * three wird als npm-Dependency geladen (stabil) statt CDN-importmap.
 */

export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raf = 0;
    let renderer: any;
    let resizeObserver: ResizeObserver | undefined;
    let pointerHandler: ((e: PointerEvent) => void) | undefined;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // WebGL-Verfügbarkeit prüfen — sonst Canvas sauber leer lassen (kein Crash)
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2') || probe.getContext('webgl');
        if (!gl) return;
      } catch {
        return;
      }

      const THREE = await import('three');
      const width = canvas.clientWidth || 520;
      const height = canvas.clientHeight || 520;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0, 6.2);

      const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      r.setSize(width, height, false);
      renderer = r;

      const group = new THREE.Group();

      const coreGeo = new THREE.IcosahedronGeometry(1.55, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x0d0d10,
        roughness: 0.25,
        metalness: 0.55,
        emissive: 0x2a3300,
        emissiveIntensity: 0.4,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      const wireGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.58, 1));
      const wireMat = new THREE.LineBasicMaterial({ color: 0xc8ff00, transparent: true, opacity: 0.85 });
      const wire = new THREE.LineSegments(wireGeo, wireMat);
      group.add(wire);

      const nodeGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xc8ff00 });
      const seenVerts = new Set<string>();
      const posAttr = (wireGeo as any).attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = posAttr.getZ(i);
        const key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
        if (seenVerts.has(key)) continue;
        seenVerts.add(key);
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(x, y, z);
        group.add(node);
      }

      scene.add(group);

      const ambient = new THREE.AmbientLight(0xffffff, 0.5);
      const key = new THREE.DirectionalLight(0xffffff, 1.1);
      key.position.set(3, 4, 5);
      const limeLight = new THREE.PointLight(0xc8ff00, 6, 12);
      limeLight.position.set(-2.5, -1.5, 2.5);
      scene.add(ambient, key, limeLight);

      const pointer = { x: 0, y: 0 };
      pointerHandler = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };
      window.addEventListener('pointermove', pointerHandler);

      const clock = new THREE.Clock();
      const animate = () => {
        const t = clock.getElapsedTime();
        group.rotation.y = t * 0.22 + pointer.x * 0.4;
        group.rotation.x = Math.sin(t * 0.3) * 0.15 + pointer.y * 0.3;
        limeLight.intensity = 5.5 + Math.sin(t * 2) * 1.2;
        r.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      resizeObserver = new ResizeObserver(() => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        r.setSize(w, h, false);
      });
      resizeObserver.observe(canvas);
    })();

    return () => {
      cancelAnimationFrame(raf);
      if (pointerHandler) window.removeEventListener('pointermove', pointerHandler);
      resizeObserver?.disconnect();
      if (renderer && typeof renderer.dispose === 'function') renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
