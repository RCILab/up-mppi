# UP-MPPI project page

Title: **Unified Projection MPPI: Motion and Wrench Constraints under Model Uncertainty**

Static, self-contained project website. No Node, package installation, external fonts, analytics, or build service is required. Authors follow the current CAMP-MPPI page: **Anonymous authors**. Publication status is **in preparation for submission to IEEE Transactions on Robotics**.

Project page: https://rcilab.khu.ac.kr/up-mppi/

Hosted from the `main` branch of `RCILab/up-mppi` using GitHub Pages. The T-RO manuscript, local rendering tools, and browser-check artifacts are excluded from this public repository. The separately selected research note and code archive are available as study materials.

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

- Paper availability is **TBD**. The T-RO manuscript is not included or copied by the asset preparation script.
- `assets/downloads/UP-MPPI_research_note_2026-09-27.pdf`: the 37-page working theory note, dated 27 September 2026.
- `assets/downloads/UP-MPPI_code.zip`: accompanying controllers, experiment scripts, saved results, and reproduction instructions. Both downloads are exact copies of the selected `for_students/` files, published for study and discussion; they are linked from the hero and resource cards.
- `assets/data/results.json`: aggregates from saved simulation runs, source SHA-256 hashes, video-run metrics, and hashes of the published MP4 files. `results.js` contains the same snapshot for local-file compatibility.
- `assets/images/*-snapshots.png`: three comparison figures exported from the private manuscript's recorded-state renderings. Writing includes ink close-ups; dual-arm transport includes instantaneous force and joint margin; the waiter includes a matched nominal/adaptive timeline. `assets/data/visuals.json` records the image, source-figure, and simulation-recording hashes. The T-RO manuscript PDF is not published.
- The result overview reports three separate, explicitly labeled comparisons: 11% lower writing path RMSE versus CAMP, 26% lower second-move RMSE with F/T-only adaptation versus the robust prior, and 42% less writing planning time with separation versus joint projection. All derive from the frozen snapshot.
- Blue rows identify UP-MPPI; bold numbers mark the best displayed value, including ties and other methods, among completed runs. Red identifies an exceeded execution-error bound or control period. Timing emphasis compares the two writing solvers only. Writing shows the 11.0% path and 85.1% orientation improvements over CAMP; similar force regulation is stated explicitly.
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

The active source snapshot is dated 27 September 2026 and is shared with the private manuscript. The website does not automatically synchronize with changing experiment files. It publishes aggregate results, media, and the separately selected research note and code archive. The T-RO manuscript remains private.

## Refresh assets

The private experiment workspace includes rendering helpers (excluded from this public repository). The current update uses a frozen copy of the research source and writes no files back to the experiments:

```powershell
python -X utf8 website/tools/refresh_revision.py
python -X utf8 website/tools/build_revision.py
python -X utf8 website/tools/export_paper_visuals.py
```

The first command records writing and dual-arm seed-0 illustrations, checks their outcomes against the frozen results, retains validated waiter recordings, and renders videos and posters. The second imports the manuscript's shared aggregation helper, exports all metrics and provenance, updates HTML fallbacks, and applies the static table emphasis. The third exports only the three snapshot figures as PNGs, using PyMuPDF, and records their provenance. These scripts do not copy or publish a manuscript or update the separately selected downloads. Rendering needs the experiment dependencies (including Warp/PyTorch), MuJoCo, NumPy, Pillow and imageio-ffmpeg.

Older export helpers are historical and must not be used to refresh current data. Dual-arm, waiter, averaging, comparison-task/margin and sample-count selectors read the published snapshot directly. Current default tables remain visible without JavaScript.

## Browser validation

The private workspace's `tools/check_site.py` exercises the page in headless Chrome with Playwright: desktop/mobile layouts at 320–1440 px, all seven video sources, tabs and keyboard controls, every result selector, the schematic, reduced-motion behavior, static fallbacks, file URLs, and local links. The current revision passes 82 checks. Fifteen additional browser checks verify the overview numbers, fair table emphasis, bound/period flags, all three snapshot images, mobile image scrolling, and static fallbacks. Videos pause when another video starts. The helper and its `checks/` output are excluded from this public repository.
