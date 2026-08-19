/* ============================================================
   admin-edit.js — Site içi düzenleme modu
   Yalnız admin.html'den giriş yapılmış bir oturum varsa (localStorage'daki
   Supabase auth token) görünür. Metin: [data-i18n] işaretli her eleman
   (content tablosu). Sayı: [data-metric-key] işaretli KPI değerleri
   (metrics tablosu). Sayfa gerçek haliyle görünür, yalnız üzerine
   tıklanan kısım düzenlenir.
   ============================================================ */
(function () {
  "use strict";
  const SUPA_URL = "https://mczowhdwwdidchtgeioo.supabase.co";
  const SUPA_KEY = "sb_publishable_0GoNDg3SAFC7dK1AOc2SsA_u7bN8Bc2";
  const SESSION_KEY = "sb-mczowhdwwdidchtgeioo-auth-token";

  function getSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s || !s.access_token) return null;
      if (s.expires_at && s.expires_at * 1000 < Date.now()) return null;
      return s;
    } catch { return null; }
  }

  const session = getSession();
  if (!session) return; // Giriş yapılmamış → düzenleme modu tamamen sessiz kalır

  function authHeaders(extra) {
    return Object.assign({
      apikey: SUPA_KEY, Authorization: "Bearer " + session.access_token,
      "Content-Type": "application/json",
    }, extra || {});
  }

  async function saveContent(key, tr, en) {
    const r = await fetch(SUPA_URL + "/rest/v1/content", {
      method: "POST",
      headers: authHeaders({ Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify({ key, tr, en }),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
  }

  async function saveMetric(key, value) {
    const r = await fetch(SUPA_URL + "/rest/v1/metrics?key=eq." + encodeURIComponent(key), {
      method: "PATCH",
      headers: authHeaders({ Prefer: "return=minimal" }),
      body: JSON.stringify({ value }),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
  }

  /* ---------- Arayüz ---------- */
  let editing = false, popover, toast;

  function icon(name) {
    if (name === "pencil") return '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';
    if (name === "close") return '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    return "";
  }

  function ensureToggle() {
    const btn = document.createElement("button");
    btn.type = "button"; btn.id = "mdEditToggle";
    btn.innerHTML = icon("pencil") + "<span>Düzenleme modu</span>";
    document.body.appendChild(btn);
    btn.addEventListener("click", () => setEditing(!editing));
  }

  function setEditing(v) {
    editing = v;
    document.documentElement.classList.toggle("md-edit-mode", editing);
    const btn = document.getElementById("mdEditToggle");
    if (btn) btn.classList.toggle("on", editing);
    if (!v) closePopover();
  }

  function closePopover() {
    if (popover) { popover.remove(); popover = null; }
  }

  function showToast(msg, isErr) {
    if (toast) toast.remove();
    toast = document.createElement("div");
    toast.id = "mdEditToast";
    toast.className = isErr ? "err" : "ok";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast) { toast.remove(); toast = null; } }, 2600);
  }

  function positionNear(box, el) {
    const r = el.getBoundingClientRect();
    const top = Math.min(window.scrollY + r.bottom + 8, window.scrollY + window.innerHeight - 20);
    let left = window.scrollX + r.left;
    box.style.top = top + "px";
    document.body.appendChild(box);
    const bw = box.offsetWidth;
    if (left + bw > window.scrollX + window.innerWidth - 16) left = window.scrollX + window.innerWidth - bw - 16;
    if (left < window.scrollX + 12) left = window.scrollX + 12;
    box.style.left = left + "px";
  }

  function openTextPopover(el) {
    closePopover();
    const key = el.dataset.i18n;
    const cur = (window.MDLang && window.MDLang.raw) ? window.MDLang.raw(key) : { tr: el.textContent, en: "" };
    const box = document.createElement("div");
    box.className = "md-edit-pop";
    box.innerHTML = `
      <div class="mep-head"><b>${key}</b><button type="button" class="mep-close">${icon("close")}</button></div>
      <label>Türkçe</label><textarea class="mep-tr" rows="2"></textarea>
      <label>English</label><textarea class="mep-en" rows="2"></textarea>
      <div class="mep-actions"><button type="button" class="btn btn-ghost mep-cancel">Vazgeç</button>
        <button type="button" class="btn btn-primary mep-save">Kaydet</button></div>`;
    box.querySelector(".mep-tr").value = cur.tr;
    box.querySelector(".mep-en").value = cur.en;
    positionNear(box, el);
    box.querySelector(".mep-close").addEventListener("click", closePopover);
    box.querySelector(".mep-cancel").addEventListener("click", closePopover);
    box.querySelector(".mep-save").addEventListener("click", async () => {
      const tr = box.querySelector(".mep-tr").value, en = box.querySelector(".mep-en").value;
      const saveBtn = box.querySelector(".mep-save");
      saveBtn.disabled = true; saveBtn.textContent = "Kaydediliyor…";
      try {
        await saveContent(key, tr, en);
        if (window.MDLang && window.MDLang.setRaw) window.MDLang.setRaw(key, tr, en);
        closePopover();
        showToast("Kaydedildi.");
      } catch (e) {
        saveBtn.disabled = false; saveBtn.textContent = "Kaydet";
        showToast("Kaydedilemedi: " + e.message, true);
      }
    });
    popover = box;
  }

  function openMetricPopover(el) {
    closePopover();
    const key = el.dataset.metricKey;
    const md = window.MARITIME_DATA && window.MARITIME_DATA.headline && window.MARITIME_DATA.headline[key];
    const box = document.createElement("div");
    box.className = "md-edit-pop";
    box.innerHTML = `
      <div class="mep-head"><b>${key} <span class="admin-hint">(metrics.value)</span></b><button type="button" class="mep-close">${icon("close")}</button></div>
      <label>Değer</label><input type="number" class="mep-num" step="any">
      <div class="mep-actions"><button type="button" class="btn btn-ghost mep-cancel">Vazgeç</button>
        <button type="button" class="btn btn-primary mep-save">Kaydet</button></div>`;
    box.querySelector(".mep-num").value = md ? md.deger : "";
    positionNear(box, el);
    box.querySelector(".mep-close").addEventListener("click", closePopover);
    box.querySelector(".mep-cancel").addEventListener("click", closePopover);
    box.querySelector(".mep-save").addEventListener("click", async () => {
      const val = Number(box.querySelector(".mep-num").value);
      const saveBtn = box.querySelector(".mep-save");
      saveBtn.disabled = true; saveBtn.textContent = "Kaydediliyor…";
      try {
        await saveMetric(key, val);
        closePopover();
        showToast("Kaydedildi. Yeni değeri görmek için sayfa yenileniyor…");
        setTimeout(() => location.reload(), 700);
      } catch (e) {
        saveBtn.disabled = false; saveBtn.textContent = "Kaydet";
        showToast("Kaydedilemedi: " + e.message, true);
      }
    });
    popover = box;
  }

  document.addEventListener("click", (e) => {
    if (popover && !popover.contains(e.target) && e.target.id !== "mdEditToggle") closePopover();
    if (!editing) return;
    const mEl = e.target.closest("[data-metric-key]");
    if (mEl) { e.preventDefault(); e.stopPropagation(); openMetricPopover(mEl); return; }
    const tEl = e.target.closest("[data-i18n]");
    if (tEl) { e.preventDefault(); e.stopPropagation(); openTextPopover(tEl); }
  }, true);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureToggle);
  else ensureToggle();
})();
