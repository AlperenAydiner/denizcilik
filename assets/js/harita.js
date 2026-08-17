/* ============================================================
   harita.js — tam sayfa interaktif liman haritası + tablo
   ============================================================ */
(function () {
  "use strict";
  const D = window.MARITIME_DATA;
  if (!D) return;
  const U = window.MDUtil, P = D.ports;
  const host = document.getElementById("pageContent");
  if (!host) return;

  host.innerHTML = `
    <section class="page-hero"><div class="wrap">
      <div class="breadcrumb reveal"><a href="index.html">Anasayfa</a> ${window.__arrow("right")} <span>Harita</span></div>
      <h1 class="reveal">Türkiye Limanları Haritası</h1>
      <p class="intro reveal d1">Her balonun büyüklüğü o limanın hacmini gösterir. Bir limanın üzerine gelin; yük ve konteyner rakamlarını görün. Aşağıdaki tablodan limanları sıralayabilirsiniz.</p>
    </div></section>
    <section class="section" style="padding-top:10px"><div class="wrap">
      <div class="reveal" id="haritaMap"></div>
    </div></section>
    <section class="section" style="padding-top:0"><div class="wrap">
      <div class="section-head reveal"><h2>Limanlar sıralaması</h2><p>Sütun başlığına tıklayarak sıralayın.</p></div>
      <div class="chart-card reveal" style="padding:0;overflow:hidden">
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
        <button data-mode="yuk_ton" class="on">Yük (ton)</button>
        <button data-mode="konteyner_teu">Konteyner (TEU)</button></div>`;
    const sv = document.createElement("div"); frame.appendChild(sv); frame.appendChild(tip); wrap.appendChild(frame);
    function draw() {
      const vals = P.map((p) => p[mode]).filter((v) => v > 0), max = Math.max(...vals);
      const R = (v) => (v > 0 ? 6 + 34 * Math.sqrt(v / max) : 0);
      const fill = mode === "yuk_ton" ? "rgba(34,211,238,0.28)" : "rgba(245,167,66,0.28)";
      const stroke = mode === "yuk_ton" ? "var(--c-yuk)" : "var(--c-konteyner)";
      sv.innerHTML = `<svg class="bigmap" viewBox="${D.map.viewBox}" preserveAspectRatio="xMidYMid meet">
        ${D.map.outline.map((d) => `<path class="land" d="${d}"></path>`).join("")}
        ${P.filter((p) => p[mode] > 0).sort((a, b) => b[mode] - a[mode]).map((p) =>
          `<circle class="bubble" data-port="${p.name}" cx="${p.mx}" cy="${p.my}" r="${R(p[mode])}" style="fill:${fill};stroke:${stroke}"></circle>`).join("")}</svg>`;
      sv.querySelectorAll(".bubble").forEach((b) => {
        b.addEventListener("mousemove", (ev) => {
          const p = P.find((x) => x.name === b.dataset.port);
          tip.innerHTML = `<h4>${p.name} <span style="font-size:.7rem;color:var(--text-dim)">${p.sea}</span></h4>
            <div class="row"><span>Toplam yük</span><b>${U.fmt(p.yuk_ton)} ton</b></div>
            <div class="row"><span>Konteyner</span><b>${U.fmt(p.konteyner_teu)} TEU</b></div>`;
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
        <th data-k="name">Liman</th><th data-k="sea">Deniz</th>
        <th data-k="yuk_ton" style="cursor:pointer">Yük (ton) ↕</th>
        <th data-k="konteyner_teu" style="cursor:pointer">Konteyner (TEU) ↕</th></tr></thead>
        <tbody>${rows.map((p) => `<tr>
          <td><b>${p.name}</b></td><td style="color:var(--text-dim)">${p.sea}</td>
          <td>${U.fmt(p.yuk_ton)}</td><td>${U.fmt(p.konteyner_teu)}</td></tr>`).join("")}</tbody>`;
      t.querySelectorAll("th[data-k='yuk_ton'],th[data-k='konteyner_teu']").forEach((th) =>
        th.addEventListener("click", () => { const k = th.dataset.k; asc = k === sortKey ? !asc : false; sortKey = k; render(); }));
    }
    render();
  })();

  window.MDScan && window.MDScan();
})();
