"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroPanel from "@/components/auth/HeroPanel";
import InputField from "@/components/auth/InputField";
import { registerUser } from "@/lib/auth";

const REGISTER_FEATURES = [
  "Inscription gratuite",
  "Suivi de commande en direct",
  "Fruits & légumes du jour",
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      await registerUser({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
      });
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("email-already-in-use")) {
        setError("Cet email est déjà utilisé.");
      } else {
        setError("Une erreur est survenue. Réessayez.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <HeroPanel
        title="Rejoignez le quartier."
        subtitle="Créez votre compte et faites-vous livrer vos produits frais en quelques minutes."
        features={REGISTER_FEATURES}
      />

      <div className="flex-1 bg-[#f5f4ef] flex items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-lg space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Créer un compte</h2>
            <p className="text-sm text-gray-500 mt-1">Quelques infos et c&apos;est parti.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Prénom</label>
                <InputField placeholder="Karim" value={form.firstName} onChange={set("firstName")} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nom</label>
                <InputField placeholder="El Idrissi" value={form.lastName} onChange={set("lastName")} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <InputField
                  type="email"
                  placeholder="karim@exemple.ma"
                  value={form.email}
                  onChange={set("email")}
                  required
                  icon={<MailIcon />}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Téléphone</label>
                <InputField
                  type="tel"
                  placeholder="+212 6 12 34 56 78"
                  value={form.phone}
                  onChange={set("phone")}
                  icon={<PhoneIcon />}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Adresse du quartier</label>
              <InputField
                placeholder="Derb El Hajja, Quartier Habous, Casablanca"
                value={form.address}
                onChange={set("address")}
                icon={<LocationIcon />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <InputField
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set("password")}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                <InputField
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={set("confirm")}
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Création…" : "Créer mon compte"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Déjà inscrit ?{" "}
            <Link href="/login" className="text-green-600 font-semibold hover:text-green-700">
              Se connecter
            </Link>
          </p>
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

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12 19.79 19.79 0 0 1 1 3.18 2 2 0 0 1 2.99 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
