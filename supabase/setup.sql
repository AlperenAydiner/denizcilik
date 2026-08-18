-- Türkiye Denizcilik Verileri — şema + veri
drop table if exists metrics cascade;
drop table if exists ports cascade;
drop table if exists trends cascade;

create table metrics (
  key text primary key, label text, value numeric, unit text,
  year int, prev numeric, yoy numeric, note text, ord int
);
create table ports (
  name text primary key, sea text, lat numeric, lon numeric,
  mx numeric, my numeric, yuk_ton numeric, konteyner_teu numeric
);
create table trends (
  metric text, year int, value numeric,
  primary key (metric, year)
);

insert into metrics (key,label,value,unit,year,prev,yoy,note,ord) values
('yuk_ton','Elleçlenen Yük',531737358,'ton',2024,521079804,2.0,null,0),
('konteyner_teu','Konteyner',13529729,'TEU',2024,12556401,7.8,null,1),
('gemi_sayisi','Uğrayan Gemi',60594,'gemi',2024,60195,0.7,null,2),
('bogaz_gecis','Boğaz Gemi Geçişi',41363,'geçiş',2024,39000,6.1,null,3),
('kruvaziyer_yolcu','Kruvaziyer Yolcusu',1889426,'yolcu',2024,1542522,22.5,null,4),
('roro_arac','RO-RO Araç',2722081,'araç',2024,2761362,-1.4,null,5),
('kabotaj_yolcu','Kabotaj Yolcusu',117832340,'yolcu',2024,119512485,-1.4,null,6),
('filo_gemi','Türk Ticaret Filosu',414,'gemi',2023,null,null,'1.000 GT ve üzeri Türk deniz ticaret filosu',7);

insert into ports (name,sea,lat,lon,mx,my,yuk_ton,konteyner_teu) values
('İstanbul','Marmara',41.01,28.97,172.6,97.9,4361495,6991),
('Ambarlı','Marmara',40.96,28.69,158.4,101.2,31147705,3009724),
('Tekirdağ','Marmara',40.98,27.51,98.5,99.9,48184044,2032676),
('Kocaeli','Marmara',40.76,29.92,220.8,114.2,83787739,2322150),
('Gemlik','Marmara',40.43,29.15,181.7,135.8,16814940,889475),
('Bandırma','Marmara',40.35,27.97,121.8,141.0,5529126,5210),
('Yalova','Marmara',40.65,29.28,188.3,121.4,3569208,1),
('Çanakkale','Marmara',40.15,26.41,42.6,154.1,4323413,0),
('Karabiga','Marmara',40.41,27.3,87.8,137.1,12975655,1655),
('Aliağa','Ege',38.8,26.97,71.0,242.2,85454864,2119220),
('İzmir','Ege',38.44,27.14,79.7,265.8,7463705,261916),
('Çeşme','Ege',38.32,26.3,37.0,273.6,0,0),
('Güllük','Ege',37.24,27.6,103.0,344.1,0,0),
('Dikili','Ege',39.07,26.89,67.0,224.6,839396,0),
('Marmaris','Akdeniz',36.85,28.27,137.1,369.6,11638,0),
('Antalya','Akdeniz',36.83,30.61,255.9,370.9,5112791,72598),
('Taşucu','Akdeniz',36.3,33.88,421.9,405.5,0,0),
('Mersin','Akdeniz',36.8,34.63,460.0,372.9,40526707,1889860),
('İskenderun','Akdeniz',36.58,36.17,538.1,387.2,68563930,783711),
('Ceyhan','Akdeniz',36.9,35.8,519.4,366.3,45723036,1158),
('Zonguldak','Karadeniz',41.45,31.79,315.8,69.2,11966306,37),
('Karadeniz Ereğli','Karadeniz',41.28,31.42,297.0,80.3,9832541,0),
('Bartın','Karadeniz',41.68,32.34,343.7,54.1,1423958,54),
('Samsun','Karadeniz',41.29,36.33,546.3,79.6,12747789,90167),
('Trabzon','Karadeniz',41.0,39.72,718.4,98.6,2555287,21718),
('Hopa','Karadeniz',41.4,41.43,805.2,72.4,457165,0),
('Rize','Karadeniz',41.02,40.52,759.0,97.2,608613,0),
('Giresun','Karadeniz',40.91,38.39,650.9,104.4,966995,21098);

