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

The CAD Lab ([/cad](http://127.0.0.1:4317/cad)) is a grid of every project; each opens its own page (`/cad/<id>`) told through one or more figures: an interactive isometric scene (click it to make it act) next to what I did. The home page and the CAD Lab both list every project in the same tab switcher (`src/components/work/project-switcher.tsx`). Projects live in `src/data/work.ts`; the scenes live in `src/components/work/scenes.tsx`. Projects with `hasModel` also show the 3D viewer, which loads STL/GLB files registered in `src/data/models.ts`.

See **[docs/cad-lab-solidworks.md](docs/cad-lab-solidworks.md)** for the full guide.

## Project layout

- `docs/cad-lab-solidworks.md` — SolidWorks → CAD Lab guide
- `src/app/cad` — CAD Lab grid; `src/app/cad/[id]` — one page per project
- `src/data/work.ts` — every project shown in the CAD Lab
- `src/components/work/` — animated project scenes
- `src/components/cad/` — CAD viewport + lab UI
- `src/data/cad.ts` — CAD feature flag + re-exports
- `src/data/models.ts` — CAD model catalog
- `public/avatar/chad.jpg` — profile avatar
- `public/models/` — STL/GLB assets
