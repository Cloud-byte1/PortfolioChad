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
import { useThemeMode } from "@/lib/motion-hooks";

type CadCanvasProps = {
  src: string;
  format: CadModelFormat;
  autoRotate: boolean;
};

const palette = {
  light: { bg: "#f1f2f4", gridMajor: "#a9abb2", gridMinor: "#dcdde2", part: "#7a8b94", shadow: 0.28 },
  dark: { bg: "#17181b", gridMajor: "#4a4c52", gridMinor: "#2a2b2f", part: "#9aa8b0", shadow: 0.55 },
} as const;

function StlPart({ url, color }: { url: string; color: string }) {
  const geometry = useLoader(STLLoader, url);
  const colored = useMemo(() => {
    const g = geometry.clone();
    g.computeVertexNormals();
    g.center();
    return g;
  }, [geometry]);

  return (
    <mesh geometry={colored} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={0.82} roughness={0.32} />
    </mesh>
  );
}

function GltfPart({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} />;
}

function Model({
  src,
  format,
  color,
}: {
  src: string;
  format: CadModelFormat;
  color: string;
}) {
  return (
    <Center>
      {format === "stl" ? <StlPart url={src} color={color} /> : <GltfPart url={src} />}
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
      <meshStandardMaterial color="#8a8d94" wireframe />
    </mesh>
  );
}

export function CadCanvas({ src, format, autoRotate }: CadCanvasProps) {
  const colors = palette[useThemeMode()];
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [2.8, 1.8, 3.2], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-none"
    >
      <color attach="background" args={[colors.bg]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.3} />
      <Suspense fallback={<LoaderFallback />}>
        <Model key={src} src={src} format={format} color={colors.part} />
        <Environment preset="city" environmentIntensity={0.28} />
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={colors.shadow}
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
        key={colors.bg}
        args={[10, 20, colors.gridMajor, colors.gridMinor]}
        position={[0, -1.16, 0]}
      />
    </Canvas>
  );
}
