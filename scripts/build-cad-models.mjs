/**
 * Builds the CAD Lab's .glb models from SolidWorks STL exports.
 *
 *   node scripts/build-cad-models.mjs <model> <folder-with-stls>
 *   (then run scripts/optimize-cad-models.sh to weld, simplify, and compress)
 *
 * Export the assembly from SolidWorks with File → Save As → STL, Options →
 * "Save all components of an assembly in a single file" OFF, so every part
 * lands in its own STL in shared assembly coordinates.
 *
 * Repeated parts (eight pistons, four screws, …) are stored once and placed
 * with node transforms; shading uses a crease angle so CAD edges stay crisp.
 */
import fs from "node:fs";
import path from "node:path";

const MODELS = {
  v8: {
    out: "public/models/v8-engine.raw.glb",
    match: /^V8_Assembly - (.+)-(\d+)\.STL$/i,
    up: "y",
    materials: {
      Block: { color: [0.74, 0.76, 0.79], metal: 0.55, rough: 0.45 },
      "Bottom end": { color: [0.36, 0.38, 0.41], metal: 0.6, rough: 0.5 },
      Crank: { color: [0.5, 0.52, 0.55], metal: 0.9, rough: 0.28 },
      Conrod: { color: [0.62, 0.64, 0.68], metal: 0.85, rough: 0.3 },
      Piston: { color: [0.88, 0.88, 0.86], metal: 0.6, rough: 0.35 },
      Fan: { color: [0.82, 0.18, 0.13], metal: 0.15, rough: 0.5 },
    },
    material: (part) =>
      ({
        Block: "Block",
        Bottom_end: "Bottom end",
        Crank: "Crank",
        Conrod: "Conrod",
        Piston_head: "Piston",
        Fan: "Fan",
      })[part] ?? "Crank",
  },
  stirling: {
    out: "public/models/stirling-engine.raw.glb",
    match: /^Stirling Enigne - (.+)-(\d+)\.STL$/i,
    up: "z",
    materials: {
      Aluminum: { color: [0.76, 0.78, 0.8], metal: 0.55, rough: 0.42 },
      Brass: { color: [0.8, 0.62, 0.3], metal: 0.85, rough: 0.3 },
      Steel: { color: [0.45, 0.47, 0.5], metal: 0.9, rough: 0.32 },
      Piston: { color: [0.9, 0.9, 0.88], metal: 0.5, rough: 0.35 },
      Rubber: { color: [0.08, 0.08, 0.09], metal: 0, rough: 0.85 },
      Glass: { color: [0.75, 0.86, 0.95], metal: 0, rough: 0.08, alpha: 0.32 },
      Wick: { color: [0.93, 0.9, 0.82], metal: 0, rough: 0.9 },
    },
    material: (part) => {
      const p = part.toLowerCase();
      if (/baseplate|cylinderplate|bearingblock|gudgeon|connectorlink|powerconnector|crankweb/.test(p)) return "Aluminum";
      if (/dc cylinder|burner bottle/.test(p)) return "Glass";
      if (/powercylinder|flywheel$|burner cap|npt/.test(p)) return "Brass";
      if (/piston/.test(p)) return "Piston";
      if (/o-ring|oring/.test(p)) return "Rubber";
      if (/wick/.test(p)) return "Wick";
      return "Steel";
    },
  },
};

/* ---------------- STL parsing ---------------- */

function readStl(file) {
  const buf = fs.readFileSync(file);
  const head = buf.subarray(0, 512).toString("latin1");
  if (head.startsWith("solid") && head.includes("facet")) {
    const out = [];
    for (const m of buf.toString("latin1").matchAll(/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g)) {
      out.push(+m[1], +m[2], +m[3]);
    }
    return Float64Array.from(out);
  }
  const n = buf.readUInt32LE(80);
  const pos = new Float64Array(n * 9);
  for (let i = 0; i < n; i++) {
    const o = 84 + i * 50 + 12;
    for (let k = 0; k < 9; k++) pos[i * 9 + k] = buf.readFloatLE(o + k * 4);
  }
  return pos;
}

/* ---------------- small vector math ---------------- */

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => {
  const l = len(a) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const at = (pos, i) => [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]];

/** Orthonormal frame (columns) built from three points. */
function frame(a, b, c) {
  const x = norm(sub(b, a));
  const z = norm(cross(sub(b, a), sub(c, a)));
  const y = cross(z, x);
  return [x, y, z];
}

/**
 * Rigid transform R, t with R·ref + t ≈ other, matched vertex for vertex.
 * Returns null when the two exports are not the same part moved rigidly.
 */
