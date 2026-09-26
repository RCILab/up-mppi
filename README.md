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
- `assets/data/results.json`: aggregates from saved simulation runs, source SHA-256 hashes, video-run metrics, and hashes of the published MP4 files. `results.js` contains the same snapshot for local-file compatibility.
- The updated controller projects each rollout input, averages the **raw** sampled inputs, and projects the executed command at the measured state. Waiter constraints additionally use an explicit execution-error tightening.
- `assets/videos/waiter.mp4`: freshly recorded nominal, robust, **F/T-only adaptive-cop**, and oracle runs, seed 0, true CoM height 0.14 m. The 4.3 s simulated task plays at 0.5× speed.
- `assets/videos/averaging.mp4`: projected-average and raw-average robust controllers with identical explicit tightening, seed 0, 0.5× playback. The accompanying chart aggregates five seeds; the video is an individual example.
- `assets/videos/writing.mp4` and `dualarm.mp4`: fresh raw-update UP-MPPI recordings alongside saved reference-method trajectories. The dual-arm chart states which averaging rule its aggregate sweep uses.
- `assets/videos/hero-*.mp4`: recorded robot states re-rendered with dark lighting and a presentation camera, at 1× simulation time. No generated or invented robot motion.
- Writing now reports the updated measured force-in-band rate (48.7%), separately from the commanded 2–4 N reaction constraint. That experiment does not apply execution-error tightening.
- All reported results are simulations. Hardware validation and updated timing measurements are in progress. The waiter certificate is conditional on calibrated error bounds and concerns period-averaged wrench; no pointwise or universal safety claim is made.
- The 2D interactive projection is explanatory geometry under a diagonal metric. It shows the projected average, raw average, and final projection using the same weights.

Source snapshots date from 26 September 2026. The website does not automatically synchronize with changing manuscript or experiment files.

## Refresh assets

The private experiment workspace includes rendering helpers (excluded from this public repository). The current update uses a frozen copy of the research source and writes no files back to the experiments:

```powershell
python -X utf8 website/tools/refresh_alg1.py
python -X utf8 website/tools/build_snapshot_alg1.py
```

The first command records seed-0 illustrations and renders videos and posters from a private, frozen source snapshot. The second aggregates completed result subsets and records provenance. No manuscript is copied or published. The environment needs the experiment dependencies (including Warp/PyTorch for the waiter controller), MuJoCo, NumPy, Pillow and imageio-ffmpeg.

The old `prepare_assets.py` helper is retained only as a rendering dependency; running its old data export directly would restore obsolete projected-update results. Review the prose and all static fallbacks when making a new research snapshot. Dual-arm, waiter, and averaging selectors read the published snapshot directly.

## Browser validation

The private workspace's `tools/check_site.py` exercises the page in headless Chrome with Playwright: desktop/mobile layouts, all video sources, tabs and keyboard controls, result selectors, the schematic, reduced-motion behavior, file URLs, and local links. The helper and its `checks/` output are excluded from this public repository.
