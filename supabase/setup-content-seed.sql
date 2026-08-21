-- İçerik/metin tablosu: mevcut i18n.js DICT'inden otomatik üretildi
create table if not exists content (
  key text primary key, tr text, en text
);
alter table content enable row level security;
drop policy if exists "public read content" on content;
drop policy if exists "auth write content" on content;
create policy "public read content" on content for select to anon, authenticated using (true);
create policy "auth write content" on content for all to authenticated using (true) with check (true);

insert into content (key, tr, en) values
('site.title', 'Denizcilik İstatistikleri', 'Maritime Statistics'),
('site.org', 'T.C. Ulaştırma ve Altyapı Bakanlığı', 'Republic of Türkiye Ministry of Transport and Infrastructure'),
('site.sub1', 'Denizcilik', 'Maritime'),
('site.sub2', 'İstatistikleri', 'Statistics'),
('nav.yuk', 'Yük', 'Cargo'),
('nav.konteyner', 'Konteyner', 'Container'),
('nav.bogazlar', 'Türk Boğazları', 'Turkish Straits'),
('nav.kabotaj', 'Kabotaj Hattı', 'Cabotage'),
('nav.kruvaziyer', 'Kruvaziyer', 'Cruise'),
('nav.roro', 'RO-RO Araç', 'RO-RO Vehicles'),
('nav.gemi', 'Gemi', 'Vessels'),
('nav.filo', 'Filo', 'Fleet'),
('nav.dosyalar', 'Dosyalar', 'Files'),
('nav.home', 'Anasayfa', 'Home'),
('nav.map', 'Harita', 'Map'),
('nav.contact', 'İletişim', 'Contact'),
('nav.sitemap', 'Site Haritası', 'Sitemap'),
('nav.other', 'Diğer İstatistikler', 'Other Statistics'),
('ui.theme', 'Temayı değiştir', 'Switch theme'),
('ui.lang', 'English', 'Türkçe'),
('ui.menu', 'Menü', 'Menu'),
('ui.search', 'Dosya adında ara…', 'Search file name…'),
('ui.all', 'Tümü', 'All'),
('ui.year', 'Yıl', 'Year'),
('ui.region', 'Deniz bölgesi', 'Sea region'),
('ui.filter', 'Filtrele', 'Filter'),
('ui.files', 'dosya', 'files'),
('ui.detail', 'Ayrıntılı incele', 'View details'),
('ui.source', 'Resmi kaynak sayfası', 'Official source page'),
('ui.viewFiles', 'Bu kategorinin dosyaları', 'Files for this category'),
('ui.notFound', 'Sonuç bulunamadı.', 'No results found.'),
('ui.month', 'Ay', 'Month'),
('ui.clear', 'Temizle', 'Clear'),
('ui.series', 'Seri', 'Series'),
('ui.total', 'Toplam', 'Total'),
('ui.monthSelected', 'ay seçili', 'months selected'),
('ui.partial', 'kısmi dönem', 'partial period'),
('home.eyebrow', 'Resmi Denizcilik İstatistikleri Panosu', 'Official Maritime Statistics Dashboard'),
('home.title', 'Türkiye''nin Denizcilik Verileri', 'Türkiye''s Maritime Data'),
('home.lead', 'Türkiye''nin deniz ticareti tek bakışta.', 'Türkiye''s maritime trade at a glance.'),
('home.yearCap', 'güncel veri yılı', 'current data year'),
('home.source', 'Kaynak: T.C. Ulaştırma ve Altyapı Bakanlığı — Denizcilik Genel Müdürlüğü.', 'Source: Ministry of Transport and Infrastructure — Directorate General of Maritime Affairs.'),
('kpi.yuk', 'Elleçlenen Yük', 'Cargo Handled'),
('kpi.konteyner', 'Konteyner', 'Containers'),
('kpi.gemi', 'Uğrayan Gemi', 'Calling Vessels'),
('kpi.bogaz', 'Boğaz Gemi Geçişi', 'Strait Transits'),
('kpi.kruvaziyer', 'Kruvaziyer Yolcusu', 'Cruise Passengers'),
('kpi.roro', 'RO-RO ile Araç', 'RO-RO Vehicles'),
('kpi.kabotaj', 'Kabotaj Yolcusu', 'Cabotage Passengers'),
('kpi.filo', 'Türk Ticaret Filosu', 'Turkish Merchant Fleet'),
('unit.ton', 'ton', 'tonnes'),
('unit.teu', 'TEU', 'TEU'),
('unit.gemi', 'gemi', 'vessels'),
('unit.gecis', 'geçiş', 'transits'),
('unit.yolcu', 'yolcu', 'passengers'),
('unit.arac', 'araç', 'vehicles'),
('unit.grosston', 'gros ton', 'gross tonnage'),
('num.milyon', 'milyon', 'million'),
('num.milyar', 'milyar', 'billion'),
('num.bin', 'bin', 'thousand'),
('cat.yuk', 'Yük İstatistikleri', 'Cargo Statistics'),
('cat.konteyner', 'Konteyner İstatistikleri', 'Container Statistics'),
('cat.gemi', 'Gemi İstatistikleri', 'Vessel Statistics'),
('cat.kruvaziyer', 'Kruvaziyer İstatistikleri', 'Cruise Statistics'),
('cat.roro', 'RO-RO Araç İstatistikleri', 'RO-RO Vehicle Statistics'),
('cat.kabotaj', 'Kabotaj İstatistikleri', 'Cabotage Statistics'),
('cat.bogazlar', 'Türk Boğazları Gemi Geçiş İstatistikleri', 'Turkish Straits Vessel Transit Statistics'),
('cat.filo', 'Filo İstatistikleri', 'Fleet Statistics'),
('cat.prevYear', 'Önceki yıl', 'Previous year'),
('cat.topPort', 'En büyük liman', 'Largest port'),
('cat.monthTitle', 'Aylara göre dağılım', 'Monthly breakdown'),
('cat.trendTitle', 'Yıllara göre gelişim', 'Development by year'),
('cat.portsTitle', 'Limanlara göre dağılım', 'Breakdown by port'),
('cat.noPortData', 'Bu kategori için liman kırılımı bulunmuyor.', 'No port breakdown available for this category.'),
('cat.latestNote', 'Liman kırılımı en güncel yıla aittir.', 'Port breakdown is for the most recent year.'),
('files.title', 'Dosyalar', 'Files'),
('files.lead', 'Denizcilik Genel Müdürlüğü''nün yayımladığı resmi istatistik dosyaları.', 'Official statistics files published by the Directorate General of Maritime Affairs.'),
('files.total', 'Arşivde toplam', 'A total of'),
('files.totalSuffix', 'resmi istatistik dosyası.', 'official statistics files.'),
('map.title', 'Türkiye Limanları Haritası', 'Ports of Türkiye Map'),
('map.lead', 'Balon büyüklüğü liman hacmini gösterir.', 'Bubble size indicates port volume.'),
('map.table', 'Limanlar sıralaması', 'Port ranking'),
('map.port', 'Liman', 'Port'),
('map.sea', 'Deniz', 'Sea'),
('map.cargo', 'Yük (ton)', 'Cargo (tonnes)'),
('map.container', 'Konteyner (TEU)', 'Containers (TEU)'),
('contact.title', 'İletişim', 'Contact'),
('contact.address', 'Adres', 'Address'),
('contact.phone', 'Santral', 'Switchboard'),
('contact.callcenter', 'Çağrı Merkezi', 'Call Centre'),
('contact.web', 'Web', 'Web'),
('footer.stats', 'İstatistikler', 'Statistics'),
('footer.corp', 'Kurumsal', 'Corporate'),
('footer.note', 'Bu sayfa bir arayüz tasarım çalışmasıdır. Resmi yayın:', 'This page is an interface design study. Official publication:'),
('footer.rights', 'Tüm hakları saklıdır.', 'All rights reserved.'),
('footer.dataSource', 'Veri kaynağı', 'Data source'),
('footer.affiliates', 'Bağlı kuruluşlar', 'Affiliated institutions'),
('footer.dgm', 'Denizcilik Genel Müdürlüğü', 'Directorate General of Maritime Affairs'),
('footer.kvkk', 'KVKK Dokümanları', 'Data Protection Documents');

