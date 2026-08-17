/* ============================================================
   home.js — anasayfa: veri-güdümlü kurgu
   bigstats · özet · gemi yolculuğu · harita · timeline · grafikler
   ============================================================ */
(function () {
  "use strict";
  const D = window.MARITIME_DATA;
  if (!D) return;
  const U = window.MDUtil, C = window.MDCharts;
  const H = D.headline, P = D.ports;
  const byName = (n) => P.find((p) => p.name === n) || {};

  /* ---------- Terim sözlüğü ---------- */
  const GLOSS = {
    teu: "TEU = Yirmi fitlik standart konteyner birimi. 1 TEU yaklaşık 6 metre uzunluğunda bir konteynerdir.",
    ellecleme: "Elleçleme = Limanlarda gemilere yüklenen ve gemilerden indirilen toplam yük.",
    roro: "RO-RO = Araçların tekerlekleri üzerinde gemiye girip indiği, araç taşıyan gemiler.",
    kabotaj: "Kabotaj = Bir ülkenin kendi limanları arasında, kendi kıyılarında yaptığı deniz taşımacılığı.",
    groston: "Gros ton = Geminin toplam iç hacmini gösteren ölçü birimi (ağırlık değil, hacim).",
  };
  const term = (txt, key) => `<span class="term" data-tip="${GLOSS[key]}">${txt}</span>`;

  /* ---------- Büyük istatistik şeridi ---------- */
  function bigStats() {
    const host = document.getElementById("bigStats");
    if (!host) return;
    const cells = [
      { d: H.yuk_ton.deger, cap: "Türkiye limanlarında " + term("elleçlenen", "ellecleme") + " toplam yük" },
      { d: H.konteyner_teu.deger, cap: "Elleçlenen " + term("konteyner", "teu") + " (TEU)" },
      { d: H.gemi_sayisi.deger, cap: "Limanlara uğrayan gemi" },
      { d: H.kruvaziyer_yolcu.deger, cap: "Kruvaziyer yolcusu" },
      { d: H.roro_arac.deger, cap: term("RO-RO", "roro") + " ile taşınan araç" },
    ];
    host.innerHTML = cells.map((c) => {
      const hv = U.human(c.d);
      return `<div class="cell reveal"><div class="num"><span data-count="${hv.v.replace(',', '.')}" data-dec="${hv.v.includes(',') ? 1 : 0}">${hv.v}</span>${hv.u ? `<span class="u">${hv.u}</span>` : ""}</div><div class="cap">${c.cap}</div></div>`;
    }).join("");
  }

  /* ---------- "Türkiye'nin Denizcilik Özeti" (YoY) ---------- */
  function summary() {
    const host = document.getElementById("summaryGrid");
    if (!host) return;
    const items = [
      { key: "yuk_ton", ic: "yuk", label: "Toplam Yük", unit: "ton", sub: "Limanlarda elleçlenen" },
      { key: "konteyner_teu", ic: "konteyner", label: "Konteyner", unit: "TEU", sub: "Standart konteyner" },
      { key: "kruvaziyer_yolcu", ic: "kruvaziyer", label: "Kruvaziyer Yolcusu", unit: "kişi", sub: "Türkiye limanlarında" },
      { key: "bogaz_gecis", ic: "bogaz", label: "Boğaz Gemi Geçişi", unit: "gemi", sub: "İstanbul Boğazı" },
    ];
    const ICON = window.__ICONS || {};
    host.innerHTML = items.map((it) => {
      const m = H[it.key], hv = U.human(m.deger);
      const up = m.yoy >= 0;
      return `<div class="stat-card reveal">
        <div class="lbl"><span class="ic" style="color:var(--c-${it.ic === 'yuk' ? 'yuk' : it.ic === 'konteyner' ? 'konteyner' : it.ic === 'kruvaziyer' ? 'kruvaziyer' : 'bogaz'})">${icon(it.ic)}</span>${it.label}</div>
        <div class="delta ${up ? "up" : "down"}">${up ? arrow("up") : arrow("down")} %${Math.abs(m.yoy).toString().replace('.', ',')}</div>
        <div class="num"><span data-count="${hv.v.replace(',', '.')}" data-dec="${hv.v.includes(',') ? 1 : 0}">${hv.v}</span> <span class="unit">${hv.u} ${it.unit}</span></div>
        <div class="sub">${it.sub} · ${m.yil} (${m.yil - 1}'e göre ${up ? "artış" : "azalış"})</div>
      </div>`;
    }).join("");
  }

  /* ---------- Gemi yolculuğu ---------- */
  const JOURNEY = [
    { port: "İstanbul", region: "Marmara Denizi", title: "Yolculuk İstanbul'da başlıyor",
      desc: "İki denizi birbirine bağlayan İstanbul Boğazı, dünyanın en yoğun su yollarından biri. Her gün yüzlerce gemi buradan geçiyor.",
      metrics: [{ v: H.bogaz_gecis.deger, k: "Boğazdan geçen gemi (yıllık)", raw: true }, { key: "yuk_ton", nm: "İstanbul", k: "Limanlarda elleçlenen yük" }] },
    { port: "Kocaeli", region: "Körfez · Marmara", title: "Kocaeli — Türkiye'nin yük kapısı",
      desc: "İzmit Körfezi'ndeki limanlar, ülkenin en büyük yük hacimlerinden birini elleçliyor. Sanayinin denize açılan yüzü burası.",
      metrics: [{ key: "yuk_ton", nm: "Kocaeli", k: "Elleçlenen yük" }, { key: "konteyner_teu", nm: "Kocaeli", k: "Konteyner" }] },
    { port: "Çanakkale", region: "Çanakkale Boğazı", title: "Çanakkale Boğazı'ndan geçiş",
      desc: "Ege'yi Marmara'ya bağlayan bu dar geçit, hem tarihî hem de ticari açıdan kritik bir deniz yolu.",
      metrics: [{ key: "yuk_ton", nm: "Çanakkale", k: "Elleçlenen yük" }] },
    { port: "İzmir", region: "Ege Denizi", title: "Ege'nin limanları: İzmir & Aliağa",
      desc: "Aliağa ve İzmir limanları, Ege kıyısının konteyner ve yük trafiğinin merkezi. İhracatın önemli bir kısmı buradan denize açılıyor.",
      metrics: [{ key: "yuk_ton", nm: "Aliağa", k: "Aliağa · yük" }, { key: "konteyner_teu", nm: "İzmir", k: "İzmir · konteyner" }] },
    { port: "Antalya", region: "Akdeniz · Batı", title: "Antalya kıyıları",
      desc: "Turizmin ve kruvaziyer trafiğinin yoğunlaştığı Akdeniz kıyısı. Yolcu gemileri için önemli bir uğrak.",
      metrics: [{ key: "yuk_ton", nm: "Antalya", k: "Elleçlenen yük" }] },
    { port: "Mersin", region: "Akdeniz", title: "Mersin — Akdeniz'in konteyner üssü",
      desc: "Türkiye'nin en büyük konteyner limanlarından biri. Doğu Akdeniz ticaretinin kalbi burada atıyor.",
      metrics: [{ key: "konteyner_teu", nm: "Mersin", k: "Konteyner" }, { key: "yuk_ton", nm: "Mersin", k: "Toplam yük" }] },
    { port: "İskenderun", region: "Akdeniz · Doğu", title: "İskenderun Körfezi",
      desc: "Demir-çelik ve sanayi yükünün yoğun olduğu körfez. Ağır yük taşımacılığında ülkenin öncü bölgelerinden.",
      metrics: [{ key: "yuk_ton", nm: "İskenderun", k: "Elleçlenen yük" }] },
    { port: "Samsun", region: "Karadeniz", title: "Boğazlardan Karadeniz'e: Samsun",
      desc: "Gemi rotasını kuzeye çevirip Boğazlardan Karadeniz'e çıkıyor. Samsun, bu kıyının en büyük limanlarından ve bölgenin lojistik merkezi.",
      metrics: [{ key: "yuk_ton", nm: "Samsun", k: "Elleçlenen yük" }] },
    { port: "Trabzon", region: "Karadeniz · Doğu", title: "Yolculuk Trabzon'da tamamlanıyor",
      desc: "Doğu Karadeniz'in kapısı Trabzon. Buraya kadar geminin izlediği rota, Türkiye'nin dört bir yanındaki denizciliğin canlılığını gösteriyor.",
      metrics: [{ key: "yuk_ton", nm: "Trabzon", k: "Elleçlenen yük" }] },
  ];

  function metricHTML(m) {
    let val, unit;
    if (m.raw) { const hv = U.human(m.v); val = hv.v; unit = hv.u + " gemi"; }
    else { const p = byName(m.nm); const v = m.key === "yuk_ton" ? p.yuk_ton : p.konteyner_teu; const hv = U.human(v || 0); val = hv.v; unit = hv.u + (m.key === "konteyner_teu" ? " TEU" : " ton"); }
    return `<div class="metric"><div class="v">${val}<span class="u"> ${unit}</span></div><div class="k">${m.k}</div></div>`;
  }

  function voyage() {
    const story = document.getElementById("voyageStory");
    const stage = document.getElementById("voyageStage");
    if (!story || !stage) return;

    story.innerHTML = JOURNEY.map((s, i) => `
      <div class="voyage-step" data-step="${i}" data-port="${s.port}">
        <span class="region">${String(i + 1).padStart(2, "0")} · ${s.region}</span>
        <h3>${s.title}</h3>
        <p class="desc">${s.desc}</p>
        <div class="metrics">${s.metrics.map(metricHTML).join("")}</div>
      </div>`).join("");

    // Harita SVG
    const vb = D.map.viewBox;
    const journeyPts = JOURNEY.map((s) => byName(s.port)).filter((p) => p.mx);
    // Rota, karadan değil kıyıyı takip eden deniz güzergâhından geçer
    function smoothPath(pts) {
      if (!pts || pts.length < 2) return "";
      let d = `M${pts[0][0]},${pts[0][1]}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
        d += `C${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ` +
             `${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
      }
      return d;
    }
    const routeD = smoothPath(D.map.searoute);
    const routeBlackD = smoothPath(D.map.searoute_black);
    const dots = P.filter((p) => p.mx).map((p) =>
      `<circle class="port-dot" data-port="${p.name}" cx="${p.mx}" cy="${p.my}" r="3.4"></circle>`).join("");
    const labels = journeyPts.map((p) =>
      `<text class="port-label" x="${p.mx + 7}" y="${p.my + 3}">${p.name}</text>`).join("");

    stage.innerHTML = `<svg class="map" viewBox="${vb}" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="wakeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--cyan-400)" stop-opacity="0"/><stop offset="100%" stop-color="var(--cyan-400)" stop-opacity="0.8"/>
        </linearGradient>
        <filter id="shipShadow"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.5"/></filter>
      </defs>
      ${D.map.outline.map((d) => `<path class="land" d="${d}"></path>`).join("")}
      <path class="route" d="${routeD}"></path>
      <path class="route" d="${routeBlackD}"></path>
      ${dots}${labels}
      <g class="ship">
        <circle r="26" fill="var(--cyan-400)" opacity="0.10"><animate attributeName="r" values="18;34;18" dur="3s" repeatCount="indefinite"/></circle>
        <g class="ship-rot">
          <path class="wake" d="M0,9 C-5,22 -8,34 -6,48"/>
          <path class="wake" d="M0,9 C5,22 8,34 6,48" style="opacity:.45"/>
          <g class="ship-glyph" filter="url(#shipShadow)" transform="scale(1.5)">
            <path d="M0,-20 C5,-13.5 7.2,-6 7.2,1.5 L7.2,12.5 C7.2,15.7 4.9,18 2,18 L-2,18 C-4.9,18 -7.2,15.7 -7.2,12.5 L-7.2,1.5 C-7.2,-6 -5,-13.5 0,-20 Z"
                  fill="#e8f1f8" stroke="#15405f" stroke-width="1"/>
            <path d="M0,-16 C3.6,-11 5.4,-5.5 5.4,1.5 L5.4,11 C5.4,13.3 3.8,14.6 1.8,14.6 L-1.8,14.6 C-3.8,14.6 -5.4,13.3 -5.4,11 L-5.4,1.5 C-5.4,-5.5 -3.6,-11 0,-16 Z"
                  fill="#16405e"/>
            <rect x="-4.2" y="-8.4" width="3.7" height="3.7" rx="0.6" fill="#d99a2b"/>
            <rect x="0.5" y="-8.4" width="3.7" height="3.7" rx="0.6" fill="#c9563f"/>
            <rect x="-4.2" y="-3.4" width="3.7" height="3.7" rx="0.6" fill="#2f8f77"/>
            <rect x="0.5" y="-3.4" width="3.7" height="3.7" rx="0.6" fill="#3d92d1"/>
            <rect x="-4.2" y="1.6" width="3.7" height="3.7" rx="0.6" fill="#c9563f"/>
            <rect x="0.5" y="1.6" width="3.7" height="3.7" rx="0.6" fill="#d99a2b"/>
            <rect x="-4" y="7.4" width="8" height="5.4" rx="1.1" fill="#f2f7fb"/>
            <rect x="-2.4" y="8.8" width="4.8" height="2" rx="0.5" fill="#22506e"/>
          </g>
        </g>
      </g>
    </svg>`;

    const ship = stage.querySelector(".ship");
    const dotEls = stage.querySelectorAll(".port-dot");
    const shipRot = stage.querySelector(".ship-rot");
    function goto(i) {
      const p = byName(JOURNEY[i].port); if (!p.mx) return;
      ship.setAttribute("transform", `translate(${p.mx},${p.my})`);
      // Rotayı takip et: pruva bir sonraki limana (son durakta bir öncekinden gelen yöne) baksın
      const nxt = byName(JOURNEY[Math.min(i + 1, JOURNEY.length - 1)].port);
      const prv = byName(JOURNEY[Math.max(i - 1, 0)].port);
      const a = i < JOURNEY.length - 1 ? p : prv, b = i < JOURNEY.length - 1 ? nxt : p;
      if (shipRot && a.mx != null && b.mx != null && (b.mx !== a.mx || b.my !== a.my)) {
        const deg = (Math.atan2(b.my - a.my, b.mx - a.mx) * 180) / Math.PI + 90;
        shipRot.setAttribute("transform", `rotate(${deg.toFixed(1)})`);
      }
      dotEls.forEach((d) => d.classList.toggle("hot", d.dataset.port === JOURNEY[i].port));
    }
    goto(0);

    const steps = story.querySelectorAll(".voyage-step");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          steps.forEach((s) => s.classList.remove("active"));
          e.target.classList.add("active");
          goto(parseInt(e.target.dataset.step, 10));
        }
      });
    }, { threshold: [0.5, 0.75], rootMargin: "-20% 0px -20% 0px" });
    steps.forEach((s) => io.observe(s));
  }

  /* ---------- İnteraktif Türkiye haritası (bubble) ---------- */
  function bigMap() {
    const host = document.getElementById("bigMap");
    if (!host) return;
    let mode = "yuk_ton";
    const frame = document.createElement("div"); frame.className = "frame";
    const tip = document.createElement("div"); tip.className = "map-tooltip";
    frame.innerHTML = `
      <div class="controls">
        <button data-mode="yuk_ton" class="on">Yük (ton)</button>
        <button data-mode="konteyner_teu">Konteyner (TEU)</button>
      </div>`;
    const svgWrap = document.createElement("div");
    frame.appendChild(svgWrap); frame.appendChild(tip); host.appendChild(frame);

    function draw() {
      const vals = P.map((p) => p[mode]).filter((v) => v > 0);
      const max = Math.max(...vals);
      const R = (v) => (v > 0 ? 6 + 30 * Math.sqrt(v / max) : 0);
      const color = mode === "yuk_ton" ? "var(--c-yuk)" : "var(--c-konteyner)";
      const bubbles = P.filter((p) => p[mode] > 0).sort((a, b) => b[mode] - a[mode]).map((p) =>
        `<circle class="bubble" data-port="${p.name}" cx="${p.mx}" cy="${p.my}" r="${R(p[mode])}" style="fill:${color.replace('var(--c-yuk)', 'rgba(34,211,238,0.28)').replace('var(--c-konteyner)', 'rgba(245,167,66,0.28)')};stroke:${color}"></circle>`).join("");
      svgWrap.innerHTML = `<svg class="bigmap" viewBox="${D.map.viewBox}" preserveAspectRatio="xMidYMid meet">
        ${D.map.outline.map((d) => `<path class="land" d="${d}"></path>`).join("")}
        ${bubbles}
      </svg>`;
      svgWrap.querySelectorAll(".bubble").forEach((b) => {
        b.addEventListener("mousemove", (ev) => {
          const p = byName(b.dataset.port);
          tip.innerHTML = `<h4>${p.name} <span style="font-size:.7rem;color:var(--text-dim)">${p.sea}</span></h4>
            <div class="row"><span>Toplam yük</span><b>${U.fmt(p.yuk_ton)} ton</b></div>
            <div class="row"><span>Konteyner</span><b>${U.fmt(p.konteyner_teu)} TEU</b></div>`;
          const r = frame.getBoundingClientRect();
          tip.style.left = ev.clientX - r.left + "px"; tip.style.top = ev.clientY - r.top + "px";
          tip.classList.add("show");
        });
        b.addEventListener("mouseleave", () => tip.classList.remove("show"));
      });
    }
    draw();
    frame.querySelectorAll(".controls button").forEach((btn) => {
      btn.addEventListener("click", () => {
        frame.querySelectorAll(".controls button").forEach((x) => x.classList.remove("on"));
        btn.classList.add("on"); mode = btn.dataset.mode; draw();
      });
    });
  }

  /* ---------- Timeline (kabotaj yolcu + yük) ---------- */
  function timeline() {
    const host = document.getElementById("timeline");
    if (!host) return;
    const years = ["2015", "2020", "2022", "2024"];
    const yuk = D.trend.yuk_ton, kab = D.trend.kabotaj_yolcu, kruv = D.trend.kruvaziyer_yolcu, kon = D.trend.konteyner_teu;
    const track = years.map((y, i) =>
      `<div class="tl-year ${i === years.length - 1 ? "on" : ""}" data-year="${y}"><button>${y}</button></div>`).join("");
    host.innerHTML = `
      <div class="timeline-track">${track}</div>
      <div class="timeline-panels">
        <div class="tl-metrics" id="tlMetrics"></div>
        <div class="chart-card"><h3>Deniz yolu yük gelişimi</h3><div class="csub">Limanlarda elleçlenen toplam yük (ton)</div><div class="chart-holder" id="tlChart"></div></div>
      </div>`;

    function fillMetrics(y) {
      const m = document.getElementById("tlMetrics");
      const rows = [
        { k: "Elleçlenen yük", c: "var(--c-yuk)", v: yuk[y], u: "ton" },
        { k: "Konteyner", c: "var(--c-konteyner)", v: kon[y], u: "TEU" },
        { k: "Kabotaj yolcusu", c: "var(--c-kabotaj)", v: kab[y], u: "kişi" },
        { k: "Kruvaziyer yolcusu", c: "var(--c-kruvaziyer)", v: kruv[y], u: "kişi" },
      ];
      m.innerHTML = rows.map((r) => {
        const hv = r.v ? U.human(r.v) : { v: "—", u: "" };
        return `<div class="tl-metric"><div class="k"><i style="background:${r.c}"></i>${r.k}</div><div class="v">${hv.v} <span class="u">${hv.u} ${r.v ? r.u : ""}</span></div></div>`;
      }).join("");
    }
    fillMetrics("2024");

    const chYears = Object.keys(yuk).sort();
    C.lineArea(document.getElementById("tlChart"), {
      labels: chYears, unit: "ton",
      series: [{ name: "Elleçlenen yük", color: "var(--c-yuk)", values: chYears.map((y) => yuk[y]) }],
    });

    host.querySelectorAll(".tl-year").forEach((ty) => {
      ty.addEventListener("click", () => {
        host.querySelectorAll(".tl-year").forEach((x) => x.classList.remove("on"));
        ty.classList.add("on"); fillMetrics(ty.dataset.year);
      });
    });
  }

  /* ---------- Anasayfa grafikleri ---------- */
  function homeCharts() {
    const host = document.getElementById("homeCharts");
    if (!host) return;
    // en büyük limanlar (yük)
    const topYuk = [...P].filter((p) => p.yuk_ton).sort((a, b) => b.yuk_ton - a.yuk_ton).slice(0, 8);
    const topKon = [...P].filter((p) => p.konteyner_teu).sort((a, b) => b.konteyner_teu - a.konteyner_teu).slice(0, 6);
    setTimeout(() => {
      C.bars(document.getElementById("barYuk"), { unit: "ton", items: topYuk.map((p) => ({ label: p.name, value: p.yuk_ton, color: "var(--c-yuk)" })) });
      C.donut(document.getElementById("donutKon"), { unit: "TEU", items: topKon.map((p, i) => ({ label: p.name, value: p.konteyner_teu, color: ["#f5a742", "#22d3ee", "#7c9cff", "#2dd4bf", "#f473b9", "#4ade80"][i] })) });
      const kab = D.trend.kabotaj_yolcu, ky = Object.keys(kab).filter((y) => +y >= 2010).sort();
      C.lineArea(document.getElementById("lineKab"), { labels: ky, unit: "yolcu", series: [{ name: "Kabotaj yolcusu", color: "var(--c-kabotaj)", values: ky.map((y) => kab[y]) }] });
    }, 100);
  }

  /* ---------- Kategori kartları ---------- */
  function categories() {
    const host = document.getElementById("catGrid");
    if (!host) return;
    const cats = [
      { href: "yuk.html", ic: "yuk", t: "Yük", d: "Limanlarda elleçlenen toplam yük", v: H.yuk_ton.deger, u: "ton" },
      { href: "konteyner.html", ic: "konteyner", t: "Konteyner", d: "TEU bazında konteyner elleçleme", v: H.konteyner_teu.deger, u: "TEU" },
      { href: "gemi.html", ic: "gemi", t: "Gemi", d: "Limanlara uğrayan gemiler", v: H.gemi_sayisi.deger, u: "gemi" },
      { href: "kruvaziyer.html", ic: "kruvaziyer", t: "Kruvaziyer", d: "Kruvaziyer yolcu trafiği", v: H.kruvaziyer_yolcu.deger, u: "yolcu" },
      { href: "roro.html", ic: "roro", t: "RO-RO", d: "Araç taşıyan gemiler", v: H.roro_arac.deger, u: "araç" },
      { href: "kabotaj.html", ic: "kabotaj", t: "Kabotaj", d: "İç sularda yolcu taşıma", v: H.kabotaj_yolcu.deger, u: "yolcu" },
      { href: "bogazlar.html", ic: "bogaz", t: "Türk Boğazları", d: "İstanbul Boğazı gemi geçişi", v: H.bogaz_gecis.deger, u: "gemi" },
      { href: "filo.html", ic: "filo", t: "Filo", d: "Türk deniz ticaret filosu (1.000 GT+)", v: H.filo_gemi.deger, u: "gemi" },
    ];
    host.innerHTML = cats.map((c) => {
      const hv = U.human(c.v);
      return `<a class="cat-card reveal" href="${c.href}">
        <div class="ic" style="color:var(--c-${c.ic === 'bogaz' ? 'bogaz' : c.ic})">${icon(c.ic)}</div>
        <h3>${c.t}</h3><p>${c.d}</p>
        <div class="val">${hv.v} <span style="font-size:.7em;color:var(--text-soft)">${hv.u} ${c.u}</span></div>
        <span class="go">İncele ${arrow("right")}</span>
      </a>`;
    }).join("");
  }

  /* ---------- İkonlar ---------- */
  function icon(k) {
    const M = {
      yuk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 12l9 4 9-4M3 17l9 4 9-4"/></svg>',
      konteyner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="7" width="18" height="12" rx="1"/><path d="M7 7v12M12 7v12M17 7v12"/></svg>',
      gemi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 16l2 4h14l2-4M5 16V9l7-3 7 3v7"/><path d="M12 3v3"/></svg>',
      kruvaziyer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 17h18l-1.5 3H4.5L3 17z"/><path d="M6 17v-6h9l3 6M9 11V6h4v5"/></svg>',
      roro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 13l2-5h9l3 3h4v4M7 16h8"/><circle cx="7" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/></svg>',
      kabotaj: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 15h16l-2 5H6l-2-5z"/><path d="M12 3v8M8 7h8"/></svg>',
      bogaz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 4v16M20 4v16M8 8h8M8 12h8M8 16h8"/></svg>',
      filo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 17l1.5 3h6L11 17M13 17l1.5 3h6L22 17M6 17v-5l4-2 4 2M10 10V7"/></svg>',
    };
    return M[k] || "";
  }
  function arrow(dir) {
    if (dir === "right") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    if (dir === "up") return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M6 13l6 6 6-6"/></svg>';
  }
  window.__icon = icon; window.__arrow = arrow;

  document.addEventListener("DOMContentLoaded", () => {
    bigStats(); summary(); voyage(); bigMap(); timeline(); homeCharts(); categories();
    window.MDObserve && window.MDObserve();
  });
})();
