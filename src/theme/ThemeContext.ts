import { createContext, useContext } from 'react';
import { type ThemeSettings, type PrimaryColor, type FontFamily, defaultTheme } from './themeConfig';

interface ThemeContextType {
  theme: ThemeSettings;
  setPrimaryColor: (color: PrimaryColor) => void;
  setFontFamily: (font: FontFamily) => void;
  resetTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setPrimaryColor: () => {},
  setFontFamily: () => {},
  resetTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);
