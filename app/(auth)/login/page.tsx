"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginUser, resetPassword, registerUser } from "@/lib/auth";
import { getUser } from "@/lib/firestore";

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  preparateur: "/preparateur/dashboard",
  livreur: "/livreur/dashboard",
  client: "/",
};

export default function LoginPage() {
  return <Suspense><AuthCard /></Suspense>
}

function AuthCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // Register state
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "", password: "", confirm: "" });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  function setField(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [field]: e.target.value }));
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await loginUser(email, password);
      const profile = await getUser(user.uid);
      const role = profile?.role ?? "client";
      document.cookie = `userRole=${role}; path=/; max-age=86400`;
      window.location.href = redirect ?? ROLE_HOME[role] ?? "/";
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally { setLoading(false); }
  }

  async function handleReset() {
    if (!email) { setError("Entrez votre email pour réinitialiser."); return; }
    try { await resetPassword(email); setResetSent(true); setError(""); }
    catch { setError("Impossible d'envoyer le lien."); }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    if (form.password !== form.confirm) { setRegError("Les mots de passe ne correspondent pas."); return; }
    setRegLoading(true);
    try {
      await registerUser({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, phone: form.phone, address: form.address });
      window.location.href = redirect ?? "/";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      setRegError(msg.includes("email-already-in-use") ? "Cet email est déjà utilisé." : "Une erreur est survenue.");
    } finally { setRegLoading(false); }
  }

  return (
    <div className="relative z-10 w-full max-w-md">
      {/* Carte */}
      <div className="bg-white/15 backdrop-blur-2xl border border-white/25 rounded-[2rem] overflow-hidden shadow-2xl">

        {/* Onglets */}
        <div className="flex border-b border-white/20">
          <button onClick={() => setTab('login')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${tab === 'login' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}>
            Se connecter
          </button>
          <button onClick={() => setTab('register')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${tab === 'register' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}>
            S'inscrire
          </button>
        </div>

        <div className="p-8 bg-transparent">
          {tab === 'login' ? (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-2 mb-2">
                <Image src="/assets/kenzi_logo.png" alt="Kenzi Market" width={80} height={80} className="object-contain drop-shadow-xl" />
                <h2 className="text-xl font-black text-white">Bon retour !</h2>
                <p className="text-sm text-white/50">Connectez-vous pour continuer</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="vous@exemple.ma"
                    className="mt-1.5 w-full bg-white/15 border border-white/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/60 focus:bg-white/20 transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Mot de passe</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    className="mt-1.5 w-full bg-white/15 border border-white/25 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/60 focus:bg-white/20 transition" />
                </div>

                <div className="text-right">
                  <button type="button" onClick={handleReset} className="text-xs text-[#f5c842] font-semibold hover:underline">
                    Mot de passe oublié ?
                  </button>
                </div>

                {resetSent && <p className="text-xs text-green-300 bg-white/10 rounded-xl px-3 py-2">Lien envoyé à {email}</p>}
                {error && <p className="text-xs text-red-300 bg-white/10 rounded-xl px-3 py-2">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full bg-[#1a5c2a] hover:bg-green-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm">
                  {loading ? "Connexion…" : "Se connecter"}
                </button>
              </form>

              <p className="text-center text-xs text-white/50">
                Pas encore de compte ?{" "}
                <button onClick={() => setTab('register')} className="text-[#1a5c2a] font-semibold hover:underline">S'inscrire</button>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-2 mb-2">
                <Image src="/assets/kenzi_logo.png" alt="Kenzi Market" width={80} height={80} className="object-contain drop-shadow-xl" />
                <h2 className="text-xl font-black text-white">Créer un compte !</h2>
                <p className="text-sm text-white/50">Quelques infos et c'est parti</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Prénom</label>
                    <input value={form.firstName} onChange={setField("firstName")} required placeholder="Karim"
                      className="mt-1.5 w-full bg-white/15 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/60 focus:bg-white/20 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Nom</label>
                    <input value={form.lastName} onChange={setField("lastName")} required placeholder="El Idrissi"
                      className="mt-1.5 w-full bg-white/15 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/60 focus:bg-white/20 transition" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Email</label>
                  <input type="email" value={form.email} onChange={setField("email")} required placeholder="vous@exemple.ma"
                    className="mt-1.5 w-full bg-white/15 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/60 focus:bg-white/20 transition" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Téléphone</label>
                    <input type="tel" value={form.phone} onChange={setField("phone")} placeholder="+212 6..."
                      className="mt-1.5 w-full bg-white/15 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/60 focus:bg-white/20 transition" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Mot de passe</label>
                    <input type="password" value={form.password} onChange={setField("password")} required minLength={6} placeholder="••••••••"
                      className="mt-1.5 w-full bg-white/15 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/60 focus:bg-white/20 transition" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">Confirmer le mot de passe</label>
                  <input type="password" value={form.confirm} onChange={setField("confirm")} required placeholder="••••••••"
                    className="mt-1.5 w-full bg-white/15 border border-white/25 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/60 focus:bg-white/20 transition" />
                </div>

                {regError && <p className="text-xs text-red-300 bg-white/10 rounded-xl px-3 py-2">{regError}</p>}

                <button type="submit" disabled={regLoading}
                  className="w-full bg-[#1a5c2a] hover:bg-green-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm">
                  {regLoading ? "Création…" : "Créer mon compte"}
                </button>
              </form>

              <p className="text-center text-xs text-white/50">
                Déjà inscrit ?{" "}
                <button onClick={() => setTab('login')} className="text-[#1a5c2a] font-semibold hover:underline">Se connecter</button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
