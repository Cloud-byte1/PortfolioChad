# Chad Carmichael — Portfolio

Personal portfolio for **Chad Carmichael**, inspired by clean design-engineer sites like [prathm.me](https://prathm.me/) — with a real **CAD Lab** where SolidWorks exports can be loaded and orbited in the browser.

## Stack

- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- Three.js / React Three Fiber for the CAD viewport
- Motion for light page animation

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

```bash
npm run build
npm run start
npm run lint
# regenerate sample STL demos:
node scripts/generate-models.mjs
```

## SolidWorks → web viewer

CAD Lab is on a separate page ([/cad](http://127.0.0.1:4317/cad)) and hidden from the main nav until STL files are ready (`src/data/cad.ts`).

See **[docs/cad-lab-solidworks.md](docs/cad-lab-solidworks.md)** for the full guide.

## Project layout

- `docs/cad-lab-solidworks.md` — SolidWorks → CAD Lab guide
- `src/app/cad` — CAD Lab page (hidden from main nav)
- `src/components/cad/` — CAD viewport + lab UI
- `src/data/cad.ts` — CAD feature flag + re-exports
- `src/data/models.ts` — CAD model catalog
- `public/avatar/chad.jpg` — profile avatar
- `public/models/` — STL/GLB assets
