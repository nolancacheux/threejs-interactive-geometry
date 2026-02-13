## Interactive Geometry with Three.js

Interactive demonstrations and utilities in computer graphics using Three.js: parametric primitives, Bézier curves, B-Splines, and 2D/3D spline-driven scenes. This repository is structured as cohesive modules with a consistent layout.

### Table of contents
- Overview
- Structure
- How to run the demos
- Modules
- Assets and data
- Documents

### Overview
This repository contains HTML demos and JavaScript implementations for introductory to intermediate topics in computer graphics with Three.js: lines, circles, parametric curves, Bézier curves, B-Splines, and 2D/3D Noël scenes driven by B-Spline constructions.

### Structure
- `parametric-basics/`: primitives and parametric curves
  - `demos/`: HTML entry points
  - `src/`: JavaScript modules
  - `docs/`: notes/resources
- `bezier/`: Bézier curves (Bernstein and De Casteljau)
  - `demos/`, `src/`, `assets/`, `docs/`
- `bsplines/`: B-Splines (base functions, degree, knot vectors)
  - `demos/`, `src/`, `assets/`, `docs/`
- `spline-scenes/`: Noël 2D/3D scenes built with B-Splines
  - `demos/`, `src/`, `assets/`, `data/`, `docs/`

Top-level PDFs: `cours_3DWebGL.pdf`, `CoursInfographie.pdf`.

### How to run the demos
Open the HTML files under each module's `demos/` directory in a modern browser.
- Parametric basics demos import Three.js via an importmap from a CDN.
- Bézier, B-Splines, and spline scenes include jQuery from a CDN and reference local `assets/style.css` and `assets/three.js`. They also load the corresponding scripts from `src/`.

If you serve folders via a static server, keep the relative structure intact.

### Modules
#### Parametric basics
`parametric-basics/demos/*` reference modules in `parametric-basics/src/*` (circles, animated/parametric curves, lines, starter scene).

#### Bézier
`bezier/demos/courbes-bezier.html` loads `../assets/style.css`, `../assets/three.js`, `../src/manage-dashboard.js`, `../src/courbes-bezier.js`. Includes UI to add/move points, toggle display using Bernstein basis or De Casteljau, and apply transformations on control points.

#### B-Splines
`bsplines/demos/courbes-bsplines.html` loads `../assets/style.css`, `../assets/three.js`, `../src/manage-dashboard.js`, `../src/courbes-bsplines.js`. Supports degree selection, knot vectors, point editing, base function and curve display.

#### Spline scenes (2D/3D)
2D: `spline-scenes/demos/noel-2d.html` loads `../assets/style.css`, `../assets/three.js`, `../src/manage-dashboard.js`, `../src/noel-2d.js`.

3D: `spline-scenes/demos/noel-3d.html` loads `../assets/style.css`, `../assets/three.js`, `../src/manage-dashboard.js`, `../src/noel-3d.js`. Features include adding control points, toggling point display, generating knot vectors (random or uniform), importing/exporting JSON, and rendering the B-Spline curve.

### Assets and data
- `assets/style.css`: UI styling for dashboards and layout
- `assets/three.js`: local Three.js build used by some demos
- `spline-scenes/data/`: JSON examples and a utility script
  - `guirlande.json`, `sapin_noel.json`, `spiral_points.json`, `spiral.py`

### Documents
- `bezier/docs/TP2_CIR3.pdf`, `bezier/docs/compte-rendu.pdf`
- `bsplines/docs/cr.md`, `bsplines/docs/cr.pdf`
- `spline-scenes/docs/TP4_CIR3.pdf`, `spline-scenes/docs/TP4_LesChevre.pdf`
- `parametric-basics/docs/01TP_Chevres.md`


