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
  if (Array.isArray(detail)) return detail.map((e: any) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  return String(detail);
}

export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(apiErr((data as any)?.detail));
  return data;
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
    refresh();
  }, [refresh]);

  return <AuthContext.Provider value={{ user, setUser, refresh }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
