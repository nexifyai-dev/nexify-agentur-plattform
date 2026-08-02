"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { API_BASE } from "@/lib/company";

export type User = { id: string; email: string; name: string; company: string | null; phone: string | null; language: string; role: string };

const AuthContext = createContext<{ user: User | null | false; setUser: (u: User | null | false) => void; refresh: () => Promise<void> }>({
  user: null,
  setUser: () => {},
  refresh: async () => {},
});

export function apiErr(detail: unknown): string {
  if (detail == null) return "Etwas ist schiefgelaufen. Bitte erneut versuchen.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e: unknown) => (e && typeof e === "object" && "msg" in e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  return String(detail);
}

export const API_FALLBACK = "https://admin.nexifyai.cloud"; // legacy reference only — not used for credentialed auth

// API JSON responses are untyped; callers pass T when they need a concrete shape.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic default for untyped JSON payloads
export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  // Same-origin first (local app/api handlers + catch-all proxy).
  // Do NOT rely on cross-origin API_FALLBACK for credentialed auth — cookies
  // would not stick on www.nexifyai.cloud, and admin DNS may be unresolved.
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const raw = await res.text();
  let data: { detail?: unknown; message?: string } & Record<string, unknown> = {};
  try {
    data = raw ? (JSON.parse(raw) as { detail?: unknown; message?: string } & Record<string, unknown>) : {};
  } catch {
    data = {};
  }

  if (!res.ok) {
    // Vercel HTML 502 (DNS_HOSTNAME_EMPTY) previously surfaced as a useless generic error
    if (res.status === 502 || /DNS_HOSTNAME_EMPTY/i.test(raw)) {
      throw new Error(
        "Anmeldung derzeit nicht möglich: API-Backend nicht erreichbar. Bitte später erneut versuchen oder mail@nexifyai.cloud kontaktieren.",
      );
    }
    if (res.status === 503) {
      throw new Error(apiErr(data.detail) || "API-Backend ist nicht konfiguriert.");
    }
    throw new Error(apiErr(data.detail ?? data.message));
  }
  return data as T;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | false>(null);

  const refresh = useCallback(async () => {
    try {
      const me = await api("/api/auth/me");
      setUser(me);
    } catch {
      try {
        const me = await api("/api/auth/refresh", { method: "POST" });
        setUser(me);
      } catch {
        setUser(false);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate auth state on provider mount
    void refresh();
  }, [refresh]);

  return <AuthContext.Provider value={{ user, setUser, refresh }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
