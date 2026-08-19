-- ============================================================
-- Admin panel için yazma yetkisi: yalnız giriş yapan (authenticated)
-- kullanıcı metrics/ports/trends tablolarına yazabilir. fact_* ve
-- ingest_log tabloları setup-detail.sql'de zaten bu yetkiye sahip.
-- ============================================================

create policy "auth write metrics" on metrics for all to authenticated using (true) with check (true);
create policy "auth write ports"   on ports   for all to authenticated using (true) with check (true);
create policy "auth write trends"  on trends  for all to authenticated using (true) with check (true);
