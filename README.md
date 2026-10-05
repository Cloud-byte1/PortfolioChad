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

## Projects and CAD Lab

- **Projects** ([/projects](http://127.0.0.1:4317/projects)) list every project in a tab switcher (`src/components/work/project-switcher.tsx`), also used on the home page. Each project has its own page at `/projects/<id>`, told through interactive isometric figures (`src/components/work/scenes.tsx`). Project content lives in `src/data/work.ts`.
- **CAD Lab** ([/cad](http://127.0.0.1:4317/cad)) is only for 3D renderings of CAD models. Add STL/GLB files to `public/models/` and register them in `src/data/models.ts`. See [docs/cad-lab-solidworks.md](docs/cad-lab-solidworks.md) for exporting from SolidWorks.

## Project layout

- `docs/cad-lab-solidworks.md` — SolidWorks → CAD Lab guide
- `src/app/projects` — project switcher; `src/app/projects/[id]` — one page per project
- `src/app/cad` — CAD Lab (3D model viewer)
- `src/data/work.ts` — every project shown in the CAD Lab
- `src/components/work/` — animated project scenes
- `src/components/cad/` — CAD viewport + lab UI
- `src/data/cad.ts` — CAD feature flag + re-exports
- `src/data/models.ts` — CAD model catalog
- `public/avatar/chad.jpg` — profile avatar
- `public/models/` — STL/GLB assets
