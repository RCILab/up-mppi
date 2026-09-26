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
- The controller uses a **raw motion mean and an average of projected reactions**, with a final motion projection and measured-state command reconstruction. The waiter has no physical reaction channel and reduces to raw averaging plus final projection. Its support rows additionally use execution-error tightening.
- `assets/videos/waiter.mp4`: freshly recorded nominal, robust, **F/T-only adaptive-cop**, and oracle runs, seed 0, true CoM height 0.14 m. The 4.3 s simulated task plays at 0.5× speed.
- `assets/videos/averaging.mp4`: projected-average and raw-average robust controllers with identical explicit tightening, seed 0, 0.5× playback. The accompanying chart aggregates five seeds; the video is an individual example.
- `assets/videos/writing.mp4` and `dualarm.mp4`: fresh mixed-update UP-MPPI recordings alongside saved reference-method trajectories. The new recordings reproduce the frozen seed-0 results; the accompanying charts report three-seed averages. The dual-arm film's UP internal force is 1.92 N, while the three-seed mean is 2.00 N.
- `assets/videos/hero-*.mp4`: recorded robot states re-rendered with dark lighting and a presentation camera, at 1× simulation time. No generated or invented robot motion.
- Writing reports 99.3% measured force-band occupancy, 1.58 mm path RMSE, and 0.11° orientation RMS. Its commanded reaction is 2.12–3.39 N. These are separate quantities; writing does not apply execution-error tightening.
- The comparison table includes task adaptations of Shield, DualGuard and GS plus offline robust planning and online NMPC. They are explicitly labeled adaptations. In particular, the GS raw-mean variant changes the original's best-sample execution and faster inner safety filter. The page links the source papers and preserves stronger outcomes of other controllers.
- GPU timing reports whole-plan and rollout-kernel measurements for K=256, 1024 and 4096. At K=1024 writing takes 4.43 ms with separation and 7.64 ms with joint projection. At K=4096 joint writing exceeds its 10 ms control period. Measurements are the minimum of three round medians on a shared RTX 4060 workstation, not deadline guarantees.
- All reported experiments are simulations; hardware validation remains future work. The waiter certificate is conditional on calibrated error bounds and concerns period-averaged wrench. No pointwise or universal safety claim is made.
- The interactive 2D figure illustrates the **motion channel** under a diagonal metric. The separate projected-reaction average appears explicitly in the method equations.

The active source snapshot is dated 27 September 2026 and is shared with the private manuscript. The website does not automatically synchronize with changing experiment files. It publishes aggregate results and media, with no manuscript PDF.

## Refresh assets

The private experiment workspace includes rendering helpers (excluded from this public repository). The current update uses a frozen copy of the research source and writes no files back to the experiments:

```powershell
python -X utf8 website/tools/refresh_revision.py
python -X utf8 website/tools/build_revision.py
```

The first command records writing and dual-arm seed-0 illustrations, checks their outcomes against the frozen results, retains validated waiter recordings, and renders videos and posters. The second imports the manuscript's shared aggregation helper, exports all metrics and provenance, and updates HTML fallbacks. No manuscript is copied or published. Rendering needs the experiment dependencies (including Warp/PyTorch), MuJoCo, NumPy, Pillow and imageio-ffmpeg.

Older export helpers are historical and must not be used to refresh current data. Dual-arm, waiter, averaging, comparison-task/margin and sample-count selectors read the published snapshot directly. Current default tables remain visible without JavaScript.

## Browser validation

The private workspace's `tools/check_site.py` exercises the page in headless Chrome with Playwright: desktop/mobile layouts at 320–1440 px, all seven video sources, tabs and keyboard controls, every result selector, the schematic, reduced-motion behavior, static fallbacks, file URLs, and local links. The current revision passes 76 checks. The helper and its `checks/` output are excluded from this public repository.
