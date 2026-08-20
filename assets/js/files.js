/* ============================================================
   files.js — Dosyalar sayfası: kategori sekmeleri, yıl grupları, arama
   URL ile derin bağlantı: dosyalar?kat=yuk
   ============================================================ */
(async function () {
  "use strict";
  const A = window.ARCHIVE_DATA;
  const host = document.getElementById("filesApp");
  if (!A || !host) return;
  await (window.MD_I18N_READY || Promise.resolve());
  const t = window.t || ((k) => k);
  const loc = (window.MDLang && window.MDLang.locale()) || "tr-TR";

  const NAMES = {
    yuk: "nav.yuk", konteyner: "nav.konteyner", bogazlar: "nav.bogazlar",
    kabotaj: "nav.kabotaj", kruvaziyer: "nav.kruvaziyer", roro: "nav.roro",
    gemi: "nav.gemi", filo: "nav.filo",
  };
  const keys = Object.keys(A);
  const count = (k) => Object.values(A[k].yillar).reduce((s, v) => s + v.length, 0);
  const total = keys.reduce((s, k) => s + count(k), 0);

  const qs = new URLSearchParams(location.search).get("kat");
  let active = keys.includes(qs) ? qs : keys[0];
  let query = "";

  const fileIcon = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 3v5h5M7 3h8l5 5v11a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"/></svg>';
  const label = (k) => (NAMES[k] ? t(NAMES[k]) : A[k].baslik);

  host.innerHTML = `
    <div class="archive-bar">
      <div class="archive-tabs" id="fTabs">
        ${keys.map((k) => `<button data-k="${k}" class="${k === active ? "on" : ""}">${NAMES[k] ? `<span data-i18n="${NAMES[k]}">${label(k)}</span>` : label(k)}<span>${count(k)}</span></button>`).join("")}
      </div>
      <div class="archive-search">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
        <input type="search" id="fQ" placeholder="${t("ui.search")}" aria-label="${t("ui.search")}">
      </div>
    </div>
    <div class="archive-total"><span data-i18n="files.total">${t("files.total")}</span> <b>${total.toLocaleString(loc)}</b> <span data-i18n="files.totalSuffix">${t("files.totalSuffix")}</span></div>
    <div id="fBody"></div>`;

  function render() {
    const cat = A[active];
    const q = query.trim().toLocaleLowerCase("tr");
    const years = Object.keys(cat.yillar).sort((a, b) => {
      const na = parseInt(a, 10), nb = parseInt(b, 10);
      if (isNaN(na)) return 1;
      if (isNaN(nb)) return -1;
      return nb - na;
    });
    let html = "", shown = 0;
    years.forEach((y, i) => {
      let files = cat.yillar[y];
      if (q) files = files.filter((f) => f.ad.toLocaleLowerCase("tr").includes(q));
      if (!files.length) return;
      shown += files.length;
      html += `<details class="arch-year" ${q || i < 2 ? "open" : ""}>
        <summary><span class="yr">${y}</span><span class="cnt">${files.length} <span data-i18n="ui.files">${t("ui.files")}</span></span>
          <svg class="chev" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></summary>
        <ul class="arch-files">${files.map((f) =>
          `<li><a href="${f.url}" target="_blank" rel="noopener">${fileIcon}<span>${f.ad}</span><em>XLS</em></a></li>`).join("")}</ul>
      </details>`;
    });
    document.getElementById("fBody").innerHTML =
      shown ? html : `<div class="arch-empty" data-i18n="ui.notFound">${t("ui.notFound")}</div>`;
  }

  document.getElementById("fTabs").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-k]");
    if (!b) return;
    active = b.dataset.k;
    document.querySelectorAll("#fTabs button").forEach((x) => x.classList.toggle("on", x === b));
    history.replaceState(null, "", "?kat=" + active);
    render();
  });
  let timer;
  document.getElementById("fQ").addEventListener("input", (e) => {
    clearTimeout(timer);
    const v = e.target.value;
    timer = setTimeout(() => { query = v; render(); }, 180);
  });

  render();
})();
