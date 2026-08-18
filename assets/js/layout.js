/* ============================================================
   layout.js — ortak header & footer
   Resmi UAB logosu + denizcilikistatistikleri.uab.gov.tr üst menüsü
   ============================================================ */
(function () {
  "use strict";

  // Resmi sitedeki üst menünün tamamı + Arşiv
  const NAV = [
    { href: "yuk.html", label: "Yük" },
    { href: "konteyner.html", label: "Konteyner" },
    { href: "bogazlar.html", label: "Türk Boğazları" },
    { href: "kabotaj.html", label: "Kabotaj Hattı" },
    { href: "kruvaziyer.html", label: "Kruvaziyer" },
    { href: "roro.html", label: "RO-RO Araç" },
    { href: "gemi.html", label: "Gemi" },
    { href: "filo.html", label: "Filo" },
    { href: "arsiv.html", label: "Arşiv" },
  ];

  const header = `
  <div class="topbar"><div class="wrap">
    <span></span>
    <div class="links">
      <a href="https://www.uab.gov.tr" target="_blank" rel="noopener">UAB.GOV.TR</a>
      <a href="site-haritasi.html">Site Haritası</a>
      <a href="iletisim.html">İletişim</a>
      <a href="https://www.uab.gov.tr/en" target="_blank" rel="noopener">English</a>
    </div>
  </div></div>
  <header class="site-header">
    <div class="wrap nav">
      <a class="brand" href="index.html" aria-label="Anasayfa">
        <span class="brand-mark"><img class="brand-logo" src="assets/img/uab-logo.svg" alt="T.C. Ulaştırma ve Altyapı Bakanlığı" width="196" height="63"></span>
        <span class="brand-divider"></span>
        <span class="brand-sub">Denizcilik<br><b>İstatistikleri</b></span>
      </a>
      <nav class="primary-nav" aria-label="Ana menü">
        <ul class="mainmenu">
          ${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}
        </ul>
      </nav>
      <button class="menu-toggle icon-btn" aria-label="Menü">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="brand-mark footer-mark"><img class="footer-logo" src="assets/img/uab-logo.svg" alt="T.C. Ulaştırma ve Altyapı Bakanlığı" width="210" height="68"></span>
          <p>Türkiye'nin deniz ticareti, limanları, gemileri ve yolcularına ait resmi istatistikler.</p>
          <div class="footer-contact">
            <span>Hakkı Turayliç Cad. No:5, 06338 Emek / Ankara</span>
            <span>Santral: <a href="tel:03122031000">0312 203 10 00</a> · Çağrı Merkezi: ALO 123</span>
          </div>
        </div>
        <div class="footer-col"><h4>İstatistikler</h4>
          <a href="yuk.html">Yük</a><a href="konteyner.html">Konteyner</a><a href="bogazlar.html">Türk Boğazları</a><a href="kabotaj.html">Kabotaj Hattı</a></div>
        <div class="footer-col"><h4>&nbsp;</h4>
          <a href="kruvaziyer.html">Kruvaziyer</a><a href="roro.html">RO-RO Araç</a><a href="gemi.html">Gemi</a><a href="filo.html">Filo</a></div>
        <div class="footer-col"><h4>Kurumsal</h4>
          <a href="arsiv.html">Arşiv</a><a href="diger-istatistikler.html">Diğer İstatistikler</a>
          <a href="https://denizcilik.uab.gov.tr/" target="_blank" rel="noopener">Denizcilik G.M.</a>
          <a href="iletisim.html">İletişim</a><a href="site-haritasi.html">Site Haritası</a></div>
      </div>
      <div class="footer-note">
        Bu sayfa bir <b>arayüz tasarım çalışmasıdır</b>. Resmi yayın ve güncel veriler için:
        <a href="https://denizcilikistatistikleri.uab.gov.tr/" target="_blank" rel="noopener">denizcilikistatistikleri.uab.gov.tr</a>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year-now>2026</span> T.C. Ulaştırma ve Altyapı Bakanlığı — Denizcilik Genel Müdürlüğü</span>
        <span>Veri kaynağı: <a href="https://denizcilikistatistikleri.uab.gov.tr/" target="_blank" rel="noopener">denizcilikistatistikleri.uab.gov.tr</a></span>
      </div>
    </div>
  </footer>`;

  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;
})();