-- İletişim sayfası (sonradan eklendi): sabit HTML metinleriydi, artık panelden düzenlenebilir.
-- Yeniden çalıştırılabilir olsun diye on conflict korumalı.
insert into content (key, tr, en) values
('contact.lead', 'Denizcilik istatistikleriyle ilgili soru, görüş ve talepleriniz için Denizcilik Genel Müdürlüğü ile iletişime geçebilirsiniz.', 'For questions, feedback and requests regarding maritime statistics, you can contact the Directorate General of Maritime Affairs.'),
('contact.dept', 'Denizcilik Genel Müdürlüğü', 'Directorate General of Maritime Affairs'),
('contact.addressValue', 'Hakkı Turayliç Cad. No:5, 06338 Emek / Ankara', 'Hakkı Turayliç Cad. No:5, 06338 Emek / Ankara'),
('contact.phoneValue', '0312 203 10 00', '0312 203 10 00'),
('contact.fax', 'Faks', 'Fax'),
('contact.faxValue', '0312 232 42 24', '0312 232 42 24'),
('contact.webValue', 'denizcilik.uab.gov.tr', 'denizcilik.uab.gov.tr'),
('contact.callcenterValue', 'ALO 123', 'ALO 123'),
('contact.formTitle', 'Mesaj gönderin', 'Send a message'),
('contact.formNote', 'Formu doldurduğunuzda varsayılan e-posta uygulamanız açılır.', 'When you submit the form, your default email application opens.'),
('contact.formName', 'Ad Soyad', 'Full name'),
('contact.formEmail', 'E-posta', 'Email'),
('contact.formMsg', 'Mesajınız', 'Your message'),
('contact.formSend', 'Gönder', 'Send')
on conflict (key) do nothing;

