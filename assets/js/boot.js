/* ============================================================
   boot.js — <head> içinde çalışır (FOUC önler)
   Tema (deniz açık / koyu) ve dil tercihini <html> üzerine yazar.
   ============================================================ */
(function () {
  "use strict";
  try {
    var d = document.documentElement;

    // ---- Tema ----
    var theme = null;
    try { theme = localStorage.getItem("md-theme"); } catch (e) {}
    if (theme !== "dark" && theme !== "light") {
      theme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    }
    d.setAttribute("data-theme", theme);

    // ---- Dil ----
    var lang = null;
    try { lang = localStorage.getItem("md-lang"); } catch (e) {}
    if (lang !== "en" && lang !== "tr") lang = "tr";
    d.setAttribute("lang", lang);
    d.setAttribute("data-lang", lang);
  } catch (e) {}
})();
