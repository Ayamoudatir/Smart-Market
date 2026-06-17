"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroPanel from "@/components/auth/HeroPanel";
import InputField from "@/components/auth/InputField";
import { loginUser, resetPassword } from "@/lib/auth";
import { getUser } from "@/lib/firestore";

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  preparateur: "/preparateur/dashboard",
  livreur: "/livreur/dashboard",
  client: "/catalogue",
};

const LOGIN_FEATURES = [
  "Fruits & légumes du jour",
  "Livraison dans votre quartier",
  "Paiement à la livraison",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      const profile = await getUser(user.uid);
      const role = profile?.role ?? "client";
      document.cookie = `userRole=${role}; path=/; max-age=86400`;
      router.push(ROLE_HOME[role] ?? "/catalogue");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (!email) {
      setError("Entrez votre email pour réinitialiser le mot de passe.");
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      setError("");
    } catch {
      setError("Impossible d'envoyer le lien de réinitialisation.");
    }
  }

  return (
    <>
      <HeroPanel
        title="Votre hanout de quartier, livré en 30 min."
        subtitle="Des produits frais du souk, choisis chaque matin et livrés directement chez vous."
        features={LOGIN_FEATURES}
      />

      <div className="flex-1 bg-[#f5f4ef] flex items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bon retour</h2>
            <p className="text-sm text-gray-500 mt-1">Connectez-vous pour faire vos courses.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <InputField
                type="email"
                placeholder="vous@exemple.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<MailIcon />}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Mot de passe</label>
              <InputField
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<LockIcon />}
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={handleReset}
                className="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {resetSent && (
              <p className="text-sm text-green-600">Lien de réinitialisation envoyé !</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div className="flex items-center gap-3 text-gray-400 text-xs">
            <div className="flex-1 h-px bg-gray-300" />
            nouveau ici ?
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <Link
            href="/register"
            className="block w-full border border-gray-800 text-gray-800 font-semibold py-3 rounded-xl text-center hover:bg-gray-100 transition"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
