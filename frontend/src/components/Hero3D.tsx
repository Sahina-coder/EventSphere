import { useEffect, useRef } from "react";
import * as THREE from "three";

const Hero3D = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const icoGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, wireframe: true, transparent: true, opacity: 0.55 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    group.add(ico);

    const torusGeo = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.4 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 2.3;
    group.add(torus);

    const torus2 = new THREE.Mesh(torusGeo.clone(), new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0.3 }));
    torus2.rotation.x = Math.PI / 1.6;
    torus2.rotation.y = Math.PI / 4;
    group.add(torus2);

    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({ color: 0x99f6e4, size: 0.03, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      group.rotation.y += 0.0025;
      group.rotation.x += 0.0008;
      particles.rotation.y += 0.0006;

      camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" style={{ pointerEvents: "none" }} />;
};

export default Hero3D;