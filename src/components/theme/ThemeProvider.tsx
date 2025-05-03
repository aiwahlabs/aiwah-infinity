'use client';

import React, { ReactNode, useEffect } from 'react';
import { SaasProvider, theme as saasTheme } from '@saas-ui/react';
import { 
  extendTheme, 
  ColorModeScript, 
  ChakraProvider, 
  useColorMode,
  ThemeConfig
} from '@chakra-ui/react';

// Create config to force dark mode
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

// Create theme with dark mode as default
const theme = extendTheme({
  ...saasTheme,
  config,
  colors: {
    ...saasTheme.colors,
    // Add more custom dark mode colors if needed
  },
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white',
      },
      // Dark mode for all components
      '.chakra-ui': {
        colorScheme: 'dark',
      }
    },
  },
  components: {
    ...saasTheme.components,
    // Override specific component themes as needed
    Button: {
      defaultProps: {
        colorScheme: 'blue',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'gray.800',
          color: 'white',
        }
      }
    }
  }
});

// Force dark mode
function ForceDarkMode({ children }: { children: ReactNode }) {
  const { setColorMode } = useColorMode();
  
  useEffect(() => {
    setColorMode('dark');
    // Don't manipulate DOM directly to avoid hydration mismatches
  }, [setColorMode]);
  
  return <>{children}</>;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme} resetCSS>
        <ForceDarkMode>
          <SaasProvider theme={theme}>
            {children}
          </SaasProvider>
        </ForceDarkMode>
      </ChakraProvider>
    </>
  );
} 