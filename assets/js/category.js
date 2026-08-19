/* ============================================================
   category.js — kategori sayfası
   SOL: filtre paneli · SAĞ: detaylı grafik-dashboard · ALT: Excel arşivi
   ============================================================ */
(function () {
  "use strict";
  if (!window.MARITIME_DATA) return;
  const U = window.MDUtil, C = window.MDCharts;
  let H, P, T; // veri hazır olunca doldurulur
  const A = window.ARCHIVE_DATA || {};
  const icon = window.__icon, arrow = window.__arrow;
  const t = window.t || ((k) => k);
  const loc = (window.MDLang && window.MDLang.locale()) || "tr-TR";
  const GOV = "https://denizcilikistatistikleri.uab.gov.tr";
  const nf = U.fmt;

  const CFG = {
    yuk: { title: "Yük İstatistikleri", ic: "yuk", accent: "--c-yuk", unit: "ton",
      headKey: "yuk_ton", portField: "yuk_ton", trendKey: "yuk_ton", trendName: "Elleçlenen yük", trendUnit: "ton",
      arch: "yuk" },
    konteyner: { title: "Konteyner İstatistikleri", ic: "konteyner", accent: "--c-konteyner", unit: "TEU",
      headKey: "konteyner_teu", portField: "konteyner_teu", trendKey: "konteyner_teu", trendName: "Konteyner", trendUnit: "TEU",
      arch: "konteyner" },
    gemi: { title: "Gemi İstatistikleri", ic: "gemi", accent: "--c-gemi", unit: "gemi",
      headKey: "gemi_sayisi", trendKey: "gemi_gros_ton", trendName: "Uğrayan gemilerin toplam büyüklüğü", trendUnit: "gros ton",
      arch: "gemi" },
    kruvaziyer: { title: "Kruvaziyer İstatistikleri", ic: "kruvaziyer", accent: "--c-kruvaziyer", unit: "yolcu",
      headKey: "kruvaziyer_yolcu", trendKey: "kruvaziyer_yolcu", trendName: "Kruvaziyer yolcusu", trendUnit: "kişi",
      arch: "kruvaziyer" },
    roro: { title: "RO-RO Araç İstatistikleri", ic: "roro", accent: "--c-roro", unit: "araç",
      headKey: "roro_arac", trendKey: "roro_arac_yil", trendName: "Taşınan araç", trendUnit: "araç",
      arch: "roro" },
    kabotaj: { title: "Kabotaj İstatistikleri", ic: "kabotaj", accent: "--c-kabotaj", unit: "yolcu",
      headKey: "kabotaj_yolcu", trendKey: "kabotaj_yolcu", trendName: "Kabotaj yolcusu", trendUnit: "kişi",
      arch: "kabotaj" },
    bogazlar: { title: "Türk Boğazları Gemi Geçiş İstatistikleri", ic: "bogaz", accent: "--c-bogaz", unit: "gemi",
      headKey: "bogaz_gecis", trendKey: null, trendName: "Boğaz gemi geçişi", trendUnit: "gemi",
      arch: "bogazlar" },
    filo: { title: "Filo İstatistikleri", ic: "filo", accent: "--c-filo", unit: "gemi",
      headKey: "filo_gemi", trendKey: null, trendName: "Filo", trendUnit: "gemi",
      arch: "filo" },
  };

  const cat = document.body.dataset.cat;
  const cfg = CFG[cat];
  const host = document.getElementById("pageContent");
  if (!cfg || !host) return;
  document.title = t("cat." + cat) + " — " + t("site.title");

  const SEAS = ["Marmara", "Ege", "Akdeniz", "Karadeniz"];
  // Veri hazır olunca doldurulur:
  let m, accent, trendYears, state;

  function buildSkeleton() {
    host.innerHTML = `
    <section class="page-hero"><div class="wrap">
      <div class="breadcrumb"><a href="index.html">${t("nav.home")}</a> ${arrow("right")} <span>${t("cat." + cat)}</span></div>
      <div class="page-title">
        <span class="page-icon" style="color:${accent}">${icon(cfg.ic)}</span>
        <h1>${t("cat." + cat)}</h1>
      </div>
    </div></section>

    <section class="cat-wrap"><div class="wrap">
      <div class="cat-layout">
        <aside class="cat-filters" id="catFilters"></aside>
        <div class="cat-dash" id="catDash"></div>
      </div>

      <div class="cat-archive" id="catArchive"></div>
    </div></section>`;
  }

  /* ---------- Filtre paneli ---------- */
  function renderFilters() {
    const box = document.getElementById("catFilters");
    let html = `<div class="filter-head">${icon(cfg.ic)} <span>${t("ui.filter")}</span></div>`;

    if (trendYears.length) {
      html += `<div class="filter-group"><label>${t("ui.year")}</label><div class="filter-years">` +
        trendYears.slice().reverse().map((y) =>
          `<button data-year="${y}" class="${+y === state.year ? "on" : ""}">${y}</button>`).join("") +
        `</div></div>`;
    }
    if (cfg.portField) {
      html += `<div class="filter-group"><label>${t("ui.region")}</label><div class="filter-regions">` +
        `<button data-region="all" class="${state.region === "all" ? "on" : ""}">${t("ui.all")}</button>` +
        SEAS.map((s) => `<button data-region="${s}" class="${state.region === s ? "on" : ""}">${s}</button>`).join("") +
        `</div></div>`;
      html += `<div class="filter-note">Liman kırılımı en güncel yıla (${m.yil}) aittir.</div>`;
    }
    if (!trendYears.length && !cfg.portField) {
      html += `<div class="filter-note">Bu kategori için ${m.yil} yılı özet verisi gösterilmektedir. Tüm yılların ayrıntılı dosyaları aşağıdaki arşivdedir.</div>`;
    }

    html += `<a class="btn btn-ghost filter-src" href="${GOV}/${A[cfg.arch] ? A[cfg.arch].slug : ""}" target="_blank" rel="noopener">
      ${t("ui.source")} <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg></a>`;
    box.innerHTML = html;

    box.querySelectorAll("[data-year]").forEach((b) =>
      b.addEventListener("click", () => { state.year = +b.dataset.year; renderFilters(); renderDash(); }));
    box.querySelectorAll("[data-region]").forEach((b) =>
      b.addEventListener("click", () => { state.region = b.dataset.region; renderFilters(); renderDash(); }));
  }

  /* ---------- Sağ dashboard ---------- */
  function renderDash() {
    const box = document.getElementById("catDash");
    const isLatest = state.year === m.yil;
    const val = cfg.trend ? cfg.trend[state.year] : m.deger;
    const hv = U.human(val);
    const hasYoy = isLatest && typeof m.yoy === "number";
    const up = m.yoy >= 0;

    // Kart: seçili yıl değeri
    let head = `<div class="dash-stat" style="--kc:${accent}">
      <div class="ds-top"><span class="ds-ic">${icon(cfg.ic)}</span>
        <span class="ds-label">${cfg.trendName}</span>
        ${hasYoy ? `<span class="kpi-delta ${up ? "up" : "down"}">${up ? arrow("up") : arrow("down")} %${Math.abs(m.yoy).toString().replace(".", ",")}</span>`
          : `<span class="kpi-year">${state.year}</span>`}
      </div>
      <div class="ds-num">${hv.v} <span class="ds-unit">${hv.u} ${cfg.unit}</span></div>
      <div class="ds-sub">${state.year} yılı${hasYoy ? ` · ${m.yil - 1}'e göre ${up ? "artış" : "azalış"}` : ""}${m.not ? " · " + m.not : ""}</div>
    </div>`;

    // Grafik kutuları
    let cards = "";
    if (cfg.trend) cards += `<div class="dash-card"><h3>${t("cat.trendTitle")}</h3><p class="csub">${cfg.trendName} (${cfg.trendUnit})</p><div class="chart-holder" id="dTrend"></div></div>`;
    if (cfg.portField) {
      cards += `<div class="dash-card"><h3>${t("cat.portsTitle")}${state.region !== "all" ? " — " + state.region : ""}</h3><p class="csub">${m.yil} · seçili bölgedeki limanlar</p><div class="chart-holder" id="dPorts"></div></div>`;
      cards += `<div class="dash-card"><h3>Harita üzerinde</h3><p class="csub">Balon büyüklüğü limanın hacmini gösterir</p><div class="chart-holder mapviz" id="dMap"></div></div>`;
    }

    box.innerHTML = head + `<div class="dash-cards">${cards}</div>`;

    setTimeout(() => {
      if (cfg.trend) {
        const ys = Object.keys(cfg.trend).sort();
        C.lineArea(document.getElementById("dTrend"), { labels: ys, unit: cfg.trendUnit,
          series: [{ name: cfg.trendName, color: accent, values: ys.map((y) => cfg.trend[y]) }] });
      }
      if (cfg.portField) {
        let ports = P.filter((p) => p[cfg.portField] > 0);
        if (state.region !== "all") ports = ports.filter((p) => p.sea === state.region);
        const top = [...ports].sort((a, b) => b[cfg.portField] - a[cfg.portField]).slice(0, 10);
        C.bars(document.getElementById("dPorts"), { unit: cfg.unit, items: top.map((p) => ({ label: p.name, value: p[cfg.portField], color: accent })) });
        drawMap(document.getElementById("dMap"), ports);
      }
    }, 50);
  }

  function drawMap(hostEl, ports) {
    const max = Math.max(...ports.map((p) => p[cfg.portField]));
    const R = (v) => 5 + 30 * Math.sqrt(v / max);
    const fill = accent + "44", stroke = accent;
    hostEl.innerHTML = `<svg class="bigmap" viewBox="${D.map.viewBox}" preserveAspectRatio="xMidYMid meet">
      ${D.map.outline.map((d) => `<path class="land" d="${d}"></path>`).join("")}
      ${[...ports].sort((a, b) => b[cfg.portField] - a[cfg.portField]).map((p) =>
        `<circle class="bubble" cx="${p.mx}" cy="${p.my}" r="${R(p[cfg.portField])}" style="fill:${fill};stroke:${stroke}"><title>${p.name}: ${nf(p[cfg.portField])} ${cfg.unit}</title></circle>`).join("")}
    </svg>`;
  }

  /* ---------- Alt: Dosyalar sayfasına bağlantı ---------- */
  function renderArchive() {
    const box = document.getElementById("catArchive");
    const a = A[cfg.arch];
    if (!box) return;
    if (!a) { box.innerHTML = ""; return; }
    const total = Object.values(a.yillar).reduce((s2, v) => s2 + v.length, 0);
    box.innerHTML = `<a class="files-cta" href="dosyalar.html?kat=${cfg.arch}">
      <span class="fc-ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 3v5h5M7 3h8l5 5v11a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"/></svg></span>
      <span class="fc-tx"><b>${t("ui.viewFiles")}</b><span>${total.toLocaleString(loc)} ${t("ui.files")}</span></span>
      ${arrow("right")}</a>`;
  }

  function start() {
    const MD = window.MARITIME_DATA;
    H = MD.headline; P = MD.ports; T = MD.trend;
    cfg.trend = cfg.trendKey ? T[cfg.trendKey] : null;
    m = H[cfg.headKey];
    accent = getComputedStyle(document.documentElement).getPropertyValue(cfg.accent).trim();
    trendYears = cfg.trend ? Object.keys(cfg.trend).sort() : [];
    state = { year: m.yil, region: "all" };
    buildSkeleton();
    renderFilters();
    renderDash();
    renderArchive();
    window.MDScan && window.MDScan();
  }

  (window.MD_READY || Promise.resolve()).then(start);
})();
