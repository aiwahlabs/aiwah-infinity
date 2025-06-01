// Theme exports for easy access throughout the app

export { theme } from './theme';
export { ThemeProvider } from './ThemeProvider';
export { colors, brandColors, grayColors, semanticColors, cssVars } from './colors';
export { 
  useTheme, 
  getCSSVar, 
  colorModeValues, 
  colorCombinations, 
  getFocusStyles, 
  getHoverStyles 
} from './utils';

// Type exports for TypeScript users
export type { ThemeConfig } from '@chakra-ui/react'; 