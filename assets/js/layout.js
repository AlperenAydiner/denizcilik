/* ============================================================
   layout.js — ortak header & footer enjeksiyonu (12 sayfa tutarlı)
   ============================================================ */
(function () {
  "use strict";
  const I = {
    yuk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/></svg>',
    konteyner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M7 7v12M12 7v12M17 7v12"/></svg>',
    kabotaj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 15h16l-2 5H6l-2-5z"/><path d="M12 3v8M8 7h8"/><circle cx="12" cy="3" r="1"/></svg>',
    gemi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 16l2 4h14l2-4M5 16V9l7-3 7 3v7"/><path d="M12 3v3"/></svg>',
    filo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 17l1.5 3h6L11 17M13 17l1.5 3h6L22 17M6 17v-5l4-2 4 2M10 10V7"/></svg>',
    bogaz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4v16M20 4v16M8 8h8M8 12h8M8 16h8"/></svg>',
    kruvaziyer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 17h18l-1.5 3H4.5L3 17z"/><path d="M6 17v-6h9l3 6M9 11V6h4v5"/></svg>',
    roro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 13l2-5h9l3 3h4v4M3 13v3h2M19 16h2v-3M7 16h8"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 3L3 6v15l6-3 6 3 6-3V3l-6 3-6-3z"/><path d="M9 3v15M15 6v15"/></svg>',
    archive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8M10 12h4"/></svg>',
    anchor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="5" r="2"/><path d="M12 7v13M5 12a7 7 0 0014 0M5 12H3m2 0l2 2m12-2h2m-2 0l-2 2"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  };

  const NAV = [
    { label: "Deniz Ticareti", items: [
      { href: "yuk.html", ic: "yuk", t: "Yük", s: "Elleçlenen toplam yük" },
      { href: "konteyner.html", ic: "konteyner", t: "Konteyner", s: "TEU bazında elleçleme" },
      { href: "kabotaj.html", ic: "kabotaj", t: "Kabotaj", s: "İç sularda taşıma" },
    ]},
    { label: "Gemiler", items: [
      { href: "gemi.html", ic: "gemi", t: "Gemi", s: "Limanlara uğrayan gemiler" },
      { href: "filo.html", ic: "filo", t: "Filo", s: "Türk deniz ticaret filosu" },
      { href: "bogazlar.html", ic: "bogaz", t: "Türk Boğazları", s: "Boğaz gemi geçişleri" },
    ]},
    { label: "Yolcu & Taşımacılık", items: [
      { href: "kruvaziyer.html", ic: "kruvaziyer", t: "Kruvaziyer", s: "Kruvaziyer yolcu & gemi" },
      { href: "roro.html", ic: "roro", t: "RO-RO", s: "Araç taşıyan gemiler" },
    ]},
  ];

  function megaHTML(group) {
    return `<div class="mega"><span class="grp-title">${group.label}</span>` +
      group.items.map((it) => `<a class="item" href="${it.href}"><span class="ic">${I[it.ic]}</span><span class="tx"><b>${it.t}</b><span>${it.s}</span></span></a>`).join("") +
      `</div>`;
  }

  const header = `
  <div class="topbar"><div class="wrap">
    <a href="https://www.uab.gov.tr" target="_blank" rel="noopener">T.C. Ulaştırma ve Altyapı Bakanlığı</a>
    <div class="links">
      <a href="index.html">Anasayfa</a>
      <a href="site-haritasi.html">Site Haritası</a>
      <a href="iletisim.html">İletişim</a>
    </div>
  </div></div>
  <header class="site-header"><nav class="wrap nav">
    <a class="brand" href="index.html">
      <span class="crest">${I.anchor}</span>
      <span class="name"><span class="k">Denizcilik Genel Müdürlüğü</span><span class="t"><b>Denizcilik</b> Verileri</span></span>
    </a>
    <ul class="mainmenu">
      ${NAV.map((g) => `<li><a href="#">${g.label}<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></a>${megaHTML(g)}</li>`).join("")}
      <li><a href="harita.html">Harita</a></li>
      <li><a href="arsiv.html">Arşiv</a></li>
    </ul>
    <div class="nav-actions">
      <a class="btn btn-primary" href="iletisim.html">${I.mail}<span>İletişim</span></a>
      <button class="icon-btn menu-toggle" aria-label="Menü">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </nav></header>`;

  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="name">T.C. UAB · Denizcilik Verileri</div>
          <p>Türkiye'nin deniz ticareti, limanları, gemileri ve yolcularına ait resmi istatistiklerin vatandaş dostu veri platformu.</p>
        </div>
        <div class="footer-col"><h4>Deniz Ticareti</h4>
          <a href="yuk.html">Yük</a><a href="konteyner.html">Konteyner</a><a href="kabotaj.html">Kabotaj</a></div>
        <div class="footer-col"><h4>Gemiler & Yolcu</h4>
          <a href="gemi.html">Gemi</a><a href="filo.html">Filo</a><a href="bogazlar.html">Türk Boğazları</a><a href="kruvaziyer.html">Kruvaziyer</a><a href="roro.html">RO-RO</a></div>
        <div class="footer-col"><h4>Kurum</h4>
          <a href="https://denizcilik.uab.gov.tr/" target="_blank" rel="noopener">Denizcilik G.M.</a><a href="arsiv.html">Arşiv</a><a href="diger-istatistikler.html">Diğer İstatistikler</a><a href="iletisim.html">İletişim</a></div>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year-now>2026</span> T.C. Ulaştırma ve Altyapı Bakanlığı — Denizcilik Genel Müdürlüğü. Tüm hakları saklıdır.</span>
        <span>Veri kaynağı: denizcilikistatistikleri.uab.gov.tr</span>
      </div>
    </div>
  </footer>`;

  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;
})();
