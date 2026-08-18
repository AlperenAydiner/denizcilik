/* ============================================================
   home.js — anasayfa: KPI dashboard (iki dilli)
   ============================================================ */
(function () {
  "use strict";
  if (!window.MARITIME_DATA) return;
  const U = window.MDUtil, C = window.MDCharts, I = window.I18N;
  const icon = window.__icon, arrow = window.__arrow;
  let H, T;

  const KPIS = [
    { key: "yuk_ton", href: "yuk.html", ic: "yuk", c: "--c-yuk", unit: "ton",  lk: "kpi.yuk.l",  sk: "kpi.yuk.s",  trendKey: "yuk_ton" },
    { key: "konteyner_teu", href: "konteyner.html", ic: "konteyner", c: "--c-konteyner", unit: "TEU", lk: "kpi.kon.l", sk: "kpi.kon.s", trendKey: "konteyner_teu" },
    { key: "gemi_sayisi", href: "gemi.html", ic: "gemi", c: "--c-gemi", unit: "gemi", lk: "kpi.gemi.l", sk: "kpi.gemi.s", trendKey: "gemi_gros_ton" },
    { key: "bogaz_gecis", href: "bogazlar.html", ic: "bogaz", c: "--c-bogaz", unit: "geçiş", lk: "kpi.bog.l", sk: "kpi.bog.s", trendKey: null },
    { key: "kruvaziyer_yolcu", href: "kruvaziyer.html", ic: "kruvaziyer", c: "--c-kruvaziyer", unit: "yolcu", lk: "kpi.kru.l", sk: "kpi.kru.s", trendKey: "kruvaziyer_yolcu" },
    { key: "roro_arac", href: "roro.html", ic: "roro", c: "--c-roro", unit: "araç", lk: "kpi.roro.l", sk: "kpi.roro.s", trendKey: "roro_arac_yil" },
    { key: "kabotaj_yolcu", href: "kabotaj.html", ic: "kabotaj", c: "--c-kabotaj", unit: "yolcu", lk: "kpi.kab.l", sk: "kpi.kab.s", trendKey: "kabotaj_yolcu" },
    { key: "filo_gemi", href: "filo.html", ic: "filo", c: "--c-filo", unit: "gemi", lk: "kpi.filo.l", sk: "kpi.filo.s", trendKey: null }
  ];

  // Ham değeri ölçeklenmiş sayı + ondalık haneye böl (dilden bağımsız)
  function scaleParts(n) {
    const a = Math.abs(n);
    if (a >= 1e9) return { v: n / 1e9, d: 1 };
    if (a >= 1e6) return { v: n / 1e6, d: 1 };
    if (a >= 1e3) return { v: n / 1e3, d: 0 };
    return { v: n, d: 0 };
  }

  function card(k) {
    const m = H[k.key];
    const hv = U.human(m.deger);
    const sp = scaleParts(m.deger);
    const hasYoy = typeof m.yoy === "number";
    const up = m.yoy >= 0;
    const delta = hasYoy
      ? `<span class="kpi-delta ${up ? "up" : "down"}">${up ? arrow("up") : arrow("down")} ${U.pct(m.yoy)}</span>`
      : `<span class="kpi-year">${m.yil}</span>`;
    return `<a class="kpi-card reveal" href="${k.href}" style="--kc:var(${k.c})">
      <div class="kpi-top">
        <span class="kpi-ic">${icon(k.ic)}</span>
        <span class="kpi-label">${I.t(k.lk)}</span>
        ${delta}
      </div>
      <div class="kpi-num"><span data-count="${sp.v}" data-dec="${sp.d}">${hv.v}</span><span class="kpi-unit">${hv.u} ${I.unit(k.unit)}</span></div>
      <div class="kpi-spark" id="spark-${k.key}"></div>
      <div class="kpi-sub">${I.t(k.sk)}</div>
      <span class="kpi-go">${I.t("home.explore")} ${arrow("right")}</span>
    </a>`;
  }

  function render() {
    const grid = document.getElementById("kpiGrid");
    if (!grid) return;
    grid.innerHTML = KPIS.map(card).join("");
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
