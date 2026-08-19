-- ============================================================
-- Türkiye Denizcilik Verileri — detaylı olgu tabloları
-- Kaynak: denizcilikistatistikleri.uab.gov.tr resmi Excel dosyaları
-- Her satır, kaynak dosyanın kendi Toplam/Total satırıyla doğrulanarak yüklenir.
-- ============================================================

drop table if exists fact_monthly cascade;
drop table if exists fact_port cascade;
drop table if exists fact_country cascade;
drop table if exists fact_breakdown cascade;
drop table if exists fact_strait cascade;
drop table if exists ingest_log cascade;

-- Aylık zaman serisi: kategori × yıl × ay × seri (yükleme/boşaltma/toplam/turk/yabancı vb.)
create table fact_monthly (
  kategori text not null,
  yil int not null,
  ay int not null check (ay between 1 and 12),
  seri text not null,
  deger numeric not null,
  primary key (kategori, yil, ay, seri)
);

-- Liman başkanlığı bazında: kategori × yıl × liman × seri
create table fact_port (
  kategori text not null,
  yil int not null,
  liman text not null,
  seri text not null,
  deger numeric not null,
  primary key (kategori, yil, liman, seri)
);

-- Ülke bazında dış ticaret kırılımı: kategori × yıl × ülke × seri
create table fact_country (
  kategori text not null,
  yil int not null,
  ulke text not null,
  seri text not null,
  deger numeric not null,
  primary key (kategori, yil, ulke, seri)
);

-- Diğer kırılımlar: kargo tipi, yük cinsi, yük grubu, konteyner cinsi, araç cinsi, filo cinsi...
create table fact_breakdown (
  id bigint generated always as identity primary key,
  kategori text not null,
  yil int not null,
  boyut text not null,      -- örn: kargo_tipi, yuk_cinsi, yuk_grubu, konteyner_cinsi, arac_cinsi, gemi_cinsi
  etiket text not null,
  seri text not null default 'toplam',
  deger numeric not null,
  unique (kategori, yil, boyut, etiket, seri)
);

-- Türk Boğazları — İstanbul ve Çanakkale ayrı bloklar, kendi sütun setiyle
create table fact_strait (
  bogaz text not null check (bogaz in ('istanbul', 'canakkale')),
  yil int not null,
  ay int not null check (ay between 1 and 12),
  gemi_adedi numeric,
  gros_ton numeric,
  kilavuz_alan numeric,
  sp1_veren numeric,
  ugraksiz_gemi numeric,
  primary key (bogaz, yil, ay)
);

-- Her kaynak dosyanın yükleme doğrulama kaydı — şeffaflık için
create table ingest_log (
  id bigint generated always as identity primary key,
  kategori text not null,
  yil text not null,
  tur text not null,          -- monthly / port / country / breakdown / strait
  dosya_url text not null,
  dosya_toplam numeric,
  hesap_toplam numeric,
  fark_yuzde numeric,
  satir_sayisi int,
  durum text not null check (durum in ('OK', 'MISMATCH', 'SKIP', 'ERROR')),
  mesaj text,
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------
alter table fact_monthly enable row level security;
alter table fact_port enable row level security;
alter table fact_country enable row level security;
alter table fact_breakdown enable row level security;
alter table fact_strait enable row level security;
alter table ingest_log enable row level security;

create policy "public read fact_monthly"   on fact_monthly   for select to anon, authenticated using (true);
create policy "public read fact_port"      on fact_port      for select to anon, authenticated using (true);
create policy "public read fact_country"   on fact_country   for select to anon, authenticated using (true);
create policy "public read fact_breakdown" on fact_breakdown for select to anon, authenticated using (true);
create policy "public read fact_strait"    on fact_strait    for select to anon, authenticated using (true);
create policy "public read ingest_log"     on ingest_log     for select to anon, authenticated using (true);

-- Yazma: yalnız authenticated (admin panel için hazırlık — bu faz kullanmıyor, service_role ile yüklenir)
create policy "auth write fact_monthly"   on fact_monthly   for all to authenticated using (true) with check (true);
create policy "auth write fact_port"      on fact_port      for all to authenticated using (true) with check (true);
create policy "auth write fact_country"   on fact_country   for all to authenticated using (true) with check (true);
create policy "auth write fact_breakdown" on fact_breakdown for all to authenticated using (true) with check (true);
create policy "auth write fact_strait"    on fact_strait    for all to authenticated using (true) with check (true);

-- İndeksler (kategori bazlı çekim için — frontend sayfa başına kendi kategorisini çeker)
create index idx_fact_monthly_kat   on fact_monthly (kategori);
create index idx_fact_port_kat      on fact_port (kategori);
create index idx_fact_country_kat   on fact_country (kategori);
create index idx_fact_breakdown_kat on fact_breakdown (kategori, boyut);