-- Grafik/filtre metinleri, ay adları, deniz bölgeleri ve bağlantı adresleri
-- (sonradan eklendi): kodda sabit yazılıydı, artık panelden düzenlenebilir.
insert into content (key, tr, en) values
('month.1', 'Oca', 'Jan'),
('month.2', 'Şub', 'Feb'),
('month.3', 'Mar', 'Mar'),
('month.4', 'Nis', 'Apr'),
('month.5', 'May', 'May'),
('month.6', 'Haz', 'Jun'),
('month.7', 'Tem', 'Jul'),
('month.8', 'Ağu', 'Aug'),
('month.9', 'Eyl', 'Sep'),
('month.10', 'Eki', 'Oct'),
('month.11', 'Kas', 'Nov'),
('month.12', 'Ara', 'Dec'),
('series.yukleme', 'Yükleme', 'Loading'),
('series.bosaltma', 'Boşaltma', 'Unloading'),
('series.turk', 'Türk bayraklı', 'Turkish flag'),
('series.yabanci', 'Yabancı bayraklı', 'Foreign flag'),
('series.gelen', 'Gelen', 'Inbound'),
('series.giden', 'Giden', 'Outbound'),
('series.transit', 'Transit', 'Transit'),
('series.gelenArac', 'Gelen araç', 'Inbound vehicles'),
('series.gidenArac', 'Giden araç', 'Outbound vehicles'),
('sea.marmara', 'Marmara', 'Marmara'),
('sea.ege', 'Ege', 'Aegean'),
('sea.akdeniz', 'Akdeniz', 'Mediterranean'),
('sea.karadeniz', 'Karadeniz', 'Black Sea'),
('ui.split', 'Dağılım', 'Split'),
('dim.yuk.donut', 'Kargo tipine göre', 'By cargo type'),
('dim.yuk.bars', 'En çok yük taşınan ülkeler', 'Top partner countries'),
('dim.konteyner.bars', 'En çok konteyner taşınan ülkeler', 'Top partner countries'),
('dim.gemi.split', 'Bayrak dağılımı', 'Flag split'),
('dim.kruvaziyer.split', 'Yolcu yönü', 'Passenger direction'),
('dim.roro.split', 'Araç yönü', 'Vehicle direction'),
('dim.roro.bars', 'Araç cinsine göre', 'By vehicle type'),
('dim.kabotaj.a', 'Yolcu', 'Passengers'),
('dim.kabotaj.b', 'Araç', 'Vehicles'),
('dim.filo.bars', 'Gemi cinsine göre', 'By ship type'),
('dim.filo.donut', 'Filo bileşimi', 'Fleet composition'),
('nav.uab', 'UAB.GOV.TR', 'UAB.GOV.TR'),
('url.uab', 'https://www.uab.gov.tr', 'https://www.uab.gov.tr'),
('url.dgm', 'https://denizcilik.uab.gov.tr/', 'https://denizcilik.uab.gov.tr/'),
('url.kvkk', 'https://www.uab.gov.tr/kvkkdokuman', 'https://www.uab.gov.tr/kvkkdokuman'),
('url.callcenter', 'https://www.uab.gov.tr/cagri-merkezi', 'https://www.uab.gov.tr/cagri-merkezi'),
('url.contactWeb', 'https://denizcilik.uab.gov.tr/', 'https://denizcilik.uab.gov.tr/'),
('url.phone', 'tel:03122031000', 'tel:03122031000'),
('url.mail', 'mailto:denizcilik@uab.gov.tr', 'mailto:denizcilik@uab.gov.tr'),
('home.year', '', '')
on conflict (key) do nothing;

