import { useTheme as useChakraTheme } from '@chakra-ui/react';
import { colors } from './colors';

// Hook to access theme values
export function useTheme() {
  const theme = useChakraTheme();
  
  return {
    theme,
    colors,
    // Helper functions for common color needs
    getBrandColor: (shade: keyof typeof colors.brand = 500) => colors.brand[shade],
    getGrayColor: (shade: keyof typeof colors.gray = 500) => colors.gray[shade],
    getSemanticColor: (type: keyof typeof colors, shade: number = 500) => {
      const colorSet = colors[type];
      if (typeof colorSet === 'object' && colorSet && shade in colorSet) {
        return (colorSet as Record<number, string>)[shade];
      }
      return colors.gray[500]; // fallback
    },
  };
}

// Utility to get CSS variable name for a color
export function getCSSVar(colorPath: string): string {
  return `var(--chakra-colors-${colorPath.replace('.', '-')})`;
}

// Color mode utilities (though we're locked to dark mode)
export const colorModeValues = {
  light: {
    bg: colors.gray[50],
    color: colors.gray[900],
  },
  dark: {
    bg: colors.gray[900],
    color: colors.gray[100],
  },
};

// Common color combinations for consistency
export const colorCombinations = {
  // Background combinations
  primary: {
    bg: colors.brand[500],
    color: 'white',
    hover: colors.brand[600],
    active: colors.brand[700],
  },
  secondary: {
    bg: colors.gray[800],
    color: colors.gray[100],
    hover: colors.gray[700],
    active: colors.gray[600],
  },
  success: {
    bg: colors.success[500],
    color: 'white',
    hover: colors.success[600],
    active: colors.success[700],
  },
  warning: {
    bg: colors.warning[500],
    color: 'white',
    hover: colors.warning[600],
    active: colors.warning[700],
  },
  error: {
    bg: colors.error[500],
    color: 'white',
    hover: colors.error[600],
    active: colors.error[700],
  },
  
  // Surface combinations
  surface: {
    primary: {
      bg: colors.gray[800],
      border: colors.gray[700],
      color: colors.gray[100],
    },
    secondary: {
      bg: colors.gray[850],
      border: colors.gray[700],
      color: colors.gray[200],
    },
    elevated: {
      bg: colors.gray[700],
      border: colors.gray[600],
      color: colors.gray[50],
    },
  },
  
  // Text combinations
  text: {
    primary: colors.gray[100],
    secondary: colors.gray[300],
    muted: colors.gray[500],
    inverse: colors.gray[900],
  },
} as const;

// Helper to create consistent focus styles
export function getFocusStyles(color: string = colors.brand[500]) {
  return {
    borderColor: color,
    boxShadow: `0 0 0 1px ${color}`,
  };
}

// Helper to create consistent hover styles
export function getHoverStyles(baseColor: string, intensity: 'light' | 'medium' | 'strong' = 'medium') {
  const alpha = intensity === 'light' ? '0.05' : intensity === 'medium' ? '0.1' : '0.15';
  return {
    bg: `rgba(255, 255, 255, ${alpha})`,
  };
} 