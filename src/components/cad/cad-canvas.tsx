"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { Box3, Mesh, Vector3, type Group, type Material, type MeshStandardMaterial } from "three";
import type { CadModelFormat } from "@/data/models";
import { useThemeMode } from "@/lib/motion-hooks";

type CadCanvasProps = {
  src: string;
  format: CadModelFormat;
  autoRotate: boolean;
  /** Material names to fade out so the inside of the model shows. */
  ghost?: string[];
};

const FLOOR = -1.15;
const TARGET: [number, number, number] = [0, -0.35, 0];

const palette = {
  light: { bg: "#f1f2f4", gridMajor: "#a9abb2", gridMinor: "#dcdde2", part: "#7a8b94", shadow: 0.28 },
  dark: { bg: "#17181b", gridMajor: "#4a4c52", gridMinor: "#2a2b2f", part: "#9aa8b0", shadow: 0.55 },
} as const;

function StlPart({ url, color }: { url: string; color: string }) {
  const geometry = useLoader(STLLoader, url);
  const shaded = useMemo(() => {
    const g = geometry.clone();
    g.computeVertexNormals();
    return g;
  }, [geometry]);

  return (
    <mesh geometry={shaded} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={0.82} roughness={0.32} />
    </mesh>
  );
}

function GltfPart({ url, ghost }: { url: string; ghost?: string[] }) {
  const { scene } = useGLTF(url);
  // Own copy of the scene and its materials so fading never touches the cache.
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = (child.material as Material).clone();
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return copy;
  }, [scene]);

  useEffect(() => {
    model.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      const material = child.material as MeshStandardMaterial;
      const original = material.userData.original as { opacity: number; transparent: boolean } | undefined;
      if (!original) material.userData.original = { opacity: material.opacity, transparent: material.transparent };
      const base = material.userData.original as { opacity: number; transparent: boolean };
      const faded = ghost?.includes(material.name) ?? false;
      material.transparent = faded || base.transparent;
      material.opacity = faded ? 0.14 : base.opacity;
      material.depthWrite = !faded && !base.transparent;
      material.needsUpdate = true;
    });
  }, [model, ghost]);

  return <primitive object={model} />;
}

/** Centers its content over the origin and sets it down on the floor grid. */
function OnFloor({ children }: { children: ReactNode }) {
  const ref = useRef<Group>(null);
  useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;
    group.position.set(0, 0, 0);
    group.updateMatrixWorld(true);
    const box = new Box3().setFromObject(group);
    const center = box.getCenter(new Vector3());
    group.position.set(-center.x, FLOOR - box.min.y, -center.z);
  }, []);
  return <group ref={ref}>{children}</group>;
}

function Model({
  src,
  format,
  color,
  ghost,
}: {
  src: string;
  format: CadModelFormat;
  color: string;
  ghost?: string[];
}) {
  return (
    <OnFloor>
      {format === "stl" ? <StlPart url={src} color={color} /> : <GltfPart url={src} ghost={ghost} />}
    </OnFloor>
  );
}

/** Frames the model, backing off on tall, narrow viewports so it still fits. */
function FitCamera({ src }: { src: string }) {
  const { camera, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  useEffect(() => {
    const back = Math.max(1, 1.45 / aspect);
    camera.position.set(TARGET[0] + 2.8 * back, TARGET[1] + 1.85 * back, TARGET[2] + 3.2 * back);
    camera.lookAt(...TARGET);
  }, [camera, src, aspect]);
  return null;
}

function LoaderFallback() {
  return (
    <mesh position={[0, FLOOR + 0.3, 0]}>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#8a8d94" wireframe />
    </mesh>
  );
}

export function CadCanvas({ src, format, autoRotate, ghost }: CadCanvasProps) {
  const colors = palette[useThemeMode()];
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [2.8, 1.5, 3.2], fov: 42, near: 0.05, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full touch-none"
    >
      <color attach="background" args={[colors.bg]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -3]} intensity={0.3} />
      <Suspense fallback={<LoaderFallback />}>
        <Model key={src} src={src} format={format} color={colors.part} ghost={ghost} />
        <Environment preset="city" environmentIntensity={0.35} />
        <ContactShadows position={[0, FLOOR, 0]} opacity={colors.shadow} scale={12} blur={2.4} far={4} />
      </Suspense>
      <FitCamera src={src} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate}
        autoRotateSpeed={1.1}
        minDistance={0.8}
        maxDistance={14}
        target={TARGET}
      />
      <gridHelper key={colors.bg} args={[10, 20, colors.gridMajor, colors.gridMinor]} position={[0, FLOOR - 0.01, 0]} />
    </Canvas>
  );
}