function rigidTransform(ref, other) {
  const n = ref.length / 3;
  const a1 = at(ref, 0);
  let i2 = 0;
  let best = -1;
  for (let i = 0; i < n; i++) {
    const d = len(sub(at(ref, i), a1));
    if (d > best) [best, i2] = [d, i];
  }
  const a2 = at(ref, i2);
  const axis = norm(sub(a2, a1));
  let i3 = 0;
  best = -1;
  for (let i = 0; i < n; i++) {
    const v = sub(at(ref, i), a1);
    const d = len(cross(v, axis));
    if (d > best) [best, i3] = [d, i];
  }
  const fa = frame(a1, a2, at(ref, i3));
  const fb = frame(at(other, 0), at(other, i2), at(other, i3));
  // R = Fb · Faᵀ
  const R = [0, 1, 2].map((r) => [0, 1, 2].map((c) => fb[0][r] * fa[0][c] + fb[1][r] * fa[1][c] + fb[2][r] * fa[2][c]));
  const apply = (p) => [dot(R[0], p), dot(R[1], p), dot(R[2], p)];
  const t = sub(at(other, 0), apply(a1));
  let worst = 0;
  for (let i = 0; i < n; i++) {
    const p = apply(at(ref, i));
    worst = Math.max(worst, len(sub([p[0] + t[0], p[1] + t[1], p[2] + t[2]], at(other, i))));
  }
  return worst < 0.02 ? { R, t } : null;
}

/* ---------------- indexed mesh with crease-angle normals ---------------- */

function buildMesh(pos, center) {
  const tris = pos.length / 9;
  const key = (x, y, z) => `${Math.round(x * 1000)},${Math.round(y * 1000)},${Math.round(z * 1000)}`;
  const weld = new Map();
  const cornerVert = new Int32Array(tris * 3);
  const verts = [];
  for (let c = 0; c < tris * 3; c++) {
    const k = key(pos[c * 3], pos[c * 3 + 1], pos[c * 3 + 2]);
    let id = weld.get(k);
    if (id === undefined) {
      id = verts.length;
      weld.set(k, id);
      verts.push(at(pos, c));
    }
    cornerVert[c] = id;
  }
  const faceN = [];
  const incident = verts.map(() => []);
  for (let f = 0; f < tris; f++) {
    const [a, b, c] = [0, 1, 2].map((k) => verts[cornerVert[f * 3 + k]]);
    faceN.push(norm(cross(sub(b, a), sub(c, a))));
    for (let k = 0; k < 3; k++) incident[cornerVert[f * 3 + k]].push(f);
  }
  const crease = Math.cos((32 * Math.PI) / 180);
  const outPos = [];
  const outNrm = [];
  const index = [];
  const outKey = new Map();
  for (let f = 0; f < tris; f++) {
    for (let k = 0; k < 3; k++) {
      const v = cornerVert[f * 3 + k];
      let n = [0, 0, 0];
      for (const g of incident[v]) {
        if (dot(faceN[f], faceN[g]) >= crease) n = [n[0] + faceN[g][0], n[1] + faceN[g][1], n[2] + faceN[g][2]];
      }
      n = norm(len(n) ? n : faceN[f]);
      const k2 = `${v}|${Math.round(n[0] * 500)},${Math.round(n[1] * 500)},${Math.round(n[2] * 500)}`;
      let id = outKey.get(k2);
      if (id === undefined) {
        id = outPos.length / 3;
        outKey.set(k2, id);
        const p = verts[v];
        outPos.push(p[0] - center[0], p[1] - center[1], p[2] - center[2]);
        outNrm.push(n[0], n[1], n[2]);
      }
      index.push(id);
    }
  }
  return { positions: Float32Array.from(outPos), normals: Float32Array.from(outNrm), index: Uint32Array.from(index) };
}

/* ---------------- GLB writer ---------------- */

