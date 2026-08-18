/* ============================================================
   category.js — kategori sayfası (iki dilli)
   SOL: filtre paneli · SAĞ: detaylı grafik-dashboard
   ============================================================ */
(function () {
  "use strict";
  if (!window.MARITIME_DATA) return;
  const U = window.MDUtil, C = window.MDCharts, I = window.I18N;
  let H, P, T, MD;
  const icon = window.__icon, arrow = window.__arrow;
  const GOV = "https://denizcilikistatistikleri.uab.gov.tr";
  const A = window.ARCHIVE_DATA || {};
  const nf = U.fmt;

  const CFG = {
    yuk: { ic: "yuk", accent: "--c-yuk", unit: "ton", headKey: "yuk_ton", portField: "yuk_ton", trendKey: "yuk_ton", arch: "yuk",
      title: { tr: "Yük İstatistikleri", en: "Cargo Statistics" },
      trendName: { tr: "Elleçlenen yük", en: "Cargo handled" }, trendUnit: "ton",
      intro: { tr: "Türkiye limanlarında gemilere yüklenen ve gemilerden indirilen — yani <b>elleçlenen</b> — toplam yük.",
               en: "Total cargo loaded onto and unloaded from ships — i.e. <b>handled</b> — at Türkiye's ports." },
      insight: { tr: "Bu rakam ülkenin dış ticaretinin denizden akan bölümünün en temel göstergesidir. Yükün büyük kısmı Marmara ve Akdeniz'deki büyük limanlardan elleçlenir.",
                 en: "This figure is the core indicator of the seaborne portion of the country's foreign trade. Most cargo is handled at the large ports in the Marmara and Mediterranean regions." } },
    konteyner: { ic: "konteyner", accent: "--c-konteyner", unit: "TEU", headKey: "konteyner_teu", portField: "konteyner_teu", trendKey: "konteyner_teu", arch: "konteyner",
      title: { tr: "Konteyner İstatistikleri", en: "Container Statistics" },
      trendName: { tr: "Konteyner", en: "Container" }, trendUnit: "TEU",
      intro: { tr: "Limanlarda elleçlenen konteyner miktarı. Birim <b>TEU</b>: yirmi fitlik (yaklaşık 6 m) standart bir konteyner = 1 TEU.",
               en: "Container volume handled at ports. Unit <b>TEU</b>: one standard twenty-foot (~6 m) container = 1 TEU." },
      insight: { tr: "Konteyner trafiği işlenmiş ürün ticaretinin göstergesidir. İstikrarlı artış Türkiye'nin bir aktarma ve üretim merkezi olarak güçlendiğine işaret eder.",
                 en: "Container traffic reflects trade in manufactured goods. Steady growth signals Türkiye's strengthening role as a transhipment and production hub." } },
    gemi: { ic: "gemi", accent: "--c-gemi", unit: "gemi", headKey: "gemi_sayisi", trendKey: "gemi_gros_ton", arch: "gemi",
      title: { tr: "Gemi İstatistikleri", en: "Ship Statistics" },
      trendName: { tr: "Uğrayan gemilerin toplam büyüklüğü", en: "Total tonnage of calling ships" }, trendUnit: "gros ton",
      intro: { tr: "Türkiye limanlarına uğrayan gemilerin sayısı ve toplam büyüklüğü (gros ton).",
               en: "The number and total size (gross tons) of ships calling at Türkiye's ports." },
      insight: { tr: "Gemi sayısı sabit kalırken toplam gros tonun artması, limanlarımıza daha büyük gemilerin geldiğini gösterir.",
                 en: "When ship counts stay flat while total gross tonnage rises, it means larger ships are calling at our ports." } },
    kruvaziyer: { ic: "kruvaziyer", accent: "--c-kruvaziyer", unit: "yolcu", headKey: "kruvaziyer_yolcu", trendKey: "kruvaziyer_yolcu", arch: "kruvaziyer",
      title: { tr: "Kruvaziyer İstatistikleri", en: "Cruise Statistics" },
      trendName: { tr: "Kruvaziyer yolcusu", en: "Cruise passengers" }, trendUnit: "kişi",
      intro: { tr: "Türkiye limanlarını ziyaret eden kruvaziyer (yolcu gemisi) yolcularının sayısı.",
               en: "The number of cruise (passenger ship) travellers visiting Türkiye's ports." },
      insight: { tr: "Kruvaziyer yolcusu son yıllarda hızla toparlandı. Her yolcu, uğradığı liman şehrinde turizm geliri anlamına gelir.",
                 en: "Cruise passenger numbers have rebounded quickly in recent years. Each traveller brings tourism income to the port city they visit." } },
    roro: { ic: "roro", accent: "--c-roro", unit: "araç", headKey: "roro_arac", trendKey: "roro_arac_yil", arch: "roro",
      title: { tr: "RO-RO Araç İstatistikleri", en: "RO-RO Vehicle Statistics" },
      trendName: { tr: "Taşınan araç", en: "Vehicles carried" }, trendUnit: "araç",
      intro: { tr: "<b>RO-RO</b>, araçların tekerlekleri üzerinde gemiye girip indiği taşımacılıktır.",
               en: "<b>RO-RO</b> is transport where vehicles roll on and off the ship on their own wheels." },
      insight: { tr: "RO-RO hatları TIR ve kamyonların karayolu yerine denizi kullanmasını sağlar — hem yakıt tasarrufu hem daha az karayolu trafiği.",
                 en: "RO-RO lines let trucks use the sea instead of the road — saving fuel and easing road traffic." } },
    kabotaj: { ic: "kabotaj", accent: "--c-kabotaj", unit: "yolcu", headKey: "kabotaj_yolcu", trendKey: "kabotaj_yolcu", arch: "kabotaj",
      title: { tr: "Kabotaj İstatistikleri", en: "Cabotage Statistics" },
      trendName: { tr: "Kabotaj yolcusu", en: "Cabotage passengers" }, trendUnit: "kişi",
      intro: { tr: "<b>Kabotaj</b>, bir ülkenin kendi limanları arasında yaptığı deniz taşımacılığıdır.",
               en: "<b>Cabotage</b> is maritime transport a country carries out between its own ports." },
      insight: { tr: "Şehir hattı vapurları ve feribotlarla her yıl 100 milyondan fazla yolculuk denizden yapılıyor — deniz ulaşımının günlük hayattaki yeri.",
                 en: "City ferries and boats carry more than 100 million journeys by sea every year — showing how central maritime transport is to daily life." } },
    bogazlar: { ic: "bogaz", accent: "--c-bogaz", unit: "gemi", headKey: "bogaz_gecis", trendKey: null, arch: "bogazlar",
      title: { tr: "Türk Boğazları Gemi Geçiş İstatistikleri", en: "Turkish Straits Transit Statistics" },
      trendName: { tr: "Boğaz gemi geçişi", en: "Strait transits" }, trendUnit: "gemi",
      intro: { tr: "İstanbul ve Çanakkale Boğazları'ndan geçen gemi sayısı.",
               en: "The number of ships passing through the Istanbul and Çanakkale Straits." },
      insight: { tr: "Her gün ortalama 100'den fazla gemi İstanbul Boğazı'ndan geçiyor. Bu su yolları tüm dünya deniz ticareti için kritiktir.",
                 en: "On average, more than 100 ships pass through the Istanbul Strait each day. These waterways are critical to world maritime trade." } },
    filo: { ic: "filo", accent: "--c-filo", unit: "gemi", headKey: "filo_gemi", trendKey: null, arch: "filo",
      title: { tr: "Filo İstatistikleri", en: "Fleet Statistics" },
      trendName: { tr: "Filo", en: "Fleet" }, trendUnit: "gemi",
      intro: { tr: "Türk bayrağı taşıyan deniz ticaret filosu (1.000 GT ve üzeri).",
               en: "The Turkish-flagged merchant marine fleet (1,000 GT and over)." },
      insight: { tr: "Güçlü bir milli filo taşımacılıkta dışa bağımlılığı azaltır ve deniz ticareti gelirinin ülkede kalmasını sağlar.",
                 en: "A strong national fleet reduces dependence on foreign carriers and keeps maritime trade revenue in the country." } }
  };

  const cat = document.body.dataset.cat;
  const cfg = CFG[cat];
  const host = document.getElementById("pageContent");
  if (!cfg || !host) return;

  const SEAS = ["Marmara", "Ege", "Akdeniz", "Karadeniz"];
  let m, accent, trendYears, state, TITLE, TREND_NAME;

  function buildSkeleton() {
    host.innerHTML = `
    <section class="page-hero"><div class="wrap">
      <div class="breadcrumb"><a href="index.html">${I.t("bc.home")}</a> ${arrow("right")} <span>${TITLE}</span></div>
      <div class="page-title">
        <span class="page-icon" style="color:${accent}">${icon(cfg.ic)}</span>
        <h1>${TITLE}</h1>
      </div>
      <p class="intro">${I.p(cfg.intro)}</p>
    </div></section>

    <section class="cat-wrap"><div class="wrap">
      <div class="cat-layout">
        <aside class="cat-filters" id="catFilters"></aside>
        <div class="cat-dash" id="catDash"></div>
      </div>
    </div></section>`;
  }

  function renderFilters() {
    const box = document.getElementById("catFilters");
    let html = `<div class="filter-head">${icon(cfg.ic)} <span>${I.t("cat.filter")}</span></div>`;

    if (trendYears.length) {
      html += `<div class="filter-group"><label>${I.t("cat.year")}</label><div class="filter-years">` +
        trendYears.slice().reverse().map((y) =>
          `<button data-year="${y}" class="${+y === state.year ? "on" : ""}">${y}</button>`).join("") +
        `</div></div>`;
    }
    if (cfg.portField) {
      html += `<div class="filter-group"><label>${I.t("cat.region")}</label><div class="filter-regions">` +
        `<button data-region="all" class="${state.region === "all" ? "on" : ""}">${I.t("cat.all")}</button>` +
        SEAS.map((s) => `<button data-region="${s}" class="${state.region === s ? "on" : ""}">${I.t("sea." + s)}</button>`).join("") +
        `</div></div>`;
      html += `<div class="filter-note">${I.t("cat.noteRegion", { y: m.yil })}</div>`;
    }
    if (!trendYears.length && !cfg.portField) {
      html += `<div class="filter-note">${I.t("cat.noteSummary", { y: m.yil })}</div>`;
    }

    html += `<a class="btn btn-ghost filter-src" href="${GOV}/${A[cfg.arch] ? A[cfg.arch].slug : ""}" target="_blank" rel="noopener">
      ${I.t("cat.src")} <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg></a>`;
    box.innerHTML = html;

    box.querySelectorAll("[data-year]").forEach((b) =>
      b.addEventListener("click", () => { state.year = +b.dataset.year; renderFilters(); renderDash(); }));
    box.querySelectorAll("[data-region]").forEach((b) =>
      b.addEventListener("click", () => { state.region = b.dataset.region; renderFilters(); renderDash(); }));
  }

  function renderDash() {
    const box = document.getElementById("catDash");
    const isLatest = state.year === m.yil;
    const val = cfg.trend ? cfg.trend[state.year] : m.deger;
    const hv = U.human(val);
    const hasYoy = isLatest && typeof m.yoy === "number";
    const up = m.yoy >= 0;

    let sub = I.t("cat.yearOf", { y: state.year });
    if (hasYoy) sub += " · " + I.t("cat.vsPrev", { p: m.yil - 1, d: up ? I.t("cat.increase") : I.t("cat.decrease") });

    let head = `<div class="dash-stat" style="--kc:${accent}">
      <div class="ds-top"><span class="ds-ic">${icon(cfg.ic)}</span>
        <span class="ds-label">${TREND_NAME}</span>
        ${hasYoy ? `<span class="kpi-delta ${up ? "up" : "down"}">${up ? arrow("up") : arrow("down")} ${U.pct(m.yoy)}</span>`
          : `<span class="kpi-year">${state.year}</span>`}
      </div>
      <div class="ds-num">${hv.v} <span class="ds-unit">${hv.u} ${I.unit(cfg.unit)}</span></div>
      <div class="ds-sub">${sub}</div>
    </div>`;

    let cards = "";
    if (cfg.trend) cards += `<div class="dash-card"><h3>${I.t("cat.trend")}</h3><p class="csub">${TREND_NAME} (${I.unit(cfg.trendUnit)})</p><div class="chart-holder" id="dTrend"></div></div>`;
    if (cfg.portField) {
      cards += `<div class="dash-card"><h3>${I.t("cat.ports")}${state.region !== "all" ? " — " + I.t("sea." + state.region) : ""}</h3><p class="csub">${m.yil} · ${I.t("cat.portsSub")}</p><div class="chart-holder" id="dPorts"></div></div>`;
      cards += `<div class="dash-card"><h3>${I.t("cat.onmap")}</h3><p class="csub">${I.t("cat.bubble")}</p><div class="chart-holder mapviz" id="dMap"></div></div>`;
    }

    box.innerHTML = head +
      `<div class="insight"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/><path d="M9 21h6"/></svg><div><b>${I.t("cat.insightHead")}</b> ${I.p(cfg.insight)}</div></div>` +
      `<div class="dash-cards">${cards}</div>`;

    setTimeout(() => {
      if (cfg.trend) {
        const ys = Object.keys(cfg.trend).sort();
        C.lineArea(document.getElementById("dTrend"), { labels: ys, unit: I.unit(cfg.trendUnit),
          series: [{ name: TREND_NAME, color: accent, values: ys.map((y) => cfg.trend[y]) }] });
      }
      if (cfg.portField) {
        let ports = P.filter((p) => p[cfg.portField] > 0);
        if (state.region !== "all") ports = ports.filter((p) => p.sea === state.region);
        const top = [...ports].sort((a, b) => b[cfg.portField] - a[cfg.portField]).slice(0, 10);
        C.bars(document.getElementById("dPorts"), { unit: I.unit(cfg.unit), items: top.map((p) => ({ label: p.name, value: p[cfg.portField], color: accent })) });
        drawMap(document.getElementById("dMap"), ports);
      }
    }, 50);
  }

  function drawMap(hostEl, ports) {
    const map = MD.map;
    if (!map || !ports.length) { if (hostEl) hostEl.innerHTML = ""; return; }
    const max = Math.max(...ports.map((p) => p[cfg.portField]));
    const R = (v) => 5 + 30 * Math.sqrt(v / max);
    const fill = accent + "44", stroke = accent;
    hostEl.innerHTML = `<svg class="bigmap" viewBox="${map.viewBox}" preserveAspectRatio="xMidYMid meet">
      ${map.outline.map((d) => `<path class="land" d="${d}"></path>`).join("")}
      ${[...ports].sort((a, b) => b[cfg.portField] - a[cfg.portField]).map((p) =>
        `<circle class="bubble" cx="${p.mx}" cy="${p.my}" r="${R(p[cfg.portField])}" style="fill:${fill};stroke:${stroke}"><title>${p.name}: ${nf(p[cfg.portField])} ${I.unit(cfg.unit)}</title></circle>`).join("")}
    </svg>`;
  }

  function start() {
    MD = window.MARITIME_DATA;
    H = MD.headline; P = MD.ports; T = MD.trend;
    cfg.trend = cfg.trendKey ? T[cfg.trendKey] : null;
    m = H[cfg.headKey];
    accent = getComputedStyle(document.documentElement).getPropertyValue(cfg.accent).trim();
    trendYears = cfg.trend ? Object.keys(cfg.trend).sort() : [];
    state = { year: m.yil, region: "all" };
    TITLE = I.p(cfg.title);
    TREND_NAME = I.p(cfg.trendName);
    document.title = TITLE + " — " + I.t("brand.sub2");
    buildSkeleton();
    renderFilters();
    renderDash();
    window.MDScan && window.MDScan();
  }

  (window.MD_READY || Promise.resolve()).then(start);
})();
