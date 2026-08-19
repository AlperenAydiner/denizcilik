/* ============================================================
   admin.js — Yönetim paneli: giriş + metrics/ports/trends/detay editörleri
   Yazma yalnız Supabase Auth ile giriş yapan kullanıcı için (RLS).
   ============================================================ */
(function () {
  "use strict";
  const SUPA_URL = "https://mczowhdwwdidchtgeioo.supabase.co";
  const SUPA_KEY = "sb_publishable_0GoNDg3SAFC7dK1AOc2SsA_u7bN8Bc2";
  const sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);

  const $ = (id) => document.getElementById(id);
  const nf = new Intl.NumberFormat("tr-TR");

  /* ---------- Giriş / oturum ---------- */
  async function refreshSession() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      $("loginBox").hidden = true;
      $("adminBox").hidden = false;
      $("whoAmI").innerHTML = `${session.user.email} <button type="button" id="pwBtn" class="admin-linklike">şifre belirle/değiştir</button>`;
      $("pwBtn").addEventListener("click", showPasswordForm);
      loadTab(currentTab);
    } else {
      $("loginBox").hidden = false;
      $("adminBox").hidden = true;
    }
  }

  function showPasswordForm() {
    const np = prompt("Yeni şifreni gir (en az 6 karakter):");
    if (!np) return;
    if (np.length < 6) { alert("Şifre en az 6 karakter olmalı."); return; }
    sb.auth.updateUser({ password: np }).then(({ error }) => {
      alert(error ? "Hata: " + error.message : "Şifre güncellendi. Bir sonraki girişte bunu kullan.");
    });
  }

  $("loginBtn").addEventListener("click", async () => {
    const email = $("loginEmail").value.trim();
    const password = $("loginPass").value;
    $("loginMsg").textContent = "Giriş yapılıyor…";
    $("loginMsg").className = "admin-msg";
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      $("loginMsg").textContent = "Hata: " + (error.message === "Invalid login credentials" ? "E-posta veya şifre hatalı." : error.message);
      $("loginMsg").className = "admin-msg err";
    } else {
      $("loginMsg").textContent = "";
      refreshSession();
    }
  });
  $("loginPass").addEventListener("keydown", (e) => { if (e.key === "Enter") $("loginBtn").click(); });

  $("logoutBtn").addEventListener("click", async () => { await sb.auth.signOut(); refreshSession(); });

  /* ---------- OTP (6 haneli kod) girişi ----------
     E-postadaki davet/magic-link'e tıklamak yerine kod kullanılır — Gmail gibi
     e-posta servislerinin linki otomatik "ön-tarayıp" tek kullanımlık token'ı
     tüketmesi sorununu (davet linkinin oturum açmaması) tamamen atlar. */
  $("otpSendBtn").addEventListener("click", async () => {
    const email = $("loginEmail").value.trim();
    if (!email) { $("otpMsg").textContent = "Önce yukarıya e-postanı yaz."; $("otpMsg").className = "admin-msg err"; return; }
    $("otpMsg").textContent = "Gönderiliyor…"; $("otpMsg").className = "admin-msg";
    const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    if (error) { $("otpMsg").textContent = "Hata: " + error.message; $("otpMsg").className = "admin-msg err"; return; }
    $("otpStep1").hidden = true; $("otpStep2").hidden = false;
    $("otpMsg").textContent = "Kod gönderildi, e-postanı kontrol et."; $("otpMsg").className = "admin-msg";
  });
  $("otpVerifyBtn").addEventListener("click", async () => {
    const email = $("loginEmail").value.trim();
    const code = $("otpCode").value.trim();
    $("otpMsg").textContent = "Doğrulanıyor…"; $("otpMsg").className = "admin-msg";
    const { error } = await sb.auth.verifyOtp({ email, token: code, type: "email" });
    if (error) { $("otpMsg").textContent = "Hata: " + error.message; $("otpMsg").className = "admin-msg err"; return; }
    $("otpMsg").textContent = "";
    refreshSession();
  });

  /* ---------- Sekmeler ---------- */
  let currentTab = "metrics";
  document.querySelectorAll(".admin-tabs button").forEach((b) => {
    b.addEventListener("click", () => {
      document.querySelectorAll(".admin-tabs button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      document.querySelectorAll(".admin-panel").forEach((p) => (p.hidden = true));
      currentTab = b.dataset.tab;
      $("tab-" + currentTab).hidden = false;
      loadTab(currentTab);
    });
  });

  const loaded = {};
  function loadTab(tab) {
    if (tab === "metrics") return renderMetrics();
    if (tab === "ports") return renderPorts();
    if (tab === "trends") return renderTrends();
    if (tab === "detail") return renderDetail();
  }

  function toast(container, msg, isErr) {
    let el = container.querySelector(".admin-toast");
    if (!el) { el = document.createElement("div"); el.className = "admin-toast"; container.prepend(el); }
    el.textContent = msg;
    el.className = "admin-toast" + (isErr ? " err" : " ok");
    clearTimeout(el._t); el._t = setTimeout(() => el.remove(), 3000);
  }

  /* ============================================================
     Jenerik düzenlenebilir tablo
     ============================================================ */
  function buildTable(container, opts) {
    // opts: {table, columns:[{key,label,type,editable,width}], pk:[keys], rows, onSaved}
    const cols = opts.columns;
    let html = `<div class="admin-tablewrap"><table class="admin-table"><thead><tr>`;
    cols.forEach((c) => (html += `<th>${c.label}</th>`));
    html += `<th></th></tr></thead><tbody>`;
    opts.rows.forEach((row, i) => {
      html += `<tr data-i="${i}">`;
      cols.forEach((c) => {
        const v = row[c.key] == null ? "" : row[c.key];
        if (c.editable === false) html += `<td>${v}</td>`;
        else html += `<td><input data-k="${c.key}" type="${c.type || "text"}" value="${String(v).replace(/"/g, "&quot;")}" ${c.step ? `step="${c.step}"` : ""}></td>`;
      });
      html += `<td class="admin-rowactions"><button type="button" class="ic-save" title="Kaydet">${ICON.save}</button><button type="button" class="ic-del" title="Sil">${ICON.trash}</button></td></tr>`;
    });
    html += `</tbody></table></div>`;
    html += `<button type="button" class="btn btn-ghost admin-addrow">+ Yeni satır ekle</button>`;
    container.innerHTML = html;

    container.querySelectorAll(".ic-save").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const tr = btn.closest("tr");
        const i = +tr.dataset.i;
        const orig = opts.rows[i];
        const patch = {};
        tr.querySelectorAll("input[data-k]").forEach((inp) => {
          const col = cols.find((c) => c.key === inp.dataset.k);
          patch[inp.dataset.k] = col.type === "number" ? (inp.value === "" ? null : Number(inp.value)) : inp.value;
        });
        const match = {}; opts.pk.forEach((k) => (match[k] = orig[k]));
        btn.disabled = true;
        const { error } = await sb.from(opts.table).update(patch).match(match);
        btn.disabled = false;
        if (error) toast(container, "Kaydedilemedi: " + error.message, true);
        else { Object.assign(orig, patch); toast(container, "Kaydedildi.", false); }
      });
    });
    container.querySelectorAll(".ic-del").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const tr = btn.closest("tr");
        const i = +tr.dataset.i;
        if (!confirm("Bu satırı silmek istediğine emin misin?")) return;
        const match = {}; opts.pk.forEach((k) => (match[k] = opts.rows[i][k]));
        const { error } = await sb.from(opts.table).delete().match(match);
        if (error) { toast(container, "Silinemedi: " + error.message, true); return; }
        opts.rows.splice(i, 1);
        buildTable(container, opts);
      });
    });
    container.querySelector(".admin-addrow").addEventListener("click", () => {
      const blank = {}; cols.forEach((c) => (blank[c.key] = c.type === "number" ? 0 : ""));
      opts.rows.push(blank);
      buildTable(container, opts);
      // yeni satırı gerçek insert yap: son satırın kaydet butonuna insert davranışı ekle
      const lastTr = container.querySelector(`tr[data-i="${opts.rows.length - 1}"]`);
      const saveBtn = lastTr.querySelector(".ic-save");
      const freshBtn = saveBtn.cloneNode(true);
      saveBtn.replaceWith(freshBtn);
      freshBtn.addEventListener("click", async () => {
        const patch = {};
        lastTr.querySelectorAll("input[data-k]").forEach((inp) => {
          const col = cols.find((c) => c.key === inp.dataset.k);
          patch[inp.dataset.k] = col.type === "number" ? (inp.value === "" ? null : Number(inp.value)) : inp.value;
        });
        freshBtn.disabled = true;
        const { error } = await sb.from(opts.table).insert(patch);
        freshBtn.disabled = false;
        if (error) { toast(container, "Eklenemedi: " + error.message, true); return; }
        toast(container, "Eklendi.", false);
        loadTab(currentTab);
      });
    });
  }

  const ICON = {
    save: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6"/></svg>',
  };

  /* ============================================================
     Metrikler
     ============================================================ */
  async function renderMetrics() {
    const box = $("tab-metrics");
    box.innerHTML = `<div class="admin-card">Yükleniyor…</div>`;
    const { data, error } = await sb.from("metrics").select("*").order("ord");
    if (error) { box.innerHTML = `<div class="admin-card err">Hata: ${error.message}</div>`; return; }
    const holder = document.createElement("div"); holder.className = "admin-card";
    holder.innerHTML = `<h2>Metrikler <span class="admin-hint">(anasayfa KPI kartları)</span></h2>`;
    const tbl = document.createElement("div"); holder.appendChild(tbl);
    box.innerHTML = ""; box.appendChild(holder);
    buildTable(tbl, {
      table: "metrics", pk: ["key"], rows: data,
      columns: [
        { key: "key", label: "Anahtar", editable: false },
        { key: "label", label: "Etiket" },
        { key: "value", label: "Değer", type: "number" },
        { key: "unit", label: "Birim" },
        { key: "year", label: "Yıl", type: "number" },
        { key: "prev", label: "Önceki", type: "number" },
        { key: "yoy", label: "YoY %", type: "number", step: "0.1" },
        { key: "ord", label: "Sıra", type: "number" },
      ],
    });
  }

  /* ============================================================
     Limanlar
     ============================================================ */
  async function renderPorts() {
    const box = $("tab-ports");
    box.innerHTML = `<div class="admin-card">Yükleniyor…</div>`;
    const { data, error } = await sb.from("ports").select("*").order("name");
    if (error) { box.innerHTML = `<div class="admin-card err">Hata: ${error.message}</div>`; return; }
    const holder = document.createElement("div"); holder.className = "admin-card";
    holder.innerHTML = `<h2>Limanlar <span class="admin-hint">(${data.length} liman — harita ve grafiklerde kullanılır)</span></h2>`;
    const tbl = document.createElement("div"); holder.appendChild(tbl);
    box.innerHTML = ""; box.appendChild(holder);
    buildTable(tbl, {
      table: "ports", pk: ["name"], rows: data,
      columns: [
        { key: "name", label: "Liman" },
        { key: "sea", label: "Deniz" },
        { key: "lat", label: "Enlem", type: "number", step: "0.01" },
        { key: "lon", label: "Boylam", type: "number", step: "0.01" },
        { key: "mx", label: "Harita X", type: "number", step: "0.1" },
        { key: "my", label: "Harita Y", type: "number", step: "0.1" },
        { key: "yuk_ton", label: "Yük (ton)", type: "number" },
        { key: "konteyner_teu", label: "Konteyner (TEU)", type: "number" },
      ],
    });
  }

  /* ============================================================
     Trendler
     ============================================================ */
  async function renderTrends() {
    const box = $("tab-trends");
    box.innerHTML = `
      <div class="admin-card">
        <h2>Trendler <span class="admin-hint">(yıllık zaman serileri)</span></h2>
        <div class="field" style="max-width:280px">
          <label>Metrik</label>
          <select id="trendMetric"></select>
        </div>
        <div id="trendTbl"></div>
      </div>`;
    const { data: metrics } = await sb.from("trends").select("metric").limit(1000);
    const uniq = [...new Set((metrics || []).map((r) => r.metric))].sort();
    const sel = $("trendMetric");
    sel.innerHTML = uniq.map((m) => `<option value="${m}">${m}</option>`).join("");
    async function load() {
      const metric = sel.value;
      const { data, error } = await sb.from("trends").select("*").eq("metric", metric).order("year", { ascending: false });
      const tbl = $("trendTbl");
      if (error) { tbl.innerHTML = `<p class="err">${error.message}</p>`; return; }
      buildTable(tbl, {
        table: "trends", pk: ["metric", "year"], rows: data,
        columns: [
          { key: "metric", label: "Metrik" },
          { key: "year", label: "Yıl", type: "number" },
          { key: "value", label: "Değer", type: "number" },
        ],
      });
    }
    sel.addEventListener("change", load);
    if (uniq.length) load();
  }

  /* ============================================================
     Detay veri (fact_*) — kategori + yıl filtreli
     ============================================================ */
  const CATS = ["yuk", "konteyner", "gemi", "kruvaziyer", "roro", "bogazlar", "kabotaj", "filo"];
  const TABLES = {
    monthly: { table: "fact_monthly", pk: ["kategori", "yil", "ay", "seri"],
      cols: [{ key: "kategori", label: "Kategori" }, { key: "yil", label: "Yıl", type: "number" },
             { key: "ay", label: "Ay", type: "number" }, { key: "seri", label: "Seri" }, { key: "deger", label: "Değer", type: "number" }] },
    port: { table: "fact_port", pk: ["kategori", "yil", "liman", "seri"],
      cols: [{ key: "kategori", label: "Kategori" }, { key: "yil", label: "Yıl", type: "number" },
             { key: "liman", label: "Liman" }, { key: "seri", label: "Seri" }, { key: "deger", label: "Değer", type: "number" }] },
    breakdown: { table: "fact_breakdown", pk: ["kategori", "yil", "boyut", "etiket", "seri"],
      cols: [{ key: "kategori", label: "Kategori" }, { key: "yil", label: "Yıl", type: "number" }, { key: "boyut", label: "Boyut" },
             { key: "etiket", label: "Etiket" }, { key: "seri", label: "Seri" }, { key: "deger", label: "Değer", type: "number" }] },
    country: { table: "fact_country", pk: ["kategori", "yil", "ulke", "seri"],
      cols: [{ key: "kategori", label: "Kategori" }, { key: "yil", label: "Yıl", type: "number" },
             { key: "ulke", label: "Ülke" }, { key: "seri", label: "Seri" }, { key: "deger", label: "Değer", type: "number" }] },
  };

  function renderDetail() {
    const box = $("tab-detail");
    box.innerHTML = `
      <div class="admin-card">
        <h2>Detay Veri <span class="admin-hint">(aylık / liman / kırılım / ülke — 26.000+ satır, filtre zorunlu)</span></h2>
        <div class="admin-filters">
          <div class="field"><label>Tablo</label>
            <select id="dTur">
              <option value="monthly">Aylık</option>
              <option value="port">Liman</option>
              <option value="breakdown">Kırılım</option>
              <option value="country">Ülke</option>
            </select></div>
          <div class="field"><label>Kategori</label>
            <select id="dKat">${CATS.map((c) => `<option value="${c}">${c}</option>`).join("")}</select></div>
          <div class="field"><label>Yıl</label><input type="number" id="dYil" placeholder="örn. 2024" value="2024"></div>
          <button class="btn btn-primary" id="dGetir" type="button">Getir</button>
        </div>
        <div id="detailTbl"></div>
      </div>`;
    $("dGetir").addEventListener("click", loadDetail);
  }

  async function loadDetail() {
    const tur = $("dTur").value, kat = $("dKat").value, yil = $("dYil").value;
    const cfg = TABLES[tur];
    const tbl = $("detailTbl");
    tbl.innerHTML = "Yükleniyor…";
    let q = sb.from(cfg.table).select("*").eq("kategori", kat);
    if (yil) q = q.eq("yil", +yil);
    q = q.limit(500);
    const { data, error } = await q;
    if (error) { tbl.innerHTML = `<p class="err">${error.message}</p>`; return; }
    if (!data.length) { tbl.innerHTML = `<p class="admin-hint">Sonuç yok. (500 satır sınırı — daha dar filtre dene)</p>`; return; }
    buildTable(tbl, { table: cfg.table, pk: cfg.pk, rows: data, columns: cfg.cols });
  }

  /* ---------- Başlat ---------- */
  sb.auth.onAuthStateChange(() => refreshSession());
  refreshSession();
})();
