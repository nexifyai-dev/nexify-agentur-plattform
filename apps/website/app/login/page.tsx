"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/logo";
import { api, useAuth } from "@/lib/auth";
import { useLang } from "@/lib/lang-context";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { lang } = useLang();
  const nl = lang === "nl";
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await api("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      setUser(user);
      if (user.role === "admin") {
        try {
          const { url } = await api("/api/admin/webui-sso");
          window.location.href = url;
          return;
        } catch {
          router.push("/admin");
        }
      } else {
        router.push("/konto");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 pt-24" data-testid="login-page">
      <div className="glass w-full max-w-md p-8 md:p-10">
        <div className="mx-auto w-fit"><LogoMark size={48} /></div>
        <h1 className="mt-6 text-center font-[family-name:var(--font-heading)] text-2xl font-medium text-white">
          {nl ? "Inloggen" : "Anmelden"}
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">
          {nl ? "Klantportaal & beheer" : "Kundenportal & Verwaltung"}
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input className="field" type="email" required placeholder="E-Mail" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} data-testid="login-email-input" />
          <input className="field" type="password" required placeholder={nl ? "Wachtwoord" : "Passwort"} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} data-testid="login-password-input" />
          {error && <p className="text-sm text-red-400" data-testid="login-error">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading} data-testid="login-submit-btn">
            {loading ? "…" : nl ? "Inloggen" : "Anmelden"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          {nl ? "Nog geen account?" : "Noch kein Konto?"}{" "}
          <Link href="/registrieren" className="text-white underline underline-offset-4" data-testid="login-register-link">
            {nl ? "Registreren" : "Registrieren"}
          </Link>
        </p>
      </div>
    </main>
  );
}
