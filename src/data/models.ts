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
      "Your SolidWorks assembly on the site — orbit the viewport model. Exact SW geometry needs an STL/GLB export (assembly file is linked below).",
    src: "/models/stirling-engine.stl",
    format: "stl",
    sourceNote: "Stirling Engine · from Stirling Engine.SLDASM",
    sourceDownload: "/models/source/Stirling_Engine.SLDASM",
  },
  {
    id: "gear-assembly",
    title: "Gear & shaft assembly",
    description:
      "Demo mechanical assembly — orbit, pan, and zoom like a SolidWorks viewport.",
    src: "/models/gear-assembly.stl",
    format: "stl",
    sourceNote: "Sample STL",
  },
  {
    id: "mounting-bracket",
    title: "Mounting bracket",
    description:
      "L-bracket with rib — drop your own .stl or .glb to replace this part.",
    src: "/models/mounting-bracket.stl",
    format: "stl",
    sourceNote: "Sample STL",
  },
];
