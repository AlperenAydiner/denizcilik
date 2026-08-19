/* ============================================================
   home.js — anasayfa: saf KPI dashboard
   Sadece çarpıcı büyük istatistik kartları
   ============================================================ */
(function () {
  "use strict";
  if (!window.MARITIME_DATA) return;
  const U = window.MDUtil, C = window.MDCharts;
  const icon = window.__icon, arrow = window.__arrow;
  const t = window.t || ((k) => k);
  // Veri Supabase'den (veya gömülü) geldiğinde doldurulur:
  let H, T;

  // KPI tanımları — trend, anahtarla (trendKey) çalışma anında okunur
  const KPIS = [
    { key: "yuk_ton", href: "yuk.html", ic: "yuk", c: "--c-yuk", unitKey: "unit.ton",
      labelKey: "kpi.yuk", trendKey: "yuk_ton" },
    { key: "konteyner_teu", href: "konteyner.html", ic: "konteyner", c: "--c-konteyner", unitKey: "unit.teu",
      labelKey: "kpi.konteyner", trendKey: "konteyner_teu" },
    { key: "gemi_sayisi", href: "gemi.html", ic: "gemi", c: "--c-gemi", unitKey: "unit.gemi",
      labelKey: "kpi.gemi", trendKey: "gemi_gros_ton" },
    { key: "bogaz_gecis", href: "bogazlar.html", ic: "bogaz", c: "--c-bogaz", unitKey: "unit.gecis",
      labelKey: "kpi.bogaz", trendKey: null },
    { key: "kruvaziyer_yolcu", href: "kruvaziyer.html", ic: "kruvaziyer", c: "--c-kruvaziyer", unitKey: "unit.yolcu",
      labelKey: "kpi.kruvaziyer", trendKey: "kruvaziyer_yolcu" },
    { key: "roro_arac", href: "roro.html", ic: "roro", c: "--c-roro", unitKey: "unit.arac",
      labelKey: "kpi.roro", trendKey: "roro_arac_yil" },
    { key: "kabotaj_yolcu", href: "kabotaj.html", ic: "kabotaj", c: "--c-kabotaj", unitKey: "unit.yolcu",
      labelKey: "kpi.kabotaj", trendKey: "kabotaj_yolcu" },
    { key: "filo_gemi", href: "filo.html", ic: "filo", c: "--c-filo", unitKey: "unit.gemi",
      labelKey: "kpi.filo", trendKey: null },
  ];

  function card(k) {
    const m = H[k.key];
    const hv = U.human(m.deger);
    const hasYoy = typeof m.yoy === "number";
    const up = m.yoy >= 0;
    const delta = hasYoy
      ? `<span class="kpi-delta ${up ? "up" : "down"}">${up ? arrow("up") : arrow("down")} %${Math.abs(m.yoy).toString().replace(".", ",")}</span>`
      : `<span class="kpi-year">${m.yil}</span>`;
    return `<a class="kpi-card reveal" href="${k.href}" style="--kc:var(${k.c})">
      <div class="kpi-top">
        <span class="kpi-ic">${icon(k.ic)}</span>
        <span class="kpi-label">${t(k.labelKey)}</span>
        ${delta}
      </div>
      <div class="kpi-num"><span data-count="${hv.v.replace(",", ".")}" data-dec="${hv.v.includes(",") ? 1 : 0}">${hv.v}</span><span class="kpi-unit">${hv.u} ${t(k.unitKey)}</span></div>
      <div class="kpi-spark" id="spark-${k.key}"></div>
      
      <span class="kpi-go">${t("ui.detail")} ${arrow("right")}</span>
    </a>`;
  }

  function render() {
    const grid = document.getElementById("kpiGrid");
    if (!grid) return;
    grid.innerHTML = KPIS.map(card).join("");
    // sparkline'ları çiz
    setTimeout(() => {
      KPIS.forEach((k) => {
        const tr = k.trendKey && T[k.trendKey];
        if (!tr) return;
        const host = document.getElementById("spark-" + k.key);
        const ys = Object.keys(tr).sort();
        C.spark(host, ys.map((y) => tr[y]), getComputedStyle(document.documentElement).getPropertyValue(k.c).trim());
      });
      window.MDScan && window.MDScan();
    }, 60);
  }

  function start() {
    H = window.MARITIME_DATA.headline;
    T = window.MARITIME_DATA.trend;
    render();
    window.MDObserve && window.MDObserve();
  }

  document.addEventListener("DOMContentLoaded", () => {
    (window.MD_READY || Promise.resolve()).then(start);
  });
})();
