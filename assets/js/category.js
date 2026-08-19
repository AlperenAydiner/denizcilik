/* ============================================================
   category.js — kategori sayfası
   SOL: filtre (yıl dropdown + çoktan seçmeli ay + seri/bölge)
   SAĞ: KPI + kategoriye özel en az 2 grafik
   ============================================================ */
(function () {
  "use strict";
  if (!window.MARITIME_DATA) return;
  const U = window.MDUtil, C = window.MDCharts;
  const A = window.ARCHIVE_DATA || {};
  const icon = window.__icon, arrow = window.__arrow;
  const t = window.t || ((k) => k);
  const loc = (window.MDLang && window.MDLang.locale()) || "tr-TR";

  const M_TR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
  const M_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const lang = () => (window.MDLang && window.MDLang.get()) || "tr";
  const MON = () => (lang() === "en" ? M_EN : M_TR);
  const nm = (o) => (lang() === "en" ? o.en : o.tr);

  /* Kategori yapılandırması — seriler gerçek Excel sütunlarından türetildi */
  const CFG = {
    yuk: {
      ic: "yuk", accent: "--c-yuk", unit: "unit.ton", headKey: "yuk_ton", arch: "yuk",
      trendKey: "yuk_ton",
      series: [{ k: "yukleme", tr: "Yükleme", en: "Loading" },
               { k: "bosaltma", tr: "Boşaltma", en: "Unloading" }],
      donut: { dim: "kargo_tipi", tr: "Kargo tipine göre", en: "By cargo type" },
      barsDim: { dim: "ulke", tr: "En çok yük taşınan ülkeler", en: "Top partner countries", top: 10 },
    },
    konteyner: {
      ic: "konteyner", accent: "--c-konteyner", unit: "unit.teu", headKey: "konteyner_teu", arch: "konteyner",
      trendKey: "konteyner_teu",
      series: [{ k: "yukleme", tr: "Yükleme", en: "Loading" },
               { k: "bosaltma", tr: "Boşaltma", en: "Unloading" }],
      split: true,
      barsDim: { dim: "ulke", tr: "En çok konteyner taşınan ülkeler", en: "Top partner countries", top: 10 },
    },
    gemi: {
      ic: "gemi", accent: "--c-gemi", unit: "unit.gemi", headKey: "gemi_sayisi", arch: "gemi",
      trendKey: "gemi_gros_ton",
      series: [{ k: "turk", tr: "Türk bayraklı", en: "Turkish flag" },
               { k: "yabanci", tr: "Yabancı bayraklı", en: "Foreign flag" }],
      split: true, splitTitleTr: "Bayrak dağılımı", splitTitleEn: "Flag split",
    },
    kruvaziyer: {
      ic: "kruvaziyer", accent: "--c-kruvaziyer", unit: "unit.yolcu", headKey: "kruvaziyer_yolcu", arch: "kruvaziyer",
      trendKey: "kruvaziyer_yolcu",
      series: [{ k: "gelen", tr: "Gelen", en: "Inbound" },
               { k: "giden", tr: "Giden", en: "Outbound" },
               { k: "transit", tr: "Transit", en: "Transit" }],
      split: true, splitTitleTr: "Yolcu yönü", splitTitleEn: "Passenger direction",
    },
    roro: {
      ic: "roro", accent: "--c-roro", unit: "unit.arac", headKey: "roro_arac", arch: "roro",
      trendKey: "roro_arac_yil",
      series: [{ k: "gelen", tr: "Gelen araç", en: "Inbound" },
               { k: "giden", tr: "Giden araç", en: "Outbound" }],
      split: true, splitTitleTr: "Araç yönü", splitTitleEn: "Vehicle direction",
      barsDim: { dim: "arac_cinsi", tr: "Araç cinsine göre", en: "By vehicle type", top: 10 },
    },
    bogazlar: { ic: "bogaz", accent: "--c-bogaz", unit: "unit.gecis", headKey: "bogaz_gecis", arch: "bogazlar",
      trendKey: null, series: [] },
    kabotaj: { ic: "kabotaj", accent: "--c-kabotaj", unit: "unit.yolcu", headKey: "kabotaj_yolcu", arch: "kabotaj",
      trendKey: "kabotaj_yolcu", series: [],
      dual: { a: "kabotaj_yolcu", aTr: "Yolcu", aEn: "Passengers", b: "kabotaj_arac", bTr: "Araç", bEn: "Vehicles" } },
    filo: { ic: "filo", accent: "--c-filo", unit: "unit.gemi", headKey: "filo_gemi", arch: "filo",
      trendKey: null, series: [], useDetailTrend: true,
      barsDim: { dim: "gemi_cinsi", tr: "Gemi cinsine göre", en: "By ship type", top: 12 },
      donut: { dim: "gemi_cinsi", tr: "Filo bileşimi", en: "Fleet composition" } },
  };

  const cat = document.body.dataset.cat;
  const cfg = CFG[cat];
  const host = document.getElementById("pageContent");
  if (!cfg || !host) return;

  let H, P, T, DET, accent, alt2, m, state, years;

  const mRows = () => DET.monthly.filter((r) => r.kategori === cat);
  const pRows = () => DET.ports.filter((r) => r.kategori === cat);
  const bRows = () => DET.breakdown.filter((r) => r.kategori === cat);

  // Kategori yıllık trendi: DB trend → detail trend → aylık toplamdan türet
  function catTrend() {
    if (cfg.trendKey && T[cfg.trendKey]) return T[cfg.trendKey];
    if (cfg.useDetailTrend && DET.trend && Object.keys(DET.trend).length) return DET.trend;
    // aylık "toplam" serisinden yıllık toplam (sadece 12 ayı tam olan yıllar)
    const byYear = {};
    mRows().filter((r) => r.seri === "toplam").forEach((r) => {
      byYear[r.yil] = byYear[r.yil] || { sum: 0, months: new Set() };
      byYear[r.yil].sum += r.deger; byYear[r.yil].months.add(r.ay);
    });
    const out = {};
    Object.keys(byYear).forEach((y) => { if (byYear[y].months.size === 12) out[y] = byYear[y].sum; });
    return Object.keys(out).length >= 2 ? out : null;
  }

  const monthsFor = (y) => [...new Set(mRows().filter((r) => r.yil === y).map((r) => r.ay))].sort((a, b) => a - b);
  function mVal(y, mo, seri) {
    const r = mRows().find((x) => x.yil === y && x.ay === mo && x.seri === seri);
    return r ? r.deger : 0;
  }
  const sumSel = (seri) => state.months.reduce((s, mo) => s + mVal(state.year, mo, seri), 0);

  /* ---------- İskelet ---------- */
  function skeleton() {
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

  /* ---------- Filtreler ---------- */
  function renderFilters() {
    const box = document.getElementById("catFilters");
    const avail = monthsFor(state.year);
    let h = `<div class="filter-head">${icon(cfg.ic)} <span>${t("ui.filter")}</span></div>`;

    h += `<div class="filter-group"><label for="fYear">${t("ui.year")}</label>
      <select class="filter-select" id="fYear">
        ${years.map((y) => `<option value="${y}"${y === state.year ? " selected" : ""}>${y}</option>`).join("")}
      </select></div>`;

    if (avail.length) {
      h += `<div class="filter-group">
        <label>${t("ui.month")}<span class="filter-actions">
          <button type="button" data-mall>${t("ui.all")}</button>
          <button type="button" data-mnone>${t("ui.clear")}</button></span></label>
        <div class="filter-months">${avail.map((mo) =>
          `<button type="button" data-month="${mo}" class="${state.months.includes(mo) ? "on" : ""}">${MON()[mo - 1]}</button>`).join("")}</div>
        <div class="filter-note">${state.months.length}/${avail.length} ${t("ui.monthSelected")}</div>
      </div>`;
    }

    if (cfg.series.length) {
      h += `<div class="filter-group"><label>${t("ui.series")}</label><div class="filter-regions">
        <button type="button" data-seri="toplam" class="${state.seri === "toplam" ? "on" : ""}">${t("ui.total")}</button>
        ${cfg.series.map((s) => `<button type="button" data-seri="${s.k}" class="${state.seri === s.k ? "on" : ""}">${nm(s)}</button>`).join("")}
      </div></div>`;
    }

    if (pRows().length) {
      const SEAS = ["Marmara", "Ege", "Akdeniz", "Karadeniz"];
      h += `<div class="filter-group"><label>${t("ui.region")}</label><div class="filter-regions">
        <button type="button" data-region="all" class="${state.region === "all" ? "on" : ""}">${t("ui.all")}</button>
        ${SEAS.map((s) => `<button type="button" data-region="${s}" class="${state.region === s ? "on" : ""}">${s}</button>`).join("")}
      </div></div>`;
    }

    h += `<a class="btn btn-ghost filter-src" href="dosyalar.html?kat=${cfg.arch}">${t("ui.viewFiles")} ${arrow("right")}</a>`;
    box.innerHTML = h;

    box.querySelector("#fYear").addEventListener("change", (e) => {
      state.year = +e.target.value;
      state.months = monthsFor(state.year);
      renderFilters(); renderDash();
    });
    box.querySelectorAll("[data-month]").forEach((b) => b.addEventListener("click", () => {
      const mo = +b.dataset.month, i = state.months.indexOf(mo);
      if (i >= 0) { if (state.months.length > 1) state.months.splice(i, 1); } else state.months.push(mo);
      state.months.sort((x, y) => x - y);
      renderFilters(); renderDash();
    }));
    const bAll = box.querySelector("[data-mall]"), bNone = box.querySelector("[data-mnone]");
    if (bAll) bAll.addEventListener("click", () => { state.months = monthsFor(state.year); renderFilters(); renderDash(); });
    if (bNone) bNone.addEventListener("click", () => { state.months = monthsFor(state.year).slice(0, 1); renderFilters(); renderDash(); });
    box.querySelectorAll("[data-seri]").forEach((b) => b.addEventListener("click", () => {
      state.seri = b.dataset.seri; renderFilters(); renderDash();
    }));
    box.querySelectorAll("[data-region]").forEach((b) => b.addEventListener("click", () => {
      state.region = b.dataset.region; renderFilters(); renderDash();
    }));
  }

  /* ---------- Dashboard ---------- */
  function renderDash() {
    const box = document.getElementById("catDash");
    const avail = monthsFor(state.year), unit = t(cfg.unit);
    const partial = avail.length && state.months.length < avail.length;

    let val, sub;
    if (avail.length) {
      val = sumSel(state.seri);
      sub = `${state.year} · ${state.months.map((x) => MON()[x - 1]).join(", ")}`;
    } else {
      const tr = cfg.trendKey && T[cfg.trendKey];
      val = (tr && tr[state.year]) || m.deger;
      sub = String(state.year);
    }
    const hv = U.human(val);
    const seriName = state.seri === "toplam" ? t("ui.total")
      : nm(cfg.series.find((s) => s.k === state.seri) || { tr: "", en: "" });

    let delta = "";
    if (avail.length && monthsFor(state.year - 1).length) {
      const prev = state.months.reduce((s, mo) => s + mVal(state.year - 1, mo, state.seri), 0);
      if (prev > 0) {
        const pct = ((val - prev) / prev) * 100, up = pct >= 0;
        delta = `<span class="kpi-delta ${up ? "up" : "down"}">${up ? arrow("up") : arrow("down")} %${Math.abs(pct).toFixed(1).replace(".", ",")}</span>`;
      }
    }

    const head = `<div class="dash-stat" style="--kc:${accent}">
      <div class="ds-top"><span class="ds-ic">${icon(cfg.ic)}</span>
        <span class="ds-label">${seriName}</span>${delta || `<span class="kpi-year">${state.year}</span>`}</div>
      <div class="ds-num">${hv.v} <span class="ds-unit">${hv.u} ${unit}</span></div>
      <div class="ds-sub">${sub}${partial ? " · " + t("ui.partial") : ""}</div>
    </div>`;

    const card = (id, title, s2) =>
      `<div class="dash-card"><h3>${title}</h3>${s2 ? `<p class="csub">${s2}</p>` : ""}<div class="chart-holder" id="${id}"></div></div>`;

    let cards = "";
    if (avail.length) cards += card("dMonth", t("cat.monthTitle"), `${state.year} · ${unit}`);
    if (catTrend()) cards += card("dTrend", t("cat.trendTitle"), unit);
    if (cfg.dual) cards += card("dDual", t("cat.trendTitle"), "");
    if (pRows().length) cards += card("dPorts", t("cat.portsTitle") + (state.region !== "all" ? " — " + state.region : ""), `${state.year} · ${unit}`);
    if (cfg.split && cfg.series.length > 1)
      cards += card("dSplit", lang() === "en" ? (cfg.splitTitleEn || "Split") : (cfg.splitTitleTr || "Dağılım"), String(state.year));
    if (cfg.donut && bRows().some((r) => r.boyut === cfg.donut.dim)) cards += card("dDonut", nm(cfg.donut), unit);
    if (cfg.barsDim && bRows().some((r) => r.boyut === cfg.barsDim.dim)) cards += card("dBars", nm(cfg.barsDim), unit);

    box.innerHTML = head + `<div class="dash-cards">${cards}</div>`;
    setTimeout(draw, 40);
  }

  function draw() {
    const unit = t(cfg.unit), avail = monthsFor(state.year);
    const cs = getComputedStyle(document.documentElement);
    const palette = ["--c-yuk", "--c-konteyner", "--c-gemi", "--c-kruvaziyer", "--c-roro", "--c-bogaz"]
      .map((v) => cs.getPropertyValue(v).trim());
    // Uyumlu seri renkleri: accent'ten türeyen bir ramp
    const ramp = [accent, cs.getPropertyValue("--sea-600").trim(), cs.getPropertyValue("--sky-300").trim()];

    const mh = document.getElementById("dMonth");
    if (mh && avail.length) {
      const labels = avail.map((x) => MON()[x - 1]);
      const series = cfg.series.length
        ? cfg.series.map((s, i) => ({ name: nm(s), color: ramp[i % ramp.length],
            values: avail.map((mo) => mVal(state.year, mo, s.k)) }))
        : [{ name: t("ui.total"), color: accent, values: avail.map((mo) => mVal(state.year, mo, "toplam")) }];
      C.columns(mh, { labels, series, unit, stacked: cfg.series.length > 1 });
    }

    const th = document.getElementById("dTrend");
    const tr = catTrend();
    if (th && tr) {
      const ys = Object.keys(tr).sort();
      C.lineArea(th, { labels: ys, unit, series: [{ name: t("cat.trendTitle"), color: accent, values: ys.map((y) => tr[y]) }] });
    }

    const dh = document.getElementById("dDual");
    if (dh && cfg.dual) {
      const a = T[cfg.dual.a] || {}, b = T[cfg.dual.b] || {}, ys = Object.keys(a).sort();
      C.lineArea(dh, { labels: ys, unit: "", series: [
        { name: lang() === "en" ? cfg.dual.aEn : cfg.dual.aTr, color: accent, values: ys.map((y) => a[y] || 0) },
        { name: lang() === "en" ? cfg.dual.bEn : cfg.dual.bTr, color: palette[2], values: ys.map((y) => b[y] || 0) }] });
    }

    const ph = document.getElementById("dPorts");
    if (ph) {
      const seri = cfg.series.length && state.seri !== "toplam" ? state.seri : "toplam";
      const yrs = [...new Set(pRows().filter((r) => r.seri === seri).map((r) => r.yil))];
      const useYear = yrs.includes(state.year) ? state.year : Math.max(...yrs);
      let rows = pRows().filter((r) => r.yil === useYear && r.seri === seri && r.deger > 0);
      if (state.region !== "all") {
        const inR = new Set(P.filter((p) => p.sea === state.region).map((p) => p.name));
        rows = rows.filter((r) => inR.has(r.liman));
      }
      const top = rows.sort((a, b) => b.deger - a.deger).slice(0, 10);
      if (top.length) C.bars(ph, { unit, items: top.map((r) => ({ label: r.liman, value: r.deger, color: accent })) });
      else ph.innerHTML = `<p class="csub">${t("cat.noPortData")}</p>`;
    }

    const sh = document.getElementById("dSplit");
    if (sh) {
      const items = cfg.series.map((s, i) => ({ label: nm(s), value: sumSel(s.k), color: ramp[i % ramp.length] }))
        .filter((x) => x.value > 0);
      if (items.length > 1) C.donut(sh, { unit, items });
      else sh.innerHTML = `<p class="csub">—</p>`;
    }

    const dnh = document.getElementById("dDonut");
    if (dnh && cfg.donut) {
      const rows = bRows().filter((r) => r.boyut === cfg.donut.dim);
      const yr = Math.max(...rows.map((r) => r.yil));
      const items = rows.filter((r) => r.yil === yr).sort((a, b) => b.deger - a.deger).slice(0, 6)
        .map((r, i) => ({ label: short(r.etiket), value: r.deger, color: palette[i % palette.length] }));
      if (items.length) C.donut(dnh, { unit, items });
    }

    const bh = document.getElementById("dBars");
    if (bh && cfg.barsDim) {
      const rows = bRows().filter((r) => r.boyut === cfg.barsDim.dim);
      const yr = Math.max(...rows.map((r) => r.yil));
      const items = rows.filter((r) => r.yil === yr).sort((a, b) => b.deger - a.deger).slice(0, cfg.barsDim.top)
        .map((r) => ({ label: short(r.etiket), value: r.deger, color: accent }));
      if (items.length) C.bars(bh, { unit, items });
    }
  }

  function short(s) {
    const p = String(s).split("/");
    const v = lang() === "en" && p[1] ? p[1] : p[0];
    return v.replace(/^[\s\-–]+/, "").trim().slice(0, 26);
  }

  function renderArchive() {
    const box = document.getElementById("catArchive");
    const a = A[cfg.arch];
    if (!box) return;
    if (!a) { box.innerHTML = ""; return; }
    const total = Object.values(a.yillar).reduce((s, v) => s + v.length, 0);
    box.innerHTML = `<a class="files-cta" href="dosyalar.html?kat=${cfg.arch}">
      <span class="fc-ic"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 3v5h5M7 3h8l5 5v11a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"/></svg></span>
      <span class="fc-tx"><b>${t("ui.viewFiles")}</b><span>${total.toLocaleString(loc)} ${t("ui.files")}</span></span>
      ${arrow("right")}</a>`;
  }

  function start() {
    const MD = window.MARITIME_DATA;
    H = MD.headline; P = MD.ports; T = MD.trend;
    DET = window.DETAIL_DATA || { monthly: [], ports: [], breakdown: [] };
    m = H[cfg.headKey];
    accent = getComputedStyle(document.documentElement).getPropertyValue(cfg.accent).trim();
    document.title = t("cat." + cat) + " — " + t("site.title");

    const ys = new Set();
    mRows().forEach((r) => ys.add(r.yil));
    pRows().forEach((r) => ys.add(r.yil));
    const tr = catTrend();
    if (tr) Object.keys(tr).forEach((y) => ys.add(+y));
    if (!ys.size) ys.add(m.yil);
    years = [...ys].sort((a, b) => b - a);

    state = { year: years[0], months: [], seri: "toplam", region: "all" };
    state.months = monthsFor(state.year);

    skeleton(); renderFilters(); renderDash(); renderArchive();
    window.MDScan && window.MDScan();
  }

  (window.MD_READY || Promise.resolve()).then(start);
})();
