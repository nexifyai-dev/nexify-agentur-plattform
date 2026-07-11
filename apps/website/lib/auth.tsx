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

export const API_FALLBACK = "https://admin.nexifyai.cloud";  // fallback when same-origin rewrite is not deployed

export async function api(path: string, options: RequestInit = {}) {
  // Try same-origin first (works when BACKEND_ORIGIN rewrite is active)
  let res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  // If same-origin fails and we have a fallback, try the admin domain
  if (!res.ok && API_FALLBACK && !API_BASE) {
    try {
      const fallbackRes = await fetch(`${API_FALLBACK}${path}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
      });
      if (fallbackRes.ok) {
        res = fallbackRes;
      }
    } catch {
      // fallback failed, use original response
    }
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(apiErr((data as { detail?: unknown })?.detail));
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
