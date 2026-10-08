# CAD Lab models

- `v8-engine.glb`: mini working V8 (20 parts) from SolidWorks.
- `stirling-engine.glb`: Stirling engine (46 parts) from SolidWorks.

Both are built from per-part STL exports:

```bash
node scripts/build-cad-models.mjs v8 "<folder with V8_Assembly - *.STL>"
node scripts/build-cad-models.mjs stirling "<folder with Stirling Enigne - *.STL>"
sh scripts/optimize-cad-models.sh
```

Register models in `src/data/models.ts`. `gear-assembly.stl` and `mounting-bracket.stl` are unused samples from `scripts/generate-models.mjs`.
