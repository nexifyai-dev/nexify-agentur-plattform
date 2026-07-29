/**
 * NeXify Design System v2.0 — ThemeProvider
 *
 * Canonical SoT: /workspace/DESIGN_SYSTEM_V2.md
 * Preset:        /workspace/tw-nexify-preset.js
 * Decision:      /opt/nexifyai/docs/decisions/DECISION-2026-07-25-DESIGN-SYSTEM-V2-SOT.md
 *
 * - Sets data-skin="nexify" and toggles .dark on <html>
 * - Persists preference in localStorage
 * - Falls back to prefers-color-scheme: dark
 *
 * Docs/token stub — not a live Hermes WebUI patch.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'nexify-theme';
const SKIN = 'nexify';

const ThemeContext = createContext({
  theme: 'dark',
  skin: SKIN,
  setTheme: () => {},
  toggleTheme: () => {},
  setSkin: () => {},
});

function getSystemTheme() {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyDomTheme(theme, skin = SKIN) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-skin', skin);
  root.classList.toggle('dark', theme === 'dark');
}

export function ThemeProvider({ children, defaultTheme = 'dark', defaultSkin = SKIN }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return localStorage.getItem(STORAGE_KEY) || defaultTheme || getSystemTheme();
  });
  const [skin, setSkinState] = useState(defaultSkin);

  useEffect(() => {
    applyDomTheme(theme, skin);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
      /* ignore */
    }
  }, [theme, skin]);

  const setTheme = useCallback((next) => {
    setThemeState(next === 'light' ? 'light' : 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const setSkin = useCallback((next) => {
    setSkinState(next || SKIN);
  }, []);

  const value = useMemo(
    () => ({ theme, skin, setTheme, toggleTheme, setSkin }),
    [theme, skin, setTheme, toggleTheme, setSkin]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeProvider;
