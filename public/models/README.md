# CAD models

Drop SolidWorks exports here as `.glb` / `.gltf` (preferred) or `.stl`.

Browsers cannot open native `.sldprt` / `.sldasm` files. From SolidWorks:
1. File → Save As → glTF Binary (`.glb`) if available, or
2. File → Save As → STL, or
3. Export via a glTF exporter / Blender conversion.

Then register the file in `src/data/models.ts`, or drag-and-drop the export into the CAD Lab viewer.

## Stirling Engine

- Viewport mesh: `stirling-engine.stl`
- Original upload: `source/Stirling_Engine.SLDASM` (kept for download; not web-renderable)
- To show exact SW faces: export STL/GLB from SolidWorks and replace `stirling-engine.stl`
