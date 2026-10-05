export type CadModelFormat = "glb" | "gltf" | "stl";

export type CadModel = {
  id: string;
  title: string;
  description: string;
  /** Path under /public, e.g. /models/part.glb */
  src: string;
  format: CadModelFormat;
  sourceNote?: string;
  /** Optional download of original SolidWorks file (not renderable in-browser) */
  sourceDownload?: string;
};

/**
 * Register SolidWorks exports here after saving GLB/GLTF/STL into public/models/.
 * Native .sldprt / .sldasm cannot render in the browser.
 */
export const cadModels: CadModel[] = [
  {
    id: "stirling-engine",
    title: "Stirling Engine",
    description:
      "A simplified 3D stand-in for my SolidWorks Stirling engine. The original assembly file is linked below.",
    src: "/models/stirling-engine.stl",
    format: "stl",
    sourceNote: "Stirling engine (simplified)",
    sourceDownload: "/models/source/Stirling_Engine.SLDASM",
  },
];
