export type PrimaryColor = 'ocean' | 'teal' | 'indigo' | 'violet' | 'emerald' | 'rose' | 'amber' | 'slate' | 'm42';
export type FontFamily = 'Inter' | 'Verdana' | 'Trebuchet' | 'Georgia' | 'Monospace' | 'Poppins' | 'Calibri';

export interface ThemeSettings {
  primaryColor: PrimaryColor;
  fontFamily: FontFamily;
}

export const defaultTheme: ThemeSettings = {
  primaryColor: 'm42',
  fontFamily: 'Poppins'
};

const colorMap: Record<PrimaryColor, { base: string, strong: string, soft: string, focus: string }> = {
  'm42': { base: '#0d212c', strong: '#08171F', soft: '#D9E6EB', focus: '#36c0c9' },
  'ocean': { base: '#0f4c81', strong: '#0a355a', soft: '#cfdce7', focus: '#3da9fc' },
  'teal': { base: '#0ea5a3', strong: '#0a7372', soft: '#cfecea', focus: '#2cb1b0' },
  'indigo': { base: '#4f46e5', strong: '#3731a0', soft: '#dcdbfa', focus: '#818cf8' },
  'violet': { base: '#7c3aed', strong: '#5729a6', soft: '#e5d8fb', focus: '#a78bfa' },
  'emerald': { base: '#059669', strong: '#036949', soft: '#cdf0e4', focus: '#34d399' },
  'rose': { base: '#e11d48', strong: '#9d1432', soft: '#f9d2da', focus: '#fb7185' },
  'amber': { base: '#d97706', strong: '#985304', soft: '#f8e4cc', focus: '#fbbf24' },
  'slate': { base: '#334155', strong: '#242d3b', soft: '#d6d9de', focus: '#94a3b8' },
};

export function deriveThemeVars(theme: ThemeSettings): Record<string, string> {
  const colors = colorMap[theme.primaryColor] || colorMap['m42'];
  return {
    '--app-color-primary': colors.base,
    '--app-color-primary-strong': colors.strong,
    '--app-color-primary-soft': colors.soft,
    '--app-color-focus': colors.focus,
    '--app-font-family': `"${theme.fontFamily}", "Calibri", system-ui, sans-serif`
  };
}
