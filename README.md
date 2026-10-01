# VEDANTH.OS

Personal portfolio of Vedanth Rai, built as a dark, cinematic "operating system": a V/CORE with spatial navigation nodes, a cinematic boot sequence, a deterministic guide (DRACO), a fast Recruiter Mode, and interactive 3D features.

Stack: Vite + TypeScript (no UI framework), Three.js (lazy-loaded, decorative only), self-hosted fonts via `@fontsource`. No backend, no API keys, no runtime network calls.

## Requirements
- Node.js 18 or newer
- npm 9 or newer

## Installation
```bash
npm install
```

## Development
```bash
npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript only
npm test           # data + routing smoke tests (vitest)
```

## Production Build
```bash
npm run build      # typecheck + bundle into dist/
npm run preview    # serve dist/ at http://localhost:4173
```
`dist/` is fully static and uses relative paths (`base: './'`), so it works from any folder or sub-path.

## Project Structure
```
index.html              static shell (boot, header, ring, overlay, recruiter, Draco, anomaly, radar)
public/assets/          files served as-is (resume.pdf, project screenshots, intro.mp3)
public/favicon.svg      SVG favicon
netlify.toml            Netlify deployment configuration
src/main.ts             entry: wires header, Draco, router, boot, lazy 3D, anomaly handler
src/router.ts           hash router: #projects  #projects/AI  #project/<id>/<Tab>  #recruiter  #anomaly
src/data/               ALL content (profile, projects, experience, skills, achievements, lab, navigation)
src/sections/           HTML view builders for each route (no content inside)
src/components/         Boot, Header, Overlay, Recruiter, Draco, SystemScan, UniverseMap
src/scenes/             coreScene.ts (Three.js V/CORE + rocket + orbital stations), architecture.ts, labScene.ts
src/utils/              dom helpers, procedural sound
src/styles/main.css     the whole visual system (CSS variables at the top)
src/test/               vitest smoke tests
```

## Features

### Core Experience
- **Cinematic boot sequence** with optional audio sync
- **V/CORE ring** with spatial navigation nodes orbiting a wireframe icosahedron
- **Recruiter Mode** (`#recruiter`, header button, or `Alt+R`): dense, text-first view with all portfolio content
- **DRACO** deterministic navigator: fixed questions, answers assembled from data files (no AI, no model)

### Interactive 3D
- **Wireframe rocket** that patrols the scene with flickering exhaust
- **Orbital project stations** visible when zooming out (mouse wheel)
- **Wormhole jump animation** when navigating to projects
- **Red Alert anomaly** (one-time Easter egg): clicking the rocket for the first time turns the world red and reveals a classified signal popup

### Special Features
- **System Scan** (`[ INITIATE SYSTEM SCAN ]`): animated terminal-style diagnostic that dynamically calculates metrics from actual portfolio data
- **Universe Map** (`⌘ MAP`): interactive navigation diagram showing all projects and sections as orbital nodes
- **Navigation Radar HUD**: minimap showing your current location in the portfolio
- **Easter egg**: type `oracle` anywhere

## Adding Projects
Append an object to `src/data/projects.ts` (type `Project` in `src/data/types.ts`):
`id` (used in the URL), `name`, `category` (`'AI' | 'SYS' | 'SW'`), `summary`, `why`, `built`, `architecture` (ordered stage names drawn as the pipeline), `tech`, `contribution`, `results`, `repo` (URL or `null`), `screenshots` (optional).
The project list, tabs, Recruiter Mode and DRACO's "How does … work?" menu pick it up automatically. Keep every claim traceable to the project itself, not to how the portfolio visualises it.

## Updating Resume
The Download button links to `public/assets/resume.pdf`. To replace it, overwrite that file with the same name. To use a different path, change `resume` in `src/data/profile.ts`.

## Updating Links
`src/data/profile.ts`: `email`, `github`, `linkedin`, `resume`. Per-project repositories live in `repo` in `src/data/projects.ts`. A `null` repo shows "No repository link supplied" instead of a button.
Other content: `experience.ts`, `achievements.ts`, `skills.ts`, `lab.ts`, `navigation.ts` (ring positions).

## Adding Assets
Put files in `public/assets/` and reference them with `asset('assets/name.ext')` from `src/utils/dom.ts` (respects the deploy base path). Images imported from `src/` are bundled and hashed by Vite.

## Deployment

### Netlify (recommended)
A `netlify.toml` is included. Just connect the repo — build command and output directory are pre-configured.

### Other Hosts
Build, then upload `dist/` to any static host.
- Cloudflare Pages / Vercel: build command `npm run build`, output directory `dist`.
- GitHub Pages: publish the contents of `dist/` (relative base means no extra config).

Routes use the URL hash, so no server rewrite rules are needed.

## Architecture
- Content lives in `src/data/`; views in `src/sections/` turn it into HTML; `router.ts` maps the hash to a view; `components/Overlay.ts` shows it. Nothing in the UI hardcodes portfolio facts.
- Every important fact is real HTML. The 3D layer (`coreScene.ts`) is decorative and lazy-loaded; if WebGL is missing the site is identical minus the wireframe core.
- DRACO (`components/Draco.ts`) is deterministic: fixed questions, answers assembled from the data files, no model, no generated text.
- Recruiter Mode (`#recruiter`) replaces the scene with a dense text page containing resume, GitHub, LinkedIn, email, experience, achievements, projects and skills.
- Architecture diagrams are portfolio visualisations of documented pipelines. The CSR swarm toggles illustrate documented concepts; they are not simulation results.

## Performance Notes
- Three.js (~120 KB gzip) is a separate chunk loaded after first paint; the app shell is ~20 KB gzip.
- Particle count drops on narrow screens (350 vs 1100); pixel ratio is capped; rendering pauses when the tab is hidden or Recruiter Mode is open.
- `prefers-reduced-motion`: the boot intro is skipped, the core renders one static frame, diagrams stop animating.
- The intro also skips on repeat visits in the same session and for `#recruiter` links.
- Sound is enabled by default (for cinematic intro). User preference is persisted in localStorage.
