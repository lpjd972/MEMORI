-- 30/10/2026 : Memory Bible quitte le Supabase de Lovable pour le projet Supabase de JD
-- (organisation « memori »). Le schéma de 20260219180443 y a été recréé tel quel, avec :
-- - 100 vies par défaut (comme dans le jeu) au lieu de 50 ;
-- - le lien game_scores → profiles, dont le classement a besoin pour afficher les noms ;
-- - handle_new_user non appelable depuis l'API.
ALTER TABLE public.game_progress ALTER COLUMN lives SET DEFAULT 100;

ALTER TABLE public.game_scores
  ADD CONSTRAINT game_scores_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS game_scores_score_idx ON public.game_scores (score DESC);
CREATE INDEX IF NOT EXISTS game_scores_user_id_idx ON public.game_scores (user_id);

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
