/* ============================================================
   layout.js — ortak header & footer (i18n + tema + mobil menü)
   ============================================================ */
(function () {
  "use strict";
  const t = window.t || ((k) => k);
  const L = window.MDLang;

  const NAV = [
    { href: "yuk.html", k: "nav.yuk" },
    { href: "konteyner.html", k: "nav.konteyner" },
    { href: "bogazlar.html", k: "nav.bogazlar" },
    { href: "kabotaj.html", k: "nav.kabotaj" },
    { href: "kruvaziyer.html", k: "nav.kruvaziyer" },
    { href: "roro.html", k: "nav.roro" },
    { href: "gemi.html", k: "nav.gemi" },
    { href: "filo.html", k: "nav.filo" },
    { href: "dosyalar.html", k: "nav.dosyalar" },
  ];

  const ICON = {
    sun: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7"/></svg>',
    moon: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/></svg>',
    burger: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  };

  const header = `
  <div class="topbar"><div class="wrap">
    <span class="topbar-org">${t("site.org")}</span>
    <div class="links">
      <a href="https://www.uab.gov.tr" target="_blank" rel="noopener">UAB.GOV.TR</a>
      <a href="site-haritasi.html">${t("nav.sitemap")}</a>
      <a href="iletisim.html">${t("nav.contact")}</a>
      <button class="lang-btn" id="langBtn" type="button">${ICON.globe}<span>${t("ui.lang")}</span></button>
    </div>
  </div></div>
  <header class="site-header">
    <div class="wrap nav">
      <a class="brand" href="index.html" aria-label="${t("nav.home")}">
        <span class="brand-mark"><img class="brand-logo" src="assets/img/uab-logo.svg" alt="${t("site.org")}" width="176" height="57"></span>
        <span class="brand-divider"></span>
        <span class="brand-sub">${t("site.sub1")}<br><b>${t("site.sub2")}</b></span>
      </a>
      <nav class="primary-nav" id="primaryNav" aria-label="${t("ui.menu")}">
        <ul class="mainmenu">
          ${NAV.map((n) => `<li><a href="${n.href}">${t(n.k)}</a></li>`).join("")}
        </ul>
      </nav>
      <div class="nav-actions">
        <button class="icon-btn theme-btn" id="themeBtn" type="button" title="${t("ui.theme")}" aria-label="${t("ui.theme")}"></button>
        <button class="icon-btn menu-toggle" id="menuToggle" type="button" aria-label="${t("ui.menu")}" aria-expanded="false">${ICON.burger}</button>
      </div>
    </div>
  </header>
  <div class="nav-scrim" id="navScrim" hidden></div>`;

  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="brand-mark footer-mark"><img class="footer-logo" src="assets/img/uab-logo.svg" alt="${t("site.org")}" width="190" height="61"></span>
          <div class="footer-contact">
            <span>Hakkı Turayliç Cad. No:5, 06338 Emek / Ankara</span>
            <span>${t("contact.phone")}: <a href="tel:03122031000">0312 203 10 00</a> · ${t("contact.callcenter")}: ALO 123</span>
          </div>
        </div>
        <div class="footer-col"><h4>${t("footer.stats")}</h4>
          <a href="yuk.html">${t("nav.yuk")}</a><a href="konteyner.html">${t("nav.konteyner")}</a>
          <a href="bogazlar.html">${t("nav.bogazlar")}</a><a href="kabotaj.html">${t("nav.kabotaj")}</a></div>
        <div class="footer-col"><h4>&nbsp;</h4>
          <a href="kruvaziyer.html">${t("nav.kruvaziyer")}</a><a href="roro.html">${t("nav.roro")}</a>
          <a href="gemi.html">${t("nav.gemi")}</a><a href="filo.html">${t("nav.filo")}</a></div>
        <div class="footer-col"><h4>${t("footer.corp")}</h4>
          <a href="dosyalar.html">${t("nav.dosyalar")}</a><a href="harita.html">${t("nav.map")}</a>
          <a href="iletisim.html">${t("nav.contact")}</a><a href="site-haritasi.html">${t("nav.sitemap")}</a></div>
      </div>
      <div class="footer-note">${t("footer.note")}
        <a href="https://denizcilikistatistikleri.uab.gov.tr/" target="_blank" rel="noopener">denizcilikistatistikleri.uab.gov.tr</a>
      </div>
      <div class="footer-bottom">
        <span>© <span data-year-now>2026</span> ${t("site.org")}</span>
        <span>${t("footer.dataSource")}: denizcilikistatistikleri.uab.gov.tr</span>
      </div>
    </div>
  </footer>`;

  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.outerHTML = header;
  if (f) f.outerHTML = footer;

  /* ---------- Tema ---------- */
  const THEME_KEY = "md-theme";
  function currentTheme() {
    return localStorage.getItem(THEME_KEY) ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function paintThemeBtn(mode) {
    const b = document.getElementById("themeBtn");
    if (b) b.innerHTML = mode === "dark" ? ICON.sun : ICON.moon;
  }
  function setTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(THEME_KEY, mode);
    paintThemeBtn(mode);
    window.dispatchEvent(new CustomEvent("md-theme", { detail: mode }));
  }
  setTheme(currentTheme());
  const tb = document.getElementById("themeBtn");
  if (tb) tb.addEventListener("click", () =>
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"));

  /* ---------- Dil ---------- */
  const lb = document.getElementById("langBtn");
  if (lb && L) lb.addEventListener("click", () => L.toggle());

  /* ---------- Mobil menü ---------- */
  const nav = document.getElementById("primaryNav");
  const mt = document.getElementById("menuToggle");
  const scrim = document.getElementById("navScrim");
  function closeNav() {
    nav.classList.remove("open");
    mt.setAttribute("aria-expanded", "false");
    mt.innerHTML = ICON.burger;
    scrim.hidden = true;
    document.body.style.overflow = "";
  }
  function openNav() {
    nav.classList.add("open");
    mt.setAttribute("aria-expanded", "true");
    mt.innerHTML = ICON.close;
    scrim.hidden = false;
    document.body.style.overflow = "hidden";
  }
  if (mt && nav && scrim) {
    mt.addEventListener("click", () => (nav.classList.contains("open") ? closeNav() : openNav()));
    scrim.addEventListener("click", closeNav);
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("open")) closeNav(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 1100 && nav.classList.contains("open")) closeNav(); });
  }

  /* ---------- Aktif sayfa ---------- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".mainmenu > li > a").forEach((a) => {
    if (a.getAttribute("href") === path) a.parentElement.classList.add("active");
  });
})();
