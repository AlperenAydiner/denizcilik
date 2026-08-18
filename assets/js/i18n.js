/* ============================================================
   i18n.js — iki dilli (TR/EN) altyapı + sayı biçimlendirme
   window.I18N.t(key) · .p({tr,en}) · dil / tema değiştirme
   ============================================================ */
(function () {
  "use strict";

  var LANG = (document.documentElement.getAttribute("data-lang") === "en") ? "en" : "tr";

  /* ---------- Sözlük (ortak arayüz metinleri) ---------- */
  var DICT = {
    // Üst bar & menü
    "top.sitemap":   { tr: "Site Haritası", en: "Site Map" },
    "top.contact":   { tr: "İletişim", en: "Contact" },
    "top.lang":      { tr: "English", en: "Türkçe" },
    "top.theme":     { tr: "Temayı değiştir", en: "Toggle theme" },
    "top.langAria":  { tr: "Switch to English", en: "Türkçeye geç" },

    "brand.sub1":    { tr: "Denizcilik", en: "Maritime" },
    "brand.sub2":    { tr: "İstatistikleri", en: "Statistics" },
    "nav.aria":      { tr: "Ana menü", en: "Main menu" },
    "menu.aria":     { tr: "Menü", en: "Menu" },
    "home.aria":     { tr: "Anasayfa", en: "Home" },

    // Menü öğeleri
    "nav.yuk":        { tr: "Yük", en: "Cargo" },
    "nav.konteyner":  { tr: "Konteyner", en: "Container" },
    "nav.bogazlar":   { tr: "Türk Boğazları", en: "Turkish Straits" },
    "nav.kabotaj":    { tr: "Kabotaj Hattı", en: "Cabotage" },
    "nav.kruvaziyer": { tr: "Kruvaziyer", en: "Cruise" },
    "nav.roro":       { tr: "RO-RO Araç", en: "RO-RO Vehicles" },
    "nav.gemi":       { tr: "Gemi", en: "Ships" },
    "nav.filo":       { tr: "Filo", en: "Fleet" },
    "nav.dosyalar":   { tr: "Dosyalar", en: "Files" },

    // Footer
    "foot.blurb":    { tr: "Türkiye'nin deniz ticareti, limanları, gemileri ve yolcularına ait resmi istatistikler.",
                       en: "Official statistics on Türkiye's maritime trade, ports, ships and passengers." },
    "foot.address":  { tr: "Hakkı Turayliç Cad. No:5, 06338 Emek / Ankara", en: "Hakkı Turayliç Cad. No:5, 06338 Emek / Ankara" },
    "foot.switch":   { tr: "Santral", en: "Switchboard" },
    "foot.callcenter": { tr: "Çağrı Merkezi", en: "Call Center" },
    "foot.h.stats":  { tr: "İstatistikler", en: "Statistics" },
    "foot.h.corp":   { tr: "Kurumsal", en: "Corporate" },
    "foot.other":    { tr: "Diğer İstatistikler", en: "Other Statistics" },
    "foot.dgm":      { tr: "Denizcilik G.M.", en: "Directorate General" },
    "foot.copy":     { tr: "T.C. Ulaştırma ve Altyapı Bakanlığı — Denizcilik Genel Müdürlüğü",
                       en: "Republic of Türkiye Ministry of Transport and Infrastructure — Directorate General of Maritime Affairs" },
    "foot.source":   { tr: "Veri kaynağı", en: "Data source" },

    // Anasayfa
    "home.title":    { tr: "Türkiye'nin Denizcilik Verileri — T.C. UAB Denizcilik Genel Müdürlüğü",
                       en: "Türkiye's Maritime Data — Directorate General of Maritime Affairs" },
    "home.eyebrow":  { tr: "Resmi Denizcilik İstatistikleri Panosu", en: "Official Maritime Statistics Dashboard" },
    "home.h1":       { tr: "Türkiye'nin Denizcilik Verileri", en: "Türkiye's Maritime Data" },
    "home.lead":     { tr: "Türkiye'nin deniz ticareti tek bakışta. En güncel yıla ait çarpıcı rakamlar ve geçen yıla göre değişim.",
                       en: "Türkiye's maritime trade at a glance. Headline figures for the latest year and the year-on-year change." },
    "home.yearcap":  { tr: "güncel veri yılı", en: "latest data year" },
    "home.foot":     { tr: "Kaynak: T.C. Ulaştırma ve Altyapı Bakanlığı — Denizcilik Genel Müdürlüğü. Ayrıntılı veriler için bir kartın üzerine tıklayın.",
                       en: "Source: Ministry of Transport and Infrastructure — Directorate General of Maritime Affairs. Click a card for detailed data." },
    "home.explore":  { tr: "Ayrıntılı incele", en: "Explore details" },

    // KPI kartları
    "kpi.yuk.l":  { tr: "Elleçlenen Yük", en: "Cargo Handled" },
    "kpi.yuk.s":  { tr: "Limanlarda gemilere yüklenen ve indirilen toplam yük", en: "Total cargo loaded onto and unloaded from ships at ports" },
    "kpi.kon.l":  { tr: "Konteyner", en: "Container" },
    "kpi.kon.s":  { tr: "Standart konteyner (TEU) elleçleme", en: "Standard container (TEU) throughput" },
    "kpi.gemi.l": { tr: "Uğrayan Gemi", en: "Ship Calls" },
    "kpi.gemi.s": { tr: "Limanlarımıza gelen gemi sayısı", en: "Number of ships calling at our ports" },
    "kpi.bog.l":  { tr: "Boğaz Gemi Geçişi", en: "Strait Transits" },
    "kpi.bog.s":  { tr: "İstanbul Boğazı'ndan geçen gemi sayısı", en: "Ships passing through the Istanbul Strait" },
    "kpi.kru.l":  { tr: "Kruvaziyer Yolcusu", en: "Cruise Passengers" },
    "kpi.kru.s":  { tr: "Türkiye limanlarını ziyaret eden yolcular", en: "Passengers visiting Türkiye's ports" },
    "kpi.roro.l": { tr: "RO-RO ile Araç", en: "RO-RO Vehicles" },
    "kpi.roro.s": { tr: "Denizyoluyla taşınan araç sayısı", en: "Vehicles carried by sea" },
    "kpi.kab.l":  { tr: "Kabotaj Yolcusu", en: "Cabotage Passengers" },
    "kpi.kab.s":  { tr: "İç sularda vapur ve feribotla taşınan yolcu", en: "Passengers carried by domestic ferries" },
    "kpi.filo.l": { tr: "Türk Ticaret Filosu", en: "Turkish Merchant Fleet" },
    "kpi.filo.s": { tr: "1.000 GT ve üzeri Türk bayraklı gemi", en: "Turkish-flagged ships of 1,000 GT and over" },

    // Kategori sayfası — arayüz
    "cat.filter":     { tr: "Filtrele", en: "Filter" },
    "cat.year":       { tr: "Yıl", en: "Year" },
    "cat.region":     { tr: "Deniz bölgesi", en: "Sea region" },
    "cat.all":        { tr: "Tümü", en: "All" },
    "cat.src":        { tr: "Resmi kaynak sayfası", en: "Official source page" },
    "cat.insightHead":{ tr: "Bu veri ne anlatıyor?", en: "What does this tell us?" },
    "cat.trend":      { tr: "Yıllara göre gelişim", en: "Trend over the years" },
    "cat.ports":      { tr: "Limanlara göre dağılım", en: "Distribution by port" },
    "cat.onmap":      { tr: "Harita üzerinde", en: "On the map" },
    "cat.bubble":     { tr: "Balon büyüklüğü limanın hacmini gösterir", en: "Bubble size shows each port's volume" },
    "cat.portsSub":   { tr: "seçili bölgedeki limanlar", en: "ports in the selected region" },
    "cat.noteRegion": { tr: "Liman kırılımı en güncel yıla ({y}) aittir.", en: "The port breakdown is for the latest year ({y})." },
    "cat.noteSummary":{ tr: "Bu kategori için {y} yılı özet verisi gösterilmektedir. Tüm yılların dosyaları Dosyalar sayfasındadır.",
                        en: "Summary data for {y} is shown for this category. Files for all years are on the Files page." },
    "cat.increase":   { tr: "artış", en: "increase" },
    "cat.decrease":   { tr: "azalış", en: "decrease" },
    "cat.yearOf":     { tr: "{y} yılı", en: "in {y}" },
    "cat.vsPrev":     { tr: "{p}'e göre {d}", en: "{d} vs. {p}" },

    // Genel
    "bc.home":     { tr: "Anasayfa", en: "Home" },

    // Deniz bölgeleri
    "sea.Marmara":   { tr: "Marmara", en: "Marmara" },
    "sea.Ege":       { tr: "Ege", en: "Aegean" },
    "sea.Akdeniz":   { tr: "Akdeniz", en: "Mediterranean" },
    "sea.Karadeniz": { tr: "Karadeniz", en: "Black Sea" },

    // Harita sayfası
    "map.title":   { tr: "Türkiye Limanları Haritası", en: "Map of Türkiye's Ports" },
    "map.h1":      { tr: "Türkiye Limanları Haritası", en: "Map of Türkiye's Ports" },
    "map.bc":      { tr: "Harita", en: "Map" },
    "map.intro":   { tr: "Her balonun büyüklüğü o limanın hacmini gösterir. Bir limanın üzerine gelin; yük ve konteyner rakamlarını görün.",
                     en: "Each bubble's size shows that port's volume. Hover a port to see its cargo and container figures." },
    "map.cargo":   { tr: "Yük (ton)", en: "Cargo (tons)" },
    "map.cont":    { tr: "Konteyner (TEU)", en: "Container (TEU)" },
    "map.rank":    { tr: "Limanlar sıralaması", en: "Port ranking" },
    "map.rankSub": { tr: "Sütun başlığına tıklayarak sıralayın.", en: "Click a column header to sort." },
    "map.th.port": { tr: "Liman", en: "Port" },
    "map.th.sea":  { tr: "Deniz", en: "Sea" },
    "map.tt.cargo":{ tr: "Toplam yük", en: "Total cargo" },
    "map.tt.cont": { tr: "Konteyner", en: "Container" },

    // Dosyalar / arşiv
    "files.title":  { tr: "Dosyalar — T.C. UAB Denizcilik İstatistikleri", en: "Files — Directorate General of Maritime Affairs" },
    "files.bc":     { tr: "Dosyalar", en: "Files" },
    "files.h1":     { tr: "İstatistik Dosyaları", en: "Statistics Files" },
    "files.intro":  { tr: "Denizcilik Genel Müdürlüğü'nün 2003 yılından bugüne yayımladığı tüm resmi istatistik dosyaları. Kategori ve yıla göre listelenmiştir.",
                      en: "All official statistics files published by the Directorate General of Maritime Affairs since 2003, listed by category and year." },
    "files.search": { tr: "Dosya adında ara…", en: "Search file name…" },
    "files.searchAria": { tr: "Dosya ara", en: "Search files" },
    "files.total":  { tr: "Toplam <b>{n}</b> resmi istatistik dosyası listeleniyor.", en: "A total of <b>{n}</b> official statistics files are listed." },
    "files.count":  { tr: "{n} dosya", en: "{n} files" },
    "files.empty":  { tr: "“{q}” için {c} kategorisinde dosya bulunamadı.", en: "No files found for “{q}” in the {c} category." },
    "files.catFiles": { tr: "istatistik dosyaları", en: "statistics files" },

    // İletişim
    "ct.title":   { tr: "İletişim — T.C. UAB Denizcilik Verileri", en: "Contact — Directorate General of Maritime Affairs" },
    "ct.bc":      { tr: "İletişim", en: "Contact" },
    "ct.h1":      { tr: "İletişim", en: "Contact" },
    "ct.intro":   { tr: "Denizcilik istatistikleriyle ilgili soru, görüş ve talepleriniz için Denizcilik Genel Müdürlüğü ile iletişime geçebilirsiniz.",
                    en: "For questions, feedback or requests about maritime statistics, you can contact the Directorate General of Maritime Affairs." },
    "ct.org":     { tr: "Denizcilik Genel Müdürlüğü", en: "Directorate General of Maritime Affairs" },
    "ct.addr":    { tr: "Adres", en: "Address" },
    "ct.switch":  { tr: "Santral", en: "Switchboard" },
    "ct.fax":     { tr: "Faks", en: "Fax" },
    "ct.web":     { tr: "Web", en: "Web" },
    "ct.call":    { tr: "Çağrı Merkezi", en: "Call Center" },
    "ct.msgH":    { tr: "Mesaj gönderin", en: "Send a message" },
    "ct.msgSub":  { tr: "Formu doldurduğunuzda varsayılan e-posta uygulamanız açılır.", en: "Submitting the form opens your default email app." },
    "ct.name":    { tr: "Ad Soyad", en: "Full name" },
    "ct.email":   { tr: "E-posta", en: "Email" },
    "ct.msg":     { tr: "Mesajınız", en: "Your message" },
    "ct.send":    { tr: "Gönder", en: "Send" },

    // Diğer İstatistikler
    "ot.title":   { tr: "Diğer İstatistikler — T.C. UAB Denizcilik Verileri", en: "Other Statistics — Directorate General of Maritime Affairs" },
    "ot.bc":      { tr: "Diğer İstatistikler", en: "Other Statistics" },
    "ot.h1":      { tr: "Diğer İstatistikler", en: "Other Statistics" },
    "ot.intro":   { tr: "Ana kategorilerin dışında kalan denizcilik verileri ve Denizcilik Genel Müdürlüğü'nün diğer resmi istatistik kaynakları.",
                    en: "Maritime data beyond the main categories and other official statistics sources of the Directorate General of Maritime Affairs." },
    "ot.c1h":     { tr: "Denizcilik Genel Müdürlüğü", en: "Directorate General of Maritime Affairs" },
    "ot.c1p":     { tr: "Kurumun tüm hizmet ve yayınları", en: "All services and publications" },
    "ot.c1g":     { tr: "Siteye git", en: "Visit site" },
    "ot.c2h":     { tr: "Ek İstatistik Dosyaları", en: "Additional Statistics Files" },
    "ot.c2p":     { tr: "Resmi arşivdeki diğer veri setleri", en: "Other datasets in the official archive" },
    "ot.c2g":     { tr: "Dosyaları aç", en: "Open files" },
    "ot.c3h":     { tr: "Ulaştırma ve Altyapı Bakanlığı", en: "Ministry of Transport and Infrastructure" },
    "ot.c3p":     { tr: "Tüm ulaştırma modlarına dair veriler", en: "Data on all modes of transport" },
    "ot.c3g":     { tr: "Bakanlığa git", en: "Visit ministry" },

    // Site haritası
    "sm.title":   { tr: "Site Haritası — T.C. UAB Denizcilik Verileri", en: "Site Map — Directorate General of Maritime Affairs" },
    "sm.bc":      { tr: "Site Haritası", en: "Site Map" },
    "sm.h1":      { tr: "Site Haritası", en: "Site Map" },
    "sm.intro":   { tr: "Platformdaki tüm sayfalar tek bakışta.", en: "Every page on the platform at a glance." },
    "sm.g1":      { tr: "Deniz Ticareti", en: "Maritime Trade" },
    "sm.g2":      { tr: "Gemiler", en: "Ships" },
    "sm.g3":      { tr: "Yolcu & Taşımacılık", en: "Passengers & Transport" },
    "sm.g4":      { tr: "Keşfet", en: "Explore" },
    "sm.g5":      { tr: "Kurum", en: "Institution" },
    "sm.portsmap":{ tr: "Limanlar Haritası", en: "Ports Map" },
    "sm.ministry":{ tr: "Bakanlık", en: "Ministry" }
  };

  /* ---------- Ölçek & birim çevirileri (sayı biçimlendirme) ---------- */
  var SCALE = {
    tr: { milyar: "milyar", milyon: "milyon", bin: "bin", "": "" },
    en: { milyar: "billion", milyon: "million", bin: "thousand", "": "" }
  };
  var UNIT = {
    "ton":      { tr: "ton", en: "tons" },
    "TEU":      { tr: "TEU", en: "TEU" },
    "gemi":     { tr: "gemi", en: "ships" },
    "yolcu":    { tr: "yolcu", en: "passengers" },
    "araç":     { tr: "araç", en: "vehicles" },
    "geçiş":    { tr: "geçiş", en: "transits" },
    "kişi":     { tr: "kişi", en: "people" },
    "gros ton": { tr: "gros ton", en: "gross tons" }
  };

  function t(key, vars) {
    var e = DICT[key];
    var s = e ? (e[LANG] != null ? e[LANG] : e.tr) : key;
    if (vars) for (var k in vars) s = s.replace("{" + k + "}", vars[k]);
    return s;
  }
  // {tr, en} nesnesi ya da düz metin seç
  function p(x) {
    if (x == null) return "";
    if (typeof x === "string") return x;
    return x[LANG] != null ? x[LANG] : x.tr;
  }
  function scale(u) { return (SCALE[LANG][u] != null ? SCALE[LANG][u] : u); }
  function unit(u) { var e = UNIT[u]; return e ? e[LANG] : u; }

  var locale = LANG === "en" ? "en-US" : "tr-TR";

  function setLang(l) {
    if (l !== "tr" && l !== "en") return;
    try { localStorage.setItem("md-lang", l); } catch (e) {}
    location.reload();
  }
  function toggleLang() { setLang(LANG === "tr" ? "en" : "tr"); }

  function setTheme(th) {
    if (th !== "dark" && th !== "light") return;
    document.documentElement.setAttribute("data-theme", th);
    try { localStorage.setItem("md-theme", th); } catch (e) {}
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    setTheme(cur === "dark" ? "light" : "dark");
  }

  // [data-i18n] öğelerini çevir (statik sayfalar)
  function applyStatic(root) {
    (root || document).querySelectorAll("[data-i18n]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n"));
    });
    (root || document).querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    (root || document).querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    (root || document).querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-title");
      el.setAttribute("title", t(k)); document.title = t(k);
    });
  }

  window.I18N = {
    lang: LANG, t: t, p: p, scale: scale, unit: unit, locale: locale,
    setLang: setLang, toggleLang: toggleLang,
    setTheme: setTheme, toggleTheme: toggleTheme, applyStatic: applyStatic
  };

  document.addEventListener("DOMContentLoaded", function () { applyStatic(document); });
})();
