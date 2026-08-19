/* ============================================================
   main.js — paylaşılan davranışlar & yardımcılar
   ============================================================ */
(function () {
  "use strict";
  const D = window.MARITIME_DATA || {};
  window.MD = D;

  /* ---------- Sayı biçimlendirme (Türkçe) ---------- */
  const LOC = (window.MDLang && window.MDLang.locale()) || "tr-TR";
  const nf0 = new Intl.NumberFormat(LOC, { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat(LOC, { maximumFractionDigits: 1 });

  // Ham sayı → "531,7 milyon" gibi vatandaş-dostu ifade
  // uKey: büyüklük sözcüğünün içerik anahtarı — panelde düzenlenebilsin diye döner
  function human(n) {
    const a = Math.abs(n);
    const T = (k, d) => (window.t ? window.t(k) : d);
    if (a >= 1e9) return { v: nf1.format(n / 1e9), u: T("num.milyar", "milyar"), uKey: "num.milyar" };
    if (a >= 1e6) return { v: nf1.format(n / 1e6), u: T("num.milyon", "milyon"), uKey: "num.milyon" };
    if (a >= 1e3) return { v: nf0.format(n / 1e3), u: T("num.bin", "bin"), uKey: "num.bin" };
    return { v: nf0.format(n), u: "", uKey: null };
  }
  function fmt(n) { return nf0.format(n); }

  window.MDUtil = { human, fmt, nf0, nf1 };

  /* ---------- Paylaşılan ikon seti ---------- */
  const ICONS = {
    yuk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/></svg>',
    konteyner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M7 7v12M12 7v12M17 7v12"/></svg>',
    gemi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 16l2 4h14l2-4M5 16V9l7-3 7 3v7"/><path d="M12 3v3"/></svg>',
    kruvaziyer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 17h18l-1.5 3H4.5L3 17z"/><path d="M6 17v-6h9l3 6M9 11V6h4v5"/></svg>',
    roro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 13l2-5h9l3 3h4v4M7 16h8"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
    kabotaj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 15h16l-2 5H6l-2-5z"/><path d="M12 3v8M8 7h8"/></svg>',
    bogaz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4v16M20 4v16M8 8h8M8 12h8M8 16h8"/></svg>',
    filo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 17l1.5 3h6L11 17M13 17l1.5 3h6L22 17M6 17v-5l4-2 4 2M10 10V7"/></svg>',
  };
  window.__icon = (k) => ICONS[k] || "";
  window.__arrow = (dir) => {
    if (dir === "right") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    if (dir === "up") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
  };

  /* ---------- Sayaç animasyonu ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.dec || "0", 10);
    const dur = 1500;
    const start = performance.now();
    const fmtLocal = new Intl.NumberFormat(LOC, {
      minimumFractionDigits: decimals, maximumFractionDigits: decimals,
    });
    // rAF çalışmayan ortamlarda (gizli sekme) nihai değeri koru
    if (document.hidden || typeof requestAnimationFrame !== "function") {
      el.textContent = fmtLocal.format(target); return;
    }
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmtLocal.format(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = fmtLocal.format(target);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Reveal + sayaç tetikleyici (rect tabanlı, her ortamda güvenilir) ---------- */
  function trigger(el) {
    if (el.dataset.rev) return;
    el.dataset.rev = "1";
    el.classList.add("in");
    el.querySelectorAll?.("[data-count]").forEach((c) => {
      if (!c.dataset.done) { c.dataset.done = "1"; animateCount(c); }
    });
    if (el.matches("[data-count]") && !el.dataset.done) { el.dataset.done = "1"; animateCount(el); }
  }
  function inView(el, margin) {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh - margin && r.bottom > 0;
  }
  let scanQueued = false;
  function scan() {
    scanQueued = false;
    document.querySelectorAll(".reveal, [data-count]").forEach((el) => {
      if (!el.dataset.rev && inView(el, 60)) trigger(el);
    });
  }
  function requestScan() {
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(scan);
  }
  window.addEventListener("scroll", requestScan, { passive: true });
  window.addEventListener("resize", requestScan, { passive: true });
  // IntersectionObserver ek güvence (destekleniyorsa)
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) trigger(e.target); });
    }, { threshold: 0.15 });
    window.__io = io;
  }
  function observeReveals() {
    document.querySelectorAll(".reveal, [data-count]").forEach((el) => window.__io && window.__io.observe(el));
    requestScan();
  }
  window.MDObserve = observeReveals;
  window.MDScan = scan;

  /* ---------- Header kaydırma efekti ---------- */
  function initHeaderScroll() {
    const h = document.querySelector(".site-header");
    if (!h) return;
    // Kaydırıldığında header'a hafif gölge ver (renk CSS'te kalsın)
    const onScroll = () => {
      h.style.boxShadow = window.scrollY > 30 ? "0 6px 20px -12px rgba(27,35,62,0.35)" : "none";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Aktif menü işaretle ---------- */
  function markActive() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".mainmenu > li").forEach((li) => {
      const a = li.querySelector("a[href]");
      if (a && a.getAttribute("href") === path) li.classList.add("active");
    });
  }

  /* ---------- Yıl (footer) ---------- */
  function initYear() {
    document.querySelectorAll("[data-year-now]").forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.MDLang && window.MDLang.apply();
    observeReveals();
    initHeaderScroll();
    markActive();
    initYear();
  });
})();
