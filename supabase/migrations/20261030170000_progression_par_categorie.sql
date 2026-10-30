-- 30/10/2026 (demande de JD) : un même compte peut servir à toute la famille. Chaque catégorie d'âge
-- (petits, enfants, grands) a sa propre progression et ses propres scores.
ALTER TABLE public.game_progress
  ADD COLUMN mode TEXT NOT NULL DEFAULT 'enfants' CHECK (mode IN ('petits', 'enfants', 'grands'));
ALTER TABLE public.game_progress DROP CONSTRAINT game_progress_pkey;
ALTER TABLE public.game_progress ADD PRIMARY KEY (user_id, mode);

ALTER TABLE public.game_scores
  ADD COLUMN mode TEXT NOT NULL DEFAULT 'enfants' CHECK (mode IN ('petits', 'enfants', 'grands'));
CREATE INDEX IF NOT EXISTS game_scores_mode_score_idx ON public.game_scores (mode, score DESC);
