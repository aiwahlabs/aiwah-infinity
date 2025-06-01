import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import { theme as saasTheme } from '@saas-ui/react';

// Design tokens based on the chat theme
const colors = {
  // Primary brand colors - teal/seagreen theme
  brand: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
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
    800: '#262626',
    850: '#1f1f1f',
    900: '#171717',
    925: '#0f0f0f',
    950: '#0a0a0a',
  },
  
  // Semantic colors
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  yellow: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
};

// Component theme overrides
const components = {
  // Global component styles
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'md',
      _focus: {
        boxShadow: 'none',
      },
    },
    variants: {
      solid: {
        _hover: {
          _disabled: {
            bg: 'initial',
          },
        },
      },
      ghost: {
        _hover: {
          bg: 'gray.800',
        },
        _active: {
          bg: 'gray.700',
        },
      },
      outline: {
        borderColor: 'gray.600',
        _hover: {
          bg: 'gray.800',
        },
      },
    },
    defaultProps: {
      colorScheme: 'brand',
    },
  },
  
  Input: {
    variants: {
      outline: {
        field: {
          bg: 'gray.800',
          borderColor: 'gray.600',
          _hover: {
            borderColor: 'gray.500',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
      filled: {
        field: {
          bg: 'gray.800',
          borderColor: 'gray.700',
          _hover: {
            bg: 'gray.750',
          },
          _focus: {
            bg: 'gray.800',
            borderColor: 'brand.500',
          },
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    },
  },
  
  Textarea: {
    variants: {
      outline: {
        bg: 'gray.800',
        borderColor: 'gray.600',
        _hover: {
          borderColor: 'gray.500',
        },
        _focus: {
          borderColor: 'brand.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    },
  },
  
  Select: {
    variants: {
      outline: {
        field: {
          bg: 'gray.800',
          borderColor: 'gray.600',
          _hover: {
            borderColor: 'gray.500',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
          },
        },
      },
    },
    defaultProps: {
      variant: 'outline',
    },
  },
  
  Card: {
    baseStyle: {
      container: {
        bg: 'gray.800',
        borderColor: 'gray.700',
        borderWidth: '1px',
        borderRadius: 'lg',
        color: 'gray.100',
      },
    },
    variants: {
      elevated: {
        container: {
          boxShadow: 'lg',
        },
      },
      outline: {
        container: {
          bg: 'transparent',
          borderColor: 'gray.700',
        },
      },
      glass: {
        container: {
          bg: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  
  Modal: {
    baseStyle: {
      dialog: {
        bg: 'gray.800',
        color: 'gray.100',
      },
      overlay: {
        bg: 'blackAlpha.600',
        backdropFilter: 'blur(4px)',
      },
    },
  },
  
  Popover: {
    baseStyle: {
      content: {
        bg: 'gray.800',
        borderColor: 'gray.700',
        color: 'gray.100',
      },
    },
  },
  
  Menu: {
    baseStyle: {
      list: {
        bg: 'gray.800',
        borderColor: 'gray.700',
      },
      item: {
        bg: 'transparent',
        _hover: {
          bg: 'gray.700',
        },
        _focus: {
          bg: 'gray.700',
        },
      },
    },
  },
  
  Tooltip: {
    baseStyle: {
      bg: 'gray.700',
      color: 'gray.100',
    },
  },
  
  Alert: {
    variants: {
      solid: {
        container: {
          borderRadius: 'md',
        },
      },
      leftAccent: {
        container: {
          bg: 'gray.800',
          borderColor: 'gray.700',
        },
      },
    },
  },
  
  Badge: {
    baseStyle: {
      borderRadius: 'md',
      fontWeight: 'medium',
    },
  },
  
  Spinner: {
    defaultProps: {
      color: 'brand.500',
    },
  },
  
  Divider: {
    baseStyle: {
      borderColor: 'gray.700',
    },
  },
  
  Tabs: {
    variants: {
      line: {
        tab: {
          borderColor: 'transparent',
          _selected: {
            color: 'brand.400',
            borderColor: 'brand.400',
          },
          _hover: {
            color: 'gray.200',
          },
        },
        tabpanel: {
          px: 0,
        },
      },
    },
  },
  
  // Override Chakra's default heading sizes to be much smaller
  Heading: {
    baseStyle: {
      color: 'gray.100',
    },
    sizes: {
      xs: { fontSize: 'xs', lineHeight: '1.4' },     // 11px
      sm: { fontSize: 'sm', lineHeight: '1.4' },     // 12px  
      md: { fontSize: 'md', lineHeight: '1.4' },     // 14px
      lg: { fontSize: 'lg', lineHeight: '1.4' },     // 16px
      xl: { fontSize: 'xl', lineHeight: '1.4' },     // 18px
      '2xl': { fontSize: '2xl', lineHeight: '1.3' }, // 20px
    },
  },
  
  // Override default text sizes
  Text: {
    baseStyle: {
      color: 'gray.300',
      fontSize: 'xs',   // Default to 11px - very small
      lineHeight: '1.5',
    },
  },
};

// Global styles
const styles = {
  global: {
    body: {
      bg: 'gray.900',
      color: 'gray.100',
      fontFamily: 'Inter, system-ui, sans-serif',
      lineHeight: '1.6',
    },
    '*': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'var(--chakra-colors-gray-600) transparent',
    },
    '*::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '*::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '*::-webkit-scrollbar-thumb': {
      background: 'var(--chakra-colors-gray-600)',
      borderRadius: '3px',
    },
    '*::-webkit-scrollbar-thumb:hover': {
      background: 'var(--chakra-colors-gray-500)',
    },
    // Form elements
    'input, textarea, select': {
      colorScheme: 'dark',
    },
  },
};

// Theme config
const config = {
  initialColorMode: 'dark' as const,
  useSystemColorMode: false,
};

// Fonts
const fonts = {
  heading: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
  mono: 'JetBrains Mono, Fira Code, Consolas, monospace',
};

// Typography system with standardized font sizes
const fontSizes = {
  xs: '0.6875rem',  // 11px - very small
  sm: '0.75rem',    // 12px - small text
  md: '0.875rem',   // 14px - base size
  lg: '1rem',       // 16px - slightly larger
  xl: '1.125rem',   // 18px - headings
  '2xl': '1.25rem', // 20px - large headings
  '3xl': '1.5rem',  // 24px - very large
  '4xl': '1.875rem', // 30px
  '5xl': '2.25rem', // 36px
  '6xl': '3rem',    // 48px
};

// Text styles for consistent typography across the app
const textStyles = {
  // Page titles
  'page-title': {
    fontSize: 'lg',      // 16px - much smaller page titles
    fontWeight: 'semibold',
    lineHeight: '1.4',
    color: 'gray.100',
  },
  // Section headings
  'section-heading': {
    fontSize: 'md',      // 14px - small section headings
    fontWeight: 'medium',
    lineHeight: '1.4',
    color: 'gray.100',
  },
  // Card titles
  'card-title': {
    fontSize: 'sm',      // 12px - very small card titles
    fontWeight: 'medium',
    lineHeight: '1.4',
    color: 'gray.100',
  },
  // Body text
  'body': {
    fontSize: 'xs',      // 11px - very small body text
    fontWeight: 'normal',
    lineHeight: '1.5',
    color: 'gray.300',
  },
  // Small text
  'caption': {
    fontSize: '0.625rem', // 10px - tiny text
    fontWeight: 'normal',
    lineHeight: '1.4',
    color: 'gray.400',
  },
  // Button text
  'button': {
    fontSize: 'xs',      // 11px - small button text
    fontWeight: 'medium',
    lineHeight: '1.4',
  },
};

// Create the custom theme
export const theme = extendTheme(
  {
    config,
    colors,
    components,
    styles,
    fonts,
    fontSizes,
    textStyles,
    // Use Saas UI shadows and other tokens
    shadows: saasTheme.shadows,
    radii: saasTheme.radii,
    space: saasTheme.space,
    sizes: saasTheme.sizes,
    breakpoints: saasTheme.breakpoints,
  },
  // Apply brand color scheme to most components by default
  withDefaultColorScheme({
    colorScheme: 'brand',
    components: ['Button', 'Badge', 'Checkbox', 'Switch', 'Progress'],
  }),
  // Merge with Saas UI theme
  saasTheme
); 