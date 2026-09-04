# MANOJ MAHABLESHWAR HEGDE · Portfolio

Personal portfolio for Manoj Mahableshwar Hegde, Software Developer. Styled as an interactive developer notebook. Vite + React 19 + TypeScript + Tailwind v4.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Deploy (GitHub Pages)

Push to `main`. `.github/workflows/deploy.yml` builds with `BASE_PATH=/<repo-name>/` and publishes `dist/` through GitHub Pages.
One-time setup in the repo: Settings → Pages → Source: **GitHub Actions**.

For a custom domain or a `<user>.github.io` repo the base path resolves to `/` automatically.

## Editing content

All copy, links, stats, skills, projects and certifications live in `src/content/profile.ts`. Components only render it.
The resume PDF is `public/Manoj_Mahableshwar_Hegde_Resume.pdf`; replace the file to update it (keep the name, or change it in `profile.ts`).

## How it is built

- `src/notebook/`: the notebook metaphor: `ThemeProvider` (dark/light, persisted), `NotebookProvider` (cell execution counter, run all, vacuum, toasts, confetti), `Cell` (gutter + code + output, executes on scroll into view).
- `src/widgets/`: pure canvas simulations (layered pipeline, task workers, scheduled jobs, transaction log, metrics stream, API gateway, background mesh). No React, no DOM.
- `src/hooks/useCanvasWidget.ts`: runs a widget: DPR-aware sizing, ticks only while on screen, one shared `requestAnimationFrame` loop for the whole page (`src/lib/animationLoop.ts`).
- `src/content/profile.ts`: the only place content lives. Section ids, titles and rail labels are defined once there; cells derive their index from that list.
- `src/lib/motion.ts`: every timing the choreography depends on (cell run time, run-all stagger, theme switch, boot). CSS reads the stagger values through custom properties it publishes.
- `src/lib/brand.ts`, `src/lib/brandIcons.ts`: brand colors and the bundled logo set, shared by content and components.

## Performance notes

- One shared animation loop; canvases tick only while visible and the loop stops when the tab is hidden.
- Low-end devices (≤4 cores or ≤4 GB) run at 30fps, lower canvas DPR and no glow effects (`src/lib/device.ts`).
- The full-page background is off under 560px wide. Backdrop blur on the fixed bars is on from 768px up.
- Fonts are self-hosted (`@fontsource`), brand logos are bundled SVG paths (`simple-icons`). No third-party requests at runtime.
- `prefers-reduced-motion` disables the intro, cell animations, confetti and live canvases (they paint one still frame); toasts fade instead of sliding.
- The notebook waits for the intro to finish before any cell executes, so the choreography is never hidden behind the overlay.

## Easter eggs

Type `run` or `vacuum` anywhere. Click the cluster pill three times.
