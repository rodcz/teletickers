// theme.ts — Tokens de diseño global de TeleTickers Mobile
// Paleta coherente con el frontend web (verde #16a34a, fondos oscuros)

export const colors = {
  // Brand
  primary: '#16a34a',       // green-600 web
  primaryDark: '#15803d',   // green-700
  primaryLight: '#22c55e',  // green-500
  primaryMuted: '#bbf7d0',  // green-200

  // Secondaries / Accents
  indigo: '#4f46e5',
  indigoDark: '#4338ca',

  // Backgrounds
  background: '#0f172a',    // slate-900
  surface: '#1e293b',       // slate-800
  surfaceElevated: '#334155', // slate-700
  card: '#1e293b',

  // Text
  textPrimary: '#f8fafc',   // slate-50
  textSecondary: '#94a3b8', // slate-400
  textMuted: '#64748b',     // slate-500

  // Borders
  border: '#334155',        // slate-700
  borderLight: '#475569',   // slate-600

  // Status
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',

  // Toast backgrounds
  toastSuccess: '#16a34a',
  toastError: '#dc2626',
  toastInfo: '#2563eb',

  // Misc
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.7)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 36,

  // Font weights (as string for React Native)
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
} as const;

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
} as const;

export type Theme = typeof theme;
export default theme;