insert into trends (metric,year,value) values
('yuk_ton',2015,416036695),
('yuk_ton',2018,460153560),
('yuk_ton',2020,496642652),
('yuk_ton',2022,542610283),
('yuk_ton',2023,521079804),
('yuk_ton',2024,531737358),
('konteyner_teu',2020,11626650),
('konteyner_teu',2022,12366382),
('konteyner_teu',2023,12556401),
('konteyner_teu',2024,13529729),
('kruvaziyer_yolcu',2015,1888522),
('kruvaziyer_yolcu',2018,213771),
('kruvaziyer_yolcu',2020,1824),
('kruvaziyer_yolcu',2022,1010767),
('kruvaziyer_yolcu',2023,1542522),
('kruvaziyer_yolcu',2024,1889426),
('kabotaj_yolcu',2025,118891577),
('kabotaj_yolcu',2024,117832340),
('kabotaj_yolcu',2023,119512485),
('kabotaj_yolcu',2022,126204029),
('kabotaj_yolcu',2021,97045463),
('kabotaj_yolcu',2020,85866238),
('kabotaj_yolcu',2019,150312216),
('kabotaj_yolcu',2018,139556332),
('kabotaj_yolcu',2017,137195691),
('kabotaj_yolcu',2016,148101589),
('kabotaj_yolcu',2015,163723544),
('kabotaj_yolcu',2014,161048004),
('kabotaj_yolcu',2013,164426997),
('kabotaj_yolcu',2012,159076921),
('kabotaj_yolcu',2011,156968095),
('kabotaj_yolcu',2010,155172103),
('kabotaj_yolcu',2009,159194370),
('kabotaj_yolcu',2008,151645639),
('kabotaj_yolcu',2007,149824929),
('kabotaj_yolcu',2006,135348554),
('kabotaj_yolcu',2005,122661230),
('kabotaj_yolcu',2004,112816094),
('kabotaj_yolcu',2003,99825813),
('kabotaj_arac',2025,9636762),
('kabotaj_arac',2024,10153130),
('kabotaj_arac',2023,9334763),
('kabotaj_arac',2022,10958382),
('kabotaj_arac',2021,12619473),
('kabotaj_arac',2020,10892467),
('kabotaj_arac',2019,13420802),
('kabotaj_arac',2018,13159820),
('kabotaj_arac',2017,12638289),
('kabotaj_arac',2016,13050241),
('kabotaj_arac',2015,13042399),
('kabotaj_arac',2014,12166505),
('kabotaj_arac',2013,11318561),
('kabotaj_arac',2012,10710645),
('kabotaj_arac',2011,10402917),
('kabotaj_arac',2010,9400735),
('kabotaj_arac',2009,9315772),
('kabotaj_arac',2008,8866797),
('kabotaj_arac',2007,8161999),
('kabotaj_arac',2006,7773689),
('kabotaj_arac',2005,6961643),
('kabotaj_arac',2004,6900922),
('kabotaj_arac',2003,6219645),
('gemi_gros_ton',2015,747539946),
('gemi_gros_ton',2018,816797526),
('gemi_gros_ton',2020,790881650),
('gemi_gros_ton',2022,873329628),
('gemi_gros_ton',2023,894059943),
('gemi_gros_ton',2024,902445227),
('roro_arac_yil',2022,2330406),
('roro_arac_yil',2023,2761362),
('roro_arac_yil',2024,2722081);

alter table metrics enable row level security;
alter table ports enable row level security;
alter table trends enable row level security;
create policy "public read metrics" on metrics for select to anon, authenticated using (true);
create policy "public read ports"   on ports   for select to anon, authenticated using (true);
create policy "public read trends"  on trends  for select to anon, authenticated using (true);