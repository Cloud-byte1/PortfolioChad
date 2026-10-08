export type CadModelFormat = "glb" | "gltf" | "stl";

export type CadModel = {
  id: string;
  title: string;
  description: string;
  /** Path under /public, e.g. /models/part.glb */
  src: string;
  format: CadModelFormat;
  sourceNote?: string;
  /** Material names the "See inside" toggle fades out (e.g. an engine block). */
  ghost?: string[];
};

/**
 * Models shown in the CAD Lab. Build GLBs from SolidWorks STL exports with
 * scripts/build-cad-models.mjs, then scripts/optimize-cad-models.sh.
 */
export const cadModels: CadModel[] = [
  {
    id: "v8-engine",
    title: "V8 engine",
    description:
      "My mini working V8 from SolidWorks: block, bottom end, crankshaft, eight pistons and connecting rods, and fan. Turn on See inside to look through the block.",
    src: "/models/v8-engine.glb",
    format: "glb",
    sourceNote: "V8 engine, 20 parts",
    ghost: ["Block", "Bottom end"],
  },
  {
    id: "stirling-engine",
    title: "Stirling engine",
    description:
      "Every part of my SolidWorks assembly: baseplate, displacer and power cylinders, flywheel, crank, alcohol burner, and the screws and pins that hold it together.",
    src: "/models/stirling-engine.glb",
    format: "glb",
    sourceNote: "Stirling engine, 46 parts",
  },
];
