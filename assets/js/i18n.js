/* ============================================================
   i18n.js — TR / EN dil katmanı
   Kullanım: t("nav.yuk") · data-i18n="nav.yuk" · MDLang.set("en")
   ============================================================ */
(function () {
  "use strict";

  const DICT = {
    tr: {
      "site.title": "Denizcilik İstatistikleri",
      "site.org": "T.C. Ulaştırma ve Altyapı Bakanlığı",
      "site.sub1": "Denizcilik", "site.sub2": "İstatistikleri",

      "nav.yuk": "Yük", "nav.konteyner": "Konteyner", "nav.bogazlar": "Türk Boğazları",
      "nav.kabotaj": "Kabotaj Hattı", "nav.kruvaziyer": "Kruvaziyer", "nav.roro": "RO-RO Araç",
      "nav.gemi": "Gemi", "nav.filo": "Filo", "nav.dosyalar": "Dosyalar",
      "nav.home": "Anasayfa", "nav.map": "Harita", "nav.contact": "İletişim",
      "nav.sitemap": "Site Haritası", "nav.other": "Diğer İstatistikler",

      "ui.theme": "Temayı değiştir", "ui.lang": "English", "ui.menu": "Menü",
      "ui.search": "Dosya adında ara…", "ui.all": "Tümü", "ui.year": "Yıl",
      "ui.region": "Deniz bölgesi", "ui.filter": "Filtrele", "ui.files": "dosya",
      "ui.detail": "Ayrıntılı incele", "ui.source": "Resmi kaynak sayfası",
      "ui.viewFiles": "Bu kategorinin dosyaları",
      "ui.notFound": "Sonuç bulunamadı.",
      "ui.month": "Ay", "ui.clear": "Temizle", "ui.series": "Seri", "ui.total": "Toplam",
      "ui.monthSelected": "ay seçili", "ui.partial": "kısmi dönem",

      "home.eyebrow": "Resmi Denizcilik İstatistikleri Panosu",
      "home.title": "Türkiye'nin Denizcilik Verileri",
      "home.lead": "Türkiye'nin deniz ticareti tek bakışta.",
      "home.yearCap": "güncel veri yılı",
      "home.source": "Kaynak: T.C. Ulaştırma ve Altyapı Bakanlığı — Denizcilik Genel Müdürlüğü.",

      "kpi.yuk": "Elleçlenen Yük", "kpi.konteyner": "Konteyner", "kpi.gemi": "Uğrayan Gemi",
      "kpi.bogaz": "Boğaz Gemi Geçişi", "kpi.kruvaziyer": "Kruvaziyer Yolcusu",
      "kpi.roro": "RO-RO ile Araç", "kpi.kabotaj": "Kabotaj Yolcusu", "kpi.filo": "Türk Ticaret Filosu",

      "unit.ton": "ton", "unit.teu": "TEU", "unit.gemi": "gemi", "unit.gecis": "geçiş",
      "unit.yolcu": "yolcu", "unit.arac": "araç", "unit.grosston": "gros ton",
      "num.milyon": "milyon", "num.milyar": "milyar", "num.bin": "bin",

      "cat.yuk": "Yük İstatistikleri", "cat.konteyner": "Konteyner İstatistikleri",
      "cat.gemi": "Gemi İstatistikleri", "cat.kruvaziyer": "Kruvaziyer İstatistikleri",
      "cat.roro": "RO-RO Araç İstatistikleri", "cat.kabotaj": "Kabotaj İstatistikleri",
      "cat.bogazlar": "Türk Boğazları Gemi Geçiş İstatistikleri", "cat.filo": "Filo İstatistikleri",

      "cat.prevYear": "Önceki yıl", "cat.topPort": "En büyük liman",
      "cat.monthTitle": "Aylara göre dağılım",
      "cat.trendTitle": "Yıllara göre gelişim", "cat.portsTitle": "Limanlara göre dağılım",
      "cat.noPortData": "Bu kategori için liman kırılımı bulunmuyor.",
      "cat.latestNote": "Liman kırılımı en güncel yıla aittir.",

      "files.title": "Dosyalar", "files.lead": "Denizcilik Genel Müdürlüğü'nün yayımladığı resmi istatistik dosyaları.",
      "files.total": "Arşivde toplam", "files.totalSuffix": "resmi istatistik dosyası.",

      "map.title": "Türkiye Limanları Haritası",
      "map.lead": "Balon büyüklüğü liman hacmini gösterir.",
      "map.table": "Limanlar sıralaması", "map.port": "Liman", "map.sea": "Deniz",
      "map.cargo": "Yük (ton)", "map.container": "Konteyner (TEU)",

      "contact.title": "İletişim", "contact.address": "Adres", "contact.phone": "Santral",
      "contact.callcenter": "Çağrı Merkezi", "contact.web": "Web",

      "footer.stats": "İstatistikler", "footer.corp": "Kurumsal",
      "footer.note": "Bu sayfa bir arayüz tasarım çalışmasıdır. Resmi yayın:",
      "footer.rights": "Tüm hakları saklıdır.",
      "footer.dataSource": "Veri kaynağı",
      "footer.affiliates": "Bağlı kuruluşlar",
      "footer.dgm": "Denizcilik Genel Müdürlüğü",
      "footer.kvkk": "KVKK Dokümanları",
    },

    en: {
      "site.title": "Maritime Statistics",
      "site.org": "Republic of Türkiye Ministry of Transport and Infrastructure",
      "site.sub1": "Maritime", "site.sub2": "Statistics",

      "nav.yuk": "Cargo", "nav.konteyner": "Container", "nav.bogazlar": "Turkish Straits",
      "nav.kabotaj": "Cabotage", "nav.kruvaziyer": "Cruise", "nav.roro": "RO-RO Vehicles",
      "nav.gemi": "Vessels", "nav.filo": "Fleet", "nav.dosyalar": "Files",
      "nav.home": "Home", "nav.map": "Map", "nav.contact": "Contact",
      "nav.sitemap": "Sitemap", "nav.other": "Other Statistics",

      "ui.theme": "Switch theme", "ui.lang": "Türkçe", "ui.menu": "Menu",
      "ui.search": "Search file name…", "ui.all": "All", "ui.year": "Year",
      "ui.region": "Sea region", "ui.filter": "Filter", "ui.files": "files",
      "ui.detail": "View details", "ui.source": "Official source page",
      "ui.viewFiles": "Files for this category",
      "ui.notFound": "No results found.",
      "ui.month": "Month", "ui.clear": "Clear", "ui.series": "Series", "ui.total": "Total",
      "ui.monthSelected": "months selected", "ui.partial": "partial period",

      "home.eyebrow": "Official Maritime Statistics Dashboard",
      "home.title": "Türkiye's Maritime Data",
      "home.lead": "Türkiye's maritime trade at a glance.",
      "home.yearCap": "current data year",
      "home.source": "Source: Ministry of Transport and Infrastructure — Directorate General of Maritime Affairs.",

      "kpi.yuk": "Cargo Handled", "kpi.konteyner": "Containers", "kpi.gemi": "Calling Vessels",
      "kpi.bogaz": "Strait Transits", "kpi.kruvaziyer": "Cruise Passengers",
      "kpi.roro": "RO-RO Vehicles", "kpi.kabotaj": "Cabotage Passengers", "kpi.filo": "Turkish Merchant Fleet",

      "unit.ton": "tonnes", "unit.teu": "TEU", "unit.gemi": "vessels", "unit.gecis": "transits",
      "unit.yolcu": "passengers", "unit.arac": "vehicles", "unit.grosston": "gross tonnage",
      "num.milyon": "million", "num.milyar": "billion", "num.bin": "thousand",

      "cat.yuk": "Cargo Statistics", "cat.konteyner": "Container Statistics",
      "cat.gemi": "Vessel Statistics", "cat.kruvaziyer": "Cruise Statistics",
      "cat.roro": "RO-RO Vehicle Statistics", "cat.kabotaj": "Cabotage Statistics",
      "cat.bogazlar": "Turkish Straits Vessel Transit Statistics", "cat.filo": "Fleet Statistics",

      "cat.prevYear": "Previous year", "cat.topPort": "Largest port",
      "cat.monthTitle": "Monthly breakdown",
      "cat.trendTitle": "Development by year", "cat.portsTitle": "Breakdown by port",
      "cat.noPortData": "No port breakdown available for this category.",
      "cat.latestNote": "Port breakdown is for the most recent year.",

      "files.title": "Files", "files.lead": "Official statistics files published by the Directorate General of Maritime Affairs.",
      "files.total": "A total of", "files.totalSuffix": "official statistics files.",

      "map.title": "Ports of Türkiye Map",
      "map.lead": "Bubble size indicates port volume.",
      "map.table": "Port ranking", "map.port": "Port", "map.sea": "Sea",
      "map.cargo": "Cargo (tonnes)", "map.container": "Containers (TEU)",

      "contact.title": "Contact", "contact.address": "Address", "contact.phone": "Switchboard",
      "contact.callcenter": "Call Centre", "contact.web": "Web",

      "footer.stats": "Statistics", "footer.corp": "Corporate",
      "footer.note": "This page is an interface design study. Official publication:",
      "footer.rights": "All rights reserved.",
      "footer.dataSource": "Data source",
      "footer.affiliates": "Affiliated institutions",
      "footer.dgm": "Directorate General of Maritime Affairs",
      "footer.kvkk": "Data Protection Documents",
    },
  };

  const KEY = "md-lang";
  let lang = (function () {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "tr") return q;
    return localStorage.getItem(KEY) || "tr";
  })();

  function t(key) {
    return (DICT[lang] && DICT[lang][key]) || (DICT.tr[key] != null ? DICT.tr[key] : key);
  }

  function apply(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    (root || document).querySelectorAll("[data-i18n-ph]").forEach((el) => {
      el.setAttribute("placeholder", t(el.dataset.i18nPh));
    });
    (root || document).querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.setAttribute("title", t(el.dataset.i18nTitle));
      el.setAttribute("aria-label", t(el.dataset.i18nTitle));
    });
    document.documentElement.lang = lang;
  }

  window.MDLang = {
    get: () => lang,
    t: t,
    apply: apply,
    locale: () => (lang === "en" ? "en-GB" : "tr-TR"),
    set(next) {
      if (next !== "tr" && next !== "en") return;
      lang = next;
      localStorage.setItem(KEY, next);
      location.reload();
    },
    toggle() { this.set(lang === "tr" ? "en" : "tr"); },
    // Düzenleme modu için: bir anahtarın ham TR/EN metnini döndürür (görüntülenen dilden bağımsız)
    raw: (key) => ({ tr: DICT.tr[key] != null ? DICT.tr[key] : "", en: DICT.en[key] != null ? DICT.en[key] : "" }),
    // Düzenleme modu için: kaydedilen değeri sözlüğe yazar ve sayfayı yeniden boyar
    setRaw(key, tr, en) {
      DICT.tr[key] = tr; DICT.en[key] = en;
      apply();
    },
  };
  window.t = t;

  document.documentElement.lang = lang;

  /* ---------- İçerik override: admin panelden düzenlenen metinler ----------
     Supabase 'content' tablosundaki değerler DICT'in üzerine yazılır. Sayfa
     script'leri window.MD_I18N_READY'yi bekleyip sonra t()/render çağırmalı
     (aksi halde ilk boyama hardcoded metinle olur — kabul edilebilir, apply()
     ile [data-i18n] işaretli elemanlar zaten yeniden boyanır). */
  window.MD_I18N_READY = (async () => {
    try {
      const URL = "https://mczowhdwwdidchtgeioo.supabase.co";
      const KEY = "sb_publishable_0GoNDg3SAFC7dK1AOc2SsA_u7bN8Bc2";
      const r = await fetch(URL + "/rest/v1/content?select=key,tr,en", {
        headers: { apikey: KEY, Authorization: "Bearer " + KEY },
      });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const rows = await r.json();
      if (!Array.isArray(rows) || !rows.length) throw new Error("boş content");
      rows.forEach((row) => {
        if (row.tr) DICT.tr[row.key] = row.tr;
        if (row.en) DICT.en[row.key] = row.en;
      });
      apply();
      console.info("[i18n] İçerik Supabase'den yüklendi (" + rows.length + " metin).");
    } catch (e) {
      console.warn("[i18n] İçerik Supabase'den yüklenemedi, gömülü metinler kullanılıyor:", e.message);
    }
  })();
})();