function writeGlb(file, { meshes, nodes, materials, rootRotation, scale }) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const pushView = (typed, target) => {
    const bytes = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength);
    const pad = (4 - (byteLength % 4)) % 4;
    if (pad) {
      chunks.push(Buffer.alloc(pad));
      byteLength += pad;
    }
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(bytes);
    byteLength += bytes.length;
    return bufferViews.length - 1;
  };
  const gltfMeshes = meshes.map((m) => {
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < m.positions.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], m.positions[i + k]);
        max[k] = Math.max(max[k], m.positions[i + k]);
      }
    }
    const count = m.positions.length / 3;
    accessors.push({ bufferView: pushView(m.positions, 34962), componentType: 5126, count, type: "VEC3", min, max });
    const p = accessors.length - 1;
    accessors.push({ bufferView: pushView(m.normals, 34962), componentType: 5126, count, type: "VEC3" });
    const nIdx = accessors.length - 1;
    accessors.push({ bufferView: pushView(m.index, 34963), componentType: 5125, count: m.index.length, type: "SCALAR" });
    const iIdx = accessors.length - 1;
    return { name: m.name, primitives: [{ attributes: { POSITION: p, NORMAL: nIdx }, indices: iIdx, material: m.material }] };
  });
  const gltf = {
    asset: { version: "2.0", generator: "build-cad-models.mjs" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [
      { name: "Assembly", rotation: rootRotation, scale: [scale, scale, scale], children: nodes.map((_, i) => i + 1) },
      ...nodes,
    ],
    meshes: gltfMeshes,
    materials,
    accessors,
    bufferViews,
    buffers: [{ byteLength }],
  };
  let json = Buffer.from(JSON.stringify(gltf));
  json = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  let bin = Buffer.concat(chunks);
  bin = Buffer.concat([bin, Buffer.alloc((4 - (bin.length % 4)) % 4)]);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + json.length + 8 + bin.length, 8);
  const chunkHead = (n, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(n, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.concat([header, chunkHead(json.length, 0x4e4f534a), json, chunkHead(bin.length, 0x004e4942), bin]));
}

/* ---------------- main ---------------- */

const [modelName, folder] = process.argv.slice(2);
const cfg = MODELS[modelName];
if (!cfg || !folder) {
  console.error(`Usage: node scripts/build-cad-models.mjs <${Object.keys(MODELS).join("|")}> <folder>`);
  process.exit(1);
}

const files = fs
  .readdirSync(folder)
  .map((f) => ({ f, m: f.match(cfg.match) }))
  .filter((x) => x.m)
  .map(({ f, m }) => ({ file: path.join(folder, f), part: m[1].trim(), copy: +m[2] }))
  .sort((a, b) => a.part.localeCompare(b.part) || a.copy - b.copy);

const parts = files.map((x) => ({ ...x, pos: readStl(x.file) }));
const lo = [Infinity, Infinity, Infinity];
const hi = [-Infinity, -Infinity, -Infinity];
for (const p of parts) {
  for (let i = 0; i < p.pos.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      lo[k] = Math.min(lo[k], p.pos[i + k]);
      hi[k] = Math.max(hi[k], p.pos[i + k]);
    }
  }
}
const center = lo.map((v, k) => (v + hi[k]) / 2);
const size = Math.max(...hi.map((v, k) => v - lo[k]));

const materialNames = Object.keys(cfg.materials);
const materials = materialNames.map((name) => {
  const m = cfg.materials[name];
  return {
    name,
    doubleSided: true,
    ...(m.alpha ? { alphaMode: "BLEND" } : {}),
    pbrMetallicRoughness: { baseColorFactor: [...m.color, m.alpha ?? 1], metallicFactor: m.metal, roughnessFactor: m.rough },
  };
});

const meshes = [];
const nodes = [];
const refs = new Map(); // part name → { mesh, pos }
let instanced = 0;
for (const p of parts) {
  const material = materialNames.indexOf(cfg.material(p.part));
  const ref = refs.get(p.part);
  if (ref && ref.pos.length === p.pos.length) {
    const tr = rigidTransform(ref.pos, p.pos);
    if (tr) {
      // Shift the transform into the centered frame: t' = R·c + t − c.
      const Rc = [dot(tr.R[0], center), dot(tr.R[1], center), dot(tr.R[2], center)];
      const t = [Rc[0] + tr.t[0] - center[0], Rc[1] + tr.t[1] - center[1], Rc[2] + tr.t[2] - center[2]];
      const R = tr.R;
      nodes.push({
        name: `${p.part} ${p.copy}`,
        mesh: ref.mesh,
        matrix: [R[0][0], R[1][0], R[2][0], 0, R[0][1], R[1][1], R[2][1], 0, R[0][2], R[1][2], R[2][2], 0, t[0], t[1], t[2], 1],
      });
      instanced++;
      continue;
    }
  }
  const mesh = buildMesh(p.pos, center);
  meshes.push({ name: p.part, material, ...mesh });
  refs.set(p.part, { mesh: meshes.length - 1, pos: p.pos });
  nodes.push({ name: `${p.part} ${p.copy}`, mesh: meshes.length - 1 });
}

const s = Math.SQRT1_2;
writeGlb(cfg.out, {
  meshes,
  nodes,
  materials,
  rootRotation: cfg.up === "z" ? [-s, 0, 0, s] : [0, 0, 0, 1],
  scale: 3.2 / size,
});
const tris = meshes.reduce((n, m) => n + m.index.length / 3, 0);
console.log(
  `${modelName}: ${parts.length} parts, ${meshes.length} unique meshes (${instanced} placed as copies), ${tris} triangles stored → ${cfg.out} (${(fs.statSync(cfg.out).size / 1e6).toFixed(2)} MB)`
);
