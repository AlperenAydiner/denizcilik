/* ============================================================
   charts.js — hafif, animasyonlu SVG grafik kütüphanesi
   line/area · bar · donut · counter — hepsi hover-etkileşimli
   ============================================================ */
(function () {
  "use strict";
  const SVGNS = "http://www.w3.org/2000/svg";
  const el = (n, a = {}) => {
    const e = document.createElementNS(SVGNS, n);
    for (const k in a) e.setAttribute(k, a[k]);
    return e;
  };
  const nf = (window.MDUtil && window.MDUtil.nf0) || new Intl.NumberFormat("tr-TR");

  /* Yönetim panelinde tıklanıp düzenlenebilsin diye, grafik öğesine kaynak
     veritabanı satırını iliştirir. Panel yoksa hiçbir etkisi olmaz. */
  function markEdit(node, desc) {
    if (!desc) return;
    node.setAttribute("data-edit", JSON.stringify(desc));
  }

  // Ortak tooltip
  let tip;
  function getTip() {
    if (!tip) { tip = document.createElement("div"); tip.className = "chart-tip"; document.body.appendChild(tip); }
    return tip;
  }
  function showTip(html, x, y) {
    const t = getTip(); t.innerHTML = html; t.style.opacity = "1";
    t.style.left = x + "px"; t.style.top = y - 12 + "px"; t.style.transform = "translate(-50%,-100%)";
  }
  function hideTip() { if (tip) tip.style.opacity = "0"; }

  // Smooth path (Catmull-Rom → bezier)
  function smooth(pts) {
    if (pts.length < 2) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += `C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  /* ---------- Line / Area ---------- */
  function lineArea(host, opts) {
    host.innerHTML = "";
    const W = 720, H = 320, pad = { t: 24, r: 24, b: 40, l: 64 };
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "xMidYMid meet" });
    const xs = opts.labels;
    const allVals = opts.series.flatMap((s) => s.values);
    let max = Math.max(...allVals), min = Math.min(0, ...allVals);
    max = max * 1.08 || 1;
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const X = (i) => pad.l + (iw * i) / (xs.length - 1);
    const Y = (v) => pad.t + ih - (ih * (v - min)) / (max - min);

    // ızgara + y etiketleri
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const v = min + ((max - min) * i) / ticks, y = Y(v);
      svg.appendChild(el("line", { x1: pad.l, y1: y, x2: W - pad.r, y2: y, class: "grid-line" }));
      const tx = el("text", { x: pad.l - 12, y: y + 4, class: "axis-label", "text-anchor": "end" });
      const hv = window.MDUtil.human(v); tx.textContent = hv.v + (hv.u ? " " + hv.u[0].toUpperCase() : "");
      svg.appendChild(tx);
    }
    // x etiketleri
    xs.forEach((lb, i) => {
      const t = el("text", { x: X(i), y: H - 12, class: "axis-label", "text-anchor": "middle" });
      t.textContent = lb; svg.appendChild(t);
    });

    const grad = el("linearGradient", { id: "areaG" + Math.random().toString(36).slice(2, 7), x1: 0, y1: 0, x2: 0, y2: 1 });
    const gid = grad.getAttribute("id");
    grad.appendChild(el("stop", { offset: "0%", "stop-color": opts.series[0].color, "stop-opacity": 0.35 }));
    grad.appendChild(el("stop", { offset: "100%", "stop-color": opts.series[0].color, "stop-opacity": 0 }));
    svg.appendChild(grad);

    opts.series.forEach((s, si) => {
      const pts = s.values.map((v, i) => [X(i), Y(v)]);
      const d = smooth(pts);
      if (si === 0) {
        const area = el("path", { d: `${d}L${X(xs.length - 1)},${Y(min)}L${X(0)},${Y(min)}Z`, fill: `url(#${gid})` });
        svg.appendChild(area);
      }
      const line = el("path", { d, fill: "none", stroke: s.color, "stroke-width": 3, "stroke-linecap": "round" });
      svg.appendChild(line);
      const len = line.getTotalLength();
      line.style.strokeDasharray = len; line.style.strokeDashoffset = len;
      line.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)";
      requestAnimationFrame(() => (line.style.strokeDashoffset = "0"));
      // noktalar + hover
      pts.forEach((p, i) => {
        const dot = el("circle", { cx: p[0], cy: p[1], r: 4, fill: "#ffffff", stroke: s.color, "stroke-width": 2, style: "cursor:pointer" });
        if (s.edit) markEdit(dot, s.edit(i));
        dot.addEventListener("mouseenter", () => {
          dot.setAttribute("r", 6);
          const rect = host.getBoundingClientRect(), sc = rect.width / W;
          showTip(`<b>${xs[i]}</b> — ${s.name}<br><b>${nf.format(s.values[i])}</b> ${opts.unit || ""}`,
            rect.left + p[0] * sc, rect.top + p[1] * sc + window.scrollY);
        });
        dot.addEventListener("mouseleave", () => { dot.setAttribute("r", 4); hideTip(); });
        svg.appendChild(dot);
      });
    });
    host.appendChild(svg);
  }

  /* ---------- Bars ---------- */
  function bars(host, opts) {
    host.innerHTML = "";
    const items = opts.items;
    const W = 720, rowH = 46, H = items.length * rowH + 20;
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "xMidYMid meet" });
    const max = Math.max(...items.map((d) => d.value)) * 1.02;
    const labelW = 150, barMax = W - labelW - 90;
    items.forEach((d, i) => {
      const y = 12 + i * rowH;
      const lbl = el("text", { x: 0, y: y + 24, class: "axis-label", "font-size": 13 });
      lbl.setAttribute("fill", "var(--text-soft)"); lbl.textContent = d.label;
      markEdit(lbl, d.editLabel);
      svg.appendChild(lbl);
      svg.appendChild(el("rect", { x: labelW, y: y + 8, width: barMax, height: 22, rx: 7, fill: "var(--surface-2)" }));
      const w = (barMax * d.value) / max;
      const bar = el("rect", { x: labelW, y: y + 8, width: 0, height: 22, rx: 7, fill: d.color || "var(--accent)", class: "bar-rect", style: "cursor:pointer" });
      markEdit(bar, d.edit);
      svg.appendChild(bar);
      bar.style.transition = "width 1.2s cubic-bezier(0.22,1,0.36,1)";
      bar.style.transitionDelay = i * 60 + "ms";
      requestAnimationFrame(() => (bar.width.baseVal.value = w));
      const val = el("text", { x: labelW + barMax + 12, y: y + 24, class: "axis-label", "font-size": 13, "font-weight": 700 });
      val.setAttribute("fill", "var(--white)");
      const hv = window.MDUtil.human(d.value); val.textContent = hv.v + (hv.u ? " " + hv.u : "");
      svg.appendChild(val);
      bar.addEventListener("mouseenter", () => {
        bar.style.opacity = "0.85";
        const rect = host.getBoundingClientRect(), sc = rect.width / W;
        showTip(`<b>${d.label}</b><br><b>${nf.format(d.value)}</b> ${opts.unit || ""}`,
          rect.left + (labelW + w) * sc, rect.top + (y + 8) * sc + window.scrollY);
      });
      bar.addEventListener("mouseleave", () => { bar.style.opacity = "1"; hideTip(); });
    });
    host.appendChild(svg);
  }

  /* ---------- Donut ---------- */
  function donut(host, opts) {
    host.innerHTML = "";
    const W = 340, R = 130, r = 78, cx = W / 2, cy = W / 2;
    const svg = el("svg", { viewBox: `0 0 ${W} ${W}`, preserveAspectRatio: "xMidYMid meet" });
    const total = opts.items.reduce((s, d) => s + d.value, 0);
    let ang = -Math.PI / 2;
    opts.items.forEach((d, i) => {
      const frac = d.value / total, a2 = ang + frac * Math.PI * 2;
      const large = frac > 0.5 ? 1 : 0;
      const x1 = cx + R * Math.cos(ang), y1 = cy + R * Math.sin(ang);
      const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
      const xi1 = cx + r * Math.cos(a2), yi1 = cy + r * Math.sin(a2);
      const xi2 = cx + r * Math.cos(ang), yi2 = cy + r * Math.sin(ang);
      const path = el("path", {
        d: `M${x1},${y1}A${R},${R} 0 ${large} 1 ${x2},${y2}L${xi1},${yi1}A${r},${r} 0 ${large} 0 ${xi2},${yi2}Z`,
        fill: d.color, style: "cursor:pointer;opacity:0;transition:opacity 0.5s,transform 0.25s;transform-origin:center",
      });
      markEdit(path, d.edit);
      setTimeout(() => (path.style.opacity = "1"), i * 90);
      path.addEventListener("mouseenter", () => {
        path.style.transform = "scale(1.03)";
        const rect = host.getBoundingClientRect(), sc = rect.width / W, mid = (ang + a2) / 2;
        showTip(`<b>${d.label}</b><br><b>${nf.format(d.value)}</b> — %${(frac * 100).toFixed(1)}`,
          rect.left + (cx + 100 * Math.cos(mid)) * sc, rect.top + (cy + 100 * Math.sin(mid)) * sc + window.scrollY);
      });
      path.addEventListener("mouseleave", () => { path.style.transform = "scale(1)"; hideTip(); });
      svg.appendChild(path);
      ang = a2;
    });
    const cLabel = el("text", { x: cx, y: cy - 4, "text-anchor": "middle", "font-family": "var(--font-display)", "font-weight": 800, "font-size": 26, fill: "var(--white)" });
    const hv = window.MDUtil.human(total); cLabel.textContent = hv.v;
    svg.appendChild(cLabel);
    const cSub = el("text", { x: cx, y: cy + 20, "text-anchor": "middle", "font-size": 12, fill: "var(--text-dim)" });
    cSub.textContent = (hv.u ? hv.u + " " : "") + (opts.unit || ""); svg.appendChild(cSub);
    host.appendChild(svg);
  }

  /* ---------- Sparkline (mini trend, eksensiz) ---------- */
  function spark(host, values, color) {
    host.innerHTML = "";
    if (!values || values.length < 2) return;
    const W = 220, Hh = 56, pad = 4;
    const svg = el("svg", { viewBox: `0 0 ${W} ${Hh}`, preserveAspectRatio: "none", style: "width:100%;height:56px;overflow:visible" });
    const min = Math.min(...values), max = Math.max(...values);
    const X = (i) => pad + ((W - 2 * pad) * i) / (values.length - 1);
    const Y = (v) => Hh - pad - ((Hh - 2 * pad) * (v - min)) / (max - min || 1);
    const pts = values.map((v, i) => [X(i), Y(v)]);
    const d = smooth(pts);
    const gid = "spk" + Math.random().toString(36).slice(2, 7);
    const grad = el("linearGradient", { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 });
    grad.appendChild(el("stop", { offset: "0%", "stop-color": color, "stop-opacity": 0.28 }));
    grad.appendChild(el("stop", { offset: "100%", "stop-color": color, "stop-opacity": 0 }));
    svg.appendChild(grad);
    svg.appendChild(el("path", { d: `${d}L${X(values.length - 1)},${Hh} L${X(0)},${Hh} Z`, fill: `url(#${gid})` }));
    const line = el("path", { d, fill: "none", stroke: color, "stroke-width": 2.4, "stroke-linecap": "round", "vector-effect": "non-scaling-stroke" });
    svg.appendChild(line);
    svg.appendChild(el("circle", { cx: X(values.length - 1), cy: Y(values[values.length - 1]), r: 3.2, fill: color }));
    host.appendChild(svg);
  }


  /* ---------- Gruplu / yığılmış sütun (aylık) ---------- */
  function columns(host, opts) {
    host.innerHTML = "";
    const labels = opts.labels, series = opts.series, stacked = !!opts.stacked;
    const W = 760, H = 300, pad = { t: 18, r: 16, b: 42, l: 62 };
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "xMidYMid meet" });
    const iw = W - pad.l - pad.r, ih = H - pad.t - pad.b;
    const totals = labels.map((_, i) =>
      stacked ? series.reduce((s2, se) => s2 + (se.values[i] || 0), 0)
              : Math.max(...series.map((se) => se.values[i] || 0)));
    let max = Math.max(...totals, 1) * 1.12;
    const Y = (v) => pad.t + ih - (ih * v) / max;
    const bw = iw / labels.length;
    const inner = Math.min(bw * 0.66, 42);

    for (let i = 0; i <= 4; i++) {
      const v = (max * i) / 4, y = Y(v);
      svg.appendChild(el("line", { x1: pad.l, y1: y, x2: W - pad.r, y2: y, class: "grid-line" }));
      const tx = el("text", { x: pad.l - 10, y: y + 4, class: "axis-label", "text-anchor": "end" });
      const hv = window.MDUtil.human(v);
      tx.textContent = hv.v + (hv.u ? " " + hv.u[0].toUpperCase() : "");
      svg.appendChild(tx);
    }
    labels.forEach((lb, i) => {
      const cx = pad.l + bw * i + bw / 2;
      const tx = el("text", { x: cx, y: H - 14, class: "axis-label", "text-anchor": "middle", "font-size": 11 });
      tx.textContent = lb; svg.appendChild(tx);
      if (stacked) {
        let acc = 0;
        series.forEach((se) => {
          const v = se.values[i] || 0; if (!v) return;
          const y0 = Y(acc + v), h = Y(acc) - Y(acc + v);
          const r = el("rect", { x: cx - inner / 2, y: y0, width: inner, height: Math.max(h, 0), fill: se.color, style: "cursor:pointer" });
          attach(r, lb, se, v, opts, host, W, i);
          svg.appendChild(r); acc += v;
        });
      } else {
        const n = series.length, sw = inner / n;
        series.forEach((se, si) => {
          const v = se.values[i] || 0; if (!v) return;
          const x = cx - inner / 2 + si * sw;
          const r = el("rect", { x: x, y: Y(v), width: Math.max(sw - 2, 2), height: Math.max(ih - (Y(v) - pad.t), 0), rx: 3, fill: se.color, style: "cursor:pointer" });
          attach(r, lb, se, v, opts, host, W, i);
          svg.appendChild(r);
        });
      }
    });
    host.appendChild(svg);

    function attach(node, lb, se, v, opts2, hostEl, WW, idx) {
      if (se.edit) markEdit(node, se.edit(idx));
      node.addEventListener("mouseenter", (ev) => {
        node.style.opacity = "0.82";
        const rect = hostEl.getBoundingClientRect(), sc = rect.width / WW;
        showTip(`<b>${lb}</b> — ${se.name}<br><b>${nf.format(v)}</b> ${opts2.unit || ""}`,
          rect.left + (ev.offsetX || 0) * 0 + ev.clientX - rect.left + rect.left, ev.clientY + window.scrollY);
      });
      node.addEventListener("mouseleave", () => { node.style.opacity = "1"; hideTip(); });
    }
  }

  window.MDCharts = { lineArea, bars, donut, spark, columns };
})();
