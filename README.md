# UP-MPPI project page

Title: **Unified Projection MPPI: Motion and Wrench Constraints under Model Uncertainty**

Static, self-contained project website. No Node, package installation, external fonts, analytics, or build service is required. Authors follow the current CAMP-MPPI page: **Anonymous authors**. Publication status is **in preparation for submission to IEEE Transactions on Robotics**.

Project page: https://rcilab.khu.ac.kr/up-mppi/

Hosted from the `main` branch of `RCILab/up-mppi` using GitHub Pages. Manuscripts, local rendering tools, and browser-check artifacts are excluded from this public repository.

## Preview

From this directory:

```powershell
python -m http.server 8878 --bind 127.0.0.1
```

Open http://127.0.0.1:8878/. `index.html` can also be opened directly; the result snapshot is supplied as JavaScript so interactive charts work without a server.

## Static hosting

Upload `index.html`, `style.css`, `app.js`, `.nojekyll`, and the entire `assets/` folder together. All local URLs are relative, so the same files work at a subpath such as `/up-mppi/`. No server routes, API keys, or environment variables are needed. Pushing to `main` updates the GitHub Pages site.

`robots: noindex` follows the current anonymous CAMP-MPPI page. Change this when the project is ready for indexing. The page does not claim that the T-RO manuscript has been submitted or accepted.

## Content and provenance

- Paper availability is **TBD**. No manuscript PDF is included or copied by the asset preparation script; publication will be handled separately when ready.
- `assets/data/results.json`: selected saved simulation results and SHA-256 hashes of the source summaries. `results.js` contains the same snapshot for local-file compatibility.
- `assets/videos/writing.mp4`, `dualarm.mp4`, `waiter.mp4`: original saved comparison films, remuxed with fast-start metadata. No results or labels were changed.
- `assets/videos/hero-*.mp4`: saved robot configurations re-rendered with dark lighting and a new camera, at 1× simulation time. No controller rerun or invented motion.
- The waiter comparison film uses **adaptive-tracked**, not the newer **adaptive-cop** variant. The page identifies this explicitly; the graph distinguishes the two.
- All reported results are simulations from a CPU prototype. No hardware performance or real-time controller claim is made. Empirically calibrated error bounds are assumptions, not universal worst-case guarantees.
- The 2D interactive projection is an explanatory example under a diagonal metric, not a plot of robot experiment data.

Source snapshots date from 26 September 2026. The website does not automatically synchronize with changing manuscript or experiment files.

## Refresh assets

The private experiment workspace includes a local rendering helper (excluded from this public repository). From that workspace, in the existing experiment Python environment:

```powershell
python -X utf8 website/tools/prepare_assets.py
```

This copies the result snapshot, makes video posters, and re-renders existing trajectories. It **does not copy the manuscript, run new experiments,** or alter the source files. The environment needs MuJoCo, NumPy, Pillow and imageio-ffmpeg. Windows font paths are inherited by the existing experiment renderer imports.

After refreshing, review visible prose and the static writing table against the new manuscript and data. The dual-arm and waiter controls read their numbers from the snapshot automatically.

## Browser validation

The private workspace's `tools/check_site.py` exercises the page in headless Chrome with Playwright: desktop/mobile layouts, all video sources, tabs and keyboard controls, result selectors, the schematic, reduced-motion behavior, file URLs, and local links. The helper and its `checks/` output are excluded from this public repository.
