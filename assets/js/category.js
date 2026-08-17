/* ============================================================
   category.js — kategori sayfaları için ortak render motoru
   body[data-cat] değerine göre içeriği veriden üretir
   ============================================================ */
(function () {
  "use strict";
  const D = window.MARITIME_DATA;
  if (!D) return;
  const U = window.MDUtil, C = window.MDCharts, H = D.headline, P = D.ports, T = D.trend;
  const icon = window.__icon || (() => "");
  const arrow = window.__arrow || (() => "");
  const GOV = "https://denizcilikistatistikleri.uab.gov.tr";

  const CFG = {
    yuk: {
      title: "Yük İstatistikleri", ic: "yuk", accent: "var(--c-yuk)",
      intro: "Türkiye limanlarında gemilere yüklenen ve gemilerden indirilen — yani <b>elleçlenen</b> — toplam yük. Bu rakam, ülkenin dış ticaretinin denizden akan bölümünün en temel göstergesidir.",
      headKey: "yuk_ton", unit: "ton", portField: "yuk_ton", trend: T.yuk_ton, trendName: "Elleçlenen yük", trendUnit: "ton",
      source: "/yuk-istatistikleri",
      insight: "2024'te elleçlenen yük, bir önceki yıla göre arttı. Bu artış, kabaca yüzlerce büyük yük gemisinin ek olarak taşıdığı kapasiteye denk gelir — Türkiye limanlarının dünya ticaretindeki payının büyüdüğünü gösterir.",
    },
    konteyner: {
      title: "Konteyner İstatistikleri", ic: "konteyner", accent: "var(--c-konteyner)",
      intro: "Limanlarda elleçlenen konteyner miktarı. Birim <b>TEU</b>'dur: yirmi fitlik (yaklaşık 6 metre) standart bir konteyner = 1 TEU.",
      headKey: "konteyner_teu", unit: "TEU", portField: "konteyner_teu", trend: T.konteyner_teu, trendName: "Konteyner", trendUnit: "TEU",
      source: "/konteyner-istatistikleri",
      insight: "Konteyner trafiği, hazır giyimden elektroniğe işlenmiş ürün ticaretinin göstergesidir. İstikrarlı artış, Türkiye'nin bir aktarma ve üretim merkezi olarak güçlendiğine işaret eder.",
    },
    gemi: {
      title: "Gemi İstatistikleri", ic: "gemi", accent: "var(--c-gemi)",
      intro: "Türkiye limanlarına uğrayan gemilerin sayısı ve toplam büyüklüğü (gros ton). Bir yılda limanlarımıza kaç geminin geldiğini gösterir.",
      headKey: "gemi_sayisi", unit: "gemi", trend: T.gemi_gros_ton, trendName: "Uğrayan gemilerin toplam büyüklüğü", trendUnit: "gros ton",
      source: "/gemi-istatistikleri",
      insight: "Gemi sayısı yaklaşık sabit kalırken toplam gros tonun artması, limanlarımıza <b>daha büyük gemilerin</b> geldiğini gösterir — bu da liman altyapısının büyük gemileri ağırlayabildiği anlamına gelir.",
    },
    kruvaziyer: {
      title: "Kruvaziyer İstatistikleri", ic: "kruvaziyer", accent: "var(--c-kruvaziyer)",
      intro: "Türkiye limanlarını ziyaret eden kruvaziyer (yolcu gemisi) yolcularının sayısı. Deniz turizminin gücünü gösterir.",
      headKey: "kruvaziyer_yolcu", unit: "yolcu", trend: T.kruvaziyer_yolcu, trendName: "Kruvaziyer yolcusu", trendUnit: "kişi",
      source: "/kruvaziyer-istatistikleri",
      insight: "Kruvaziyer yolcusu son yıllarda hızla toparlandı ve 2024'te 2015 seviyelerine yaklaştı. Her yolcu, uğradığı liman şehrinde turizm geliri anlamına gelir.",
    },
    roro: {
      title: "RO-RO Araç İstatistikleri", ic: "roro", accent: "var(--c-roro)",
      intro: "<b>RO-RO</b> (Roll-on/Roll-off), araçların tekerlekleri üzerinde gemiye girip indiği taşımacılıktır. Bu rakam, denizyoluyla taşınan araç sayısını gösterir.",
      headKey: "roro_arac", unit: "araç", trend: T.roro_arac_yil, trendName: "Taşınan araç", trendUnit: "araç",
      source: "/ro-ro-arac-istatistikleri",
      insight: "RO-RO hatları, TIR ve kamyonların karayolu yerine denizi kullanmasını sağlar. Bu da hem yakıt tasarrufu hem de daha az karayolu trafiği demektir.",
    },
    kabotaj: {
      title: "Kabotaj İstatistikleri", ic: "kabotaj", accent: "var(--c-kabotaj)",
      intro: "<b>Kabotaj</b>, bir ülkenin kendi limanları arasında, kendi kıyılarında yaptığı deniz taşımacılığıdır. Şehir hattı vapurları ve feribotlarla taşınan milyonlarca yolcu bu kapsamdadır.",
      headKey: "kabotaj_yolcu", unit: "yolcu", trend: T.kabotaj_yolcu, trendName: "Kabotaj yolcusu", trendUnit: "kişi",
      source: "/kabotaj-istatistikleri",
      insight: "Kabotaj yolcusu, deniz ulaşımının günlük hayattaki yerini gösterir. İstanbul'daki vapur seferlerinden Ege'deki feribotlara kadar, her yıl 100 milyondan fazla yolculuk denizden yapılıyor.",
    },
    bogazlar: {
      title: "Türk Boğazları Gemi Geçiş İstatistikleri", ic: "bogaz", accent: "var(--c-bogaz)",
      intro: "İstanbul ve Çanakkale Boğazları'ndan geçen gemi sayısı. Bu boğazlar, Karadeniz'i Akdeniz'e bağlayan ve dünya ticareti için hayati öneme sahip su yollarıdır.",
      headKey: "bogaz_gecis", unit: "gemi (İstanbul Boğazı)", trend: null,
      source: "/turk-bogazlari-gemi-gecis-istatistikleri",
      insight: "Her gün ortalama 100'den fazla gemi İstanbul Boğazı'ndan geçiyor. Bu yoğunluk, boğazların yalnızca Türkiye için değil, tüm dünya deniz ticareti için ne kadar kritik olduğunu gösterir.",
    },
    filo: {
      title: "Filo İstatistikleri", ic: "filo", accent: "var(--c-filo)",
      intro: "Türk bayrağı taşıyan deniz ticaret filosu. Bu rakam, 1.000 gros ton ve üzeri Türk sahipli/bayraklı gemilerin sayısını gösterir.",
      headKey: "filo_gemi", unit: "gemi (1.000 GT+)", trend: null,
      source: "/filo-istatistikleri",
      insight: "Güçlü bir milli filo, taşımacılıkta dışa bağımlılığı azaltır ve deniz ticaretinden elde edilen gelirin ülkede kalmasını sağlar.",
    },
  };

  const cat = document.body.dataset.cat;
  const cfg = CFG[cat];
  const host = document.getElementById("pageContent");
  if (!cfg || !host) return;
  document.title = cfg.title + " — T.C. UAB Denizcilik Verileri";

  const m = H[cfg.headKey];
  const hv = U.human(m.deger);
  const hasYoy = typeof m.yoy === "number";
  const up = m.yoy >= 0;
  const deltaHTML = hasYoy ? `<div class="delta ${up ? "up" : "down"}">${up ? arrow("up") : arrow("down")} %${Math.abs(m.yoy).toString().replace(".", ",")}</div>` : "";
  const subHTML = m.onceki ? `${m.yil} · ${m.yil - 1}'e göre ${up ? "artış" : "azalış"}` : (m.not ? m.not : `${m.yil} verisi`);

  // Destekleyici istatistik kartları
  let supportCards = "";
  if (m.onceki) {
    const ph = U.human(m.onceki);
    supportCards += statMini(`${m.yil - 1} yılı`, ph.v + " " + ph.u, cfg.unit, "Önceki yıl değeri");
  }
  if (cat === "gemi") {
    const gt = U.human(902445227); supportCards += statMini("Toplam büyüklük", gt.v + " " + gt.u, "gros ton", "Uğrayan gemilerin toplam hacmi");
  }
  if (cat === "kabotaj") {
    const ar = U.human(T.kabotaj_arac["2024"]); supportCards += statMini("Taşınan araç", ar.v + " " + ar.u, "araç", "Kabotajda 2024 araç sayısı");
  }
  if (cfg.portField) {
    const top = [...P].filter((p) => p[cfg.portField]).sort((a, b) => b[cfg.portField] - a[cfg.portField])[0];
    const tv = U.human(top[cfg.portField]);
    supportCards += statMini("En büyük liman", top.name, `${tv.v} ${tv.u} ${cfg.unit}`, "Bu kategoride lider liman");
  }

  function statMini(k, v, u, sub) {
    return `<div class="stat-card reveal"><div class="lbl">${k}</div>
      <div class="num" style="font-size:1.9rem">${v} <span class="unit">${u}</span></div>
      <div class="sub">${sub}</div></div>`;
  }

  // Grafik bölümü
  let charts = "";
  if (cfg.trend) charts += `<div class="chart-card wide reveal"><h3>Yıllara göre gelişim</h3><div class="csub">${cfg.trendName} (${cfg.trendUnit})</div><div class="chart-holder" id="catTrend"></div></div>`;
  if (cfg.portField) charts += `<div class="chart-card wide reveal"><h3>Limanlara göre dağılım</h3><div class="csub">2024 · en büyük 10 liman</div><div class="chart-holder" id="catPorts"></div></div>`;
  if (cat === "kabotaj") charts += `<div class="chart-card wide reveal"><h3>Taşınan araç — yıllara göre</h3><div class="csub">Kabotaj hatlarında taşınan araç sayısı</div><div class="chart-holder" id="catTrend2"></div></div>`;

  host.innerHTML = `
    <section class="page-hero">
      <div class="wrap">
        <div class="breadcrumb reveal"><a href="index.html">Anasayfa</a> ${arrow("right")} <span>${cfg.title}</span></div>
        <div class="page-title reveal">
          <span class="page-icon" style="color:${cfg.accent}">${icon(cfg.ic)}</span>
          <h1>${cfg.title}</h1>
        </div>
        <p class="intro reveal d1">${cfg.intro}</p>
      </div>
    </section>

    <section class="section" style="padding-top:20px">
      <div class="wrap">
        <div class="summary-grid" style="grid-template-columns:1.4fr 1fr 1fr 1fr">
          <div class="stat-card reveal" style="border-color:var(--border-strong)">
            <div class="lbl"><span class="ic" style="color:${cfg.accent}">${icon(cfg.ic)}</span>${cfg.title.replace(" İstatistikleri", "")}</div>
            ${deltaHTML}
            <div class="num" style="font-size:3.2rem">${hv.v} <span class="unit">${hv.u} ${cfg.unit}</span></div>
            <div class="sub">${subHTML}</div>
          </div>
          ${supportCards}
        </div>
        <div class="insight reveal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/><path d="M9 21h6"/></svg>
          <div><b>Bu veri ne anlatıyor?</b> ${cfg.insight}</div>
        </div>
      </div>
    </section>

    ${charts ? `<section class="section" style="padding-top:0">
      <div class="wrap"><div class="chart-grid">${charts}</div></div>
    </section>` : ""}

    <section class="section" style="padding-top:0">
      <div class="wrap">
        <div class="chart-card reveal" style="display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap">
          <div>
            <h3 style="justify-content:flex-start">Resmi kaynak dosyaları</h3>
            <p class="csub" style="max-width:52ch">Aylara, limanlara ve türlere göre ayrıntılı istatistik dosyalarının tamamına Denizcilik Genel Müdürlüğü'nün resmi arşivinden ulaşabilirsiniz.</p>
          </div>
          <a class="btn btn-primary" href="${GOV}${cfg.source}" target="_blank" rel="noopener">Resmi dosyaları aç
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg></a>
        </div>
      </div>
    </section>`;

  // Grafikleri çiz
  setTimeout(() => {
    if (cfg.trend) {
      const ys = Object.keys(cfg.trend).sort();
      C.lineArea(document.getElementById("catTrend"), { labels: ys, unit: cfg.trendUnit, series: [{ name: cfg.trendName, color: cfg.accent, values: ys.map((y) => cfg.trend[y]) }] });
    }
    if (cfg.portField) {
      const top = [...P].filter((p) => p[cfg.portField]).sort((a, b) => b[cfg.portField] - a[cfg.portField]).slice(0, 10);
      C.bars(document.getElementById("catPorts"), { unit: cfg.unit, items: top.map((p) => ({ label: p.name, value: p[cfg.portField], color: cfg.accent })) });
    }
    if (cat === "kabotaj") {
      const ys = Object.keys(T.kabotaj_arac).filter((y) => +y >= 2010).sort();
      C.lineArea(document.getElementById("catTrend2"), { labels: ys, unit: "araç", series: [{ name: "Taşınan araç", color: "var(--c-roro)", values: ys.map((y) => T.kabotaj_arac[y]) }] });
    }
    window.MDScan && window.MDScan();
  }, 60);
})();
