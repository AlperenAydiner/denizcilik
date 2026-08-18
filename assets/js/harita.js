/* ============================================================
   harita.js — tam sayfa interaktif liman haritası + tablo
   ============================================================ */
(function () {
  "use strict";
  if (!window.MARITIME_DATA) return;
  const U = window.MDUtil, I = window.I18N;
  let D, P;
  const host = document.getElementById("pageContent");
  if (!host) return;

  function start() {
  D = window.MARITIME_DATA; P = D.ports;
  document.title = I.t("map.title");
  host.innerHTML = `
    <section class="page-hero"><div class="wrap">
      <div class="breadcrumb reveal"><a href="index.html">${I.t("bc.home")}</a> ${window.__arrow("right")} <span>${I.t("map.bc")}</span></div>
      <h1 class="reveal">${I.t("map.h1")}</h1>
      <p class="intro reveal d1">${I.t("map.intro")}</p>
    </div></section>
    <section class="section" style="padding-top:10px"><div class="wrap">
      <div class="reveal mapviz" id="haritaMap"></div>
    </div></section>
    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head reveal"><h2>${I.t("map.rank")}</h2><p>${I.t("map.rankSub")}</p></div>
      <div class="chart-card reveal table-scroll" style="padding:0">
        <table class="data-table" id="portsTable"></table>
      </div>
    </div></section>`;

  /* Harita */
  (function map() {
    let mode = "yuk_ton";
    const wrap = document.getElementById("haritaMap");
    const frame = document.createElement("div"); frame.className = "frame";
    const tip = document.createElement("div"); tip.className = "map-tooltip";
    frame.innerHTML = `<div class="controls">
        <button data-mode="yuk_ton" class="on">${I.t("map.cargo")}</button>
        <button data-mode="konteyner_teu">${I.t("map.cont")}</button></div>`;
    const sv = document.createElement("div"); frame.appendChild(sv); frame.appendChild(tip); wrap.appendChild(frame);
    function draw() {
      const vals = P.map((p) => p[mode]).filter((v) => v > 0), max = Math.max(...vals);
      const R = (v) => (v > 0 ? 6 + 34 * Math.sqrt(v / max) : 0);
      const fill = mode === "yuk_ton" ? "rgba(0,184,174,0.30)" : "rgba(224,118,47,0.28)";
      const stroke = mode === "yuk_ton" ? "var(--c-yuk)" : "var(--c-konteyner)";
      sv.innerHTML = `<svg class="bigmap" viewBox="${D.map.viewBox}" preserveAspectRatio="xMidYMid meet">
        ${D.map.outline.map((d) => `<path class="land" d="${d}"></path>`).join("")}
        ${P.filter((p) => p[mode] > 0).sort((a, b) => b[mode] - a[mode]).map((p) =>
          `<circle class="bubble" data-port="${p.name}" cx="${p.mx}" cy="${p.my}" r="${R(p[mode])}" style="fill:${fill};stroke:${stroke}"></circle>`).join("")}</svg>`;
      sv.querySelectorAll(".bubble").forEach((b) => {
        b.addEventListener("mousemove", (ev) => {
          const p = P.find((x) => x.name === b.dataset.port);
          tip.innerHTML = `<h4>${p.name} <span style="font-size:.7rem;color:var(--text-dim)">${I.t("sea." + p.sea)}</span></h4>
            <div class="row"><span>${I.t("map.tt.cargo")}</span><b>${U.fmt(p.yuk_ton)} ${I.unit("ton")}</b></div>
            <div class="row"><span>${I.t("map.tt.cont")}</span><b>${U.fmt(p.konteyner_teu)} TEU</b></div>`;
          const r = frame.getBoundingClientRect();
          tip.style.left = ev.clientX - r.left + "px"; tip.style.top = ev.clientY - r.top + "px"; tip.classList.add("show");
        });
        b.addEventListener("mouseleave", () => tip.classList.remove("show"));
      });
    }
    draw();
    frame.querySelectorAll(".controls button").forEach((btn) => btn.addEventListener("click", () => {
      frame.querySelectorAll(".controls button").forEach((x) => x.classList.remove("on"));
      btn.classList.add("on"); mode = btn.dataset.mode; draw();
    }));
  })();

  /* Tablo */
  (function table() {
    const t = document.getElementById("portsTable");
    let sortKey = "yuk_ton", asc = false;
    function render() {
      const rows = [...P].sort((a, b) => (asc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]));
      t.innerHTML = `<thead><tr>
        <th data-k="name">${I.t("map.th.port")}</th><th data-k="sea">${I.t("map.th.sea")}</th>
        <th data-k="yuk_ton" style="cursor:pointer">${I.t("map.cargo")} ↕</th>
        <th data-k="konteyner_teu" style="cursor:pointer">${I.t("map.cont")} ↕</th></tr></thead>
        <tbody>${rows.map((p) => `<tr>
          <td><b>${p.name}</b></td><td style="color:var(--text-dim)">${I.t("sea." + p.sea)}</td>
          <td>${U.fmt(p.yuk_ton)}</td><td>${U.fmt(p.konteyner_teu)}</td></tr>`).join("")}</tbody>`;
      t.querySelectorAll("th[data-k='yuk_ton'],th[data-k='konteyner_teu']").forEach((th) =>
        th.addEventListener("click", () => { const k = th.dataset.k; asc = k === sortKey ? !asc : false; sortKey = k; render(); }));
    }
    render();
  })();

  window.MDScan && window.MDScan();
  }

  (window.MD_READY || Promise.resolve()).then(start);
})();
