(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Navigation remains ordinary anchor navigation; the mobile menu is a disclosure.
  const menu = $(".menu-toggle");
  const nav = $("#nav");
  function closeMenu() {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("open", open);
  });
  $$("a", nav).forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".header")) closeMenu();
  });
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$("a", nav).forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-15% 0px -65% 0px" });
  $$("main > section[id]").forEach(section => sectionObserver.observe(section));

  // Background replays use recorded states. Pause offscreen, when hidden, or on request.
  const heroVideo = $("#hero-video");
  const heroButton = $("#hero-play");
  let wantsPlayback = !reducedMotion.matches && !navigator.connection?.saveData;
  let heroVisible = false;
  const sceneInfo = {
    waiter: ["01", "UNCERTAIN PAYLOAD · F/T-ONLY ADAPTATION", "Learn the load as the robot moves.", "Simulated tray transport with force-torque-only COP adaptation", "Raw average, final projection, and COP-difference adaptation using F/T measurements. Seed 0 at 1× speed; comparison film below."],
    dualarm: ["02", "CLOSED-CHAIN MANIPULATION", "Two arms. One constrained motion.", "Simulated dual-arm transport using the unified controller", "UP-MPPI with the mixed motion–reaction update at 2 mm base error. Seed 0, re-rendered at 1× speed; comparison film below."],
    writing: ["03", "CURVED-SURFACE INTERACTION", "Follow the surface. Constrain the reaction.", "Simulated surface writing using the unified controller", "UP-MPPI with the mixed motion–reaction update at zero board offset. Seed 0, re-rendered at 1× speed. Measured force statistics are reported below."]
  };
  function updatePlayButton() {
    const playing = !heroVideo.paused;
    heroButton.innerHTML = `<span aria-hidden="true">${playing ? "Ⅱ" : "▶"}</span><span>${playing ? "Pause" : "Play"}</span>`;
    heroButton.setAttribute("aria-label", `${playing ? "Pause" : "Play"} simulation replay`);
  }
  function syncHero() {
    if (wantsPlayback && heroVisible && !document.hidden) {
      heroVideo.play().catch(() => updatePlayButton());
    } else heroVideo.pause();
  }
  heroButton.addEventListener("click", () => {
    wantsPlayback = heroVideo.paused;
    syncHero();
  });
  heroVideo.addEventListener("play", updatePlayButton);
  heroVideo.addEventListener("pause", updatePlayButton);
  document.addEventListener("visibilitychange", syncHero);
  reducedMotion.addEventListener("change", event => {
    if (event.matches) { wantsPlayback = false; syncHero(); }
  });
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    syncHero();
  }, { threshold: .05 }).observe(heroVideo);
  $$("[data-scene]").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.scene;
    const [index, category, caption, label, description] = sceneInfo[key];
    $$("[data-scene]").forEach(item => {
      const selected = item === button;
      item.setAttribute("aria-pressed", String(selected));
      item.classList.toggle("active", selected);
    });
    heroVideo.pause();
    heroVideo.poster = `assets/images/hero-${key}.jpg?v=revision-20260927`;
    heroVideo.src = `assets/videos/hero-${key}.mp4?v=revision-20260927`;
    heroVideo.setAttribute("aria-label", label);
    $("#hero-count").textContent = `${index} / 03`;
    $("#hero-category").textContent = category;
    $("#hero-caption").textContent = caption;
    $("#hero-description").textContent = description;
    syncHero();
  }));

  // Accessible experiment tabs, including arrow-key navigation.
  const filmTabs = $$(".film-tabs [role=tab]");
  function selectFilm(tab, focus = false) {
    filmTabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(item.getAttribute("aria-controls"));
      if (!selected) $("video", panel).pause();
      panel.hidden = !selected;
    });
    if (focus) tab.focus();
  }
  filmTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectFilm(tab));
    tab.addEventListener("keydown", event => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % filmTabs.length;
      if (event.key === "ArrowLeft") next = (index + filmTabs.length - 1) % filmTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = filmTabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectFilm(filmTabs[next], true);
      }
    });
  });
  // Surface video errors rather than leaving a silent empty player.
  $$("video").forEach(video => video.addEventListener("error", () => {
    if (video.parentNode.querySelector(".video-error")) return;
    const message = document.createElement("p");
    message.className = "video-error";
    const link = document.createElement("a");
    link.href = video.currentSrc || $("source", video)?.src || "assets/videos/dualarm.mp4";
    link.textContent = "Download the MP4";
    message.append("This video could not play here. ", link, ".");
    video.after(message);
  }));

  // Motion-channel schematic convex projection. The diagonal metric is W = diag(1, 1.6).
  // This is an explanatory two-dimensional example, not a robot experiment.
  const raw = [[-2.15,.98],[-1.94,-.63],[-1.35,1.2],[-1.5,-1.14],[-.9,.43],[-.88,-.55],[-.5,1.26],[-.34,-1.1],[-.15,.14],[.3,1.06],[.4,-.56],[.71,.31],[.91,1.27],[1.03,-1.18],[1.34,.16],[1.85,.92],[1.95,-.7],[2.17,.23],[.24,-.05],[-1.7,.12]];
  const motion = [[-1.6,-.85],[1.6,-.85],[1.6,.85],[-1.6,.85]];
  const toScreen = ([x, y]) => [300 + x*105, 165 - y*100];
  const points = polygon => polygon.map(p => toScreen(p).join(",")).join(" ");
  function clip(poly, a, b, bound) {
    const result = [];
    poly.forEach((p, i) => {
      const q = poly[(i+1)%poly.length];
      const fp = a*p[0]+b*p[1]-bound;
      const fq = a*q[0]+b*q[1]-bound;
      if (fp <= 1e-10) result.push(p);
      if ((fp < 0) !== (fq < 0)) {
        const t = fp/(fp-fq);
        result.push([p[0]+t*(q[0]-p[0]), p[1]+t*(q[1]-p[1])]);
      }
    });
    return result;
  }
  function project(p, polygon, band) {
    if (Math.abs(p[0])<=1.6 && Math.abs(p[1])<=.85 && Math.abs(.6*p[0]+p[1])<=band) return p;
    let closest, distance = Infinity;
    polygon.forEach((a, i) => {
      const b = polygon[(i+1)%polygon.length];
      const d = [b[0]-a[0], b[1]-a[1]];
      const denominator = d[0]**2+1.6*d[1]**2;
      const t = denominator === 0 ? 0 : Math.max(0, Math.min(1, ((p[0]-a[0])*d[0]+1.6*(p[1]-a[1])*d[1])/denominator));
      const q = [a[0]+t*d[0], a[1]+t*d[1]];
      const dist = (p[0]-q[0])**2 + 1.6*(p[1]-q[1])**2;
      if (dist < distance) { closest = q; distance = dist; }
    });
    return closest;
  }
  function updateProjection() {
    const value = +$("#uncertainty").value;
    const band = 1.65-value*.0105;
    const region = clip(clip(motion,.6,1,band),-.6,-1,band);
    const wrench = clip(clip([[-2.5,-1.45],[2.5,-1.45],[2.5,1.45],[-2.5,1.45]],.6,1,band),-.6,-1,band);
    $("#wrench-region").innerHTML = `<polygon points="${points(wrench)}" fill="#edc69f" fill-opacity=".2" stroke="#cba477" stroke-width="1" stroke-dasharray="4 5"/>`;
    $("#feasible-region").setAttribute("points", points(region));
    const projected = raw.map(p => project(p,region,band));
    $("#raw-samples").innerHTML = raw.map(p => {
      const [x,y] = toScreen(p); return `<circle cx="${x}" cy="${y}" r="4" fill="#f7f8f3" stroke="#98a29a" stroke-width="1.1"/>`;
    }).join("");
    $("#projected-samples").innerHTML = projected.map(p => {
      const [x,y] = toScreen(p); return `<circle cx="${x}" cy="${y}" r="3.2" fill="#5d7b37" stroke="#f7f8f3" stroke-width=".7"/>`;
    }).join("");
    $("#projection-lines").innerHTML = raw.map((p,i) => {
      const [x,y] = toScreen(p), [xx,yy] = toScreen(projected[i]);
      return `<path d="M${x} ${y}L${xx} ${yy}" stroke="#879979" stroke-width=".9" opacity=".6"/>`;
    }).join("");
    const weights = projected.map(([x,y]) => Math.exp(-4*((x-2)**2+2*(y-.65)**2)));
    const sum = weights.reduce((a,b) => a+b,0);
    const average = samples => samples.reduce((a,p,i) => [a[0]+p[0]*weights[i]/sum,a[1]+p[1]*weights[i]/sum],[0,0]);
    const rawMean = average(raw), projectedMean = average(projected);
    const final = project(rawMean, region, band);
    [["#raw-mean",rawMean],["#projected-mean",projectedMean],["#weighted-mean",final]].forEach(([id,p]) => {
      const [x,y] = toScreen(p);
      $(id).setAttribute("transform", `translate(${x} ${y})`);
    });
    const [rx,ry] = toScreen(rawMean), [fx,fy] = toScreen(final), [px,py] = toScreen(projectedMean);
    $("#mean-paths").innerHTML = `<path d="M${rx} ${ry}L${fx} ${fy}" stroke="#b76645" stroke-width="2" stroke-dasharray="4 3"/><path d="M${px} ${py}L${fx} ${fy}" stroke="#6485b2" stroke-width="2"/>`;
    $("#uncertainty-value").textContent = value < 33 ? "Low" : value < 67 ? "Moderate" : "High";
    $("#uncertainty").setAttribute("aria-valuetext", `${value}% illustrative uncertainty`);
  }
  $("#uncertainty").addEventListener("input", updateProjection);
  updateProjection();

  // Snapshot data are also shipped as a plain JSON download with source hashes.
  const results = globalThis.UP_MPPI_RESULTS;
  if (!results) {
    $$("#offset, #height, #baseline-task, #baseline-margin, #sample-count").forEach(select => { select.disabled = true; });
    return;
  }
  function bars(container, items, max, unit, digits) {
    $$(".bar-row", container).forEach((row,i) => {
      const item = items[i];
      $(".bar",row).style.width = `${Math.max(0,Math.min(100,100*item.value/max))}%`;
      $("strong",row).innerHTML = `${item.value.toFixed(digits)} <small>${unit}</small>`;
    });
    container.setAttribute("aria-label", items.map(item => `${item.label}: ${item.value.toFixed(digits)} ${unit}`).join("; "));
  }
  function updateDual() {
    const offset = +$("#offset").value;
    const items = [["PR","PR-MPPI"],["PR-anchored","Anchored PR"],["Unified","UP-MPPI"]].map(([key,label]) => ({label, value: results.dual[key].find(r => r.offset===offset).force}));
    bars($("#dual-chart"),items,17,"N",2);
    $("#dual-announcement").textContent = `At ${offset} mm error: `+$("#dual-chart").getAttribute("aria-label");
  }
  function updateWaiter() {
    const h = $("#height").value;
    const names = [["robust","Robust prior"],["adaptive-cop","Adaptive F/T only"],["adaptive-tracked","Adaptive tracked"],["oracle","Oracle"]];
    const items = names.map(([key,label]) => ({label, value: results.waiterSweep[`${key}|${h}`].rmse2}));
    bars($("#waiter-chart"),items,55,"mm",1);
    const denominator = items[0].value-items[3].value;
    const gap = Math.abs(denominator) > 1e-8 ? 100*(items[0].value-items[1].value)/denominator : null;
    $("#gap-value").textContent = gap === null ? "—" : `${Math.round(gap)}%`;
    const nominal = results.waiterSweep[`nominal|${h}`];
    const outcomes = names.map(([key,label]) => { const r = results.waiterSweep[`${key}|${h}`]; return `${label}: ${r.tipped}/${r.n}`; });
    $("#waiter-outcomes").textContent = `At h = ${h} m, tipped runs — nominal: ${nominal.tipped}/${nominal.n}; ${outcomes.join("; ")}. `+(nominal.tipped ? "Nominal tracking is omitted because runs terminated early." : "Nominal is excluded from this robust-to-oracle comparison.");
  }
  function updateAveraging() {
    const move = $("#averaging-move").value;
    const methods = [["projected","Projected average"],["raw","Raw + final projection"]];
    const items = methods.map(([key,label]) => ({label,value:results.averaging[key][move]}));
    bars($("#averaging-chart"),items,70,"mm",1);
    $("#averaging-gain").textContent = `${Math.round(100*(1-items[1].value/items[0].value))}%`;
    $("#averaging-announcement").textContent = `${move === "rmse1" ? "First" : "Second"} move: ` + $("#averaging-chart").getAttribute("aria-label");
  }
  // Insert cells as text so the downloadable data are never treated as HTML.
  function tableRows(target, rows) {
    target.replaceChildren(...rows.map(({cells, highlight}) => {
      const row = document.createElement("tr");
      if (highlight) row.className = "highlight";
      cells.forEach((value, index) => {
        const cell = document.createElement(index ? "td" : "th");
        if (!index) cell.scope = "row";
        cell.textContent = String(value);
        row.append(cell);
      });
      return row;
    }));
  }
  function tableHead(target, columns) {
    const row = document.createElement("tr");
    columns.forEach(label => {
      const cell = document.createElement("th");
      cell.scope = "col";
      cell.textContent = label;
      row.append(cell);
    });
    target.replaceChildren(row);
  }
  function updateBaselines() {
    const waiter = $("#baseline-task").value === "waiter";
    $("#margin-control").hidden = !waiter;
    if (waiter) {
      const mode = $("#baseline-margin").value;
      const data = results.comparators.waiter[mode];
      tableHead($("#baseline-head"), ["Method", "Move 1 ↓", "Move 2 ↓", "Tipped runs ↓", "Max. error (m/s²)"]);
      tableRows($("#baseline-table"), data.map(r => ({highlight:r.key === "up", cells:[r.label, `${r.rmse1.toFixed(1)} mm`, `${r.rmse2.toFixed(1)} mm`, `${r.tips}/${r.n}`, r.executionError.toFixed(3)]})));
      $("#baseline-caption").textContent = `Waiter · true h = 0.14 m · ${mode === "tightened" ? "tightened rows" : "no execution tightening"}`;
      $("#baseline-note").textContent = "MPPI: 5 seeds per condition; optimization: 1 deterministic run. Settings minimize main-task move-1 RMSE among no-tip variants. The offline planner knows the full reference. " + (mode === "tightened" ? "Equal numerical margins do not ensure equal certificates: DualGuard’s observed error exceeds ε." : "No tips occur at this height; the untightened offline plan tips in the 0.17 m condition. These outcomes do not establish an execution certificate.");
    } else {
      const up = results.writing.find(r => r.method === "Unified");
      const rows = [{highlight:true,cells:["UP-MPPI · mixed update", `${up.tracking.toFixed(2)} mm`, `${up.inBand.toFixed(1)}%`, `${up.orientation.toFixed(2)}°`, `${up.n-up.diverged}/${up.n}`]}];
      results.comparators.writing.forEach(r => {
        const setting = Object.entries(r.params).map(([key,value]) => `${key === "rho" ? "ρ" : key} = ${value}`).join(", ");
        rows.push({cells:[r.label+(setting ? ` · ${setting}` : ""), `${r.tracking.toFixed(2)} mm`, `${r.inBand.toFixed(1)}%`, `${r.orientation.toFixed(2)}°`, `${r.completed}/${r.n}`]});
      });
      tableHead($("#baseline-head"), ["Method", "Path RMSE ↓", "Force in band ↑", "Orientation ↓", "Completed runs"]);
      tableRows($("#baseline-table"), rows);
      $("#baseline-caption").textContent = "Writing · zero board offset · 3 seeds per setting";
      $("#baseline-note").textContent = "All tested settings are shown. Divergent-run metrics cover only the executed portion. No force-error tightening is applied. The GS raw-mean variant changes the source algorithm’s execution rule; its force result is specific to this adaptation. DualGuard attains 100% occupancy with similar tracking here.";
    }
  }
  function updateTiming() {
    const k = $("#sample-count").value;
    const t = results.timing;
    const records = [["Writing · separable",t.writing_gpu.separable[k],10],["Writing · joint",t.writing_gpu.joint[k],10],["Waiter",t.waiter_gpu[k],20]];
    tableRows($("#timing-table"), records.map(([label,r,period]) => ({highlight:label === "Writing · separable",cells:[label,`${r.plan_ms.toFixed(2)} ms`,`${r.kernel_ms.toFixed(2)} ms`,`${period} ms`]})));
    $("#timing-caption").textContent = `RTX 4060 · K = ${k} · measured planning time`;
    $("#timing-gain").textContent = `${Math.round(100*(1-t.writing_gpu.separable[k].plan_ms/t.writing_gpu.joint[k].plan_ms))}%`;
    const over = records.filter(([,r,period]) => r.plan_ms > period);
    $("#timing-note").textContent = (over.length ? over.map(([label,r,period]) => `${label} takes ${r.plan_ms.toFixed(2)} ms, exceeding its ${period} ms control period.`).join(" ") : `All three measurements at K = ${k} are below the corresponding simulated control period.`) + " This is not a worst-case deadline guarantee.";
  }
  $("#offset").addEventListener("change",updateDual);
  $("#height").addEventListener("change",updateWaiter);
  $("#averaging-move").addEventListener("change",updateAveraging);
  $("#baseline-task").addEventListener("change",updateBaselines);
  $("#baseline-margin").addEventListener("change",updateBaselines);
  $("#sample-count").addEventListener("change",updateTiming);
  updateDual();
  updateWaiter();
  updateAveraging();
  updateBaselines();
  updateTiming();
})();
