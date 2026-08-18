/* ============================================================
   category.js — kategori sayfası
   SOL: filtre paneli · SAĞ: detaylı grafik-dashboard · ALT: Excel arşivi
   ============================================================ */
(function () {
  "use strict";
  const D = window.MARITIME_DATA;
  if (!D) return;
  const U = window.MDUtil, C = window.MDCharts, H = D.headline, P = D.ports, T = D.trend;
  const A = window.ARCHIVE_DATA || {};
  const icon = window.__icon, arrow = window.__arrow;
  const GOV = "https://denizcilikistatistikleri.uab.gov.tr";
  const nf = U.fmt;

  const CFG = {
    yuk: { title: "Yük İstatistikleri", ic: "yuk", accent: "--c-yuk", unit: "ton",
      intro: "Türkiye limanlarında gemilere yüklenen ve gemilerden indirilen — yani <b>elleçlenen</b> — toplam yük.",
      headKey: "yuk_ton", portField: "yuk_ton", trend: T.yuk_ton, trendName: "Elleçlenen yük", trendUnit: "ton",
      arch: "yuk", insight: "Bu rakam ülkenin dış ticaretinin denizden akan bölümünün en temel göstergesidir. Yükün büyük kısmı Marmara ve Akdeniz'deki büyük limanlardan elleçlenir." },
    konteyner: { title: "Konteyner İstatistikleri", ic: "konteyner", accent: "--c-konteyner", unit: "TEU",
      intro: "Limanlarda elleçlenen konteyner miktarı. Birim <b>TEU</b>: yirmi fitlik (yaklaşık 6 m) standart bir konteyner = 1 TEU.",
      headKey: "konteyner_teu", portField: "konteyner_teu", trend: T.konteyner_teu, trendName: "Konteyner", trendUnit: "TEU",
      arch: "konteyner", insight: "Konteyner trafiği işlenmiş ürün ticaretinin göstergesidir. İstikrarlı artış Türkiye'nin bir aktarma ve üretim merkezi olarak güçlendiğine işaret eder." },
    gemi: { title: "Gemi İstatistikleri", ic: "gemi", accent: "--c-gemi", unit: "gemi",
      intro: "Türkiye limanlarına uğrayan gemilerin sayısı ve toplam büyüklüğü (gros ton).",
      headKey: "gemi_sayisi", trend: T.gemi_gros_ton, trendName: "Uğrayan gemilerin toplam büyüklüğü", trendUnit: "gros ton",
      arch: "gemi", insight: "Gemi sayısı sabit kalırken toplam gros tonun artması, limanlarımıza daha büyük gemilerin geldiğini gösterir." },
    kruvaziyer: { title: "Kruvaziyer İstatistikleri", ic: "kruvaziyer", accent: "--c-kruvaziyer", unit: "yolcu",
      intro: "Türkiye limanlarını ziyaret eden kruvaziyer (yolcu gemisi) yolcularının sayısı.",
      headKey: "kruvaziyer_yolcu", trend: T.kruvaziyer_yolcu, trendName: "Kruvaziyer yolcusu", trendUnit: "kişi",
      arch: "kruvaziyer", insight: "Kruvaziyer yolcusu son yıllarda hızla toparlandı. Her yolcu, uğradığı liman şehrinde turizm geliri anlamına gelir." },
    roro: { title: "RO-RO Araç İstatistikleri", ic: "roro", accent: "--c-roro", unit: "araç",
      intro: "<b>RO-RO</b>, araçların tekerlekleri üzerinde gemiye girip indiği taşımacılıktır.",
      headKey: "roro_arac", trend: T.roro_arac_yil, trendName: "Taşınan araç", trendUnit: "araç",
      arch: "roro", insight: "RO-RO hatları TIR ve kamyonların karayolu yerine denizi kullanmasını sağlar — hem yakıt tasarrufu hem daha az karayolu trafiği." },
    kabotaj: { title: "Kabotaj İstatistikleri", ic: "kabotaj", accent: "--c-kabotaj", unit: "yolcu",
      intro: "<b>Kabotaj</b>, bir ülkenin kendi limanları arasında yaptığı deniz taşımacılığıdır.",
      headKey: "kabotaj_yolcu", trend: T.kabotaj_yolcu, trendName: "Kabotaj yolcusu", trendUnit: "kişi",
      arch: "kabotaj", insight: "Şehir hattı vapurları ve feribotlarla her yıl 100 milyondan fazla yolculuk denizden yapılıyor — deniz ulaşımının günlük hayattaki yeri." },
    bogazlar: { title: "Türk Boğazları Gemi Geçiş İstatistikleri", ic: "bogaz", accent: "--c-bogaz", unit: "gemi",
      intro: "İstanbul ve Çanakkale Boğazları'ndan geçen gemi sayısı.",
      headKey: "bogaz_gecis", trend: null, trendName: "Boğaz gemi geçişi", trendUnit: "gemi",
      arch: "bogazlar", insight: "Her gün ortalama 100'den fazla gemi İstanbul Boğazı'ndan geçiyor. Bu su yolları tüm dünya deniz ticareti için kritiktir." },
    filo: { title: "Filo İstatistikleri", ic: "filo", accent: "--c-filo", unit: "gemi",
      intro: "Türk bayrağı taşıyan deniz ticaret filosu (1.000 GT ve üzeri).",
      headKey: "filo_gemi", trend: null, trendName: "Filo", trendUnit: "gemi",
      arch: "filo", insight: "Güçlü bir milli filo taşımacılıkta dışa bağımlılığı azaltır ve deniz ticareti gelirinin ülkede kalmasını sağlar." },
  };

  const cat = document.body.dataset.cat;
  const cfg = CFG[cat];
  const host = document.getElementById("pageContent");
  if (!cfg || !host) return;
  document.title = cfg.title + " — T.C. UAB Denizcilik İstatistikleri";

  const m = H[cfg.headKey];
  const accent = getComputedStyle(document.documentElement).getPropertyValue(cfg.accent).trim();
  const trendYears = cfg.trend ? Object.keys(cfg.trend).sort() : [];
  const SEAS = ["Marmara", "Ege", "Akdeniz", "Karadeniz"];

  // Filtre durumu
  const state = { year: m.yil, region: "all" };

  /* ---------- İskelet ---------- */
  host.innerHTML = `
    <section class="page-hero"><div class="wrap">
      <div class="breadcrumb"><a href="index.html">Anasayfa</a> ${arrow("right")} <span>${cfg.title}</span></div>
      <div class="page-title">
        <span class="page-icon" style="color:${accent}">${icon(cfg.ic)}</span>
        <h1>${cfg.title}</h1>
      </div>
      <p class="intro">${cfg.intro}</p>
    </div></section>

    <section class="cat-wrap"><div class="wrap">
      <div class="cat-layout">
        <aside class="cat-filters" id="catFilters"></aside>
        <div class="cat-dash" id="catDash"></div>
      </div>

      <div class="cat-archive" id="catArchive"></div>
    </div></section>`;

  /* ---------- Filtre paneli ---------- */
  function renderFilters() {
    const box = document.getElementById("catFilters");
    let html = `<div class="filter-head">${icon(cfg.ic)} <span>Filtrele</span></div>`;

    if (trendYears.length) {
      html += `<div class="filter-group"><label>Yıl</label><div class="filter-years">` +
        trendYears.slice().reverse().map((y) =>
          `<button data-year="${y}" class="${+y === state.year ? "on" : ""}">${y}</button>`).join("") +
        `</div></div>`;
    }
    if (cfg.portField) {
      html += `<div class="filter-group"><label>Deniz bölgesi</label><div class="filter-regions">` +
        `<button data-region="all" class="${state.region === "all" ? "on" : ""}">Tümü</button>` +
        SEAS.map((s) => `<button data-region="${s}" class="${state.region === s ? "on" : ""}">${s}</button>`).join("") +
        `</div></div>`;
      html += `<div class="filter-note">Liman kırılımı en güncel yıla (${m.yil}) aittir.</div>`;
    }
    if (!trendYears.length && !cfg.portField) {
      html += `<div class="filter-note">Bu kategori için ${m.yil} yılı özet verisi gösterilmektedir. Tüm yılların ayrıntılı dosyaları aşağıdaki arşivdedir.</div>`;
    }

    html += `<a class="btn btn-ghost filter-src" href="${GOV}/${A[cfg.arch] ? A[cfg.arch].slug : ""}" target="_blank" rel="noopener">
      Resmi kaynak sayfası <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg></a>`;
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
    if (cfg.trend) cards += `<div class="dash-card"><h3>Yıllara göre gelişim</h3><p class="csub">${cfg.trendName} (${cfg.trendUnit})</p><div class="chart-holder" id="dTrend"></div></div>`;
    if (cfg.portField) {
      cards += `<div class="dash-card"><h3>Limanlara göre dağılım${state.region !== "all" ? " — " + state.region : ""}</h3><p class="csub">${m.yil} · seçili bölgedeki limanlar</p><div class="chart-holder" id="dPorts"></div></div>`;
      cards += `<div class="dash-card"><h3>Harita üzerinde</h3><p class="csub">Balon büyüklüğü limanın hacmini gösterir</p><div class="chart-holder mapviz" id="dMap"></div></div>`;
    }

    box.innerHTML = head +
      `<div class="insight"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/><path d="M9 21h6"/></svg><div><b>Bu veri ne anlatıyor?</b> ${cfg.insight}</div></div>` +
      `<div class="dash-cards">${cards}</div>`;

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

  /* ---------- Alt: Excel arşivi ---------- */
  function renderArchive() {
    const box = document.getElementById("catArchive");
    const a = A[cfg.arch];
    if (!a) { box.innerHTML = ""; return; }
    const years = Object.keys(a.yillar).sort((x, y) => {
      const nx = parseInt(x, 10), ny = parseInt(y, 10);
      if (isNaN(nx)) return 1; if (isNaN(ny)) return -1; return ny - nx;
    });
    const total = years.reduce((s, y) => s + a.yillar[y].length, 0);
    const fileIcon = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 3v5h5M7 3h8l5 5v11a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"/></svg>';
    box.innerHTML = `
      <div class="section-head" style="margin-bottom:22px">
        <span class="eyebrow">Resmi dosyalar</span>
        <h2>${cfg.title.replace(" İstatistikleri", "")} — istatistik dosyaları</h2>
        <p>Aylara, limanlara ve türlere göre ayrıntılı ${total.toLocaleString("tr-TR")} resmi dosya. Yıl başlığına tıklayarak açın.</p>
      </div>
      ${years.map((y, i) => `<details class="arch-year" ${i < 2 ? "open" : ""}>
        <summary><span class="yr">${y}</span><span class="cnt">${a.yillar[y].length} dosya</span>
          <svg class="chev" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></summary>
        <ul class="arch-files">${a.yillar[y].map((f) =>
          `<li><a href="${f.url}" target="_blank" rel="noopener">${fileIcon}<span>${f.ad}</span><em>XLS</em></a></li>`).join("")}</ul>
      </details>`).join("")}`;
  }

  renderFilters();
  renderDash();
  renderArchive();
  window.MDScan && window.MDScan();
})();
