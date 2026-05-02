import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    camera.position.z = 5;

    // Animated particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 120;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 12;
      posArray[i + 1] = (Math.random() - 0.5) * 12;
      posArray[i + 2] = (Math.random() - 0.5) * 12;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.09,
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Rotating geometric shapes with animated color
    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 4),
      new THREE.OctahedronGeometry(1, 2),
      new THREE.TetrahedronGeometry(0.9, 0),
    ];
    const colors = [0x667eea, 0x764ba2, 0xf093fb];
    const materials = colors.map(
      (color) =>
        new THREE.MeshPhongMaterial({
          color,
          wireframe: true,
          transparent: true,
          opacity: 0.18,
        })
    );
    const shapes = geometries.map((geometry, index) => {
      const mesh = new THREE.Mesh(geometry, materials[index]);
      mesh.position.x = (index - 1) * 2.5;
      mesh.position.z = -3;
      scene.add(mesh);
      return mesh;
    });

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // Responsive
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    let hue = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      // Animate particles
      particles.rotation.x += 0.0002;
      particles.rotation.y += 0.0002;
      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.002 * (index + 1);
        shape.rotation.y += 0.003 * (index + 1);
        shape.position.y = Math.sin(Date.now() * 0.0005 + index) * 0.5;
        // Animate color
        hue = (hue + 0.02) % 360;
        (shape.material as THREE.MeshPhongMaterial).color.setHSL((hue + index * 60) / 360, 0.5, 0.6);
      });
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  // Accessibility: aria-hidden, role presentation
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      role="presentation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        opacity: 0.38,
        pointerEvents: "none",
      }}
    />
  );
}
