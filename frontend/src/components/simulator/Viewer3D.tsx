"use client";

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Center, useTexture } from '@react-three/drei';
import { useSimulatorStore } from '@/store/useSimulatorStore';
import * as THREE from 'three';

const FALLBACK_TEXTURE_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";

function TShirtModel() {
  const { shirtColor, material, bakedFrontUrl, bakedBackUrl } = useSimulatorStore();

  const { scene } = useGLTF('/tshirt.glb');
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const frontActiveUrl = bakedFrontUrl || FALLBACK_TEXTURE_URL;
  const backActiveUrl = bakedBackUrl || FALLBACK_TEXTURE_URL;

  const frontTexture = useTexture(frontActiveUrl);
  const backTexture = useTexture(backActiveUrl);

  // Helper para preparar as texturas
  const setupTexture = (tex: THREE.Texture) => {
    if (!tex) return;

    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;

    // Restaurando a matemática mágica de UV! A malha realmente usa coordenadas globais!
    tex.repeat.set(1 / 512, 1 / 700);
    tex.offset.set(0.5, 0.57);

    tex.anisotropy = 16;
    tex.needsUpdate = true;
  };

  setupTexture(frontTexture);
  setupTexture(backTexture);

  const roughness = material === 'algodao' ? 1.0 : material === 'pv' ? 0.75 : 0.55;
  const metalness = material === 'algodao' ? 0.0 : material === 'pv' ? 0.1 : 0.2;

  useMemo(() => {
    clonedScene.traverse((child: THREE.Object3D) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        let mapToApply = null;
        let isArtMesh = false;
        let hasArt = false;

        // CORREÇÃO: Usar os nomes dos NODES do GLTF, e não das malhas internas!
        if (['Object_10', 'Object_11', 'Object_12'].includes(mesh.name)) {
          mapToApply = frontTexture;
          isArtMesh = true;
          hasArt = !!bakedFrontUrl;
        } else if (['Object_14', 'Object_15', 'Object_16'].includes(mesh.name)) {
          mapToApply = backTexture;
          isArtMesh = true;
          hasArt = !!bakedBackUrl;
        }

        // Apply texture
        mesh.material = new THREE.MeshStandardMaterial({
          color: hasArt ? '#ffffff' : shirtColor,
          map: isArtMesh ? (mapToApply || null) : null,
          roughness,
          metalness,
          transparent: true
        });
      }
    });
  }, [clonedScene, frontTexture, backTexture, bakedFrontUrl, bakedBackUrl, shirtColor, roughness, metalness]);

  return (
    <group dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload('/tshirt.glb');

export default function Viewer3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Soft dark vignette background underneath the canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111111] via-[#050505] to-black pointer-events-none" />

      <Canvas shadows camera={{ position: [0, 0, 3], fov: 45 }} className="relative z-10">
        <ambientLight intensity={0.25} />
        {/* Soft fill light from front */}
        <spotLight position={[5, 10, 5]} angle={0.2} penumbra={1} intensity={1.5} castShadow shadow-bias={-0.0001} />
        {/* Dramatic rim light from behind for silhouette */}
        <directionalLight position={[-8, 5, -8]} intensity={2.5} color="#ffffff" />
        {/* Key light for fabric details */}
        <directionalLight position={[8, 2, 5]} intensity={0.8} />

        <Environment preset="studio" environmentIntensity={0.65} />

        <Suspense fallback={null}>
          <Center position={[0, -0.2, 0]}>
            <TShirtModel />
          </Center>
        </Suspense>

        <ContactShadows position={[0, -1.2, 0]} opacity={0.85} scale={10} blur={2.5} color="#000000" far={4} />
        <OrbitControls
          enablePan={false}
          minDistance={1.0}
          maxDistance={3.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.7}
          target={[0, -0.15, 0]}
        />
      </Canvas>
    </div>
  );
}