-- Gemi sayfası 2×2 KPI panosu (sonradan eklendi)
insert into content (key, tr, en) values
('gemi.kpiTurk', 'Limanlarımıza uğrayan Türk bayraklı gemi sayısı', 'Turkish-flagged vessels calling at our ports'),
('gemi.kpiYabanci', 'Limanlarımıza uğrayan yabancı bayraklı gemi sayısı', 'Foreign-flagged vessels calling at our ports'),
('gemi.kpiTopPort', 'En çok gemi uğrayan liman başkanlığı', 'Port authority with the most vessel calls'),
('gemi.kpiTopPortGt', 'En çok gross tonaj gelen liman başkanlığı', 'Port authority with the highest gross tonnage'),
('ui.yearlyTotal', 'yıllık toplam', 'yearly total'),
('ui.yearsSelected', 'yıl seçili', 'years selected')
on conflict (key) do nothing;

-- Gemi (yeniden düzenlenmiş grafik başlıkları) + Kabotaj (4'lü KPI panosu) — sonradan eklendi
insert into content (key, tr, en) values
('gemi.chartTurk', 'Türk bayraklı gemi', 'Turkish-flagged vessels'),
('gemi.chartYabanci', 'Yabancı bayraklı gemi', 'Foreign-flagged vessels'),
('gemi.chartPortsGt', 'Gross tonaja göre dağılım', 'Distribution by gross tonnage'),
('kabotaj.kpiArac', 'Taşınan araç sayısı', 'Vehicles carried'),
('kabotaj.kpiAracMil', 'Araç x Mil', 'Vehicle x Miles'),
('kabotaj.kpiYolcu', 'Taşınan yolcu sayısı', 'Passengers carried'),
('kabotaj.kpiYolcuMil', 'Yolcu x Mil', 'Passenger x Mile'),
('unit.aracmil', 'araç-mil', 'vehicle-miles'),
('unit.yolcumil', 'yolcu-mil', 'passenger-miles'),
('ui.yearlyTotal', 'yıllık toplam', 'yearly total'),
('ui.yearsSelected', 'yıl seçili', 'years selected'),
('ui.needTwoYears', 'Bu grafikte eğilim görmek için filtreden en az 2 yıl seç.', 'Select at least 2 years in the filter to see a trend here.')
on conflict (key) do nothing;

-- Kabotaj için "Araç x Mil" / "Yolcu x Mil" trend verisi (23 yıl, 2003-2025) resmi
-- kaynaktaki iki dosyanın 3. sütunundan çıkarıldı (kolon başlığında ayrı bir dosya
-- olarak listelenmiyordu, ama Excel içinde "Araç Sayısı"/"Yolcu Sayısı" yanında
-- ayrı sütun olarak vardı). trends tablosuna metric=kabotaj_arac_mil / kabotaj_yolcu_mil
-- olarak REST üzerinden (service_role, yerel) eklendi — bu SQL dosyası sadece kayıt amaçlı,
-- yeniden eklemek gerekirse ilgili .xls dosyaları kabotaj-istatistikleri sayfasından
-- indirilip 4. sütun (index 2) okunmalı.

-- Anasayfa KPI kartları: artış/azalış karşılaştırma periyodu açıkça yazılsın
insert into content (key, tr, en) values
('kpi.vsYear', '{y}''e göre', 'vs {y}')
on conflict (key) do nothing;

-- Yük sayfası 3'lü KPI panosu (sonradan eklendi)
insert into content (key, tr, en) values
('yuk.kpiTotal', 'Toplam Taşınan Yük', 'Total Cargo Handled'),
('yuk.kpiTopCountry', 'En Çok Yük Elleçlenen Ülke', 'Top Cargo Handling Country'),
('yuk.kpiTopPort', 'En Çok Yük Elleçlenen Liman', 'Top Cargo Handling Port')
on conflict (key) do nothing;

-- Konteyner sayfası: 3 KPI kartı + Bayrak Türü/Konteyner Tipi filtreleri + Rejim/Cins grafikleri
insert into content (key, tr, en) values
('konteyner.kpiTotal', 'Toplam Konteyner Elleçleme', 'Total Container Handling'),
('konteyner.kpiTopPort', 'En Çok Konteyner Elleçlenen Liman', 'Top Container Handling Port'),
('konteyner.kpiTopCountry', 'En Çok Konteyner Elleçlenen Ülke', 'Top Container Handling Country'),
('konteyner.chartRegime', 'Rejim türlerine göre dağılım', 'Breakdown by regime type'),
('konteyner.chartCins', 'Konteyner cinslerine göre elleçleme', 'Handling by container type'),
('konteyner.regimeDisari', 'Yurt Dışı', 'Foreign Trade'),
('konteyner.regimeKabotaj', 'Kabotaj', 'Cabotage'),
('konteyner.regimeTransit', 'Transit', 'Transit'),
('konteyner.size20', '20'' lik', '20 FT'),
('konteyner.size40', '40'' lık', '40 FT'),
('konteyner.size40plus', '40'' dan büyük', 'Larger than 40 FT'),
('konteyner.dolu', 'Dolu', 'Loaded'),
('konteyner.bos', 'Boş', 'Empty'),
('ui.flag', 'Bayrak Türü', 'Flag Type'),
('ui.contType', 'Konteyner Tipi', 'Container Type')
on conflict (key) do nothing;

-- RO-RO dashboard yeniden tasarımı: 3 KPI kartı + hat yoğunluğu treemap
insert into content (key, tr, en) values
('roro.kpiTotal', 'Toplam taşınan araç sayısı', 'Total vehicles carried'),
('roro.kpiTopType', 'En çok taşınan araç cinsi (pazar payı)', 'Leading vehicle type (market share)'),
('roro.kpiTopHat', 'En yoğun hat', 'Busiest line'),
('roro.chartHat', 'Hat yoğunlukları', 'Line intensity')
on conflict (key) do nothing;

-- Türk Boğazları dashboard yeniden tasarımı: 3 KPI kartı + tanker kırılımlı çizgi grafiği
insert into content (key, tr, en) values
('bogazlar.kpiGemi', 'Toplam gemi geçiş sayısı', 'Total vessel transits'),
('bogazlar.kpiGrossTon', 'Toplam gross ton', 'Total gross tonnage'),
('bogazlar.kpiUgraksiz', 'Uğraksız gemi sayısı', 'Non-calling vessels'),
('bogazlar.chartTanker', 'Aylara göre tanker dağılımı (TTA / LPG / TCH)', 'Monthly tanker breakdown (TTA / LPG / TCH)'),
('bogazlar.chartGemi', 'Aylara göre gemi adedi', 'Monthly vessel count'),
('bogazlar.chartGrossTon', 'Aylara göre toplam gross ton', 'Monthly total gross tonnage')
on conflict (key) do nothing;

-- Kruvaziyer dashboard yeniden tasarımı: 3 KPI kartı, donut kaldırıldı, limanlar pazar payı tooltip'i
insert into content (key, tr, en) values
('kruvaziyer.kpiTotal', 'Toplam kruvaziyer yolcu sayısı', 'Total cruise passengers'),
('kruvaziyer.kpiTopPort', 'En yoğun liman (pazar payı)', 'Busiest port (market share)'),
('kruvaziyer.kpiTopMonth', 'En yoğun ay', 'Busiest month'),
('ui.marketShare', 'pazar payı', 'market share')
on conflict (key) do nothing;

-- Filo dashboard yeniden tasarımı: ortalama yaş / gemi sayısı / DWT KPI kartları
insert into content (key, tr, en) values
('unit.yas', 'yaş', 'years'),
('unit.dwt', 'DWT', 'DWT'),
('filo.kpiYas', 'Ortalama gemi yaşı', 'Average fleet age'),
('filo.kpiAdet', 'Gemi sayısı', 'Number of vessels'),
('filo.kpiDwt', 'Toplam deadweight (DWT)', 'Total deadweight (DWT)'),
('ui.yearlyAvg', 'yılların ortalaması', 'average across years'),
('ui.latestYear', 'en güncel yıl', 'latest year')
on conflict (key) do nothing;
