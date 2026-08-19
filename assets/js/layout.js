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

  const LOGOS = window.FOOTER_LOGOS || [];
  const logoStrip = LOGOS.length ? `
  <div class="logo-strip" aria-label="${t("footer.affiliates")}">
    <div class="logo-track">
      ${[0, 1].map(() => LOGOS.map((l) =>
        `<a class="logo-item" href="${l.href}" target="_blank" rel="noopener">
           <img src="${l.file}" alt="${l.name}" loading="lazy" height="40"></a>`).join("")).join("")}
    </div>
  </div>` : "";

  const footer = `
  <footer class="site-footer">
    ${logoStrip}
    <div class="wrap">
      <div class="footer-main">
        <div class="footer-brand">
          <span class="brand-mark footer-mark"><img class="footer-logo" src="assets/img/uab-logo.svg" alt="${t("site.org")}" width="190" height="61" loading="lazy"></span>
          <p class="footer-org">${t("site.org")}<br><b>${t("site.sub1")} ${t("site.sub2")}</b></p>
        </div>

        <div class="footer-info">
          <div class="fi-item">
            <span class="fi-ic"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg></span>
            <span class="fi-tx"><b>${t("contact.address")}</b>Hakkı Turayliç Cad. No:5<br>06338 Emek / Ankara</span>
          </div>
          <div class="fi-item">
            <span class="fi-ic"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 1.9.6 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.1a2 2 0 012.1-.5c.9.3 1.8.5 2.8.6a2 2 0 011.7 2z"/></svg></span>
            <span class="fi-tx"><b>${t("contact.phone")}</b><a href="tel:03122031000">0312 203 10 00</a></span>
          </div>
          <div class="fi-item">
            <span class="fi-ic"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 12a8 8 0 1116 0v5a2 2 0 01-2 2h-2v-6h4M4 13h4v6H6a2 2 0 01-2-2z"/></svg></span>
            <span class="fi-tx"><b>${t("contact.callcenter")}</b><a href="https://www.uab.gov.tr/cagri-merkezi" target="_blank" rel="noopener">ALO 123</a></span>
          </div>
        </div>

        <nav class="footer-links" aria-label="${t("footer.corp")}">
          <a href="index.html">${t("nav.home")}</a>
          <a href="https://denizcilik.uab.gov.tr/" target="_blank" rel="noopener">${t("footer.dgm")}</a>
          <a href="dosyalar.html">${t("nav.dosyalar")}</a>
          <a href="harita.html">${t("nav.map")}</a>
          <a href="diger-istatistikler.html">${t("nav.other")}</a>
          <a href="iletisim.html">${t("nav.contact")}</a>
          <a href="site-haritasi.html">${t("nav.sitemap")}</a>
          <a href="https://www.uab.gov.tr/kvkkdokuman" target="_blank" rel="noopener">${t("footer.kvkk")}</a>
        </nav>
      </div>

      <div class="footer-bottom">
        <span>© <span data-year-now>2026</span> ${t("site.org")} — ${t("footer.rights")}</span>
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
