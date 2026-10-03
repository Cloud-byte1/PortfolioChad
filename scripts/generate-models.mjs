import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/models");
fs.mkdirSync(outDir, { recursive: true });

function buildGearAssembly() {
  const root = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({
    color: 0x6b7c86,
    metalness: 0.85,
    roughness: 0.35,
  });
  const accent = new THREE.MeshStandardMaterial({
    color: 0x3d8f8a,
    metalness: 0.7,
    roughness: 0.4,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x2a3439,
    metalness: 0.9,
    roughness: 0.25,
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.18, 2.2), metal);
  base.position.y = -0.7;
  root.add(base);

  for (const x of [-1.1, 1.1]) {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.5, 0.6), dark);
    bracket.position.set(x, 0.05, 0);
    root.add(bracket);
  }

  const shaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 2.6, 32),
    accent
  );
  shaft.rotation.z = Math.PI / 2;
  shaft.position.y = 0.35;
  root.add(shaft);

  const gear = new THREE.Group();
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 0.28, 48),
    metal
  );
  hub.rotation.z = Math.PI / 2;
  gear.add(hub);
  const rim = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.22, 48),
    accent
  );
  rim.rotation.z = Math.PI / 2;
  gear.add(rim);
  for (let i = 0; i < 16; i++) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.22), metal);
    const a = (i / 16) * Math.PI * 2;
    tooth.position.set(0, Math.cos(a) * 0.95, Math.sin(a) * 0.95);
    gear.add(tooth);
  }
  gear.position.set(-0.35, 0.35, 0);
  root.add(gear);

  const flange = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.14, 40),
    dark
  );
  flange.rotation.z = Math.PI / 2;
  flange.position.set(0.85, 0.35, 0);
  root.add(flange);

  for (const [x, z] of [
    [-1.3, -0.85],
    [1.3, -0.85],
    [-1.3, 0.85],
    [1.3, 0.85],
  ]) {
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16),
      accent
    );
    bolt.position.set(x, -0.55, z);
    root.add(bolt);
  }
  root.updateMatrixWorld(true);
  return root;
}

function buildBracket() {
  const root = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x8a9399,
    metalness: 0.8,
    roughness: 0.4,
  });
  root.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 1.2), mat));
  const upright = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 1.2), mat);
  upright.position.set(-0.84, 0.7, 0);
  root.add(upright);
  const rib = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.12), mat);
  rib.position.set(-0.2, 0.35, 0);
  rib.rotation.z = -Math.PI / 5;
  root.add(rib);
  root.updateMatrixWorld(true);
  return root;
}

function exportSTL(object, filename) {
  const exporter = new STLExporter();
  const result = exporter.parse(object, { binary: true });
  const buf = Buffer.from(result.buffer ? result.buffer : result);
  fs.writeFileSync(path.join(outDir, filename), buf);
  console.log("wrote", filename, buf.byteLength);
}

exportSTL(buildGearAssembly(), "gear-assembly.stl");
exportSTL(buildBracket(), "mounting-bracket.stl");

fs.writeFileSync(
  path.join(outDir, "README.md"),
  `# CAD models

Drop SolidWorks exports here as \`.glb\` / \`.gltf\` (preferred) or \`.stl\`.

Browsers cannot open native \`.sldprt\` / \`.sldasm\` files. From SolidWorks:
1. File → Save As → glTF Binary (\`.glb\`) if available, or
2. File → Save As → STL, or
3. Export via a glTF exporter / Blender conversion.

Then register the file in \`src/data/models.ts\`, or drag-and-drop the export into the CAD Lab viewer.
`
);

console.log("done");
