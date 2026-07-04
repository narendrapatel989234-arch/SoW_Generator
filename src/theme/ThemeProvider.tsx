import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { type ThemeSettings, type PrimaryColor, type FontFamily, defaultTheme, deriveThemeVars } from './themeConfig';

const THEME_KEY = 'm42.theme.settings';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // ignore JSON parse errors
      }
    }
    return defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
    const vars = deriveThemeVars(theme);
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [theme]);

  const setPrimaryColor = (color: PrimaryColor) => {
    setTheme(prev => ({ ...prev, primaryColor: color }));
  };

  const setFontFamily = (font: FontFamily) => {
    setTheme(prev => ({ ...prev, fontFamily: font }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    // Let it naturally update CSS variables on next render via useEffect
  };

  return (
    <ThemeContext.Provider value={{ theme, setPrimaryColor, setFontFamily, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
