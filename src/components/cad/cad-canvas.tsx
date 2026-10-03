"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import {
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { CadModelFormat } from "@/data/models";

type CadCanvasProps = {
  src: string;
  format: CadModelFormat;
  autoRotate: boolean;
};

function StlPart({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);
  const colored = useMemo(() => {
    const g = geometry.clone();
    g.computeVertexNormals();
    g.center();
    return g;
  }, [geometry]);

  return (
    <mesh geometry={colored} castShadow receiveShadow>
      <meshStandardMaterial color="#7a8b94" metalness={0.82} roughness={0.32} />
    </mesh>
  );
}

function GltfPart({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} />;
}

function Model({ src, format }: { src: string; format: CadModelFormat }) {
  return (
    <Center>
      {format === "stl" ? <StlPart url={src} /> : <GltfPart url={src} />}
    </Center>
  );
}

function FitCamera({ src }: { src: string }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(2.8, 1.8, 3.2);
    camera.lookAt(0, 0, 0);
  }, [camera, src]);
  return null;
}

function LoaderFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#52525b" wireframe />
    </mesh>
  );
}

export function CadCanvas({ src, format, autoRotate }: CadCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [2.8, 1.8, 3.2], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-none"
    >
      <color attach="background" args={["#f4f4f5"]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.3} />
      <Suspense fallback={<LoaderFallback />}>
        <Model key={src} src={src} format={format} />
        <Environment preset="city" environmentIntensity={0.28} />
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.28}
          scale={12}
          blur={2.4}
          far={4}
        />
      </Suspense>
      <FitCamera src={src} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate}
        autoRotateSpeed={1.1}
        minDistance={1.2}
        maxDistance={14}
        target={[0, 0, 0]}
      />
      <gridHelper
        args={[10, 20, "#b0b0b4", "#e4e4e7"]}
        position={[0, -1.16, 0]}
      />
    </Canvas>
  );
}
