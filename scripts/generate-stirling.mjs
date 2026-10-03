import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/models");
fs.mkdirSync(outDir, { recursive: true });

const metal = new THREE.MeshStandardMaterial({ color: 0x7a848c });
const dark = new THREE.MeshStandardMaterial({ color: 0x2f353a });
const brass = new THREE.MeshStandardMaterial({ color: 0x9a7b4f });

function buildStirling() {
  const root = new THREE.Group();
  root.name = "StirlingEngine";

  // Base plate
  const base = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 2.4), metal);
  base.position.y = -0.9;
  root.add(base);

  // Hot / cold cylinder body (horizontal displacer cylinder)
  const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 2.4, 48),
    brass
  );
  cylinder.rotation.z = Math.PI / 2;
  cylinder.position.set(-0.2, 0.15, 0);
  root.add(cylinder);

  // Cylinder end caps
  for (const x of [-1.4, 1.0]) {
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.62, 0.12, 40),
      dark
    );
    cap.rotation.z = Math.PI / 2;
    cap.position.set(x, 0.15, 0);
    root.add(cap);
  }

  // Power piston cylinder (vertical)
  const powerCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.32, 1.1, 36),
    metal
  );
  powerCyl.position.set(1.35, 0.55, 0);
  root.add(powerCyl);

  const piston = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.35, 28),
    dark
  );
  piston.position.set(1.35, 0.85, 0);
  root.add(piston);

  // Connecting rod
  const rod = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.08), dark);
  rod.position.set(1.35, 1.45, 0);
  rod.rotation.z = -0.35;
  root.add(rod);

  // Flywheel
  const flywheel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.95, 0.18, 56),
    metal
  );
  flywheel.rotation.x = Math.PI / 2;
  flywheel.position.set(1.9, 1.85, 0);
  root.add(flywheel);

  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.22, 0.28, 24),
    dark
  );
  hub.rotation.x = Math.PI / 2;
  hub.position.set(1.9, 1.85, 0);
  root.add(hub);

  // Crank / spokes
  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 0.06), dark);
    spoke.position.set(1.9, 1.85, 0);
    spoke.rotation.x = Math.PI / 2;
    spoke.rotation.z = (i * Math.PI) / 4;
    root.add(spoke);
  }

  // Support frames
  for (const z of [-0.75, 0.75]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.6, 0.14), dark);
    post.position.set(1.9, -0.05, z);
    root.add(post);
  }

  const cross = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 1.7), dark);
  cross.position.set(1.9, 0.75, 0);
  root.add(cross);

  // Mounting bolts
  for (const [x, z] of [
    [-1.7, -0.9],
    [1.7, -0.9],
    [-1.7, 0.9],
    [1.7, 0.9],
  ]) {
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.12, 12),
      brass
    );
    bolt.position.set(x, -0.75, z);
    root.add(bolt);
  }

  // Displacer link stub
  const link = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.08), metal);
  link.position.set(0.2, 0.95, 0.45);
  link.rotation.z = 0.25;
  root.add(link);

  root.updateMatrixWorld(true);
  return root;
}

const exporter = new STLExporter();
const result = exporter.parse(buildStirling(), { binary: true });
const buf = Buffer.from(result.buffer ? result.buffer : result);
const out = path.join(outDir, "stirling-engine.stl");
fs.writeFileSync(out, buf);
console.log("wrote", out, buf.byteLength);
