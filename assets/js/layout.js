/* ============================================================
   layout.js — ortak header & footer (iki dilli + tema anahtarı)
   ============================================================ */
(function () {
  "use strict";
  var I = window.I18N;
  var t = I ? I.t : function (k) { return k; };
  var isEn = I && I.lang === "en";

  var NAV = [
    { href: "yuk.html", k: "nav.yuk" },
    { href: "konteyner.html", k: "nav.konteyner" },
    { href: "bogazlar.html", k: "nav.bogazlar" },
    { href: "kabotaj.html", k: "nav.kabotaj" },
    { href: "kruvaziyer.html", k: "nav.kruvaziyer" },
    { href: "roro.html", k: "nav.roro" },
    { href: "gemi.html", k: "nav.gemi" },
    { href: "filo.html", k: "nav.filo" },
    { href: "dosyalar.html", k: "nav.dosyalar" }
  ];

  var sunIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/></svg>';
  var moonIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 12.8A8.5 8.5 0 1111.2 3a6.6 6.6 0 009.8 9.8z"/></svg>';
  var globeIcon = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 010 18M12 3a15 15 0 000 18"/></svg>';

  var header =
  '<div class="topbar"><div class="wrap">' +
    '<span class="topbar-tag">' + t("home.eyebrow") + '</span>' +
    '<div class="links">' +
      '<a href="https://www.uab.gov.tr" target="_blank" rel="noopener">UAB.GOV.TR</a>' +
      '<a href="site-haritasi.html">' + t("top.sitemap") + '</a>' +
      '<a href="iletisim.html">' + t("top.contact") + '</a>' +
      '<button class="lang-btn" type="button" aria-label="' + t("top.langAria") + '">' + globeIcon + '<span>' + t("top.lang") + '</span></button>' +
      '<button class="theme-btn" type="button" aria-label="' + t("top.theme") + '">' + sunIcon + moonIcon + '</button>' +
    '</div>' +
  '</div></div>' +
  '<header class="site-header"><div class="wrap nav">' +
    '<a class="brand" href="index.html" aria-label="' + t("home.aria") + '">' +
      '<span class="brand-mark"><img class="brand-logo" src="assets/img/uab-logo.svg" alt="T.C. Ulaştırma ve Altyapı Bakanlığı" width="196" height="63"></span>' +
      '<span class="brand-divider"></span>' +
      '<span class="brand-sub">' + t("brand.sub1") + '<br><b>' + t("brand.sub2") + '</b></span>' +
    '</a>' +
    '<nav class="primary-nav" aria-label="' + t("nav.aria") + '"><ul class="mainmenu">' +
      NAV.map(function (n) { return '<li><a href="' + n.href + '">' + t(n.k) + '</a></li>'; }).join("") +
    '</ul></nav>' +
    '<div class="nav-mobile-actions">' +
      '<button class="lang-btn lang-btn-m" type="button" aria-label="' + t("top.langAria") + '">' + globeIcon + '<span>' + t("top.lang") + '</span></button>' +
      '<button class="theme-btn theme-btn-m" type="button" aria-label="' + t("top.theme") + '">' + sunIcon + moonIcon + '</button>' +
      '<button class="menu-toggle icon-btn" aria-label="' + t("menu.aria") + '">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      '</button>' +
    '</div>' +
  '</div></header>';

  var footer =
  '<footer class="site-footer"><div class="wrap">' +
    '<div class="footer-top">' +
      '<div class="footer-brand">' +
        '<span class="brand-mark footer-mark"><img class="footer-logo" src="assets/img/uab-logo.svg" alt="T.C. Ulaştırma ve Altyapı Bakanlığı" width="210" height="68"></span>' +
        '<p>' + t("foot.blurb") + '</p>' +
        '<div class="footer-contact">' +
          '<span>' + t("foot.address") + '</span>' +
          '<span>' + t("foot.switch") + ': <a href="tel:03122031000">0312 203 10 00</a> · ' + t("foot.callcenter") + ': ALO 123</span>' +
        '</div>' +
      '</div>' +
      '<div class="footer-col"><h4>' + t("foot.h.stats") + '</h4>' +
        '<a href="yuk.html">' + t("nav.yuk") + '</a><a href="konteyner.html">' + t("nav.konteyner") + '</a><a href="bogazlar.html">' + t("nav.bogazlar") + '</a><a href="kabotaj.html">' + t("nav.kabotaj") + '</a></div>' +
      '<div class="footer-col"><h4>&nbsp;</h4>' +
        '<a href="kruvaziyer.html">' + t("nav.kruvaziyer") + '</a><a href="roro.html">' + t("nav.roro") + '</a><a href="gemi.html">' + t("nav.gemi") + '</a><a href="filo.html">' + t("nav.filo") + '</a></div>' +
      '<div class="footer-col"><h4>' + t("foot.h.corp") + '</h4>' +
        '<a href="dosyalar.html">' + t("nav.dosyalar") + '</a><a href="diger-istatistikler.html">' + t("foot.other") + '</a>' +
        '<a href="https://denizcilik.uab.gov.tr/" target="_blank" rel="noopener">' + t("foot.dgm") + '</a>' +
        '<a href="iletisim.html">' + t("top.contact") + '</a><a href="site-haritasi.html">' + t("top.sitemap") + '</a></div>' +
    '</div>' +
    '<div class="footer-bottom">' +
      '<span>© <span data-year-now>2026</span> ' + t("foot.copy") + '</span>' +
      '<span>' + t("foot.source") + ': <a href="https://denizcilikistatistikleri.uab.gov.tr/" target="_blank" rel="noopener">denizcilikistatistikleri.uab.gov.tr</a></span>' +
    '</div>' +
  '</div></footer>';

  var h = document.getElementById("site-header");
  var f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  // Dil & tema anahtarları
  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { I && I.toggleLang(); });
  });
  document.querySelectorAll(".theme-btn").forEach(function (b) {
    b.addEventListener("click", function () { I && I.toggleTheme(); });
  });
})();
