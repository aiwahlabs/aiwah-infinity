// Color palette for the application
// Based on the chat theme and Saas UI recommendations

export const colors = {
  // Primary brand colors - teal/seagreen theme
  brand: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Primary brand color
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },
  
  // Enhanced gray scale with better contrast
  gray: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626', // Main background
    850: '#1f1f1f',
    900: '#171717', // App background
    925: '#0f0f0f',
    950: '#0a0a0a',
  },
  
  // Semantic colors
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  
  info: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
} as const;

// Convenient color aliases
export const brandColors = colors.brand;
export const grayColors = colors.gray;
export const semanticColors = {
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  info: colors.info,
} as const;

// CSS custom properties for easy access
export const cssVars = {
  '--brand-50': colors.brand[50],
  '--brand-100': colors.brand[100],
  '--brand-200': colors.brand[200],
  '--brand-300': colors.brand[300],
  '--brand-400': colors.brand[400],
  '--brand-500': colors.brand[500],
  '--brand-600': colors.brand[600],
  '--brand-700': colors.brand[700],
  '--brand-800': colors.brand[800],
  '--brand-900': colors.brand[900],
  '--brand-950': colors.brand[950],
  
  '--gray-0': colors.gray[0],
  '--gray-50': colors.gray[50],
  '--gray-100': colors.gray[100],
  '--gray-200': colors.gray[200],
  '--gray-300': colors.gray[300],
  '--gray-400': colors.gray[400],
  '--gray-500': colors.gray[500],
  '--gray-600': colors.gray[600],
  '--gray-700': colors.gray[700],
  '--gray-800': colors.gray[800],
  '--gray-850': colors.gray[850],
  '--gray-900': colors.gray[900],
  '--gray-925': colors.gray[925],
  '--gray-950': colors.gray[950],
} as const; 