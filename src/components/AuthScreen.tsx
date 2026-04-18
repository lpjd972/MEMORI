import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface AuthScreenProps {
  onSuccess: () => void;
}

const AuthScreen = ({ onSuccess }: AuthScreenProps) => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
      else onSuccess();
    } else {
      const { error } = await signUp(email, password, displayName);
      if (error) toast.error(error.message);
      else toast.success("Vérifie ton email pour confirmer ton compte !");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) toast.error("Erreur Google: " + (error as Error).message);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-6">
      <motion.div
        className="text-5xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 5, -5, 0] }}
        transition={{ duration: 0.6 }}
      >
        🧠
      </motion.div>
      <h1 className="text-3xl font-black text-foreground">Memori Ultime</h1>

      <motion.form
        className="w-full max-w-sm bg-card rounded-2xl p-6 shadow-lg space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
      >
        {!isLogin && (
          <input
            type="text"
            placeholder="Pseudo"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-semibold outline-none focus:ring-2 focus:ring-primary"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-semibold outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-semibold outline-none focus:ring-2 focus:ring-primary"
          required
          minLength={6}
        />
        <motion.button
          type="submit"
          className="w-full game-gradient text-primary-foreground font-extrabold py-3 rounded-xl shadow-lg"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? "..." : isLogin ? "Se connecter" : "Créer un compte"}
        </motion.button>

        <div className="relative text-center">
          <span className="text-xs text-muted-foreground bg-card px-2 relative z-10">ou</span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
        </div>

        <motion.button
          type="button"
          onClick={handleGoogle}
          className="w-full bg-muted text-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </motion.button>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "Pas de compte ?" : "Déjà un compte ?"}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-bold ml-1"
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </motion.form>
    </div>
  );
};

export default AuthScreen;
