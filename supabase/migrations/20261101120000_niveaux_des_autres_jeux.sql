-- Niveaux des autres jeux (mots mêlés, versets à trous, labyrinthe) et progression du Défi de la Parole,
-- pour chaque catégorie : retrouvés sur tous les appareils du même compte (demande de JD du 01/11/2026).
-- Appliquée le 01/11/2026 sur le projet Supabase de JD.
alter table public.game_progress
  add column if not exists jeux jsonb not null default '{}'::jsonb;

comment on column public.game_progress.jeux is
  'Niveaux des autres jeux de la catégorie : {"mots-meles": n, "versets": n, "labyrinthe": n, "defi-palier": n, "defi-vues": [..]}';
