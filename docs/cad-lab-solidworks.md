# CAD Lab — SolidWorks on the portfolio

Interactive 3D viewport on Chad’s portfolio: orbit, pan, and zoom parts like a SolidWorks camera.

**Live (hidden from main nav for now):** [http://127.0.0.1:4317/cad](http://127.0.0.1:4317/cad)

CAD Lab lives on its own route (`src/app/cad/page.tsx`). Toggle `showCadOnHome` in `src/data/cad.ts` when you’re ready to surface it again.

## What you can load

| Works in the browser | Does **not** work |
| --- | --- |
| `.glb` / `.gltf` (best) | `.sldprt` |
| `.stl` | `.sldasm` |

Browsers cannot open native SolidWorks files. Export first, then drop the export into the site.

## From SolidWorks → site

1. Open the part or assembly in SolidWorks.
2. **File → Save As**
   - Prefer **glTF / GLB** if you have an exporter, or
   - **STL** (simple and reliable).
3. On the portfolio **CAD Lab**:
   - **Drag and drop** the file onto “Drop a SolidWorks export”, or
   - Click **Browse files**.
4. Drag to orbit · scroll to zoom · right-drag to pan. Use **Stop spin** / **Auto-spin** as needed.

## Ship a model with the repo (permanent)

1. Copy the export into `public/models/` (e.g. `public/models/my-bracket.stl`).
2. Register it in `src/data/models.ts`:

```ts
{
  id: "my-bracket",
  title: "My bracket",
  description: "Short note about the part.",
  src: "/models/my-bracket.stl",
  format: "stl", // or "glb" / "gltf"
  sourceNote: "SolidWorks export",
}
```

3. Restart or refresh the dev server (`npm run dev` → [http://127.0.0.1:4317](http://127.0.0.1:4317)).

## Sample models included

- `public/models/stirling-engine.stl` — featured Stirling Engine (viewport mesh)
- `public/models/source/Stirling_Engine.SLDASM` — your uploaded SolidWorks assembly (download only; not rendered in-browser)
- `public/models/gear-assembly.stl`
- `public/models/mounting-bracket.stl`

Regenerate samples: `node scripts/generate-models.mjs`  
Regenerate Stirling viewport mesh: `node scripts/generate-stirling.mjs`

### Swap in your exact SolidWorks geometry

1. Open `Stirling Engine.SLDASM` in SolidWorks (with its part files).
2. **File → Save As → STL** (or GLB).
3. Replace `public/models/stirling-engine.stl`, or drop the export into the CAD Lab.

## Related

- Repo root `README.md` — how to run the app
- `public/models/README.md` — export notes next to the assets
