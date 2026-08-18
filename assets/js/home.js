/* ============================================================
   home.js — anasayfa: saf KPI dashboard
   Sadece çarpıcı büyük istatistik kartları
   ============================================================ */
(function () {
  "use strict";
  const D = window.MARITIME_DATA;
  if (!D) return;
  const U = window.MDUtil, C = window.MDCharts, H = D.headline, T = D.trend;
  const icon = window.__icon, arrow = window.__arrow;

  // KPI tanımları — her biri veriden gelir
  const KPIS = [
    { key: "yuk_ton", href: "yuk.html", ic: "yuk", c: "--c-yuk", unit: "ton",
      label: "Elleçlenen Yük", sub: "Limanlarda gemilere yüklenen ve indirilen toplam yük", trend: T.yuk_ton },
    { key: "konteyner_teu", href: "konteyner.html", ic: "konteyner", c: "--c-konteyner", unit: "TEU",
      label: "Konteyner", sub: "Standart konteyner (TEU) elleçleme", trend: T.konteyner_teu },
    { key: "gemi_sayisi", href: "gemi.html", ic: "gemi", c: "--c-gemi", unit: "gemi",
      label: "Uğrayan Gemi", sub: "Limanlarımıza gelen gemi sayısı", trend: T.gemi_gros_ton },
    { key: "bogaz_gecis", href: "bogazlar.html", ic: "bogaz", c: "--c-bogaz", unit: "geçiş",
      label: "Boğaz Gemi Geçişi", sub: "İstanbul Boğazı'ndan geçen gemi sayısı", trend: null },
    { key: "kruvaziyer_yolcu", href: "kruvaziyer.html", ic: "kruvaziyer", c: "--c-kruvaziyer", unit: "yolcu",
      label: "Kruvaziyer Yolcusu", sub: "Türkiye limanlarını ziyaret eden yolcular", trend: T.kruvaziyer_yolcu },
    { key: "roro_arac", href: "roro.html", ic: "roro", c: "--c-roro", unit: "araç",
      label: "RO-RO ile Araç", sub: "Denizyoluyla taşınan araç sayısı", trend: T.roro_arac_yil },
    { key: "kabotaj_yolcu", href: "kabotaj.html", ic: "kabotaj", c: "--c-kabotaj", unit: "yolcu",
      label: "Kabotaj Yolcusu", sub: "İç sularda vapur ve feribotla taşınan yolcu", trend: T.kabotaj_yolcu },
    { key: "filo_gemi", href: "filo.html", ic: "filo", c: "--c-filo", unit: "gemi",
      label: "Türk Ticaret Filosu", sub: "1.000 GT ve üzeri Türk bayraklı gemi", trend: null },
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
        <span class="kpi-label">${k.label}</span>
        ${delta}
      </div>
      <div class="kpi-num"><span data-count="${hv.v.replace(",", ".")}" data-dec="${hv.v.includes(",") ? 1 : 0}">${hv.v}</span><span class="kpi-unit">${hv.u} ${k.unit}</span></div>
      <div class="kpi-spark" id="spark-${k.key}"></div>
      <div class="kpi-sub">${k.sub}</div>
      <span class="kpi-go">Ayrıntılı incele ${arrow("right")}</span>
    </a>`;
  }

  function render() {
    const grid = document.getElementById("kpiGrid");
    if (!grid) return;
    grid.innerHTML = KPIS.map(card).join("");
    // sparkline'ları çiz
    setTimeout(() => {
      KPIS.forEach((k) => {
        if (!k.trend) return;
        const host = document.getElementById("spark-" + k.key);
        const ys = Object.keys(k.trend).sort();
        C.spark(host, ys.map((y) => k.trend[y]), getComputedStyle(document.documentElement).getPropertyValue(k.c).trim());
      });
      window.MDScan && window.MDScan();
    }, 60);
  }

  document.addEventListener("DOMContentLoaded", () => {
    render();
    window.MDObserve && window.MDObserve();
  });
})();
