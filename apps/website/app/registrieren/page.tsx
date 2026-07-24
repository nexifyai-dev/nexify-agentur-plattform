"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LogoMark } from "@/components/logo";
import { api, useAuth } from "@/lib/auth";
import { useLang } from "@/lib/lang-context";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useAuth();
  const { lang } = useLang();
  const nl = lang === "nl";
  const token = params.get("token");
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [invited, setInvited] = useState(false);

  useEffect(() => {
    if (!token) return;
    api(`/api/auth/invite/${token}`)
      .then((d) => {
        setForm((f) => ({ ...f, email: d.email }));
        setInvited(true);
      })
      .catch(() => {});
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...form, company: form.company || null, language: lang, invite_token: token }),
      });
      setUser(user);
      router.push("/konto");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  return (
    <div className="glass w-full max-w-md p-8 md:p-10">
      <div className="mx-auto w-fit"><LogoMark size={48} /></div>
      <h1 className="mt-6 text-center font-[family-name:var(--font-heading)] text-2xl font-medium text-white">
        {nl ? "Klantaccount aanmaken" : "Kundenkonto anlegen"}
      </h1>
      {invited && (
        <p className="mt-2 text-center text-sm text-emerald-400" data-testid="register-invite-note">
          {nl ? "Uitnodiging herkend – uw offerte wacht in het portaal." : "Einladung erkannt – Ihr Angebot wartet im Portal."}
        </p>
      )}
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input className="field" required placeholder={nl ? "Naam" : "Name"} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} data-testid="register-name-input" />
        <input className="field" type="email" required placeholder="E-Mail" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} data-testid="register-email-input" />
        <input className="field" placeholder={nl ? "Bedrijf (optioneel)" : "Firma (optional)"} value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} data-testid="register-company-input" />
        <input className="field" type="password" required minLength={8} placeholder={nl ? "Wachtwoord (min. 8 tekens)" : "Passwort (min. 8 Zeichen)"} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} data-testid="register-password-input" />
        {error && <p className="text-sm text-red-400" data-testid="register-error">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading} data-testid="register-submit-btn">
          {loading ? "…" : nl ? "Account aanmaken" : "Konto erstellen"}
        </button>
        <p className="text-center text-[11px] leading-relaxed text-zinc-600">
          {nl ? "Met het aanmaken van een account accepteert u onze " : "Mit der Registrierung akzeptieren Sie unsere "}
          <Link href="/agb" className="underline hover:text-zinc-300">{nl ? "algemene voorwaarden" : "AGB"}</Link>
          {nl ? " en nam u kennis van de " : " und nehmen die "}
          <Link href="/datenschutz" className="underline hover:text-zinc-300">{nl ? "privacyverklaring" : "Datenschutzerklärung"}</Link>
          {nl ? "." : " zur Kenntnis."}
        </p>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-500">
        {nl ? "Al een account?" : "Bereits ein Konto?"}{" "}
        <Link href="/login" className="text-white underline underline-offset-4">
          {nl ? "Inloggen" : "Anmelden"}
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-24" data-testid="register-page">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
