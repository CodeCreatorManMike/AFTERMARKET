import React, { createContext, useContext, useMemo, useState } from 'react';
import { Palette, palettes } from './palettes';

interface ThemeContextValue {
  colors: Palette;
  scheme: 'light' | 'dark';
  toggle: () => void;
  setScheme: (scheme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Night (dark) is Aftermarket's standard mode — the brand lives on Ink.
  // Day mode is an explicit opt-in via the toggle, not inferred from system appearance.
  const [scheme, setScheme] = useState<'light' | 'dark'>('dark');

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: palettes[scheme],
      scheme,
      toggle: () => setScheme((s) => (s === 'dark' ? 'light' : 'dark')),
      setScheme,
    }),
    [scheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
