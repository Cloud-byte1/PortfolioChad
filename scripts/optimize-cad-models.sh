#!/usr/bin/env sh
# Simplify dense meshes (screw threads) and meshopt-compress the CAD Lab models.
# Run after scripts/build-cad-models.mjs; leaves public/models/<name>.glb.
set -e
cd "$(dirname "$0")/../public/models"
for m in v8-engine stirling-engine; do
  [ -f "$m.raw.glb" ] || continue
  npx --yes @gltf-transform/cli simplify "$m.raw.glb" "$m.simp.glb" --ratio 0 --error 0.0015
  npx --yes @gltf-transform/cli meshopt "$m.simp.glb" "$m.glb" --level medium
  rm "$m.raw.glb" "$m.simp.glb"
done
