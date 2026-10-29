-- BrewAssist hardware seed — B6/B7/B9/B10 (SSOT: findings/brewlogic-06-rnd-complete.md).
-- Target tables: hardware_grinders / waters / filters / drippers. Verified=false until brew feedback confirms.
-- Apply via Supabase MCP apply_migration or psql. Idempotent (ON CONFLICT DO NOTHING).

INSERT INTO public.hardware_grinders (key, specs, source_url, verified) VALUES
('1Zpresso J-Ultra', '{"burr":"heptagonal 48mm steel","clicks_per_rotation":100,"um_per_click":8,"baseline_clicks":"87 clicks (700um) / V60 70-100","baseline_um":700}', 'https://1zpresso.coffee', false),
('1Zpresso K-Ultra', '{"burr":"48mm steel","clicks_per_rotation":100,"um_per_click":20,"baseline_clicks":"35 clicks (700um) / V60 30-45","baseline_um":700}', 'https://1zpresso.coffee', false),
('1Zpresso K-Plus/K-Pro/K-Max/ZP6', '{"burr":"48mm steel shared row","clicks_per_rotation":90,"um_per_click":22,"baseline_clicks":"32 clicks (700um) / V60 30-45","baseline_um":700}', 'https://1zpresso.coffee', false),
('1Zpresso X-Ultra/X-Pro S', '{"burr":"40mm steel shared row","clicks_per_rotation":60,"um_per_click":12.5,"baseline_clicks":"56 clicks (700um) / V60 48-70","baseline_um":700}', 'https://1zpresso.coffee', false),
('Timemore C2', '{"burr":"38mm steel","clicks_per_rotation":12,"um_per_click":32,"baseline_clicks":"22 clicks (700um) / V60 18-24","baseline_um":700,"tier":"ESTIMATE"}', 'https://timemore.com', false),
('Timemore C3/C3S', '{"burr":"38mm steel shared","clicks_per_rotation":12,"um_per_click":83.3,"baseline_clicks":"8-9 clicks (700um) / V60 11-18","baseline_um":700}', 'https://timemore.com', false),
('Timemore C5 Pro', '{"burr":"42mm S2C-042-III","clicks_per_rotation":48,"um_per_click":31,"baseline_clicks":"22-23 dial (700um) / V60 10-14 retailer ref","baseline_um":700}', 'https://timemore.com', false),
('Timemore S3', '{"burr":"S2C890","clicks_per_rotation":80,"um_per_click":15,"baseline_clicks":"47 clicks (700um) / pourover 50-80","baseline_um":700}', 'https://timemore.com', false),
('Comandante C40 MK4', '{"burr":"39mm Nitro Blade","clicks_per_rotation":30,"um_per_click":30,"baseline_clicks":"23 clicks (700um) / V60 20-30","baseline_um":700,"tier":"ESTIMATE"}', 'https://comandante.com', false),
('Comandante C60', '{"burr":"Gold Clix","clicks_per_rotation":40,"um_per_click":21,"baseline_clicks":"33 clicks (700um) / V60 28-42","baseline_um":700,"tier":"ESTIMATE"}', 'https://comandante.com', false)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.hardware_waters (key, specs, source_url, verified) VALUES
('Aqua', '{"ppm":140,"class":"mineral","character":"sweet round","temp_offset_c":0,"note":"baseline, label varies"}', 'https://aqua.co.id', false),
('Le Minerale', '{"ppm":120,"na_mg_l":45.5,"ca_mg_l":6.2,"mg_mg_l":3.1,"class":"mineral Na-high","character":"sweet soft","temp_offset_c":1,"note":"needs -0.5 finer or +1C light roast"}', 'https://leminerale.co.id', false),
('Cleo', '{"ppm":15,"class":"demineral RO","character":"flat clean","temp_offset_c":1.5,"note":"blend 1:1 or remineralize, +1-2C if pure"}', 'https://cleo.co.id', false),
('Amidis', '{"ppm":0,"class":"distilled","character":"flat","temp_offset_c":0,"note":"starting point only, must mix, never brew pure"}', 'https://amidis.co.id', false)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.hardware_filters (key, specs, source_url, verified) VALUES
('Cafec T-92 Light', '{"speed":"slow","roast_match":"light","modifier":"+5s bloom, temp standard"}', 'https://cafec-jp.com', false),
('Cafec T-90 Medium-Dark', '{"speed":"fast","roast_match":"medium-dark","thickness_um":220,"modifier":"none baseline, anti-clog"}', 'https://cafec-jp.com', false),
('Cafec T-83 Dark', '{"speed":"medium","roast_match":"dark","modifier":"-0.5 finer vs T-90 same drawdown"}', 'https://cafec-jp.com', false),
('Cafec Abaca/Abaca+', '{"speed":"fast","roast_match":"all","modifier":"-0.5 finer or +1 split vs T-90, clarity smooth"}', 'https://cafec-jp.com', false),
('Hario Tabbed Japan', '{"speed":"medium-fast","roast_match":"all","thickness_um":206,"modifier":"none reference standard"}', 'https://hario.jp', false),
('Hario Untabbed', '{"speed":"medium","roast_match":"all","thickness_um":242,"modifier":"+0.5 coarser vs tabbed"}', 'https://hario.jp', false),
('Chemex Bonded', '{"speed":"slowest","roast_match":"all","thickness_um":190,"modifier":"+1 to +2 coarser, ratio 1:17, 3:30-4:00"}', 'https://chemex.com', false),
('Sibarist FAST', '{"speed":"extreme-fast","roast_match":"light","modifier":"-1 finer or +1 pulse vs Hario"}', 'https://sibarist.com', false),
('Sibarist B3', '{"speed":"medium","roast_match":"all","modifier":"none baseline alt, reduces bypass"}', 'https://sibarist.com', false)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.hardware_drippers (key, specs, source_url, verified) VALUES
('Hario V60', '{"geometry":"conical","holes":1,"flow":"fast free","default_pour":"spiral slow, technique-sensitive","grind_modifier":"baseline, clarity acid"}', 'https://hario.jp', false),
('Origami Cone', '{"geometry":"conical","flow":"fast","default_pour":"same as V60, drawdown -10s, ridged walls"}', 'https://origami.com', false),
('Origami Wave', '{"geometry":"flat","flow":"medium","default_pour":"same as Kalita, body sweet"}', 'https://origami.com', false),
('Kalita Wave', '{"geometry":"flat","holes":3,"flow":"restricted even","default_pour":"center allowed forgiving","grind_modifier":"+0.5 coarser vs V60, sweet round"}', 'https://kalita.com', false),
('Orea V3/V4', '{"geometry":"fast-flat","flow":"restricted engineered","default_pour":"center, bloom-and-dump capable","grind_modifier":"-0.5 finer vs V60, -1 pour, body heavy acid soft"}', 'https://orea.com', false),
('April', '{"geometry":"flat","flow":"precision","default_pour":"same as Kalita"}', 'https://april.com', false),
('Chemex', '{"geometry":"conical thick-filter","flow":"slowest","default_pour":"coarse +1 to +2, ratio 1:17"}', 'https://chemex.com', false),
('Aeropress filter-style', '{"geometry":"immersion-press","flow":"press","default_pour":"1:30 steep option separate table"}', 'https://aeropress.com', false)
ON CONFLICT (key) DO NOTHING;
